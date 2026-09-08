// Check do C-200: o defeito era o e-mail levar o lead junto quando falha.
// Roda com `node api/lead.check.mjs`. Sem framework, sem rede de saida real:
// o SMTP aponta pra uma porta fechada (falha de verdade) e o fetch do Hub e
// trocado por um espiao.
import assert from "node:assert/strict";

process.env.SMTP_USER = "quem@exemplo.com";
process.env.SMTP_APP_PASSWORD = "x";
process.env.SMTP_HOST = "127.0.0.1";
process.env.SMTP_PORT = "1"; // ninguem escuta: sendMail lanca
process.env.HUB_SITE_TAG = "fh_000000000000000000000000";
process.env.HUB_LEAD_URL = "https://hub.exemplo/api/lead";

const chamadas = [];
globalThis.fetch = async (url, init) => {
  chamadas.push({ url, corpo: JSON.parse(init.body) });
  return { ok: true, status: 200, async json() { return { ok: true }; } };
};

const { default: handler } = await import("./lead.js");

function resposta() {
  const r = { codigo: null, corpo: null };
  r.status = (c) => ((r.codigo = c), r);
  r.json = (b) => ((r.corpo = b), r);
  return r;
}

const res = resposta();
await handler(
  { method: "POST", body: { company: "Padaria do Zé", market: "Alimentação", priority: "Vender mais" } },
  res,
);

assert.equal(chamadas.length, 1, "o Hub tem que ser chamado");
assert.equal(chamadas[0].url, "https://hub.exemplo/api/lead");
assert.equal(chamadas[0].corpo.nome, "Padaria do Zé");
assert.equal(chamadas[0].corpo.t, process.env.HUB_SITE_TAG);
// O coracao do card: SMTP quebrado e o lead segue entregue.
assert.equal(res.codigo, 200, "e-mail quebrado nao pode virar 500 nem perder o lead");

// E o contrario tambem: sem Hub configurado e sem e-mail, ai sim e 500.
delete process.env.HUB_SITE_TAG;
chamadas.length = 0;
const res2 = resposta();
await handler({ method: "POST", body: { company: "Padaria do Zé" } }, res2);
assert.equal(chamadas.length, 0, "sem tag o Hub nem e chamado");
assert.equal(res2.codigo, 500, "nenhum destino ficou com o lead");

console.log("C-200 ok: o lead sobrevive ao e-mail quebrado.");
