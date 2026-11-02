import { CHAPTERS } from './chapters'

// The main navigation is the chapter list, in reading order (src/lib/chapters.ts).
export const PRIMARY_NAV_LINKS = CHAPTERS.map(c => ({ href: c.href, label: c.nav, id: c.id }))
