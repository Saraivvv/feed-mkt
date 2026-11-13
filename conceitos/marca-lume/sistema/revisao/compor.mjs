import {fileURLToPath} from 'node:url';
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire('C:/Users/guisa/OneDrive/Desktop/Feed MKT/hub/app/package.json');
const sharp=require('sharp');
const ROOT='C:/Users/guisa/OneDrive/Desktop/Feed MKT/orca/workspaces/Feed MKT/site-v2/conceitos/marca-lume';
const TMP=path.dirname(fileURLToPath(import.meta.url));
const data=JSON.parse(fs.readFileSync(path.join(TMP,'geracao.json')));
const W=1536,H=1024;
function solve(A,b){for(let i=0;i<b.length;i++){let p=i;for(let j=i+1;j<b.length;j++)if(Math.abs(A[j][i])>Math.abs(A[p][i]))p=j;[A[i],A[p]]=[A[p],A[i]];[b[i],b[p]]=[b[p],b[i]];const z=A[i][i];if(Math.abs(z)<1e-10)throw Error('Singular perspective');for(let k=i;k<b.length;k++)A[i][k]/=z;b[i]/=z;for(let j=0;j<b.length;j++)if(j!==i){const f=A[j][i];for(let k=i;k<b.length;k++)A[j][k]-=f*A[i][k];b[j]-=f*b[i];}}return b;}
function homography(quad,w,h){let a=[],b=[];quad.forEach(([x,y],i)=>{const [u,v]=[[0,0],[w,0],[w,h],[0,h]][i];a.push([x,y,1,0,0,0,-u*x,-u*y],[0,0,0,x,y,1,-v*x,-v*y]);b.push(u,v);});return solve(a,b);}
function inside(x,y,p){let c=false;for(let i=0,j=p.length-1;i<p.length;j=i++){if((p[i][1]>y)!=(p[j][1]>y)&&x<(p[j][0]-p[i][0])*(y-p[i][1])/(p[j][1]-p[i][1])+p[i][0])c=!c;}return c;}
async function art(file,{strip=false,trim=false}={}){let input=fs.readFileSync(path.join(ROOT,file));if(file.endsWith('.svg')&&strip)input=Buffer.from(input.toString().replace(/<rect x="0" y="0" width="[^"]+" height="[^"]+" fill="#[A-Fa-f0-9]+"\/>/,''));let s=sharp(input,{density:144});if(trim)s=s.trim();return s.ensureAlpha().raw().toBuffer({resolveWithObject:true});}
async function layer(base,file,q,{strip=false,trim=false,mode='ink',opacity=1,curve=0,clip=null,exclude=null,rounded=0}={}){
 const raw=await art(file,{strip,trim});
 const dw=Math.max(Math.hypot(q[1][0]-q[0][0],q[1][1]-q[0][1]),Math.hypot(q[2][0]-q[3][0],q[2][1]-q[3][1]));
 const dh=Math.max(Math.hypot(q[3][0]-q[0][0],q[3][1]-q[0][1]),Math.hypot(q[2][0]-q[1][0],q[2][1]-q[1][1]));
 const {data:im,info}=await sharp(raw.data,{raw:raw.info}).resize(Math.ceil(dw*1.25),Math.ceil(dh*1.25),{fit:'fill'}).raw().toBuffer({resolveWithObject:true});const w=info.width,h=info.height,m=homography(q,w-1,h-1);
 const x0=Math.max(0,Math.floor(Math.min(...q.map(p=>p[0])))),x1=Math.min(W-1,Math.ceil(Math.max(...q.map(p=>p[0]))));
 const y0=Math.max(0,Math.floor(Math.min(...q.map(p=>p[1])))),y1=Math.min(H-1,Math.ceil(Math.max(...q.map(p=>p[1]))));
 for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){
  if(clip&&!inside(x,y,clip))continue;
  if(exclude&&Math.hypot(x-exclude[0],y-exclude[1])<exclude[2])continue;
  const d=m[6]*x+m[7]*y+1;let u=(m[0]*x+m[1]*y+m[2])/d,v=(m[3]*x+m[4]*y+m[5])/d;
  u+=curve*Math.sin(v/h*Math.PI*3);v+=curve*.5*Math.sin(u/w*Math.PI*4);
  if(u<0||v<0||u>=w-1||v>=h-1)continue;
  if(rounded){const r=w*rounded,dx=Math.max(r-u,0,u-(w-r)),dy=Math.max(r-v,0,v-(h-r));if(dx&&dy&&dx*dx+dy*dy>r*r)continue;}
  const ix=Math.floor(u),iy=Math.floor(v),fx=u-ix,fy=v-iy,pp=(iy*w+ix)*4,j=(y*W+x)*3;
  const sample=c=>im[pp+c]*(1-fx)*(1-fy)+im[pp+4+c]*fx*(1-fy)+im[pp+w*4+c]*(1-fx)*fy+im[pp+w*4+4+c]*fx*fy;
  const alpha=sample(3)/255*opacity;if(alpha<.002)continue;
  const lum=(base[j]*.2126+base[j+1]*.7152+base[j+2]*.0722);
  for(let c=0;c<3;c++){
   const ink=sample(c);let val;
   if(mode==='multiply')val=base[j+c]*ink/244;
   else if(mode==='screen')val=ink*(.93+lum/255*.07);
   else val=ink*Math.max(.61,Math.min(1.12,Math.pow(lum/76,.2)));
   base[j+c]=Math.max(0,Math.min(255,base[j+c]*(1-alpha)+val*alpha));
  }
 }
}
const L=(file,q,opts={})=>({file,q,opts});
const maps={
 fachada:[L('logo/horizontal-negativo.svg',[[520,111],[1065,111],[1065,230],[520,230]],{trim:true,opacity:.95})],
 sacola:[L('artes/sacola-impressao.svg',[[448,405],[1030,416],[1035,860],[449,870]],{curve:2.1,opacity:.92})],
 caderno:[L('artes/capa-entrelinhas.svg',[[98,221],[495,162],[563,752],[163,810]],{opacity:.91}),L('artes/estampa-pauta.svg',[[630,149],[1040,191],[972,750],[572,701]],{mode:'multiply',opacity:.62,curve:2})],
 presente:[L('artes/caixa-impressao.svg',[[399,260],[938,179],[1005,499],[461,590]],{opacity:.94}),L('artes/tag.svg',[[1298,692],[1444,734],[1357,971],[1207,912]],{strip:true,mode:'multiply'})],
 cartao:[L('artes/cartao-frente.svg',[[156,287],[800,164],[867,493],[219,625]],{strip:true,opacity:.96}),L('artes/cartao-verso.svg',[[718,590],[1364,448],[1447,785],[795,931]],{strip:true,mode:'multiply'})],
 seda:[L('artes/estampa-costura.svg',[[78,128],[1340,161],[1370,937],[72,902]],{mode:'multiply',opacity:.62,curve:7,clip:[[250,143],[1292,190],[1372,378],[1335,594],[1361,717],[1305,917],[1115,940],[935,906],[207,891],[177,688],[76,532],[176,307]],exclude:[1067,710,85]}),L('logo/simbolo-negativo.svg',[[1022,663],[1114,663],[1114,757],[1022,757]],{trim:true,opacity:.9})],
 ecobag:[L('artes/ecobag-impressao.svg',[[534,463],[991,468],[978,858],[527,867]],{mode:'multiply',curve:5,opacity:.9})],
 vitrine:[L('artes/cartaz-vitrine.svg',[[92,113],[558,113],[558,881],[92,881]],{strip:true,mode:'multiply',opacity:.96}),L('artes/capa-entrelinhas.svg',[[749,148],[895,149],[897,354],[749,354]],{opacity:.8}),L('artes/capa-entrelinhas.svg',[[951,156],[1095,157],[1099,354],[951,354]],{opacity:.8}),L('artes/capa-entrelinhas.svg',[[780,609],[924,608],[933,846],[780,848]],{opacity:.84}),L('artes/capa-entrelinhas.svg',[[978,634],[1124,634],[1133,847],[982,847]],{opacity:.84})],
 cartaz:[L('artes/cartaz-cidade.svg',[[499,114],[1021,114],[1021,858],[499,858]],{strip:true,mode:'multiply'})],
 embrulho:[L('artes/estampa-dobra.svg',[[211,246],[1110,79],[1226,708],[301,873]],{mode:'multiply',opacity:.7,curve:1.2}),L('artes/bilhete.svg',[[1191,821],[1448,740],[1502,905],[1240,980]],{strip:true,mode:'multiply'})],
 forro:[L('artes/estampa-trama.svg',[[325,160],[1202,160],[1202,866],[325,866]],{mode:'multiply',opacity:.65})]
};
if(!process.env.LUME_IMPORT_ONLY)for(const [name,src] of Object.entries(data.sources)){
 // Bases aprovadas preservadas byte a byte.
 if(name==='celular')continue;
 if(name==='seda')maps.seda[1].q=[[1032,663],[1102,663],[1102,757],[1032,757]];
 const base=await sharp(src).removeAlpha().raw().toBuffer();
 for(const l of maps[name])await layer(base,l.file,l.q,l.opts);
 await sharp(base,{raw:{width:W,height:H,channels:3}}).webp({quality:85,effort:6}).toFile(path.join(ROOT,'fotos',name+'.webp'));
 await sharp(base,{raw:{width:W,height:H,channels:3}}).png().toFile(path.join(ROOT,'fotos/alta',name+'.png'));
 console.log(name,'aplicado');
}

export {ROOT,TMP,sharp,layer,data,W,H};
