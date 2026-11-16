import { NextRequest, NextResponse } from 'next/server'
import {
  createInvestorAccessToken,
  hasInvestorAccessConfigured,
  investorPrivateHeaders,
  INVESTOR_ACCESS_COOKIE,
  INVESTOR_SESSION_SECONDS,
  isValidInvestorCode,
} from '@/lib/investorAccess'
import { isLocalDevelopmentHost, shouldSecureCookies, SITE_HOST } from '@/lib/site'

export const dynamic = 'force-dynamic'

const WINDOW_MS = 10 * 60 * 1000
const MAX_ATTEMPTS = 10
const attempts = new Map<string, { count: number; expires: number }>()

function allowedOrigin(request: NextRequest) {
  const origin = request.headers.get('origin')
  if (!origin) return false
  try {
    const url = new URL(origin)
    if (isLocalDevelopmentHost(url.host)) {
      return isLocalDevelopmentHost(request.nextUrl.host) && url.origin === request.nextUrl.origin
    }
    return url.protocol === 'https:' &&
      (url.host === request.nextUrl.host || [SITE_HOST, 'numu.bio', 'www.numu.bio'].includes(url.host))
  } catch {
    return false
  }
}

function json(body: Record<string, unknown>, status: number, headers: Record<string, string> = investorPrivateHeaders) {
  return NextResponse.json(body, { status, headers })
}

export async function POST(request: NextRequest) {
  if (!allowedOrigin(request)) return json({ error: 'Forbidden' }, 403)
  if (!hasInvestorAccessConfigured()) return json({ error: 'Investor access is temporarily unavailable.' }, 503)

  const now = Date.now()
  for (const [key, value] of attempts) if (value.expires <= now) attempts.delete(key)
  const ip = request.headers.get('x-vercel-forwarded-for')?.split(',')[0].trim() || 'unknown'
  const bucket = attempts.get(ip) ?? { count: 0, expires: now + WINDOW_MS }
  if (bucket.count >= MAX_ATTEMPTS) {
    return json({ error: 'Too many attempts. Please try again shortly.' }, 429, {
      ...investorPrivateHeaders,
      'Retry-After': String(Math.ceil((bucket.expires - now) / 1000)),
    })
  }

  bucket.count++
  attempts.set(ip, bucket)
  if (Number(request.headers.get('content-length')) > 2048) return json({ error: 'Invalid request' }, 400)
  const body = await request.json().catch(() => null)
  const code = typeof body?.code === 'string' ? body.code : ''
  if (!code || code.length > 256 || !isValidInvestorCode(code)) {
    return json({ error: 'Code not recognised.' }, 401)
  }

  const token = createInvestorAccessToken()
  if (!token) return json({ error: 'Investor access is temporarily unavailable.' }, 503)
  attempts.delete(ip)
  const response = json({ ok: true }, 200)
  response.cookies.set({
    name: INVESTOR_ACCESS_COOKIE,
    value: token,
    httpOnly: true,
    secure: shouldSecureCookies(request),
    sameSite: 'strict',
    path: '/api/investor-content',
    maxAge: INVESTOR_SESSION_SECONDS,
  })
  return response
}
