// Integracao best-effort com o CRM da Feed (Twenty, self-hosted em crm.agenciafeed.com).
// Regra de ouro: o CRM NUNCA derruba o fluxo principal (e-mail). Qualquer falha aqui
// e apenas logada; o lead ja esta garantido por e-mail. Por isso todo mundo chama
// enviarParaCRM() depois do envio principal dar certo e sem await bloqueante de erro.
//
// Envs (Vercel): TWENTY_API_URL (ex.: https://crm.agenciafeed.com) e TWENTY_API_KEY.
// Sem as envs, vira no-op silencioso (mesmo padrao do N8N_WEBHOOK_URL do agendar.js).

const TIMEOUT_MS = 8000;

async function api(path, { method = "GET", body } = {}) {
  const base = (process.env.TWENTY_API_URL || "").replace(/\/$/, "");
  const key = process.env.TWENTY_API_KEY;
  if (!base || !key) return null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const resp = await fetch(`${base}/rest/${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
    if (!resp.ok) {
      throw new Error(`Twenty ${method} /${path} -> HTTP ${resp.status}: ${(await resp.text()).slice(0, 300)}`);
    }
    return await resp.json();
  } finally {
    clearTimeout(timer);
  }
}

function separarNome(nome) {
  const partes = (nome || "").trim().split(/\s+/);
  return { firstName: partes[0] || "", lastName: partes.slice(1).join(" ") };
}

// Acha a empresa pelo nome exato ou cria. Retorna o id (ou null).
async function empresaIdPorNome(nome) {
  if (!nome) return null;
  const filtro = encodeURIComponent(`name[eq]:${nome}`);
  const busca = await api(`companies?filter=${filtro}&limit=1`);
  const achada = busca?.data?.companies?.[0];
  if (achada) return achada.id;
  const criada = await api("companies", { method: "POST", body: { name: nome } });
  return criada?.data?.createCompany?.id || null;
}

// Acha a pessoa pelo e-mail ou cria. Retorna o id (ou null).
async function pessoaIdPorEmail({ nome, email, cargo, companyId }) {
  if (!email) return null;
  const filtro = encodeURIComponent(`emails.primaryEmail[eq]:${email}`);
  const busca = await api(`people?filter=${filtro}&limit=1`);
  const achada = busca?.data?.people?.[0];
  if (achada) return achada.id;
  const body = {
    name: separarNome(nome),
    emails: { primaryEmail: email },
  };
  if (cargo) body.jobTitle = cargo;
  if (companyId) body.companyId = companyId;
  const criada = await api("people", { method: "POST", body });
  return criada?.data?.createPerson?.id || null;
}

// Cria a oportunidade no pipeline. stage usa as opcoes padrao do Twenty.
async function criarOportunidade({ titulo, stage, companyId, personId }) {
  const body = { name: titulo, stage: stage || "NEW" };
  if (companyId) body.companyId = companyId;
  if (personId) body.pointOfContactId = personId;
  const criada = await api("opportunities", { method: "POST", body });
  return criada?.data?.createOpportunity?.id || null;
}

// Anexa uma nota (markdown) a empresa e/ou pessoa, pra guardar o contexto bruto
// do formulario (respostas do quiz, motivo do agendamento etc.).
async function criarNota({ titulo, markdown, companyId, personId, opportunityId }) {
  const nota = await api("notes", {
    method: "POST",
    body: { title: titulo, bodyV2: { markdown } },
  });
  const noteId = nota?.data?.createNote?.id;
  if (!noteId) return;
  const alvos = [
    companyId && { noteId, targetCompanyId: companyId },
    personId && { noteId, targetPersonId: personId },
    opportunityId && { noteId, targetOpportunityId: opportunityId },
  ].filter(Boolean);
  for (const alvo of alvos) {
    await api("noteTargets", { method: "POST", body: alvo });
  }
}

// Ponto de entrada unico usado pelos endpoints. Nunca lanca.
// origem: rotulo curto do formulario; vira prefixo do titulo da oportunidade.
export async function enviarParaCRM({ nome, email, empresa, cargo, origem, stage, detalhes }) {
  if (!process.env.TWENTY_API_URL || !process.env.TWENTY_API_KEY) return;
  try {
    const companyId = await empresaIdPorNome(empresa);
    const personId = await pessoaIdPorEmail({ nome, email, cargo, companyId });

    const quem = empresa || nome || email || "lead sem nome";
    const opportunityId = await criarOportunidade({
      titulo: `${origem}: ${quem}`,
      stage,
      companyId,
      personId,
    });

    if (detalhes) {
      const markdown = Object.entries(detalhes)
        .filter(([, v]) => v)
        .map(([k, v]) => `**${k}:** ${v}`)
        .join("\n\n");
      if (markdown) {
        await criarNota({
          titulo: `${origem} (${new Date().toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" })})`,
          markdown,
          companyId,
          personId,
          opportunityId,
        });
      }
    }
  } catch (e) {
    console.error("CRM (Twenty) falhou, lead segue garantido por e-mail:", e.message);
  }
}
