export const AED_PER_USD = 3.6725

export function formatMoney(aedFils: number, currency: 'AED' | 'USD' = 'AED') {
  const aed = aedFils / 100
  if (currency === 'AED') return `AED ${aed.toLocaleString('en-AE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
  return `USD ${(aed / AED_PER_USD).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

// The catalogue is inquiry-only: every physical product reads "Price on request", whatever data it holds.
// Experiences (Mycelium Hotline, masterclasses) keep their own booking and payment flow.
export function productPriceLabel(product: { category?: string; bookingUrl?: string; status?: string }) {
  if (product.category === 'Experiences') {
    if (product.status === 'coming_soon') return 'Dates to be announced'
    return product.bookingUrl ? 'Book online' : 'Booking on request'
  }
  return 'Price on request'
}
