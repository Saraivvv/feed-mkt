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
