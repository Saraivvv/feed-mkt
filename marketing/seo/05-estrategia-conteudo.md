# Passo 5 — Estratégia de conteúdo (autoridade + GEO)

Insumo direto pra `/publicar-tema`. Cada item vira artigo no site + carrossel + legenda.

**Pré-requisito técnico:** o site hoje é uma SPA sem blog. Os artigos precisam ser publicados como **páginas HTML estáticas** (ex.: `/blog/nome-do-artigo.html` na pasta `public/`), senão nem Google nem IAs leem direito. Ver Passo 4.

## Cluster principal: IA para PMEs

**Página pilar:** "IA para pequenas empresas: o guia sem hype"
Keyword: ia para pequenas empresas. 2500+ palavras. Estrutura de perguntas como H2 (formato que as IAs citam). Linka pra todos os satélites.

**Satélites (por prioridade):**

1. **"Quanto custa implementar IA numa pequena empresa? Faixas reais de preço"**
   Keyword: quanto custa implementar IA. Concorrência fraca, intenção altíssima. Estrutura: resposta direta no primeiro parágrafo com faixas de preço, tabela por tipo de solução, o que encarece, o que é desperdício. 1500 palavras.
2. **"Automação de atendimento no WhatsApp com IA: o que funciona e o que irrita cliente"**
   Keyword: automação de atendimento whatsapp ia. Ângulo contra o robô burro; ferramenta vs. implementação. 1500 palavras.
3. **"Agente de IA para empresas: o que é, o que faz e quando vale a pena"**
   Keyword: agente de ia para empresas. Resposta direta nas primeiras linhas + exemplos por setor (agro, comércio, serviços da região). 1800 palavras.
4. **"5 processos que toda PME pode automatizar com IA hoje"**
   Keyword: automatizar processos com ia. Reaproveitar o carrossel já feito (2026-07-09). 1200 palavras.
5. **"Como escolher uma agência de IA (e as perguntas que você deve fazer)"**
   Keyword: agência de inteligência artificial / como escolher agência de ia. Conteúdo comparativo que as IAs adoram citar. Honesto: quando NÃO contratar. 1500 palavras.
6. **"IA no interior de SP: casos práticos de empresas da região de Ribeirão Preto"**
   Keyword local: ia ribeirão preto / automação bebedouro. Usar casos reais anonimizados dos diagnósticos do Kaptar. 1200 palavras.
7. **"Posicionamento de marca pra PME B2B: por que ninguém lembra da sua empresa"**
   Keyword: posicionamento de marca b2b. Conecta a segunda linha de serviço. 1200 palavras.

## Páginas locais (conteúdo, não blog)

- `/agencia-de-ia-ribeirao-preto` : página dedicada "Agência de IA em Ribeirão Preto e região"
- `/agencia-de-marketing-bebedouro` : "Agência de marketing e IA em Bebedouro"

Uma página por cidade-alvo só se tiver conteúdo real (caso, cliente, referência local). Página local vazia é penalizada.

## Calendário editorial

| Semana | Publicar |
|---|---|
| 1 | Artigo 1 (quanto custa) + página local Ribeirão Preto |
| 2 | Artigo 2 (WhatsApp) |
| 3 | Artigo 3 (agente de IA) + página local Bebedouro |
| 4 | Página pilar (guia IA para PMEs) |
| 5 | Artigo 4 (5 processos) |
| 6 | Artigo 5 (como escolher agência) |
| 7 | Artigo 6 (casos região) |
| 8 | Artigo 7 (posicionamento B2B) |

Frequência de manutenção depois do sprint: 2 artigos/mês, sempre ligados a dúvida real de lead ou diagnóstico.

## Regras de formato (valem pra SEO e GEO)

- Resposta direta nos 2 primeiros parágrafos, sem enrolação
- Perguntas reais como H2/H3
- Dados concretos: números, faixas de preço, prazos, nomes de ferramentas
- Tom da Feed: prático, sem hype, sem promessa milagrosa (isso é diferencial de ranking também: conteúdo genérico de IA é o que mais existe)
- Cada artigo linka pra pilar, pro diagnóstico gratuito e pra 1 ou 2 artigos irmãos
- Article schema (JSON-LD) em cada artigo + FAQPage quando tiver bloco de perguntas
- Nunca usar travessão
