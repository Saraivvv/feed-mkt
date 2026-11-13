# Verificação atual: avatar Lume de Papel

Comando executado a partir do worktree site-v2, com Playwright e Chromium headless:

    node conceitos/marca-lume/medir.mjs marca-lume

Saída, código 0:

```text
celular 390x844: altura 23229px, 0 achado(s)
tablet 768x1024: altura 20582px, 0 achado(s)
desktop 1440x900: altura 25101px, 0 achado(s)
TOTAL 0 achados
```

O medidor permanece idêntico ao original em conceitos/_comum/. Nenhuma alteração para silenciar achados. Sem estouro horizontal, alvos pequenos, imagens quebradas ou erros de console.

    node conceitos/marca-lume/sistema/verificar-astra.mjs

Código 0, ASTRA 0 achados. Larguras 390, 768, 1024 e 1440, sem texto cortado ou requisições externas. CSS e fontes locais carregados. Relatório atualizado: sistema/verificacao-astra.json.

    python conceitos/marca-lume/sistema/avatar/verificar.py

Código 0, AVATAR 0 achados. As 12 bases fotográficas e os 12 SVGs da assinatura e do símbolo conferidos por SHA-256. Chama com exatamente o mesmo path do símbolo original. Avatar quadrado 320 × 320, sem texto, DOCTYPE ou dependência de fonte; cópia do kit idêntica. WebPs conferidos em 80 × 80 e 160 × 160. Nenhum SVG conserva o desenho LD. Relatório: sistema/avatar/verificacao.json.

Inspeção visual realizada com ferramenta de imagem:

- capturas/avatar-tamanhos.png: 32, 40, 110 e 320 px em escala real.
- capturas/avatar-secao-390.png: seção completa com margem, CSS e fontes, largura 390 px.
- capturas/avatar-secao-1440.png: seção completa com margem, CSS e fontes, largura 1440 px.
- fotos/celular.webp: perfil recomposto sobre a base limpa, com a chama no avatar.

Página: 45 arquivos, 4.303.872 bytes. Lista atual em PUBLICAR.md e sistema/publicacao-astra.json. Kit: adicionados avatar.svg, avatar-80.webp e avatar-160.webp; alterado LEIA-ME.md. Restante do kit preservado. Escrita somente em conceitos/marca-lume/, sem nova geração de foto, commit, push ou deploy.

Pontos fracos: o favicon de 16 px perde parte da abertura interna da chama. As legendas dos posts continuam pequenas na miniatura da grade do celular.

## Histórico: revisão tipográfica anterior

Os resultados abaixo registram a rodada anterior. A preservação de 16 logos valia antes da substituição autorizada do avatar e dos três arquivos monograma-*; o teste atual de ativos é sistema/avatar/verificar.py.

## Gate solicitado

Executado a partir do worktree site-v2:

    node conceitos/marca-lume/medir.mjs marca-lume

Saída, código 0:

```text
celular 390x844: altura 21015px, 0 achado(s)
tablet 768x1024: altura 19097px, 0 achado(s)
desktop 1440x900: altura 23635px, 0 achado(s)
TOTAL 0 achados
```

Sem rolagem horizontal, estouro, alvos menores que 44 px, imagens quebradas ou erros de console. medir.mjs permanece idêntico ao arquivo de conceitos/_comum/.

## Verificação adicional

    node conceitos/marca-lume/sistema/verificar-astra.mjs

Código 0, ASTRA 0 achados. Larguras 390, 768, 1024 e 1440. Sem textos cortados, imagens ausentes, âncoras quebradas, alvos pequenos ou requisições HTTP externas. Fontes locais carregadas; abertura do bloco de regras testada. Relatório: sistema/verificacao-astra.json.

    python conceitos/marca-lume/sistema/revisao/auditar.py

Código 0, REVISÃO 0 achados. 28 arquivos preservados por SHA-256: 16 logos e 12 bases. Nenhum contorno Cormorant fora das assinaturas protegidas. Busca em todos os HTML, CSS e SVG: nenhuma aplicação textual da Cormorant; o nome aparece somente na explicação da troca. SVGs sem DOCTYPE; nenhum travessão. Cobertura Latin e Latin-1 conferida contra o TTF oficial; acentos do português e cinco frases do subconjunto leve presentes. Fonte leve com 5040 bytes. Relatório: sistema/revisao/auditoria.json.

## Peso e integridade

45 arquivos usados pela página: 4.300.217 bytes (4,30 MB), abaixo de 12 MB. Lista completa em PUBLICAR.md; bytes individuais em sistema/publicacao-astra.json. Inclui HTML, CSS, fontes, imagens, padrões e favicon. Licenças são adicionais de distribuição, sem carregamento na página.

Kit: fachada 137.760 bytes, post 143.654 bytes, embalagem 74.212 bytes. Todos abaixo de 150 KB. A fachada é idêntica, pois o logo não mudou.

## Inspeção visual realizada

Teste EB Garamond 400/500 visto antes da aplicação. Escolhido 400, que mantém a leveza e corrige a distância aparente dos acentos.

Doze fotos abertas na ferramenta de imagem: caderno, cartão, vitrine, sacola, presente, ecobag, cartaz, embrulho, seda, fachada, forro e celular. Capa examinada também em zoom. Reenquadrados os posts do caderno, caixa, vitrine e embrulho para preservar texto e produto.

Nove posts inspecionados em capturas/revisao-posts-1.png, revisao-posts-2.png e revisao-posts-3.png; três stories em revisao-stories.png. Medidas dos nove posts: 1080 × 1350, sem texto transbordando, faixa creme de aproximadamente 238 px. Relatório: sistema/revisao/posts-medidas.json.

Topo e fechamento vistos em 390 e 1440. Tipografia vista nas duas larguras. CSS e fontes presentes. Chromium headless, nunca Chrome pessoal.

Evidências principais:
- capturas/revisao-caderno-zoom.png
- capturas/revisao-390-topo.png
- capturas/revisao-390-fechamento.png
- capturas/revisao-1440-topo.png
- capturas/revisao-1440-fechamento.png
- capturas/revisao-1440-tipografia.png
- capturas/revisao-1440-tipografia-detalhe.png
- capturas/revisao-teste-acentos.png

## Escopo e limites

Bases fotográficas aprovadas reutilizadas. Nenhuma chamada a image_gen, nenhuma dependência instalada, nenhum commit, push ou deploy. Escrita restrita a conceitos/marca-lume/.

A estampa da seda ainda aproxima as dobras por deslocamento simples. Os textos de apoio dos posts ficam pequenos na miniatura de três colunas do celular. A conferência digital não substitui prova física de papel, tinta e tecido.
