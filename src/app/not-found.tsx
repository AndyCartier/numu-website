import Link from 'next/link'
import { SubpageNav } from '@/components/SubpageNav'
import GrowButton from '@/components/eggs/GrowButton'
import { DESIGN } from '@/lib/design'

export default function NotFound() {
  return (
    <main className="min-h-screen" style={{ background: '#f5f1e8', color: '#1a1714' }}>
      <SubpageNav currentPath="/404" />
      <section className="px-6 md:px-12 py-24 md:py-32">
        <div className="max-w-[1180px] mx-auto">
          <p className="font-sans uppercase tracking-[0.18em]" style={{ fontSize: '0.75rem', opacity: 0.6 }}>404 — Page not found</p>
          <h1 className="font-display mt-6 max-w-3xl" style={{ fontSize: 'clamp(2.6rem, 6vw, 5.5rem)', lineHeight: 1, letterSpacing: '-0.035em' }}>
            This page has not grown here.
          </h1>
          <p className="font-sans mt-8 max-w-xl leading-[1.8]" style={{ fontSize: '1rem', opacity: 0.66 }}>
            The link may be out of date, or the page may have moved. These are good places to continue.
          </p>
          {DESIGN.eggs && <p className="mt-6"><GrowButton label="Or let something grow here" className="numu-link" /></p>}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px" style={{ backgroundColor: 'rgba(128,128,128,0.15)' }}>
            {[
              ['/shop', 'Objects & Surfaces', 'Products, by inquiry'],
              ['/fold', 'FOLD', 'Grown acoustic panels'],
              ['/mushroomiya', 'Mushroomiya', 'The grown pendant dome'],
              ['/#contact', 'Contact', 'Samples and projects'],
            ].map(([href, title, note]) => (
              <Link key={href} href={href} className="block p-6" style={{ backgroundColor: '#f5f1e8', color: 'inherit', textDecoration: 'none' }}>
                <p className="font-display" style={{ fontSize: '1.4rem' }}>{title} →</p>
                <p className="font-sans mt-2" style={{ fontSize: '0.82rem', opacity: 0.6 }}>{note}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
