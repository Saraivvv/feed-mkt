// ===== CÉREBRO DO MENU - Ótica SANRE (Fase 2) =====
// Este código vai DENTRO de um nó "Code" do n8n, entre o filtro e o envio.
// Ele lê a mensagem, lembra em que passo a pessoa está (memória da conversa,
// guardada no banco do próprio n8n - NÃO é CRM) e decide a resposta.

// Lê a mensagem que chegou
const item = $input.first().json;
const data = item.body.data;
const remoteJid = data.key.remoteJid;
const number = remoteJid.split('@')[0];

// Texto da mensagem (cobre texto simples e texto "estendido")
const textoBruto = (
  data.message?.conversation ||
  data.message?.extendedTextMessage?.text ||
  ''
).trim();

// Pega só os dígitos (pra reconhecer "1", "2", "3"...)
const opcao = textoBruto.replace(/[^0-9]/g, '');
const textoMinusculo = textoBruto.toLowerCase();

// ===== MEMÓRIA DA CONVERSA (estado por número) =====
const store = $getWorkflowStaticData('global');
if (!store.estados) store.estados = {};
let estado = store.estados[number] || 'inicio';

// ===== TEXTOS DOS MENUS =====
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
let responder = true; // se false, o robô fica calado (ex: já com humano)

// Atalho global: "0" ou "menu" volta ao início
if (opcao === '0' || textoMinusculo === 'menu') {
  estado = 'inicio';
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
  if (opcao === '1') {
    resposta = 'Certo! Para verificar a *entrega do seu óculos*, me informe seu *nome completo*. Em seguida um atendente confirma o status pra você. 👓';
    estado = 'aguardando_atendente';
  } else if (opcao === '2') {
    resposta = 'Entendi, *manutenção*. 🔧 Me conta rapidinho o que está acontecendo (ex: parafuso solto, lente riscada, armação torta) que já encaminho a um atendente.';
    estado = 'aguardando_atendente';
  } else if (opcao === '3') {
    resposta = 'Beleza! Vou te transferir para um atendente. Aguarde um instante, por favor. 🙋';
    estado = 'aguardando_atendente';
  } else {
    resposta = 'Não entendi. 😅\n\n' + menuCliente;
  }
} else if (estado === 'menu_nao_cliente') {
  if (opcao === '1') {
    resposta = 'Você pode comprar pelos nossos canais:\n\n🛒 Site: [LINK_SITE]\n🛍️ Marketplace: [LINK_MARKETPLACE]\n\nQualquer dúvida, é só chamar! Digite *0* para voltar.';
    estado = 'inicio';
  } else if (opcao === '2') {
    resposta = 'Pode mandar sua dúvida que eu te ajudo! 😊';
    estado = 'tirar_duvidas';
  } else if (opcao === '3') {
    resposta = 'Beleza! Vou te transferir para um atendente. Aguarde um instante, por favor. 🙋';
    estado = 'aguardando_atendente';
  } else {
    resposta = 'Não entendi. 😅\n\n' + menuNaoCliente;
  }
} else if (estado === 'tirar_duvidas') {
  // FASE 3 vai ligar a IA (Gemini) aqui. Por enquanto, encaminha.
  resposta = 'Anotei sua dúvida! Em breve um atendente responde. 🙏\n_(Em breve nossa IA vai responder na hora 🤖)_';
  estado = 'aguardando_atendente';
} else if (estado === 'aguardando_atendente') {
  // Já está na fila do humano: o robô fica calado pra não atrapalhar.
  responder = false;
} else {
  resposta = menuPrincipal;
  estado = 'menu_principal';
}

// Salva o novo estado
store.estados[number] = estado;

// Se for pra ficar calado, não manda nada pro próximo nó
if (!responder) {
  return [];
}

return [{ json: { number, resposta, estado } }];
