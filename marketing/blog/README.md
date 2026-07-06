# Blog da Feed

Sistema editorial para publicar guias de IA aplicada a pequenas e medias empresas.

## Frequencia

Primeiros 60 dias:

- Terca: post evergreen de busca, com resposta direta para uma pergunta de compra.
- Quinta ou sexta: post pratico de autoridade, com checklist, criterios ou processo.

Depois dos primeiros 60 dias:

- 1 post forte por semana.
- 1 post pilar por mes.
- 1 revisao quinzenal de artigo antigo.

## Linha editorial

O blog deve ajudar o dono de negocio a decidir melhor. Prioridade para temas que envolvem:

- custo real de IA;
- automacao de atendimento;
- WhatsApp, CRM, agenda e processos;
- ROI e payback;
- erros antes de contratar fornecedor;
- por onde comecar sem montar projeto grande demais.

Evitar noticia, hype e texto generico sobre tecnologia. Cada post precisa responder uma duvida concreta de PME.

## Fluxo

1. Criar ou editar um markdown em `marketing/blog/`.
2. Preencher o frontmatter editorial.
3. Rodar `npm run blog:validate`.
4. Rodar `npm run blog:build`.
5. Rodar `npm run build`.
6. Conferir `/blog/` e o artigo no preview.

Para agendar um post aprovado, use:

```yaml
status: scheduled
publishAt: 2026-07-07
```

O GitHub Actions roda terça e quinta de manhã no horário de Brasília. Quando `publishAt`
for igual ou anterior ao dia atual, o workflow troca `status: scheduled` para
`status: published`, valida o blog, gera as páginas estáticas, faz commit e deixa a
Vercel publicar pelo push.

## Frontmatter minimo para post publicado

```yaml
title: "Titulo completo do H1"
slug: slug-do-artigo
seoTitle: "Titulo curto para SEO | Feed"
description: "Resumo com promessa clara e ate 165 caracteres."
date: 2026-07-05
keyword: palavra-chave principal
category: Custos e decisoes
stage: Estou avaliando IA
contentType: Guia de decisao
featured: true
readerQuestion: "Pergunta real que o leitor esta tentando responder"
painPoint: "Dor operacional ou comercial por tras da busca"
businessOutcome: "O que o leitor decide melhor depois de ler"
heroSummary: "Resposta curta que vende a leitura"
cardLabel: "Antes de pedir orcamento"
cardTakeaway: "Por que vale clicar neste guia"
costRange: "R$100/mes a R$40 mil"
payback: "4 a 8 meses"
difficulty: "Medio"
ctaVariant: diagnostico-custo
readingPromise:
  - "Primeiro ganho concreto da leitura"
  - "Segundo ganho concreto da leitura"
  - "Terceiro ganho concreto da leitura"
relatedPlanned:
  - "Proximo guia planejado"
status: published
```

## Status

- `draft`: rascunho, nao entra no site.
- `scheduled`: aprovado e aguardando a data de `publishAt`.
- `planned`: pauta planejada, nao entra no site.
- `published`: entra na listagem, gera pagina e atualiza sitemap.
