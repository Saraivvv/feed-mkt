from pathlib import Path
import re
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
ROOT=Path(r"C:\Users\guisa\OneDrive\Desktop\Feed MKT\orca\workspaces\Feed MKT\site-v2\conceitos\marca-lume")
for d in ['artes','padroes','fotos','fotos/bases','sistema']: (ROOT/d).mkdir(exist_ok=True,parents=True)
M='#1F4D45'; P='#F4EFE4'; A='#C8923C'; V='#3F998B'; B='#395C72'
fonts={}
for key,file,weight in [('serif','EBGaramond[wght].ttf',400),('sans','Manrope[wght].ttf',450),('bold','Manrope[wght].ttf',650)]:
    font=instantiateVariableFont(TTFont(ROOT/'fontes'/file),{'wght':weight},inplace=False)
    fonts[key]=(font,font.getGlyphSet(),font.getBestCmap(),font['head'].unitsPerEm)
    # WOFF2 locais preparados antes da escolha visual; vetores usam o TTF original.
def text(t,x,y,size=30,font='sans',color=M,spacing=0,anchor='start'):
    f,g,c,u=fonts[font]; scale=size/u
    width=sum(g[c.get(ord(ch),'space')].width*scale+spacing for ch in t)-spacing
    if anchor=='middle': x-=width/2
    if anchor=='end': x-=width
    out=f'<g fill="{color}" aria-label="{t}">'
    for ch in t:
        glyph=g[c.get(ord(ch),'space')]; pen=SVGPathPen(g); glyph.draw(pen)
        out+=f'<path transform="translate({x:.4f} {y}) scale({scale:.6f} {-scale:.6f})" d="{pen.getCommands()}"/>'
        x+=glyph.width*scale+spacing
    return out+'</g>'
def rect(x,y,w,h,c):return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{c}"/>'
def line(x,y,xx,yy,c=M,sw=1):return f'<path d="M{x} {y}L{xx} {yy}" fill="none" stroke="{c}" stroke-width="{sw}"/>'
def logo(x,y,w,variant='principal-positivo'):
    src=(ROOT/'logo'/f'{variant}.svg').read_text(encoding='utf8')
    vw,vh=map(float,re.search(r'viewBox="0 0 (\d+) (\d+)"',src).groups())
    inner=re.sub(r'<defs>.*?</defs>','',src,flags=re.S)
    inner=inner[inner.index('>')+1:inner.rfind('</svg>')]
    return f'<svg x="{x}" y="{y}" width="{w}" height="{w*vh/vw}" viewBox="0 0 {vw} {vh}">{inner}</svg>'
def svg(name,w,h,body,bg=None,folder='artes'):
    content=f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}" role="img" aria-label="{name.replace("-"," ")}">'+(rect(0,0,w,h,bg) if bg else '')+body+'</svg>'
    assert '<!DOCTYPE' not in content and '\u2014' not in content and '\u2013' not in content
    (ROOT/folder/f'{name}.svg').write_text(content,encoding='utf8')
    return content
tiles={
'pauta':(120,120,''.join(line(0,y,120,y,M,1.1) for y in [20,40,80,100])+line(60,0,60,120,A,.75)),
'costura':(96,96,''.join(f'<path d="M{x-5} {y-5}l10 10m-10 0l10 -10" stroke="{M}" stroke-width="1.4" fill="none"/>' for x,y in [(24,24),(72,72)])+line(24,0,24,96,A,.6)+line(72,0,72,96,A,.6)),
'dobra':(120,120,''.join(line(x,-120,x+240,120,M,1.5)+line(x+8,-120,x+248,120,A,.7) for x in [-360,-300,-240,-180,-120,-60,0,60,120])),
'trama':(96,96,''.join(line(x,0,x,96,M,1) for x in [12,20,60,68])+''.join(line(0,y,96,y,A,1) for y in [12,20,60,68]))}
for name,(w,h,body) in tiles.items(): svg(name,w,h,body,P,folder='padroes')
def pattern(name,w,h,opacity=1):
    tw,th,body=tiles[name]
    return f'<defs><pattern id="p-{name}" width="{tw}" height="{th}" patternUnits="userSpaceOnUse">{body}</pattern></defs><rect width="{w}" height="{h}" fill="url(#p-{name})" opacity="{opacity}"/>'
for name in tiles:svg('estampa-'+name,900,700,pattern(name,900,700),folder='artes')
svg('cartao-frente',900,500,logo(165,95,570,'principal-negativo'),M)
svg('cartao-verso',900,500,text('Um presente.',65,125,64,'serif')+text('Muitas páginas pela frente.',65,190,54,'serif')+line(65,260,835,260,A,2)+text('CADERNOS, PAPEL E PRESENÇA',65,320,22,'bold',spacing=2)+text('lumedepapel.example',65,405,27),P)
svg('tag',450,650,logo(72,80,310)+text('Para',50,350,26)+line(120,355,395,355,A)+text('De',50,440,26)+line(120,445,395,445,A)+text('O cuidado que fica.',50,565,35,'serif'),P)
svg('etiqueta',550,200,text('ENTRELINHAS',35,70,24,'bold',spacing=3)+text('Um lugar para o que importa.',35,122,32,'serif')+text('LUME DE PAPEL',35,169,16,'sans',spacing=2),P)
svg('cartao-presente',1480,1050,logo(90,55,400)+text('Tem um pouco de mim',90,410,82,'serif')+text('neste presente para você.',90,510,82,'serif')+''.join(line(90,y,1390,y,A,1.6) for y in [640,750,860])+text('O cuidado que fica.',90,970,35,'serif'),P)
svg('papel-timbrado',840,1188,logo(62,50,265)+text('Papel para começar.',62,270,48,'serif')+text('Cuidado para continuar.',62,327,48,'serif')+text('Uma boa ideia merece espaço.',62,430,23)+text('Por aqui, deixamos margem para o que vem depois.',62,475,23)+line(62,1080,778,1080,A)+text('LUME DE PAPEL',62,1124,15,'bold',spacing=1.5)+text('lumedepapel.example',778,1124,17,anchor='end'),P)
svg('capa-entrelinhas',700,1000,text('ENTRELINHAS',350,230,34,'sans',P,4,'middle')+text('O que fica',350,338,82,'serif',P,anchor='middle')+text('em você.',350,425,82,'serif',P,anchor='middle')+line(105,510,595,510,A,2)+logo(185,710,330,'principal-negativo'))
svg('sacola-impressao',900,750,logo(145,140,610,'principal-negativo')+text('O cuidado que fica.',450,535,44,'serif',P,anchor='middle'))
svg('caixa-impressao',800,500,logo(150,90,500,'principal-negativo')+text('O cuidado que fica.',400,390,38,'serif',P,anchor='middle'))
svg('ecobag-impressao',700,650,text('Leve',75,170,140,'serif')+text('o que',75,305,140,'serif')+text('fica.',75,440,140,'serif')+logo(75,490,380))
svg('cartaz-cidade',700,1000,logo(55,30,320)+text('Nem tudo',55,310,89,'serif')+text('cabe numa',55,400,89,'serif')+text('mensagem.',55,490,89,'serif')+text('Algumas coisas pedem papel.',55,590,29)+line(55,660,645,660,A,2)+text('CADERNOS ENTRELINHAS',55,744,21,'bold',spacing=2)+text('O cuidado que fica.',55,811,44,'serif')+text('lumedepapel.example',55,934,22),P)
svg('cartaz-vitrine',600,1000,text('PARA PRESENTEAR',60,115,20,'bold',spacing=3)+text('Antes da',60,280,88,'serif')+text('primeira',60,370,88,'serif')+text('página,',60,460,88,'serif')+text('o carinho.',60,550,88,'serif')+line(60,615,540,615,A,2)+text('Conheça Entrelinhas.',60,690,32,'serif')+logo(60,785,420),P)
svg('bilhete',600,400,text('Pensei',65,140,82,'serif')+text('em você.',65,225,82,'serif')+logo(65,260,270),P)
print('4 padrões, 15 artes vetoriais e 3 fontes WOFF2 gerados.')


svg('assinatura-frase',400,65,text('O cuidado que fica.',0,43,40,'serif'))
