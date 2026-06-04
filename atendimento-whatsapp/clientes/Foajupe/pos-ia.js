// ===== POS IA - Foajupe =====
// No "Pos IA" (Code), DEPOIS de "Gemini" e "Gemini Midia", ANTES de "Enviar IA".
// - Pega o texto que a IA gerou.
// - Detecta a marca [ENCAMINHAR] (handoff) e remove da resposta.
// - Salva a resposta no historico.
// - Quebra a resposta em mensagens separadas (por paragrafo) = bolhas, como humano digitando.
//   Cada item vira uma mensagem; o handoff fica so no ultimo item (pra etiquetar 1x).

const resp = $input.first().json;
let texto = resp?.candidates?.[0]?.content?.parts?.[0]?.text || 'Opa, pode repetir? 🙂';
const handoff = texto.includes('[ENCAMINHAR]');
texto = texto.replace(/\[ENCAMINHAR\]/g, '').trim();

let number = '';
try { number = $('Code in JavaScript').item.json.number; } catch (e) {}

const store = $getWorkflowStaticData('global');
if (!store.hist) store.hist = {};
if (!store.estado) store.estado = {};
if (number) {
  const h = store.hist[number] || [];
  h.push({ role: 'model', parts: [{ text: texto }] });
  store.hist[number] = h.slice(-20);
  if (handoff) store.estado[number] = 'humano';
}

let partes = texto.split(/\n\n+/).map(function (s) { return s.trim(); }).filter(function (s) { return s.length > 0; });
if (partes.length === 0) partes = [texto];

return partes.map(function (p, i) { return { json: { number: number, resposta: p, handoff: (handoff && i === partes.length - 1) } }; });
