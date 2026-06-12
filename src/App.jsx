import React, { useEffect, useRef, useState } from "react";
import FeedQuizModal from "./components/FeedQuiz";

const installedSystems = [
  {
    key: "branding",
    number: "01",
    title: "Branding",
    icon: "fingerprint-pattern",
    label: "Identidade",
    tagline: "Marca forte e clara, pronta pra vender.",
    outputs: ["Território de marca", "Oferta clara", "Materiais de venda"],
  },
  {
    key: "leads",
    number: "02",
    title: "Leads",
    icon: "funnel",
    label: "Captação",
    tagline: "Um fluxo previsível de clientes certos.",
    outputs: ["Fluxo de entrada", "Lista qualificada", "Rotina de follow-up"],
  },
  {
    key: "social",
    number: "03",
    title: "Social Media",
    icon: "share-2",
    label: "Conteúdo",
    tagline: "Presença toda semana, sem improviso.",
    outputs: ["Calendário editorial", "Roteiros", "Posts comerciais"],
  },
  {
    key: "seo",
    number: "04",
    title: "SEO",
    icon: "search-check",
    label: "Busca",
    tagline: "Quem te procura, te encontra primeiro.",
    outputs: ["Mapa de buscas", "Páginas otimizadas", "Plano de conteúdo"],
  },
  {
    key: "landing",
    number: "05",
    title: "Site",
    icon: "panels-top-left",
    label: "Conversão",
    tagline: "Uma página que explica e converte.",
    outputs: ["Landing pages", "Diagnósticos", "Medição de conversão"],
  },
  {
    key: "automation",
    number: "06",
    title: "IA e automações",
    icon: "brain-circuit",
    label: "Operação",
    tagline: "A rotina repetitiva no automático.",
    outputs: ["Assistentes internos", "Fluxos automáticos", "Bases organizadas"],
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
  const servicesTrackRef = useRef(null);
  const activeService = installedSystems[activeInstalled];

  const goToService = (index) => {
    const track = servicesTrackRef.current;
    if (!track) return;
    const total = track.offsetHeight - window.innerHeight;
    if (total <= 0) return;
    const frac = (index + 0.5) / installedSystems.length;
    window.scrollTo({ top: track.offsetTop + total * frac, behavior: "smooth" });
  };

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
    const track = servicesTrackRef.current;
    if (!track) return undefined;
    let frame = 0;
    const update = () => {
      frame = 0;
      const viewport = window.innerHeight || 1;
      const total = track.offsetHeight - viewport;
      if (total <= 0) return;
      const scrolled = Math.min(Math.max(-track.getBoundingClientRect().top, 0), total);
      const progress = scrolled / total;
      const count = installedSystems.length;
      const index = Math.min(count - 1, Math.max(0, Math.floor(progress * count)));
      setActiveInstalled((current) => (current === index ? current : index));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
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
          <div className="hero-bg" aria-hidden="true">
            <span className="hero-bg-blob hero-bg-blob-1" />
            <span className="hero-bg-blob hero-bg-blob-2" />
            <span className="hero-bg-grid" />
          </div>

          <div className="hero-topbar">
            <a className="hero-brand" href="#top" aria-label="Feed">
              <img src="/brand/feed-logo-simples-branca.png" alt="Feed" />
            </a>
            <button className="hero-pill-link" type="button" onClick={() => setIsQuizOpen(true)}>
              Diagnóstico gratuito
            </button>
          </div>

          <div className="hero-content">
            <span className="hero-eyebrow">
              <i aria-hidden="true" />
              Agência de IA aplicada
            </span>
            <h1 className="hero-h1">
              IA prática pra sua empresa <span>vender e operar melhor.</span>
            </h1>
            <p className="hero-sub">
              Marca, aquisição, conteúdo e automações num parceiro só. A gente transforma estratégia em execução.
            </p>
            <div className="hero-actions">
              <button className="hero-btn hero-btn-primary" type="button" onClick={() => setIsQuizOpen(true)}>
                Quero melhorar a minha operação
                <span aria-hidden="true">↗</span>
              </button>
              <a className="hero-btn hero-btn-ghost" href="#o-que-instalamos">
                Ver o que fazemos
              </a>
            </div>
          </div>

          <a className="hero-cue" href="#o-que-instalamos" aria-label="Rolar para os serviços">
            <span>Role para começar</span>
            <i aria-hidden="true" />
          </a>
        </section>

        <div className="site-shader-background" aria-hidden="true" />

        <section
          className={`services-immersive section-frame reveal service-${activeService.key}`}
          id="o-que-instalamos"
          style={{ "--ss-active": activeInstalled }}
        >
          <div className="ss-track" ref={servicesTrackRef}>
            <div className="ss-stage">
              <div className="ss-grain" aria-hidden="true" />

              <div className="ss-inner">
                <header className="ss-head">
                  <p className="eyebrow">Serviços da Feed</p>
                  <p className="ss-head-line">
                    Tudo que sua empresa precisa para montar sua estratégia.
                  </p>
                </header>

                <span className="ss-ghost" aria-hidden="true" key={`ghost-${activeService.key}`}>
                  {activeService.number}
                </span>

                <div className="ss-panel" key={activeService.key}>
                  <div className={`ss-mark service-mark service-${activeService.key}`} aria-hidden="true">
                    <ServiceIcon name={activeService.icon} />
                  </div>
                  <p className="ss-label">
                    <span>{activeService.number}</span> / {activeService.label}
                  </p>
                  <h2 className="ss-title">{activeService.title}</h2>
                  <p className="ss-tagline">{activeService.tagline}</p>
                  <ul className="ss-outputs">
                    {activeService.outputs.map((output) => (
                      <li key={output}>{output}</li>
                    ))}
                  </ul>
                </div>

                <nav className="ss-progress" aria-label="Serviços da Feed">
                  {installedSystems.map((item, index) => (
                    <button
                      key={item.key}
                      type="button"
                      className={`ss-dot ${index === activeInstalled ? "is-active" : ""} ${index < activeInstalled ? "is-past" : ""}`}
                      onClick={() => goToService(index)}
                      aria-current={index === activeInstalled ? "true" : undefined}
                    >
                      <span className="ss-dot-num">{item.number}</span>
                      <span className="ss-dot-name">{item.title}</span>
                    </button>
                  ))}
                </nav>

                <div
                  className="ss-cue"
                  aria-hidden="true"
                  data-end={activeInstalled === installedSystems.length - 1 ? "true" : "false"}
                >
                  <span>Role para navegar</span>
                </div>
              </div>
            </div>
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

function ServiceIcon({ name }) {
  const commonProps = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    focusable: "false",
    "aria-hidden": "true",
  };

  switch (name) {
    case "fingerprint-pattern":
      return (
        <svg {...commonProps}>
          <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" />
          <path d="M14 13.12c0 2.38 0 6.38-1 8.88" />
          <path d="M17.29 21.02c.12-.6.43-2.3.5-3.02" />
          <path d="M2 12a10 10 0 0 1 18-6" />
          <path d="M2 16h.01" />
          <path d="M21.8 16c.2-2 .131-5.354 0-6" />
          <path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2" />
          <path d="M8.65 22c.21-.66.45-1.32.57-2" />
          <path d="M9 6.8a6 6 0 0 1 9 5.2v2" />
        </svg>
      );
    case "funnel":
      return (
        <svg {...commonProps}>
          <path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z" />
        </svg>
      );
    case "share-2":
      return (
        <svg {...commonProps}>
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
          <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
        </svg>
      );
    case "search-check":
      return (
        <svg {...commonProps}>
          <path d="m8 11 2 2 4-4" />
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      );
    case "panels-top-left":
      return (
        <svg {...commonProps}>
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M3 9h18" />
          <path d="M9 21V9" />
        </svg>
      );
    case "brain-circuit":
      return (
        <svg {...commonProps}>
          <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
          <path d="M9 13a4.5 4.5 0 0 0 3-4" />
          <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" />
          <path d="M3.477 10.896a4 4 0 0 1 .585-.396" />
          <path d="M6 18a4 4 0 0 1-1.967-.516" />
          <path d="M12 13h4" />
          <path d="M12 18h6a2 2 0 0 1 2 2v1" />
          <path d="M12 8h8" />
          <path d="M16 8V5a2 2 0 0 1 2-2" />
          <circle cx="16" cy="13" r=".5" />
          <circle cx="18" cy="3" r=".5" />
          <circle cx="20" cy="21" r=".5" />
          <circle cx="20" cy="8" r=".5" />
        </svg>
      );
    default:
      return null;
  }
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
        <nav className="footer-links" aria-label="Links legais">
          <a href="/privacidade.html">Política de Privacidade</a>
        </nav>
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
