import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { buildAbsoluteUrl, SITE_URL } from '@/lib/site'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: buildAbsoluteUrl('/'),
  title: 'NUMU | Mycelium Acoustic Panels and Bio-Composite Materials in Dubai',
  description:
    'NUMU builds mycelium acoustic panels and bio-composite materials in Dubai, creating a local UAE and GCC alternative to imported synthetic construction foams.',
  keywords: [
    'NUMU',
    'mycelium acoustic panels Dubai',
    'bio composite materials UAE',
    'mycelium materials GCC',
    'sustainable building materials Dubai',
    'acoustic panels UAE',
  ],
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'NUMU | Mycelium Acoustic Panels and Bio-Composite Materials in Dubai',
    description:
      'A Dubai-based mycelium materials company building acoustic, thermal, and packaging pathways for the UAE and GCC.',
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
    title: 'NUMU | Mycelium Acoustic Panels and Bio-Composite Materials in Dubai',
    description:
      'A Dubai-based mycelium materials company building local acoustic and bio-composite alternatives for the GCC.',
    images: ['/images/projects/acoustic_render_07.jpg'],
  },
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'NUMU',
  url: SITE_URL,
  description:
    'NUMU builds mycelium acoustic panels and bio-composite materials in Dubai for the UAE and GCC.',
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'NUMU',
  url: SITE_URL,
  logo: buildAbsoluteUrl('/branding/logo-black-numu.png').toString(),
  description:
    'Dubai-based bio-composite materials company focused on mycelium acoustic panels, thermal insulation pathways, and regional material production.',
  sameAs: [
    'https://www.instagram.com/numu.bio',
    'https://www.linkedin.com/company/numu-bio',
  ],
  areaServed: ['Dubai', 'UAE', 'GCC'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {children}
      </body>
    </html>
  )
}
