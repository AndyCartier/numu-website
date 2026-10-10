import type { Metadata } from 'next'
import Image from '@/components/SafariSafeImage'
import Link from 'next/link'
import { SubpageNav } from '@/components/SubpageNav'
import { buildAbsoluteUrl, SITE_URL } from '@/lib/site'

const pageTitle = 'NUMU x Titans Space Industries | Mycelium ISRU Composites Partnership'
const pageDescription =
  'NUMU and Titans Space Industries signed an MOU to explore mycelium bio-materials and ISRU composites for resource-constrained and extreme environments.'
const heroImage = '/images/partnerships/tsi-official-orbitalport.jpg'
const secondaryImage = '/images/partnerships/tsi-official-spaceplane-frontal.jpg'
const BORDER = '1px solid rgba(128,128,128,0.15)'

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: [
    'Titans Space Industries',
    'TSI partnership',
    'mycelium ISRU composites',
    'space biomaterials partnership',
    'NUMU space materials',
  ],
  alternates: {
    canonical: '/partnerships/titans-space',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: '/partnerships/titans-space',
    type: 'article',
    siteName: 'NUMU',
    images: [
      {
        url: heroImage,
        width: 1600,
        height: 900,
        alt: 'Titans Space Industries orbital transport concept image sourced from official TSI media',
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

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'NUMU',
  url: SITE_URL,
  logo: buildAbsoluteUrl('/branding/logo-black-numu.png').toString(),
  description:
    'NUMU is a Dubai-based bio-composite materials company developing mycelium acoustic panels, insulation pathways, and ISRU composites research.',
  knowsAbout: [
    'Mycelium biomanufacturing',
    'Bio-composite materials',
    'ISRU composites',
    'Regional agricultural feedstock',
  ],
  memberOf: {
    '@type': 'Organization',
    name: 'Titans Space Industries',
    url: 'https://titansspace.com/',
  },
}

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: pageTitle,
  description: pageDescription,
  image: buildAbsoluteUrl(heroImage).toString(),
  author: {
    '@type': 'Organization',
    name: 'NUMU',
  },
  publisher: {
    '@type': 'Organization',
    name: 'NUMU',
    logo: {
      '@type': 'ImageObject',
      url: buildAbsoluteUrl('/branding/logo-black-numu.png').toString(),
    },
  },
  mainEntityOfPage: buildAbsoluteUrl('/partnerships/titans-space').toString(),
}

function PageLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-sans uppercase tracking-[0.18em] mb-5" style={{ fontSize: '0.6875rem', opacity: 0.56 }}>
      {children}
    </p>
  )
}

function PageSection({
  id,
  label,
  title,
  children,
}: {
  id: string
  label: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="px-6 md:px-12 py-20 md:py-28" style={{ borderTop: BORDER }}>
      <div className="max-w-[1120px] mx-auto grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-16">
        <div>
          <PageLabel>{label}</PageLabel>
          <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 4rem)', lineHeight: '0.98', letterSpacing: '-0.04em' }}>
            {title}
          </h2>
        </div>
        <div className="space-y-5">
          {children}
        </div>
      </div>
    </section>
  )
}

export default function TitansSpacePartnershipPage() {
  return (
    <main style={{ backgroundColor: '#f5f1e8', color: '#1a1714', minHeight: '100vh' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <SubpageNav currentPath="/partnerships/titans-space" />

      <header className="px-6 md:px-12 py-20 md:py-28">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_0.9fr] gap-12 lg:gap-20 items-end">
          <div>
            <PageLabel>Strategic partnership</PageLabel>
            <h1 className="font-display mb-8 max-w-4xl" style={{ fontSize: 'clamp(3rem, 8vw, 8.5rem)', lineHeight: '0.88', letterSpacing: '-0.05em' }}>
              NUMU x Titans Space Industries
            </h1>
            <p className="font-sans leading-[1.75] max-w-2xl" style={{ fontSize: '1.0625rem', opacity: 0.64 }}>
              NUMU and Titans Space Industries have signed a Memorandum of Understanding designating NUMU as the consortium&apos;s Bio-Materials and ISRU Composites Partner. This page frames that work as exploration, local resource logic taken into more extreme conditions.
            </p>
          </div>
          <div>
            <div className="relative overflow-hidden" style={{ aspectRatio: '16/10', backgroundColor: 'rgba(128,128,128,0.06)' }}>
            <Image
              src={heroImage}
              alt="Titans Space Industries orbital transport concept image"
              data-lightbox-caption="Official Titans Space Industries concept imagery, used here to frame the partnership in its intended orbital infrastructure context."
              fill
              className="object-cover object-center"
              style={{ objectPosition: 'center center' }}
              sizes="(max-width: 1024px) 100vw, 42vw"
              priority
              />
            </div>
          </div>
        </div>
      </header>

      <PageSection id="why-this-partnership" label="Why this partnership" title="The same logic applies off-world.">
        <p className="font-sans leading-[1.85]" style={{ fontSize: '1rem', opacity: 0.68 }}>
          ISRU means In-Situ Resource Utilization. In plain language, it means using what is already available in a place instead of importing every input from somewhere else.
        </p>
        <p className="font-sans leading-[1.85]" style={{ fontSize: '1rem', opacity: 0.62 }}>
          That is already NUMU&apos;s GCC thesis. The region imports nearly 100% of synthetic foam materials. NUMU builds a local manufacturing platform from local biomass, turning regional agricultural waste into feedstock for acoustics, insulation, and composites.
        </p>
        <p className="font-sans leading-[1.85]" style={{ fontSize: '1rem', opacity: 0.58 }}>
          In resource-constrained and extreme environments, the constraint is even sharper. You cannot ship everything in. The same material logic becomes ISRU composites research. Mycelium is relevant because it can grow structure from available organic inputs under controlled conditions.
        </p>
      </PageSection>

      <PageSection id="scope-of-collaboration" label="Scope of collaboration" title="Exploratory, non-commercial, and focused.">
        <p className="font-sans leading-[1.85]" style={{ fontSize: '1rem', opacity: 0.68 }}>
          The MOU is a non-binding agreement to explore mycelium-based composites and structures for resource-constrained and extreme environments.
        </p>
        <p className="font-sans leading-[1.85]" style={{ fontSize: '1rem', opacity: 0.62 }}>
          NUMU&apos;s role is to contribute bio-materials and ISRU composites knowledge to the consortium. The collaboration is exploratory and research-stage only.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px pt-6" style={{ backgroundColor: 'rgba(128,128,128,0.12)' }}>
          {[
            ['Status', 'MOU signed'],
            ['Role', 'Bio-Materials and ISRU Composites Partner'],
            ['Focus', 'Extreme environment material exploration'],
          ].map(([label, value]) => (
            <div key={label} className="px-5 py-6" style={{ backgroundColor: 'rgba(26,23,20,0.025)' }}>
              <p className="font-sans uppercase tracking-[0.14em] mb-3" style={{ fontSize: '0.5625rem', opacity: 0.38 }}>{label}</p>
              <p className="font-sans leading-snug" style={{ fontSize: '0.9375rem', opacity: 0.72 }}>{value}</p>
            </div>
          ))}
        </div>
      </PageSection>

      <PageSection id="why-mycelium" label="Why this matters" title="Earth limits and space limits are different in scale, similar in logic.">
        <p className="font-sans leading-[1.85]" style={{ fontSize: '1rem', opacity: 0.68 }}>
          On Earth, NUMU asks how the UAE can reduce dependence on imported plastics and foams by using what exists locally. In space, ISRU asks the same core question under harsher constraints. What can be made on site, from available resources, with minimal external dependency.
        </p>
        <p className="font-sans leading-[1.85]" style={{ fontSize: '1rem', opacity: 0.62 }}>
          That is why mycelium is relevant here. It suggests a route to structure through growth, not only machining. The partnership is about exploring that principle seriously, not overstating what is ready today.
        </p>
      </PageSection>

      <PageSection id="agreement-frame" label="Agreement frame" title="A real MOU, exploratory by design.">
        <p className="font-sans leading-[1.85]" style={{ fontSize: '1rem', opacity: 0.68 }}>
          The signed MOU took effect on 28 May 2026. It establishes a non-binding framework of strategic alignment between NUMU and Lachman Capital Partners LLC on behalf of Titans Space Industries.
        </p>
        <p className="font-sans leading-[1.85]" style={{ fontSize: '1rem', opacity: 0.62 }}>
          It positions NUMU as the principal bio-materials and ISRU composites partner within the Space & Lunar Economy Consortium and sets the basis for future work around research, payload experimentation, technical roadmaps, and partnership visibility.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-4 pt-4 items-start">
          <div className="relative overflow-hidden" style={{ aspectRatio: '4/3', backgroundColor: 'rgba(26,23,20,0.04)' }}>
            <Image
              src={secondaryImage}
              alt="Titans Space Industries reusable spaceplane concept image"
              data-lightbox-caption="Official Titans Space Industries spaceplane imagery, used here to anchor the partnership in the transport and orbital systems context behind the collaboration."
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 60vw"
            />
          </div>
          <div className="grid grid-cols-1 gap-px" style={{ backgroundColor: 'rgba(128,128,128,0.12)' }}>
            {[
              ['Effective date', '28 May 2026'],
              ['Nature', 'Non-binding MOU'],
              ['Designation', 'Bio-Materials and ISRU Composites Partner'],
              ['Scope', 'Lunar, orbital, and closed-loop material exploration'],
            ].map(([label, value]) => (
              <div key={label} className="px-5 py-6" style={{ backgroundColor: 'rgba(26,23,20,0.025)' }}>
                <p className="font-sans uppercase tracking-[0.14em] mb-3" style={{ fontSize: '0.5625rem', opacity: 0.38 }}>{label}</p>
                <p className="font-sans leading-snug" style={{ fontSize: '0.9375rem', opacity: 0.72 }}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      </PageSection>

      <PageSection id="about-titans-space" label="About Titans Space Industries" title="Reusable spaceplanes and orbital infrastructure.">
        <div className="relative overflow-hidden mb-6" style={{ aspectRatio: '16/9', backgroundColor: 'rgba(26,23,20,0.04)' }}>
          <Image
            src="/images/partnerships/tsi-announcement-04.jpg"
            alt="Signed memorandum of understanding between NUMU and Titans Space Industries"
            data-lightbox-caption="The signed MOU between NUMU and Titans Space Industries, marking the exploratory framework behind the partnership."
            fill
            className="object-cover object-center"
            sizes="(max-width: 1120px) 100vw, 60vw"
          />
        </div>
        <p className="font-sans leading-[1.85]" style={{ fontSize: '1rem', opacity: 0.68 }}>
          Titans Space Industries is an Orlando-based developer of reusable spaceplanes and orbital infrastructure, led by founder and CEO Neal S. Lachman.
        </p>
        <p className="font-sans leading-[1.85]" style={{ fontSize: '1rem', opacity: 0.62 }}>
          The company works on space transportation and infrastructure systems. Learn more at{' '}
          <a href="https://titansspace.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline', textDecorationThickness: 1, textUnderlineOffset: 4 }}>
            titansspace.com
          </a>.
        </p>
      </PageSection>

      {/*
        TODO Andy: add approved quote block here only after both quotes are final.
        Quote placeholder 1: Andy Cartier, founder and CEO, NUMU.
        Quote placeholder 2: Neal S. Lachman, founder and CEO, Titans Space Industries.
      */}

      <section className="px-6 md:px-12 py-20 md:py-28" style={{ borderTop: BORDER }}>
        <div className="max-w-[1120px] mx-auto">
          <PageLabel>Next step</PageLabel>
          <h2 className="font-display mb-8 max-w-3xl" style={{ fontSize: 'clamp(2.5rem, 6vw, 6.5rem)', lineHeight: '0.9', letterSpacing: '-0.05em' }}>
            From regional feedstock to material platforms.
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/partnerships"
              className="font-sans text-label uppercase tracking-[0.14em] px-7 py-4 border inline-block"
              style={{ borderColor: 'rgba(128,128,128,0.28)', color: 'inherit', textDecoration: 'none' }}
            >
              All partnerships →
            </Link>
            <Link
              href="/#platform-without-borders"
              className="font-sans text-label uppercase tracking-[0.14em] px-7 py-4 border inline-block"
              style={{ borderColor: 'rgba(26,23,20,0.65)', backgroundColor: 'rgba(26,23,20,0.09)', color: 'inherit', textDecoration: 'none' }}
            >
              Back to the platform →
            </Link>
            <Link
              href="/#contact"
              className="font-sans text-label uppercase tracking-[0.14em] px-7 py-4 border inline-block"
              style={{ borderColor: 'rgba(128,128,128,0.28)', color: 'inherit', textDecoration: 'none' }}
            >
              Contact NUMU →
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
