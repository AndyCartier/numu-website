---
version: 1.0
name: NUMU-brand-system
description: A material-first identity where the surface recedes so the grown material can speak. Warm near-black ("Substrate") and raw-cream ("Canvas") canvases alternate as the only section divider. A high-contrast display serif carries the wordmark and every headline; a quiet neo-grotesque carries everything functional. One muted brass accent ("Spore Gold") is rationed across the entire system and never appears twice in a single view. No gradients, near-zero shadow, sharp architectural corners. Apple's reverence and restraint, Patagonia's material honesty, Aesop's single-accent discipline.

colors:
  accent: "#B79A6A"
  accent-on-light: "#8F6F3C"
  ink: "#1B1714"
  ink-muted: "#6F6353"
  ink-faint: "#9A8E7B"
  cream: "#ECE3D1"
  cream-muted: "#A89A80"
  cream-faint: "#6E6453"
  canvas: "#F4EEE1"
  canvas-oat: "#E8DFCD"
  surface-substrate: "#1B1714"
  surface-substrate-2: "#211C17"
  surface-espresso: "#12100D"
  surface-clay: "#8A7256"
  hairline-on-light: "#D8CDB8"
  hairline-on-dark: "#3A332A"
  on-accent: "#1B1714"
  on-dark: "#ECE3D1"
  on-light: "#1B1714"

typography:
  wordmark:
    fontFamily: "NUMU Display Serif, Fraunces, Canela, Ogg, Georgia, serif"
    fontSize: 88px
    fontWeight: 500
    lineHeight: 0.95
    letterSpacing: 0.5px
  hero-display:
    fontFamily: "NUMU Display Serif, Fraunces, Canela, Georgia, serif"
    fontSize: 64px
    fontWeight: 500
    lineHeight: 1.04
    letterSpacing: -0.3px
  display-lg:
    fontFamily: "NUMU Display Serif, Fraunces, Canela, Georgia, serif"
    fontSize: 40px
    fontWeight: 500
    lineHeight: 1.08
    letterSpacing: -0.2px
  display-md:
    fontFamily: "NUMU Display Serif, Fraunces, Canela, Georgia, serif"
    fontSize: 30px
    fontWeight: 500
    lineHeight: 1.12
    letterSpacing: -0.1px
  stat-numeral:
    fontFamily: "NUMU Display Serif, Fraunces, Canela, Georgia, serif"
    fontSize: 64px
    fontWeight: 500
    lineHeight: 1.0
    letterSpacing: -0.5px
  lead:
    fontFamily: "NUMU Grotesk, Geist, Söhne, Inter, system-ui, sans-serif"
    fontSize: 24px
    fontWeight: 400
    lineHeight: 1.35
    letterSpacing: -0.1px
  body:
    fontFamily: "NUMU Grotesk, Geist, Söhne, Inter, system-ui, sans-serif"
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: -0.1px
  body-strong:
    fontFamily: "NUMU Grotesk, Geist, Söhne, Inter, system-ui, sans-serif"
    fontSize: 17px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: -0.1px
  tagline:
    fontFamily: "NUMU Grotesk, Geist, Söhne, Inter, system-ui, sans-serif"
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: 0
  label:
    fontFamily: "NUMU Grotesk, Geist, Söhne, Inter, system-ui, sans-serif"
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: 1.8px
    textTransform: uppercase
  caption:
    fontFamily: "NUMU Grotesk, Geist, Söhne, Inter, system-ui, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: -0.05px
  footnote-italic:
    fontFamily: "NUMU Display Serif, Fraunces, Canela, Georgia, serif"
    fontSize: 13px
    fontWeight: 400
    fontStyle: italic
    lineHeight: 1.4
    letterSpacing: 0
  fine-print:
    fontFamily: "NUMU Grotesk, Geist, Söhne, Inter, system-ui, sans-serif"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0
  micro-legal:
    fontFamily: "NUMU Grotesk, Geist, Söhne, Inter, system-ui, sans-serif"
    fontSize: 10px
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: 0.2px

rounded:
  none: 0px
  xs: 2px
  sm: 4px
  pill: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 40px
  xxl: 64px
  section: 96px

components:
  wordmark-lockup:
    typography: "{typography.wordmark}"
    textColor: "{colors.cream}"
  global-nav:
    backgroundColor: transparent
    textColor: "{colors.cream}"
    typography: "{typography.label}"
    height: 64px
  mode-toggle:
    backgroundColor: transparent
    textColor: "{colors.cream-muted}"
    textColorActive: "{colors.cream}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
  eyebrow-label:
    textColor: "{colors.cream-muted}"
    typography: "{typography.label}"
  stat-block:
    labelColor: "{colors.cream-muted}"
    numeralColor: "{colors.accent}"
    labelType: "{typography.label}"
    numeralType: "{typography.stat-numeral}"
  hairline-metric-card:
    backgroundColor: transparent
    borderColor: "{colors.hairline-on-dark}"
    borderWidth: 1px
    rounded: "{rounded.none}"
    padding: 32px
  spec-row:
    labelColor: "{colors.cream-muted}"
    valueColor: "{colors.cream}"
    labelType: "{typography.label}"
    valueType: "{typography.body}"
    dividerColor: "{colors.hairline-on-dark}"
    paddingY: 20px
  engine-column:
    backgroundColor: transparent
    dividerColor: "{colors.hairline-on-dark}"
    titleType: "{typography.display-md}"
    bodyType: "{typography.body}"
    numeralType: "{typography.stat-numeral}"
    numeralColor: "{colors.accent}"
    padding: 32px
  status-tag-active:
    backgroundColor: transparent
    textColor: "{colors.accent}"
    borderColor: "{colors.accent}"
    borderWidth: 1px
    typography: "{typography.label}"
    rounded: "{rounded.xs}"
    padding: 6px 10px
  status-tag-future:
    backgroundColor: transparent
    textColor: "{colors.cream-faint}"
    borderColor: "{colors.hairline-on-dark}"
    borderWidth: 1px
    typography: "{typography.label}"
    rounded: "{rounded.xs}"
    padding: 6px 10px
  material-split:
    backgroundColor: "{colors.surface-substrate}"
    textColor: "{colors.cream}"
    rounded: "{rounded.none}"
    padding: 96px
  manifesto-line:
    textColor: "{colors.ink}"
    typography: "{typography.display-lg}"
  bullet-list:
    bulletColor: "{colors.accent}"
    textColor: "{colors.cream}"
    typography: "{typography.body}"
  comparison-row:
    glyphPositive: "{colors.accent}"
    glyphNegative: "{colors.cream-faint}"
    textColor: "{colors.cream}"
    typography: "{typography.body}"
  footnote-italic:
    textColor: "{colors.cream-muted}"
    typography: "{typography.footnote-italic}"
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.cream}"
    typography: "{typography.label}"
    rounded: "{rounded.xs}"
    padding: 16px 28px
  button-primary-on-dark:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.xs}"
    padding: 16px 28px
  button-ghost:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    borderColor: "{colors.ink}"
    borderWidth: 1px
    typography: "{typography.label}"
    rounded: "{rounded.xs}"
    padding: 16px 28px
  text-link:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    underline: true
  input-field:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline-on-light}"
    borderWidth: 1px
    rounded: "{rounded.xs}"
    typography: "{typography.body}"
    padding: 14px 16px
    height: 52px
  footer:
    backgroundColor: "{colors.surface-espresso}"
    textColor: "{colors.cream-muted}"
    typography: "{typography.fine-print}"
    padding: 80px
---

## Overview

NUMU's identity is built on one principle: **the surface recedes so the grown material can speak.** Every page is a stack of full-bleed panels that alternate between two surfaces, a warm near-black ("Substrate") and a raw cream ("Canvas"), with the colour change itself acting as the only section divider. Onto these surfaces sit a high-contrast display serif for the wordmark and headlines, a quiet neo-grotesque for everything functional, and macro photography of the material itself. Nothing competes with the material.

This is not a sustainability brand and the visual system is deliberately built to avoid reading as one. There is no green, no leaf imagery, no recycling iconography, no soft eco-rounding. The warmth comes from the actual product (mycelium cream, palm fibre, substrate brown) and from documentary photography, not from decoration. The register is industrial and architectural: sharp corners, matte surfaces, tight typographic tracking, real numbers. The reference points are Apple's reverence and restraint, Patagonia's material honesty and documentary photography, and Aesop's single-accent discipline.

Colour is rationed harder than anywhere else in the system. There is exactly one accent ("Spore Gold"), a muted brass ochre, and it carries the entire interactive and emphatic load: the large statistic numerals, the active-status tags, the ecosystem connector lines, and a single inline emphasis at most. The governing rule is absolute: **if two elements are gold in one view, one of them is wrong.** Everything else is warm neutral.

The system runs in two modes, inherited from the live site. **Explore mode** (Canvas-dominant, light) is the architect and specifier surface. **Investor mode** (Substrate-dominant, dark) is the capital and deep-narrative surface. These are not two brands. They are one token system expressed at two volumes, exactly as the deck alternates light and dark panels within a single document.

**Key Characteristics:**
- Material-first presentation. Macro and installation photography carries the colour; UI recedes.
- Two surfaces only (Canvas cream, Substrate near-black). The surface change is the divider. No borders or shadows needed to separate sections.
- One rationed accent ("Spore Gold" #B79A6A) for emphasis and interaction, surface-tuned to a deeper value (#8F6F3C) on light canvases for legibility.
- Two typographic voices: a high-contrast display serif (wordmark, headlines, statistic numerals) and a neo-grotesque (body, labels, UI).
- Sharp, architectural corners. The radius ladder tops out at 4px. No pills. This is a deliberate contrast with consumer-soft systems.
- Near-zero elevation. Matte surfaces, no UI shadows. Depth comes from surface change and from photography, not from chrome.
- Tracked uppercase labels as the connective tissue: section numbers ("01 — Statement"), spec-row labels, status tags.
- A bilingual wordmark: Latin NUMU and Arabic نُمُوّ, anchoring the GCC origin.

## Brand Voice (typographic and verbal)

The voice is a design asset, not a copy footnote, because it sets the tone every layout has to hold.

- **Performance before narrative.** Lead with the industrial fact (import dependency, margin, capacity), never with sustainability. Sustainability is a property of the material, never the headline.
- **Short declaratives.** "Grown, not manufactured." "Waste is feedstock." "The region builds its own." "Platforms outlast products." Manifesto pillars are full sentences ending in a period, set in `{typography.display-lg}` or larger, stacked with generous air.
- **The spaced-dash separator** is a NUMU typographic convention used to attach a qualifier to a label: "UAE – Bio-composites platform", "Est. 2025 – Dubai, UAE", "01 – Statement". Use a single spaced en dash ( – ) for this device. (Note: this is the one structural dash NUMU uses; running body copy should not lean on dashes for rhythm.)
- **Real numbers, no superlatives.** "100% imported", "AED 2.5B+", "60–66% gross". Never "revolutionary", "disruptive", "world-class".
- **Trademark hygiene.** Palmyco appears as PALMYCO™ on first use, with the ™ in superscript and an italic footnote ("Trademark application pending") in `{typography.footnote-italic}`. Never ®.

## Colors

> **Source:** the June 2026 investor deck (authoritative for the dark/Investor surface) and the live numu.bio site (authoritative for dual-mode behaviour and the Explore surface). Hex values are derived from the deck and should be reconciled once against the site's production CSS tokens; treat them as the canonical brand values until then.

### Accent (the single rationed colour)
- **Spore Gold** (`{colors.accent}` — #B79A6A): The only accent in the system. A muted brass ochre pulled from spawn and dried mycelium, not a bright metallic gold. Carries statistic numerals, active-status tags, ecosystem connector lines and dots, and at most one inline emphasis per view. This is the entire "look here" vocabulary.
- **Spore Gold Deep** (`{colors.accent-on-light}` — #8F6F3C): The surface-tuned variant for use on Canvas and Oat. #B79A6A is too light to hold contrast on cream, so the accent darkens here, the same way it shifts on light versus dark surfaces. It is the same accent, not a second colour.

### Surfaces
- **Canvas** (`{colors.canvas}` — #F4EEE1): The primary light surface. Raw mycelium cream. The default ground of Explore mode and of light panels in any document.
- **Oat** (`{colors.canvas-oat}` — #E8DFCD): A deeper parchment step. Used to break two consecutive Canvas panels, and as the fill behind quiet utility blocks. The cream-on-cream rhythm device.
- **Substrate** (`{colors.surface-substrate}` — #1B1714): The primary dark surface. A warm brown-black, never a cool charcoal. The ground of Investor mode and of every dark panel. This warmth is what signals "biobased" without a single green pixel.
- **Substrate 2** (`{colors.surface-substrate-2}` — #211C17): A micro-step lighter dark surface, used where a dark panel sits directly against Substrate and needs the faintest separation (cards on a dark ground, nested blocks).
- **Espresso** (`{colors.surface-espresso}` — #12100D): The deepest tone. Footer, full-bleed photographic voids, and video frames.
- **Clay** (`{colors.surface-clay}` — #8A7256): A mid material brown. Used very sparingly as a solid block fill for a single emphatic panel. Not an accent. Never carries text smaller than `{typography.display-md}`.

### Text
- **Ink** (`{colors.ink}` — #1B1714): Every headline and body line on light surfaces. The same warm brown-black as Substrate, so type on cream feels cut from the same material as the dark panels.
- **Ink Muted** (`{colors.ink-muted}` — #6F6353): Secondary copy and labels on light surfaces.
- **Ink Faint** (`{colors.ink-faint}` — #9A8E7B): Fine print and disabled states on light.
- **Cream** (`{colors.cream}` — #ECE3D1): All primary text on dark surfaces.
- **Cream Muted** (`{colors.cream-muted}` — #A89A80): Secondary copy, eyebrow labels, and spec-row labels on dark.
- **Cream Faint** (`{colors.cream-faint}` — #6E6453): Future-status tags, page numbers, and fine print on dark.

### Hairlines
- **Hairline On Light** (`{colors.hairline-on-light}` — #D8CDB8): 1px dividers and input borders on Canvas/Oat.
- **Hairline On Dark** (`{colors.hairline-on-dark}` — #3A332A): 1px dividers, card borders, spec-row rules, and engine-column separators on Substrate.

### Gradients
**None.** There are no gradient tokens. Atmospheric depth comes entirely from photography (the macro material shots, raking lab light). A gradient anywhere in this system reads as generic clean-tech and is the fastest way to break the brand. The blue-grey gradient palette from the legacy deck is retired.

## Typography

### Font Families
- **Display Serif** — `NUMU Display Serif` (a high-contrast modern serif with character; the wordmark face). Carries the wordmark, all headlines, statistic numerals, and italic footnotes. High stroke contrast and warm, slightly flared terminals give NUMU its editorial, almost archival voice. Licensed candidates that match the deck: **Canela, Ogg, Migra, GT Sectra, Reckless Neue.** Open-source fallback: **Fraunces** (variable, high optical contrast, free), set at its higher optical-size axis for display.
- **Grotesk** — `NUMU Grotesk` (a clean neo-grotesque). Carries body, lead, labels, captions, and all UI. Quiet, neutral, tightly tracked. Licensed candidates: **Söhne, Aktiv Grotesk, Suisse Int'l, Neue Haas Grotesk.** Open-source fallback: **Geist** (free, modern, deploys natively on the existing Vercel/Next.js stack) or **Inter**.

The serif/grotesk split is the core of the system and is unbreakable: **serif is for voice (wordmark, headlines, numerals); grotesk is for function (everything you read to act).** A headline is never set in the grotesk; a spec value is never set in the serif (the numerals are the one exception, and they are voice, not data entry).

### Hierarchy

| Token | Size | Weight | Line Height | Tracking | Family | Use |
|---|---|---|---|---|---|---|
| `{typography.wordmark}` | 88px | 500 | 0.95 | +0.5px | Serif | The NUMU wordmark lockup |
| `{typography.hero-display}` | 64px | 500 | 1.04 | -0.3px | Serif | Cover and section hero headlines |
| `{typography.display-lg}` | 40px | 500 | 1.08 | -0.2px | Serif | Panel headlines, manifesto lines |
| `{typography.display-md}` | 30px | 500 | 1.12 | -0.1px | Serif | Sub-headlines, engine titles |
| `{typography.stat-numeral}` | 64px | 500 | 1.0 | -0.5px | Serif | The large gold statistics (AED 184K, 60–66%) |
| `{typography.lead}` | 24px | 400 | 1.35 | -0.1px | Grotesk | Hero subcopy, panel intros |
| `{typography.body}` | 17px | 400 | 1.5 | -0.1px | Grotesk | Default paragraph |
| `{typography.body-strong}` | 17px | 600 | 1.4 | -0.1px | Grotesk | Inline strong emphasis |
| `{typography.tagline}` | 18px | 400 | 1.3 | 0 | Grotesk | Captions under photography |
| `{typography.label}` | 11px | 500 | 1.2 | +1.8px | Grotesk | Eyebrow labels, spec labels, tags, buttons (UPPERCASE) |
| `{typography.caption}` | 14px | 400 | 1.45 | -0.05px | Grotesk | Secondary captions |
| `{typography.footnote-italic}` | 13px | 400 italic | 1.4 | 0 | Serif | Trademark and provenance footnotes |
| `{typography.fine-print}` | 12px | 400 | 1.4 | 0 | Grotesk | Footer body, legal |
| `{typography.micro-legal}` | 10px | 400 | 1.3 | +0.2px | Grotesk | Micro disclaimers |

### Principles
- **The statistic numeral is a signature element.** Large data points are set in the display serif, in Spore Gold, at `{typography.stat-numeral}`. This serif-numeral-in-gold treatment is unique to NUMU and should be protected. A statistic in the grotesk reads as a generic dashboard; in the serif it reads as a considered claim.
- **Labels are uppercase and widely tracked.** `{typography.label}` at +1.8px tracking is the connective tissue: section numbers, spec labels, status tags, button text. The wide tracking is what makes the dense label system feel architectural rather than cramped.
- **Negative tracking on display sizes only.** Headlines tighten (-0.1 to -0.5px). Labels open up (+1.8px). Body sits near-neutral (-0.1px). Never track body copy positive.
- **Weight 500 for the serif, not 700.** The display serif's contrast does the work of weight. Headlines sit at 500. The serif is never bolded to 700.
- **Body at 17px, line-height 1.5.** Reading pace, not scanning pace. This matches the deck and site and should not drop to 16px.

## Layout

### Spacing System
- **Base unit:** 8px. Sub-base values (4px) only for tight typographic adjustment.
- **Tokens:** `{spacing.xxs}` 4 · `{spacing.xs}` 8 · `{spacing.sm}` 12 · `{spacing.md}` 16 · `{spacing.lg}` 24 · `{spacing.xl}` 40 · `{spacing.xxl}` 64 · `{spacing.section}` 96.
- **Panel padding:** `{spacing.section}` (96px) vertical inside a full-bleed panel; panels stack edge-to-edge with 0 gap (the surface change is the break).
- **Card padding:** 32px inside hairline metric cards and engine columns.
- **Button padding:** 16px vertical, 28px horizontal.

### Grid & Container
- **Max content width:** ~1440px on structured panels (deck, multi-column); full-bleed for hero and material-split panels; ~720px for manifesto and single-column reading.
- **The split panel is the default hero pattern:** roughly 50/50 copy and full-bleed material photograph, edge-to-edge, no gutter between the two halves. This is the system's signature layout (cover, material, traction).
- **Column patterns:** 4-column engine grid separated by vertical hairlines; 2x2 metric-card grids; single-column manifesto stacks.

### Whitespace Philosophy
Whitespace is the material's pedestal. Headlines get at least 64px of air above and 40px below. Photography is never crowded; copy sits at least 40px from a material image. The only deliberately dense zone is the footer, where the full link architecture is made visible at a glance against Espresso.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Flat | No shadow, no border | The default. Full-bleed panels, nav, buttons, body sections |
| Hairline | 1px `{colors.hairline-on-dark}` / `{colors.hairline-on-light}` | Cards, spec-row dividers, engine-column separators, inputs |
| Surface step | Substrate vs Substrate 2, or Canvas vs Oat | Nested blocks and consecutive same-surface panels |
| Photographic | The macro image itself | All real depth and atmosphere lives in photography |

**Shadow philosophy.** This system is essentially shadow-free. Elevation comes from (a) surface-colour change, (b) 1px hairlines, and (c) photography. Material honesty means matte: grown mycelium does not gloss, so the UI does not either. If a floating sample or product render genuinely needs to lift off a surface, a single very soft shadow (`rgba(0,0,0,0.25) 0 8px 40px`) is permitted on that image only, never on cards, buttons, or text.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | The default for everything: panels, cards, buttons, photography |
| `{rounded.xs}` | 2px | Status tags, inputs, buttons (the faint softening that keeps them from feeling brittle) |
| `{rounded.sm}` | 4px | Rare. Small interactive chips only |
| `{rounded.pill}` | 9999px | Reserved, effectively unused. NUMU is architectural, not consumer-soft. Avoid pills. |

The sharp-corner discipline is a positioning decision, not an aesthetic whim: rounded pills read as consumer app; sharp rectangles read as specification, construction, and manufacturing. Hold the line at 2px.

### Photography Geometry
- **Hero and split-panel imagery:** full-bleed, rectangular, sharp corners. Often a vertical half-panel paired with copy.
- **Material macro:** tight close-ups of grown texture, raking warm light, shallow depth of field. The most important image type in the system.
- **Installation and lab:** documentary, real conditions, never staged-perfect. Beyond Chrysant, the Dubai lab, real prototypes.
- **Product (FOLD):** clean studio shots and in-context renders, rectangular, no rounding.
- **No rounded image corners anywhere.** Rounding is for tags and inputs only.

## Components

### Wordmark & Navigation

**`wordmark-lockup`** — The NUMU wordmark in the display serif, `{typography.wordmark}`, Cream on dark surfaces and Ink on light. The Arabic نُمُوّ may appear beneath or beside it in the grotesk as a provenance mark. The wordmark is never set in the grotesk and never recoloured to Spore Gold.

**`global-nav`** — Transparent bar over the hero, 64px tall, wordmark left, the `{component.mode-toggle}` and contact action right, all in `{typography.label}`. No background fill, no shadow, no border. On scroll it may gain a Substrate or Canvas fill matching the panel beneath.

**`mode-toggle`** — The Explore / Investor switch. Two `{typography.label}` items; the active mode is Cream (or Ink on light), the inactive is muted. No pill, no box, just a 1px underline or a Spore Gold tick under the active label (this is one of the sanctioned accent uses). The toggle is a defining NUMU element and should persist across the experience.

### Data & Metric Components

**`eyebrow-label`** — The numbered section marker ("01 — Statement", "06 — Traction"). `{typography.label}` in Cream Muted, with the spaced en-dash separator. Sits above every panel headline.

**`stat-block`** — The signature data element. A `{typography.label}` caption in muted text above or below a large `{typography.stat-numeral}` in Spore Gold. Example: numeral "AED 184K" in gold over label "FOUNDER CAPITAL DEPLOYED". This is the single most recognisable NUMU component and the primary sanctioned home of the accent.

**`hairline-metric-card`** — A bordered card (1px `{colors.hairline-on-dark}`, sharp corners, 32px padding, no fill, no shadow) containing a `{component.stat-block}`. Arranged in 2x2 or 4-up grids. The border is the only chrome.

**`spec-row`** — The label-value row used for material specs and technical data. Label left in `{typography.label}` Cream Muted; value right (or indented) in `{typography.body}` Cream. Rows separated by 1px hairlines, ~20px vertical padding. Used for MATERIAL / FEEDSTOCK / PROCESS / APPLICATIONS and for FOLD technical specs.

**`engine-column`** — The revenue-engine column. Vertical stack: a `{component.status-tag}` and engine code (E1–E4) at top, `{typography.display-md}` title, `{typography.body}` description, and a large `{typography.stat-numeral}` margin figure in Spore Gold anchored at the bottom. Four columns separated by vertical 1px hairlines. Future engines (E3, E4) dim their entire column to Cream Faint, keeping only the active engines at full contrast.

### Tags & Status

**`status-tag-active`** — A small sharp-cornered (2px) outline tag for active states ("ACTIVE", "0–12 MONTHS"). 1px Spore Gold border, Spore Gold text, transparent fill, `{typography.label}`. One of the sanctioned accent uses.

**`status-tag-future`** — The future/in-development variant. 1px Hairline border, Cream Faint text. Deliberately recessive so the eye reads the timeline at a glance: gold = now, faint = later.

### Editorial Components

**`material-split`** — The signature full-bleed panel: a copy half (eyebrow, serif headline, lead, optional spec rows or buttons) beside a full-bleed material photograph, edge-to-edge with no gutter. Substrate or Canvas ground. This is the workhorse layout for cover, material, traction, and product panels.

**`manifesto-line`** — A single belief set large in the display serif (`{typography.display-lg}` or `hero-display`), stacked with heavy whitespace, on Canvas. "Performance before narrative." "Grown, not manufactured." No accent, no decoration; the serif and the air carry it.

**`bullet-list`** — A list with small Spore Gold dot bullets, `{typography.body}` Cream text. The gold dot is a sanctioned accent use, but only one bullet list should be gold-dotted per view.

**`comparison-row`** — The material-versus-material rows (EPS vs mycelium). Positive attributes marked with a Spore Gold diamond (◆), negative/absent with a Cream Faint circle (○). The glyph colour is the only accent; text stays neutral.

**`footnote-italic`** — Provenance and trademark notes in the serif italic, `{typography.footnote-italic}`, Cream Muted. "Trademark application pending." "Proof, not aspiration." A quiet editorial signature.

### Actions & Inputs

**`button-primary`** — On light surfaces: solid Ink fill, Cream text, `{typography.label}`, 2px corners, 16x28px padding. On dark surfaces use **`button-primary-on-dark`** (Cream fill, Ink text). The primary action is a solid neutral rectangle. **It is never filled with Spore Gold** — keeping the accent off buttons is what protects its rarity.

**`button-ghost`** — Transparent fill, 1px Ink (or Cream) border, matching label type and 2px corners. The secondary action.

**`text-link`** — Inline links in Ink (or Cream on dark), underlined. The accent is not the default link colour; reserve Spore Gold for a single deliberate emphasis, not for every link.

**`input-field`** — Transparent fill, 1px Hairline border, 2px corners, `{typography.body}`, 52px tall. Used in the sample-request and contact forms. Focus state: border shifts to Ink/Cream (not gold).

### Footer

**`footer`** — Espresso ground, Cream Muted text. Dense link columns in `{typography.fine-print}`, column headings in `{typography.label}`, partner and institution lists, social links, and the legal row in `{typography.micro-legal}` Cream Faint. The one sanctioned dense zone. 80px padding.

## Accent Discipline (the Aesop rule)

The single most important rule in the system. Spore Gold is rationed like an expensive ink.

**Spore Gold is permitted on:**
- Statistic numerals (`{component.stat-block}`, engine-column margin figures). This is its primary home.
- The active mode tick in `{component.mode-toggle}`.
- `{component.status-tag-active}` borders and text.
- Ecosystem connector lines and dots (the NUMU–UFO–Hyphen diagram).
- `{component.bullet-list}` dots and `{component.comparison-row}` positive glyphs.
- At most one inline word or figure of emphasis in a body block.

**Spore Gold is forbidden on:**
- Button fills, ever. Buttons are neutral.
- Body or headline text (the wordmark and headlines are never gold).
- Photography overlays where it muddies against material tones.
- More than one element cluster per viewport. **If two things are gold in one view, one of them is wrong.**
- Alongside a Clay block (the two warm tones fight; choose one).
- Links by default.

The test before shipping any screen: scan it and count the gold. One gold moment per view is the target. Two is the ceiling and only if they are far apart. Three means the layout has lost its discipline and the accent has become decoration.

## Do's and Don'ts

### Do
- Alternate `{colors.canvas}` and `{colors.surface-substrate}` for full-bleed panel rhythm. The surface change is the divider.
- Set the wordmark, every headline, and every large statistic in the display serif. Set everything functional in the grotesk.
- Render statistics as serif numerals in Spore Gold (`{component.stat-block}`). Protect this signature.
- Keep corners sharp (0–2px). Architectural, not consumer-soft.
- Let macro material and installation photography carry the colour and atmosphere.
- Use `{typography.label}` uppercase tracking for the connective label system (section numbers, spec labels, tags, buttons).
- Keep the accent rare: one gold moment per view.
- Run both Explore (Canvas/light) and Investor (Substrate/dark) modes from this single token set.

### Don't
- Don't introduce green, leaf imagery, or any sustainability iconography. Warmth comes from the material, not from eco-signalling.
- Don't use gradients anywhere. The legacy blue-grey gradient palette is retired.
- Don't fill buttons with Spore Gold, or use it for body text, headlines, or default links.
- Don't add shadows to UI (cards, buttons, text). The single soft shadow is for floating product imagery only.
- Don't use pills or rounded corners beyond 4px. Hold at 2px for tags and inputs.
- Don't set a headline in the grotesk or a spec value in the serif (numerals excepted).
- Don't put two gold elements in the same viewport.
- Don't lead any layout with sustainability. Lead with the industrial fact.
- Don't cool the near-black toward charcoal; Substrate is warm brown-black on purpose.

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Phone | ≤ 640px | Single-column stack; `{component.material-split}` becomes photo-over-copy; hero serif drops to ~40px; engine grid stacks to 1-column; section padding tightens 96px → 56px |
| Tablet | 641–1023px | 2-column metric grids; engine grid 2-up; split panels keep 50/50 or stack at the lower end; nav keeps mode-toggle |
| Desktop | 1024–1439px | Full layout; 4-up engine grid; split panels 50/50; content max 1440px |
| Wide | ≥ 1440px | Content locks at 1440px; margins absorb extra width; full-bleed photography continues to the edge |

### Touch Targets
- Minimum 44x44px. Buttons land at ~52px tall. The mode-toggle items get generous hit padding even though the visible mark is a thin underline or tick.

### Collapsing Strategy
- **Nav:** wordmark + mode-toggle + contact → wordmark + mode-toggle + menu glyph at phone.
- **Material-split:** side-by-side → photograph stacked above copy at phone.
- **Engine columns:** 4-up → 2-up (tablet) → 1-up (phone); vertical hairlines become horizontal rules between stacked engines.
- **Metric cards:** 4-up → 2-up → 1-up.
- **Hero serif:** 64px → 40px (tablet) → 40px or smaller (phone), holding tracking.

### Image Behaviour
- Responsive `srcset` (the site already serves Next.js optimised WebP at multiple widths). Hero loads eagerly; gallery lazy-loads.
- Material-split photography may re-crop to a taller aspect at phone to keep the texture legible.

## Iteration Guide

1. Work one component at a time and reference its YAML key directly (`{component.stat-block}`, `{component.material-split}`).
2. Use `{token.refs}` everywhere; never inline a hex.
3. The serif/grotesk boundary is unbreakable: serif for voice, grotesk for function.
4. Before shipping any view, run the accent count. One gold moment is the target.
5. Reach for a surface change (Canvas ↔ Substrate) before adding any border, shadow, or rule.
6. Keep the warm brown-black warm. If Substrate ever looks grey, it has drifted.
7. Document only default and active/pressed states. Hover is not a brand state.

## Known Gaps

- **Display serif identity unconfirmed.** The exact wordmark face is read from the deck, not licensed metadata. The licensed candidates (Canela, Ogg, Migra, GT Sectra) and the open fallback (Fraunces) need a single decision and a licence before this is locked. This is the highest-priority open item.
- **Hex values are deck-derived.** Colours should be reconciled once against the live numu.bio production CSS tokens to guarantee pixel parity between deck, site, and any new surface.
- **Explore (light) mode is extended, not observed.** The June deck is entirely dark, so the Canvas-mode token usage here is authored to match the site's light surfaces. Validate against the live Explore mode and adjust Ink/Hairline values if needed.
- **Spaced-dash convention vs. running prose.** The spaced en dash is documented as a label device because the deck and site use it consistently. Confirm whether it should remain the brand separator or be replaced (e.g. with a middot or colon) given the broader preference against dash-heavy copy.
- **Motion and video framing** (timelapse, process documentation) are present on the site but not yet tokenised. Transitions, easing, and video-frame treatment are a future module.
- **Form validation and error states** are not specified; only the neutral input is documented.