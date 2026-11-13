# Lume de Papel

Projeto autoral da Feed para uma marca fictícia. Nenhum cliente, endereço, telefone, avaliação, resultado comercial ou produção física é atribuído a este case. Domínio reservado: lumedepapel.example.

## Base preservada

Conceito: O cuidado que fica. Produto: Entrelinhas. Paleta: Verde Lume #3F998B, Mata #1F4D45, Âmbar #C8923C, Papel #F4EFE4 e Azul caderno #395C72 como cor de produto.

Os 16 SVGs de logo e o avatar LD verde permanecem. Foram consultados conceitos/d-site-feed/index.html e conceitos/_comum/hub/tela-03-atendimento.png. Lia, cadernos azuis ou verdes e Agente Lume continuam coerentes. Nenhuma edição no site ou Hub.

Cormorant Garamond 500 e Manrope 450/650 continuam sendo as fontes. TTFs e licenças SIL OFL em fontes/. A rodada extraiu instâncias WOFF2 locais. Origem: https://github.com/google/fonts/tree/main/ofl/cormorantgaramond e https://github.com/google/fonts/tree/main/ofl/manrope.

## Histórico anterior

As 30 aplicações PNG, seus originais vetoriais e os arquivos anteriores de sistema/ foram mantidos. São ilustrações construídas por código, não fotografias. O brandbook anterior usava essas ilustrações. A rodada abaixo substitui a apresentação, sem apagar o acervo.

## Rodada Astra

### Direção

Case editorial de papelaria: fotografia ampla, luz lateral, papel com fibra, tecido, madeira e verde profundo. A aparência fotográfica vem de modelo de imagem, não de SVG simulando fotografia.

Index.html foi refeito: abertura fotográfica, conceito, logo, paleta, hierarquia tipográfica, quatro padrões, voz, aplicações, material gráfico e digital. Fechamento: Projeto autoral da Feed. A página declara a marca fictícia e as cenas geradas por IA.

### Imagem e autoria

12 chamadas bem-sucedidas à ferramenta nativa Codex image_gen.imagegen. Sem Magnific, banco de imagens ou API externa paga separadamente. A ferramenta não retornou preço, créditos ou saldo. Custo não informado, não zero.

Cenas: fachada, sacola na mão, caderno fechado e aberto, caixa de presente com tag, cartão de visita, papel de seda com adesivo, ecobag, celular na mão, vitrine, cartaz urbano, embrulho e forro de caixa.

Todas foram solicitadas limpas, sem texto ou logo. Pessoas geradas, sem referência a pessoa real conhecida. Bases em fotos/bases/. Prompts e ferramenta em sistema/geracao-astra.json.

Logo aplicado a partir de logo/. Textos das novas artes convertidos em contorno usando as fontes locais. Nenhuma letra comercial ou marca foi desenhada pelo gerador.

Composição com Sharp: projeção por quatro pontos, reamostragem, mistura multiplicativa para tinta escura, modulação de iluminação para tinta clara e deslocamento para superfícies flexíveis. Seda com máscara de contorno e exclusão do lacre. Celular com captura real do HTML e máscara nos cantos. Mapeamentos em sistema/mapeamentos-astra.json. Playwright Chromium headless renderizou as artes sociais e as conferências.

12 WebPs finais em fotos/. Quatro PNGs finais em fotos/alta/: fachada, sacola, caderno e presente. Bases e PNGs não entram no carregamento da página.

### Padrões

Quatro módulos SVG, sem DOCTYPE, sem texto e sem repetição do logo:
- Pauta: 120 × 120 unidades, linhas em pares e margem. Guarda do caderno.
- Costura: 96 × 96, pontos cruzados e fios. Papel de seda.
- Dobra: 120 × 120, diagonais em dupla. Papel de presente.
- Trama: 96 × 96, cruzamento de linhas. Forro.

Repetição por translação horizontal e vertical. Campos transparentes estampa-* em artes/ usados na composição. Escalas e usos no brandbook.

### Material gráfico, tipografia e voz

Artes em contorno: cartão frente e verso, tag, etiqueta, cartão de presente, timbrado, capa, impressão da caixa, sacola, ecobag, bilhete e cartazes. Assinatura em HTML com tabela e logo PNG. Ao instalar no serviço de e-mail, incorporar a imagem como anexo de assinatura. Domínio .example demonstrativo.

Nove posts 1080 × 1350 e três stories 1080 × 1920 com fotos de produto. Fonte editável artes/social.html. Perfil em artes/perfil-instagram.html. Botões desenhados são partes da arte, sem funcionamento comercial.

Hierarquia em pixels, pares editorial e funcional e orientação em pontos para impresso. Personalidade, tratamento, ritmo, vocabulário e exemplos completos de legenda, WhatsApp, etiqueta e e-mail. O Agente se identifica e consulta a equipe antes de confirmar prazo.

### Publicação e kit

43 arquivos necessários para a página, 4.492.995 bytes (4,49 MB). Lista em PUBLICAR.md, pesos em sistema/publicacao-astra.json. Sem links de download. Fotos e artes sociais em WebP, vetores em SVG, fontes locais.

Novos arquivos, mantendo os anteriores:
- kit-site/foto-fachada.webp: 1200 × 800, 137.760 bytes.
- kit-site/foto-post.webp: 1080 × 1350, 110.664 bytes.
- kit-site/foto-embalagem.webp: 1200 × 800, 74.132 bytes.

Sem integração no site, commit, push ou deploy. O artifact publicado não foi alterado; esta entrega é local.

### Conferência e limites

TOTAL 0 achados no comando solicitado, sem editar medir.mjs. Check adicional em 390, 768, 1024 e 1440 px. Os 12 mockups foram abertos individualmente na ferramenta de imagem. Revisados lacre, redução de letras da vitrine, mãos visíveis e posicionamento. Capturas 390 e 1440 examinadas com CSS e fontes.

A seda ainda tem simulação aproximada nas dobras complexas. Uma fotografia de estúdio com mapa de deslocamento melhoraria esse detalhe.
Acabamentos, cor, papel e encadernação pedem protótipo e prova física. O case não é arquivo fechado de produção industrial.

Scripts temporários no scratchpad autorizado lume-astra. Check permanente em sistema/verificar-astra.mjs. Nenhuma dependência instalada. Somente conceitos/marca-lume/ alterado no worktree.
