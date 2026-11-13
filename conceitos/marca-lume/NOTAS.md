# Lume de Papel

Projeto autoral da Feed para uma marca fictícia. Nenhum cliente, endereço, telefone, avaliação, resultado comercial ou produção física é atribuído a este case. Domínio reservado: lumedepapel.example.

## Base preservada

Conceito: O cuidado que fica. Produto: Entrelinhas. Paleta: Verde Lume #3F998B, Mata #1F4D45, Âmbar #C8923C, Papel #F4EFE4 e Azul caderno #395C72 como cor de produto.

Os 12 SVGs da assinatura e do símbolo permanecem. O avatar e os três arquivos antigos de monograma foram substituídos pela chama na revisão abaixo. Foram consultados conceitos/d-site-feed/index.html e conceitos/_comum/hub/tela-03-atendimento.png. Lia, cadernos azuis ou verdes e Agente Lume continuam coerentes. Nenhuma edição no site ou Hub.

EB Garamond 400 é a serifada de texto; Manrope 450/650 permanece. A EB Garamond substitui a Cormorant nos textos porque mantém os acentos do português próximos às letras; a Cormorant fica apenas no desenho original do logo em contorno. TTFs, WOFF2 e licenças SIL OFL em fontes/. Origem oficial da nova serifada: https://github.com/google/fonts/tree/main/ofl/ebgaramond.

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

Após a revisão: 45 arquivos necessários para a página, 4.300.217 bytes (4,30 MB). Lista em PUBLICAR.md, pesos em sistema/publicacao-astra.json. Sem links de download. Fotos e artes sociais em WebP, vetores em SVG, fontes locais.

Novos arquivos, mantendo os anteriores:
- kit-site/foto-fachada.webp: 1200 × 800, 137.760 bytes.
- kit-site/foto-post.webp: 1080 × 1350, 143.654 bytes.
- kit-site/foto-embalagem.webp: 1200 × 800, 74.212 bytes.

Sem integração no site, commit, push ou deploy. O artifact publicado não foi alterado; esta entrega é local.

### Conferência e limites

TOTAL 0 achados no comando solicitado, sem editar medir.mjs. Check adicional em 390, 768, 1024 e 1440 px. Os 12 mockups foram abertos individualmente na ferramenta de imagem. Revisados lacre, redução de letras da vitrine, mãos visíveis e posicionamento. Capturas 390 e 1440 examinadas com CSS e fontes.

A seda ainda tem simulação aproximada nas dobras complexas. Uma fotografia de estúdio com mapa de deslocamento melhoraria esse detalhe.
Acabamentos, cor, papel e encadernação pedem protótipo e prova física. O case não é arquivo fechado de produção industrial.

Scripts temporários no scratchpad autorizado lume-astra. Check permanente em sistema/verificar-astra.mjs. Nenhuma dependência instalada. Somente conceitos/marca-lume/ alterado no worktree.

## Revisão de tipografia, crédito e expressão digital

### Escolha tipográfica

Teste de 400 e 500 renderizado e inspecionado antes da aplicação, com a frase “Próxima você ação última também já é página coração” em 82 px. Escolhido 400 pela leveza em títulos grandes. Evidência: capturas/revisao-teste-acentos.png.

Arquivo oficial EBGaramond[wght].ttf e OFL em fontes/. Subconjunto local eb-garamond-400-latin.woff2 com Latin, Latin-1, Latin Extended-A e pontuação, 25.312 bytes. O peso 500 permanece apenas para o teste. kit-site/serif-texto.woff2 contém as cinco frases solicitadas e pesa 5.040 bytes.

Serifada atualizada no brandbook, artes vetoriais, nove posts, três stories, assinatura de e-mail e fotos recompostas. Também foram identificadas pela geometria dos glifos e substituídas 150 frases em 33 SVGs legados de originais/, sistema/ e kit-site/. PNGs correspondentes sincronizados. Assinaturas Lume de Papel e LD preservadas. Auditoria: zero contornos Cormorant fora dos logos.

### Fotografias e posts

Nenhuma nova geração de imagem. Os mesmos PNGs limpos da Rodada Astra foram usados na composição, com as projeções anteriores. Todos os 12 WebPs foram recompostos; os que só têm logo ou padrões resultaram idênticos. Bases e 16 arquivos da pasta logo/ preservados byte a byte.

Posts continuam em 1080 × 1350. A faixa creme passou de 490 px para aproximadamente 238 px, determinada pelo conteúdo; a foto ocupa o restante. Título EB Garamond 400 a 74 px, apoio Manrope a 24 px, margem lateral de 58 px. Removido o símbolo isolado da faixa. Recorte alinhado à esquerda no caderno e vitrine, à direita na caixa e no embrulho para preservar a informação relevante. Stories continuam em 1080 × 1920, com a nova serifada.

### Feed e entrega

Topo com a imagem horizontal preta oficial e “Branding e identidade visual”. Crédito final com a imagem branca oficial. Arquivos em marca-feed/. SVG sem DOCTYPE. Nenhuma marca Feed foi recomposta como texto.

Kit atualizado em vetor, CSS e fotografias; fonte leve e licença incluídas. Fachada fotográfica permanece idêntica porque contém apenas o logo preservado. LEIA-ME explica a diferença entre o subconjunto completo e o reduzido.

Scripts reaproveitados em sistema/revisao/, com preparação e aplicação em sistema/. Conferência headless com o Chromium indicado no medidor original, que não foi alterado. TOTAL 0 achados; check adicional em 390, 768, 1024 e 1440. Capturas revisao-* inspecionadas, incluindo todos os mockups, zoom do caderno, posts, stories, topo, fechamento e tipografia.

Somente conceitos/marca-lume/ alterado. Sem commit, push, deploy ou integração no site em produção.

Pontos fracos: a estampa da seda ainda acompanha as dobras de modo aproximado. Na grade de três colunas do celular, os textos de apoio dos posts ficam pequenos, embora legíveis na peça aberta.

## Revisão do avatar

Decisão: chama original em Papel #F4EFE4 sobre Mata #1F4D45. O desenho tem vínculo direto com a assinatura principal e dispensa um novo monograma. A paleta e a EB Garamond permanecem. A chama ocupa 196,2 das 320 unidades de altura; o topo fica em 54,6 e a base em 250,8. O deslocamento para cima compensa o peso visual da base, com folga para o recorte circular.

Arquivo canônico: logo/avatar.svg. O antigo logo/avatar-ld.svg passa a entregar o mesmo avatar para compatibilidade. Os três nomes monograma-* passam a entregar a chama em uma tinta, sem letras. Atualizadas as aplicações originais google-negocio, instagram-grade, instagram-post-09 e whatsapp-agente e seus quatro PNGs. Atualizadas também as pranchas sistema/assinaturas.svg e sistema/protecao-minimos.svg. Nenhum SVG distribuído conserva LD.

Brandbook: retirada a célula isolada de LD. Nova seção #avatar com perfil do Instagram, cabeçalho e mensagem do WhatsApp, resultado patrocinado do Google, aba de navegador e régua de 32, 40, 110 e 320 px reais. O favicon usa o avatar quadrado. A linha sobre o Hub explica que LD aparece até a foto da marca ser enviada. As interfaces são estudos conceituais, sem publicação ou operação comercial.

Celular: artes/perfil-instagram.html e artes/tela-instagram.png atualizados. fotos/celular.webp e fotos/alta/celular.png recompostos sobre o PNG limpo original, com o mesmo quadrilátero e mistura da rodada anterior. O script mantém a base WebP local como alternativa. Nenhuma foto nova gerada. Posts fotográficos e stories atuais não contêm LD e foram preservados.

Kit: novos avatar.svg, avatar-80.webp e avatar-160.webp, com WebP sem perdas. LEIA-ME.md atualizado com os usos no anúncio do Instagram, resultado do Google e conversa. Integração no site em produção não realizada. Logo principal, fotos e tipografia existentes do kit preservados.

Conferência: TOTAL 0 achados no medidor solicitado, inalterado. ASTRA 0 achados nas larguras 390, 768, 1024 e 1440. AVATAR 0 achados: 24 arquivos originais conferidos por SHA-256, sendo 12 bases e 12 assinaturas/símbolos. O teste histórico de preservação de 16 logos corresponde à rodada tipográfica; o teste atual distingue explicitamente os quatro arquivos substituídos nesta revisão.

Inspeção visual realizada na ferramenta de imagem: capturas/avatar-tamanhos.png, capturas/avatar-secao-390.png, capturas/avatar-secao-1440.png e fotos/celular.webp. Capturas de seção têm largura de arquivo de 390 e 1440 px, incluindo margens do caderno. Fontes e CSS presentes.

Reprodução: python sistema/avatar/revisar.py prepara os vetores e HTML; node sistema/avatar/exportar.mjs exporta e recompõe; python sistema/avatar/verificar.py confere os ativos. Executar esses caminhos a partir de conceitos/marca-lume/, ou prefixá-los a partir do worktree. Scripts locais, sem instalação de dependências. Manifesto atualizado em PUBLICAR.md e sistema/publicacao-astra.json: 45 arquivos, 4.303.872 bytes.

Limites: a abertura interna da chama perde detalhe no favicon de 16 px, embora a silhueta permaneça reconhecível. Os textos de apoio dos posts continuam pequenos na miniatura da grade do celular; a peça aberta preserva a leitura.

Trabalho individual, apenas em conceitos/marca-lume/. Sem commit, push ou deploy.
