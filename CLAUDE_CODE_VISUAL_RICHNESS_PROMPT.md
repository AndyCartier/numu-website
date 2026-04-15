## Visual Richness Pass

Add charts, diagrams, pictograms, and micro-animations across both modes. Use inline SVG or lightweight React components — no external chart libraries unless already installed. All visuals must respect the existing color palette and mode theming.

### EXPLORE MODE — Add These Visuals:

**Process Flow Diagram** (replace the flat text list in "Grown, not manufactured"):
- Horizontal stepped diagram: 5 nodes connected by animated dashed lines
- Icons for each step: wheat/fiber icon → petri dish/growth icon → mold/shape icon → sun/heat icon → cube/material icon
- Use simple SVG pictograms, 32x32px, stroke-style, 1.5px weight
- Each node fades in sequentially on scroll (200ms stagger)
- Active step has a subtle pulse ring animation

**Material Properties Grid** (new section after product cards):
- 2x3 grid of property cards with circular SVG pictograms:
  - Acoustic absorption (sound wave icon) — "NRC 0.7–0.85"
  - Fire performance (flame icon) — "Engineered at material level"
  - Zero VOC (leaf/air icon) — "No binders or coatings"
  - Compostable (cycle icon) — "Full end-of-life circularity"
  - Locally sourced (pin/map icon) — "UAE palm waste feedstock"
  - Carbon negative (cloud-down icon) — "CO₂ sequestered during growth"
- Cards: subtle border, icon top-center, metric bold, descriptor small
- Hover: icon scales 1.1, card lifts 2px

**Installation Gallery Placeholder** (new section):
- Two-column layout: left card "Beyond Chrysant, Netherlands 2022" / right card "KAVE, Dubai 2025"
- Image placeholder containers (16:9 ratio) with dashed border and "Add image" text — I'll add real photos later
- Below each: one-line description + location tag

### INVESTOR MODE — Add These Visuals:

**TAM/SAM/SOM Concentric Circles** (replace progress bars):
- Three nested circles, SVG, animated draw-in on scroll
- Outer: $1T+ label, semi-transparent fill
- Middle: $4.5B, slightly more opaque
- Inner: $50–80M, solid accent fill, pulsing glow
- Each circle draws its stroke progressively (1s, 0.5s stagger)
- Labels appear after circle completes drawing

**Unit Economics Visual** (enhance existing section):
- Horizontal bar comparison: Production Cost ($120) vs Selling Price ($300)
- Bars animate width on scroll entry
- Gap between bars labeled "~60% Gross Margin" with accent color
- Below: two capacity pills — "Today: 30 m²/mo" → arrow → "Post-funding: 600 m²/mo"

**Use of Funds Donut Chart** (add to or enhance funding section):
- SVG donut chart, segments animate in clockwise on scroll
- 5 segments matching deck: Production 30% / Team 25.5% / Machinery 24.8% / Certifications 11.7% / Sales 8%
- Hover on segment: slight expand + tooltip with dollar amount
- Center of donut: "$600K" in large text
- Legend below with colored dots

**Competitive Landscape Diagram** (new section before team):
- Simple 2x2 positioning matrix SVG:
  - X-axis: "Product Focus ← → Platform Focus"
  - Y-axis: "Global ← → Regional (MENA)"
  - Plot dots: Ecovative (top-right), Mogu (top-left), Grown.bio (top-left), MycoWorks (top-left), NUMU (bottom-right, highlighted with accent ring + label)
- Shows NUMU alone in the Regional + Platform quadrant
- Dots fade in with stagger, NUMU dot last with pulse

**Team Section Enhancement:**
- Circular photo containers with subtle border
- On hover: grayscale → color transition (300ms)
- Role title fades in below on hover
- If no photos available yet, use initial-letter avatars (first letter of name, accent background)

### MICRO-ANIMATIONS (Both Modes):

- **Stat counters**: Any number on screen counts up from 0 on scroll entry (1.2s, easeOut)
- **Section dividers**: Thin horizontal lines that draw left→right on scroll (800ms)
- **Card hover states**: All cards get consistent lift (translateY -3px) + shadow transition
- **Link/button hover**: Underline draws in from left on hover (200ms)
- **Loading state for toggle**: Brief opacity dip (150ms) during mode switch to mask content swap
- **Scroll progress bar**: Thin 2px accent-colored bar at very top of viewport showing page scroll %

### SVG Pictogram Style Guide:
- Stroke-only, no fills (except accent highlights)
- Stroke width: 1.5px
- Viewbox: 24x24 or 32x32
- Rounded line caps and joins
- Colors: inherit from CSS variables (--icon-primary, --icon-accent)
- Keep each icon under 15 paths for performance

Build all SVG icons inline in the components. Do not use icon libraries. Keep them minimal and architectural in feel — think Feather icons aesthetic, not playful.
