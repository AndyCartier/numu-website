/** @type {import('next').NextConfig} */
const scriptSrc = process.env.NODE_ENV === 'production'
  ? "script-src 'self' 'unsafe-inline'"
  : "script-src 'self' 'unsafe-inline' 'unsafe-eval'"

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "media-src 'self' blob:",
  "object-src 'none'",
  scriptSrc,
  "style-src 'self' 'unsafe-inline'",
  "connect-src 'self' ws: wss: https://vitals.vercel-insights.com",
  "worker-src 'self' blob:",
].join('; ')

const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: ['framer-motion'],
    outputFileTracingIncludes: {
      '/api/contact': ['./exports/NUMU_Investor_Deck_FINAL.pdf'],
    },
  },
  // The image gallery was retired in October 2026; send any old links to the product catalogue.
  async redirects() {
    return [{ source: '/collections', destination: '/shop', permanent: true }]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: contentSecurityPolicy,
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=(), interest-cohort=()',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
      // WebKit upgrades HTTP loopback assets to HTTPS when this directive is
      // present, including local `next start`. Keep it for hosted requests.
      {
        source: '/:path*',
        missing: [{ type: 'header', key: 'host', value: '(?:localhost|127\\.0\\.0\\.1|\\[::1\\])(?::\\d+)?' }],
        headers: [{ key: 'Content-Security-Policy', value: `${contentSecurityPolicy}; upgrade-insecure-requests` }],
      },
    ]
  },
}

export default nextConfig
