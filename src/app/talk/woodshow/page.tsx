import type { Metadata } from 'next'
import WoodshowDeckClient from './WoodshowDeckClient'
import './woodshow.css'
import { WOODSHOW_SLIDE_COUNT } from '@/lib/woodshowDeck'

export const metadata: Metadata = {
  title: 'NUMU WoodShow Talk',
  description: 'Hidden local route for the NUMU Dubai WoodShow 2026 talk deck.',
  robots: 'noindex, nofollow',
}

type PageProps = {
  searchParams?: {
    slide?: string | string[]
    singleSlide?: string | string[]
    snapshot?: string | string[]
  }
}

export default function WoodshowTalkPage({ searchParams }: PageProps) {
  const rawSlide =
    (Array.isArray(searchParams?.slide) ? searchParams?.slide[0] : searchParams?.slide) ??
    (Array.isArray(searchParams?.singleSlide) ? searchParams?.singleSlide[0] : searchParams?.singleSlide)
  const rawSnapshot = Array.isArray(searchParams?.snapshot) ? searchParams?.snapshot[0] : searchParams?.snapshot
  const slideNumber = Number(rawSlide)
  const singleSlide = Number.isFinite(slideNumber) && slideNumber >= 1 && slideNumber <= WOODSHOW_SLIDE_COUNT ? slideNumber : undefined
  const snapshot = rawSnapshot === '1'

  return (
    <main>
      <WoodshowDeckClient singleSlide={singleSlide} snapshot={snapshot} />
    </main>
  )
}
