import { NextResponse } from 'next/server'
import { getProduct } from '@/lib/commerce/catalogue'
import { GCC_COUNTRIES, shippingRate } from '@/lib/commerce/shipping'

type RequestLine = { productId?: string; variantId?: string; quantity?: number }
// Stripe Checkout is created through Stripe's REST API so the storefront has no payment SDK or secret in its client bundle.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null) as { lines?: RequestLine[]; country?: string; method?: string } | null
  if (!body || !Array.isArray(body.lines) || !body.lines.length || body.lines.length > 20) return NextResponse.json({ error: 'Invalid cart' }, { status: 400 })
  const country = String(body.country || '')
  if (!GCC_COUNTRIES.includes(country as typeof GCC_COUNTRIES[number])) return NextResponse.json({ error: 'International checkout is not enabled. Use an order request.' }, { status: 400 })
  const products = body.lines.map((line) => ({ line, product: getProduct(String(line.productId || '')) })).filter((entry): entry is { line: RequestLine; product: NonNullable<ReturnType<typeof getProduct>> } => !!entry.product)
  if (products.length !== body.lines.length) return NextResponse.json({ error: 'A product is no longer available.' }, { status: 400 })
  for (const { line, product } of products) {
    if (!Number.isInteger(line.quantity) || !line.quantity || line.quantity < 1 || line.quantity > 10) return NextResponse.json({ error: 'Invalid quantity' }, { status: 400 })
    if (!['purchase', 'made_to_order'].includes(product.transactionMode) || product.status === 'draft' || product.status === 'sold' || product.priceAed === undefined || !product.stripePriceId) return NextResponse.json({ error: `${product.name} is not configured for checkout.` }, { status: 409 })
    if (line.variantId && !product.variants?.some(v => v.id === line.variantId && v.available !== false)) return NextResponse.json({ error: 'Invalid configuration' }, { status: 400 })
    if (country !== 'United Arab Emirates' && !product.gccShippingEligible) return NextResponse.json({ error: `${product.name} is not enabled for GCC delivery.` }, { status: 409 })
  }
  let shipping = 0
  if (body.method === 'pickup') { if (country !== 'United Arab Emirates' || products.some(({ product }) => !product.pickupEligible)) return NextResponse.json({ error: 'Pickup is not available for this selection.' }, { status: 409 }) }
  else { for (const { product } of products) { if (!product.shippingClass) return NextResponse.json({ error: `${product.name} needs a shipping class.` }, { status: 409 }); const rate = shippingRate(country as typeof GCC_COUNTRIES[number], product.shippingClass); if (rate === undefined) return NextResponse.json({ error: 'Courier rates have not been configured for this selection.' }, { status: 409 }); shipping += rate } }
  if (!process.env.STRIPE_SECRET_KEY) return NextResponse.json({ error: 'Stripe is not configured. Add STRIPE_SECRET_KEY before enabling checkout.' }, { status: 503 })
  const origin = new URL(req.url).origin; const form = new URLSearchParams({ mode: 'payment', success_url: `${origin}/shop/success?session_id={CHECKOUT_SESSION_ID}`, cancel_url: `${origin}/shop/cart`, 'metadata[shipping_method]': body.method === 'pickup' ? 'pickup' : 'delivery', 'metadata[destination_country]': country })
  if (body.method !== 'pickup') ['AE', 'SA', 'QA', 'KW', 'BH', 'OM'].forEach((code, index) => form.set(`shipping_address_collection[allowed_countries][${index}]`, code))
  products.forEach(({ line, product }, index) => { form.set(`line_items[${index}][price]`, product.stripePriceId!); form.set(`line_items[${index}][quantity]`, String(line.quantity)); form.set(`metadata[item_${index}]`, `${product.id}:${line.variantId || 'default'}:${line.quantity}`) })
  if (shipping) { const index = products.length; form.set(`line_items[${index}][price_data][currency]`, 'aed'); form.set(`line_items[${index}][price_data][product_data][name]`, 'Delivery'); form.set(`line_items[${index}][price_data][unit_amount]`, String(shipping)); form.set(`line_items[${index}][quantity]`, '1') }
  const response = await fetch('https://api.stripe.com/v1/checkout/sessions', { method: 'POST', headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`, 'Content-Type': 'application/x-www-form-urlencoded' }, body: form })
  if (!response.ok) return NextResponse.json({ error: 'Unable to start checkout.' }, { status: 502 })
  const session = await response.json() as { url?: string; id?: string }
  if (!session.url) return NextResponse.json({ error: 'Unable to start checkout.' }, { status: 502 })
  // Payment/order truth belongs to a Stripe webhook. Add durable order storage there when infrastructure is selected.
  return NextResponse.json({ url: session.url, sessionId: session.id })
}
