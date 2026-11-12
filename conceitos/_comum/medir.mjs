// Mede um conceito: node conceitos/_comum/medir.mjs a-filme
// Gera conceitos/<pasta>/capturas/ (página inteira em 390, 768 e 1440 + quadros do celular
// a cada 0,75 tela de rolagem) e imprime estouro horizontal, alvos de toque < 44px,
// imagens quebradas e erros de console. Sai com código 1 se achar algo.
import { createRequire } from 'module';
import { mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const require = createRequire('C:/Users/guisa/OneDrive/Desktop/Feed MKT/hub/app/package.json');
const { chromium } = require('playwright');
const pasta = process.argv[2];
if (!pasta) { console.error('uso: node medir.mjs <pasta-do-conceito>'); process.exit(2); }
const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..', pasta);
const saida = resolve(raiz, 'capturas');
mkdirSync(saida, { recursive: true });
const url = pathToFileURL(resolve(raiz, 'index.html')).href;

const b = await chromium.launch({ executablePath: 'C:/Users/guisa/AppData/Local/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-win64/chrome-headless-shell.exe' });
let achados = 0;
for (const [nome, w, h, toque] of [['celular', 390, 844, true], ['tablet', 768, 1024, true], ['desktop', 1440, 900, false]]) {
  const p = await b.newPage({ viewport: { width: w, height: h }, isMobile: toque, hasTouch: toque, deviceScaleFactor: toque ? 2 : 1 });
  const erros = [];
  p.on('pageerror', e => erros.push(e.message));
  p.on('console', m => m.type() === 'error' && erros.push(m.text()));
  await p.goto(url, { waitUntil: 'networkidle' });
  await p.waitForTimeout(1200);
  const alto = await p.evaluate(() => document.documentElement.scrollHeight);
  let i = 0;
  for (let y = 0; y < alto; y += Math.round(h * 0.75)) {
    await p.evaluate(y => window.scrollTo(0, y), y);
    await p.waitForTimeout(450);
    if (nome === 'celular') await p.screenshot({ path: `${saida}/celular-quadro-${String(i++).padStart(2, '0')}.png` });
  }
  const r = await p.evaluate((toque) => {
    const vw = innerWidth;
    const rolaX = el => { for (let e = el.parentElement; e; e = e.parentElement) { const o = getComputedStyle(e).overflowX; if (o === 'auto' || o === 'scroll' || o === 'hidden' || o === 'clip') return true; } return false; };
    const visivel = el => { const s = getComputedStyle(el); const b = el.getBoundingClientRect(); return s.visibility !== 'hidden' && s.display !== 'none' && +s.opacity > 0 && b.width > 0 && b.height > 0; };
    const estouro = [...document.querySelectorAll('body *')].filter(el => visivel(el) && el.getBoundingClientRect().right > vw + 1 && !rolaX(el)).slice(0, 8).map(el => el.tagName + '.' + el.className);
    const pequenos = toque ? [...document.querySelectorAll('a,button,[role=button],input,select,summary')].filter(el => visivel(el) && !(el.tagName === 'A' && getComputedStyle(el).display === 'inline')).filter(el => { const b = el.getBoundingClientRect(); return b.height < 44 || b.width < 44; }).slice(0, 10).map(el => `${el.tagName} "${(el.innerText || el.getAttribute('aria-label') || '').trim().slice(0, 30)}" ${Math.round(el.getBoundingClientRect().width)}x${Math.round(el.getBoundingClientRect().height)}`) : [];
    const quebradas = [...document.images].filter(im => im.complete && im.naturalWidth === 0).map(im => im.getAttribute('src'));
    return { paginaMaisLarga: document.documentElement.scrollWidth > vw, estouro, pequenos, quebradas };
  }, toque);
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.waitForTimeout(400);
  await p.screenshot({ path: `${saida}/${nome}-inteira.png`, fullPage: true });
  const n = (r.paginaMaisLarga ? 1 : 0) + r.estouro.length + r.pequenos.length + r.quebradas.length + erros.length;
  achados += n;
  console.log(`${nome} ${w}x${h}: altura ${alto}px, ${n} achado(s)`, JSON.stringify({ ...r, erros }, null, 1));
  await p.close();
}
await b.close();
console.log(achados ? `TOTAL ${achados} achado(s)` : 'TOTAL 0 achados');
process.exit(achados ? 1 : 0);
