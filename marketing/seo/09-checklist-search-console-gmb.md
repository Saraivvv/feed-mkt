# Passo 9 — O que só o Guilherme pode fazer (Search Console, Bing e Google Business)

> Atualizado em 19/08/2026. Tudo do lado técnico já está pronto: sitemap com 24 URLs, robots.txt liberado, llms.txt com as 15 páginas de guia, schema em todas as páginas e blog publicando sozinho. O que falta depende de login em contas que são suas.

Ordem de impacto: Search Console primeiro, Bing depois, Google Business por último (mas o Business é o que mais vira telefone tocando na região).

## 1. Google Search Console — FEITO em 20/08/2026

Verificado por tag HTML no head do `index.html` (propriedade por prefixo de URL, https://agenciafeed.com) e sitemap enviado. A tag `google-site-verification` não pode ser removida do site, senão a verificação cai. Dado de busca com volume útil a partir do começo de setembro.

O passo a passo original fica abaixo como registro.

### Como foi feito

Não foi por propriedade de domínio, porque o DNS está na Hostinger e o registro TXT daria trabalho à toa. Foi por **prefixo de URL** (`https://agenciafeed.com`) com verificação por **tag HTML**: o Guilherme gerou o código no Search Console, eu coloquei no head do `index.html` e publiquei, ele clicou em verificar e enviou o `sitemap.xml`.

Detalhe que custou uma rodada: a primeira tag gerada saiu de outra conta Google. A válida é a segunda, da conta que ficou dona da propriedade.

### O que ainda vale fazer lá dentro (5 minutos)

Em **Inspeção de URL**, pedir indexação destas seis, uma por vez, para acelerar a entrada no índice:
   - `https://agenciafeed.com/`
   - `https://agenciafeed.com/ia-para-pequenas-empresas/`
   - `https://agenciafeed.com/agencia-de-ia-ribeirao-preto/`
   - `https://agenciafeed.com/agencia-de-marketing-bebedouro/`
   - `https://agenciafeed.com/blog/ia-para-pme-guia-pratico/`
   - `https://agenciafeed.com/blog/quanto-custa-implementar-ia-pequena-empresa/`

Depois de duas semanas com dados, me avisa: dá para escolher os próximos artigos pelo que já aparece na busca em vez de escolher por pesquisa qualitativa.

## 2. Bing Webmaster Tools (10 minutos)

Importa direto do Search Console, então é rápido, e vale porque o índice do Bing alimenta parte das respostas de IA, incluindo Copilot.

1. Entre em [bing.com/webmasters](https://www.bing.com/webmasters).
2. Escolha importar do Google Search Console e autorize.
3. Confirme o envio do sitemap.

## 3. Google Business Profile (1 hora, mais fotos)

É o item com maior chance de gerar contato local no curto prazo. As buscas de "agência de IA Ribeirão Preto" e "agência de marketing Bebedouro" têm concorrência fraca, e o mapa aparece antes dos resultados normais.

**Dados que precisam bater exatamente com o site:**

- Nome: Feed Marketing e Comunicação
- Telefone: (16) 99302-0694
- Site: https://agenciafeed.com
- E-mail de contato: emailmkt@agenciafeed.com

**Configuração sugerida:**

1. Crie o perfil como **negócio com área de atendimento**, sem endereço público, se não houver escritório com atendimento presencial. Se houver, use o endereço real, porque endereço inventado derruba o perfil.
2. Área de atendimento: Ribeirão Preto, Bebedouro, Barretos, Jaboticabal, Sertãozinho e Monte Azul Paulista.
3. Categoria principal: Agência de marketing. Categorias secundárias: Consultor de marketing, Serviço de publicidade, Desenvolvedor de software.
4. Descrição: use a mesma promessa do site, IA aplicada e marketing para pequenas e médias empresas, com escopo realista e retorno medido. Sem lista de palavra-chave empilhada.
5. Serviços: diagnóstico gratuito, automação de atendimento no WhatsApp, agentes de IA, automação de processos, posicionamento de marca, criação de site, gestão de redes.
6. Fotos: logo, capa e pelo menos cinco imagens reais de trabalho ou bastidor. Perfil sem foto converte muito menos.
7. Ligue as mensagens só se alguém for responder rápido. Perfil que demora a responder perde posição.

**Depois de criado:**

- Peça avaliação para os clientes atuais, um por semana, com link direto. Cinco avaliações reais já mudam o jogo nessa concorrência.
- Publique uma atualização a cada duas semanas. Dá para reaproveitar o post do blog da semana.
- Responda toda avaliação, inclusive as ruins.

## 4. O que eu faço quando você terminar

- Ligo o acompanhamento de posições e escolho as próximas pautas pelo que já traz clique.
- Crio as páginas locais das cidades vizinhas que tiverem caso real para contar.
- Ajusto títulos e descrições dos artigos que aparecem na busca mas não recebem clique.
- Marco a revisão quinzenal dos posts antigos com os dados reais na mão.
