import { NextResponse } from 'next/server'
import { readGuideToken } from '@/lib/guideLink'
import { recordGrowScore } from '@/lib/leads'
import { getAllowedOriginHosts, isLocalDevelopmentHost } from '@/lib/site'

const LABELS = ['Still in the cupboard', 'Sprouting', 'Ready to grow'] as const

function json(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' },
  })
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
  // The score is saved only for the subscriber named in the signed guide link.
  const email = readGuideToken(typeof body?.token === 'string' ? body.token : '') ?? ''
  const score = Number(body?.score)
  const product = typeof body?.product === 'string' ? body.product.trim().slice(0, 120) : ''
  const answers = Array.isArray(body?.answers) ? body.answers.slice(0, 10) : []

  if (!email) return json({ error: 'Invalid link' }, 400)
  if (!Number.isInteger(score) || score < 0 || score > 10) return json({ error: 'Invalid score' }, 400)
  if (answers.length !== 10 || !answers.every((a: unknown) => typeof a === 'boolean')) return json({ error: 'Invalid answers' }, 400)

  // No foam or plastic insert today means there is nothing to compare: never "ready".
  const label = answers[0] === false
    ? 'Choose another product'
    : score >= 7 ? LABELS[2] : score >= 4 ? LABELS[1] : LABELS[0]
  const noAnswers = answers.map((a: boolean, i: number) => (a ? null : i + 1)).filter(Boolean)
  const summary = [
    `Growability test: ${score}/10 (${label}).`,
    product ? `Product tested: ${product}.` : null,
    noAnswers.length ? `"No" on questions ${noAnswers.join(', ')}.` : 'Yes on all questions.',
    `Scored ${new Date().toISOString()}.`,
  ].filter(Boolean).join(' ')

  const ok = await recordGrowScore(email, summary)
  return ok ? json({ ok: true, label }) : json({ error: 'Could not save' }, 500)
}
