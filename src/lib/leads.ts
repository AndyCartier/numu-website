// Records website requests in the NUMU pipeline (Supabase `leads` and `interactions`).
// Server-side only: uses the service role key, never exposed to the browser.

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

// Marker written to `interactions` once the grow email sequence has been sent.
const SEQUENCE_MARKER = 'grow-sequence:'

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

async function rest(path: string, init: RequestInit = {}) {
  const config = supabaseConfig()
  if (!config) return null
  try {
    return await fetch(`${config.url}/rest/v1/${path}`, {
      ...init,
      headers: { ...headers(config.key), ...(init.headers ?? {}) },
      cache: 'no-store',
    })
  } catch {
    return null
  }
}

function leadRow({ email, source, notes }: LeadInput) {
  return {
    company: companyFromEmail(email),
    email,
    source,
    stage: 'new',
    notes,
    is_demo: process.env.LEADS_IS_DEMO === 'true',
  }
}

// Best-effort record for project, samples and deck requests; never blocks email.
export async function recordLead(input: LeadInput): Promise<boolean> {
  const res = await rest('leads', { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify(leadRow(input)) })
  return !!res?.ok
}

// Returns the existing grow-test lead for this email, or creates one. Null means it was not saved.
export async function findOrCreateGrowLead(email: string, notes: string): Promise<{ id: string; created: boolean } | null> {
  const query = new URLSearchParams({
    select: 'id',
    email: `eq.${email}`,
    source: 'eq.website-grow-test',
    order: 'created_at.asc',
    limit: '1',
  })
  const found = await rest(`leads?${query}`)
  if (!found?.ok) return null
  const existing = (await found.json().catch(() => [])) as { id: string }[]
  if (existing[0]?.id) return { id: existing[0].id, created: false }

  const res = await rest('leads?select=id', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify(leadRow({ email, source: 'website-grow-test', notes })),
  })
  if (!res?.ok) return null
  const rows = (await res.json().catch(() => [])) as { id: string }[]
  return rows[0]?.id ? { id: rows[0].id, created: true } : null
}

export async function growLeadExists(email: string): Promise<boolean> {
  const query = new URLSearchParams({ select: 'id', email: `eq.${email}`, source: 'eq.website-grow-test', limit: '1' })
  const res = await rest(`leads?${query}`)
  if (!res?.ok) return false
  const rows = (await res.json().catch(() => [])) as unknown[]
  return rows.length > 0
}

export async function growSequenceSent(leadId: string): Promise<boolean> {
  const query = new URLSearchParams({ select: 'id', lead_id: `eq.${leadId}`, body: `like.${SEQUENCE_MARKER}*`, limit: '1' })
  const res = await rest(`interactions?${query}`)
  if (!res?.ok) return false
  const rows = (await res.json().catch(() => [])) as unknown[]
  return rows.length > 0
}

export async function recordGrowSequence(leadId: string, detail: string): Promise<boolean> {
  const res = await rest('interactions', {
    method: 'POST',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify({ lead_id: leadId, kind: 'email', body: `${SEQUENCE_MARKER} ${detail}` }),
  })
  return !!res?.ok
}

// Saves the growability test result on the visitor's grow-test lead.
export async function recordGrowScore(email: string, summary: string): Promise<boolean> {
  const query = new URLSearchParams({ email: `eq.${email}`, source: 'eq.website-grow-test' })
  const res = await rest(`leads?${query}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify({ notes: summary, next_step: 'Review growability result and reply' }),
  })
  return !!res?.ok
}
