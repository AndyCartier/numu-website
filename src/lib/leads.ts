// Records website requests in the NUMU pipeline (Supabase `leads` table).
// Server-side only: uses the service role key, never exposed to the browser.
// Failures are swallowed so that email delivery is never blocked by storage.

const FREE_MAIL_DOMAINS = new Set([
  'gmail.com', 'googlemail.com', 'outlook.com', 'hotmail.com', 'live.com', 'yahoo.com',
  'icloud.com', 'me.com', 'proton.me', 'protonmail.com', 'aol.com', 'gmx.com',
])

export type LeadSource =
  | 'website-grow-test'
  | 'website-project'
  | 'website-samples'
  | 'website-investor-deck'

type LeadInput = {
  email: string
  source: LeadSource
  notes: string
}

function companyFromEmail(email: string) {
  const domain = email.split('@')[1] ?? ''
  if (!domain || FREE_MAIL_DOMAINS.has(domain)) return 'Unknown (website request)'
  return domain
}

function supabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return { url, key }
}

function headers(key: string) {
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
  }
}

export async function recordLead({ email, source, notes }: LeadInput): Promise<boolean> {
  const config = supabaseConfig()
  if (!config) return false

  try {
    const res = await fetch(`${config.url}/rest/v1/leads`, {
      method: 'POST',
      headers: { ...headers(config.key), Prefer: 'return=minimal' },
      body: JSON.stringify({
        company: companyFromEmail(email),
        email,
        source,
        stage: 'new',
        notes,
        is_demo: process.env.LEADS_IS_DEMO === 'true',
      }),
      cache: 'no-store',
    })
    return res.ok
  } catch {
    return false
  }
}

// Saves the growability test result on the visitor's most recent grow-test lead.
export async function recordGrowScore(email: string, summary: string): Promise<boolean> {
  const config = supabaseConfig()
  if (!config) return false

  const query = new URLSearchParams({
    email: `eq.${email}`,
    source: 'eq.website-grow-test',
  })

  try {
    const res = await fetch(`${config.url}/rest/v1/leads?${query}`, {
      method: 'PATCH',
      headers: { ...headers(config.key), Prefer: 'return=minimal' },
      body: JSON.stringify({ notes: summary, next_step: 'Review growability result and reply' }),
      cache: 'no-store',
    })
    return res.ok
  } catch {
    return false
  }
}
