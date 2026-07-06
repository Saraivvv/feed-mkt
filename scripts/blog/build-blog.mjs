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
  return JSON.stringify(
    [
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
    ],
    null,
    2
  );
}

function renderPost(template, post) {
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
  const related = renderRelated(post);
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

function renderRelated(post) {
  const planned = list(post.relatedPlanned);
  if (!planned.length) return "";
  return `<section class="post-related" aria-label="Próximas leituras">
        <p class="related-eyebrow">Próximo passo lógico</p>
        <h2>Continue pela decisão que vem depois</h2>
        <div class="related-list">
          ${planned
            .map(
              (item) => `<article>
            <span>Em breve</span>
            <h3>${esc(item)}</h3>
            <p>Esse guia entra na trilha para transformar interesse em IA em decisão operacional.</p>
          </article>`
            )
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

  const cards = posts
    .map(
      (p, index) => `        <a class="blog-card" href="/blog/${p.slug}/" style="--card-index: ${index}">
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
        --white: #f4f5f0;
        --orange: #ffa300;
      }
      * { box-sizing: border-box; }
      html { background: var(--black); scroll-behavior: smooth; }
      body {
        margin: 0;
        min-width: 320px;
        color: var(--white);
        background:
          radial-gradient(circle at 15% 0%, rgba(255, 163, 0, 0.09), transparent 22rem),
          linear-gradient(180deg, rgba(244, 245, 240, 0.03), transparent 36rem),
          var(--black);
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
        margin-bottom: clamp(48px, 8vw, 80px);
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
        grid-template-columns: minmax(0, 1.15fr) minmax(280px, 0.85fr);
        gap: clamp(28px, 5vw, 56px);
        align-items: end;
        margin-bottom: clamp(48px, 8vw, 82px);
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
        font-size: clamp(2.45rem, 7vw, 5.55rem);
        font-weight: 900;
        line-height: 0.92;
        letter-spacing: 0;
      }
      .blog-intro {
        margin: 0;
        max-width: 650px;
        color: rgba(244, 245, 240, 0.72);
        font-size: 1.125rem;
        font-weight: 300;
      }
      .blog-signals { display: grid; gap: 12px; }
      .signal {
        padding: 16px 0;
        border-top: 1px solid rgba(244, 245, 240, 0.12);
      }
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
      .featured {
        display: grid;
        grid-template-columns: minmax(0, 1.2fr) minmax(270px, 0.8fr);
        gap: clamp(24px, 5vw, 48px);
        padding: clamp(24px, 5vw, 44px) 0;
        border-top: 1px solid rgba(255, 163, 0, 0.35);
        border-bottom: 1px solid rgba(244, 245, 240, 0.12);
        margin-bottom: clamp(48px, 7vw, 76px);
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
        border-top: 1px solid rgba(244, 245, 240, 0.12);
        border-bottom: 1px solid rgba(244, 245, 240, 0.12);
      }
      .track-item {
        min-height: 180px;
        padding: 24px 22px;
        border-right: 1px solid rgba(244, 245, 240, 0.12);
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
        display: block;
        padding: clamp(22px, 4vw, 30px);
        border: 1px solid rgba(244, 245, 240, 0.12);
        border-radius: 8px;
        background: rgba(244, 245, 240, 0.02);
        transition: border-color 0.15s ease, background 0.15s ease, transform 0.15s ease;
        animation: cardIn 0.45s ease both;
        animation-delay: calc(var(--card-index) * 70ms);
      }
      .blog-card:hover {
        border-color: rgba(255, 163, 0, 0.45);
        background: rgba(255, 163, 0, 0.04);
        transform: translateY(-2px);
        text-decoration: none;
      }
      .blog-card-top {
        display: flex;
        justify-content: space-between;
        gap: 14px;
        margin-bottom: 18px;
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
        padding: 24px 0;
        border-top: 1px solid rgba(244, 245, 240, 0.12);
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
      @media (max-width: 820px) {
        .blog-hero-grid,
        .featured,
        .blog-list,
        .planned-grid {
          grid-template-columns: 1fr;
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
        <aside class="featured-aside">
          <h3>Você vai sair sabendo</h3>
          <ul>${featuredPromise}</ul>
        </aside>
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
      console.log(`(rascunho, ignorado) ${file}`);
      continue;
    }
    posts.push({
      ...meta,
      html: renderMarkdown(body),
      sections: extractSections(body),
      readingTime: tempoLeitura(body),
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
    writeFileSync(join(dir, "index.html"), renderPost(template, post), "utf8");
    console.log(`gerado: public/blog/${post.slug}/index.html`);
  }

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(join(OUT_DIR, "index.html"), renderEditorialIndex(posts), "utf8");
  console.log("gerado: public/blog/index.html");

  atualizarSitemap(posts);
  console.log("atualizado: public/sitemap.xml");
  console.log(`\n${posts.length} post(s) publicado(s).`);
}

main();
