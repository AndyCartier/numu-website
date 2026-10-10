import type { Metadata } from 'next'
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

export default function InvestorDeckPage() {
  const token = cookies().get(INVESTOR_ACCESS_COOKIE)?.value
  if (!hasValidInvestorAccessToken(token)) notFound()
  void loadInvestorContent()
  return <DeckClient fontVars="" />
}
