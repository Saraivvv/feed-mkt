import nodemailer from "nodemailer";
import { enviarParaCRM } from "./_crm.js";

// Peca 3 do funil: pedido de conversa (agendamento) vindo de /agendar.
// Quem chega aqui ja leu o "Diagnostico do Gargalo" e quer marcar uma reuniao
// de 30 min. Recebe { nome, email, empresa, cargo, motivo } e faz:
//   a) manda pra FEED um e-mail de LEAD QUENTE com todos os campos;
//   b) se houver N8N_WEBHOOK_URL, faz POST JSON do payload pra ela cadastrar no
//      CRM (best-effort: falhou ou nao existe -> so console.error, nao derruba).
// Roda como Serverless Function na Vercel (mesmo dominio, sem CORS).
// Mesmo padrao/envs de api/diagnostico.js: SMTP_USER, SMTP_APP_PASSWORD, LEAD_TO.
// Env nova (opcional): N8N_WEBHOOK_URL.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Origem fixa deste form dentro do funil (pra CRM e leitura interna).
const ORIGEM = "Diagnostico do Gargalo";

// ---- Rate limit BEST-EFFORT em memoria ----
// ATENCAO: isso vive so na memoria da instancia da function. Reseta a cada cold
// start e nao e compartilhado entre instancias concorrentes. Serve como freio de
// mao pra abuso casual; pra rate limit real (persistente, distribuido) o certo e
// Vercel KV / Upstash Redis. Nao dependa disto como unica linha de defesa.
const RATE_WINDOW_MS = 10 * 60 * 1000; // 10 min
// B2B costuma vir de escritorio atras de NAT (varios humanos, um IP so). 3 era
// agressivo demais e barrava time legitimo. O freio apertado fica no e-mail.
const MAX_PER_IP = 15; // 15 envios por IP na janela
const MAX_PER_EMAIL = 1; // 1 envio por email na janela (limite mais apertado)
const rateByIp = new Map();
const rateByEmail = new Map();

// ---- Reserva in-flight: o "limiter em duas fases" de verdade ----
// O peek read-only sozinho nao segura flood CONCORRENTE. Entre o peek e o commit
// existe o await do envio, entao duas requests paralelas com o MESMO e-mail passam
// as duas no peek antes de qualquer slot ser gravado, as duas mandam, e so depois
// gravam. Pra fechar isso a gente guarda uma RESERVA in-flight por chave (contador
// de requests em voo), separada dos slots commitados, e conta reserva + commit no
// limite. A 2a request paralela ve a reserva da 1a e ja toma 429.
// Honestidade: esses mapas vivem na memoria da instancia serverless, entao a
// reserva fecha o flood concorrente DENTRO da mesma instancia (que e exatamente o
// caso apontado). Entre instancias distintas continua best-effort, igual ao resto
// do limiter. Cross-instancia so com Vercel KV / Upstash Redis, fica pra depois.
const inflightByIp = new Map();
const inflightByEmail = new Map();

function reserve(map, key) {
  if (!key) return;
  map.set(key, (map.get(key) || 0) + 1);
}

function release(map, key) {
  if (!key) return;
  const n = (map.get(key) || 0) - 1;
  if (n > 0) map.set(key, n);
  else map.delete(key);
}

// Rate limit em DUAS FASES pra nao queimar slot num envio que falhou:
//   ratePeek  -> checagem read-only ("esse IP/email ja estourou?"), poda a janela e
//                conta COMMITADOS + RESERVAS in-flight contra o limite.
//   rateCommit-> grava o timestamp, chamado SO depois do envio principal dar certo.
function ratePeek(map, inflightMap, key, max) {
  if (!key) return true;
  const now = Date.now();
  const hits = (map.get(key) || []).filter((t) => now - t < RATE_WINDOW_MS);
  map.set(key, hits);
  return hits.length + (inflightMap.get(key) || 0) < max;
}

function rateCommit(map, key) {
  if (!key) return;
  const now = Date.now();
  const hits = (map.get(key) || []).filter((t) => now - t < RATE_WINDOW_MS);
  hits.push(now);
  map.set(key, hits);
}

function getClientIp(req) {
  const fwd = (req.headers["x-forwarded-for"] || "").toString();
  if (fwd) return fwd.split(",")[0].trim();
  return (req.socket && req.socket.remoteAddress) || "";
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const data = req.body || {};
  const nome = (data.nome || "").toString().trim();
  const email = (data.email || "").toString().trim().toLowerCase();
  const empresa = (data.empresa || "").toString().trim();
  const cargo = (data.cargo || "").toString().trim();
  const motivo = (data.motivo || "").toString().trim();
  const pageUrl = (data.pageUrl || "").toString().trim();
  const submittedAt = (data.submittedAt || "").toString().trim();
  const userAgent = (data.userAgent || "").toString().trim();
  const honeypot = (data.site || "").toString().trim();

  // ---- Anti-abuso a) HONEYPOT: campo oculto que humano nunca preenche. ----
  // Se veio preenchido, e bot. Fingimos sucesso e nao enviamos nada. Aqui o
  // fake-success e legitimo: e bot, nunca vai reenviar nem ver tela nenhuma.
  if (honeypot) {
    res.status(200).json({ ok: true });
    return;
  }

  // A fricção de tempo virou UX no front (segura o submit rapido demais). O
  // elapsedMs e client-trust (burlavel por POST direto), entao NAO serve de
  // defesa real no servidor. Quem defende de verdade e honeypot + rate-limit.

  // Validacao: nome, e-mail valido e empresa obrigatorios.
  if (!nome) {
    res.status(400).json({ error: "Nome obrigatório" });
    return;
  }
  if (!EMAIL_RE.test(email)) {
    res.status(400).json({ error: "E-mail inválido" });
    return;
  }
  if (!empresa) {
    res.status(400).json({ error: "Empresa obrigatória" });
    return;
  }

  // ---- Anti-abuso c) RATE LIMIT best-effort, FASE 1: peek read-only. ----
  // So contem flood. O slot so e gravado (rateCommit) depois do envio principal
  // dar certo, la embaixo. Assim um SMTP que falha nao bloqueia o retry do lead.
  const ip = getClientIp(req);
  if (
    !ratePeek(rateByIp, inflightByIp, ip, MAX_PER_IP) ||
    !ratePeek(rateByEmail, inflightByEmail, email, MAX_PER_EMAIL)
  ) {
    res.status(429).json({ error: "Muitas solicitações. Tenta de novo daqui a pouco." });
    return;
  }

  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_APP_PASSWORD;
  const internalTo = process.env.LEAD_TO || user;

  // SMTP nao configurado retorna ANTES de reservar, entao nao mexe em inflight/slot.
  if (!user || !pass) {
    console.error("SMTP_USER ou SMTP_APP_PASSWORD nao configurados.");
    res.status(500).json({ error: "E-mail nao configurado" });
    return;
  }

  // RESERVA SINCRONA: logo depois do peek passar e sem NENHUM await no meio, pra a
  // request concorrente com o mesmo e-mail/IP ver a reserva no peek dela e tomar 429.
  // O finally la embaixo garante que a reserva e liberada em TODO caminho de saida.
  reserve(inflightByIp, ip);
  reserve(inflightByEmail, email);

  try {
  // SMTP configuravel por env. Padrao = Hostinger (e-mail do dominio agenciafeed.com
  // fica na Hostinger). Pra trocar de provedor (Titan, Gmail, etc.) e so setar
  // SMTP_HOST/SMTP_PORT na Vercel, sem mexer no codigo. secure=true na 465 (SSL).
  const smtpHost = process.env.SMTP_HOST || "smtp.hostinger.com";
  const smtpPort = Number(process.env.SMTP_PORT) || 465;
  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: { user, pass },
    // Timeouts pra nao deixar a function pendurada -> 504.
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });

  const dataBR = formatarDataBR(submittedAt);
  const motivoTxt = motivo || "(não informado)";
  const cargoTxt = cargo || "(não informado)";

  // ---------- E-mail: LEAD QUENTE pra FEED (interno) ----------
  const internalHtml = `
    <div style="font-family:'Barlow',system-ui,Segoe UI,Arial,sans-serif;background:#070707;color:#F4F5F0;padding:32px 20px">
      <div style="max-width:560px;margin:0 auto;background:#0d0d0d;border:1px solid rgba(244,245,240,0.1);border-radius:14px;overflow:hidden">
        <div style="height:4px;background:linear-gradient(90deg,#FFA300,#1560D1)"></div>
        <div style="padding:30px 30px 32px">
          <p style="margin:0 0 6px;font-size:12px;letter-spacing:0.24em;text-transform:uppercase;color:#FFA300;font-weight:700">Lead quente, pedido de conversa</p>
          <p style="margin:0 0 20px;font-size:14px;line-height:1.5;color:rgba(244,245,240,0.7)">
            Alguém que já leu o Diagnóstico do Gargalo e quer marcar a reunião de 30 minutos.
          </p>
          <table style="border-collapse:collapse;width:100%;font-size:14px">
            <tr><td style="padding:8px 0;font-weight:700;white-space:nowrap;color:rgba(244,245,240,0.6);width:120px;vertical-align:top">Nome</td><td style="padding:8px 0;color:#F4F5F0">${escapeHtml(nome)}</td></tr>
            <tr><td style="padding:8px 0;font-weight:700;white-space:nowrap;color:rgba(244,245,240,0.6);vertical-align:top">E-mail</td><td style="padding:8px 0"><a href="mailto:${escapeHtml(email)}" style="color:#FFA300;text-decoration:none">${escapeHtml(email)}</a></td></tr>
            <tr><td style="padding:8px 0;font-weight:700;white-space:nowrap;color:rgba(244,245,240,0.6);vertical-align:top">Empresa</td><td style="padding:8px 0;color:#F4F5F0">${escapeHtml(empresa)}</td></tr>
            <tr><td style="padding:8px 0;font-weight:700;white-space:nowrap;color:rgba(244,245,240,0.6);vertical-align:top">Cargo</td><td style="padding:8px 0;color:#F4F5F0">${escapeHtml(cargoTxt)}</td></tr>
            <tr><td style="padding:8px 0;font-weight:700;white-space:nowrap;color:rgba(244,245,240,0.6);vertical-align:top">O que trava</td><td style="padding:8px 0;color:#F4F5F0;line-height:1.5">${escapeHtml(motivoTxt).replace(/\n/g, "<br/>")}</td></tr>
            <tr><td style="padding:8px 0;font-weight:700;white-space:nowrap;color:rgba(244,245,240,0.6);vertical-align:top">Origem</td><td style="padding:8px 0;color:#F4F5F0">${escapeHtml(ORIGEM)}</td></tr>
            <tr><td style="padding:8px 0;font-weight:700;white-space:nowrap;color:rgba(244,245,240,0.6);vertical-align:top">Data</td><td style="padding:8px 0;color:#F4F5F0">${escapeHtml(dataBR)}</td></tr>
          </table>
          <p style="margin:22px 0 0;font-size:12px;line-height:1.6;color:rgba(244,245,240,0.4);border-top:1px solid rgba(244,245,240,0.1);padding-top:16px">
            Página: ${escapeHtml(pageUrl) || "-"}<br/>
            Navegador: ${escapeHtml(userAgent) || "-"}
          </p>
        </div>
      </div>
    </div>
  `;

  const internalText = [
    "Lead quente: pedido de conversa (Diagnóstico do Gargalo)",
    "Alguém que já leu o Diagnóstico e quer marcar a reunião de 30 minutos.",
    "",
    `Nome: ${nome}`,
    `E-mail: ${email}`,
    `Empresa: ${empresa}`,
    `Cargo: ${cargoTxt}`,
    `O que trava: ${motivoTxt}`,
    `Origem: ${ORIGEM}`,
    `Data: ${dataBR}`,
    "",
    `Página: ${pageUrl || "-"}`,
    `Navegador: ${userAgent || "-"}`,
  ].join("\n");

  // 1) E-mail pra FEED e o caminho GARANTIDO. Se falhar, ai sim 500.
  try {
    await transporter.sendMail({
      from: `"Site Feed" <${user}>`,
      to: internalTo,
      replyTo: email,
      subject: `Pedido de conversa: ${empresa} (${nome})`,
      text: internalText,
      html: internalHtml,
    });
  } catch (err) {
    console.error("Falha ao enviar lead de agendamento pra Feed:", err);
    // NAO grava o slot: a Feed nao recebeu o lead, entao o retry tem que passar.
    // O finally libera a reserva, logo o retry com o mesmo e-mail continua passando.
    res.status(500).json({ error: "Falha ao enviar" });
    return;
  }

  // RATE LIMIT FASE 2: envio principal deu certo, agora sim consome o slot. O slot
  // commitado passa a segurar a cota pela janela; a reserva e liberada no finally.
  rateCommit(rateByIp, ip);
  rateCommit(rateByEmail, email);

  // 2) CRM (Twenty) DESACOPLADO: best-effort. Lead quente entra direto como
  //    oportunidade em MEETING (pediu conversa). Falhou, so loga.
  await enviarParaCRM({
    nome,
    email,
    empresa,
    cargo,
    origem: "Pedido de conversa",
    stage: "MEETING",
    detalhes: {
      "O que trava": motivo,
      Origem: ORIGEM,
      "Página": pageUrl,
    },
  });

  // 3) Webhook do n8n DESACOPLADO: best-effort. Se a env nao existe OU o
  //    POST falha, so loga. O e-mail pra Feed ja garantiu o lead.
  await enviarWebhookN8N({
    nome,
    email,
    empresa,
    cargo,
    motivo,
    origem: ORIGEM,
    data: submittedAt || new Date().toISOString(),
    pageUrl,
    userAgent,
  });

  res.status(200).json({ ok: true });
  } finally {
    // Libera a reserva in-flight em QUALQUER saida (sucesso, falha de SMTP ou throw
    // inesperado). Nunca vaza reserva que travaria o e-mail pra sempre. Em sucesso o
    // slot commitado ja segura a cota; em falha nada foi gravado e o retry passa.
    release(inflightByIp, ip);
    release(inflightByEmail, email);
  }
}

async function enviarWebhookN8N(payload) {
  const url = process.env.N8N_WEBHOOK_URL;
  if (!url) return; // env nao configurada: segue sem CRM, e o esperado por enquanto.

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  } catch (e) {
    console.error("Falha ao enviar webhook do n8n (lead ja notificado por e-mail):", e.message);
  } finally {
    clearTimeout(timer);
  }
}

function escapeHtml(str) {
  return (str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatarDataBR(iso) {
  try {
    const d = iso ? new Date(iso) : new Date();
    if (isNaN(d.getTime())) return new Date().toLocaleString("pt-BR");
    return d.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
  } catch {
    return iso || "";
  }
}
