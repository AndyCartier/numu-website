import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL || 'andy@numu.bio'
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'NUMU <andy@numu.bio>'

const REQUEST_META = {
  investor_deck: {
    subject: 'New investor deck request — NUMU',
    heading: 'New investor deck request',
    followUp: 'Reply directly to send the NUMU investor deck.',
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

export async function POST(req: Request) {
  const { email, website = '', requestType = 'project', source } = await req.json()

  if (typeof website === 'string' && website.trim().length > 0) {
    return NextResponse.json({ ok: true })
  }

  if (typeof email !== 'string' || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  if (source && typeof source === 'string' && source.length > 120) {
    return NextResponse.json({ error: 'Invalid source' }, { status: 400 })
  }

  const meta = REQUEST_META[requestType as keyof typeof REQUEST_META]

  if (!meta) {
    return NextResponse.json({ error: 'Invalid request type' }, { status: 400 })
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: 'Email service unavailable' }, { status: 503 })
  }

  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    await resend.emails.send({
      from: RESEND_FROM_EMAIL,
      to: CONTACT_TO_EMAIL,
      replyTo: email,
      subject: meta.subject,
      text: `${meta.heading} from: ${email}${source ? `\nSource: ${source}` : ''}\n\n${meta.followUp}`,
      html: `
        <p style="font-family:sans-serif;color:#1a1714;">
          <strong>${meta.heading}</strong><br><br>
          From: <a href="mailto:${email}">${email}</a>
          ${source ? `<br>Source: ${source}` : ''}
        </p>
        <p style="font-family:sans-serif;color:#9c8e7f;font-size:13px;">
          ${meta.followUp}
        </p>
      `,
    })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}
