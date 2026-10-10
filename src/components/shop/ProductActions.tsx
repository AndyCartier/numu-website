'use client'
import Link from 'next/link'
import type { Product } from '@/lib/commerce/catalogue'

// Actions for bookable experiences (Mycelium Hotline, masterclasses). Physical products are
// inquiry-only and use ProductInquiry on their detail page; the cart is no longer offered.
export default function ProductActions({ product }: { product: Product }) {
  if (product.status === 'coming_soon') return <p className="font-sans uppercase tracking-[.14em]" style={{ fontSize: '.6875rem', opacity: .6 }}>Registration will open when details are confirmed.</p>
  if (product.transactionMode === 'booking' && product.bookingUrl) return <a href={product.bookingUrl} target="_blank" rel="noreferrer" className="shop-cta">Book a session →</a>
  return <div><p className="font-sans mb-4" style={{ fontSize: '.85rem', lineHeight: 1.6 }}>Online booking will open when session availability is confirmed.</p><Link href={`/shop/international?product=${product.slug}&type=project`} className="shop-cta">Ask about a session</Link></div>
}
