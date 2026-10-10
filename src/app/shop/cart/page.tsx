import type { Metadata } from 'next'
import { SubpageNav } from '@/components/SubpageNav'
import CartPageClient from '@/components/shop/CartPageClient'
export const metadata: Metadata = { title: 'Cart | NUMU Shop', description: 'Review your NUMU selection and delivery options.', alternates: { canonical: '/shop/cart' }, robots: { index: false, follow: false } }
export default function CartPage() { return <div style={{ background: '#f5f1e8', color: '#1a1714' }}><SubpageNav currentPath="/shop/cart" /><CartPageClient /></div> }
