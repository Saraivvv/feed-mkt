# Revisão D "A Linha": o que cortar

Revisor dos pontos fracos. Este arquivo é a tesoura: só diz o que sai, o que encolhe e o que muda de forma por causa de SEO. O que fica e pode melhorar é com o outro revisor (`fortes-melhorar.md`).

Tudo foi medido no arquivo local com Playwright headless (Chromium headless shell), em 390×844 com toque e em 1440×900 com mouse. Scripts, JSON e quadros estão em
`C:\Users\guisa\AppData\Local\Temp\claude\f3a6600d269a104b\dff5d254-2c2d-40ae-8f7f-59afaf17b6db\scratchpad\rev-fracos\`
(`medir-altura.mjs`, `medir-cliques.mjs`, `medir-giro.mjs`, `medir-blocos.mjs`, quadros em `giro\`, tiras `tira-giro-celular.png`, `tira-giro-desktop.png`, `tira-entrada-final.png`).

## O ponto de partida, em números

| medida | D hoje | B aprovado |
|---|---|---|
| altura no celular | 26.656 px = **31,6 telas** | 13.676 px = 16,2 telas |
| altura no desktop | 24.668 px = 27,4 telas | 14.351 px = 16,0 telas |
| palavras na página | 2.451 | 1.025 |
| elementos no DOM | 1.022 | 402 |
| botões de chamada | 19, mais a barra fixa | 8 |
| script gasto rolando a página toda (CPU 4× mais lenta) | 2.981 ms, 8 tarefas longas (pior 103 ms) | 514 ms, 2 tarefas longas (pior 59 ms) |

A mesma ideia dita de novo e de novo (contagem no texto visível): "na hora" 11 vezes, "pelo celular" 9, "resumo pronto" 6, "resolve o (que é) simples" 5, "24 horas" 5, "irrita" 5, "escopo, prazo e valor" 3. A lista dos seis serviços aparece três vezes seguidas: nas dores (#problema), nas paradas (#caminho) e no rótulo "Trecho 0X" de cada capítulo, que repete o título da parada palavra por palavra.

## 1. Lista de cortes, do maior impacto para o menor

Telas = telas de celular de 844 px que somem da rolagem.

### 1.1 Objeções ditas três vezes: tirar o carrossel e os balões, o FAQ fica com tudo
- **O que cortar:** a seção inteira `#objecoes` ("Pode duvidar. A gente responde.", carrossel `.trilho` com 8 cartões, setas e contador) e os 5 balões `aside.duvida` ("Dúvida comum") de `#marca`, `#trafego`, `#redes`, `#prova` e `#hub`. As 4 objeções que o FAQ ainda não tem ("Já contratei agência e não deu", "Minha empresa é pequena demais", "E se der problema, quem me atende?", "Vou ficar preso?") entram como 4 `<details>` novos no `#perguntas`, com a resposta curta.
- **Economiza:** carrossel 1,47 + balões 1,53 (262, 238, 238, 234 e 322 px) menos 0,36 dos 4 `<details>` fechados = **2,6 telas**.
- **Por que está ruim (medido):** a mesma resposta aparece 2 ou 3 vezes. "IA vai irritar o meu cliente" está no balão da prova, no cartão 02 e no FAQ 3, com a mesma frase ("mal feito irrita, bem feito responde na hora, resolve o simples e passa para o humano"). "Quanto tempo", "é caro" e "TI" estão no carrossel e no FAQ. Os balões repetem 5 das 8 respostas do carrossel. No desktop o carrossel mostra 3 dos 8 cartões e precisa de 5 cliques na seta para chegar ao último; arrastar com o mouse não move nada (scrollLeft 0 → 0), apesar da dica "Arraste para o lado" estar visível. É também onde moram 4 dos 6 marcadores `[confirmar com Guilherme]`. Obs.: o NOTAS fala em 6 balões; na página há 5.
- **O que se perde:** a objeção "perto de onde a dúvida nasce", que o briefing pediu. Vale a pena: o dono agora diz que o site é extenso demais, e o FAQ com `FAQPage` é o lugar que o Google e as IAs leem como resposta. Uma resposta num lugar só vale mais que três cópias.
- **Decisão:** remover `#objecoes` e os 5 `.duvida`; juntar as 4 objeções que faltam no FAQ.

### 1.2 Palco do Agente: de 5 capítulos para 3, e sem o giro do celular
- **O que cortar:** em `.estagio`, juntar os capítulos 1 e 2 ("O cliente chama. O Agente responde na hora." + "Resolve o que é simples.") e os capítulos 4 e 5 ("Cada oportunidade no seu lugar." + "A proposta sai em PDF, pelo celular."). Fica: atende e resolve, deixa o resumo, funil e proposta. Cortar também o parágrafo `.sub` de `#agente` ("O Agente de IA atende o WhatsApp 24 horas, resolve o simples..."), que é o resumo exato dos 3 primeiros capítulos e aparece colado neles.
- **Cortar o giro:** tirar todo `rotateY` e `rotateX` do celular de foto: o giro de ±15° na troca de capítulo (`giro * 15deg`), a inclinação de 24° na entrada do palco, o `sobeFone` de 20° da abertura e o `rotateX` de 32° da chamada final. Ficam o deslize, a escala, a troca de tela subindo e a proposta saindo de trás. O leque do Hub gira só no plano (eixo Z) e pode ficar.
- **Economiza:** o estágio tem 5,6 telas (4.726 px), 0,92 tela de rolagem por capítulo. Com 3 capítulos vai a cerca de 3,76 telas. Mais 0,14 do `.sub`. **Cerca de 2,0 telas.**
- **Por que está ruim (medido):**
  - Três capítulos para uma ideia só (o Agente atende). É a maior seção da página: 18% da rolagem.
  - O giro é o "chapa fina" do dono, e a causa é a própria moldura: `fone.webp` é uma foto de frente, sem lateral. Girada em Y vira um trapézio sem espessura (veja `tira-giro-desktop.png`). A largura relativa cai de 0,464 para 0,44 no celular e 0,436 no desktop, com escala 0,965 junto: o aparelho literalmente afina. Na entrada, com 19° em X, ele fica deitado como uma placa (razão 0,509). O próprio NOTAS do B já pedia "um aparelho fotografado em ângulo, no lugar de rotacionar a mesma foto frontal".
  - O giro chega ao máximo exatamente quando o texto some: nas 4 viradas (s = 1, 2, 3 e 4) os 5 capítulos ficam com opacidade 0 ao mesmo tempo. Quem para ali vê um celular torto e a faixa de texto vazia (`giro\celular-s1.png`).
- **O que se perde:** dois capítulos de conversa encenada e a sensação de volume. A conversa continua aparecendo mensagem por mensagem, e o movimento que resta (tela subindo, PDF saindo) não denuncia que o aparelho é uma foto plana.
- **Decisão:** encurtar para 3 capítulos; cortar o `.sub` de `#agente`; remover todo giro em X e Y do celular de foto.

### 1.3 Duas listas dos mesmos 6 serviços em sequência: juntar #problema com #caminho
- **O que cortar:** a seção `#problema` (preta, "Seja qual for o problema", 6 `.dor`, `.promessa` e o botão "Descobrir onde a minha trava"). Cada dor vira o título da parada correspondente na linha (ex.: parada 01 "Ninguém lembra da sua marca."), e o parágrafo de cada parada (`.parada p:not(.serv)`) sai, porque o capítulo seguinte diz a mesma coisa com mais força. Sai também o `h2.rotulo`.
- **Economiza:** 1,39 tela do `#problema`, devolvendo cerca de 0,1 nas paradas = **cerca de 1,3 tela**.
- **Por que está ruim (medido):** dor 01 a 06 com o rótulo "Trecho 01 · Marca" até "Trecho 06 · Feed Hub", e logo abaixo a parada 01 a 06 com os mesmos seis serviços. A `.promessa` ("A Feed assume a operação de ponta a ponta...") repete o subtítulo da abertura. O `h2` "Seja qual for o problema" é um rótulo de 15 px em caixa alta marcado como título e repete o "Seja qual for." do H1.
- **O que se perde:** o capítulo preto de contraste logo depois da abertura e a frase "E tudo depende de você estar olhando". A frase pode virar o título da parada 06. O preto continua no tráfego, no palco e no Hub.
- **Decisão:** juntar `#problema` com `#caminho`; a linha fica sendo a única lista dos serviços.

### 1.4 Convite depois de cada capítulo: tirar 4 de 7, a barra fixa já chama o tempo todo
- **O que cortar:** os `.convite` de `#caminho` ("Quer ver esse caminho desenhado na sua empresa?"), `#marca` ("Sua marca merece um manual assim?"), `#trafego` ("Quer anúncio que termina em conversa?") e `#redes` ("Quer parar de pensar no post da semana?"). O de `#objecoes` sai junto com a seção. Ficam o de `#prova`, o de `#sob-medida` ("Qual é a tarefa que trava a sua empresa?") e a chamada final.
- **Economiza:** 260 + 192 + 192 + 192 px = **1,0 tela**.
- **Por que está ruim (medido):** são 19 botões de chamada na página. A barra fixa `.doca` (WhatsApp + Diagnóstico) aparece depois de meia tela e fica até o fim, então em toda tela do celular já existem duas chamadas presas embaixo. Com o convite, várias telas mostram três chamadas ao mesmo tempo. São 6 rótulos diferentes para o mesmo Diagnóstico e 7 para o mesmo WhatsApp.
- **O que se perde:** a frase de fecho de cada capítulo. O "sempre fazendo CTA" que o dono pediu continua garantido pela barra fixa.
- **Decisão:** remover os 4 convites listados.

### 1.5 Sob medida: 4 pedidos para 2
- **O que cortar:** o pedido 02 "Montar o orçamento" e o pedido 04 "Relatório da semana" (`.pedido:nth-child(2)` e `:nth-child(4)` em `#sob-medida`).
- **Economiza:** 291 + 269 px = **0,66 tela** (no desktop, uma linha de 2 cartões).
- **Por que está ruim (medido):** o 02 é a mesma cena do PDF do palco: "Lia, 2 cadernos azuis, R$ 120,00, embrulho incluso". O 04 é o único sem número nem resultado concreto ("atendimentos, propostas e vendas num resumo de uma página"). Ficam o frete por km, que é um caso real da operação, e a cobrança.
- **O que se perde:** dois exemplos de "seja qual for". Dois diferentes entre si provam a tese tão bem quanto quatro.
- **Decisão:** remover 02 e 04.

### 1.6 Prova real: tirar os três fatos gigantes
- **O que cortar:** o `dl.fatos` de `#prova` ("24 horas", "1 app" e "[número a confirmar]").
- **Economiza:** 524 px = **0,62 tela**.
- **Por que está ruim (medido):** "24 horas" é a 5ª vez na página. "1 app" repete o capítulo do Hub, que vem logo depois. O terceiro é um marcador que não pode ir ao ar. Sobra uma prova que é só tipografia de coisa já dita.
- **O que se perde:** o momento de número grande na prova. Quando o Guilherme confirmar o número de leads da revenda, esse único número volta sozinho e vira o dado mais forte do site.
- **Decisão:** remover os três fatos agora; o terceiro volta quando o número existir.

### 1.7 Chamada final: tirar os dois aparelhos
- **O que cortar:** `.final-fones` (`.ff-frente` e `.ff-tras`, com `aria-hidden`).
- **Economiza:** 444 px = **0,53 tela**.
- **Por que está ruim (medido):** repete as telas Início e Aprovar que o leque do Hub mostrou três seções antes. No celular a barra fixa cobre a parte de baixo deles (`giro\celular-final-0.4.png`). E é mais um giro em X de foto plana (32°).
- **O que se perde:** um fecho visual. O fecho continua com título, botões e o selo da Google Play.
- **Decisão:** remover.

### 1.8 Redes: tirar o segundo alcance e duas linhas do Google
- **O que cortar:** `.segundo` ("86.400 contas alcançadas") e as duas últimas `.gmn-linha` ("168 ligações pelo perfil" e "4,9 nota média em 37 avaliações"). Ficam "+1.284 seguidores", a curva, "9.730 visualizações" e "412 rotas".
- **Economiza:** 79 + 127 + 127 px = **0,39 tela**.
- **Por que está ruim (medido):** `#redes` é a seção comum mais alta da página: 3,19 telas, com 9 números grandes. "Alcance" aparece duas vezes seguidas (48.200 no tráfego, 86.400 aqui). E "4,9 em 37 avaliações" é uma avaliação inventada: o briefing proíbe inventar avaliação, e uma etiqueta "exemplo ilustrativo" lá em cima não protege uma nota com estrela colada no nome da Feed.
- **O que se perde:** dois números de exemplo. Nenhum fato.
- **Decisão:** remover os três.

### 1.9 Manual da marca: 8 peças para 5
- **O que cortar:** `.p-tipo` ("Aa, Fraunces para os títulos"), `.p-cartao` e `.p-voz` ("Papel que guarda o que importa."). Ficam logo, paleta, fachada, post e embalagem.
- **Economiza:** a linha tipografia + cartão (cerca de 190 px) e a linha da voz (123 px) = **cerca de 0,38 tela**.
- **Por que está ruim (medido):** o livro tem 1.159 px (1,37 tela) para mostrar uma marca de mentira. A peça de tipografia faz propaganda de uma fonte que só existe para essa marca (ver 3.15), o cartão fica minúsculo a 156 px de largura, e a "voz" é uma frase inventada para a cena (o próprio NOTAS diz isso).
- **O que se perde:** a sensação de manual completo. Cinco peças ainda leem como manual.
- **Decisão:** remover as três.

### 1.10 Tráfego: tirar o trio de números
- **O que cortar:** o `dl.trio` do `.painel` ("48.200 pessoas alcançadas", "2.136 cliques", "R$ 4,82 custo por contato"). Fica o "312 contatos no WhatsApp" com as barras por dia.
- **Economiza:** 227 px = **0,27 tela**.
- **Por que está ruim (medido):** quatro números inventados num painel só, logo antes de outros nove no capítulo das redes. O 312 já faz o trabalho do "número enorme".
- **O que se perde:** custo por contato, o número que mais responderia "é caro". Se o dono quiser um, que seja esse e só esse.
- **Decisão:** remover o trio.

### 1.11 Hub: tirar a faixa corrida
- **O que cortar:** `.faixa` (as frases da loja correndo sem parar).
- **Economiza:** 102 px = **0,12 tela**.
- **Por que está ruim (medido):** é o único elemento que se mexe sozinho, sem fim (`animation: corre 40s infinite`). No celular a frase aparece cortada nas duas bordas ("e seus posts pelo celular.", "Sua empr"). Duas das cinco frases são títulos do palco, iguais ("O Agente deixa o resumo pronto.", "Cada oportunidade no seu lugar."). O DOM tem as cinco duas vezes, e o `aria-hidden` não esconde a cópia do Google.
- **O que se perde:** a citação das frases aprovadas da loja. Elas continuam nos títulos.
- **Decisão:** remover.

### 1.12 "Conheça o app": link morto que joga a pessoa para o topo
- **O que cortar:** o botão `a.btn.btn-linha[href="#"]` de `#hub`.
- **Economiza:** 0 tela (divide a linha com o selo da Google Play), mas é o pior clique da página.
- **Por que está ruim (medido):** tocando nele, a página rola −18.303 px no celular e −17.403 px no desktop: a pessoa volta para o topo de um site de 31 telas. É exatamente o "aperto e não funciona" do dono.
- **O que se perde:** nada, enquanto a página do app não existe.
- **Decisão:** remover até a LP do Hub estar no ar.

### 1.13 Abertura: 4 avisos em volta do celular para 2
- **O que cortar:** `.ev3` ("Google Meu Negócio, Perfil em dia") e `.ev4` ("Proposta enviada, PDF pelo celular").
- **Economiza:** 0 tela (os avisos são absolutos).
- **Por que está ruim (medido):** no celular eles cobrem a tela do aparelho, que é a prova visual da abertura. Têm o mesmo formato, a mesma cor e a mesma altura de botão da pílula "Falar no WhatsApp" do topo, que é botão; tocados, não fazem nada. O ev4 adianta o PDF que o palco mostra depois.
- **O que se perde:** dois dos quatro serviços na primeira tela. A linha logo abaixo lista todos.
- **Decisão:** remover ev3 e ev4.

### 1.14 Textos que sobram, sem mudar a altura
- O segundo nome no rótulo de cada capítulo (`.trecho b`: "A marca chama atenção", "O anúncio traz gente"...), que repete palavra por palavra o título da parada. Fica só "Trecho 0X de 06".
- `.legenda` "Este ponto é o seu cliente. Role para ele andar." (38 px): com as dores dentro da linha, o ponto se explica sozinho.
- O sublinhado de "lumedepapel.demo/agendar" (`.dm u`): é o desenho universal de link, e o link não existe.

## 2. Clicáveis mortos ou fracos

Na página toda há só 5 regras de `:hover` (`.btn`, `.btn-laranja`, `.play`, `.seta`, `.rodape-seo a`) e **nenhuma** de `:active`. No toque, nada na página dá retorno visual de que foi apertado. Dos 32 tipos de elemento com cara de cartão, chip, pílula ou botão testados abaixo, nenhum reage ao toque e só um reage ao mouse (`.fatos`, por causa da entrada). Funcionam de verdade: os 19 links de chamada (todos externos), os 7 `<details>` do FAQ, a seta "Próxima dúvida" e as duas âncoras (logo e "Ver a operação").

| elemento | largura | o que aconteceu | decisão |
|---|---|---|---|
| "Conheça o app" (`a.btn[href="#"]`, #hub) | 390 e 1440 | volta para o topo: −18.303 px e −17.403 px | remover (1.12) |
| Seta "Dúvida anterior" com o carrossel no 01 | 390 e 1440 | nada, e não parece desligada | sai com o carrossel (1.1) |
| Cartões do carrossel + "Arraste para o lado" | 1440 mouse | arrastar com o mouse não move (0 → 0); 3 de 8 à vista, 5 cliques até o último | sai com o carrossel (1.1) |
| Pílulas `.evento` da abertura | 390 e 1440 | nada no toque e no hover; mesmo desenho da pílula de WhatsApp do topo, que é botão | tirar 2 de 4 (1.13) |
| Círculos numerados `.trecho .no` (01 a 06) e `.parada .no` | 390 e 1440 | nada; 44 px, com brilho, mesmo formato das setas (50 px), que são botões; a linha inteira parece um índice de capítulos e não leva a lugar nenhum | é a promessa que mais frustra. Ou perde o brilho de botão, ou vira link (com o outro revisor) |
| Chips "Chamar no WhatsApp" e "Como chegar" (`.g-chips span`) | 390 e 1440 | nada; pílula com texto azul de link, fora do aparelho | remover os chips |
| Título azul do Google (`.g-tit`) | 390 e 1440 | nada; azul de link | fica (lê como print do Google) |
| "lumedepapel.demo/agendar" sublinhado (`.dm u`) | 390 e 1440 | nada | tirar o sublinhado (1.14) |
| "Enviar mensagem no WhatsApp" (`.post-cta`) no anúncio | 390 e 1440 | nada | fica: está dentro do aparelho e lê como tela |
| Campo "Responder a Lia..." (`.chat-campo`) | 390 e 1440 | nada | fica: dentro do aparelho |
| Trilho de 5 barrinhas do palco (`.palco-trilho`) | 390 | nada; parece abas de story, onde tocar avança | fica como indicador (vira 3 barras com 1.2). No desktop ele some e não há índice; o B aprovado tinha índice clicável ali |
| Dias marcados do calendário (`.dias`) | 390 e 1440 | nada, sem hover | fica |
| Etiquetas tracejadas (`.etiqueta`) e caixa `.confirmar` | 390 e 1440 | nada; borda tracejada em pílula lembra botão secundário | `.confirmar` sai (é marcador); `.etiqueta` fica (obrigatória) |
| Cartões `.peca`, `.pedido`, `.passo`, `.painel`, `.gmn-linha`, `.obj`, `.duvida` | 390 e 1440 | nada no toque e nada no hover | os que ficam são conteúdo; os de 1.1, 1.5, 1.8 e 1.9 saem |
| Aparelhos `.hf`, `.lq` (leque), `.ff` (final) | 390 e 1440 | nada | `.ff` sai (1.7) |
| `.contador` "01 / 08" e `.dica` | 390 e 1440 | nada | saem com o carrossel |
| Perguntas do FAQ (`summary`) | 1440 | abrem e fecham, sem nenhum hover (só o cursor muda) | ficam |
| Pílula "Falar no WhatsApp" do topo, logo, "Como funciona o preço", links do texto do FAQ, links do rodapé | 1440 | funcionam, sem hover | ficam |
| Telefone, WhatsApp e e-mail do rodapé | 390 | funcionam; alvo de 18 px de altura (100×18, 66×18, 180×18) | ficam (com o outro revisor) |

**Rolagem.** A regra "só sobe" (as peças se montam uma vez e nunca mais se mexem) faz a página morrer na segunda passada. Reagem nos dois sentidos só o leve deslize da abertura e o palco. Dores, linha, peças da marca, números, barras, calendário, leque e passos montam uma vez e congelam. Carrossel, FAQ, prova (fora a entrada) e rodapé não reagem a nada. A tesoura resolve parte disso: os cortes 1.1, 1.5, 1.6, 1.8, 1.9 e 1.10 tiram justamente blocos que só aparecem e param.

## 3. SEO e GEO: o que atrapalha e tem que sair ou mudar de forma

**Antes de ir ao ar, sem exceção**
1. `<meta name="robots" content="noindex">` (linha 8): sair. Se subir assim, a home da Feed some do Google.
2. `<title>Feed A Linha</title>`: é nome de conceito. Volta o title atual, "Agência de IA para empresas e PMEs | Feed".
3. Falta o `<head>` inteiro do site atual: `google-site-verification` (não pode sumir, é a posse do Search Console), `canonical`, `og:*` e `twitter:*`, os dois JSON-LD (`ProfessionalService` e `FAQPage`) e o favicon. Copiar de `index.html` da raiz. O `FAQPage` tem que ter o texto exato das perguntas visíveis, incluindo as 4 que entram com o corte 1.1.
4. Marcadores visíveis: `[número a confirmar]` (prova) e `[confirmar com Guilherme]` 5 vezes (faixa de preço, prazo médio, canal e horário duas vezes, fidelidade e multa). Os cortes 1.1 e 1.6 tiram todos. Também pendentes, segundo o NOTAS: a frase "A Feed desenha a marca e entrega o manual" e o `href="#"` do "Conheça o app".

**Números de exemplo**
5. No HTML cru, sem JavaScript (como leem GPTBot, ClaudeBot e PerplexityBot), todo painel diz zero: "0 contatos no WhatsApp", "0 pessoas alcançadas", "0 custo por contato", "0 seguidores novos", "0 nota média em 0 avaliações". O Google, que roda JavaScript, lê "312 contatos", "48.200 pessoas" e "4,9 em 37 avaliações" ao lado do nome da Feed. A etiqueta "exemplo ilustrativo" está num `span` no topo do painel, longe do número, e não vai junto quando uma IA extrai a frase. Mudar de forma: o número que ficar vai escrito no HTML, com "exemplo" na mesma frase dele, e o painel leva `data-nosnippet`. A avaliação 4,9 sai de qualquer jeito (1.8).

**Títulos**
6. Um H1 só (certo), mas sem "IA" nem "agência": "A Feed resolve o problema da sua empresa. Seja qual for." A palavra-chave está no `p.kicker` acima ("Agência de IA aplicada · interior de SP"). Mudar de forma: o kicker entra no H1.
7. Os H2 dos serviços são slogans ("Uma marca que a pessoa reconhece de longe", "O anúncio certo, na frente de quem compra", "Rede viva...", "Responde na hora..."). Os nomes que as pessoas buscam (tráfego pago, branding, gestão de redes sociais, Google Meu Negócio, Agente de IA no WhatsApp, funil de vendas) só aparecem nos rótulos pequenos `p.trecho`. Mudar de forma: o nome do serviço sobe para dentro do H2.
8. `h2.rotulo` "Seja qual for o problema" é rótulo marcado como título e repete o H1. Sai com 1.3.
9. Títulos da marca de mentira poluem o sumário da página: `h3` "Novembro da Lume de Papel" e `h4` "Proposta" do PDF. Viram `p`.
10. Não há pulo de nível (h1 → h2 → h3 → h4 em ordem).

**Texto que não é da Feed**
11. A marca de demonstração ocupa 422 das 2.451 palavras (17%): "Lume de Papel", "cadernos para presente", "lumedepapel.demo", "Lia Ventora", "marina.tavares". O cartão `.g-card` imita um resultado do Google com o título "Cadernos para presente | Lume de Papel". Para o buscador, a home da Feed fala de caderno. Os cortes 1.5 e 1.9 reduzem; o que sobrar de maquete (anúncio, cartão do Google, conversa, calendário, PDF) leva `data-nosnippet`.
12. `role="img"` em `.feed`, `.g-card`, `.dias` e `.chat` esconde 174 palavras do leitor de tela, mas o Google indexa tudo. Combinado com o `data-nosnippet` do item 11, fica coerente.
13. A `.faixa` põe as 5 frases duas vezes no DOM. Sai com 1.11.
14. Resposta repetida: a mesma objeção em até três lugares (balão, carrossel e FAQ). Para GEO, a resposta tem que morar uma vez, no FAQ com schema. Resolvido por 1.1.
15. O FAQ, copiado palavra por palavra do site atual, diz "Robô burro irrita.". A regra da casa é nunca "robô". Se a frase mudar, muda também no `FAQPage` do `<head>`.

**Peso**
16. 543 KB em 17 pedidos. O HTML tem 111,5 KB, dos quais 48,7 KB são CSS em linha e 10 KB de JS. São 1.022 elementos (B: 402).
17. Fontes: 180 KB. A Fraunces sozinha pesa 67 KB, o maior arquivo de fonte da página, e serve só à marca de mentira. Sai: o logo da Lume vira SVG com o texto em curva, e o resto usa Barlow. A URL do Google Fonts pede o peso 400, que a página nunca usa: sai da URL.
18. Rolagem: com a CPU 4 vezes mais lenta (celular simples), descer a página toda gasta 2.981 ms de script e 2.361 ms de estilo, com 8 tarefas longas (a pior de 103 ms). O B gasta 514 ms e 1.449 ms. A causa é o `quadro()`: a cada quadro ele lê o `getBoundingClientRect` de cada `[data-acende]` e escreve estilo em umas 30 peças. Cada bloco cortado em 1.1 a 1.10 é uma leitura a menos por quadro.

**O que não atrapalha (conferido)**
- Não há canvas nem texto da Feed preso em imagem. A logo é imagem com `alt="Feed"`, como manda a regra da marca. O único texto em SVG é "Lume de Papel" na fachada, que é da maquete.
- O conteúdo todo está no HTML (fora os números do item 5): página estática, melhor para as IAs que a SPA atual.

## 4. Altura antes e meta depois (celular 390×844)

| seção | hoje (telas) | depois (telas, estimado) | cortes |
|---|---|---|---|
| Abertura | 1,01 | 1,01 | 1.13 (sem altura) |
| Seja qual for o problema | 1,39 | 0 | 1.3 |
| A linha | 1,89 | 1,7 | 1.3, 1.4 |
| Trecho 01 Marca | 2,49 | 1,57 | 1.1, 1.4, 1.9 |
| Trecho 02 Tráfego | 2,79 | 2,01 | 1.1, 1.4, 1.10 |
| Trecho 03 Redes | 3,19 | 2,29 | 1.1, 1.4, 1.8 |
| Abertura do Agente | 0,51 | 0,37 | 1.2 |
| Palco Agente e funil | 5,60 | 3,76 | 1.2 |
| Prova real | 1,78 | 0,88 | 1.1, 1.6 |
| Trecho 06 Feed Hub | 2,05 | 1,55 | 1.1, 1.11, 1.12 |
| Sob medida | 2,22 | 1,56 | 1.5 |
| Como funciona | 1,54 | 1,54 | nenhum |
| Objeções | 1,47 | 0 | 1.1 |
| Perguntas frequentes | 1,35 | 1,71 | recebe as 4 objeções |
| Chamada final | 1,21 | 0,68 | 1.7 |
| Rodapé | 1,00 | 1,00 | nenhum |
| **Total** | **31,6 telas (26.656 px)** | **cerca de 21,6 telas** | |

**Meta: no máximo 22 telas no celular**, 10 a menos (cerca de 31%). No desktop, de 27,4 para perto de 20. Ainda fica mais longo que o B aprovado (16,2), o que é justo: o D mostra seis serviços, e o B mostrava um app. Medir de novo depois dos cortes com o mesmo `medir-altura.mjs`.
