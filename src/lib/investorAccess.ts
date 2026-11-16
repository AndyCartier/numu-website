import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto'

export const INVESTOR_ACCESS_COOKIE = 'numu_investor_access'
export const INVESTOR_SESSION_SECONDS = 8 * 60 * 60

function credentials() {
  const password = process.env.INVESTOR_PASSWORD
  const signingKey = process.env.INVESTOR_ACCESS_SECRET
  return password && signingKey && signingKey.length >= 32 && password !== signingKey
    ? { password, signingKey }
    : null
}

export function hasInvestorAccessConfigured() {
  return credentials() !== null
}

const digest = (value: string) => createHash('sha256').update(value).digest()

export function isValidInvestorCode(code: string) {
  const config = credentials()
  return !!config && timingSafeEqual(digest(code), digest(config.password))
}

function sign(session: string, config: NonNullable<ReturnType<typeof credentials>>) {
  return createHmac('sha256', config.signingKey)
    .update('numu-investor:v2:')
    .update(digest(config.password))
    .update(session)
    .digest('hex')
}

export function createInvestorAccessToken(now = Date.now()) {
  const config = credentials()
  if (!config) return null
  const session = `${Math.floor(now / 1000) + INVESTOR_SESSION_SECONDS}.${randomBytes(16).toString('hex')}`
  return `${session}.${sign(session, config)}`
}

export function hasValidInvestorAccessToken(token?: string, now = Date.now()) {
  const config = credentials()
  const parts = token?.match(/^(\d{1,12})\.([a-f0-9]{32})\.([a-f0-9]{64})$/)
  if (!config || !parts) return false

  const [, expires, nonce, signature] = parts
  const remaining = Number(expires) - Math.floor(now / 1000)
  return remaining > 0 && remaining <= INVESTOR_SESSION_SECONDS &&
    timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(sign(`${expires}.${nonce}`, config), 'hex'))
}

export const investorPrivateHeaders = {
  'Cache-Control': 'private, no-store, max-age=0',
  'X-Robots-Tag': 'noindex, nofollow',
}
