# Direção de carrossel — Feed (v2)

Documento de direção de arte pros carrosséis de Instagram/Facebook da Feed.
Base: manual da marca (`Feed-Identidade-Visual.pdf`) + 5 referências da Behance escolhidas pelo Guilherme (TYMAX = referência estética principal) + decisões dele.
Substitui a abordagem v1 (fundos de IA + layout seco), que foi **reprovada**.

---

## 1. Espírito

Expressivo, com **energia, cor, textura e gente** — sem virar AI-slop e sem minimalismo frio.
A peça tem que parecer **viva e humana**, mas firme e prática (capacidade instalada, não enfeite).

- **Puxar da TYMAX:** vibração, uso forte de cor, **texturas e elementos gráficos**, voz próxima.
- **Puxar do AlgoPulse/CRM-IA:** pegada operacional, "feito pra quem opera, não pra demo".
- **Dentro do manual Feed:** preto-laranja-branco, contraste alto, grid e hierarquia, setas do logo como grafismo.

**O que matou a v1 (não repetir):** fundo gerado por IA (chevron/glow), composição seca demais, sem elemento humano, sem cor chapada com energia.

---

## 2. Cor

Sistema oficial: **Feed Black #070707 · Signal Orange #FFA300 · Bright White #F4F5F0 · Technical Blue #1560D1 (apoio restrito) · Cool Gray #53565A**.

Mudança vs v1: **laranja com mais presença** — não só acento, mas **blocos chapados** de laranja como fundo inteiro de slide e como destaque atrás de palavra. Energia vem de blocos de cor sólida alternando com preto e branco. Azul só como sinal pontual (tag/dado técnico). Nunca degradê roxo/azul.

---

## 3. Tipografia

**Barlow**, família única, levada por **contraste de escala e peso** (Extra Bold/Black em título, Medium no corpo, Extra Light em apoio).
Tipo **expressivo e grande** — pode estourar, quebrar em linhas, e ter palavra-chave em laranja (marca-texto) ou em caixa. Título de capa pode ser enorme (até ~120px). Kerning apertado no título, aberto no eyebrow.

---

## 4. Grafismo e textura (o que dá a "cara TYMAX")

- **Setas/chevron do logo** como elemento ESTRUTURAL: divisor, indicador de avanço, moldura, seta apontando pro próximo slide. Vetor nítido (do `logo.svg`), não desfocado. Pode ser chapado ou em outline.
- **Textura real, não IA:** grão/ruído (SVG `feTurbulence`), meio-tom (halftone via pattern), papel/print sutil. Aplicar em blocos, não no slide todo.
- **Formas hard-edge:** faixas, blocos e recortes diagonais com `clip-path` (estilo colagem). Cor chapada.
- **Tags/pills, índices (`01—04`), fios finos** pra organizar — herdado do manual.
- Sombra quase zero; profundidade vem de **camada e contraste**, não de blur.

---

## 5. Fotografia — recorte real (elemento central)

Decisão do Guilherme: **sim, recortes reais como elemento forte** (estilo colagem TYMAX).

- **Fonte da foto:** Guilherme NÃO tem fotos da equipe. Decisão: **stock primeiro** via biblioteca do Magnific (`stock_search` → `stock_to_creation`) — foto real, sem cara de IA. **Gerar (Magnific TTI) só como reserva** se não houver o take certo (e, se gerar pessoa, manter tratamento duotone/estilizado, evitando rosto fotorrealista identificável — alinha com a regra da skill /carrossel).
- **Recorte:** fundo removido via **Magnific `remove_background`** → PNG transparente. Borda dura (cutout), não suave.
- **Tratamento pra unificar com a marca:** alto contraste; considerar **duotone preto+laranja** ou P&B com respingo de laranja, pra foto nunca brigar com a paleta.
- **Composição:** recorte colado sobre bloco de cor chapada + tipo grande atrás/na frente. A pessoa "invade" o texto (colagem), não fica num quadradinho.
- Onde usar: capa (forte) + 1–2 internos. Não precisa em todo slide.

---

## 6. Layouts nomeados (vocabulário do carrossel)

- **CAPA** — bloco de cor chapada + recorte de foto invadindo + título enorme + eyebrow + seta apontando "arrasta". Variar a cor de fundo por carrossel (ver §7).
- **STATEMENT** — uma frase soca, tipo gigante, palavra-chave em laranja/caixa, fundo preto ou laranja.
- **OPERACIONAL** (o diferencial) — micro-diagrama/fluxo/checklist/antes→depois mostrando a IA funcionando. Ex.: fluxinho "mensagem → bot → resposta → humano". Vetor limpo, com setas do logo. 1–2 por carrossel.
- **LISTA/NÚMERO** — índice grande (`01`) + título + apoio; pra listicles.
- **RECORTE+DADO** — foto recortada + número/dado grande ao lado.
- **CTA FINAL** — laranja chapado, logo, headline curta, botão, @handle.

Regra: nunca dois slides seguidos com a mesma "cara"; alternar cor de fundo e layout pra criar ritmo.

---

## 7. Ritmo de grade (capas diferentes no feed)

As capas dos posts em sequência têm que se diferenciar na grade:
- capa preta → próxima laranja → próxima branca/clara → volta. Nunca duas capas iguais seguidas.
- Coesão vem do sistema (Barlow, setas, recorte, paleta), não de repetir a mesma cor.

---

## 8. Copy

Textos da v1 foram **aprovados no conteúdo** (3 temas: Reposicionamento, IA prática vs hype, 4 erros de IA na pressa) — reaproveitar. Tom: gente falando com gente, sem jargão, sem promessa milagrosa (manual + `_memoria/preferencias.md`). Legendas: `legenda.md` (IG/FB) + versão sóbria.
Handle: **@feedmarketingecomunicacao**. (LinkedIn a confirmar; o 2º perfil enviado era Página do Facebook.)

---

## 9. Pipeline técnico (mantém)

- Composição **HTML → PNG** via Playwright: `scripts/render-carrossel.mjs <pasta>` (1080×1350, 2×).
- Magnific agora só pra **tratar foto real** (`remove_background`, upscale, duotone/relight), **não** pra gerar fundo.
- Texturas via CSS/SVG (feTurbulence, patterns, clip-path) — sem custo, sem IA.
- Saídas em `marketing/conteudo/<tipo>-<tema>-<data>/`.

---

## 10. Dependências e próximos passos (sessão limpa)

A execução visual precisa de uma **sessão nova** (no chat atual o limite de exibir imagem estourou — não consigo estudar a TYMAX nem revisar render agora).

Ordem na próxima sessão:
1. **Baixar e estudar visualmente os slides da TYMAX** (e as outras 4 refs) pra extrair grid, proporção de foto/tipo, tratamento de cor exato.
2. **Foto (RESOLVIDO):** sem fotos próprias → usar **stock do Magnific** (`stock_search` por temas: empreendedor/PME, atendimento, escritório, mãos no celular/WhatsApp, reunião) → `stock_to_creation` → `remove_background` → duotone. Gerar só se faltar take.
3. Construir **1 template novo** (capa + 1 operacional + 1 statement + CTA) e renderizar **1 prova** pra aprovar.
4. Só depois produzir os 3 carrosséis completos.

Os arquivos da v1 reprovada (fundo IA) foram **apagados** a pedido do Guilherme. Não recriar nessa linha.
