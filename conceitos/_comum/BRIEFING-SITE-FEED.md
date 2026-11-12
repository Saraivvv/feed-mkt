# Site oficial da Feed: briefing da rodada 2

Vale TUDO o que está em `conceitos/_comum/BRIEFING.md` (fatos, assets, regras de copy, regras
técnicas, medidor, formato da entrega). Este arquivo diz o que mudou. Pasta desta entrega:
`conceitos/d-site-feed/`.

## O que aconteceu na rodada 1

- **B "O Aparelho" (`conceitos/b-hub/`) foi APROVADO**, mas como página do app Feed Hub, não
  como site da Feed. Abra o `index.html` e as `capturas/` dele: é a referência de gosto
  aprovada. Ele tem laranja quente com quadriculado leve, capítulos pretos para dar ritmo,
  Barlow pesada, o celular de foto preso no centro, o carrossel de arrastar e a tela de
  bloqueio com avisos. Reaproveite o que servir: classes, o tratamento da moldura, o
  recorte do verde. Copie para a sua pasta, nunca edite a do B.
- **A "O Filme" e C "Manifesto" foram REPROVADOS** com a palavra "horrorosos". Os dois são
  escuros do começo ao fim e o dono desconfia que foi isso. Então: **nada de página toda
  escura.** O preto entra como capítulo de contraste, igual no B, e não como base do site.

## O pedido do dono, nas palavras dele (resumo fiel)

"Quero que a gente fale que resolve o problema do cliente, **independente de qual seja, com
ajuda de IA**, e que a gente **assume a operação do cliente de ponta a ponta**. Quero uma
**experiência visual** que faça a pessoa **sentir que o que a gente fala é verdade**. Quero
mostrar **vários serviços**: o app do Hub, que é produto nosso; **branding** e
desenvolvimento de marca; **tráfego** no Facebook e no Google; **gestão das redes sociais**
com Google Meu Negócio, Instagram e Facebook, com **métricas bem fortes e bem grandes**. Um
site que **acaba com todas as objeções do cliente** e que está **sempre fazendo CTA**,
convidando a pessoa a entrar em contato."

## O que isso vira

1. **Abertura (tese):** a Feed resolve o problema da empresa, seja qual for, com IA, e cuida
   da operação de ponta a ponta. A primeira tela já precisa ter prova visual (um pedaço real
   da operação rodando: o Hub, um painel, um anúncio), não só título.
2. **"Ponta a ponta" mostrado, não dito:** o caminho do cliente do cliente, desenhado como
   uma linha contínua por onde a pessoa passa rolando. A marca chama atenção, o anúncio traz
   gente, as redes e o Google Meu Negócio mantêm a empresa viva, o Agente atende no
   WhatsApp, o funil fecha a venda e o Hub mostra tudo no celular do dono. Cada serviço é um
   trecho dessa linha. É isso que faz a pessoa sentir que é verdade: ela vê as peças
   conversando entre si.
3. **Um capítulo por serviço, cada um com a sua prova visual grande:**
   - **Branding / marca:** um "livro de marca" que se monta na tela (logo, paleta, tipografia,
     aplicações em cartão, fachada, post, embalagem). A marca de exemplo é a **Lume de Papel**,
     a empresa de demonstração do Hub (papelaria, cadernos), sinalizada como marca de
     demonstração. Pode desenhar o logo dela em SVG simples.
   - **Tráfego pago (Meta e Google):** um anúncio da Lume de Papel no feed do Instagram e um
     resultado patrocinado no Google, ao lado de um painel de campanha com números grandes
     (alcance, cliques, custo por contato, contatos no WhatsApp).
   - **Redes sociais e Google Meu Negócio:** um painel com métricas enormes e gráficos que
     sobem com o scroll: seguidores, alcance, visualizações do perfil no Google, rotas
     pedidas, ligações, avaliações. Mais o calendário de posts aprovados e publicados
     sozinhos, e o comentário "AGENDA" que vira mensagem direta.
   - **Agente de IA no WhatsApp + funil:** a conversa acontecendo (o B tem isso) e a
     oportunidade andando no funil até a proposta em PDF.
   - **Feed Hub:** um capítulo curto que resume o B com as telas reais, o botão da Google Play
     e um link "Conheça o app" (a LP do app, por enquanto `#`).
   - **Agentes especialistas e soluções sob medida:** "seja qual for o problema". Mostre 3 ou
     4 problemas diferentes resolvidos como cartões de "pedido → solução" (ex.: calcular frete
     por km, montar orçamento, cobrar quem está atrasado, relatório da semana).
4. **Como funciona:** os 3 passos (Diagnóstico do Gargalo grátis, implantação, acompanhamento).
5. **Derrubar objeções:** uma seção própria e também espalhada pelo site, perto de onde cada
   dúvida nasce. Objeções que o dono quer matar: "é caro", "IA vai irritar meu cliente",
   "não tenho tempo nem TI", "já contratei agência e não deu", "minha empresa é pequena
   demais", "quanto tempo demora", "e se der problema, quem me atende", "vou ficar preso".
   Responda SÓ com fatos do briefing e do FAQ atual. O que não estiver lá (multa,
   fidelidade, prazo exato, preço) fica com o marcador `[confirmar com Guilherme]`. Nunca
   prometa o que não está escrito.
6. **CTA o tempo todo:** depois de cada capítulo, um convite curto e diferente (Diagnóstico
   grátis, chamar no WhatsApp, ver o app). No celular, uma barra de contato fixa embaixo
   (WhatsApp + Diagnóstico), que respeita o `env(safe-area-inset-bottom)` e não cobre o
   conteúdo final.
7. Perguntas frequentes (as do site atual), chamada final e rodapé.

## Números (MUITO importante)

O dono quer métricas "bem fortes e bem grandes", e **é proibido inventar resultado**. Então:
- Desenhe os painéis com números grandes e animados.
- Todo número de resultado sai de UM objeto JS no topo do script (`const NUMEROS = {...}`),
  com um comentário dizendo que são de exemplo e de onde virão os reais.
- Cada painel com número de exemplo leva uma etiqueta pequena e visível "exemplo ilustrativo".
  Assim ninguém lê aquilo como resultado de cliente, e trocar pelo real é editar uma linha.
- Fatos verdadeiros podem aparecer sem etiqueta: 24 horas, 3 passos, Diagnóstico grátis e na
  hora, app no Google Play desde 09/11/2026, interior de SP e Brasil remoto.

## Visual

- A base é clara e quente: o laranja do B, o papel (#ece9e2), o branco. O preto aparece em
  capítulos de contraste. Siga `identidade/design-guide.md`.
- Para o "cinema": scroll que monta as coisas na frente da pessoa (o livro de marca se
  montando, o gráfico subindo, o anúncio aparecendo no feed, a linha da jornada se
  desenhando), profundidade, luz e celular de foto. Uma grande ideia por capítulo, não
  enfeite espalhado.
- Logos de plataforma (Instagram, Facebook, Google, WhatsApp) podem aparecer como
  identificação do canal, pequenos e corretos, e nunca como marca da Feed.

## Entrega

A mesma do BRIEFING.md: `index.html` + `assets/`, o `medir.mjs` com `TOTAL 0 achados`, os
quadros do celular olhados um a um e corrigidos, e o `NOTAS.md`. Sem commit, sem push,
sem deploy, sem mexer fora de `conceitos/d-site-feed/`. SVG próprio sem `<!DOCTYPE>`.
