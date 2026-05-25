# Site da Feed - workflow visual

Este site vai seguir um fluxo image-first:

1. Gerar uma imagem horizontal de referencia para cada secao do site.
2. Escolher as melhores imagens e iterar estilo/composicao.
3. Extrair os assets visuais usados nas imagens.
4. Salvar assets finais em `site-assets/extraidos/`.
5. Codar uma secao por vez, copiando composicao, proporcao, movimento e detalhes.
6. Adicionar animacoes de scroll, hover e possiveis cenas 3D depois que a base visual estiver firme.

## Regras que vamos seguir

- Uma imagem separada por secao. Nada de uma imagem longa com o site inteiro.
- Todas as imagens devem ser horizontais.
- Evitar o padrao repetido de texto a esquerda e imagem a direita.
- Usar laranja como cor principal, com preto, branco e azul da identidade da Feed.
- Visual premium, limpo, com menos texto e mais impacto visual.
- Cada secao precisa ter uma funcao clara: atrair, explicar, provar, organizar ou converter.
- O codigo nao deve recriar manualmente assets complexos que vierem das imagens. Ele deve posicionar, animar e compor os assets extraidos.
- Animações entram depois da estrutura: scroll reveal, parallax leve, hover e transicoes suaves.
- 3D deve carregar sob demanda e nunca bloquear a primeira dobra.

## Estrutura sugerida de secoes

1. Hero - Feed como sistema de IA, marca e operacao para empresas.
2. Problema - empresas com processos soltos, venda confusa e IA sem rumo.
3. Solucoes - IA aplicada, posicionamento de marca, posicionamento de empresarios.
4. Processo - diagnostico, estrategia, construcao e ajuste.
5. Casos de uso - assistentes, automacoes, materiais comerciais, conteudo.
6. Metodo - menos material solto, mais capacidade instalada.
7. Para quem - PMEs B2B, operacao enxuta, liderancas praticas.
8. CTA - conversa diagnostica para encontrar o primeiro ponto de aplicacao.

## Prompt base para gerar referencias

```text
Based on the imagegen frontend web skill, generate images for a website for Feed, an AI agency and consultancy focused on practical AI, brand positioning and business solutions for B2B small and medium companies.

Generate 8 distinct horizontal website section images, one separate image per section:

1. Hero
2. Business problem
3. Services
4. Process
5. Use cases
6. Method
7. Best-fit clients
8. Final CTA

The website should feel premium, polished, clean and minimalist, with less information and more striking visual direction. Use orange as the main color, with deep black, warm white and a controlled blue accent. Avoid generic purple/blue AI aesthetics, neon blobs, random 3D icons and template-like layouts.

The brand should feel practical, sharp, human and implementation-focused. It is not a hype AI startup. It is an agency/consultancy that turns operational gaps, unclear positioning and messy communication into usable business systems.

Use varied compositions across sections. Do not default to left-text/right-image. Include image-as-canvas sections, editorial offsets, bold typography, full-bleed or near full-bleed visual areas, precise grid systems, layered UI/product-like fragments, and motion-implied compositions.

All images must be horizontal. Each generated image should represent exactly one website section and be implementation-friendly for a frontend developer.
```

## Onde colocar arquivos

- `site-assets/referencias/` - imagens de referencia por secao.
- `site-assets/extraidos/` - assets recortados e prontos para usar no site.
- `site-assets/rascunhos/` - tentativas, variacoes e imagens que ainda nao entraram no site.

