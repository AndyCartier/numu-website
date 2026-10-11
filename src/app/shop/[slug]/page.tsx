import type { Metadata } from 'next'
import Image from '@/components/SafariSafeImage'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SubpageNav } from '@/components/SubpageNav'
import ProductActions from '@/components/shop/ProductActions'
import ProductInquiry from '@/components/shop/ProductInquiry'
import { EVIDENCE_LABEL, STAGE_LABEL, getProduct, isPhysical, publicProducts, relatedProducts, type ProductImage } from '@/lib/commerce/catalogue'
import { productPriceLabel } from '@/lib/commerce/money'
import { buildAbsoluteUrl, SITE_URL } from '@/lib/site'
import responsiveImages from '@/generated/responsive-images.json'

const BORDER = '1px solid rgba(128,128,128,.15)'
const KIND_LABEL: Record<NonNullable<ProductImage['kind']>, string> = { photograph: 'Photograph', visualisation: 'Visualisation', design_study: 'Design study' }

export function generateStaticParams() { return publicProducts.map((product) => ({ slug: product.slug })) }

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const product = getProduct(params.slug)
  if (!product || ['draft', 'archived'].includes(product.status)) return {}
  const image = product.images[0]?.src
  return {
    title: product.seo.title, description: product.seo.description, alternates: { canonical: `/shop/${product.slug}` },
    openGraph: { title: product.seo.title, description: product.seo.description, url: `/shop/${product.slug}`, images: image ? [{ url: buildAbsoluteUrl(image).toString(), alt: product.images[0].alt }] : [] },
    twitter: { card: 'summary_large_image', title: product.seo.title, description: product.seo.description, images: image ? [buildAbsoluteUrl(image).toString()] : [] },
  }
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="font-sans uppercase tracking-[.18em]" style={{ fontSize: '.6875rem', opacity: .6 }}>{children}</p>
}

// Masonry gallery: natural proportions, no cropping and no orphaned rows.
function GalleryImage({ image, productName }: { image: ProductImage; productName: string }) {
  const kind = image.kind ? KIND_LABEL[image.kind] : undefined
  const caption = [image.caption || image.alt, kind && kind !== 'Photograph' ? `${kind}. Indicative only.` : ''].filter(Boolean).join(' ')
  return (
    <figure className="mb-3 md:mb-4" style={{ breakInside: 'avoid' }}>
      <div className="relative overflow-hidden" style={{ background: 'rgba(26,23,20,.05)' }}>
        <Image src={image.src} alt={image.alt} data-lightbox-caption={`${productName} — ${caption}`} className="block w-full h-auto" sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw" />
        {kind && <span className="catalogue-badge">{kind}</span>}
      </div>
      {image.caption && <figcaption className="font-sans mt-2" style={{ fontSize: '.72rem', opacity: .58 }}>{image.caption}</figcaption>}
    </figure>
  )
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProduct(params.slug)
  if (!product || product.status === 'draft' || product.status === 'archived') notFound()
  const physical = isPhysical(product)
  // Experiences without a live Cal.com link fall back to a booking request through the same form.
  const bookingRequest = !physical && product.transactionMode === 'booking' && product.status !== 'coming_soon' && !product.bookingUrl
  const showInquiry = physical || bookingRequest
  const stage = product.status === 'coming_soon' ? 'Coming soon' : product.stage ? STAGE_LABEL[product.stage] : 'On request'
  const hero = product.images[0]
  // Long single words (e.g. 'Collaboration') get a smaller title so they never break mid-word.
  const longestWord = Math.max(...product.name.split(/\s+/).map(word => word.length))
  // The hero frame follows the image: portrait stays 4:5, landscape renders at 3:2 instead of being cropped.
  const heroSize = hero ? (responsiveImages as Record<string, { width: number; height: number }>)[hero.src] : undefined
  const heroAspect = heroSize && heroSize.width > heroSize.height * 1.1 ? '3 / 2' : '4 / 5'
  const gallery = product.images.slice(1)
  const related = relatedProducts(product)
  const url = buildAbsoluteUrl(`/shop/${product.slug}`).toString()
  // Inquiry-only catalogue: Product schema without offers, so no price or availability is asserted.
  const productJsonLd = physical ? {
    '@context': 'https://schema.org', '@type': 'Product', name: product.name, description: product.seo.description, url,
    image: product.images.filter(image => image.kind !== 'visualisation').concat(product.images.filter(image => image.kind === 'visualisation')).slice(0, 6).map((image) => buildAbsoluteUrl(image.src).toString()),
    brand: { '@type': 'Brand', name: 'NUMU' }, manufacturer: { '@type': 'Organization', name: 'NUMU', url: SITE_URL }, category: product.category,
    ...(product.material ? { material: product.material } : {}),
    additionalProperty: (product.specs ?? []).filter(spec => spec.evidence === 'confirmed').map(spec => ({ '@type': 'PropertyValue', name: spec.label, value: spec.value })),
  } : null
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Objects & Surfaces', item: buildAbsoluteUrl('/shop').toString() },
      { '@type': 'ListItem', position: 3, name: product.name, item: url },
    ],
  }

  return <main className="min-h-screen" style={{ background: '#f5f1e8', color: '#1a1714' }}>
    {productJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />}
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
    <SubpageNav currentPath={`/shop/${product.slug}`} />

    {/* Hero */}
    <section className="px-6 md:px-12 pt-8 md:pt-12 pb-14 md:pb-20">
      <nav aria-label="Breadcrumb" className="max-w-[1440px] mx-auto font-sans uppercase tracking-[.16em] flex flex-wrap gap-2" style={{ fontSize: '.65rem', opacity: .62 }}>
        <Link href="/shop" style={{ color: 'inherit' }}>Objects &amp; Surfaces</Link><span aria-hidden>/</span>
        <Link href={`/shop?family=${encodeURIComponent(product.category)}`} style={{ color: 'inherit' }}>{product.category}</Link>
      </nav>
      <div className="max-w-[1440px] mx-auto mt-8 grid lg:grid-cols-[1.25fr_.75fr] gap-10 lg:gap-16 items-start">
        <div className="relative overflow-hidden" style={{ aspectRatio: heroAspect, maxHeight: '86vh', width: '100%', background: 'rgba(26,23,20,.05)' }}>
          {hero && <Image src={hero.src} alt={hero.alt} data-lightbox-caption={`${product.name} — ${hero.caption || hero.alt}${hero.kind && hero.kind !== 'photograph' ? ` ${KIND_LABEL[hero.kind]}. Indicative only.` : ''}`} fill priority className="object-cover" sizes="(max-width:1024px) 100vw, 60vw" />}
          {hero?.kind && <span className="catalogue-badge">{KIND_LABEL[hero.kind]}</span>}
        </div>
        <aside className="lg:sticky lg:top-24">
          <Label>{product.category} · {stage}</Label>
          <h1 className="font-display mt-5" style={{ fontSize: longestWord > 10 ? 'clamp(2.4rem,4.2vw,4.6rem)' : 'clamp(3rem,6vw,6.5rem)', lineHeight: 1, letterSpacing: '-.03em', overflowWrap: 'break-word', hyphens: 'manual' }}>{product.name}</h1>
          <p className="font-sans mt-4" style={{ fontSize: '.95rem', opacity: .62 }}>{product.subtitle}</p>
          <p className="font-sans mt-8 leading-[1.8]" style={{ fontSize: '1rem', opacity: .74 }}>{product.description}</p>
          {product.stageNote && <p className="font-sans mt-6 p-4 leading-[1.65]" style={{ fontSize: '.8rem', border: BORDER, background: 'rgba(26,23,20,.025)', opacity: .82 }}>{product.stageNote}</p>}
          <div className="mt-8 pt-7" style={{ borderTop: BORDER }}>
            <p className="font-display" style={{ fontSize: '1.9rem' }}>{productPriceLabel(product)}</p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-4 items-center">
              {physical
                ? <a href="#inquiry" className="shop-cta">{product.inquiry?.cta || 'Request a quote'} →</a>
                : <ProductActions product={product} />}
              {product.detailLink && <Link href={product.detailLink.href} className="review-link">{product.detailLink.label} ↗</Link>}
            </div>
          </div>
        </aside>
      </div>
    </section>

    {/* Gallery */}
    {gallery.length > 0 && (
      <section className="px-6 md:px-12 pb-16 md:pb-24" aria-label={`${product.name} gallery`}>
        <div className={`max-w-[1440px] mx-auto gap-3 md:gap-4 columns-1 sm:columns-2 ${gallery.length > 2 ? 'lg:columns-3' : ''}`}>
          {gallery.map(image => <GalleryImage key={image.src} image={image} productName={product.name} />)}
        </div>
      </section>
    )}

    {/* Story */}
    <section className="px-6 md:px-12 py-16 md:py-24" style={{ borderTop: BORDER }}>
      <div className="max-w-[1440px] mx-auto grid lg:grid-cols-[1fr_1fr] gap-10 lg:gap-20">
        <div>
          <Label>{physical ? 'The piece' : 'The session'}</Label>
          <h2 className="font-display mt-5 max-w-2xl" style={{ fontSize: 'clamp(2.2rem,4.2vw,4.2rem)', lineHeight: 1.04, letterSpacing: '-.025em' }}>{product.story}</h2>
        </div>
        <div className="space-y-5">
          {(product.storyParagraphs ?? [product.description]).map(text => (
            <p key={text.slice(0, 40)} className="font-sans leading-[1.85]" style={{ fontSize: '1rem', opacity: .7 }}>{text}</p>
          ))}
        </div>
      </div>
    </section>

    {/* Specifications */}
    {product.specs && product.specs.length > 0 && (
      <section className="px-6 md:px-12 py-16 md:py-20" style={{ borderTop: BORDER }}>
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
            <div>
              <Label>Specification</Label>
              <h2 className="font-display mt-4" style={{ fontSize: 'clamp(1.9rem,3vw,2.8rem)', lineHeight: 1.05 }}>What is known, and how we know it.</h2>
            </div>
            <p className="font-sans max-w-md leading-[1.65]" style={{ fontSize: '.78rem', opacity: .6 }}>
              Each line states its evidence. Design targets are objectives under test, not certified results; nothing here establishes compliance for a specific project.
            </p>
          </div>
          <dl className="product-facts grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {product.specs.map(spec => (
              <div key={spec.label} className="py-5 pr-4">
                <dt className="font-sans uppercase tracking-[.14em]" style={{ fontSize: '.6875rem', opacity: .66 }}>{spec.label}</dt>
                <dd className="font-sans mt-3 leading-[1.5]" style={{ fontSize: '.92rem', opacity: .82 }}>{spec.value}</dd>
                {spec.evidence && spec.evidence !== 'confirmed' && (
                  <dd className="font-sans mt-2 uppercase tracking-[.12em] spec-evidence" data-evidence={spec.evidence} style={{ fontSize: '.6rem' }}>{EVIDENCE_LABEL[spec.evidence]}</dd>
                )}
              </div>
            ))}
          </dl>
        </div>
      </section>
    )}

    {/* Options */}
    {product.variants && product.variants.some(variant => variant.description) && (
      <section className="px-6 md:px-12 py-14 md:py-16" style={{ borderTop: BORDER }}>
        <div className="max-w-[1440px] mx-auto grid lg:grid-cols-[.6fr_1.4fr] gap-8 lg:gap-16">
          <div><Label>Options</Label></div>
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {product.variants.filter(variant => variant.description).map(variant => (
              <li key={variant.id} style={{ listStyle: 'none', borderTop: BORDER }} className="pt-4">
                <p className="font-display" style={{ fontSize: '1.3rem' }}>{variant.name}</p>
                <p className="font-sans mt-2 leading-[1.65]" style={{ fontSize: '.84rem', opacity: .66 }}>{variant.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    )}

    {/* Applications */}
    {product.applications && product.applications.length > 0 && (
      <section className="px-6 md:px-12 py-14 md:py-16" style={{ borderTop: BORDER }}>
        <div className="max-w-[1440px] mx-auto grid lg:grid-cols-[.6fr_1.4fr] gap-8 lg:gap-16">
          <div><Label>Where it belongs</Label></div>
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {product.applications.map(application => (
              <li key={application.title} style={{ listStyle: 'none', borderTop: BORDER }} className="pt-4">
                <p className="font-display" style={{ fontSize: '1.3rem' }}>{application.title}</p>
                <p className="font-sans mt-2 leading-[1.65]" style={{ fontSize: '.84rem', opacity: .66 }}>{application.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    )}

    {/* Inquiry */}
    {showInquiry && (
      <section id="inquiry" className="px-6 md:px-12 py-16 md:py-24 scroll-mt-20" style={{ borderTop: BORDER, background: 'rgba(26,23,20,.03)' }}>
        <div className="max-w-[1440px] mx-auto grid lg:grid-cols-[.8fr_1.2fr] gap-10 lg:gap-20">
          <div>
            <Label>{product.inquiry?.cta || 'Request a quote'}</Label>
            <h2 className="font-display mt-5" style={{ fontSize: 'clamp(2.2rem,4vw,3.8rem)', lineHeight: 1.04, letterSpacing: '-.025em' }}>{product.inquiry?.projectFields ? 'Tell us about your project.' : 'Tell us what you are looking for.'}</h2>
            <p className="font-sans mt-6 leading-[1.8] max-w-md" style={{ fontSize: '.92rem', opacity: .66 }}>
              {bookingRequest
                ? 'Tell us what you would like to discuss and when suits you. We reply with a booking link and the session fee.'
                : 'We reply with availability, a sample route where relevant, and a written quote. Price, lead time and delivery are confirmed for each request.'}
            </p>
          </div>
          <ProductInquiry productId={product.id} productName={product.name} slug={product.slug} variants={product.variants} inquiry={product.inquiry} booking={bookingRequest} />
        </div>
      </section>
    )}

    {/* Related */}
    {related.length > 0 && (
      <section className="px-6 md:px-12 py-16 md:py-20" style={{ borderTop: BORDER }}>
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <Label>Related</Label>
            <Link href="/shop" className="review-link">All objects &amp; surfaces ↗</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {related.map(item => (
              <Link key={item.id} href={`/shop/${item.slug}`} className="group" style={{ color: 'inherit', textDecoration: 'none' }}>
                <div className="relative overflow-hidden" style={{ aspectRatio: '4 / 3', background: 'rgba(26,23,20,.05)' }}>
                  {item.images[0] && <Image src={item.images[0].src} alt={item.images[0].alt} fill className="object-cover transition-transform duration-700 group-hover:scale-[1.02]" sizes="(max-width:640px) 100vw, 33vw" />}
                </div>
                <p className="font-sans uppercase tracking-[.14em] mt-4" style={{ fontSize: '.6rem', opacity: .55 }}>{item.category}</p>
                <p className="font-display mt-1" style={{ fontSize: '1.45rem' }}>{item.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    )}
  </main>
}
