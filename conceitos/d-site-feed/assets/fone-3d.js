/* Aparelho 3D do site da Feed (Three.js, carregado pelo importmap do fim do index.html).
   - Um contexto WebGL só, fora da página: cada aparição é desenhada nele e copiada para o canvas 2D dela.
   - Só acorda o que está perto da tela e só desenha quando a pose ou a tela mudam.
   - A página põe a classe "f3d" no <html> antes do primeiro aparelho. Se algo falhar aqui, a classe sai
     e volta o aparelho em imagem, que continua na página (é também o que o leitor de tela lê).
   A rolagem e o mouse continuam sendo lidos pelo script da página, que fala com este arquivo pelo objeto
   window.fone3d (pos, s, ent, pede, refaz) e pelos alvos de inclinação guardados em cada .fone (_mola). */
(async () => {
  'use strict';
  const raiz = document.documentElement, F3 = window.fone3d || (window.fone3d = {});
  if (!raiz.classList.contains('f3d')) return;
  const desiste = () => { F3.on = false; raiz.classList.remove('f3d'); F3.refaz && F3.refaz(); };
  const demora = setTimeout(() => raiz.classList.remove('f3d'), 7000); // rede lenta: mostra a imagem enquanto o 3D não chega

  let T, RoomEnvironment, RoundedBoxGeometry, junta, renderer;
  try {
    [T, { RoomEnvironment }, { RoundedBoxGeometry }, { mergeGeometries: junta }] = await Promise.all([
      import('three'), import('three/addons/environments/RoomEnvironment.js'),
      import('three/addons/geometries/RoundedBoxGeometry.js'), import('three/addons/utils/BufferGeometryUtils.js')]);
    renderer = new T.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch (_) { clearTimeout(demora); return desiste(); }
  const gl = renderer.domElement;
  gl.addEventListener('webglcontextlost', desiste); // ponytail: contexto perdido volta para a imagem e não tenta de novo; religar se isso aparecer em aparelho real
  renderer.setPixelRatio(1);
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = .95;

  const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const suave = t => t * t * (3 - 2 * t);
  const GRAU = Math.PI / 180;

  // ---------- medidas do aparelho, em milímetros ----------
  // A espessura é estilizada, como em render de anúncio de celular (o aparelho real teria 8,6 mm): com 8,6 e de frente ele lia como folha.
  const W = 71.5, H = 154.6, D = 14.5, R = 12, B = 3.4;       // corpo e o raio do ombro do aro (a lateral é uma faixa reta de D - 2B com os dois ombros redondos)
  const TW = 66.5, TH = TW * 2.25, TR = 9.6;                 // tela 4:9 (1080 x 2430)
  const ZV = D / 2 + .12;                                    // altura do vidro, na frente e nas costas
  const DIST = 280;                                          // câmera perto (28 cm): a borda de cá fica uns 15% mais alta que a de lá, perspectiva de verdade
  const P = 34, PX = 8;                                      // a pose de repouso, em graus: três quartos, com a lateral sempre à vista (ver alvos)
  const MX = .45, MY = .13;                                  // folga do canvas em volta do aparelho (igual à do fone-3d.css)

  // ---------- geometria ----------
  const cantos = (w, h, r) => { const s = new T.Shape(), x = w / 2, y = h / 2; s.absarc(x - r, y - r, r, 0, Math.PI / 2); s.absarc(-x + r, y - r, r, Math.PI / 2, Math.PI); s.absarc(-x + r, -y + r, r, Math.PI, Math.PI * 1.5); s.absarc(x - r, -y + r, r, Math.PI * 1.5, Math.PI * 2); return s; };
  const tampa = (w, h, r, z) => new T.ShapeGeometry(cantos(w, h, r), 14).translate(0, 0, z);
  // contorno de um retângulo de cantos redondos: [x, y, normal x, normal y], no sentido anti-horário
  const contorno = (w, h, r, n = 14) => { const P = []; [[1, 1], [-1, 1], [-1, -1], [1, -1]].forEach(([sx, sy], q) => { for (let i = 0; i <= n; i++) { const a = (q + i / n) * Math.PI / 2; P.push([sx * (w / 2 - r) + Math.cos(a) * r, sy * (h / 2 - r) + Math.sin(a) * r, Math.cos(a), Math.sin(a)]); } }); return P; };
  // casca: varre um perfil [recuo, z, peso da normal no plano, peso da normal em z] ao longo de um contorno
  function casca(C, perfil, fechado = true) {
    const pos = [], nor = [], uv = [], idx = [], m = C.length;
    let comp = 0;
    const u = C.map((p, i) => { if (i) comp += Math.hypot(p[0] - C[i - 1][0], p[1] - C[i - 1][1]); return comp / 40; });
    perfil.forEach(([o, z, nr, nz], j) => C.forEach(([x, y, nx, ny], i) => { pos.push(x - nx * o, y - ny * o, z); nor.push(nx * nr, ny * nr, nz); uv.push(u[i], j / (perfil.length - 1)); }));
    for (let j = 0; j < perfil.length - 1; j++) for (let i = 0; i < (fechado ? m : m - 1); i++) { const a = j * m + i, b = j * m + (i + 1) % m; idx.push(a, b, a + m, b, b + m, a + m); }
    const g = new T.BufferGeometry();
    g.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); g.setAttribute('normal', new T.Float32BufferAttribute(nor, 3)); g.setAttribute('uv', new T.Float32BufferAttribute(uv, 2));
    g.setIndex(idx);
    return g;
  }
  const arco = (n, f) => Array.from({ length: n + 1 }, (_, i) => f(i / n * Math.PI / 2));
  const disco = (r, x, y, z, n = 28) => new T.CircleGeometry(r, n).translate(x, y, z);
  const torno = (pts, x, y, z) => new T.LatheGeometry(pts.map(p => new T.Vector2(p[0], p[1])), 40).rotateX(Math.PI / 2).translate(x, y, z);

  // o aro de metal: uma faixa reta entre dois ombros redondos. A faixa é sombreada como se fosse um pouco abaulada (BOJO, em radianos):
  // numa chapa reta a luz vira um chapado de uma cor só; com a normal abrindo de -BOJO a +BOJO ela vira um risco que corre pela lateral
  const BOJO = .28, Q = Math.PI / 2;
  const ombro = s => arco(9, a => { const n = BOJO + a * (1 - BOJO / Q); return [B - B * Math.cos(a), s * (D / 2 - B + B * Math.sin(a)), Math.cos(n), s * Math.sin(n)]; });
  const quinas = [...ombro(-1).reverse(), ...[-.5, 0, .5].map(t => [0, t * (D / 2 - B), Math.cos(t * BOJO), Math.sin(t * BOJO)]), ...ombro(1)];
  const gAro = casca(contorno(W, H, R, 16), [[B + 1.5, -D / 2, 0, -1], ...quinas, [B + 1.5, D / 2, 0, 1]]);
  // a lâmina de vidro (frente; a das costas é a mesma, virada)
  const V = 1.75, E = .32;                                   // o vidro começa onde o ombro do aro já está quase na altura dele
  const gVidro = junta([casca(contorno(W - 2 * V, H - 2 * V, R - V, 16), [[0, D / 2 - .9, 1, 0], ...arco(4, a => [E - E * Math.cos(a), ZV - E + E * Math.sin(a), Math.cos(a), Math.sin(a)])]), tampa(W - 2 * V - 2 * E, H - 2 * V - 2 * E, R - V - E, ZV)]);
  const gTela = tampa(TW, TH, TR, ZV + .02);
  { const p = gTela.attributes.position, u = gTela.attributes.uv; for (let i = 0; i < p.count; i++) u.setXY(i, p.getX(i) / TW + .5, p.getY(i) / TH + .5); }
  const camY = TH / 2 - 3.5;                                 // a câmera frontal, no meio da barra de status
  const gFuro = disco(1.8, 0, camY, ZV + .04), gFuroLente = disco(.65, 0, camY, ZV + .05);


  // botões: energia à direita; ação e os dois de volume à esquerda
  const botao = (lado, y, c) => new RoundedBoxGeometry(1.9, c, D * .34, 4, .9).translate(lado * (W / 2 + .15), y, 0);
  const gBotoes = junta([botao(1, 26, 18), botao(-1, 48, 7), botao(-1, 33, 11.5), botao(-1, 18.5, 11.5)]);
  // linhas de antena: tiras de 1 mm que abraçam o aro, um fio para fora
  const tira = quinas.map(([o, z, nr, nz]) => [o - .035, z, nr, nz]), ya = H / 2 - 19, xa = W / 2 - 18;
  const gAntenas = junta([
    ...[ya, -ya].flatMap(y => [casca([[W / 2, y - .5, 1, 0], [W / 2, y + .5, 1, 0]], tira, false), casca([[-W / 2, y + .5, -1, 0], [-W / 2, y - .5, -1, 0]], tira, false)]),
    casca([[xa + .5, H / 2, 0, 1], [xa - .5, H / 2, 0, 1]], tira, false), casca([[-xa - .5, -H / 2, 0, -1], [-xa + .5, -H / 2, 0, -1]], tira, false), casca([[xa - .5, -H / 2, 0, -1], [xa + .5, -H / 2, 0, -1]], tira, false)]);
  // embaixo: a entrada USB-C, os furos do som e os dois parafusos
  const chao = g => g.rotateX(Math.PI / 2).translate(0, -H / 2 - .03, 0);
  const gFuros = junta([chao(new T.ShapeGeometry(cantos(9.2, 3.3, 1.65), 8)), ...[0, 1, 2, 3].flatMap(k => [chao(disco(.8, 12.4 + k * 2.7, 0, 0, 12)), chao(disco(.8, -12.4 - k * 2.7, 0, 0, 12))])]);
  const gParafusos = junta([chao(disco(.65, 7.2, 0, 0, 12)), chao(disco(.65, -7.2, 0, 0, 12))]);
  // costas (desenhadas olhando para elas; o grupo é virado depois): a ilha das câmeras no alto, à esquerda
  const IX = -(W / 2 - 5.5 - 17.5), IY = H / 2 - 5.5 - 18, IL = 35, IA = 36, ZI = ZV + 1.5;
  const gIlha = junta([casca(contorno(IL, IA, 10, 12), [[0, ZV - .1, 1, 0], ...arco(5, a => [.7 - .7 * Math.cos(a), ZI - .7 + .7 * Math.sin(a), Math.cos(a), Math.sin(a)])]), tampa(IL - 1.4, IA - 1.4, 9.3, ZI)]).translate(IX, IY, 0);
  const LENTES = [[-7.9, 8.2], [-7.9, -8.2], [7.3, 0]].map(([x, y]) => [IX + x, IY + y]);
  const gAneis = junta([...LENTES.map(([x, y]) => torno([[7.45, -.2], [7.45, 1.9], [7.05, 2.35], [6.35, 2.35], [5.95, 1.95], [5.95, 1.5]], x, y, ZI)), torno([[3.1, -.1], [3.1, .45], [2.85, .7], [2.45, .7], [2.45, .2]], IX + 7.6, IY + 10.2, ZI)]);
  const gCanos = junta(LENTES.map(([x, y]) => torno([[5.95, 1.5], [5, 1.05], [5, .9], [4.1, .5], [4.1, .35], [3.2, .08]], x, y, ZI))); // o cano da lente desce em degraus, acima da ilha
  const gCristais = junta(LENTES.map(([x, y]) => new T.SphereGeometry(5.3, 28, 10, 0, Math.PI * 2, 0, .6485).rotateX(Math.PI / 2).translate(x, y, ZI + .08 - 4.225)));
  const gTampas = junta(LENTES.map(([x, y]) => disco(5.95, x, y, ZI + 1.5)));
  const gFlash = disco(2.45, IX + 7.6, IY + 10.2, ZI + .25), gSensor = disco(2.3, IX + 7.6, IY - 10.2, ZI + .03);

  // ---------- materiais ----------
  const fis = o => new T.MeshPhysicalMaterial(o);
  const mAro = fis({ color: 0x87827a, metalness: 1, roughness: .34, anisotropy: .6, envMapIntensity: .8 }); // titânio escovado no sentido do comprimento
  const mBotao = fis({ color: 0xa8a299, metalness: 1, roughness: .26 });
  const mAnel = fis({ color: 0xb9b3a9, metalness: 1, roughness: .18, side: T.DoubleSide });
  const mAntena = fis({ color: 0x6f6b65, metalness: .2, roughness: .55 });
  // o vidro da frente só reflete o ambiente, e com teto: uma luz pontual num vidro liso vira uma bola branca em cima do texto,
  // e o painel de luz da sala, refletido inteiro, apaga o topo da tela. Com o teto fica o desenho do reflexo, sem estourar.
  const vidroCalmo = m => { m.onBeforeCompile = s => { s.fragmentShader = s.fragmentShader.replace('#include <lights_fragment_end>', '#include <lights_fragment_end>\nreflectedLight.directSpecular = vec3( 0.0 );\nclearcoatSpecularDirect = vec3( 0.0 );\nreflectedLight.indirectSpecular = min( reflectedLight.indirectSpecular, vec3( 0.1 ) );\nclearcoatSpecularIndirect = min( clearcoatSpecularIndirect, vec3( 0.1 ) );'); }; m.customProgramCacheKey = () => 'vidroCalmo'; return m; };
  const mVidro = vidroCalmo(fis({ color: 0x030304, roughness: .1, clearcoat: 1, clearcoatRoughness: .03 }));
  const mCostas = fis({ color: 0xa8a299, roughness: .45, metalness: .15, clearcoat: 1, clearcoatRoughness: .32 }); // vidro fosco
  const mIlha = fis({ color: 0xa8a299, roughness: .22, metalness: .15, clearcoat: 1, clearcoatRoughness: .08 });
  const mCano = fis({ color: 0x1b1b1e, roughness: .38, metalness: .5, side: T.DoubleSide });
  const mCristal = fis({ color: 0x0a1230, roughness: .08, metalness: .5, clearcoat: 1, iridescence: 1, iridescenceIOR: 1.9, iridescenceThicknessRange: [240, 520] });
  const mTampa = fis({ color: 0x000000, roughness: .04, envMapIntensity: 1.8, transparent: true, blending: T.AdditiveBlending, depthWrite: false }); // o cristal por cima da lente: só o reflexo
  const mFlash = fis({ color: 0xf3e2b3, roughness: .45, emissive: 0x33290f });
  const mPreto = fis({ color: 0x050506, roughness: .3, clearcoat: 1 });
  const mFuro = new T.MeshBasicMaterial({ color: 0x000000 });
  const mLente = fis({ color: 0x05060b, roughness: .35, envMapIntensity: .12 });
  const mBuraco = fis({ color: 0x040404, roughness: .6 });

  // ---------- luz: a sala de estúdio como ambiente (as luzes de cada cena são criadas no acorda) ----------
  const pmrem = new T.PMREMGenerator(renderer);
  const sala = new RoomEnvironment();
  sala.traverse(o => { if (o.isPointLight) o.intensity *= .55; }); // sala mais escura: os painéis de luz aparecem no metal como faixas, em vez de um branco só
  const ambiente = pmrem.fromScene(sala, .03).texture;
  pmrem.dispose();
  const anis = Math.min(8, renderer.capabilities.getMaxAnisotropy());

  // a sombra: uma mancha macia numa parede logo atrás do aparelho
  const cs = document.createElement('canvas'); cs.width = 128; cs.height = 256;
  { const x = cs.getContext('2d'); x.shadowColor = '#fff'; x.shadowBlur = 26; x.shadowOffsetY = 600; x.fillStyle = '#fff'; x.fillRect(40, 62 - 600, 48, 132); }
  const tSombra = new T.CanvasTexture(cs);
  const gSombra = new T.PlaneGeometry(W * 128 / 48, H * 256 / 132);
  // a sombra de contato: a pegada do aparelho no chão, logo abaixo dele (é o que dá peso; gira junto com o corpo)
  const cc = document.createElement('canvas'); cc.width = 128; cc.height = 64;
  { const x = cc.getContext('2d'); x.shadowColor = '#fff'; x.shadowBlur = 11; x.shadowOffsetY = 300; x.fillStyle = '#fff'; x.fillRect(26, 23 - 300, 76, 18); }
  const tChao = new T.CanvasTexture(cc);
  const gChao = new T.PlaneGeometry(W * 128 / 76, D * 64 / 18).rotateX(-Math.PI / 2);

  const imagens = new Map();
  const carrega = src => imagens.get(src) || imagens.set(src, new Promise((ok, erro) => { const im = new Image(); im.onload = () => ok(im); im.onerror = erro; im.src = src; })).get(src);

  // medidas tiradas por gera-telas-3d.mjs (rode de novo se mudar o texto dessas telas no HTML)
  const FEED_TOPO = 0.0814; // quanto da altura da imagem do anúncio é a faixa fixa do topo
  const CHAT = { msgs: [[0.1681, 0.1233], [0.2914, 0.1233], [0.4147, 0.0953], [0.5101, 0.1233], [0.6334, 0.1817]], campo: 0.9272, fundo: 'rgb(207, 217, 216)' };
  const QUANDO = [-1, .12, .42, .68, 1.12]; // em que ponto do palco cada mensagem entra (o mesmo do script da página)

  function novoFone(el, cena, sombra) {
    const g = new T.Group(), costas = new T.Group();
    const mTela = vidroCalmo(fis({ color: 0x000000, emissive: 0xffffff, roughness: .1, clearcoat: 1, clearcoatRoughness: .03, envMapIntensity: .8, toneMapped: false }));
    const mesh = (geo, mat, pai = g) => pai.add(new T.Mesh(geo, mat));
    mesh(gAro, mAro); mesh(gBotoes, mBotao); mesh(gAntenas, mAntena); mesh(gFuros, mBuraco); mesh(gParafusos, mAnel);
    mesh(gVidro, mVidro); mesh(gTela, mTela); mesh(gFuro, mFuro); mesh(gFuroLente, mLente);
    costas.rotation.y = Math.PI; g.add(costas);
    mesh(gVidro, mCostas, costas); mesh(gIlha, mIlha, costas); mesh(gAneis, mAnel, costas); mesh(gCanos, mCano, costas); mesh(gCristais, mCristal, costas);
    mesh(gTampas, mTampa, costas); mesh(gFlash, mFlash, costas); mesh(gSensor, mPreto, costas);
    g.rotation.order = 'XYZ';
    cena.add(g);
    const s = new T.Mesh(gSombra, new T.MeshBasicMaterial({ map: tSombra, color: sombra[0], opacity: sombra[1], transparent: true, depthWrite: false, toneMapped: false }));
    const ch = new T.Mesh(gChao, new T.MeshBasicMaterial({ map: tChao, color: sombra[0], opacity: Math.min(1, sombra[1] * 1.45), transparent: true, depthWrite: false, toneMapped: false }));
    cena.add(s, ch);
    // a tela: um canvas 2D do tamanho exato que ela ocupa, para o texto sair nítido, que vira textura
    const tela = el.querySelector('.tela'), tipo = tela.dataset.f3d || 'foto', img = tela.querySelector('img');
    const c = document.createElement('canvas'), x = c.getContext('2d'), tex = new T.CanvasTexture(c);
    tex.colorSpace = T.SRGBColorSpace; tex.anisotropy = anis;
    mTela.emissiveMap = tex;
    const f = { el, g, s, ch, mTela, tipo, c, x, tex, ims: [], chave: '', m: { rx: mola(), ry: mola(), x: mola(0, 85, 14.5), y: mola(0, 85, 14.5), e: mola(1, 170, 21), lum: mola(1, 60, 13) } };
    f.fontes = [tipo === 'foto' ? img.currentSrc || img.src : new URL(`assets/f3d-${tipo}.webp`, document.baseURI).href, ...(tipo === 'chat' && img ? [img.currentSrc || img.src] : [])];
    return f;
  }

  // pinta a tela do aparelho; e = estado (rolagem do anúncio, ponto do palco)
  function pinta(f, e) {
    const chave = f.c.width + '|' + (f.tipo === 'feed' ? e.m.toFixed(3) : f.tipo === 'chat' ? (e.pos >= 1.5 ? 'funil' : e.s.toFixed(3)) : '');
    if (chave === f.chave) return false;
    f.chave = chave;
    const { x, c } = f, L = c.width, A = c.height, [im, im2] = f.ims;
    x.imageSmoothingQuality = 'high';
    x.globalAlpha = 1;
    if (f.tipo === 'feed') {
      const k = L / im.width, topo = FEED_TOPO * im.height; // o .65 de baixo é o -65cqw do .feed-rolo no CSS da página: mudou um, mude o outro
      x.fillStyle = '#fff'; x.fillRect(0, 0, L, A);
      x.drawImage(im, 0, topo, im.width, im.height - topo, 0, topo * k - e.m * .65 * L, L, (im.height - topo) * k);
      x.drawImage(im, 0, 0, im.width, topo, 0, 0, L, topo * k);
    } else if (f.tipo === 'chat' && e.pos < 1.5) {
      // a conversa inteira e, por cima, o fundo cobrindo o que ainda não foi dito; a mensagem que está entrando cresce e clareia
      x.drawImage(im, 0, 0, L, A);
      const as = QUANDO.map(q => reduz ? +(e.s >= q) : suave(clamp((e.s - q) / .16))), i = as.findIndex(a => a < 1);
      if (i >= 0) {
        const [y, h] = CHAT.msgs[i], a = as[i], y0 = y * A + .022 * L, y1 = Math.max(y0, (y + a * h) * A); // 0,022: a sombra do balão de cima fica
        x.fillStyle = CHAT.fundo;
        x.fillRect(0, y1, L, CHAT.campo * A - y1);
        if (a > 0) { x.globalAlpha = 1 - a; x.fillRect(0, y0, L, y1 - y0); }
      }
    } else x.drawImage(f.tipo === 'chat' ? im2 : im, 0, 0, L, A);
    f.tex.needsUpdate = true;
    return true;
  }

  // o giro do aparelho do palco em cada ponto dos capítulos (0, 1 e 2), em graus
  const giroPalco = pos => pos <= 1 ? P * Math.cos(pos * Math.PI) : -P + (pos - 1) * (360 + 2 * P);
  console.assert(giroPalco(0) === P && Math.abs(giroPalco(1) + P) < 1e-9 && giroPalco(1.5) === 180 && giroPalco(2) === 360 + P, 'palco: a pose tem que ser +P, -P, +P e a tela trocar com o aparelho de costas (180°)');

  // ---------- molas: tudo o que mexe no aparelho passa por elas (peso e inércia) ----------
  function mola(v = 0, k = 70, c = 12.5) { return { v, a: v, vel: 0, k, c }; }
  function anda(m, dt) {
    if (reduz) { m.v = m.a; return false; }
    for (let i = 0; i < 2; i++) { m.vel += ((m.a - m.v) * m.k - m.vel * m.c) * dt / 2; m.v += m.vel * dt / 2; }
    if (Math.abs(m.a - m.v) < .004 && Math.abs(m.vel) < .04) { m.v = m.a; m.vel = 0; return false; }
    return true;
  }

  // ---------- as aparições ----------
  const vistas = F3.vistas = [];
  const num = (el, p, padrao) => { const s = el.style.getPropertyValue(p); return s === '' ? padrao : +s; };
  let velRol = 0;

  function novaVista(el, tipo, els) {
    const v = { el, tipo, els, perto: false, pronta: false, suja: true, chave: '', ate: 0, acordou: false, fixo: null };
    vistas.push(v);
    new IntersectionObserver(es => { v.perto = es[es.length - 1].isIntersecting; if (v.perto) { v.acordou ? pede() : acorda(v); } }, { rootMargin: '60% 0px' }).observe(el);
    return v;
  }

  async function acorda(v) {
    v.acordou = true;
    const leque = v.tipo === 'leque', preto = !!v.el.closest('.preto,.palco');
    v.canvas = document.createElement('canvas'); v.canvas.className = 'f3d-c'; v.canvas.setAttribute('aria-hidden', 'true');
    v.ctx = v.canvas.getContext('2d');
    v.cena = new T.Scene(); v.cena.environment = ambiente;
    v.cam = new T.PerspectiveCamera(30, 1, 60, 2000); v.cam.position.z = DIST;
    // As três luzes ficam do lado da lateral que está à vista (o x delas é posto no passo): a principal de cima, a de lado desenha o risco
    // no ombro da frente do aro e o contraluz quente acende a faixa reta por trás. O lado contrário fica só com o ambiente, mais escuro.
    v.luz = new T.PointLight(0xffffff, 1.3 * 448 * 448, 0, 2); v.luz.position.set(0, 250, 340); // perto o bastante para a luz cair ao longo do corpo: o canto de cima recebe 1,6 vez a luz do de baixo
    // no leque cada aparelho de lado mostra a lateral de fora, e o segundo contraluz acende a do outro lado. Nas outras cenas ele existe apagado:
    // com o mesmo número de luzes em todas, os programas compilados na abertura servem para a página inteira (sem ele o leque travava 200 ms ao aparecer)
    v.contra = [2.1, leque ? 2.1 : 0].map(i => { const c = new T.DirectionalLight(0xffd6a8, i); c.position.set(0, 80, -300); return c; });
    v.lado = new T.PointLight(0xfff0dc, 1.1 * 355 * 355, 0, 2); v.lado.position.set(0, 120, 150);
    v.corre = new T.PointLight(0xffffff, 1.1, 0, 0); v.corre.position.set(0, 120, 160); // a luz que corre na moldura, levada pelo giro
    v.cena.add(v.luz, ...v.contra, v.lado, v.corre);

    v.fones = v.els.map(e => novoFone(e, v.cena, preto ? [0x000000, .62] : [0x3a1300, .46]));
    v.el.append(v.canvas);
    try { await Promise.all(v.fones.map(async f => { f.ims = await Promise.all(f.fontes.map(carrega)); })); } catch (_) { return desiste(); }
    new ResizeObserver(() => { if (mede(v) && v.pronta) { passo(v, 0); desenha(v); } }).observe(v.el); // redesenha na hora: mudar o tamanho apaga o canvas
    mede(v);
    alvos(v);
    v.fones.forEach(f => Object.values(f.m).forEach(m => { m.v = m.a; }));
    if (v.tipo === 'heroi' && !reduz && scrollY < innerHeight * .5) { const m = v.fones[0].m; m.ry.v = m.ry.a - 205; m.rx.v = 16; m.y.v = -26; } // entra de costas e vira de frente, com peso
    try { v.fones.forEach(f => pinta(f, estado(v))); renderer.extensions.has('KHR_parallel_shader_compile') ? await renderer.compileAsync(v.cena, v.cam) : renderer.compile(v.cena, v.cam); } catch (_) { return desiste(); }
    if (leque) ['pointerover', 'pointerout', 'pointerdown', 'pointerup', 'click', 'keyup', 'focusin', 'focusout'].forEach( // a troca e o realce dos botões do leque mexem no alvo sem rolagem
t => v.el.addEventListener(t, () => { v.ate = performance.now() + 600; pede(); }));
    v.pronta = true;
    if (!F3.on) { clearTimeout(demora); raiz.classList.add('f3d'); F3.on = true; F3.refaz && F3.refaz(); }
    pede();
  }

  function mede(v) {
    const leque = v.tipo === 'leque', f0 = v.fones[0].el;
    v.fh = f0.offsetHeight;
    if (!v.fh) return;
    const cw = leque ? v.el.offsetWidth : f0.offsetWidth * (1 + 2 * MX), ch = leque ? v.el.offsetHeight + 140 : v.fh * (1 + 2 * MY);
    v.dpr = Math.min(devicePixelRatio || 1, 2, Math.sqrt(2.6e6 / (cw * ch))); // no máximo 2x, e nunca mais que 2,6 milhões de pontos por aparição
    const w = Math.round(cw * v.dpr), h = Math.round(ch * v.dpr);
    if (v.canvas.width === w && v.canvas.height === h) return false;
    v.canvas.width = w; v.canvas.height = h;
    v.ppm = v.fh / H;
    v.cam.fov = 2 * Math.atan(ch / v.ppm / 2 / DIST) / GRAU; v.cam.aspect = cw / ch; v.cam.updateProjectionMatrix();
    const tw = Math.min(1080, Math.round(TW * v.ppm * v.dpr));
    v.fones.forEach(f => { if (f.c.width !== tw) { f.c.width = tw; f.c.height = Math.round(tw * 2.25); f.tex.dispose(); } });
    return v.suja = true;

  }

  const estado = v => v.tipo === 'anuncio' ? { m: num(v.rolo || (v.rolo = v.el.querySelector('.feed-rolo')), '--m', 1) } : { s: F3.s || 0, pos: F3.pos || 0 };

  // para onde cada aparelho deve ir agora (ângulos em graus, no sentido do CSS; x e y em mm; e = escala)
  function alvos(v) {
    const t = v.tipo, f0 = v.fones[0], m0 = f0.m, tilt = f => f.el._mola || { tx: 0, ty: 0 };
    // Em repouso o aparelho NUNCA fica de frente: de frente todo celular é uma folha. Fica em três quartos (P), deitado um pouco para trás (PX),
    // e tudo o mais (rolagem, mouse, dedo) gira em volta dessa pose. ry > 0 mostra a lateral esquerda, que é a que aponta para o texto.
    let rx = PX, ry = P;
    if (v.fixo) { m0.rx.a = v.fixo.rx; m0.ry.a = v.fixo.ry; return; }
    if (t === 'heroi') { const hp = reduz ? 0 : clamp(scrollY / innerHeight); ry = P - hp * 6; }
    else if (t === 'anuncio') ry = P + num(v.dono || (v.dono = v.el.closest('.af')), '--sy', 0) * -5;
    else if (t === 'palco') {
      const pos = F3.pos || 0, s = F3.s || 0;
      // de um capítulo para o outro ele troca de lado (+P, -P, +P): na primeira virada passa pela frente; na última dá a volta inteira,
      // e a tela troca no meio dela (pos 1,5), com ele exatamente de costas
      ry = giroPalco(pos);
      if (!reduz) { ry += Math.sin(s * Math.PI * 2) * 4 * (1 - Math.abs(Math.sin(pos * Math.PI))); rx += (1 - (F3.ent == null ? 1 : F3.ent)) * 12; }
    }
    // o mouse e o dedo giram em volta da pose; para o lado que deixaria o aparelho de frente, só metade
    const mira = (i, ry) => i.ty * (i.ty * Math.sin(ry * GRAU) < 0 ? .5 : 1);
    if (t === 'leque') {
      const esp = num(v.el, '--m', 1), sy = num(v.el, '--sy', 0), cv = v.canvas.getBoundingClientRect(), cx = cv.left + cv.width / 2, cy = cv.top + cv.height / 2;
      v.fones.forEach(f => {
        const b = f.el.getBoundingClientRect(), p = f.el.parentNode.dataset.pos, c = p === 'c', i = tilt(f);
        f.m.x.a = (b.left + b.width / 2 - cx) / v.ppm; f.m.y.a = (cy - b.top - b.height / 2) / v.ppm; f.m.e.a = b.height / v.fh;
        // o do meio mostra a lateral direita; os de lado abrem até 46° (vistos de fora do eixo da câmera, perdem uns 9°) e mostram a lateral de fora
        f.m.ry.a = c ? -P + sy * -5 + mira(i, -P) : (p === 'e' ? 1 : -1) * (16 + 30 * esp); f.m.rx.a = PX + (c ? i.tx : 0); f.m.lum.a = c ? 1 : .74;
      });
      return;
    }
    const i = tilt(f0);
    m0.rx.a = rx + i.tx + (reduz ? 0 : clamp(velRol * .0035, -7, 7)); m0.ry.a = ry + mira(i, ry);
  }

  function passo(v, dt) {
    alvos(v);
    let vivo = performance.now() < v.ate, chave = '';
    v.fones.forEach(f => {
      for (const k in f.m) { if (anda(f.m[k], dt)) vivo = true; }
      const m = f.m, e = m.e.v, z = DIST * (1 - 1 / e), x = m.x.v / e, y = m.y.v / e, ax = m.rx.v * GRAU, ay = m.ry.v * GRAU;
      f.g.position.set(x, y, z);
      f.g.rotation.set(-ax, ay, 0);
      f.mTela.emissiveIntensity = m.lum.v;
      // a sombra da parede fica atrás do ponto mais fundo do aparelho e cai para o lado contrário ao da luz; a de contato fica no chão, embaixo da base
      f.s.position.set(x + clamp(Math.sin(ay) * 3, -1, 1) * 9, y - 10, z - Math.max(24, W / 2 * Math.abs(Math.sin(ay)) + D / 2 + 8));
      f.s.scale.x = .6 + .4 * Math.abs(Math.cos(ay));
      f.ch.position.set(x, y - H / 2 * Math.cos(ax) - D / 2 * Math.abs(Math.sin(ax)) - 1.5, z + H / 2 * Math.sin(ax));
      f.ch.rotation.y = ay;
      chave += [m.x.v, m.y.v, e, m.rx.v, m.ry.v, m.lum.v].map(n => n.toFixed(2)).join();
      if (pinta(f, estado(v))) v.suja = true;
    });
    if (chave !== v.chave) { v.chave = chave; v.suja = true; }
    const ry = (v.fones.find(f => f.el.parentNode.dataset.pos === 'c') || v.fones[0]).m.ry.v * GRAU, lx = -clamp(Math.sin(ry) * 3, -1, 1); // de que lado está a lateral à vista: -1 esquerda, 1 direita
    v.luz.position.x = 110 * lx; v.lado.position.x = 300 * lx; v.contra.forEach((c, i) => { c.position.x = (i ? -300 : 300) * lx; });
    v.corre.position.set(Math.sin(ry * 1.5 + .4) * 190, 110 - Math.cos(ry) * 60, 170);
    return vivo;
  }

  function desenha(v) {
    const w = v.canvas.width, h = v.canvas.height;
    if (!w || !h) return;
    if (gl.width < w || gl.height < h) renderer.setSize(Math.max(gl.width, w), Math.max(gl.height, h), false);
    renderer.setViewport(0, 0, w, h); renderer.setScissor(0, 0, w, h); renderer.setScissorTest(true);
    renderer.render(v.cena, v.cam);
    v.ctx.clearRect(0, 0, w, h);
    v.ctx.drawImage(gl, 0, gl.height - h, w, h, 0, 0, w, h);
    v.suja = false;
    if (!v.canvas.classList.contains('on')) v.canvas.classList.add('on');
  }

  let pedido = false, antes = 0, yAntes = scrollY, desenhos = 0, lento = 0;

  function pede() { if (!pedido) { pedido = true; requestAnimationFrame(quadro); } }
  function quadro(t) {
    pedido = false;
    const dt = antes ? Math.min((t - antes) / 1000, .05) : 1 / 60; // quadro lento não vira câmera lenta sem fim: até 50 ms o tempo anda inteiro

    antes = t;
    velRol += ((scrollY - yAntes) / dt - velRol) * .3; yAntes = scrollY;
    if (Math.abs(velRol) < 2) velRol = 0;
    let vivo = velRol !== 0;
    if (!F3.on) return;
    const t0 = performance.now();
    for (const v of vistas) if (v.pronta && v.perto) {
      if (passo(v, dt)) vivo = true;
      if (!v.suja) continue;
      const a = performance.now();
      desenha(v);
      // ponytail: só pega WebGL por software (sem placa de vídeo), onde o desenho trava a página na hora; GPU fraca de verdade não aparece nesta conta
      if (++desenhos > 4 && (lento += performance.now() - a) / (desenhos - 4) > 40 && desenhos > 14) return desiste();
    }
    F3.ms = (F3.ms || 0) + performance.now() - t0; F3.quadros = (F3.quadros || 0) + 1; F3.desenhos = desenhos; // para medir: quanto este arquivo custa por quadro
    if (vivo) pede(); else antes = 0;

  }
  F3.pede = pede;
  addEventListener('scroll', pede, { passive: true });

  // cada .fone da página vira uma aparição; os três do leque dividem uma cena só (um passa de verdade na frente do outro)
  const leque = document.querySelector('.leque');
  if (leque) novaVista(leque, 'leque', [...leque.querySelectorAll('.fone')]);
  document.querySelectorAll('.fone').forEach(f => { if (!f.closest('.leque')) novaVista(f, f.closest('.hf') ? 'heroi' : f.closest('.af') ? 'anuncio' : f.closest('.palco-cena') ? 'palco' : 'solto', [f]); });
})();
