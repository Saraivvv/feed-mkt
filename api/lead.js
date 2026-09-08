import nodemailer from "nodemailer";
import { enviarAoHub } from "./_hub.js";

// Recebe as respostas do quiz do site e entrega o lead.
// Roda como Serverless Function na Vercel (mesmo dominio do site, sem CORS).
//
// C-200 — A ORDEM AQUI E O CONSERTO. Antes o e-mail vinha primeiro e o resto
// morava DEPOIS dele, dentro do mesmo try: quando o SMTP recusou o remetente
// (553, 08/09/2026), o throw pulou o CRM e o lead nao chegou em lugar nenhum.
// Agora o Hub — que grava, mostra na home e espelha no Twenty do workspace —
// vem primeiro, e o e-mail e uma copia que so consegue derrubar a si mesma.
// O CRM direto saiu daqui de proposito: quem fala com o Twenty da Feed passa a
// ser o Hub, num lugar so (agendar.js e diagnostico.js seguem no _crm.js).
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const data = req.body || {};
  const company = (data.company || "").toString().trim();
  const market = (data.market || "").toString().trim();
  const stage = (data.stage || "").toString().trim();
  const digitalPresence = (data.digitalPresence || "").toString().trim();
  const priority = (data.priority || "").toString().trim();
  const pageUrl = (data.pageUrl || "").toString().trim();
  const submittedAt = (data.submittedAt || "").toString().trim();
  const userAgent = (data.userAgent || "").toString().trim();

  // Validacao minima pra evitar disparo vazio / spam de bot.
  if (!company && !market && !priority) {
    res.status(400).json({ error: "Dados insuficientes" });
    return;
  }

  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_APP_PASSWORD;
  const to = process.env.LEAD_TO || user;

  if (!user || !pass) {
    console.error("SMTP_USER ou SMTP_APP_PASSWORD nao configurados.");
    res.status(500).json({ error: "E-mail nao configurado" });
    return;
  }

  // SMTP configuravel por env. Padrao = Hostinger (e-mail do dominio agenciafeed.com
  // fica na Hostinger). Pra trocar de provedor e so setar SMTP_HOST/SMTP_PORT na
  // Vercel. secure=true na 465 (SSL).
  const smtpHost = process.env.SMTP_HOST || "smtp.hostinger.com";
  const smtpPort = Number(process.env.SMTP_PORT) || 465;
  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: { user, pass },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });

  const row = (label, value) =>
    `<tr><td style="padding:6px 12px;font-weight:600;vertical-align:top;white-space:nowrap">${label}</td><td style="padding:6px 12px;white-space:pre-line">${value || "—"}</td></tr>`;

  const html = `
    <div style="font-family:system-ui,Segoe UI,Arial,sans-serif;color:#111;max-width:640px">
      <h2 style="margin:0 0 4px">Novo lead do site</h2>
      <p style="margin:0 0 16px;color:#555">Diagnóstico respondido em ${submittedAt || "—"}</p>
      <table style="border-collapse:collapse;width:100%;font-size:14px;border:1px solid #eee">
        ${row("Empresa", company)}
        ${row("Mercado / segmento", market)}
        ${row("Momento atual", stage)}
        ${row("Presença digital", digitalPresence)}
        ${row("Prioridade", priority)}
      </table>
      <p style="margin:16px 0 0;font-size:12px;color:#888">
        Página: ${pageUrl || "—"}<br/>
        Navegador: ${userAgent || "—"}
      </p>
    </div>
  `;

  const text = [
    "Novo lead do site",
    `Recebido em: ${submittedAt || "—"}`,
    "",
    `Empresa: ${company || "—"}`,
    `Mercado/segmento: ${market || "—"}`,
    "",
    `Momento atual: ${stage || "—"}`,
    `Presença digital: ${digitalPresence || "—"}`,
    `Prioridade: ${priority || "—"}`,
    "",
    `Página: ${pageUrl || "—"}`,
    `Navegador: ${userAgent || "—"}`,
  ].join("\n");

  // (1) Hub primeiro: destino duravel do lead.
  const noHub = await enviarAoHub({
    nome: company,
    origem: "Quiz do site",
    respostas: {
      "Mercado / segmento": market,
      "Momento atual": stage,
      "Presença digital": digitalPresence,
      Prioridade: priority,
      "Página": pageUrl,
    },
  });

  // (2) E-mail como copia. Falha dele nao pode mais custar o lead.
  let noEmail = false;
  try {
    await transporter.sendMail({
      from: `"Site Feed" <${user}>`,
      to,
      replyTo: user,
      subject: `Novo lead do site: ${company || "sem nome"}`,
      text,
      html,
    });
    noEmail = true;
  } catch (err) {
    console.error("Falha ao enviar lead por e-mail:", err);
  }

  // 500 so quando NENHUM destino ficou com o lead — ai o visitante precisa
  // saber que nao chegou.
  if (!noHub && !noEmail) {
    res.status(500).json({ error: "Falha ao enviar" });
    return;
  }
  res.status(200).json({ ok: true });
}
