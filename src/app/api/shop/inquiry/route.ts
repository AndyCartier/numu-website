import { normalizeCart } from '@/lib/commerce/cart'
import { getProduct } from '@/lib/commerce/catalogue'
import { randomUUID } from 'crypto'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { buildAbsoluteUrl, getAllowedOriginHosts, isLocalDevelopmentHost } from '@/lib/site'

const MAX = 8_192
const KINDS = ['international', 'project', 'product'] as const
type Kind = typeof KINDS[number]
const SUBJECT: Record<Kind, string> = { international: 'International order inquiry', project: 'Project inquiry', product: 'Product inquiry' }

// Same lightweight per-instance limit as /api/contact.
const WINDOW_MS = 10 * 60 * 1000
const MAX_REQUESTS = 5
const store = globalThis as typeof globalThis & { __numuInquiryRateLimit?: Map<string, { count: number; resetAt: number }> }
const buckets = store.__numuInquiryRateLimit ?? new Map<string, { count: number; resetAt: number }>()
store.__numuInquiryRateLimit = buckets
function limited(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown'
  const now = Date.now()
  const bucket = buckets.get(ip)
  if (!bucket || bucket.resetAt < now) { buckets.set(ip, { count: 1, resetAt: now + WINDOW_MS }); return false }
  bucket.count += 1
  return bucket.count > MAX_REQUESTS
}

function allowed(req: Request) {
  const origin = req.headers.get('origin')
  if (!origin) return process.env.NODE_ENV !== 'production'
  try {
    const source = new URL(origin).host
    const request = new URL(req.url).host
    return source === request || (isLocalDevelopmentHost(source) && isLocalDevelopmentHost(request)) || getAllowedOriginHosts().has(source)
  } catch { return false }
}

const value = (input: unknown, limit = 500) => typeof input === 'string' ? input.trim().slice(0, limit) : ''
const json = (body: Record<string, unknown>, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' } })

export async function POST(req: Request) {
  if (!allowed(req)) return json({ error: 'Forbidden' }, 403)
  if (Number(req.headers.get('content-length') || 0) > MAX) return json({ error: 'Invalid request' }, 400)
  const body = await req.json().catch(() => null)
  if (!body || body.website || !KINDS.includes(body.kind)) return json({ error: 'Invalid request' }, 400)
  const kind = body.kind as Kind
  const name = value(body.name, 120), email = value(body.email, 254), country = value(body.country, 120), message = value(body.message, 2000)
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: 'Please provide your name and a valid email address.' }, 400)
  if (kind === 'international' && !country) return json({ error: 'Please provide a name, email, and country.' }, 400)
  if (kind === 'product' && !message) return json({ error: 'Please add a short message so we can answer properly.' }, 400)
  if (limited(req)) return json({ error: 'Too many requests. Please try again shortly.' }, 429)
  if (!process.env.RESEND_API_KEY) return json({ error: 'Email service unavailable' }, 503)

  // Product identity is resolved from the catalogue, not trusted from the browser.
  const product = getProduct(value(body.slug) || value(body.productId))
  const productName = product?.name || value(body.productName)
  const productUrl = product ? buildAbsoluteUrl(`/shop/${product.slug}`).toString() : ''
  const fields = [
    ['Product', productName], ['Product page', productUrl], ['Option', value(body.variant, 120)],
    ['Name', name], ['Email', email], ['Country', country], ['Company', value(body.company)],
    ['Project type', value(body.projectType, 60)], ['Project location', value(body.projectLocation)],
    ['Quantity / area', value(body.quantityOrArea)], ['Target date', value(body.targetDate)], ['Message', message],
    ['Product ID', product?.id || value(body.productId)],
    ['Cart selection', normalizeCart(body.cartLines).map(line => `${getProduct(line.productId)?.name} / ${line.variantId || 'standard'} × ${line.quantity}`).join('; ')],
    ['Submitted from', value(body.sourcePage, 1000)], ['Time', new Date().toUTCString()],
  ].filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join('\n')

  try {
    const result = await new Resend(process.env.RESEND_API_KEY).emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'NUMU Website <notifications@numu.bio>',
      to: [process.env.ORDER_NOTIFICATION_EMAIL || process.env.CONTACT_TO_EMAIL || 'andy@numu.bio'],
      replyTo: email,
      subject: `${product?.category === 'Experiences' ? (product.status === 'coming_soon' ? 'Interest registration' : 'Session booking request') : SUBJECT[kind]} — ${productName || name}`,
      text: fields,
      headers: { 'X-Entity-Ref-ID': randomUUID() },
      tags: [{ name: 'request_type', value: `shop_${kind}` }],
    })
    if (result.error) return json({ error: 'Failed to send' }, 502)
    return json({ ok: true })
  } catch { return json({ error: 'Failed to send' }, 500) }
}
