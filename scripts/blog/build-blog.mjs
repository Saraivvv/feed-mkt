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
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    meta[key] = value;
  }
  for (const req of ["title", "slug", "description", "date", "status"]) {
    if (!meta[req]) throw new Error(`Campo "${req}" ausente no frontmatter de ${file}`);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(meta.date)) {
    throw new Error(`Data inválida em ${file}: use YYYY-MM-DD`);
  }
  return { meta, body: raw.slice(match[0].length) };
}

function tempoLeitura(markdown) {
  const palavras = markdown.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(palavras / 200));
}

function renderMarkdown(md) {
  let html = marked.parse(md);
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
    .replaceAll("{{POST_CONTENT}}", post.html);
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
  const files = readdirSync(SRC_DIR).filter((f) => f.endsWith(".md"));

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
  writeFileSync(join(OUT_DIR, "index.html"), renderIndex(posts), "utf8");
  console.log("gerado: public/blog/index.html");

  atualizarSitemap(posts);
  console.log("atualizado: public/sitemap.xml");
  console.log(`\n${posts.length} post(s) publicado(s).`);
}

main();
