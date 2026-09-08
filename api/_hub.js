// Ponte com o Hub da Feed (hub.agenciafeed.com), o destino DURAVEL do lead:
// ele grava, mostra em "Leads da semana" e espelha no CRM do workspace.
// O e-mail e copia — foi ele quem, sozinho, engoliu o lead de 08/09/2026
// (SMTP 553) e levou junto o CRM, que rodava depois dele dentro do mesmo try.
//
// Envs (Vercel): HUB_SITE_TAG (a tag do site no Hub, formato fh_<24 hex>) e,
// opcionalmente, HUB_LEAD_URL. Sem a tag vira no-op declarado — mesmo padrao
// do _crm.js.
//
// Nunca lanca: devolve true se o Hub aceitou, false se nao. Quem chama decide
// o que fazer com isso.

const TIMEOUT_MS = 8000;

export async function enviarAoHub({ nome, email, telefone, origem, respostas }) {
  const tag = process.env.HUB_SITE_TAG;
  if (!tag) return false;
  const url = process.env.HUB_LEAD_URL || "https://hub.agenciafeed.com/api/lead";

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        t: tag,
        nome: nome || "",
        email: email || "",
        telefone: telefone || "",
        origem: origem || "Formulário do site",
        respostas: respostas || {},
      }),
      signal: controller.signal,
    });
    if (!resp.ok) throw new Error(`Hub /api/lead -> HTTP ${resp.status}`);
    return true;
  } catch (e) {
    console.error("Hub nao recebeu o lead:", e.message);
    return false;
  } finally {
    clearTimeout(timer);
  }
}
