const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {createRequire}=require('node:module'),{pathToFileURL}=require('node:url');
const req=createRequire('C:/Users/guisa/OneDrive/Desktop/Feed MKT/hub/app/package.json');
const {chromium}=req('playwright');
const sharp=req('sharp');
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
if(id==='tuie'){
assert.equal(await page.locator('.bird-card').count(),3);
assert.equal(await page.locator('.bird-chat').count(),3);
for(const size of [110,32]){
const sizes=await page.locator('.bird-sizes img[width="'+size+'"]').evaluateAll(els=>els.map(el=>[el.getBoundingClientRect().width,el.getBoundingClientRect().height]));
assert.deepEqual(sizes,[[size,size],[size,size],[size,size]]);
}
if(width===390||width===1440)await page.locator('.bird-comparison').screenshot({path:path.join(out,'tuie-comparacao-'+width+'.png'),animations:'disabled'});
}
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
for(const bird of ['sabia','joao'])for(const size of [320,110,40,32]){
const {data,info}=await sharp(path.join(root,'assets',`tuie-${bird}-${size}.webp`)).removeAlpha().raw().toBuffer({resolveWithObject:true});
assert.equal(info.width,size*2);assert.equal(info.height,size*2);
const colors=new Set();for(let i=0;i<data.length;i+=info.channels)colors.add([...data.subarray(i,i+3)].join(','));
assert.deepEqual([...colors].sort(),['255,163,0','21,21,19','236,233,226'].sort());
}
const contact=await browser.newPage({viewport:{width:840,height:390},deviceScaleFactor:1});
const picture=(id,size)=>`<img width="${size}" height="${size}" src="data:image/webp;base64,${fs.readFileSync(path.join(root,'assets',`${id}-${size}.webp`)).toString('base64')}">`;
await contact.setContent(`<!doctype html><html lang="pt-BR"><meta charset="utf-8"><style>*{box-sizing:border-box}body{margin:0;padding:28px;background:#ece9e2;color:#151513;font:14px Arial,sans-serif}h1{font-size:27px;margin:0 0 8px}p{margin:0 0 24px}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}article{border-top:3px solid #151513;padding-top:14px}h2{font-size:20px;margin:0 0 8px}.avatars{display:flex;align-items:flex-end;gap:32px;margin-top:22px}figure{margin:0}img{display:block}figcaption{margin-top:12px;font-size:12px}footer{border-top:1px solid #151513;margin-top:24px;padding-top:14px;font-size:12px}</style><h1>Tuiê / três presenças</h1><p>110 e 32 px reais. Nas novas aves, a versão pequena usa só a cabeça.</p><div class="grid">${[['tuie','Original','Ave inventada'],['tuie-sabia','Sabiá-laranjeira','Turdus rufiventris'],['tuie-joao','João-de-barro','Furnarius rufus']].map(([id,name,species])=>`<article><h2>${name}</h2><span>${species}</span><div class="avatars">${[110,32].map(n=>`<figure>${picture(id,n)}<figcaption>${n} px</figcaption></figure>`).join('')}</div></article>`).join('')}</div><footer>Feed · Gravura editorial · Papel, tinta e laranja · Comparação em escala 1:1</footer></html>`);
await contact.evaluate(()=>Promise.all([...document.images].map(i=>i.decode())));
await contact.screenshot({path:path.join(out,'tuie-folha-contato.png')});
await contact.close();
const assetBytes=fs.readdirSync(path.join(root,'assets')).reduce((s,f)=>s+fs.statSync(path.join(root,'assets',f)).size,0);
const total=assetBytes+fs.statSync(path.join(root,'index.html')).size;
assert.ok(total<10000000,'Page exceeds 10 MB');
for(const f of ['index.html','assets/quadro.css','assets/quadro.js','NOTAS.md','PROMPTS.md'])assert.ok(!/[\u2014\u2013]/.test(fs.readFileSync(path.join(root,f),'utf8')),'Travessão em '+f);
fs.writeFileSync(path.join(out,'verificacao.json'),JSON.stringify({checks,totalBytes:total,findings,consoleErrors:0},null,2));
console.log('PASSOU: '+checks+' combinações de persona e largura. Página e assets: '+total+' bytes. Erros: 0.');
}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
