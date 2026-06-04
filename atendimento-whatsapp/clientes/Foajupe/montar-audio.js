// ===== MONTAR AUDIO - Foajupe =====
// No "Montar Audio" (Code), ENTRE "Baixar Midia" e "Gemini Midia".
// Monta o corpo (geminiBody) do Gemini multimodal com o audio + o prompt do perfil,
// e guarda um placeholder do audio no historico da conversa.

const prep = $('Code in JavaScript').item.json;
const base64 = $input.first().json.base64;
const hist = prep.hist || [];
const contents = hist.concat([{ role: 'user', parts: [
  { text: 'O cliente enviou este audio. Entenda o que ele diz e responda de forma natural, seguindo suas instrucoes.' },
  { inline_data: { mime_type: prep.mime, data: base64 } }
] }]);
const geminiBody = { system_instruction: { parts: [{ text: prep.sysPrompt }] }, contents, generationConfig: { temperature: 0.85, maxOutputTokens: 800, thinkingConfig: { thinkingBudget: 0 } } };

const store = $getWorkflowStaticData('global');
if (!store.hist) store.hist = {};
const h = store.hist[prep.number] || [];
h.push({ role: 'user', parts: [{ text: '[o cliente enviou um audio]' }] });
store.hist[prep.number] = h.slice(-20);

return [{ json: { number: prep.number, geminiBody } }];
