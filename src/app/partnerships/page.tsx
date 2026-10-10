import type { Metadata } from 'next'
import Image from '@/components/SafariSafeImage'
import Link from 'next/link'
import { SubpageNav } from '@/components/SubpageNav'

const pageTitle = 'NUMU Partnerships | Research, design, and future material collaborations'
const pageDescription =
  'NUMU partnerships connect mycelium materials, design collaborations, and future-facing ISRU exploration, including the Titans Space Industries materials partnership.'

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: '/partnerships',
  },
  openGraph: {
    title: pageTitle,
      description: pageDescription,
    url: '/partnerships',
    type: 'website',
    siteName: 'NUMU',
    images: [
      {
        url: '/images/partnerships/tsi-announcement-02.jpg',
        width: 1600,
        height: 900,
        alt: 'NUMU partnership and ISRU composites visual',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: pageTitle,
    description: pageDescription,
    images: ['/images/partnerships/tsi-announcement-02.jpg'],
  },
}

const BORDER = '1px solid rgba(128,128,128,0.15)'

export default function PartnershipsPage() {
  return (
    <main style={{ backgroundColor: '#f5f1e8', color: '#1a1714', minHeight: '100vh' }}>
      <SubpageNav currentPath="/partnerships" />

      <header className="px-6 md:px-12 py-16 md:py-24">
        <div className="max-w-[1320px] mx-auto grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 items-end">
          <div className="max-w-2xl">
            <p className="font-sans uppercase tracking-[0.18em]" style={{ fontSize: '0.6875rem', opacity: 0.52 }}>
              Partnerships
            </p>
            <h1 className="font-display mt-5 mb-7" style={{ fontSize: 'clamp(3rem, 7vw, 7rem)', lineHeight: '1', letterSpacing: '-0.03em' }}>
              Collaborations that extend the material logic.
            </h1>
            <p className="font-sans leading-[1.85]" style={{ fontSize: '1rem', opacity: 0.64 }}>
              These collaborations show where the material logic can travel next, from design-led outcomes to future-facing ISRU exploration. Not every conversation needs a formal page, and not every early exploration should read as a finished partnership.
            </p>
          </div>
          <div className="relative overflow-hidden" style={{ aspectRatio: '4 / 3', backgroundColor: 'rgba(26,23,20,0.04)' }}>
            <Image
              src="/images/partnerships/tsi-announcement-02.jpg"
              alt="Extreme environment concept for mycelium and ISRU composites"
              data-lightbox-caption="TSI partnership announcement image, positioning mycelium materials as part of a future-facing ISRU research frame."
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 55vw"
            />
          </div>
        </div>
      </header>

      <section className="px-6 md:px-12 py-16 md:py-24" style={{ borderTop: BORDER }}>
        <div className="max-w-[1120px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16">
            <div>
              <p className="font-sans uppercase tracking-[0.18em]" style={{ fontSize: '0.6875rem', opacity: 0.52 }}>
                Featured partnership
              </p>
              <h2 className="font-display mt-5" style={{ fontSize: 'clamp(2.2rem, 4vw, 4.5rem)', lineHeight: '1.02', letterSpacing: '-0.025em' }}>
                NUMU x Titans Space Industries
              </h2>
            </div>
            <div className="space-y-5">
              <p className="font-sans leading-[1.85]" style={{ fontSize: '1rem', opacity: 0.66 }}>
                NUMU has signed an MOU with Titans Space Industries as its Bio-Materials and ISRU Composites Partner. The collaboration explores how mycelium material logic applies when local resource use is not just efficient, but necessary.
              </p>
              <p className="font-sans leading-[1.85]" style={{ fontSize: '1rem', opacity: 0.58 }}>
                The GCC thesis and the ISRU thesis share the same foundation. You build with what is available in place, rather than shipping in every material dependency. That is why TSI sits here as a future-facing exploration. Other early conversations, including BioMyc, stay intentionally light until they mature further.
              </p>
              <Link
                href="/partnerships/titans-space"
                className="font-sans uppercase tracking-[0.14em] inline-block pt-2"
                style={{ fontSize: '0.6875rem', color: 'inherit', textDecoration: 'none', borderBottom: '1px solid rgba(26,23,20,0.34)', paddingBottom: 6 }}
              >
                Read the TSI partnership page →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
