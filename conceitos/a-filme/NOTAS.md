# Conceito A · O Filme

## A ideia em 3 linhas

O site é um curta contado no scroll, com tarja de cinema, contador de cena e um relógio da história na tarja de baixo.
Ato I é a noite de um dono de empresa que para quando ele para (luz fria de tela de celular). Na cena 04 a fita volta até a mesma terça, 22h07, e a luz laranja acende: a Feed entra.
Cada coisa que a Feed instala é uma cena que paga uma cena do Ato I (a mesma mensagem das 22h03 agora é respondida na hora), o Feed Hub é o clímax e o filme termina no amanhecer.

## As cenas

| tarja | cena | o que mostra |
|---|---|---|
| Abertura | cartaz | título do filme "A empresa que para quando você para.", flare anamórfico laranja, billing block de cartaz com os serviços |
| 01 / 10 | 22h07 | notificações do WhatsApp chegando, relógio grande andando 21h48 a 22h07 |
| 02 / 10 | O lead esfria | a mesma conversa: 10h37 sem resposta (contador corre com o scroll), "já resolvi com outra empresa" |
| 03 / 10 | Tudo passa por você | pendências de hoje viram "amanhã", uma a uma. "Então tudo para quando você para." |
| 04 / 10 | A luz acende | rebobina 23:52 até 22:07 com as falas do Ato I passando ao contrário, a luz pisca e acende, logo, a promessa |
| 05 / 10 | O Agente atende | a mensagem das 22h03 respondida na hora, digitando, nota interna com resumo |
| 06 / 10 | O funil anda | trilho de etapas, o lead anda de Novo contato até Proposta, acompanhamento e PDF pelo celular |
| 07 / 10 | O Instagram | agenda de posts publicando sozinha, comentário AGENDA vira mensagem direta |
| 08 / 10 | Elenco de apoio | agentes especialistas em créditos de cinema, mais marca, conteúdo, site e SEO |
| 09 / 10 | Feed Hub | celular real (moldura aprovada) surge do escuro com glow, 5 telas reais trocam com o scroll, frases aprovadas da loja, botão do Google Play |
| 10 / 10 | Amanhecer | sol nascendo embaixo, "Enquanto você dormia" fecha cada pendência da cena 03 |
| Como começa | 3 passos | película com 3 fotogramas: Diagnóstico do Gargalo, Implantação, Acompanhamento |
| Fatos reais | prova | intertítulo "Baseado em fatos reais." + a revenda de veículos sem nome, só o que está no ar |
| Bastidores | perguntas | FAQ do site atual, igual (`<details>` nativo) |
| Próxima cena | chamada | "Onde a sua operação trava?" + Diagnóstico, WhatsApp, Feed Hub |
| Créditos | rodapé | "Uma produção Feed", links de SEO, CNPJ, contato, como no site atual |

## Escolhas

- **Fonte:** Barlow (corpo, da casa) + **Barlow Condensed** para títulos, claquetes, contador e créditos. É a mesma família, então não briga com a marca, e letra condensada em caixa alta é a linguagem de título e crédito de cinema. Nenhuma display de fora.
- **Movimento:** GSAP 3.12.5 + ScrollTrigger. As cenas não usam `pin` do GSAP: cada cena é uma seção alta com o palco em `position: sticky` (nativo, sem salto de pin-spacer no celular) e o GSAP só faz o scrub. Cena entra com o título subindo antes de prender (nunca prende num quadro preto) e sai recuando e escurecendo (profundidade).
- **Estado, não tween, onde precisa ser lido:** contador de cena, relógio da tarja, etapa do funil e legenda do Hub trocam por estado (classe), sempre inteiros na tela.
- **Luz:** Ato I em luz fria (azul da marca, baixo); a partir da cena 04, laranja. Grão de película a 6% e vinheta fixos, sem blend mode (barato no celular). Sem WebGL.
- **Sem animação:** `prefers-reduced-motion` ou GSAP fora do ar = documento comum, todas as cenas no estado final, tudo visível. Nada fica escondido no CSS esperando JS.
- **Celular:** cada cena cabe em 390×844 entre as tarjas; tarja de cima tem logo, contador e "Diagnóstico grátis" (44px). Alvos de toque 44px, zero estouro.

## Assets (em `assets/`, todos < 60 KB)

- `fone-moldura.webp`: a moldura aprovada **não tinha tela transparente**, era tela verde (chroma). Recortei o aparelho, tirei o verde com limpeza de borda e mantive o furo da câmera por cima da tela. A barra de status (23:58, sinal, wifi, bateria) é HTML, porque as telas não têm barra e a tela da moldura é mais alta que elas.
- `tela-0X-*.webp`: as 5 telas reais (Lume de Papel, demonstração), 720px.
- `feed-logo-branca.png`, `feed-hub-branca.svg` (assinatura aprovada, só trocada a cor para branco).

## O que é marcador ou ilustrativo

- Nenhum número de resultado. Os números que aparecem são da história (horários, "10h37 sem resposta", "3 unidades", "4 não lidas") ou fato verdadeiro (24 horas, 3 passos, grátis, na hora).
- Nomes nas notificações (Mariana, Carlos, "Número novo") e "a proposta da transportadora" são personagens do curta, não clientes.
- Links apontam para `https://agenciafeed.com/...` para funcionarem abrindo do arquivo; no React viram caminhos relativos.
- FAQ copiado como está no site atual, inclusive "Robô burro irrita." (fala do robô dos outros, não do Agente da Feed). Vale o dono confirmar se quer manter a palavra.

## Rodada 2

- Plano de abertura em vídeo (escritório à noite, luz de tela) atrás do título, e um vídeo curto do Hub em uso real no lugar das telas paradas.
- Desenho de som opcional (clique de projetor, notificação abafada), com botão de som desligado por padrão.
- Quando houver número real da revenda (tempo de resposta, leads por mês), entra na cena "Baseado em fatos reais".
- No desktop, compor as cenas 01 a 08 com mais escala (hoje a interface é a do celular, ampliada).
