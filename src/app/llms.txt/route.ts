import { FAQ_ITEMS, NUMU_NAP } from '@/lib/siteFacts'

export const dynamic = 'force-static'

export function GET() {
  const content = `# NUMU

> NUMU is a Dubai-based bio-composite materials company. PALMYCO is its proprietary material system: mycelium grown on regional agricultural fibre. FOLD is NUMU's first product built on PALMYCO.

## Official information
- Website: https://www.numu.bio
- Legal name: ${NUMU_NAP.legalName}
- Address: ${NUMU_NAP.address}
- Contact: ${NUMU_NAP.email}

## Key pages
- https://www.numu.bio/palmyco — PALMYCO material system
- https://www.numu.bio/fold — FOLD acoustic wall panels
- https://www.numu.bio/faq — approved FAQ answers
- https://www.numu.bio/acoustic-panels-dubai — acoustic-panel information
- https://www.numu.bio/case-studies — projects and installations
- https://www.numu.bio/shop — Objects & Surfaces: inquiry-only catalogue (FOLD, PALMYCO Surfaces, Mushroomiya, Fungal Art Series, commissions); all physical products are price on request
- https://www.numu.bio/mushroomiya — Mushroomiya grown pendant (made to order; images are visualisations)
- https://www.numu.bio/partnerships/titans-space — exploratory research partnership with Titans Space Industries (non-binding MoU, 28 May 2026)

## Approved FAQ
${FAQ_ITEMS.map(({ question, answer }) => `- ${question}\n  ${answer}`).join('\n')}
`

  return new Response(content, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
