import React, { useEffect, useRef, useState } from "react";
import FeedQuizModal from "./components/FeedQuiz";
import InteractiveWavesCanvas from "./components/InteractiveWavesCanvas";

const installedSystems = [
  {
    number: "01",
    title: "Clareza",
    text: "Organizar oferta, posicionamento e mensagem para a empresa explicar valor sem depender de improviso.",
  },
  {
    number: "02",
    title: "Inteligência",
    text: "Aplicar IA onde existe repetição, decisão e conhecimento solto, criando apoio real para a rotina.",
  },
  {
    number: "03",
    title: "Uso real",
    text: "Entregar páginas, fluxos, assistentes e materiais que entram no trabalho e continuam funcionando depois.",
  },
];

const paymentMethods = [
  { label: "Pix", className: "pix" },
  { label: "VISA", className: "visa" },
  { label: "Mastercard", className: "mastercard" },
  { label: "elo", className: "elo" },
  { label: "AMEX", className: "amex" },
  { label: "HIPERCARD", className: "hipercard" },
  { label: "Boleto", className: "boleto" },
];

function App() {
  const [activeInstalled, setActiveInstalled] = useState(0);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const heroStageRef = useRef(null);

  useEffect(() => {
    document.documentElement.classList.add("can-reveal");

    const sections = [...document.querySelectorAll(".reveal")];
    sections.forEach((section, index) => {
      section.style.setProperty("--slide-index", String(index + 1));
    });
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      },
      { threshold: 0.18 },
    );

    sections.forEach((section) => observer.observe(section));

    const shouldUseSectionTone = !window.matchMedia("(max-width: 780px), (pointer: coarse)").matches;
    const sectionToneObserver = shouldUseSectionTone
      ? new IntersectionObserver(
          (entries) => {
            const visibleEntry = entries
              .filter((entry) => entry.isIntersecting)
              .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

            if (!visibleEntry) return;

            sections.forEach((section) => section.classList.remove("is-current"));
            visibleEntry.target.classList.add("is-current");
          },
          {
            rootMargin: "-34% 0px -34% 0px",
            threshold: [0.08, 0.24, 0.42, 0.6],
          },
        )
      : null;

    if (sectionToneObserver) {
      sections.forEach((section) => sectionToneObserver.observe(section));
    }

    return () => {
      observer.disconnect();
      sectionToneObserver?.disconnect();
      document.documentElement.classList.remove("can-reveal");
    };
  }, []);

  useEffect(() => {
    let frame = 0;
    let lastState = "";
    const previousScrollRestoration = window.history.scrollRestoration;
    const shouldStartAtHome = !window.location.hash;

    if (shouldStartAtHome) {
      window.history.scrollRestoration = "manual";
      if (window.scrollY < 8) window.scrollTo(0, 0);
    }

    const syncHeroReveal = () => {
      frame = 0;
      const viewport = Math.max(window.innerHeight || 1, 1);
      const revealDistance = Math.max(520, viewport * 0.72);
      const progress = Math.min(Math.max(window.scrollY / revealDistance, 0), 1);
      const smooth = (edge0, edge1, value) => {
        const x = Math.min(Math.max((value - edge0) / (edge1 - edge0), 0), 1);
        return x * x * (3 - 2 * x);
      };
      const eased = 1 - Math.pow(1 - progress, 3);
      const landing = smooth(0.62, 1, progress);
      const canvas = smooth(0.1, 0.82, progress);
      const root = document.documentElement;
      const nextState = [
        progress.toFixed(4),
        canvas.toFixed(4),
        (-progress * 100).toFixed(2),
        (1 - smooth(0.02, 0.24, progress)).toFixed(4),
        (-50 - (1 - eased) * 2).toFixed(2),
        (1 + (1 - eased) * 5.6).toFixed(4),
      ].join("|");

      if (nextState !== lastState) {
        lastState = nextState;
        root.style.setProperty("--hero-reveal", progress.toFixed(4));
        root.style.setProperty("--hero-canvas-opacity", canvas.toFixed(4));
        root.style.setProperty("--hero-stage-overlay", canvas.toFixed(4));
        root.style.setProperty("--hero-curtain-y", `${(-progress * 100).toFixed(2)}%`);
        root.style.setProperty("--hero-cue-opacity", (1 - smooth(0.02, 0.24, progress)).toFixed(4));
        root.style.setProperty("--hero-zoom-y", `${(-50 - (1 - eased) * 2).toFixed(2)}%`);
        root.style.setProperty("--hero-zoom-scale", (1 + (1 - eased) * 5.6).toFixed(4));
      }
      root.classList.toggle("is-hero-revealed", progress > 0.78);
    };

    const requestSync = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(syncHeroReveal);
    };

    syncHeroReveal();
    window.addEventListener("scroll", requestSync, { passive: true });
    window.addEventListener("resize", requestSync);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestSync);
      window.removeEventListener("resize", requestSync);
      document.documentElement.style.removeProperty("--hero-reveal");
      document.documentElement.style.removeProperty("--hero-canvas-opacity");
      document.documentElement.style.removeProperty("--hero-stage-overlay");
      document.documentElement.style.removeProperty("--hero-curtain-y");
      document.documentElement.style.removeProperty("--hero-cue-opacity");
      document.documentElement.style.removeProperty("--hero-zoom-y");
      document.documentElement.style.removeProperty("--hero-zoom-scale");
      document.documentElement.classList.remove("is-hero-revealed");
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  return (
    <>
      {false && (
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Feed">
          <img src="/brand/feed-logo-simples-branca.png" alt="Feed" />
        </a>
        <nav className="nav-links" aria-label="Navegação principal">
          <a href="#problema">Problema</a>
          <a href="#servicos">Soluções</a>
          <a href="#processo">Processo</a>
          <a href="#contato">Contato</a>
        </nav>
        <a className="header-cta" href="#contato">
          Diagnóstico
        </a>
      </header>
      )}

      <main id="top">
        <section className="hero section-frame" aria-label="Home">
          <div className="hero-stage" ref={heroStageRef}>
            <InteractiveWavesCanvas />
            <div className="hero-intro-curtain" aria-hidden="true" />
            <div className="hero-logo-mask hero-symbol-zoom" aria-hidden="true" />
            <button className="hero-cta" type="button" onClick={() => setIsQuizOpen(true)}>
              Quero melhorar a minha operação
              <span aria-hidden="true">↗</span>
            </button>
            <div className="hero-scroll-cue" aria-hidden="true">
              <strong>Deslize</strong>
              <small>para revelar</small>
              <span />
            </div>
          </div>
        </section>

        <div className="site-shader-background" aria-hidden="true" />

        <section className={`installed section-frame reveal installed-state-${activeInstalled}`} id="o-que-instalamos">
          <div className="installed-copy">
            <p className="eyebrow">O que a Feed instala</p>
            <h2>
              Sistemas simples para transformar conhecimento em execução<span>.</span>
            </h2>
            <p>
              A Feed conecta marca, processo e IA para criar ativos que a empresa consegue usar: mais clareza para vender, mais estrutura para operar e mais inteligencia aplicada no dia a dia.
            </p>
          </div>

          <div className="installed-system" aria-label="Pilares instalados pela Feed">
            {installedSystems.map((item) => (
              <article
                className={`installed-module ${activeInstalled === Number(item.number) - 1 ? "is-active" : ""}`}
                key={item.number}
                onClick={() => setActiveInstalled(Number(item.number) - 1)}
                onFocus={() => setActiveInstalled(Number(item.number) - 1)}
                onMouseEnter={() => setActiveInstalled(Number(item.number) - 1)}
                role="button"
                tabIndex={0}
                style={{ "--module-index": Number(item.number) - 1 }}
              >
                <span>{item.number}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="fit section-frame reveal" id="contato">
          <div className="fit-shader" aria-hidden="true" />
          <div className="fit-content">
            <p className="eyebrow">Próximo passo</p>
            <h2>IA prática para melhorar sua operação.</h2>
            <p>
              A Feed encontra onde a rotina trava e cria soluções simples para vender, organizar e produzir melhor.
            </p>
            <button className="hero-cta fit-email-button" type="button" onClick={() => setIsQuizOpen(true)}>
              Quero melhorar a minha operação
              <span aria-hidden="true">↗</span>
            </button>
          </div>
        </section>

        <SiteFooter />
      </main>
      <FeedQuizModal isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />
    </>
  );
}

function PaymentBadge({ method }) {
  return (
    <span className={`payment-badge payment-${method.className}`} aria-label={method.label}>
      {method.className === "pix" && (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <path d="M24 5.8c2.1 0 4.1.8 5.6 2.3l10.3 10.3c3.1 3.1 3.1 8.2 0 11.3L29.6 40c-3.1 3.1-8.2 3.1-11.3 0L8.1 29.7C5 26.6 5 21.5 8.1 18.4L18.4 8.1C19.9 6.6 21.9 5.8 24 5.8Z" />
          <path d="M17.2 17.7h4.5l5 5c1.1 1.1 2.8 1.1 3.9 0l2.1-2.1 3.1 3.1-2.1 2.1c-2.8 2.8-7.3 2.8-10.1 0l-5-5h-1.4v-3.1Z" />
          <path d="M30.8 30.3h-4.5l-5-5c-1.1-1.1-2.8-1.1-3.9 0l-2.1 2.1-3.1-3.1 2.1-2.1c2.8-2.8 7.3-2.8 10.1 0l5 5h1.4v3.1Z" />
        </svg>
      )}
      {method.className === "mastercard" && (
        <span className="mastercard-mark" aria-hidden="true">
          <i />
          <i />
        </span>
      )}
      {method.className === "boleto" && <span className="barcode-mark" aria-hidden="true" />}
      <strong>{method.label}</strong>
    </span>
  );
}

function SiteFooter() {
  return (
    <footer className="fixed-site-footer" aria-label="Rodapé Feed">
      <div className="footer-payment">
        <p>Formas de pagamento</p>
        <div className="payment-row" aria-label="Formas de pagamento aceitas">
          {paymentMethods.map((method) => (
            <PaymentBadge method={method} key={method.label} />
          ))}
        </div>
      </div>
      <div className="footer-legal">
        <p>FEED MARKETING E COMUNICAÇÃO • CNPJ 53.877.987/0001-93</p>
        <small>© 2026 FEED MKT. Todos os direitos reservados.</small>
      </div>
    </footer>
  );
}

function ThrowShadeCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      depth: false,
      powerPreference: "high-performance",
      preserveDrawingBuffer: true,
      stencil: false,
    });

    if (!gl) {
      canvas.classList.add("is-unsupported");
      return undefined;
    }

    const vertexSource = `
      attribute vec2 a_position;
      varying vec2 v_uv;

      void main() {
        v_uv = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fragmentSource = `
      precision highp float;

      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      uniform vec2 u_trail[8];
      uniform float u_time;
      uniform float u_phase;
      uniform sampler2D u_mask;

      varying vec2 v_uv;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      vec2 hash2(vec2 p) {
        return fract(sin(vec2(
          dot(p, vec2(127.1, 311.7)),
          dot(p, vec2(269.5, 183.3))
        )) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);

        return mix(
          mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
          mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
          u.y
        );
      }

      float fbm(vec2 p) {
        float value = 0.0;
        float amp = 0.5;

        for (int i = 0; i < 3; i++) {
          value += amp * noise(p);
          p = mat2(1.62, -1.18, 1.18, 1.62) * p + 17.13;
          amp *= 0.52;
        }

        return value;
      }

      mat2 rotate2d(float angle) {
        float s = sin(angle);
        float c = cos(angle);
        return mat2(c, -s, s, c);
      }

      float halftone(vec2 uv, float scale, float intensity, float angle, float stretch) {
        vec2 grid = uv * scale;
        vec2 cell = rotate2d(angle) * (fract(grid) - 0.5);
        cell = vec2(cell.x / stretch, cell.y * stretch);
        float radius = 0.5 - intensity * 0.42;
        float dot = smoothstep(radius, radius - 0.12, length(cell));
        return dot;
      }

      float particleField(vec2 uv, float scale, float time, float stretch, float density) {
        vec2 g = uv * scale;
        vec2 base = floor(g);
        vec2 local = fract(g);
        float value = 0.0;

        for (int y = -1; y <= 1; y++) {
          for (int x = -1; x <= 1; x++) {
            vec2 offset = vec2(float(x), float(y));
            vec2 cell = base + offset;
            vec2 rnd = hash2(cell);
            vec2 center = offset + rnd;
            center += 0.22 * vec2(
              sin(time * 1.8 + rnd.x * 6.2831 + cell.y * 0.22),
              cos(time * 1.55 + rnd.y * 6.2831 + cell.x * 0.2)
            );

            vec2 delta = local - center;
            delta.x /= stretch;
            delta.y *= stretch;
            float radius = 0.085 + density * 0.13 + rnd.x * 0.025;
            value += smoothstep(radius, radius * 0.42, length(delta));
          }
        }

        return clamp(value, 0.0, 1.0);
      }

      void main() {
        vec2 uv = v_uv;
        vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);
        vec2 p = (uv - 0.5) * aspect;
        vec2 mouse = (u_mouse - 0.5) * aspect;
        float dist = distance(p, mouse);
        float pull = smoothstep(0.24, 0.0, dist);
        float inkTrail = 0.0;
        vec2 trailWarp = vec2(0.0);

        for (int i = 0; i < 8; i++) {
          vec2 trailPoint = (u_trail[i] - 0.5) * aspect;
          float index = float(i);
          float weight = 1.0 - index / 8.0;
          float trailDist = distance(p, trailPoint);
          float trailInfluence = smoothstep(0.48 - index * 0.018, 0.0, trailDist) * weight;
          inkTrail += trailInfluence;
          vec2 trailVector = p - trailPoint;
          trailWarp += vec2(-trailVector.y, trailVector.x) * trailInfluence * weight;
        }

        inkTrail = clamp(inkTrail, 0.0, 1.0);
        trailWarp = clamp(trailWarp, vec2(-1.0), vec2(1.0));

        float t = u_time * 0.34;
        float field = fbm(p * 2.0 + vec2(t * 0.74, -t * 0.52));
        float fast = fbm(p * 6.0 + vec2(-t * 1.9, t * 1.0));
        vec2 warp = vec2(
          fbm(p * 3.8 + vec2(t * 1.75, 1.7)),
          fbm(p * 3.8 + vec2(4.3, -t * 1.45))
        ) - 0.5;

        vec2 mouseVector = p - mouse;
        vec2 swirl = vec2(-mouseVector.y, mouseVector.x);
        vec2 wave = vec2(
          sin((uv.y + field * 0.18) * 18.0 + t * 5.2),
          cos((uv.x - fast * 0.14) * 16.0 - t * 4.4)
        );

        vec2 bgUv = uv + warp * 0.34 + wave * 0.055 + vec2(t * 0.08, -t * 0.035);
        bgUv += normalize(mouseVector + 0.0001) * pull * 0.055;
        bgUv += swirl * pull * 0.22;
        bgUv += warp * inkTrail * 0.38;
        bgUv += trailWarp * 0.28;

        float density = 0.18 + field * 0.56 + fast * 0.18 + pull * 0.28 + inkTrail * 0.42;
        float flowAngle = field * 6.2831 + fast * 1.8 + t * 0.55;
        float stretch = 1.2 + field * 1.9 + inkTrail * 1.4 + pull * 1.2;
        float dotsWarm = particleField(bgUv + vec2(0.003, -0.002), 76.0 + fast * 10.0, t, stretch, density);
        float dotsHot = particleField(bgUv - vec2(0.007, 0.005), 76.0 + fast * 10.0, t + 2.4, stretch * 0.92, density * 0.86);
        float patches = smoothstep(0.38, 0.76, field + fast * 0.25);
        float scan = smoothstep(0.47, 0.53, sin((uv.y + field * 0.026) * 640.0));

        vec3 black = vec3(0.027, 0.027, 0.027);
        vec3 white = vec3(0.957, 0.961, 0.941);
        vec3 orange = vec3(1.0, 0.639, 0.0);
        vec3 orangeDeep = vec3(0.42, 0.16, 0.02);
        float phase = smoothstep(0.0, 1.0, u_phase);
        vec3 background = black + orange * (0.018 + field * 0.045);
        background += orange * dotsWarm * (0.2 + patches * 0.42);
        background += orange * dotsHot * (0.1 + (1.0 - patches) * 0.24);
        background += orange * inkTrail * dotsWarm * 0.52;
        background += white * dotsWarm * dotsHot * pull * 0.006;
        vec3 inverted = orange * (0.72 + field * 0.08);
        inverted -= black * dotsWarm * (0.58 + patches * 0.22);
        inverted -= orangeDeep * dotsHot * (0.22 + (1.0 - patches) * 0.16);
        inverted -= black * inkTrail * dotsWarm * 0.44;
        inverted += white * pull * dotsWarm * 0.035;
        background = mix(background, inverted, phase);
        background = mix(background, black, scan * 0.12 * (1.0 - phase));

        vec3 color = background;

        float vignette = smoothstep(1.08, 0.24, length(p));
        color *= 0.36 + vignette * 0.82;

        float alpha = 0.96;
        gl_FragColor = vec4(color, alpha);
      }
    `;

    const compileShader = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(shader) || "Shader compile error");
      }

      return shader;
    };

    const program = gl.createProgram();
    const vertexShader = compileShader(gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentSource);
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program) || "Shader link error");
    }

    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const mouseLocation = gl.getUniformLocation(program, "u_mouse");
    const trailLocations = Array.from({ length: 8 }, (_, index) => gl.getUniformLocation(program, `u_trail[${index}]`));
    const timeLocation = gl.getUniformLocation(program, "u_time");
    const phaseLocation = gl.getUniformLocation(program, "u_phase");
    const maskLocation = gl.getUniformLocation(program, "u_mask");

    const maskCanvas = document.createElement("canvas");
    const maskSize = 1024;
    maskCanvas.width = maskSize;
    maskCanvas.height = maskSize;
    const ctx = maskCanvas.getContext("2d");
    const drawFallbackMask = () => {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, maskSize, maskSize);
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "900 760px Barlow, Arial, sans-serif";
      ctx.save();
      ctx.translate(maskSize * 0.5, maskSize * 0.53);
      ctx.transform(1.04, 0, -0.08, 1, 0, 0);
      ctx.fillText("F", 0, 0);
      ctx.restore();
    };

    drawFallbackMask();

    const texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, gl.LUMINANCE, gl.UNSIGNED_BYTE, maskCanvas);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.uniform1i(maskLocation, 0);

    const symbol = new Image();
    symbol.onload = () => {
      ctx.clearRect(0, 0, maskSize, maskSize);
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, maskSize, maskSize);

      const drawHeight = maskSize * 0.68;
      const drawWidth = drawHeight * (symbol.naturalWidth / symbol.naturalHeight);
      const drawX = (maskSize - drawWidth) * 0.45;
      const drawY = (maskSize - drawHeight) * 0.48;

      ctx.drawImage(symbol, drawX, drawY, drawWidth, drawHeight);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, gl.LUMINANCE, gl.UNSIGNED_BYTE, maskCanvas);
    };
    symbol.src = "/brand/feed-symbol.svg";

    const pointer = { x: 0.5, y: 0.5 };
    const target = { x: 0.5, y: 0.5 };
    const trail = Array.from({ length: 8 }, () => ({ x: 0.5, y: 0.5 }));
    let animationFrame = 0;
    let startTime = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1);
      const { width, height } = canvas.getBoundingClientRect();
      const nextWidth = Math.max(1, Math.floor(width * dpr));
      const nextHeight = Math.max(1, Math.floor(height * dpr));

      if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
        canvas.width = nextWidth;
        canvas.height = nextHeight;
        gl.viewport(0, 0, nextWidth, nextHeight);
      }
    };

    const handlePointerMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      target.x = (event.clientX - rect.left) / rect.width;
      target.y = 1 - (event.clientY - rect.top) / rect.height;
    };

    const render = (now) => {
      resize();
      pointer.x += (target.x - pointer.x) * 0.08;
      pointer.y += (target.y - pointer.y) * 0.08;
      trail[0].x += (pointer.x - trail[0].x) * 0.24;
      trail[0].y += (pointer.y - trail[0].y) * 0.24;

      for (let index = 1; index < trail.length; index += 1) {
        trail[index].x += (trail[index - 1].x - trail[index].x) * 0.16;
        trail[index].y += (trail[index - 1].y - trail[index].y) * 0.16;
      }

      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform2f(mouseLocation, pointer.x, pointer.y);
      trailLocations.forEach((location, index) => {
        gl.uniform2f(location, trail[index].x, trail[index].y);
      });
      gl.uniform1f(timeLocation, (now - startTime) / 1000);
      const phase = Math.min(Math.max((window.scrollY - 560) / 560, 0), 1);
      const easedPhase = phase * phase * (3 - 2 * phase);
      gl.uniform1f(phaseLocation, easedPhase);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationFrame = requestAnimationFrame(render);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("resize", resize);
    animationFrame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", resize);
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteProgram(program);
    };
  }, []);

  return <canvas className="throw-shade-canvas" ref={canvasRef} aria-hidden="true" />;
}

function VisualSystem({ variant }) {
  return (
    <div className={`visual-system visual-${variant}`} aria-hidden="true">
      <div className="shape circle" />
      <div className="shape arch" />
      <div className="shape slab" />
      <div className="shape paper" />
      <div className="shape dark" />
      <div className="shape small-dot" />
      <div className="technical-lines" />
    </div>
  );
}

export default App;
