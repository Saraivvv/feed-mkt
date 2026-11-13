# Verificação da Rodada Astra

## Gate solicitado

Comando no worktree site-v2:

    node conceitos/marca-lume/medir.mjs marca-lume

Código de saída 0:

    celular 390x844: altura 20933px, 0 achado(s)
    tablet 768x1024: altura 19075px, 0 achado(s)
    desktop 1440x900: altura 23613px, 0 achado(s)
    TOTAL 0 achados

Sem página mais larga, estouro, alvos menores que 44 px, imagens quebradas ou erros de console. Medir.mjs não foi modificado e continua idêntico ao original em conceitos/_comum/.

## Check adicional

    node conceitos/marca-lume/sistema/verificar-astra.mjs

Código 0, ASTRA 0 achados. Relatório em sistema/verificacao-astra.json.

Larguras: 390, 768, 1024 e 1440 px. Sem texto cortado, rolagem horizontal, alvo pequeno, imagem ausente, âncora quebrada ou requisição HTTP externa. Um h1, fontes locais carregadas, foco visível. A abertura das regras de logo foi testada em cada largura. Leitura e navegação dispensam JavaScript.

Manifesto em sistema/publicacao-astra.json: 43 arquivos, 4.492.995 bytes (4,49 MB), incluindo HTML, CSS, SVGs, fontes e imagens. Abaixo de 12 MB.

Kit abaixo de 1200 px de largura e 150.000 bytes: fachada 137.760, post 110.664, embalagem 74.132. Arquivos antigos preservados.

## Inspeção visual

12 mockups abertos individualmente:
fachada, sacola, caderno, presente, cartao, seda, ecobag, celular, vitrine, cartaz, embrulho e forro.

Verificadas letras, posição, proporções, perspectiva, textura e mãos visíveis. Corrigida a proporção do símbolo no lacre. Rasterização ajustada para evitar serrilhamento nas letras pequenas dos cadernos da vitrine.

Chromium headless indicado em conceitos/_comum/medir.mjs. Nenhum Chrome pessoal. Capturas completas em capturas/; aberturas e capítulos em capturas/astra-*.png em 390 e 1440. Tablet também capturado. CSS e fontes carregados.

Padrões vistos em repetição e nas aplicações guarda, seda, embrulho e forro. SVGs de logo, padrões e artes sem DOCTYPE e com letras em contorno.

## Procedência e crédito

12 gerações com Codex image_gen.imagegen, sem pedir texto ou logo. Bases em fotos/bases/. Identidade aplicada depois. Registro em sistema/geracao-astra.json. O serviço não forneceu créditos ou preço: custo não informado.

## Escopo e limitações

Somente conceitos/marca-lume/ foi alterado. Sem commit, push, deploy ou alteração do artifact publicado. Acervo anterior preservado. Scripts temporários no scratchpad autorizado.

O gate verifica interface e integridade, não substitui leitor de tela, prova gráfica, protótipo de encadernação ou fotografia real. A simulação nas dobras da seda é o ponto menos convincente; acabamentos físicos precisam de amostra.
