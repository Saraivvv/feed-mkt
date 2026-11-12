# Conceito B: O Aparelho

## A ideia em 3 linhas

Uma página de lançamento de aparelho em que o protagonista é o celular com o Feed Hub.
A história é "a Feed instala a operação e você comanda pelo celular": o serviço vem primeiro, e o app é a vitrine que mostra o serviço rodando.
O laranja das artes da Google Play alterna com capítulos pretos, e o mesmo aparelho atravessa a página.

## As cenas

1. **Abertura (laranja):** "A Feed instala a operação. Você comanda pelo celular." Três aparelhos em leque (Aprovar, Atendimento, Funil). Os de trás se abrem quando a página rola. Um traço de luz se desenha atrás deles. Botões: Diagnóstico grátis e o selo da Google Play. No topo fica o WhatsApp.
2. **O problema (preto):** cinco frases de dor que acendem uma a uma com a rolagem, terminando em "E tudo depende de você estar olhando." Logo depois vem a promessa da Feed.
3. **O que a Feed instala (laranja):** carrossel de arrastar com o polegar (scroll-snap), com as 5 frentes: Agente no WhatsApp, Funil, Instagram no automático, Marca/conteúdo/site/SEO e Agentes especialistas. Cada cartão tem promessa, descrição e três entregas, para não ficar oco. Tem contador e setas.
4. **Feed Hub, abertura (preto):** a assinatura "Feed Hub", "Você comanda pelo celular." e o selo da Google Play.
5. **Feed Hub por dentro (palco preso, 6 telas de rolagem):** o aparelho fica fixo no centro e a tela troca a cada capítulo, subindo como um app de verdade. O fundo alterna preto e laranja, e o laranja abre num círculo de luz a partir do aparelho. Os capítulos são:
   - 01 Atendimento: "O Agente deixa o resumo pronto."
   - 02 Início: "Veja primeiro o que precisa de você."
   - 03 Funil: "Cada oportunidade no seu lugar." Um segundo aparelho surge atrás, com a conversa que virou oportunidade.
   - 04 Aprovar: "Aprove seus posts pelo celular."
   - 05 Aviso: tela de bloqueio em HTML de verdade. Três avisos caem um a um e o aparelho vibra quando o segundo chega.
   No celular, uma barra de progresso de 5 trechos fica no topo. No desktop, um índice clicável fica à direita.
   O aparelho gira um pouco em Y entre capítulos, e um reflexo de luz corre pelo vidro.
6. **Como funciona (laranja):** três passos com numeral gigante vazado que se preenche ao rolar. "Três passos. O primeiro é grátis."
7. **Prova real (preto):** a revenda de veículos do interior de SP, sem nome. Os fatos são 24 horas, 1 app e um marcador `[número a confirmar]`.
8. **Perguntas (preto):** o FAQ do site atual, palavra por palavra, em `<details>` nativo.
9. **Chamada final (laranja):** "Sua empresa na palma da mão." Botões de Diagnóstico, WhatsApp e Google Play. Dois aparelhos sobem e se abrem ao entrar. A nota diz que o iPhone vem depois, sem data.
10. **Rodapé (preto):** os dados do `SiteFooter` atual (CNPJ, telefone, WhatsApp, e-mail, região, links de SEO, blog e privacidade).

## Escolhas

- **Fonte:** só Barlow, de 500 a 900. A página de aparelho se apoia em tamanho e peso, não numa display nova. O destaque é uma caixa (`mark`) atrás da palavra, preta no laranja e laranja no preto, como nas artes da loja.
- **Aparelho:** a moldura aprovada (`fone-moldura.png`) tinha um verde de recorte na tela. Ela foi recortada, o verde virou transparente e o resultado foi comprimido para `assets/fone.webp` (25 KB). As telas reais entram por baixo do vidro. Cada tela ganhou uma barra de status (18:42), porque o print puro começava colado no topo e brigava com a câmera.
- **Movimento:** JS puro com `requestAnimationFrame` na rolagem, sem GSAP. O palco preso usa `position: sticky` e a página continua rolando normalmente. As trocas de tela são suavizadas perto de cada virada, então em cada capítulo a tela fica parada e legível.
- **Sem movimento** (`prefers-reduced-motion`): as telas trocam seco, sem giro e sem entrada, e o texto está todo visível. Sem JS, o palco vira uma lista com os 5 capítulos.
- **Celular:** o aparelho ocupa a metade de baixo da tela, e o texto do capítulo fica numa faixa fixa em cima, sem nunca cobrir o texto. Os botões têm 44px ou mais e não há estouro horizontal. O único carrossel é o das frentes, com `overflow-x: auto`.
- **Peso:** 6 imagens webp, entre 25 e 57 KB cada. Não há WebGL.

## Marcadores (não é dado real)

- `[número a confirmar]` na prova real: quantos leads o funil da revenda acompanhou desde a implantação.
- Na tela de bloqueio, "Lia Ventora" e "Nina Alvore" são os contatos de demonstração da Lume de Papel, os mesmos das telas reais. Os textos dos avisos foram escritos para a cena.
- Os links apontam para `https://agenciafeed.com/...` para abrir do arquivo. No React voltam a ser caminhos relativos.

## Para a rodada 2

- Um vídeo curto dentro da tela no capítulo de Atendimento, com a conversa acontecendo, mensagem por mensagem, no lugar do print parado.
- As telas do Hub em resolução 2x para desktop. Hoje elas têm 704 px de largura e estão no limite em 1440.
- Um aparelho de verdade fotografado em ângulo (3/4) para a abertura, no lugar de rotacionar a mesma foto frontal.
- Trocar o marcador da prova por um número confirmado com o cliente, e talvez uma frase dele, com autorização.
