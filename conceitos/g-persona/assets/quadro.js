const personas = {
fevi: {
name:'Fevi',number:'01',direction:'A marca ganha voz',tag:'EMBLEMA ABSTRATO',pronunciation:'FÉ-vi',
reason:'Feed + vínculo: um nome curto para ligar o problema do cliente ao próximo passo.',
traits:['Objetivo','Atento','Resolutivo'],
does:'Organiza o que o cliente conta, faz uma pergunta por vez e ajuda a escolher por onde começar. Leva o contexto à equipe quando a decisão precisa de uma pessoa.',
never:'Não empilha termos técnicos, não empurra IA para qualquer problema e não transforma uma hipótese em diagnóstico fechado.',
intro:'Oi, sou Fevi, assistente de IA da Feed. Vamos olhar onde sua operação trava? Você vê uma leitura inicial antes de deixar qualquer contato.',
yes:['Oi, sou Fevi, assistente de IA da Feed. Por onde sua operação trava?','Pelo que você contou, vale olhar o retorno dos contatos. Ainda falta entender a rotina.','Esse ponto precisa da equipe. Posso organizar o que você contou para a conversa.'],
no:['Sou seu consultor pessoal. Pode deixar tudo comigo.','Seu problema está resolvido. É só colocar IA.','Já passei tudo para a equipe. Aguarde.'],
motion:'O símbolo avança 3 px e volta, com um contorno que respira. Um movimento curto de organização, sem olhos ou rosto.',
thinking:'Organizando o que você contou',
site:'Presença de marca, sem disputar a página.',
siteText:'O símbolo acompanha o convite. O nome aproxima; o complemento “assistente de IA da Feed” explica quem está ali antes do primeiro clique.',
advantage:'O que ganha: reconhecimento imediato da Feed.',
limit:'O que pede cuidado: tem menos calor de personagem. A proximidade precisa aparecer na escrita e na qualidade da conversa.',
visual:'O símbolo oficial vira um selo preto e laranja. Sem rosto, com direção.',
mail:'Organizei os pontos que você trouxe para facilitar a próxima conversa com a equipe da Feed.'
},
tuie:{
name:'Tuiê',number:'02',direction:'Curiosidade que abre conversa',tag:'PERSONAGEM ILUSTRADA',pronunciation:'tui-Ê',
reason:'Nome inventado, com som de canto curto: fácil de chamar e ligado à ideia de escuta.',
traits:['Curioso','Didático','Encorajador'],
does:'Pede um exemplo da rotina, troca conceitos abstratos por situações simples e ajuda quem ainda não sabe nomear o problema.',
never:'Não infantiliza o dono, não usa bordões de passarinho e não faz graça quando o cliente está frustrado.',
intro:'Oi, sou Tuiê, assistente de IA da Feed. Me conta como as coisas funcionam por aí. Vamos começar pelo atendimento, uma pergunta de cada vez.',
yes:['Oi, sou Tuiê, assistente de IA da Feed. Me conta uma situação que se repete por aí.','Vamos por partes. Quando uma mensagem fica sem resposta, quem costuma perceber?','Não tenho esse dado. Você pode me contar ou deixar esse ponto para a equipe.'],
no:['Piu, piu! Seu negócio vai voar comigo!','Relaxa, com IA tudo fica fácil.','Tenho certeza de que isso funciona para todo mundo.'],
motion:'A ilustração inclina 4 graus e volta, como quem presta atenção. O mesmo desenho é usado em todos os estados.',
thinking:'Olhando os pontos da conversa',
site:'Um convite com memória visual.',
siteText:'O bico, a crista e a asa em seta dão uma silhueta própria. A voz continua adulta e prática; a personagem convida sem virar uma distração.',
advantage:'O que ganha: uma personagem fácil de reconhecer.',
limit:'O que pede cuidado: a ave pode parecer mais lúdica do que alguns clientes esperam. Em 32 px, a textura perde força; a silhueta é quem sustenta o reconhecimento.',
visual:'Ave fictícia em gravura, com crista angular e asa em seta. Papel, tinta e laranja.',
mail:'Separei o que entendemos até aqui e o ponto que ainda vale conferir com a equipe da Feed.'
},
tadeu:{
name:'Tadeu',number:'03',direction:'Acolhimento com clareza',tag:'ROSTO ESTILIZADO',pronunciation:'ta-DEU',
reason:'Um nome de conversa cotidiana para uma presença calma, próxima e fácil de chamar.',
traits:['Calmo','Criterioso','Acolhedor'],
does:'Resume para conferir se entendeu, deixa o cliente corrigir a leitura e explica com calma o que depende da equipe da Feed.',
never:'Não se passa por funcionário humano, não inventa experiências pessoais e não cria intimidade para fechar uma venda.',
intro:'Oi, sou Tadeu, assistente de IA da Feed. Quero entender o que está pesando na sua rotina. Podemos começar por como sua empresa atende quem chega.',
yes:['Oi, sou Tadeu, assistente de IA da Feed. Vamos entender isso com calma.','Se entendi bem, muita coisa depende de você. É isso ou deixei algum ponto de fora?','Posso ajudar a organizar a conversa. Prazo e proposta precisam ser confirmados pela equipe.'],
no:['Sou o Tadeu da equipe. Já vivi isso na minha empresa.','Sei exatamente como você se sente. Confia em mim.','Fechado. Garanto o prazo e o resultado.'],
motion:'O rosto fica estável. Só o contorno respira, indicando processamento sem simular olhar, fala ou gestos de uma pessoa real.',
thinking:'Reunindo o contexto da conversa',
site:'Um rosto acolhedor, uma identidade explícita.',
siteText:'Óculos, cabelo e planos de cor mantêm o retrato reconhecível. A legenda de IA permanece visível no balão, na conversa e no perfil.',
advantage:'O que ganha: familiaridade no primeiro contato.',
limit:'O que pede cuidado: mesmo desenhado, um rosto pode sugerir atendimento humano. O nome também compartilha uma associação recente com publicidade de IA, detalhada na pesquisa.',
visual:'Retrato fictício em recorte gráfico. Óculos, cabelo preto e camiseta laranja.',
mail:'Este é o resumo do que entendi até aqui. Se algum ponto não representa sua rotina, a equipe pode conferir com você.'
}
};
const $ = s => document.querySelector(s);
const avatar=(id,size,extra='')=>'<img class="avatar '+extra+'" src="assets/'+id+'-'+size+'.webp" width="'+size+'" height="'+size+'" alt="Avatar de '+personas[id].name+'">';
const icons={
message:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M4 4h16v12H9l-5 4V4Z"/></svg>',
phone:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m8 3 3 5-3 3 5 5 3-3 5 3c-2 8-10 3-14-1S0 5 8 3Z"/></svg>',
site:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/></svg>'
};
const caption=(n,title,sub)=>'<div class="mock-caption"><span class="num">'+n+'</span><div><h3>'+title+'</h3><p>'+sub+'</p></div></div>';
const balloon=id=>'<button class="site-balloon" type="button" data-open-chat aria-label="Ver maquete da conversa com '+personas[id].name+'">'+avatar(id,40)+'<span><b>Fale com '+personas[id].name+'</b><small>Assistente de IA da Feed</small></span><span class="arrow" aria-hidden="true">↗</span></button>';
let current='fevi';
let favorite='';
let motionPaused=matchMedia('(prefers-reduced-motion: reduce)').matches;
try{const saved=localStorage.getItem('feed-persona-favorita');if(personas[saved])favorite=saved;}catch{}
function render(id){
current=id;
const p=personas[id];
document.querySelectorAll('[data-persona]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.persona===id)));
$('#proposta').innerHTML=`
<section class="identity" aria-labelledby="persona-name">
<div><div class="identity-heading"><p class="eyebrow">${p.number} / ${p.tag}</p><span class="pill">PROPOSTA</span></div><h2 id="persona-name">${p.name}</h2><p class="role">Agente da Feed</p><p class="reason">${p.reason}</p><div class="traits" aria-label="Três traços de personalidade">${p.traits.map(t=>'<span class="trait">'+t+'</span>').join('')}</div></div>
<figure class="portrait" data-capture="avatar-320">${avatar(id,320)}<figcaption><span>320 px / ${p.pronunciation}</span><span>Assistente de IA</span></figcaption></figure>
</section>
${id==='tuie'?$('#tuie-comparacao').innerHTML:''}
<section class="specimens" aria-label="Escalas do avatar e estado pensando">
<div><p class="eyebrow">O MESMO ROSTO EM CADA CONTATO</p><div class="scale-set" data-capture="avatares-pequenos">${[32,40,110].map(size=>'<figure>'+avatar(id,size)+'<figcaption>'+size+' px</figcaption></figure>').join('')}</div></div>
<div class="motion ${motionPaused?'':'is-thinking'}"><div class="motion-box"><div class="thinking-avatar ${id}">${avatar(id,110)}</div><div><p><strong>Pensando</strong></p><small>${p.thinking}</small></div></div><button class="motion-toggle" type="button" aria-pressed="${!motionPaused}">${motionPaused?'Reproduzir movimento':'Pausar movimento'}</button><p class="screen-note">${p.motion} Respeita a preferência de movimento reduzido.</p></div>
</section>
<section class="behavior"><div class="section-heading"><h3>${p.direction}</h3><span class="eyebrow">PERSONALIDADE</span></div><div class="behavior-grid"><div><h4>O que faz</h4><p>${p.does}</p></div><div class="no"><h4>O que nunca faz</h4><p>${p.never}</p></div></div></section>
<section class="voice" aria-label="Guia de voz"><div class="section-heading"><h3>O jeito de dizer.</h3><span class="eyebrow">FALAS DE EXEMPLO</span></div><div class="voice-row voice-head"><div class="voice-cell">ASSIM SIM</div><div class="voice-cell">ASSIM NÃO</div></div>${p.yes.map((s,i)=>'<div class="voice-row"><div class="voice-cell"><strong>'+['Ao se apresentar','Ao entender o problema','Ao reconhecer um limite'][i]+'</strong>“'+s+'”</div><div class="voice-cell"><strong>'+['Esconder que é IA','Pular para a certeza','Prometer sem confirmar'][i]+'</strong>“'+p.no[i]+'”</div></div>').join('')}<p class="rule"><strong>Regra comum às três propostas:</strong> sempre se apresenta como assistente de IA da Feed. Nunca inventa números, casos, resultados ou promessas. Quando falta informação, pergunta ou diz que não sabe. Só afirma que enviou algo depois da confirmação real.</p></section>
<section class="applications" aria-labelledby="apps-title"><div class="apps-intro"><div><p class="eyebrow">A IDENTIDADE EM USO</p><h2 id="apps-title">É assim que<br>${p.name} chega.</h2></div><p>${p.visual} Aqui, a mesma identidade aparece em quatro pontos da relação com o cliente.</p></div>
<div class="applications-grid">
<div>${caption('01','Diagnóstico em conversa','Abertura no celular · falas roteirizadas')}<div class="app-stage" data-capture="diagnostico"><div class="phone" id="diagnostico"><div class="phone-screen"><div class="device-status"><span>9:41</span><span aria-hidden="true">••• ▰</span></div><div class="chat-head">${avatar(id,40)}<div><b>${p.name}</b><small>Assistente de IA da Feed</small></div></div><div class="chat-body"><p class="chat-intro">${p.intro}</p><p class="chat-question">Quando alguém chama sua empresa, o que costuma acontecer?</p><div class="option-card" aria-label="Opções da maquete">${['Respondemos na hora','Depende de quem está livre','Algumas mensagens ficam para depois'].map(o=>'<button type="button" data-option aria-pressed="false"><span class="radio" aria-hidden="true"></span><span>'+o+'</span></button>').join('')}</div><p class="sample-answer" role="status">Toque em uma opção para experimentar a maquete.</p></div><div class="chat-foot"><img src="assets/logo-preta.svg" width="48" height="16" alt="Feed"><span>Maquete. Nenhuma resposta é enviada.</span></div></div></div></div></div>
<div class="site-column"><div>${caption('02A','No site oficial, no desktop','Captura do site + balão proposto')}<div class="desktop-site" data-capture="site-desktop"><div class="browser-bar"><span class="dots" aria-hidden="true">•••</span><span>agenciafeed.com</span><span>Maquete</span></div><img src="assets/site-desktop.webp" width="1440" height="900" alt="Captura do conceito oficial da Feed no desktop, com a abertura laranja">${balloon(id)}</div><p class="screen-note">O balão leva à maquete do diagnóstico acima. No produto, abriria a conversa.</p></div><div class="site-principle"><h4>${p.site}</h4><p>${p.siteText}</p><p><strong>Uma identidade, três escalas de conversa:</strong> pequena no convite, presente no diagnóstico e reconhecível no perfil.</p></div></div>
</div>
<div class="lower-apps">
<div>${caption('02B','No site oficial, no celular','O convite acompanha a navegação')}<div class="app-stage" data-capture="site-celular"><div class="phone"><div class="mobile-site"><img src="assets/site-celular.webp" width="390" height="844" alt="Captura do conceito oficial da Feed no celular, com o novo convite de conversa">${balloon(id)}</div></div></div></div>
<div>${caption('03','Perfil do WhatsApp da Feed','Proposta de identidade para uma etapa futura')}<div class="app-stage" data-capture="whatsapp"><div class="phone"><div class="whatsapp-screen"><div class="device-status"><span>9:41</span><span aria-hidden="true">••• ▰</span></div><div class="profile-header"><span>‹ &nbsp; Dados do contato</span><span>Maquete</span></div><div class="wa-identity">${avatar(id,110)}<h4>Feed | ${p.name}</h4><p>Assistente de IA da Feed</p></div><div class="profile-actions" aria-label="Ícones ilustrativos do perfil"><span>${icons.message}Mensagem</span><span>${icons.phone}Ligação</span><span>${icons.site}Site</span></div><div class="profile-info"><div><small>DESCRIÇÃO</small><p>Sou ${p.name}, assistente de IA da Feed. Ajudo a entender seu momento e organizar a conversa com a equipe.</p></div><div><small>SOBRE A FEED</small><p>IA aplicada e marketing para empresas.<br>Ribeirão Preto e região. Brasil remoto.</p></div><div><small>SITE</small><p class="address">agenciafeed.com</p></div><div><small>QUANDO PRECISAR DE UMA PESSOA</small><p>Peça para falar com a equipe da Feed.</p></div></div></div></div></div><p class="screen-note">A conta continua sendo da Feed. Nome, imagem e descrição são uma proposta, sem alteração no WhatsApp.</p></div>
</div>
<div class="mail-block">${caption('04','Assinatura de e-mail','Quem escreveu fica claro até no rodapé')}<div class="mail-stage" data-capture="email"><p class="mail-context">${p.mail}</p><div class="signature">${avatar(id,40)}<div><h4>${p.name}</h4><p>Assistente de IA da Feed</p><small>Mensagem preparada por IA.<br>Para falar com uma pessoa, peça a equipe da Feed.</small><img class="logo" src="assets/logo-preta.svg" width="72" height="24" alt="Feed"><p>IA aplicada e marketing<br>agenciafeed.com</p></div></div><p class="signature-label">Maquete visual de assinatura. Nenhum e-mail é enviado.</p></div></div>
</section>
<aside class="tradeoff"><h3>${p.advantage}</h3><p>${p.limit}</p></aside>`;
$('#copy-status').textContent='';
}
function setHash(id){history.replaceState(null,'','#'+id);}
function readHash(){const id=location.hash.slice(1);if(personas[id])render(id);}
function updateFavorite(){
document.querySelectorAll('[data-choice]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.choice===favorite)));
$('#choice-status').textContent=favorite?'Sua favorita: '+personas[favorite].name+'. Salva só neste navegador.':'Ainda sem favorita.';
}
document.addEventListener('click',async event=>{
const tab=event.target.closest('[data-persona]');
if(tab){render(tab.dataset.persona);setHash(current);return;}
const toggle=event.target.closest('.motion-toggle');
if(toggle){motionPaused=!motionPaused;$('.motion').classList.toggle('is-thinking',!motionPaused);toggle.setAttribute('aria-pressed',String(!motionPaused));toggle.textContent=motionPaused?'Reproduzir movimento':'Pausar movimento';return;}
const option=event.target.closest('[data-option]');
if(option){document.querySelectorAll('[data-option]').forEach(b=>b.setAttribute('aria-pressed',String(b===option)));$('.sample-answer').textContent='Opção marcada nesta maquete. A conversa real continuaria a partir dela.';return;}
if(event.target.closest('[data-open-chat]')){$('#diagnostico').scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});$('[data-option]').focus({preventScroll:true});return;}
const choice=event.target.closest('[data-choice]');
if(choice){favorite=choice.dataset.choice;let saved=true;try{localStorage.setItem('feed-persona-favorita',favorite);}catch{saved=false;}updateFavorite();if(!saved)$('#choice-status').textContent='Sua favorita: '+personas[favorite].name+'. Marcada apenas nesta visita.';return;}
if(event.target.closest('#copy-link')){
const url=new URL(location.href);url.hash=current;
try{if(!navigator.clipboard)throw Error('clipboard');await navigator.clipboard.writeText(url.href);$('#copy-status').textContent='Link da proposta '+personas[current].name+' copiado.';}catch{$('#copy-status').textContent='Copie este endereço: '+url.href;}
}
});
addEventListener('hashchange',readHash);
render(personas[location.hash.slice(1)]?location.hash.slice(1):'fevi');updateFavorite();

