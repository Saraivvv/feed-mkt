const NOME_ASSISTENTE = 'Config AI';
// Tempos em ms: pausas variadas, leitura de duas linhas em ~1,5 a 2 s e movimentos sem salto.
const RITMO = {
  pensando: [1200, 1800], caractere: 14, virgula: 90, ponto: 160,
  pergunta: 400, entrada: 460, selecao: 200, envio: 500, recolher: 420,
  final: [7000, 10000], reduzido: 35, finalReduzido: 400,
  easing: 'cubic-bezier(.22,.8,.24,1)'
};
const $ = s => document.querySelector(s);
const escapar = v => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const reduzido = matchMedia('(prefers-reduced-motion: reduce)');
const esperar = ms => new Promise(r => setTimeout(r, ms));
const respostas = {}, detalhes = {};
let etapa = -1, selecionadas = [], livre = false, ocupado = false, ultimoPayload = null;
let contato = { nome: '', email: '', whatsapp: '', consentimento: false };
let completarFala = null, seguindo = true, toqueY = 0, manterReserva = false;
const duracao = ms => reduzido.matches ? RITMO.reduzido : ms;
const variar = ([min, max]) => min + Math.random() * (max - min);
const movimento = (el, quadros, ms) => el.animate(quadros, { duration: duracao(ms), easing: RITMO.easing }).finished;
document.documentElement.style.setProperty('--entrada', `${RITMO.entrada}ms`);
document.documentElement.style.setProperty('--selecao', `${RITMO.selecao}ms`);
document.querySelectorAll('[data-nome]').forEach(el => el.textContent = NOME_ASSISTENTE);
const autor = () => `<div class="autor"><span class="marca" aria-hidden="true">↗</span>${escapar(NOME_ASSISTENTE)}</div>`;
const INTRO = `Oi, sou o ${NOME_ASSISTENTE}, o assistente da Feed. Vamos olhar onde sua operação trava? São 8 respostas, em cerca de 3 minutos. Você recebe o diagnóstico antes de eu pedir qualquer contato.`;

// As falas deste conceito são roteirizadas. Nenhuma chamada de IA acontece aqui.
const ROTULOS = [
  [['Em poucos minutos','Inclusive à noite e no fim de semana.'],['Rápido, no expediente','Fora do horário, só no próximo dia.'],['Demora algumas horas','Fora do horário, fica para depois.'],['Às vezes, nem respondemos','Pode passar um dia ou ficar sem resposta.']],
  [['Indicações e clientes','Quem já conhece traz novos contatos.'],['Instagram, Google ou site','A pessoa encontra a empresa por ali.'],['Anúncios','A divulgação paga traz contatos.'],['Outro cenário','Pouca procura ou origem desconhecida.']],
  [['Antes da resposta','O contato para antes de ser atendido.'],['Depois do orçamento','O preço vai, a conversa não continua.'],['Não consigo acompanhar','As conversas ficam espalhadas.'],['Até uma decisão','Acompanhamos até fechar ou ouvir um não.']],
  [['Tem responsável e data','Alguém sabe quando chamar de novo.'],['Quando alguém lembra','A retomada depende da memória.'],['Esperamos ele voltar','Não costumamos chamar de novo.'],['Não sabemos quem sumiu','Falta uma lista de quem ficou sem retorno.']],
  [['Tudo claro e atualizado','Os canais que usamos estão cuidados.'],['Um canal ficou para trás','O outro está em dia.'],['Informações desatualizadas','Perfis parados ou dados que precisam mudar.'],['É difícil nos encontrar','Ou entender o que a empresa vende.']],
  [['Anúncios com acompanhamento','Sabemos quais contatos viram vendas.'],['Anúncios sem essa visão','Não sabemos o que vira venda.'],['Sem anúncios, com procura','O movimento atual é suficiente.'],['Sem anúncios, falta procura','Precisamos de novos contatos.']],
  [['Sistema atualizado','A equipe registra e acompanha por ali.'],['Planilha compartilhada','Todo mundo usa e mantém em dia.'],['Caderno e WhatsApp','As informações ficam espalhadas.'],['Comigo','Na minha cabeça ou só no meu celular.']],
  [['Segue sem mim','A equipe sabe o que pode decidir.'],['Algumas decisões esperam','A rotina segue, com algumas pausas.'],['Me chama o tempo todo','Precisa de mim para conseguir andar.'],['Para quase tudo','A equipe espera eu voltar.']]
];
const REACOES = [
  ['Vocês respondem também fora do horário. Agora quero entender como esses contatos chegam.', 'Então, fora do expediente, o contato espera até o próximo dia. Vamos olhar como ele chega até vocês.', 'O contato espera algumas horas e, fora do horário, fica para depois. De onde ele costuma vir?', 'Tem mensagem que passa um dia ou fica sem resposta. Vou guardar esse ponto e olhar como esses contatos chegam.'],
  ['A indicação já abre a conversa com uma referência. Vamos seguir o caminho desse contato.', 'As pessoas chegam pelos canais da empresa. Quero entender o que acontece depois que chamam.', 'Os anúncios trazem contatos. Vamos olhar se essas conversas conseguem avançar.', 'Pouca gente nova está procurando vocês. Vou considerar isso e olhar o caminho de quem chega.', 'A origem ainda não está clara. Vamos ver se dá para localizar onde a conversa para.'],
  ['A conversa para antes da resposta. Agora vou olhar também quem já recebeu um orçamento.', 'O orçamento sai, mas a conversa para ali. Quero entender como vocês retomam esse contato.', 'Com as conversas espalhadas, fica difícil enxergar a perda. Vamos olhar como vocês lidam com quem some.', 'Vocês acompanham até uma decisão. Quero entender como organizam as retomadas no dia a dia.'],
  ['Ter alguém e uma data ajuda a dar continuidade. Agora vamos olhar o que a pessoa encontra sobre vocês.', 'O retorno depende de alguém lembrar. Vou guardar isso e olhar como a empresa se apresenta.', 'Hoje a retomada fica por conta do cliente. Vamos olhar também o que ele encontra sobre vocês.', 'Sem saber quem ficou sem retorno, fica difícil retomar. Quero ver também como a empresa aparece para quem procura.'],
  ['Os canais que vocês usam estão em dia. Vamos entender como a divulgação entra nessa rotina.', 'Um dos canais ficou para trás. Agora quero entender como vocês lidam com anúncios.', 'Há informações para atualizar. Vamos olhar se os anúncios estão trazendo contatos para esses canais.', 'Encontrar a empresa ou entender o que ela vende está difícil. Vou considerar isso junto da divulgação.'],
  ['Vocês acompanham o anúncio até a venda. Agora quero ver onde guardam o próximo passo de cada contato.', 'O caminho do anúncio até a venda ainda não está claro. Onde ficam os contatos e os próximos passos?', 'A procura atual é suficiente sem anúncios. Isso, por si só, não é um problema. Vamos olhar a organização.', 'Vocês precisam de mais procura. Quero entender também como organizam quem já chega.'],
  ['O sistema é usado e atualizado pela equipe. Falta olhar quanto a rotina ainda depende de você.', 'A planilha está compartilhada e em dia. O que importa é a equipe conseguir usá-la. E quando você se afasta?', 'Caderno e WhatsApp espalham os próximos passos. Vamos ver quanto disso precisa passar por você.', 'As informações estão concentradas em você. Quero entender o que acontece quando você se afasta.'],
  ['A equipe consegue seguir sem você. Já tenho as oito respostas para montar seu mapa.', 'Algumas decisões esperam por você. Vou juntar isso às outras respostas.', 'A equipe te chama o tempo todo. Vou cruzar esse ponto com a organização dos contatos.', 'Quase tudo espera você voltar. Vou considerar essa dependência junto do restante da rotina.']
];

function rolar() {
  if (seguindo) $('#conversa').scrollTo({top: $('#conversa').scrollHeight, behavior: reduzido.matches ? 'instant' : 'smooth'});
}
$('#conversa').addEventListener('wheel', e => { if(e.deltaY < 0) seguindo = false; }, {passive:true});
$('#conversa').addEventListener('pointerdown', e => {
  if(e.clientX >= $('#conversa').getBoundingClientRect().right - 20) seguindo = false;
});
$('#conversa').addEventListener('touchstart', e => { toqueY = e.touches[0].clientY; }, {passive:true});
$('#conversa').addEventListener('touchmove', e => {
  if(e.touches[0].clientY > toqueY + 3) seguindo = false;
  toqueY = e.touches[0].clientY;
}, {passive:true});
$('#conversa').addEventListener('scroll', () => {
  const el = $('#conversa');
  if(el.scrollHeight - el.scrollTop - el.clientHeight < 8) seguindo = true;
}, {passive:true});
$('#conversa').addEventListener('click', e => { if(!e.target.closest('button,a,summary,input,textarea')) completarFala?.(); });
document.addEventListener('keydown', e => {
  if(['PageUp','Home','ArrowUp'].includes(e.key) && !e.target.closest('input,textarea,#painel')) seguindo = false;
});
// A folha reserva exatamente sua altura na conversa, inclusive com teclado aberto.
function reservarFolha() {
  if(manterReserva) return;
  document.documentElement.style.setProperty('--reserva', `${$('.dock').getBoundingClientRect().height}px`);
  rolar();
}
new ResizeObserver(reservarFolha).observe($('.dock'));
function anunciar(texto) { $('#anuncio').textContent = texto; }
function travar(valor) {
  ocupado = valor;
  document.querySelectorAll('.bolha').forEach(b => b.disabled = valor);
  if($('#texto')) $('#texto').disabled = valor;
  if($('#enviar')) $('#enviar').disabled = true;
}
async function falar(texto, onde = $('#mensagens'), autoScroll = true) {
  const el = document.createElement('article');
  el.className = 'mensagem assistente';
  el.innerHTML = autor() + '<div class="pontos" aria-label="Pensando"><i></i><i></i><i></i></div>';
  onde.append(el);
  if (autoScroll) rolar();
  await esperar(duracao(variar(RITMO.pensando)));
  const fala = document.createElement('p');
  fala.className = 'fala digitando';
  el.lastElementChild.replaceWith(fala);
  await new Promise(resolve => {
    let i = 0, timer;
    completarFala = () => { clearTimeout(timer); fala.textContent = texto; completarFala = null; resolve(); };
    const digitar = () => {
      if(reduzido.matches) { completarFala(); return; }
      const letra = texto[i++];
      fala.textContent = texto.slice(0, i);
      if(autoScroll && (letra === ' ' || i === texto.length)) rolar();
      if(i >= texto.length) { completarFala(); return; }
      timer = setTimeout(digitar, RITMO.caractere * (.8 + Math.random() * .4) + (/[.!?]/.test(letra) ? RITMO.ponto : letra === ',' ? RITMO.virgula : 0));
    };
    digitar();
  });
  fala.classList.remove('digitando');
  if(autoScroll) rolar();
  anunciar(texto);
  return el;
}
function reacao(i) {
  const anterior = REGRAS.perguntas[i];
  const d = detalhes[anterior.id];
  if (d.livre) return `Você trouxe um cenário próprio: “${d.texto}”. Vou manter esse contexto, mas ele não recebe pontos automáticos neste conceito. ${i === 7 ? 'Agora vou juntar o que foi possível pontuar.' : 'Vamos olhar a próxima parte da rotina.'}`;
  if (i === 1 && d.indices.length > 1) return 'Os contatos chegam por mais de um caminho. Vou manter essas origens juntas e olhar o que acontece depois.';
  return REACOES[i][respostas[anterior.id]];
}
function opcaoHTML(i, titulo, descricao) {
  return `<button type="button" class="opcao" data-opcao="${i}" aria-pressed="false"><span class="numero" aria-hidden="true"><span>${i+1}</span><i>✓</i></span><span><strong>${titulo}</strong><small>${descricao}</small></span></button>`;
}
async function mostrarPergunta() {
  const q = REGRAS.perguntas[etapa];
  $('#painel').innerHTML = `<form id="resposta" class="cartao" aria-labelledby="pergunta"><div class="cartao-corpo"><div class="cartao-topo"><span class="etiqueta">${q.area}</span><span>${String(etapa+1).padStart(2,'0')} / 08</span></div><h2 id="pergunta">${q.titulo}</h2><div class="opcoes" role="group" aria-label="${escapar(q.ajuda)}">${ROTULOS[etapa].map((o,i) => opcaoHTML(i,...o)).join('')}</div><div id="subopcoes"></div><div class="escolha-base"><button type="button" class="texto-botao" id="outra" aria-expanded="false" aria-controls="resposta-livre">Outra coisa</button><span class="atalhos">${etapa===1?'Pode marcar mais de uma origem.':'1 a 4 · setas · Enter'}</span></div><div id="resposta-livre" hidden><label for="texto">Conte do seu jeito</label><textarea id="texto" rows="2" maxlength="1200" placeholder="O que acontece na sua empresa?"></textarea><p class="aviso">Guardado como contexto, sem pontuação automática.</p></div></div><div class="cartao-rodape"><span id="contador" role="status">Escolha para continuar</span><button type="submit" id="enviar" class="enviar" disabled>Enviar <span aria-hidden="true">↑</span></button></div></form>`;
  atualizarSelecao();
  $('#resposta').classList.add('preparando');
  manterReserva = false;
  reservarFolha();
  // A pausa também abre espaço antes do fade: a folha não entra sobre a fala.
  await esperar(duracao(RITMO.pergunta));
  $('#resposta').classList.remove('preparando');
  travar(false); atualizarSelecao();
}
async function perguntar(i) {
  etapa = i; selecionadas = []; livre = false;
  travar(true); $('#painel').innerHTML = '';
  const turno = document.createElement('section');
  turno.dataset.etapa = i;
  $('#mensagens').append(turno);
  if (i > 0) await falar(reacao(i-1), turno);
  else await falar('Vamos começar por quem chama sua empresa. Pense no expediente e também à noite ou no fim de semana.', turno);
  await mostrarPergunta(); rolar();
  anunciar(qAtual().titulo);
}
function qAtual() { return REGRAS.perguntas[etapa]; }
function atualizarSelecao() {
  document.querySelectorAll('[data-opcao]').forEach(el => el.setAttribute('aria-pressed', String(!livre && (selecionadas.includes(Number(el.dataset.opcao)) || (etapa === 1 && +el.dataset.opcao === 3 && selecionadas[0] === 4)))));
  document.querySelectorAll('[data-sub]').forEach(el => el.setAttribute('aria-pressed', String(selecionadas.includes(Number(el.dataset.sub)))));
  $('#enviar').disabled = ocupado || (livre ? !$('#texto').value.trim() : !selecionadas.length);
  $('#contador').textContent = livre ? 'Do seu jeito' : selecionadas.length ? `${selecionadas.length} ${selecionadas.length===1?'escolhida':'escolhidas'}` : 'Escolha para continuar';
  $('#resposta-livre').hidden = !livre;
  $('#outra').setAttribute('aria-expanded', String(livre));
}
function selecionar(i) {
  if (ocupado || etapa < 0 || etapa > 7) return;
  livre = false; $('#texto').value = '';
  if (etapa === 1 && i === 3) {
    selecionadas = [];
    atualizarSelecao();
    $('#subopcoes').innerHTML = '<div class="alternativas"><button type="button" data-sub="3" aria-pressed="false">Quase ninguém procura</button><button type="button" data-sub="4" aria-pressed="false">Não sei de onde vêm</button></div>';
    $('.cartao-corpo').scrollTop = $('.cartao-corpo').scrollHeight;
    $('[data-sub]').focus({preventScroll:true});
    return;
  }
  if (etapa === 1) {
    selecionadas = selecionadas.filter(n => n < 3);
    selecionadas = selecionadas.includes(i) ? selecionadas.filter(n => n !== i) : [...selecionadas,i];
    $('#subopcoes').innerHTML = '';
  } else selecionadas = [i];
  atualizarSelecao();
}
async function enviarResposta() {
  if (ocupado || etapa < 0 || etapa > 7 || $('#enviar').disabled) return;
  const q = qAtual();
  const texto = livre ? $('#texto').value.trim() : selecionadas.map(i=>q.opcoes[i].texto).join(' ');
  const origem = livre ? $('#texto') : $('[data-sub][aria-pressed=true]') || $('[data-opcao][aria-pressed=true]');
  const cartao = $('#resposta');
  manterReserva = true;
  travar(true);
  cartao.inert = true;
  // Na origem, múltiplas seleções só combinam as três fontes com zero pontos.
  respostas[q.id] = livre ? null : selecionadas[0];
  detalhes[q.id] = { texto, livre, indices: livre ? [] : [...selecionadas] };
  const resposta = document.createElement('div'); resposta.className = 'usuario';
  resposta.innerHTML = `<button class="bolha" data-editar="${etapa}" aria-label="Editar resposta: ${escapar(texto)}">${escapar(texto)}<small>Você · tocar para editar</small></button>`;
  $(`[data-etapa="${etapa}"]`).append(resposta);
  const bolha = resposta.firstElementChild;
  bolha.disabled = true;
  bolha.style.visibility = 'hidden';
  rolar();
  const painel = $('#painel');
  // A cópia nasce acima da folha; a opção original sai junto com o cartão inteiro.
  const last = bolha.getBoundingClientRect(), conversa = $('#conversa');
  const destinoY = last.top - (seguindo ? conversa.scrollHeight - conversa.clientHeight - conversa.scrollTop : 0);
  const partidaY = Math.min(10, cartao.getBoundingClientRect().top - 12 - destinoY - last.height);
  const recolher = movimento(cartao, [
    {opacity:1,transform:'none'},
    {opacity:0,transform:reduzido.matches ? 'none' : 'translateY(10px)'}
  ], RITMO.recolher).then(() => painel.replaceChildren());
  if(seguindo && !reduzido.matches) {
    const voo = document.createElement('div');
    voo.className = 'bolha voo'; voo.setAttribute('aria-hidden','true');
    voo.style.cssText = `left:${last.left}px;top:${destinoY}px;width:${last.width}px;height:${last.height}px`;
    voo.innerHTML = `<div class="voo-inicial">${escapar(livre ? texto : origem.querySelector('strong')?.textContent || origem.textContent)}</div><div class="voo-final">${bolha.innerHTML}</div>`;
    document.body.append(voo);
    const inicial = voo.firstElementChild, final = voo.lastElementChild;
    const flight = movimento(voo, [
      {transform:`translateY(${partidaY}px)`,opacity:0,background:'#fff0d1'},
      {opacity:1,offset:.2},
      {transform:'none',opacity:1,background:'#dedacf'}
    ], RITMO.envio);
    movimento(inicial, [{opacity:1},{opacity:0,offset:.65},{opacity:0}], RITMO.envio);
    movimento(final, [{opacity:0},{opacity:1,offset:.7},{opacity:1}], RITMO.envio);
    await flight;
    voo.remove();
  }
  bolha.style.visibility = '';
  await Promise.all([
    recolher,
    reduzido.matches ? movimento(bolha, [{opacity:0},{opacity:1}], RITMO.reduzido) : Promise.resolve()
  ]);
  ultimoPayload = null;
  if (etapa < 7) await perguntar(etapa+1);
  else await concluir();
}
function editar(i) {
  if (ocupado) return;
  const anterior = detalhes[REGRAS.perguntas[i].id];
  document.querySelectorAll('[data-etapa]').forEach(el => { if (+el.dataset.etapa>=i) el.remove(); });
  $('#fim')?.remove();
  REGRAS.perguntas.slice(i).forEach(q => {delete respostas[q.id];delete detalhes[q.id];});
  ultimoPayload = null;
  perguntar(i).then(() => {
    selecionadas = [...anterior.indices]; livre = anterior.livre;
    if (livre) $('#texto').value = anterior.texto;
    if (i===1 && selecionadas[0]>=3) { selecionar(3); selecionadas = [...anterior.indices]; }
    atualizarSelecao();
    anunciar('Edite esta resposta. As seguintes serão refeitas.');
  });
}
function tituloResultado(r) { return r.principal ? REGRAS.areas[r.principal].nome : Object.values(r.notas).every(n=>n===null) ? 'Ainda falta contexto para pontuar' : 'Nenhum gargalo evidente'; }
async function concluir() {
  etapa = 8; travar(true); $('#painel').innerHTML = '';
  const fim = document.createElement('section'); fim.id='fim'; $('#mensagens').append(fim);
  await falar(reacao(7),fim);
  const bloco = document.createElement('article'); bloco.className='mensagem';
  bloco.innerHTML = `${autor()}<details class="pensamento processando" open><summary>Organizando seu diagnóstico...</summary><ol></ol></details>`;
  fim.append(bloco); rolar();
  const inicio = performance.now();
  const tempoFinal = reduzido.matches ? RITMO.finalReduzido : variar(RITMO.final);
  for (const texto of ['Lendo suas 8 respostas','Cruzando atendimento e vendas','Dando nota para cada área','Escrevendo seu diagnóstico']) {
    const li = document.createElement('li');li.textContent=texto;bloco.querySelector('ol').append(li);
    anunciar(texto);rolar();await esperar(tempoFinal/4);
  }
  const segundos = Math.round((performance.now()-inicio)/1000);
  const pensamento = bloco.querySelector('details');
  pensamento.classList.remove('processando');pensamento.open=false;
  pensamento.querySelector('summary').textContent=segundos ? `Pensou por ${segundos} s` : 'Pensou por menos de 1 s';
  renderResultado(fim);
  manterReserva = false; reservarFolha();
  await falar('O resultado já é seu. Se quiser aprofundar, posso preparar o pedido do PDF completo e deixar seu caso para o Guilherme olhar.',fim,false);
  renderContato(fim);
  travar(false);
  $('#diagnostico .resultado').insertAdjacentHTML('beforeend','<div class="acoes"><button class="primario" data-contato>Receber PDF e olhar meu caso ↗</button></div>');
  if(seguindo) $('#diagnostico').scrollIntoView({block:'start',behavior:reduzido.matches?'instant':'smooth'});
}
function renderResultado(fim) {
  const r = calcular(respostas), area = REGRAS.areas[r.principal];
  const temLivre = Object.values(detalhes).some(d=>d.livre);
  const el = document.createElement('article');el.className='mensagem';el.id='diagnostico';
  el.innerHTML = `${autor()}<div class="resultado"><p class="eyebrow">${r.principal?'Seu gargalo principal':'Sua leitura inicial'}</p><h2>${tituloResultado(r)}</h2><p>${area?area.leitura:'Nas respostas que foi possível pontuar, não apareceu um gargalo claro. Isso não garante que está tudo resolvido. Vale conferir a rotina com o Guilherme.'}</p>${r.empatadas.length>1?`<p class="aviso">Mesma nota em ${r.empatadas.slice(1).map(id=>REGRAS.areas[id].nome).join(' e ')}. A prioridade segue o desempate da regra, não uma certeza sobre seu negócio.</p>`:''}${temLivre?'<p class="aviso">Leitura parcial: textos livres foram guardados como contexto, sem pontos. Áreas sem evidência aparecem como “Sem nota”.</p>':''}<div class="mapa"><h3>Onde vale colocar atenção</h3><p>De 0 a 10. Maior nota pede mais atenção.</p>${Object.entries(REGRAS.areas).map(([id,a])=>`<div class="nota ${id===r.principal?'principal':''}"><div class="nota-label"><span>${a.nome}</span><strong>${r.notas[id]===null?'Sem nota':r.notas[id]+' / 10'}</strong></div><div class="trilho" role="img" aria-label="${a.nome}: ${r.notas[id]===null?'sem nota':r.notas[id]+' de 10'}"><span style="width:${(r.notas[id]??0)*10}%"></span></div></div>`).join('')}</div><div class="hoje"><h3>Um primeiro passo para hoje</h3><p>${area?area.hoje:'Escolha uma venda recente e acompanhe de onde veio, quem respondeu e como terminou. Veja se a rotina confirma suas respostas.'}</p></div><div class="ajuda"><h3>Como a Feed ajuda aqui</h3><p>${area?area.feed:'A Feed olha a operação com você para definir o que vale organizar, automatizar ou manter como está.'}</p></div><p class="preco">Planos a partir de <strong>R$ 997 por mês</strong>. O valor final é definido no diagnóstico com o Guilherme.</p><details class="metodo"><summary>Como essa nota foi calculada?</summary><p>A nota é por regra, não por IA: média dos pontos (0 a 3), com os pesos de cada pergunta, dividida por 3 e multiplicada por 10. Arredondamos para um inteiro. Até 3: poucos sinais; até 6: vale organizar; acima: atenção primeiro.</p><p>Pesos: atendimento, resposta 2 e perda 1; atração, origem 1 e anúncios 1; presença, perfis 1; vendas, perda 1, retorno 2 e contatos 1; dependência, contatos 1 e ausência 3. Sem evidência, a resposta fica fora da média. Empate: dependência do dono, atendimento, vendas, presença e atração.</p><p>É uma leitura inicial das suas respostas, não uma auditoria, uma comparação com o mercado ou uma previsão de vendas. Neste conceito, as falas também são roteirizadas.</p></details></div>`;
  fim.append(el);
}
function mensagemWhatsApp() {
  const r=calcular(respostas);
  return ['Olá, Guilherme. Respondi ao Diagnóstico do Gargalo da Feed.',contato.nome?`Meu nome é ${contato.nome}.`:'',`Meu gargalo principal: ${tituloResultado(r)}.`,'Notas de atenção (0 a 10, maior pede mais atenção):',...Object.entries(REGRAS.areas).map(([id,a])=>`${a.nome}: ${r.notas[id]===null?'sem nota':r.notas[id]+'/10'}`),'Minhas respostas:',...REGRAS.perguntas.map(q=>`${q.titulo} ${detalhes[q.id].texto}`),'Quero conversar sobre meu caso e receber o PDF completo.'].filter(Boolean).join('\n');
}
function linkWhatsApp(){return 'https://wa.me/5516993020694?text='+encodeURIComponent(mensagemWhatsApp());}
function montarPayload() {
  const r=calcular(respostas);
  const respondidas=Object.fromEntries(REGRAS.perguntas.map(q=>[q.id,{pergunta:q.titulo,opcao:respostas[q.id],resposta:detalhes[q.id].texto}]));
  const metadados={pageUrl:location.href,submittedAt:new Date().toISOString(),userAgent:navigator.userAgent};
  return {modo:'conceito: nenhum envio',leadAtual:{company:'',market:'',stage:Object.values(respondidas).map(r=>`${r.pergunta} ${r.resposta}`).join('\n'),digitalPresence:respondidas.presenca.resposta,priority:tituloResultado(r),...metadados},diagnosticoAtual:{nome:contato.nome.trim(),email:contato.email.trim().toLowerCase(),site:'',...metadados},novosCamposLead:{nome:contato.nome.trim(),email:contato.email.trim().toLowerCase(),telefone:contato.whatsapp.replace(/\D/g,''),respostas:respondidas,resultado:{versao:REGRAS.versao,gargalo:r.principal,notas:r.notas,empatadas:r.empatadas},consentimento:{aceito:contato.consentimento,versao:'diagnostico-v1',finalidade:'Receber o PDF e contato da Feed sobre este diagnóstico',registradoEm:contato.consentimento?metadados.submittedAt:null,politica:'https://agenciafeed.com/privacidade.html'},contextoConversa:Object.fromEntries(REGRAS.perguntas.map(q=>[q.id,{livre:detalhes[q.id].livre,opcoes:detalhes[q.id].indices}]))}};
}
function modoConceito(){return `<details class="modo"><summary>Modo conceito: ver payload de envio</summary><p>Nada é enviado ou salvo fora desta página. Este é o mesmo envelope da versão anterior, com contexto adicional para texto livre e múltiplas origens.</p><pre id="payload">${escapar(JSON.stringify(ultimoPayload||montarPayload(),null,2))}</pre></details>`;}
function renderContato(fim) {
  const el=document.createElement('article');el.className='mensagem';el.id='pedido-contato';
  el.hidden=true;
  el.innerHTML=`${autor()}<form id="contato" class="contato" novalidate><p class="eyebrow">Agora, se fizer sentido</p><h2>Vamos levar isso adiante?</h2><p>Receba o Diagnóstico do Gargalo completo em PDF e peça ao Guilherme para olhar seu caso. O PDF atual é um exercício complementar, não um relatório personalizado dessas notas.</p><label class="campo"><span>Seu nome <small>Obrigatório</small></span><input name="nome" id="nome" autocomplete="name" maxlength="100" required value="${escapar(contato.nome)}" aria-describedby="erro"></label><label class="campo"><span>E-mail para receber o PDF <small>Obrigatório</small></span><input name="email" id="email" type="email" autocomplete="email" inputmode="email" maxlength="254" required value="${escapar(contato.email)}" aria-describedby="erro"></label><label class="campo"><span>WhatsApp com DDD <small>Opcional</small></span><input name="whatsapp" id="whatsapp" type="tel" autocomplete="tel" inputmode="tel" maxlength="20" value="${escapar(contato.whatsapp)}" aria-describedby="erro"></label><label class="consent"><input id="consentimento" name="consentimento" type="checkbox" required ${contato.consentimento?'checked':''} aria-describedby="erro"><span>Autorizo a Feed a usar meu nome, e-mail, WhatsApp (se informado) e respostas para enviar o PDF e entrar em contato sobre este diagnóstico. Posso retirar a autorização. Sem inscrição em campanhas.</span></label><a class="politica" href="https://agenciafeed.com/privacidade.html" target="_blank" rel="noopener noreferrer">Política de privacidade ↗</a><p id="erro" class="erro" role="alert"></p><button class="primario" type="submit">Pedir PDF e análise do meu caso ↗</button><p class="aviso">Envio simulado neste conceito. Sem custo para receber o material.</p><a class="secundario" id="whatsapp-link" href="${linkWhatsApp()}" target="_blank" rel="noopener noreferrer">Levar meu resultado para o WhatsApp ↗</a><p class="aviso">Abre uma mensagem pronta. Você decide quando enviar. A equipe atende de segunda a sexta, das 8h às 20h.</p></form>${modoConceito()}`;
  fim.append(el);
}
function confirmar() {
  const form=$('#contato');form.querySelectorAll('input,button').forEach(el=>el.disabled=true);
  const el=document.createElement('article');el.className='mensagem';el.id='confirmacao';
  el.innerHTML=`${autor()}<div class="confirmacao"><p class="eyebrow">Pedido preparado · simulação</p><h2>${escapar(contato.nome.split(/\s+/)[0])}, seu próximo passo está aqui.</h2><p>Neste conceito, nada foi enviado. Na versão real, o PDF irá para <strong>${escapar(contato.email)}</strong> e o Guilherme receberá suas respostas para olhar o caso.</p><p>Você já pode abrir o material complementar ou levar seu resultado para a conversa.</p><div class="acoes"><a class="primario" href="assets/diagnostico-do-gargalo.pdf" download>Baixar o PDF completo ↓</a><a class="secundario" href="${linkWhatsApp()}" target="_blank" rel="noopener noreferrer">Conversar no WhatsApp ↗</a></div><p class="aviso">A equipe atende de segunda a sexta, das 8h às 20h. Nenhuma conversa foi agendada.</p></div>`;
  fecharContato();
  el.insertAdjacentHTML('beforeend', modoConceito());
  $('#pedido-contato #payload').removeAttribute('id');
  $('#fim').append(el);el.scrollIntoView({block:'start'});anunciar('Pedido simulado. Nenhum dado foi enviado. Seu PDF está disponível para baixar.');
  el.insertAdjacentHTML('beforeend','<button class="texto-botao" data-ir="diagnostico">Voltar ao diagnóstico ↑</button>');
}
function abrirContato() {
  if(ocupado) return;
  if($('#confirmacao')) { $('#confirmacao').scrollIntoView({block:'start'}); return; }
  const el = $('#pedido-contato');
  const form = $('#contato');
  if(!form.querySelector('.cartao-corpo')) {
    form.classList.add('cartao');
    const corpo = document.createElement('div');corpo.className='cartao-corpo';
    const rodape = document.createElement('div');rodape.className='cartao-rodape';
    const enviar = form.querySelector('[type=submit]');
    rodape.innerHTML='<button type="button" class="texto-botao" id="fechar-contato">Voltar ao diagnóstico</button>';
    rodape.append(enviar);
    corpo.append(...form.childNodes);
    corpo.append(el.querySelector('.modo'));
    form.append(corpo,rodape);
  }
  el.hidden=false;
  $('#painel').append(el);
  seguindo=false;
  $('#nome').focus({preventScroll:true});
}
function fecharContato() {
  const el=$('#pedido-contato');
  el.hidden=true;$('#fim').append(el);
  $('[data-contato]')?.focus({preventScroll:true});
}
document.addEventListener('click',e=>{
  const alvo=e.target.closest('button');
  if(alvo?.id==='comecar') perguntar(0);
  if(alvo?.dataset.opcao!==undefined) selecionar(+alvo.dataset.opcao);
  if(alvo?.dataset.sub!==undefined){selecionadas=[+alvo.dataset.sub];livre=false;atualizarSelecao();}
  if(alvo?.id==='outra'){livre=!livre;selecionadas=[];atualizarSelecao();if(livre){$('#texto').focus();$('#texto').scrollIntoView({block:'nearest',behavior:'smooth'});}}
  if(alvo?.hasAttribute('data-contato')) abrirContato();
  if(alvo?.id==='fechar-contato') fecharContato();
  if(alvo?.dataset.editar!==undefined) editar(+alvo.dataset.editar);
  if(alvo?.dataset.ir) $('#'+alvo.dataset.ir)?.scrollIntoView({block:'start',behavior:reduzido.matches?'instant':'smooth'});
});
document.addEventListener('submit',e=>{if(e.target.id==='resposta'){e.preventDefault();enviarResposta();}});
document.addEventListener('input',e=>{if(e.target.id!=='texto'||etapa<0||etapa>7)return;livre=true;selecionadas=[];atualizarSelecao();});
document.addEventListener('keydown',e=>{
  if(ocupado||etapa<0||etapa>7||e.ctrlKey||e.altKey||e.metaKey||e.isComposing) return;
  const campo=e.target.closest('input,textarea');
  if(campo){if(e.target.id==='texto'&&e.key==='Enter'&&!e.shiftKey){e.preventDefault();enviarResposta();}return;}
  if(e.key>='1'&&e.key<='4'){e.preventDefault();selecionar(+e.key-1);}
  if(e.key==='ArrowDown'||e.key==='ArrowUp'){
    e.preventDefault();const botoes=[...document.querySelectorAll('[data-opcao]')];
    const atual=botoes.indexOf(document.activeElement);const proximo=atual<0?(e.key==='ArrowDown'?0:3):(atual+(e.key==='ArrowDown'?1:-1)+4)%4;
    botoes[proximo].focus();
    if(etapa!==1) selecionar(proximo);
  }
  if(e.key==='Enter'&&!e.target.closest('#outra,[data-sub],[data-editar],summary,a')){
    e.preventDefault();if(!selecionadas.length&&e.target.dataset.opcao!==undefined)selecionar(+e.target.dataset.opcao);else enviarResposta();
  }
});
document.addEventListener('input',e=>{
  if(!e.target.closest('#contato'))return;
  contato[e.target.name]=e.target.type==='checkbox'?e.target.checked:e.target.value;
  e.target.removeAttribute('aria-invalid');$('#erro').textContent='';ultimoPayload=null;
  $('#payload').textContent=JSON.stringify(montarPayload(),null,2);$('#whatsapp-link').href=linkWhatsApp();
});
document.addEventListener('submit',e=>{
  if(e.target.id!=='contato')return;e.preventDefault();
  const telefone=contato.whatsapp.replace(/\D/g,'');let campo,erro;
  if(!contato.nome.trim()){campo='nome';erro='Conte como podemos te chamar.';}
  else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contato.email.trim())){campo='email';erro='Confira seu e-mail para receber o PDF.';}
  else if(contato.whatsapp.trim()&&!/^(?:55)?[1-9]{2}9?\d{8}$/.test(telefone)){campo='whatsapp';erro='Confira o WhatsApp com DDD ou deixe esse campo vazio.';}
  else if(!contato.consentimento){campo='consentimento';erro='Marque a autorização para pedir o PDF e a análise do caso.';}
  if(erro){$('#erro').textContent=erro;$('#'+campo).setAttribute('aria-invalid','true');$('#'+campo).focus();return;}
  contato.nome=contato.nome.trim();contato.email=contato.email.trim().toLowerCase();ultimoPayload=montarPayload();$('#payload').textContent=JSON.stringify(ultimoPayload,null,2);confirmar();
});
// visualViewport acompanha teclado e barras móveis; o conteúdo continua rolando por dentro.
function ajustarViewport(){if(!window.visualViewport)return;document.documentElement.style.setProperty('--altura',`${visualViewport.height}px`);document.documentElement.style.setProperty('--top',`${visualViewport.offsetTop}px`);requestAnimationFrame(()=>{if(document.activeElement?.matches('#texto,#contato input'))document.activeElement.scrollIntoView({block:'nearest'});});}
window.visualViewport?.addEventListener('resize',ajustarViewport);
window.visualViewport?.addEventListener('scroll',ajustarViewport);
ajustarViewport();
async function iniciar(){
  travar(true);
  $('#mensagens').innerHTML='<div class="inicio"><span class="emblema" aria-hidden="true">↗</span><p class="eyebrow">Uma conversa sobre sua empresa</p><h1>Vamos encontrar o que<br>está segurando sua operação.</h1><p>Atendimento, vendas e o que ainda depende de você.</p></div>';
  await falar(INTRO);travar(false);
  $('#painel').innerHTML='<div class="convite"><p>Sem cadastro para ver seu resultado.</p><button class="primario" id="comecar">Vamos conversar ↗</button></div>';
}
iniciar();
