// ===== CÉREBRO DO MENU - Ótica SANRE (Fase 3 + áudio/imagem) =====
// Vai DENTRO do nó "Code in JavaScript".
// - Detecta mídia (áudio/imagem). Só processa mídia no estado "tirar_duvidas".
// - Para mídia: marca ehMidiaIA=true e guarda messageId + mimeLimpo + instrucao.
//   (o n8n vai baixar a mídia depois e mandar pro Gemini multimodal)
// - Travas: LIMITE_IA=10 por sessão; pergunta de texto cortada em 500 chars.

const item = $input.first().json;
const data = item.body.data;
const remoteJid = data.key.remoteJid;
const number = remoteJid.split('@')[0];

const textoBruto = (
  data.message?.conversation ||
  data.message?.extendedTextMessage?.text ||
  ''
).trim();

const opcao = textoBruto.replace(/[^0-9]/g, '');
const textoMinusculo = textoBruto.toLowerCase();
const messageType = data.messageType || '';
const ehMidia = ['audioMessage', 'imageMessage', 'videoMessage', 'documentMessage', 'stickerMessage'].includes(messageType);

const store = $getWorkflowStaticData('global');
if (!store.estados) store.estados = {};
if (!store.contadores) store.contadores = {};
let estado = store.estados[number] || 'inicio';

const menuPrincipal =
  'Olá! 👓 Seja bem-vindo(a) à *Ótica SANRE*!\n\n' +
  'Você já é nosso cliente?\n\n' +
  '*1* - Já sou cliente\n' +
  '*2* - Não sou cliente';

const menuCliente =
  'Que bom te ver! 😊 Como posso ajudar?\n\n' +
  '*1* - Entrega de óculos\n' +
  '*2* - Manutenção de óculos\n' +
  '*3* - Falar com atendente\n\n' +
  '_(digite *0* para voltar ao início)_';

const menuNaoCliente =
  'Legal ter você por aqui! 👓 O que você precisa?\n\n' +
  '*1* - Comprar online (site e marketplace)\n' +
  '*2* - Tirar dúvidas\n' +
  '*3* - Falar com atendente\n\n' +
  '_(digite *0* para voltar ao início)_';

let resposta = '';
let responder = true;
let precisaIA = false;
let pergunta = '';
let ehMidiaIA = false;
let messageId = '';
let mimeLimpo = '';
let instrucao = '';

if (opcao === '0' || textoMinusculo === 'menu') {
  estado = 'inicio';
  store.contadores[number] = 0;
}

// Mídia fora do "tirar dúvidas": orienta a pessoa
if (ehMidia && estado !== 'tirar_duvidas') {
  store.estados[number] = estado;
  return [{ json: { number, resposta: 'Recebi seu arquivo 📎! Para eu analisar um *áudio* ou *foto* (ex: sua receita), entre primeiro em *Tirar dúvidas*. Ou digite *3* para falar com um atendente.\n\n_(digite 0 para voltar ao menu)_', estado, precisaIA: false, pergunta: '', ehMidiaIA: false, messageId: '', mimeLimpo: '', instrucao: '' } }];
}

if (estado === 'inicio') {
  if (opcao === '1') { resposta = menuCliente; estado = 'menu_cliente'; }
  else if (opcao === '2') { resposta = menuNaoCliente; estado = 'menu_nao_cliente'; }
  else { resposta = menuPrincipal; estado = 'menu_principal'; }
} else if (estado === 'menu_principal') {
  if (opcao === '1') { resposta = menuCliente; estado = 'menu_cliente'; }
  else if (opcao === '2') { resposta = menuNaoCliente; estado = 'menu_nao_cliente'; }
  else { resposta = 'Não entendi. 😅\n\n' + menuPrincipal; }
} else if (estado === 'menu_cliente') {
  if (opcao === '1') { resposta = 'Certo! Para verificar a *entrega do seu óculos*, me informe seu *nome completo*. Em seguida um atendente confirma o status pra você. 👓'; estado = 'aguardando_atendente'; }
  else if (opcao === '2') { resposta = 'Entendi, *manutenção*. 🔧 Me conta rapidinho o que está acontecendo (ex: parafuso solto, lente riscada, armação torta) que já encaminho a um atendente.'; estado = 'aguardando_atendente'; }
  else if (opcao === '3') { resposta = 'Beleza! Vou te transferir para um atendente. Aguarde um instante, por favor. 🙋'; estado = 'aguardando_atendente'; }
  else { resposta = 'Não entendi. 😅\n\n' + menuCliente; }
} else if (estado === 'menu_nao_cliente') {
  if (opcao === '1') { resposta = 'Você pode comprar pelos nossos canais:\n\n🛒 Site: [LINK_SITE]\n🛍️ Marketplace: [LINK_MARKETPLACE]\n\nQualquer dúvida, é só chamar! Digite *0* para voltar.'; estado = 'inicio'; }
  else if (opcao === '2') { resposta = 'Pode mandar sua dúvida por *texto, áudio ou foto* que eu te ajudo! 😊'; estado = 'tirar_duvidas'; store.contadores[number] = 0; }
  else if (opcao === '3') { resposta = 'Beleza! Vou te transferir para um atendente. Aguarde um instante, por favor. 🙋'; estado = 'aguardando_atendente'; }
  else { resposta = 'Não entendi. 😅\n\n' + menuNaoCliente; }
} else if (estado === 'tirar_duvidas') {
  const LIMITE_IA = 10;
  store.contadores[number] = (store.contadores[number] || 0) + 1;
  if (store.contadores[number] > LIMITE_IA) {
    resposta = 'Acho melhor te conectar com um atendente humano pra te ajudar melhor. 🙋 Aguarde um instante!\n\n_(ou digite *0* para voltar ao menu)_';
    estado = 'aguardando_atendente';
    store.contadores[number] = 0;
  } else if (ehMidia) {
    messageId = data.key.id;
    if (messageType === 'audioMessage') {
      precisaIA = true; ehMidiaIA = true;
      mimeLimpo = (data.message?.audioMessage?.mimetype || 'audio/ogg').split(';')[0].trim();
      instrucao = 'O cliente enviou este áudio. Entenda o que ele quer e responda como atendente da Ótica SANRE.';
    } else if (messageType === 'imageMessage') {
      precisaIA = true; ehMidiaIA = true;
      mimeLimpo = (data.message?.imageMessage?.mimetype || 'image/jpeg').split(';')[0].trim();
      instrucao = 'O cliente enviou esta imagem (pode ser uma receita de óculos ou foto de um produto). Analise e responda como atendente da Ótica SANRE.';
    } else {
      resposta = 'Recebi seu arquivo 📎, mas no momento consigo entender só *áudio* e *foto*. Pode mandar por texto, áudio ou foto? _(digite 0 para voltar)_';
    }
  } else {
    precisaIA = true;
    pergunta = textoBruto.slice(0, 500);
  }
} else if (estado === 'aguardando_atendente') {
  responder = false;
} else {
  resposta = menuPrincipal;
  estado = 'menu_principal';
}

store.estados[number] = estado;

if (!responder) { return []; }

return [{ json: { number, resposta, estado, precisaIA, pergunta, ehMidiaIA, messageId, mimeLimpo, instrucao } }];
