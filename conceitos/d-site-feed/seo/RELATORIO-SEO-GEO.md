# Relatório de SEO e GEO da home nova da Feed

Data: 12/11/2026. Base: commit `bc66887`, página `conceitos/d-site-feed/index.html`. Entrega de conceito em worktree, sem commit, push ou deploy. `public/` não foi editado. Implementação direta, sem subagentes.

## Resultado e limites

A home fica responsável pela busca de fornecedor geral e pela marca Feed. As páginas já existentes continuam responsáveis pelas buscas locais e pelas soluções específicas. O trabalho preserva o layout, as animações, o CSS, os scripts do corpo e o conteúdo de `.fone`, `.hf` e `.lq`.

Foram lidos os dez documentos de `marketing/seo/`, o head e os schemas da raiz, `public/llms.txt`, `public/sitemap.xml`, `public/robots.txt`, todas as landing pages em `public/*/index.html`, os frontmatters dos artigos, a parte 3 das duas revisões, o plano V2, as notas e os dois briefings comuns.

Os documentos antigos trazem achados anteriores à V2. No commit de partida, title, H1, H2 dos serviços, FAQPage, boa parte de `data-nosnippet` e links internos já estavam corretos. Este relatório distingue o que foi alterado do que foi apenas conferido e preservado.

## Mapa de palavras-chave e prevenção de canibalização

| Papel | Termo ou grupo | Seção da home | Página responsável pela busca específica |
|---|---|---|---|
| Principal | agência de IA para empresas | Title, abertura, `#perguntas` e Sobre a Feed | `/` |
| Marca e posicionamento | Feed, Agência Feed, agência de IA aplicada e marketing | Abertura, Sobre a Feed, rodapé e Organization | `/` |
| Secundária | inteligência artificial aplicada, automação de processos | `#sob-medida` e FAQ, sem virar um guia longo | `/agentes-de-ia/` e artigo publicado de automação interna |
| Secundária | automação de WhatsApp com IA, automação de atendimento no WhatsApp | H2 e link em `#agente` | `/automacao-whatsapp/` |
| Secundária | Agente de IA para empresa, Agentes de IA | `#agente`, `#sob-medida`, link contextual | `/agentes-de-ia/` |
| Secundária | IA para pequenas empresas | Público da abertura, FAQ e link | `/ia-para-pequenas-empresas/` |
| Secundária | diagnóstico de IA para empresa | `#passos` e FAQ | `/diagnostico-ia-empresa/`; `/diagnostico` recebe a conversão |
| Secundária | tráfego pago, Meta Ads, Google Ads | H2 e texto de `#trafego` | Futura `/trafego-pago/` |
| Secundária | gestão de redes sociais, Instagram e Facebook | H2 e texto de `#redes` | Futura `/gestao-de-redes-sociais/` |
| Secundária | Google Meu Negócio, presença no Google | H2 e texto de `#redes` | Futura página de redes; decidir página própria só com demanda e conteúdo |
| Secundária | branding, identidade visual, posicionamento de marca | H2 e texto de `#marca` | Futura `/branding-identidade-visual/` |
| Secundária | funil de vendas, CRM, proposta em PDF | H2 e texto do capítulo `#funil` | Home por enquanto; não criada outra página sem briefing |
| Marca de produto | Feed Hub, aplicativo Feed Hub Android | H2 e texto de `#hub`, FAQ | Futura `/feed-hub/`; instalação no Google Play |
| Local | agência de IA Ribeirão Preto | Abertura, `#prova`, Sobre a Feed e links | `/agencia-de-ia-ribeirao-preto/` |
| Local | agência de marketing Bebedouro | Abertura, `#redes`, Sobre a Feed e links | `/agencia-de-marketing-bebedouro/` |
| Local de apoio | tráfego pago Ribeirão Preto | Contexto regional da agência e serviço de tráfego | Futura `/trafego-pago/`, sem duplicar a landing de agência |
| Local de apoio | Barretos, Jaboticabal, Sertãozinho, interior de SP | Sobre a Feed e `areaServed` já existente | Sem novas páginas municipais sem caso real |

Os termos locais não foram empilhados no title da home nem repetidos em todos os H2. A home apresenta o conjunto e aponta para a página especialista. Não foram criados links para as quatro URLs futuras nem links para artigos agendados, mesmo com data de calendário já vencida. A pesquisa de julho é qualitativa, sem volumes exatos; não foi apresentada como medição atual de ranking.

## Antes e depois

| Item | Antes em `bc66887` | Depois |
|---|---|---|
| Title | `Agência de IA para empresas e PMEs \| Feed`, 41 caracteres | Preservado, conforme o mapa do 04 e o plano V2. Não há motivo para perder o foco geral da home. |
| Description | 143 caracteres, dizia “interior de SP” e listava serviços | 144 caracteres: `IA aplicada e marketing para PMEs em Ribeirão Preto e Bebedouro: WhatsApp, tráfego pago, redes sociais e marca. Brasil todo. Diagnóstico grátis.` |
| Open Graph | Completo, descrição anterior e sem alt da imagem | Mesma descrição da home, `og:image:alt`, imagem 1200 × 630 e URL canônica preservadas. |
| Twitter | Texto diferente da description e sem alt | Description alinhada à home e `twitter:image:alt`; `summary_large_image` preservado. |
| Canonical | `https://agenciafeed.com/` | Preservado. Representa a home final, não o caminho do conceito. |
| Robots | Sem meta específica e sem `noindex` | `index, follow, max-image-preview:large`. O `public/robots.txt` existente permite o rastreamento e aponta para o sitemap; foi apenas lido. |
| Verificação Google | Tag válida do Search Console | Preservada byte a byte, inclusive o valor `yLpuIhLKUGZIh3HddIlaSDimf88-cgaiAzShLs2Rq0I`. |
| Primeiras 150 palavras | Já diziam empresa, cidades e público, mas “cuida da operação” era genérico | O primeiro parágrafo agora explica que automatiza atendimento e vendas e cuida da marca de PMEs. Mantém Ribeirão Preto, Bebedouro e Brasil. |
| H1 | Um único H1 com agência, IA, marketing e interior de SP | Preservado. A localização por cidade fica no parágrafo e nos links locais. |
| H2 dos serviços | Nomes dos serviços já dentro dos H2 | Preservados, todos conferidos. Sem mexer no desenho ou no tamanho dos títulos. |
| Texto do tráfego | “cria e acompanha as campanhas” | Explicita tráfego pago, Meta Ads e Google Ads, termos confirmados pelo briefing. |
| Sobre a Feed | Só havia “Onde a Feed atende” com a cobertura regional | O mesmo bloco recebe o título “Sobre a Feed”, nome completo, atividade, público e funções de Guilherme e Roseane. Mantém o parágrafo de cobertura e seus links. |
| Nome público | Rodapé em caixa alta; schema com nome por extenso | Rodapé usa `Feed Marketing e Comunicação`, igual ao Organization e ao bloco Sobre a Feed. |
| Telefone e e-mail | Já consistentes | Conferidos: `(16) 99294-8473`, `+5516992948473`, `emailmkt@agenciafeed.com`. Formatos visual e internacional representam o mesmo telefone. |
| Endereço | Só região, sem endereço físico confirmado | Continua só a região. Nenhuma rua, sede, CEP, coordenada ou horário inventado no schema. Pendência do dono. |
| FAQ de preço | Pergunta de preço e resposta longa | Substituído por “O que é o Feed Hub?”, só com funções e plataforma confirmadas. |
| FAQ de prazo | Pergunta de prazo | Substituído por “Como a Feed implementa a solução na minha empresa?”, sem prometer duração. |
| Outras respostas | TI, escolha de fornecedor e pequena empresa traziam menções comerciais e repetição | Respostas mais curtas, só com fatos. Preço, prazo, fidelidade e números ficam fora de todas as perguntas e respostas do FAQ. |
| FAQPage | Dez perguntas idênticas ao FAQ anterior | Dez perguntas e respostas idênticas ao FAQ novo, incluindo o HTML dos links; ganha `@id`, idioma e ligação à WebPage. |
| Identidade estruturada | `ProfessionalService` | `Organization`, opção autorizada no pedido. O tipo genérico anterior é obsoleto no Schema.org; mantém `@id`, CNPJ, contato, cidades e catálogo. |
| Catálogo estruturado | Doze serviços sem URLs | Mantém os doze, explicita CRM e liga oito serviços à página ou âncora existente. Não aponta para LP ainda inexistente. |
| `sameAs` | Instagram e Google Play misturados na identidade da empresa | Instagram permanece em `sameAs`. O aplicativo recebe ligação própria por `subjectOf`; a loja continua em `url` e `installUrl` do aplicativo. Empresa e app ficam identificados separadamente. |
| WebSite e WebPage | Ausentes | Acrescentados com IDs, URL, nome, idioma, publicadora, organização, app e FAQ conectados. |
| MobileApplication | Já tinha Android, Google Play e data do briefing | Preservado e ligado à página e à organização. Sem preço, nota, número de instalações ou data para iPhone. |
| Demonstrações | Livro, anúncio, painel, calendário, conversa/PDF e respostas de exemplo já protegidos | Mantidos; abertura e leque de telas ganham `data-nosnippet` no contêiner externo ao aparelho. |
| Alt das imagens | Logos com nome da marca; enfeites com alt vazio; telas descritivas | Conferidos e preservados. Não acrescentei palavras-chave aos logos nem descrevi enfeite como conteúdo. |
| Dimensões e lazy fora do aparelho | Cinco imagens com width e height, mas sem lazy em três imagens abaixo da dobra | Preserva as dimensões; adiciona `loading="lazy"` no ícone da rota, assinatura do Hub e logo do rodapé. Logos do topo continuam sem lazy. |
| Fontes | Barlow 500 a 900, preconnect Google e `display=swap` | Conferidos e preservados. Não baixei outra família ou peso. |
| CDN do 3D | Sem preconnect para jsDelivr | Adicionado `<link rel="preconnect" href="https://cdn.jsdelivr.net">`. Nenhum script 3D foi editado. |
| LCP | Preload da moldura `assets/fone.webp` | Preservado e reforçado com `fetchpriority="high"` no preload. Na amostra local, a moldura foi a última candidata a LCP. |
| Links internos | Destinos existentes já bem distribuídos | Preservados e auditados após a revisão do FAQ. Nenhum link para artigo não publicado. |

O comprimento de title e description é uma referência editorial, não um limite em que o Google promete exibir tudo. A medição é de caracteres, não de pixels no resultado de busca.

## Esboço completo dos títulos visíveis

Os dois-pontos abaixo separam o nome do serviço da frase do título para facilitar a leitura deste relatório. Na página, a separação já é visual por `span.servico`.

```text
H1 Agência de IA e marketing no interior de SP. A Feed resolve o problema da sua empresa. Seja qual for.
  H2 Do primeiro olhar até a venda fechada.
    H3 Ninguém lembra da sua marca.
    H3 O anúncio gasta e não traz gente.
    H3 O Instagram parou no mês passado.
    H3 O WhatsApp responde no dia seguinte.
    H3 O orçamento ficou para depois.
    H3 Tudo depende de você estar olhando.
  H2 Branding e identidade visual: Uma marca que a pessoa reconhece de longe.
  H2 Tráfego pago no Instagram, Facebook e Google: O anúncio certo, na frente de quem compra.
  H2 Gestão de redes sociais e Google Meu Negócio: Rede viva. E você só aprova.
  H2 Agente de IA no WhatsApp: Responde na hora. E leva até a proposta.
    H3 O cliente chama. O Agente responde na hora.
    H3 O Agente deixa o resumo pronto.
  H2 Funil de vendas e CRM: Cada oportunidade no seu lugar.
  H2 Isso já roda numa revenda de veículos do interior de SP.
  H2 O app Feed Hub, para Android: E você acompanha tudo pelo celular.
  H2 Agentes de IA sob medida: E se o seu problema não está na lista?
  H2 Três passos. O primeiro é grátis.
    H3 Diagnóstico do Gargalo
    H3 Implantação
    H3 Acompanhamento
  H2 O que todo mundo pergunta antes de começar.
    H3 Sobre a Feed
    H3 Do blog
  H2 Conta qual é o problema. A gente resolve.
```

Resultado: 1 H1, 12 H2 e 13 H3, sem saltos. As perguntas continuam em `summary`, sem mudar seu visual ou semântica de acordeão. As maquetes não acrescentam títulos ao esboço.

## Links conferidos

Foram conferidas **27 ocorrências de links internos em 13 destinos únicos**, no HTML do corpo. Separadamente, **40 ocorrências de âncoras em 15 destinos** foram verificadas contra IDs existentes. Links de telefone, e-mail, WhatsApp e Google Play não entram na contagem de páginas internas. Links repetidos no JSON-LD também não inflaram a contagem.

| Destino | Evidência local |
|---|---|
| `/agencia-de-ia-ribeirao-preto/` | `public/agencia-de-ia-ribeirao-preto/index.html` |
| `/agencia-de-marketing-bebedouro/` | `public/agencia-de-marketing-bebedouro/index.html` |
| `/agentes-de-ia/` | `public/agentes-de-ia/index.html` |
| `/automacao-whatsapp/` | `public/automacao-whatsapp/index.html` |
| `/ia-para-pequenas-empresas/` | `public/ia-para-pequenas-empresas/index.html` |
| `/diagnostico-ia-empresa/` | `public/diagnostico-ia-empresa/index.html` |
| `/diagnostico` | `public/diagnostico/index.html` |
| `/quanto-custa/` | `public/quanto-custa/index.html` |
| `/blog/` | `public/blog/index.html` |
| `/privacidade.html` | `public/privacidade.html` |
| `/blog/agente-ia-whatsapp-vale-a-pena/` | HTML existe; `marketing/blog/agente-ia-whatsapp-vale-a-pena.md`: `status: published` |
| `/blog/calcular-roi-automacao-ia/` | HTML existe; `marketing/blog/calcular-roi-automacao-ia.md`: `status: published` |
| `/blog/como-escolher-fornecedor-ia/` | HTML existe; `marketing/blog/como-escolher-fornecedor-ia.md`: `status: published` |

A conferência foi local, conforme solicitado. Não é uma alegação de status HTTP atual de produção. O conceito mantém URLs absolutas para funcionar quando aberto por arquivo. As quatro LP futuras continuam só nos briefings e na proposta de sitemap.

## JSON-LD e conferências técnicas

Parse com `JSON.parse` no Node e `json.loads` no Python de todos os quatro blocos do HTML: **4/4 válidos**, com cinco entidades principais: `Organization`, `MobileApplication`, `FAQPage`, `WebSite` e `WebPage`. Os quatro exemplos JSON dos briefings também foram parseados.

As dez perguntas e as dez respostas do FAQ foram comparadas, na mesma ordem, com igualdade literal entre o HTML interno da resposta e `acceptedAnswer.text`. Resultado: **10/10 idênticas**, incluindo links. Nenhum preço, prazo, fidelidade ou número no FAQ. `areaServed` é igual ao schema da raiz: Ribeirão Preto, Bebedouro, Barretos, Jaboticabal, Sertãozinho e Brasil. Não foi acrescentada outra cidade.

Conferências por script contra `bc66887`: dez elementos protegidos de aparelho, CSS e scripts do fim do corpo inalterados nesta entrega; tag de verificação idêntica à base e à raiz. Sem travessão, sem as palavras proibidas da regra de voz no HTML e sem marcadores. Cinco imagens fora do aparelho têm `width`, `height` e `alt`; as três abaixo da dobra têm lazy.

O script de conferência fica em:

```powershell
python C:\Users\guisa\AppData\Local\Temp\claude\f3a6600d269a104b\dff5d254-2c2d-40ae-8f7f-59afaf17b6db\scratchpad\seo-geo\auditar.py
node C:\Users\guisa\AppData\Local\Temp\claude\f3a6600d269a104b\dff5d254-2c2d-40ae-8f7f-59afaf17b6db\scratchpad\seo-geo\parse-jsonld.cjs
```

Ele deixa `auditoria.json` no mesmo scratchpad e sai com falha se divergir. Foi criado só para esta verificação, fora do repositório. A comparação com `bc66887` comprova o limite desta entrega; depois que o agente 3D alterar o aparelho, essa comparação precisa usar a base da integração, não exigir que o aparelho continue igual ao antigo.

## Peso e LCP

| Medida | Resultado desta amostra |
|---|---|
| HTML da base | 152.342 bytes |
| HTML com os ajustes de SEO | 153.209 bytes, acréscimo de 867 bytes |
| HTML comprimido com gzip local | 43.110 bytes, simulação de compressão, sem cabeçalhos HTTP |
| Imagens únicas referenciadas na página durante a auditoria | 335.257 bytes |
| HTML e imagens referenciadas | 488.466 bytes |
| Google Fonts, CSS e cinco arquivos de fonte, corpos decodificados | 119.077 bytes |
| Total desses componentes | 607.543 bytes, cerca de 593,3 KiB, antes do novo WebGL |
| Última candidata a LCP na amostra local de 390 px | `img.moldura`, `assets/fone.webp`, 1.800 ms |

O LCP acima foi observado em Chromium headless por `file://`, com carregamento de fontes real. Serve para identificar o recurso e conferir o preload, não como Core Web Vitals de produção. Não é um teste de rede móvel, nem p75 de usuários. O peso usa recursos únicos e corpos decodificados; não equivale a bytes transferidos pela rede com cache e compressão.

As quatro telas `.webp` estavam sendo alteradas pelo trabalho paralelo do aparelho e ficaram maiores que na base. O peso foi tirado dos arquivos existentes no momento da auditoria. Assets do 3D ainda não referenciados pelo HTML não entram no total acima. O pacote Three.js e as texturas finais exigem nova medição depois da integração; o preconnect da jsDelivr já está pronto.

## Medidor e celular

Comando executado na raiz deste worktree:

```text
node conceitos/_comum/medir.mjs d-site-feed
```

Saída, código 0:

```text
celular 390x844: altura 16099px, 0 achado(s)
tablet 768x1024: altura 17377px, 0 achado(s)
desktop 1440x900: altura 15761px, 0 achado(s)
TOTAL 0 achados
```

**Celular: 16.099 / 844 = 19,07 telas**, abaixo do limite de 20. Na base eram 15.950 px; o acréscimo é de 149 px. Capturas geradas pelo próprio medidor; abertura, FAQ e Sobre a Feed foram inspecionados visualmente. Não houve mudança de layout para chegar ao resultado.

## O que ficou de fora e por quê

1. **Aparelho e suas imagens:** onze imagens dentro dos contêineres protegidos ainda não têm os dois atributos de dimensão na base. Não alterei seus atributos, lazy, texturas, DOM, estilos ou scripts. O responsável pelo 3D deve fornecer as dimensões e prioridade adequadas do fallback e conferir o LCP final. Dimensões naturais da amostra: moldura 760 × 1638; telas 1080 × 2430, já atualizadas pelo trabalho paralelo.
2. **Alteração de visual:** não desenhei uma imagem Open Graph nova, não troquei identidade visual, layout ou fonte e não expandi H1 por cidade. Recomenda-se avaliar uma capa oficial nova com o dono, em outra entrega.
3. **Produção:** não alterei `public/`, raiz do site, geradores, sitemap, robots ou llms no ar. O sitemap e o llms novos são propostas completas nesta pasta.
4. **Páginas de serviço:** ficaram com briefings, metadados, esboços, perguntas, links e schemas. Não foram criadas nem linkadas prematuramente na home.
5. **Endereço, horários e perfis não confirmados:** nenhum dado inventado para completar schema de negócio local. `Organization` descreve a entidade com os fatos disponíveis.
6. **Resultados e prova:** não inventei número, depoimento, avaliação, selo ou nome de cliente. O caso real continua anônimo; Lume de Papel continua demonstração.
7. **Fontes locais e desempenho do WebGL:** hospedar Barlow localmente depende da etapa de produção; não acrescentei assets ou dependências. A nova cena deve ser medida na integração.
8. **Garantias de ranking, destaque de FAQ e citação por IA:** não foram prometidas. `data-nosnippet` restringe trechos de snippets nos sistemas que o respeitam; não impede indexação e não é bloqueio universal para todos os leitores de IA. `llms.txt` é apoio editorial, não substitui indexação.

## Pendências que dependem do dono

- Confirmar a cidade da sede, endereço público, CEP e se existe atendimento em escritório. Se não houver endereço público de atendimento, manter o perfil do Google como negócio com área de serviço e sem inventar sede.
- Confirmar se o Perfil da Empresa no Google já concluiu a verificação e fornecer sua URL oficial para associação de entidade. Os documentos dizem que entrou em verificação; não permitem concluir o status atual.
- Confirmar os horários de atendimento e suporte. Os documentos antigos divergem; nenhum foi adicionado ao schema.
- Confirmar preço ou faixa, prazo, fidelidade e multa antes de considerar esse conteúdo no FAQ. Nesta versão ficaram fora.
- Fornecer número real da revenda, período, forma de medir e autorização de divulgação. Confirmar se é permitido nomear o cliente e publicar relato ou imagem.
- Fornecer dados reais autorizados de tráfego, redes e Google para substituir as métricas de exemplo.
- Confirmar se o manual da marca é entrega padrão e quais itens entram em branding, tráfego e gestão de redes.
- Confirmar canal de suporte do Hub, regras de acesso e ativação. Nenhuma data de iPhone foi anunciada.
- Nas contas do dono: confirmar importação no Bing Webmaster Tools, conferir consultas no Search Console já verificado e autorizar ações de reputação externa, avaliações e diretórios com os mesmos dados da empresa. Nenhuma mensagem foi enviada.

## Próxima integração técnica

Depois de integrar o aparelho 3D, repetir o medidor, o parse, a igualdade FAQ/schema, os links, a cobertura `data-nosnippet`, dimensões das imagens, peso com Three.js e LCP. Depois de uma publicação autorizada, testar as respostas HTTP, os canonicals, o redirecionamento www/apex e o sitemap final, sem expor o conceito como segunda home indexável.

A futura conversão para React deve entregar o conteúdo textual já no HTML de resposta, com renderização estática ou equivalente. Não contar com execução de JavaScript por todo mecanismo de descoberta. Os arquivos de proposta devem acompanhar as publicações reais e o status dos artigos.

Referências técnicas consultadas: [Schema.org: ProfessionalService](https://schema.org/ProfessionalService), que documenta a obsolescência do tipo genérico; [MobileApplication](https://schema.org/MobileApplication); [Google: robots e data-nosnippet](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag), para os controles de trecho; [Google: recursos de IA e websites](https://developers.google.com/search/docs/appearance/ai-features), para a prioridade de SEO e conteúdo acessível sem exigir arquivo especial de IA. São orientações de interpretação, não evidência de ranking já alcançado pela Feed.
