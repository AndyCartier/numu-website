import type { Metadata } from 'next'
import { SubpageNav } from '@/components/SubpageNav'
import Link from 'next/link'
import { checkoutConfirmation } from '@/lib/commerce/confirmation'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Order status | NUMU Shop', description: 'Check the status of your NUMU order.',
  alternates: { canonical: '/shop/success' }, robots: { index: false, follow: false },
}

export default async function ShopSuccessPage({ searchParams }: { searchParams: { session_id?: string | string[] } }) {
  const state = await checkoutConfirmation(typeof searchParams.session_id === 'string' ? searchParams.session_id : undefined)
  const heading = state === 'paid' ? 'Order confirmed.' : state === 'pending' ? 'Payment pending.' : 'Your order status.'
  const message = state === 'paid'
    ? 'Payment has been received. Made-to-order lead times and delivery or collection details will be confirmed with your order acknowledgement.'
    : state === 'pending'
      ? 'Payment has not yet been confirmed. Please check your payment confirmation before attempting another order.'
      : 'We could not verify a payment from this link. If you have already paid, keep your payment confirmation and contact NUMU for help with your order.'
  return <main className="min-h-screen" style={{ background: '#f5f1e8', color: '#1a1714' }}>
    <SubpageNav currentPath="/shop" />
    <section className="px-6 md:px-12 py-24"><div className="max-w-[800px] mx-auto">
      <p className="font-sans uppercase tracking-[.18em]" style={{ fontSize: '.6875rem', opacity: .68 }}>NUMU / Shop</p>
      <h1 className="font-display mt-5" style={{ fontSize: 'clamp(3.5rem,8vw,7rem)', lineHeight: '.95', letterSpacing: '-.05em' }}>{heading}</h1>
      <p className="font-sans mt-8 leading-[1.8]" style={{ opacity: .76 }}>{message}</p>
      <Link href="/shop" className="shop-cta mt-10 inline-block">Return to shop</Link>
      {state !== 'paid' && <Link href="/connect" className="review-link mt-6 ml-6">Contact NUMU</Link>}
    </div></section>
  </main>
}
