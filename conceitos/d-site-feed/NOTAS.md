# Conceito D: A Linha (site oficial da Feed), versão 2

Fechada em 12/11/2026. Segue o `revisao/PLANO-V2.md`, que manda sobre os dois relatórios de revisão.

## A ideia em 3 linhas

A Feed resolve o problema da empresa, seja qual for, com IA, e cuida da operação de ponta a ponta.
O site mostra isso como uma linha só: o caminho que o cliente do cliente faz, do primeiro olhar até a venda fechada. Um ponto laranja ("o seu cliente") anda pela linha quando a pessoa rola.
Na versão 2 a linha também é o menu: cada parada é a dor de um serviço e leva ao trecho dele.

## Os números da versão 2

| Medida | Versão 1 | Versão 2 | Meta |
|---|---|---|---|
| Altura no celular (390×844) | 26.656 px, 31,6 telas | 15.950 px, **18,9 telas** | até 20 |
| Altura no desktop (1440×900) | 24.668 px | 15.726 px | sem meta |
| `medir.mjs` | 0 achados | **TOTAL 0 achados** | 0 |
| Clicáveis que funcionam | 3 atalhos internos de 45 | **199 de 199 conferências** | zero morto |
| Clicável sem reação ao mouse ou ao aperto | 14 de 18 | 0 | 0 |
| Lateral do aparelho no pico do giro | não existia | **14,3 px no celular**, 22,2 px no desktop | 12 px no celular |
| `href="#"`, marcador `[confirmar]`, nota 4,9, `noindex` | havia | zero | zero |

Também passa sem achados em 360×740, 768×1024, 1024×768 (tablet deitado) e 1280×720.

---

## Parte 1. O que mudou e por quê

### 1. "Está extenso demais"
- **Saiu a seção das objeções inteira** (o carrossel) e os 5 balões "Dúvida comum". A mesma resposta aparecia em até três lugares. Agora mora uma vez, no FAQ.
- **"Seja qual for o problema" se juntou com a linha.** Eram duas listas dos mesmos seis serviços em sequência. Cada dor virou o título da sua parada.
- **Os três painéis de número viraram um só**, com abas Anúncio, Redes e Google. Saíram o trio de números do anúncio, o segundo alcance e as duas linhas do Google.
- **O palco do Agente caiu de 5 capítulos para 3** (responde na hora, deixa o resumo, funil e proposta) e de 5,6 para 3,4 telas.
- **Convites: ficou a barra fixa e mais 3** (prova real, sob medida e chamada final). Saíram os outros 4.
- **Livro da marca com 5 peças** no lugar de 8. **Sob medida com 2 pedidos** no lugar de 4.
- Saíram os três fatos gigantes da prova real, os dois aparelhos da chamada final e a faixa de frases correndo no Hub.
- O respiro das seções no celular diminuiu.

### 2. "Aperto as coisas e pouco funciona"
- **A linha é o índice do site.** As 6 paradas são links para os trechos.
- **Índice fixo.** No celular, uma pílula na barra de baixo mostra onde a pessoa está ("03/06 · Redes") e abre a folha com os 12 destinos. No desktop, uma barra fina no topo marca o trecho ativo e mostra quanto da página já foi lido.
- **Os tracinhos do palco viraram botões**, e o índice dos capítulos voltou no desktop.
- **Os botões que eram desenho passaram a funcionar.** "Enviar mensagem no WhatsApp" do anúncio e "Chamar no WhatsApp" do Google levam à conversa do Agente, que é a história do site: o clique cai no WhatsApp.
- **Os 2 avisos da abertura são links** (Agente e Tráfego) e não cobrem a tela do aparelho no celular (conferido em 360, 390 e 430 de largura).
- **"Conheça o app" abre o Google Play** até a página do app existir. Nenhum `href="#"` na página.
- Rolagem suave em todo atalho, com folga para a barra do topo.

### 3. "O celular 3D parece uma chapa fina"
- O aparelho ganhou corpo de verdade em CSS 3D: a foto na frente, seis fatias de aço fechando os cantos, costas em grafite, duas laterais de metal escovado e os dois botões na lateral direita. A luz da lateral e a sombra acompanham o ângulo.
- É o mesmo aparelho em todo o site: abertura, anúncio, palco e leque do Hub.
- Giro de até 28° na troca de capítulo, com perspectiva de 700 px no celular e 900 px no desktop, e um balanço de 5° enquanto o capítulo está parado.
- Na abertura, no anúncio, no palco e no leque o aparelho inclina com o mouse ou com o dedo (até 12°) e volta com mola.
- **A espessura ficou em 12,5% da largura, e não nos 10% do plano.** Com 10% a lateral dava 11,4 px no pico do celular, abaixo da meta de 12. Com 12,5% dá 14,3 px.

**A conferência do pico do giro (o que eu vi).** Tirei o quadro do pico em 390 e em 1440, nas duas viradas, e ampliei a lateral.
- No desktop a lateral lê como aço escovado: faixas claras e escuras no sentido do comprimento, o botão de volume e o de ligar com relevo e brilho próprio, e os cantos fechando redondos.
- No celular a lateral tem 14,3 px. Dá para ver as faixas do metal e, na virada para o outro lado, os dois botões. Não parece plástico nem retângulo colado.
- **Decisão: o giro de 28° fica.** Não foi preciso baixar para 10°.
- A ressalva honesta: é metal desenhado, não fotografado. Em tela grande e parado no pico, um olho treinado percebe que as faixas são regulares demais. Uma foto do aparelho em três quartos resolveria de vez (está nos próximos passos).
- O texto do palco não some mais no meio da troca: os dois capítulos ficam com 20% de opacidade cada, um entrando e o outro saindo, com desfoque para um não ficar legível por cima do outro.

### 4. "Os componentes reagem pouco"
- Todo botão afunda ao toque (`scale(.96)`) e reage ao mouse. Medido: zero clicável sem reação.
- Cartões levantam com o mouse (peças do livro, painel, calendário, cartão do Google).
- **Calendário:** o botão "Aprovar o post do dia 23" funciona. O dia vira laranja com o check, a legenda muda, e dá para desfazer.
- **AGENDA:** o botão "Comentar AGENDA" faz o comentário pulsar, aparecer o "digitando" e a mensagem direta chegar. Quem só rola também vê isso acontecer uma vez.
- **Painel:** as abas trocam com toque, arraste ou seta do teclado. Tocar ou passar o mouse numa barra mostra o valor daquele dia.
- **Livro da marca:** tocar numa peça traz ela para a frente e a legenda diz o que a Feed entrega ali.
- **Leque do Hub:** tocar num aparelho de lado traz a tela dele para o centro, com a frase da tela.
- **Sob medida:** cada pedido é um chip. Tocou, aparece o "digitando" e depois a resposta do Agente.
- **FAQ** abre deslizando.
- **A página não morre na segunda passada.** O que é decorativo (linha, brilho, inclinação, montagem das peças) acompanha a rolagem nos dois sentidos. Os números contam uma vez e ficam.

### 5. SEO e GEO
- **`<head>` de produção**, copiado do site atual: a tag `google-site-verification` idêntica, canonical, Open Graph, Twitter e favicon. Sem `noindex`. Title "Agência de IA para empresas e PMEs | Feed". Descrição nova com 143 caracteres.
- **Três blocos de JSON-LD, todos válidos:** `ProfessionalService` com o catálogo novo (tráfego pago, redes, Google Meu Negócio, branding, funil), `MobileApplication` do Feed Hub e `FAQPage`. Só dados que já estavam no schema atual. Nenhum endereço inventado.
- **O `FAQPage` é idêntico às 10 perguntas visíveis**, palavra por palavra (conferido por script).
- **Um H1 só**, com "Agência de IA e marketing no interior de SP" e a frase da tese.
- **O H2 de cada serviço traz o nome que as pessoas buscam:** branding e identidade visual, tráfego pago no Instagram, Facebook e Google, gestão de redes sociais e Google Meu Negócio, Agente de IA no WhatsApp, funil de vendas e CRM, Agentes de IA sob medida.
- **O primeiro parágrafo diz quem é e onde.**
- **Bloco "Onde a Feed atende"** só com as cidades do `areaServed` atual.
- **Links internos no meio do texto** para as 7 páginas de `public/` e para 3 posts do blog. Os três posts estão com `status: published` no frontmatter. Nenhum post agendado foi linkado.
- **Os números de exemplo estão escritos no HTML** (312, +1.284, 9.730 e 412), cada um com "exemplo" na mesma frase. Quem lê sem JavaScript vê o número, nunca 0. O painel e as maquetes da Lume levam `data-nosnippet`.
- **Fontes:** saiu o peso 400 da Barlow e saiu a Fraunces. O logo da Lume virou SVG em curva.
- No FAQ, "Robô burro irrita." virou "Automação mal feita irrita.", na página e no schema.
- Entraram 3 objeções no FAQ, respondidas só com fato: "Já contratei agência e não deu certo", "Minha empresa é pequena demais para isso?" e "E se der problema, quem me atende?".
- Sem travessão, sem "Bot" e sem "robô" na página inteira.

### Desempenho
- A rolagem não mede mais cada elemento a cada quadro. As posições ficam guardadas e só o que está perto da tela é atualizado.
- O script da rolagem inteira, ida e volta, com a CPU 4 vezes mais lenta: cerca de 0,4 a 0,65 s. Na versão 1 eram 2,98 s só de ida.
- Neste fecho, a quantidade de elementos com estilo refeito por quadro caiu de 76 para 45 em média (no tráfego, de 267 para 104).

### O que este fecho consertou (defeitos que a medição achou)
1. **Parágrafo uma linha mais alto até a primeira rolagem.** O Chromium não refaz a conta da unidade `ch` quando a fonte chega. O texto ganhava uma linha e a página mudava de altura no meio da rolagem. Na primeira rodada do teste, dois atalhos da folha pararam fora do lugar e um do desktop parou 25 px abaixo. As 14 larguras em `ch` viraram `em`, e nas duas rodadas seguintes os 199 passaram.
2. **Palco quebrado no tablet deitado (1024×768).** O texto do capítulo entrava 37 px por cima do aparelho e o índice ficava por cima da proposta. Agora o palco passa em 10 tamanhos de tela, de 360×640 a 1920×1080.
3. **Título das perguntas por cima do bloco de baixo.** No desktop, o título preso descia 215 px sobre "Onde a Feed atende" e "Do blog". Título e lista ganharam a própria caixa.
4. **Linha branca da chamada final cruzava os botões.** Passou para baixo do texto.
5. **Vão em branco no painel** nas abas Anúncio e Redes no celular. O gráfico agora cresce até o pé.
6. **Proposta em PDF saía 7 px pela borda direita** no celular.
7. **Título gigante no tablet deitado** espremia a coluna ao lado. O título agora encolhe na mesma proporção do desktop.

### O que continua igual (os pontos fortes)
A tese e a prova na primeira tela, a linha com o ponto "o seu cliente", o livro da marca se montando, o anúncio dentro do celular, o número de cartaz, o palco do Agente com a proposta saindo, a barra fixa, a honestidade (cliente sem nome, etiqueta "exemplo ilustrativo") e o HTML estático.

### Números de exemplo
- Todo número de resultado sai do objeto `NUMEROS`, no topo do `<script>`, e está repetido no HTML do painel para quem lê sem JavaScript. Para trocar pelo real, edite os dois.
- O gráfico fecha com o número de cartaz (há uma conferência no próprio código).
- Fatos sem etiqueta: 24 horas, 3 passos, Diagnóstico grátis e na hora, Google Play desde 09/11/2026, interior de SP e Brasil remoto.

---

## Parte 2. Pendências do Guilherme

Nada disto está na página. Cada item entra quando houver a resposta.

1. **Faixa de preço. RESOLVIDO em 13/11/2026:** o dono informou que os planos mensais começam em R$ 997 e que o resto é sob medida. O valor entrou no passo 3 e na pergunta nova "Quanto custa contratar a Feed?", também no `FAQPage`. Na subida, a página `/quanto-custa/` do site no ar precisa dizer o mesmo. Ainda falta o dono definir o que o plano de entrada inclui.
2. **Prazo médio.** Hoje: "o prazo vem escrito na proposta". Um número médio de dias ajuda no FAQ e nas IAs.
3. **Fidelidade e multa.** A objeção "Vou ficar preso?" ficou fora do FAQ porque não dá para responder só com fato.
4. **Os números reais da Foajupe. CONTINUA PENDENTE.** A seção já tem o lugar pronto (`PROVA_NUMEROS`, no script). Detalhes em "Caso Foajupe (13/11/2026)", no fim deste arquivo.
5. **Pode citar o cliente pelo nome? ENTROU em 13/11/2026**, com o nome, a marca, duas frases e o áudio do Adriano. **Falta a autorização dele por escrito antes de subir.** Detalhes em "Caso Foajupe (13/11/2026)".

Para confirmar junto:
- Canal e horário de suporte. **RESOLVIDO em 13/11/2026:** de segunda a sexta, das 8h às 20h, pelo WhatsApp e pelo telefone. Entrou no FAQ, no rodapé e no `contactPoint` do JSON-LD.
- Google Meu Negócio: falta o link do perfil, ou a decisão de criar o perfil se ele ainda não existir.
- Se o manual da marca é mesmo a entrega padrão do serviço de branding.
- Números reais de um cliente de tráfego ou de redes, com autorização, para trocar o painel de exemplo.

---

## Parte 3. Próximos passos de SEO

Não foram feitos agora, de propósito.

1. **Páginas novas de serviço**, no molde das páginas atuais de `public/`. O site vende estes quatro serviços e nenhum tem página para ranquear:
   - `/trafego-pago/`
   - `/gestao-de-redes-sociais/`
   - `/branding-identidade-visual/`
   - `/feed-hub/` (a página do app, a partir do conceito B aprovado)
2. Quando elas existirem, **cada capítulo linka a sua** e o "Conheça o app" troca o Google Play por `/feed-hub/`.
3. **`llms.txt`:** acrescentar tráfego pago, redes e Google Meu Negócio, branding, o Feed Hub (Google Play desde 09/11/2026) e os 3 passos. Tirar as linhas em branco entre "Contato" e "Guias do blog".
4. **`sitemap.xml`:** incluir as quatro páginas novas.
5. **Na subida:** os links estão como `https://agenciafeed.com/...` para abrir direto do arquivo. No site voltam a ser caminhos relativos, e o favicon volta a `/favicon.svg`.
6. **Manter HTML estático.** Se virar React, pré-renderizar no build. Os robôs das IAs não rodam JavaScript.
7. Hospedar a Barlow no próprio site e trocar a `og-image` escura por uma laranja com o aparelho.

---

## O que ainda está fraco

- **A lateral do aparelho é desenhada.** Lê como aço, mas uma foto real em três quartos seria melhor que qualquer CSS.
- **A prova real é só texto.** Sem o número do cliente e sem o nome, é o capítulo mais fraco de ver. (Resolvido em parte em 13/11/2026: ver "Caso Foajupe", no fim deste arquivo. O número ainda falta.)
- **A marca de demonstração ocupa muito.** A Lume de Papel aparece no livro, no anúncio, no painel, no calendário, na conversa e na proposta. Com um caso real autorizado, metade disso sai.
- No meio da troca de capítulo do palco, por um instante, o texto fica desfocado e ilegível. É transição, mas quem parar exatamente ali vê borrão.
- Com a CPU 4 vezes mais lenta ainda aparecem tarefas longas na rolagem. A medição de tempo nesta máquina oscilou muito, então não dá para afirmar que roda liso num celular simples. Vale testar num aparelho de verdade.

## Como conferir

- `node conceitos/_comum/medir.mjs d-site-feed` na raiz do worktree. Tem que dar `TOTAL 0 achados`.
- Os scripts deste fecho (clicáveis, pico do giro, SEO, palco em 10 telas) ficaram em `scratchpad\v2-fecho\`, fora do repo.
- Assets usados: `assets/fone.webp`, `assets/tela-atendimento.webp`, `assets/tela-funil.webp`, `assets/tela-aprovar.webp`, `assets/tela-inicio.webp`, `assets/feed-hub.svg`, `assets/icone.webp`, `assets/logo-preta.svg` e `assets/logo-branca.png`. HTML com 152 KB e 242 KB de imagens.

---

## Aparelho 3D (12/11/2026)

Substitui o item 3 da Parte 1. O aparelho em CSS foi reprovado ("parece um papel que responde ao mouse"). Agora ele é um objeto 3D de verdade, em WebGL, e é o mesmo nas 6 aparições: abertura, anúncio, palco e os 3 do leque.

**Atualizado em 13/11/2026:** a pose, a espessura, a câmera, a luz e a sombra mudaram. Está em "Aparelho grosso", no fim desta seção. Onde os dois textos divergirem, vale o de baixo.

### O que foi feito
- **Corpo:** 71,5 × 154,6 × 8,6 mm, cantos de 12 mm. A altura passou dos 147 mm do pedido porque as telas do Hub (1080×2313) não trazem barra de status. Sem a barra, a câmera frontal caía em cima do cabeçalho do app. Com a barra a tela fica 4:9 (9:20,25) e o aparelho, 9:19,5.
- **Aro de titânio escovado** (`MeshPhysicalMaterial`, metal 1, aspereza 0,34, brilho esticado no sentido do comprimento), com 4 botões em relevo, 7 linhas de antena, entrada USB-C, furos de som e parafusos.
- **Frente de vidro** com verniz (clearcoat) e reflexo do ambiente com teto, para nunca apagar o texto da tela. Câmera frontal no meio da barra de status.
- **Costas de vidro fosco** com a ilha das câmeras: 3 lentes com anel de metal, cano em degraus, cristal com reflexo colorido, flash e sensor.
- **Luz:** ambiente de estúdio (`RoomEnvironment` com PMREM), uma luz principal de perto (o canto de cima recebe 1,6 vez a luz do de baixo), uma luz lateral que desenha um risco no aro, um contraluz quente e uma luz que anda com o giro. Sombra macia atrás do aparelho.
- **Telas:** as 4 telas reais do Hub em 1080×2430 (webp, 58 a 86 KB cada), pintadas num canvas do tamanho exato que a tela ocupa, para o texto sair nítido. O anúncio do Instagram e a conversa do Agente, que eram HTML, viraram imagem tirada do próprio HTML (`assets/f3d-feed.webp` e `assets/f3d-chat.webp`). O rolo do anúncio continua rolando e as mensagens continuam entrando uma a uma.
- **Movimento, agora com peso:** tudo passa por molas (inércia e um leve passar do ponto). Ficaram o giro com a rolagem, a inclinação com o mouse e com o dedo e o leque de 3. No leque os aparelhos de lado ficam de fato atrás do central.
- **Duas decisões novas, fáceis de desligar:** na abertura o aparelho entra de costas e vira de frente; na última virada do palco ele dá a volta inteira e a tela troca (conversa, depois Funil) enquanto está de costas. É onde a pessoa vê as costas e as câmeras.

### Desempenho e reserva
- **1 contexto WebGL** para a página inteira, fora da tela. Cada aparição é desenhada nele e copiada para o canvas dela.
- Só acorda a aparição que está perto da tela e só desenha quando a pose ou a tela mudam. DPR no máximo 2.
- Medido rolando a página inteira no celular (390×844, DPR 2), com placa de vídeo: **16,9 ms por quadro com o 3D e 17,2 ms sem ele**. O arquivo custa 0,5 ms de script por quadro (2,1 ms com a CPU 4 vezes mais lenta).
- **Sem WebGL, sem a CDN ou se algo falhar, volta o aparelho em imagem**, que continua na página. Em WebGL por software (sem placa de vídeo) o 3D desiste sozinho depois de 14 desenhos lentos.
- Com `prefers-reduced-motion` o aparelho fica parado e desenhado. No palco só a tela troca.
- Peso novo: Three.js 167 KB comprimido (mais 10 KB de complementos) e `assets/fone-3d.js` 10 KB comprimido.

### Arquivos
- `assets/fone-3d.js` e `assets/fone-3d.css`: o aparelho.
- `gera-telas-3d.mjs`: gera de novo as 6 imagens de tela. **Mudou o texto do anúncio ou da conversa no HTML? Rode e confira os números que ele imprime com os do `fone-3d.js`.**
- No `index.html`: 3 regras `.f3d` junto das do `.fone`, um `<script>` de uma linha dentro do `.hf` (decide se o 3D liga, antes de o primeiro aparelho ser pintado), `data-f3d` nas duas telas que eram HTML, 8 pontos no script da página marcados com `F3` e 3 linhas no fim do `<body>`.

### O que peço ao agente de SEO (no `<head>`)
1. `<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>`.
2. `<link rel="modulepreload" href="https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.min.js">`. A URL tem que ser idêntica à do importmap.
3. Trocar o `preload` de `assets/fone.webp` por `assets/tela-atendimento.webp`. A moldura em imagem agora é só a reserva. A tela do Atendimento é a primeira coisa que o 3D precisa.
4. Não mexer no `<script>` que está dentro do `.hf`, nas regras `.f3d` nem no conteúdo dos `.fone`. Os `alt` das telas continuam valendo para leitor de tela e para os buscadores.
5. Se o site ganhar uma política CSP, liberar `cdn.jsdelivr.net` em `script-src`.

### Como conferir
- `node conceitos/_comum/medir.mjs d-site-feed` dá `TOTAL 0 achados` (celular com 16.099 px, 19,1 telas). **Esse script abre a página como arquivo, e o navegador não deixa WebGL usar imagem de arquivo. Ali ele mede a reserva em imagem.** A mesma medição por http, com o 3D ligado, também deu `TOTAL 0 achados` nas 3 larguras.
- Os scripts desta conferência (estúdio, aparições, tiras de animação, tempo de quadro, reserva) ficaram em `scratchpad\fone3d\`, fora do repo.

### O que ainda está fraco
- **As costas são lisas.** Sem marca e sem textura, de frente para a câmera elas parecem um render limpo. O "escovado" do aro é só o brilho esticado, sem risco fino.
- **Foi medido só no Chromium sem janela** (placa GTX 1650 Ti e por software). Falta abrir num Android e num iPhone de verdade: tempo de quadro, Safari e perda de contexto não foram vistos em aparelho.
- **O anúncio e a conversa agora são imagem.** O botão "Enviar mensagem no WhatsApp" continua clicável, mas a área de toque é plana e o aparelho gira. E a página pesa mais: Three.js e telas em 1080.

### Aparelho grosso (13/11/2026)

O dono olhou no desktop e reprovou de novo: "tá fino de papel", apontando o Tráfego e o Funil. A causa não era o modelo, era a pose. Em repouso o aparelho ficava de frente, e de frente todo celular é uma folha: a lateral medida era de 3 a 5 px. Só mudou `assets/fone-3d.js`. O HTML, o CSS e as imagens de tela são os mesmos.

**O que mudou**
- **Pose de repouso em três quartos, em todas as aparições.** `P = 34°` de giro e `PX = 8°` deitado para trás. O aparelho nunca mais para de frente.
  - Abertura, Tráfego, Agente (capítulo 1) e Funil: lateral esquerda à vista, a que aponta para o texto. No Tráfego e no Funil o lado direito já é coberto pelo card do Google e pela proposta.
  - Segundo capítulo do Agente e o aparelho do meio do leque: lateral direita.
  - Leque: os dois de lado abrem até 46° e mostram a lateral de fora.
- **A rolagem, o mouse e o dedo giram em volta da pose.** A rolagem mexe 5 a 6° (antes eram 16 a 18°, e ela devolvia o aparelho para a frente). O mouse, no sentido que achataria o aparelho, vale metade.
- **Palco:** a pose alterna entre os capítulos (+34°, -34°, +34°). Na primeira virada ele passa pela frente e mostra o outro lado. Na última continua dando a volta inteira, e a tela troca com ele exatamente de costas (180°). Há um `console.assert` no arquivo que quebra se essa conta mudar.
- **Espessura estilizada: `D` foi de 8,6 para 14,5 mm**, como em render de anúncio de celular. O ombro do aro (`B`) foi de 1,1 para 3,4 mm: a lateral é uma faixa reta de 7,7 mm entre dois ombros redondos. Botões, vidro, entrada USB-C e furos de som cresceram junto.
- **A faixa reta é sombreada como se fosse um pouco abaulada** (`BOJO`). Numa chapa reta a luz virava um chapado de uma cor só. Assim ela vira um risco que corre pela lateral.
- **Câmera mais perto: `DIST` de 420 para 280 mm.** A borda de cá fica uns 15% mais alta que a de lá. O campo de visão é recalculado, então o tamanho na página é o mesmo.
- **As luzes acompanham a lateral que está à vista:** a principal de cima, a de lado desenha o risco no ombro da frente e o contraluz quente acende a faixa por trás. O lado contrário fica só com o ambiente, mais escuro.
- **Sombra de contato:** a pegada do aparelho no chão, logo abaixo da base, girando com ele. A sombra da parede continua e passou a ficar atrás do ponto mais fundo do corpo, para não cortar o aparelho virado.

**Lateral à vista em repouso** (faixa de metal do aro, do fim do plano da frente até a silhueta, na meia altura, em px de CSS; vértices do aro projetados pela câmera da cena). A meta era 22 px em 390 e 40 px em 1440.

| aparição | 390 antes | 390 depois | 1440 antes | 1440 depois |
|---|---|---|---|---|
| Abertura | 8,6 | 27,3 | 13,5 | 43,0 |
| Tráfego (anúncio) | 3,5 | 32,3 | 4,5 | 41,5 |
| Agente, capítulo 1 | 3,3 | 28,3 | 5,0 | 43,2 |
| Agente, capítulo 2 | 3,2 | 29,2 | 4,9 | 44,5 |
| Funil | 3,4 | 27,3 | 5,2 | 41,7 |
| Leque, o do meio | 2,9 | 26,3 | 4,5 | 41,1 |
| Leque, os de lado | 7,9 | 24,7 | 11,1 | 36,9 |

- Conferido também pela imagem (pontos de metal claro antes do vidro, na linha do meio): 21 a 26 px em 390 e 33 a 38 px em 1440. Dá menos que a projeção porque o ombro da frente tem um fio escuro de reflexo, e a contagem para nele.
- No tablet: 35 a 42 px em 768 e 32 a 42 px em 1024.
- Os de lado do leque ficam em 36,9 px em 1440, abaixo dos 40. Eles são menores (84% do central) e já estão a 46°. Mais que isso a tela deles some.

**Conferência**
- `node conceitos/_comum/medir.mjs d-site-feed`: **`TOTAL 0 achados`**, celular com 16.340 px (**19,4 telas**, igual a antes: o layout não mudou). Por http, com o 3D ligado, também `TOTAL 0 achados` nas 3 larguras.
- Tempo de quadro rolando a página inteira no celular (390×844, DPR 2, GTX 1650 Ti): **17,0 ms**, contra 17,2 ms do commit anterior medido no mesmo dia. O arquivo custa 0,54 ms de script por quadro.
- Continuam valendo: sem WebGL e com a CDN fora do ar volta a imagem; com movimento reduzido o aparelho fica parado na pose e o palco só troca a tela; o dedo inclina e volta; o leque troca pelo teclado; nenhum erro de console.
- Olhados em captura, antes e depois lado a lado, em 390 e 1440: abertura, Tráfego, os 2 capítulos do Agente, Funil e leque. Mais 768 e 1024, a volta inteira do palco e a troca do leque em tira de quadros.
- Os scripts (`cap.mjs` mede e captura, `pares.mjs` monta os pares, `checa.mjs`, `rajada.mjs`, `perf.mjs`) e as capturas ficaram em `scratchpad\fone-grosso\`, fora do repo.

**O que ainda está fraco**
- **A reserva em imagem continua de frente e fina.** Quem cai nela (sem WebGL, CDN fora do ar, `file://`) vê o aparelho antigo. É também o que o `medir.mjs` mede, porque ele abre a página como arquivo.
- **No meio da primeira virada do palco o aparelho passa pela frente.** É um instante da rolagem, mas quem parar exatamente ali vê a folha de novo.
- **Em fundo preto a sombra de contato não aparece.** No Tráfego e no Agente o peso vem só da luz no aro. E o metal puxa para o dourado, por causa do contraluz quente.
- **14,5 mm é quase o dobro de um aparelho real.** Em três quartos lê como render de anúncio. Se um dia o aparelho voltar a ficar de frente ou de perfil, vai parecer um tijolo.
- Continua medido só no Chromium sem janela. Falta ver num Android e num iPhone de verdade.

---

## Marca Lume no site (13/11/2026)

A Lume de Papel deixou de ser esboço. O site usa a marca completa de `conceitos/marca-lume/` (projeto autoral da Feed), nas mesmas cores das telas do Hub. Na segunda rodada do mesmo dia as peças desenhadas em vetor deram lugar às **fotos de mockup** da marca, e a letra serifada passou da Cormorant Garamond para a **EB Garamond 400**, que mantém os acentos do português perto das letras ("você", "páginas", "Âmbar"). O logo continua igual, em contorno.

### O que mudou
- **Capítulo `#marca`:** o livro mostra o logo em curva, as 4 cores de marca com nome e código (Papel, Mata, Verde Lume, Âmbar) e três fotos: fachada (3:2), post (4:5) e embalagem (3:2). O comportamento é o mesmo: as peças se montam com a rolagem, levantam com o mouse e vêm para a frente com a legenda quando tocadas.
- **Layout das peças com as proporções novas:**
  - **Celular:** a mesma grade de antes. A fachada ocupa a linha inteira em 3:2. Embaixo, o post em 4:5 exato (sem corte) ao lado da embalagem, que ali fica mais quadrada e perde uma fatia de cada lado (ponta do envelope e parte da etiqueta). A caixa, o logo, a frase e o laço aparecem inteiros.
  - **De 720 a 1023 px e de 1240 px para cima:** o post fica à direita e ocupa a altura do logo mais a paleta. A linha do logo é `1fr` e a da paleta é `auto`, então a paleta fica na altura dela e o logo leva o resto. Fachada e embalagem dividem a linha de baixo, as duas em 3:2, sem corte.
  - **De 1024 a 1239 px** a coluna do livro é estreita e o post fica baixo demais para caber logo e paleta ao lado. Ali a paleta volta para a linha inteira e o logo fica com a altura do post.
  - Os códigos da paleta ganharam `margin-top:auto`: se um nome quebrar em duas linhas, os códigos continuam alinhados.
- **As legendas acompanharam as fotos:** Fachada fala de "letreiro, vitrine e porta" e Embalagem de "caixa, laço, envelope e etiqueta". O toldo, a placa, a sacola e o lacre eram do desenho antigo e não existem nas fotos. Os `alt` descrevem as fotos novas.
- **A etiqueta é "projeto autoral da Feed"** e o botão **"Ver o projeto completo"** abre o manual publicado em aba nova.
- **Anúncio do Instagram:** avatar "LD" verde-água, igual ao do Hub. A arte é a foto do post ("O que fica em você."), no formato 4:5 do feed. O botão do anúncio fica no verde Mata.
- **Resultado do Google:** o mesmo avatar "LD". O endereço de exemplo é `.example`, o domínio reservado para exemplo.
- **Proposta em PDF:** logo no topo, título na EB Garamond 400 e o resto na Manrope, as duas letras da marca. Como a EB Garamond é mais larga que a Cormorant, o título passou de 1,6em para 1,4em no celular (sobra de 10 px em 360) e ficou em 1,6em de 720 px para cima.
- Os tokens `--lv`, `--lve`, `--la`, `--lc` e `--lt` são os do `kit-site/tokens.css`. A variável `--l-serifa` agora é `"EB Garamond",Georgia,serif`.

### O anúncio 4:5 e as constantes do aparelho 3D
A textura `assets/f3d-feed.webp` **mudou de layout**, e por isso duas constantes mudaram juntas:
- A arte do anúncio cresceu de 100cqw para 125cqw de altura (de 1:1 para 4:5). Em vez de achatar a foto do post de cima, que deixaria de ter proporção de Instagram, o rolo ficou 25cqw mais alto e passou a rolar mais: **de 44cqw para 65cqw**.
- No fim da rolagem aparecem, de cima para baixo: uma tira da foto anterior, as ações dela, o cabeçalho "lumedepapel · Patrocinado", a foto inteira, o botão do WhatsApp, as ações e a legenda.
- **`FEED_TOPO` passou de 0,0892 para 0,0814.** A faixa fixa do topo é a mesma, a imagem é que ficou mais alta (1080×3060). É o número que o `gera-telas-3d.mjs` imprime.
- **O `.65` da função `pinta` do `fone-3d.js` é o mesmo `-65cqw` do `.feed-rolo` no CSS da página.** São um par: mudou um, mude o outro. Há um comentário na linha.
- `assets/f3d-chat.webp` **não mudou**: a conversa é a mesma. O gerador devolve as mensagens uma fração de pixel mais altas (menos de 0,1 px cada) do que os números gravados no `fone-3d.js`. É diferença de ambiente, não de conteúdo. O gerador foi rodado inteiro e a imagem da conversa foi devolvida ao estado do repositório, que é a que bate com o `fone-3d.js`. As 4 telas do Hub saíram idênticas.

### NA SUBIDA
- **O link "Ver o projeto completo" vira `/portfolio/lume-de-papel/`**, sem `target`. Hoje ele aponta para https://claude.ai/artifact/TohhykXmc93XcMPVqjTRSk. Há um comentário no HTML, em cima do link, dizendo a mesma coisa.

### Arquivos de `assets/lume/` (364 KB no total)
- `foto-fachada.webp` (1200×800, 135 KB), `foto-post.webp` (1080×1350, 140 KB) e `foto-embalagem.webp` (1200×800, 72 KB). São cópias sem alteração do `conceitos/marca-lume/kit-site/`. A foto do post serve ao livro e ao anúncio.
- `eb-garamond-400.woff2` (5,0 KB), `manrope-450.woff2` (4,0 KB) e `manrope-650.woff2` (3,9 KB): subconjunto local, só com as letras que aparecem. Nada de Google Fonts para a Lume.
- **Por que não é o `serif-texto.woff2` do kit:** ele só cobre as 5 frases do kit, e a paleta do site escreve "Verde" e "Âmbar". Faltavam **V, b e Â**. O `eb-garamond-400.woff2` foi gerado com fontTools a partir de `conceitos/marca-lume/fontes/eb-garamond-400-latin.woff2` e cobre as duas listas.
- **As letras que cada subconjunto tem.** EB Garamond: "Papel Mata Verde Lume Âmbar Proposta de exemplo", que é todo o texto serifado que a página escreve (a paleta e o título da proposta), mais as 5 frases do kit. Manrope: os 4 códigos de cor e todo o texto da proposta. As frases serifadas das fotos são imagem e não dependem da fonte. **Mudou um desses textos? Refaça o subconjunto**, senão a letra nova cai na Georgia. O script é o `monta-fonte.py`, em `scratchpad\lume-fotos-site\`, fora do repo, junto com o `capturas.mjs` e o `confere.mjs` desta rodada.
- `ebgaramond-OFL.txt` (4 KB): a licença da EB Garamond, que a OFL pede que acompanhe a fonte. A página não carrega esse arquivo.
- **Saíram:** `fachada.webp`, `post.webp`, `embalagem.webp` (as peças em vetor) e `cormorant-500.woff2`. O `@font-face` da Cormorant saiu do HTML.

### Head
Os 3 pedidos da seção "Aparelho 3D" estão feitos: `preconnect` da jsDelivr com `crossorigin`, `modulepreload` com a mesma URL do importmap e o `preload` da tela do Atendimento no lugar da moldura. A tag `google-site-verification`, o canonical e os 4 blocos de JSON-LD estão idênticos e fazem parse. Na rodada das fotos o head de SEO não foi tocado: no `<style>` só mudou a linha do `@font-face`.

### Conferência
- `node conceitos/_comum/medir.mjs d-site-feed`: **`TOTAL 0 achados`**. Celular com 16.340 px, **19,4 telas** (o teto é 20). São 53 px a mais que antes: a fachada passou de 1100:655 para 3:2 e o post de 1:1 para 4:5.
- Por http, com o 3D ligado, em 360, 390, 768, 1024, 1240 e 1440: nenhum erro de console, o post e a fachada sem corte em todas as larguras, a peça tocada vem para a frente com a legenda, as 3 fontes carregam e o título da proposta cabe em uma linha.
- Olhado em captura: o `#marca` em 390 e 1440, a peça tocada, a peça com o mouse, o anúncio no aparelho 3D e no aparelho de CSS (a reserva, por `file://`), e a proposta e a paleta ampliadas 4 vezes para ver a serifa e os acentos.
- As maquetes da Lume continuam com `data-nosnippet` (8, como antes). Nenhum travessão, nenhum "Bot" e nenhum `href="#"`.
- A página pede 19 arquivos de `assets/`, todos existem, e na pasta só sobra a licença: 979 KB, mais 151 KB de HTML.

### O que ainda está fraco
- **A página ficou uns 350 KB mais pesada.** As fotos somam 347 KB contra 93 KB dos desenhos, e a textura do anúncio (`f3d-feed.webp`) foi de 82 para 174 KB, porque agora é fotografia. As três fotos são `loading="lazy"` e estão fora da primeira tela.
- **No celular o post tem 123 × 154 px.** A capa e a frase grande se leem, o texto miúdo vira textura. E a embalagem perde as pontas ali (envelope e etiqueta). Para ver direito, só no "projeto completo".
- **O link do projeto sai do site** para o claude.ai até existir a página de portfólio. E a paleta mostra as 4 cores de marca: o Azul caderno, que é só de produto, ficou de fora.

---

## Avisos do Hub na tela de bloqueio (13/11/2026)

Pedido do dono: trazer para o site oficial a tela de bloqueio com os avisos do Feed Hub, que só existia na landing do app (conceito B). Entrou como fecho do capítulo 06 (`#hub`), depois do leque e antes do botão do Google Play. É a prova de que ele não precisa ficar olhando tudo: o Hub avisa o que precisa dele.

### O que foi feito
- **O mesmo aparelho 3D**, grosso e em três quartos (lateral esquerda à vista, a tela virada para os avisos). É uma aparição nova do tipo `solto` do `fone-3d.js`: nenhuma geometria, luz ou pose nova.
- **A tela de bloqueio é uma textura nova, `assets/tela-bloqueio.webp`** (1080×2430, 19 KB), montada e fotografada pelo `gera-telas-3d.mjs`, do mesmo jeito que o anúncio e a conversa. Tem só o fundo escuro com o brilho laranja embaixo, o relógio e o dia da semana.
  - **Sem dia do mês.** A do conceito B dizia "quarta, 28 de outubro" e ficaria velha. Ficou "terça-feira", que não envelhece (o aviso fala em "sexta", então não podia ser sexta).
  - A hora é a constante `HORA` do gerador (18:32), a mesma da barra de status das telas do Hub.
- **Os 3 avisos são HTML de verdade**, numa lista com `data-nosnippet` (são dados de demonstração). O texto é o do conceito B, sem mudar uma palavra.
  - No celular chegam por cima do aparelho, logo abaixo do relógio, como numa tela de bloqueio, só que maiores que ela.
  - De 720 px para cima saem para o lado da tela, em escada, como os cartões do Google e da proposta. De 1024 px para cima o texto fica à esquerda, do lado da lateral.
- **Chegam um a um com a rolagem e voltam** quando a pessoa sobe. A conta fica no `quadro()` da página (`oAvisa`): `p` vai de 0 a 1 enquanto a cena sobe de 62% para 22% da altura da tela, e cada aviso tem a sua fatia de `p`. Não tem cena presa: o bloco não acrescenta altura de rolagem além da própria.
- **O tranco:** quando o primeiro aviso chega, o aparelho leva um empurrão nas molas (`F3.tranco`, 3 linhas no `fone-3d.js`). Medido: gira 6,5° para o lado da lateral, recua 2,2 mm e assenta em 0,6 s. Na reserva em imagem é uma animação de CSS (`.fone.tranco`).
- **Cada aviso é um link:** Atendimento leva a `#agente`, Instagram a `#redes` e Funil a `#funil`. Tem `:hover` (levanta, ganha contorno laranja e a seta anda), `:active` (afunda) e 98 a 106 px de altura. Aviso que ainda não chegou não recebe clique do mouse. Pelo teclado o aviso focado aparece inteiro, mesmo antes de a rolagem chegar nele.
- **Movimento reduzido:** os 3 avisos já estão visíveis e o aparelho fica parado na pose. **Sem JavaScript:** igual. **Sem WebGL:** a mesma tela de bloqueio aparece no aparelho em imagem, com os avisos por cima.

### O que foi enxugado no capítulo para caber
O teto é de 20 telas no celular e a página estava em 19,4. O bloco custa 540 px no celular. Para caber, tudo dentro do próprio capítulo 06:
- No celular o bloco perde a linha de cima ("Aviso no celular") e a primeira frase do parágrafo. As duas continuam no HTML e aparecem de 720 px para cima.
- O `#hub` ficou com 8 px a menos em cima e embaixo (64 e 48 px) e o leque 8 px mais perto do título.
- **O leque ficou 4% menor no celular** (de 52vw para 50vw: 203 para 195 px de largura em 390). Pela proporção, a lateral do aparelho do meio vai de 26,3 para 25,3 px e a dos de lado de 24,7 para 23,7 px. A meta era 22 px. De 720 px para cima o leque é o mesmo.
- Nenhum outro capítulo foi mexido. O head de SEO e os 4 blocos de JSON-LD estão idênticos (o diff do `index.html` começa dentro do `<style>`).

### Conferência
- `node conceitos/_comum/medir.mjs d-site-feed`: **`TOTAL 0 achados`**. Celular com 16.844 px, **19,96 telas** (o teto é 20). Tablet 18.418 px e desktop 16.623 px.
- Por http, com o 3D ligado (`--enable-gpu --use-angle=d3d11`), em 360, 390, 768, 1024, 1280 e 1440: antes do primeiro aviso nenhum aparece, depois 1, depois os 3; rolando para cima somem os 3 e descendo de novo voltam os 3. Nenhum erro de console e nenhum estouro lateral.
- Clique por script em cada aviso, nas 6 larguras: chega em `#agente`, `#redes` e `#funil`, e o índice marca "04/06 · Agente", "03/06 · Redes" e "05/06 · Funil".
- Pelo teclado: o Tab sai do leque e cai no primeiro aviso, que aparece; o Enter no segundo leva a `#redes`.
- Olhado em captura: antes do primeiro aviso, com 1 e com os 3, em 390 e 1440; a segunda passada; 768 e 1024 com os 3; a reserva em imagem (WebGL desligado) e o movimento reduzido; e a tira de quadros do tranco.
- JSON-LD faz parse (4 blocos). Nenhum travessão, nenhum "Bot", nenhum `href="#"`, toda âncora tem destino. `data-nosnippet` passou de 8 para 9.
- Os scripts (`cap.mjs` captura e clica, `tranco.mjs` mede o empurrão, `teclado.mjs`, `estatico.mjs`, `resumo.mjs`) e as capturas ficaram em `scratchpad\bloqueio-site\`, fora do repo.

### Arquivos
- `index.html`: o bloco `.avisa` dentro do `#hub`, as regras dele no `<style>` (junto das do Hub e nas duas faixas de largura) e 4 pontos no script (`oAvisa`, `medir`, `quadro` e o `pegavel`).
- `assets/fone-3d.js`: só o `F3.tranco`.
- `gera-telas-3d.mjs`: a tela de bloqueio. **Ele regrava as 7 imagens.** As do anúncio e da conversa saem com diferença de fração de pixel do ambiente, e foram devolvidas ao estado do repositório, como na rodada anterior.
- Novo: `assets/tela-bloqueio.webp`.

### O que ainda está fraco
- **No celular, com os 3 avisos, o aparelho quase some.** Sobra o topo com o relógio e um fio da lateral entre os cartões. Mostrar o aparelho inteiro pede uns 100 px a mais, e a página está a 36 px do teto.
- **Sobrou pouca folga: 19,96 telas.** Qualquer texto novo no celular estoura o teto. O próximo acréscimo vai ter que tirar alguma coisa.
- O tranco é um empurrão só, com peso, e não a vibração em três tempos do conceito B. Num celular de verdade pode passar despercebido para quem rola rápido.
- Os links levam para trás na página (o Hub é o capítulo 06 e os avisos apontam para o 03, 04 e 05). Fecha a ideia de ponta a ponta, mas quem clica precisa descer tudo de novo.
- Como o resto do 3D, foi visto só no Chromium sem janela. Falta abrir num Android e num iPhone.

---

## Caso Foajupe (13/11/2026)

A seção "Prova real" (`#prova`) deixou de ser anônima. Agora é "Quem já roda com a Feed", com a Foajupe pelo nome e o depoimento em áudio do Adriano, dono dela. Substitui a seção antiga inteira. O head de SEO e os 4 blocos de JSON-LD não foram tocados (nada de `Review` nem `AggregateRating`).

### O que a seção mostra
- **Título:** "A operação da Foajupe roda com a Feed." No índice do celular a seção aparece como "Foajupe" e, na folha, como "Cliente: Foajupe".
- **Um cartão nas cores da marca da Foajupe** (carbono `#0C0E10`, dourado fosco `#C5A052` como único acento e marfim `#F3EFE7`, do manual dela), com as cantoneiras de registro que o manual usa. O resto da seção segue o site: papel claro, título com a faixa laranja.
- **O cliente:** logo horizontal e a linha "Compra carro ou caminhão com pendência: financiamento em aberto, multa ou restrição." Sem moto e sem promessa de compra ou quitação.
- **A fala:** "A gente se fala pouco sobre o trabalho, porque roda tudo perfeitamente." em destaque, a frase de apoio e a assinatura "Adriano, dono da Foajupe".
- **O player:** "Ouça o Adriano · 44 s", com tocar e pausar, a forma de onda real do áudio (64 fatias), progresso que dá para arrastar com o dedo, com o mouse ou com as setas do teclado, e o tempo. O áudio usa `preload="none"`: só é baixado no primeiro toque. Sem JavaScript fica o player do navegador.
- **"Ler a transcrição":** um `<details>` com o texto dos 44 s. Onde a transcrição automática ouviu uma palavra incerta, está "[...]", com uma linha avisando. A palavra não foi usada em nenhum destaque.
- **"O que a Feed montou para a Foajupe":** 6 itens. Quatro levam ao capítulo do serviço (`#marca`, `#agente`, `#funil`, `#redes`). Site e Material para TV não têm capítulo neste site e ficam sem link.
- **Números:** nada aparece. Ver abaixo.
- **Convite:** "Quer a sua operação assim?" com o botão do Diagnóstico grátis.

### Pendências do dono (nada sobe antes disto)
1. **Autorização do Adriano**, de preferência por escrito, para publicar o nome e a marca da Foajupe, as duas frases e o áudio de 44 s.
2. **Conferir a lista de entregas.** Está marcada com um comentário `DONO, CONFERIR ESTA LISTA` no HTML. Hoje: marca e manual; site; Agente de IA no WhatsApp; funil e CRM no Feed Hub, com proposta em PDF; redes sociais (Instagram e Facebook); material para TV (merchan na Record Interior SP). Pode citar a Record pelo nome?
3. **Os números.** No script há `const PROVA_NUMEROS = [];` com o comentário de como preencher (até 3 itens, `{ valor, rotulo }`). Vazio, a seção não mostra marcador nenhum. Na hora de publicar, escreva os mesmos números dentro do `<dl id="pv-numeros">` do HTML e tire o `hidden`, porque buscadores e IAs não rodam JavaScript.
4. **Trecho de 0:18: RESOLVIDO em 13/11/2026.** O dono confirmou que a palavra é "o Hub" ("O Hub, tudo, cara."), e a transcrição já está completa.
5. **O parágrafo do caso em `seo/llms-txt-proposta.md`** já fala da Foajupe. Vale o mesmo: só publicar depois dos itens 1 e 2.

### Altura no celular
- **Antes: 16.844 px, 19,96 telas. Depois: 17.278 px, 20,47 telas.** O teto desta entrega é 20,5 (17.302 px). Sobraram 24 px.
- A seção foi de 676 para 1.110 px. Para caber, no celular o subtítulo com o link da página de Ribeirão Preto fica escondido (aparece de 1024 px para cima), a lista de entregas vira uma ficha de 2 colunas e o convite ficou numa linha só.
- **Com 3 números a seção cresce 237 px no celular** (20,75 telas com os exemplos do teste). Quando os números chegarem, ou o teto sobe, ou sai alguma coisa: a frase de apoio (78 px) é a primeira candidata.
- Desktop: de 16.623 para 17.141 px. Tablet em pé: de 18.418 para 18.923 px.

### Conferência
- `node conceitos/_comum/medir.mjs d-site-feed`: **`TOTAL 0 achados`** nas 3 larguras.
- Áudio por script, em 390 (toque) e 1440 (mouse), no Chromium sem janela: o arquivo não é pedido no carregamento; tocar na onda antes do primeiro toque marca a posição e o áudio começa dali; toca, o tempo e o progresso andam; arrastar de 20% a 80% leva o áudio para 0:36; pausa; a seta do teclado anda 1 s; no fim ele para e volta ao começo. O botão troca o nome entre "Tocar" e "Pausar".
- Números: com 3 exemplos numa cópia temporária da página, aparecem e cabem em 390, 768 e 1440. A página entregue está com a lista vazia (o script confere).
- JSON-LD faz parse (4 blocos, sem `Review`). Nenhum travessão, nenhum `href="#"`, nenhuma "revenda", os 4 links da lista têm destino.
- Olhado em captura: 390 e 1440 parada, com o áudio tocando e com a transcrição aberta; 768, 1024 e 1280 parada; os 3 números de exemplo em 390, 768 e 1440; e a tela de verdade do celular com a barra fixa.
- Os scripts (`confere.mjs` faz tudo acima, `tela.mjs`, `logo.mjs`, `mede.mjs`) e as capturas ficaram em `scratchpad\prova-foajupe\`, fora do repo.

### Arquivos
- `index.html`: a seção `#prova`, as regras `.pv-*` no `<style>` (base, 720 e 1024 px, e 5 linhas de `:hover`), o `PROVA_NUMEROS` no topo do script e o bloco do player antes do calendário. A folha do índice troca "Prova real" por "Cliente: Foajupe".
- Novo: `assets/adriano-44s.mp3` (304 KB, MP3 mono 56 kbps, 44,4 s; o .m4a não é servido na prévia). É o corte entregue, sem mexer.
- Novo: `assets/foajupe-logo.webp` (28 KB, 680×173, sem perda). Sai do `logo-horizontal.svg` da identidade da Foajupe, que pesa 388 KB.
- `seo/llms-txt-proposta.md`: o parágrafo do caso.
- **Trocou o áudio?** Refaça a onda: `ffmpeg -i assets/adriano-44s.mp3 -ac 1 -ar 8000 -f s16le onda.raw`, tire o RMS de 64 fatias iguais, normalize pelo maior, eleve a 0,7 e multiplique por 100 (mínimo 8). Cole no `ONDA` do script e acerte o `max` do `<input type="range">` com a duração.

### O que ainda está fraco
- **Sem número, o cartão prova pela voz, não pelo resultado.** É bem mais forte que o texto anônimo, mas o dado que fecha a venda ainda não está lá.
- **Só 24 px de folga no celular**, e os números vão estourar o teto.
- **No celular o link "agência de IA em Ribeirão Preto" desta seção some.** Ele continua visível no capítulo de Redes.
- **Dois itens da lista não levam a lugar nenhum** (Site e Material para TV). Ficam como linha sem seta. Quando existir a página do site da Foajupe como caso, entra o link.
- O áudio foi tocado só no Chromium sem janela. Falta ouvir num iPhone (Safari) e num Android de verdade.
- A foto do Adriano ou da loja daria rosto ao depoimento. Hoje a pessoa é só um nome e uma voz.
## Tuiê Atento no contato (16/11/2026)

A caricatura A aprovada foi aplicada ao atalho da barra fixa: cabeça do Tuiê, “Fale com o Tuiê” e “Assistente de IA da Feed”. O convite abre `../f-diagnostico-chat/index.html`, a conversa local com a mesma identidade. O índice e o WhatsApp continuam alcançáveis; a grade da barra deixa o índice encolher no celular para acomodar o convite sem estouro.

Conferência integrada: `node conceitos/verificar-tuie.cjs`, em 390×844, 768×1024, 1024×768 e 1440×980. Verifica que o WebP é o Atento aprovado, o convite permanece dentro da tela e descoberto, o índice navega e o clique abre o diagnóstico, que aceita uma resposta e avança.

Publicado em 16/11/2026 em `https://agenciafeed.com/`, com a conversa em `/diagnostico/`. O build estático em `scripts/build-site.mjs` preserva blog e páginas existentes. Os handlers de diagnóstico, agendamento e quiz usam o CRM nativo do Hub; `_crm.js` e o webhook antigo de CRM foram removidos do site. O servidor valida as respostas e recalcula as notas.

Verificações: build concluído; 15 cenários de backend; chat completo e passagem site → diagnóstico nos quatro aparelhos. Teste real confirmado na tabela `lead`, etapa “Lead novo”, com oito respostas, notas e consentimento. Os quatro contatos isolados usados nos testes foram removidos por workspace, UUID, nome e e-mail, com ausência confirmada depois.

Limite já existente do receptor do Hub: `/api/lead` responde 200 também para recusas silenciosas; por isso a prova de publicação incluiu a consulta ao registro no CRM. A idempotência do site é por instância, com janela de dez minutos. A credencial SMTP antiga foi recusada (`EAUTH 535`) e substituída na Vercel pelo campo seguro. A autenticação Hostinger passou e o teste real retornou `leadSaved:true, pdfSent:true`. A página confirma separadamente o recebimento no Hub e o envio de e-mail, mantendo o PDF para download. O arquivo temporário do segredo foi removido após o uso.
