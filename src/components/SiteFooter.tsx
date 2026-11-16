import Link from 'next/link'
import { NUMU_NAP } from '@/lib/siteFacts'
import { DESIGN } from '@/lib/design'
import GrowButton from '@/components/eggs/GrowButton'
import { CHAPTERS } from '@/lib/chapters'

const FOOTER_LINKS = [
  ...CHAPTERS.map(c => [c.href, c.name] as const),
  ['/faq', 'FAQ'] as const,
]

// Search paths by application, moved here from the home page's contact section.
const APPLICATION_LINKS = [
  ['/acoustic-panels-dubai', 'Acoustic panels, Dubai'],
  ['/thermal-insulation-uae', 'Thermal insulation, UAE'],
  ['/mycelium-packaging-uae', 'Mycelium packaging, UAE'],
] as const

export default function SiteFooter() {
  if (DESIGN.footerClose) return <FooterClose />
  return (
    <footer style={{ backgroundColor: '#14110e', color: '#f5f1e8', borderTop: '1px solid rgba(245,241,232,0.14)' }}>
      <div className="mx-auto grid grid-cols-1 gap-8 px-6 py-10 md:grid-cols-[1.35fr_0.65fr] md:px-12" style={{ maxWidth: 1440 }}>
        <address className="not-italic" style={{ fontStyle: 'normal' }}>
          <p className="font-sans uppercase tracking-[0.18em]" style={{ fontSize: '0.75rem', opacity: 0.68 }}>Contact & registered premises</p>
          <p className="font-sans mt-4" style={{ fontSize: '0.875rem', lineHeight: 1.7, opacity: 0.78 }}>{NUMU_NAP.legalName}</p>
          <p className="font-sans" style={{ fontSize: '0.875rem', lineHeight: 1.7, opacity: 0.68 }}>{NUMU_NAP.address}</p>
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
            <Link key={href} href={href} className="font-sans uppercase tracking-[0.14em]" style={{ fontSize: '0.75rem', color: 'inherit', opacity: 0.62, textDecoration: 'none' }}>{label}</Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}

/** The footer as a designed close: who to write to, where NUMU is registered, and the name at full width. */
function FooterClose() {
  return (
    <footer className="numu-footer">
      <div className="numu-footer-inner">
        <div className="numu-footer-top">
          <div>
            <p className="numu-footer-lead">Samples, specification and projects.</p>
            <a href={`mailto:${NUMU_NAP.email}`} className="numu-footer-mail">{NUMU_NAP.email}</a>
          </div>
          <nav aria-label="Footer navigation" className="numu-footer-nav">
            {FOOTER_LINKS.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}
            {APPLICATION_LINKS.map(([href, label]) => <Link key={href} href={href} className="numu-footer-app">{label}</Link>)}
          </nav>
          <address className="numu-footer-address">
            <span>{NUMU_NAP.legalName}</span>
            <span>{NUMU_NAP.address}</span>
          </address>
        </div>
        <p className="numu-footer-word" aria-hidden="true">NUMU<span lang="ar" dir="rtl">نُمُوّ</span></p>
        <div className="numu-footer-base">
          <span>© {new Date().getFullYear()} NUMU. Grown in Dubai.</span>
          <span className="numu-footer-controls">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            {DESIGN.eggs && <GrowButton />}
            <a href="#">Back to top ↑</a>
          </span>
        </div>
      </div>
    </footer>
  )
}
