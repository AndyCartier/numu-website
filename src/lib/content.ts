import fs from 'fs'
import path from 'path'

const contentDir = path.join(process.cwd(), 'content')

function read(rel: string) {
  return fs.readFileSync(path.join(contentDir, rel), 'utf8')
}

// ─── Visitor ──────────────────────────────────────────────────────────────────

export interface VisitorContent {
  mode: 'visitor'
  hero: { lines: string[]; sublabel: string; meta: string; cta: { label: string; href: string } }
  statement: { label: string; heading: string; body: string }
  material: { label: string; heading: string; quote: string }
  applications: { label: string; heading: string; items: { title: string; tagline: string }[] }
  process: { label: string; heading: string; steps: string[] }
  founder: { label: string; heading: string; body: string; role: string }
  contact: { label: string; heading: string; ctas: { label: string; href: string }[] }
}

// ─── Investor ─────────────────────────────────────────────────────────────────

export interface InvestorContent {
  mode: 'investor'
  hero: { lines: string[]; sublabel: string; meta: string; cta: { label: string; href: string } }
  market: { label: string; heading: string; body: string }
  platform: { label: string; heading: string; body: string }
  traction: { label: string; heading: string; items: string[] }
  roadmap: { label: string; heading: string; phases: { year: string; label: string; items: string[] }[] }
  business_model: { label: string; heading: string; body: string }
  team: { label: string; heading: string; body: string }
  cta: { label: string; heading: string; body: string; href: string }
}

// ─── Loaders ──────────────────────────────────────────────────────────────────

export function loadVisitorContent(): VisitorContent {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _raw = read('pages/visitor.md')
  return {
    mode: 'visitor',
    // Task 1.1
    hero: {
      lines: ["The Middle East's first", 'bio-engineered', 'material platform.'],
      sublabel: 'UAE — Bio-material company',
      meta: 'Est. 2024 — Dubai, UAE',
      cta: { label: 'Explore the material system', href: '#statement' },
    },
    // Task 1.2
    statement: {
      label: '01 — Statement',
      heading: 'Materials grown from biology, engineered for construction.',
      body: "NUMU's proprietary material system uses mycelium — nature's binding network — to transform regional agricultural waste into construction-grade acoustic panels, thermal insulation, and composites. Performance is defined during growth, not added later.",
    },
    material: {
      label: '02 — The Material',
      heading: 'A proprietary material system using mycelium as a natural binding network.',
      quote: 'Performance is defined during growth, not added later.',
    },
    // Task 1.5
    applications: {
      label: '03 — Applications',
      heading: 'From acoustic panels to thermal insulation.',
      items: [
        { title: 'Acoustic Panels',     tagline: 'Bio-engineered acoustic cores replacing PET, mineral wool, and PU foam in interior fit-outs.' },
        { title: 'Thermal Insulation',  tagline: 'Palm-waste-based insulation boards manufactured locally, replacing imported synthetic foams.' },
        { title: 'Packaging',           tagline: 'Compostable protective packaging grown from agricultural by-products.' },
      ],
    },
    process: {
      label: '04 — Process',
      heading: 'Grown, not manufactured.',
      steps: ['Raw Fiber', 'Inoculation', 'Growth', 'Shaping', 'Final Material'],
    },
    // Task 1.3
    founder: {
      label: '06 — Founder',
      heading: 'Built by 7 years of hands-on industrialization.',
      body: 'NUMU was founded by Andy Cartier — a mycelium industrialization specialist who has spent 7 years compressing the learning curve from lab to production across Europe and the Middle East. Two real-world installations. An operational production lab in Dubai. This isn\'t research — it\'s execution.',
      role: 'Founder & Mycelium Industrialization Specialist',
    },
    // Task 1.4
    contact: {
      label: '07 — Contact',
      heading: 'Specify NUMU.',
      ctas: [
        { label: 'Specify NUMU for your next project', href: 'mailto:Andy@numu.bio' },
        { label: 'Explore the material system',        href: '#material' },
      ],
    },
  }
}

export function loadInvestorContent(): InvestorContent {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _raw = read('pages/investor.md')
  return {
    mode: 'investor',
    // Task 1.6
    hero: {
      lines: ['A bio-engineered', 'material', 'platform.'],
      sublabel: 'Investor Overview — Confidential',
      meta: 'The UAE imports 100% of its construction foam. NUMU builds the local manufacturing base.',
      cta: { label: 'View opportunity', href: '#market' },
    },
    // Task 1.7
    market: {
      label: '01 — Market',
      heading: 'A $1T+ global industry with no regional manufacturing base.',
      body: 'The GCC imports 100% of its construction foam. There is no local bio-material manufacturer in the region. NUMU enters at acoustic panels — the highest-margin, most specification-driven category — and expands from there.',
    },
    platform: {
      label: '02 — Platform',
      heading: 'NUMU is a material platform, not a single product.',
      body: 'Acoustics is the entry point. The system expands into insulation, interior materials, and construction systems. Each layer compounds proprietary knowledge and manufacturing advantage.',
    },
    // Task 1.8
    traction: {
      label: '03 — Traction',
      heading: 'Two installations. One lab. Real feedstock.',
      items: [
        '2 pilot installations completed — Netherlands 2022, Dubai 2025',
        'Production lab operational — $50K founder capital deployed',
        'Process repeatability validated with local UAE feedstock',
        'Architect and developer pipeline active — conversion expected post-certification',
      ],
    },
    // Task 1.10
    roadmap: {
      label: '04 — Roadmap',
      heading: 'Phased platform expansion.',
      phases: [
        {
          year: '2025',
          items: ['Production lab operational', 'Local feedstock validated', 'Pilot installations live'],
          label: 'Platform Activation',
        },
        {
          year: '2026',
          items: ['Scaled production — 600 m²/month target', 'Fire + acoustic certifications', 'IP filings', 'First commercial revenue'],
          label: 'Industrialization',
        },
        {
          year: '2027+',
          items: ['Adjacent material categories', 'GCC expansion', 'Selective licensing / JV models'],
          label: 'Platform Leverage',
        },
      ],
    },
    business_model: {
      label: '05 — Business Model',
      heading: 'High-margin products transitioning to platform licensing.',
      body: 'Design-led products at premium price points establish brand and margin. Licensing the material platform to regional manufacturers scales without proportional capex.',
    },
    team: {
      label: '07 — Team',
      heading: '7 years compressing lab-to-production.',
      body: 'Andy Cartier is a mycelium industrialization specialist — not a scientist. His background is in compressing the execution gap: two real installations across Europe and the Middle East, and an operational production lab in Dubai built on $50K of founder capital.',
    },
    // Task 1.9
    cta: {
      label: '08 — Next Step',
      heading: 'Request the full investor deck.',
      body: 'Raising $600K to build the first certified bio-material manufacturing system in the GCC.',
      href: 'mailto:Andy@numu.bio',
    },
  }
}
