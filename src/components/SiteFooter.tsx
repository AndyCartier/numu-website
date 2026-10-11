import Link from 'next/link'
import { NUMU_NAP } from '@/lib/siteFacts'

export default function SiteFooter() {
  return (
    <footer style={{ backgroundColor: '#14110e', color: '#f5f1e8', borderTop: '1px solid rgba(245,241,232,0.14)' }}>
      <div className="mx-auto grid grid-cols-1 gap-8 px-6 py-10 md:grid-cols-[1.35fr_0.65fr] md:px-12" style={{ maxWidth: 1440 }}>
        <address className="not-italic" style={{ fontStyle: 'normal' }}>
          <p className="font-sans uppercase tracking-[0.18em]" style={{ fontSize: '0.6875rem', opacity: 0.68 }}>Contact & registered premises</p>
          <p className="font-sans mt-4" style={{ fontSize: '0.875rem', lineHeight: 1.7, opacity: 0.78 }}>{NUMU_NAP.legalName}</p>
          <p className="font-sans" style={{ fontSize: '0.875rem', lineHeight: 1.7, opacity: 0.68 }}>{NUMU_NAP.address}</p>
          <p className="font-sans mt-3" style={{ fontSize: '0.75rem', lineHeight: 1.7, opacity: 0.5 }}>Licence No. {NUMU_NAP.licenceNumber} · Premises {NUMU_NAP.premises} · Makani {NUMU_NAP.makani}</p>
          <a href={`mailto:${NUMU_NAP.email}`} className="font-sans inline-block mt-4" style={{ fontSize: '0.875rem', color: 'inherit', opacity: 0.88 }}>{NUMU_NAP.email}</a>
        </address>
        <nav aria-label="Footer navigation" className="flex flex-wrap content-start gap-x-5 gap-y-3 md:justify-end">
          {[
            ['/', 'Home'],
            ['/shop', 'Products'],
            ['/mushroomiya', 'Mushroomiya'],
            ['/case-studies', 'Projects'],
            ['/partnerships', 'Partnerships'],
            ['/palmyco', 'PALMYCO'],
            ['/fold', 'FOLD'],
            ['/faq', 'FAQ'],
            ['/privacy', 'Privacy'],
            ['/terms', 'Terms'],
          ].map(([href, label]) => (
            <Link key={href} href={href} className="font-sans uppercase tracking-[0.14em]" style={{ fontSize: '0.625rem', color: 'inherit', opacity: 0.62, textDecoration: 'none' }}>{label}</Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}
