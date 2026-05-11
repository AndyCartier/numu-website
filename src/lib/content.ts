export type VisitorContent = {
  hero: {
    lines: string[]
    sublabel: string
    meta: string
    cta: { label: string; href: string }
  }
  statement: {
    label: string
    heading: string
  }
  material: {
    label: string
  }
  process: {
    label: string
    heading: string
  }
  founder: {
    label: string
    heading: string
    body: string
    role: string
  }
  contact: {
    label: string
    heading: string
    ctas: Array<{ label: string; href: string }>
  }
}

export type TeamMember = {
  name: string
  role: string
  equity?: string
  bio: string
  imageKey: string
}

export type RevenueEngine = {
  id: string
  name: string
  price: string
  margin: string
  activation: string
  desc: string
  status: 'active' | 'next' | 'future'
}

export type Force = {
  id: string
  title: string
  body: string
}

export type CompetitorRow = {
  name: string
  origin: string
  price: string
  bio: boolean
  local: boolean
  certified: boolean
  numu: boolean
}

export type InvestorContent = {
  hero: {
    lines: string[]
    sublabel: string
    meta: string
    cta: { label: string; href: string }
  }
  forces: {
    label: string
    heading: string
    items: Force[]
  }
  market: { label: string; heading: string; body: string }
  platform: { label: string; heading: string; body: string }
  revenue_engines: {
    label: string
    heading: string
    body: string
    engines: RevenueEngine[]
  }
  revenue_chart: {
    label: string
    heading: string
    years: Array<{ year: string; low: number; high: number; label: string }>
  }
  competitive: {
    label: string
    heading: string
    players: CompetitorRow[]
  }
  traction: { label: string; heading: string; items: string[] }
  roadmap: {
    label: string
    heading: string
    phases: Array<{ year: string; label: string; items: string[] }>
  }
  business_model: { label: string; heading: string; body: string }
  team: {
    label: string
    heading: string
    body: string
    members: TeamMember[]
  }
  use_of_funds: {
    label: string
    heading: string
    total: string
    items: Array<{ label: string; pct: number; amount: string }>
  }
  cta: { label: string; heading: string; body: string; href: string }
}

export function loadVisitorContent(): VisitorContent {
  return {
    hero: {
      lines: ["The Middle East's first", 'bio-engineered', 'material platform.'],
      sublabel: 'UAE — Bio-composites platform',
      meta: 'Est. 2024 — Dubai, UAE',
      cta: { label: 'Explore the material system', href: '#statement' },
    },
    statement: {
      label: '01 — Statement',
      heading: 'Bio-composites grown from biology, engineered for construction.',
    },
    material: {
      label: '02 — The Material',
    },
    process: {
      label: '04 — Process',
      heading: 'Grown, not manufactured.',
    },
    founder: {
      label: '06 — Founder',
      heading: 'Built by 7 years of hands-on industrialization.',
      body: "NUMU was founded by Andy Cartier — a mycelium industrialization specialist who has spent 7 years compressing the learning curve from lab to production across Europe and the Middle East. Two real-world installations. An operational production lab in Dubai. This isn't research — it's execution.",
      role: 'Founder & CEO — Mycelium Industrialization',
    },
    contact: {
      label: '07 — Contact',
      heading: 'Specify NUMU.',
      ctas: [
        { label: 'Specify NUMU for your next project', href: 'mailto:andy@numu.bio' },
        { label: 'Explore the material system', href: '#material' },
      ],
    },
  }
}

export function loadInvestorContent(): InvestorContent {
  return {
    hero: {
      lines: ['A bio-engineered', 'material', 'platform.'],
      sublabel: 'Investor Overview — Confidential',
      meta: 'The GCC imports 100% of its construction foam. NUMU is building the first local bio-composites platform.',
      cta: { label: 'View opportunity', href: '#forces' },
    },
    forces: {
      label: '01 — Market Forces',
      heading: 'Three forces converging now.',
      items: [
        {
          id: 'policy',
          title: 'Policy',
          body: 'UAE Net Zero 2050, Operation 300 Billion, and emerging GCC circular-economy mandates are shifting procurement toward bio-based and locally sourced construction materials. Specifiers are already under compliance pressure on flagship projects.',
        },
        {
          id: 'supply',
          title: 'Supply Gap',
          body: 'The GCC imports 100% of its construction acoustic and thermal foam. There is no local bio-material manufacturer. Every panel, every roll, every board arrives by ship — exposed to tariffs, lead times, and currency risk.',
        },
        {
          id: 'reset',
          title: 'Industry Reset',
          body: "A new generation of GCC architects and developers is actively replacing synthetic materials in premium fit-outs. Bio-based has moved from niche to specification-level requirement in the region's top-tier projects.",
        },
      ],
    },
    market: {
      label: '02 — Market',
      heading: 'A market that grows as NUMU grows.',
      body: "NUMU's addressable market expands in layers as the platform activates new revenue engines. Each phase unlocks a larger opportunity on the same material infrastructure.",
    },
    platform: {
      label: '03 — Platform',
      heading: 'NUMU is a material platform, not a single product.',
      body: 'Acoustics is the entry point. The system expands into insulation, interior materials, and construction systems. Each layer compounds proprietary knowledge and manufacturing advantage.',
    },
    revenue_engines: {
      label: '04 — Revenue Engines',
      heading: 'Four engines. One platform.',
      body: 'One material system, four sequenced revenue engines. Each has its own buyer, pricing logic, and activation horizon. They compound on shared production infrastructure and shared feedstock relationships.',
      engines: [
        {
          id: 'E1',
          name: 'Grown Decorative Acoustic',
          price: 'AED 1,000–1,500 / m²',
          margin: '60–70%',
          activation: '0–12 months',
          desc: 'Aesthetic-grade grown mycelium panels for interior designers, boutique hospitality, and high-end retail. No certification gate. Premium-margin entry product.',
          status: 'active',
        },
        {
          id: 'E2',
          name: 'Pressed Composite Boards',
          price: 'AED 200–500 / m²',
          margin: '50–65%',
          activation: '0–12 months',
          desc: 'Heat-pressed mycelium boards for events, brand activations, and temporary architecture. Built from spent mushroom substrate, a regional waste stream. Near-zero feedstock cost.',
          status: 'active',
        },
        {
          id: 'E3',
          name: 'Certified Acoustic for Specification',
          price: 'AED 1,100–1,800 / m²',
          margin: '55–65%',
          activation: '12–24 months',
          desc: 'Same grown material system, certified for fire and acoustic performance. Specified by architects on commercial projects: offices, hospitality, cultural spaces, public buildings. Unlocks commercial scale.',
          status: 'next',
        },
        {
          id: 'E4',
          name: 'Expansion: Packaging and Licensing',
          price: 'Anchor-client + licensing',
          margin: '30–45%',
          activation: '18–36 months',
          desc: 'Biodegradable packaging via existing Biomyc LOI. Regional licensing to GCC manufacturing partners. Thermal insulation as certification allows. Scale without proportional capex.',
          status: 'future',
        },
      ],
    },
    revenue_chart: {
      label: 'Revenue Projection',
      heading: 'AED 17–33M revenue by Year 4.',
      years: [
        { year: 'Y1', low: 1, high: 2, label: 'AED 1–2M' },
        { year: 'Y2', low: 4.7, high: 9.4, label: 'AED 4.7–9.4M' },
        { year: 'Y3', low: 11.5, high: 22, label: 'AED 11.5–22M' },
        { year: 'Y4', low: 17, high: 33, label: 'AED 17–33M' },
      ],
    },
    competitive: {
      label: 'Competitive Position',
      heading: 'No direct comparable exists in the GCC.',
      players: [
        { name: 'Synthetic Imports', origin: 'Imported', price: 'AED 400–600', bio: false, local: false, certified: true, numu: false },
        { name: 'Desertboard', origin: 'UAE', price: '~AED 1,100', bio: false, local: true, certified: false, numu: false },
        { name: 'Ecovative (US)', origin: 'Imported', price: 'AED 2,000+', bio: true, local: false, certified: true, numu: false },
        { name: 'NUMU', origin: 'UAE', price: 'AED 1,000–1,800', bio: true, local: true, certified: false, numu: true },
      ],
    },
    traction: {
      label: '08 — Traction',
      heading: 'Two installations. One lab. Real feedstock.',
      items: [
        '2 pilot installations completed — Netherlands 2022, Dubai 2025',
        'Production lab operational — AED 180K founder capital deployed',
        'Process repeatability validated with local UAE agricultural feedstock',
        'Architect and developer pipeline active — conversion expected post-certification',
        'Certification process initiated — acoustic + fire performance testing',
        'European licensing pathway — LOI with Biomyc for packaging partnership',
        'Academic partnerships — De Montfort, AUS, Heriot-Watt Dubai, DIDI',
      ],
    },
    roadmap: {
      label: '10 — Roadmap',
      heading: 'Phased platform expansion.',
      phases: [
        {
          year: '2026',
          label: 'Platform Activation',
          items: [
            'Production facility scaled from founder-funded lab',
            'Local feedstock streams confirmed (palm + SMS)',
            'Pilot installations documented (Beyond Chrysant, KAVE)',
            'FOLD product launched with NYXO collaboration',
            'Patent filing complete; trademark active',
          ],
        },
        {
          year: '2027',
          label: 'Industrialization',
          items: [
            'Fire and acoustic certifications achieved',
            'Specification channel activated — 3–5 commercial projects',
            'Pressed board production at 200–400 m²/month',
            'Packaging pilot under Biomyc structure',
            'Revenue AED 4.7–9.4M',
          ],
        },
        {
          year: '2028+',
          label: 'Platform Leverage',
          items: [
            'Adjacent material categories activated (thermal)',
            'GCC expansion (Saudi Arabia — EWC, NEOM pathway)',
            'First regional licensing arrangement executed',
            'Revenue AED 11.5–33M range',
            'Series A decision or cash-flow-funded expansion',
          ],
        },
      ],
    },
    business_model: {
      label: '11 — Business Model',
      heading: 'High-margin products transitioning to platform licensing.',
      body: 'Design-led products at premium price points establish brand and margin. Licensing the material platform to regional manufacturers scales without proportional capex.',
    },
    team: {
      label: '12 — Team',
      heading: 'One founder. Two cofounders. One CGO.',
      body: 'NUMU is built by people who execute, not scientists. The team combines mycelium industrialization, construction finance, IP strategy, and commercial growth.',
      members: [
        {
          name: 'Andy Cartier',
          role: 'Founder & CEO — Mycelium Industrialization',
          equity: '',
          bio: '7 years compressing the lab-to-production gap across Europe and the Middle East. Two real installations. Operational lab funded with founder capital. Published in the Routledge mycelium reference volume, 2024.',
          imageKey: 'founder',
        },
        {
          name: 'Benjamin Rieux',
          role: 'Cofounder & CFO — Construction Finance',
          equity: '',
          bio: '15+ years in construction and real estate project finance. Leads financial strategy, investor reporting, and operational discipline. Brings sector-specific financial credibility uncommon in bio-composites ventures.',
          imageKey: 'benjamin',
        },
        {
          name: 'Othman Ihrai',
          role: 'Cofounder & Head of IP + Legal Strategy',
          equity: '',
          bio: 'PhD in Intellectual Property Law. 15+ years as project manager and CEO of French Tech-certified startups. Leads IP strategy, patent work, technology governance, and venture structuring.',
          imageKey: 'othman',
        },
        {
          name: 'Matthew Zelitt',
          role: 'Chief Growth Officer',
          equity: '',
          bio: '10+ years across healthcare and early-stage startups, specializing in strategic growth, partnerships, and go-to-market execution. Leads commercial pipeline and investor relations.',
          imageKey: 'matthew',
        },
      ],
    },
    use_of_funds: {
      label: '13 — Use of Funds',
      heading: 'AED 2.2M to build the first certified bio-material manufacturing system in the GCC.',
      total: 'AED 2.2M',
      items: [
        { label: 'Production Space', pct: 30, amount: 'AED 660K' },
        { label: 'Team', pct: 25.5, amount: 'AED 561K' },
        { label: 'Machinery', pct: 24.8, amount: 'AED 545K' },
        { label: 'Certifications & IP', pct: 11.7, amount: 'AED 257K' },
        { label: 'Sales & Buffer', pct: 8, amount: 'AED 176K' },
      ],
    },
    cta: {
      label: '14 — Next Step',
      heading: 'Request the full investor deck.',
      body: 'Raising AED 2.2M ($600K) to build the first certified bio-material manufacturing system in the GCC.',
      href: 'mailto:Andy@numu.bio',
    },
  }
}
