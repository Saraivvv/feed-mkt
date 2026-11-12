# Plano da versão 2 do site oficial (decisão do piloto)

Fontes deste plano:
- `fortes-melhorar.md`, do revisor que diz o que fica e o que melhorar.
- `fracos-remover.md`, do revisor da tesoura.
- A opinião do dono.

Os dois relatórios estão nesta pasta. Leia os dois inteiros: eles trazem seletor, medida e valor de cada item. Onde discordam, vale a decisão abaixo.

## O que o dono disse (nota positiva, mas...)
1. Está extenso demais.
2. É pouco navegável: ele aperta as coisas e elas pouco funcionam.
3. O celular 3D do Hub parece "uma chapa fina" quando gira com o scroll.
4. Os componentes reagem pouco ao mouse, ao clique, ao toque e ao scroll.
5. SEO e GEO precisam estar configuradíssimos para ranquear no nicho no Google e aparecer nas IAs.

## Metas que serão medidas
- **Até 20 telas no celular.** Hoje são 31,6; o B aprovado tem 16,2. É a `altura` do `medir.mjs` em 390 dividida por 844.
- **Zero clicável morto.** Tudo o que parece botão, cartão, chip, pílula, número ou ponto da linha faz alguma coisa ao ser tocado. Se não faz, perde a cara de clicável.
- **Todo botão reage ao toque** (`:active`) **e ao mouse** (`:hover` dentro de `@media (hover:hover)`).
- **No pico do giro, a lateral do celular aparece com pelo menos 12 px no celular** e lê como metal de verdade na captura.
- `medir.mjs` com `TOTAL 0 achados`.

## Decisões onde os revisores discordam
- **Celular 3D.** A tesoura queria tirar o giro, mas o dono pediu espessura e movimento. Vale a melhoria do 2.3 do `fortes-melhorar.md`: `preserve-3d`, duas laterais metálicas com os botões, costas em grafite e `--esp` igual a 10% da largura, com a luz da lateral acompanhando o ângulo. O giro máximo fica entre 22° e 28°, com perspectiva de 700 px no celular e 900 px no desktop. Na abertura e no leque, o aparelho inclina com o dedo ou com o mouse, até ±12°, e volta com mola. Use o mesmo componente de aparelho em todo o site. **Conferência obrigatória:** tire o quadro do pico do giro no celular e no desktop e olhe. Se a lateral parecer plástico ou "retângulo vagabundo" (o dono já reprovou celular desenhado em CSS), baixe o giro para ±10° e deixe a inclinação com o ponteiro como o movimento principal. Explique no NOTAS o que você viu. Corrija também o texto que some no meio da troca: troque o 2,4 por 1,6, como diz o item 2.6.
- **Objeções.** Sai a seção `#objecoes` inteira (o carrossel) e saem os 5 balões "Dúvida comum". O FAQ fica com tudo. Entram no FAQ só as objeções que dá para responder com fato do briefing: "Já contratei agência e não deu" e "Minha empresa é pequena demais", e "E se der problema, quem me atende?" se der para responder só com fato. Faixa de preço, prazo médio, fidelidade e multa NÃO entram nesta versão. Liste no NOTAS como pendência do Guilherme. **Nenhum marcador `[confirmar...]` ou `[número a confirmar]` visível na página.**
- **"Seja qual for o problema" (`#problema`)** se junta com a linha (corte 1.3): cada dor vira o título da sua parada, e a linha vira o índice do site (cada parada é `<a href>` para o seu trecho).
- **Convites:** ficam a barra fixa, mais 3 convites (prova, sob medida e chamada final). Saem os 4 listados no corte 1.4.
- **Painéis de número:** os números de tráfego, redes e Google viram UM painel com abas (Anúncio · Redes · Google). As abas trocam com toque, arraste ou seta do teclado, e as barras mostram o valor quando são tocadas ou quando o mouse passa por cima. Antes de montar, aplique os cortes 1.8 e 1.10: sai o trio, sai o segundo alcance e saem as duas linhas do Google, inclusive a **nota 4,9 em 37 avaliações, que é inventada e tem que sumir**.
- **Avisos da abertura:** ficam 2 dos 4. Os dois viram link para o capítulo deles e não podem cobrir a tela do aparelho no celular.
- **"Conheça o app":** aponta para o Google Play até a página do app ir ao ar. Nada de `href="#"` em lugar nenhum.
- **Sob medida:** 2 pedidos (frete por km e cobrança). Cada um é um chip que, ao ser tocado, mostra o "digitando..." e depois a resposta.
- **Animação de scroll:** o que é decorativo (linha, brilho, inclinação, paralaxe) acompanha a rolagem nos dois sentidos. A página não pode "morrer" na segunda passada. Os números contam uma vez e ficam.
- **Livro da marca:** 5 peças (corte 1.9). Tocar numa peça traz ela para frente com a legenda do que a Feed entrega ali. A Fraunces sai: o logo da Lume vira SVG em curva e o resto é Barlow.
- **Palco do Agente:** 3 capítulos (corte 1.2). Os tracinhos viram botões, e o índice volta no desktop, como no B.
- Cortes 1.6, 1.7, 1.11, 1.13 e 1.14: aplicar.

## Interação (ponto 4 do dono)
Aplique todo o 2.4 do `fortes-melhorar.md`:
- `:active` com `scale(.96)`.
- Cartões que levantam com o mouse.
- Aparelhos que inclinam com o ponteiro.
- Calendário com "Aprovar" que funciona.
- Botão "Comentar AGENDA" que faz a mensagem direta chegar.
- Barras do painel que mostram o valor.
- FAQ que abre deslizando.
- Índice fixo: uma pílula na barra do celular que abre a folha de trechos, e uma barra fina no topo no desktop, com o trecho ativo marcado.
- Rolagem suave com `scroll-margin-top`.

## Desempenho
Hoje o `quadro()` lê o `getBoundingClientRect` de cada `[data-acende]` a cada quadro (item 18 do `fracos-remover.md`). Troque por `IntersectionObserver` com as posições guardadas em cache, e leia tudo antes de escrever. A meta é rolar liso num celular simples.

## SEO e GEO (ponto 5 do dono)
A parte 3 dos dois relatórios vale inteira. Os pontos obrigatórios:
- **`<head>` de produção** copiado do `index.html` da raiz do repo:
  - a tag `google-site-verification` exatamente igual;
  - canonical `https://agenciafeed.com/`, Open Graph, Twitter e favicon;
  - sem `noindex`;
  - title "Agência de IA para empresas e PMEs | Feed";
  - a descrição de 143 caracteres do item 3.4.
  - O JSON-LD `ProfessionalService` ganha o catálogo novo (tráfego pago, redes e Google Meu Negócio, branding, funil) e um `MobileApplication` do Feed Hub. Use só os dados que já estão no schema atual: não invente endereço nem cidade da sede.
  - O `FAQPage` tem que ser idêntico às perguntas visíveis.
- **H1** com "Agência de IA e marketing" e a região, mais a frase da tese. Um H1 só.
- **H2 de cada serviço** com o nome que as pessoas buscam (tráfego pago, gestão de redes sociais, Google Meu Negócio, branding e identidade visual, Agente de IA no WhatsApp, funil de vendas / CRM). As palavras entram no texto do jeito que o dono falaria. Os `h3` e `h4` das maquetes viram `p`.
- **Primeiro parágrafo** dizendo quem é e onde: o item 3.7 do `fortes-melhorar.md`.
- **Bloco "Onde a Feed atende"** só com as cidades que já estão no `areaServed` do schema atual.
- **Links internos no meio do texto** para as páginas de `public/` e para o blog, usando a lista do item 3.9. Antes, confira cada destino: **post de blog só se estiver publicado** (frontmatter em `marketing/blog/*.md`). Post agendado dá 404.
- **Números de exemplo escritos no HTML** com "exemplo" na mesma frase, sem começar em 0. Os painéis e as maquetes da Lume levam `data-nosnippet`.
- **Fontes:** sai o peso 400 da URL, sai a Fraunces.
- No FAQ, "Robô burro irrita." vira "Automação mal feita irrita.", e o resto da resposta fica igual. Mude também no `FAQPage`.
- **Ficam para o NOTAS, como próximo passo** (não faça agora): as páginas novas de serviço (`/trafego-pago/`, `/gestao-de-redes-sociais/`, `/branding-identidade-visual/`, `/feed-hub/`), o `llms.txt` e o `sitemap.xml`.

## O que fica como está (pontos fortes)
É a parte 1 do `fortes-melhorar.md`:
- a tese e a prova na primeira tela;
- a linha com o ponto "o seu cliente";
- o livro da marca se montando;
- o anúncio no celular;
- o número de cartaz;
- o palco do Agente com a proposta saindo;
- a barra fixa;
- a honestidade;
- o HTML estático.
Na hora de cortar, não perca a alma do site.
