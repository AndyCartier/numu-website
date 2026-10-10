import type { Metadata } from 'next'
import { buildAbsoluteUrl, SITE_URL } from '@/lib/site'
import { NUMU_NAP } from '@/lib/siteFacts'
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd'
import GlobalImageLightbox from '@/components/GlobalImageLightbox'
import SiteFooter from '@/components/SiteFooter'
import './globals.css'


export const metadata: Metadata = {
  metadataBase: buildAbsoluteUrl('/'),
  title: 'NUMU | Mycelium Materials, Mushroomiya Lamp, and Bio-Composite Systems in Dubai',
  description:
    'NUMU builds mycelium acoustic panels, the Mushroomiya lamp, and bio-composite material systems in Dubai, creating a local UAE and GCC alternative to imported synthetic foams and boards.',
  keywords: [
    'NUMU',
    'mycelium acoustic panels Dubai',
    'Mushroomiya lamp',
    'mycelium lamp Dubai',
    'bio composite materials UAE',
    'mycelium materials GCC',
    'bio based materials Dubai',
    'acoustic panels UAE',
    'ISRU mycelium composites',
  ],
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'NUMU | Mycelium Materials, Mushroomiya Lamp, and Bio-Composite Systems in Dubai',
    description:
      'A Dubai-based mycelium materials company building acoustic, product, thermal, packaging, and partnership pathways for the UAE and GCC.',
    siteName: 'NUMU',
    url: '/',
    type: 'website',
    images: [
      {
        url: '/images/projects/acoustic_render_07.jpg',
        width: 1600,
        height: 900,
        alt: 'NUMU bio-engineered acoustic panel installation',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NUMU | Mycelium Materials, Mushroomiya Lamp, and Bio-Composite Systems in Dubai',
    description:
      'A Dubai-based mycelium materials company building local acoustic, product, and bio-composite alternatives for the GCC.',
    images: ['/images/projects/acoustic_render_07.jpg'],
  },
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'NUMU',
  url: SITE_URL,
  description:
    'NUMU builds mycelium acoustic panels, the Mushroomiya lamp, and bio-composite materials in Dubai for the UAE and GCC.',
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: NUMU_NAP.brandName,
  legalName: NUMU_NAP.legalName,
  url: SITE_URL,
  logo: buildAbsoluteUrl('/branding/logo-black-numu.png').toString(),
  description:
    'Dubai-based bio-composite materials company focused on mycelium acoustic panels, the Mushroomiya lamp, thermal insulation pathways, and regional material production.',
  sameAs: [
    'https://www.instagram.com/numu.bio',
    'https://www.linkedin.com/company/numu-bio',
  ],
  areaServed: ['Dubai', 'UAE', 'GCC'],
}

const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: NUMU_NAP.brandName,
  legalName: NUMU_NAP.legalName,
  url: SITE_URL,
  email: NUMU_NAP.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'IFZA Business Park, Building A1, Dubai Digital Park, Dubai Silicon Oasis',
    addressLocality: 'Dubai',
    addressCountry: 'AE',
  },
  identifier: [
    { '@type': 'PropertyValue', name: 'Licence No.', value: NUMU_NAP.licenceNumber },
    { '@type': 'PropertyValue', name: 'Premises', value: NUMU_NAP.premises },
    { '@type': 'PropertyValue', name: 'Makani', value: NUMU_NAP.makani },
  ],
  sameAs: organizationJsonLd.sameAs,
}

const andyCartierJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Andy Cartier',
  jobTitle: 'Founder & CEO',
  worksFor: { '@type': 'Organization', name: NUMU_NAP.brandName, url: SITE_URL },
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(andyCartierJsonLd) }} />
        {children}
        <SiteFooter />
        <GlobalImageLightbox />
        <BreadcrumbJsonLd />
      </body>
    </html>
  )
}
