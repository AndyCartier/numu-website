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

## Approved FAQ
${FAQ_ITEMS.map(({ question, answer }) => `- ${question}\n  ${answer}`).join('\n')}
`

  return new Response(content, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
