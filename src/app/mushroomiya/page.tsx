import type { Metadata } from 'next'
import Image from '@/components/SafariSafeImage'
import Link from 'next/link'
import { SubpageNav } from '@/components/SubpageNav'
import { buildAbsoluteUrl, SITE_URL } from '@/lib/site'

const pageTitle = 'Mushroomiya Lamp | Grown Mycelium Mashrabiya Lighting Object by NUMU'
const pageDescription =
  'Mushroomiya is a grown mycelium light sculpture by NUMU, emerging from The Mushroomiya Threshold research with Dalia Hamati of studioDA and Mathieu Andries, then adapted by Andy Cartier into a monumental statement lamp.'
const heroImage = '/images/mushroomiya/base39-lamp-01.jpg'
const makingImage = '/images/mushroomiya/material-02.jpg'
const installedInteriorImage = '/images/mushroomiya/base39-lamp-03.jpg'
const rawMaterialImage = '/images/mushroomiya/material-01.jpg'
const closeUpImage = '/images/mushroomiya/close-up-01.jpg'
const BORDER = '1px solid rgba(128,128,128,0.15)'

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: '/mushroomiya',
  },
  keywords: [
    'Mushroomiya lamp',
    'mycelium lamp Dubai',
    'grown lamp UAE',
    'PALMYCO lighting object',
    'bio composite lighting design',
    'mashrabiya lamp',
    'The Mushroomiya Threshold',
    'studioDA',
    'Dalia Hamati',
    'Mathieu Andries',
  ],
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: '/mushroomiya',
    type: 'article',
    siteName: 'NUMU',
    images: [
      {
        url: heroImage,
        width: 1200,
        height: 900,
        alt: 'Mushroomiya lamp installed in an architectural interior',
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

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Mushroomiya',
    description: pageDescription,
    image: buildAbsoluteUrl(heroImage).toString(),
    brand: {
      '@type': 'Brand',
      name: 'NUMU',
    },
    manufacturer: {
      '@type': 'Organization',
      name: 'NUMU',
      url: SITE_URL,
    },
    creator: [
      {
        '@type': 'Person',
        name: 'Andy Cartier',
      },
      {
        '@type': 'Person',
        name: 'Dalia Hamati',
      },
      {
        '@type': 'Person',
        name: 'Mathieu Andries',
      },
      {
        '@type': 'Organization',
        name: 'studioDA',
      },
    ],
    category: 'Mycelium lighting object',
    material: 'PALMYCO mycelium composite',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Mushroomiya', item: buildAbsoluteUrl('/mushroomiya').toString() },
    ],
  },
]

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-sans uppercase tracking-[0.18em]" style={{ fontSize: '0.6875rem', opacity: 0.52 }}>
      {children}
    </p>
  )
}

export default function MushroomiyaPage() {
  return (
    <main style={{ backgroundColor: '#f5f1e8', color: '#1a1714', minHeight: '100vh' }}>
      {jsonLd.map((item, index) => (
        <script
          key={`mushroomiya-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}

      <SubpageNav currentPath="/mushroomiya" />

      <header className="px-6 md:px-12 py-16 md:py-24">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[0.92fr_1.08fr] gap-10 lg:gap-16 items-end">
          <div className="max-w-2xl">
            <Label>Product object</Label>
            <h1
              className="font-display mt-5 mb-8"
              style={{ fontSize: 'clamp(3rem, 8vw, 8rem)', lineHeight: '0.98', letterSpacing: '-0.03em' }}
            >
              Mushroomiya
            </h1>
            <p className="font-sans leading-[1.8] mb-5" style={{ fontSize: '1.05rem', opacity: 0.66 }}>
              Mushroomiya is a grown light sculpture, a monumental pendant dome that reinterprets the mashrabiya through living matter. Its open-cell shell is grown from mycelium on palm-derived fibre and adapts an earlier research language into a statement lamp shade rather than a conventional fixture.
            </p>
            <p className="font-sans leading-[1.8]" style={{ fontSize: '0.98rem', opacity: 0.58 }}>
              When illuminated, it projects a dramatic landscape of shadows across walls, ceiling, and floor. It is a mashrabiya grown rather than carved, patterned through the logic of mycelial roots underground.
            </p>
          </div>

          <div className="relative overflow-hidden" style={{ aspectRatio: '4 / 3', backgroundColor: 'rgba(26,23,20,0.04)' }}>
            <Image
              src={heroImage}
              alt="Mushroomiya lamp installed in an architectural interior"
              data-lightbox-caption="Mushroomiya installed as a suspended statement piece, showing how the grown lattice holds both light and shadow."
              fill
              priority
              unoptimized
              className="object-cover object-center"
              style={{ objectPosition: 'center top' }}
              sizes="(max-width: 1024px) 100vw, 54vw"
            />
          </div>
        </div>
      </header>

      <aside className="review-container lamp-gallery-link"><p>Explore the complete lighting collection, including later renders, material details and design studies.</p><Link className="review-link" href="/collections?category=Lighting">View the lighting collection ↗</Link><Link className="review-link secondary" href="/shop/mushroomiya">View commissioning options ↗</Link></aside>
      <section className="px-6 md:px-12 py-16 md:py-24" style={{ borderTop: BORDER }}>
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-16 items-start">
          <div className="relative overflow-hidden" style={{ aspectRatio: '4 / 5', backgroundColor: 'rgba(26,23,20,0.04)' }}>
            <Image
              src={makingImage}
              alt="Andy Cartier installing the Mushroomiya lamp"
              data-lightbox-caption="Andy Cartier installing Mushroomiya, where the research becomes a working architectural light object."
              fill
              unoptimized
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div>
            <Label>Research origin</Label>
            <h2 className="font-display mt-5 mb-7" style={{ fontSize: 'clamp(2.2rem, 5vw, 5rem)', lineHeight: '1.02', letterSpacing: '-0.025em' }}>
              From The Mushroomiya Threshold to a statement lamp.
            </h2>
            <div className="space-y-5">
              <p className="font-sans leading-[1.85]" style={{ fontSize: '1rem', opacity: 0.66 }}>
                Mushroomiya began in a research collaboration with Dalia Hamati of studioDA, her design studio, and Mathieu Andries around a contemporary adaptation of mashrabiya pattern logic. The project was titled <em>The Mushroomiya Threshold</em>, conceived as a living gateway for Dubai Design Week 2025.
              </p>
              <p className="font-sans leading-[1.85]" style={{ fontSize: '1rem', opacity: 0.6 }}>
                The installation reimagined the traditional mashrabiya screen through mycelium, drawing from vegetal ornament, airflow, filtered light, and the moving visual effects of layered pattern. Instead of carving or machining the screen, the geometry was grown through a living binder on local biomass.
              </p>
              <p className="font-sans leading-[1.85]" style={{ fontSize: '1rem', opacity: 0.56 }}>
                Inspired by both mashrabiya and the branching intelligence of mushroom roots underground, Andy Cartier later adapted that design language into Mushroomiya, a single monumental lamp that turns the original threshold research into an inhabitable object.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-px mt-10" style={{ backgroundColor: 'rgba(128,128,128,0.12)' }}>
              {[
                ['Research', 'Dalia Hamati, studioDA, Mathieu Andries'],
                ['Project', 'The Mushroomiya Threshold, Dubai Design Week 2025'],
                ['Adaptation', 'Andy Cartier into a monumental lamp shade'],
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
            <Label>Material composition</Label>
            <h2 className="font-display mt-5 mb-7" style={{ fontSize: 'clamp(2.2rem, 5vw, 5rem)', lineHeight: '1.02', letterSpacing: '-0.025em' }}>
              Pattern and material, one organism.
            </h2>
            <p className="font-sans leading-[1.85]" style={{ fontSize: '1rem', opacity: 0.62 }}>
              The pattern source and the structural material are the same biological organism, expressed at two scales: thread and object. Grown on palm-derived fibre, the mycelium binds the substrate into a solid, lightweight lattice where ornament is the material itself.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <div>
              <div className="relative overflow-hidden" style={{ aspectRatio: '4 / 5', backgroundColor: 'rgba(26,23,20,0.04)' }}>
                <Image
                  src={makingImage}
                  alt="Mushroomiya being installed and assembled"
                  data-lightbox-caption="Assembly view of Mushroomiya, showing the object handled at full architectural scale."
                  fill
                  unoptimized
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <p className="font-sans uppercase tracking-[0.14em] mt-4 mb-1" style={{ fontSize: '0.5625rem', opacity: 0.36 }}>Assembly</p>
              <p className="font-sans leading-snug" style={{ fontSize: '0.8125rem', opacity: 0.54 }}>The shell is handled as a precise object, not a speculative prototype.</p>
            </div>
            <div>
              <div className="relative overflow-hidden" style={{ aspectRatio: '4 / 5', backgroundColor: 'rgba(26,23,20,0.04)' }}>
                <Image
                  src={rawMaterialImage}
                  alt="Mushroomiya shell shown with feedstock and inoculated material"
                  data-lightbox-caption="The raw shell beside inoculated substrate and loose palm-derived fibre, making the material lineage fully visible."
                  fill
                  unoptimized
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <p className="font-sans uppercase tracking-[0.14em] mt-4 mb-1" style={{ fontSize: '0.5625rem', opacity: 0.36 }}>Material system</p>
              <p className="font-sans leading-snug" style={{ fontSize: '0.8125rem', opacity: 0.54 }}>Shell, inoculated substrate, and loose fibre read as one continuous material story.</p>
            </div>
            <div>
              <div className="relative overflow-hidden" style={{ aspectRatio: '4 / 5', backgroundColor: 'rgba(26,23,20,0.04)' }}>
                <Image
                  src={closeUpImage}
                  alt="Close-up of Mushroomiya surface and touch"
                  data-lightbox-caption="Close-up of the grown finish, where fibrous texture and touch remain legible in the final object."
                  fill
                  unoptimized
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <p className="font-sans uppercase tracking-[0.14em] mt-4 mb-1" style={{ fontSize: '0.5625rem', opacity: 0.36 }}>Grown finish</p>
              <p className="font-sans leading-snug" style={{ fontSize: '0.8125rem', opacity: 0.54 }}>Fibrous, tactile, naturally irregular, and shaped by living growth.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 py-16 md:py-24" style={{ borderTop: BORDER }}>
        <div className="max-w-[1120px] mx-auto grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-16">
          <div>
            <Label>Technical overview</Label>
            <h2 className="font-display mt-5 mb-7" style={{ fontSize: 'clamp(2.2rem, 5vw, 5rem)', lineHeight: '1.02', letterSpacing: '-0.025em' }}>
              A monumental pendant dome with a precise grown logic.
            </h2>
          </div>
          <div className="space-y-6">
            <div className="relative overflow-hidden" style={{ aspectRatio: '16 / 10', backgroundColor: 'rgba(26,23,20,0.04)' }}>
              <Image
                src="/images/mushroomiya/base39-lamp-05.jpg"
                alt="Mushroomiya lamp illuminated in a Dubai interior at night"
                data-lightbox-caption="Mushroomiya illuminated at night, where the grown lattice turns into a large-scale atmospheric light source."
                fill
                unoptimized
                className="object-cover object-center"
                style={{ objectPosition: 'center top' }}
                loading="eager"
                sizes="(max-width: 1120px) 100vw, 60vw"
              />
            </div>
            <div className="relative overflow-hidden" style={{ aspectRatio: '16 / 9', backgroundColor: 'rgba(26,23,20,0.04)' }}>
              <Image
                src={installedInteriorImage}
                alt="Mushroomiya lamp casting a patterned glow across a reception interior"
                data-lightbox-caption="Daylight interior view of Mushroomiya, showing the object as both lighting piece and spatial landmark."
                fill
                unoptimized
                className="object-cover object-center"
                style={{ objectPosition: 'center top' }}
                sizes="(max-width: 1120px) 100vw, 60vw"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px" style={{ backgroundColor: 'rgba(128,128,128,0.12)' }}>
              {[
                ['Category', 'Lighting'],
                ['Type', 'Monumental ceiling lamp'],
                ['Dimensions', '1060 × 387 × 30 mm'],
                ['Structure', 'Half-sphere open-cell dome'],
                ['Light source', 'Integrated LED, 2700K, dimmable'],
                ['Material system', 'Mycelium on palm-tree fibre waste'],
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
        <div className="max-w-[1120px] mx-auto">
          <Label>Related paths</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Link
              href="/palmyco"
              className="block p-6"
              style={{ border: BORDER, color: 'inherit', textDecoration: 'none', backgroundColor: 'rgba(26,23,20,0.025)' }}
            >
              <p className="font-display mb-3" style={{ fontSize: '1.7rem', lineHeight: 1.04, letterSpacing: '-0.03em' }}>PALMYCO™ material platform</p>
              <p className="font-sans leading-[1.8]" style={{ fontSize: '0.95rem', opacity: 0.62 }}>See the material system behind the lamp and the wider product logic.</p>
            </Link>
            <Link
              href="/partnerships"
              className="block p-6"
              style={{ border: BORDER, color: 'inherit', textDecoration: 'none', backgroundColor: 'rgba(26,23,20,0.025)' }}
            >
              <p className="font-display mb-3" style={{ fontSize: '1.7rem', lineHeight: 1.04, letterSpacing: '-0.03em' }}>Partnerships and future materials</p>
              <p className="font-sans leading-[1.8]" style={{ fontSize: '0.95rem', opacity: 0.62 }}>See how the same material logic extends into frontier collaborations such as TSI.</p>
            </Link>
            <Link
              href="/case-studies"
              className="block p-6"
              style={{ border: BORDER, color: 'inherit', textDecoration: 'none', backgroundColor: 'rgba(26,23,20,0.025)' }}
            >
              <p className="font-display mb-3" style={{ fontSize: '1.7rem', lineHeight: 1.04, letterSpacing: '-0.03em' }}>Projects and installations</p>
              <p className="font-sans leading-[1.8]" style={{ fontSize: '0.95rem', opacity: 0.62 }}>Move from object scale back to the broader material and architectural context.</p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
