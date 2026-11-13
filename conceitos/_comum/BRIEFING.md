# Site novo da Feed: briefing dos 3 conceitos

Pedido do dono (Guilherme, 12/11/2026): "um site foda, cinemático, que explique o que a
gente faz, completão. Me traz 3 variações e já foca no mobile."

Isto é rodada de CONCEITO. Nada aqui vai pro ar. Cada conceito é uma página estática
própria em `conceitos/<pasta>/index.html`, sem tocar em `src/`, `public/` nem em outro conceito.
O escolhido vira React depois (o site real é React 19 + Vite + CSS puro, sem Tailwind).

## Leia antes (5 min)

- `identidade/design-guide.md` (cores, tipo, o que a marca é)
- `_memoria/empresa.md`, `_memoria/preferencias.md`, `_memoria/estrategia.md`
- `src/App.jsx` do site atual: copy dos serviços, "antes e depois", FAQ e rodapé (`SiteFooter`).
  Reaproveite o FAQ e os dados do rodapé (CNPJ, WhatsApp, e-mail, endereço) como estão.
- Carregue a skill `frontend-design` antes de desenhar.

## O que a Feed é (a história que o site conta)

Agência de IA aplicada do interior de SP (base Ribeirão Preto e região, atende o Brasil
remoto). Nasceu agência de marketing e virou operação de IA para pequena e média empresa.
Time: Guilherme (operação, IA, técnico) e Roseane (administrativo, cobrança).

A promessa: **a Feed encontra onde a sua operação trava e instala o que resolve, rodando na
sua rotina.** Não vende ferramenta solta.

Como funciona (3 passos, real):
1. **Diagnóstico do Gargalo**: grátis, a pessoa deixa nome e e-mail e recebe um PDF na hora
   (`/diagnostico`). Depois conversa com o Guilherme se fizer sentido.
2. **Implantação**: proposta com escopo, prazo e valor do caso. A Feed monta, conecta e
   treina quem vai usar. Sem time de TI do cliente.
3. **Acompanhamento**: manutenção mensal quando o projeto pede. Preço personalizado
   (implementação + manutenção, ou serviço pontual; ver `/quanto-custa/`).

O que a Feed instala (agrupe como quiser, mas é isto):
- **Agente de IA no WhatsApp**: responde na hora, 24 horas, resolve o simples, deixa um resumo
  pronto e passa pro humano quando a conversa pede. Sempre "Agente", NUNCA "Bot" ou "robô".
- **Funil de vendas (CRM)**: cada oportunidade numa etapa, acompanhamento automático de quem
  sumiu, proposta em PDF montada e enviada pelo celular.
- **Instagram no automático**: posts agendados e publicados sozinhos, métricas, e comentário
  com palavra-chave que vira mensagem direta (ex.: comentou "AGENDA", recebe o link).
- **Marca, conteúdo, site e SEO**: o lado de marketing, quando serve à operação.
- **Agentes especialistas**: uma equipe de agentes que faz tarefa pelo chat (ex.: calcular
  frete, montar orçamento, preparar relatório).

**O Feed Hub (o diferencial, merece cena própria):** o app onde o cliente da Feed opera tudo.
Está NO AR no Google Play desde 09/11/2026
(https://play.google.com/store/apps/details?id=com.agenciafeed.hub). No celular a equipe:
atende o WhatsApp com cara de WhatsApp, vê o que precisa dela primeiro, acompanha o funil,
aprova posts e orçamentos, recebe aviso no celular. iPhone vem depois (não prometa data).
Frases já aprovadas da loja: "Sua empresa na palma da mão." / "Veja primeiro o que precisa
de você." / "O Agente deixa o resumo pronto." / "Cada oportunidade no seu lugar." /
"Aprove seus posts pelo celular." / "Atendimento, vendas e aprovações no celular."

**Prova real, sem inventar:** hoje uma revenda de veículos do interior de SP roda o
atendimento do WhatsApp com o Agente da Feed, a equipe atende e manda proposta pelo
celular no Hub, e o funil acompanha cada lead. Pode contar isso SEM o nome do cliente.
**É proibido inventar** número de resultado, depoimento, logo de cliente, avaliação ou
selo. Se a cena pede número, use fato verdadeiro (24 horas, 3 passos, 1 app, grátis,
na hora) ou deixe um marcador visível `[número a confirmar]`.

Chamadas (CTAs): principal = "Diagnóstico do Gargalo" (`/diagnostico`); secundárias =
WhatsApp (link do rodapé atual) e "Baixar o Feed Hub" (link do Google Play).

## Assets prontos em `conceitos/_comum/`

- `feed-logo-simples-branca.png` (logo horizontal p/ fundo escuro), `LOGO PRETA FEED.svg`
  (vetor p/ fundo claro/laranja), `feed-symbol.svg` (o F). A marca é SEMPRE a logo em
  imagem, nunca "Feed" digitado em fonte.
- `feed-hub-assinatura.svg`: assinatura "Feed Hub" aprovada (Hub no mesmo traço do logo).
- `hub/tela-*.png`: 5 telas puras do app (1080×2313), dados de DEMONSTRAÇÃO da empresa
  fictícia "Lume de Papel" (pode mostrar à vontade). Entrar, Início, Atendimento, Funil, Aprovar.
- `hub/fone-moldura.png`: moldura de celular REALISTA (foto, tela transparente) aprovada pelo
  dono; `hub/fone.json` tem a posição da tela (confira na imagem, ela pode estar em outra
  escala que o json). Celular desenhado em CSS/SVG foi REPROVADO ("retângulo vagabundo").
- `hub/loja-*.png`, `hub/capa.png`: as artes da Google Play (laranja), referência do que foi aprovado.
- Copie para `conceitos/<pasta>/assets/` o que usar e comprima (sharp está em
  `C:/Users/guisa/OneDrive/Desktop/Feed MKT/FeedMKT/node_modules`; use webp/jpg, alvo < 250 KB por imagem).

## Gosto do dono (já reprovou isso, não repita)

Quer premium, imersivo, cinematográfico, composição coesa (frame central, não peças soltas),
tipografia grande, movimento. Reprovou: grade de features com cara de template SaaS, ícone tipo
"app tile", card oco (vazio embaixo por copy curta), símbolo da marca espalhado como enfeite,
textura que vira mancha (dithering em área grande), quadriculado forte (o `.grid` bem fraco
por baixo da cor é aceito). Gosta de glow, vinheta, luz, profundidade.

## Regras de copy

- NUNCA travessão (— ou –). Use ponto, vírgula ou dois-pontos.
- Gente falando com gente. Sem jargão vazio, sem promessa milagrosa de IA, sem emoji.
- Português do Brasil, frases curtas.

## Regras técnicas

- **Celular primeiro**: desenhe em 390×844 e depois abra para 768 e 1440. O celular é onde o
  dono vai abrir primeiro.
- HTML + CSS + JS puros. Pode usar GSAP 3.12.5 + ScrollTrigger do cdnjs
  (`https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/...`) e Google Fonts. Nada de build.
- Tipografia da casa: Barlow (já é a do site). Um conceito pode trazer uma display do Google
  Fonts se defender o porquê no NOTAS.md.
- Sem geração paga de imagem/vídeo nesta rodada. O "cinema" vem de luz, movimento por scroll,
  tipografia, profundidade e das telas reais do Hub. (Na rodada 2 o escolhido pode ganhar vídeo.)
- `prefers-reduced-motion`: tudo legível sem animação. Conteúdo nunca escondido para sempre
  atrás de animação que não dispara.
- Alvo de toque 44×44 no celular; zero estouro horizontal (carrossel declarado com
  `overflow-x:auto` é exceção); botões e textos reais, não imagem de texto.
- Desempenho no celular: nada de WebGL pesado em tela cheia no celular; se usar, tenha versão leve.

## Entrega (cada conceito)

1. `conceitos/<pasta>/index.html` (+ `assets/`), abrindo direto do arquivo (file://), com o
   site COMPLETO: abertura, o problema, o que a Feed instala, o Feed Hub, como funciona (3
   passos), prova real, perguntas frequentes, chamada final e rodapé.
2. Rode `node conceitos/_comum/medir.mjs <pasta>` até dar `TOTAL 0 achados`. Ele grava
   `capturas/` (página inteira em 3 larguras + quadros do celular a cada rolagem).
   **Olhe os quadros do celular** com a ferramenta de ler imagem e corrija o que estiver feio,
   cortado ou vazio. Medidor verde não é site bonito; nunca mexa no medidor para ele calar.
3. `conceitos/<pasta>/NOTAS.md`: a ideia em 3 linhas, a lista das cenas, as escolhas
   (fonte, movimento), o que é marcador e o que ficaria para a rodada 2.
4. Nada de commit, push ou deploy. Não mexa fora da sua pasta.
