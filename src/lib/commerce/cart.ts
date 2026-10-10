import { getProduct } from './catalogue'
export type CartLine = { productId: string; variantId?: string; quantity: number }
export const cartLineKey = (line: Pick<CartLine, 'productId' | 'variantId'>) => `${line.productId}:${line.variantId || ''}`

export function normalizeCart(value: unknown): CartLine[] {
  if (!Array.isArray(value)) return []
  const valid: CartLine[] = []
  for (const line of value.slice(0, 20)) {
    if (!line || typeof line.productId !== 'string' || !Number.isInteger(line.quantity) || line.quantity < 1) continue
    const product = getProduct(line.productId)
    if (!product || ['draft', 'archived', 'sold', 'coming_soon'].includes(product.status)) continue
    if (line.variantId !== undefined && (typeof line.variantId !== 'string' || !product.variants?.some(v => v.id === line.variantId && v.available !== false))) continue
    const normalized = { productId: product.id, variantId: line.variantId, quantity: Math.min(10, line.quantity) }
    const previous = valid.find(item => cartLineKey(item) === cartLineKey(normalized))
    if (previous) previous.quantity = Math.min(10, previous.quantity + normalized.quantity)
    else valid.push(normalized)
  }
  return valid
}

export function readCart(): CartLine[] {
  try { return normalizeCart(JSON.parse(localStorage.getItem('numu-cart') || '[]')) } catch { return [] }
}
