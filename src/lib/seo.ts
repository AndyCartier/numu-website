import type { Metadata } from 'next'
import { buildAbsoluteUrl, SITE_URL } from '@/lib/site'

type SeoImage = {
  src: string
  alt: string
}

export type SeoFaq = {
  question: string
  answer: string
}

export type SeoSection = {
  title: string
  paragraphs: string[]
}

export type SeoHighlight = {
  label: string
  value: string
}

export type SeoApplication = {
  title: string
  description: string
}

export type SeoRelatedLink = {
  href: string
  title: string
  description: string
}

export type SeoPageData = {
  slug: string
  path: `/${string}` | '/'
  title: string
  description: string
  kicker: string
  heading: string
  intro: string
  image: SeoImage
  keywords: string[]
  highlights: SeoHighlight[]
  applications: SeoApplication[]
  sections: SeoSection[]
  faq: SeoFaq[]
  relatedLinks: SeoRelatedLink[]
  schemaType: 'Product' | 'Service' | 'CollectionPage'
  schemaName: string
  schemaCategory?: string
}

function buildImageMetadata(image: SeoImage) {
  return {
    url: buildAbsoluteUrl(image.src).toString(),
    width: 1600,
    height: 900,
    alt: image.alt,
  }
}

export function buildSeoMetadata(page: SeoPageData): Metadata {
  const image = buildImageMetadata(page.image)

  return {
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    alternates: {
      canonical: page.path,
    },
    openGraph: {
      title: page.title,
      description: page.description,
      url: page.path,
      siteName: 'NUMU',
      type: 'website',
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description: page.description,
      images: [image.url],
    },
  }
}

export function buildSeoJsonLd(page: SeoPageData) {
  const canonicalUrl = buildAbsoluteUrl(page.path).toString()
  const imageUrl = buildAbsoluteUrl(page.image.src).toString()

  const webPage = {
    '@context': 'https://schema.org',
    '@type': page.schemaType === 'CollectionPage' ? 'CollectionPage' : 'WebPage',
    name: page.title,
    description: page.description,
    url: canonicalUrl,
    image: imageUrl,
    isPartOf: SITE_URL,
    about: {
      '@type': page.schemaType === 'Product' ? 'Product' : 'Thing',
      name: page.schemaName,
      category: page.schemaCategory,
    },
  }

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: page.schemaName,
        item: canonicalUrl,
      },
    ],
  }

  const mainEntity =
    page.schemaType === 'Product'
      ? {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: page.schemaName,
          description: page.description,
          image: imageUrl,
          category: page.schemaCategory,
          brand: {
            '@type': 'Brand',
            name: 'NUMU',
          },
          manufacturer: {
            '@type': 'Organization',
            name: 'NUMU',
            url: SITE_URL,
          },
        }
      : page.schemaType === 'Service'
        ? {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: page.schemaName,
            description: page.description,
            serviceType: page.schemaCategory,
            provider: {
              '@type': 'Organization',
              name: 'NUMU',
              url: SITE_URL,
            },
            areaServed: ['Dubai', 'UAE', 'GCC'],
          }
        : {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: page.schemaName,
            description: page.description,
            url: canonicalUrl,
            image: imageUrl,
          }

  const faq =
    page.faq.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: page.faq.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer,
            },
          })),
        }
      : null

  return [webPage, breadcrumb, mainEntity, faq].filter(Boolean)
}
