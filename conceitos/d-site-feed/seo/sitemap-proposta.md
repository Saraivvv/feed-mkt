# Proposta de sitemap

Data: 12/11/2026. Nenhuma alteração em `public/sitemap.xml`. A home deste conceito representa a URL final `https://agenciafeed.com/`, não uma URL nova em `/conceitos/`.

## Alterações nas URLs existentes

| URL | Ação |
|---|---|
| `https://agenciafeed.com/` | Manter a URL e o canonical. Atualizar `lastmod` para a data real da publicação da home nova, depois de publicada. O valor atual é `2026-07-05`. |
| `https://agenciafeed.com/diagnostico` | Propor inclusão do formulário existente, desde que a URL final indexável responda 200 e tenha canonical consistente. A home já usa esta grafia sem barra final; alinhar o servidor antes de cadastrar uma variante. |
| `https://agenciafeed.com/agendar/` | Propor inclusão da página existente, após confirmar canonical e indexabilidade no ambiente de publicação. |
| As duas páginas locais | Preservar URLs, conteúdo e propriedade dos termos locais. `lastmod` só muda quando o conteúdo delas mudar. |
| As cinco páginas de serviço já listadas, blog, artigos e privacidade | Preservar URLs. Não atualizar datas em massa por causa da home. |

O sitemap atual tem 24 URLs: home, privacidade, blog, 14 artigos publicados e 7 páginas estratégicas. Diagnóstico e agendamento já existem em `public/`, mas não estão no sitemap atual. Sua inclusão acrescentaria 2 URLs, condicionada à revisão acima.

## URLs novas, somente depois de criar e publicar

| URL | Palavra-chave principal | Entrada na home |
|---|---|---|
| `https://agenciafeed.com/trafego-pago/` | gestão de tráfego pago | Link contextual em `#trafego` |
| `https://agenciafeed.com/gestao-de-redes-sociais/` | gestão de redes sociais | Link contextual em `#redes` |
| `https://agenciafeed.com/branding-identidade-visual/` | branding e identidade visual | Link contextual em `#marca` |
| `https://agenciafeed.com/feed-hub/` | Feed Hub | Trocar o destino de “Conheça o app”; manter “Baixar” no Google Play |

Trecho a incorporar apenas quando cada página existir e estiver publicada. `lastmod` foi omitido intencionalmente: preencher com a data real da publicação, nunca com a data deste documento por conveniência.

```xml
<url>
  <loc>https://agenciafeed.com/trafego-pago/</loc>
</url>
<url>
  <loc>https://agenciafeed.com/gestao-de-redes-sociais/</loc>
</url>
<url>
  <loc>https://agenciafeed.com/branding-identidade-visual/</loc>
</url>
<url>
  <loc>https://agenciafeed.com/feed-hub/</loc>
</url>
```

Com as quatro páginas e as duas inclusões condicionais, o total projetado é 30 URLs. Esse número descreve a proposta, não o sitemap já aplicado.

## Regras de publicação

1. Só URLs canônicas do domínio principal, absolutas, indexáveis e com resposta 200. Não cadastrar conceitos, âncoras, parâmetros, redirecionamentos, Google Play ou páginas inexistentes.
2. Artigo só entra quando `status: published` no frontmatter e `public/blog/<slug>/index.html` existe. Data de calendário vencida não transforma `scheduled` em publicado.
3. Não criar outra URL de home nem substituir as páginas locais por páginas genéricas de serviço.
4. Atualizar o gerador que mantém o sitemap, para o próximo build não desfazer a edição. Conferir também o pipeline que publica o blog.
5. Após a publicação autorizada, enviar o sitemap no Search Console e no Bing Webmaster Tools e inspecionar as URLs novas. A verificação do Search Console existente deve ser preservada.

Não há ganho em inventar `lastmod` ou prioridades. Referência: [orientações do Google sobre sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).
