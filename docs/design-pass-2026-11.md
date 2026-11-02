# Design pass, 2 November 2026

Branch `design/visual-pass-2026-11`, from tag `numu/pre-design-pass-2026-11` (= the live site, 3f74ffc, deployed 19 Oct).
**Deployed to production 2 November 2026** (round 2, Vercel deployment numu-website-jv4qqmfld). Roll back by redeploying tag `numu/pre-design-pass-2026-11`. Kill switch: build with `NEXT_PUBLIC_NUMU_DESIGN=classic` to turn off the new hero, the footer and the eggs (flags in `src/lib/design.ts`).

## What a visitor saw before

| Problem | Measured |
|---|---|
| First screen held only "NUMU", the Arabic name and a tagline; the h1 started 1,125 px down, over a faded foam block and a glow | h1 not on first screen |
| Fonts never loaded: everything rendered in Georgia + system UI, though NUMU_DESIGN.md names a display serif (Fraunces) and a grotesk | 91 % system-ui, 8 % Georgia |
| Small, pale text | 104 text blocks under 13 px; body copy 15 px at 62–70 % opacity |
| Section headlines wrapping to 3–5 lines on a phone, 4 lines on desktop | 6 headlines past two lines at 1440 px |
| Index numbers out of order (01, 02, 03, 04, 05, 06, 07 with gaps) | — |
| `☰` emoji in the phone menu; uneven 24/48 px margins at 768 px | — |
| Footer was a plain dark strip | — |

## What changed

- **Type.** Fraunces (display, optical size) and Inter (text), self-hosted by `next/font` at build time, no request to Google from visitors. The talk deck in `/talk/woodshow` already used this pair. SVG diagram labels follow via CSS.
- **First screen (visitor only; investor mode untouched).** Wordmark, نُمُوّ, the h1, one plain sentence (mycelium + regional palm fibre, 5–7 days, panels / lighting / objects), a solid primary button and a link, beside the lab timelapse (poster frame at 5 s, `public/images/hero/timelapse-poster.jpg`). Caption: "From loose fibre to grown block. Timelapse, NUMU lab."
- **Statement section** shows the real FOLD-in-hand prototype photo (`public/images/user/fold-panel-hand.jpg`) instead of repeating the timelapse.
- **Legibility.** 12 px floor on public pages (decks and charts left alone); body copy 16–17 px; reading opacity raised to 0.84; labels de-numbered ("What NUMU is", "The material", "Built work", "Applications", "Team").
- **Headlines.** Re-sized so section headlines sit in two lines on desktop and tablet; the italic colour switch in two headlines is now plain.
- **Rhythm.** Section padding 128 → 104 px (desktop).
- **Buttons.** One flat primary (Substrate fill, square), one underlined link style; the inquiry submit is now a solid button.
- **Footer.** A designed close: "Samples, specification and projects." + email, links in sentence case, registered premises, then NUMU نُمُوّ at full width.
- Video `poster` attribute set; drawn menu icon instead of `☰`.

## Easter eggs

| Egg | Trigger | Behaviour | Accessibility |
|---|---|---|---|
| **The name** | Hover, focus or tap نُمُوّ under the wordmark | "numū, Arabic for growth" appears beside it | Real button with `aria-expanded` |
| **Left alone, it grows** | 45 s without scrolling, typing or clicking (desktop pointer only); or type `grow`; or the footer's **Let it grow**; or "Or let something grow here" on the 404 | Hyphae grow in from a bottom corner (the Studio Cartier growth model, `eggs/growth.ts`); the pointer is their food. Note: "Left alone, it grows. Give it 5–7 days in a mould and this would be a panel." Any scroll, key or click clears it | Canvas is `aria-hidden`, no pointer events; status announced politely; reduced motion: no idle start, manual start draws the finished state without movement; print hides it |
| **Specification sheet** | Press `?` (not in a field) | The page's 12-column grid drawn over it, plus a card: grid, typefaces, Substrate / Canvas / Clay, material, growth time. `?` or Esc closes | `aria-hidden`, announced politely; keyboard curiosity, no touch trigger |
| **A spore from the sister studio** | Arriving from studio-cartier.com (or `?spore` to test) | Studio Cartier's orange dot drifts in: "A spore drifted over from Studio Cartier." Gone after 9 s or on click. Once per session | Button; no motion with reduced motion |
| **Field note** | Open the browser console | Signed note: the material in one line, the Mycelium Hotline link, hints to `?` and `grow`. Once per session | Invisible to everyone else |

## Still open (inspector, home page: 14 FAIL → 10)

Kept on purpose, for a decision by Andy:
- NUMU's label system (small uppercase tracked labels above headings, hairline section rules, outlined spec boxes). It is the brand's documented `label` style; removing it is a brand change, not a polish.
- Long statement headlines still take three lines on a 390 px phone.
- The material-cycle diagram's "Moulding to specification" label sits 5 px from the edge on a phone.
- Two backdrop-blur bars (main nav), the FOLD tile's letterbox gradient (matches the photo's wall).
- Arabic falls back to the system Arabic face where Geeza Pro is absent (fine on Apple devices).

---

# Round 2: the site as chapters (2 November 2026, after Andy's review)

Andy's feedback on round 1: keep the additions, but bring back the welcome page and its slow discovery, make the Arabic word bigger, and make the home page a clear glimpse of everything with the depth on each page.

## Changes

- **Welcome restored** (the split hero is gone): NUMU, then نُمُوّ at 3.4–8.6 rem (was 1.65–2.8 rem), then the line, then "Grown, not manufactured.", each fading in over ~3 s. The Arabic word is still the "means growth" button. The statement screen (h1 over the grown block) follows as before; its button now reads "Look inside NUMU ↓".
- **One chapter list** (`src/lib/chapters.ts`) drives the home map, the glimpses, the main navigation, the footer and the chapter footers. Seven chapters: The material (/palmyco), FOLD, Mushroomiya, Objects & surfaces (/shop), Built work (/case-studies), Partnerships, The studio (/about). Every fact repeats published copy.
- **Home = overview** (25,500 → 13,000 px): welcome → statement → three real pieces → **Inside NUMU** (all seven chapters in one list, picture preview on hover) → one glimpse per chapter (name, one sentence, three facts, picture, "Enter …" button) → Specify NUMU.
- **Depth moved, nothing deleted**:
  - /palmyco: material inputs and production routes, applications (+ surf research, still `#surf-research`), samples request
  - /fold: full FOLD section, renders and specification table
  - /case-studies: built work (Beyond Chrysant slideshow, FOLD prototypes, batches)
  - /about: material cycle diagram, production lab photos, process film, lab carousel, manifesto, team
  - /partnerships: "A material platform for the GCC, the world, and beyond" (TSI)
  - /shop: spatial moodboards (`/shop#moodboards`, which the old "Spaces" link now points to)
- **Pages connected**: every chapter page ends with the chapter track (current chapter underlined), "Next chapter" with its picture and glimpse, the previous chapter, and "All chapters, on the overview ↑". On the home page the nav underlines the chapter being read.
- Contact section no longer repeats the footer (logo, privacy, terms); the "by application" search links moved to the footer.
- Printed leaflets and catalogues only print `numu.bio`, so no printed QR target changed.
