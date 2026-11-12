// Gera as texturas de tela do aparelho 3D: node conceitos/d-site-feed/gera-telas-3d.mjs
// 1) as telas reais do Hub (conceitos/_comum/hub/tela-*.png, 1080x2313) ganham a barra de status e viram webp de 1080x2430;
// 2) as telas que são HTML na página (o anúncio no Instagram e a conversa do Agente) são fotografadas
//    do próprio index.html, na proporção da tela do aparelho 3D, e viram webp.
// No fim imprime as medidas que o assets/fone-3d.js usa (FEED_TOPO e CHAT). Mudou o texto de uma
// dessas telas no HTML? Rode de novo e confira se os números impressos batem com os do fone-3d.js.
import { createRequire } from 'module';
import { dirname, resolve } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const require = createRequire('C:/Users/guisa/OneDrive/Desktop/Feed MKT/hub/app/package.json');
const { chromium } = require('playwright');
const sharp = require('sharp');
const aqui = dirname(fileURLToPath(import.meta.url));
const L = 360, DSF = 3, A = 810; // 1080 x 2430 (4:9): a barra de status (11% da largura) e, embaixo, a tela do Hub (1080 x 2313)
const HORA = '18:32'; // a hora da barra de status das telas do Hub (a última mensagem do Atendimento é das 18:31)
const webp = (buf, nome, q = 82) => sharp(buf).webp({ quality: q, effort: 6 }).toFile(resolve(aqui, 'assets', nome)).then(i => console.log(nome, i.width + 'x' + i.height, Math.round(i.size / 1024) + ' KB'));

const b = await chromium.launch({ executablePath: 'C:/Users/guisa/AppData/Local/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-win64/chrome-headless-shell.exe' });
const p = await b.newPage({ viewport: { width: L, height: 2400 }, deviceScaleFactor: DSF });
await p.goto(pathToFileURL(resolve(aqui, 'index.html')).href, { waitUntil: 'networkidle' });
await p.evaluate(() => document.fonts.ready);
const foto = (nome, alto = A) => p.screenshot({ clip: { x: 0, y: 0, width: L, height: alto } }).then(buf => webp(buf, nome));
// solta a tela do aparelho (ou monta uma nova, com o HTML dado) e prende no canto, do tamanho da tela 3D
const solta = (sel, html) => p.evaluate(([sel, html, L, A]) => {
  document.querySelectorAll('.f3d-foto').forEach(e => e.remove());
  const t = sel ? document.querySelector(sel).cloneNode(true) : document.createElement('div');
  if (html) t.innerHTML = html;
  t.className = 'tela f3d-foto';
  t.style.cssText = `position:fixed;left:0;top:0;width:${L}px;height:${A}px;border-radius:0;z-index:99999;opacity:1;overflow:visible;background:#fff`;
  t.querySelectorAll('.reflexo,img[data-em]').forEach(e => e.remove());
  document.body.append(t);
  return Promise.all([...t.querySelectorAll('img')].map(i => i.decode()));
}, [sel, html, L, A]);

// as telas do Hub não trazem barra de status: ela entra aqui, na cor do topo de cada tela, para a câmera frontal não cair em cima do cabeçalho do app
for (const [de, para] of [['tela-02-inicio', 'tela-inicio'], ['tela-03-atendimento', 'tela-atendimento'], ['tela-04-funil', 'tela-funil'], ['tela-05-aprovar', 'tela-aprovar']]) {
  const png = resolve(aqui, '../_comum/hub', de + '.png');
  const cor = [...(await sharp(png).extract({ left: 4, top: 4, width: 1, height: 1 }).raw().toBuffer())].slice(0, 3);
  await solta(null, `<div class="barra-st" style="background:rgb(${cor});color:#1b1b1b"><span>${HORA}</span><i></i></div><img src="${pathToFileURL(png).href}" style="position:static;display:block;width:${L}px;height:auto">`);
  await foto(para + '.webp');
}

// a conversa, com todas as mensagens abertas
await solta('.palco-cena .tela');
const chat = await p.evaluate(A => {
  const t = document.querySelector('.f3d-foto'), c = t.querySelector('.chat');
  c.style.cssText = 'transform:none;filter:none';
  const ms = [...t.querySelectorAll('.msg')];
  ms.forEach(m => { m.style.cssText = 'grid-template-rows:1fr;opacity:1'; });
  const r = e => e.getBoundingClientRect(), lista = r(t.querySelector('.chat-lista')), campo = r(t.querySelector('.chat-campo'));
  return { msgs: ms.map(m => [+(r(m).top / A).toFixed(4), +(r(m).height / A).toFixed(4)]), campo: +(campo.top / A).toFixed(4), sobra: +(lista.bottom - r(ms[ms.length - 1]).bottom).toFixed(1), fundo: getComputedStyle(c).backgroundColor };
}, A);
if (chat.sobra < 0) throw new Error(`a conversa não cabe na tela: faltam ${-chat.sobra}px`);
await foto('f3d-chat.webp');

// o anúncio: a faixa fixa do topo e, embaixo dela na mesma imagem, o rolo inteiro
await solta('.af .tela');
const feed = await p.evaluate(() => {
  const t = document.querySelector('.f3d-foto'), rolo = t.querySelector('.feed-rolo');
  rolo.style.transform = 'none';
  const r = e => e.getBoundingClientRect(), o = { topo: Math.round(r(t.querySelector('.feed-topo')).bottom), rolo: Math.ceil(r(rolo).bottom) };
  t.style.height = o.rolo + 'px';
  return o;
});
await foto('f3d-feed.webp', feed.rolo);
await b.close();

console.log('\nNo assets/fone-3d.js:');
console.log(`const FEED_TOPO = ${(feed.topo / feed.rolo).toFixed(4)}; // quanto da altura da imagem é a faixa fixa do topo`);
console.log(`const CHAT = ${JSON.stringify({ msgs: chat.msgs, campo: chat.campo, fundo: chat.fundo })};`);
