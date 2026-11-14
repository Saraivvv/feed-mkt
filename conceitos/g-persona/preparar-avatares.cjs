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
  let count=0;
  for(const bird of ['car-a','car-b','car-c']){
    for(const size of [320,110,40,32]){
      const source=path.join(__dirname,'fontes',`tuie-${bird}-${size<=40?'cabeca':'busto'}.png`);
      if(!fs.existsSync(source))throw Error('Matriz ausente: '+source);
      await exportAvatar(source,bird,size);count++;
    }
  }
  console.log(count+' avatares WebP exportados em 2x e três cores exatas.');
})().catch(e=>{console.error(e);process.exitCode=1;});
