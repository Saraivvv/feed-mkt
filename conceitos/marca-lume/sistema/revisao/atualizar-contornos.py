from pathlib import Path
import re, json, html
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen

R=Path(__file__).resolve().parents[2]
old=instantiateVariableFont(TTFont(R/'fontes/CormorantGaramond[wght].ttf'),{'wght':500},inplace=False)
new=instantiateVariableFont(TTFont(R/'fontes/EBGaramond[wght].ttf'),{'wght':400},inplace=False)
og,ng=old.getGlyphSet(),new.getGlyphSet(); oc,nc=old.getBestCmap(),new.getBestCmap()
def outline(gs,name):
    pen=SVGPathPen(gs); gs[name].draw(pen); return pen.getCommands()
old_paths={outline(og,n) for n in set(oc.values())}-{''}
report=[]
for folder in ['originais','sistema','kit-site']:
    for p in (R/folder).glob('*.svg'):
        if p.name=='logo.svg': continue
        changes=[]
        def replace(m):
            label=html.unescape(m[2])
            # Assinaturas e monograma são patrimônio imutável da marca.
            if label in ['Lume de Papel','LD','Lume','de Papel']: return m[0]
            paths=re.findall(r'<path transform="translate\(([-\d.]+) ([-\d.]+)\) scale\(([-\d.]+) ([-\d.]+)\)" d="([^"]*)"\s*/>',m[3])
            if not paths or not any(t[4] in old_paths for t in paths): return m[0]
            drawn=[i for i,ch in enumerate(label) if outline(og,oc[ord(ch)])]
            assert len(paths)==len(drawn),(p,label,len(paths))
            x,y,scale=map(float,paths[0][:3]); size=scale*old['head'].unitsPerEm
            spacing=0
            if len(paths)>1:
                advance=sum(og[oc[ord(ch)]].width*scale for ch in label[drawn[0]:drawn[1]])
                spacing=(float(paths[1][0])-x-advance)/(drawn[1]-drawn[0])
            oldwidth=float(paths[-1][0])-x+og[oc[ord(label[-1])]].width*scale
            newscale=size/new['head'].unitsPerEm
            newwidth=sum(ng[nc[ord(ch)]].width*newscale for ch in label)+spacing*(len(label)-1)
            # Mantém a área disponível do arquivo legado sem comprimir as letras.
            if newwidth>oldwidth: newscale*=oldwidth/newwidth; spacing*=oldwidth/newwidth
            out=f'<g fill="{m[1]}" aria-label="{m[2]}" data-serif="EB Garamond 400">'
            for ch in label:
                out+=f'<path transform="translate({x:.4f} {y}) scale({newscale:.6f} {-newscale:.6f})" d="{outline(ng,nc[ord(ch)])}"/>'
                x+=ng[nc[ord(ch)]].width*newscale+spacing
            changes.append(label)
            return out+'</g>'
        source=p.read_text(encoding='utf8')
        result=re.sub(r'<g fill="([^"]+)" aria-label="([^"]+)">((?:<path\b[^>]*\/>)*)</g>',replace,source)
        if changes:
            p.write_text(result,encoding='utf8');report.append({'file':str(p.relative_to(R)).replace('\\','/'),'texts':changes})
(R/'sistema/revisao/contornos-atualizados.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf8')
print(f'{len(report)} SVGs legados atualizados; {sum(len(x["texts"]) for x in report)} frases. Assinaturas intactas.')
