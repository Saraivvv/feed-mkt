// Executar da raiz: node conceitos/verificar-tuie.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require(require.resolve('playwright', {
  paths: [path.resolve(__dirname, '..'), path.resolve(__dirname, '../../../../../hub/app')]
}));
const site = path.join(__dirname, 'd-site-feed');
const chat = path.join(__dirname, 'f-diagnostico-chat');
const saida = path.join(site, 'capturas/tuie');
const aparelhos = [[390, 844, true], [768, 1024, true], [1024, 768, true], [1440, 980, false]];

(async () => {
  fs.mkdirSync(saida, { recursive: true });
  const original = fs.readFileSync(path.join(__dirname, 'g-persona/assets/tuie-car-a-40.webp'));
  for (const pasta of [site, chat]) {
    assert.deepEqual(fs.readFileSync(path.join(pasta, 'assets/tuie-40.webp')), original, 'Usar o Atento aprovado, sem alterar o desenho');
  }
  const browser = await chromium.launch({ headless: true });
  try {
    for (const [width, height, toque] of aparelhos) {
      const page = await browser.newPage({ viewport: { width, height }, hasTouch: toque, isMobile: toque, reducedMotion: 'reduce' });
      const erros = [];
      page.on('pageerror', e => erros.push(e.message));
      await page.goto(pathToFileURL(path.join(site, 'index.html')).href);
      await page.evaluate(() => document.fonts.ready);
      const convite = page.locator('.d-di');
      assert.match(await convite.textContent(), /Fale com o Tuiê/);
      for (const destino of ['#marca', '#hub', 'footer.rodape']) {
        await page.locator(destino).scrollIntoViewIfNeeded();
        await page.waitForFunction(() => document.querySelector('.doca').classList.contains('on'));
        const medidas = await convite.evaluate(el => {
          const r = el.getBoundingClientRect();
          const img = el.querySelector('img');
          return {
            largura: r.width, altura: r.height,
            dentro: r.left >= 0 && r.right <= innerWidth && r.top >= 0 && r.bottom <= innerHeight,
            livre: el.contains(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2)),
            imagem: img.complete && img.naturalWidth > 0,
            papel: getComputedStyle(el).backgroundColor,
            estouro: document.documentElement.scrollWidth > innerWidth
          };
        });
        assert.ok(medidas.dentro && medidas.livre && medidas.imagem && !medidas.estouro, JSON.stringify({ width, destino, medidas }));
        assert.ok(medidas.largura >= 44 && medidas.altura >= 44);
        assert.equal(medidas.papel, 'rgb(255, 163, 0)', 'Captura deve ter CSS');
      }
      await page.screenshot({ path: path.join(saida, `site-${width}.png`) });
      const indice = page.locator('.d-indice');
      if (await indice.isVisible()) {
        await indice.click();
        await page.locator('#folha a[href="#hub"]').click();
        await page.waitForFunction(() => !document.documentElement.classList.contains('folha-aberta'));
      }
      await convite.click();
      await page.waitForURL(pathToFileURL(path.join(chat, 'index.html')).href);
      await page.locator('#comecar').click();
      await page.locator('[data-opcao="0"]').waitFor();
      assert.equal(await page.locator('[data-nome]').innerText(), 'Tuiê');
      assert.equal(await page.locator('.identidade .avatar').evaluate(im => im.complete && im.naturalWidth > 0), true);
      assert.equal(await page.locator('body').innerText().then(t => t.includes('Config AI')), false);
      await page.locator('[data-opcao="0"]').click();
      await page.locator('#enviar').click();
      await page.waitForFunction(() => document.querySelector('[data-etapa="1"]') && document.querySelector('#resposta .cartao-topo')?.textContent.includes('02 / 08'));
      assert.equal(await page.locator('.bolha[data-editar="0"]').count(), 1);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      assert.deepEqual(erros, []);
      console.log(`${width}x${height}: Atento original, balão acessível, índice e conversa OK`);
      await page.close();
    }
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
