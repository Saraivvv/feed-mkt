import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'dist');
// O único diretório removido é o build deste checkout.
if (dirname(out) !== root || basename(out) !== 'dist') throw new Error('Destino de build inválido');
if (existsSync(out)) rmSync(out, { recursive: true });
mkdirSync(out);
cpSync(join(root, 'public'), out, { recursive: true });

const site = join(root, 'conceitos/d-site-feed');
const chat = join(root, 'conceitos/f-diagnostico-chat');
cpSync(join(site, 'assets'), join(out, 'assets'), { recursive: true });
let html = readFileSync(join(site, 'index.html'), 'utf8');
// As maquetes abriam do disco. Em produção, links internos ficam no mesmo domínio.
html = html.replace(/(<a\b[^>]*\bhref=")https:\/\/agenciafeed\.com(\/[^\"]*)"/g, '$1$2"')
  .replace('href="../f-diagnostico-chat/index.html"', 'href="/diagnostico/"')
  .replaceAll('href="https://agenciafeed.com/favicon.svg"', 'href="/favicon.svg"');
writeFileSync(join(out, 'index.html'), html);
mkdirSync(join(out, 'diagnostico'), { recursive: true });
cpSync(join(chat, 'assets'), join(out, 'diagnostico/assets'), { recursive: true });
cpSync(join(chat, 'index.html'), join(out, 'diagnostico/index.html'));
console.log('Site aprovado e diagnóstico Tuiê preparados em dist/; páginas e blog preservados.');
