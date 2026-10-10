import type { Metadata } from 'next'
import Image from '@/components/SafariSafeImage'
import Link from 'next/link'
import { SubpageNav } from '@/components/SubpageNav'
import { NUMU_NAP } from '@/lib/siteFacts'
import { buildAbsoluteUrl, SITE_URL } from '@/lib/site'

const pageTitle = 'NUMU × Titans Space Industries | Bio-Materials & ISRU Composites Research'
const pageDescription =
  'NUMU is the Bio-Materials and ISRU Composites Partner of Titans Space Industries under a non-binding MoU effective 28 May 2026: exploratory research into mycelium composites for resource-constrained and extreme environments.'
// Artemis II crew photograph, NASA (art002e009281). NASA imagery is used with credit and implies no endorsement.
const heroImage = '/images/catalogue/space/nasa-artemis2-lunar-terminator.jpg'
const craterImage = '/images/catalogue/space/nasa-artemis2-vavilov-crater.jpg'
const materialImage = '/images/catalogue/material/palmyco-sample-block.jpg'
const BORDER = '1px solid rgba(128,128,128,0.15)'

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: ['Titans Space Industries', 'TSI partnership', 'mycelium ISRU composites', 'space biomaterials research', 'NUMU space materials', 'Neal S. Lachman'],
  alternates: { canonical: '/partnerships/titans-space' },
  robots: { index: true, follow: true },
  openGraph: {
    title: pageTitle, description: pageDescription, url: '/partnerships/titans-space', type: 'article', siteName: 'NUMU',
    images: [{ url: heroImage, width: 1920, height: 1280, alt: 'The lunar terminator photographed by the Artemis II crew. Image: NASA' }],
  },
  twitter: { card: 'summary_large_image', title: pageTitle, description: pageDescription, images: [heroImage] },
}

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: pageTitle,
  description: pageDescription,
  image: buildAbsoluteUrl(heroImage).toString(),
  dateModified: '2026-10-10',
  author: { '@type': 'Organization', name: 'NUMU', url: SITE_URL },
  publisher: { '@type': 'Organization', name: 'NUMU', logo: { '@type': 'ImageObject', url: buildAbsoluteUrl('/branding/logo-black-numu.png').toString() } },
  mainEntityOfPage: buildAbsoluteUrl('/partnerships/titans-space').toString(),
  about: [
    { '@type': 'Organization', name: 'Titans Space Industries', url: 'https://titansspace.com/' },
    { '@type': 'Thing', name: 'In-situ resource utilization' },
    { '@type': 'Thing', name: 'Mycelium composites' },
  ],
}

// Curated reading. Verified public links only; NUMU is not an author of any of these.
const READING = {
  tsi: [
    {
      title: 'Forging a New Frontier: Titans Space Launches the Space & Lunar Economy Consortium',
      source: 'Neal S. Lachman, Franklin Ratliff, Marcus Beaufort · Titans Space Industries',
      date: '4 April 2024',
      summary: 'The founding note for the consortium NUMU joined, and the range of disciplines TSI set out to bring together, from supply chain and manufacturing to research institutions.',
      href: 'https://www.linkedin.com/pulse/forging-new-frontier-titans-space-launches-lunar-economy-neal-lachman-i5eye/',
    },
    {
      title: 'Moon Made: Unveiling the Advantages of Space Manufacturing on a Lunar Base',
      source: 'Neal S. Lachman · Titans Space Industries',
      date: '7 April 2024',
      summary: 'TSI’s case for manufacturing on the Moon from lunar resources rather than delivering every input from Earth.',
      href: 'https://www.linkedin.com/pulse/copy-moon-made-unveiling-advantages-space-lunar-base-neal-lachman-0yn9e/',
    },
    {
      title: 'Sustainable Lunar Energy: Integrating Solar Power Farms and Lunar Thermal Wadis',
      source: 'Neal S. Lachman, Franklin Ratliff · Titans Space Industries',
      date: '28 May 2024',
      summary: 'A white paper on storing heat in modified regolith to carry settlements through the lunar night: an example of in-situ resources doing structural and thermal work.',
      href: 'https://www.linkedin.com/pulse/sustainable-lunar-energy-integrating-solar-power-farms-neal-lachman-yxqce/',
    },
    {
      title: 'Earth-Moon Economic, Infrastructure, and Civilizational Architecture',
      source: 'Neal S. Lachman · titansspace.com',
      date: 'Treatise, manifesto and modular blueprint',
      summary: 'TSI’s long-form framework for Earth–Moon infrastructure, settlement and commercialisation, with a public preview.',
      href: 'https://titansspace.com/earth-moon-treatise/',
    },
  ],
  context: [
    {
      title: 'Could Future Homes on the Moon and Mars Be Made of Fungi?',
      source: 'NASA Ames Research Center',
      date: '14 January 2020',
      summary: 'NASA’s myco-architecture project and the idea of growing structures at the destination from fungi and dried feedstock.',
      href: 'https://www.nasa.gov/centers-and-facilities/ames/could-future-homes-on-the-moon-and-mars-be-made-of-fungi/',
    },
    {
      title: 'Mycotecture off Planet: En Route to the Moon and Mars',
      source: 'NASA Innovative Advanced Concepts (NIAC)',
      date: '26 June 2024',
      summary: 'The continuing NASA study of fungal mycelium composites as an off-planet building material.',
      href: 'https://www.nasa.gov/directorates/stmd/niac/mycotecture-off-planet-en-route-to-the-moon-and-mars/',
    },
    {
      title: 'In-Situ Resource Utilization (ISRU)',
      source: 'NASA',
      date: 'Programme overview',
      summary: 'NASA’s definition of ISRU and its focus areas, including feedstock for manufacturing and construction.',
      href: 'https://www.nasa.gov/mission/in-situ-resource-utilization-isru/',
    },
  ],
}

const DIRECTIONS = [
  { n: '01', title: 'Bio-based composites', text: 'Structural and non-structural mycelium composites, and how their density, strength and stability could be tuned for constrained environments.' },
  { n: '02', title: 'Growing instead of shipping', text: 'Mycelium manufacturing as a way to send compact inputs (spores, dry feedstock) and grow volume at the destination.' },
  { n: '03', title: 'Local and recovered feedstocks', text: 'Which organic inputs could be available or recoverable in a closed habitat, by analogy with the agricultural residues NUMU uses on Earth.' },
  { n: '04', title: 'Fabrication under extreme conditions', text: 'What controlled growth requires (water, temperature, sterility, containment) and where those requirements conflict with extreme environments.' },
  { n: '05', title: 'Circular material flows', text: 'Reuse and end-of-life routes for grown parts, so that a material can return to feedstock instead of becoming waste.' },
  { n: '06', title: 'Interfaces with life support', text: 'A possible interdisciplinary question: how biological manufacturing might sit alongside closed-loop life-support systems. A research direction, not a deliverable under the MoU.' },
]

function PageLabel({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return <p className="font-sans uppercase tracking-[0.18em] mb-5" style={{ fontSize: '0.6875rem', opacity: light ? 0.72 : 0.6 }}>{children}</p>
}

function PageSection({ id, label, title, children }: { id: string; label: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="px-6 md:px-12 py-20 md:py-28" style={{ borderTop: BORDER }}>
      <div className="max-w-[1180px] mx-auto grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-16">
        <div>
          <PageLabel>{label}</PageLabel>
          <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 3.8rem)', lineHeight: '1', letterSpacing: '-0.035em' }}>{title}</h2>
        </div>
        <div className="space-y-5">{children}</div>
      </div>
    </section>
  )
}

function Body({ children, strong = false }: { children: React.ReactNode; strong?: boolean }) {
  return <p className="font-sans leading-[1.85]" style={{ fontSize: '1rem', opacity: strong ? 0.74 : 0.64 }}>{children}</p>
}

// Restrained diagram: the same growth loop on Earth today and as an open research question elsewhere.
function LoopDiagram() {
  const steps = ['Local feedstock', 'Controlled growth', 'Stabilised composite', 'Use', 'Return to feedstock']
  return (
    <figure className="mt-4" aria-label="Diagram: the NUMU material loop on Earth today, and the same loop as a research question for extreme environments">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ backgroundColor: 'rgba(128,128,128,0.15)' }}>
        {[
          { label: 'On Earth · today', note: 'UAE date-palm fibre, grown and stabilised in the Dubai lab.', solid: true },
          { label: 'Extreme environments · research', note: 'Which inputs exist, what growth needs, what the part must survive. Open questions.', solid: false },
        ].map(column => (
          <div key={column.label} className="p-6 md:p-7" style={{ backgroundColor: '#f5f1e8' }}>
            <p className="font-sans uppercase tracking-[0.14em] mb-5" style={{ fontSize: '0.625rem', opacity: 0.66 }}>{column.label}</p>
            <ol style={{ borderLeft: `1px ${column.solid ? 'solid' : 'dashed'} rgba(26,23,20,0.38)`, marginLeft: 4 }}>
              {steps.map((step, index) => (
                <li key={step} className="font-sans relative" style={{ listStyle: 'none', paddingLeft: 20, paddingBottom: index < steps.length - 1 ? 16 : 0, fontSize: '0.875rem', lineHeight: 1.3, opacity: column.solid ? 0.82 : 0.62 }}>
                  <span aria-hidden style={{ position: 'absolute', left: -5, top: 4, width: 9, height: 9, borderRadius: '50%', border: '1px solid #1a1714', backgroundColor: column.solid ? '#1a1714' : '#f5f1e8' }} />
                  {step}
                </li>
              ))}
            </ol>
            <p className="font-sans mt-6 leading-[1.6]" style={{ fontSize: '0.8rem', opacity: 0.6 }}>{column.note}</p>
          </div>
        ))}
      </div>
      <figcaption className="font-sans mt-3" style={{ fontSize: '0.72rem', opacity: 0.55 }}>Solid: practised by NUMU today. Open: research questions explored under the MoU.</figcaption>
    </figure>
  )
}

function ReadingList({ items }: { items: typeof READING.tsi }) {
  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ backgroundColor: 'rgba(128,128,128,0.15)' }}>
      {items.map((item, index) => (
        <li key={item.href} className={items.length % 2 === 1 && index === items.length - 1 ? 'md:col-span-2' : ''} style={{ listStyle: 'none', backgroundColor: '#f5f1e8' }}>
          <a href={item.href} target="_blank" rel="noopener noreferrer" className="block h-full p-6 md:p-7 tsi-reading" style={{ color: 'inherit', textDecoration: 'none' }}>
            <p className="font-sans uppercase tracking-[0.12em]" style={{ fontSize: '0.625rem', opacity: 0.6 }}>{item.source} · {item.date}</p>
            <p className="font-display mt-3" style={{ fontSize: '1.3rem', lineHeight: 1.2 }}>{item.title} <span aria-hidden style={{ opacity: 0.5 }}>↗</span></p>
            <p className="font-sans mt-3 leading-[1.7]" style={{ fontSize: '0.86rem', opacity: 0.66 }}>{item.summary}</p>
            <span className="sr-only"> (opens an external site)</span>
          </a>
        </li>
      ))}
    </ul>
  )
}

export default function TitansSpacePartnershipPage() {
  return (
    <main style={{ backgroundColor: '#f5f1e8', color: '#1a1714', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <SubpageNav currentPath="/partnerships/titans-space" />

      {/* 01 — Partnership */}
      <header className="relative overflow-hidden" style={{ backgroundColor: '#0d0c0b', color: '#f5f1e8' }}>
        <div className="absolute inset-0" aria-hidden={false}>
          <Image src={heroImage} alt="The lunar terminator, where day meets night, photographed by the Artemis II crew" data-lightbox="off" fill priority className="object-cover" style={{ objectPosition: '70% 40%', opacity: 0.9 }} sizes="100vw" />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(13,12,11,0.94) 0%, rgba(13,12,11,0.7) 45%, rgba(13,12,11,0.05) 100%)' }} />
        </div>
        <div className="relative px-6 md:px-12 pt-24 md:pt-36 pb-20 md:pb-28">
          <div className="max-w-[1440px] mx-auto">
            <PageLabel light>01 — Partnership · Exploratory research</PageLabel>
            <h1 className="font-display max-w-4xl" style={{ fontSize: 'clamp(2.8rem, 7.4vw, 7.6rem)', lineHeight: '0.92', letterSpacing: '-0.045em' }}>
              NUMU × Titans Space Industries
            </h1>
            <p className="font-sans leading-[1.75] max-w-xl mt-8" style={{ fontSize: '1.0625rem', opacity: 0.8 }}>
              Under a non-binding Memorandum of Understanding effective 28 May 2026, NUMU is the Bio-Materials and ISRU Composites Partner of Titans Space Industries. The work is research: what grown materials could mean where every kilogram has to be carried.
            </p>
            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-px max-w-3xl" style={{ backgroundColor: 'rgba(245,241,232,0.16)' }}>
              {[
                ['Agreement', 'Non-binding MoU'],
                ['Effective', '28 May 2026'],
                ['NUMU role', 'Bio-Materials & ISRU Composites Partner'],
                ['Stage', 'Exploratory research'],
              ].map(([label, value]) => (
                <div key={label} className="px-4 py-5" style={{ backgroundColor: 'rgba(13,12,11,0.72)' }}>
                  <p className="font-sans uppercase tracking-[0.14em] mb-2" style={{ fontSize: '0.5625rem', opacity: 0.6 }}>{label}</p>
                  <p className="font-sans leading-snug" style={{ fontSize: '0.86rem', opacity: 0.9 }}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className="relative px-6 md:px-12 pb-5 font-sans text-right" style={{ fontSize: '0.625rem', opacity: 0.55 }}>
          The Moon’s terminator, photographed by the Artemis II crew, 6 April 2026. Image: NASA.
        </p>
      </header>

      {/* 02 — Why biological materials */}
      <span id="why-this-partnership" aria-hidden />
      <span id="why-mycelium" aria-hidden />
      <PageSection id="why-biological-materials" label="02 — Why biological materials matter in space" title="Every kilogram has to be carried.">
        <Body strong>
          Building beyond Earth runs into one constraint before any other: everything that is not found on site must be launched. NASA describes in-situ resource utilization (ISRU) as harnessing local resources at the destination instead of taking every supply from Earth, from propellant and life-support consumables to feedstock for manufacturing and construction.
        </Body>
        <Body>
          That is already the logic of NUMU on Earth. The GCC imports most of its synthetic foams and acoustic materials; NUMU grows an alternative from the region’s own agricultural residue. A material that is grown, rather than mined and processed, raises an obvious research question for places where shipping is the limiting factor: could compact inputs be grown into useful volume at the destination?
        </Body>
        <Body>
          NUMU is not the first to ask it. NASA Ames has studied mycelium as a building material for the Moon and Mars for several years. The MoU gives NUMU a place to contribute practical knowledge of growing, stabilising and finishing these composites at scale.
        </Body>
      </PageSection>

      {/* 03 — Research directions */}
      <section id="research-directions" className="px-6 md:px-12 py-20 md:py-28" style={{ borderTop: BORDER }}>
        <div className="max-w-[1180px] mx-auto">
          <PageLabel>03 — Research directions</PageLabel>
          <h2 className="font-display max-w-3xl mb-12" style={{ fontSize: 'clamp(2rem, 4vw, 3.8rem)', lineHeight: '1', letterSpacing: '-0.035em' }}>Six questions we are exploring.</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px" style={{ backgroundColor: 'rgba(128,128,128,0.15)' }}>
            {DIRECTIONS.map(item => (
              <div key={item.n} className="p-6 md:p-7" style={{ backgroundColor: '#f5f1e8' }}>
                <p className="font-sans uppercase tracking-[0.14em]" style={{ fontSize: '0.625rem', opacity: 0.55 }}>{item.n} · Exploratory</p>
                <p className="font-display mt-3" style={{ fontSize: '1.4rem', lineHeight: 1.15 }}>{item.title}</p>
                <p className="font-sans mt-3 leading-[1.7]" style={{ fontSize: '0.88rem', opacity: 0.66 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 04 — From Earth to extreme environments */}
      <section id="earth-to-extreme" className="px-6 md:px-12 py-20 md:py-28" style={{ borderTop: BORDER }}>
        <div className="max-w-[1180px] mx-auto">
          <PageLabel>04 — From Earth to extreme environments</PageLabel>
          <h2 className="font-display max-w-3xl" style={{ fontSize: 'clamp(2rem, 4vw, 3.8rem)', lineHeight: '1', letterSpacing: '-0.035em' }}>Two surfaces, one question.</h2>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
            <figure>
              <div className="relative overflow-hidden" style={{ aspectRatio: '4 / 3', backgroundColor: 'rgba(26,23,20,0.05)' }}>
                <Image src={materialImage} alt="A solid PALMYCO™ sample block grown by NUMU from date-palm fibre, labelled C-02" data-lightbox-caption="PALMYCO™ sample block C-02, grown by NUMU from UAE date-palm fibre." fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
              </div>
              <figcaption className="font-sans mt-3" style={{ fontSize: '0.75rem', opacity: 0.6 }}>PALMYCO™ sample block C-02, grown in Dubai from UAE date-palm fibre. Photograph: NUMU.</figcaption>
            </figure>
            <figure>
              <div className="relative overflow-hidden" style={{ aspectRatio: '4 / 3', backgroundColor: '#0d0c0b' }}>
                <Image src={craterImage} alt="Vavilov Crater on the far side of the Moon in low-angle light" data-lightbox-caption="Vavilov Crater on the rim of the Hertzsprung basin, photographed by the Artemis II crew, 6 April 2026. Image: NASA." fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
              </div>
              <figcaption className="font-sans mt-3" style={{ fontSize: '0.75rem', opacity: 0.6 }}>Vavilov Crater, lunar far side, photographed by the Artemis II crew, 6 April 2026. Image: NASA.</figcaption>
            </figure>
          </div>
          <div className="mt-14 grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-10 lg:gap-16">
            <div className="space-y-5">
              <Body strong>
                On Earth, NUMU takes an abundant residue, date-palm fibre, and lets a fungal network bind it into a rigid, light composite in a mould. The material is heat-stabilised, so growth stops and the part keeps its shape.
              </Body>
              <Body>
                The parallel with extreme environments is conceptual, and so are its limits. Vacuum, radiation, temperature swings, water budgets and biological containment all change what is possible. The value of the research is to map those limits honestly before anyone designs hardware around them.
              </Body>
            </div>
            <LoopDiagram />
          </div>
        </div>
      </section>

      {/* 05 — Framework */}
      <span id="scope-of-collaboration" aria-hidden />
      <span id="agreement-frame" aria-hidden />
      <PageSection id="partnership-framework" label="05 — Partnership framework" title="A real MoU, exploratory by design.">
        <Body strong>
          The MoU took effect on 28 May 2026. It establishes a non-binding framework of strategic alignment between NUMU Biotech FZCO and Lachman Capital Partners LLC on behalf of Titans Space Industries, and positions NUMU as the bio-materials and ISRU composites partner within TSI’s Space &amp; Lunar Economy Consortium.
        </Body>
        <Body>
          It sets a basis for future discussion of research, payload experimentation, technical roadmaps and partnership visibility. It does not commit either party to a programme, a budget or a flight.
        </Body>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px pt-4" style={{ backgroundColor: 'rgba(128,128,128,0.15)' }}>
          <div className="p-6" style={{ backgroundColor: 'rgba(26,23,20,0.025)' }}>
            <p className="font-sans uppercase tracking-[0.14em] mb-4" style={{ fontSize: '0.625rem', opacity: 0.6 }}>What NUMU contributes</p>
            <ul className="space-y-2 font-sans" style={{ fontSize: '0.88rem', opacity: 0.74 }}>
              <li>Growing and stabilising mycelium composites at production scale</li>
              <li>Feedstock selection from agricultural residue</li>
              <li>Material samples and documented process knowledge</li>
            </ul>
          </div>
          <div className="p-6" style={{ backgroundColor: 'rgba(26,23,20,0.025)' }}>
            <p className="font-sans uppercase tracking-[0.14em] mb-4" style={{ fontSize: '0.625rem', opacity: 0.6 }}>What this is not</p>
            <ul className="space-y-2 font-sans" style={{ fontSize: '0.88rem', opacity: 0.74 }}>
              <li>No NUMU material has been tested in space</li>
              <li>No flight-qualified or certified spacecraft components</li>
              <li>No life-support hardware is developed under the MoU</li>
            </ul>
          </div>
        </div>
        <figure className="pt-4 max-w-md">
          <div className="relative overflow-hidden" style={{ aspectRatio: '4 / 5', backgroundColor: 'rgba(26,23,20,0.04)' }}>
            <Image src="/images/partnerships/tsi-announcement-04.jpg" alt="The first page of the memorandum of understanding between NUMU Biotech FZCO and Titans Space Industries" data-lightbox-caption="The memorandum of understanding between NUMU Biotech FZCO and Titans Space Industries. Details intentionally out of focus." fill className="object-cover" sizes="(max-width: 768px) 100vw, 28rem" />
          </div>
          <figcaption className="font-sans mt-3" style={{ fontSize: '0.75rem', opacity: 0.6 }}>The memorandum, first page. Details intentionally out of focus.</figcaption>
        </figure>
      </PageSection>

      {/* About TSI */}
      <PageSection id="about-titans-space" label="About Titans Space Industries" title="Spaceplanes and Earth–Moon infrastructure.">
        <Body strong>
          Titans Space Industries is an Orlando-based company developing reusable spaceplanes and orbital and lunar infrastructure, led by founder and CEO Neal S. Lachman. Its Space &amp; Lunar Economy Consortium brings together companies and institutions across the space value chain.
        </Body>
        <Body>
          Learn more at{' '}
          <a href="https://titansspace.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline', textDecorationThickness: 1, textUnderlineOffset: 4 }}>titansspace.com</a>.
        </Body>
      </PageSection>

      {/* 06 — Reading */}
      <section id="research-and-perspectives" className="px-6 md:px-12 py-20 md:py-28" style={{ borderTop: BORDER }}>
        <div className="max-w-[1180px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-8 lg:gap-16 mb-12">
            <div>
              <PageLabel>06 — Research &amp; perspectives</PageLabel>
              <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 3.8rem)', lineHeight: '1', letterSpacing: '-0.035em' }}>Further reading.</h2>
            </div>
            <p className="font-sans leading-[1.75] self-end" style={{ fontSize: '0.88rem', opacity: 0.6 }}>
              A short, curated list. The first group is published by Titans Space Industries; the second gives independent context on ISRU and mycelium for space. These are external publications: NUMU is not an author, and inclusion does not imply endorsement either way.
            </p>
          </div>
          <PageLabel>From Titans Space Industries</PageLabel>
          <ReadingList items={READING.tsi} />
          <div className="mt-12"><PageLabel>Independent context</PageLabel></div>
          <ReadingList items={READING.context} />
        </div>
      </section>

      {/* 07 — Collaboration */}
      <section id="research-collaboration" className="px-6 md:px-12 py-20 md:py-28" style={{ borderTop: BORDER }}>
        <div className="max-w-[1180px] mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-16 items-end">
          <div>
            <PageLabel>07 — Research collaboration</PageLabel>
            <h2 className="font-display mb-6" style={{ fontSize: 'clamp(2.4rem, 5.5vw, 5.6rem)', lineHeight: '0.94', letterSpacing: '-0.045em' }}>Working on materials for constrained environments?</h2>
            <p className="font-sans leading-[1.8] max-w-xl" style={{ fontSize: '0.98rem', opacity: 0.66 }}>
              Universities, agencies and companies researching bio-based materials, ISRU or closed-loop systems can contact NUMU about samples, data exchange and joint work.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <a href={`mailto:${NUMU_NAP.email}?subject=${encodeURIComponent('Research collaboration — bio-materials and ISRU')}`} className="shop-cta">Email the research team →</a>
            <Link href="/palmyco" className="review-link">The material on Earth: PALMYCO™ ↗</Link>
            <Link href="/shop/fold" className="review-link">Where it is applied today: FOLD ↗</Link>
            <Link href="/partnerships" className="review-link secondary">All partnerships ↗</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
