import Image from '@/components/SafariSafeImage'
import Link from 'next/link'
const objectImage = '/collections/objects/13 - Triangular Milestone Desk Gifts.png'
export function HomeIntroduction() {
  return <section className="home-introduction review-container" aria-label="Welcome to NUMU">
    <div className="home-intro-copy"><p className="review-eyebrow">NUMU · نُمُوّ · Dubai</p><h2>Grown from nature.<br /><em>Made for the spaces<br />we inhabit.</em></h2><p>Mycelium and local palm fibre, shaped into tactile surfaces, sculptural lighting and objects worth keeping.</p><div className="home-intro-links"><Link className="review-link" href="/shop">Explore objects &amp; surfaces ↗</Link><Link className="review-link secondary" href="/palmyco">Meet Palmyco ↗</Link></div><p className="home-intro-note">Materials · Lighting · Objects</p></div>
    <div className="home-intro-images">
      <Link href="/fold" className="home-intro-main"><Image src="/images/user/fold-panel-studio.jpg" alt="A real FOLD panel prototype in the NUMU studio" fill priority sizes="(max-width: 800px) 100vw, 45vw" className="object-cover" /><span>01 / FOLD prototype ↗</span></Link>
      <Link href="/mushroomiya" className="home-intro-small"><Image src="/images/mushroomiya/base39-lamp-01.jpg" alt="Mushroomiya lattice pendant concept" fill priority sizes="(max-width: 800px) 50vw, 23vw" className="object-cover" /><span>02 / Mushroomiya ↗</span></Link>
      <Link href="/shop/grown-lounge-chair" className="home-intro-small"><Image src="/images/user/palmyco-chair.jpg" alt="A full-scale PALMYCO chair prototype" fill priority sizes="(max-width: 800px) 50vw, 23vw" className="object-cover" /><span>03 / PALMYCO chair ↗</span></Link>
      <p>Real prototypes and material applications made by NUMU.</p>
    </div>
  </section>
}
export default function CollectionFeatures() {
  return <section id="objects" className="collection-feature" aria-labelledby="objects-title">
    <div className="review-container collection-feature-grid">
      <div><p className="review-eyebrow">Objects & editions</p><h2 id="objects-title">Small enough for a desk.<br /><em>Made to start a conversation.</em></h2><p>Board gifts, delegate mementos, long-service and milestone pieces. Unusual forms grown in repeat batches, with considered engraving and presentation boxes.</p><p>Explore triangular desk pieces, ring awards, vessels and event collateral, all developed around the Palmyco material system.</p><Link href="/shop/objects-editions" className="review-link">Explore objects & editions ↗</Link><Link href="/shop/bespoke-commissions" className="review-link secondary">Discuss a commission ↗</Link></div>
      <figure><Image src={objectImage} alt="Triangular Palmyco milestone gift concepts with engraved gold-coloured brass plates and fitted presentation box" width={1536} height={1024} sizes="(max-width: 800px) 100vw, 55vw" data-lightbox-caption="Triangular milestone desk gifts. Visualisation. Indicative only." /><figcaption>Triangular milestone pieces · Visualisation. Indicative only.</figcaption></figure>
    </div>
    <div className="review-container collection-discover"><Link href="/mushroomiya"><span>Lighting</span><strong>Mushroomiya</strong><p>Explore the grown lattice, the research and the lamp. ↗</p></Link><Link href="/shop/grown-veneer-furniture"><span>Furniture &amp; cladding</span><strong>Grown veneer</strong><p>Sideboards, cabinets and walls between wood and marble. ↗</p></Link><Link href="/shop/fungal-art-series"><span>Original works</span><strong>Fungal Art Series®</strong><p>Grown wall works by Andy Cartier. ↗</p></Link></div>
  </section>
}
