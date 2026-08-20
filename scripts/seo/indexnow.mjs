#!/usr/bin/env node
// Avisa o IndexNow (Bing, Copilot, Yandex e afins) que URLs do site mudaram.
// Sem isso, um post novo espera o robô passar. Com isso, o rastreio costuma
// acontecer em horas.
//
// Uso:
//   node scripts/seo/indexnow.mjs                 -> envia todas as URLs do sitemap
//   node scripts/seo/indexnow.mjs <url> [<url>]   -> envia só as URLs passadas
//
// A chave fica em public/<chave>.txt, que precisa continuar acessível no site.

import { readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const PUBLIC_DIR = join(ROOT, "public");
const SITE = "https://agenciafeed.com";
const HOST = "agenciafeed.com";
const ENDPOINT = "https://api.indexnow.org/indexnow";

// A chave é o nome do arquivo .txt de 32 caracteres hexadecimais em public/.
function lerChave() {
  const arquivo = readdirSync(PUBLIC_DIR).find((f) => /^[0-9a-f]{32}\.txt$/.test(f));
  if (!arquivo) throw new Error("Chave do IndexNow não encontrada em public/. Esperado public/<32 hex>.txt");
  const chave = arquivo.replace(/\.txt$/, "");
  const conteudo = readFileSync(join(PUBLIC_DIR, arquivo), "utf8").trim();
  if (conteudo !== chave) throw new Error(`public/${arquivo} precisa conter exatamente a chave ${chave}`);
  return chave;
}

function urlsDoSitemap() {
  const xml = readFileSync(join(PUBLIC_DIR, "sitemap.xml"), "utf8");
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

async function main() {
  const chave = lerChave();
  const urls = process.argv.slice(2).length ? process.argv.slice(2) : urlsDoSitemap();

  const foraDoSite = urls.filter((u) => !u.startsWith(`${SITE}/`) && u !== `${SITE}/`);
  if (foraDoSite.length) throw new Error(`URL de outro domínio na lista: ${foraDoSite.join(", ")}`);

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: HOST,
      key: chave,
      keyLocation: `${SITE}/${chave}.txt`,
      urlList: urls,
    }),
  });

  // 200 e 202 são sucesso. 422 costuma ser chave que o buscador ainda não leu.
  console.log(`IndexNow respondeu ${res.status} para ${urls.length} URL(s).`);
  if (!res.ok) {
    console.error(await res.text());
    process.exit(1);
  }
}

main().catch((erro) => {
  console.error(erro.message);
  process.exit(1);
});
