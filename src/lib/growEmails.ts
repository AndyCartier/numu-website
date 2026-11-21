import { SITE_URL } from '@/lib/site'

// Copy for the "Can Your Packaging Be Grown?" sequence and the request auto-replies.
// Drafts approved in outline by Andy (21 Nov); every line must stay true.

// Email 2 needs one true result. Left empty until Andy chooses the line;
// when empty, the sentence is omitted rather than invented.
const TRUE_RESULT_LINE = ''

// Images are served from the live site, so they appear once this branch is deployed.
const EMAIL_ASSET_BASE = process.env.EMAIL_ASSET_BASE || 'https://www.numu.bio'
const HEADER_IMAGE = `${EMAIL_ASSET_BASE}/email/numu-email-header.jpg`
const FOOTER_IMAGE = `${EMAIL_ASSET_BASE}/email/numu-email-footer.jpg`

export function guideUrl(token: string | null) {
  return token ? `${SITE_URL}/grow?guide=${encodeURIComponent(token)}` : `${SITE_URL}/grow`
}

const SIGN_OFF_TEXT = 'Andy Cartier\nCEO & Founder, NUMU\nandy@numu.bio'
const GROW_FOOTER_TEXT = 'You signed up at numu.bio/grow. Reply STOP to unsubscribe. NUMU, Dubai, UAE.'
const REQUEST_FOOTER_TEXT = 'You contacted NUMU through numu.bio. NUMU, Dubai, UAE.'

type Email = { subject: string; text: string; html: string }

function layout(paragraphs: string[], footerText: string) {
  const body = paragraphs
    .map(p => `<p style="margin:0 0 18px;font-family:Georgia,'Times New Roman',serif;font-size:16px;line-height:1.7;color:#1a1714;">${p}</p>`)
    .join('')
  return `<!doctype html>
<html lang="en">
<head><meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light"></head>
<body style="margin:0;padding:0;background-color:#efe9dd;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#efe9dd;">
    <tr><td align="center" style="padding:28px 12px;">
      <table role="presentation" width="520" cellpadding="0" cellspacing="0" style="width:100%;max-width:520px;background-color:#f5f1e8;border:1px solid #e2d9c8;">
        <tr><td><img src="${HEADER_IMAGE}" width="520" height="150" alt="NUMU · نمو" style="display:block;width:100%;max-width:520px;height:auto;border:0;"></td></tr>
        <tr><td style="padding:32px 36px 8px;">${body}</td></tr>
        <tr><td style="padding:0 36px 28px;">
          <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:16px;color:#1a1714;">Andy Cartier</p>
          <p style="margin:2px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#4a3f34;">CEO &amp; Founder, NUMU</p>
          <p style="margin:6px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;"><a href="mailto:andy@numu.bio" style="color:#4a3f34;">andy@numu.bio</a></p>
        </td></tr>
        <tr><td><img src="${FOOTER_IMAGE}" width="520" height="24" alt="" style="display:block;width:100%;max-width:520px;height:auto;border:0;"></td></tr>
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
    'Hello,',
    `Thanks for signing up. <a href="${link}" style="color:#4a3f34;font-weight:bold;">Open your pilot guide</a>. The link is yours: it opens the guide on any device, without signing up again.`,
    'Pick one product, answer ten yes-or-no questions, and you get a one-page brief your team can use to decide whether to explore a grown insert.',
    'Who we are: NUMU is a Dubai company. We are developing protective packaging grown from PALMYCO, our material made from regional agricultural waste, shaped to fit your product.',
    'Want to see your own product in a grown insert? Reply with a photo and its dimensions, and I’ll create a concept illustration.',
  ]
  return {
    subject: 'Your pilot guide is ready',
    text: plain(paragraphs, GROW_FOOTER_TEXT).replace('Open your pilot guide.', `Open your pilot guide: ${link}`),
    html: layout(paragraphs, GROW_FOOTER_TEXT),
  }
}

export function growEmailTwo(): Email {
  const paragraphs = [
    'Hello,',
    'One useful tip: weigh today’s insert. Grams per unit, times units per year, gives your yearly foam or plastic baseline. With that one number you can measure any alternative honestly, ours included.',
    ...(TRUE_RESULT_LINE ? [TRUE_RESULT_LINE] : []),
    'If your score was 4 or more, reply with that product’s photo and dimensions, and I’ll create a concept illustration.',
  ]
  return {
    subject: 'One number every packaging team needs',
    text: plain(paragraphs, GROW_FOOTER_TEXT),
    html: layout(paragraphs, GROW_FOOTER_TEXT),
  }
}

export function growEmailThree(signupAt: Date): Email {
  const deadline = deadlineLabel(signupAt)
  const paragraphs = [
    'Hello,',
    'Here is the offer, plainly.',
    '<strong>Free sample box:</strong> touch PALMYCO and judge it with your team. We send only 5 a month.',
    '<strong>Bespoke prototype for one product: AED 500,</strong> credited in full against your first order (subject to production capacity). Made in Dubai in 4 to 5 weeks.',
    `To keep one of this month’s free boxes, reply by ${deadline}. After that date, the box goes to the next brand on the list.`,
  ]
  return {
    subject: `Your free sample box, until ${deadline}`,
    text: plain(paragraphs, GROW_FOOTER_TEXT),
    html: layout(paragraphs, GROW_FOOTER_TEXT),
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
