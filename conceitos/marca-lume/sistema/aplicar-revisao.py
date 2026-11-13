from pathlib import Path
import re, shutil
R=Path(__file__).resolve().parents[1]
S=R/'sistema/revisao'

# Preserva a geometria dos dois logos fornecidos.
(R/'marca-feed').mkdir(exist_ok=True)
feed=(R.parent/'_comum/LOGO PRETA FEED.svg').read_text(encoding='utf8')
feed=re.sub(r'<!DOCTYPE[^>]*(?:\[[\s\S]*?\]\s*)?>','',feed,flags=re.I)
(R/'marca-feed/horizontal-preta.svg').write_text(feed,encoding='utf8')
shutil.copyfile(R.parent/'_comum/feed-logo-simples-branca.png',R/'marca-feed/horizontal-branca.png')

p=R/'brandbook.css'; s=p.read_text(encoding='utf8')
s=s.replace('Cormorant','"EB Garamond"').replace('fontes/serif-astra.woff2','fontes/eb-garamond-400-latin.woff2')
s=s.replace('font-weight:500','font-weight:400').replace('font:500 ','font:400 ')
s=s.replace('.feed{font-size:38px;font-weight:800;letter-spacing:-2px;line-height:1;', '.feed{line-height:1;')
s=s.replace('.feed span{font-size:9px;line-height:1.5;letter-spacing:2px;font-weight:650;max-width:100px}', '.feed>img{width:106px;height:auto}.feed span{font-size:11px;line-height:1.4;letter-spacing:0;font-weight:450;max-width:150px}')
s=s.replace('.feed{font-size:34px;gap:12px}.feed span{font-size:8px;max-width:70px;letter-spacing:1px}', '.feed{gap:12px}.feed>img{width:80px}.feed span{font-size:10px;max-width:92px;letter-spacing:0}')
s=s.replace('.credit{font:', '.credit{display:flex;align-items:center;gap:16px;flex-wrap:wrap;font:')
s += '\n.credit img{width:108px;height:auto;display:inline-block}.masthead .feed{flex-shrink:0}.masthead{gap:16px}\n'
p.write_text(s,encoding='utf8')
p=R/'index.html'; s=p.read_text(encoding='utf8')
s=s.replace('>feed<span>ESTÚDIO DE MARCA</span>', '><img src="marca-feed/horizontal-preta.svg" alt="Feed"><span>Branding e identidade visual</span>')
s=s.replace('FEED / BRANDING','BRANDING / IDENTIDADE')
s=s.replace('Projeto autoral da Feed</p>','Projeto autoral da <img src="marca-feed/horizontal-branca.png" alt="Feed"></p>')
s=s.replace('CORMORANT GARAMOND / 500','EB GARAMOND / 400').replace('CORMORANT 500','EB GARAMOND 400').replace('Cormorant 500','EB Garamond 400')
s=s.replace('A capa usa Cormorant para a frase e Manrope para a coleção.', 'A capa usa EB Garamond 400 para a frase e Manrope para a coleção. A EB Garamond substitui a Cormorant nos textos por manter os acentos do português próximos às letras; a Cormorant permanece apenas no desenho original do logo, em contorno.')
s=s.replace('Palavras<br>que ficam.', 'Páginas<br>para você.')
s=s.replace('título de 78 px, apoio de 25 px e margem lateral de 66 px.', 'título de 74 px, apoio de 24 px e margem lateral de 58 px.')
s=s.replace('Título de 78 px, apoio de 25 px. Área de texto própria, sem disputar leitura com a fotografia.', 'Título de 74 px, apoio de 24 px. A fotografia ocupa o espaço restante; a faixa editorial acompanha a altura do texto, sem sobra vazia.')
s=s.replace('A assinatura entregue em HTML usa tabela, imagem PNG e fontes de sistema para compatibilidade.', 'A assinatura entregue em HTML usa tabela e a frase serifada em imagem, preservando a EB Garamond nos leitores de e-mail.')
p.write_text(s,encoding='utf8')

p=S/'social.mjs'; s=p.read_text(encoding='utf8')
s=s.replace('Cormorant','EBGaramond').replace('../fontes/serif-astra.woff2','../fontes/eb-garamond-400-latin.woff2').replace('font:500 ','font:400 ')
s=s.replace("'<section class=\"post\" id=", "'<section class=\"post\" id=")
s=s.replace('<img class="mark" src="../logo/simbolo-positivo.svg" alt="">','')
s=s.replace('position:relative;margin-bottom:40px;overflow:hidden}.photo{height:860px}', 'position:relative;margin-bottom:40px;overflow:hidden;display:flex;flex-direction:column}.photo{flex:1;min-height:0}')
s=s.replace('.caption{padding:55px 66px;position:relative}', '.caption{padding:35px 58px 40px;flex:none}')
s=s.replace('.caption span{font-size:18px;letter-spacing:3px}', '.caption span{font-size:16px;letter-spacing:2.4px}')
s=s.replace('.caption h1{font:400 78px/1.04 EBGaramond;max-width:850px;margin:30px 0 25px}', '.caption h1{font:400 74px/1.04 EBGaramond;max-width:964px;margin:16px 0 14px}')
s=s.replace('.caption p{font-size:25px}', '.caption p{font-size:24px;line-height:1.4}')
s=s.replace('<span style="font-family:Georgia,serif;font-size:17px">O cuidado que fica.</span>', '<img src="assinatura-frase.png" width="180" alt="O cuidado que fica.">')
s=s.replace("fs.writeFileSync(R+'/artes/assinatura-email.html',signature);", "fs.writeFileSync(R+'/artes/assinatura-email.html',signature);await sharp(R+'/artes/assinatura-frase.svg').resize(360).png().toFile(R+'/artes/assinatura-frase.png');")
p.write_text(s,encoding='utf8')

p=S/'vetores.py'; s=p.read_text(encoding='utf8')
s += "\nsvg('assinatura-frase',400,65,text('O cuidado que fica.',0,43,40,'serif'))\n"
p.write_text(s,encoding='utf8')

p=R/'kit-site/tokens.css'; s=p.read_text(encoding='utf8')
s=s.replace('Cormorant Garamond','EB Garamond').replace('../fontes/CormorantGaramond[wght].ttf','../fontes/eb-garamond-400-latin.woff2').replace('format("truetype");font-weight:300 700','format("woff2");font-weight:400')
p.write_text(s,encoding='utf8')
print('EB Garamond 400 aplicada ao brandbook, fontes das artes e kit. Logos Feed reais copiados. Faixa dos posts agora acompanha o texto.')
