export type ConfirmationState = 'paid' | 'pending' | 'unverified'

export async function checkoutConfirmation(sessionId?: string): Promise<ConfirmationState> {
  if (!sessionId || !/^cs_(?:test|live)_[A-Za-z0-9]+$/.test(sessionId) || !process.env.STRIPE_SECRET_KEY) return 'unverified'
  try {
    const response = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`, {
      headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}` },
      cache: 'no-store', signal: AbortSignal.timeout(8000),
    })
    if (!response.ok) return 'unverified'
    const session = await response.json()
    if (session.id !== sessionId || session.mode !== 'payment') return 'unverified'
    return session.status === 'complete' && session.payment_status === 'paid' ? 'paid' : 'pending'
  } catch { return 'unverified' }
}
