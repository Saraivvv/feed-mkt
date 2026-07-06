# Passo 4 — Otimização on-page do site (agenciafeed.com)

## O que foi implementado em 05/07/2026 (já no ar após deploy)

| Item | Status |
|---|---|
| Title otimizado: "Agência de IA para empresas e PMEs \| Feed" | FEITO |
| Meta description com keyword + CTA (diagnóstico gratuito) | FEITO |
| Canonical https://agenciafeed.com/ | FEITO |
| Open Graph completo (og:title, description, image 1200x630, locale pt_BR) | FEITO |
| Twitter card (summary_large_image) | FEITO |
| og-image.png gerada na identidade (logo + slogan, fundo escuro) | FEITO |
| Schema JSON-LD ProfessionalService (nome, CNPJ, telefone, e-mail, serviços, área de atendimento, Instagram) | FEITO |
| noscript com resumo da empresa (conteúdo legível pra crawlers de IA sem JavaScript) | FEITO |
| robots.txt com sitemap | FEITO |
| sitemap.xml (home + privacidade) | FEITO |
| llms.txt (resumo estruturado pra crawlers de IA) | FEITO |

## Mapeamento página → keyword

| Página | Keyword principal | Title | H1 |
|---|---|---|---|
| / (home) | agência de IA para empresas | Agência de IA para empresas e PMEs \| Feed | IA prática pra sua empresa vender e operar melhor (mantido, bom) |
| /agencia-de-ia-ribeirao-preto (criar) | agência de IA Ribeirão Preto | Agência de IA em Ribeirão Preto e região \| Feed | Agência de IA em Ribeirão Preto |
| /agencia-de-marketing-bebedouro (criar) | agência de marketing Bebedouro | Agência de marketing e IA em Bebedouro \| Feed | Agência de marketing e IA em Bebedouro |
| /blog/* (criar) | ver Passo 5 | pergunta como title | pergunta como H1 |

## Pendências técnicas (por prioridade)

1. **Search Console + Bing Webmaster**: cadastrar e enviar sitemap. Sem isso o resto não é medível. É a primeira coisa a fazer depois do deploy.
2. **Conteúdo estático real**: o site é uma SPA React; o conteúdo principal só existe depois do JavaScript rodar. O Google renderiza, mas crawlers de IA não. Mitigado com noscript + JSON-LD + llms.txt, mas a solução definitiva é uma destas:
   - Blog e páginas locais como HTML estático em `public/` (caminho mais simples, recomendado; a esteira /publicar-tema pode gerar direto)
   - Pré-render da home no build (vite prerender; exige validação do build na Vercel antes de ativar)
3. **Redirect www/apex**: conferir na Vercel se www.agenciafeed.com redireciona 308 pra agenciafeed.com (ou vice-versa). Ter os dois respondendo 200 divide autoridade. Definir agenciafeed.com como principal.
4. **Fontes**: Google Fonts (Barlow) é render-blocking e depende de terceiro. Self-host com @font-face melhora LCP. Baixa prioridade, melhora marginal.
5. **FAQ visível na home** + FAQPage schema: adicionar seção de perguntas frequentes (5 a 8 perguntas do Passo 8). Mexe no design, validar visual antes de publicar.
6. **Alt text**: imagens da home são decorativas (ok), logo tem alt="Feed" (ok). Manter atenção em imagens futuras do blog.
7. **Form Netlify legado** no index.html: inofensivo, mas é lixo herdado do deploy antigo. Remover na próxima limpeza junto com netlify.toml.

## Internal linking (quando blog existir)

- Home → páginas locais (footer: "Atendemos Ribeirão Preto, Bebedouro e região" com links)
- Todo artigo → pilar "IA para pequenas empresas" + CTA diagnóstico
- Páginas locais → artigos de caso da região
- Pilar → todos os satélites
