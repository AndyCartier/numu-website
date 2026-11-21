import type { Metadata } from 'next'
import GrowClient from './GrowClient'

export const metadata: Metadata = {
  title: 'Can Your Packaging Be Grown? | NUMU',
  description:
    'A 5-minute test to find the right first product for a grown-packaging pilot with PALMYCO, made in Dubai from regional agricultural waste.',
  alternates: { canonical: '/grow' },
  robots: { index: false, follow: false },
}

export default function GrowPage() {
  return <GrowClient />
}
