# Briefing das páginas de serviço

Data: 12/11/2026. Planejamento, sem criar páginas em `public/`. Fonte factual: `conceitos/_comum/BRIEFING.md`, `BRIEFING-SITE-FEED.md` e FAQ da home. Sem preço, prazo, fidelidade, número de cliente ou garantia de resultado.

## Regras comuns

- Uma intenção principal por página, um H1 e H2 para os assuntos abaixo. H3 só dentro do H2 correspondente. Não copiar toda a home.
- Primeiras 150 palavras: dizer o que é o serviço, o que a Feed faz e para quem; mencionar a base em Ribeirão Preto e região e o atendimento remoto no Brasil, sem fingir sede nas duas cidades.
- As páginas locais continuam donas de “agência de IA Ribeirão Preto” e “agência de marketing Bebedouro”. Cada página nova é dona do serviço sem cidade no title; termos locais entram como contexto de atendimento.
- Metadados próprios, canonical na URL da página, HTML legível sem JavaScript, contato igual à home. Nenhum endereço sem confirmação.
- CTA principal para `https://agenciafeed.com/diagnostico`; WhatsApp secundário em `https://wa.me/5516992948473`.
- Usar exemplos identificados como demonstração, com `data-nosnippet` num `div`, `span` ou `section` que os envolva. Não apresentar Lume de Papel como cliente.
- As sugestões de FAQ abaixo têm base nos fatos existentes. A resposta final deve sair desses fatos, ficar visível na página e ser idêntica ao `FAQPage`, inclusive links.
- Nos quatro documentos HTML, incluir `Organization` com `@id` compartilhado `https://agenciafeed.com/#organization`, contatos e `sameAs` da home; `WebSite` com `@id` `https://agenciafeed.com/#website`; `WebPage` com `@id` da URL canônica mais `#webpage`, `isPartOf` para o WebSite, `about` para a organização, `inLanguage: pt-BR` e `mainEntity` para a entidade específica abaixo. Se houver trilha visível Home > Serviço, usar `BreadcrumbList` correspondente. Não criar trilha só no schema.
- `FAQPage` recebe `@id` da URL mais `#faq`, `isPartOf` para a WebPage e `mainEntity` com `Question`/`acceptedAnswer`. Sem `AggregateRating`, preço ou `Offer` de valor não confirmado. Esses schemas descrevem a página, sem promessa de destaque em buscadores.

## /trafego-pago/

**Intenção:** contratar quem cria e acompanha campanhas. A página explica aquisição; `/automacao-whatsapp/` explica o atendimento depois do clique.

- Palavra-chave principal: **gestão de tráfego pago**.
- Secundárias: tráfego pago para empresas, Meta Ads, Google Ads, anúncios no Instagram, anúncios no Facebook.
- Local de apoio: tráfego pago Ribeirão Preto. Mencionar a região no texto e ligar à página local; não abrir outra landing municipal sem caso real.
- Title: `Gestão de tráfego pago: Meta Ads e Google Ads | Feed`.
- Description: `A Feed cria e acompanha campanhas no Instagram, Facebook e Google, ligadas ao atendimento no WhatsApp. Conheça o trabalho e peça seu diagnóstico.`
- H1: `Gestão de tráfego pago para trazer a pessoa certa até a conversa.`

**Abertura factual sugerida:** A Feed cria e acompanha campanhas de tráfego pago no Instagram, Facebook e Google. O anúncio leva a pessoa até o WhatsApp, onde o atendimento continua com o Agente e a equipe. A Feed é uma agência de IA aplicada e marketing da região de Ribeirão Preto e Bebedouro, com atendimento remoto em todo o Brasil.

**H2, em ordem:**

1. Tráfego pago no Instagram e no Facebook com Meta Ads.
2. Anúncios no Google com Google Ads.
3. Do anúncio ao WhatsApp: quem atende o contato.
4. Do contato ao funil de vendas e à proposta.
5. Como a Feed começa: diagnóstico, implantação e acompanhamento.
6. Perguntas sobre tráfego pago.
7. Converse com a Feed sobre a sua operação.

**FAQ e limite da resposta:**

- Em quais canais a Feed faz tráfego pago? Instagram, Facebook e Google, com criação e acompanhamento de campanhas.
- O que acontece depois do clique no anúncio? No fluxo mostrado, a pessoa chega ao WhatsApp; o Agente resolve o simples e passa para a equipe quando precisa.
- A Feed também cuida do atendimento? Sim, com automação de WhatsApp e Agente de IA quando o caso pede. Não dizer que todo contrato de tráfego já inclui isso.
- A Feed atende fora de Ribeirão Preto? Base regional e Brasil remoto, como a home.
- Como começo? Diagnóstico do Gargalo e conversa com Guilherme.

**Links no corpo:** home `/#trafego`, `/automacao-whatsapp/`, `/agentes-de-ia/`, `/diagnostico-ia-empresa/`, `/agencia-de-ia-ribeirao-preto/` e `/diagnostico`. Depois de publicada, também `/feed-hub/`. Nenhum link novo entra na home antes de existir.

**Schema específico, além dos comuns:**

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://agenciafeed.com/trafego-pago/#service",
  "url": "https://agenciafeed.com/trafego-pago/",
  "name": "Gestão de tráfego pago",
  "serviceType": "Campanhas com Meta Ads e Google Ads",
  "description": "Criação e acompanhamento de campanhas no Instagram, Facebook e Google, ligadas ao atendimento no WhatsApp.",
  "provider": { "@id": "https://agenciafeed.com/#organization" }
}
```

**Confirmar antes da redação final:** entregas de cada contrato, acesso às contas, responsabilidade sobre verba de mídia e quais métricas e relatórios são entregues. Não inventar periodicidade ou retorno.

## /gestao-de-redes-sociais/

**Intenção:** contratar gestão de conteúdo e presença digital. A consulta específica de agência em Bebedouro continua com a landing local.

- Palavra-chave principal: **gestão de redes sociais**.
- Secundárias: gestão de Instagram e Facebook, posts para empresas, aprovação de posts pelo celular, Google Meu Negócio, Perfil da Empresa no Google.
- Local de apoio: gestão de redes sociais em Bebedouro e Ribeirão Preto, apenas como contexto regional.
- Title: `Gestão de redes sociais e Google Meu Negócio | Feed`.
- Description: `Instagram, Facebook e Google Meu Negócio cuidados pela Feed. Aprove os posts pelo celular e acompanhe sua presença digital. Peça seu diagnóstico.`
- H1: `Gestão de redes sociais e Google Meu Negócio para a sua empresa.`

**Abertura factual sugerida:** A Feed cuida do Instagram, do Facebook e do Google Meu Negócio da empresa. Os posts chegam prontos para aprovação pelo celular e publicação agendada. A agência atende pequenas e médias empresas da região de Ribeirão Preto e Bebedouro e do Brasil todo de forma remota.

**H2, em ordem:**

1. Gestão de Instagram e Facebook: conteúdo pronto para aprovar.
2. Aprovação e publicação dos posts pelo celular.
3. Google Meu Negócio: a presença da empresa no Google.
4. Comentário com palavra-chave que vira mensagem direta.
5. Métricas de redes e Google: acompanhar o que acontece.
6. Como começa o trabalho com a Feed.
7. Perguntas sobre gestão de redes sociais.

**FAQ e limite da resposta:**

- Quais canais a Feed cuida? Instagram, Facebook e Google Meu Negócio.
- Posso aprovar os posts pelo celular? Sim, pelo Feed Hub.
- O post é publicado depois da aprovação? O fluxo apresentado tem aprovação e publicação agendada.
- Dá para enviar uma mensagem quando alguém comenta uma palavra? O briefing confirma o comentário com palavra-chave que vira mensagem direta.
- A Feed atende pequenas empresas de outras cidades? Sim, atendimento remoto em todo o Brasil.

**Links no corpo:** home `/#redes`, `/agencia-de-marketing-bebedouro/`, `/ia-para-pequenas-empresas/`, `/diagnostico-ia-empresa/` e `/diagnostico`; `/feed-hub/` depois de publicada. Não abrir uma página de Google Meu Negócio sem antes decidir se há conteúdo e demanda próprios.

**Schema específico, além dos comuns:**

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://agenciafeed.com/gestao-de-redes-sociais/#service",
  "url": "https://agenciafeed.com/gestao-de-redes-sociais/",
  "name": "Gestão de redes sociais e Google Meu Negócio",
  "serviceType": "Gestão de Instagram, Facebook e presença no Google",
  "description": "Conteúdo, aprovação pelo celular e publicação agendada, com gestão da presença da empresa nas redes e no Google Meu Negócio.",
  "provider": { "@id": "https://agenciafeed.com/#organization" }
}
```

**Confirmar antes da redação final:** quantidade e formatos de conteúdo, o que entra na gestão do perfil no Google e na resposta a avaliações, direitos das imagens e métricas que o cliente recebe. Não prometer primeira posição no Maps ou crescimento de seguidores.

## /branding-identidade-visual/

**Intenção:** contratar identidade e posicionamento de marca. Não competir com termos de ferramenta gratuita para criar logo.

- Palavra-chave principal: **branding e identidade visual**.
- Secundárias: criação de identidade visual, posicionamento de marca para empresas, identidade visual para pequenas empresas.
- Local de apoio: identidade visual em Ribeirão Preto e Bebedouro.
- Title: `Branding e identidade visual para empresas | Feed`.
- Description: `A Feed desenha a identidade visual da sua empresa: logo, cores, tipografia, voz e aplicações da marca. Conheça o trabalho e comece pelo diagnóstico.`
- H1: `Branding e identidade visual para a sua empresa ser reconhecida.`

**Abertura factual sugerida:** A Feed desenha a identidade visual da empresa: logo, cores, tipografia, voz e aplicações na rua e na tela. É o trabalho de marca que vem antes do anúncio e do post. A agência atende pequenas e médias empresas da região de Ribeirão Preto e Bebedouro e de todo o Brasil remotamente.

**H2, em ordem:**

1. Identidade visual: logo, cores e tipografia.
2. Voz da marca e aplicações na rua e na tela.
3. Como a marca aparece nos posts e nos anúncios.
4. Uma demonstração de identidade visual aplicada.
5. Do diagnóstico à implantação na empresa.
6. Perguntas sobre branding e identidade visual.

**FAQ e limite da resposta:**

- A Feed cria a identidade visual da empresa? Sim: logo, cores, letra, voz e aplicações, conforme o briefing.
- O trabalho de marca também aparece nas redes? O briefing liga identidade visual, post e presença digital; a proposta define a entrega.
- A Lume de Papel é um cliente da Feed? Não. É a marca fictícia de demonstração.
- A Feed atende pequenas empresas? Sim, pequenas e médias empresas.
- Como começo? Pelo Diagnóstico do Gargalo e conversa com Guilherme.

**Links no corpo:** home `/#marca`, `/agencia-de-marketing-bebedouro/`, `/diagnostico-ia-empresa/`, `/ia-para-pequenas-empresas/` e `/diagnostico`; páginas de tráfego e redes só depois de publicadas. Não usar o post de posicionamento B2B: seu frontmatter ainda está `scheduled`.

**Schema específico, além dos comuns:**

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://agenciafeed.com/branding-identidade-visual/#service",
  "url": "https://agenciafeed.com/branding-identidade-visual/",
  "name": "Branding e identidade visual",
  "serviceType": "Identidade visual e posicionamento de marca",
  "description": "Desenho da identidade visual: logo, cores, tipografia, voz e aplicações na rua e na tela.",
  "provider": { "@id": "https://agenciafeed.com/#organization" }
}
```

**Confirmar antes da redação final:** se manual da marca é entrega padrão, formatos e arquivos entregues, etapas de aprovação e autorização de portfólio. Não transformar o manual da demonstração em obrigação contratual.

## /feed-hub/

**Intenção:** busca de marca, conhecer o aplicativo e baixar a versão Android. Não disputar “CRM gratuito” ou “aplicativo de WhatsApp” como promessa de produto independente.

- Palavra-chave principal: **Feed Hub**.
- Secundárias: aplicativo Feed Hub, Feed Hub Android, atendimento vendas e aprovações no celular.
- Local: apenas na apresentação da Feed como publicadora, sem cidade no title.
- Title: `Feed Hub: atendimento, vendas e aprovações no celular | Feed`.
- Description: `Conheça o Feed Hub para Android: atenda o WhatsApp, acompanhe o funil e aprove posts e orçamentos pelo celular. Disponível no Google Play.`
- H1: `Feed Hub. Sua empresa na palma da mão.`

**Abertura factual sugerida:** O Feed Hub é o app onde a equipe do cliente da Feed atende o WhatsApp, acompanha o funil de vendas, aprova posts e orçamentos e recebe avisos no celular. Está disponível para Android no Google Play desde 09/11/2026. A Feed é uma agência de IA aplicada e marketing do interior de SP, com atendimento remoto em todo o Brasil.

**H2, em ordem:**

1. Veja primeiro o que precisa de você.
2. Atendimento no WhatsApp com o resumo do Agente.
3. Funil de vendas: cada oportunidade no seu lugar.
4. Posts e orçamentos aprovados pelo celular.
5. Feed Hub para Android no Google Play.
6. Quem é a Feed e como começar.
7. Perguntas sobre o Feed Hub.

**FAQ e limite da resposta:**

- O que é o Feed Hub? App para a equipe do cliente operar atendimento, vendas e aprovações.
- O Feed Hub está disponível para Android? Sim, no Google Play.
- Posso aprovar posts e orçamentos pelo celular? Sim, confirmado no briefing.
- O Agente deixa um resumo para a equipe? Sim, confirmado no briefing e na frase aprovada da loja.
- Existe versão para iPhone? Vem depois, sem data anunciada.
- Como começo a trabalhar com a Feed? Diagnóstico do Gargalo e conversa sobre o caso.

**Links no corpo:** `https://play.google.com/store/apps/details?id=com.agenciafeed.hub` como CTA de instalação; home `/#hub`, `/automacao-whatsapp/`, `/agentes-de-ia/`, `/diagnostico` e `/diagnostico-ia-empresa/`; `/gestao-de-redes-sociais/` depois de publicada. Manter o botão de download direto na loja, mesmo com a LP própria.

**Schema específico, além dos comuns:** usar o mesmo `@id` do aplicativo que a home, para não criar dois aplicativos distintos.

```json
{
  "@context": "https://schema.org",
  "@type": "MobileApplication",
  "@id": "https://agenciafeed.com/#feed-hub",
  "name": "Feed Hub",
  "description": "Atendimento, vendas e aprovações no celular para a equipe do cliente da Feed.",
  "operatingSystem": "Android",
  "applicationCategory": "BusinessApplication",
  "url": "https://agenciafeed.com/feed-hub/",
  "installUrl": "https://play.google.com/store/apps/details?id=com.agenciafeed.hub",
  "datePublished": "2026-11-09",
  "inLanguage": "pt-BR",
  "publisher": { "@id": "https://agenciafeed.com/#organization" }
}
```

Quando a LP for publicada, alinhar o `url` do aplicativo também na home; o `installUrl` continua na loja. A data acima é a publicação do app confirmada no briefing, não a data da futura LP.

**Confirmar antes da redação final:** fluxo de acesso e ativação do cliente, aparelhos e versão mínima suportados, canal de suporte e política do aplicativo. Não inventar download gratuito, preço, nota, avaliações, quantidade de instalações ou lançamento para iPhone.
