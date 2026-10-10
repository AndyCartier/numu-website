import type { Metadata } from 'next'
import { SubpageNav } from '@/components/SubpageNav'
import ShopClient from '@/components/shop/ShopClient'
import { publicProducts } from '@/lib/commerce/catalogue'
export const metadata: Metadata = { title: 'Shop | NUMU', description: 'Objects, art, materials, and experiences from the NUMU material system.', alternates: { canonical: '/shop' }, openGraph: { title: 'Shop | NUMU', description: 'Objects, art, materials, and experiences from the NUMU material system.', url: '/shop', images: ['/images/mushroomiya/base39-lamp-01.jpg'] }, twitter: { card: 'summary_large_image', title: 'Shop | NUMU', description: 'Objects, art, materials, and experiences from the NUMU material system.', images: ['/images/mushroomiya/base39-lamp-01.jpg'] } }
export default function ShopPage() { return <main className="min-h-screen" style={{ background: '#f5f1e8', color: '#1a1714' }}><SubpageNav currentPath="/shop" /><ShopClient products={publicProducts} /></main> }
