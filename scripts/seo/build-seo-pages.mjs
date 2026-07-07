import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const PUBLIC_DIR = join(ROOT, "public");
const SITE = "https://agenciafeed.com";
const LASTMOD = "2026-07-06";

const ORG = {
  "@type": "ProfessionalService",
  "@id": `${SITE}/#organization`,
  name: "Feed Marketing e Comunicação",
  alternateName: ["Feed", "Agência Feed"],
  url: `${SITE}/`,
  logo: `${SITE}/brand/feed-logo-simples-branca.png`,
  image: `${SITE}/og-image.png`,
  telephone: "+5516993020694",
  email: "emailmkt@agenciafeed.com",
  areaServed: [
    { "@type": "City", name: "Ribeirão Preto" },
    { "@type": "City", name: "Bebedouro" },
    { "@type": "Country", name: "Brasil" },
  ],
};

const pages = [
  {
    slug: "ia-para-pequenas-empresas",
    type: "hub",
    title: "IA para pequenas empresas: guia prático | Feed",
    h1: "IA para pequenas empresas, sem projeto inflado.",
    eyebrow: "Página pilar",
    description:
      "Guia da Feed para pequenas empresas entenderem onde usar IA, quando automatizar atendimento, quanto investir e por onde começar.",
    intro:
      "A IA só vale a pena quando resolve um gargalo real: atendimento lento, follow-up esquecido, dados bagunçados ou operação manual demais. Esta página organiza o caminho para uma PME começar com segurança.",
    primaryCta: "Pedir diagnóstico gratuito",
    secondaryCta: "Ver guia de custos",
    secondaryHref: "/blog/quanto-custa-implementar-ia-pequena-empresa/",
    serviceName: "Consultoria e implementação de IA para pequenas empresas",
    bulletsTitle: "Onde a IA costuma pagar a conta",
    bullets: [
      "Atendimento no WhatsApp com resposta imediata e passagem para humano quando precisa.",
      "Follow-up comercial automático para reduzir oportunidades esquecidas.",
      "Organização de CRM, agenda, planilhas e base de conhecimento.",
      "Agentes internos para tarefas repetitivas de operação, vendas e conteúdo.",
    ],
    decisionTitle: "Comece pequeno, mas comece no lugar certo",
    decisions: [
      "Mapeie onde o time perde mais tempo ou mais venda.",
      "Escolha um processo com volume, repetição e impacto financeiro claro.",
      "Implemente uma solução enxuta antes de comprar várias ferramentas.",
      "Meça tempo economizado, velocidade de resposta e oportunidades recuperadas.",
    ],
    faqs: [
      ["O que é IA para pequenas empresas?", "É o uso de automações, agentes e modelos de linguagem para resolver tarefas práticas da rotina: atendimento, vendas, follow-up, organização de dados e produção de conteúdo."],
      ["Qual é o primeiro processo que uma PME deve automatizar?", "Normalmente é o atendimento ou o follow-up comercial, porque são áreas com repetição, impacto direto em vendas e retorno mais fácil de medir."],
      ["Preciso trocar meus sistemas para usar IA?", "Não necessariamente. Na maioria dos casos, a Feed começa conectando IA ao que a empresa já usa: WhatsApp, CRM, agenda, planilhas e documentos."],
    ],
    related: ["automacao-whatsapp", "agentes-de-ia", "diagnostico-ia-empresa"],
  },
  {
    slug: "automacao-whatsapp",
    type: "service",
    title: "Automação de WhatsApp com IA para empresas | Feed",
    h1: "Automação de WhatsApp que responde rápido sem parecer robô.",
    eyebrow: "Serviço",
    description:
      "Automação de atendimento no WhatsApp com IA para pequenas empresas: qualificação de leads, respostas rápidas, follow-up e transferência para humano.",
    intro:
      "Cliente que espera demais esfria. A Feed monta automações de WhatsApp que respondem o básico na hora, qualificam oportunidades e deixam o humano entrar quando a conversa exige cuidado.",
    primaryCta: "Diagnosticar meu atendimento",
    secondaryCta: "Ler sobre custos de IA",
    secondaryHref: "/blog/quanto-custa-implementar-ia-pequena-empresa/",
    serviceName: "Automação de atendimento no WhatsApp com IA",
    bulletsTitle: "O que entra no projeto",
    bullets: [
      "Fluxo de perguntas e respostas para dúvidas frequentes.",
      "Qualificação de lead antes de chegar no time comercial.",
      "Transferência para humano quando há objeção, negociação ou exceção.",
      "Registro de informações importantes para CRM, agenda ou planilha.",
    ],
    decisionTitle: "Quando faz sentido automatizar",
    decisions: [
      "A empresa recebe perguntas repetidas todos os dias.",
      "O time demora para responder novos contatos.",
      "Leads somem porque ninguém faz follow-up.",
      "O atendimento depende de uma pessoa específica saber tudo de cabeça.",
    ],
    faqs: [
      ["Automação de WhatsApp irrita cliente?", "Irrita quando é rígida e burra. Uma automação bem feita resolve o simples, deixa claro quando chama humano e evita respostas genéricas."],
      ["A automação substitui o atendente?", "Não. Ela reduz repetição, organiza contexto e acelera triagem. Conversas delicadas, negociação e exceções continuam com o time."],
      ["Quanto tempo leva para implementar?", "Um primeiro fluxo pode entrar no ar em poucas semanas, dependendo da clareza das respostas, integrações e volume de exceções."],
    ],
    related: ["ia-para-pequenas-empresas", "agentes-de-ia", "diagnostico-ia-empresa"],
  },
  {
    slug: "agentes-de-ia",
    type: "service",
    title: "Agentes de IA para empresas e PMEs | Feed",
    h1: "Agentes de IA treinados no contexto da sua empresa.",
    eyebrow: "Serviço",
    description:
      "Criação e implementação de agentes de IA para empresas: atendimento, vendas, operação, conteúdo e processos internos com base de conhecimento organizada.",
    intro:
      "Agente de IA bom não é um chat genérico. Ele precisa conhecer a oferta, os processos, as regras de atendimento e os limites do que pode responder.",
    primaryCta: "Mapear um agente de IA",
    secondaryCta: "Entender o guia de IA para PMEs",
    secondaryHref: "/ia-para-pequenas-empresas/",
    serviceName: "Implementação de agentes de IA para empresas",
    bulletsTitle: "Tipos de agente que a Feed implementa",
    bullets: [
      "Agente de atendimento para responder dúvidas e qualificar contatos.",
      "Agente comercial para organizar follow-up, objeções e próximos passos.",
      "Agente interno para consultar documentos, processos e informações da empresa.",
      "Agente de conteúdo para apoiar roteiros, posts e reaproveitamento de ideias.",
    ],
    decisionTitle: "O que precisa existir antes",
    decisions: [
      "Oferta, processo e regras minimamente claros.",
      "Base de conhecimento confiável, mesmo que simples.",
      "Critérios de quando responder e quando escalar para humano.",
      "Métricas para saber se o agente economiza tempo ou recupera venda.",
    ],
    faqs: [
      ["O que é um agente de IA?", "É um assistente treinado para executar uma função específica com contexto da empresa, regras, base de conhecimento e integração com canais ou sistemas."],
      ["Agente de IA pode errar?", "Pode, por isso o projeto precisa de limites, revisão de respostas críticas, base confiável e passagem para humano nos casos certos."],
      ["Um agente de IA precisa integrar com sistemas?", "Nem sempre no começo. A integração faz sentido quando o agente precisa consultar ou registrar dados em CRM, agenda, planilhas ou plataformas internas."],
    ],
    related: ["ia-para-pequenas-empresas", "automacao-whatsapp", "diagnostico-ia-empresa"],
  },
  {
    slug: "diagnostico-ia-empresa",
    type: "service",
    title: "Diagnóstico de IA para empresas | Feed",
    h1: "Descubra onde a IA realmente faz sentido na sua operação.",
    eyebrow: "Diagnóstico gratuito",
    description:
      "Diagnóstico gratuito da Feed para identificar gargalos, oportunidades de automação, riscos e prioridades de IA em pequenas empresas.",
    intro:
      "Antes de comprar ferramenta ou montar agente, a empresa precisa saber onde está perdendo tempo, cliente e dinheiro. O diagnóstico mostra prioridades e evita projeto bonito que não se paga.",
    primaryCta: "Quero meu diagnóstico",
    secondaryCta: "Ver página pilar de IA",
    secondaryHref: "/ia-para-pequenas-empresas/",
    serviceName: "Diagnóstico de IA e automação para empresas",
    bulletsTitle: "O que avaliamos",
    bullets: [
      "Velocidade e qualidade do atendimento.",
      "Rotina comercial, follow-up e perda de oportunidades.",
      "Processos repetitivos que podem virar automação.",
      "Base de dados, CRM, agenda, planilhas e presença digital.",
    ],
    decisionTitle: "O que você recebe",
    decisions: [
      "Mapa dos gargalos principais da operação.",
      "Oportunidades de IA por impacto e facilidade de implementação.",
      "Indicação do primeiro projeto com melhor chance de retorno.",
      "Noção realista de escopo, investimento e próximos passos.",
    ],
    faqs: [
      ["O diagnóstico é gratuito mesmo?", "Sim. A Feed faz uma leitura inicial para mostrar onde a IA pode gerar retorno e qual projeto deveria vir primeiro."],
      ["Preciso já saber o que quero automatizar?", "Não. O objetivo do diagnóstico é justamente encontrar onde a automação faz sentido antes de definir solução."],
      ["O diagnóstico serve para empresas pequenas?", "Sim. Ele foi pensado para PMEs que precisam de clareza, escopo enxuto e implementação realista."],
    ],
    related: ["ia-para-pequenas-empresas", "automacao-whatsapp", "agentes-de-ia"],
  },
  {
    slug: "agencia-de-ia-ribeirao-preto",
    type: "local",
    title: "Agência de IA em Ribeirão Preto e região | Feed",
    h1: "Agência de IA em Ribeirão Preto para quem quer resultado, não hype.",
    eyebrow: "Ribeirão Preto e região",
    description:
      "A Feed é uma agência de IA que atende empresas de Ribeirão Preto e região com automação de atendimento no WhatsApp, agentes de IA e organização da operação. Diagnóstico gratuito.",
    intro:
      "A Feed ajuda empresas de Ribeirão Preto e cidades vizinhas a usarem IA onde ela paga a conta: atendimento, follow-up e operação. O trabalho é remoto na maior parte do tempo, presencial quando o projeto pede, sempre com escopo enxuto e retorno mensurável.",
    primaryCta: "Pedir diagnóstico gratuito",
    secondaryCta: "Ver guia de custos",
    secondaryHref: "/blog/quanto-custa-implementar-ia-pequena-empresa/",
    serviceName:
      "Consultoria e implementação de IA para empresas de Ribeirão Preto e região",
    bulletsTitle: "O que a Feed resolve para empresas da região",
    bullets: [
      "IA aplicada onde a empresa perde tempo ou venda, com um projeto pequeno e medido antes de qualquer expansão.",
      "Atendimento no WhatsApp que responde rápido, qualifica o lead e passa para humano quando precisa.",
      "Follow-up automático para parar de perder orçamento por esquecimento.",
      "Organização de CRM, agenda, planilhas e base de conhecimento para a IA responder certo.",
    ],
    decisionTitle: "Como a Feed começa um projeto na região",
    decisions: [
      "Diagnóstico gratuito da operação, sem compromisso.",
      "Escolha do gargalo com mais impacto no caixa e mais fácil de medir.",
      "Implementação enxuta conectada ao que a empresa já usa.",
      "Medição de tempo economizado, velocidade de resposta e vendas recuperadas.",
    ],
    faqs: [
      ["A Feed atende presencialmente em Ribeirão Preto?", "A maior parte do trabalho é remota, o que deixa o projeto mais ágil e barato. Quando o projeto pede presença, a Feed vai até a empresa na região."],
      ["Vocês atendem empresas fora de Ribeirão Preto?", "Sim. A base é na região de Ribeirão Preto e Bebedouro, e o atendimento remoto cobre todo o Brasil. Cidades vizinhas são atendidas normalmente."],
      ["Minha empresa é pequena, ainda vale usar IA?", "Vale quando existe um gargalo real com repetição e impacto em venda. A Feed começa pequeno justamente para a PME não gastar errado."],
      ["Quanto custa começar?", "Depende do gargalo. As faixas reais de preço estão no guia de custos, e o diagnóstico gratuito indica o primeiro projeto com melhor retorno."],
    ],
    related: ["ia-para-pequenas-empresas", "automacao-whatsapp", "agentes-de-ia"],
  },
  {
    slug: "agencia-de-marketing-bebedouro",
    type: "local",
    title: "Agência de marketing e IA em Bebedouro | Feed",
    h1: "Agência de marketing e IA em Bebedouro para PME que precisa vender mais.",
    eyebrow: "Bebedouro e região",
    description:
      "A Feed é uma agência de marketing e IA com base em Bebedouro: posicionamento de marca, atendimento automatizado no WhatsApp e operação com IA para pequenas empresas. Diagnóstico gratuito.",
    intro:
      "A Feed nasceu unindo marketing e IA aplicada para ajudar empresas de Bebedouro e região a venderem mais sem depender de sorte. Menos post solto, mais operação que gera contato, atende rápido e converte.",
    primaryCta: "Pedir diagnóstico gratuito",
    secondaryCta: "Ver guia de custos",
    secondaryHref: "/blog/quanto-custa-implementar-ia-pequena-empresa/",
    serviceName:
      "Marketing, posicionamento e IA aplicada para empresas de Bebedouro e região",
    bulletsTitle: "O que a Feed faz por empresas de Bebedouro",
    bullets: [
      "Marketing com direção, ligado a venda e a posicionamento, não a post solto sem estratégia.",
      "Atendimento no WhatsApp automatizado para responder rápido e não perder cliente por demora.",
      "Posicionamento de marca e do empresário para a empresa ser lembrada na região.",
      "Automação de operação e follow-up para o time focar no que fecha negócio.",
    ],
    decisionTitle: "Por que unir marketing e IA",
    decisions: [
      "Marketing traz o contato, a IA garante que ele seja atendido na hora.",
      "Follow-up automático recupera quem ia esfriar e escapar.",
      "Posicionamento claro faz a empresa ser escolhida antes do preço.",
      "Tudo medido, para saber o que traz cliente e o que é só barulho.",
    ],
    faqs: [
      ["A Feed é de Bebedouro?", "Sim, a base da Feed é na região de Bebedouro e Ribeirão Preto. O atendimento é remoto na maior parte, com presença quando o projeto pede."],
      ["A Feed faz só marketing ou também IA?", "As duas coisas, juntas. A Feed começou no marketing e hoje aplica IA na operação: atendimento, follow-up e processos, sempre ligados a venda."],
      ["Serve para comércio e serviço local?", "Sim. O foco é PME da região com operação travada, que precisa de solução prática e rápida, não de projeto grande demais."],
      ["Como começa?", "Pelo diagnóstico gratuito. A Feed olha marketing e operação, mostra onde a venda escapa e indica o primeiro passo com maior retorno."],
    ],
    related: ["ia-para-pequenas-empresas", "diagnostico-ia-empresa", "automacao-whatsapp"],
  },
];

function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function linkFor(slug) {
  return `/${slug}/`;
}

function pageSchema(page) {
  const url = `${SITE}/${page.slug}/`;
  return [
    {
      "@context": "https://schema.org",
      "@type": page.type === "hub" ? "CollectionPage" : "Service",
      "@id": `${url}#${page.type === "hub" ? "page" : "service"}`,
      name: page.serviceName,
      headline: page.h1,
      description: page.description,
      url,
      inLanguage: "pt-BR",
      provider: ORG,
      areaServed: ORG.areaServed,
      serviceType: page.serviceName,
      audience: {
        "@type": "Audience",
        audienceType: "Pequenas e médias empresas",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: page.faqs.map(([q, a]) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
        { "@type": "ListItem", position: 2, name: page.h1, item: url },
      ],
    },
  ];
}

function renderPage(page) {
  const canonical = `${SITE}/${page.slug}/`;
  const related = page.related
    .map((slug) => {
      const item = pages.find((p) => p.slug === slug);
      return `<a href="${linkFor(slug)}">${esc(item.h1.replace(/\.$/, ""))}</a>`;
    })
    .join("");

  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="shortcut icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@300;500;700;800;900&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="/seo-pages.css" />
    <title>${esc(page.title)}</title>
    <meta name="description" content="${esc(page.description)}" />
    <link rel="canonical" href="${canonical}" />
    <meta name="robots" content="index, follow" />
    <meta name="theme-color" content="#070707" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Feed" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:title" content="${esc(page.title)}" />
    <meta property="og:description" content="${esc(page.description)}" />
    <meta property="og:image" content="${SITE}/og-image.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(page.title)}" />
    <meta name="twitter:description" content="${esc(page.description)}" />
    <meta name="twitter:image" content="${SITE}/og-image.png" />
    <script type="application/ld+json">
${JSON.stringify(pageSchema(page), null, 2)}
    </script>
  </head>
  <body>
    <main class="shell">
      <header class="top">
        <a class="brand" href="/" aria-label="Feed"><img src="/brand/feed-logo-simples-branca.png" alt="Feed" /></a>
        <nav aria-label="Navegação principal">
          <a href="/ia-para-pequenas-empresas/">IA para PMEs</a>
          <a href="/blog/">Blog</a>
          <a href="/#contato">Contato</a>
        </nav>
      </header>

      <section class="hero">
        <div>
          <p class="eyebrow">${esc(page.eyebrow)}</p>
          <h1>${esc(page.h1)}</h1>
          <p class="intro">${esc(page.intro)}</p>
          <div class="actions">
            <a class="button" href="/#contato">${esc(page.primaryCta)}</a>
            <a class="text-link" href="${page.secondaryHref}">${esc(page.secondaryCta)}</a>
          </div>
        </div>
        <aside class="answer-box">
          <span>Resposta curta</span>
          <p>${esc(page.bullets[0])}</p>
          <small>Para SEO e GEO, a Feed descreve IA como solução operacional mensurável, não como promessa genérica.</small>
        </aside>
      </section>

      <section class="split">
        <div>
          <p class="eyebrow">${esc(page.bulletsTitle)}</p>
          <h2>O que precisa ficar claro antes de investir</h2>
        </div>
        <div class="cards">
          ${page.bullets.map((item) => `<article><h3>${esc(item)}</h3></article>`).join("\n          ")}
        </div>
      </section>

      <section class="decision">
        <div>
          <p class="eyebrow">${esc(page.decisionTitle)}</p>
          <h2>Critérios práticos para decidir</h2>
        </div>
        <ol>
          ${page.decisions.map((item) => `<li>${esc(item)}</li>`).join("\n          ")}
        </ol>
      </section>

      <section class="faq">
        <p class="eyebrow">Perguntas frequentes</p>
        <div class="faq-grid">
          ${page.faqs
            .map(([q, a]) => `<article><h2>${esc(q)}</h2><p>${esc(a)}</p></article>`)
            .join("\n          ")}
        </div>
      </section>

      <section class="related">
        <div>
          <p class="eyebrow">Continue pelo cluster</p>
          <h2>Páginas e guias relacionados</h2>
        </div>
        <div class="related-links">
          ${related}
          <a href="/blog/quanto-custa-implementar-ia-pequena-empresa/">Quanto custa implementar IA numa pequena empresa?</a>
          <a href="/blog/">Todos os artigos do blog</a>
        </div>
      </section>

      <aside class="cta">
        <h2>Quer saber onde começar na sua empresa?</h2>
        <p>A Feed faz um diagnóstico gratuito da sua operação e mostra o primeiro projeto de IA com maior chance de retorno.</p>
        <a class="button" href="/#contato">Pedir diagnóstico gratuito</a>
      </aside>

      <footer class="site-nap">
        <address>
          <strong>Feed, marketing e IA</strong><br />
          Interior de São Paulo, região de Ribeirão Preto e Bebedouro. Atendimento remoto em todo o Brasil.<br />
          <a href="tel:+5516993020694">(16) 99302-0694</a>
          <span aria-hidden="true"> · </span>
          <a href="https://wa.me/5516993020694" target="_blank" rel="noopener">WhatsApp</a>
          <span aria-hidden="true"> · </span>
          <a href="mailto:emailmkt@agenciafeed.com">emailmkt@agenciafeed.com</a>
        </address>
        <p class="nap-legal">FEED MARKETING E COMUNICAÇÃO · CNPJ 53.877.987/0001-93</p>
      </footer>
    </main>
  </body>
</html>
`;
}

function renderCss() {
  return `:root {
  --black: #070707;
  --surface: #11100d;
  --surface-2: #181711;
  --white: #f4f5f0;
  --orange: #ffa300;
  --muted: rgba(244, 245, 240, 0.7);
  --line: rgba(244, 245, 240, 0.11);
}
* { box-sizing: border-box; }
html { background: var(--black); }
body {
  margin: 0;
  min-width: 320px;
  color: var(--white);
  background:
    radial-gradient(circle at 18% 0%, rgba(255, 163, 0, 0.12), transparent 24rem),
    linear-gradient(180deg, rgba(244, 245, 240, 0.04), transparent 32rem),
    var(--black);
  font-family: Barlow, Arial, Helvetica, sans-serif;
  line-height: 1.65;
}
a { color: inherit; text-decoration: none; }
.shell {
  max-width: 1140px;
  margin: 0 auto;
  padding: clamp(26px, 4vw, 44px) clamp(20px, 5vw, 44px) 72px;
}
.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: clamp(48px, 8vw, 90px);
}
.brand img { display: block; max-width: 120px; height: 26px; width: auto; }
nav { display: flex; flex-wrap: wrap; gap: 14px 24px; color: rgba(244, 245, 240, 0.66); font-size: 0.82rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; }
nav a:hover, .text-link:hover { color: var(--orange); }
.hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 390px);
  gap: clamp(30px, 6vw, 72px);
  align-items: center;
  margin-bottom: clamp(42px, 7vw, 76px);
}
.eyebrow {
  margin: 0 0 16px;
  color: var(--orange);
  font-size: 0.74rem;
  font-weight: 900;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}
h1, h2, h3, p { margin-top: 0; }
h1 {
  max-width: 760px;
  margin-bottom: 22px;
  font-size: clamp(2.55rem, 6.4vw, 5.05rem);
  line-height: 0.94;
  font-weight: 900;
}
h2 { font-size: clamp(1.55rem, 3vw, 2.2rem); line-height: 1.05; }
.intro {
  max-width: 650px;
  color: var(--muted);
  font-size: 1.16rem;
  font-weight: 300;
}
.actions { display: flex; flex-wrap: wrap; gap: 14px 22px; align-items: center; margin-top: 30px; }
.button {
  display: inline-flex;
  width: fit-content;
  padding: 14px 22px;
  border-radius: 5px;
  background: var(--orange);
  color: var(--black);
  font-size: 0.9rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.text-link { color: rgba(244, 245, 240, 0.72); font-weight: 800; }
.answer-box {
  padding: 28px;
  border: 1px solid rgba(255, 163, 0, 0.26);
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(255, 163, 0, 0.12), transparent 38%), var(--surface);
}
.answer-box span {
  display: block;
  margin-bottom: 14px;
  color: var(--orange);
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}
.answer-box p { color: var(--white); font-size: 1.25rem; font-weight: 800; line-height: 1.18; }
.answer-box small { color: rgba(244, 245, 240, 0.58); }
.split, .decision, .related, .cta {
  margin-top: clamp(34px, 6vw, 64px);
}
.split {
  display: grid;
  grid-template-columns: minmax(220px, 0.55fr) minmax(0, 1fr);
  gap: clamp(24px, 5vw, 52px);
}
.cards {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}
.cards article {
  min-height: 140px;
  padding: 22px;
  border-radius: 8px;
  background: rgba(244, 245, 240, 0.045);
  border: 1px solid var(--line);
}
.cards h3 { margin: 0; font-size: 1.16rem; line-height: 1.22; }
.decision {
  display: grid;
  grid-template-columns: minmax(220px, 0.55fr) minmax(0, 1fr);
  gap: clamp(24px, 5vw, 52px);
  padding: clamp(26px, 5vw, 42px);
  border-radius: 8px;
  background: var(--surface-2);
}
ol { margin: 0; padding: 0; list-style: none; counter-reset: step; display: grid; gap: 16px; }
ol li {
  counter-increment: step;
  display: grid;
  grid-template-columns: 38px minmax(0, 1fr);
  gap: 14px;
  color: var(--muted);
  font-weight: 700;
}
ol li::before {
  content: counter(step, decimal-leading-zero);
  color: var(--orange);
  font-weight: 900;
}
.faq-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
.faq article {
  padding: 22px;
  border: 1px solid var(--line);
  border-radius: 8px;
}
.faq h2 { font-size: 1.2rem; }
.faq p, .cta p { color: var(--muted); font-weight: 300; }
.related {
  display: grid;
  grid-template-columns: minmax(220px, 0.55fr) minmax(0, 1fr);
  gap: clamp(24px, 5vw, 52px);
  align-items: start;
}
.related-links { display: grid; gap: 10px; }
.related-links a {
  padding: 16px 18px;
  border-radius: 8px;
  background: rgba(244, 245, 240, 0.04);
  color: rgba(244, 245, 240, 0.78);
  font-weight: 800;
}
.related-links a:hover { color: var(--orange); }
.cta {
  padding: clamp(26px, 5vw, 40px);
  border-radius: 8px;
  border: 1px solid rgba(255, 163, 0, 0.24);
  background: linear-gradient(135deg, rgba(255, 163, 0, 0.11), transparent 44%), var(--surface);
}
.site-nap {
  margin-top: clamp(34px, 6vw, 64px);
  padding-top: 24px;
  border-top: 1px solid rgba(244, 245, 240, 0.1);
  display: grid;
  gap: 8px;
}
.site-nap address {
  font-style: normal;
  color: rgba(244, 245, 240, 0.66);
  font-size: 0.9rem;
  line-height: 1.6;
}
.site-nap address strong { color: rgba(244, 245, 240, 0.92); }
.site-nap a { color: rgba(244, 245, 240, 0.86); font-weight: 700; }
.site-nap a:hover { color: var(--orange); }
.nap-legal {
  color: rgba(244, 245, 240, 0.34);
  font-size: 0.74rem;
  letter-spacing: 0.02em;
}
@media (max-width: 820px) {
  .top, nav { align-items: flex-start; }
  .top, .hero, .split, .decision, .related { grid-template-columns: 1fr; }
  .top { display: grid; }
  h1 { font-size: clamp(2.35rem, 12vw, 3.35rem); }
  .cards, .faq-grid { grid-template-columns: 1fr; }
  .cards article { min-height: 0; }
}
`;
}

function updateSitemap() {
  const path = join(PUBLIC_DIR, "sitemap.xml");
  let xml = readFileSync(path, "utf8");
  // Remove dinamicamente as entradas das paginas atuais antes de reinserir,
  // para o build ser idempotente e nao acumular duplicatas a cada rodada.
  const reEsc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const slugAlt = pages.map((p) => reEsc(p.slug)).join("|");
  xml = xml.replace(
    new RegExp(
      `\\s*<url>\\s*<loc>${reEsc(SITE)}/(?:${slugAlt})/</loc>[\\s\\S]*?</url>`,
      "g"
    ),
    ""
  );

  const entries = pages
    .map(
      (page) => `  <url>
    <loc>${SITE}/${page.slug}/</loc>
    <lastmod>${LASTMOD}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${page.type === "hub" ? "0.9" : "0.8"}</priority>
  </url>`
    )
    .join("\n");

  xml = xml.replace("</urlset>", `${entries}\n</urlset>`);
  writeFileSync(path, xml, "utf8");
}

function updateLlms() {
  const path = join(PUBLIC_DIR, "llms.txt");
  let text = readFileSync(path, "utf8");
  text = text.replace(/\n## Páginas estratégicas[\s\S]*?(?=\n## |\n?$)/, "");
  text += `\n\n## Páginas estratégicas\n\n`;
  text += pages
    .map((page) => `- ${page.h1.replace(/\.$/, "")}: ${SITE}/${page.slug}/`)
    .join("\n");
  text += `\n- Blog da Feed: ${SITE}/blog/\n`;
  writeFileSync(path, text, "utf8");
}

function main() {
  mkdirSync(PUBLIC_DIR, { recursive: true });
  writeFileSync(join(PUBLIC_DIR, "seo-pages.css"), renderCss(), "utf8");

  for (const page of pages) {
    const dir = join(PUBLIC_DIR, page.slug);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "index.html"), renderPage(page), "utf8");
    console.log(`gerado: public/${page.slug}/index.html`);
  }

  if (existsSync(join(PUBLIC_DIR, "sitemap.xml"))) updateSitemap();
  if (existsSync(join(PUBLIC_DIR, "llms.txt"))) updateLlms();
  console.log(`${pages.length} página(s) SEO/GEO geradas.`);
}

main();
