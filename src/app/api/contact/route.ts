import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  const { email } = await req.json()

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  try {
    await resend.emails.send({
      from:    'NUMU <noreply@numu.bio>',
      to:      'andy@numu.bio',
      replyTo: email,
      subject: 'New deck request — NUMU',
      text: `Deck request from: ${email}\n\nReply directly to this email to send the deck.`,
      html: `
        <p style="font-family:sans-serif;color:#1a1714;">
          <strong>New deck request</strong><br><br>
          From: <a href="mailto:${email}">${email}</a>
        </p>
        <p style="font-family:sans-serif;color:#9c8e7f;font-size:13px;">
          Hit reply to send the NUMU investor deck directly to this person.
        </p>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}
