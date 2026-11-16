import { buildAbsoluteUrl, SITE_URL } from '@/lib/site'
import { FAQ_ITEMS, NUMU_NAP, NUMU_SUMMARY } from '@/lib/siteFacts'

export const dynamic = 'force-static'

const keyPages = [
  ['/palmyco', 'PALMYCO material system', 'NUMU’s proprietary mycelium bio-composite.'],
  ['/fold', 'FOLD acoustic wall panels', 'Interior panels grown and finished in Dubai.'],
  ['/faq', 'PALMYCO and FOLD FAQ', 'Testing status, humidity, lead times and pricing.'],
  ['/acoustic-panels-dubai', 'Acoustic panels in Dubai', 'Information for architects, interior designers and fit-out teams.'],
  ['/case-studies', 'Case studies', 'NUMU projects and installations.'],
  ['/shop', 'Objects & Surfaces', 'Inquiry-only catalogue featuring FOLD, PALMYCO Surfaces, Mushroomiya, Fungal Art Series and commissions. Physical products are priced on request.'],
  ['/mushroomiya', 'Mushroomiya pendant', 'Made to order. Product images are visualisations.'],
  ['/partnerships/titans-space', 'Titans Space Industries', 'Exploratory research partnership under a non-binding MoU signed 28 May 2026.'],
  ['/connect', 'Contact NUMU', 'Project, sample and specification inquiries.'],
] as const

export function GET() {
  const links = keyPages.map(([path, title, description]) =>
    `- [${title}](${buildAbsoluteUrl(path)}): ${description}`,
  ).join('\n')

  const content = `# NUMU

> ${NUMU_SUMMARY}

## Official information
- Website: ${SITE_URL}
- Legal name: ${NUMU_NAP.legalName}
- Address: ${NUMU_NAP.address}
- Contact: ${NUMU_NAP.email}

## Key pages
${links}

## Approved FAQ
${FAQ_ITEMS.map(({ question, answer }) => `- ${question}\n  ${answer}`).join('\n')}
`

  return new Response(content, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
