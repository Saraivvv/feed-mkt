import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import nodemailer from 'nodemailer';
import { REGRAS } from '../conceitos/f-diagnostico-chat/assets/regras.js';
import { lerDiagnostico } from '../api/_diagnostico.js';
import diagnostico from '../api/diagnostico.js';
import agendar from '../api/agendar.js';
import quiz from '../api/lead.js';

// Sem rede, credenciais ou destinatários reais. Execute: node scripts/verificar-conexoes.mjs
const ambiente = { ...process.env }, originalFetch = globalThis.fetch, originalTransport = nodemailer.createTransport;
let hubFalha = false, smtpFalha = false, envios = [], emails = [];
globalThis.fetch = async (url, config) => {
  assert.match(String(url), /hub\.invalid/);
  const body = JSON.parse(config.body); envios.push(body);
  assert.ok(config.body.length <= 8192);
  assert.ok(Object.values(body.respostas).every(v => typeof v === 'string' && v.length <= 1000));
  return { ok: !hubFalha, status: hubFalha ? 503 : 200 };
};
nodemailer.createTransport = () => ({ sendMail: async mail => {
  assert.ok(envios.length, 'Hub deve vir antes do SMTP');
  if (smtpFalha) throw new Error('SMTP indisponível no teste');
  emails.push(mail); return {};
} });
process.env.HUB_SITE_TAG = 'fh_000000000000000000000000';
process.env.HUB_LEAD_URL = 'https://hub.invalid/api/lead';
process.env.SMTP_USER = 'site@example.invalid'; process.env.SMTP_APP_PASSWORD = 'fake-test';
let ip = 0;
async function chamar(handler, body) {
  const res = { status(code) { this.code = code; return this; }, json(data) { this.data = data; } };
  await handler({ method: 'POST', body, headers: { 'x-forwarded-for': `test-${++ip}` } }, res);
  return res;
}
function pedido() {
  return {
    nome: 'Teste <Tuiê>', email: `teste-${randomUUID()}@example.invalid`, telefone: '16999999999',
    idempotencyKey: randomUUID(), pageUrl: 'https://agenciafeed.com/diagnostico/?privado=segredo',
    consentimento: { aceito: true, versao: 'diagnostico-v1' },
    diagnostico: { versao: REGRAS.versao, respostas: Object.fromEntries(REGRAS.perguntas.map(q => [q.id, { opcao: 0, opcoes: [0], texto: 'Texto adulterado', livre: false }])) },
  };
}
try {
  const body = pedido();
  let r = await chamar(diagnostico, body);
  assert.equal(r.code, 200); assert.deepEqual(r.data, { ok: true, leadSaved: true, pdfSent: true });
  assert.equal(envios.length, 1); assert.equal(emails.length, 2);
  assert.equal(envios[0].respostas[REGRAS.perguntas[0].titulo], REGRAS.perguntas[0].opcoes[0].texto);
  assert.doesNotMatch(JSON.stringify(envios), /Texto adulterado|privado|segredo/);
  assert.match(emails[0].html, /Teste/); assert.doesNotMatch(emails[1].html, /Teste <Tuiê>/);
  r = await chamar(diagnostico, body);
  assert.equal(r.code, 200); assert.equal(envios.length, 1); assert.equal(emails.length, 2);
  r = await chamar(diagnostico, { ...body, nome: 'Mudou' }); assert.equal(r.code, 409);
  const semConsentimento = pedido(); semConsentimento.consentimento.aceito = false;
  assert.equal((await chamar(diagnostico, semConsentimento)).code, 400);
  const invalido = pedido(); invalido.diagnostico.respostas.resposta.opcoes = [20];
  assert.equal((await chamar(diagnostico, invalido)).code, 400);
  const livres = pedido();
  for (const resposta of Object.values(livres.diagnostico.respostas)) Object.assign(resposta, { opcao: null, opcoes: [], texto: 'x'.repeat(600), livre: true });
  assert.equal(Object.keys(lerDiagnostico(livres.diagnostico, livres.consentimento)).length, 12);
  assert.equal((await chamar(diagnostico, livres)).code, 200);
  livres.diagnostico.respostas.resposta.texto += 'x';
  assert.equal((await chamar(diagnostico, livres)).code, 400);
  hubFalha = true;
  const retry = pedido(), antes = emails.length;
  assert.equal((await chamar(diagnostico, retry)).code, 503); assert.equal(emails.length, antes);
  hubFalha = false; smtpFalha = true;
  r = await chamar(diagnostico, retry);
  assert.equal(r.code, 200); assert.equal(r.data.leadSaved, true); assert.equal(r.data.pdfSent, false);
  const contagem = envios.length;
  assert.equal((await chamar(diagnostico, retry)).code, 200); assert.equal(envios.length, contagem);
  delete process.env.SMTP_USER; delete process.env.SMTP_APP_PASSWORD;
  assert.equal((await chamar(diagnostico, { nome: 'PDF legado', email: 'pdf@example.invalid' })).data.leadSaved, true);
  assert.equal((await chamar(agendar, { nome: 'Agenda', email: 'agenda@example.invalid', empresa: 'Empresa', motivo: 'x'.repeat(2500) })).data.leadSaved, true);
  assert.equal(envios.at(-1).respostas['O que trava (3)'].length, 500);
  assert.equal((await chamar(quiz, { company: 'Empresa', priority: 'Atendimento' })).data.leadSaved, true);
  hubFalha = true;
  assert.equal((await chamar(agendar, { nome: 'Agenda', email: 'falha@example.invalid', empresa: 'Empresa' })).code, 503);
  assert.equal((await chamar(quiz, { company: 'Empresa' })).code, 503);
  console.log('Conexões: 15 cenários OK; notas do servidor, consentimento, limites, retry, SMTP independente e três entradas no Hub.');
} finally {
  globalThis.fetch = originalFetch; nodemailer.createTransport = originalTransport;
  for (const key of Object.keys(process.env)) if (!(key in ambiente)) delete process.env[key];
  Object.assign(process.env, ambiente);
}
