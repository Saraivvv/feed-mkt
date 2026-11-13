from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[2]
flame = 'M48 2C45 24 21 35 14 56C5 83 22 105 47 111C30 92 28 72 42 56C38 76 44 91 49 99C58 87 66 73 59 56C72 66 78 81 67 99C90 86 91 65 80 46C72 32 58 18 48 2Z'
mark = f'<path d="{flame}" transform="translate(72 51) scale(1.8)" fill="#F4EFE4"/>'
avatar = f'<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 320 320" role="img" aria-label="Lume de Papel, chama em Papel sobre Mata"><rect width="320" height="320" fill="#1F4D45"/>{mark}</svg>\n'
for name in ['logo/avatar.svg', 'logo/avatar-ld.svg', 'kit-site/avatar.svg']:
    (ROOT/name).write_text(avatar, encoding='utf-8')

for name in ['artes/perfil-instagram.html', 'sistema/revisao/social.mjs']:
    p = ROOT/name
    s = p.read_text(encoding='utf-8').replace('../logo/avatar-ld.svg', '../logo/avatar.svg')
    s = s.replace('.avatar{width:76px;height:76px}', '.avatar{width:76px;height:76px;border-radius:50%}')
    s = s.replace('class="avatar" src="../logo/avatar.svg">', 'class="avatar" src="../logo/avatar.svg" alt="Chama da Lume de Papel">')
    p.write_text(s, encoding='utf-8')

section = '''<section class="avatar-system" id="avatar" aria-labelledby="avatar-title">
<div class="avatar-heading"><div><p class="eyebrow">A chama, de perto</p><h3 id="avatar-title">Antes do nome,<br>o reconhecimento.</h3></div><p>A mesma chama da assinatura, em Papel sobre Mata. Uma presença nítida entre perfis, mensagens e páginas abertas.</p></div>
<div class="avatar-contexts">
<figure class="avatar-instagram"><figcaption>01 / Instagram <span>Perfil da marca</span></figcaption><div class="ig-sample"><div class="ig-top"><b>lumedepapel.example</b><span aria-hidden="true">···</span></div><div class="ig-profile"><img class="brand-avatar" src="logo/avatar.svg" width="110" height="110" alt="Avatar da Lume no perfil do Instagram"><div><strong>Lume de Papel</strong><p>Papelaria e presentes</p><span class="ig-follow">Seguir</span></div></div><p class="ig-bio">O cuidado que fica.<br>Cadernos Entrelinhas, papel e presença.</p><div class="ig-tabs"><b>Publicações</b><span>Reels</span><span>Marcados</span></div><div class="ig-preview"><img src="artes/post-01.webp" width="1080" height="1350" alt="Caderno Entrelinhas"><img src="artes/post-02.webp" width="1080" height="1350" alt="Caixa de presente"><img src="artes/post-03.webp" width="1080" height="1350" alt="Sacola Lume"></div></div></figure>
<div class="avatar-services"><figure class="avatar-whatsapp"><figcaption>02 / WhatsApp <span>A conversa começa aqui</span></figcaption><div class="wa-sample"><div class="wa-header"><span class="wa-back" aria-hidden="true">‹</span><img class="brand-avatar" src="logo/avatar.svg" width="40" height="40" alt="Avatar da Lume na conversa"><div><strong>Lume de Papel</strong><small>Agente Lume · assistente virtual</small></div><span class="wa-menu" aria-hidden="true">⋮</span></div><div class="wa-message">Oi, Lia. Para quem é o presente?<small>09:41</small></div></div></figure>
<figure class="avatar-google"><figcaption>03 / Google <span>Resultado patrocinado</span></figcaption><div class="google-sample"><b class="sponsored">Patrocinado</b><div class="google-identity"><img class="brand-avatar" src="logo/avatar.svg" width="32" height="32" alt="Avatar da Lume no Google"><div><strong>Lume de Papel</strong><small>lumedepapel.example</small></div><span aria-hidden="true">⋮</span></div><p class="google-title">Um presente. Muitas páginas pela frente.</p><p class="google-copy">Conheça os cadernos Entrelinhas. Capas em azul ou verde, com espaço para uma dedicatória.</p></div></figure>
<figure class="avatar-browser"><figcaption>04 / Navegador <span>Favicon</span></figcaption><div class="browser-sample"><div class="browser-tab"><img src="logo/avatar.svg" width="16" height="16" alt="Favicon da Lume"><span>Lume de Papel</span><span aria-hidden="true">×</span></div><div class="browser-address">lumedepapel.example</div></div></figure></div></div>
<p class="avatar-hub">No Feed Hub, a empresa de demonstração mostra as iniciais LD até a foto da marca ser enviada.</p>
<div class="avatar-ruler"><div class="avatar-sizes"><div class="ruler-heading"><p class="eyebrow">Régua de redução</p><p>Um desenho.<br>Quatro escalas reais.</p></div><div class="small-sizes"><figure><img class="brand-avatar" src="logo/avatar.svg" width="32" height="32" alt="Avatar em 32 pixels"><figcaption>32 px</figcaption></figure><figure><img class="brand-avatar" src="logo/avatar.svg" width="40" height="40" alt="Avatar em 40 pixels"><figcaption>40 px</figcaption></figure><figure><img class="brand-avatar" src="logo/avatar.svg" width="110" height="110" alt="Avatar em 110 pixels"><figcaption>110 px</figcaption></figure></div><p class="ruler-note">O fundo ocupa todo o quadrado. A chama tem 61% da altura, com posição ajustada ao peso da base e respiro para o recorte circular.</p></div><figure class="size-master"><img class="brand-avatar" src="logo/avatar.svg" width="320" height="320" alt="Avatar em 320 pixels, recorte circular"><figcaption>320 px <span>Matriz de proporção</span></figcaption></figure></div>
<p class="note">Aplicações conceituais para este caderno. A assinatura principal, a paleta e as fontes locais permanecem as mesmas.</p>
</section>'''
p = ROOT/'index.html'
s = p.read_text(encoding='utf-8').replace('href="logo/simbolo-positivo.svg"', 'href="logo/avatar.svg"')
s = s.replace('<div><img src="logo/avatar-ld.svg" alt="Avatar LD verde Lume" width="120" height="120"><p>LD / o mesmo avatar no Hub.</p></div>', '')
s = s.replace('Símbolo e LD: 24 px ou 6 mm.', 'Símbolo: 24 px ou 6 mm. Avatar: 32 px; favicon: 16 px, conferido no navegador.')
if 'id="avatar"' not in s:
    s = s.replace('<details class="rules">', section+'\n<details class="rules">')
p.write_text(s, encoding='utf-8')

# Atualiza as aplicações vetoriais antigas, inclusive a grade que embute o post 09.
def badge(x, y, size):
    return f'<svg x="{x}" y="{y}" width="{size}" height="{size}" viewBox="0 0 320 320" aria-label="Avatar Lume"><circle cx="160" cy="160" r="160" fill="#1F4D45"/>{mark}</svg>'
for name in ['originais/google-negocio.svg','originais/instagram-grade.svg','originais/instagram-post-09.svg','originais/whatsapp-agente.svg','sistema/assinaturas.svg']:
    p = ROOT/name
    s = p.read_text(encoding='utf-8')
    replacement = badge(0, 0, 160)
    if 'instagram-' in name: replacement = badge(128, 652, 90)
    if 'whatsapp-' in name:
        replacement = badge(28, 32, 88)
        s = s.replace('<circle cx="72" cy="76" r="44" fill="#3F998B"', '<circle cx="72" cy="76" r="44" fill="#1F4D45"')
    s = re.sub(r'<g fill="[^"]+" aria-label="LD">.*?</g>', lambda m: replacement, s, flags=re.S)
    p.write_text(s, encoding='utf-8')

# Nomes antigos continuam resolvendo, mas deixam de distribuir as letras LD.
for variant, color in [('positivo','#1F4D45'),('negativo','#F4EFE4'),('mono','#1F4D45')]:
    (ROOT/f'logo/monograma-{variant}.svg').write_text(f'<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 320 320" role="img" aria-label="Símbolo Lume, substitui o monograma anterior">{mark.replace("#F4EFE4",color)}</svg>\n', encoding='utf-8')

# Reaproveita somente o conversor local de letras, sem executar as gerações da rodada anterior.
source = (ROOT/'sistema/revisao/vetores.py').read_text(encoding='utf-8').split('tiles={')[0]
scope = {}
exec(source, scope)
for name, old, new, x, y, size in [
    ('sistema/assinaturas.svg','MONOGRAMA LD','AVATAR / CHAMA',1000.727,899,12),
    ('sistema/protecao-minimos.svg','Abaixo disso, usar apenas LD simplificado.','Em perfis, usar o avatar da chama.',795,837,18),
]:
    p = ROOT/name
    s = p.read_text(encoding='utf-8')
    match = re.search(r'<g ([^>]*?)aria-label="(?:'+re.escape(old)+'|'+re.escape(new)+r')"[^>]*>.*?</g>',s,re.S)
    if match:
        # Posição e tamanho em pixels da legenda original, com fonte local de 2000 UPM.
        s = s[:match.start()]+scope['text'](new,x,y,size)+s[match.end():]
        p.write_text(s,encoding='utf-8')
print('Avatar e aplicações vetoriais atualizados.')
