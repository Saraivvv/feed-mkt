// ===== CEREBRO IA - Foajupe (menu + conversa com memoria) =====
// Versao que esta RODANDO no n8n (no de "Code in JavaScript" do workflow "Atendimento Foajupe").
// Fonte de verdade = n8n. Este arquivo e copia de referencia/backup.
//
// Fluxo: guarda historico por numero, monta o corpo (geminiBody) e decide o estado.
//   - estado 'inicio'   -> mostra menu (1 = nao cliente/vender, 2 = ja cliente)
//   - estado 'conversa' -> conversa com IA (texto/audio) com memoria
//   - estado 'humano'   -> bot fica mudo (handoff)
// Saidas usadas pelos IFs: precisaIA (Resposta pronta?), ehMidiaIA (Texto?), handoff (Caiu pro humano?).

const PROMPT_BASE = `Voce e o atendente virtual da Foajupe, uma empresa de Ribeirao Preto e regiao que ajuda pessoas a vender o veiculo mesmo com pendencias (financiamento em aberto, multas e IPVA atrasados, restricao/gravame, ou veiculos em busca e apreensao).

COMO VOCE FALA: como uma pessoa de verdade conversando no WhatsApp, leve, calorosa e nada formal. Portugues do Brasil, tom de bate-papo. Mensagens curtas (1 a 3 frases), pode quebrar em mais de uma linha. Use emojis com naturalidade pra deixar a conversa leve, 1 ou 2 por mensagem (ex: 😊 🚗 👍 🙌 😉 🤝). Varie o jeito de comecar as frases e NUNCA fique repetindo a mesma estrutura tipo 'Entendi, X. ... Voce poderia me dizer Y?'. Pode usar expressoes do dia a dia como beleza, show, pode deixar, fica tranquilo, massa. Evite formalidades engessadas tipo 'para que possamos dar andamento' ou 'poderia me informar'; fale simples, como gente fala. Chame a pessoa pelo nome de vez em quando, sem forcar. Muita gente chega preocupada ou com vergonha da divida, entao acolhe e passa seguranca, sem soar comercial demais.

O QUE A FOAJUPE FAZ: na maioria dos casos compra o veiculo do cliente (paga em dinheiro, via PIX ou transferencia, na hora do tramite em cartorio) e depois revende; assume em contrato o compromisso de quitar o saldo devedor junto ao banco.

COMO FUNCIONA: 1) conversa e fotos do veiculo; 2) analise se faz sentido comprar; 3) se sim, visita para ver o carro; 4) visita ok, compra efetuada com pagamento no ato; 5) toda a burocracia (quitacao, documentacao, transferencia) fica com a Foajupe.

CUSTOS: nao ha taxa para quem vende; o custo de procuracao e da Foajupe; o cliente paga apenas o custo de assinatura no cartorio.
DOCUMENTOS (na venda): CRLV/DUT, identidade, documento do veiculo, procuracao em cartorio e contrato de compra e venda.
SEGURANCA: tempo de mercado, assume a divida em contrato (jogo limpo, sem letras miudas), compra realmente a divida.
SERASA/SPC: se a unica divida do cliente for o veiculo vendido, o nome fica limpo apos a quitacao (a depender da negociacao com o banco); o cliente e informado do prazo medio.
PRAZO: varia conforme a negociacao (feita por humano).

REGRAS: NUNCA fale valores nem estimativa de quanto a pessoa vai receber (depende da avaliacao; o especialista retorna com um valor justo). Nunca invente informacao fora disto; se nao souber, diga que vai verificar com um atendente. Se a pessoa quiser, pode indicar o site oficial: https://foajupe-site.vercel.app/.

ENCAMINHAMENTO: quando precisar passar para um atendente humano, escreva uma frase natural avisando e termine sua resposta com a marca [ENCAMINHAR] sozinha na ultima linha. Nunca explique essa marca ao cliente.`;

function sysPromptDe(perfil) {
  let ctx = '';
  if (perfil === 'cliente') {
    ctx = '\n\nCONTEXTO: este cliente disse que JA e cliente / ja esta negociando com a Foajupe. Pergunte de forma acolhedora como pode ajudar. Para status do processo, valores ou assuntos especificos do caso dele, encaminhe para o atendente humano com [ENCAMINHAR].';
  } else {
    ctx = '\n\nCONTEXTO: este cliente quer VENDER um veiculo com pendencia. Conduza a qualificacao de forma natural ao longo da conversa: nome, modelo e ano, tipo de pendencia, valor da divida (se souber), cidade, e peca fotos do veiculo. Depois de saber modelo/ano + pendencia + cidade, PECA as fotos do veiculo e AGUARDE o envio (NAO use [ENCAMINHAR] na mesma mensagem em que pede as fotos; as fotos vao acionar o encaminhamento sozinhas). Use [ENCAMINHAR] apenas se a pessoa pedir um atendente humano, ou se ela disser que nao tem como mandar fotos agora.';
  }
  return PROMPT_BASE + ctx;
}

const item = $input.first().json;
const data = item.body.data;
if (data.key?.fromMe === true) { return []; }

const remoteJid = data.key.remoteJid;
const number = remoteJid.split('@')[0];
const messageType = data.messageType || '';
const texto = (
  data.message?.conversation ||
  data.message?.extendedTextMessage?.text ||
  ''
).trim();
const opcao = texto.replace(/[^0-9]/g, '');
const tl = texto.toLowerCase();

const store = $getWorkflowStaticData('global');
if (!store.hist) store.hist = {};
if (!store.estado) store.estado = {};
if (!store.perfil) store.perfil = {};

const base = { number, precisaIA: false, ehMidiaIA: false, resposta: '', handoff: false, geminiBody: null, sysPrompt: '', hist: [], mime: '', messageId: '' };

const SEP = '\n------------------\n';
const menu =
  'Olá! 🚗 Bem-vindo(a) à *Foajupe*!\n' +
  'A gente ajuda você a *vender seu veículo mesmo com pendência* — financiamento, multas/IPVA, restrição/gravame ou busca e apreensão.\n\n' +
  'Você já é nosso cliente?\n\n' +
  '• *1* - Não, quero vender meu veículo' + SEP +
  '• *2* - Sim, já estou negociando com vocês';

if (texto === '0' || tl === 'menu' || tl === 'reiniciar') {
  store.hist[number] = [];
  store.estado[number] = 'inicio';
  store.perfil[number] = '';
  return [{ json: { ...base, resposta: menu } }];
}

if (store.estado[number] === 'humano') { return []; }

const estado = store.estado[number] || 'inicio';

if (estado === 'inicio') {
  let perfil = '';
  let abertura = '';
  if (opcao === '1') { perfil = 'vender'; abertura = '(O cliente escolheu no menu: NAO sou cliente, quero vender meu veiculo.)'; }
  else if (opcao === '2') { perfil = 'cliente'; abertura = '(O cliente escolheu no menu: SIM, ja sou cliente / ja estou negociando.)'; }
  else { return [{ json: { ...base, resposta: menu } }]; }

  store.estado[number] = 'conversa';
  store.perfil[number] = perfil;
  const hist = [{ role: 'user', parts: [{ text: abertura }] }];
  store.hist[number] = hist;
  const sysPrompt = sysPromptDe(perfil);
  const geminiBody = { system_instruction: { parts: [{ text: sysPrompt }] }, contents: hist, generationConfig: { temperature: 0.85, maxOutputTokens: 800, thinkingConfig: { thinkingBudget: 0 } } };
  return [{ json: { ...base, precisaIA: true, geminiBody } }];
}

const perfil = store.perfil[number] || 'vender';
const sysPrompt = sysPromptDe(perfil);
let hist = store.hist[number] || [];

if (messageType === 'imageMessage') {
  hist.push({ role: 'user', parts: [{ text: '[cliente enviou fotos do veiculo]' }] });
  store.hist[number] = hist.slice(-20);
  store.estado[number] = 'humano';
  return [{ json: { ...base, resposta: 'Recebi suas fotos, muito obrigado! 📸 Vou passar aqui pro nosso especialista analisar e já te retornamos. 🙌', handoff: true } }];
}

if (messageType === 'audioMessage') {
  const mime = (data.message?.audioMessage?.mimetype || 'audio/ogg').split(';')[0].trim();
  return [{ json: { ...base, precisaIA: true, ehMidiaIA: true, mime, sysPrompt, hist } }];
}

if (['videoMessage', 'documentMessage', 'stickerMessage'].includes(messageType)) {
  return [{ json: { ...base, resposta: 'Por enquanto consigo entender texto, áudio e fotos 🙂. Pode mandar por um desses?' } }];
}

// Ignora eventos de protocolo/wrapper do WhatsApp (albumMessage, reactionMessage, etc.)
if (messageType && messageType !== 'conversation' && messageType !== 'extendedTextMessage') {
  return [];
}

if (!texto) { return []; }
hist.push({ role: 'user', parts: [{ text: texto.slice(0, 1000) }] });
hist = hist.slice(-20);
store.hist[number] = hist;
const geminiBody = { system_instruction: { parts: [{ text: sysPrompt }] }, contents: hist, generationConfig: { temperature: 0.85, maxOutputTokens: 800, thinkingConfig: { thinkingBudget: 0 } } };
return [{ json: { ...base, precisaIA: true, geminiBody } }];
