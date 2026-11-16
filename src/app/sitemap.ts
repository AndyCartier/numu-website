import type { MetadataRoute } from 'next'
import { publicProducts } from '@/lib/commerce/catalogue'
import { buildAbsoluteUrl } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  // Update only when site content changes, not on each rebuild.
  const lastModified = new Date('2026-10-10T00:00:00+04:00')

  const updatedPages = new Set(['/fold', '/faq', '/'])

  const pages = [
    { path: '/', priority: 1, changeFrequency: 'weekly' as const },
    { path: '/about', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/connect', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/acoustic-panels-dubai', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/fold', priority: 0.78, changeFrequency: 'monthly' as const },
    { path: '/faq', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/thermal-insulation-uae', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/mycelium-packaging-uae', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/mushroomiya', priority: 0.75, changeFrequency: 'monthly' as const },
    { path: '/shop', priority: 0.85, changeFrequency: 'weekly' as const },
    ...publicProducts.filter(product => ['available', 'made_to_order'].includes(product.status) && product.slug !== 'shop-review-object').map(product => ({ path: `/shop/${product.slug}`, priority: product.category === 'Experiences' ? 0.5 : 0.72, changeFrequency: 'monthly' as const })),
    { path: '/palmyco', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/case-studies', priority: 0.75, changeFrequency: 'weekly' as const },
    { path: '/partnerships', priority: 0.65, changeFrequency: 'monthly' as const },
    { path: '/partnerships/titans-space', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/privacy', priority: 0.4, changeFrequency: 'monthly' as const },
    { path: '/terms', priority: 0.4, changeFrequency: 'monthly' as const },
  ]

  return pages.map(({ path, priority, changeFrequency }) => ({
    url: buildAbsoluteUrl(path).toString(),
    lastModified: updatedPages.has(path) ? new Date('2026-11-11T00:00:00+04:00') : lastModified,
    changeFrequency,
    priority,
  }))
}
