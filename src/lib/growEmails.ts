import { SITE_URL } from '@/lib/site'

// Copy for the "Can Your Packaging Be Grown?" sequence and the request auto-replies.
// Drafts approved in outline by Andy (21 Nov); every line must stay true.

const EMAIL_ASSET_BASE = process.env.EMAIL_ASSET_BASE || 'https://www.numu.bio'
const LOGO_IMAGE = `${EMAIL_ASSET_BASE}/branding/logo-black-numu.png`
const TEXTURE_HEADER = `${EMAIL_ASSET_BASE}/email/numu-email-texture-lockup.jpg`
const FOOTER_IMAGE = `${EMAIL_ASSET_BASE}/email/numu-email-footer.jpg`

export function guideUrl(token: string | null) {
  return token ? `${SITE_URL}/grow?guide=${encodeURIComponent(token)}` : `${SITE_URL}/grow`
}

const SIGN_OFF_TEXT = 'Andy Cartier\nFounder & CEO, NUMU · Dubai, UAE\nandy@numu.bio · www.numu.bio'
const GROW_FOOTER_TEXT = 'You signed up at numu.bio/grow. Reply STOP to unsubscribe. NUMU, Dubai, UAE.'
const REQUEST_FOOTER_TEXT = 'You contacted NUMU through numu.bio. NUMU, Dubai, UAE.'

type Email = { subject: string; text: string; html: string }

function layout(paragraphs: string[], footerText: string, texturedHeader = false) {
  const header = texturedHeader
    ? `<a href="https://www.numu.bio"><img src="${TEXTURE_HEADER}" width="560" height="228" alt="NUMU · نمو" style="display:block;width:100%;max-width:560px;height:auto;border:0;"></a>`
    : `<a href="https://www.numu.bio"><img src="${LOGO_IMAGE}" width="56" height="70" alt="NUMU" style="display:block;margin:20px 28px 0;border:0;"></a>`
  const body = paragraphs
    .map(p => `<p style="margin:0 0 12px;font-family:Georgia,'Times New Roman',serif;font-size:16px;line-height:1.55;color:#1a1714;">${p}</p>`)
    .join('')
  return `<!doctype html>
<html lang="en">
<head><meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light"></head>
<body style="margin:0;padding:0;background-color:#efe9dd;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#efe9dd;">
    <tr><td align="center" style="padding:28px 12px;">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="width:100%;max-width:560px;background-color:#fbf8f2;">
        <tr><td>${header}</td></tr>
        <tr><td style="padding:22px 28px 2px;">${body}</td></tr>
        <tr><td style="padding:0 28px 18px;">
          <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:16px;color:#1a1714;">Andy Cartier</p>
          <p style="margin:2px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#4a3f34;">Founder &amp; CEO, NUMU · Dubai, UAE</p>
          <p style="margin:6px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;"><a href="mailto:andy@numu.bio" style="color:#4a3f34;">andy@numu.bio</a> · <a href="https://www.numu.bio" style="color:#4a3f34;">numu.bio</a></p>
        </td></tr>
        <tr><td><img src="${FOOTER_IMAGE}" width="560" height="26" alt="" style="display:block;width:100%;max-width:560px;height:auto;border:0;"></td></tr>
      </table>
      <p style="margin:14px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#8a7f72;">${footerText}</p>
    </td></tr>
  </table>
</body>
</html>`
}

function plain(paragraphs: string[], footerText: string) {
  return [...paragraphs.map(p => p.replace(/<[^>]+>/g, '')), SIGN_OFF_TEXT, footerText].join('\n\n')
}

// Day 2 and day 4 by default. Minute timing (screenshot evidence) applies only to the
// addresses listed in GROW_FAST_SEQUENCE_EMAILS, so real subscribers always get days.
export function growDelays(email: string) {
  const fast = (process.env.GROW_FAST_SEQUENCE_EMAILS ?? '')
    .split(',')
    .map(s => s.trim().toLowerCase())
    .filter(Boolean)
  const unitMs = fast.includes(email.toLowerCase()) ? 60_000 : 86_400_000
  return { second: 2 * unitMs, third: 4 * unitMs, fast: unitMs === 60_000 }
}

export function deadlineLabel(signupAt: Date) {
  const deadline = new Date(signupAt.getTime() + 7 * 86_400_000)
  return deadline.toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Asia/Dubai',
  })
}

export function growEmailOne(link: string): Email {
  const paragraphs = [
    'Hi, thanks for signing up.',
    'Pick one product with a foam or plastic insert. In five minutes, get a fit score and a brief you can share with your team.',
    `<a href="${link}" style="color:#4a3f34;font-weight:bold;">Open my packaging assessment</a>`,
    'Keep this link to return on another device.',
  ]
  return {
    subject: 'Your packaging assessment is ready',
    text: plain(paragraphs, GROW_FOOTER_TEXT).replace('Open my packaging assessment', `Open my packaging assessment: ${link}`),
    html: layout(paragraphs, GROW_FOOTER_TEXT, true),
  }
}

export function growEmailTwo(): Email {
  const paragraphs = [
    'Hi,',
    'To cut single-use plastic, start with one insert. A seasonal gift set with a simple shape is a good first candidate.',
    'Check what the insert protects today. Does it keep the product from shifting or protect a fragile edge?',
    'Reply with a photo you can share and your product’s dimensions. I’ll create a bespoke visual showing how a grown insert could fit your product, with your branding.',
  ]
  return {
    subject: 'Which insert could you replace first?',
    text: plain(paragraphs, GROW_FOOTER_TEXT),
    html: layout(paragraphs, GROW_FOOTER_TEXT, true),
  }
}

export function growEmailThree(signupAt: Date): Email {
  const deadline = deadlineLabel(signupAt)
  const paragraphs = [
    'Hi,',
    '<strong>Free PALMYCO sample box.</strong> Score 4/10 or higher on a product with a foam or plastic insert to request one. Five are available per month, subject to confirmation.',
    '<strong>Fit Sprint · AED 500.</strong> A bespoke prototype for one product in 4–5 weeks. The fee is credited in full against your first order, subject to production capacity.',
    `Reply by ${deadline} with your product and tell me if you’d like a sample box or a prototype.`,
  ]
  return {
    subject: 'Ready to try a grown insert?',
    text: plain(paragraphs, GROW_FOOTER_TEXT),
    html: layout(paragraphs, GROW_FOOTER_TEXT, true),
  }
}

// Auto-replies for the existing website requests (new on 21 Nov; there was none before).
export function requestAutoReply(requestType: 'project' | 'samples'): Email {
  const paragraphs = requestType === 'samples'
    ? [
        'Hello,',
        'Thank you for requesting PALMYCO samples. Your request has reached me directly, and I will reply personally to confirm which samples fit your project.',
        'To help me prepare, you can reply to this email with your project, the application you have in mind (surfaces, lighting, objects or packaging) and the city for delivery.',
      ]
    : [
        'Hello,',
        'Thank you for reaching out to NUMU. Your project inquiry has reached me directly, and I will reply personally.',
        'To help me prepare, you can reply to this email with the project type, location, approximate size and timeline.',
      ]
  return {
    subject: requestType === 'samples' ? 'We received your sample request' : 'We received your project inquiry',
    text: plain(paragraphs, REQUEST_FOOTER_TEXT),
    html: layout(paragraphs, REQUEST_FOOTER_TEXT),
  }
}
