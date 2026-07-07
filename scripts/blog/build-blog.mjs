#!/usr/bin/env node
/**
 * Gerador estático do blog da Feed.
 *
 * Fontes:  marketing/blog/*.md (frontmatter YAML: title, slug, description, date, keyword, status)
 * Saída:   public/blog/<slug>/index.html (posts com status: published)
 *          public/blog/index.html (listagem)
 *          public/sitemap.xml (atualizado com as URLs do blog, sem duplicar)
 *
 * Uso: node scripts/blog/build-blog.mjs
 */

import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { marked } from "marked";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..", "..");
const SRC_DIR = join(ROOT, "marketing", "blog");
const OUT_DIR = join(ROOT, "public", "blog");
const SITEMAP_PATH = join(ROOT, "public", "sitemap.xml");
const TEMPLATE_PATH = join(__dirname, "template.html");

const SITE = "https://agenciafeed.com";
const ORG_NAME = "Feed Marketing e Comunicação";
const ORG_LOGO = `${SITE}/brand/feed-logo-simples-branca.png`;
const OG_IMAGE = `${SITE}/og-image.png`;

marked.setOptions({ gfm: true });

const MESES = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

function esc(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function dataHumana(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} de ${MESES[m - 1]} de ${y}`;
}

function parseFrontmatter(raw, file) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) throw new Error(`Frontmatter ausente em ${file}`);
  const meta = {};
  let activeList = null;
  for (const line of match[1].split(/\r?\n/)) {
    const listItem = line.match(/^\s+-\s+(.+)$/);
    if (listItem && activeList) {
      meta[activeList].push(unquote(listItem[1].trim()));
      continue;
    }

    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if (!value) {
      meta[key] = [];
      activeList = key;
    } else {
      meta[key] = unquote(value);
      activeList = null;
    }
  }
  for (const req of ["title", "slug", "description", "date", "status"]) {
    if (!meta[req]) throw new Error(`Campo "${req}" ausente no frontmatter de ${file}`);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(meta.date)) {
    throw new Error(`Data inválida em ${file}: use YYYY-MM-DD`);
  }
  return { meta, body: raw.slice(match[0].length) };
}

function unquote(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return value;
}

function tempoLeitura(markdown) {
  const palavras = markdown.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(palavras / 200));
}

function slugifyHeading(str) {
  return String(str)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

function extractSections(markdown) {
  return [...markdown.matchAll(/^##\s+(.+)$/gm)].map((match) => ({
    title: match[1].trim(),
    id: slugifyHeading(match[1]),
  }));
}

// Extrai pares pergunta/resposta da seção "## Perguntas frequentes".
// Formato esperado: pergunta em negrito (**...?**) seguida do parágrafo de resposta.
// Alimenta o schema FAQPage (rich result no Google + fonte que IA cita no GEO).
function extractFaq(markdown) {
  const start = markdown.search(/^##\s+Perguntas frequentes\s*$/im);
  if (start === -1) return [];
  let rest = markdown.slice(start).replace(/^##\s+Perguntas frequentes\s*$/im, "");
  const nextH2 = rest.search(/^##\s+/m);
  if (nextH2 !== -1) rest = rest.slice(0, nextH2);
  const blocks = rest.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  const faq = [];
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    // Formato 1: pergunta em negrito e resposta em linhas adjacentes no mesmo bloco.
    const inline = b.match(/^\*\*(.+?)\*\*\s*\n([\s\S]+)$/);
    if (inline) {
      faq.push({ q: inline[1].trim(), a: inline[2].replace(/\s+/g, " ").trim() });
      continue;
    }
    // Formato 2: pergunta sozinha num bloco, resposta no bloco seguinte.
    const solo = b.match(/^\*\*(.+?)\*\*$/s);
    if (solo && i + 1 < blocks.length && !/^\*\*/.test(blocks[i + 1])) {
      faq.push({ q: solo[1].trim(), a: blocks[i + 1].replace(/\s+/g, " ").trim() });
      i++;
    }
  }
  return faq;
}

function renderMarkdown(md) {
  let html = marked.parse(md);
  html = html.replace(/<h2>(.*?)<\/h2>/g, (_, title) => {
    const cleanTitle = title.replace(/<[^>]+>/g, "");
    return `<h2 id="${slugifyHeading(cleanTitle)}">${title}</h2>`;
  });
  // Tabelas rolam em telas estreitas sem quebrar a coluna de leitura
  html = html
    .replace(/<table>/g, '<div class="table-wrap"><table>')
    .replace(/<\/table>/g, "</table></div>");
  return html.trim();
}

function jsonLdPost(post) {
  const url = `${SITE}/blog/${post.slug}/`;
  const graph = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `${url}#article`,
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      dateModified: post.date,
      inLanguage: "pt-BR",
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      image: OG_IMAGE,
      author: {
        "@type": "Organization",
        name: ORG_NAME,
        url: `${SITE}/`,
      },
      publisher: {
        "@type": "Organization",
        name: ORG_NAME,
        url: `${SITE}/`,
        logo: { "@type": "ImageObject", url: ORG_LOGO },
      },
      ...(post.keyword ? { keywords: post.keyword } : {}),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE}/blog/` },
        { "@type": "ListItem", position: 3, name: post.title, item: url },
      ],
    },
  ];

  if (post.faq?.length) {
    graph.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: post.faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    });
  }

  return JSON.stringify(graph, null, 2);
}

function renderPost(template, post, posts = []) {
  // seoTitle opcional no frontmatter encurta o <title> sem mudar o H1
  const pageTitle = post.seoTitle || `${post.title} | Blog da Feed`;
  const promiseItems = list(post.readingPromise)
    .map((item) => `<li>${esc(item)}</li>`)
    .join("\n");
  const promiseBlock = promiseItems
    ? `<section class="post-brief" aria-label="Resumo do guia">
          <div>
            <span class="brief-label">Resposta rápida</span>
            <p>${esc(post.heroSummary || post.description)}</p>
          </div>
          <dl>
            ${post.costRange ? `<div><dt>Investimento</dt><dd>${esc(post.costRange)}</dd></div>` : ""}
            ${post.payback ? `<div><dt>Payback típico</dt><dd>${esc(post.payback)}</dd></div>` : ""}
            ${post.difficulty ? `<div><dt>Complexidade</dt><dd>${esc(post.difficulty)}</dd></div>` : ""}
          </dl>
          <div class="post-promise">
            <span class="brief-label">Você vai entender</span>
            <ul>${promiseItems}</ul>
          </div>
        </section>`
    : "";
  const toc = post.sections?.length
    ? `<nav class="post-toc" aria-label="Sumário do artigo">
          <span>Guia rápido</span>
          ${post.sections.map((section) => `<a href="#${section.id}">${esc(section.title)}</a>`).join("\n")}
        </nav>`
    : "";
  const related = renderRelated(post, posts);
  return template
    .replaceAll("{{PAGE_TITLE}}", esc(pageTitle))
    .replaceAll("{{META_DESCRIPTION}}", esc(post.description))
    .replaceAll("{{CANONICAL_URL}}", `${SITE}/blog/${post.slug}/`)
    .replaceAll("{{JSON_LD}}", jsonLdPost(post))
    .replaceAll("{{EYEBROW}}", esc(post.keyword || "Blog da Feed"))
    .replaceAll("{{POST_TITLE}}", esc(post.title))
    .replaceAll("{{POST_DATE_ISO}}", post.date)
    .replaceAll("{{POST_DATE_HUMAN}}", dataHumana(post.date))
    .replaceAll("{{READING_TIME}}", String(post.readingTime))
    .replaceAll("{{POST_BRIEF}}", promiseBlock)
    .replaceAll("{{POST_TOC}}", toc)
    .replaceAll("{{POST_CONTENT}}", post.html)
    .replaceAll("{{RELATED_POSTS}}", related);
}

function list(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  return [value];
}

function normTitle(value) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

// Casa um título livre de relatedPlanned com um post já publicado.
// Match por igualdade normalizada e, como fallback, por prefixo/contido
// (cobre relatedPlanned encurtado, ex: sem o subtítulo do H1).
function findPublishedByTitle(title, posts) {
  const n = normTitle(title);
  if (!n) return null;
  return (
    posts.find((p) => normTitle(p.title) === n) ||
    posts.find((p) => {
      const pt = normTitle(p.title);
      return pt && (pt.includes(n) || n.includes(pt));
    }) ||
    null
  );
}

function renderRelated(post, posts = []) {
  const planned = list(post.relatedPlanned);
  if (!planned.length) return "";
  return `<section class="post-related" aria-label="Próximas leituras">
        <p class="related-eyebrow">Próximo passo lógico</p>
        <h2>Continue pela decisão que vem depois</h2>
        <div class="related-list">
          ${planned
            .map((item) => {
              const match = findPublishedByTitle(item, posts);
              if (match && match.slug !== post.slug) {
                const takeaway =
                  match.cardTakeaway ||
                  match.heroSummary ||
                  "Continue a trilha para transformar interesse em IA em decisão operacional.";
                return `<article class="is-live">
            <span>Ler guia</span>
            <h3><a href="/blog/${match.slug}/">${esc(match.title)}</a></h3>
            <p>${esc(takeaway)}</p>
          </article>`;
              }
              return `<article>
            <span>Em breve</span>
            <h3>${esc(item)}</h3>
            <p>Esse guia entra na trilha para transformar interesse em IA em decisão operacional.</p>
          </article>`;
            })
            .join("\n")}
        </div>
      </section>`;
}

function renderIndex(posts) {
  const pageTitle = "Blog da Feed: IA aplicada pra PMEs";
  const description =
    "Artigos práticos sobre IA aplicada pra pequenas e médias empresas: custos reais, automação de atendimento, agentes de IA e posicionamento. Sem hype.";
  const canonical = `${SITE}/blog/`;

  const jsonLd = JSON.stringify(
    [
      {
        "@context": "https://schema.org",
        "@type": "Blog",
        "@id": `${canonical}#blog`,
        name: "Blog da Feed",
        description,
        url: canonical,
        inLanguage: "pt-BR",
        publisher: {
          "@type": "Organization",
          name: ORG_NAME,
          url: `${SITE}/`,
          logo: { "@type": "ImageObject", url: ORG_LOGO },
        },
        blogPost: posts.map((p) => ({
          "@type": "BlogPosting",
          headline: p.title,
          url: `${SITE}/blog/${p.slug}/`,
          datePublished: p.date,
        })),
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
          { "@type": "ListItem", position: 2, name: "Blog", item: canonical },
        ],
      },
    ],
    null,
    2
  );

  const cards = posts
    .map(
      (p) => `        <a class="blog-card" href="/blog/${p.slug}/">
          <p class="blog-card-meta">
            <time datetime="${p.date}">${dataHumana(p.date)}</time> · ${p.readingTime} min de leitura
          </p>
          <h2>${esc(p.title)}</h2>
          <p class="blog-card-desc">${esc(p.description)}</p>
          <span class="blog-card-link">Ler artigo →</span>
        </a>`
    )
    .join("\n");

  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="shortcut icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Barlow:wght@300;500;700;800;900&display=swap"
      rel="stylesheet"
    />
    <meta name="robots" content="index, follow" />
    <title>${esc(pageTitle)}</title>
    <meta name="description" content="${esc(description)}" />
    <link rel="canonical" href="${canonical}" />
    <meta name="theme-color" content="#070707" />

    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Feed" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:title" content="${esc(pageTitle)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:image" content="${OG_IMAGE}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(pageTitle)}" />
    <meta name="twitter:description" content="${esc(description)}" />
    <meta name="twitter:image" content="${OG_IMAGE}" />

    <script type="application/ld+json">
${jsonLd}
    </script>

    <style>
      :root {
        --black: #070707;
        --white: #f4f5f0;
        --orange: #ffa300;
      }
      * {
        box-sizing: border-box;
      }
      html {
        background: var(--black);
        scroll-behavior: smooth;
      }
      body {
        margin: 0;
        min-width: 320px;
        color: var(--white);
        background:
          radial-gradient(circle at 15% 0%, rgba(255, 163, 0, 0.09), transparent 22rem),
          var(--black);
        font-family: Barlow, Arial, Helvetica, sans-serif;
        line-height: 1.7;
        -webkit-font-smoothing: antialiased;
      }
      a {
        color: var(--orange);
        text-decoration: none;
      }
      .blog-shell {
        max-width: 720px;
        margin: 0 auto;
        padding: clamp(28px, 5vw, 48px) clamp(20px, 5vw, 40px) 72px;
      }
      .blog-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        margin-bottom: clamp(48px, 8vw, 80px);
      }
      .blog-brand img {
        max-width: 120px;
        height: 26px;
        width: auto;
        display: block;
      }
      .blog-nav {
        font-size: 0.82rem;
        font-weight: 700;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: rgba(244, 245, 240, 0.65);
      }
      .blog-nav:hover {
        color: var(--orange);
        text-decoration: none;
      }
      .blog-eyebrow {
        margin: 0 0 18px;
        color: var(--orange);
        font-size: 0.74rem;
        font-weight: 900;
        letter-spacing: 0.24em;
        text-transform: uppercase;
      }
      h1 {
        margin: 0 0 16px;
        font-size: clamp(1.9rem, 5vw, 2.85rem);
        font-weight: 900;
        line-height: 1.08;
        letter-spacing: -0.015em;
      }
      .blog-intro {
        margin: 0 0 clamp(40px, 7vw, 64px);
        color: rgba(244, 245, 240, 0.72);
        font-size: 1.125rem;
        font-weight: 300;
        max-width: 560px;
      }
      .blog-list {
        display: grid;
        gap: 20px;
      }
      .blog-card {
        display: block;
        padding: clamp(22px, 4vw, 30px);
        border: 1px solid rgba(244, 245, 240, 0.12);
        border-radius: 8px;
        background: rgba(244, 245, 240, 0.02);
        transition: border-color 0.15s ease, background 0.15s ease;
      }
      .blog-card:hover {
        border-color: rgba(255, 163, 0, 0.45);
        background: rgba(255, 163, 0, 0.04);
        text-decoration: none;
      }
      .blog-card-meta {
        margin: 0 0 10px;
        color: rgba(244, 245, 240, 0.5);
        font-size: 0.82rem;
        font-weight: 500;
        letter-spacing: 0.02em;
      }
      .blog-card h2 {
        margin: 0 0 10px;
        color: var(--white);
        font-size: clamp(1.2rem, 2.8vw, 1.45rem);
        font-weight: 800;
        line-height: 1.2;
        letter-spacing: -0.01em;
      }
      .blog-card-desc {
        margin: 0 0 16px;
        color: rgba(244, 245, 240, 0.7);
        font-size: 1rem;
        font-weight: 300;
      }
      .blog-card-link {
        color: var(--orange);
        font-size: 0.88rem;
        font-weight: 800;
        letter-spacing: 0.04em;
        text-transform: uppercase;
      }
      .blog-cta {
        margin-top: clamp(52px, 8vw, 72px);
        padding: clamp(26px, 5vw, 40px);
        border: 1px solid rgba(255, 163, 0, 0.3);
        border-radius: 8px;
        background:
          radial-gradient(circle at 10% 0%, rgba(255, 163, 0, 0.1), transparent 16rem),
          rgba(244, 245, 240, 0.03);
      }
      .blog-cta h2 {
        margin: 0 0 10px;
        font-size: clamp(1.3rem, 3vw, 1.6rem);
        font-weight: 900;
        letter-spacing: -0.01em;
      }
      .blog-cta p {
        margin: 0 0 22px;
        color: rgba(244, 245, 240, 0.78);
        font-size: 1.02rem;
        font-weight: 300;
      }
      .blog-cta-actions {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 16px 24px;
      }
      .btn-diagnostico {
        display: inline-block;
        padding: 14px 28px;
        background: var(--orange);
        color: var(--black);
        font-weight: 800;
        font-size: 0.95rem;
        letter-spacing: 0.03em;
        text-transform: uppercase;
        border-radius: 5px;
        transition: transform 0.15s ease, box-shadow 0.15s ease;
      }
      .btn-diagnostico:hover {
        text-decoration: none;
        transform: translateY(-1px);
        box-shadow: 0 6px 22px rgba(255, 163, 0, 0.25);
      }
      .cta-whats {
        font-size: 0.95rem;
        font-weight: 700;
        color: rgba(244, 245, 240, 0.75);
      }
      .cta-whats:hover {
        color: var(--orange);
        text-decoration: none;
      }
      .blog-foot {
        margin-top: clamp(48px, 8vw, 64px);
        padding-top: 22px;
        border-top: 1px solid rgba(244, 245, 240, 0.1);
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: 10px 20px;
        color: rgba(244, 245, 240, 0.4);
        font-size: 0.78rem;
        line-height: 1.5;
      }
      .blog-foot a {
        color: rgba(244, 245, 240, 0.55);
        font-weight: 700;
      }
      .blog-foot a:hover {
        color: var(--orange);
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <main class="blog-shell">
      <div class="blog-top">
        <a class="blog-brand" href="/" aria-label="Feed, página inicial">
          <img src="/brand/feed-logo-simples-branca.png" alt="Feed" />
        </a>
        <a class="blog-nav" href="/">Voltar ao site</a>
      </div>

      <p class="blog-eyebrow">Blog da Feed</p>
      <h1>IA aplicada pra PMEs, sem hype</h1>
      <p class="blog-intro">
        Custos reais, automação que funciona e posicionamento que faz a empresa ser lembrada.
        Escrito pra dono de negócio, não pra quem já é técnico.
      </p>

      <div class="blog-list">
${cards}
      </div>

      <aside class="blog-cta">
        <h2>Quer saber o que faz sentido pro seu negócio?</h2>
        <p>
          A Feed faz um diagnóstico gratuito da sua operação e da sua presença digital.
          Você sai sabendo onde a IA resolve de verdade, quanto custa e por onde começar.
        </p>
        <div class="blog-cta-actions">
          <a class="btn-diagnostico" href="/#contato">Diagnóstico gratuito</a>
          <a
            class="cta-whats"
            href="https://wa.me/5516993020694"
            target="_blank"
            rel="noopener"
            >Chamar no WhatsApp</a
          >
        </div>
      </aside>

      <div class="blog-foot">
        <p>
          <strong style="color: rgba(244, 245, 240, 0.62); font-weight: 800"
            >FEED MARKETING E COMUNICAÇÃO</strong
          ><br />© 2026 FEED MKT. Todos os direitos reservados.
        </p>
        <p><a href="/">agenciafeed.com</a></p>
      </div>
    </main>
  </body>
</html>
`;
}

function renderEditorialIndex(posts) {
  const pageTitle = "Blog da Feed: IA aplicada pra PMEs";
  const description =
    "Guias práticos sobre IA aplicada pra pequenas e médias empresas: custos reais, automação de atendimento, agentes de IA, operação e decisão de investimento.";
  const canonical = `${SITE}/blog/`;
  const featured = posts.find((p) => String(p.featured) === "true") || posts[0];
  const trackLabels = ["Estou começando", "Quero automatizar atendimento", "Preciso calcular ROI"];

  const jsonLd = JSON.stringify(
    [
      {
        "@context": "https://schema.org",
        "@type": "Blog",
        "@id": `${canonical}#blog`,
        name: "Blog da Feed",
        description,
        url: canonical,
        inLanguage: "pt-BR",
        publisher: {
          "@type": "Organization",
          name: ORG_NAME,
          url: `${SITE}/`,
          logo: { "@type": "ImageObject", url: ORG_LOGO },
        },
        blogPost: posts.map((p) => ({
          "@type": "BlogPosting",
          headline: p.title,
          url: `${SITE}/blog/${p.slug}/`,
          datePublished: p.date,
        })),
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
          { "@type": "ListItem", position: 2, name: "Blog", item: canonical },
        ],
      },
    ],
    null,
    2
  );

  const featuredPromise = list(featured.readingPromise)
    .slice(0, 4)
    .map((item) => `<li>${esc(item)}</li>`)
    .join("");
  const publishedCount = posts.length;
  const issueDate = dataHumana(featured.date);

  const cards = posts
    .map(
      (p, index) => `        <a class="blog-card" href="/blog/${p.slug}/" style="--card-index: ${index}">
          <span class="blog-card-number">${String(index + 1).padStart(2, "0")}</span>
          <div class="blog-card-top">
            <span>${esc(p.contentType || "Guia")}</span>
            <time datetime="${p.date}">${dataHumana(p.date)}</time>
          </div>
          <p class="blog-card-question">${esc(p.readerQuestion || p.keyword || p.category || "Guia prático")}</p>
          <h2>${esc(p.title)}</h2>
          <p class="blog-card-desc">${esc(p.cardTakeaway || p.description)}</p>
          <div class="blog-card-facts">
            ${p.costRange ? `<span>${esc(p.costRange)}</span>` : ""}
            ${p.payback ? `<span>${esc(p.payback)}</span>` : ""}
            <span>${p.readingTime} min</span>
          </div>
          <span class="blog-card-link">Ler guia completo</span>
        </a>`
    )
    .join("\n");

  const tracks = trackLabels
    .map((label) => {
      const match = posts.find((p) => p.stage === label) || (label === "Preciso calcular ROI" ? featured : null);
      if (match) {
        return `<a class="track-item" href="/blog/${match.slug}/">
          <span>${esc(label)}</span>
          <strong>${esc(match.readerQuestion || match.title)}</strong>
          <small>${esc(match.businessOutcome || "Leia o guia recomendado para esse momento.")}</small>
        </a>`;
      }
      return `<div class="track-item is-planned">
          <span>${esc(label)}</span>
          <strong>Guia planejado</strong>
          <small>Esta trilha vai receber conteúdos novos nas próximas publicações.</small>
        </div>`;
    })
    .join("\n");

  const plannedCards = list(featured.relatedPlanned)
    .map(
      (item) => `        <article class="planned-card">
          <span>Em breve</span>
          <h3>${esc(item)}</h3>
          <p>Parte da trilha para sair da curiosidade e decidir onde a IA paga a conta.</p>
        </article>`
    )
    .join("\n");

  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="shortcut icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Barlow:wght@300;500;700;800;900&display=swap"
      rel="stylesheet"
    />
    <meta name="robots" content="index, follow" />
    <title>${esc(pageTitle)}</title>
    <meta name="description" content="${esc(description)}" />
    <link rel="canonical" href="${canonical}" />
    <meta name="theme-color" content="#070707" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Feed" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:title" content="${esc(pageTitle)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:image" content="${OG_IMAGE}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(pageTitle)}" />
    <meta name="twitter:description" content="${esc(description)}" />
    <meta name="twitter:image" content="${OG_IMAGE}" />
    <script type="application/ld+json">
${jsonLd}
    </script>
    <style>
      :root {
        --black: #070707;
        --panel: #10100e;
        --panel-2: #161511;
        --white: #f4f5f0;
        --orange: #ffa300;
        --line: rgba(244, 245, 240, 0.12);
      }
      * { box-sizing: border-box; }
      html { background: var(--black); scroll-behavior: smooth; }
      body {
        margin: 0;
        min-width: 320px;
        color: var(--white);
        background:
          linear-gradient(90deg, rgba(244, 245, 240, 0.035) 1px, transparent 1px),
          linear-gradient(180deg, rgba(244, 245, 240, 0.025) 1px, transparent 1px),
          radial-gradient(circle at 12% 0%, rgba(255, 163, 0, 0.085), transparent 22rem),
          linear-gradient(180deg, rgba(244, 245, 240, 0.035), transparent 36rem),
          var(--black);
        background-size: 88px 88px, 88px 88px, auto, auto;
        font-family: Barlow, Arial, Helvetica, sans-serif;
        line-height: 1.7;
        -webkit-font-smoothing: antialiased;
      }
      a { color: var(--orange); text-decoration: none; }
      .blog-shell {
        max-width: 1120px;
        margin: 0 auto;
        padding: clamp(28px, 5vw, 48px) clamp(20px, 5vw, 40px) 72px;
      }
      .blog-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        margin-bottom: clamp(42px, 7vw, 72px);
      }
      .blog-brand img { max-width: 120px; height: 26px; width: auto; display: block; }
      .blog-nav {
        font-size: 0.82rem;
        font-weight: 700;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: rgba(244, 245, 240, 0.65);
      }
      .blog-nav:hover { color: var(--orange); text-decoration: none; }
      .blog-hero-grid {
        display: grid;
        grid-template-columns: minmax(0, 1.2fr) minmax(300px, 0.8fr);
        gap: clamp(28px, 5vw, 56px);
        align-items: stretch;
        margin-bottom: clamp(24px, 5vw, 42px);
      }
      .blog-eyebrow,
      .featured-kicker,
      .section-kicker {
        margin: 0 0 18px;
        color: var(--orange);
        font-size: 0.74rem;
        font-weight: 900;
        letter-spacing: 0.22em;
        text-transform: uppercase;
      }
      h1 {
        margin: 0 0 16px;
        max-width: 830px;
        font-size: clamp(2.35rem, 7vw, 5.25rem);
        font-weight: 900;
        line-height: 0.95;
        letter-spacing: 0;
      }
      .blog-intro {
        margin: 0;
        max-width: 650px;
        color: rgba(244, 245, 240, 0.72);
        font-size: 1.125rem;
        font-weight: 300;
      }
      .blog-signals {
        display: grid;
        gap: 0;
        align-self: end;
        border-top: 1px solid var(--line);
        border-bottom: 1px solid var(--line);
      }
      .signal {
        padding: 18px 0;
        border-top: 1px solid var(--line);
      }
      .signal:first-child { border-top: 0; }
      .signal span {
        display: block;
        color: var(--orange);
        font-size: 0.74rem;
        font-weight: 900;
        letter-spacing: 0.18em;
        text-transform: uppercase;
      }
      .signal strong {
        display: block;
        margin-top: 5px;
        color: rgba(244, 245, 240, 0.88);
        font-size: clamp(1.05rem, 2vw, 1.35rem);
        line-height: 1.2;
      }
      .issue-strip {
        display: grid;
        grid-template-columns: 1.1fr 0.9fr 0.9fr;
        margin-bottom: clamp(48px, 7vw, 78px);
        border: 1px solid var(--line);
        background: rgba(244, 245, 240, 0.025);
      }
      .issue-strip div {
        min-height: 112px;
        padding: 20px;
        border-right: 1px solid var(--line);
      }
      .issue-strip div:last-child { border-right: 0; }
      .issue-strip span {
        display: block;
        margin-bottom: 18px;
        color: rgba(244, 245, 240, 0.44);
        font-size: 0.72rem;
        font-weight: 900;
        letter-spacing: 0.16em;
        text-transform: uppercase;
      }
      .issue-strip strong {
        display: block;
        color: rgba(244, 245, 240, 0.9);
        font-size: clamp(1.15rem, 2vw, 1.55rem);
        line-height: 1.05;
      }
      .featured {
        position: relative;
        overflow: hidden;
        display: grid;
        grid-template-columns: minmax(0, 1.05fr) minmax(300px, 0.95fr);
        gap: clamp(24px, 5vw, 54px);
        padding: clamp(28px, 5vw, 48px);
        border-top: 1px solid rgba(255, 163, 0, 0.35);
        border-bottom: 1px solid var(--line);
        border-left: 1px solid var(--line);
        border-right: 1px solid var(--line);
        border-radius: 8px;
        background:
          linear-gradient(135deg, rgba(255, 163, 0, 0.06), transparent 34%),
          rgba(244, 245, 240, 0.025);
        margin-bottom: clamp(48px, 7vw, 76px);
      }
      .featured::before {
        content: "";
        position: absolute;
        inset: 0;
        pointer-events: none;
        background: linear-gradient(90deg, transparent, rgba(244, 245, 240, 0.045), transparent);
        transform: translateX(-100%);
        animation: sweep 8s cubic-bezier(0.16, 1, 0.3, 1) infinite;
      }
      .featured h2 {
        margin: 0 0 18px;
        max-width: 760px;
        color: var(--white);
        font-size: clamp(2rem, 5vw, 4rem);
        font-weight: 900;
        line-height: 0.98;
        letter-spacing: 0;
      }
      .featured-summary {
        margin: 0 0 22px;
        max-width: 660px;
        color: rgba(244, 245, 240, 0.76);
        font-size: 1.16rem;
        font-weight: 300;
      }
      .featured-facts,
      .blog-card-facts {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-bottom: 26px;
      }
      .featured-facts span,
      .blog-card-facts span {
        border: 1px solid rgba(244, 245, 240, 0.14);
        border-radius: 999px;
        padding: 7px 11px;
        color: rgba(244, 245, 240, 0.72);
        font-size: 0.82rem;
        font-weight: 700;
      }
      .featured-link {
        display: inline-flex;
        width: fit-content;
        padding: 14px 24px;
        border-radius: 5px;
        background: var(--orange);
        color: var(--black);
        font-size: 0.9rem;
        font-weight: 900;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        transition: transform 0.16s ease, box-shadow 0.16s ease;
      }
      .featured-link:hover {
        text-decoration: none;
        transform: translateY(-1px);
        box-shadow: 0 10px 28px rgba(255, 163, 0, 0.2);
      }
      .featured-aside h3 {
        margin: 0 0 16px;
        color: rgba(244, 245, 240, 0.88);
        font-size: 1.05rem;
        font-weight: 800;
      }
      .featured-aside ul {
        margin: 0;
        padding-left: 18px;
        color: rgba(244, 245, 240, 0.72);
        font-size: 1rem;
        font-weight: 300;
      }
      .featured-aside li { margin-bottom: 10px; }
      .featured-aside li::marker { color: var(--orange); }
      .featured-panel {
        display: grid;
        gap: 18px;
      }
      .featured-aside {
        padding: clamp(20px, 3vw, 28px);
        border: 1px solid rgba(244, 245, 240, 0.12);
        border-radius: 8px;
        background:
          linear-gradient(180deg, rgba(244, 245, 240, 0.045), rgba(244, 245, 240, 0.018)),
          var(--panel);
        box-shadow: inset 0 1px 0 rgba(244, 245, 240, 0.08);
      }
      .field-note {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        border: 1px solid rgba(244, 245, 240, 0.12);
        border-radius: 8px;
        overflow: hidden;
        background: rgba(7, 7, 7, 0.45);
      }
      .field-note div {
        padding: 16px;
        border-right: 1px solid rgba(244, 245, 240, 0.1);
      }
      .field-note div:last-child { border-right: 0; }
      .field-note span {
        display: block;
        margin-bottom: 7px;
        color: rgba(244, 245, 240, 0.43);
        font-size: 0.68rem;
        font-weight: 900;
        letter-spacing: 0.16em;
        text-transform: uppercase;
      }
      .field-note strong {
        color: var(--white);
        font-size: 1.1rem;
        line-height: 1.05;
      }
      .tracks,
      .latest,
      .planned {
        margin-bottom: clamp(48px, 7vw, 76px);
      }
      .tracks-head,
      .latest-head,
      .planned-head {
        display: flex;
        align-items: end;
        justify-content: space-between;
        gap: 24px;
        margin-bottom: 22px;
      }
      .tracks h2,
      .latest h2,
      .planned h2 {
        margin: 0;
        color: var(--white);
        font-size: clamp(1.5rem, 3vw, 2rem);
        font-weight: 900;
        line-height: 1.05;
      }
      .tracks-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        border-top: 1px solid var(--line);
        border-bottom: 1px solid var(--line);
      }
      .track-item {
        min-height: 180px;
        padding: 24px 22px;
        border-right: 1px solid var(--line);
        color: var(--white);
        transition: background 0.16s ease, transform 0.16s ease;
      }
      .track-item:last-child { border-right: 0; }
      .track-item:hover {
        background: rgba(255, 163, 0, 0.045);
        text-decoration: none;
        transform: translateY(-1px);
      }
      .track-item span {
        display: block;
        margin-bottom: 28px;
        color: var(--orange);
        font-size: 0.74rem;
        font-weight: 900;
        letter-spacing: 0.16em;
        text-transform: uppercase;
      }
      .track-item strong {
        display: block;
        margin-bottom: 10px;
        color: rgba(244, 245, 240, 0.9);
        font-size: 1.2rem;
        line-height: 1.16;
      }
      .track-item small {
        display: block;
        color: rgba(244, 245, 240, 0.62);
        font-size: 0.96rem;
        line-height: 1.45;
      }
      .track-item.is-planned { opacity: 0.72; }
      .blog-list,
      .planned-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 18px;
      }
      .blog-card {
        position: relative;
        display: block;
        min-height: 340px;
        padding: clamp(24px, 4vw, 32px);
        border: 1px solid var(--line);
        border-radius: 8px;
        background:
          linear-gradient(180deg, rgba(244, 245, 240, 0.045), rgba(244, 245, 240, 0.015)),
          var(--black);
        transition: border-color 0.15s ease, background 0.15s ease, transform 0.15s ease;
        animation: cardIn 0.45s ease both;
        animation-delay: calc(var(--card-index) * 70ms);
      }
      .blog-card::after {
        content: "";
        position: absolute;
        inset: auto 20px 20px 20px;
        height: 1px;
        background: linear-gradient(90deg, var(--orange), transparent);
        opacity: 0.35;
      }
      .blog-card:hover {
        border-color: rgba(255, 163, 0, 0.45);
        background: rgba(255, 163, 0, 0.04);
        transform: translateY(-2px);
        text-decoration: none;
      }
      .blog-card-number {
        position: absolute;
        top: 22px;
        right: 22px;
        color: rgba(244, 245, 240, 0.18);
        font-size: clamp(2.2rem, 5vw, 3.8rem);
        font-weight: 900;
        line-height: 0.8;
      }
      .blog-card-top {
        display: flex;
        justify-content: flex-start;
        gap: 14px;
        margin: 0 64px 22px 0;
        color: rgba(244, 245, 240, 0.52);
        font-size: 0.78rem;
        font-weight: 800;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      .blog-card-top span { color: var(--orange); }
      .blog-card-question {
        margin: 0 0 12px;
        color: rgba(244, 245, 240, 0.5);
        font-size: 0.92rem;
        font-weight: 700;
      }
      .blog-card h2 {
        margin: 0 0 10px;
        color: var(--white);
        font-size: clamp(1.2rem, 2.8vw, 1.45rem);
        font-weight: 800;
        line-height: 1.2;
        letter-spacing: 0;
      }
      .blog-card-desc {
        margin: 0 0 16px;
        color: rgba(244, 245, 240, 0.7);
        font-size: 1rem;
        font-weight: 300;
      }
      .blog-card-facts { margin-bottom: 18px; }
      .blog-card-link {
        color: var(--orange);
        font-size: 0.88rem;
        font-weight: 800;
        letter-spacing: 0.04em;
        text-transform: uppercase;
      }
      .planned-card {
        padding: 24px;
        border: 1px solid var(--line);
        border-radius: 8px;
        background: rgba(244, 245, 240, 0.018);
      }
      .planned-card span {
        color: var(--orange);
        font-size: 0.72rem;
        font-weight: 900;
        letter-spacing: 0.18em;
        text-transform: uppercase;
      }
      .planned-card h3 {
        margin: 10px 0;
        color: var(--white);
        font-size: 1.3rem;
        line-height: 1.15;
      }
      .planned-card p {
        margin: 0;
        color: rgba(244, 245, 240, 0.62);
        font-weight: 300;
      }
      .blog-cta {
        margin-top: clamp(52px, 8vw, 72px);
        padding: clamp(26px, 5vw, 40px);
        border: 1px solid rgba(255, 163, 0, 0.3);
        border-radius: 8px;
        background:
          radial-gradient(circle at 10% 0%, rgba(255, 163, 0, 0.1), transparent 16rem),
          rgba(244, 245, 240, 0.03);
      }
      .blog-cta h2 {
        margin: 0 0 10px;
        font-size: clamp(1.3rem, 3vw, 1.6rem);
        font-weight: 900;
        letter-spacing: 0;
      }
      .blog-cta p {
        margin: 0 0 22px;
        color: rgba(244, 245, 240, 0.78);
        font-size: 1.02rem;
        font-weight: 300;
      }
      .blog-cta-actions {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 16px 24px;
      }
      .btn-diagnostico {
        display: inline-block;
        padding: 14px 28px;
        background: var(--orange);
        color: var(--black);
        font-weight: 800;
        font-size: 0.95rem;
        letter-spacing: 0.03em;
        text-transform: uppercase;
        border-radius: 5px;
        transition: transform 0.15s ease, box-shadow 0.15s ease;
      }
      .btn-diagnostico:hover {
        text-decoration: none;
        transform: translateY(-1px);
        box-shadow: 0 6px 22px rgba(255, 163, 0, 0.25);
      }
      .cta-whats {
        font-size: 0.95rem;
        font-weight: 700;
        color: rgba(244, 245, 240, 0.75);
      }
      .cta-whats:hover {
        color: var(--orange);
        text-decoration: none;
      }
      .blog-foot {
        margin-top: clamp(48px, 8vw, 64px);
        padding-top: 22px;
        border-top: 1px solid rgba(244, 245, 240, 0.1);
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: 10px 20px;
        color: rgba(244, 245, 240, 0.4);
        font-size: 0.78rem;
        line-height: 1.5;
      }
      .blog-foot a {
        color: rgba(244, 245, 240, 0.55);
        font-weight: 700;
      }
      .blog-foot a:hover {
        color: var(--orange);
        text-decoration: none;
      }
      @keyframes cardIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes sweep {
        0%, 68% { transform: translateX(-100%); opacity: 0; }
        76% { opacity: 1; }
        100% { transform: translateX(100%); opacity: 0; }
      }
      @media (max-width: 820px) {
        .blog-hero-grid,
        .featured,
        .issue-strip,
        .blog-list,
        .planned-grid {
          grid-template-columns: 1fr;
        }
        .issue-strip div {
          min-height: auto;
          border-right: 0;
          border-bottom: 1px solid var(--line);
        }
        .issue-strip div:last-child { border-bottom: 0; }
        .featured {
          padding: 24px 20px;
        }
        .field-note {
          grid-template-columns: 1fr;
        }
        .field-note div {
          border-right: 0;
          border-bottom: 1px solid rgba(244, 245, 240, 0.1);
        }
        .field-note div:last-child { border-bottom: 0; }
        .blog-card {
          min-height: auto;
        }
        .tracks-grid {
          grid-template-columns: 1fr;
        }
        .track-item {
          border-right: 0;
          border-bottom: 1px solid rgba(244, 245, 240, 0.12);
        }
        .track-item:last-child {
          border-bottom: 0;
        }
        .tracks-head,
        .latest-head,
        .planned-head {
          align-items: start;
          flex-direction: column;
        }
      }
    </style>
  </head>
  <body>
    <main class="blog-shell">
      <div class="blog-top">
        <a class="blog-brand" href="/" aria-label="Feed, página inicial">
          <img src="/brand/feed-logo-simples-branca.png" alt="Feed" />
        </a>
        <a class="blog-nav" href="/">Voltar ao site</a>
      </div>

      <section class="blog-hero-grid" aria-label="Introdução do blog">
        <div>
          <p class="blog-eyebrow">Blog da Feed</p>
          <h1>IA aplicada pra pequenas empresas, sem hype</h1>
          <p class="blog-intro">
            Guias práticos sobre automação, atendimento, vendas e operação para empresários que
            querem usar IA com retorno real, não com promessa bonita.
          </p>
        </div>
        <div class="blog-signals" aria-label="Temas principais">
          <div class="signal"><span>Custos reais</span><strong>Quanto pagar, quando pagar e quando não pagar.</strong></div>
          <div class="signal"><span>Operação</span><strong>Onde a IA economiza hora ou recupera venda.</strong></div>
          <div class="signal"><span>Decisão</span><strong>Critérios para começar pequeno e medir retorno.</strong></div>
        </div>
      </section>

      <section class="issue-strip" aria-label="Ritmo editorial">
        <div>
          <span>Edição atual</span>
          <strong>${esc(featured.category || "IA aplicada")}</strong>
        </div>
        <div>
          <span>Biblioteca</span>
          <strong>${publishedCount} guia${publishedCount === 1 ? "" : "s"} publicado${publishedCount === 1 ? "" : "s"}</strong>
        </div>
        <div>
          <span>Próximo bloco</span>
          <strong>terça e quinta, 09h</strong>
        </div>
      </section>

      <section class="featured" aria-label="Artigo em destaque">
        <div>
          <p class="featured-kicker">${esc(featured.cardLabel || "Comece por aqui")}</p>
          <h2>${esc(featured.title)}</h2>
          <p class="featured-summary">${esc(featured.heroSummary || featured.description)}</p>
          <div class="featured-facts">
            ${featured.costRange ? `<span>${esc(featured.costRange)}</span>` : ""}
            ${featured.payback ? `<span>Payback: ${esc(featured.payback)}</span>` : ""}
            <span>${featured.readingTime} min de leitura</span>
          </div>
          <a class="featured-link" href="/blog/${featured.slug}/">Ler guia completo</a>
        </div>
        <div class="featured-panel">
          <div class="field-note" aria-label="Resumo do artigo em destaque">
            <div>
              <span>Publicado</span>
              <strong>${issueDate}</strong>
            </div>
            <div>
              <span>Formato</span>
              <strong>${esc(featured.contentType || "Guia")}</strong>
            </div>
          </div>
          <aside class="featured-aside">
            <h3>Você vai sair sabendo</h3>
            <ul>${featuredPromise}</ul>
          </aside>
        </div>
      </section>

      <section class="tracks" aria-label="Trilhas de leitura">
        <div class="tracks-head">
          <div>
            <p class="section-kicker">Escolha pelo momento</p>
            <h2>Entre pelo problema que você já está tentando resolver.</h2>
          </div>
        </div>
        <div class="tracks-grid">
${tracks}
        </div>
      </section>

      <section class="latest" aria-label="Todos os guias">
        <div class="latest-head">
          <div>
            <p class="section-kicker">Guias publicados</p>
            <h2>Leitura prática para decisão de negócio.</h2>
          </div>
        </div>
        <div class="blog-list">
${cards}
        </div>
      </section>

      ${plannedCards ? `<section class="planned" aria-label="Próximos guias">
        <div class="planned-head">
          <div>
            <p class="section-kicker">Próximas leituras</p>
            <h2>A trilha editorial que vem na sequência.</h2>
          </div>
        </div>
        <div class="planned-grid">
${plannedCards}
        </div>
      </section>` : ""}

      <aside class="blog-cta">
        <h2>Quer saber o que faz sentido pro seu negócio?</h2>
        <p>
          A Feed faz um diagnóstico gratuito da sua operação e da sua presença digital.
          Você sai sabendo onde a IA resolve de verdade, quanto custa e por onde começar.
        </p>
        <div class="blog-cta-actions">
          <a class="btn-diagnostico" href="/#contato">Diagnóstico gratuito</a>
          <a
            class="cta-whats"
            href="https://wa.me/5516993020694"
            target="_blank"
            rel="noopener"
            >Chamar no WhatsApp</a
          >
        </div>
      </aside>

      <div class="blog-foot">
        <p>
          <strong style="color: rgba(244, 245, 240, 0.62); font-weight: 800"
            >FEED MARKETING E COMUNICAÇÃO</strong
          ><br />© 2026 FEED MKT. Todos os direitos reservados.
        </p>
        <p><a href="/">agenciafeed.com</a></p>
      </div>
    </main>
  </body>
</html>
`;
}

function renderSimpleIndex(posts) {
  const pageTitle = "Blog da Feed: IA aplicada pra PMEs";
  const description =
    "Guias práticos sobre IA aplicada para pequenas empresas: custo, atendimento, automação, ROI e operação. Sem hype.";
  const canonical = `${SITE}/blog/`;
  const featured = posts.find((p) => String(p.featured) === "true") || posts[0];

  const jsonLd = JSON.stringify(
    [
      {
        "@context": "https://schema.org",
        "@type": "Blog",
        "@id": `${canonical}#blog`,
        name: "Blog da Feed",
        description,
        url: canonical,
        inLanguage: "pt-BR",
        publisher: {
          "@type": "Organization",
          name: ORG_NAME,
          url: `${SITE}/`,
          logo: { "@type": "ImageObject", url: ORG_LOGO },
        },
        blogPost: posts.map((p) => ({
          "@type": "BlogPosting",
          headline: p.title,
          url: `${SITE}/blog/${p.slug}/`,
          datePublished: p.date,
        })),
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
          { "@type": "ListItem", position: 2, name: "Blog", item: canonical },
        ],
      },
    ],
    null,
    2
  );

  const featuredPromise = list(featured.readingPromise)
    .slice(0, 4)
    .map((item) => `<li>${esc(item)}</li>`)
    .join("");

  const cards = posts
    .map(
      (p) => `        <a class="article-card" href="/blog/${p.slug}/">
          <div class="article-meta">
            <span>${esc(p.contentType || "Guia")}</span>
            <time datetime="${p.date}">${dataHumana(p.date)}</time>
            <span>${p.readingTime} min</span>
          </div>
          <h3>${esc(p.title)}</h3>
          <p>${esc(p.cardTakeaway || p.description)}</p>
        </a>`
    )
    .join("\n");

  const planned = list(featured.relatedPlanned)
    .slice(0, 4)
    .map((item, index) => `<li><span>0${index + 1}</span>${esc(item)}</li>`)
    .join("");

  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="shortcut icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Barlow:wght@300;500;700;800;900&display=swap"
      rel="stylesheet"
    />
    <meta name="robots" content="index, follow" />
    <title>${esc(pageTitle)}</title>
    <meta name="description" content="${esc(description)}" />
    <link rel="canonical" href="${canonical}" />
    <meta name="theme-color" content="#070707" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Feed" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:title" content="${esc(pageTitle)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:image" content="${OG_IMAGE}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(pageTitle)}" />
    <meta name="twitter:description" content="${esc(description)}" />
    <meta name="twitter:image" content="${OG_IMAGE}" />
    <script type="application/ld+json">
${jsonLd}
    </script>
    <style>
      :root {
        --black: #070707;
        --surface: #10100d;
        --surface-strong: #171610;
        --white: #f4f5f0;
        --orange: #ffa300;
        --line: rgba(244, 245, 240, 0.1);
        --muted: rgba(244, 245, 240, 0.68);
      }
      * { box-sizing: border-box; }
      html { background: var(--black); }
      body {
        margin: 0;
        min-width: 320px;
        color: var(--white);
        background:
          radial-gradient(circle at 20% 0%, rgba(255, 163, 0, 0.1), transparent 22rem),
          linear-gradient(180deg, rgba(244, 245, 240, 0.04), transparent 30rem),
          var(--black);
        font-family: Barlow, Arial, Helvetica, sans-serif;
        line-height: 1.7;
        -webkit-font-smoothing: antialiased;
      }
      a { color: inherit; text-decoration: none; }
      .shell {
        max-width: 1180px;
        margin: 0 auto;
        padding: clamp(26px, 4vw, 42px) clamp(20px, 5vw, 44px) 72px;
      }
      .top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        margin-bottom: clamp(42px, 7vw, 78px);
      }
      .brand img { display: block; max-width: 120px; height: 26px; width: auto; }
      .nav {
        color: rgba(244, 245, 240, 0.64);
        font-size: 0.82rem;
        font-weight: 800;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      .nav:hover { color: var(--orange); }
      .hero {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(280px, 390px);
        gap: clamp(28px, 5vw, 64px);
        align-items: center;
        min-height: 520px;
        margin-bottom: 34px;
      }
      .eyebrow {
        margin: 0 0 18px;
        color: var(--orange);
        font-size: 0.74rem;
        font-weight: 900;
        letter-spacing: 0.22em;
        text-transform: uppercase;
      }
      h1 {
        margin: 0 0 20px;
        max-width: 720px;
        font-size: clamp(2.7rem, 6.4vw, 5.35rem);
        font-weight: 900;
        line-height: 0.92;
        letter-spacing: 0;
      }
      .intro {
        margin: 0;
        max-width: 600px;
        color: var(--muted);
        font-size: 1.14rem;
        font-weight: 300;
      }
      .path-card {
        position: relative;
        padding: 28px;
        border: 1px solid rgba(244, 245, 240, 0.11);
        border-radius: 8px;
        background:
          linear-gradient(135deg, rgba(255, 163, 0, 0.12), transparent 36%),
          rgba(16, 16, 13, 0.86);
        box-shadow: 0 24px 70px rgba(0, 0, 0, 0.22);
      }
      .path-card::before {
        content: "";
        position: absolute;
        left: 40px;
        top: 86px;
        bottom: 34px;
        width: 1px;
        background: rgba(255, 163, 0, 0.34);
      }
      .path-title {
        margin: 0 0 22px;
        color: rgba(244, 245, 240, 0.92);
        font-size: 1rem;
        font-weight: 900;
        line-height: 1.2;
      }
      .path-step {
        position: relative;
        display: grid;
        grid-template-columns: 24px minmax(0, 1fr);
        gap: 16px;
        margin-top: 20px;
      }
      .path-step:first-of-type { margin-top: 0; }
      .path-step b {
        position: relative;
        z-index: 1;
        display: grid;
        place-items: center;
        width: 24px;
        height: 24px;
        border-radius: 999px;
        background: var(--orange);
        color: #1a1508;
        font-size: 0.74rem;
        font-weight: 900;
        line-height: 1;
      }
      .path-step span {
        display: block;
        color: var(--orange);
        font-size: 0.68rem;
        font-weight: 900;
        letter-spacing: 0.18em;
        text-transform: uppercase;
      }
      .path-step strong {
        display: block;
        margin-top: 3px;
        color: rgba(244, 245, 240, 0.9);
        font-size: 1.02rem;
        line-height: 1.18;
      }
      .featured {
        position: relative;
        overflow: hidden;
        display: grid;
        grid-template-columns: minmax(0, 1.15fr) minmax(260px, 0.85fr);
        gap: clamp(24px, 5vw, 56px);
        padding: clamp(30px, 5vw, 54px);
        border-radius: 8px;
        background:
          linear-gradient(90deg, rgba(255, 163, 0, 0.18) 0 8px, transparent 8px),
          radial-gradient(circle at 0% 10%, rgba(255, 163, 0, 0.16), transparent 22rem),
          var(--surface);
        margin-bottom: clamp(34px, 6vw, 58px);
      }
      .featured h2 {
        margin: 0 0 18px;
        color: var(--white);
        font-size: clamp(2rem, 4.2vw, 3.65rem);
        font-weight: 900;
        line-height: 1;
      }
      .featured p {
        margin: 0 0 24px;
        color: var(--muted);
        font-size: 1.08rem;
        font-weight: 300;
      }
      .facts {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-bottom: 26px;
      }
      .facts span {
        border: 1px solid rgba(244, 245, 240, 0.14);
        border-radius: 999px;
        padding: 7px 11px;
        color: rgba(244, 245, 240, 0.72);
        font-size: 0.82rem;
        font-weight: 800;
      }
      .button {
        display: inline-flex;
        width: fit-content;
        padding: 14px 24px;
        border-radius: 5px;
        background: var(--orange);
        color: var(--black);
        font-size: 0.9rem;
        font-weight: 900;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        transition: transform 0.16s ease, box-shadow 0.16s ease;
      }
      .button:hover {
        transform: translateY(-1px);
        box-shadow: 0 10px 28px rgba(255, 163, 0, 0.18);
      }
      .button:active { transform: translateY(0); }
      .promise {
        align-self: center;
        padding: 24px;
        border-radius: 8px;
        background: rgba(7, 7, 7, 0.42);
      }
      .promise h3 {
        margin: 0 0 16px;
        color: rgba(244, 245, 240, 0.9);
        font-size: 1.08rem;
        line-height: 1.18;
      }
      .promise ul {
        margin: 0;
        padding-left: 18px;
        color: rgba(244, 245, 240, 0.72);
        font-weight: 300;
      }
      .promise li { margin-bottom: 10px; }
      .promise li::marker { color: var(--orange); }
      .content-grid {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(260px, 340px);
        gap: clamp(26px, 5vw, 54px);
        align-items: start;
      }
      .section-head {
        margin-bottom: 20px;
      }
      .section-head h2 {
        margin: 0;
        font-size: clamp(1.5rem, 3vw, 2rem);
        line-height: 1.08;
      }
      .post-list {
        display: grid;
        gap: 14px;
      }
      .article-card {
        display: grid;
        gap: 14px;
        padding: clamp(22px, 4vw, 30px);
        border: 1px solid rgba(244, 245, 240, 0.1);
        border-radius: 8px;
        background: rgba(244, 245, 240, 0.035);
        transition: transform 0.18s ease, border-color 0.18s ease, background 0.18s ease;
      }
      .article-card:hover {
        transform: translateY(-2px);
        border-color: rgba(255, 163, 0, 0.32);
        background: rgba(244, 245, 240, 0.052);
      }
      .article-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 8px 14px;
        color: rgba(244, 245, 240, 0.48);
        font-size: 0.78rem;
        font-weight: 900;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      .article-meta span:first-child { color: var(--orange); }
      .article-card h3 {
        margin: 0 0 8px;
        color: var(--white);
        font-size: clamp(1.35rem, 3vw, 1.9rem);
        line-height: 1.12;
      }
      .article-card p {
        margin: 0;
        max-width: 680px;
        color: rgba(244, 245, 240, 0.66);
        font-size: 1rem;
        font-weight: 300;
      }
      .up-next {
        position: sticky;
        top: 26px;
        padding: 24px;
        border-radius: 8px;
        background: rgba(16, 16, 13, 0.74);
        border: 1px solid rgba(244, 245, 240, 0.09);
      }
      .up-next ul {
        display: grid;
        gap: 14px;
        list-style: none;
        margin: 0;
        padding: 0;
        color: rgba(244, 245, 240, 0.78);
        font-size: 0.98rem;
        font-weight: 700;
      }
      .up-next li {
        display: grid;
        grid-template-columns: 34px minmax(0, 1fr);
        gap: 12px;
        align-items: start;
      }
      .up-next li span {
        color: var(--orange);
        font-size: 0.75rem;
        font-weight: 900;
        letter-spacing: 0.08em;
      }
      .cta {
        margin-top: clamp(34px, 6vw, 58px);
        padding: clamp(26px, 5vw, 38px);
        border: 1px solid rgba(255, 163, 0, 0.28);
        border-radius: 8px;
        background: linear-gradient(135deg, rgba(255, 163, 0, 0.1), rgba(244, 245, 240, 0.026) 42%);
      }
      .cta h2 {
        margin: 0 0 10px;
        font-size: clamp(1.3rem, 3vw, 1.75rem);
        line-height: 1.1;
      }
      .cta p {
        margin: 0 0 22px;
        max-width: 650px;
        color: rgba(244, 245, 240, 0.76);
        font-weight: 300;
      }
      .cta-actions {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 16px 24px;
      }
      .text-link {
        color: rgba(244, 245, 240, 0.72);
        font-weight: 800;
      }
      .text-link:hover { color: var(--orange); }
      .foot {
        margin-top: clamp(48px, 8vw, 64px);
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: 10px 20px;
        color: rgba(244, 245, 240, 0.4);
        font-size: 0.78rem;
        line-height: 1.5;
      }
      .foot a {
        color: rgba(244, 245, 240, 0.55);
        font-weight: 700;
      }
      .foot a:hover { color: var(--orange); }
      @media (max-width: 820px) {
        .hero,
        .featured,
        .content-grid {
          grid-template-columns: 1fr;
        }
        .hero {
          min-height: 0;
          margin-bottom: 28px;
        }
        h1 {
          font-size: clamp(2.35rem, 12vw, 3.3rem);
        }
        .path-card { padding: 22px; }
        .path-card::before { left: 34px; }
        .featured {
          padding: 26px;
        }
        .featured h2 {
          font-size: clamp(1.78rem, 8vw, 2.35rem);
          line-height: 1.05;
        }
        .article-card:hover {
          transform: none;
        }
        .up-next { position: static; }
      }
    </style>
  </head>
  <body>
    <main class="shell">
      <div class="top">
        <a class="brand" href="/" aria-label="Feed, página inicial">
          <img src="/brand/feed-logo-simples-branca.png" alt="Feed" />
        </a>
        <a class="nav" href="/">Voltar ao site</a>
      </div>

      <section class="hero" aria-label="Introdução do blog">
        <div>
          <p class="eyebrow">Blog da Feed</p>
          <h1>Guias para decidir onde a IA paga a conta.</h1>
          <p class="intro">
            Conteúdo direto para pequenas empresas que querem automatizar atendimento,
            organizar operação e investir em IA sem cair em promessa vazia.
          </p>
        </div>
        <div class="path-card" aria-label="Como usar o blog">
          <p class="path-title">Escolha a leitura pelo problema que você quer resolver agora.</p>
          <div class="path-step"><b>1</b><div><span>Começando</span><strong>Leia o guia principal antes de contratar ferramenta.</strong></div></div>
          <div class="path-step"><b>2</b><div><span>Atendimento travado</span><strong>Priorize WhatsApp, resposta rápida e follow-up.</strong></div></div>
          <div class="path-step"><b>3</b><div><span>Investimento</span><strong>Compare custo, retorno e payback esperado.</strong></div></div>
        </div>
      </section>

      <section class="featured" aria-label="Comece por este guia">
        <div>
          <p class="eyebrow">Comece por este guia</p>
          <h2>${esc(featured.title)}</h2>
          <p>${esc(featured.heroSummary || featured.description)}</p>
          <div class="facts">
            ${featured.costRange ? `<span>${esc(featured.costRange)}</span>` : ""}
            ${featured.payback ? `<span>Payback: ${esc(featured.payback)}</span>` : ""}
            <span>${featured.readingTime} min de leitura</span>
          </div>
          <a class="button" href="/blog/${featured.slug}/">Ler guia completo</a>
        </div>
        <aside class="promise">
          <h3>Depois da leitura, você entende:</h3>
          <ul>${featuredPromise}</ul>
        </aside>
      </section>

      <div class="content-grid">
        <section aria-label="Guias publicados">
          <div class="section-head">
            <p class="eyebrow">Guias publicados</p>
            <h2>Leitura prática para decisão de negócio.</h2>
          </div>
          <div class="post-list">
${cards}
          </div>
        </section>

        ${planned ? `<aside class="up-next" aria-label="Próximos temas">
          <div class="section-head">
            <p class="eyebrow">Próximos temas</p>
            <h2>O blog vai crescer por trilhas.</h2>
          </div>
          <ul>${planned}</ul>
        </aside>` : ""}
      </div>

      <aside class="cta">
        <h2>Quer saber o que faz sentido para sua empresa?</h2>
        <p>
          A Feed faz um diagnóstico gratuito da sua operação e da sua presença digital.
          Você sai sabendo onde a IA resolve de verdade, quanto custa e por onde começar.
        </p>
        <div class="cta-actions">
          <a class="button" href="/#contato">Diagnóstico gratuito</a>
          <a class="text-link" href="https://wa.me/5516993020694" target="_blank" rel="noopener">Chamar no WhatsApp</a>
        </div>
      </aside>

      <div class="foot">
        <p>
          <strong style="color: rgba(244, 245, 240, 0.62); font-weight: 800"
            >FEED MARKETING E COMUNICAÇÃO</strong
          ><br />© 2026 FEED MKT. Todos os direitos reservados.
        </p>
        <p><a href="/">agenciafeed.com</a></p>
      </div>
    </main>
  </body>
</html>
`;
}

function atualizarSitemap(posts) {
  let xml = readFileSync(SITEMAP_PATH, "utf8");

  // Remove qualquer entrada de blog já existente (roda quantas vezes precisar sem duplicar)
  xml = xml.replace(
    /\s*<url>\s*<loc>https:\/\/agenciafeed\.com\/blog[^<]*<\/loc>[\s\S]*?<\/url>/g,
    ""
  );

  const ultimaData = posts.map((p) => p.date).sort().at(-1);

  const entradas = [
    `  <url>
    <loc>${SITE}/blog/</loc>
    <lastmod>${ultimaData}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`,
    ...posts.map(
      (p) => `  <url>
    <loc>${SITE}/blog/${p.slug}/</loc>
    <lastmod>${p.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`
    ),
  ].join("\n");

  xml = xml.replace(/<\/urlset>/, `${entradas}\n</urlset>`);
  writeFileSync(SITEMAP_PATH, xml, "utf8");
}

function main() {
  if (!existsSync(SRC_DIR)) {
    console.error(`Pasta de posts não encontrada: ${SRC_DIR}`);
    process.exit(1);
  }

  const template = readFileSync(TEMPLATE_PATH, "utf8");
  const files = readdirSync(SRC_DIR).filter(
    (f) => f.endsWith(".md") && f.toLowerCase() !== "readme.md" && !f.startsWith("_")
  );

  const posts = [];
  for (const file of files) {
    const raw = readFileSync(join(SRC_DIR, file), "utf8");
    const { meta, body } = parseFrontmatter(raw, file);
    if (meta.status !== "published") {
      const label = meta.status === "scheduled" ? "agendado" : "rascunho";
      console.log(`(${label}, ignorado) ${file}`);
      continue;
    }
    posts.push({
      ...meta,
      html: renderMarkdown(body),
      sections: extractSections(body),
      readingTime: tempoLeitura(body),
      faq: extractFaq(body),
    });
  }

  if (posts.length === 0) {
    console.log("Nenhum post publicado. Nada gerado.");
    return;
  }

  // Mais recente primeiro na listagem
  posts.sort((a, b) => b.date.localeCompare(a.date));

  for (const post of posts) {
    const dir = join(OUT_DIR, post.slug);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "index.html"), renderPost(template, post, posts), "utf8");
    console.log(`gerado: public/blog/${post.slug}/index.html`);
  }

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(join(OUT_DIR, "index.html"), renderSimpleIndex(posts), "utf8");
  console.log("gerado: public/blog/index.html");

  atualizarSitemap(posts);
  console.log("atualizado: public/sitemap.xml");
  console.log(`\n${posts.length} post(s) publicado(s).`);
}

main();
