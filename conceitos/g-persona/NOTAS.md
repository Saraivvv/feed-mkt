# Quadro de personas da Feed
13/11/2026

## Comparação do Tuiê / 14/11/2026
- O original fica identificado como ave inventada. A aba #tuie compara original, sabiá-laranjeira e joão-de-barro, com 110 e 32 px lado a lado e a mesma abertura de diagnóstico nas três versões. #fevi, #tuie e #tadeu continuam funcionando.
- O sabiá liga canto e conversa ao peito laranja. O joão-de-barro liga a construção da casa à operação que a Feed monta. Prefiro o sabiá para receber o cliente: a voz é uma ligação mais direta com o chat, e a cabeça preta com anel laranja tem contraste forte em 32 px.
- Oito novos WebP em assets/tuie-sabia-{320,110,40,32}.webp e assets/tuie-joao-{320,110,40,32}.webp. Arquivos em 2x, seguindo o quadro existente. Busto em 320/110; cabeça simplificada própria em 40/32. Exportação lossless com somente #FFA300, #151513 e #ece9e2, conferida por leitura dos pixels.
- As decisões abaixo registram a primeira rodada. A recomendação atual no quadro é Tuiê como sabiá; a perda de textura em 32 px continua sendo um limite do original, não das novas cabeças.
- Gate comum intacto: TOTAL 0 achados em celular, tablet e desktop. Executado da raiz site-v2 com argumento absoluto para g-persona, pois o medidor já acrescenta conceitos/ ao argumento relativo. Passar conceitos/g-persona duplicaria esse trecho e escreveria fora da pasta autorizada.
- verificar.cjs: 12 combinações de persona e largura (390, 768, 1024 e 1440), zero erros; comparação, hashes, favorita, dimensões, paleta, imagens, toque e texto conferidos. Regex Node /[\u2014\u2013]/ sem ocorrências nos textos e arquivos da página.
- Capturas Playwright headless em capturas/. Folha de contato PNG em escala real: capturas/tuie-folha-contato.png. Conferência visual dos bustos, cabeças e comparação em celular e desktop. Nenhum commit ou publicação.

## Decisões
- Quadro de escolha, sem integração real. Três propostas alternáveis por hash: #fevi, #tuie e #tadeu. Favorita salva localmente; não há envio.
- Fevi: Feed + vínculo, símbolo oficial em selo. Tuiê: ave fictícia em gravura. Tadeu: retrato humano assumidamente gráfico e fictício.
- Base papel #ece9e2, laranja #FFA300, preto #151513 e Barlow local. A identidade verbal segue a memória e a conversa de f-diagnostico-chat.
- Todas as aberturas e assinaturas identificam a IA. Sem número, cliente, caso ou resultado novo. Site ilustrado com capturas reais de d-site-feed; sua demonstração preexistente não é uma nova persona.
- Recomendo Fevi: conserva a marca em escala pequena e evita sugerir uma pessoa real. Tuiê é a alternativa com mais personalidade.
- Um único desenho por personagem, reaproveitado nas escalas e no estado pensando. Os movimentos são CSS, com pausa e respeito a movimento reduzido.

## Produção por IA
- Tuiê e Tadeu: imagens geradas pela ferramenta integrada image_gen.imagegen. Prompts completos em PROMPTS.md. Não representam pessoas reais.
- Fevi: composição vetorial por código a partir do path de conceitos/_comum/feed-symbol.svg, sem redesenhar o símbolo. Matriz em assets/fevi-matriz.svg.
- Conversão e compressão por Sharp já instalado. Avatares WebP em 2x para exibição a 32, 40, 110 e 320 px. Capturas do site via Playwright headless.
- Texto, HTML, CSS e JavaScript criados neste trabalho com assistência de IA.

## Pesquisa dos nomes
Triagem web em 13/11/2026, com grafia exata, acentos e variantes sem acento, combinadas com assistente, IA, AI assistant e marketing. Não é consulta de registro de marca.
- Fevi: não apareceu um assistente conhecido de IA/marketing com o nome. Há homônimos em [equipamentos industriais](https://fevi.it/) e [recrutamento/RH](https://fevi.dk/rekruttering). Usar sempre junto de Feed; não alegar exclusividade.
- Tuiê/Tuie: as buscas não apontaram um assistente ou marca conhecida do recorte nos resultados consultados. Pronúncia proposta: tui-Ê. Nome criado pela sonoridade, sem etimologia atribuída.
- Tadeu: não apareceu um assistente conhecido com esse nome. Há associação publicitária recente entre Tadeu Schmidt e Inner AI; o assistente da campanha é [Mago](https://www.abcdacomunicacao.com.br/inner-ai-lanca-inner-4-0-e-anuncia-tadeu-schmidt-como-garoto-propaganda-de-novo-assistente-de-inteligencia-artificial-no-whatsapp/). A personagem não representa o apresentador.
- Descartes diretos: [Friso](https://friso.id/legal), [Elói](https://marketing.grupooc.com.br/produtos/eloi/), [Grifo](https://grifoai.com.br/), [Fêni](https://www.feni.work/), [Fê](https://exame.com/inteligencia-artificial/a-revolucao-da-ia-no-atendimento-ao-cliente/), [Feli](https://fellakte.de/funktionen/ki-assistent), [Japi](https://www.japi.one/), [Fedi](https://fedibtc.github.io/fedi-docs/) e [Tuca](https://tucano.sh/alternativa-openclaw/), por usos em IA. Também descartados Pisco, Fepo, FEPI, Célio e Alceu pelos usos encontrados em tecnologia, comunicação ou assistentes.

## Conferência
- `node conceitos/_comum/medir.mjs g-persona`: TOTAL 0 achados, depois do ajuste da grade de tablet.
- `node conceitos/g-persona/verificar.cjs`: 3 personas em 390, 768, 1024 e 1440; seleção, hash, dimensões exatas, persistência da favorita, movimento reduzido, texto, imagens e overflow.
- Arquivos da página com assets: cerca de 432 KB, abaixo de 10 MB. As capturas de QA não são carregadas pelo index.
- Inspeção por ferramenta de leitura de imagem: cada avatar nos quatro tamanhos, cada maquete e página em 390 e 1440. Evidências em capturas/.
- O medidor comum ficou intacto. O teste adicional detectou largura mínima de conteúdo na grade de tablet; corrigido em .lower-apps > div, sem mascarar overflow.

## Limites
Fevi é menos expressivo; Tuiê perde a textura fina em 32 px.
Tadeu pode sugerir atendimento humano e tem uma associação de nome com publicidade recente de IA. A assinatura é maquete visual, ainda sem validação em clientes de e-mail.

