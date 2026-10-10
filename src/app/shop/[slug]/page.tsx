import type { Metadata } from 'next'
import Image from '@/components/SafariSafeImage'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SubpageNav } from '@/components/SubpageNav'
import ProductActions from '@/components/shop/ProductActions'
import { getProduct, publicProducts } from '@/lib/commerce/catalogue'
import { productPriceLabel } from '@/lib/commerce/money'
import { buildAbsoluteUrl } from '@/lib/site'

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

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProduct(params.slug)
  if (!product || product.status === 'draft' || product.status === 'archived') notFound()
  const state = product.status === 'made_to_order' ? 'Made to order' : product.status === 'coming_soon' ? 'Coming soon' : product.transactionMode === 'inquiry' ? 'On request' : 'Available'
  const productJsonLd = process.env.NODE_ENV !== 'development' && product.category !== 'Experiences' ? {
    '@context': 'https://schema.org', '@type': 'Product', name: product.name, description: product.seo.description,
    image: product.images.map((image) => buildAbsoluteUrl(image.src).toString()), brand: { '@type': 'Brand', name: 'NUMU' }, category: product.category,
    ...(product.material ? { material: product.material } : {}), ...(product.dimensions ? { size: product.dimensions } : {}),
  } : null
  const experience = product.category === 'Experiences'
  const details = [['Material', product.material], ['Dimensions', product.dimensions], ['Finish', product.finish], ['Origin', product.origin], ['Edition', product.edition || (product.unique ? 'Unique work' : undefined)], [experience ? 'Duration' : 'Lead time', product.leadTime]].filter(([, value]) => value)

  return <main className="min-h-screen" style={{ background: '#f5f1e8', color: '#1a1714' }}>
    {productJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />}
    <SubpageNav currentPath={`/shop/${product.slug}`} />
    <section className="px-6 md:px-12 pt-8 md:pt-12 pb-14 md:pb-20">
      <div className="max-w-[1440px] mx-auto"><Link href="/shop" className="font-sans uppercase tracking-[.16em]" style={{ fontSize: '.65rem', color: 'inherit', opacity: .58 }}>← Back to shop</Link></div>
      <div className="max-w-[1440px] mx-auto mt-10 grid lg:grid-cols-[1.18fr_.82fr] gap-10 lg:gap-16 items-start">
        <aside className="lg:order-2 lg:sticky lg:top-24"><p className="font-sans uppercase tracking-[.18em]" style={{ fontSize: '.6875rem', opacity: .52 }}>{product.category} · {state}</p><h1 className="font-display mt-5" style={{ fontSize: 'clamp(3rem,6.5vw,7rem)', lineHeight: 1, letterSpacing: '-.03em', overflowWrap: 'anywhere' }}>{product.name}</h1><p className="font-sans mt-5" style={{ fontSize: '.9rem', opacity: .56 }}>{product.subtitle}</p><p className="font-sans mt-8 leading-[1.8]" style={{ fontSize: '1rem', opacity: .7 }}>{product.description}</p><div className="mt-10 pt-8" style={{ borderTop: '1px solid rgba(128,128,128,.18)' }}><p className="font-display" style={{ fontSize: '2rem' }}>{productPriceLabel(product, 'AED')}</p><div className="mt-7"><ProductActions product={product} /></div><p className="font-sans mt-5 leading-[1.6]" style={{ fontSize: '.7rem', opacity: .5 }}>{experience ? 'A conversation about the NUMU material system. Availability and participation details are confirmed directly.' : product.transactionMode === 'inquiry' ? 'A NUMU specialist will confirm specification, lead time, and delivery.' : 'Made in Dubai. Natural material variation is part of every grown piece.'}</p></div></aside>
        <div className="lg:order-1 grid grid-cols-2 gap-3 md:gap-4">{product.images.map((image, index) => <div key={image.src} className={`relative overflow-hidden ${index === 0 ? 'col-span-2' : ''}`} style={{ aspectRatio: index === 0 ? '4 / 3' : '1 / 1', background: 'rgba(26,23,20,.05)' }}><Image src={image.src} alt={image.alt} fill priority={index === 0} className="object-cover" sizes={index === 0 ? '(max-width:1024px) 100vw, 60vw' : '(max-width:768px) 50vw, 30vw'} /></div>)}</div>
      </div>
    </section>
    <section className="px-6 md:px-12 py-14 md:py-20" style={{ borderTop: '1px solid rgba(128,128,128,.15)' }}>
      <div className="max-w-[1440px] mx-auto grid lg:grid-cols-[1.1fr_.9fr] gap-12 lg:gap-20"><div><p className="font-sans uppercase tracking-[.18em]" style={{ fontSize: '.6875rem', opacity: .52 }}>{experience ? 'Experience / story' : 'Material / story'}</p><h2 className="font-display mt-5 max-w-3xl" style={{ fontSize: 'clamp(2.35rem,4.6vw,4.7rem)', lineHeight: 1.02, letterSpacing: '-.025em' }}>{product.story}</h2></div><div className="product-facts grid grid-cols-1 sm:grid-cols-3 gap-px h-fit" style={{ background: 'rgba(128,128,128,.15)' }}><div className="p-5" style={{ background: '#f5f1e8' }}><p className="font-sans uppercase tracking-[.14em]" style={{ fontSize: '.6875rem', opacity: .7 }}>Origin</p><p className="font-sans mt-3" style={{ fontSize: '.8rem', opacity: .72 }}>{product.origin || 'Dubai, UAE'}</p></div><div className="p-5" style={{ background: '#f5f1e8' }}><p className="font-sans uppercase tracking-[.14em]" style={{ fontSize: '.6875rem', opacity: .7 }}>{experience ? 'Topic' : 'Material'}</p><p className="font-sans mt-3" style={{ fontSize: '.8rem', opacity: .72 }}>{product.material || 'NUMU material system'}</p></div><div className="p-5" style={{ background: '#f5f1e8' }}><p className="font-sans uppercase tracking-[.14em]" style={{ fontSize: '.6875rem', opacity: .7 }}>{experience ? 'Participation' : 'Care'}</p><p className="font-sans mt-3" style={{ fontSize: '.8rem', opacity: .72 }}>{experience ? 'Details confirmed before your session.' : 'Details confirmed with your order.'}</p></div></div></div>
      {details.length > 0 && <dl className="max-w-[1440px] mx-auto product-facts mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: 'rgba(128,128,128,.15)' }}>{details.map(([label, value]) => <div key={label} className="p-5 md:p-6" style={{ background: '#f5f1e8' }}><dt className="font-sans uppercase tracking-[.14em]" style={{ fontSize: '.6875rem', opacity: .7 }}>{label}</dt><dd className="font-sans mt-3 leading-[1.5]" style={{ fontSize: '.85rem', opacity: .72 }}>{value}</dd></div>)}</dl>}
    </section>
  </main>
}
