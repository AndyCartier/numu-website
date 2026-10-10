'use client'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { readCart, normalizeCart, cartLineKey, type CartLine } from '@/lib/commerce/cart'
export { cartLineKey }
export type { CartLine }
type CartContext = { lines: CartLine[]; add: (line: CartLine) => void; update: (key: string, quantity: number) => void; remove: (key: string) => void }
const Cart = createContext<CartContext | null>(null)
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([])
  const [ready, setReady] = useState(false)
  useEffect(() => { setLines(readCart()); setReady(true) }, [])
  useEffect(() => {
    if (!ready) return
    try { localStorage.setItem('numu-cart', JSON.stringify(lines)) } catch { /* The current cart still works when storage is unavailable. */ }
    window.dispatchEvent(new CustomEvent('numu-cart-change', { detail: lines }))
  }, [lines, ready])
  const value = useMemo(() => ({
    lines,
    add: (line: CartLine) => setLines(current => normalizeCart([...current, line])),
    update: (lineKey: string, quantity: number) => setLines(current => normalizeCart(current.map(line => cartLineKey(line) === lineKey ? { ...line, quantity } : line))),
    remove: (lineKey: string) => setLines(current => current.filter(line => cartLineKey(line) !== lineKey)),
  }), [lines])
  return <Cart.Provider value={value}>{children}</Cart.Provider>
}
export function useCart() { const context = useContext(Cart); if (!context) throw new Error('CartProvider missing'); return context }
