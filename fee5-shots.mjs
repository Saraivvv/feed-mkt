import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
const OUT = process.argv[2]; mkdirSync(OUT, { recursive: true });
const targets = { barlow: "https://agenciafeed.com/", worksans: "http://localhost:4173/" };
const views = { desktop: { width: 1440, height: 900 }, mobile: { width: 390, height: 844 } };
const b = await chromium.launch();
for (const [name, url] of Object.entries(targets)) for (const [v, viewport] of Object.entries(views)) {
  const p = await b.newPage({ viewport, deviceScaleFactor: 2, isMobile: v === "mobile" });
  await p.goto(url, { waitUntil: "networkidle", timeout: 90000 });
  await p.waitForTimeout(3500);
  const info = await p.evaluate(async () => {
    await document.fonts.ready;
    const h1 = document.querySelector("h1");
    return { body: getComputedStyle(document.body).fontFamily,
      loaded: [...document.fonts].filter(f => f.status === "loaded").map(f => `${f.family} ${f.weight}`),
      h1: h1 && { lines: Math.round(h1.getBoundingClientRect().height / parseFloat(getComputedStyle(h1).lineHeight)), w: h1.getBoundingClientRect().width },
      btn: (() => { const b = document.querySelector(".hero-btn-primary"); return b && { h: b.getBoundingClientRect().height, w: b.getBoundingClientRect().width }; })() };
  });
  // gate FEE-5: botão principal do hero em uma linha só no celular
  if (name === "worksans" && v === "mobile" && info.btn.h > 60) { console.error("FALHA: botão quebrou em 2 linhas", info.btn); process.exitCode = 1; }
  (() => {
  })();
  console.log(name, v, JSON.stringify(info));
  await p.screenshot({ path: `${OUT}/${name}-${v}-hero.png` });
  await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); await p.waitForTimeout(1500);
  await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(800);
  await p.screenshot({ path: `${OUT}/${name}-${v}-full.png`, fullPage: true });
  await p.close();
}
await b.close();
