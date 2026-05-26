import type { MetadataRoute } from 'next'
import { buildAbsoluteUrl } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return ['/', '/privacy', '/terms'].map((path) => ({
    url: buildAbsoluteUrl(path).toString(),
    lastModified,
    changeFrequency: path === '/' ? 'weekly' : 'monthly',
    priority: path === '/' ? 1 : 0.4,
  }))
}
