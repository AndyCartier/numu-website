'use client'

import Link from 'next/link'
import { readCart, normalizeCart } from '@/lib/commerce/cart'
import { useEffect, useState } from 'react'

export default function CartLink() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const read = (event?: Event) => {
      const lines = event instanceof CustomEvent ? normalizeCart(event.detail) : readCart()
      setCount(lines.reduce((total, item) => total + item.quantity, 0))
    }
    read()
    window.addEventListener('storage', read)
    window.addEventListener('numu-cart-change', read)
    return () => { window.removeEventListener('storage', read); window.removeEventListener('numu-cart-change', read) }
  }, [])

  return <Link href="/shop/cart" className="font-sans uppercase tracking-[0.14em]" style={{ fontSize: '0.6875rem', color: 'inherit', opacity: 0.72, textDecoration: 'none' }}>Cart{count ? ` · ${count}` : ''}</Link>
}
