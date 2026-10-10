'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { SubpageNav } from '@/components/SubpageNav'
import { useCart } from '@/components/shop/CartProvider'
import { getProduct } from '@/lib/commerce/catalogue'

function InquiryForm() {
  const params = useSearchParams()
  const product = getProduct(params.get('product') || '')
  const { lines } = useCart()
  const cartRequest = params.get('cart') === '1'
  const project = params.get('type') === 'project'
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === 'sending') return
    setStatus('sending')
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries())
    try {
    const result = await fetch('/api/shop/inquiry', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...payload, cartLines: cartRequest ? lines : undefined, kind: project ? 'project' : 'international', productId: product?.id, productName: product?.name, slug: product?.slug, sourcePage: window.location.href }) })
    setStatus(result.ok ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }
  return <section className="px-6 md:px-12 py-16 md:py-24"><div className="max-w-[760px] mx-auto"><p className="font-sans uppercase tracking-[.18em]" style={{ fontSize: '.6875rem', opacity: .52 }}>NUMU / Shop</p><h1 className="font-display mt-5" style={{ fontSize: 'clamp(3.5rem,8vw,7rem)', lineHeight: '.85', letterSpacing: '-.05em' }}>{project ? 'Start a project.' : 'Order outside the GCC.'}</h1><p className="font-sans mt-7 leading-[1.8]" style={{ opacity: .64 }}>{product ? `${product.name} is held with this request.` : 'Tell us what you are considering and we will return with the appropriate order or shipping route.'}</p>{status === 'sent' ? <p role="status" className="font-display mt-12" style={{ fontSize: '2rem' }}>Thank you. We will be in touch.</p> : <form onSubmit={submit} aria-busy={status === 'sending'} className="mt-12 grid gap-6">{[['name','Name'],['email','Email'],['company','Company / studio'],['country','Country']].map(([name,label]) => <label key={name} className="font-sans" style={{ fontSize: '.75rem' }}>{label}<input required={name === 'name' || name === 'email' || name === 'country'} type={name === 'email' ? 'email' : 'text'} name={name} className="block w-full bg-transparent border-b mt-2 py-3" /></label>)}{project && <><label className="font-sans" style={{ fontSize: '.75rem' }}>Project location<input name="projectLocation" className="block w-full bg-transparent border-b mt-2 py-3" /></label><label className="font-sans" style={{ fontSize: '.75rem' }}>Approximate quantity or area<input name="quantityOrArea" className="block w-full bg-transparent border-b mt-2 py-3" /></label><label className="font-sans" style={{ fontSize: '.75rem' }}>Target date<input name="targetDate" className="block w-full bg-transparent border-b mt-2 py-3" /></label></>}<label className="font-sans" style={{ fontSize: '.75rem' }}>Message <span style={{opacity:.5}}>(optional)</span><textarea name="message" rows={4} className="block w-full bg-transparent border-b mt-2 py-3" /></label><input tabIndex={-1} autoComplete="off" name="website" className="hidden" /><button className="shop-cta justify-self-start" disabled={status === 'sending'}>{status === 'sending' ? 'Sending' : project ? 'Send project inquiry' : 'Send order request'}</button>{status === 'error' && <p role="alert" className="font-sans" style={{ fontSize: '.8rem' }}>Sending is temporarily unavailable. Please try again shortly.</p>}</form>}</div></section>
}

export default function InquiryPage() {
  return <main className="min-h-screen" style={{ background: '#f5f1e8', color: '#1a1714' }}><SubpageNav currentPath="/shop" /><Suspense fallback={<div className="min-h-[50vh]" />}><InquiryForm /></Suspense></main>
}
