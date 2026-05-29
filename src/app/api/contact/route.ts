import { randomUUID } from 'crypto'
import { readFileSync } from 'fs'
import { join } from 'path'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { getAllowedOriginHosts, isLocalDevelopmentHost } from '@/lib/site'

const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL || 'andy@numu.bio'
const CONTACT_BCC_EMAIL = process.env.CONTACT_BCC_EMAIL || ''
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'NUMU Website <notifications@numu.bio>'
const FOUNDER_FROM_EMAIL = process.env.FOUNDER_FROM_EMAIL || 'Andy Cartier — NUMU <andy@numu.bio>'

const DECK_FILENAME = 'NUMU_Investor_Deck_FINAL.pdf'

const REQUEST_META = {
  investor_deck: {
    subject: 'New deck request — NUMU',
    heading: 'New deck request',
    followUp: 'Deck sent automatically. Reply directly to continue the conversation.',
  },
  project: {
    subject: 'New project inquiry — NUMU',
    heading: 'New project inquiry',
    followUp: 'Reply directly to continue the project conversation.',
  },
  samples: {
    subject: 'New samples request — NUMU',
    heading: 'New samples request',
    followUp: 'Reply directly with sample and specification next steps.',
  },
} as const

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const RATE_LIMIT_MAX_REQUESTS = 5
const MAX_CONTENT_LENGTH = 8_192

type RateBucket = {
  count: number
  resetAt: number
}

const globalRateLimitStore = globalThis as typeof globalThis & {
  __numuContactRateLimit?: Map<string, RateBucket>
}

const contactRateLimit = globalRateLimitStore.__numuContactRateLimit ?? new Map<string, RateBucket>()
globalRateLimitStore.__numuContactRateLimit = contactRateLimit

function getResend() {
  return new Resend(process.env.RESEND_API_KEY)
}

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
  if (forwardedFor) return forwardedFor.split(',')[0]?.trim() || 'unknown'
  return req.headers.get('x-real-ip') || 'unknown'
}

function extractRequestHost(req: Request) {
  const candidates = [req.headers.get('origin'), req.headers.get('referer')]
  for (const candidate of candidates) {
    if (!candidate) continue
    try { return new URL(candidate).host } catch { continue }
  }
  return null
}

function isAllowedSubmissionOrigin(req: Request) {
  const originHost = extractRequestHost(req)
  const requestHost = new URL(req.url).host

  if (!originHost) return process.env.NODE_ENV !== 'production'
  if (originHost === requestHost) return true
  if (isLocalDevelopmentHost(originHost) && isLocalDevelopmentHost(requestHost)) return true
  return getAllowedOriginHosts().has(originHost)
}

function takeRateLimit(key: string) {
  const now = Date.now()
  for (const [storedKey, bucket] of contactRateLimit) {
    if (bucket.resetAt <= now) contactRateLimit.delete(storedKey)
  }
  const current = contactRateLimit.get(key)
  if (!current) {
    const next = { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS }
    contactRateLimit.set(key, next)
    return { allowed: true, resetAt: next.resetAt }
  }
  if (current.count >= RATE_LIMIT_MAX_REQUESTS) return { allowed: false, resetAt: current.resetAt }
  current.count += 1
  contactRateLimit.set(key, current)
  return { allowed: true, resetAt: current.resetAt }
}

function sanitizeSourceTag(source?: string) {
  const fallback = 'direct'
  if (!source) return fallback
  const cleaned = source.toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '')
  return cleaned || fallback
}

function loadDeckAttachment(): { content: string; filename: string } | null {
  try {
    const filePath = join(process.cwd(), 'exports', DECK_FILENAME)
    const content = readFileSync(filePath).toString('base64')
    return { content, filename: DECK_FILENAME }
  } catch {
    return null
  }
}

function deckEmailHtml(recipientEmail: string) {
  return `
    <div style="font-family:Georgia,serif;color:#1a1714;max-width:520px;line-height:1.7;">
      <p style="margin:0 0 20px;">Thank you for your interest in NUMU.</p>
      <p style="margin:0 0 20px;">Please find our investor deck attached. It covers the material platform, current traction, and the raise we are running — a $600K SAFE to build the first certified bio-composite manufacturing system in the GCC.</p>
      <p style="margin:0 0 20px;">If the opportunity is relevant to you, I would be glad to schedule a 30-minute call to walk through the details and answer any questions directly.</p>
      <p style="margin:0 0 4px;">Looking forward to connecting.</p>
      <p style="margin:0 0 32px;">Andy</p>
      <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;color:#6f6458;border-top:1px solid #e8e4da;padding-top:16px;">
        Andy Cartier — Founder &amp; CEO<br>
        NUMU · Bio-composites platform · Dubai, UAE<br>
        <a href="mailto:andy@numu.bio" style="color:#6f6458;">andy@numu.bio</a>
      </p>
    </div>
  `
}

function deckEmailText(recipientEmail: string) {
  return `Thank you for your interest in NUMU.

Please find our investor deck attached. It covers the material platform, current traction, and the raise we are running — a $600K SAFE to build the first certified bio-composite manufacturing system in the GCC.

If the opportunity is relevant to you, I would be glad to schedule a 30-minute call to walk through the details and answer any questions directly.

Looking forward to connecting.

Andy

—
Andy Cartier — Founder & CEO
NUMU · Bio-composites platform · Dubai, UAE
andy@numu.bio`
}

export async function POST(req: Request) {
  if (!isAllowedSubmissionOrigin(req)) return json({ error: 'Forbidden' }, 403)

  const contentLength = Number(req.headers.get('content-length') ?? '0')
  const contentType = req.headers.get('content-type') ?? ''

  if (contentLength > MAX_CONTENT_LENGTH || !contentType.includes('application/json')) {
    return json({ error: 'Invalid request' }, 400)
  }

  const rateLimitKey = `${getClientIp(req)}:${req.headers.get('user-agent') ?? 'unknown'}`
  const rateLimit = takeRateLimit(rateLimitKey)

  if (!rateLimit.allowed) {
    const retryAfterSeconds = Math.max(1, Math.ceil((rateLimit.resetAt - Date.now()) / 1000))
    return NextResponse.json(
      { error: 'Too many requests' },
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
  if (!body || typeof body !== 'object') return json({ error: 'Invalid request' }, 400)

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const website = typeof body.website === 'string' ? body.website.trim() : ''
  const requestType = typeof body.requestType === 'string' ? body.requestType : 'project'
  const source = typeof body.source === 'string' ? body.source.trim() : ''

  if (website.length > 0) return json({ ok: true }) // honeypot

  if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: 'Invalid email' }, 400)
  }

  if (source.length > 120) return json({ error: 'Invalid source' }, 400)

  const meta = REQUEST_META[requestType as keyof typeof REQUEST_META]
  if (!meta) return json({ error: 'Invalid request type' }, 400)

  if (!process.env.RESEND_API_KEY) return json({ error: 'Email service unavailable' }, 503)

  const resend = getResend()
  const messageId = randomUUID()
  const sourceTag = sanitizeSourceTag(source)
  const timestamp = new Date().toUTCString()

  try {
    if (requestType === 'investor_deck') {
      const attachment = loadDeckAttachment()

      // Notification to Andy
      await resend.emails.send({
        from: RESEND_FROM_EMAIL,
        to: [CONTACT_TO_EMAIL],
        ...(CONTACT_BCC_EMAIL ? { bcc: [CONTACT_BCC_EMAIL] } : {}),
        replyTo: email,
        subject: `Deck requested — ${email}`,
        text: `Deck request\n\nFrom: ${email}\nSource: ${source || 'direct'}\nTime: ${timestamp}\n\nDeck ${attachment ? 'sent automatically' : 'FAILED TO ATTACH — send manually'}.`,
        html: `
          <div style="font-family:Arial,sans-serif;color:#1a1714;">
            <p style="margin:0 0 16px;font-size:15px;"><strong>Deck requested</strong></p>
            <table style="border-collapse:collapse;font-size:13px;">
              <tr><td style="padding:4px 16px 4px 0;opacity:0.5;">From</td><td><a href="mailto:${email}">${email}</a></td></tr>
              <tr><td style="padding:4px 16px 4px 0;opacity:0.5;">Source</td><td>${source || 'direct'}</td></tr>
              <tr><td style="padding:4px 16px 4px 0;opacity:0.5;">Time</td><td>${timestamp}</td></tr>
              <tr><td style="padding:4px 16px 4px 0;opacity:0.5;">Deck</td><td style="color:${attachment ? '#2a7a2a' : '#c0392b'};">${attachment ? 'Sent automatically ✓' : 'FAILED — send manually'}</td></tr>
            </table>
          </div>
        `,
        headers: { 'X-Entity-Ref-ID': messageId, 'X-Auto-Response-Suppress': 'OOF, AutoReply' },
        tags: [{ name: 'request_type', value: 'investor_deck' }, { name: 'source', value: sourceTag }],
      })

      // Deck to requester
      if (attachment) {
        await resend.emails.send({
          from: FOUNDER_FROM_EMAIL,
          to: [email],
          replyTo: CONTACT_TO_EMAIL,
          subject: 'NUMU — Investor Deck',
          text: deckEmailText(email),
          html: deckEmailHtml(email),
          attachments: [{ content: attachment.content, filename: attachment.filename }],
          headers: { 'X-Entity-Ref-ID': randomUUID(), 'X-Auto-Response-Suppress': 'OOF, AutoReply' },
          tags: [{ name: 'request_type', value: 'investor_deck_outbound' }, { name: 'source', value: sourceTag }],
        })
      }
    } else {
      // Standard notification for project / samples
      await resend.emails.send({
        from: RESEND_FROM_EMAIL,
        to: [CONTACT_TO_EMAIL],
        ...(CONTACT_BCC_EMAIL ? { bcc: [CONTACT_BCC_EMAIL] } : {}),
        replyTo: email,
        subject: meta.subject,
        text: `${meta.heading}\n\nFrom: ${email}\nType: ${requestType}\nSource: ${source || 'direct'}\n\n${meta.followUp}`,
        html: `
          <div style="font-family:Arial,Helvetica,sans-serif;color:#1a1714;">
            <p style="margin:0 0 16px;"><strong>${meta.heading}</strong></p>
            <p style="margin:0 0 8px;">From: <a href="mailto:${email}">${email}</a></p>
            <p style="margin:0 0 8px;">Type: ${requestType}</p>
            <p style="margin:0 0 16px;">Source: ${source || 'direct'}</p>
            <p style="margin:0;color:#6f6458;">${meta.followUp}</p>
          </div>
        `,
        headers: { 'X-Entity-Ref-ID': messageId, 'X-Auto-Response-Suppress': 'OOF, AutoReply' },
        tags: [{ name: 'request_type', value: requestType }, { name: 'source', value: sourceTag }],
      })
    }

    return json({ ok: true })
  } catch {
    return json({ error: 'Failed to send' }, 500)
  }
}
