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

1. **Faixa de preço.** Hoje o site diz só "preço personalizado" e leva para `/quanto-custa/`. Uma faixa ("a partir de R$ X") é a resposta que mais gente procura.
2. **Prazo médio.** Hoje: "o prazo vem escrito na proposta". Um número médio de dias ajuda no FAQ e nas IAs.
3. **Fidelidade e multa.** A objeção "Vou ficar preso?" ficou fora do FAQ porque não dá para responder só com fato.
4. **O número real da revenda.** Leads acompanhados no funil desde a implantação. Com ele a prova real volta a ter um número grande, e seria o dado mais forte do site.
5. **Pode citar o cliente pelo nome?** Hoje está "uma revenda de veículos do interior de SP". Com autorização, entram o nome e uma frase do cliente.

Para confirmar junto:
- Canal e horário de suporte. A resposta de "E se der problema, quem me atende?" hoje diz só quem cuida de quê.
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
- **A prova real é só texto.** Sem o número da revenda e sem o nome, é o capítulo mais fraco de ver.
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

---

## Marca Lume no site (13/11/2026)

A Lume de Papel deixou de ser esboço. O site agora usa a marca completa de `conceitos/marca-lume/` (projeto autoral da Feed), nas mesmas cores das telas do Hub.

### O que mudou
- **Capítulo `#marca`:** o livro mostra as peças do kit. Logo novo em curva, as 4 cores de marca com nome e código (Papel, Mata, Verde Lume, Âmbar), fachada, post e embalagem. O desenho e o comportamento são os mesmos: as peças se montam com a rolagem, levantam com o mouse e vêm para a frente com a legenda quando tocadas.
- **A etiqueta virou "projeto autoral da Feed"** e entrou o botão **"Ver o projeto completo"**, que abre o manual publicado em aba nova.
- **Anúncio do Instagram:** avatar "LD" verde-água, igual ao do Hub, e a arte é o post de verdade da marca ("Um presente. Muitas páginas pela frente."). O botão do anúncio ficou no verde Mata.
- **Resultado do Google:** o mesmo avatar "LD". O endereço de exemplo passou de `.demo` para `.example`, que é o domínio reservado para exemplo.
- **Proposta em PDF:** logo novo no topo, título na Cormorant Garamond e o resto na Manrope, as duas letras da marca.
- Os tokens `--lv`, `--lve`, `--la`, `--lc` e `--lt` são os do `kit-site/tokens.css`. A tinta passou de `#1C2422` para `#263B35`.
- **Saiu todo o esboço antigo:** os símbolos `#lume`, `#lume-nome` e `#cadernos`, a fachada e a sacola desenhadas à mão no HTML e o gradiente do logo. Entraram dois símbolos: `#lume-logo` (assinatura horizontal) e `#lume-ld` (as letras do avatar).

### NA SUBIDA
- **O link "Ver o projeto completo" vira `/portfolio/lume-de-papel/`**, sem `target`. Hoje ele aponta para https://claude.ai/artifact/TohhykXmc93XcMPVqjTRSk. Há um comentário no HTML, em cima do link, dizendo a mesma coisa.

### Arquivos novos (`assets/lume/`, 104 KB no total)
- `fachada.webp` (1100×655, 16 KB), `post.webp` (1080×1080, 46 KB) e `embalagem.webp` (1000×609, 32 KB). Saíram dos SVGs do kit, que pesam de 208 a 338 KB cada. O post serve ao livro e ao anúncio.
- `cormorant-500.woff2` (2,4 KB), `manrope-450.woff2` (4,0 KB) e `manrope-650.woff2` (3,9 KB): subconjunto local, só com as letras que aparecem. Nada de Google Fonts para a Lume.
- **As letras que cada subconjunto tem.** Cormorant: "Verde Lume Mata Âmbar Papel Proposta de exemplo". Manrope: os 4 códigos de cor e todo o texto da proposta. **Mudou um desses textos? Refaça o subconjunto**, senão a letra nova cai na fonte reserva. O script é o `monta-fontes.py` (precisa do `fontTools`), e o das imagens é o `monta-rasters.mjs`. Os dois ficaram em `scratchpad\lume-no-site\`, fora do repo.
- `assets/f3d-feed.webp` foi gerado de novo, porque o anúncio mudou. A altura do rolo é a mesma (a foto de cima perdeu o que a arte ganhou), então o `FEED_TOPO` do `fone-3d.js` continua 0,0892 e o arquivo não foi tocado.
- `assets/f3d-chat.webp` **não mudou**: a conversa é a mesma. O gerador hoje devolve as mensagens uma fração de pixel mais altas (menos de 0,1 px cada) do que os números gravados no `fone-3d.js`, e isso acontece também com a página de antes desta mudança (523b067). É diferença de ambiente, não de conteúdo. Ficou a imagem que bate com o `fone-3d.js`.

### Head
Os 3 pedidos da seção "Aparelho 3D" estão feitos: `preconnect` da jsDelivr com `crossorigin`, `modulepreload` com a mesma URL do importmap e o `preload` da tela do Atendimento no lugar da moldura. A tag `google-site-verification`, o canonical e os 4 blocos de JSON-LD estão idênticos e fazem parse.

### Conferência
- `node conceitos/_comum/medir.mjs d-site-feed`: **`TOTAL 0 achados`**. Celular com 16.153 px, **19,1 telas**.
- Por http, com o 3D ligado, em 360, 390, 768, 1024 e 1440: 0 achados, as 5 peças vêm para a frente e voltam, as 3 fontes carregam e nenhuma letra cai na reserva.
- As maquetes da Lume continuam com `data-nosnippet` (livro, anúncio, painel, calendário e palco). Nenhum travessão, nenhum "Bot" e nenhum `href="#"`.
- A página usa os 19 arquivos de `assets/` e nenhum sobra na pasta: 630 KB, mais 149 KB de HTML.

### O que ainda está fraco
- **O post e a embalagem ficam pequenos no celular** (123 px de altura). A frase do post se lê, mas o texto miúdo das peças vira textura. Para ver direito, só no "projeto completo".
- **O link do projeto sai do site** para o claude.ai até existir a página de portfólio. E a paleta mostra as 4 cores de marca: o Azul caderno, que é só de produto, ficou de fora.
