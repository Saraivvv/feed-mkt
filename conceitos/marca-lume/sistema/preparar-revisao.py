from pathlib import Path
import json, re, hashlib, urllib.request
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools import subset

R = Path(__file__).resolve().parents[1]
T = Path(r'C:\Users\guisa\AppData\Local\Temp\claude\f3a6600d269a104b\dff5d254-2c2d-40ae-8f7f-59afaf17b6db\scratchpad\lume-astra')
S = R/'sistema/revisao'
S.mkdir(exist_ok=True)
(R/'capturas').mkdir(exist_ok=True)
baseline = {str(p.relative_to(R)): hashlib.sha256(p.read_bytes()).hexdigest() for folder in ['logo','fotos/bases'] for p in (R/folder).iterdir() if p.is_file()}
(S/'preservados.json').write_text(json.dumps(baseline,indent=2),encoding='utf8')
for name,remote in [('EBGaramond[wght].ttf','EBGaramond%5Bwght%5D.ttf'),('ebgaramond-OFL.txt','OFL.txt')]:
    url='https://raw.githubusercontent.com/google/fonts/main/ofl/ebgaramond/'+remote
    with urllib.request.urlopen(url) as response: (R/'fontes'/name).write_bytes(response.read())
for weight in [400,500]:
    font=instantiateVariableFont(TTFont(R/'fontes/EBGaramond[wght].ttf'),{'wght':weight},inplace=False)
    options=subset.Options(); options.flavor='woff2'
    sub=subset.Subsetter(options=options)
    sub.populate(unicodes=list(range(0x20,0x100))+list(range(0x100,0x180))+list(range(0x2000,0x2070))+[0x20ac])
    sub.subset(font); font.flavor='woff2'; font.save(R/f'fontes/eb-garamond-{weight}-latin.woff2')
font=instantiateVariableFont(TTFont(R/'fontes/EBGaramond[wght].ttf'),{'wght':400},inplace=False)
sub=subset.Subsetter(options=subset.Options())
sub.populate(text='Um presente. Muitas páginas pela frente. Proposta de exemplo Lume de Papel Entrelinhas O cuidado que fica.')
sub.subset(font); font.flavor='woff2'; font.save(R/'kit-site/serif-texto.woff2')
phrase='Próxima você ação última também já é página coração'
html='<!doctype html><html lang="pt-BR"><meta charset="utf-8"><title>EB Garamond: comparação 400 e 500</title><style>'+''.join(f'@font-face{{font-family:EB;src:url(../../fontes/eb-garamond-{w}-latin.woff2);font-weight:{w}}}' for w in [400,500])+'''body{margin:0;padding:48px;background:#F4EFE4;color:#1F4D45}section{padding:24px 0 32px;border-bottom:1px solid #C8923C}label{font:18px Arial}p{font:400 82px/1.16 EB;margin:20px 0;max-width:1250px}section:last-child p{font-weight:500}</style>'''+''.join(f'<section><label>EB GARAMOND / {w}</label><p>{phrase}</p><p>O que fica em você.</p></section>' for w in [400,500])+'</html>'
(S/'teste-acentos.html').write_text(html,encoding='utf8')
for name in ['vetores.py','compor.mjs','social.mjs','celular.mjs']:
    s=(T/name).read_text(encoding='utf8')
    if name=='vetores.py':
        s=s.replace("'CormorantGaramond[wght].ttf',500", "'EBGaramond[wght].ttf',400")
        s=s.replace("font.flavor='woff2'; font.save(ROOT/'fontes'/f'{key}-astra.woff2')", "# WOFF2 locais preparados antes da escolha visual; vetores usam o TTF original.")
    else:
        s=s.replace("path.dirname(new URL(import.meta.url).pathname.replace(/^\\/([A-Z]:)/,'$1'))", "path.dirname(fileURLToPath(import.meta.url))")
        s="import {fileURLToPath} from 'node:url';\n"+s if 'path.dirname(fileURLToPath' in s else s
    if name=='compor.mjs':
        s=s.replace(" await sharp(src).webp({quality:93}).toFile(path.join(ROOT,'fotos/bases',name+'.webp'));",' // Bases aprovadas preservadas byte a byte.')
        s=s.replace("fs.writeFileSync(path.join(ROOT,'sistema','mapeamentos-astra.json'),JSON.stringify(maps,null,2));",'')
        s=s.replace(".png().toFile(path.join(TMP,name+'.png'));", ".png().toFile(path.join(ROOT,'fotos/alta',name+'.png'));")
    if name=='celular.mjs':
        s=s.replace(".png().toFile(TMP+'/celular.png')", ".png().toFile(ROOT+'/fotos/alta/celular.png')")
    (S/name).write_text(s,encoding='utf8')
(S/'geracao.json').write_text((T/'geracao.json').read_text(encoding='utf8'),encoding='utf8')
print('Fontes oficiais e licença salvas; teste dos dois pesos preparado; scripts anteriores reaproveitados dentro do escopo.')
