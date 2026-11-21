import { createHash, createHmac, timingSafeEqual } from 'crypto'

// Signed links that let an existing subscriber reopen the /grow guide on any device
// without signing up again. The token carries the email and an HMAC; nothing is stored.

function secret() {
  const explicit = process.env.GROW_LINK_SECRET
  if (explicit) return explicit
  const base = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!base) return null
  return createHash('sha256').update(`grow-guide-link:${base}`).digest('hex')
}

function sign(email: string, key: string) {
  return createHmac('sha256', key).update(email).digest('base64url').slice(0, 32)
}

export function createGuideToken(email: string): string | null {
  const key = secret()
  if (!key) return null
  return `${Buffer.from(email).toString('base64url')}.${sign(email, key)}`
}

export function readGuideToken(token: string): string | null {
  const key = secret()
  if (!key || typeof token !== 'string' || token.length > 400) return null
  const [encoded, signature] = token.split('.')
  if (!encoded || !signature) return null
  let email: string
  try {
    email = Buffer.from(encoded, 'base64url').toString('utf8')
  } catch {
    return null
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null
  const expected = Buffer.from(sign(email, key))
  const given = Buffer.from(signature)
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null
  return email
}
