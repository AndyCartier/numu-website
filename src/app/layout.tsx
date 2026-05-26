import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { buildAbsoluteUrl } from '@/lib/site'
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
  title: 'NUMU — Bio-Engineered Materials Platform',
  description:
    'NUMU is building the Middle East\u2019s first mycelium manufacturing infrastructure \u2014 replacing imported synthetic foams with locally grown, bio-engineered construction materials.',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'NUMU — Bio-Engineered Materials Platform',
    description:
      'Replacing imported synthetic foams with locally grown, construction-grade alternatives.',
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
    title: 'NUMU — Bio-Engineered Materials Platform',
    description:
      'Replacing imported synthetic foams with locally grown, construction-grade alternatives.',
    images: ['/images/projects/acoustic_render_07.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>{children}</body>
    </html>
  )
}
