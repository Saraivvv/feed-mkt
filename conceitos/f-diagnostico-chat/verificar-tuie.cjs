const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { createRequire } = require('node:module');
const { chromium } = createRequire('C:/Users/guisa/OneDrive/Desktop/Feed MKT/hub/app/package.json')('playwright');
const tipos = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.webp':'image/webp', '.svg':'image/svg+xml', '.woff2':'font/woff2', '.pdf':'application/pdf' };

(async () => {
  const saida=path.join(__dirname,'capturas/tuie');fs.mkdirSync(saida,{recursive:true});
  const servidor=http.createServer((req,res)=>{
    const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\/diagnostico(?=\/|$)/,'')||'/';
    const arquivo=path.resolve(__dirname,'.'+(pathname==='/'?'/index.html':pathname));
    if(!arquivo.startsWith(__dirname+path.sep))return res.writeHead(403).end();
    fs.readFile(arquivo,(e,dados)=>{if(e)return res.writeHead(404).end();res.setHeader('Content-Type',tipos[path.extname(arquivo)]||'application/octet-stream');res.end(dados);});
  });
  await new Promise(resolve=>servidor.listen(0,'127.0.0.1',resolve));
  const base=`http://127.0.0.1:${servidor.address().port}`;
  const browser=await chromium.launch({executablePath:'C:/Users/guisa/AppData/Local/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-win64/chrome-headless-shell.exe'});
  const relatorio=[];
  try {
    for(const [width,height,touch] of [[390,844,true],[768,1024,true],[1024,768,true],[1440,980,false]]){
      const page=await browser.newPage({viewport:{width,height},isMobile:touch,hasTouch:touch,reducedMotion:'reduce'});
      const erros=[],envios=[];let concluirEnvio;
      page.on('pageerror',e=>erros.push(e.message));
      await page.route('**/api/diagnostico',async route=>{envios.push(route.request().postDataJSON());const r=await new Promise(resolve=>concluirEnvio=resolve);await route.fulfill({status:r.status||200,contentType:'application/json',body:JSON.stringify(r.body)});});
      const medir=async()=>assert.deepEqual(await page.evaluate(()=>({estouro:document.documentElement.scrollWidth>innerWidth,imagens:[...document.images].filter(im=>!im.complete||!im.naturalWidth).map(im=>im.src)})),{estouro:false,imagens:[]});
      const alcance=async seletor=>{
        const r=await page.locator(seletor).evaluate(el=>{const b=el.getBoundingClientRect(),top=document.elementFromPoint(b.x+b.width/2,b.y+b.height/2);return {w:b.width,h:b.height,visivel:b.top>=0&&b.bottom<=innerHeight&&(top===el||el.contains(top))};});
        assert(r.visivel,`${width}: ${seletor} coberto ou fora da tela`);if(touch)assert(r.w>=44&&r.h>=44);
      };
      await page.goto(base+'/diagnostico');await page.locator('#comecar').waitFor();
      assert.equal(await page.locator('[data-nome]').textContent(),'Tuiê');assert.doesNotMatch(await page.locator('body').innerText(),/Config AI|Conceito|simula[çc]/i);
      await medir();await alcance('.voltar-feed');await alcance('#comecar');await page.screenshot({path:path.join(saida,`${width}-abertura.png`)});
      await page.locator('#comecar').click();
      for(let i=0;i<8;i++){
        await page.waitForFunction(n=>document.querySelector('.cartao-topo > span:last-child')?.textContent===`${String(n+1).padStart(2,'0')} / 08`&&!document.querySelector('#enviar')?.closest('.preparando'),i);
        await page.locator('[data-opcao="0"]').click();await alcance('#enviar');await medir();await page.locator('#enviar').click();
      }
      await page.locator('[data-contato]').waitFor();assert.equal(envios.length,0);await page.locator('[data-contato]').click();
      await page.locator('#nome').fill('Pessoa de teste');await page.locator('#email').fill('tuie-teste@example.com');await page.locator('#whatsapp').fill('(16) 99999-9999');
      const enviar=page.locator('#contato button[type="submit"]');await alcance('#contato button[type="submit"]');await enviar.click();
      await page.locator('#erro').filter({hasText:'Marque a autorização'}).waitFor();assert.equal(envios.length,0);await page.locator('#consentimento').check();await enviar.click();
      await page.waitForFunction(()=>document.querySelector('#contato').getAttribute('aria-busy')==='true');assert.equal(await page.locator('#nome').isDisabled(),true);
      await page.locator('#contato').evaluate(form=>form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));await page.waitForTimeout(50);assert.equal(envios.length,1);
      assert.equal(envios[0].telefone,'16999999999');assert.equal(Object.keys(envios[0].diagnostico.respostas).length,8);assert.equal(envios[0].consentimento.aceito,true);assert.match(envios[0].idempotencyKey,/^[a-f0-9-]{36}$/);
      concluirEnvio({status:503,body:{error:'O Hub está indisponível. Tente novamente.'}});
      await page.locator('#erro').filter({hasText:'O Hub está indisponível'}).waitFor();assert.equal(await page.locator('#nome').inputValue(),'Pessoa de teste');assert.equal(await page.locator('#confirmacao').count(),0);
      await enviar.click();await page.waitForTimeout(100);assert.equal(envios.length,2);assert.equal(envios[0].idempotencyKey,envios[1].idempotencyKey);
      concluirEnvio({body:{ok:true,leadSaved:false,pdfSent:true}});await page.locator('#erro').filter({hasText:'Não conseguimos confirmar'}).waitFor();assert.equal(await page.locator('#confirmacao').count(),0);
      await page.locator('#nome').fill('Pessoa de teste atualizada');await enviar.click();await page.waitForTimeout(100);assert.equal(envios.length,3);assert.notEqual(envios[1].idempotencyKey,envios[2].idempotencyKey);
      const pdfSent=width!==390;concluirEnvio({body:{ok:true,leadSaved:true,pdfSent}});await page.locator('#confirmacao').waitFor();
      const texto=await page.locator('#confirmacao').innerText();assert.match(texto,/a equipe recebeu seu diagnóstico/);assert.match(texto,pdfSent?/PDF foi enviado/:/envio do PDF por e-mail não foi concluído/);assert.doesNotMatch(texto,/simula[çc]|nada foi enviado|Modo conceito/i);
      await medir();assert.deepEqual(erros,[]);await page.screenshot({path:path.join(saida,`${width}-confirmacao.png`)});
      relatorio.push({width,height,touch,perguntas:8,envio:true,falhaRetry:true,pdfSent,erros});await page.close();
    }
    fs.writeFileSync(path.join(saida,'verificacao.json'),JSON.stringify(relatorio,null,2)+'\n');
    console.log('Tuiê produção: 4 aparelhos, 8 perguntas, envio consentido, duplo envio bloqueado, falha/retry com mesma chave, PDF sim/não; zero imagens quebradas, estouro ou erros.');
  } finally {await browser.close();await new Promise(resolve=>servidor.close(resolve));}
})().catch(e=>{console.error(e);process.exitCode=1;});
