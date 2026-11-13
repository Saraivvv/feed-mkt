const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {createRequire}=require('node:module'),{pathToFileURL}=require('node:url');
const req=createRequire('C:/Users/guisa/OneDrive/Desktop/Feed MKT/hub/app/package.json');
const {chromium}=req('playwright');
const root=__dirname,out=path.join(root,'capturas');
const personas={fevi:'Fevi',tuie:'Tuiê',tadeu:'Tadeu'};
(async()=>{
fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:'C:/Users/guisa/AppData/Local/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-win64/chrome-headless-shell.exe'});
let checks=0;const findings=[];
try{
for(const width of [390,768,1024,1440]){
const page=await browser.newPage({viewport:{width,height:900},hasTouch:width<1440,reducedMotion:'reduce'});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto(pathToFileURL(path.join(root,'index.html')).href);
await page.evaluate(()=>document.fonts.ready);
for(const [id,name] of Object.entries(personas)){
await page.locator('[data-persona="'+id+'"]').click();
assert.equal(await page.locator('#persona-name').textContent(),name);
assert.equal(new URL(page.url()).hash,'#'+id);
assert.equal(await page.locator('[data-persona="'+id+'"]').getAttribute('aria-pressed'),'true');
await page.locator('[data-option]').nth(1).click();
assert.equal(await page.locator('[data-option][aria-pressed=true]').count(),1);
assert.match(await page.locator('.sample-answer').textContent(),/maquete/);
const dimensions=await page.locator('#proposta').evaluate(el=>{
const out={};
for(const img of el.querySelectorAll('.portrait img,.scale-set img')){const b=img.getBoundingClientRect();out[img.getAttribute('width')]=[b.width,b.height,img.naturalWidth];}
return out;
});
for(const n of [32,40,110,320])assert.deepEqual(dimensions[n],[n,n,n*2]);
const geometry=await page.evaluate(()=>{
const visible=el=>el.getClientRects().length&&getComputedStyle(el).visibility!=='hidden';
return {
overflow:document.documentElement.scrollWidth>innerWidth,
broken:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src),
clipped:[...document.querySelectorAll('h1,h2,h3,h4,p,button,small,figcaption')].filter(el=>visible(el)&&el.scrollWidth>el.clientWidth+1).map(el=>el.outerHTML.slice(0,100)),
small:innerWidth<1440?[...document.querySelectorAll('button,summary')].filter(el=>visible(el)&&(el.getBoundingClientRect().width<44||el.getBoundingClientRect().height<44)).map(el=>el.textContent):[]
};
});
assert.deepEqual(geometry,{overflow:false,broken:[],clipped:[],small:[]},id+' '+width);
assert.equal(await page.locator('.motion').evaluate(el=>el.classList.contains('is-thinking')),false);
await page.locator('.motion-toggle').click();
assert.equal(await page.locator('.motion-toggle').getAttribute('aria-pressed'),'true');
await page.locator('.motion-toggle').click();
if(width===390||width===1440){
await page.evaluate(()=>window.scrollTo(0,0));
await page.screenshot({path:path.join(out,id+'-'+width+'.png'),fullPage:true});
if(width===1440){
for(const part of ['avatar-320','avatares-pequenos','diagnostico','site-desktop','site-celular','whatsapp','email']){
await page.locator('[data-capture="'+part+'"]').screenshot({path:path.join(out,id+'-'+part+'.png'),animations:'disabled'});
}
}
}
findings.push({id,width,checks:'nome, hash, seleção, dimensões, overflow, imagens, texto, toque, movimento'});checks++;
}
await page.locator('[data-choice="tuie"]').click();
await page.reload();
assert.equal(await page.locator('[data-choice="tuie"]').getAttribute('aria-pressed'),'true');
assert.equal(await page.locator('#persona-name').textContent(),'Tadeu');
await page.locator('[data-persona="fevi"]').click();
assert.equal(await page.locator('[data-option][aria-pressed=true]').count(),0);
assert.equal(errors.length,0,errors.join('\n'));
await page.close();
}
const assetBytes=fs.readdirSync(path.join(root,'assets')).reduce((s,f)=>s+fs.statSync(path.join(root,'assets',f)).size,0);
const total=assetBytes+fs.statSync(path.join(root,'index.html')).size;
assert.ok(total<10000000,'Page exceeds 10 MB');
for(const f of ['index.html','assets/quadro.css','assets/quadro.js'])assert.ok(!/[\u2013\u2014]/.test(fs.readFileSync(path.join(root,f),'utf8')),'Travessão em '+f);
fs.writeFileSync(path.join(out,'verificacao.json'),JSON.stringify({checks,totalBytes:total,findings,consoleErrors:0},null,2));
console.log('PASSOU: '+checks+' combinações de persona e largura. Página e assets: '+total+' bytes. Erros: 0.');
}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
