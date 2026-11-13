# Kit Lume de Papel para o site da Feed

Projeto autoral da Feed. Marca fictícia.

As cinco peças são SVGs autossuficientes com letras em contorno e proporção preservada. Não têm DOCTYPE nem links externos.

| Peça | Arquivo | Uso |
| --- | --- | --- |
| Logo | logo.svg | Horizontal negativo, transparente, para o fundo Mata já usado no site |
| Cores | paleta.svg | Prancha completa com códigos; recortar pela composição somente se os códigos continuarem legíveis |
| Fachada | fachada.svg | Vista com toldo, letreiro e placa |
| Post | post.svg | Quadrado, campanha de presente |
| Embalagem | embalagem.svg | Família de sacola, caixa, fita, cinta e lacre |

Não foi feita integração no site: os outros agentes podem usar estes arquivos no #marca. Em peças pequenas, substituir a prancha de paleta pelas quatro faixas com os tokens do CSS, para não reduzir os códigos até ficarem ilegíveis.

Para cores e tipografia, importar tokens.css. O CSS referencia ../fontes/ e pressupõe a estrutura desta entrega. Ao copiar só kit-site/, copiar também fontes/ para a pasta irmã ou ajustar os URLs de @font-face. Os SVGs independem das fontes.

O logo negativo deve ficar sobre Mata. Para fundo Papel, usar ../logo/horizontal-positivo.svg. Aplicar com object-fit:contain e preservar a proporção. Os demais SVGs podem ser convertidos em PNG para otimização, mantendo o limite de 400 KB por imagem.

As aplicações em PNG estão em ../aplicacoes/. A apresentação completa abre em ../index.html. As restrições e os próximos passos estão em ../NOTAS.md.

## Versões fotográficas da Rodada Astra

Usar as três novas imagens no case, mantendo os SVGs anteriores:
- foto-fachada.webp: 1200 × 800 px, 137.760 bytes.
- foto-post.webp: 1080 × 1350 px, 110.664 bytes.
- foto-embalagem.webp: 1200 × 800 px, 74.132 bytes.

Até 1200 px de largura e menos de 150 KB. Post em 4:5: usar object-fit:contain quando precisar preservar todo o texto. Fachada e embalagem em 3:2.

Cenas geradas por IA, com logo e textos vetoriais aplicados depois. Nenhuma integração no site. Marca fictícia, com crédito Projeto autoral da Feed.
