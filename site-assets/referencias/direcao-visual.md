# Direcao visual do site da Feed

Referencias recebidas:

- https://www.learn2vibecode.dev/
- Prints com estetica escura, 3D plastico/experimental e tipografia grande.
- Prints do estilo Atelier Zero: colagem editorial, textura mineral, formas arquitetonicas, grid fino, tipografia grande e composicao horizontal.

## O que aproveitar

### Learn2Vibecode

- Hero memoravel com frase curta e visual dominante.
- Conteudo longo dividido em blocos bem distintos.
- Sensacao de produto/curso moderno, com secoes que mudam de ritmo.
- Uso de imagens e elementos grandes como parte da narrativa, nao como decoracao.
- Estrutura boa para site que precisa carregar bastante conteudo sem parecer institucional parado.

### Estetica escura / Reverse Chaos

- Fundo preto forte.
- Grande objeto 3D central como assinatura visual.
- Tipografia grande, limpa, com poucas palavras.
- Sensacao de movimento e profundidade.
- Botoes grandes e simples.

Como adaptar para Feed:

- Manter o preto da marca e a forca grafica.
- Trocar cores muito aleatorias por laranja Feed, branco, cinza e azul pontual.
- Usar 3D como sistema/operacao em movimento, nao como enfeite abstrato sem funcao.

### Atelier Zero

- Composicoes horizontais muito fortes.
- Mistura de escultura, arquitetura, colagem, formas geometricas e textura.
- Tipografia enorme com espaco respirando.
- Visual premium, editorial e inteligente.
- Pequenos elementos tecnicos: grids, linhas, numeracao, pontos, microcopy.
- Secoes variam bastante sem perder identidade.

Como adaptar para Feed:

- Substituir a estetica classica/artistica por uma estetica de empresa, operacao e inteligencia aplicada.
- Usar colagens com elementos como mapas de processo, interfaces, documentos, automacoes, setas, blocos 3D e fragmentos de dashboard.
- Preservar o ar sofisticado, mas deixar mais direto e comercial.

## O que evitar

- Copiar exatamente o visual de Atelier Zero, principalmente cabecas/esculturas e paleta clara bege.
- Virar site de portfolio artistico distante demais da venda.
- Usar cores neon aleatorias ou roxo/azul generico de IA.
- Layout sempre texto de um lado e imagem do outro.
- Imagens bonitas que nao ajudam a entender a Feed.
- 3D pesado no primeiro carregamento sem fallback.

## Direcao recomendada para a Feed

Site com duas camadas:

1. **Base escura Feed**
   - Preto dominante.
   - Laranja como cor de decisao/acao.
   - Branco quente para texto.
   - Azul apenas como detalhe tecnico.

2. **Colagem operacional premium**
   - Interfaces, fluxos, documentos, cards, diagramas e formas 3D.
   - Elementos em camadas, com sensacao de sistema sendo montado.
   - Texturas discretas, linhas finas, numeracao e marcadores.

O site deve parecer uma agencia/consultoria que cria sistemas aplicaveis, nao uma startup generica de IA.

## Estrutura visual sugerida

1. **Hero**
   - Fundo preto.
   - Tipografia enorme: "Feed".
   - Frase curta sobre IA, marca e operacao.
   - Objeto 3D/colagem central representando sistemas em movimento.
   - Animação: entrada suave de camadas, leve movimento/parallax.

2. **Problema**
   - Composicao editorial com janelas, cards e fragmentos de operacao quebrada.
   - Texto curto: processos soltos, venda sem clareza, IA sem rumo.
   - Animação: elementos desalinhados entrando e se encaixando.

3. **Servicos**
   - Cards premium, mas integrados ao fundo.
   - 3 frentes: IA aplicada, marca, empresários.
   - Visual com cards sobrepostos, linhas e pequenos diagramas.

4. **Processo**
   - Linha horizontal 01-04, inspirada no print "From signals to systems".
   - Diagnostico, estrategia, construcao, ajuste.
   - Animação: progress line acompanhando o scroll.

5. **Casos de uso**
   - Galeria/carrossel horizontal estilo arquivo vivo.
   - Assistentes, automacoes, propostas, conteudo, analise de dados.
   - Animação: hover com deslocamento, scroll horizontal opcional.

6. **Metodo**
   - Frase forte: "Menos material solto. Mais capacidade instalada."
   - Colagem de componentes virando sistema.
   - Animação: camadas se agrupando.

7. **Para quem**
   - Blocos de perfil do cliente.
   - Visual mais direto, com sinais de B2B e operacao enxuta.
   - Animação: cards revelados em sequencia.

8. **CTA**
   - Impacto visual alto, quase poster.
   - Chamada para diagnostico.
   - Fundo preto ou laranja cheio.
   - Animação simples, sem distrair da conversao.

## Regras de animacao

- Scroll animations suaves, sem excesso.
- Cada secao pode ter uma animacao propria, mas a navegacao precisa continuar clara.
- Usar `prefers-reduced-motion`.
- 3D entra com lazy load e fallback visual.
- Priorizar transform/opacity para performance.
- Evitar animar layout, largura, altura ou propriedades pesadas.

## Proxima decisao

Gerar as imagens de referencia das 8 secoes com esta direcao e escolher uma linguagem final antes de refatorar o HTML atual.

