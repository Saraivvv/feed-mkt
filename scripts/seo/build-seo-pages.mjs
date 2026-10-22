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

const AREA_SERVED = [
  ...["Ribeirão Preto", "Bebedouro", "Barretos", "Jaboticabal", "Sertãozinho"].map((name) => ({ "@type": "City", name })),
  { "@type": "Country", name: "Brasil" },
];

const pages = [
  {
    slug: "ia-para-pequenas-empresas",
    type: "hub",
    lastmod: "2026-10-22",
    title: "Agência de IA para pequenas empresas | Feed",
    h1: "IA para pequenas empresas, sem projeto inflado",
    eyebrow: "Serviço",
    updated: "Atualizado em outubro de 2026.",
    description:
      "A Feed ajuda pequenas e médias empresas a destravar atendimento, follow-up e operação com automação. IA entra quando faz sentido. Ribeirão Preto e todo o Brasil.",
    intro:
      "A Feed é uma agência de Ribeirão Preto (SP) que ajuda pequenas e médias empresas a resolver onde a operação trava: atendimento lento no WhatsApp, follow-up esquecido, processo manual e informação espalhada. A gente começa pelo gargalo, não pela ferramenta. Muita coisa se resolve com automação e processo bem desenhado; a IA entra como adicional quando faz sentido pro negócio. Atende a região de Ribeirão Preto e Bebedouro e empresas de todo o Brasil de forma remota.",
    answer:
      "A gente começa pelo gargalo, não pela ferramenta. Muita coisa se resolve com automação e processo bem desenhado; a IA entra como adicional quando faz sentido pro negócio.",
    primaryCta: "Quero o diagnóstico",
    primaryHref: "/diagnostico",
    sections: [
      {
        h2: "Pra quem é",
        paragraphs: ["Pro dono ou gestor de PME que virou o gargalo da própria operação. Sinais comuns:"],
        list: [
          "O cliente espera resposta no WhatsApp e o time demora.",
          "A mesma pergunta chega todo dia e alguém responde na mão.",
          "Lead some porque ninguém faz follow-up.",
          "O atendimento depende de uma pessoa que sabe tudo de cabeça.",
        ],
      },
      {
        h2: "O que a Feed faz",
        list: [
          "**Automação de atendimento no WhatsApp.** Responde o básico na hora, qualifica quem tem perfil de compra e passa pra uma pessoa quando a conversa pede cuidado. → [Ver automação de WhatsApp](/automacao-whatsapp/)",
          "**Automação de processos internos.** Tira do time a tarefa repetitiva de operação, vendas e conteúdo.",
          "**Agentes de IA, se fizer sentido.** Um assistente treinado no contexto da empresa: conhece a oferta, as regras de atendimento e os limites do que pode responder. Entra como adicional opcional na proposta e muda o valor. → [Ver agentes de IA](/agentes-de-ia/)",
          "**Marca e aquisição.** Posicionamento de marca e de empresários, sites, redes sociais e SEO.",
        ],
      },
      {
        h2: "Por onde uma pequena empresa começa",
        ordered: true,
        list: [
          "**Achar onde o time perde mais tempo ou mais venda.**",
          "**Escolher um processo só,** com volume, repetição e impacto claro no caixa. Normalmente é o atendimento ou o follow-up comercial.",
          "**Resolver com uma solução enxuta** antes de comprar várias ferramentas.",
          "**Medir** tempo economizado, velocidade de resposta e oportunidades recuperadas.",
        ],
      },
      {
        h2: "Como a Feed trabalha",
        list: [
          "**Escopo realista pra PME.** Projeto do tamanho do problema, não do tamanho da proposta.",
          "**Implementação, não só consultoria.** A solução entra na rotina da empresa e roda.",
          "**Sem hype.** IA é ferramenta pra resolver gargalo, não promessa milagrosa. E nem todo gargalo precisa dela.",
          "**Atendimento próximo.** Agência de dois sócios: operação e IA com o Guilherme, administração com a Roseane.",
          "**Conecta ao que a empresa já usa:** WhatsApp, CRM, agenda, planilhas e documentos, sem trocar sistema.",
        ],
      },
      {
        h2: "Quanto custa",
        paragraphs: [
          "O preço é personalizado: sai numa proposta feita pro seu caso, depois de entender onde a operação trava. A Feed trabalha de dois jeitos, e a proposta diz qual faz sentido: implementação mais manutenção, quando a solução precisa de acompanhamento depois de entregue, ou serviço pontual, com pagamento único. Se entrar IA, ela aparece como item à parte e muda o valor. Veja o que compõe o preço em [quanto custa](/quanto-custa/).",
        ],
      },
      {
        h2: "Do primeiro contato até a proposta",
        ordered: true,
        list: [
          "**Diagnóstico do Gargalo.** Você deixa nome e e-mail em agenciafeed.com/diagnostico e recebe o PDF no seu e-mail na hora.",
          "**Conversa com o Guilherme** sobre o seu caso, incluindo se IA faz sentido ou não.",
          "**Proposta personalizada,** com problema, entrega, limites, prazo e valor no papel.",
          "**Implementação.** O prazo depende da clareza das respostas, das integrações e do volume de exceções, e vem escrito na proposta.",
        ],
      },
    ],
    faqs: [
      ["Qual agência faz IA para pequenas empresas?", "A Feed é uma agência de Ribeirão Preto (SP) focada em pequenas e médias empresas. Ela resolve gargalo de atendimento, follow-up e operação com automação, e usa IA quando faz sentido pro negócio. Atende a região de Ribeirão Preto e Bebedouro e todo o Brasil de forma remota."],
      ["O que é IA para pequenas empresas, na prática?", "É usar automação e, quando faz sentido, IA pra tirar do time tarefa repetitiva: responder a primeira mensagem do cliente, puxar de volta o lead que sumiu, organizar informação espalhada. Não é robô pensando sozinho. É processo claro, com regras que a empresa define."],
      ["Toda pequena empresa precisa de IA?", "Não. Muito gargalo se resolve organizando atendimento e processo, sem IA. A IA entra como adicional quando o caso pede, por exemplo um agente que responde com o contexto da empresa, e aí muda o valor da proposta."],
      ["Qual é o primeiro processo pra automatizar?", "Normalmente o atendimento ou o follow-up comercial, porque têm repetição, impacto direto em vendas e retorno mais fácil de medir."],
      ["Preciso trocar meus sistemas ou ter time de TI?", "Não necessariamente. A Feed começa conectando a solução ao que a empresa já usa: WhatsApp, CRM, agenda, planilhas e documentos. A Feed implementa e treina quem vai usar. Se o projeto tiver manutenção, a Feed acompanha depois da entrega."],
      ["Automação no WhatsApp não vai irritar meus clientes?", "Irrita quando é rígida e burra. Automação bem feita resolve o simples, deixa claro quando chama uma pessoa e evita resposta genérica."],
      ["Quanto custa?", "O preço é personalizado e sai numa proposta, depois de uma conversa sobre o seu caso. A Feed trabalha de dois jeitos: implementação mais manutenção, ou serviço pontual com pagamento único. IA, se entrar, é adicional e muda o valor. O que compõe o preço está em [agenciafeed.com/quanto-custa](/quanto-custa/)."],
      ["Em quanto tempo fica pronto?", "O prazo depende da clareza das respostas, das integrações e do volume de exceções, e vem escrito na proposta."],
      ["A Feed atende só Ribeirão Preto?", "Não. A base é Ribeirão Preto e Bebedouro, com atendimento em Barretos, Jaboticabal, Sertãozinho e região, e no resto do Brasil de forma remota."],
      ["Como começo?", "Pelo Diagnóstico do Gargalo: você deixa nome e e-mail e recebe o PDF no seu e-mail na hora. Depois, se fizer sentido, conversa com o Guilherme sobre o seu caso. Comece em [agenciafeed.com/diagnostico](/diagnostico)."],
    ],
    schemaNodes: [
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": `${SITE}/ia-para-pequenas-empresas/#page`,
        url: `${SITE}/ia-para-pequenas-empresas/`,
        name: "Agência de IA para pequenas empresas | Feed",
        inLanguage: "pt-BR",
        about: { "@id": `${SITE}/ia-para-pequenas-empresas/#service` },
        dateModified: "2026-10-22",
      },
      {
        "@context": "https://schema.org",
        "@type": "Service",
        "@id": `${SITE}/ia-para-pequenas-empresas/#service`,
        name: "IA e automação para pequenas e médias empresas",
        serviceType: "Automação de atendimento, follow-up e processos para PME, com IA como adicional opcional",
        description:
          "A Feed resolve gargalos de atendimento, follow-up e operação de pequenas e médias empresas com automação. IA entra como adicional quando faz sentido para o negócio. Preço personalizado, definido em proposta.",
        provider: { "@id": `${SITE}/#organization` },
        audience: { "@type": "BusinessAudience", name: "Donos e gestores de pequenas e médias empresas" },
        areaServed: AREA_SERVED,
      },
    ],
    related: ["automacao-whatsapp", "agentes-de-ia", "diagnostico-ia-empresa", "agencia-de-ia-ribeirao-preto"],
    relatedPosts: [
      ["/quanto-custa/", "Quanto custa automação e IA para pequena empresa"],
      ["/blog/primeiro-processo-automatizar-pme/", "Como escolher o primeiro processo para automatizar"],
    ],
    ctaTitle: "Quer saber onde a sua empresa trava?",
    ctaText: "Comece pelo Diagnóstico do Gargalo. Ele chega no seu e-mail na hora, e depois você conversa com o Guilherme sobre o seu caso.",
    ctaButton: "Quero o diagnóstico",
    ctaHref: "/diagnostico",
  },
  {
    slug: "automacao-whatsapp",
    type: "service",
    lastmod: "2026-10-22",
    title: "Atendimento no WhatsApp com IA para pequenas empresas | Feed",
    h1: "Atendimento no WhatsApp que responde rápido sem parecer robô",
    eyebrow: "Serviço",
    description:
      "A Feed monta o atendimento no WhatsApp da pequena empresa: responde o básico na hora, qualifica o lead e chama uma pessoa quando a conversa pede. IA entra quando faz sentido.",
    intro:
      "Atendimento no WhatsApp com IA é colocar a primeira resposta, a triagem e o registro do contato pra rodar sozinhos, e deixar a sua equipe só com a conversa que pede gente. A Feed monta isso pra pequenas e médias empresas: responde o básico na hora, qualifica quem tem perfil de compra e passa pra uma pessoa quando a conversa pede cuidado. Muita coisa se resolve com fluxo simples. A IA entra como adicional quando a conversa é aberta e o fluxo não dá conta. A Feed é de Ribeirão Preto (SP) e atende a região e o resto do Brasil de forma remota.",
    answer:
      "A Feed monta o atendimento no WhatsApp da sua empresa: resposta na hora pro básico, qualificação do lead e uma pessoa assumindo quando a conversa pede. IA entra se fizer sentido.",
    primaryCta: "Quero o diagnóstico",
    primaryHref: "/diagnostico",
    breadcrumbName: "Automação de WhatsApp com IA",
    sections: [
      {
        h2: "Pra quem é",
        paragraphs: [
          "Pro dono de PME que virou o atendente principal da própria empresa: o celular não para, a resposta sai quando dá e a venda esfria no intervalo. Sinais de que o WhatsApp virou gargalo:",
        ],
        list: [
          "A empresa recebe as mesmas perguntas todos os dias.",
          "O time demora pra responder contato novo.",
          "Lead some porque ninguém faz follow-up.",
          "O atendimento depende de uma pessoa que sabe tudo de cabeça.",
        ],
        after: ["Se chegam poucas mensagens e o time responde bem, ainda não é a hora. Primeiro organiza o atendimento."],
      },
      {
        h2: "O que entra no atendimento",
        list: [
          "**Resposta pras perguntas frequentes,** na hora, inclusive fora do horário.",
          "**Qualificação do lead** antes de chegar no time comercial.",
          "**Passagem pra uma pessoa** quando aparece objeção, negociação ou exceção.",
          "**Registro do que importa** no CRM, na agenda ou na planilha.",
        ],
        after: [
          "Exemplo: o cliente pergunta às 22h se tem horário na quinta. O atendimento responde, pergunta o que ele precisa e deixa o pedido registrado. De manhã, a sua equipe abre a conversa já sabendo o que fazer.",
        ],
      },
      {
        h2: "Fluxo simples ou IA?",
        paragraphs: ["Depende do tipo de dúvida que chega no seu WhatsApp:"],
        list: [
          "**Fluxo simples** segue roteiro fixo. Serve pra horário, endereço, documentos e direcionamento inicial. Trava quando o cliente foge das opções.",
          "**IA** lê o que o cliente escreveu, responde no contexto da empresa e sabe a hora de chamar uma pessoa. Faz sentido quando a conversa varia, mas ainda tem padrão.",
        ],
        after: [
          "Na Feed, a IA é adicional opcional: entra na proposta só se o seu atendimento pedir e, quando entra, aparece como item à parte e muda o valor. Pra decidir com calma, leia [chatbot ou agente de IA no WhatsApp](/blog/agente-ia-whatsapp-vale-a-pena/).",
        ],
      },
      {
        h2: "Conta oficial ou o número que você já usa?",
        paragraphs: [
          "Existem duas formas de ligar a automação ao WhatsApp. A conta oficial para empresas costuma ser escolhida quando o volume é alto ou várias pessoas atendem ao mesmo tempo. Conectar o WhatsApp que a empresa já usa costuma ser escolhido quando o atendimento roda num número só e a equipe quer continuar no aplicativo que conhece. Não existe resposta única: a escolha depende do volume e do que precisa integrar.",
        ],
      },
      {
        h2: "O que continua com a sua equipe",
        paragraphs: [
          "Negociação complexa, reclamação séria, exceção comercial e conversa emocional. A automação não tenta fingir que resolve tudo. Ela tira o repetitivo da frente e entrega a conversa pra quem decide.",
        ],
      },
      {
        h2: "Como a Feed faz",
        list: [
          "**Começa pelo gargalo,** não pela ferramenta.",
          "**Escreve as regras com você:** o que é respondido sozinho, o que não é e quando uma pessoa assume.",
          "**Organiza as informações do negócio** que o atendimento usa: oferta, regras e limites do que pode ser respondido.",
          "**Conecta ao que a empresa já usa:** WhatsApp, CRM, agenda e planilhas, sem trocar sistema.",
          "**Testa antes de abrir pro cliente.**",
          "**Passa a conversa com resumo e contexto:** quem assume já recebe um resumo do que foi dito e o contexto do cliente, e atende com mais acerto.",
          "**Implementa e treina quem vai usar.** O acompanhamento depois da entrega entra quando o projeto tem manutenção.",
        ],
      },
      {
        h2: "Como saber se valeu",
        paragraphs: [
          "Antes de começar, anote por uma semana: quantas mensagens novas chegam por dia, quanto tempo a empresa demora pra responder e quantas conversas ficam sem próximo passo. Depois, compare tempo de resposta, agendamentos, orçamentos enviados e vendas recuperadas. Sem esse ponto de partida, qualquer resultado vira opinião. Se a dúvida ainda é se vale a pena pra sua empresa, leia [automação de WhatsApp para pequena empresa: quando vale a pena](/blog/automacao-whatsapp-pequena-empresa/) e [como medir perda de vendas por demora no atendimento](/blog/como-medir-perda-vendas-demora-atendimento/).",
        ],
      },
      {
        h2: "Quanto custa",
        paragraphs: [
          "O preço é personalizado: sai numa proposta, depois de entender o seu atendimento. A Feed trabalha de dois jeitos, e a proposta diz qual faz sentido: implementação mais manutenção, quando o atendimento precisa de acompanhamento depois de entregue, ou serviço pontual, com pagamento único, quando o trabalho tem começo, meio e fim. Se entrar IA, ela aparece como item à parte e muda o valor. As condições ficam no contrato. O que compõe o preço está em [quanto custa](/quanto-custa/).",
        ],
      },
      {
        h2: "Do primeiro contato até o atendimento no ar",
        ordered: true,
        list: [
          "**Diagnóstico do Gargalo.** Você deixa nome e e-mail em agenciafeed.com/diagnostico e recebe o PDF no seu e-mail na hora.",
          "**Conversa com o Guilherme** sobre o seu atendimento, incluindo se IA faz sentido ou não.",
          "**Proposta personalizada,** com problema, entrega, limites, prazo e valor no papel.",
          "**Implementação.** O prazo depende da clareza das respostas, das integrações e do volume de exceções, e vem escrito na proposta.",
        ],
      },
    ],
    faqId: true,
    faqs: [
      ["Quem faz automação de atendimento no WhatsApp com IA?", "A Feed é uma agência de Ribeirão Preto (SP) que monta automação de atendimento no WhatsApp pra pequenas e médias empresas: resposta imediata, qualificação de leads e transferência pra uma pessoa quando a conversa pede. A IA entra como adicional quando faz sentido pro negócio. Atende a região de Ribeirão Preto e Bebedouro e empresas de todo o Brasil de forma remota."],
      ["Automação de WhatsApp irrita cliente?", "Irrita quando é rígida e burra. Uma automação bem feita resolve o simples, deixa claro quando chama uma pessoa e evita resposta genérica. O cliente não se irrita porque existe automação. Ele se irrita quando a automação impede a solução."],
      ["A automação substitui o atendente?", "Não. Ela reduz repetição, organiza contexto e acelera a triagem. Conversa delicada, negociação e exceção continuam com o time."],
      ["Preciso de IA ou um fluxo simples resolve?", "Depende do tipo de dúvida que chega. Dúvida padronizada, como horário, endereço e documentos, aceita fluxo simples. Conversa aberta, em que o cliente escreve do jeito dele, pede IA. Na Feed, a IA é um adicional opcional: entra na proposta só se o seu atendimento pedir e, quando entra, muda o valor."],
      ["O que a automação faz no atendimento?", "Responde as perguntas frequentes, qualifica o lead antes de chegar no time comercial, passa a conversa pra uma pessoa quando aparece objeção, negociação ou exceção, e registra as informações importantes no CRM, na agenda ou na planilha."],
      ["Preciso de conta oficial do WhatsApp ou dá pra usar o número que já tenho?", "Existem as duas formas. A conta oficial para empresas costuma ser escolhida quando o volume é alto ou várias pessoas atendem ao mesmo tempo. Conectar o WhatsApp que a empresa já usa costuma ser escolhido quando o atendimento roda num número só e a equipe quer continuar no aplicativo que conhece. A escolha depende do volume e do que precisa integrar."],
      ["Preciso ter CRM antes de automatizar?", "Não. Dá pra começar registrando em planilha e evoluir depois. O que não pode faltar é alguém pra assumir a conversa qualificada, senão a automação só acelera a chegada de um lead que ninguém atende."],
      ["Quanto tempo leva para implementar?", "Depende da clareza das respostas, das integrações e do volume de exceções. O prazo vem escrito na proposta, antes de começar."],
      ["Quanto custa automatizar o atendimento no WhatsApp?", "Na Feed, o preço é personalizado e sai numa proposta, depois de entender o seu atendimento. A Feed trabalha de dois jeitos: implementação mais manutenção, quando a solução precisa de acompanhamento depois de entregue, ou serviço pontual, com pagamento único. Se entrar IA, ela aparece como item à parte e muda o valor. O que compõe o preço está em [agenciafeed.com/quanto-custa](/quanto-custa/)."],
      ["Como começo com a Feed?", "Pelo Diagnóstico do Gargalo: você deixa nome e e-mail e recebe o PDF no seu e-mail na hora. Depois, se fizer sentido, conversa com o Guilherme sobre o seu atendimento. Comece em [agenciafeed.com/diagnostico](/diagnostico)."],
    ],
    schemaNodes: [
      {
        "@context": "https://schema.org",
        "@type": "Service",
        "@id": `${SITE}/automacao-whatsapp/#service`,
        name: "Automação de atendimento no WhatsApp para pequenas e médias empresas",
        headline: "Atendimento no WhatsApp que responde rápido sem parecer robô",
        serviceType: "Automação de atendimento no WhatsApp, com IA como adicional opcional",
        description:
          "A Feed monta automação de atendimento no WhatsApp para pequenas e médias empresas: resposta imediata às perguntas frequentes, qualificação de leads, transferência para uma pessoa quando a conversa pede e registro no CRM, na agenda ou na planilha. IA entra como adicional quando faz sentido. Preço personalizado, definido em proposta.",
        url: `${SITE}/automacao-whatsapp/`,
        inLanguage: "pt-BR",
        provider: { "@id": `${SITE}/#organization` },
        audience: { "@type": "BusinessAudience", name: "Donos e gestores de pequenas e médias empresas" },
        areaServed: AREA_SERVED,
      },
    ],
    ctaTitle: "Quantas mensagens ficaram sem resposta hoje?",
    ctaText: "Comece pelo Diagnóstico do Gargalo. Ele chega no seu e-mail na hora, e depois você conversa com o Guilherme sobre o seu atendimento.",
    ctaButton: "Quero o diagnóstico",
    ctaHref: "/diagnostico",
    related: ["ia-para-pequenas-empresas", "agentes-de-ia", "diagnostico-ia-empresa"],
    relatedPosts: [
      ["/blog/automacao-whatsapp-pequena-empresa/", "Automação de WhatsApp: quando vale a pena"],
      ["/blog/agente-ia-whatsapp-vale-a-pena/", "Agente de IA no WhatsApp vale para sua empresa?"],
      ["/blog/como-medir-perda-vendas-demora-atendimento/", "Como medir perda de vendas por demora no atendimento"],
    ],
  },
  {
    slug: "agentes-de-ia",
    type: "service",
    title: "Agentes de IA para empresas e PMEs | Feed",
    h1: "Agentes de IA treinados no contexto da sua empresa.",
    eyebrow: "Serviço",
    lastmod: "2026-10-22",
    description:
      "Agentes de IA para pequenas e médias empresas: atendimento, vendas, operação, conteúdo e processos internos, treinados no contexto do negócio. Na Feed, o agente é adicional opcional e o preço sai em proposta.",
    intro:
      "Agente de IA bom não é um chat genérico. Ele precisa conhecer a oferta, os processos, as regras de atendimento e os limites do que pode responder. Na Feed, ele é um adicional: entra na proposta só quando o seu caso pede.",
    primaryCta: "Quero o diagnóstico",
    primaryHref: "/diagnostico",
    answer:
      "Agente de IA é um assistente treinado na oferta, nas regras e nos limites da sua empresa. Na Feed, ele entra como adicional opcional, só quando o caso pede, e muda o valor da proposta.",
    serviceName: "Implementação de agentes de IA para empresas (adicional opcional)",
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
      ["Toda empresa precisa de um agente de IA?", "Não. Muito gargalo se resolve com processo e automação simples. Na Feed, o agente é um adicional opcional: entra na proposta só se o seu caso pedir e, quando entra, muda o valor."],
      ["Agente de IA pode errar?", "Pode, por isso o projeto precisa de limites, revisão de respostas críticas, base confiável e passagem para humano nos casos certos."],
      ["Um agente de IA precisa integrar com sistemas?", "Nem sempre no começo. A integração faz sentido quando o agente precisa consultar ou registrar dados em CRM, agenda, planilhas ou plataformas internas."],
      ["Quanto custa um agente de IA?", "O preço é personalizado e sai numa proposta, depois de entender o seu caso. O agente aparece como item à parte. A Feed trabalha de dois jeitos: implementação mais manutenção, ou serviço pontual com pagamento único. O que compõe o preço está em agenciafeed.com/quanto-custa."],
      ["Como começo?", "Pelo Diagnóstico do Gargalo: você deixa nome e e-mail em agenciafeed.com/diagnostico e recebe o PDF no seu e-mail na hora. Depois, se fizer sentido, conversa com o Guilherme sobre o seu caso, incluindo se um agente faz sentido ou não."],
    ],
    ctaTitle: "Quer saber se a sua empresa precisa de um agente?",
    ctaText: "Comece pelo Diagnóstico do Gargalo. Ele chega no seu e-mail na hora, e depois você conversa com o Guilherme sobre o seu caso.",
    ctaButton: "Quero o diagnóstico",
    ctaHref: "/diagnostico",
    related: ["ia-para-pequenas-empresas", "automacao-whatsapp", "diagnostico-ia-empresa"],
    relatedPosts: [
      ["/blog/agente-ia-whatsapp-vale-a-pena/", "Agente de IA no WhatsApp vale para sua empresa?"],
      ["/blog/dados-desorganizados-ia-responde-mal/", "Dados desorganizados fazem a IA responder mal"],
      ["/blog/integrar-ia-crm-agenda-planilhas/", "Integrar IA com CRM, agenda e planilhas"],
    ],
  },
  {
    slug: "diagnostico-ia-empresa",
    type: "service",
    lastmod: "2026-10-22",
    title: "Diagnóstico do Gargalo para pequenas empresas | Feed",
    h1: "Descubra onde a sua operação trava antes de pensar em IA.",
    eyebrow: "Diagnóstico gratuito",
    description:
      "O Diagnóstico do Gargalo da Feed é um PDF gratuito que chega no seu e-mail na hora e ajuda a ver onde a empresa ainda depende de você. Depois, se fizer sentido, uma conversa com o Guilherme.",
    intro:
      "Antes de comprar ferramenta ou montar agente, vale enxergar onde a empresa trava. O Diagnóstico do Gargalo é um material curto e direto que chega no seu e-mail na hora. Depois, se fizer sentido, você conversa com o Guilherme sobre o seu caso.",
    primaryCta: "Quero o diagnóstico",
    primaryHref: "/diagnostico",
    answer:
      "O Diagnóstico do Gargalo é um PDF gratuito. Você deixa nome e e-mail e ele chega no seu e-mail na hora. Depois, se fizer sentido, você conversa com o Guilherme.",
    serviceName: "Diagnóstico do Gargalo (gratuito)",
    bulletsTitle: "O que o material ajuda você a enxergar",
    bullets: [
      "Onde a operação para quando você não está por perto.",
      "Os pontos que mais consomem seu tempo hoje.",
      "O primeiro passo pra tirar a empresa das suas costas.",
    ],
    decisionTitle: "Como funciona",
    decisions: [
      "Você deixa nome e e-mail em agenciafeed.com/diagnostico.",
      "O PDF chega no seu e-mail na hora.",
      "Se fizer sentido, você conversa com o Guilherme sobre o seu caso.",
      "Se virar projeto, ele vem numa proposta personalizada, com escopo, prazo e valor no papel. IA só entra se fizer sentido, como adicional.",
    ],
    faqs: [
      ["O diagnóstico é gratuito mesmo?", "Sim. Você deixa nome e e-mail e recebe o Diagnóstico do Gargalo em PDF, no seu e-mail, na hora."],
      ["Preciso já saber o que quero automatizar?", "Não. O material ajuda a enxergar onde a operação trava. Se fizer sentido, a conversa com o Guilherme vem depois."],
      ["O diagnóstico já diz se eu preciso de IA?", "Não. Ele ajuda a ver onde a operação trava. Se IA faz sentido ou não é assunto da conversa com o Guilherme, e, se entrar, ela aparece como adicional na proposta."],
      ["O diagnóstico serve para empresas pequenas?", "Sim. Ele foi pensado pro dono de pequena e média empresa que virou o gargalo da própria operação."],
    ],
    ctaTitle: "Quer saber o quanto a sua empresa ainda depende de você?",
    ctaText: "Receba o Diagnóstico do Gargalo. Ele chega no seu e-mail na hora, e depois você conversa com o Guilherme sobre o seu caso.",
    ctaButton: "Quero o diagnóstico",
    ctaHref: "/diagnostico",
    related: ["ia-para-pequenas-empresas", "automacao-whatsapp", "agentes-de-ia"],
    relatedPosts: [
      ["/blog/diagnostico-ia-pequena-empresa/", "Diagnóstico de IA: o que precisa ser analisado"],
      ["/blog/erros-projetos-ia-pequenas-empresas/", "7 erros em projetos de IA que PMEs devem evitar"],
      ["/blog/primeiro-processo-automatizar-pme/", "Como escolher o primeiro processo para automatizar"],
    ],
  },
  {
    slug: "agencia-de-ia-ribeirao-preto",
    type: "local",
    title: "Agência de IA em Ribeirão Preto e região | Feed",
    h1: "Agência de IA em Ribeirão Preto para quem quer resultado, não hype.",
    eyebrow: "Ribeirão Preto e região",
    description:
      "Agência de IA em Ribeirão Preto e região: automação de atendimento no WhatsApp, agentes de IA e operação organizada, com diagnóstico gratuito.",
    intro:
      "A Feed ajuda empresas de Ribeirão Preto e cidades vizinhas a usarem IA onde ela paga a conta: atendimento, follow-up e operação. O trabalho é remoto na maior parte do tempo, presencial quando o projeto pede, sempre com escopo enxuto e retorno mensurável.",
    primaryCta: "Pedir diagnóstico gratuito",
    secondaryCta: "Ver guia de custos",
    secondaryHref: "/quanto-custa/",
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
    relatedPosts: [
      ["/blog/ia-para-pme-guia-pratico/", "IA para PME: guia prático para começar"],
      ["/quanto-custa/", "Quanto custa automação e IA para pequena empresa"],
      ["/blog/automacao-whatsapp-pequena-empresa/", "Automação de WhatsApp: quando vale a pena"],
    ],
  },
  {
    slug: "agencia-de-marketing-bebedouro",
    type: "local",
    title: "Agência de marketing e IA em Bebedouro | Feed",
    h1: "Agência de marketing e IA em Bebedouro para PME que precisa vender mais.",
    eyebrow: "Bebedouro e região",
    description:
      "Agência de marketing e IA em Bebedouro: posicionamento de marca, atendimento automatizado no WhatsApp e IA na operação, com diagnóstico gratuito.",
    intro:
      "A Feed nasceu unindo marketing e IA aplicada para ajudar empresas de Bebedouro e região a venderem mais sem depender de sorte. Menos post solto, mais operação que gera contato, atende rápido e converte.",
    primaryCta: "Pedir diagnóstico gratuito",
    secondaryCta: "Ver guia de custos",
    secondaryHref: "/quanto-custa/",
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
    relatedPosts: [
      ["/blog/ia-para-pme-guia-pratico/", "IA para PME: guia prático para começar"],
      ["/quanto-custa/", "Quanto custa automação e IA para pequena empresa"],
      ["/blog/primeiro-processo-automatizar-pme/", "Como escolher o primeiro processo para automatizar"],
    ],
  },
  {
    slug: "quanto-custa",
    type: "pricing",
    lastmod: "2026-10-20",
    llmsLabel: "Como funciona o preço",
    title: "Quanto custa automação e IA para pequena empresa | Feed",
    h1: "Quanto custa contratar a Feed para destravar a sua operação",
    eyebrow: "Preço",
    updated: "Atualizado em outubro de 2026.",
    description:
      "Na Feed, o preço é personalizado. Veja o que compõe o valor, quando a IA entra como adicional e como sair com uma proposta feita para a sua empresa.",
    intro:
      "Na Feed, o preço é personalizado. A gente não vende pacote fechado pelo site: primeiro entende onde a sua operação trava, depois monta uma proposta com o escopo, o prazo e o valor do seu caso. O valor depende de quantos sistemas a gente conecta, do volume de atendimento e de quão organizadas estão as informações da empresa. A IA é um adicional opcional: entra só se fizer sentido pro seu negócio e, quando entra, muda o valor da proposta. O primeiro passo é gratuito: o Diagnóstico do Gargalo por e-mail e uma conversa com o Guilherme.",
    answer: "O preço é personalizado: sai numa proposta feita pro seu caso, depois do diagnóstico gratuito e de uma conversa com o Guilherme.",
    answerNote: "Sem tabela de preço. A IA é adicional opcional e, quando entra, muda o valor da proposta.",
    primaryCta: "Quero o diagnóstico",
    primaryHref: "/diagnostico",
    secondaryCta: "Ver quando a IA entra no projeto",
    secondaryHref: "/agentes-de-ia/",
    serviceName: "Automação de atendimento e processos para pequenas empresas, com preço personalizado",
    sections: [
      {
        eyebrow: "Sem tabela",
        h2: "Por que não tem tabela de preço aqui",
        paragraphs: [
          "Porque duas empresas que pedem \"automatizar o WhatsApp\" quase nunca precisam da mesma coisa. Uma quer organizar o atendimento e responder rápido a dúvida repetida. A outra quer consultar agenda, registrar no CRM e passar pra pessoa certa. Uma precisa de IA, a outra não. Preço de tabela ou fica caro pra primeira ou mal feito pra segunda. Por isso o valor sai depois de entender o problema, não antes.",
        ],
      },
      {
        eyebrow: "Composição",
        h2: "O que compõe o preço",
        paragraphs: [
          "A Feed trabalha de dois jeitos, e a proposta diz qual faz sentido pro seu caso: **implementação mais manutenção**, quando a solução precisa de acompanhamento depois de entregue, ou **serviço pontual**, com pagamento único, quando o trabalho tem começo, meio e fim.",
          "**A implementação** é o trabalho de colocar a solução de pé, nos dois modelos:",
        ],
        list: [
          "Entender o processo e escrever as regras: o que é respondido automaticamente, o que não é e quando uma pessoa assume.",
          "Conectar com o que a empresa já usa: WhatsApp, agenda, CRM, planilhas e documentos.",
          "Organizar as informações do negócio que o atendimento e a operação usam.",
          "Testar até funcionar certo, antes de abrir pro cliente.",
        ],
        after: [
          "**A manutenção**, quando entra, mantém tudo funcionando depois da entrega:",
        ],
        list2: [
          "Acompanhamento e ajustes: pergunta nova, regra nova, resposta que precisa mudar.",
          "Manutenção do que foi instalado, pra continuar rodando depois que o projeto termina.",
        ],
        closing: [
          "**IA, se fizer sentido (adicional opcional).** Quando o seu caso pede, a proposta inclui um [agente de IA](/agentes-de-ia/) treinado no contexto da empresa: conhece a oferta, as regras de atendimento e os limites do que pode responder. Ele entra como item separado dentro da proposta e muda o valor. Se a sua operação resolve bem sem IA, ela fica de fora.",
        ],
      },
      {
        eyebrow: "Fatores",
        h2: "O que faz o valor subir ou descer",
        list: [
          "**Quantos sistemas a gente conecta.** Organizar o atendimento só no WhatsApp é um projeto. Conectar agenda, CRM e planilha é outro. Cada sistema a mais é uma frente de trabalho.",
          "**Volume de atendimento.** Mais conversas trazem mais caso raro pra tratar.",
          "**Regras do negócio.** Se a resposta certa depende de região, tipo de cliente e exceção da época, tem mais regra pra escrever e mais teste pra fazer.",
          "**Organização das informações.** Se o que o atendimento precisa saber está espalhado em planilha, caderno e na cabeça do dono, uma parte do trabalho é organizar isso antes.",
          "**Dado sensível.** Setor como saúde pede cuidado extra com dado pessoal.",
          "**Entrar ou não IA.** O agente de IA é adicional. Com ele, a proposta sobe. Sem ele, não.",
        ],
        closing: [
          "O que faz o valor descer: começar por um problema só, o que mais dói, em vez de um projeto grande. Normalmente é o atendimento ou o follow-up comercial.",
        ],
      },
      {
        eyebrow: "Resultado",
        h2: "O que a gente não garante",
        paragraphs: [
          "A gente não garante número de vendas, faturamento, posição no Google ou conversão. Isso depende do seu mercado e de fatores que nenhuma agência controla. O que vai ser entregue, com limites e prazo, fica escrito na proposta.",
        ],
      },
      {
        eyebrow: "Passo a passo",
        h2: "Do primeiro contato até a proposta",
        ordered: true,
        list: [
          "**Diagnóstico do Gargalo.** Você deixa nome e e-mail em [agenciafeed.com/diagnostico](/diagnostico) e recebe o PDF no seu e-mail na hora: onde a operação para quando você não está, o que mais consome seu tempo e o primeiro passo pra tirar a empresa das suas costas.",
          "**Conversa com o Guilherme.** Ele entende o seu caso: onde trava, quanto isso custa em tempo e venda, o que já existe na empresa e se IA faz sentido ou não.",
          "**Proposta personalizada.** Problema, o que vai ser entregue, limites, prazo e valor no papel antes de começar. Se tiver IA, ela aparece como item à parte.",
          "**Implementação.** Regras, conexões, organização das informações e teste.",
          "**No ar.** O primeiro fluxo de [WhatsApp](/automacao-whatsapp/) entra no ar no prazo escrito na proposta, que depende da clareza das respostas, das integrações e do volume de exceções.",
        ],
        closing: ["As condições ficam no contrato."],
      },
    ],
    faqs: [
      ["Quanto custa implementar IA numa pequena empresa?", "Na Feed, o preço é personalizado. Primeiro a gente vê onde a operação trava. Muitas vezes o problema se resolve organizando atendimento e processo, sem IA. Quando a IA faz sentido, ela entra como adicional e muda o valor da proposta. Você recebe o número numa proposta feita pro seu caso, depois de uma conversa com o Guilherme."],
      ["A IA vem incluída em todo projeto?", "Não. A IA é um adicional opcional e nem todo cliente usa. Ela entra quando o seu atendimento ou a sua operação pedem um agente que responda com o contexto da empresa. Nesse caso, aparece como item separado na proposta."],
      ["Quanto custa automatizar o atendimento no WhatsApp?", "Depende do que a automação precisa fazer. Responder dúvida frequente é um escopo. Qualificar contato, consultar agenda e chamar uma pessoa na hora certa é outro. Se entrar IA, o valor muda. O número sai na proposta, depois da conversa."],
      ["O que entra no valor?", "Depende do modelo. Num serviço pontual, você paga uma vez pela implementação: regras, conexões com o que a empresa já usa, organização das informações e teste. No modelo com manutenção, entra também o acompanhamento depois da entrega, pra tudo continuar funcionando. IA só entra se fizer sentido, como adicional."],
      ["Dá pra começar com orçamento curto?", "Dá. A gente começa por um problema só, o que mais dói, em vez de um projeto grande. Normalmente é o atendimento ou o follow-up comercial, porque têm repetição e retorno fácil de medir. Começar sem IA também é um caminho."],
      ["Vale mais contratar uma agência ou usar uma ferramenta pronta?", "Ferramenta pronta deixa cada pessoa da equipe mais rápida, mas não conhece o seu negócio e não conversa com os seus sistemas. A agência entra quando o problema é da operação: atendimento com as suas regras, registro no CRM, passagem pra pessoa certa. Se o problema é individual, ferramenta resolve. Se é da operação, precisa de implantação."],
      ["Em quanto tempo fica pronto?", "Depende de quão claras estão as respostas, de quantas integrações tem e do volume de exceções. O prazo de cada projeto vem escrito na proposta, antes de começar."],
      ["Preciso de equipe de TI ou trocar meus sistemas?", "Não necessariamente. A gente começa conectando a solução ao que a empresa já usa: WhatsApp, CRM, agenda, planilhas e documentos."],
      ["A Feed atende fora de Ribeirão Preto?", "Atende. A base é Ribeirão Preto e Bebedouro, com atendimento em Barretos, Jaboticabal, Sertãozinho e região, e no resto do Brasil de forma remota."],
      ["O diagnóstico é gratuito mesmo? O que eu recebo?", "É gratuito. Você deixa nome e e-mail e recebe o Diagnóstico do Gargalo em PDF, no seu e-mail, na hora: onde a operação para quando você não está, o que mais consome seu tempo e o primeiro passo pra tirar a empresa das suas costas. Depois, se fizer sentido, vem a conversa com o Guilherme."],
    ],
    services: [
      { name: "Automação de atendimento no WhatsApp", description: "Implementação e acompanhamento de automação de atendimento no WhatsApp, com regras do negócio, conexão com agenda, CRM e planilhas, e passagem para humano. Preço personalizado em proposta." },
      { name: "Automação de processos internos", description: "Implementação e acompanhamento de automações de tarefas repetitivas de operação e vendas, conectadas ao que a empresa já usa. Preço personalizado em proposta." },
      { name: "Agente de IA (adicional opcional)", description: "Agente de IA treinado no contexto da empresa. É um adicional opcional da proposta: entra só se fizer sentido para o negócio e, quando entra, muda o valor da proposta." },
    ],
    areaServed: ["Ribeirão Preto", "Bebedouro", "Barretos", "Jaboticabal", "Sertãozinho"],
    related: ["automacao-whatsapp", "agentes-de-ia", "ia-para-pequenas-empresas", "diagnostico-ia-empresa"],
    relatedPosts: [
      ["/blog/calcular-roi-automacao-ia/", "Como calcular ROI de automação com IA na pequena empresa"],
    ],
    ctaTitle: "Quer saber quanto fica no seu caso?",
    ctaText: "Comece pelo Diagnóstico do Gargalo. Ele chega no seu e-mail na hora, e depois você conversa com o Guilherme pra sair com uma proposta feita pra sua empresa.",
    ctaButton: "Quero o diagnóstico",
    ctaHref: "/diagnostico",
  },
];

function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Texto curto com **negrito** e [link](/caminho), sempre escapado antes.
function inline(value) {
  return esc(value)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>');
}

function renderSection(section) {
  const items = (list, ordered) =>
    list
      ? `<${ordered ? "ol" : "ul"} class="prose-list">${list.map((item) => `<li><span>${inline(item)}</span></li>`).join("")}</${ordered ? "ol" : "ul"}>`
      : "";
  const paras = (list) => (list || []).map((item) => `<p>${inline(item)}</p>`).join("");
  return `<section class="decision prose">
        <div>${section.eyebrow ? `
          <p class="eyebrow">${esc(section.eyebrow)}</p>` : ""}
          <h2>${esc(section.h2)}</h2>
        </div>
        <div class="prose-body">
          ${paras(section.paragraphs)}${items(section.list, section.ordered)}${paras(section.after)}${items(section.list2, section.ordered)}${paras(section.closing)}
        </div>
      </section>`;
}

function legacyBlocks(page) {
  return `<section class="split">
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
`;
}

function linkFor(slug) {
  return `/${slug}/`;
}

// Resposta do FAQ no JSON-LD: [texto](/caminho) vira <a> com URL absoluta, igual ao visível.
function faqSchema(page) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    ...(page.faqId ? { "@id": `${SITE}/${page.slug}/#faq` } : {}),
    mainEntity: page.faqs.map(([q, a]) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: {
        "@type": "Answer",
        text: a.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, href) => `<a href="${href.startsWith("/") ? SITE + href : href}">${label}</a>`),
      },
    })),
  };
}

function breadcrumbSchema(page) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: page.breadcrumbName || page.h1, item: `${SITE}/${page.slug}/` },
    ],
  };
}

function pricingSchema(page) {
  const url = `${SITE}/${page.slug}/`;
  const areaServed = [
    ...page.areaServed.map((name) => ({ "@type": "City", name })),
    { "@type": "Country", name: "Brasil" },
  ];
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${url}#page`,
      name: page.title,
      headline: page.h1,
      description: page.description,
      url,
      inLanguage: "pt-BR",
      dateModified: page.lastmod,
      publisher: { "@id": ORG["@id"] },
    },
    ...page.services.map((service, index) => ({
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${url}#service-${index + 1}`,
      name: service.name,
      serviceType: service.name,
      description: service.description,
      url,
      provider: ORG,
      areaServed,
    })),
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

function pageSchema(page) {
  if (page.type === "pricing") return pricingSchema(page);
  if (page.schemaNodes) return [...page.schemaNodes, faqSchema(page), breadcrumbSchema(page)];
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
          <h1>${esc(page.h1)}</h1>${page.updated ? `
          <p class="updated">${esc(page.updated)}</p>` : ""}
          <p class="intro">${esc(page.intro)}</p>
          <div class="actions">
            <a class="button" href="${page.primaryHref || "/diagnostico"}">${esc(page.primaryCta)}</a>${page.secondaryHref ? `
            <a class="text-link" href="${page.secondaryHref}">${esc(page.secondaryCta)}</a>` : ""}
          </div>
        </div>
        <aside class="answer-box">
          <span>Resposta curta</span>
          <p>${esc(page.answer || page.bullets[0])}</p>
          ${page.answerNote ? `<small>${esc(page.answerNote)}</small>` : ""}
        </aside>
      </section>

      ${page.sections ? page.sections.map(renderSection).join("\n\n      ") + "\n" : legacyBlocks(page)}
      <section class="faq">
        <p class="eyebrow">Perguntas frequentes</p>
        <div class="faq-grid">
          ${page.faqs
            .map(([q, a]) => `<article><h2>${esc(q)}</h2><p>${inline(a)}</p></article>`)
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
          ${(page.relatedPosts || [["/quanto-custa/", "Quanto custa automação e IA para pequena empresa"]])
            .map(([href, label]) => `<a href="${href}">${esc(label)}</a>`)
            .join("\n          ")}
          <a href="/blog/">Todos os artigos do blog</a>
        </div>
      </section>

      <aside class="cta">
        <h2>${esc(page.ctaTitle || "Quer saber onde a sua empresa trava?")}</h2>
        <p>${esc(page.ctaText || "Comece pelo Diagnóstico do Gargalo. Ele chega no seu e-mail na hora, e depois você conversa com o Guilherme sobre o seu caso.")}</p>
        <a class="button" href="${page.ctaHref || "/diagnostico"}">${esc(page.ctaButton || "Quero o diagnóstico")}</a>
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
.updated { margin: 8px 0 0; color: rgba(244, 245, 240, 0.58); font-size: 0.95rem; }
.prose-body p { margin: 0 0 14px; color: var(--muted); font-weight: 300; line-height: 1.55; }
.prose-body strong { color: var(--white); font-weight: 800; }
.prose-body a { color: var(--orange); }
.prose-body ul { margin: 0 0 16px; padding-left: 20px; display: grid; gap: 10px; color: var(--muted); font-weight: 300; }
.prose-body ol { margin: 0 0 16px; }
.prose-body ol li { font-weight: 300; }
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
    <lastmod>${page.lastmod || LASTMOD}</lastmod>
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
  text = `${text.trimEnd()}\n\n## Páginas estratégicas\n\n`;
  text += pages
    .map((page) => `- ${page.llmsLabel || page.h1.replace(/\.$/, "")}: ${SITE}/${page.slug}/`)
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
