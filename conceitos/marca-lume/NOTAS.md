# Lume de Papel

Projeto autoral da Feed, para uma marca fictícia. Não é cliente real. Não houve publicação, commit, push ou deploy.

## Ponto de partida

Foram lidos o bloco #marca de conceitos/d-site-feed/index.html e suas capturas, além de telas reais de atendimento do Hub em conceitos/_comum/hub/. Esses materiais foram apenas consultados. Nenhum arquivo dessas pastas foi editado.

A empresa de demonstração vende cadernos para presente, com capa azul ou verde e embrulho. Lia Ventora e Agente Lume continuam na situação de atendimento. O avatar continua sendo LD em verde.

## Decisões

- Conceito: O cuidado que fica. A marca se organiza pelo gesto de presentear, com produto, matéria e informação concreta.
- A paleta original foi preservada integralmente: Verde Lume #3F998B, Mata #1F4D45, Âmbar #C8923C e Papel #F4EFE4. Azul caderno #395C72 é cor de produto, sem percentual na composição da marca.
- A chama foi refinada em duas folhas abertas, com recorte que sugere a dobra do papel. Não houve abandono do conceito original. O símbolo não é usado como estampa repetida.
- Assinatura principal com Lume e descritor DE PAPEL. Horizontal para cabeçalho e fachada; vertical para formatos altos. LD é a assinatura de identificação em espaços pequenos e no atendimento.
- Google Fonts: Cormorant Garamond 500 e Manrope 450/650, hospedadas localmente. As duas licenças OFL estão em fontes/.
- Todos os textos dos SVGs estão em contorno. Sem DOCTYPE, referência de fonte externa, imagem embutida ou dependência de rede.
- Paleta com contraste WCAG calculado em sRGB. Usar Papel sobre Mata nos botões. Não usar Papel sobre Verde Lume ou Mata sobre Âmbar em texto normal. A tabela do manual explicita as reprovações.
- CMYK é aproximação matemática, sem perfil ICC. Necessário fazer prova com a gráfica antes de produzir.
- A área de proteção é de 1x. No módulo de 125 unidades do símbolo, x é fixado em 10 unidades, tomando como referência o recorte interno. Proteção se mede a partir do limite visual do conjunto, não de uma caixa arbitrária da página.
- A assinatura principal exige 160 px / 32 mm; horizontal 220 px / 45 mm; vertical 144 px / 30 mm. Símbolo e monograma: 24 px / 6 mm. Mínimos de bordado e hot stamping dependem de amostra, não só dessas medidas.
- Os acabamentos e dimensões são especificações de intenção. Os mockups não são facas ou arquivos fechados de gráfica.
- A tela WhatsApp é uma recriação ilustrada da visão da cliente, coerente com a situação do Hub. O Agente se identifica como assistente virtual, não garante estoque e confirma o prazo com pessoas.
- Domínio lumedepapel.example é reservado para exemplo. Não há número de telefone, endereço, avaliação ou resultado comercial inventado.

## O que foi gerado por IA

Conceito, textos, desenho vetorial, composição, código e documentação foram desenvolvidos com assistência de IA neste trabalho. Não foi usado modelo de geração de imagens. Não há fotografia, imagem baixada da internet ou banco de imagens. Todas as cenas foram construídas por código em SVG com texturas procedurais e renderizadas por Playwright Chromium headless.

As únicas fontes externas baixadas são os arquivos tipográficos oficiais do repositório Google Fonts e suas licenças SIL OFL. Arquivos de fontes: CormorantGaramond[wght].ttf e Manrope[wght].ttf. Fontes de origem: https://github.com/google/fonts/tree/main/ofl/cormorantgaramond e https://github.com/google/fonts/tree/main/ofl/manrope.

## Entregas

- index.html e brandbook.css: apresentação responsiva, local e sem servidor.
- logo/: variantes principal, horizontal, vertical, símbolo, monograma e avatar. Positivo, negativo e monocromático.
- sistema/: moodboard, regras de logo, paleta, contrastes, ícones e padrões.
- originais/: fontes vetoriais editáveis das aplicações.
- aplicacoes/: PNGs comprimidos das aplicações, incluindo nove posts, três stories e quatro destaques individuais.
- kit-site/: cinco peças vetoriais, tokens e instruções de uso. Fontes do CSS resolvidas pela pasta fontes/ da entrega.
- capturas/: evidências do brandbook em celular, tablet e desktop. As visões de página inteira podem ter sido reduzidas para respeitar o teto de 400 KB; as capturas por quadro mantêm o detalhe para revisão.
- medir.mjs: cópia literal de conceitos/_comum/medir.mjs, sem alteração do original. Executar a partir do worktree: node conceitos/marca-lume/medir.mjs marca-lume.
- VERIFICACAO.md: evidências objetivas da rodada final.

## Rodada 2

1. Fotografar protótipos reais com mãos, costura e fibras de papel. As cenas atuais são ilustradas e não pretendem parecer fotografias.
2. Prototipar capa, sacola e caixa com encadernador e gráfica. Fechar facas, sangria, perfil de impressão, tolerâncias e provas de bordado.
3. Validar nome e distintividade em pesquisa de marca e com pessoas do público, se a empresa vier a existir. Refinar pequenos detalhes ópticos do lettering após prova impressa.
4. Transformar a página inicial ilustrada em loja funcional, com estoque, frete, dados reais e atendimento conectado, somente se o escopo for autorizado.

## Limitações assumidas

Nenhuma pesquisa de mercado real foi realizada. O briefing, o público e o posicionamento são construções de projeto fictício. Os anúncios e o Google Meu Negócio são estudos de linguagem visual, sem campanha ou perfil ativo. Não existem resultados comerciais a atribuir.
