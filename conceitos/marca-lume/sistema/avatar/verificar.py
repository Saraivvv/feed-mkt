from pathlib import Path
import hashlib
import json
import re
import xml.etree.ElementTree as ET
from PIL import Image

R = Path(__file__).resolve().parents[2]
baseline = json.loads((R/'sistema/revisao/preservados.json').read_text())
substituidos = {'avatar-ld.svg','monograma-positivo.svg','monograma-negativo.svg','monograma-mono.svg'}
preservados = []
for name, digest in baseline.items():
    p = R/name
    if p.name in substituidos: continue
    assert hashlib.sha256(p.read_bytes()).hexdigest() == digest, name
    preservados.append(name)
assert (R/'medir.mjs').read_bytes() == (R.parent/'_comum/medir.mjs').read_bytes()
avatar = (R/'logo/avatar.svg').read_bytes()
assert avatar == (R/'kit-site/avatar.svg').read_bytes() == (R/'logo/avatar-ld.svg').read_bytes()
svg = ET.fromstring(avatar)
assert svg.get('viewBox') == '0 0 320 320'
assert list(svg)[0].get('fill') == '#1F4D45'
original = ET.parse(R/'logo/simbolo-positivo.svg')
assert list(svg)[1].get('d') in [e.get('d') for e in original.iter()]
for p in R.rglob('*.svg'):
    text = p.read_text(encoding='utf-8')
    assert '<!DOCTYPE' not in text.upper(), p
    assert not re.search('[\u2013\u2014]', text), p
    assert not any(e.get('aria-label') in ['LD','MONOGRAMA LD'] for e in ET.fromstring(text).iter()), p
for size in [80,160]:
    assert Image.open(R/f'kit-site/avatar-{size}.webp').size == (size,size)
for width in [390,1440]:
    assert Image.open(R/f'capturas/avatar-secao-{width}.png').width == width
assert Image.open(R/'fotos/celular.webp').size == (1536,1024)
assert Image.open(R/'artes/tela-instagram.png').size == (430,916)
assert 'o mesmo avatar no Hub' not in (R/'index.html').read_text(encoding='utf-8')
manifest = json.loads((R/'sistema/publicacao-astra.json').read_text())
for item in manifest['files']:
    assert (R/item['file']).stat().st_size == item['bytes'], item['file']
report = {'preservados':preservados,'simbolo_original':True,'avatar_svg_identico_no_kit':True,'ld_em_svg':0,'tamanhos_webp':[80,160],'capturas':[390,1440],'arquivos_pagina':len(manifest['files']),'bytes_pagina':manifest['bytes']}
(R/'sistema/avatar/verificacao.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
print(f'AVATAR 0 achados: {len(preservados)} arquivos originais preservados, SVGs sem LD, exportações e capturas corretas.')
