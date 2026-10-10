const DEFAULT_SITE_URL = 'https://www.numu.bio'

function trimTrailingSlash(value: string) {
  return value.endsWith('/') ? value.slice(0, -1) : value
}

function parseSiteUrl(value?: string) {
  if (!value) return null

  const normalized = value.startsWith('http://') || value.startsWith('https://')
    ? value
    : `https://${value}`

  try {
    return new URL(trimTrailingSlash(normalized))
  } catch {
    return null
  }
}

const detectedSiteUrl =
  parseSiteUrl(process.env.SITE_URL) ??
  parseSiteUrl(process.env.NEXT_PUBLIC_SITE_URL) ??
  parseSiteUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
  parseSiteUrl(process.env.VERCEL_URL) ??
  new URL(DEFAULT_SITE_URL)

export const SITE_URL = trimTrailingSlash(detectedSiteUrl.toString())
export const SITE_HOST = detectedSiteUrl.host

export function buildAbsoluteUrl(path = '/') {
  return new URL(path, SITE_URL)
}

export function isLocalDevelopmentHost(host: string) {
  return /^(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/i.test(host)
}

// Local production previews use HTTP too. Never relax cookies for a hosted
// origin merely because its reverse proxy communicates with Next over HTTP.
export function shouldSecureCookies(req: Request) {
  const url = new URL(req.url)
  return !(url.protocol === 'http:' && isLocalDevelopmentHost(url.host))
}

export function getAllowedOriginHosts() {
  const hosts = new Set<string>([
    SITE_HOST,
    'numu.bio',
    'www.numu.bio',
    'localhost:3000',
    '127.0.0.1:3000',
  ])

  const extraOrigins = process.env.ALLOWED_CONTACT_ORIGINS?.split(',') ?? []

  for (const origin of extraOrigins) {
    const parsed = parseSiteUrl(origin.trim())

    if (parsed) {
      hosts.add(parsed.host)
    }
  }

  return hosts
}
