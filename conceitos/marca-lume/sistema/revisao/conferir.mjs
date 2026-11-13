import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {fileURLToPath,pathToFileURL} from 'node:url';
const require=createRequire('C:/Users/guisa/OneDrive/Desktop/Feed MKT/hub/app/package.json');
const {chromium}=require('playwright'),sharp=require('sharp');
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const b=await chromium.launch({executablePath:'C:/Users/guisa/AppData/Local/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-win64/chrome-headless-shell.exe',headless:true});
for(const width of [390,1440]){
 const p=await b.newPage({viewport:{width,height:width===390?844:1000},deviceScaleFactor:1});
 await p.goto(pathToFileURL(root+'/index.html').href,{waitUntil:'networkidle'});
 await p.addStyleTag({content:'html{scroll-behavior:auto!important}'});
 await p.evaluate(async()=>{document.querySelectorAll('img').forEach(i=>i.loading='eager');await Promise.all([...document.images].map(i=>i.decode()));await document.fonts.ready});
 await p.screenshot({path:root+`/capturas/revisao-${width}-topo.png`});
 await p.evaluate(()=>scrollTo(0,document.documentElement.scrollHeight));
 await p.screenshot({path:root+`/capturas/revisao-${width}-fechamento.png`});
 await p.locator('#tipografia').screenshot({path:root+`/capturas/revisao-${width}-tipografia.png`});
 if(width===1440){
  await p.evaluate(()=>scrollTo(0,document.querySelector('#tipografia').offsetTop));
  await p.screenshot({path:root+'/capturas/revisao-1440-tipografia-detalhe.png'});
 }
 await p.close();
}
const p=await b.newPage({viewport:{width:1200,height:2000}});
await p.goto(pathToFileURL(root+'/artes/social.html').href);await p.evaluate(()=>document.fonts.ready);
const metrics=await p.locator('.post').evaluateAll(posts=>posts.map(post=>({id:post.id,width:post.clientWidth,height:post.clientHeight,caption:post.querySelector('.caption').getBoundingClientRect().height,photo:post.querySelector('.photo').getBoundingClientRect().height,overflow:[...post.querySelectorAll('h1,p')].some(e=>e.scrollWidth>e.clientWidth)})));
assert(metrics.length===9&&metrics.every(m=>m.width===1080&&m.height===1350&&!m.overflow));
fs.writeFileSync(root+'/sistema/revisao/posts-medidas.json',JSON.stringify(metrics,null,2));
await b.close();
await sharp(root+'/fotos/alta/caderno.png').extract({left:86,top:150,width:490,height:680}).resize(980).png().toFile(root+'/capturas/revisao-caderno-zoom.png');
for(let row=0;row<3;row++){
 const tiles=[];
 for(let i=0;i<3;i++)tiles.push({input:await sharp(root+`/artes/post-${String(row*3+i+1).padStart(2,'0')}.webp`).resize(540).toBuffer(),left:i*552,top:0});
 await sharp({create:{width:1644,height:675,channels:3,background:'#ded8cc'}}).composite(tiles).png().toFile(root+`/capturas/revisao-posts-${row+1}.png`);
}
const stories=[];
for(let i=0;i<3;i++)stories.push({input:await sharp(root+`/artes/story-0${i+1}.webp`).resize(432).toBuffer(),left:i*444,top:0});
await sharp({create:{width:1320,height:768,channels:3,background:'#ded8cc'}}).composite(stories).png().toFile(root+'/capturas/revisao-stories.png');
for(const entry of JSON.parse(fs.readFileSync(root+'/sistema/revisao/contornos-atualizados.json'))){
 if(!entry.file.startsWith('originais/'))continue;
 const out=root+'/aplicacoes/'+path.basename(entry.file,'.svg')+'.png';
 if(fs.existsSync(out))await sharp(root+'/'+entry.file).png().toFile(out);
}
console.log('Capturas, zoom, nove posts, três stories e PNGs legados atualizados.');
