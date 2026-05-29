import { createHmac, timingSafeEqual } from 'crypto'

export const INVESTOR_ACCESS_COOKIE = 'numu_investor_access'

function getCookieSecret() {
  return (
    process.env.INVESTOR_ACCESS_SECRET ??
    process.env.INVESTOR_PASSWORD ??
    process.env.NEXT_PUBLIC_INVESTOR_PASSWORD ?? // rename to INVESTOR_PASSWORD on Vercel before deploy
    ''
  )
}

export function hasInvestorAccessConfigured() {
  return getCookieSecret().length > 0
}

export function createInvestorAccessToken() {
  const secret = getCookieSecret()

  if (!secret) {
    return ''
  }

  return createHmac('sha256', secret)
    .update('numu-investor-access:v1')
    .digest('hex')
}

export function isValidInvestorCode(code: string) {
  const expected = getCookieSecret()

  if (!expected || code.length !== expected.length) {
    return false
  }

  return timingSafeEqual(Buffer.from(code), Buffer.from(expected))
}

export function hasValidInvestorAccessToken(token?: string | null) {
  const expected = createInvestorAccessToken()

  if (!token || !expected || token.length !== expected.length) {
    return false
  }

  return timingSafeEqual(Buffer.from(token), Buffer.from(expected))
}
