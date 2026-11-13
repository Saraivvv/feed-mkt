import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createRequire} from 'node:module';
const require=createRequire('C:/Users/guisa/OneDrive/Desktop/Feed MKT/hub/app/package.json');
const {chromium}=require('playwright'),sharp=require('sharp');
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const files=new Set(['index.html']),errors=[];
function scan(file){
 const src=fs.readFileSync(path.join(root,file),'utf8');
 const refs=file.endsWith('.css')?[...src.matchAll(/url\(["']?([^"')]+)["']?\)/g)].map(m=>m[1]):[...src.matchAll(/(?:src|href)="([^"]+)"/g)].map(m=>m[1]);
 for(const ref of refs){if(ref.startsWith('#'))continue;assert(!/^(https?:|data:|\/\/)/.test(ref),'Referência externa: '+ref);const next=path.posix.normalize(path.posix.join(path.posix.dirname(file),ref));assert(!next.startsWith('..'),'Fora da entrega: '+next);assert(fs.existsSync(path.join(root,next)),'Ausente: '+next);if(!files.has(next)){files.add(next);if(next.endsWith('.css'))scan(next);}}
}
scan('index.html');
const manifest=[...files].sort().map(file=>({file,bytes:fs.statSync(path.join(root,file)).size}));
const bytes=manifest.reduce((a,b)=>a+b.bytes,0);assert(bytes<12000000,'Página acima de 12 MB');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');assert(!/[–—]/.test(html),'Travessão');assert(!/\bdownload\b/.test(html),'Link de download');
for(const folder of ['logo','padroes','artes'])for(const name of fs.readdirSync(path.join(root,folder)).filter(n=>n.endsWith('.svg'))){const svg=fs.readFileSync(path.join(root,folder,name),'utf8');assert(!/<!DOCTYPE/i.test(svg),'DOCTYPE em '+name);assert(!/<text[\s>]/.test(svg),'Texto sem contorno em '+name);assert(!/[–—]/.test(svg),'Travessão em '+name);}
const kit=[];
for(const name of ['fachada','post','embalagem']){const file='kit-site/foto-'+name+'.webp';const meta=await sharp(path.join(root,file)).metadata();const size=fs.statSync(path.join(root,file)).size;assert(meta.width<=1200&&size<=150000,'Kit fora do limite');kit.push({file,width:meta.width,height:meta.height,bytes:size});}
const browser=await chromium.launch({executablePath:'C:/Users/guisa/AppData/Local/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-win64/chrome-headless-shell.exe',headless:true});
const layouts=[];
for(const width of [390,768,1024,1440]){
 const p=await browser.newPage({viewport:{width,height:900},hasTouch:width<1440,deviceScaleFactor:1});
 p.on('pageerror',e=>errors.push(e.message));p.on('request',r=>{if(/^https?:/.test(r.url()))errors.push('Rede externa: '+r.url());});
 await p.goto(pathToFileURL(path.join(root,'index.html')).href,{waitUntil:'networkidle'});
 await p.addStyleTag({content:'html{scroll-behavior:auto!important}'});
 await p.evaluate(async()=>{document.querySelectorAll('img').forEach(i=>i.loading='eager');await Promise.all([...document.images].map(i=>i.decode()));await document.fonts.ready;});
 const result=await p.evaluate(()=>{
 const visible=e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&r.width&&r.height;};
 const cropped=[...document.querySelectorAll('h1,h2,h3,p,figcaption,a,small,summary')].filter(visible).filter(e=>e.scrollWidth>e.clientWidth+1).map(e=>e.textContent.slice(0,70));
 const badTargets=[...document.querySelectorAll('a,summary')].filter(visible).filter(e=>{const r=e.getBoundingClientRect();return r.width<44||r.height<44}).map(e=>e.textContent);
 return {width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth,cropped,badTargets,missingImages:[...document.images].filter(i=>!i.naturalWidth).length,brokenAnchors:[...document.querySelectorAll('a[href^="#"]')].filter(a=>!document.getElementById(a.hash.slice(1))).length,fonts:document.fonts.check('16px Manrope')&&document.fonts.check('16px EB Garamond'),h1:document.querySelectorAll('h1').length};
 });
 layouts.push(result);assert(!result.overflow&&!result.cropped.length&&!result.badTargets.length&&!result.missingImages&&!result.brokenAnchors&&result.fonts&&result.h1===1,JSON.stringify(result));
 await p.screenshot({path:path.join(root,'capturas','astra-'+width+'-abertura.png')});
 if(width===390||width===1440)for(const id of ['identidade','tipografia','padroes','voz','aplicacoes','digital']){await p.locator('#'+id).scrollIntoViewIfNeeded();await p.evaluate(id=>window.scrollTo(0,document.getElementById(id).getBoundingClientRect().top+scrollY),id);await p.screenshot({path:path.join(root,'capturas','astra-'+width+'-'+id+'.png')});}
 await p.locator('summary').click();assert(await p.locator('details').getAttribute('open')!==null,'Detalhes não abriu');
 await p.close();
}
await browser.close();assert(!errors.length,errors.join('\n'));
fs.writeFileSync(path.join(root,'sistema','publicacao-astra.json'),JSON.stringify({bytes,megabytes:bytes/1e6,files:manifest,kit},null,2));
fs.writeFileSync(path.join(root,'sistema','verificacao-astra.json'),JSON.stringify({layouts,errors,bytes,kit},null,2));
console.log(JSON.stringify({bytes,megabytes:bytes/1e6,files:manifest.length,kit,layouts},null,2));console.log('ASTRA 0 achados');
