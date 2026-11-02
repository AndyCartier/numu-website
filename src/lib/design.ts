/**
 * Design pass, November 2026 (branch design/visual-pass-2026-11).
 * Every addition has its own switch. NEXT_PUBLIC_NUMU_DESIGN=classic turns all of them off,
 * which leaves the October site plus the global type and legibility fixes in globals.css.
 * Change log: docs/design-pass-2026-11.md
 */
const classic = process.env.NEXT_PUBLIC_NUMU_DESIGN === 'classic'

export const DESIGN = {
  /** Visitor first screen: wordmark, h1 and the lab timelapse together. */
  growthHero: !classic,
  /** Footer as a designed close: the name returns at full width. */
  footerClose: !classic,
  /** Easter eggs (docs/design-pass-2026-11.md lists each one). */
  eggs: !classic,
} as const
