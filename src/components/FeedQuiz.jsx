import React, { useEffect, useMemo, useRef, useState } from "react";
import InteractiveWavesCanvas from "./InteractiveWavesCanvas";

const whatsappPhone = "";

const initialAnswers = {
  company: "",
  stage: [],
  market: "",
  digitalPresence: [],
  priority: [],
};

const quizSteps = [
  {
    id: "company",
    type: "input",
    label: "Qual o nome da sua empresa",
    title: "Qual o nome da sua empresa?",
    description: "Use o nome que aparece para seus clientes.",
    placeholder: "Ex: Atlas Energia",
  },
  {
    id: "stage",
    type: "multi",
    label: "Momento",
    title: "O que está acontecendo hoje?",
    description: "Pode marcar mais de uma opção.",
    options: [
      { value: "explain", title: "Precisamos explicar melhor o que vendemos", description: "A oferta ainda depende muito de conversa" },
      { value: "organized", title: "Queremos organizar melhor a operação", description: "Processos, materiais e decisões estão espalhados" },
      { value: "presence", title: "Nossa presença digital precisa melhorar", description: "Site, redes, LinkedIn ou Google ainda não ajudam como deveriam" },
      { value: "content", title: "Precisamos produzir com mais consistência", description: "Conteúdo e materiais comerciais saem no improviso" },
      { value: "ai", title: "Queremos usar IA de forma prática", description: "A ideia existe, mas ainda não virou rotina" },
    ],
  },
  {
    id: "market",
    type: "input",
    label: "Contexto",
    title: "Em que mercado vocês atuam?",
    description: "Conte o segmento, público ou tipo de venda da empresa.",
    placeholder: "Ex: software B2B para clínicas, indústria técnica, consultoria financeira",
  },
  {
    id: "digitalPresence",
    type: "multi",
    label: "Presença",
    title: "Onde a empresa já aparece hoje?",
    description: "Marque tudo que existe ou é usado com alguma consistência.",
    options: [
      { value: "site", title: "Site", description: "Institucional, e-commerce, delivery, estoque ou área do cliente" },
      { value: "social", title: "Instagram ou redes sociais", description: "Conteúdo, posts ou relacionamento" },
      { value: "linkedin", title: "LinkedIn", description: "Empresa ou líderes aparecendo no B2B" },
      { value: "google", title: "Google Meu Negócio", description: "Busca local, avaliações ou mapa" },
      { value: "traffic", title: "Tráfego pago", description: "Campanhas para gerar demanda" },
      { value: "none", title: "Nada disso está claro", description: "A presença existe pouco ou não existe" },
    ],
  },
  {
    id: "priority",
    type: "multi",
    label: "Prioridade",
    title: "O que faria mais diferença agora?",
    description: "Escolha os ganhos que você quer destravar primeiro.",
    options: [
      { value: "clarity", title: "Clareza para vender", description: "Oferta, mensagem e explicação mais simples" },
      { value: "process", title: "Operação mais organizada", description: "Fluxos e materiais para reduzir improviso" },
      { value: "authority", title: "Mais autoridade digital", description: "Presença consistente sem virar personagem" },
      { value: "ai", title: "IA aplicada na rotina", description: "Assistentes, automações e apoio real ao time" },
      { value: "materials", title: "Materiais comerciais melhores", description: "Páginas, apresentações e ativos de venda" },
      { value: "diagnosis", title: "Saber por onde começar", description: "Um primeiro ponto claro de melhoria" },
    ],
  },
];

function getSelectedTitles(stepId, values) {
  const step = quizSteps.find((item) => item.id === stepId);
  if (!step?.options) return "";

  return step.options
    .filter((option) => values.includes(option.value))
    .map((option) => option.title)
    .join(", ");
}

function getSelectedTitleList(stepId, values) {
  const step = quizSteps.find((item) => item.id === stepId);
  if (!step?.options) return [];

  return step.options.filter((option) => values.includes(option.value)).map((option) => option.title);
}

function formatList(items) {
  if (!items.length) return "- Não informado";
  return items.map((item) => `- ${item}`).join("\n");
}

function buildWhatsAppMessage(answers) {
  const stageItems = getSelectedTitleList("stage", answers.stage);
  const presenceItems = getSelectedTitleList("digitalPresence", answers.digitalPresence);
  const priorityItems = getSelectedTitleList("priority", answers.priority);

  return encodeURIComponent(
    [
      "Olá, Feed. Acabei de responder o diagnóstico do site.",
      "",
      `Empresa: ${answers.company}`,
      `Mercado/segmento: ${answers.market}`,
      "",
      "O que está acontecendo hoje:",
      formatList(stageItems),
      "",
      "Onde a empresa já aparece:",
      formatList(presenceItems),
      "",
      "O que eu quero destravar primeiro:",
      formatList(priorityItems),
      "",
      "Quero entender qual é o melhor próximo passo para melhorar minha operação.",
    ].join("\n"),
  );
}

function buildWhatsAppHref(message) {
  if (whatsappPhone) return `https://wa.me/${whatsappPhone}?text=${message}`;
  return `https://api.whatsapp.com/send?text=${message}`;
}

function WhatsAppMark() {
  return (
    <svg className="quiz-whatsapp-icon" viewBox="0 0 32 32" aria-hidden="true">
      <path d="M16 3.5c-6.9 0-12.5 5.4-12.5 12.1 0 2.2.6 4.3 1.8 6.1l-1.2 6.8 7-1.8c1.5.7 3.1 1.1 4.9 1.1 6.9 0 12.5-5.4 12.5-12.1S22.9 3.5 16 3.5Zm0 21.9c-1.6 0-3.1-.4-4.4-1.2l-.5-.3-4.1 1 1-3.9-.3-.5c-1.1-1.5-1.6-3.2-1.6-5 0-5.4 4.4-9.8 9.9-9.8s9.9 4.4 9.9 9.8-4.4 9.9-9.9 9.9Z" />
      <path d="M21.7 18.7c-.3-.1-1.8-.9-2.1-1-.3-.1-.5-.1-.7.2-.2.3-.8 1-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.5-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.1-.7-1.7-1-2.4-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1.1 1.1-1.1 2.6s1.1 3 1.2 3.2c.1.2 2.2 3.5 5.4 4.8.8.3 1.4.5 1.9.7.8.2 1.5.2 2 .1.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.5-.2-.2-.4-.3-.8-.5Z" />
    </svg>
  );
}

function FeedQuizModal({ isOpen, onClose }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState(initialAnswers);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const loadingTimerRef = useRef(null);

  const currentStep = quizSteps[stepIndex];
  const whatsappMessage = useMemo(() => buildWhatsAppMessage(answers), [answers]);
  const whatsappHref = useMemo(() => buildWhatsAppHref(whatsappMessage), [whatsappMessage]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.body.classList.add("quiz-is-open");
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.classList.remove("quiz-is-open");
      window.removeEventListener("keydown", handleKeyDown);
      window.clearTimeout(loadingTimerRef.current);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const updateAnswer = (id, value) => {
    setAnswers((previous) => ({ ...previous, [id]: value }));
  };

  const toggleMulti = (id, value) => {
    setAnswers((previous) => {
      const currentValues = previous[id];
      const exists = currentValues.includes(value);
      const nextValues = exists ? currentValues.filter((item) => item !== value) : [...currentValues, value];

      return {
        ...previous,
        [id]: nextValues,
      };
    });
  };

  const canContinue = () => {
    if (currentStep.type === "multi") return answers[currentStep.id].length > 0;
    return String(answers[currentStep.id] || "").trim().length > 1;
  };

  const showAnalysis = () => {
    setIsAnalyzing(true);
    loadingTimerRef.current = window.setTimeout(() => {
      setIsAnalyzing(false);
      setIsComplete(true);
    }, 1450);
  };

  const goNext = () => {
    if (!canContinue()) return;

    if (stepIndex === quizSteps.length - 1) {
      showAnalysis();
      return;
    }

    setStepIndex((previous) => previous + 1);
  };

  const goBack = () => {
    if (isComplete) {
      setIsComplete(false);
      setStepIndex(quizSteps.length - 1);
      return;
    }

    setStepIndex((previous) => Math.max(previous - 1, 0));
  };

  return (
    <div className="quiz-overlay quiz-v3" role="dialog" aria-modal="true" aria-labelledby="feed-quiz-title">
      <InteractiveWavesCanvas className="quiz-waves-canvas" />
      <div className={`quiz-shell ${isComplete || isAnalyzing ? "is-complete" : ""}`}>
        <button type="button" className="quiz-close" onClick={onClose} aria-label="Fechar quiz">
          ×
        </button>

        {isAnalyzing ? (
          <div className="quiz-analysis-screen">
            <p className="quiz-eyebrow">Analisando</p>
            <h2 id="feed-quiz-title">Lendo os sinais da operação.</h2>
            <div className="quiz-analysis-bars" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </div>
            <p>Estamos cruzando presença, rotina e prioridade para gerar um próximo passo mais útil.</p>
          </div>
        ) : isComplete ? (
          <div className="quiz-complete-screen">
            <p className="quiz-eyebrow">Mapa inicial pronto</p>
            <h2 id="feed-quiz-title">
              Já temos um ponto de partida,
              <span>{answers.company}</span>
            </h2>
            <p>Agora a Feed pode olhar suas respostas e apontar onde clareza, processo ou IA podem destravar a operação primeiro.</p>
            <a className="quiz-whatsapp" href={whatsappHref} target="_blank" rel="noreferrer">
              <WhatsAppMark />
              FALAR COM FEED AGORA
            </a>
          </div>
        ) : (
          <>
            <div className="quiz-progress-head" aria-label={`Etapa ${stepIndex + 1} de ${quizSteps.length}`}>
              <span>Diagnóstico Feed</span>
              <strong>
                {String(stepIndex + 1).padStart(2, "0")} / {String(quizSteps.length).padStart(2, "0")}
              </strong>
              <div className="quiz-step-track" aria-hidden="true">
                {quizSteps.map((step, index) => (
                  <span className={index <= stepIndex ? "is-active" : ""} key={step.id} />
                ))}
              </div>
            </div>

            <div className="quiz-panel">
              <div className="quiz-panel-glow" aria-hidden="true" />
              <div className="quiz-body">
                <div className="quiz-question">
                  <p className="quiz-eyebrow">{currentStep.label}</p>
                  <h2 id="feed-quiz-title">{currentStep.title}</h2>
                  <p>{currentStep.description}</p>
                </div>

                {currentStep.type === "input" && (
                  <label className="quiz-input-group">
                    <span className="sr-only">{currentStep.title}</span>
                    <input
                      type="text"
                      value={answers[currentStep.id]}
                      onChange={(event) => updateAnswer(currentStep.id, event.target.value)}
                      placeholder={currentStep.placeholder}
                      autoFocus
                    />
                  </label>
                )}

                {currentStep.type === "single" && (
                  <div className="quiz-options">
                    {currentStep.options.map((option, index) => (
                      <button
                        type="button"
                        className={`quiz-option ${answers[currentStep.id] === option.value ? "is-selected" : ""}`}
                        key={option.value}
                        onClick={() => updateAnswer(currentStep.id, option.value)}
                      >
                        <small>{String(index + 1).padStart(2, "0")}</small>
                        <span>
                          <strong>{option.title}</strong>
                          <em>{option.description}</em>
                        </span>
                        <i aria-hidden="true" />
                      </button>
                    ))}
                  </div>
                )}

                {currentStep.type === "multi" && (
                  <div className="quiz-options">
                    {currentStep.options.map((option, index) => (
                      <button
                        type="button"
                        className={`quiz-option ${answers[currentStep.id].includes(option.value) ? "is-selected" : ""}`}
                        key={option.value}
                        onClick={() => toggleMulti(currentStep.id, option.value)}
                      >
                        <small>{String(index + 1).padStart(2, "0")}</small>
                        <span>
                          <strong>{option.title}</strong>
                          <em>{option.description}</em>
                        </span>
                        <i aria-hidden="true" />
                      </button>
                    ))}
                  </div>
                )}

                <div className="quiz-actions">
                  <button type="button" className="quiz-secondary" onClick={goBack} disabled={stepIndex === 0}>
                    <span aria-hidden="true">←</span>
                    Voltar
                  </button>
                  <button type="button" className="quiz-primary" onClick={goNext} disabled={!canContinue()}>
                    {stepIndex === quizSteps.length - 1 ? "Analisar respostas" : "Continuar"}
                    <span aria-hidden="true">→</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default FeedQuizModal;
