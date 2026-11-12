# Revisão do conceito D "A Linha": o que fica e o que melhorar

Revisor dos pontos fortes. Medido em 12/11/2026 no Playwright headless, em 390×844 com toque e em 1440×900 com mouse, a partir do `index.html` local. Os scripts e as capturas estão em `C:\Users\guisa\AppData\Local\Temp\claude\f3a6600d269a104b\dff5d254-2c2d-40ae-8f7f-59afaf17b6db\scratchpad\rev-fortes\` (`m1-inventario.mjs` até `m5-pedacos.mjs`, `fone-*.png`).

## Os números que guiam esta revisão

| Medida | Valor |
|---|---|
| Altura no celular | 26.656 px = **31,6 telas** |
| Altura no desktop | 24.668 px = 27,4 telas |
| Tela em que cada coisa começa (celular) | Marca 4,4 · Tráfego 6,9 · Agente 12,9 · Hub 20,8 · Como funciona 25 · Perguntas 28 · Contato 29,6 |
| Maior bloco | palco do Agente: 5,6 telas (mais 0,5 da abertura dele) |
| Elementos clicáveis | 45, dos quais só 3 são atalhos dentro da página (`#topo`, `#caminho` e um `#` morto) |
| Peças com cara de tocável que não fazem nada ao toque | 12 tipos (zero mudança na página e zero rolagem depois do toque) |
| Regras de `:hover` no CSS inteiro | 5 (botões, Google Play, setas, links do rodapé) |
| Regras de `:active` (resposta ao dedo) | 0 |
| Giro do celular no palco | no máximo 15°, só no meio da troca de capítulo |
| Peso total, com fontes | 531 KB |
| Texto real em HTML | 2.454 palavras, 1 H1 |

---

## 1. Pontos fortes que devem ficar

1. **A tese na primeira tela, com prova ao lado** (Abertura). "A Feed resolve o problema da sua empresa. Seja qual for." responde ao pedido do dono em uma frase, e o celular com o Hub e os quatro avisos (Agente respondeu, Anúncio no ar, Google Meu Negócio, Proposta enviada) mostram a operação rodando antes de qualquer rolagem. É a promessa e a prova no mesmo quadro.

2. **A linha com o ponto "o seu cliente"** (De ponta a ponta). É a grande ideia do site: o "ponta a ponta" aparece andando, não escrito. O ponto acompanha os olhos, a linha só avança (nunca desmonta ao voltar) e cada parada acende quando ele passa. Isso é o que faz o visitante sentir que as peças conversam.

3. **As dores que acendem na rolagem, cada uma com o seu trecho** (Seja qual for o problema). Capítulo preto de contraste, frases curtas na língua do dono de empresa ("O WhatsApp responde no dia seguinte."), e a etiqueta "Trecho 04 · Agente de IA" embaixo já amarra a dor à solução.

4. **O livro de marca da Lume se montando** (Trecho 01, Marca). Peças chegando de direções diferentes, fachada, cartão, embalagem e voz com acabamento de manual de verdade, e a etiqueta "marca de demonstração". Visualmente é o capítulo mais bonito do site.

5. **O anúncio dentro do celular de foto e o "312" gigante** (Trecho 02, Tráfego). O anúncio aparece no feed como no Instagram, o resultado do Google entra por cima e o painel traz número grande, barras por dia e a etiqueta "exemplo ilustrativo". Todo número sai do objeto `NUMEROS` e a contagem termina antes do pé da tela. É exatamente a regra do briefing: número forte, sem inventar resultado.

6. **"+1.284" em tamanho de cartaz, Google Meu Negócio, calendário e AGENDA** (Trecho 03, Redes). Atende o "métricas bem fortes e bem grandes" do dono. O calendário com publicado, aprovado e "aguardando você" e o comentário AGENDA que vira mensagem mostram serviço, não discurso.

7. **O palco preso do Agente e do funil** (Trechos 04 e 05). A conversa entra mensagem por mensagem, a nota interna aparece, o fundo vira laranja num círculo de luz, a tela troca para o funil real do Hub e a proposta em PDF sai de trás do aparelho. É herança direta do B aprovado e conta a venda inteira numa cena só.

8. **CTA o tempo todo, sempre diferente, e a barra fixa no celular** (site inteiro). Sete convites com frases próprias ("Quer anúncio que termina em conversa?"), a barra WhatsApp + Diagnóstico aparece depois de meia tela, respeita o `safe-area-inset-bottom`, e o rodapé tem folga para ela não cobrir o fim.

9. **Honestidade visível** (Prova real, Dúvidas). Cliente sem nome, marcadores `[número a confirmar]` e `[confirmar com Guilherme]` à vista, objeções respondidas só com o que a Feed cumpre. Protege a marca e é bom para as IAs: conteúdo sem promessa inventada é o que elas citam com segurança.

10. **Base técnica limpa** (site inteiro). 531 KB com fontes, texto real em HTML, um H1, FAQ em `<details>` nativo palavra por palavra igual ao site atual (pronto para o FAQPage que já existe), `prefers-reduced-motion` respeitado, sem WebGL, alvos de toque de 44 px, medidor em zero achados e os seis links das páginas de SEO no rodapé.

---

## 2. O que melhorar, em ordem de impacto

Os cinco pontos do dono vêm primeiro. Esforço: **P** (horas), **M** (um dia), **G** (vários dias).

### 2.1 "Extenso demais" (ponto 1 do dono)

**Onde:** página inteira, principalmente palco do Agente, painéis de números e balões de dúvida.

**O problema medido:** 31,6 telas no celular. O visitante só chega no "Como funciona" na tela 25 e no contato na 29,6. A altura vem de: palco do Agente 5,6 telas (19% do site), painéis de número 2,9, respiro entre seções 2,6, os 7 convites 1,7, os 5 balões "Dúvida comum" 1,5, livro de marca 1,4.

**A melhoria (comprimir sem perder conteúdo):**
- **Palco do Agente de 5,6 para 3,5 telas.** Os cinco capítulos continuam, cada um com 0,7 tela em vez de 1,1. É trocar `.estagio{height:calc(5.6 * 100svh)}` por `3.5`; os momentos das mensagens (`QUANDO`) já estão em capítulos, então acompanham. Esforço P.
- **Os três painéis de números viram um painel só com abas** "Anúncio · Redes · Google", trocadas no toque ou arrastando. Os mesmos números do `NUMEROS`, o mesmo "312" e o mesmo "+1.284" em tamanho de cartaz. Economiza perto de 2 telas e ainda cria interação (ponto 4). Esforço M.
- **Os balões "Dúvida comum" viram uma pílula de uma linha que abre no toque**, com `<details class="duvida">`. Fechada ela ocupa uns 70 px em vez de 260. A dúvida continua perto de onde nasce. Economiza cerca de 1,2 tela. Esforço P.
- **Respiro das seções no celular:** `.cap-sec` de `104px 0 80px` para `72px 0 56px`. Cerca de 0,9 tela. Esforço P.
- **Meta:** cerca de 21,5 telas (ver a estrutura na parte 4), um terço a menos, com todos os serviços e CTAs.

### 2.2 "Pouco navegável: aperto e não funciona" (ponto 2 do dono)

**Onde:** abertura, linha, dores, anúncio, palco, Hub.

**O problema medido:** não existe menu nem índice. Dos 45 clicáveis, só 3 levam para dentro da página. Tocar nestas peças não muda nada (conferido com observador de mudanças: zero alteração e zero rolagem): os 4 avisos da abertura, as 6 paradas da linha, as 6 dores, as 8 peças do livro, o botão "Enviar mensagem no WhatsApp" do anúncio, os chips "Chamar no WhatsApp" e "Como chegar" do Google, os 4 pedidos sob medida, os dias do calendário, os 5 tracinhos do palco, os aparelhos do leque e o comentário AGENDA. "Conheça o app" aponta para `#` e joga o visitante de volta ao topo. "Ver a operação" pula seco (a rolagem já está no fim em 60 ms). No desktop o índice do palco está escondido (`.palco-trilho{display:none}` a partir de 1024), e o B aprovado tinha índice clicável (`.hub-indice`).

**A melhoria:**
- **O mapa que já existe vira o menu.** Cada `.parada` da linha vira `<a href="#marca">`, `#trafego` e assim por diante; cada `.dor` leva ao seu trecho; cada aviso da abertura leva ao capítulo dele (Agente respondeu → palco, Anúncio no ar → tráfego, Google → redes, Proposta → último capítulo do palco). Nenhum componente novo. Esforço P.
- **Índice fixo que mostra onde a pessoa está.** No celular, uma pílula à esquerda da barra fixa, "03/06 · Redes", que abre uma folha com os 6 trechos, Como funciona, Dúvidas, Perguntas e Contato. No desktop, uma barra fina no topo depois da abertura, com o trecho ativo marcado. Isso também faz o site parecer menor, porque a pessoa sabe quanto falta. Esforço M.
- **Os tracinhos do palco viram botões** que levam ao capítulo, e o índice do B volta no desktop. O código já está no B (`conceitos/b-hub/index.html`, linhas 302 a 307 e 707). Esforço P.
- **Rolagem suave nos atalhos:** `@media (prefers-reduced-motion:no-preference){html{scroll-behavior:smooth}}` e `[id]{scroll-margin-top:72px}`. Esforço P.
- **Os botões falsos passam a funcionar com sentido:** "Enviar mensagem no WhatsApp" do anúncio e "Chamar no WhatsApp" do Google rolam até a conversa do Agente (é a história: o clique cai no WhatsApp, onde o Agente já está esperando). "Conheça o app", enquanto a página do Hub não existe, aponta para o Google Play. Esforço P.

### 2.3 O celular 3D parece "uma chapa fina" (ponto 3 do dono)

**Onde:** palco do Agente (principal), e também abertura, leque do Hub e chamada final.

**O problema medido:** o aparelho é uma foto de frente (`fone.webp`) com a tela por baixo, girada inteira com `rotateY`. Não há `transform-style: preserve-3d`, lateral nem costas. O giro chega a no máximo 15°, só no meio da troca (`Math.sin(pos * PI)` dá zero com o capítulo parado). Em 15° a largura vai de 232 para 216 px e a altura de 500 para 492 px: com `perspective:1500px` quase não há deformação, e os botões laterais continuam pintados na frente, chapados. Ver `fone-cel-s1.png` e `fone-desk-s3.png`. No leque o giro é só no plano (`rotate`), e na chamada final é só `rotateX` na entrada.

**A melhoria:**
- **Espessura de verdade, em CSS 3D.** `.fone{transform-style:preserve-3d}` e três camadas novas dentro dele:
  - lateral direita: `position:absolute; top:4%; bottom:4%; right:0; width:var(--esp); transform-origin:100% 50%; transform:rotateY(90deg); border-radius:999px; background:linear-gradient(90deg,#1b1b1b,#9a9a9a 22%,#4a4a4a 50%,#c9c9c9 78%,#1b1b1b)`, com os dois botões desenhados nela (retângulos de 2 px de relevo);
  - lateral esquerda espelhada (`transform-origin:0 50%; rotateY(-90deg)`);
  - costas em grafite escuro com `transform:translateZ(calc(-1 * var(--esp)))` e o mesmo arredondamento da moldura, para nunca dar para ver através.
  - `--esp` = 10% da largura do aparelho (um celular real tem uns 8 mm de espessura para 72 mm de largura). Dá 23 px no celular e 34 px no desktop.
  - Esforço M.
- **Ângulo e perspectiva que mostram a lateral.** Giro máximo de 28° a 32° na troca, `perspective` de 900 px no desktop e 700 px no celular, e um balanço leve de ±5° enquanto o capítulo está parado, ligado à rolagem dentro do capítulo. Assim a borda aparece sempre, não só num instante. Esforço P.
- **Luz que acompanha o giro.** O brilho da lateral anda com o ângulo (`background-position` ligado a uma variável `--giro`), a sombra do `.fone::before` desloca no sentido contrário (x = giro × -40 px) e o `.reflexo` passa pelo vidro quando o aparelho vira, não pela fração da rolagem. Esforço P.
- **Um aparelho só, usado em todo lugar.** O mesmo componente com espessura na abertura (parado em 3/4: `rotateY(-18deg) rotateX(6deg)`, endireitando com a rolagem), no leque (os de lado com `rotateY(±24deg)` em vez de girar no plano, para a lateral aparecer) e na chamada final. Esforço M.
- **Conferência:** no quadro do pico do giro, a lateral precisa aparecer com pelo menos 12 px no celular. Medir a largura da lateral na captura, não só olhar.

### 2.4 Os componentes reagem pouco (ponto 4 do dono)

**Onde:** site inteiro. A rolagem é a camada forte (linha, dores, livro, números, palco); mouse e dedo são a camada fraca.

**O problema medido:** 5 regras de `:hover` e nenhuma de `:active`, então no celular nada "afunda" ao toque. No desktop, de 18 peças testadas com o mouse, 14 não reagem: avisos da abertura, aparelho da abertura, paradas, peças do livro, cartão do Google, painel, linhas do Google Meu Negócio, pedidos, cartões de dúvida, pergunta do FAQ, leque, aparelhos finais, pílula do WhatsApp do topo e o link "Como funciona o preço". O aparelho da abertura não segue o mouse. O carrossel não arrasta com o mouse (0 px de movimento). A pergunta do FAQ abre seca (de 82 para 240 px em 40 ms).

**A melhoria:**
- **Resposta ao dedo em todo botão:** `a,button,summary{-webkit-tap-highlight-color:transparent}` e `.btn:active,.play:active,.seta:active,.pilula:active,.doca a:active{transform:scale(.96);transition-duration:.08s}`. Esforço P.
- **Cartões que levantam com o mouse**, só em `@media (hover:hover)`: `.peca,.pedido,.obj,.painel,.agenda,.g-card` sobem 6 px, giram -0,6° e ganham sombra mais longa em 0,35 s. Nas peças do livro, usar a propriedade `translate` separada, porque o `transform` delas já é da montagem. Esforço P.
- **Aparelhos que inclinam com o ponteiro** (abertura, leque, final): `rotateY` até ±12° e `rotateX` até ±8°, suavizado (fator 0,12 por quadro). No celular, arrastar o dedo em cima do aparelho inclina e ele volta com mola. É o jeito de o visitante "pegar" o celular e ver a espessura nova. Esforço M.
- **Demonstrações que respondem ao toque**, que é o que faz "sentir que é verdade":
  - Calendário: o dia 23 "aguardando você" ganha um botão "Aprovar"; tocou, ele fica laranja com um check e a legenda passa para "aprovado e agendado". Esforço P.
  - AGENDA: um botão "Comentar AGENDA" que toca o comentário e a mensagem direta chegando em 1,2 s. Esforço P.
  - Sob medida: cada pedido vira um chip ("Quanto fica o frete para Bebedouro?"); tocou, aparecem os três pontinhos de digitando por 0,7 s e depois a resposta. Esforço M.
  - Painel: tocar ou passar o mouse numa barra mostra "dia 12 · 13 contatos", com o dado do `NUMEROS`. Esforço M.
  - Livro: tocar numa peça traz ela para frente em 1,04× com a legenda do que a Feed entrega ali. Esforço P.
- **Carrossel das dúvidas:** arrastar com o mouse (pointerdown e pointermove mexendo no `scrollLeft`), bolinhas clicáveis no lugar de só o contador, `tabindex="0"` e setas do teclado. Esforço P.
- **FAQ que abre deslizando:** `:root{interpolate-size:allow-keywords}`, `details::details-content{block-size:0;overflow:clip;transition:block-size .35s,content-visibility .35s allow-discrete}` e `details[open]::details-content{block-size:auto}`. Onde o navegador não suporta, continua abrindo seco. Esforço P.

### 2.5 SEO e GEO bem configurados (ponto 5 do dono)

A lista completa está na parte 3. Os três de maior impacto: o `<head>` de produção (hoje é de conceito, com `noindex` e sem schema), manter a página como HTML estático em vez de virar React que só aparece com JavaScript, e criar as páginas dos serviços novos que o site vende mas que não existem para o Google.

### 2.6 O texto do palco some no meio da troca

**Onde:** palco do Agente, celular. **Medido:** no pico do giro (troca entre capítulos) os dois textos ficam com opacidade 0 (`1 - |d| × 2,4` com `d = 0,5`), e o terço de cima da tela fica preto e vazio (`fone-cel-s1.png`). **Melhoria:** trocar o 2,4 por 1,6, para um capítulo entrar enquanto o outro sai e sempre haver texto com pelo menos 20% de opacidade. Esforço P.

### 2.7 A prova real é o capítulo mais fraco de ver

**Onde:** Prova real. **Medido:** o terceiro fato é um marcador gigante "[número a confirmar]" com fundo laranja, e o capítulo está na tela 19, depois de todos os exemplos ilustrativos. **Melhoria:** confirmar com o Guilherme o número de leads acompanhados e, com autorização, uma frase do cliente; e subir uma faixa curta de prova para logo depois da abertura ("Já roda numa revenda de veículos do interior de SP: 24 horas, 1 app"), porque é o único fato real de resultado do site. Esforço P (fora o tempo de confirmar).

### 2.8 O capítulo do Hub termina sem destino

**Onde:** Trecho 06, Feed Hub. **Medido:** o leque é parado (só abre com a rolagem) e "Conheça o app" é `#`. **Melhoria:** levar a página do app aprovada (B) para `/feed-hub/` e ligar o botão nela; no leque, tocar num aparelho de lado traz ele para frente com a tela dele. Esforço M.

---

## 3. SEO e GEO: o que melhorar

**O que já está bom:** 1 H1; texto real em HTML (só 5 blocos estão como `role="img"`: conversa, anúncio, Google, calendário e fachada); FAQ idêntico ao do site atual, então o FAQPage atual continua valendo; `lang="pt-BR"`; 531 KB no total; telas do Hub com `alt` descritivo e molduras com `alt=""`, que é o certo para enfeite; seis páginas de SEO, blog e "quanto custa" linkados.

**O que reforçar, por prioridade:**

1. **`<head>` de produção.** Hoje o título é "Feed A Linha", há `noindex`, e faltam canonical, Open Graph, Twitter, a tag `google-site-verification` e todo JSON-LD (zero blocos). Na subida, copiar o `<head>` inteiro do `index.html` atual e manter a verificação exatamente assim: `content="yLpuIhLKUGZIh3HddIlaSDimf88-cgaiAzShLs2Rq0I"`. Tirar o `noindex`. Canonical `https://agenciafeed.com/`.

2. **Continuar HTML estático.** O site atual é React com `<div id="root">`, e os robôs das IAs (GPTBot, ClaudeBot, PerplexityBot) não rodam JavaScript (está no `08-geo-otimizacao-ia.md`). Este conceito já é HTML com texto real. Se virar React, que seja pré-renderizado no build, para o HTML que sai do servidor já ter todo o texto. É o maior ganho de GEO de todo o projeto.

3. **Título.** Manter "Agência de IA para empresas e PMEs | Feed" (41 caracteres), que é o mapeado para a home em `04-otimizacao-on-page.md` e já está indexado. A região entra no H1 e na descrição, e as buscas locais ficam com as páginas de Ribeirão Preto e Bebedouro.

4. **Descrição.** A atual tem 192 caracteres e o Google corta perto de 155. Sugestão com 143: "Agência de IA e marketing do interior de SP: Agente no WhatsApp, funil de vendas, tráfego pago, redes e Google Meu Negócio. Diagnóstico grátis."

5. **H1 com a palavra que se busca.** Manter a frase "A Feed resolve o problema da sua empresa. Seja qual for." e colocar a linha de cima dentro do H1: `<h1><span class="kicker">Agência de IA e marketing em Ribeirão Preto e Bebedouro</span>A Feed resolve...</h1>`. Hoje essa linha é um `<p>` e diz só "interior de SP".

6. **Títulos dos capítulos com o nome do serviço.** Os H2 são frases de efeito ("Rede viva. E os números na sua mão."), boas para ler e fracas para buscar. Medido no texto: "redes sociais" aparece 0 vezes, "identidade visual" e "branding" 0, "CRM" 0, "inteligência artificial" 0, "Barretos" 0, "automação" 3. Melhoria: o rótulo do trecho vira parte do título, por exemplo "Tráfego pago no Instagram, Facebook e Google: o anúncio certo na frente de quem compra." e "Gestão de redes sociais e Google Meu Negócio", e as palavras "identidade visual", "CRM" e "automação de atendimento no WhatsApp" entram no texto de cada capítulo, do jeito que o dono falaria.

7. **Primeiro parágrafo que responde "quem é e onde".** As IAs extraem o começo. Trocar ou completar o subtítulo da abertura com uma frase direta: "A Feed é uma agência de IA aplicada e marketing de Ribeirão Preto e Bebedouro (SP) para pequenas e médias empresas, com atendimento remoto em todo o Brasil."

8. **Bloco visível "Onde a Feed atende"**, perto do rodapé, com Ribeirão Preto, Bebedouro, Barretos, Jaboticabal e Sertãozinho, ligado às duas páginas locais e igual ao `areaServed` do schema. Hoje Ribeirão Preto e Bebedouro aparecem 4 vezes cada, quase só no FAQ e no rodapé.

9. **Links internos no meio do texto, não só no rodapé.** Agente → `/automacao-whatsapp/`; Sob medida → `/agentes-de-ia/`; Como funciona → `/diagnostico-ia-empresa/`; abertura ou prova → `/agencia-de-ia-ribeirao-preto/`; Marca e Redes → `/agencia-de-marketing-bebedouro/`; dúvida "É caro" → `/quanto-custa/` e `/blog/calcular-roi-automacao-ia/`; "IA vai irritar" → `/blog/agente-ia-whatsapp-vale-a-pena/`; "Pequena demais" → `/ia-para-pequenas-empresas/`; "Já contratei agência" → `/blog/como-escolher-fornecedor-ia/`. E uma faixa "Do blog" com os 3 artigos mais novos antes do rodapé.

10. **Páginas para os serviços novos.** O site vende tráfego pago, gestão de redes e Google Meu Negócio, branding e o Feed Hub, mas nenhum deles tem página em `public/` para ranquear. Criar no mesmo molde das páginas atuais: `/trafego-pago/`, `/gestao-de-redes-sociais/`, `/branding-identidade-visual/` e `/feed-hub/`. Cada capítulo linka a sua, e todas entram no `sitemap.xml` e no `llms.txt`.

11. **Schema ampliado.** Manter o `ProfessionalService` e o `FAQPage` atuais e acrescentar: no catálogo, "Tráfego pago (Meta Ads e Google Ads)", "Gestão de Google Meu Negócio", "Branding e identidade visual" e "Funil de vendas com proposta em PDF"; um `MobileApplication` do Feed Hub (Android, categoria BusinessApplication, link do Google Play, publicado pela organização); `address` com `addressLocality`, `addressRegion: SP` e `addressCountry: BR` [confirmar com Guilherme a cidade da sede]; Guilherme e Roseane como `Person` ligados à organização; o link do Google Play em `sameAs`.

12. **Números de exemplo longe do trecho que o Google mostra.** No HTML, os números nascem como "0" e o JavaScript põe o valor; um robô sem JavaScript lê "0 contatos no WhatsApp", e um com JavaScript pode citar "312 contatos" como resultado da Feed. Pôr `data-nosnippet` nos três painéis e na seção sob medida resolve as duas pontas. Quando houver número real autorizado, ele vai escrito no HTML.

13. **`llms.txt` atualizado.** Acrescentar tráfego pago, redes e Google Meu Negócio, branding, o Feed Hub (Google Play desde 09/11/2026) e os 3 passos. E tirar as 16 linhas em branco entre "Contato" e "Guias do blog".

14. **As 8 dúvidas no FAQPage**, depois que os `[confirmar com Guilherme]` forem respondidos. São buscas reais do nicho ("quanto custa", "fidelidade", "quanto tempo demora").

15. **Peso das fontes.** A Barlow 400 é baixada e não é usada em nenhum lugar (o CSS usa 500 a 900): tirar economiza uns 22 KB. A Fraunces pesa 67 KB só para a marca de demonstração: usar o parâmetro `&text=` do Google Fonts com as letras usadas. Hospedar a Barlow no próprio site (item 4 das pendências do `04-otimizacao-on-page.md`). Trocar a `og-image` escura por uma laranja com o aparelho.

---

## 4. Proposta de estrutura enxuta

Tudo o que existe hoje continua; o ganho vem de comprimir e juntar em interação. Quem decide o que sai é o outro revisor.

| Ordem | Seção | Telas de celular hoje | Telas propostas |
|---|---|---|---|
| 1 | Abertura: tese, celular 3D com espessura, avisos que levam aos capítulos | 1,0 | 1,0 |
| 2 | Faixa de prova real: revenda do interior de SP, 24 horas, 1 app | (1,8 na tela 19) | 0,6 |
| 3 | Seja qual for o problema: dores tocáveis que levam ao trecho | 1,4 | 1,0 |
| 4 | A Linha, que também é o índice do site (paradas clicáveis) | 1,9 | 1,3 |
| 5 | Trecho 01, Marca: o livro que se monta, com peças tocáveis | 2,5 | 1,8 |
| 6 | Trechos 02 e 03, Anúncio e Redes: anúncio no feed, painel único com abas Anúncio · Redes · Google, calendário com "Aprovar" e AGENDA tocável | 6,0 | 3,5 |
| 7 | Trechos 04 e 05, Agente e funil: abertura curta e palco preso | 6,1 | 3,9 |
| 8 | Trecho 06, Feed Hub: leque 3D, Google Play e "Conheça o app" funcionando | 2,1 | 1,5 |
| 9 | Sob medida: pedidos que respondem ao toque | 2,2 | 1,4 |
| 10 | Como funciona: os 3 passos | 1,5 | 1,2 |
| 11 | Dúvidas: o carrossel das 8, arrastável também com o mouse | 1,5 | 1,2 |
| 12 | Perguntas frequentes, com "Onde a Feed atende" e "Do blog" | 1,4 | 1,3 |
| 13 | Chamada final e rodapé | 2,2 | 1,8 |
| | **Total** | **31,6** | **21,5** |

Os balões "Dúvida comum" ficam dentro dos capítulos, como pílula de uma linha que abre no toque, e cada capítulo mantém o seu convite. O índice fixo (pílula na barra do celular, barra fina no desktop) acompanha a página do começo ao fim.
