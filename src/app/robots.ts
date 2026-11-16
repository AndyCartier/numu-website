import type { MetadataRoute } from 'next'
import { SITE_HOST, SITE_URL } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  const disallow = ['/exports/', '/api/']

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow,
      },
      { userAgent: 'OAI-SearchBot', allow: '/', disallow },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_HOST,
  }
}
