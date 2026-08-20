// Renderiza cada .peca de um HTML em PNG, no tamanho pedido.
// Serve para peça estática avulsa (post do Google Meu Negócio, capa, banner),
// diferente do carrossel, que tem seu próprio renderizador e vira PDF.
//
// Uso:  node scripts/render-cards.mjs <arquivo.html> [--size 1200x900] [--out png]
//   ex: node scripts/render-cards.mjs marketing/conteudo/gmb-2026-08/cards.html
// Seletor padrao .peca (nao use .card: base.css ja tem um componente com esse nome).
//
// Injeta identidade/carrossel/base.css e defs.html quando o HTML marca
// <html data-carrossel="v2">, igual ao render-carrossel.mjs.

import { chromium } from "playwright";
import { fileURLToPath, pathToFileURL } from "node:url";
import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";

const args = process.argv.slice(2);
const htmlArg = args.find((a) => !a.startsWith("--"));
if (!htmlArg) {
  console.error("uso: node scripts/render-cards.mjs <arquivo.html> [--size 1200x900] [--out png] [--sel .peca]");
  process.exit(1);
}

const sizeArg = args.includes("--size") ? args[args.indexOf("--size") + 1] : "1200x900";
const [W, H] = sizeArg.split("x").map(Number);
const outName = args.includes("--out") ? args[args.indexOf("--out") + 1] : "png";
const sel = args.includes("--sel") ? args[args.indexOf("--sel") + 1] : ".peca";

const htmlPath = path.resolve(htmlArg);
const outDir = path.join(path.dirname(htmlPath), outName);
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "networkidle" });

const isV2 = await page.evaluate(() => document.documentElement.dataset.carrossel === "v2");
if (isV2) {
  const libDir = fileURLToPath(new URL("../identidade/carrossel/", import.meta.url));
  await page.addStyleTag({ content: await readFile(path.join(libDir, "base.css"), "utf8") });
  const defs = await readFile(path.join(libDir, "defs.html"), "utf8");
  await page.evaluate((html) => document.body.insertAdjacentHTML("afterbegin", html), defs);
}

await page.evaluate(() => document.fonts.ready);

const cards = await page.$$(sel);
if (!cards.length) {
  console.error(`nenhum ${sel} encontrado em`, htmlPath);
  await browser.close();
  process.exit(1);
}

let i = 0;
for (const card of cards) {
  i += 1;
  const nome = (await card.getAttribute("data-nome")) || String(i).padStart(2, "0");
  const file = path.join(outDir, `${nome}.png`);
  await card.screenshot({ path: file });
  console.log("ok", path.relative(process.cwd(), file));
}

await browser.close();
console.log(`\n${i} imagem(ns) em ${path.relative(process.cwd(), outDir)} (${W}x${H} @2x)`);
