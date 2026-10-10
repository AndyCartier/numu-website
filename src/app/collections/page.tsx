import type { Metadata } from 'next'
import Link from 'next/link'
import { SubpageNav } from '@/components/SubpageNav'
import CollectionGallery from '@/components/CollectionGallery'

export const metadata: Metadata = {
  title: 'Objects, Lighting & Spaces | NUMU Collection',
  description: 'Explore NUMU lighting, desk objects, event collateral, spatial concepts and material studies, made with the Palmyco mycelium material system.',
  alternates: { canonical: '/collections' },
}
export default function CollectionsPage() {
  return <main className="review-page"><SubpageNav currentPath="/collections" />
    <header className="collection-header review-container">
      <p className="review-eyebrow">The NUMU collection</p>
      <h1>One material.<br /><em>Many possibilities.</em></h1>
      <div className="collection-intro"><p>Lighting that shapes a room. Objects that mark a moment. Surfaces with a story to tell. Explore the work growing out of Palmyco, our mycelium and palm-fibre material system.</p><p>Concept visualisations sit alongside material references and design studies. For product details and inquiries, explore <Link href="/mushroomiya">Mushroomiya</Link>, <Link href="/fold">FOLD</Link> or <Link href="/shop">Objects &amp; Surfaces</Link>, where every piece can be requested directly.</p></div>
    </header>
    <section className="review-container collection-body" aria-label="Visual collection"><CollectionGallery /></section>
    <section className="review-container collection-enquiry"><p className="review-eyebrow">Made for your brief</p><h2>Something worth keeping.</h2><p>Tell us about the occasion, the quantity and the date. We can discuss a form, a finish and a presentation that make sense for your project.</p><Link className="review-link" href="/shop/bespoke-commissions">Discuss a commission ↗</Link></section>
  </main>
}
