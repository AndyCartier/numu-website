'use client'

import { usePathname } from 'next/navigation'

const SITE_URL = 'https://www.numu.bio'

const LABELS: Record<string, string> = {
  about: 'About',
  connect: 'Connect',
  'acoustic-panels-dubai': 'Acoustic Panels Dubai',
  fold: 'FOLD',
  faq: 'FAQ',
  'thermal-insulation-uae': 'Thermal Insulation UAE',
  'mycelium-packaging-uae': 'Mycelium Packaging UAE',
  mushroomiya: 'Mushroomiya',
  palmyco: 'PALMYCO',
  'case-studies': 'Case Studies',
  partnerships: 'Partnerships',
  'titans-space': 'Titans Space Industries',
  privacy: 'Privacy Policy',
  terms: 'Terms of Use',
}

export default function BreadcrumbJsonLd() {
  const pathname = usePathname() || '/'
  const parts = pathname.split('/').filter(Boolean)
  const itemListElement = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    ...parts.map((part, index) => ({
      '@type': 'ListItem',
      position: index + 2,
      name: LABELS[part] ?? part.replace(/-/g, ' '),
      item: `${SITE_URL}/${parts.slice(0, index + 1).join('/')}`,
    })),
  ]

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement }),
      }}
    />
  )
}
