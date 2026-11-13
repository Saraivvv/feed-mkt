# Kit Lume de Papel para o site da Feed

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
