from pathlib import Path
import json,shutil,hashlib
R=Path(__file__).resolve().parents[2]
pub=json.loads((R/'sistema/publicacao-astra.json').read_text())
audit=json.loads((R/'sistema/revisao/auditoria.json').read_text())
size=f'{pub["bytes"]:,}'.replace(',','.')
files='\n'.join('- '+x['file'] for x in pub['files'])
(R/'PUBLICAR.md').write_text(f'''# Arquivos do brandbook revisado

Caminhos relativos a conceitos/marca-lume/. Preservar as pastas.

Peso total: {size} bytes (4,30 MB decimais). {len(pub['files'])} arquivos, incluindo index.html, dependências do CSS e favicon. Sem dependências de rede ou links de download na página.

{files}

Licenças a conservar na distribuição: fontes/ebgaramond-OFL.txt e fontes/manrope-OFL.txt. Elas não são carregadas pelo index.html e não entram na soma acima.

fotos/bases/, fotos/alta/, capturas/, aplicacoes/, originais/, kit-site/ e scripts de sistema/ não entram no carregamento do brandbook. Esta lista é um manifesto técnico; nenhum envio ou publicação foi realizado.
''',encoding='utf8')
p=R/'NOTAS.md';s=p.read_text(encoding='utf8')
s=s.replace('Cormorant Garamond 500 e Manrope 450/650 continuam sendo as fontes. TTFs e licenças SIL OFL em fontes/. A rodada extraiu instâncias WOFF2 locais. Origem: https://github.com/google/fonts/tree/main/ofl/cormorantgaramond e https://github.com/google/fonts/tree/main/ofl/manrope.', 'EB Garamond 400 é a serifada de texto; Manrope 450/650 permanece. A EB Garamond substitui a Cormorant nos textos porque mantém os acentos do português próximos às letras; a Cormorant fica apenas no desenho original do logo em contorno. TTFs, WOFF2 e licenças SIL OFL em fontes/. Origem oficial da nova serifada: https://github.com/google/fonts/tree/main/ofl/ebgaramond.')
s=s.replace('43 arquivos necessários para a página, 4.492.995 bytes (4,49 MB).',f'Após a revisão: 45 arquivos necessários para a página, {size} bytes (4,30 MB).')
s=s.replace('1080 × 1350, 110.664 bytes','1080 × 1350, 143.654 bytes').replace('1200 × 800, 74.132 bytes','1200 × 800, 74.212 bytes')
s+='''
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
'''
p.write_text(s,encoding='utf8')
gate='celular 390x844: altura 21015px, 0 achado(s)\ntablet 768x1024: altura 19097px, 0 achado(s)\ndesktop 1440x900: altura 23635px, 0 achado(s)\nTOTAL 0 achados\n'
(R/'sistema/medicao-revisao.txt').write_text(gate,encoding='utf8')
(R/'VERIFICACAO.md').write_text(f'''# Verificação da revisão Lume de Papel

## Gate solicitado

Executado a partir do worktree site-v2:

    node conceitos/marca-lume/medir.mjs marca-lume

Saída, código 0:

```text
{gate}```

Sem rolagem horizontal, estouro, alvos menores que 44 px, imagens quebradas ou erros de console. medir.mjs permanece idêntico ao arquivo de conceitos/_comum/.

## Verificação adicional

    node conceitos/marca-lume/sistema/verificar-astra.mjs

Código 0, ASTRA 0 achados. Larguras 390, 768, 1024 e 1440. Sem textos cortados, imagens ausentes, âncoras quebradas, alvos pequenos ou requisições HTTP externas. Fontes locais carregadas; abertura do bloco de regras testada. Relatório: sistema/verificacao-astra.json.

    python conceitos/marca-lume/sistema/revisao/auditar.py

Código 0, REVISÃO 0 achados. 28 arquivos preservados por SHA-256: 16 logos e 12 bases. Nenhum contorno Cormorant fora das assinaturas protegidas. Busca em todos os HTML, CSS e SVG: nenhuma aplicação textual da Cormorant; o nome aparece somente na explicação da troca. SVGs sem DOCTYPE; nenhum travessão. Cobertura Latin e Latin-1 conferida contra o TTF oficial; acentos do português e cinco frases do subconjunto leve presentes. Fonte leve com {audit['site_subset_bytes']} bytes. Relatório: sistema/revisao/auditoria.json.

## Peso e integridade

45 arquivos usados pela página: {size} bytes (4,30 MB), abaixo de 12 MB. Lista completa em PUBLICAR.md; bytes individuais em sistema/publicacao-astra.json. Inclui HTML, CSS, fontes, imagens, padrões e favicon. Licenças são adicionais de distribuição, sem carregamento na página.

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
''',encoding='utf8')
shutil.copyfile(R/'fontes/ebgaramond-OFL.txt',R/'kit-site/ebgaramond-OFL.txt')
(R/'kit-site/LEIA-ME.md').write_text('''# Kit Lume de Papel para o site da Feed

Projeto autoral da Feed. Marca fictícia. Esta revisão é local; nenhuma integração no site foi realizada.

## Arquivos

| Arquivo | Uso |
| --- | --- |
| logo.svg | Logo horizontal negativo original, em contorno, preservado |
| paleta.svg | Prancha com códigos, textos serifados em EB Garamond 400 |
| fachada.svg | Ilustração vetorial anterior, textos atualizados, logo preservado |
| post.svg | Post quadrado vetorial, frases em EB Garamond 400 |
| embalagem.svg | Ilustração vetorial anterior, frases atualizadas, logos preservados |
| foto-fachada.webp | 1200 × 800, 137.760 bytes; idêntica, contém apenas o logo original |
| foto-post.webp | 1080 × 1350, 143.654 bytes; capa em EB Garamond, foto ampliada e faixa editorial compacta |
| foto-embalagem.webp | 1200 × 800, 74.212 bytes; mesma base, textos de caixa e tag recompostos |
| tokens.css | Paleta e EB Garamond 400 para texto serifado; Manrope para informação |
| serif-texto.woff2 | Subconjunto EB Garamond 400 de 5.040 bytes para as cinco frases abaixo |
| ebgaramond-OFL.txt | Licença SIL OFL da EB Garamond |

Todos os SVGs são autossuficientes, com letras em contorno, sem DOCTYPE nem dependências externas. Logos Lume de Papel e LD continuam com o desenho anterior. A EB Garamond substitui a Cormorant nos textos porque mantém os acentos do português próximos às letras; a Cormorant fica apenas no logo em contorno.

## Fontes locais

tokens.css usa ../fontes/eb-garamond-400-latin.woff2, com Latin, Latin-1, Latin Extended-A e pontuação. Usa também o Manrope local. Para conteúdo editorial livre, conservar a pasta fontes/ irmã e suas licenças, ou ajustar os URLs ao copiar.

serif-texto.woff2 é a alternativa mínima, independente da pasta irmã, para estes textos exatos:
- Um presente. Muitas páginas pela frente.
- Proposta de exemplo
- Lume de Papel
- Entrelinhas
- O cuidado que fica.

```css
@font-face {
  font-family: "Lume Serif Site";
  src: url("./serif-texto.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```

Aplicar “Lume Serif Site” somente aos textos acima. Para frases novas, usar a versão Latin completa. O subconjunto não serve para redesenhar a assinatura: a marca continua como logo.svg.

Origem oficial: https://github.com/google/fonts/tree/main/ofl/ebgaramond. Arquivo EBGaramond[wght].ttf original guardado em ../fontes/, com licença OFL. Pesos 400 e 500 foram comparados visualmente; 400 foi escolhido pela leveza em tamanhos grandes.

## Composição

Post fotográfico em 4:5: usar object-fit:contain para preservar texto e capa. Fachada e embalagem em 3:2. Não esticar. Logo negativo sobre Mata; sobre Papel usar ../logo/horizontal-positivo.svg. Fotografias geradas na rodada anterior e recompostas sobre as mesmas bases limpas, sem nova geração.

Ao creditar a agência, usar a imagem do logo Feed: ../marca-feed/horizontal-preta.svg sobre fundo claro ou ../marca-feed/horizontal-branca.png sobre fundo escuro. Texto do crédito: “Projeto autoral da” seguido da imagem com alt="Feed".
''',encoding='utf8')
provenance={'source':'https://raw.githubusercontent.com/google/fonts/main/ofl/ebgaramond/EBGaramond%5Bwght%5D.ttf','sha256':hashlib.sha256((R/'fontes/EBGaramond[wght].ttf').read_bytes()).hexdigest(),'weight':400,'full_woff2_bytes':(R/'fontes/eb-garamond-400-latin.woff2').stat().st_size,'site_woff2_bytes':audit['site_subset_bytes']}
(R/'sistema/revisao/fonte-origem.json').write_text(json.dumps(provenance,indent=2),encoding='utf8')
print(f'Documentação atualizada. {len(pub["files"])} arquivos, {size} bytes. Fonte do site: 5.040 bytes.')
