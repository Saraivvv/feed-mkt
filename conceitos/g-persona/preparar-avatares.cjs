const fs = require('node:fs');
const path = require('node:path');
const {createRequire} = require('node:module');
const sharp = createRequire('C:/Users/guisa/OneDrive/Desktop/Feed MKT/hub/app/package.json')('sharp');
const palette = [[255,163,0],[21,21,19],[236,233,226]];

// Exportação em 2x, como os avatares existentes, com somente as três tintas.
async function exportAvatar(source, bird, size) {
  const {data,info} = await sharp(source).resize(size*2,size*2).removeAlpha().raw().toBuffer({resolveWithObject:true});
  for(let i=0;i<data.length;i+=info.channels){
    let best=palette[0],distance=Infinity;
    for(const color of palette){
      const d=color.reduce((sum,v,c)=>sum+(data[i+c]-v)**2,0);
      if(d<distance){distance=d;best=color;}
    }
    for(let c=0;c<3;c++)data[i+c]=best[c];
  }
  await sharp(data,{raw:info}).webp({lossless:true}).toFile(path.join(__dirname,'assets',`tuie-${bird}-${size}.webp`));
}

(async()=>{
  const sources=process.argv.slice(2);
  if(sources.length!==4||sources.some(p=>!path.isAbsolute(p)||!fs.existsSync(p)))throw Error('Informe quatro fontes absolutas: sabiá busto, joão busto, sabiá cabeça, joão cabeça.');
  for(const [i,bird] of ['sabia','joao'].entries()){
    for(const size of [320,110,40,32])await exportAvatar(sources[i+(size<=40?2:0)],bird,size);
  }
  console.log('8 avatares WebP exportados em 2x e três cores exatas.');
})().catch(e=>{console.error(e);process.exitCode=1;});
