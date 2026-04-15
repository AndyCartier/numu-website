import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'

const displayFont = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

const sansFont = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'NUMU — Bio-Engineered Material Systems',
  description: 'NUMU develops bio-engineered materials grown from natural fibers to replace synthetic foams in architecture and design. UAE-based material company.',
  openGraph: {
    title: 'NUMU — Bio-Engineered Material Systems',
    description: 'Grown materials for tomorrow\'s interiors.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${displayFont.variable} ${sansFont.variable}`}>
      <body>{children}</body>
    </html>
  )
}
