export const AED_PER_USD = 3.6725

export function formatMoney(aedFils: number, currency: 'AED' | 'USD' = 'AED') {
  const aed = aedFils / 100
  if (currency === 'AED') return `AED ${aed.toLocaleString('en-AE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
  return `USD ${(aed / AED_PER_USD).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

export function productPriceLabel(product: { priceAed?: number; priceType: 'fixed' | 'from' | 'on_request'; priceUnit?: string }, currency: 'AED' | 'USD') {
  if (product.priceAed === undefined) return 'Price on request'
  const prefix = product.priceType === 'from' ? 'From ' : ''
  return `${prefix}${formatMoney(product.priceAed, currency)}${product.priceUnit ? ` / ${product.priceUnit}` : ''}`
}
