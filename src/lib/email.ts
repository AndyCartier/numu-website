// Shared settings for the website's notification emails (Resend → NUMU inbox).
//
// Deliverability notes (Microsoft 365 hosts numu.bio mail):
// - Notifications are sent from a dedicated address, not from the inbox they are delivered to.
//   Mail "from andy@numu.bio to andy@numu.bio" sent by an outside server is treated as possible
//   spoofing by Outlook and tends to land in Junk.
// - The address needs no mailbox: replies go to the visitor via replyTo, bounces to send.numu.bio.
// - `X-NUMU-Website` lets an Outlook/Exchange rule recognise these messages if ever needed.
export const NOTIFY_FROM = process.env.NOTIFY_FROM_EMAIL || 'NUMU Website <website@numu.bio>'

export function notificationHeaders(id: string, kind: string) {
  return { 'X-Entity-Ref-ID': id, 'X-NUMU-Website': kind, 'X-Auto-Response-Suppress': 'OOF, AutoReply' }
}

const escape = (value: string) => value.replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]!))

// Minimal, table-based HTML that renders the same in Outlook, Gmail and Apple Mail.
export function notificationHtml(heading: string, rows: [string, string][], message?: string) {
  const cells = rows.map(([label, value]) =>
    `<tr><td style="padding:6px 18px 6px 0;color:#7a6f63;vertical-align:top;white-space:nowrap;">${escape(label)}</td><td style="padding:6px 0;color:#1a1714;">${/^https?:\/\//.test(value) ? `<a href="${escape(value)}" style="color:#1a1714;">${escape(value)}</a>` : escape(value)}</td></tr>`).join('')
  const body = message ? `<p style="margin:22px 0 0;padding:16px 18px;background:#f5f1e8;color:#1a1714;line-height:1.6;white-space:pre-wrap;">${escape(message)}</p>` : ''
  return `<!doctype html><html><body style="margin:0;padding:24px;background:#ffffff;font-family:Helvetica,Arial,sans-serif;font-size:14px;">
<p style="margin:0 0 4px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#7a6f63;">numu.bio</p>
<h1 style="margin:0 0 18px;font-family:Georgia,serif;font-weight:400;font-size:24px;color:#1a1714;">${escape(heading)}</h1>
<table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px;">${cells}</table>${body}
<p style="margin:26px 0 0;font-size:12px;color:#7a6f63;">Reply to this email to answer the sender directly.</p>
</body></html>`
}

// Resend returns { error } instead of throwing. Log the reason (no message content) so a
// rejected send is visible in Vercel runtime logs.
export function logEmailError(context: string, error: unknown) {
  const detail = error && typeof error === 'object' ? JSON.stringify({ name: (error as { name?: string }).name, message: (error as { message?: string }).message, statusCode: (error as { statusCode?: number }).statusCode }) : String(error)
  console.error(`[email] ${context} failed: ${detail}`)
}
