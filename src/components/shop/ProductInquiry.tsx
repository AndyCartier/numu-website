'use client'

import { useId, useState } from 'react'
import type { ProductInquiry as InquiryConfig, ProductVariant } from '@/lib/commerce/catalogue'
import { NUMU_NAP } from '@/lib/siteFacts'

type Props = {
  productId: string
  productName: string
  slug: string
  variants?: ProductVariant[]
  inquiry?: InquiryConfig
  booking?: boolean
}

const PROJECT_TYPES = ['Hospitality', 'Residential', 'Workplace', 'Retail', 'Cultural / gallery', 'Event', 'Private collection', 'Other']

const field = 'block w-full bg-transparent border-b mt-2 py-3 font-sans'
const labelStyle = { fontSize: '.75rem' } as const

// Product-specific inquiry. Posts to the existing Resend-backed /api/shop/inquiry route; if that is
// unavailable the visitor is offered a prefilled email instead. Success is shown only on a 2xx.
export default function ProductInquiry({ productId, productName, slug, variants, inquiry, booking = false }: Props) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [error, setError] = useState('')
  const [fallback, setFallback] = useState('')
  const id = useId()
  const realVariants = variants?.filter(v => v.available !== false) ?? []

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === 'sending') return
    const form = new FormData(event.currentTarget)
    const payload = Object.fromEntries(form.entries()) as Record<string, string>
    const productUrl = window.location.origin + window.location.pathname
    const summary = [
      `Product: ${productName}`,
      payload.variant ? `Option: ${payload.variant}` : '',
      payload.quantityOrArea ? `${inquiry?.quantityLabel || 'Quantity'}: ${payload.quantityOrArea}` : '',
      payload.projectType ? `Project type: ${payload.projectType}` : '',
      payload.projectLocation ? `Project location: ${payload.projectLocation}` : '',
      `Page: ${productUrl}`,
    ].filter(Boolean).concat(['', payload.message || '']).join('\n')
    setFallback(`mailto:${NUMU_NAP.email}?subject=${encodeURIComponent(`Inquiry: ${productName}`)}&body=${encodeURIComponent(`${summary}\n\n${payload.name || ''}`)}`)
    setStatus('sending'); setError('')
    try {
      const response = await fetch('/api/shop/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, kind: 'product', productId, productName, slug, sourcePage: productUrl }),
      })
      if (response.ok) { setStatus('sent'); return }
      const result = await response.json().catch(() => ({}))
      setError(response.status === 400 && typeof result.error === 'string' ? result.error : 'Your message could not be sent from the website just now.')
      setStatus('error')
    } catch {
      setError('Your message could not be sent from the website just now.')
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div role="status" className="py-6">
        <p className="font-display" style={{ fontSize: 'clamp(1.8rem,3vw,2.4rem)', lineHeight: 1.1 }}>Thank you. Your inquiry about {productName} has reached NUMU.</p>
        <p className="font-sans mt-4 leading-[1.7]" style={{ fontSize: '.9rem', opacity: .66 }}>The team in Dubai will reply to the email address you provided.</p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} aria-busy={status === 'sending'} className="grid gap-6" aria-describedby={`${id}-note`}>
      <p className="font-sans uppercase tracking-[.14em]" style={{ fontSize: '.625rem', opacity: .6 }}>{booking ? 'Booking request for' : 'Inquiry for'} <strong style={{ fontWeight: 600 }}>{productName}</strong></p>
      <div className="grid sm:grid-cols-2 gap-6">
        <label className="font-sans" style={labelStyle}>Name<input required name="name" autoComplete="name" maxLength={120} className={field} /></label>
        <label className="font-sans" style={labelStyle}>Email<input required type="email" name="email" autoComplete="email" maxLength={254} className={field} /></label>
      </div>
      {realVariants.length > 1 && (
        <label className="font-sans" style={labelStyle}>Option
          <select name="variant" className={`${field} p-0`} defaultValue={realVariants[0].name}>
            {realVariants.map(v => <option key={v.id} value={v.name}>{v.name}</option>)}
          </select>
        </label>
      )}
      <div className="grid sm:grid-cols-2 gap-6">
        <label className="font-sans" style={labelStyle}>{inquiry?.quantityLabel || 'Quantity'} <span style={{ opacity: .5 }}>(optional)</span><input name="quantityOrArea" maxLength={120} className={field} /></label>
        {inquiry?.projectFields
          ? <label className="font-sans" style={labelStyle}>Project location <span style={{ opacity: .5 }}>(optional)</span><input name="projectLocation" autoComplete="address-level2" maxLength={120} className={field} /></label>
          : <label className="font-sans" style={labelStyle}>Country <span style={{ opacity: .5 }}>(optional)</span><input name="country" autoComplete="country-name" maxLength={120} className={field} /></label>}
      </div>
      {inquiry?.projectFields && (
        <label className="font-sans" style={labelStyle}>Project type <span style={{ opacity: .5 }}>(optional)</span>
          <select name="projectType" className={`${field} p-0`} defaultValue="">
            <option value="">Select</option>
            {PROJECT_TYPES.map(type => <option key={type}>{type}</option>)}
          </select>
        </label>
      )}
      <label className="font-sans" style={labelStyle}>Message<textarea required name="message" rows={4} maxLength={2000} className={field} placeholder="Space, timing, size, finish or any questions" /></label>
      <input tabIndex={-1} autoComplete="off" name="website" className="hidden" aria-hidden="true" />
      <div>
        <button className="shop-cta" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : `${inquiry?.cta || 'Send inquiry'} →`}</button>
        <p id={`${id}-note`} className="font-sans mt-4 leading-[1.6]" style={{ fontSize: '.72rem', opacity: .56 }}>
          {booking ? 'Your request goes directly to the NUMU team. We reply with a booking link and the session fee.' : 'Price on request. Your inquiry goes directly to the NUMU team with this product and page attached.'}
        </p>
      </div>
      {status === 'error' && (
        <div role="alert" className="p-5" style={{ border: '1px solid rgba(128,128,128,.3)' }}>
          <p className="font-sans" style={{ fontSize: '.85rem' }}>{error}</p>
          <p className="font-sans mt-2 leading-[1.6]" style={{ fontSize: '.8rem', opacity: .72 }}>
            Nothing was sent. You can email us directly; your details are already filled in:{' '}
            <a href={fallback} style={{ color: 'inherit', textDecoration: 'underline', textUnderlineOffset: 3 }}>email {NUMU_NAP.email}</a>
          </p>
        </div>
      )}
    </form>
  )
}
