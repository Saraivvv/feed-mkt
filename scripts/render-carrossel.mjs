// Renderiza um carrossel.html em PNGs 1080x1350 (4:5), um por .slide.
// Uso:  node scripts/render-carrossel.mjs <pasta-do-carrossel> [--out instagram]
//   ex: node scripts/render-carrossel.mjs marketing/conteudo/carrossel-reposicionamento-2026-06-03
//
// Cada <div class="slide"> vira instagram/slide-01.png, slide-02.png, ...
// O HTML deve ter slides de 1080x1350 (o script força esse viewport por slide).

import { chromium } from 'playwright';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const W = 1080;
const H = 1350;

const args = process.argv.slice(2);
const folder = args.find((a) => !a.startsWith('--'));
const outIdx = args.indexOf('--out');
const outDir = outIdx !== -1 ? args[outIdx + 1] : 'instagram';

if (!folder) {
  console.error('Faltou a pasta. Ex: node scripts/render-carrossel.mjs marketing/conteudo/<pasta>');
  process.exit(1);
}

const absFolder = path.resolve(folder);
const htmlPath = path.join(absFolder, 'carrossel.html');
const outPath = path.join(absFolder, outDir);
await mkdir(outPath, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'networkidle' });
// garante que as fontes do Google carregaram antes do screenshot
await page.evaluate(() => document.fonts.ready);

const slides = await page.$$('.slide');
if (slides.length === 0) {
  console.error('Nenhum elemento .slide encontrado em', htmlPath);
  await browser.close();
  process.exit(1);
}

let i = 0;
for (const slide of slides) {
  i += 1;
  const file = path.join(outPath, `slide-${String(i).padStart(2, '0')}.png`);
  await slide.screenshot({ path: file });
  console.log('ok', path.relative(absFolder, file));
}

await browser.close();
console.log(`\n${i} slides renderizados em ${path.relative(process.cwd(), outPath)}`);
