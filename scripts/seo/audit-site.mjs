// Auditoria do site publicado: status, canonical, title, description, schema e links internos.
const SITE = "https://agenciafeed.com";

const sitemap = await (await fetch(`${SITE}/sitemap.xml`)).text();
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

const problemas = [];
const linksInternos = new Set();
const linhas = [];

const RE_DESC = /<meta\s+name="description"\s+content="([^"]*)"/s;
const RE_CANON = /<link\s+rel="canonical"\s+href="([^"]*)"/s;

for (const url of urls) {
  const res = await fetch(url);
  const html = res.ok ? await res.text() : "";
  const title = /<title>([^<]*)<\/title>/.exec(html)?.[1] ?? "";
  const desc = RE_DESC.exec(html)?.[1] ?? "";
  const canonical = RE_CANON.exec(html)?.[1] ?? "";
  const temArticle = /"@type":\s*"(Article|BlogPosting)"/.test(html);
  const temFaq = /"@type":\s*"FAQPage"/.test(html);

  if (!res.ok) problemas.push(`${url} respondeu ${res.status}`);
  if (!title) problemas.push(`${url} sem title`);
  if (title.length > 62) problemas.push(`${url} title com ${title.length} chars`);
  if (!desc) problemas.push(`${url} sem description`);
  if (desc.length > 168) problemas.push(`${url} description com ${desc.length} chars`);
  if (!canonical) problemas.push(`${url} sem canonical`);
  else if (canonical.replace(/\/$/, "") !== url.replace(/\/$/, ""))
    problemas.push(`${url} canonical aponta ${canonical}`);

  for (const m of html.matchAll(/href="(\/[^"#?]*)"/g)) linksInternos.add(m[1]);

  linhas.push(
    `${url.replace(SITE, "").padEnd(52)} ${res.status} t:${String(title.length).padStart(2)} d:${String(desc.length).padStart(3)} ${temArticle ? "art" : "   "} ${temFaq ? "faq" : "   "}`
  );
}

const quebrados = [];
for (const href of [...linksInternos].sort()) {
  if (/\.(png|jpg|svg|css|js|pdf|txt|xml|webp|ico)$/.test(href)) continue;
  const res = await fetch(SITE + href, { method: "HEAD" });
  if (!res.ok) quebrados.push(`${href} -> ${res.status}`);
}

console.log(linhas.join("\n"));
console.log(`\nURLs auditadas: ${urls.length}`);
console.log(`links internos distintos: ${linksInternos.size}`);
console.log(`links quebrados: ${quebrados.length}${quebrados.length ? "\n  " + quebrados.join("\n  ") : ""}`);
console.log(`problemas: ${problemas.length}${problemas.length ? "\n  " + problemas.join("\n  ") : ""}`);
