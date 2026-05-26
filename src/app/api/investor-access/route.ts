import { NextRequest, NextResponse } from 'next/server'
import {
  createInvestorAccessToken,
  hasInvestorAccessConfigured,
  hasValidInvestorAccessToken,
  INVESTOR_ACCESS_COOKIE,
  isValidInvestorCode,
} from '@/lib/investorAccess'
import { getAllowedOriginHosts, isLocalDevelopmentHost } from '@/lib/site'

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const RATE_LIMIT_MAX_REQUESTS = 10

type RateBucket = {
  count: number
  resetAt: number
}

const globalRateLimitStore = globalThis as typeof globalThis & {
  __numuInvestorRateLimit?: Map<string, RateBucket>
}

const investorRateLimit = globalRateLimitStore.__numuInvestorRateLimit ?? new Map<string, RateBucket>()
globalRateLimitStore.__numuInvestorRateLimit = investorRateLimit

function json(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  })
}

function getClientIp(req: Request) {
  const forwardedFor = req.headers.get('x-forwarded-for')

  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown'
  }

  return req.headers.get('x-real-ip') || 'unknown'
}

function extractRequestHost(req: Request) {
  const candidates = [req.headers.get('origin'), req.headers.get('referer')]

  for (const candidate of candidates) {
    if (!candidate) continue

    try {
      return new URL(candidate).host
    } catch {
      continue
    }
  }

  return null
}

function isAllowedOrigin(req: Request) {
  const originHost = extractRequestHost(req)
  const requestHost = new URL(req.url).host

  if (!originHost) {
    return process.env.NODE_ENV !== 'production'
  }

  if (originHost === requestHost) {
    return true
  }

  if (isLocalDevelopmentHost(originHost) && isLocalDevelopmentHost(requestHost)) {
    return true
  }

  return getAllowedOriginHosts().has(originHost)
}

function takeRateLimit(key: string) {
  const now = Date.now()

  for (const [storedKey, bucket] of investorRateLimit) {
    if (bucket.resetAt <= now) {
      investorRateLimit.delete(storedKey)
    }
  }

  const current = investorRateLimit.get(key)

  if (!current) {
    const next = { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS }
    investorRateLimit.set(key, next)
    return { allowed: true, resetAt: next.resetAt }
  }

  if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, resetAt: current.resetAt }
  }

  current.count += 1
  investorRateLimit.set(key, current)
  return { allowed: true, resetAt: current.resetAt }
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get(INVESTOR_ACCESS_COOKIE)?.value

  if (!hasValidInvestorAccessToken(token)) {
    return json({ ok: false })
  }

  return json({ ok: true })
}

export async function POST(req: NextRequest) {
  if (!hasInvestorAccessConfigured()) {
    return json({ error: 'Investor access is unavailable' }, 503)
  }

  if (!isAllowedOrigin(req)) {
    return json({ error: 'Forbidden' }, 403)
  }

  const rateLimit = takeRateLimit(`${getClientIp(req)}:${req.headers.get('user-agent') ?? 'unknown'}`)

  if (!rateLimit.allowed) {
    const retryAfterSeconds = Math.max(1, Math.ceil((rateLimit.resetAt - Date.now()) / 1000))

    return NextResponse.json(
      { error: 'Too many attempts' },
      {
        status: 429,
        headers: {
          'Cache-Control': 'no-store',
          'Retry-After': String(retryAfterSeconds),
          'X-Robots-Tag': 'noindex, nofollow',
        },
      },
    )
  }

  const body = await req.json().catch(() => null)
  const code = typeof body?.code === 'string' ? body.code.trim() : ''

  if (!code || !isValidInvestorCode(code)) {
    return json({ error: 'Invalid access code' }, 401)
  }

  const response = json({ ok: true })

  response.cookies.set({
    name: INVESTOR_ACCESS_COOKIE,
    value: createInvestorAccessToken(),
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: COOKIE_MAX_AGE,
  })

  return response
}

export async function DELETE() {
  const response = json({ ok: true })

  response.cookies.set({
    name: INVESTOR_ACCESS_COOKIE,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: new Date(0),
  })

  return response
}
