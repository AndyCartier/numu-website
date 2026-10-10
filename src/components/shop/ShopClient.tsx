'use client'

import Image from '@/components/SafariSafeImage'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import type { Product, ProductCategory } from '@/lib/commerce/catalogue'
import { productPriceLabel } from '@/lib/commerce/money'

const categories: Array<'All' | ProductCategory> = ['All', 'Objects', 'Lighting', 'Art', 'Materials', 'Experiences']
const statusLabel = (product: Product) => product.status === 'made_to_order' ? 'Made to order' : product.status === 'coming_soon' ? 'Coming soon' : product.status === 'sold' ? 'Sold' : product.transactionMode === 'inquiry' ? 'On request' : 'Available'

export default function ShopClient({ products }: { products: Product[] }) {
  const [category, setCategory] = useState<'All' | ProductCategory>('All')
  const [currency, setCurrency] = useState<'AED' | 'USD'>('AED')
  useEffect(() => { try { const stored = localStorage.getItem('numu-shop-currency'); if (stored === 'AED' || stored === 'USD') setCurrency(stored) } catch {} }, [])
  function chooseCurrency(next: 'AED' | 'USD') { setCurrency(next); try { localStorage.setItem('numu-shop-currency', next) } catch {} }
  const visible = useMemo(() => products.filter(p => category === 'All' || p.category === category), [products, category])
  return <>
    <section className="px-6 md:px-12 pt-16 md:pt-24 pb-12" style={{ borderBottom: '1px solid rgba(128,128,128,.15)' }}>
      <div className="max-w-[1440px] mx-auto grid lg:grid-cols-[1.1fr_.9fr] gap-10 items-end">
        <div><p className="font-sans uppercase tracking-[.18em]" style={{ fontSize: '.6875rem', opacity: .52 }}>NUMU / Shop</p><h1 className="font-display mt-5" style={{ fontSize: 'clamp(3.5rem,9vw,9rem)', lineHeight: '.92', letterSpacing: '-.03em' }}>Objects grown<br />from matter.</h1></div>
        <p className="font-sans max-w-md leading-[1.85]" style={{ fontSize: '1rem', opacity: .62 }}>A collection of lighting, objects, art, materials, and conversations from the NUMU material system.</p>
      </div>
    </section>
    <section className="px-6 md:px-12 py-7" style={{ borderBottom: '1px solid rgba(128,128,128,.15)' }}>
      <div className="max-w-[1440px] mx-auto flex flex-wrap gap-x-5 gap-y-3 items-center justify-between"><div className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Catalogue filters">{categories.map(item => <button type="button" key={item} aria-pressed={category === item} onClick={() => setCategory(item)} className="font-sans uppercase tracking-[.14em]" style={{ fontSize: '.6875rem', opacity: category === item ? .92 : .48, borderBottom: category === item ? '1px solid currentColor' : '1px solid transparent', paddingBottom: 4 }}>{item}</button>)}</div><div className="font-sans uppercase tracking-[.14em] flex gap-3" style={{ fontSize: '.6875rem' }}><button aria-pressed={currency === 'AED'} onClick={() => chooseCurrency('AED')} style={{ opacity: currency === 'AED' ? .92 : .45 }}>AED</button><span style={{ opacity: .35 }}>|</span><button aria-pressed={currency === 'USD'} onClick={() => chooseCurrency('USD')} style={{ opacity: currency === 'USD' ? .92 : .45 }}>USD</button>{currency === 'USD' && <span style={{ opacity: .42 }}>Indicative</span>}</div></div>
    </section>
    {visible.length === 0 && <div role="status" className="px-6 md:px-12 py-16 max-w-[1440px] mx-auto"><p className="font-display text-2xl">New objects are in development.</p><p className="font-sans mt-3">Explore the current collection while the next objects take shape.</p><button className="review-link mt-5" onClick={() => setCategory('All')}>View all products →</button></div>}
    <section className="px-6 md:px-12 py-8 md:py-12"><div className="max-w-[1440px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-7 gap-y-12">{visible.map(product => <Link key={product.id} href={`/shop/${product.slug}`} className="group" style={{ color: 'inherit', textDecoration: 'none' }}><div className="relative overflow-hidden" style={{ aspectRatio: '4 / 5', background: 'rgba(26,23,20,.05)' }}>{product.images[0] ? <Image src={product.images[0].src} alt={product.images[0].alt} fill className="object-cover transition-transform duration-500 group-hover:scale-[1.015]" sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw" /> : <div className="h-full flex items-end p-6 font-sans uppercase tracking-[.16em]" style={{ fontSize: '.625rem', opacity: .45 }}>Image forthcoming</div>}</div><div className="pt-5 flex justify-between gap-4"><div><p className="font-sans uppercase tracking-[.14em]" style={{ fontSize: '.625rem', opacity: .48 }}>{product.category} · {statusLabel(product)}</p><h2 className="font-display mt-2" style={{ fontSize: '1.7rem', lineHeight: 1 }}>{product.name}</h2><p className="font-sans mt-2" style={{ fontSize: '.78rem', opacity: .55 }}>{product.subtitle}</p></div><p className="font-sans text-right shrink-0" style={{ fontSize: '.75rem', opacity: .65 }}>{productPriceLabel(product, currency)}</p></div></Link>)}</div></section>
  </>
}
