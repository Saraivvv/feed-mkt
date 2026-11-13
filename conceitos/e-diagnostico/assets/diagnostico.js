// ponytail: escala editorial sem validação empírica; recalibrar com diagnósticos reais antes de tratar as faixas como evidência de desempenho.
// Todas as regras da leitura ficam aqui. Pontos medem atenção, não desempenho.
const REGRAS = {
  versao: 'gargalo-conceito-1',
  escala: 10, pontosMaximos: 3,
  // Empate: primeiro a autonomia, depois o atendimento e o restante da jornada.
  desempate: ['dono', 'atendimento', 'vendas', 'presenca', 'atracao'],
  faixas: [{ ate: 3, texto: 'Poucos sinais' }, { ate: 6, texto: 'Vale organizar' }, { ate: 10, texto: 'Atenção primeiro' }],
  areas: {
    atendimento: { nome: 'Atendimento', leitura: 'O primeiro contato está pedindo atenção. O tempo de resposta e o que acontece fora do horário podem deixar conversas sem continuidade.', hoje: 'Abra as conversas de ontem no WhatsApp. Veja quem ficou sem resposta e combine quem assume essas mensagens. Ajuste também o aviso de ausência.', feed: 'A Feed instala um Agente de IA no WhatsApp para atender 24 horas e passar a conversa para a equipe quando precisar.' },
    atracao: { nome: 'Atração de clientes', leitura: 'Falta clareza sobre a chegada de novos clientes. Antes de colocar mais dinheiro em divulgação, vale entender o que já traz conversas de verdade.', hoje: 'Pergunte aos próximos clientes como conheceram a empresa. Anote a origem junto do contato, inclusive quando vier de anúncio.', feed: 'A Feed cuida dos anúncios no Meta e no Google, conecta os contatos ao atendimento e acompanha o caminho até a venda.' },
    presenca: { nome: 'Presença', leitura: 'Quem procura sua empresa pode encontrar informações incompletas ou desatualizadas. Vale cuidar do que a pessoa vê antes de chamar.', hoje: 'Confira o telefone, os horários e o que você vende no Instagram e no Google Meu Negócio. Corrija uma informação que esteja faltando hoje.', feed: 'A Feed cuida das redes sociais, do Google Meu Negócio e da identidade visual para a empresa se apresentar com clareza.' },
    vendas: { nome: 'Vendas e acompanhamento', leitura: 'As conversas chegam, mas o próximo passo nem sempre fica combinado. Quem pediu orçamento pode acabar esquecido entre outras mensagens.', hoje: 'Separe os orçamentos ainda sem resposta. Para cada um, anote a próxima ação, uma data e quem vai cuidar dela.', feed: 'A Feed organiza o funil de vendas e o CRM, o acompanhamento de quem sumiu e a proposta em PDF pelo celular.' },
    dono: { nome: 'Dependência do dono', leitura: 'A rotina ainda passa muito por você. Quando informação e decisão ficam na mesma pessoa, a equipe precisa esperar para seguir.', hoje: 'Escolha uma tarefa que sempre volta para você. Escreva como fazê-la e o que a equipe pode decidir sem pedir sua aprovação.', feed: 'A Feed organiza a rotina com a equipe, automatiza o que fizer sentido e reúne atendimento, vendas e aprovações no app Feed Hub.' }
  },
  perguntas: [
    { id: 'resposta', area: 'Atendimento', titulo: 'Quando alguém chama no WhatsApp, o que acontece?', ajuda: 'Pense no horário de trabalho e também à noite ou no fim de semana.',
      // Peso 2: é a evidência direta de atendimento. Q3 complementa com peso 1.
      pesos: { atendimento: 2 }, opcoes: [
        { texto: 'Recebe ajuda em minutos, mesmo fora do horário.', pontos: { atendimento: 0 } },
        { texto: 'Em minutos no expediente. Fora dele, só no próximo dia.', pontos: { atendimento: 1 } },
        { texto: 'Espera algumas horas. Fora do horário, fica para depois.', pontos: { atendimento: 2 } },
        { texto: 'Às vezes passa um dia ou a mensagem fica sem resposta.', pontos: { atendimento: 3 } }
      ] },
    { id: 'origem', area: 'Chegada dos clientes', titulo: 'De onde vêm os novos contatos?', ajuda: 'Escolha o caminho que mais acontece hoje.',
      // Peso 1: indicação não é um problema. Só ausência de procura ou de registro pontua.
      pesos: { atracao: 1 }, opcoes: [
        { texto: 'Principalmente de indicações e de quem já compra.', pontos: { atracao: 0 } },
        { texto: 'Do Instagram, do Google ou do nosso site.', pontos: { atracao: 0 } },
        { texto: 'Dos anúncios que a empresa faz.', pontos: { atracao: 0 } },
        { texto: 'Quase ninguém novo procura a empresa.', pontos: { atracao: 3 } },
        { texto: 'Não sei dizer de onde vêm.', pontos: { atracao: 2 } }
      ] },
    { id: 'perda', area: 'Caminho até a venda', titulo: 'Em que ponto a conversa costuma parar?', ajuda: 'Marque o que você mais percebe. Não precisa ter números.',
      // Peso 1 por área: localiza a perda sem contar a mesma evidência como duas principais.
      pesos: { atendimento: 1, vendas: 1 }, opcoes: [
        { texto: 'Antes de alguém conseguir responder ao cliente.', pontos: { atendimento: 3, vendas: 0 } },
        { texto: 'Depois de enviar o preço ou o orçamento.', pontos: { atendimento: 0, vendas: 3 } },
        { texto: 'Não sei. As conversas ficam espalhadas.', pontos: { atendimento: null, vendas: 2 } },
        { texto: 'A gente acompanha até fechar ou ouvir um não.', pontos: { atendimento: 0, vendas: 0 } }
      ] },
    { id: 'retorno', area: 'Acompanhamento', titulo: 'O cliente pediu preço e sumiu. E agora?', ajuda: 'Como isso funciona na prática, em uma semana comum?',
      // Peso 2: acompanhamento é evidência direta da área de vendas.
      pesos: { vendas: 2 }, opcoes: [
        { texto: 'Tem alguém e uma data para retomar a conversa.', pontos: { vendas: 0 } },
        { texto: 'Chamamos de novo quando alguém lembra.', pontos: { vendas: 2 } },
        { texto: 'Esperamos o cliente voltar por conta própria.', pontos: { vendas: 3 } },
        { texto: 'Não sabemos quem ficou sem retorno.', pontos: { vendas: 3 } }
      ] },
    { id: 'presenca', area: 'Instagram e Google', titulo: 'O que a pessoa encontra quando procura sua empresa?', ajuda: 'Pense no Instagram e no Google Meu Negócio, se ele fizer sentido para sua empresa.',
      pesos: { presenca: 1 }, opcoes: [
        { texto: 'Os canais que usamos estão claros e atualizados.', pontos: { presenca: 0 } },
        { texto: 'Um canal está cuidado. O outro ficou para trás.', pontos: { presenca: 1 } },
        { texto: 'Perfis parados ou informações que precisam mudar.', pontos: { presenca: 2 } },
        { texto: 'É difícil encontrar a empresa ou entender o que vende.', pontos: { presenca: 3 } }
      ] },
    { id: 'anuncios', area: 'Divulgação', titulo: 'Como vocês lidam com anúncios?', ajuda: 'Não anunciar não é um problema por si só.',
      // Peso 1, igual à origem. Não prescreve tráfego pago a quem já tem procura suficiente.
      pesos: { atracao: 1 }, opcoes: [
        { texto: 'Anunciamos e sabemos quais contatos viram vendas.', pontos: { atracao: 0 } },
        { texto: 'Anunciamos, mas não sabemos o que vira venda.', pontos: { atracao: 3 } },
        { texto: 'Não anunciamos. A procura atual é suficiente.', pontos: { atracao: 0 } },
        { texto: 'Não anunciamos e precisamos de mais procura.', pontos: { atracao: 2 } }
      ] },
    { id: 'contatos', area: 'Organização', titulo: 'Onde ficam os contatos e o próximo passo de cada venda?', ajuda: 'Vale o que a equipe realmente usa, não só o que está instalado.',
      // Peso 1: registro complementa vendas e autonomia, sem dominar essas áreas.
      pesos: { vendas: 1, dono: 1 }, opcoes: [
        { texto: 'Num sistema que a equipe mantém atualizado.', pontos: { vendas: 0, dono: 0 } },
        { texto: 'Numa planilha compartilhada e atualizada.', pontos: { vendas: 0, dono: 0 } },
        { texto: 'Em caderno ou conversas espalhadas no WhatsApp.', pontos: { vendas: 2, dono: 2 } },
        { texto: 'Na minha cabeça ou só no meu celular.', pontos: { vendas: 3, dono: 3 } }
      ] },
    { id: 'ausencia', area: 'Dependência do dono', titulo: 'Se você se afasta por alguns dias, a empresa...', ajuda: 'Pense em atendimento, orçamento e decisões do dia a dia.',
      // Peso 3: ausência é o sinal mais direto de dependência; pesa mais que o local do registro.
      pesos: { dono: 3 }, opcoes: [
        { texto: 'Segue. A equipe sabe o que pode decidir.', pontos: { dono: 0 } },
        { texto: 'Segue, mas algumas decisões esperam por mim.', pontos: { dono: 1 } },
        { texto: 'Me chama o tempo todo para conseguir andar.', pontos: { dono: 2 } },
        { texto: 'Para quase tudo até eu voltar.', pontos: { dono: 3 } }
      ] }
  ]
};

const app = document.querySelector('#app');
const respostas = {};
let etapa = 0;
let tela = 'abertura';
let contato = { nome: '', email: '', whatsapp: '', consentimento: false };
let ultimoPayload = null;
const abertura = app.innerHTML;
const escapar = valor => String(valor).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
const faixa = nota => REGRAS.faixas.find(f => nota <= f.ate).texto;

function calcular() {
  const somas = Object.fromEntries(Object.keys(REGRAS.areas).map(id => [id, { pontos: 0, peso: 0 }]));
  for (const q of REGRAS.perguntas) {
    const opcao = q.opcoes[respostas[q.id]];
    if (!opcao) continue;
    for (const [id, peso] of Object.entries(q.pesos)) {
      const valor = opcao.pontos[id];
      // null significa ausência de evidência. Não transforma desconhecimento em nota zero.
      if (valor == null) continue;
      somas[id].pontos += valor * peso;
      somas[id].peso += peso;
    }
  }
  const notas = Object.fromEntries(Object.entries(somas).map(([id, s]) => [id, s.peso ? Math.round(s.pontos / s.peso / REGRAS.pontosMaximos * REGRAS.escala) : null]));
  const ordem = [...REGRAS.desempate].sort((a,b) => (notas[b] ?? -1) - (notas[a] ?? -1));
  const principal = notas[ordem[0]] > 0 ? ordem[0] : null;
  const empatadas = principal ? ordem.filter(id => notas[id] === notas[principal]) : [];
  return { notas, principal, empatadas };
}

function mostrar(html, nome) {
  tela = nome;
  app.innerHTML = html;
  window.scrollTo({ top: 0, behavior: 'instant' });
  app.querySelector('h1')?.focus({ preventScroll: true });
}

function pergunta() {
  const q = REGRAS.perguntas[etapa];
  mostrar(`<section class="quiz"><div class="passos"><button class="voltar" data-acao="voltar">← Voltar</button><strong>Pergunta ${etapa+1} de ${REGRAS.perguntas.length}</strong></div>
    <progress max="8" value="${etapa}" aria-label="Perguntas respondidas">${etapa} de 8</progress>
    <div class="pergunta-grid"><div><p class="kicker">${q.area}</p><h1 tabindex="-1">${q.titulo}</h1><p class="ajuda">${q.ajuda}</p></div>
    <div><div class="opcoes" role="group" aria-label="Escolha uma resposta para avançar">${q.opcoes.map((o,i) => `<button class="opcao" data-resposta="${i}" aria-pressed="${respostas[q.id]===i}"><span aria-hidden="true">${String(i+1).padStart(2,'0')}</span><span>${o.texto}</span><span aria-hidden="true"></span></button>`).join('')}</div>
    <p class="teclado">Toque para responder e avançar. No teclado, use Tab e Enter.<br>Você pode voltar e mudar qualquer resposta.</p></div></div></section>`, 'pergunta');
}

function tituloResultado(r) { return r.principal ? REGRAS.areas[r.principal].nome : 'Nenhum gargalo evidente'; }

function resultado() {
  const r = calcular();
  const principal = REGRAS.areas[r.principal];
  const empate = r.empatadas.length > 1 ? ` Outras áreas com a mesma nota: ${r.empatadas.slice(1).map(id => REGRAS.areas[id].nome).join(', ')}. É um ponto de partida, não um problema único.` : '';
  mostrar(`<section class="resultado"><button class="voltar" data-acao="rever">← Rever respostas</button><div class="resultado-topo"><div class="resultado-titulo"><img class="marca-branca" src="assets/logo-branca.png" alt="Feed" width="80" height="28"><p class="kicker">Seu gargalo principal</p><h1 tabindex="-1">${tituloResultado(r)}</h1><p>${principal ? principal.leitura : 'Suas respostas não apontaram um gargalo claro nestas cinco áreas. Isso não garante que está tudo resolvido. Use os passos abaixo para conferir a rotina.'}${empate}</p></div>
    <div class="hoje"><p class="kicker">Um passo para hoje</p><h2>${principal ? 'Comece por aqui.' : 'Confira na prática.'}</h2><p>${principal ? principal.hoje : 'Escolha uma venda recente e acompanhe o caminho inteiro: de onde veio, quem respondeu e como terminou. Veja se a rotina confirma suas respostas.'}</p></div></div>
    <div class="notas-cabeca"><h2>Seu mapa de atenção.</h2><p>De 0 a 10. Quanto maior, mais atenção pede.</p></div>
    <div class="notas">${Object.entries(REGRAS.areas).map(([id,a]) => `<div class="nota ${id===r.principal?'principal':''}"><h3>${a.nome}</h3><div class="valor">${r.notas[id]}<small>/10</small></div><div class="medida" aria-hidden="true"><span style="width:${r.notas[id]*10}%"></span></div><small>${faixa(r.notas[id])}</small></div>`).join('')}</div>
    <details><summary>Como chegamos a essa leitura?</summary><div><p>É uma leitura inicial das suas respostas, não uma auditoria ou uma previsão de resultado. A nota mede sinais de atenção, não dinheiro perdido.</p><p>Cada resposta soma de 0 a 3 pontos. Fazemos a média com os pesos abaixo, dividimos por 3 e multiplicamos por 10. Arredondamos para um número inteiro. Até 3: poucos sinais. De 4 a 6: vale organizar. De 7 a 10: atenção primeiro.</p><p>Atendimento: resposta no WhatsApp (peso 2) e perda antes da resposta (1). Atração: origem dos contatos (1) e anúncios (1). Presença: perfis (1). Vendas: ponto de perda (1), retorno (2) e registro (1). Dependência: registro (1) e ausência do dono (3).</p><p>Não saber onde a conversa para deixa essa resposta fora da nota de atendimento. Indicação, planilha atualizada e não precisar anunciar não tiram pontos. O maior número define a prioridade. Em empate, a ordem é: dependência do dono, atendimento, vendas, presença e atração.</p></div></details>
    <div class="acoes-resultado"><button class="btn preto" data-acao="captura">Receber o PDF e olhar meu caso <span aria-hidden="true">↗</span></button><p>O resultado já é seu. Se quiser aprofundar, receba o material e peça ao Guilherme para olhar suas respostas.</p></div>
    <section class="areas" aria-labelledby="areas-titulo"><h2 id="areas-titulo">O que fazer em cada área.</h2>${Object.entries(REGRAS.areas).map(([id,a]) => `<article class="area-linha"><h3>${a.nome}</h3><p><span class="rotulo">Você pode fazer hoje</span>${a.hoje}</p><p><span class="rotulo">Como a Feed ajuda</span>${a.feed}</p></article>`).join('')}</section>
    <div class="acoes-resultado"><button class="btn linha" data-acao="captura">Quero aprofundar meu diagnóstico</button></div>${modoConceito()}</section>`, 'resultado');
}

function mensagemWhatsApp() {
  const r = calcular();
  return ['Olá, Guilherme. Respondi ao Diagnóstico do Gargalo da Feed.', contato.nome ? `Meu nome é ${contato.nome}.` : '', `Meu gargalo principal: ${tituloResultado(r)}.`, 'Notas de atenção (0 a 10, maior pede mais atenção):', ...Object.entries(REGRAS.areas).map(([id,a]) => `${a.nome}: ${r.notas[id]}/10`), '', 'Minhas respostas:', ...REGRAS.perguntas.map(q => `${q.titulo} ${q.opcoes[respostas[q.id]].texto}`), '', 'Quero conversar sobre meu caso e receber o PDF completo.'].filter(Boolean).join('\n');
}
function linkWhatsApp() { return 'https://wa.me/5516993020694?text=' + encodeURIComponent(mensagemWhatsApp()); }

function montarPayload() {
  const r = calcular();
  const respondidas = Object.fromEntries(REGRAS.perguntas.map(q => [q.id, { pergunta: q.titulo, opcao: respostas[q.id], resposta: q.opcoes[respostas[q.id]].texto }]));
  const metadados = { pageUrl: location.href, submittedAt: new Date().toISOString(), userAgent: navigator.userAgent };
  return {
    modo: 'conceito: nenhum envio',
    // Estes campos já são lidos pelo handler atual. priority satisfaz a validação existente.
    leadAtual: { company: '', market: '', stage: Object.values(respondidas).map(r => `${r.pergunta} ${r.resposta}`).join('\n'), digitalPresence: respondidas.presenca.resposta, priority: tituloResultado(r), ...metadados },
    diagnosticoAtual: { nome: contato.nome.trim(), email: contato.email.trim().toLowerCase(), site: '', ...metadados },
    // Novos campos: o handler atual de /api/lead ainda os ignora. Ver NOTAS.md.
    novosCamposLead: { nome: contato.nome.trim(), email: contato.email.trim().toLowerCase(), telefone: contato.whatsapp.replace(/\D/g,''), respostas: respondidas, resultado: { versao: REGRAS.versao, gargalo: r.principal, notas: r.notas, empatadas: r.empatadas }, consentimento: { aceito: contato.consentimento, versao: 'diagnostico-v1', finalidade: 'Receber o PDF e contato da Feed sobre este diagnóstico', registradoEm: contato.consentimento ? metadados.submittedAt : null, politica: 'https://agenciafeed.com/privacidade.html' } }
  };
}
function modoConceito() {
  return `<details class="modo"><summary>Modo conceito: ver JSON do envio</summary><div><p>Nenhum dado é enviado ou salvo fora desta página. Os blocos “Atual” mostram os campos aceitos hoje. Os campos novos precisam da migração descrita no NOTAS.md.</p><pre id="payload">${escapar(JSON.stringify(ultimoPayload || montarPayload(),null,2))}</pre></div></details>`;
}

function captura() {
  const r = calcular();
  mostrar(`<section class="captura"><button class="voltar" data-acao="resultado">← Voltar ao meu resultado</button><div class="captura-grid"><div><p class="kicker">Agora, se fizer sentido</p><h1 tabindex="-1">O próximo passo<br>pode ser <mark>mais leve.</mark></h1><p class="intro">Receba o Diagnóstico do Gargalo completo em PDF e peça ao Guilherme para olhar seu caso.</p><div class="recibo"><span class="rotulo">Seu ponto de partida</span><strong>${tituloResultado(r)}</strong><small>Suas respostas vão junto. Você não precisa contar tudo de novo.</small></div><p class="pdf-info">O PDF é um exercício complementar: 12 perguntas para olhar a dependência do dono, as tarefas repetidas, a marca e a capacidade de crescer. Ele não é um relatório personalizado das notas acima.</p><p class="preco">Planos a partir de R$ 997 por mês, valor final no diagnóstico. Receber o material não tem custo.</p></div>
    <div><form class="formulario" id="contato" novalidate><div class="campo"><label for="nome">Como podemos te chamar? <span>Obrigatório</span></label><input id="nome" name="nome" autocomplete="name" maxlength="100" required value="${escapar(contato.nome)}" placeholder="Seu nome" aria-describedby="erro"></div>
    <div class="campo"><label for="email">Seu e-mail <span>Obrigatório</span></label><input type="email" id="email" name="email" inputmode="email" autocomplete="email" maxlength="254" required value="${escapar(contato.email)}" placeholder="voce@empresa.com.br" aria-describedby="email-ajuda erro"><small id="email-ajuda">É por aqui que você recebe o PDF.</small></div>
    <div class="campo"><label for="whatsapp">WhatsApp com DDD <span>Opcional</span></label><input type="tel" id="whatsapp" name="whatsapp" autocomplete="tel" inputmode="tel" maxlength="24" value="${escapar(contato.whatsapp)}" placeholder="(16) 9 0000-0000" aria-describedby="whatsapp-ajuda erro"><small id="whatsapp-ajuda">Preencha se preferir conversar por lá.</small></div>
    <label class="consent"><input type="checkbox" id="consentimento" name="consentimento" required ${contato.consentimento?'checked':''} aria-describedby="erro"><span>Autorizo a Feed a usar meu nome, contato e respostas para enviar o PDF e conversar comigo sobre este diagnóstico. Posso retirar essa autorização.</span></label><a class="politica" href="https://agenciafeed.com/privacidade.html" target="_blank" rel="noopener noreferrer">Ler a Política de Privacidade ↗</a>
    <p class="erro" id="erro" role="alert"></p><button class="btn preto" type="submit">Receber PDF e pedir uma análise <span aria-hidden="true">↗</span></button><p class="aviso-conceito">Demonstração: este botão simula o envio.</p></form>
    <div class="contato-direto"><a class="btn linha" id="whatsapp-link" href="${linkWhatsApp()}" target="_blank" rel="noopener noreferrer">Prefiro levar meu resultado ao WhatsApp ↗</a><p>Abre o WhatsApp com uma mensagem pronta. Você decide se envia.<br>Equipe: segunda a sexta, das 8h às 20h.</p></div></div></div>${modoConceito()}</section>`, 'captura');
}

function confirmar() {
  mostrar(`<section class="confirmacao"><div class="placa"><p class="kicker">Conceito · envio simulado</p><h1 tabindex="-1">Seu próximo passo<br>está aqui.</h1><p class="intro">${escapar(contato.nome.split(/\s+/)[0])}, nesta demonstração nada foi enviado. O PDF já pode ser baixado, e seu resultado continua disponível.</p></div>
    <div class="passo"><span>01</span><div><h2>Abra o material completo.</h2><p>Na versão real, o PDF irá para <strong>${escapar(contato.email)}</strong>. Aqui, use a cópia local do material atual.</p><a class="btn preto" href="assets/diagnostico-do-gargalo.pdf" download>Baixar Diagnóstico do Gargalo ↓</a></div></div>
    <div class="passo"><span>02</span><div><h2>Traga seu caso para a conversa.</h2><p>Na versão real, Guilherme receberá suas respostas e o contato para olhar o caso. Se preferir, leve agora seu resultado ao WhatsApp.</p><a class="btn linha" href="${linkWhatsApp()}" target="_blank" rel="noopener noreferrer">Conversar no WhatsApp ↗</a><p class="horario">A equipe atende de segunda a sexta, das 8h às 20h. Nenhuma conversa foi agendada.</p></div></div>
    <button class="voltar" data-acao="resultado">← Voltar ao meu resultado</button>${modoConceito()}</section>`, 'confirmacao');
}

app.addEventListener('click', e => {
  if (e.target.closest('#comecar')) { etapa=0; pergunta(); return; }
  const opcao = e.target.closest('[data-resposta]');
  if (opcao && tela==='pergunta') {
    respostas[REGRAS.perguntas[etapa].id] = Number(opcao.dataset.resposta);
    ultimoPayload = null;
    if (etapa < REGRAS.perguntas.length-1) { etapa++; pergunta(); } else resultado();
    return;
  }
  const acao = e.target.closest('[data-acao]')?.dataset.acao;
  if (acao==='voltar') { if (etapa>0) { etapa--; pergunta(); } else mostrar(abertura,'abertura'); }
  if (acao==='rever') { etapa=REGRAS.perguntas.length-1; pergunta(); }
  if (acao==='resultado') resultado();
  if (acao==='captura') captura();
});
app.addEventListener('input', e => {
  if (tela!=='captura' || !e.target.closest('form')) return;
  contato[e.target.name] = e.target.type==='checkbox' ? e.target.checked : e.target.value;
  ultimoPayload = null;
  e.target.removeAttribute('aria-invalid');
  document.querySelector('#payload').textContent=JSON.stringify(montarPayload(),null,2);
  document.querySelector('#whatsapp-link').href=linkWhatsApp();
});
app.addEventListener('submit', e => {
  e.preventDefault();
  const form = e.target;
  const telefone = contato.whatsapp.replace(/\D/g,'');
  let invalido;
  let erro;
  if (!contato.nome.trim()) { invalido='nome'; erro='Conte como podemos te chamar.'; }
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contato.email.trim())) { invalido='email'; erro='Confira seu e-mail para receber o PDF.'; }
  else if (contato.whatsapp.trim() && !/^(?:55)?[1-9]{2}9?\d{8}$/.test(telefone)) { invalido='whatsapp'; erro='Confira o WhatsApp com DDD ou deixe esse campo vazio.'; }
  else if (!contato.consentimento) { invalido='consentimento'; erro='Marque a autorização para pedir o PDF e a análise do caso.'; }
  if (erro) { form.querySelector('#erro').textContent=erro; form.elements[invalido].setAttribute('aria-invalid','true'); form.elements[invalido].focus(); return; }
  contato.nome=contato.nome.trim(); contato.email=contato.email.trim().toLowerCase();
  ultimoPayload = montarPayload();
  // Conceito intencionalmente sem fetch, armazenamento ou envio de e-mail.
  confirmar();
});
