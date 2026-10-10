import type { Metadata } from 'next'
import Link from 'next/link'
import { FAQ_ITEMS } from '@/lib/siteFacts'

export const metadata: Metadata = {
  title: 'NUMU FAQ | PALMYCO and FOLD acoustic panels',
  description: 'Answers to common questions about PALMYCO, FOLD acoustic panels, testing, lead times, humidity, and pricing.',
  alternates: { canonical: '/faq' },
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map(({ question, answer }) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer },
  })),
}

export default function FaqPage() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f5f1e8', color: '#1a1714' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <div className="mx-auto px-6 py-16 md:px-12 md:py-24" style={{ maxWidth: 980 }}>
        <Link href="/" className="font-sans uppercase tracking-[0.16em]" style={{ fontSize: '0.6875rem', color: 'inherit', opacity: 0.6, textDecoration: 'none' }}>NUMU / Home</Link>
        <p className="font-sans uppercase tracking-[0.18em] mt-16" style={{ fontSize: '0.6875rem', opacity: 0.5 }}>Frequently asked questions</p>
        <h1 className="font-display mt-5 mb-14" style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', lineHeight: 1.02, letterSpacing: '-0.025em' }}>PALMYCO and FOLD, explained.</h1>
        <div style={{ borderTop: '1px solid rgba(26,23,20,0.16)' }}>
          {FAQ_ITEMS.map(({ question, answer }) => (
            <section key={question} className="py-9 md:py-11" style={{ borderBottom: '1px solid rgba(26,23,20,0.12)' }}>
              <h2 className="font-display mb-5" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.6rem)', lineHeight: 1.02, letterSpacing: '-0.03em' }}>{question}</h2>
              <p className="font-sans" style={{ fontSize: '1rem', lineHeight: 1.85, opacity: 0.74, maxWidth: 760 }}>{answer}</p>
            </section>
          ))}
        </div>
      </div>
    </main>
  )
}
