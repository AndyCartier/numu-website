import type { MetadataRoute } from 'next'
import { buildAbsoluteUrl } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  const pages = [
    { path: '/', priority: 1, changeFrequency: 'weekly' as const },
    { path: '/acoustic-panels-dubai', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/thermal-insulation-uae', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/mycelium-packaging-uae', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/palmyco', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/case-studies', priority: 0.75, changeFrequency: 'weekly' as const },
    { path: '/privacy', priority: 0.4, changeFrequency: 'monthly' as const },
    { path: '/terms', priority: 0.4, changeFrequency: 'monthly' as const },
  ]

  return pages.map(({ path, priority, changeFrequency }) => ({
    url: buildAbsoluteUrl(path).toString(),
    lastModified,
    changeFrequency,
    priority,
  }))
}
