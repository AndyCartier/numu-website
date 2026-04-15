# NUMU Website Improvement Brief — Claude Code Tasks

**Stack:** Next.js / React  
**Priority:** Visual polish + animations (P1) and content/messaging tightening (P2)  
**Context:** Site has a toggle between "Explore" (light, architect-facing) and "Investor" (dark, VC-facing) modes. Both need sharpening without breaking the dual-mode architecture.

---

## PHASE 1: Content & Messaging Fixes (Do First — Copy Is Cheap, Impact Is High)

### Task 1.1 — Explore Mode Hero

**Current:** "Grown materials for tomorrow's interiors."  
**Problem:** Soft, aspirational, sounds like a design studio. Doesn't convey industrial infrastructure.

**Replace with:** "The Middle East's first bio-engineered material platform."  
**Subline:** "Replacing imported synthetic foams with locally grown, construction-grade alternatives."

This matches the deck's opening and positions NUMU as infrastructure from the first pixel.

---

### Task 1.2 — Explore Mode "What if" Section

**Current:** "What if materials were grown instead of manufactured?"  
**Problem:** Rhetorical questions feel tentative. NUMU already does this — it's not hypothetical.

**Replace with:** "Materials grown from biology, engineered for construction."  
**Body text:** "NUMU's proprietary material system uses mycelium — nature's binding network — to transform regional agricultural waste into construction-grade acoustic panels, thermal insulation, and composites. Performance is defined during growth, not added later."

---

### Task 1.3 — Explore Mode "Built by a material scientist"

**Current:** "Built by a material scientist"  
**Problem:** Andy isn't a scientist — he's an industrialist. This undersells the operational advantage.

**Replace with:** "Built by 7 years of hands-on industrialization."  
**Body text:** "NUMU was founded by Andy Cartier — a mycelium industrialization specialist who has spent 7 years compressing the learning curve from lab to production across Europe and the Middle East. Two real-world installations. An operational production lab in Dubai. This isn't research — it's execution."

---

### Task 1.4 — Explore Mode CTA

**Current:** "Start a project."  
**Problem:** Sounds bespoke/artisanal. NUMU is building a platform, not a custom workshop.

**Replace with:** "Specify NUMU for your next project" (primary) + "Explore the material system" (secondary)

---

### Task 1.5 — Explore Mode Product Section

**Current:** Lists "Acoustic Panels / Thermal Insulation / Packaging" as flat text items.  
**Improve:** Each product card should have a one-line performance claim:

- **Acoustic Panels** — "Bio-engineered acoustic cores replacing PET, mineral wool, and PU foam in interior fit-outs."
- **Thermal Insulation** — "Palm-waste-based insulation boards manufactured locally, replacing imported synthetic foams."
- **Packaging** — "Compostable protective packaging grown from agricultural by-products."

---

### Task 1.6 — Investor Mode Hero

**Current:** "A bio-engineered material platform."  
**Problem:** Correct framing but lacks the urgency driver.

**Replace with:** "A bio-engineered material platform."  
**Add subline:** "The UAE imports 100% of its construction foam. NUMU builds the local manufacturing base."

This immediately establishes the execution gap.

---

### Task 1.7 — Investor Mode Market Section

**Current:** Shows "Interior Fit-Out / Acoustic Materials / Thermal Insulation / Construction Systems" with progress-bar-style indicators.  
**Problem:** Progress bars don't communicate market size or timing. They look like loading states.

**Replace with:** Concentric circle or nested market graphic matching the deck:  
- $1T+ Global Construction Materials (outer)  
- $4.5B Interior Acoustic Panels (mid)  
- $50–80M UAE Beachhead (inner, highlighted)

If a graphic is too complex, use three stacked cards with the numbers large and a one-line descriptor each.

---

### Task 1.8 — Investor Mode Validation Section

**Current:** "Early validation across production and market" with generic line items.  
**Improve with specifics:**

- "2 pilot installations completed (Netherlands 2022, Dubai 2025)"
- "Production lab operational — $50K founder capital deployed"
- "Process repeatability validated with local UAE feedstock"
- "Architect and developer pipeline active — conversion expected post-certification"

---

### Task 1.9 — Investor Mode CTA

**Current:** "Request the full investor deck"  
**Keep this** — it's correct. But add a secondary line: "Raising $600K to build the first certified bio-material manufacturing system in the GCC."

This gives the ask context without burying it.

---

### Task 1.10 — Investor Mode Timeline

**Current:** Shows 2025 / 2026 / 2027+ as stacked text blocks.  
**Improve labels to match deck:**

- **2025 — Platform Activation:** Production lab operational, local feedstock validated, pilot installations live.
- **2026 — Industrialization:** Scaled production (600 m²/month target), fire + acoustic certifications, IP filings, first commercial revenue.
- **2027+ — Platform Leverage:** Adjacent material categories, GCC expansion, selective licensing/JV models.

---

## PHASE 2: Visual Polish & Animations

### Task 2.1 — Page Load Sequence (Both Modes)

Add a staggered entrance animation on first load:
1. Logo fades in (200ms)
2. Navigation bar slides down (300ms, 100ms delay)
3. Hero headline reveals word-by-word or line-by-line with a clip/mask animation (400ms, staggered 80ms per element)
4. Hero subline fades up (300ms, after headline completes)
5. Scroll indicator pulses in (500ms delay)

Use `framer-motion` (already common in Next.js) or CSS `@keyframes` with `animation-delay`. Framer-motion is preferred for React — it handles exit animations and layout shifts better.

**Install if not present:** `npm install framer-motion`

---

### Task 2.2 — Mode Toggle Transition

The toggle between Explore/Investor should feel like a material state change, not a page swap.

**Implement:**
- Background color crossfade (500ms ease-in-out) — light cream ↔ dark charcoal
- Content sections fade out (200ms) → fade in (300ms) with a slight upward translate (20px)
- The toggle itself should have a satisfying micro-interaction: a sliding pill with a subtle scale pulse on click
- Persist mode choice in URL hash (`#explore` / `#investor`) so direct links work

---

### Task 2.3 — Scroll-Triggered Section Reveals

Each major section should animate in on scroll entry (IntersectionObserver or framer-motion's `whileInView`).

**Pattern:**
- Section heading: slide up 30px + fade in (400ms)
- Body text: fade in (300ms, 150ms delay after heading)
- Cards/items: stagger in from bottom (200ms each, 100ms stagger gap)
- Images: scale from 0.95 → 1.0 + fade in (500ms)

**Do NOT** over-animate. Each section gets ONE entrance. No parallax scrolling, no floating elements, no scroll-jacking. Clean, confident reveals.

---

### Task 2.4 — Quote/Statement Sections

The "Performance is defined during growth, not added later" quote in Explore mode (and similar statement sections) should have more visual weight.

**Implement:**
- Large, editorial-style typography (2.5–3rem on desktop, 1.5rem mobile)
- A subtle horizontal line or gradient accent that draws in from the left on scroll
- Generous vertical padding (120px+ top and bottom)
- Consider a very subtle background texture or grain overlay to add depth

---

### Task 2.5 — Product/Category Cards

**Current:** Flat text list with no visual hierarchy.

**Improve:**
- Each card gets a subtle border or glass-morphism container
- On hover: gentle lift (translateY -4px) + shadow deepening + slight scale (1.02)
- Transition: 250ms cubic-bezier(0.4, 0, 0.2, 1)
- Optional: a thin accent line (top or left edge) in the NUMU blue-grey palette that extends on hover

---

### Task 2.6 — Number/Metric Animations (Investor Mode)

Market sizing numbers ($1T+, $4.5B, $50-80M) and unit economics ($300/m², 60% margin) should count up on scroll entry.

**Implement:**
- Use a lightweight count-up animation (custom hook or `react-countup`)
- Duration: 1.5s with easeOut
- Trigger: when element enters viewport
- Numbers should feel weighty — large font size (3rem+), bold weight, with a color accent on the currency symbol

---

### Task 2.7 — Timeline Visual (Investor Mode)

**Current:** Stacked text blocks with year headers.

**Replace with:** A horizontal timeline (desktop) / vertical timeline (mobile) with:
- Connected nodes (circles on a line)
- Each node activates/highlights as user scrolls past it
- Active node has a pulse animation
- Content card appears beside each node with a slide-in
- The connecting line draws itself progressively as user scrolls (SVG path animation or CSS clip-path)

---

### Task 2.8 — Navigation Polish

- Sticky nav on scroll with a subtle backdrop blur (`backdrop-filter: blur(12px)`)
- Nav background opacity transitions from transparent → semi-opaque on scroll
- Active section indicator (thin underline or dot) that follows scroll position
- Toggle pill should be the most visually prominent nav element — it's NUMU's unique feature

---

### Task 2.9 — Footer & CTA Section

The final CTA section needs to feel like a destination, not an afterthought.

**Implement:**
- Explore mode: warm, inviting gradient background with the "Specify NUMU" CTA as a prominent button
- Investor mode: dark section with the deck request CTA, raise amount visible, and a subtle particle or grid animation in the background (light, not distracting)
- Email input field if collecting leads — styled consistently with mode theme
- Social links / contact info below CTA

---

### Task 2.10 — Typography & Spacing Audit

Run through the full site and ensure:
- Consistent type scale (suggest: 14/16/20/28/40/56/72px steps)
- Line heights: body 1.6, headings 1.1–1.2
- Section padding: minimum 80px vertical on desktop, 48px on mobile
- No orphaned words in headlines (use `text-wrap: balance` where supported)
- Font loading: ensure custom fonts use `font-display: swap` to avoid FOUT
- If using a serif/display font for headlines, ensure it's loaded from a CDN or self-hosted with proper preloading

---

## PHASE 3: Quick Wins (Can Be Done Anytime)

### Task 3.1 — Favicon & Meta

- Ensure NUMU logo is set as favicon (both .ico and .svg)
- Add proper `<title>` per mode: "NUMU — Bio-Engineered Materials Platform" 
- Add OpenGraph meta tags with a compelling preview image (the deck cover slide works)
- Add `meta description`: "NUMU is building the Middle East's first mycelium manufacturing infrastructure — replacing imported synthetic foams with locally grown, bio-engineered construction materials."

---

### Task 3.2 — Mobile Responsiveness Check

- Verify toggle works cleanly on mobile (thumb-friendly size, clear labels)
- Hero text should not overflow on small screens
- Cards should stack to single column below 768px
- Timeline should flip to vertical on mobile
- Test on 375px (iPhone SE) and 390px (iPhone 14) widths

---

### Task 3.3 — Performance

- Lazy load all images below the fold
- Use Next.js `<Image>` component with proper sizing
- Ensure videos (if any) use `loading="lazy"` and don't autoplay on mobile
- Target Lighthouse score: 90+ on Performance, 100 on Accessibility

---

## DEPLOYMENT NOTE

When ready to deploy:
```bash
npx vercel
```
Vercel auto-detects Next.js. Connect your GitHub repo for continuous deployment. Custom domain can be added in Vercel dashboard after first deploy.

---

## TOOL RECOMMENDATIONS

| Tool | Purpose | Notes |
|------|---------|-------|
| **Claude Code** | Primary dev tool for all tasks above | Run tasks sequentially, commit after each phase |
| **Framer Motion** | React animation library | Best-in-class for Next.js scroll + layout animations |
| **Vercel** | Hosting & deployment | Zero-config for Next.js, free tier sufficient |
| **Ruflo (VS Code)** | Likely using for AI-assisted coding | Good for smaller edits; Claude Code better for multi-file architectural changes |

---

## TASK ORDER RECOMMENDATION

1. **Phase 1 first** (content fixes) — 30 min in Claude Code, immediate impact
2. **Phase 2.1–2.3** (load animation, toggle transition, scroll reveals) — these three alone transform the feel
3. **Phase 2.8** (nav polish) — small effort, big perceived quality jump
4. **Phase 2.6–2.7** (metrics + timeline) — investor mode differentiation
5. **Phase 3** (meta, mobile, performance) — polish before going live
6. Remaining Phase 2 tasks as refinement

---

*Brief prepared for NUMU — April 2026*
