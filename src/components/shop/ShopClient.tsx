'use client'

import Image from '@/components/SafariSafeImage'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import type { Product, ProductCategory } from '@/lib/commerce/catalogue'
import { STAGE_LABEL } from '@/lib/commerce/labels'
import { framing } from '@/lib/commerce/imageFit'
import { productPriceLabel } from '@/lib/commerce/money'

type Filter = 'All' | Exclude<ProductCategory, 'Experiences'>
const filters: Filter[] = ['All', 'Acoustic & Architectural Surfaces', 'Lighting', 'Furniture & Objects', 'Fungal Art', 'Bespoke Commissions']
const BORDER = '1px solid rgba(128,128,128,.15)'

function stageLabel(product: Product) {
  if (product.status === 'coming_soon') return 'Coming soon'
  return product.stage ? STAGE_LABEL[product.stage] : 'On request'
}

function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  const image = product.images[0]
  const { imgStyle, frameStyle } = framing(image, 4 / 5)
  return (
    <Link href={`/shop/${product.slug}`} data-reveal className="group catalogue-card" style={{ color: 'inherit', textDecoration: 'none' }}>
      <div className="relative overflow-hidden" style={{ aspectRatio: '4 / 5', background: 'rgba(26,23,20,.05)', ...frameStyle }}>
        {image
          ? <Image src={image.src} alt={image.alt} fill priority={priority} className="object-cover transition-transform duration-700 group-hover:scale-[1.02]" style={imgStyle} sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw" />
          : <div className="h-full flex items-end p-6 font-sans uppercase tracking-[.16em]" style={{ fontSize: '.625rem', opacity: .45 }}>Image forthcoming</div>}
        {image?.kind === 'visualisation' && (
          <span className="catalogue-badge">Visualisation</span>
        )}
      </div>
      <div className="pt-5">
        <p className="font-sans uppercase tracking-[.14em]" style={{ fontSize: '.625rem', opacity: .55 }}>{product.category} · {stageLabel(product)}</p>
        <h2 className="font-display mt-2" style={{ fontSize: '1.85rem', lineHeight: 1.02, letterSpacing: '-.02em' }}>{product.name}</h2>
        <p className="font-sans mt-2" style={{ fontSize: '.8rem', opacity: .6 }}>{product.subtitle}</p>
        <p className="font-sans mt-4 leading-[1.7]" style={{ fontSize: '.84rem', opacity: .66, maxWidth: 420 }}>{product.description}</p>
        <div className="mt-5 pt-4 flex items-center justify-between gap-4" style={{ borderTop: BORDER }}>
          <p className="font-sans" style={{ fontSize: '.75rem', opacity: .72 }}>{productPriceLabel(product)}</p>
          <span className="font-sans uppercase tracking-[.14em] catalogue-card-cta" style={{ fontSize: '.625rem' }}>
            {product.category === 'Experiences' ? 'View session' : 'View & enquire'} →
          </span>
        </div>
      </div>
    </Link>
  )
}

export default function ShopClient({ products }: { products: Product[] }) {
  const [filter, setFilter] = useState<Filter>('All')
  // Deep links such as /shop?family=Lighting from the homepage and product pages.
  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get('family')
    if (value && filters.includes(value as Filter)) setFilter(value as Filter)
  }, [])
  function choose(next: Filter) {
    setFilter(next)
    window.history.replaceState(null, '', next === 'All' ? '/shop' : `/shop?family=${encodeURIComponent(next)}`)
  }
  const objects = useMemo(() => products.filter(p => p.category !== 'Experiences'), [products])
  const experiences = useMemo(() => products.filter(p => p.category === 'Experiences'), [products])
  const visible = useMemo(() => objects.filter(p => filter === 'All' || p.category === filter), [objects, filter])
  const count = (value: Filter) => value === 'All' ? objects.length : objects.filter(p => p.category === value).length

  return <>
    <section className="px-6 md:px-12 pt-16 md:pt-24 pb-12" style={{ borderBottom: BORDER }}>
      <div className="max-w-[1440px] mx-auto grid lg:grid-cols-[1.1fr_.9fr] gap-10 items-end">
        <div>
          <p className="font-sans uppercase tracking-[.18em]" style={{ fontSize: '.6875rem', opacity: .6 }}>NUMU / Products</p>
          <h1 className="font-display mt-5" style={{ fontSize: 'clamp(3.2rem,8.5vw,8.5rem)', lineHeight: '.94', letterSpacing: '-.03em' }}>Objects &amp;<br />Surfaces</h1>
        </div>
        <div className="max-w-md">
          <p className="font-sans leading-[1.85]" style={{ fontSize: '1rem', opacity: .66 }}>
            Acoustic surfaces, lighting, furniture and original works grown from PALMYCO™, NUMU&apos;s mycelium composite on regional date-palm fibre. Made in Dubai.
          </p>
          <p className="font-sans leading-[1.75] mt-4" style={{ fontSize: '.84rem', opacity: .58 }}>
            Every piece is offered by inquiry, with price on request. Each card states its stage, from unique work to prototype, so you know exactly what exists today.
          </p>
        </div>
      </div>
    </section>

    <section className="px-6 md:px-12 py-6 catalogue-filters" style={{ borderBottom: BORDER }}>
      <div className="max-w-[1440px] mx-auto flex flex-wrap gap-x-6 gap-y-3" role="group" aria-label="Filter products by family">
        {filters.map(item => (
          <button type="button" key={item} aria-pressed={filter === item} onClick={() => choose(item)} className="font-sans uppercase tracking-[.14em]"
            style={{ fontSize: '.6875rem', minHeight: 36, opacity: filter === item ? .95 : .55, borderBottom: filter === item ? '1px solid currentColor' : '1px solid transparent' }}>
            {item} <span style={{ opacity: .6 }}>{count(item)}</span>
          </button>
        ))}
      </div>
    </section>

    <section className="px-6 md:px-12 py-10 md:py-14" aria-live="polite">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
        {visible.map((product, index) => <ProductCard key={product.id} product={product} priority={index < 3} />)}
      </div>
    </section>

    <section className="px-6 md:px-12 py-16 md:py-20" style={{ borderTop: BORDER }}>
      <div className="max-w-[1440px] mx-auto grid lg:grid-cols-[.9fr_1.1fr] gap-10 lg:gap-20">
        <div>
          <p className="font-sans uppercase tracking-[.18em]" style={{ fontSize: '.6875rem', opacity: .6 }}>How ordering works</p>
          <h2 className="font-display mt-5" style={{ fontSize: 'clamp(2.2rem,4.4vw,4.2rem)', lineHeight: 1.02, letterSpacing: '-.025em' }}>A sample, a defined scope, a clear specification.</h2>
        </div>
        <ol className="grid grid-cols-1 sm:grid-cols-2 gap-px" style={{ background: 'rgba(128,128,128,.15)' }}>
          {[
            ['Enquire', 'Tell us about the piece, the space and the timeline. Every product page has its own inquiry form.'],
            ['Sample', 'For surfaces and commissions we send material samples showing finish and natural variation.'],
            ['Quote', 'Price, lead time and delivery are confirmed in writing, with tested results kept separate from targets.'],
            ['Grow and deliver', 'Pieces are grown, finished and checked in Dubai, then delivered or installed with your team.'],
          ].map(([title, text], index) => (
            <li key={title} className="p-6" style={{ background: '#f5f1e8', listStyle: 'none' }}>
              <p className="font-sans uppercase tracking-[.14em]" style={{ fontSize: '.625rem', opacity: .55 }}>0{index + 1}</p>
              <p className="font-display mt-3" style={{ fontSize: '1.35rem' }}>{title}</p>
              <p className="font-sans mt-3 leading-[1.7]" style={{ fontSize: '.84rem', opacity: .66 }}>{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>

    {experiences.length > 0 && (
      <section className="px-6 md:px-12 py-16 md:py-20" style={{ borderTop: BORDER }}>
        <div className="max-w-[1440px] mx-auto">
          <p className="font-sans uppercase tracking-[.18em]" style={{ fontSize: '.6875rem', opacity: .6 }}>Conversations &amp; learning</p>
          <h2 className="font-display mt-5 mb-12" style={{ fontSize: 'clamp(2rem,3.6vw,3.4rem)', lineHeight: 1.05, letterSpacing: '-.025em' }}>Time with the material team.</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
            {experiences.map(product => <ProductCard key={product.id} product={product} />)}
          </div>
        </div>
      </section>
    )}
  </>
}
