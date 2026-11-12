# Conceito C: Manifesto

## A ideia em 3 linhas

O site é um manifesto em 6 capítulos, e quem faz o cinema é a tipografia.
A abertura diz a promessa inteira em quatro linhas que enchem a tela: "Achamos onde TRAVA. Instalamos o que RESOLVE.", com a palavra TRAVA partida ao meio (ela se encaixa quando você rola).
Preto e papel o tempo todo; o laranja só aparece onde a Feed age: a solução, o Hub e o botão.

## As cenas, na ordem

1. **Abertura.** Quatro linhas que se ajustam à largura da tela (cada linha tem o seu tamanho e todas fecham na mesma borda, como capa de revista). TRAVA vem partida e se encaixa com a rolagem. RESOLVE em laranja com brilho. Botões: Diagnóstico do Gargalo e WhatsApp.
2. **01 O problema.** "Toda empresa tem um lugar onde trava." Depois a frase que troca a palavra no meio: "Hoje quem [responde o WhatsApp / lembra de quem sumiu / monta o orçamento / posta no Instagram / cobra o retorno] é você.", letra por letra, com um fio que marca o tempo. Fechando o capítulo, duas faixas correndo em sentidos opostos com as tarefas que saem da mão do dono.
3. **Antes e depois (cortina).** Três cenas presas na tela. A frase do problema, em papel sobre preto. Ao rolar, uma cortina de papel atravessa da esquerda para a direita com um fio laranja na borda e revela a frase da solução no mesmo lugar. Cada solução leva uma nota de rodapé para o capítulo onde ela é explicada.
4. **02 O que a Feed instala.** "Nada de ferramenta solta." No celular e no tablet, um trilho para arrastar com o polegar (scroll-snap nativo, contador 01 / 05): AGENTE, FUNIL, INSTAGRAM, MARCA, ESPECIALISTAS, cada palavra ocupando a largura do painel, com texto e um exemplo concreto em baixo. No computador o trilho vira um índice gigante, uma linha por frente.
5. **03 O Feed Hub (capítulo laranja).** O capítulo fica preso na tela enquanto você rola, como stories: cinco barras no topo, a frase aprovada da loja troca, a legenda de revista (Fig. 1 a Fig. 5) troca, e a tela dentro do celular real troca (Entrar, Início, Atendimento, Funil, Aprovar). O celular é a moldura aprovada, grande, inclinado e cortado pela borda de baixo. Depois: "Atendimento, vendas e aprovações no celular.", o que a equipe faz, e o botão Baixar o Feed Hub no Google Play.
6. **04 Como funciona (papel).** "Três passos. Nenhum time de TI." Números gigantes em contorno que se enchem de tinta conforme você chega neles. Passo 1 com Grátis e PDF na hora e o botão.
7. **05 Prova real.** "ISSO JÁ RODA." ocupando a tela. O caso da revenda de veículos (sem nome) em texto grande que vai acendendo palavra por palavra enquanto você lê. Ficha técnica com fatos verdadeiros.
8. **06 Perguntas (papel).** As 7 perguntas do site atual, texto igual, abrindo com animação nativa.
9. **Chamada final.** "Comece pelo GARGALO." com luz laranja vindo de baixo, botão principal e os dois secundários.
10. **Rodapé.** Logo grande em imagem, páginas, contato (CNPJ, telefone, WhatsApp, e-mail, endereço) e links, iguais ao `SiteFooter` atual.

O topo fixo mostra o capítulo em que você está (00 / 06 até 06 / 06) e troca de cor com a página: preto, papel ou laranja, com a logo certa para cada fundo.

## Escolhas

**Fonte: Archivo (Google Fonts) para os títulos, Barlow para o resto.** Três motivos:
- A Archivo tem eixo de largura variável (62 a 125). Na largura 62 ela é uma grotesca condensada e pesada, e é isso que deixa a letra enorme no celular sem cortar palavra: OPORTUNIDADE, ESPECIALISTAS e ACOMPANHAMENTO cabem inteiras em 390.
- A família já mora na casa: a Proposta da Feed usa Archivo Black. Não é uma fonte estranha à marca.
- Ela conversa com a Barlow (as duas são grotescas) sem brigar. Barlow segue no corpo, nos botões e nos rótulos.

**Movimento** (tudo em CSS e JS puro, sem GSAP e sem biblioteca):
- máscara palavra por palavra nos títulos;
- TRAVA partida que se encaixa com a rolagem;
- troca de palavra letra a letra;
- faixas correndo;
- cortina presa à rolagem;
- capítulo do Hub preso com troca de tela;
- números que se enchem;
- leitura que acende.

Um laço só de `requestAnimationFrame`, que só roda quando a página rola. O grão de filme é bem fraco (7%), sem pontilhado.

**Sem animação (prefers-reduced-motion):** as cortinas viram antes e depois empilhados, as faixas param e quebram em linhas, os números já vêm cheios e a leitura vem acesa. O Hub continua trocando de tela pela rolagem, mas a troca é seca, para nenhuma tela ficar escondida. Sem JavaScript, tudo aparece empilhado.

## O que é marcador

- **Volume na ficha da prova:** `[número a confirmar]`, visível de propósito. Nenhum número de resultado foi inventado.
- **Os exemplos do trilho são ilustrativos e estão rotulados "Exemplo":** a conversa "Vocês abrem sábado?", as etapas do funil e os pedidos aos agentes especialistas.
- **As telas do Hub são reais, com os dados de demonstração da Lume de Papel**, e a página diz isso logo depois do capítulo.
- **Links apontam para `https://agenciafeed.com/...`** para funcionarem abrindo do arquivo.
- **O FAQ está igual ao do site atual**, inclusive "Robô burro irrita." na pergunta 03. A regra "nunca Bot ou robô" é sobre o nome do nosso Agente, e ali a palavra descreve o concorrente ruim. Se preferir trocar, é uma linha.

## Achado técnico (vale para os três conceitos)

A `hub/fone-moldura.png` não tem a tela transparente: a tela é verde opaco (chroma key). Aqui o verde foi tirado na preparação dos assets (recorte no aparelho e chave de cor, sem vazamento de verde na borda) e a moldura virou `assets/fone.webp` (27 KB). O `fone.json` bate com esse recorte de 1528 × 3316: tela em x 60, y 62, 1408 × 3187.

## Para a rodada 2

- Um plano de vídeo curto (ou partículas leves) por trás da abertura, para a luz laranja ganhar profundidade de verdade.
- Som baixinho opcional na cortina e no Hub, ligado por botão.
- Trocar o marcador de volume por um número real do cliente da revenda, com autorização.
- O trilho do capítulo 02 no computador poderia virar rolagem horizontal presa (como o Hub), se o dono quiser mais cinema ali.
- Revisar a frase do FAQ 03 se o dono quiser zero "robô" no site.
