import { NextResponse } from 'next/server'
import { readGuideToken } from '@/lib/guideLink'
import { growLeadExists } from '@/lib/leads'
import { getAllowedOriginHosts, isLocalDevelopmentHost } from '@/lib/site'

// Opens the /grow guide for an existing subscriber from the emailed link.
// Read-only: never creates a lead and never sends or schedules email.

function json(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' } })
}

function isAllowedOrigin(req: Request) {
  const origin = req.headers.get('origin')
  const requestHost = new URL(req.url).host
  if (!origin) return process.env.NODE_ENV !== 'production'
  try {
    const originHost = new URL(origin).host
    if (originHost === requestHost) return true
    if (isLocalDevelopmentHost(originHost) && isLocalDevelopmentHost(requestHost)) return true
    return getAllowedOriginHosts().has(originHost)
  } catch {
    return false
  }
}

export async function POST(req: Request) {
  if (!isAllowedOrigin(req)) return json({ error: 'Forbidden' }, 403)
  const body = await req.json().catch(() => null)
  const email = readGuideToken(typeof body?.token === 'string' ? body.token : '')
  if (!email) return json({ error: 'Invalid link' }, 400)
  if (!(await growLeadExists(email))) return json({ error: 'Unknown subscriber' }, 404)
  return json({ ok: true, email })
}
