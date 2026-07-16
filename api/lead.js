import nodemailer from "nodemailer";
import { enviarParaCRM } from "./_crm.js";

// Recebe as respostas do quiz do site e envia um e-mail com o lead.
// Roda como Serverless Function na Vercel (mesmo dominio do site, sem CORS).
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

  try {
    await transporter.sendMail({
      from: `"Site Feed" <${user}>`,
      to,
      replyTo: user,
      subject: `Novo lead do site: ${company || "sem nome"}`,
      text,
      html,
    });
    // CRM best-effort: e-mail ja garantiu o lead; falha aqui so loga.
    await enviarParaCRM({
      empresa: company,
      origem: "Quiz do site",
      detalhes: {
        "Mercado / segmento": market,
        "Momento atual": stage,
        "Presença digital": digitalPresence,
        Prioridade: priority,
        "Página": pageUrl,
      },
    });

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Falha ao enviar lead por e-mail:", err);
    res.status(500).json({ error: "Falha ao enviar" });
  }
}
