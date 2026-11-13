import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createRequire} from 'node:module';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const require=createRequire('C:/Users/guisa/OneDrive/Desktop/Feed MKT/hub/app/package.json');
const {chromium}=require('playwright'),sharp=require('sharp');
const executablePath='C:/Users/guisa/AppData/Local/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-win64/chrome-headless-shell.exe';
fs.mkdirSync(path.join(root,'capturas'),{recursive:true});
for(const size of [80,160])await sharp(path.join(root,'kit-site/avatar.svg')).resize(size,size).webp({lossless:true}).toFile(path.join(root,`kit-site/avatar-${size}.webp`));
for(const name of ['google-negocio','instagram-grade','instagram-post-09','whatsapp-agente'])await sharp(path.join(root,`originais/${name}.svg`)).png().toFile(path.join(root,`aplicacoes/${name}.png`));
const browser=await chromium.launch({executablePath,headless:true});
try{
 const p=await browser.newPage({viewport:{width:430,height:916},deviceScaleFactor:1});
 await p.goto(pathToFileURL(path.join(root,'artes/perfil-instagram.html')).href);
 await p.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode()));});
 await p.screenshot({path:path.join(root,'artes/tela-instagram.png')});
 for(const width of [390,1440]){
  await p.setViewportSize({width,height:1000});
  await p.goto(pathToFileURL(path.join(root,'index.html')).href);
  await p.addStyleTag({content:'html{scroll-behavior:auto!important}'});
  await p.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.querySelectorAll('#avatar img')].map(i=>i.decode()));});
  const clip=await p.locator('#avatar').evaluate(e=>({x:0,y:e.getBoundingClientRect().top+scrollY,width:innerWidth,height:e.getBoundingClientRect().height}));
  await p.screenshot({path:path.join(root,`capturas/avatar-secao-${width}.png`),clip,fullPage:true});
 }
 await p.setViewportSize({width:780,height:470});
 await p.setContent(`<style>body{margin:0;background:#F4EFE4;color:#1F4D45;font:14px Arial}main{display:flex;gap:38px;align-items:end;padding:45px 35px}figure{margin:0}img{display:block;border-radius:50%}figcaption{margin-top:18px}</style><main>${[32,40,110,320].map(n=>`<figure><img src="${pathToFileURL(path.join(root,'logo/avatar.svg')).href}" width="${n}" height="${n}"><figcaption>${n} px</figcaption></figure>`).join('')}</main>`);
 await p.evaluate(()=>Promise.all([...document.images].map(i=>i.decode())));
 await p.screenshot({path:path.join(root,'capturas/avatar-tamanhos.png')});
}finally{await browser.close();}
process.env.LUME_IMPORT_ONLY='1';
const {layer,W,H,data}=await import('../revisao/compor.mjs');
const original=data.sources.celular;
const base=await sharp(fs.existsSync(original)?original:path.join(root,'fotos/bases/celular.webp')).removeAlpha().raw().toBuffer();
await layer(base,'artes/tela-instagram.png',[[553,43],[981,42],[983,953],[555,957]],{mode:'screen',opacity:.97,rounded:.13});
await sharp(base,{raw:{width:W,height:H,channels:3}}).webp({quality:85,effort:6}).toFile(path.join(root,'fotos/celular.webp'));
await sharp(base,{raw:{width:W,height:H,channels:3}}).png().toFile(path.join(root,'fotos/alta/celular.png'));
console.log('Avatar exportado, seção capturada e celular recomposto sobre a base limpa.');
