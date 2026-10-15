import type { Metadata } from 'next'
import Image from '@/components/SafariSafeImage'
import Link from 'next/link'
import { SubpageNav } from '@/components/SubpageNav'
import { buildAbsoluteUrl, SITE_URL } from '@/lib/site'

const pageTitle = 'FOLD | Grown acoustic wall panels by NUMU'
const pageDescription =
  'FOLD is NUMU’s grown acoustic panel system, using PALMYCO mycelium composite to create tactile, architectural surfaces for interiors in the UAE.'
const heroImage = '/images/products/fold_hero_interior.png'
const detailImage = '/images/catalogue/fold/fold-surface-closeup.jpg'
const contextImage = '/images/products/fold_context_scale.png'
const BORDER = '1px solid rgba(128,128,128,0.15)'

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: '/fold',
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: '/fold',
    type: 'article',
    siteName: 'NUMU',
    images: [
      {
        url: heroImage,
        width: 1600,
        height: 1200,
        alt: 'FOLD acoustic panels in an interior setting',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: pageTitle,
    description: pageDescription,
    images: [heroImage],
  },
}

const foldProductJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'FOLD',
  description: 'FOLD is NUMU’s first product built on the PALMYCO material system: an acoustic wall panel for interiors.',
  image: buildAbsoluteUrl(heroImage).toString(),
  material: 'PALMYCO',
  brand: { '@type': 'Brand', name: 'NUMU' },
  manufacturer: { '@type': 'Organization', name: 'NUMU', url: SITE_URL },
  additionalProperty: [
    { '@type': 'PropertyValue', name: 'Module', value: '400mm x 400mm, 60mm nominal thickness (provisional)' },
    { '@type': 'PropertyValue', name: 'Acoustic performance', value: 'NRC 0.72-0.80 (target, certification in progress)' },
    { '@type': 'PropertyValue', name: 'Fire performance', value: 'ASTM E84 Class B (target, certification in progress)' },
    { '@type': 'PropertyValue', name: 'Origin', value: 'Dubai, UAE' },
    { '@type': 'PropertyValue', name: 'End of life', value: 'home-compostable' },
  ],
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-sans uppercase tracking-[0.18em]" style={{ fontSize: '0.6875rem', opacity: 0.52 }}>
      {children}
    </p>
  )
}

export default function FoldPage() {
  return (
    <main style={{ backgroundColor: '#f5f1e8', color: '#1a1714', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(foldProductJsonLd) }} />
      <SubpageNav currentPath="/fold" />

      <header className="px-6 md:px-12 py-16 md:py-24">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[0.92fr_1.08fr] gap-10 lg:gap-16 items-end">
          <div className="max-w-2xl">
            <Label>Architectural product</Label>
            <h1
              className="font-display mt-5 mb-8"
              style={{ fontSize: 'clamp(3rem, 8vw, 8rem)', lineHeight: '0.98', letterSpacing: '-0.03em' }}
            >
              FOLD
            </h1>
            <p className="font-sans leading-[1.8] mb-5" style={{ fontSize: '1.05rem', opacity: 0.66 }}>
              FOLD is NUMU’s acoustic wall panel system, the first architectural expression of the PALMYCO™ platform. It turns grown material into a tactile, performance-led surface for interiors.
            </p>
            <p className="font-sans leading-[1.8]" style={{ fontSize: '0.98rem', opacity: 0.58 }}>
              This is where the platform becomes legible at building scale, not as a concept render, but as a repeatable product language for acoustic environments.
            </p>
          </div>

          <div className="relative overflow-hidden" style={{ aspectRatio: '4 / 3', backgroundColor: 'rgba(26,23,20,0.04)' }}>
            <Image
              src={heroImage}
              alt="FOLD acoustic panels used in a refined interior"
              data-lightbox-caption="FOLD in use, where the PALMYCO™ material platform becomes an interior acoustic surface."
              fill
              priority
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 54vw"
            />
          </div>
        </div>
      </header>

      <section className="px-6 md:px-12 py-16 md:py-24" style={{ borderTop: BORDER }}>
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-16 items-start">
          <div className="relative overflow-hidden" style={{ aspectRatio: '4 / 5', backgroundColor: 'rgba(26,23,20,0.04)' }}>
            <Image
              src={detailImage}
              alt="Low sunlight across the grown relief of FOLD panels, showing the palm-fibre texture"
              data-lightbox-caption="Real grown FOLD panels in the Dubai lab: texture, porosity and geometry carry the material identity."
              fill
              className="object-cover" style={{ objectPosition: '50% 82%' }}
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div>
            <Label>Why it matters</Label>
            <h2 className="font-display mt-5 mb-7" style={{ fontSize: 'clamp(2.2rem, 5vw, 5rem)', lineHeight: '1.02', letterSpacing: '-0.025em' }}>
              A first product, not the whole story.
            </h2>
            <div className="space-y-5">
              <p className="font-sans leading-[1.85]" style={{ fontSize: '1rem', opacity: 0.66 }}>
                FOLD matters because it proves that regional waste can become a useful, desirable architectural material. It is the first clear application, but it is not the limit of the platform.
              </p>
              <p className="font-sans leading-[1.85]" style={{ fontSize: '1rem', opacity: 0.6 }}>
                The panel system gives designers a direct way to specify grown matter in interior space, while keeping the material story visible through texture, depth, and warmth.
              </p>
              <p className="font-sans leading-[1.85]" style={{ fontSize: '1rem', opacity: 0.56 }}>
                From here, the same material logic can move into insulation, packaging, composites, and future construction pathways.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-px mt-10" style={{ backgroundColor: 'rgba(128,128,128,0.12)' }}>
              {[
                ['Application', 'Acoustic wall systems'],
                ['Material', 'PALMYCO™ mycelium composite'],
                ['Role', 'First architectural product'],
              ].map(([label, value]) => (
                <div key={label} className="px-5 py-6" style={{ backgroundColor: 'rgba(26,23,20,0.025)' }}>
                  <p className="font-sans uppercase tracking-[0.14em] mb-3" style={{ fontSize: '0.5625rem', opacity: 0.38 }}>{label}</p>
                  <p className="font-sans leading-snug" style={{ fontSize: '0.9375rem', opacity: 0.72 }}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 py-16 md:py-24" style={{ borderTop: BORDER }}>
        <div className="max-w-[1440px] mx-auto">
          <div className="max-w-3xl mb-10">
            <Label>Architectural scale</Label>
            <h2 className="font-display mt-5 mb-7" style={{ fontSize: 'clamp(2.2rem, 5vw, 5rem)', lineHeight: '1.02', letterSpacing: '-0.025em' }}>
              Built to sit inside real projects.
            </h2>
            <p className="font-sans leading-[1.85]" style={{ fontSize: '1rem', opacity: 0.62 }}>
              FOLD is designed to live inside refined interiors, where performance matters and the material has to hold its own visually. The ambition is quiet confidence, not novelty for its own sake.
            </p>
          </div>

          <div className="relative overflow-hidden" style={{ aspectRatio: '16 / 9', backgroundColor: 'rgba(26,23,20,0.04)' }}>
            <Image
              src={contextImage}
              alt="FOLD shown at room scale in context"
              data-lightbox-caption="FOLD at room scale, showing how the material reads in a finished interior context."
              fill
              className="object-cover object-center"
              sizes="100vw"
            />
          </div>

          <div className="pt-10">
            <div className="flex flex-wrap gap-x-8 gap-y-4">
              <Link
                href="/shop/fold"
                className="font-sans uppercase tracking-[0.14em] inline-block"
                style={{ fontSize: '0.6875rem', color: 'inherit', textDecoration: 'none', borderBottom: '1px solid rgba(26,23,20,0.8)', paddingBottom: 6 }}
              >
                Request a quote for FOLD →
              </Link>
              <Link
                href="/#moodboards"
                className="font-sans uppercase tracking-[0.14em] inline-block"
                style={{ fontSize: '0.6875rem', color: 'inherit', textDecoration: 'none', borderBottom: '1px solid rgba(26,23,20,0.34)', paddingBottom: 6 }}
              >
                View hospitality & workplace studies →
              </Link>
              <Link
                href="/acoustic-panels-dubai"
                className="font-sans uppercase tracking-[0.14em] inline-block"
                style={{ fontSize: '0.6875rem', color: 'inherit', textDecoration: 'none', borderBottom: '1px solid rgba(26,23,20,0.34)', paddingBottom: 6 }}
              >
                View the acoustic product page →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
