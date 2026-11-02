/**
 * The site as chapters. One list drives the home page map and glimpses, the main navigation,
 * and the "next chapter" links at the foot of each chapter page.
 * Every fact here repeats copy that is already published on the chapter's own page.
 */
export type Chapter = {
  id: string
  /** Navigation label. */
  nav: string
  /** Chapter name, as a heading. */
  name: string
  href: string
  /** One sentence: what you will find inside. */
  glimpse: string
  /** Two or three short facts for the home glimpse. */
  facts: string[]
  image: string
  imageAlt: string
  /** How the image is described in its caption. */
  caption: string
  /** The button that dives in. */
  enter: string
}

export const CHAPTERS: Chapter[] = [
  {
    id: 'material',
    nav: 'PALMYCO™',
    name: 'The material',
    href: '/palmyco',
    glimpse: 'PALMYCO™ is mycelium grown through regional palm fibre: rigid, breathable and home-compostable, with no binders and no petroleum.',
    facts: ['Grown in 5–7 days', 'Regional palm fibre', 'Trademark pending'],
    image: '/images/catalogue/material/palmyco-samples-in-hand.jpg',
    imageAlt: 'Grown PALMYCO™ material samples held in the hand',
    caption: 'PALMYCO™ samples. Photograph.',
    enter: 'Enter the material',
  },
  {
    id: 'fold',
    nav: 'FOLD',
    name: 'FOLD',
    href: '/fold',
    glimpse: 'The first product: a modular acoustic wall panel whose surface is grown, not cut. Designed with NYXO Design Studio.',
    facts: ['400 × 400 mm module (provisional)', 'NRC 0.72–0.80, design target', 'Grown and finished in Dubai'],
    image: '/images/catalogue/fold/fold-surface-closeup.jpg',
    imageAlt: 'Low light across the grown relief of a FOLD panel',
    caption: 'FOLD panel surface. Photograph.',
    enter: 'Enter FOLD',
  },
  {
    id: 'mushroomiya',
    nav: 'Mushroomiya',
    name: 'Mushroomiya',
    href: '/mushroomiya',
    glimpse: 'A monumental pendant dome: a grown lattice that brings mashrabiya and mycelial pattern into one piece of light.',
    facts: ['Ø 1200 mm', 'Made to order by commission', 'BASE39 2026, winning finalist'],
    image: '/images/mushroomiya/base39-lamp-01.jpg',
    imageAlt: 'The Mushroomiya lattice pendant dome',
    caption: 'Mushroomiya. Visualisation.',
    enter: 'Enter Mushroomiya',
  },
  {
    id: 'objects',
    nav: 'Objects',
    name: 'Objects & surfaces',
    href: '/shop',
    glimpse: 'Everything NUMU makes, in one place: surfaces, lighting, furniture, editions and original Fungal Art Series® works.',
    facts: ['By inquiry, price on request', 'Surfaces · Lighting · Furniture · Art', 'Mycelium Hotline, Wednesdays'],
    image: '/images/user/palmyco-chair.jpg',
    imageAlt: 'A full-scale PALMYCO™ chair prototype',
    caption: 'PALMYCO™ chair prototype. Photograph.',
    enter: 'See the objects',
  },
  {
    id: 'projects',
    nav: 'Projects',
    name: 'Built work',
    href: '/case-studies',
    glimpse: 'What exists today: a completed installation in the Netherlands, full-scale panels grown in Dubai, and the work behind them.',
    facts: ['Beyond Chrysant, Netherlands, 2022', 'FOLD prototypes, Dubai, 2026', 'PALMYCO™ production batches'],
    image: '/images/projects/Beyond01.jpg',
    imageAlt: 'Beyond Chrysant installation in the Netherlands',
    caption: 'Beyond Chrysant, 2022. Photograph.',
    enter: 'See the built work',
  },
  {
    id: 'partnerships',
    nav: 'Partnerships',
    name: 'Partnerships',
    href: '/partnerships',
    glimpse: 'Collaborations that take the material further, from surface design in Dubai to research into extreme environments.',
    facts: ['Titans Space Industries, MoU', 'NYXO Design Studio, design partner', 'Biomyc, packaging LOI'],
    image: '/images/partnerships/tsi-announcement-02.jpg',
    imageAlt: 'NUMU and Titans Space Industries partnership announcement',
    caption: 'NUMU × Titans Space Industries.',
    enter: 'See the partnerships',
  },
  {
    id: 'studio',
    nav: 'Studio',
    name: 'The studio',
    href: '/about',
    glimpse: 'The Dubai lab where it is grown, how the cycle runs from fibre back to soil, and the people behind it.',
    facts: ['Production lab in Dubai since 2025', 'The full process, filmed', 'Material first, local first'],
    image: '/images/founder/founder_in_action.jpg',
    imageAlt: 'Grown mycelium columns being checked in the NUMU lab',
    caption: 'In the lab. Photograph.',
    enter: 'Visit the studio',
  },
]

export function chapterFor(path: string) {
  return CHAPTERS.find(c => path === c.href || path.startsWith(`${c.href}/`))
}

export function neighbours(id: string) {
  const i = CHAPTERS.findIndex(c => c.id === id)
  return { prev: i > 0 ? CHAPTERS[i - 1] : undefined, next: i < CHAPTERS.length - 1 ? CHAPTERS[i + 1] : undefined, index: i }
}
