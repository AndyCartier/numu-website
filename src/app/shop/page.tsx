import type { Metadata } from 'next'
import { SubpageNav } from '@/components/SubpageNav'
import ShopClient from '@/components/shop/ShopClient'
import { publicProducts } from '@/lib/commerce/catalogue'
import { buildAbsoluteUrl } from '@/lib/site'

const title = 'Objects & Surfaces | Mycelium Products by NUMU, Dubai'
const description = 'Grown acoustic panels, interior cladding, Mushroomiya lighting, furniture and original Fungal Art Series® works from PALMYCO™ mycelium. Made in Dubai, offered by inquiry, price on request.'
const image = '/images/catalogue/aurum/aurum-gold-detail.jpg'

export const metadata: Metadata = {
  title, description, alternates: { canonical: '/shop' },
  openGraph: { title, description, url: '/shop', images: [image] },
  twitter: { card: 'summary_large_image', title, description, images: [image] },
}

const itemListJsonLd = {
  '@context': 'https://schema.org', '@type': 'ItemList', name: 'NUMU Objects & Surfaces',
  itemListElement: publicProducts.filter(product => product.category !== 'Experiences').map((product, index) => ({
    '@type': 'ListItem', position: index + 1, name: product.name, url: buildAbsoluteUrl(`/shop/${product.slug}`).toString(),
  })),
}

export default function ShopPage() {
  return <main className="min-h-screen" style={{ background: '#f5f1e8', color: '#1a1714' }}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
    <SubpageNav currentPath="/shop" />
    <ShopClient products={publicProducts} />
  </main>
}
