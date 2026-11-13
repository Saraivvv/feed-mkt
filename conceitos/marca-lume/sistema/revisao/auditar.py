from pathlib import Path
import json,hashlib,re,xml.etree.ElementTree as ET
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
R=Path(__file__).resolve().parents[2]
baseline=json.loads((R/'sistema/revisao/preservados.json').read_text())
for file,digest in baseline.items(): assert hashlib.sha256((R/file).read_bytes()).hexdigest()==digest,file
assert (R/'medir.mjs').read_bytes()==(R.parent/'_comum/medir.mjs').read_bytes()
old=instantiateVariableFont(TTFont(R/'fontes/CormorantGaramond[wght].ttf'),{'wght':500},inplace=False)
gs=old.getGlyphSet(); glyphs=set()
for name in set(old.getBestCmap().values()):
    pen=SVGPathPen(gs);gs[name].draw(pen)
    if pen.getCommands():glyphs.add(pen.getCommands())
remaining=[];logos=0
def walk(node,protected=False,label=''):
    global logos
    label=node.get('aria-label',label)
    protected=protected or label in ['Lume de Papel','Lume','LD','de Papel']
    if node.tag.endswith('path') and node.get('d') in glyphs:
        if protected:logos+=1
        else:remaining.append({'file':file,'label':label})
    for child in node:walk(child,protected,label)
for p in R.rglob('*.svg'):
    file=p.relative_to(R).as_posix();s=p.read_text(encoding='utf8')
    assert '<!DOCTYPE' not in s.upper(),file
    assert not re.search('[\u2013\u2014]',s),file
    walk(ET.fromstring(s),file.startswith('logo/') or file=='kit-site/logo.svg')
assert not remaining,remaining
for p in list(R.rglob('*.html'))+list(R.rglob('*.css')):
    s=p.read_text(encoding='utf8')
    assert not re.search(r'font(?:-family)?\s*:[^;}]*Cormorant',s,re.I),str(p)
    assert not re.search('[\u2013\u2014]',s),str(p)
original=TTFont(R/'fontes/EBGaramond[wght].ttf').getBestCmap()
full=TTFont(R/'fontes/eb-garamond-400-latin.woff2').getBestCmap()
assert not (set(range(0x20,0x100))&set(original)-set(full))
phrase='Próxima você ação última também já é página coração ÁÀÂÃÉÊÍÓÔÕÚÜÇ áàâãéêíóôõúüç'
assert all(ord(c) in full for c in phrase)
site='Um presente. Muitas páginas pela frente. Proposta de exemplo Lume de Papel Entrelinhas O cuidado que fica.'
thin=TTFont(R/'kit-site/serif-texto.woff2').getBestCmap()
assert all(ord(c) in thin for c in site)
size=(R/'kit-site/serif-texto.woff2').stat().st_size
assert size<=20000,size
report={'preserved_files':len(baseline),'remaining_cormorant_text':remaining,'protected_logo_glyphs':logos,'latin_and_portuguese':True,'site_subset_bytes':size,'original_gate_unchanged':True}
(R/'sistema/revisao/auditoria.json').write_text(json.dumps(report,indent=2),encoding='utf8')
print(json.dumps(report,indent=2))
print('REVISÃO 0 achados')
