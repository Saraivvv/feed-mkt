import nodemailer from "nodemailer";
import { readFile } from "node:fs/promises";
import path from "node:path";

// Entrega o lead magnet "Diagnostico do Gargalo" do funil do LinkedIn.
// Recebe { nome, email } da pagina /diagnostico e faz duas coisas:
//   a) manda pro LEAD o material (PDF anexado + link de download), on-brand;
//   b) avisa a Feed internamente que entrou um lead novo.
// Roda como Serverless Function na Vercel (mesmo dominio, sem CORS).
// Mesmo padrao/envs de api/lead.js: SMTP_USER, SMTP_APP_PASSWORD, LEAD_TO.

// Base do site pro link de download no e-mail. Ajuste a env SITE_URL na Vercel
// (ex.: https://feed.com.br). Sem env, cai no fallback abaixo.
const SITE_URL = (process.env.SITE_URL || "https://feedmkt.vercel.app").replace(/\/$/, "");

const PDF_FILENAME = "diagnostico-do-gargalo.pdf";
const PDF_URL = `${SITE_URL}/${PDF_FILENAME}`;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Gate de tempo: submit mais rapido que isso apos o load = bot.
const MIN_FILL_MS = 2000;

// ---- Rate limit BEST-EFFORT em memoria ----
// ATENCAO: isso vive so na memoria da instancia da function. Reseta a cada cold
// start e nao e compartilhado entre instancias concorrentes. Serve como freio de
// mao pra abuso casual; pra rate limit real (persistente, distribuido) o certo e
// Vercel KV / Upstash Redis. Nao dependa disto como unica linha de defesa.
const RATE_WINDOW_MS = 10 * 60 * 1000; // 10 min
const MAX_PER_IP = 3; // 3 envios por IP na janela
const MAX_PER_EMAIL = 1; // 1 envio por email na janela
const rateByIp = new Map();
const rateByEmail = new Map();

function rateAllow(map, key, max) {
  if (!key) return true;
  const now = Date.now();
  const hits = (map.get(key) || []).filter((t) => now - t < RATE_WINDOW_MS);
  if (hits.length >= max) {
    map.set(key, hits);
    return false;
  }
  hits.push(now);
  map.set(key, hits);
  return true;
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
  const pageUrl = (data.pageUrl || "").toString().trim();
  const submittedAt = (data.submittedAt || "").toString().trim();
  const userAgent = (data.userAgent || "").toString().trim();
  const honeypot = (data.site || "").toString().trim();
  const elapsedMs = Number(data.elapsedMs);

  // ---- Anti-abuso a) HONEYPOT: campo oculto que humano nunca preenche. ----
  // Se veio preenchido, e bot. Fingimos sucesso e nao enviamos nada.
  if (honeypot) {
    res.status(200).json({ ok: true });
    return;
  }

  // ---- Anti-abuso b) GATE DE TEMPO: submit rapido demais = bot. ----
  // Fingimos sucesso e nao enviamos nada.
  if (Number.isFinite(elapsedMs) && elapsedMs < MIN_FILL_MS) {
    res.status(200).json({ ok: true });
    return;
  }

  // Validacao: nome nao vazio e e-mail valido.
  if (!nome) {
    res.status(400).json({ error: "Nome obrigatório" });
    return;
  }
  if (!EMAIL_RE.test(email)) {
    res.status(400).json({ error: "E-mail inválido" });
    return;
  }

  // ---- Anti-abuso c) RATE LIMIT best-effort (ver comentario no topo). ----
  const ip = getClientIp(req);
  if (!rateAllow(rateByIp, ip, MAX_PER_IP) || !rateAllow(rateByEmail, email, MAX_PER_EMAIL)) {
    res.status(429).json({ error: "Muitas solicitações. Tenta de novo daqui a pouco." });
    return;
  }

  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_APP_PASSWORD;
  const internalTo = process.env.LEAD_TO || user;

  if (!user || !pass) {
    console.error("SMTP_USER ou SMTP_APP_PASSWORD nao configurados.");
    res.status(500).json({ error: "E-mail nao configurado" });
    return;
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
    // Timeouts pra nao deixar a function pendurada -> 504.
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });

  const primeiroNome = nome.split(/\s+/)[0];
  const dataBR = formatarDataBR(submittedAt);

  // Anexa o PDF. Tenta ler do disco (empacotado via vercel.json includeFiles) e,
  // se falhar, baixa do proprio site em PDF_URL (com timeout). Se nada der certo,
  // segue so com o link e a copy se ajusta pra nao prometer anexo inexistente.
  const pdfContent = await carregarPdf();
  const pdfAttachment = pdfContent
    ? { filename: "Diagnostico do Gargalo - Feed.pdf", content: pdfContent }
    : null;

  // Copy condicional ao anexo (nunca prometer anexo que nao foi).
  const entregaHtml = pdfAttachment
    ? "Reserve uns minutos, responda com sinceridade e vá anotando o que fizer sentido. O material está anexado neste e-mail, e você também pode baixar pelo botão abaixo."
    : "Reserve uns minutos, responda com sinceridade e vá anotando o que fizer sentido. Use o botão abaixo pra baixar o material.";
  const entregaText = pdfAttachment
    ? "Reserve uns minutos, responda com sinceridade e vá anotando o que fizer sentido. O material está anexado neste e-mail, e você também pode baixar por aqui:"
    : "Reserve uns minutos, responda com sinceridade e vá anotando o que fizer sentido. Use o link abaixo pra baixar o material:";

  // ---------- E-mail 1: entrega pro LEAD (on-brand, zero travessao) ----------
  const leadHtml = `
    <div style="font-family:'Barlow',system-ui,Segoe UI,Arial,sans-serif;background:#070707;color:#F4F5F0;padding:32px 20px">
      <div style="max-width:560px;margin:0 auto;background:#0d0d0d;border:1px solid rgba(244,245,240,0.1);border-radius:14px;overflow:hidden">
        <div style="height:4px;background:linear-gradient(90deg,#FFA300,#1560D1)"></div>
        <div style="padding:32px 30px 34px">
          <p style="margin:0 0 18px;font-size:12px;letter-spacing:0.24em;text-transform:uppercase;color:#FFA300;font-weight:700">Diagnóstico do Gargalo</p>
          <p style="margin:0 0 16px;font-size:17px;line-height:1.5">Oi, ${escapeHtml(primeiroNome)}, tudo certo?</p>
          <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:rgba(244,245,240,0.85)">
            Aqui está o seu <strong style="color:#F4F5F0">Diagnóstico do Gargalo</strong>. Ele vai direto ao ponto pra você enxergar o quanto a sua empresa ainda depende de você e onde está o nó que trava o crescimento.
          </p>
          <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:rgba(244,245,240,0.85)">
            ${entregaHtml}
          </p>
          <p style="margin:0 0 28px">
            <a href="${PDF_URL}" style="display:inline-block;background:#FFA300;color:#070707;text-decoration:none;font-weight:700;font-size:15px;padding:13px 26px;border-radius:9px">Baixar o Diagnóstico (PDF)</a>
          </p>
          <div style="border-top:1px solid rgba(244,245,240,0.1);padding-top:20px">
            <p style="margin:0;font-size:14px;line-height:1.6;color:rgba(244,245,240,0.7)">
              Quando terminar de responder, no fim do material tem um convite pra gente conversar 30 minutos sobre o seu caso. Se fizer sentido pra você, é só aceitar. Sem compromisso, sem pressão.
            </p>
          </div>
          <p style="margin:26px 0 0;font-size:14px;line-height:1.6;color:rgba(244,245,240,0.6)">
            Um abraço,<br/>
            <strong style="color:#F4F5F0">Time Feed</strong><br/>
            IA, marca e soluções para empresas.
          </p>
        </div>
      </div>
      <p style="max-width:560px;margin:16px auto 0;font-size:11px;color:#53565A;text-align:center">
        Você recebeu este e-mail porque pediu o Diagnóstico do Gargalo pela Feed.
      </p>
    </div>
  `;

  const leadText = [
    `Oi, ${primeiroNome}, tudo certo?`,
    "",
    "Aqui está o seu Diagnóstico do Gargalo. Ele vai direto ao ponto pra você enxergar o quanto a sua empresa ainda depende de você e onde está o nó que trava o crescimento.",
    "",
    entregaText,
    PDF_URL,
    "",
    "Quando terminar de responder, no fim do material tem um convite pra gente conversar 30 minutos sobre o seu caso. Se fizer sentido pra você, é só aceitar. Sem compromisso, sem pressão.",
    "",
    "Um abraço,",
    "Time Feed",
    "IA, marca e soluções para empresas.",
  ].join("\n");

  // ---------- E-mail 2: notificacao interna pra Feed (simples) ----------
  const internalHtml = `
    <div style="font-family:system-ui,Segoe UI,Arial,sans-serif;color:#111;max-width:560px">
      <h2 style="margin:0 0 4px">Novo lead: Diagnóstico do Gargalo</h2>
      <p style="margin:0 0 16px;color:#555">Origem: LinkedIn GARGALO · ${dataBR}</p>
      <table style="border-collapse:collapse;width:100%;font-size:14px;border:1px solid #eee">
        <tr><td style="padding:6px 12px;font-weight:600;white-space:nowrap">Nome</td><td style="padding:6px 12px">${escapeHtml(nome)}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:600;white-space:nowrap">E-mail</td><td style="padding:6px 12px">${escapeHtml(email)}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:600;white-space:nowrap">Origem</td><td style="padding:6px 12px">LinkedIn GARGALO</td></tr>
        <tr><td style="padding:6px 12px;font-weight:600;white-space:nowrap">Data</td><td style="padding:6px 12px">${dataBR}</td></tr>
      </table>
      <p style="margin:16px 0 0;font-size:12px;color:#888">
        Página: ${escapeHtml(pageUrl) || "-"}<br/>
        Navegador: ${escapeHtml(userAgent) || "-"}
      </p>
    </div>
  `;

  const internalText = [
    "Novo lead: Diagnóstico do Gargalo",
    `Origem: LinkedIn GARGALO`,
    `Data: ${dataBR}`,
    "",
    `Nome: ${nome}`,
    `E-mail: ${email}`,
    "",
    `Página: ${pageUrl || "-"}`,
    `Navegador: ${userAgent || "-"}`,
  ].join("\n");

  // 1) Entrega pro LEAD primeiro. Se ISSO falhar, ai sim 500 (o lead nao recebeu).
  try {
    await transporter.sendMail({
      from: `"Feed" <${user}>`,
      to: email,
      replyTo: user,
      subject: `${primeiroNome}, aqui está o seu Diagnóstico do Gargalo`,
      text: leadText,
      html: leadHtml,
      attachments: pdfAttachment ? [pdfAttachment] : [],
    });
  } catch (err) {
    console.error("Falha ao enviar Diagnóstico pro lead:", err);
    res.status(500).json({ error: "Falha ao enviar" });
    return;
  }

  // 2) Notificacao interna DESACOPLADA: se falhar, so loga. Nao derruba a resposta
  //    nem faz o cliente reenviar (o que geraria PDF duplicado pro lead).
  try {
    const internal = await Promise.allSettled([
      transporter.sendMail({
        from: `"Site Feed" <${user}>`,
        to: internalTo,
        replyTo: email,
        subject: `Novo lead (Diagnóstico do Gargalo): ${nome}`,
        text: internalText,
        html: internalHtml,
      }),
    ]);
    if (internal[0].status === "rejected") {
      console.error("Falha na notificacao interna do lead (lead ja recebeu):", internal[0].reason);
    }
  } catch (err) {
    console.error("Erro inesperado na notificacao interna:", err);
  }

  res.status(200).json({ ok: true });
}

async function carregarPdf() {
  // 1) disco (empacotado no bundle via vercel.json includeFiles; funciona local tb)
  try {
    const pdfPath = path.join(process.cwd(), "public", PDF_FILENAME);
    return await readFile(pdfPath);
  } catch (e) {
    console.warn("PDF nao lido do disco, tentando via HTTP:", e.message);
  }
  // 2) HTTP a partir do proprio site, com timeout (asset estatico em PDF_URL).
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const resp = await fetch(PDF_URL, { signal: controller.signal });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const buf = await resp.arrayBuffer();
    return Buffer.from(buf);
  } catch (e) {
    console.warn("PDF nao baixado via HTTP, enviando apenas o link:", e.message);
    return null;
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
