import type { Metadata } from 'next'
import { Gloock, IBM_Plex_Mono, Instrument_Sans, Instrument_Serif } from 'next/font/google'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { loadInvestorContent } from '@/lib/content'
import { hasValidInvestorAccessToken, INVESTOR_ACCESS_COOKIE } from '@/lib/investorAccess'
import DeckClient from './DeckClient'
import './deck.css'

export const metadata: Metadata = {
  title: 'NUMU — Investor Deck',
  robots: 'noindex, nofollow',
}

const gloock = Gloock({ subsets: ['latin'], variable: '--font-display', weight: '400', display: 'swap' })
const instrumentSans = Instrument_Sans({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })
const instrumentSerif = Instrument_Serif({ subsets: ['latin'], variable: '--font-serif', weight: '400', style: ['normal', 'italic'], display: 'swap' })
const ibmPlexMono = IBM_Plex_Mono({ subsets: ['latin'], variable: '--font-mono', weight: ['400', '500'], display: 'swap' })

export default function InvestorDeckPage() {
  const token = cookies().get(INVESTOR_ACCESS_COOKIE)?.value
  if (!hasValidInvestorAccessToken(token)) notFound()
  void loadInvestorContent()
  const fontVars = `${gloock.variable} ${instrumentSans.variable} ${instrumentSerif.variable} ${ibmPlexMono.variable}`
  return <DeckClient fontVars={fontVars} />
}
