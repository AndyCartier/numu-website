'use client'
import type { Product } from '@/lib/commerce/catalogue'

// Actions for bookable experiences (Mycelium Hotline, masterclasses). With a Cal.com link the
// visitor books and pays there; without one, they send a booking request from the form below.
export default function ProductActions({ product }: { product: Product }) {
  if (product.status === 'coming_soon') return <a href="#inquiry" className="shop-cta">{product.inquiry?.cta || 'Register interest'} →</a>
  if (product.transactionMode === 'booking' && product.bookingUrl) return <a href={product.bookingUrl} target="_blank" rel="noreferrer" className="shop-cta">Book on Cal.com →</a>
  return <a href="#inquiry" className="shop-cta">{product.inquiry?.cta || 'Request a session'} →</a>
}
