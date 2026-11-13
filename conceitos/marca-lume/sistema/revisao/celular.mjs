process.env.LUME_IMPORT_ONLY='1';
const {ROOT,TMP,sharp,layer,data,W,H}=await import('./compor.mjs');
const base=await sharp(data.sources.celular).removeAlpha().raw().toBuffer();
await layer(base,'artes/tela-instagram.png',[[553,43],[981,42],[983,953],[555,957]],{mode:'screen',opacity:.97,rounded:.13});
await sharp(base,{raw:{width:W,height:H,channels:3}}).webp({quality:85,effort:6}).toFile(ROOT+'/fotos/celular.webp');
await sharp(base,{raw:{width:W,height:H,channels:3}}).png().toFile(ROOT+'/fotos/alta/celular.png');
console.log('Celular finalizado.');

