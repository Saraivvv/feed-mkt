const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { createRequire } = require('node:module');
const { chromium } = createRequire('C:/Users/guisa/OneDrive/Desktop/Feed MKT/hub/app/package.json')('playwright');

(async () => {
  const saida = path.join(__dirname, 'capturas/tuie');
  fs.mkdirSync(saida, { recursive: true });
  const browser = await chromium.launch({ executablePath: 'C:/Users/guisa/AppData/Local/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-win64/chrome-headless-shell.exe' });
  const relatorio = [];
  try {
    for (const [width, height, touch] of [[390, 844, true], [768, 1024, true], [1024, 768, true], [1440, 980, false]]) {
      const page = await browser.newPage({ viewport: { width, height }, isMobile: touch, hasTouch: touch, reducedMotion: 'reduce' });
      const erros = [], requests = [];
      page.on('pageerror', e => erros.push(e.message));
      page.on('request', r => { if (/^https?:/.test(r.url())) requests.push(r.url()); });
      await page.goto(pathToFileURL(path.join(__dirname, 'index.html')).href);
      await page.locator('#comecar').waitFor();
      assert.equal(await page.locator('[data-nome]').textContent(), 'Tuiê');
      assert.equal(await page.locator('.identidade span').textContent(), 'Assistente de IA da Feed');
      assert.match(await page.locator('.fala').first().textContent(), /sou o Tuiê/);
      assert.doesNotMatch(await page.locator('body').innerText(), /Config AI/);
      const medir = async () => {
        const medidas = await page.evaluate(() => ({
          overflow: document.documentElement.scrollWidth > innerWidth,
          imagens: [...document.images].filter(im => !im.complete || !im.naturalWidth).map(im => im.src),
          cabecalho: [...document.querySelectorAll('.topo > *, .identidade > *')].some(el => { const b = el.getBoundingClientRect(); return b.left < 0 || b.right > innerWidth || b.top < 0 || b.bottom > document.querySelector('.topo').getBoundingClientRect().bottom; })
        }));
        assert.deepEqual(medidas, { overflow: false, imagens: [], cabecalho: false });
      };
      const alcancavel = async seletor => {
        const medido = await page.locator(seletor).evaluate(el => {
          const b = el.getBoundingClientRect(), top = document.elementFromPoint(b.x + b.width / 2, b.y + b.height / 2);
          return { w: b.width, h: b.height, visivel: b.top >= 0 && b.bottom <= innerHeight && (top === el || el.contains(top)) };
        });
        assert(medido.visivel, `${width}: ${seletor} coberto ou fora da tela`);
        if (touch) assert(medido.w >= 44 && medido.h >= 44, `${width}: ${seletor} menor que 44px`);
      };
      await medir(); await alcancavel('#comecar');
      await page.screenshot({ path: path.join(saida, `${width}-abertura.png`) });
      await page.locator('#comecar').click();
      for (let i = 0; i < 8; i++) {
        await page.waitForFunction(n => document.querySelector('.cartao-topo > span:last-child')?.textContent === `${String(n + 1).padStart(2, '0')} / 08` && !document.querySelector('#enviar')?.closest('.preparando'), i);
        await page.locator('[data-opcao="0"]').click();
        await alcancavel('#enviar'); await medir();
        if (!i) await page.screenshot({ path: path.join(saida, `${width}-pergunta.png`) });
        await page.locator('#enviar').click();
      }
      await page.locator('[data-contato]').waitFor();
      await medir();
      await page.locator('[data-contato]').click();
      await page.locator('#contato').waitFor();
      assert.equal(await page.locator('.autor .marca').count(), await page.locator('.autor').count());
      await alcancavel('#contato button[type="submit"]'); await medir();
      await page.screenshot({ path: path.join(saida, `${width}-contato.png`) });
      assert.deepEqual(erros, []); assert.deepEqual(requests, []);
      relatorio.push({ width, height, touch, perguntas: 8, avatarAutores: true, contato: true, erros, requests });
      await page.close();
    }
    fs.writeFileSync(path.join(saida, 'verificacao.json'), JSON.stringify(relatorio, null, 2) + '\n');
    console.log('Tuiê: 4 aparelhos, 8 perguntas por aparelho, contato alcançável, 0 imagens quebradas, 0 estouro, 0 erros, 0 chamadas HTTP.');
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
