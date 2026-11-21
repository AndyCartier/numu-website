import { randomUUID } from 'crypto'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { getAllowedOriginHosts, isLocalDevelopmentHost } from '@/lib/site'
import { NOTIFY_FROM, logEmailError, notificationHeaders, notificationHtml } from '@/lib/email'
import { findOrCreateGrowLead, growSequenceSent, recordGrowSequence, recordLead, type LeadSource } from '@/lib/leads'
import { growDelays, growEmailOne, growEmailThree, growEmailTwo, guideUrl, requestAutoReply } from '@/lib/growEmails'
import { createGuideToken } from '@/lib/guideLink'

const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL || 'andy@numu.bio'
const CONTACT_BCC_EMAIL = process.env.CONTACT_BCC_EMAIL || ''
// Notifications to NUMU come from the dedicated sender.
const RESEND_FROM_EMAIL = NOTIFY_FROM
// Emails to visitors (grow sequence, auto-replies) come from Andy, so replies reach him.
const FOUNDER_FROM_EMAIL = process.env.FOUNDER_FROM_EMAIL || 'Andy Cartier — NUMU <andy@numu.bio>'


const REQUEST_META = {
  investor_deck: {
    subject: 'New deck request — NUMU',
    heading: 'New deck request',
    followUp: 'Review this request before sharing investor materials.',
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
  grow_test: {
    subject: 'New growability test sign-up — NUMU',
    heading: 'New growability test sign-up',
    followUp: 'Email 1 sent now; emails 2 and 3 are scheduled.',
  },
} as const

const LEAD_SOURCE: Record<keyof typeof REQUEST_META, LeadSource> = {
  investor_deck: 'website-investor-deck',
  project: 'website-project',
  samples: 'website-samples',
  grow_test: 'website-grow-test',
}

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

// One grow signup per email at a time on this instance, so double submits cannot race.
const growLocks = new Set<string>()

// Grow test signup: success means the lead is saved. Email 1 is sent once; emails 2 and 3
// are scheduled once. Retries and returning visitors never restart the sequence.
async function handleGrowSignup(email: string, source: string) {
  const token = createGuideToken(email)
  if (growLocks.has(email)) return json({ ok: true, emailSent: true, pending: true, token })
  growLocks.add(email)
  try {
    const signupAt = new Date()
    const sourceTag = sanitizeSourceTag(source)
    const lead = await findOrCreateGrowLead(
      email,
      `Website request: grow_test. Page source tag: ${sourceTag}. Submitted ${signupAt.toISOString()}.`,
    )
    if (!lead) return json({ error: 'Could not save your request' }, 503)

    if (!lead.created && (await growSequenceSent(lead.id))) {
      return json({ ok: true, returning: true, emailSent: true, token })
    }
    if (!process.env.RESEND_API_KEY) return json({ ok: true, emailSent: false, token })

    const resend = getResend()
    const delays = growDelays(email)
    const sequence = [
      { email: growEmailOne(guideUrl(token)), sendAt: null, tag: 'grow_email_1' },
      { email: growEmailTwo(), sendAt: new Date(signupAt.getTime() + delays.second), tag: 'grow_email_2' },
      { email: growEmailThree(signupAt), sendAt: new Date(signupAt.getTime() + delays.third), tag: 'grow_email_3' },
    ]
    const outcomes: string[] = []
    let welcomeSent = false
    for (const step of sequence) {
      const result = await resend.emails
        .send({
          from: FOUNDER_FROM_EMAIL,
          to: [email],
          replyTo: CONTACT_TO_EMAIL,
          subject: step.email.subject,
          text: step.email.text,
          html: step.email.html,
          ...(step.sendAt ? { scheduledAt: step.sendAt.toISOString() } : {}),
          headers: { 'X-Entity-Ref-ID': randomUUID() },
          tags: [{ name: 'request_type', value: step.tag }, { name: 'source', value: sourceTag }],
        })
        .catch((e: unknown) => ({ data: null, error: { message: String(e) } }))
      const sent = !result.error
      if (!sent) logEmailError(`grow ${step.tag}`, result.error)
      if (step.tag === 'grow_email_1') welcomeSent = sent
      outcomes.push(`${step.tag} ${sent ? (step.sendAt ? `scheduled ${step.sendAt.toISOString()}` : 'sent') : 'FAILED'}`)
      if (!welcomeSent) break // never schedule follow-ups without the welcome email
    }
    if (welcomeSent) {
      await recordGrowSequence(lead.id, `${outcomes.join('; ')}${delays.fast ? ' (fast test timing)' : ''}`)
    }

    const meta = REQUEST_META.grow_test
    await resend.emails
      .send({
        from: RESEND_FROM_EMAIL,
        to: [CONTACT_TO_EMAIL],
        replyTo: email,
        subject: `Growability test sign-up — ${email}`,
        text: `${meta.heading}\n\nFrom: ${email}\nSource: ${sourceTag}\nTime: ${signupAt.toUTCString()}\nLead saved: yes\nSequence: ${outcomes.join('; ')}`,
        html: notificationHtml(meta.heading, [['From', email], ['Source', sourceTag], ['Lead saved', 'yes'], ['Sequence', outcomes.join('; ')]]),
        headers: notificationHeaders(randomUUID(), 'grow'),
        tags: [{ name: 'request_type', value: 'grow_test' }, { name: 'source', value: sourceTag }],
      })
      .catch(() => undefined)

    return json({ ok: true, emailSent: welcomeSent, token })
  } finally {
    growLocks.delete(email)
  }
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

  if (!Object.hasOwn(REQUEST_META, requestType)) return json({ error: 'Invalid request type' }, 400)
  const meta = REQUEST_META[requestType as keyof typeof REQUEST_META]

  if (requestType === 'grow_test') return handleGrowSignup(email, source)

  // Store every request in the NUMU pipeline first; storage never blocks email.
  const storedInPipeline = await recordLead({
    email,
    source: LEAD_SOURCE[requestType as keyof typeof REQUEST_META],
    notes: `Website request: ${requestType}. Page source tag: ${sanitizeSourceTag(source)}. Submitted ${new Date().toISOString()}.`,
  })

  if (!process.env.RESEND_API_KEY) {
    return storedInPipeline ? json({ ok: true }) : json({ error: 'Email service unavailable' }, 503)
  }

  const resend = getResend()
  async function sendEmail(message: Parameters<typeof resend.emails.send>[0]) {
    const result = await resend.emails.send(message)
    if (result.error) { logEmailError('contact form', result.error); throw new Error('Email provider rejected the request') }
    return result
  }
  const messageId = randomUUID()
  const sourceTag = sanitizeSourceTag(source)
  const htmlEmail = email.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
  const timestamp = new Date().toUTCString()

  try {
    await sendEmail({
      from: RESEND_FROM_EMAIL,
      to: [CONTACT_TO_EMAIL],
      ...(CONTACT_BCC_EMAIL ? { bcc: [CONTACT_BCC_EMAIL] } : {}),
      replyTo: email,
      subject: meta.subject,
      text: `${meta.heading}\n\nFrom: ${email}\nType: ${requestType}\nSource: ${sourceTag}\n\n${meta.followUp}`,
      html: `
        <div style="font-family:Arial,Helvetica,sans-serif;color:#1a1714;">
          <p style="margin:0 0 16px;"><strong>${meta.heading}</strong></p>
          <p style="margin:0 0 8px;">From: <a href="mailto:${htmlEmail}">${htmlEmail}</a></p>
          <p style="margin:0 0 8px;">Type: ${requestType}</p>
          <p style="margin:0 0 16px;">Source: ${sourceTag}</p>
          <p style="margin:0;color:#6f6458;">${meta.followUp}</p>
        </div>
      `,
      headers: { 'X-Entity-Ref-ID': messageId, 'X-NUMU-Website': 'contact', 'X-Auto-Response-Suppress': 'OOF, AutoReply' },
      tags: [{ name: 'request_type', value: requestType }, { name: 'source', value: sourceTag }],
    })

    // Automatic reply to the requester for project and samples requests (deck requests stay manual).
    if (requestType === 'project' || requestType === 'samples') {
      const reply = requestAutoReply(requestType)
      const replyResult = await resend.emails
        .send({
          from: FOUNDER_FROM_EMAIL,
          to: [email],
          replyTo: CONTACT_TO_EMAIL,
          subject: reply.subject,
          text: reply.text,
          html: reply.html,
          headers: { 'X-Entity-Ref-ID': randomUUID(), 'X-Auto-Response-Suppress': 'OOF, AutoReply' },
          tags: [{ name: 'request_type', value: `${requestType}_autoreply` }, { name: 'source', value: sourceTag }],
        })
        .catch((e: unknown) => ({ data: null, error: { message: String(e) } }))
      if (replyResult.error) logEmailError(`${requestType} auto-reply`, replyResult.error)
    }

    return json({ ok: true })
  } catch {
    return json({ error: 'Failed to send' }, 500)
  }
}
