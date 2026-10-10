import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Project and order inquiry | NUMU Shop',
  description: 'Discuss a NUMU project, product specification or international order.',
  alternates: { canonical: '/shop/international' }, robots: { index: false, follow: true },
}
export default function InquiryLayout({ children }: { children: React.ReactNode }) { return children }
