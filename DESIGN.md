---
name: Feed
description: Agencia pragmatica de IA aplicada, marca e operacao para empresas B2B.
colors:
  feed-black: "#070707"
  feed-ink: "#111111"
  feed-white: "#f4f5f0"
  feed-paper: "#ece9e2"
  feed-paper-deep: "#ded9ce"
  feed-orange: "#ffa300"
  feed-blue: "#1560d1"
  feed-gray: "#53565a"
  quiz-lime-legacy: "#c8ff2f"
typography:
  display:
    fontFamily: "Barlow, Arial, Helvetica, sans-serif"
    fontSize: "clamp(3.9rem, 6.6vw, 7.2rem)"
    fontWeight: 800
    lineHeight: 0.9
    letterSpacing: "0"
  headline:
    fontFamily: "Barlow, Arial, Helvetica, sans-serif"
    fontSize: "clamp(3.2rem, 6.4vw, 7rem)"
    fontWeight: 800
    lineHeight: 0.88
    letterSpacing: "0"
  title:
    fontFamily: "Barlow, Arial, Helvetica, sans-serif"
    fontSize: "clamp(1.55rem, 2.1vw, 2.55rem)"
    fontWeight: 800
    lineHeight: 0.96
    letterSpacing: "0"
  body:
    fontFamily: "Barlow, Arial, Helvetica, sans-serif"
    fontSize: "clamp(1.08rem, 1.45vw, 1.32rem)"
    fontWeight: 500
    lineHeight: 1.42
    letterSpacing: "0"
  label:
    fontFamily: "Barlow, Arial, Helvetica, sans-serif"
    fontSize: "0.84rem"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "0"
rounded:
  sm: "8px"
  md: "18px"
  lg: "28px"
  xl: "30px"
  pill: "999px"
  circle: "50%"
spacing:
  xs: "8px"
  sm: "12px"
  md: "18px"
  lg: "28px"
  xl: "clamp(36px, 4vw, 64px)"
  section-x: "clamp(20px, 5vw, 82px)"
  section-y: "clamp(140px, 14dvh, 210px)"
components:
  button-primary:
    backgroundColor: "{colors.feed-orange}"
    textColor: "{colors.feed-black}"
    rounded: "{rounded.pill}"
    padding: "0 28px"
    height: "58px"
    typography: "{typography.label}"
  button-light-hero:
    backgroundColor: "{colors.feed-white}"
    textColor: "{colors.feed-black}"
    rounded: "{rounded.pill}"
    padding: "0 10px 0 28px"
    height: "58px"
    typography: "{typography.label}"
  button-secondary:
    backgroundColor: "{colors.feed-ink}"
    textColor: "{colors.feed-white}"
    rounded: "{rounded.pill}"
    padding: "0 22px"
    height: "52px"
    typography: "{typography.label}"
  panel-dark:
    backgroundColor: "{colors.feed-ink}"
    textColor: "{colors.feed-white}"
    rounded: "{rounded.lg}"
    padding: "clamp(30px, 5vw, 56px)"
  module-row:
    backgroundColor: "{colors.feed-black}"
    textColor: "{colors.feed-white}"
    rounded: "{rounded.sm}"
    padding: "26px 30px 26px 24px"
  input-dark:
    backgroundColor: "{colors.feed-black}"
    textColor: "{colors.feed-white}"
    rounded: "{rounded.md}"
    padding: "0 18px"
    height: "64px"
---

# Design System: Feed

## 1. Overview

**Creative North Star: "Operational Static, Made Tactile"**

The Feed system should feel like an operating layer switching on: dark, graphic, immediate, and responsive to touch. It is not a polite agency website. It is a brand surface for a pragmatic, dynamic and precise company that turns loose knowledge into working systems.

The visual language is a premium operational collage: black fields, warm white type, orange decisions, technical blue in small doses, thin grids, live waves, numbered modules, dense interaction states and high-contrast calls to action. Motion and canvas effects are part of the brand, but they must always support clarity and conversion.

This system explicitly rejects templates genericos de IA, roxo/azul neon, promessas milagrosas, visual corporativo frio, excesso de efeitos sem funcao, linguagem burocratica and textos com cara automatica from PRODUCT.md.

**Key Characteristics:**
- Dark operating-room atmosphere anchored in Feed black, not generic tech dark mode.
- Orange is the decision color: action, active state, progress, selection and emphasis.
- Barlow carries the whole system through extreme scale contrast instead of font mixing.
- Surfaces feel tactile through borders, glows, inset highlights, pointer response and scroll reveal.
- Mobile is not a downgrade: buttons, quiz choices and canvas feedback must feel made for touch.

## 2. Colors

The palette is a committed black-and-orange brand system with warm white readability, gray industrial structure and blue used only as a technical signal.

### Primary
- **Feed Signal Orange**: the action color. Use for CTAs, active states, selected quiz answers, progress indicators, numeric accents and decisive punctuation.
- **Feed Black Field**: the primary environment. Use as the dominant page background and as the base for WebGL/canvas motion.

### Secondary
- **Technical Blue**: a restrained support signal. Use for small spatial glows, secondary technical hints and depth contrast. Never let it replace orange as the brand action color.

### Tertiary
- **Legacy Quiz Lime**: a deprecated experimental accent found in older quiz v2 styles. Do not use for new Feed surfaces unless explicitly reviving that variant.

### Neutral
- **Warm Feed White**: the main text and light control color. It is warm, not pure white.
- **Paper Warmth**: occasional light-section background or soft contrast surface.
- **Deep Ink**: near-black foreground panels, payment badges and modal structures.
- **Cool Industrial Gray**: secondary slabs, neutral shapes and subdued structural contrast.

### Named Rules

**The Orange Decides Rule.** Orange marks the moment of action or selection. If everything is orange, nothing is decisive.

**The No Generic AI Color Rule.** Purple gradients, random neon blues and "tech AI" palettes are forbidden. Blue exists only as a precise technical support signal.

**The Warm Neutral Rule.** Never use pure `#000` or pure `#fff` in new UI. Feed black and Feed white carry the brand temperature.

## 3. Typography

**Display Font:** Barlow, with Arial and Helvetica fallback  
**Body Font:** Barlow, with Arial and Helvetica fallback  
**Label/Mono Font:** Barlow, with no mono substitute by default

**Character:** The type is blunt, fast and commercial. Barlow works as a single-family system because the brand uses scale, weight, compression and spacing discipline instead of decorative font contrast.

### Hierarchy
- **Display** (800 to 900, `clamp(3.9rem, 6.6vw, 7.2rem)`, `0.9`): first-viewport statements, hero-scale identity and poster moments.
- **Headline** (800, `clamp(3.2rem, 6.4vw, 7rem)`, `0.88`): section claims and conversion statements. Keep the line count short.
- **Title** (800, `clamp(1.55rem, 2.1vw, 2.55rem)`, `0.96`): module titles, quiz option headings and compact cards.
- **Body** (500, `clamp(1.08rem, 1.45vw, 1.32rem)`, `1.42`): explanatory copy. Cap long-form lines around 65 to 75ch, and prefer shorter blocks on the landing page.
- **Label** (800 to 900, `0.78rem` to `0.95rem`, uppercase when used): eyebrows, step counters, progress labels and technical tags.

### Named Rules

**The Single Family, Hard Contrast Rule.** Do not add a second font to create personality. Push Barlow through scale, weight and layout first.

**The Short Claim Rule.** Large type must say less. If a headline needs a paragraph to work, rewrite the idea.

## 4. Elevation

Feed uses a hybrid depth system: most surfaces stay structurally flat with thin borders and tonal layering, while modals, hero controls and important panels gain ambient shadow. Depth should feel like equipment under light, not a stack of app cards.

### Shadow Vocabulary
- **Ambient Panel Lift** (`box-shadow: 0 34px 110px rgba(0, 0, 0, 0.58), inset 0 1px 0 rgba(244, 245, 240, 0.12)`): quiz panels and immersive overlays.
- **Hero Control Lift** (`box-shadow: 0 18px 46px rgba(0, 0, 0, 0.32), inset 0 1px 0 rgba(255, 255, 255, 0.76)`): primary floating CTA on the hero.
- **Orange Hover Charge** (`box-shadow: 0 20px 54px rgba(255, 163, 0, 0.26), 0 16px 44px rgba(0, 0, 0, 0.32)`): hover state for action controls.
- **Quiet Structural Edge** (`box-shadow: 0 -1px 0 rgba(244, 245, 240, 0.08)`): section separation without cardifying the page.

### Named Rules

**The Equipment Light Rule.** Use shadows to make controls feel touchable or panels feel present. Do not use soft generic card shadows as decoration.

**The Border Before Shadow Rule.** For normal content modules, use borders, grids and tonal shifts before reaching for elevation.

## 5. Components

### Buttons

Buttons are tactile and decisive: pill-shaped, high contrast, with clear hover inversion or orange charge.

- **Shape:** fully rounded pill (`999px`) for CTAs and quiz actions.
- **Primary:** Feed orange background with Feed black text, usually `58px` high and bold Barlow.
- **Hero Light:** warm white pill with an orange circular icon, becoming orange on hover.
- **Hover / Focus:** translate up slightly, shift background decisively, and keep focus visible. Never rely on color alone for selected state in form-like contexts.
- **Secondary:** dark or translucent surface with warm white text and subtle border.

### Chips

Payment and small status badges use compact pill geometry with brand-specific color fills. They should read as functional proof, not decorative confetti.

- **Style:** small radius or pill, strong text weight, high contrast fill.
- **State:** selected or active chips use orange or exact payment-brand color only when the meaning is real.

### Cards / Containers

Containers are structural modules, not generic marketing cards.

- **Corner Style:** low-to-medium radius (`8px` for technical panels, `18px` to `30px` for modal and quiz panels).
- **Background:** translucent Feed black, warm white alpha layers, or grid-textured dark surfaces.
- **Shadow Strategy:** borders and inset highlights first; ambient shadow only for overlays and hero controls.
- **Border:** thin warm-white alpha strokes around `rgba(244, 245, 240, 0.12)` to `0.18`.
- **Internal Padding:** responsive padding from `18px` to `56px`, with denser mobile states.

### Inputs / Fields

Inputs are dark, blunt and touch-friendly.

- **Style:** dark field background, warm white text, `18px` radius, minimum height around `58px` to `64px`.
- **Focus:** orange border and inset orange ring. The field should feel activated, not merely outlined.
- **Error / Disabled:** disabled actions reduce opacity and remove lift. Future error states should use orange plus copy, not red unless the problem is destructive or irreversible.

### Navigation

Navigation is intentionally quiet compared with the hero and quiz. Header links use Barlow medium, warm white default state and orange hover. The header can remain hidden or delayed while the immersive first fold carries the brand.

Mobile navigation must prioritize the diagnostic action. Avoid tiny link clusters that compete with the hero CTA.

### Signature Component: Interactive Waves Canvas

The wave canvas is the brand's sensory surface. It responds to pointer movement with line displacement, trail memory and warm orange stroke on Feed black. It should remain performance-aware: WebGL first, 2D fallback, low device pixel ratio caps and respect for reduced motion in surrounding UI.

### Signature Component: Diagnostic Quiz

The quiz is a tactile conversion surface. It uses step tracks, large question type, numbered options, orange selected states, dark glass-like panels with real borders and a WhatsApp handoff. Treat it as a guided diagnostic, not a generic lead form.

## 6. Do's and Don'ts

### Do:
- **Do** use Feed black, Feed white and Feed orange as the core palette.
- **Do** make action states tactile: hover lift, active press, orange selection, visible progress.
- **Do** keep the web and mobile experience equally intentional, especially the hero CTA and quiz.
- **Do** use grids, thin lines, numbering and layered operational visuals to show systems being built.
- **Do** keep IA concrete: pages, fluxos, assistentes, materiais comerciais, diagnosticos and systems that enter real work.
- **Do** preserve `prefers-reduced-motion` and keep canvas-heavy effects performance-aware.

### Don't:
- **Don't** use templates genericos de IA.
- **Don't** use roxo/azul neon as the default AI palette.
- **Don't** make promessas milagrosas about IA.
- **Don't** drift into visual corporativo frio.
- **Don't** add excesso de efeitos sem funcao.
- **Don't** use linguagem burocratica or textos com cara automatica.
- **Don't** build layouts previsiveis demais, especially repeated text-left/image-right sections.
- **Don't** create cards repetidos sem hierarquia.
- **Don't** use imagens bonitas que nao ajudam a entender a operacao.
- **Don't** add side-stripe borders, gradient text, decorative glassmorphism or repeated icon-card grids.
