import { SITE_URL } from '@/lib/site'

// Copy for the "Can Your Packaging Be Grown?" sequence and the request auto-replies.
// Drafts approved in outline by Andy (21 Nov); every line must stay true.

// Email 2 needs one true result. Left empty until Andy chooses the line;
// when empty, the sentence is omitted rather than invented.
const TRUE_RESULT_LINE = ''

const SIGNATURE_HTML = `
  <p style="margin:24px 0 0;font-family:Arial,sans-serif;font-size:12px;color:#6f6458;border-top:1px solid #e8e4da;padding-top:16px;">
    Andy Cartier — Founder &amp; CEO<br>
    NUMU · Grown in Dubai, UAE<br>
    <a href="mailto:andy@numu.bio" style="color:#6f6458;">andy@numu.bio</a>
  </p>`

const FOOTER_TEXT = 'You signed up at numu.bio/grow. Reply STOP to unsubscribe. NUMU, Dubai, UAE.'
const FOOTER_HTML = `<p style="margin:16px 0 0;font-family:Arial,sans-serif;font-size:11px;color:#9a8f82;">${FOOTER_TEXT}</p>`

type Email = { subject: string; text: string; html: string }

function wrap(paragraphs: string[]) {
  const body = paragraphs
    .map(p => `<p style="margin:0 0 16px;">${p}</p>`)
    .join('')
  return `<div style="font-family:Georgia,serif;color:#1a1714;max-width:520px;line-height:1.7;">${body}${SIGNATURE_HTML}${FOOTER_HTML}</div>`
}

export function growDelays() {
  const unitMs = process.env.GROW_EMAIL_DELAY_UNIT === 'minutes' ? 60_000 : 86_400_000
  return { second: 2 * unitMs, third: 4 * unitMs }
}

export function deadlineLabel(signupAt: Date) {
  const deadline = new Date(signupAt.getTime() + 7 * 86_400_000)
  return deadline.toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Asia/Dubai',
  })
}

export function growEmailOne(): Email {
  const guideUrl = `${SITE_URL}/grow`
  const text = [
    'Hello,',
    `Thanks for signing up. Here is your 5-minute test: ${guideUrl}`,
    'Pick one product, answer ten yes-or-no questions, and you will know if it is a good first candidate for grown packaging.',
    'Who we are: NUMU is a Dubai company. We are developing protective packaging grown from PALMYCO, our material made from regional agricultural waste, shaped to fit your product.',
    "One extra: reply with your product's size and a photo, and we will send you an AI concept render of a grown insert made for it. It is an illustration, not a real prototype.",
    'Andy Cartier\nFounder, NUMU',
    FOOTER_TEXT,
  ].join('\n\n')
  const html = wrap([
    'Hello,',
    `Thanks for signing up. Here is your 5-minute test: <a href="${guideUrl}" style="color:#4a3f34;">${guideUrl.replace(/^https?:\/\//, '')}</a>`,
    'Pick one product, answer ten yes-or-no questions, and you will know if it is a good first candidate for grown packaging.',
    'Who we are: NUMU is a Dubai company. We are developing protective packaging grown from PALMYCO, our material made from regional agricultural waste, shaped to fit your product.',
    "One extra: reply with your product's size and a photo, and we will send you an AI concept render of a grown insert made for it. It is an illustration, not a real prototype.",
  ])
  return { subject: 'Your packaging test is ready', text, html }
}

export function growEmailTwo(): Email {
  const tip = "One useful tip: weigh today's insert. Grams per unit, times units per year, gives your yearly foam or plastic baseline. With that one number you can measure any alternative honestly, ours included."
  const close = 'If your test score was 4 or more, reply with that product’s size and a photo, and we will send your AI concept render.'
  const paragraphs = ['Hello,', tip, ...(TRUE_RESULT_LINE ? [TRUE_RESULT_LINE] : []), close]
  const text = [...paragraphs, 'Andy, NUMU', FOOTER_TEXT].join('\n\n')
  return { subject: 'One number every packaging team needs', text, html: wrap(paragraphs) }
}

export function growEmailThree(signupAt: Date): Email {
  const deadline = deadlineLabel(signupAt)
  const paragraphs = [
    'Hello,',
    'Here is the offer, plainly.',
    '<strong>Free sample box:</strong> touch PALMYCO and judge it with your team. We send only 5 a month.',
    '<strong>Bespoke prototype for one product: AED 500,</strong> credited in full against your first order (subject to production capacity). Made in Dubai in 4 to 5 weeks.',
    `To keep one of this month's free boxes, reply by ${deadline}. After that date, the box goes to the next brand on the list.`,
  ]
  const text = [...paragraphs.map(p => p.replace(/<[^>]+>/g, '')), 'Andy Cartier\nFounder, NUMU\nandy@numu.bio', FOOTER_TEXT].join('\n\n')
  return { subject: `Your free sample box, until ${deadline}`, text, html: wrap(paragraphs) }
}

// Auto-replies for the existing website requests (new on 21 Nov; there was none before).
export function requestAutoReply(requestType: 'project' | 'samples'): Email {
  if (requestType === 'samples') {
    const paragraphs = [
      'Hello,',
      'Thank you for requesting PALMYCO samples. Your request has reached me directly, and I will reply personally to confirm which samples fit your project.',
      'To help me prepare, you can reply to this email with your project, the application you have in mind (surfaces, lighting, objects or packaging) and the city for delivery.',
    ]
    const text = [...paragraphs, 'Andy Cartier\nFounder & CEO, NUMU'].join('\n\n')
    return { subject: 'We received your sample request', text, html: wrap(paragraphs).replace(FOOTER_HTML, '') }
  }
  const paragraphs = [
    'Hello,',
    'Thank you for reaching out to NUMU. Your project inquiry has reached me directly, and I will reply personally.',
    'To help me prepare, you can reply to this email with the project type, location, approximate size and timeline.',
  ]
  const text = [...paragraphs, 'Andy Cartier\nFounder & CEO, NUMU'].join('\n\n')
  return { subject: 'We received your project inquiry', text, html: wrap(paragraphs).replace(FOOTER_HTML, '') }
}
