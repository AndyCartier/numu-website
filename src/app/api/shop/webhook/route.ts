import { createHmac, timingSafeEqual } from 'crypto'
import { NextResponse } from 'next/server'

function signatureIsValid(payload: string, signature: string, secret: string) {
  const parts = Object.fromEntries(signature.split(',').map(part => part.split('=', 2)))
  if (!parts.t || !parts.v1) return false
  const expected = createHmac('sha256', secret).update(`${parts.t}.${payload}`).digest('hex')
  try { return timingSafeEqual(Buffer.from(expected), Buffer.from(parts.v1)) } catch { return false }
}

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) return NextResponse.json({ error: 'Webhook is not configured.' }, { status: 503 })
  const payload = await req.text()
  const signature = req.headers.get('stripe-signature') || ''
  if (!signatureIsValid(payload, signature, secret)) return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 })
  const event = JSON.parse(payload) as { type?: string; data?: { object?: { id?: string; customer_details?: { email?: string } } } }
  // Deliberately no order is written here: connect a durable OrderStore before production.
  // Handle checkout.session.completed and payment status changes there using the session ID as the idempotency key.
  if (event.type === 'checkout.session.completed') console.info('NUMU shop payment completed', event.data?.object?.id)
  return NextResponse.json({ received: true })
}
