import type { Metadata } from 'next'
import { ProcessBlock, ProductionFeature, LabBlock, ProcessCarousel, ManifestoBlock, TeamBlock } from '@/app/PageClient'
import { loadPublicTeamMembers } from '@/lib/content'
import ChapterNav from '@/components/ChapterNav'
import Image from '@/components/SafariSafeImage'
import Link from 'next/link'
import { SubpageNav } from '@/components/SubpageNav'

const pageTitle = 'About NUMU | Growth, regional material systems, and mycelium design in the UAE'
const pageDescription =
  'About NUMU, a UAE bio-composites platform turning regional agricultural waste into mycelium materials. Learn the meaning of NUMU, its vision, mission, and working values.'
const heroImage = '/images/founder/founder_in_action.jpg'
const BORDER = '1px solid rgba(128,128,128,0.15)'

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: '/about',
    type: 'website',
    siteName: 'NUMU',
    images: [
      {
        url: heroImage,
        width: 1600,
        height: 1200,
        alt: 'NUMU founder working with mycelium material',
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

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-sans uppercase tracking-[0.18em]" style={{ fontSize: '0.75rem', opacity: 0.52 }}>
      {children}
    </p>
  )
}

export default function AboutPage() {
  return (
    <main style={{ backgroundColor: '#f5f1e8', color: '#1a1714', minHeight: '100vh' }}>
      <SubpageNav currentPath="/about" />

      <header className="px-6 md:px-12 py-16 md:py-24">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[0.92fr_1.08fr] gap-10 lg:gap-16 items-end">
          <div className="max-w-2xl">
            <Label>About NUMU</Label>
            <h1
              className="font-display mt-5 mb-8"
              style={{ fontSize: 'clamp(3rem, 8vw, 8rem)', lineHeight: '0.98', letterSpacing: '-0.03em' }}
            >
              Growth, in name and in method.
            </h1>
            <p className="font-sans leading-[1.8] mb-5" style={{ fontSize: '1.05rem', opacity: 0.66 }}>
              NUMU builds mycelium material systems in the UAE from what the region already has, agricultural waste, biomass, and overlooked feedstocks. The goal is not one symbolic object. It is a local manufacturing logic.
            </p>
            <p className="font-sans leading-[1.8]" style={{ fontSize: '0.98rem', opacity: 0.58 }}>
              The name comes from the Arabic word <span lang="ar" dir="rtl" style={{ fontFamily: '"Geeza Pro", "Noto Naskh Arabic", serif' }}>نُمُوّ</span>, meaning growth, emergence, and development. That matters to us because the company is rooted in the GCC, and because growth is also how the material itself is formed.
            </p>
          </div>

          <div className="relative overflow-hidden" style={{ aspectRatio: '4 / 3', backgroundColor: 'rgba(26,23,20,0.04)' }}>
            <Image
              src={heroImage}
              alt="Founder working with mycelium material in the studio"
              data-lightbox-caption="NUMU in practice, working directly with grown material and regional feedstock experiments."
              fill
              priority
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 54vw"
            />
          </div>
        </div>
      </header>

      <section className="px-6 md:px-12 py-16 md:py-24" style={{ borderTop: BORDER }}>
        <div className="max-w-[1120px] mx-auto grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16">
          <div>
            <Label>Why NUMU</Label>
            <h2 className="font-display mt-5" style={{ fontSize: 'clamp(2.2rem, 5vw, 5rem)', lineHeight: '1.02', letterSpacing: '-0.025em' }}>
              A material company named for what living systems do.
            </h2>
          </div>
          <div className="space-y-5">
            <p className="font-sans leading-[1.85]" style={{ fontSize: '1rem', opacity: 0.66 }}>
              In Arabic, <span lang="ar" dir="rtl" style={{ fontFamily: '"Geeza Pro", "Noto Naskh Arabic", serif' }}>نُمُوّ</span> expresses growth, maturation, and becoming. NUMU keeps that meaning visible because our work is about materials that grow into form, and about building a regional platform that grows in relevance over time.
            </p>
            <p className="font-sans leading-[1.85]" style={{ fontSize: '1rem', opacity: 0.6 }}>
              The name also anchors the company in place. NUMU is not a generic clean-tech label. It reflects a GCC context, a bilingual identity, and a practical question: what happens when the region makes more of its own materials from its own waste streams.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 py-16 md:py-24" style={{ borderTop: BORDER }}>
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 xl:grid-cols-3 gap-px" style={{ backgroundColor: 'rgba(128,128,128,0.12)' }}>
          {[
            [
              'Vision',
              'Build a regional material culture where agricultural waste becomes architecture, products, and new manufacturing capacity.',
            ],
            [
              'Mission',
              'Develop mycelium-based material systems in the UAE that replace imported synthetic materials with locally grown alternatives.',
            ],
            [
              'Values',
              'Build with what is there. Lead with performance. Grow systems, not one-off gestures.',
            ],
          ].map(([label, value]) => (
            <div key={label} className="px-6 md:px-8 py-8 md:py-10" style={{ backgroundColor: 'rgba(26,23,20,0.025)' }}>
              <p className="font-sans uppercase tracking-[0.14em] mb-4" style={{ fontSize: '0.75rem', opacity: 0.38 }}>{label}</p>
              <p className="font-display mb-4" style={{ fontSize: '1.8rem', lineHeight: 0.98, letterSpacing: '-0.03em' }}>{label}</p>
              <p className="font-sans leading-[1.8]" style={{ fontSize: '0.98rem', opacity: 0.66 }}>{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-12 py-16 md:py-24" style={{ borderTop: BORDER }}>
        <div className="max-w-[1120px] mx-auto grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-16">
          <div>
            <Label>Working principles</Label>
            <h2 className="font-display mt-5" style={{ fontSize: 'clamp(2.2rem, 5vw, 4.75rem)', lineHeight: '1.02', letterSpacing: '-0.025em' }}>
              Material first, local first, system first.
            </h2>
          </div>
          <div className="space-y-6">
            {[
              ['Build with what is there', 'Regional waste is not a side note. It is the starting point for feedstock, logistics, and long-term viability.'],
              ['Lead with industrial reality', 'We talk about performance, replacement potential, and manufacturing logic before we talk about sustainability narratives.'],
              ['Grow systems, not one-offs', 'Products like FOLD and Mushroomiya matter because they prove a wider PALMYCO™ material platform.'],
            ].map(([title, body]) => (
              <div key={title} className="pb-6" style={{ borderBottom: BORDER }}>
                <p className="font-display mb-3" style={{ fontSize: '1.5rem', lineHeight: 1, letterSpacing: '-0.02em' }}>{title}</p>
                <p className="font-sans leading-[1.8]" style={{ fontSize: '0.98rem', opacity: 0.62 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 py-16 md:py-24" style={{ borderTop: BORDER }}>
        <div className="max-w-[1120px] mx-auto">
          <Label>Explore next</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px mt-6" style={{ backgroundColor: 'rgba(128,128,128,0.12)' }}>
            {[
              ['/palmyco', 'PALMYCO™', 'The material platform and feedstock logic.'],
              ['/fold', 'FOLD', 'The acoustic product that turns the platform into architecture.'],
              ['/mushroomiya', 'Mushroomiya', 'A grown statement lamp rooted in mashrabiya and mycelial pattern logic.'],
            ].map(([href, title, body]) => (
              <Link
                key={href}
                href={href}
                className="block px-6 md:px-8 py-8 md:py-10"
                style={{ backgroundColor: 'rgba(26,23,20,0.025)', color: 'inherit', textDecoration: 'none' }}
              >
                <p className="font-display mb-3" style={{ fontSize: '2rem', lineHeight: 0.95, letterSpacing: '-0.03em' }}>{title}</p>
                <p className="font-sans leading-[1.75]" style={{ fontSize: '0.94rem', opacity: 0.6 }}>{body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <ProcessBlock />
      <ProductionFeature />
      <LabBlock />
      <ProcessCarousel />
      <ManifestoBlock />
      <TeamBlock teamMembers={loadPublicTeamMembers()} />
      <ChapterNav current="studio" />
    </main>
  )
}
