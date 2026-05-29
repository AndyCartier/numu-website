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

export type PublicTeamMember = Pick<TeamMember, 'name' | 'role' | 'bio' | 'imageKey'>

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
  stat?: string
  statCountTo?: number
  statPrefix?: string
  statSuffix?: string
}

export type CompetitorRow = {
  name: string
  origin: string
  price: string
  bio: boolean
  local: boolean
  certified: boolean
  certifiedPartial?: boolean
  feedstock: boolean
  design: boolean
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
      meta: 'Est. 2025 — Dubai, UAE',
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
        { label: 'Explore the material system', href: '#material' },
      ],
    },
  }
}

export function loadPublicTeamMembers(): PublicTeamMember[] {
  return [
    {
      name: 'Andy Cartier',
      role: 'Founder & CEO — Mycelium Industrialization',
      bio: 'Leads industrialization, production development, and material execution across Europe and the GCC.',
      imageKey: 'founder',
    },
    {
      name: 'Benjamin Rieux',
      role: 'Cofounder & CFO — Construction Finance',
      bio: 'Oversees finance, construction economics, and the operational discipline behind scale.',
      imageKey: 'benjamin',
    },
    {
      name: 'Othman Ihrai',
      role: 'Cofounder & Head of IP + Legal Strategy',
      bio: 'Leads IP, legal structure, and long-term defensibility of the platform.',
      imageKey: 'othman',
    },
    {
      name: 'Matthew Zelitt',
      role: 'Chief Growth Officer',
      bio: 'Drives partnerships, pipeline development, and commercial growth for early deployments.',
      imageKey: 'matthew',
    },
  ]
}

export function loadInvestorContent(): InvestorContent {
  return {
    hero: {
      lines: ['A bio-engineered', 'material', 'platform.'],
      sublabel: 'Investor Overview — Confidential',
      meta: 'The GCC imports 100% of its construction foam. NUMU is building the first local bio-composites platform.',
      cta: { label: 'View opportunity', href: '#traction' },
    },
    forces: {
      label: '03 — Why Now',
      heading: 'Three forces converging now.',
      items: [
        {
          id: 'policy',
          title: 'Policy Tailwinds',
          body: 'UAE Net Zero 2050 and GCC circular mandates are pushing procurement toward local bio-based materials. Compliance pressure is active now — not aspirational. The regulation window is already open.',
          stat: '2050',
          statCountTo: 2050,
          statPrefix: '',
          statSuffix: '',
        },
        {
          id: 'supply',
          title: 'Supply Gap',
          body: '100% of GCC acoustic and thermal construction foam is imported. Zero local manufacturers exist. Every panel ships in — tariffs, lead times, and currency risk. The gap is structural and immediate.',
          stat: '100%',
          statCountTo: 100,
          statPrefix: '',
          statSuffix: '%',
        },
        {
          id: 'reset',
          title: 'Market Reset',
          body: 'Bolt Threads and MycoWorks raised over $300M combined chasing industrial-scale vertical integration. Both collapsed in 2024–2025. The field is cleared for disciplined regional specialists — exactly what NUMU is.',
          stat: '$300M+',
          statCountTo: 300,
          statPrefix: '$',
          statSuffix: 'M+',
        },
      ],
    },
    market: {
      label: '07 — Market',
      heading: 'A market that grows as NUMU grows.',
      body: "NUMU's addressable market expands in layers as the platform activates new revenue engines. Each phase unlocks a larger opportunity on the same material infrastructure.",
    },
    platform: {
      label: '04 — Platform',
      heading: 'NUMU is a material platform, not a single product.',
      body: 'Acoustics is the entry point. The system expands into insulation, interior materials, and construction systems. Each layer compounds proprietary knowledge and manufacturing advantage.',
    },
    revenue_engines: {
      label: '05 — Revenue Engines',
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
          margin: '36–40%',
          activation: '0–12 months',
          desc: 'Heat-pressed mycelium boards for events, brand activations, and temporary architecture. Built from spent mushroom substrate, a regional waste stream. Near-zero feedstock cost. High volume potential.',
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
          name: 'Packaging · Thermal · Licensing',
          price: 'AED 130–220 / m²',
          margin: '28–42%',
          activation: '18–36 months',
          desc: 'Biomyc inbound packaging tech plus thermal insulation replacing imported mineral wool / PU foam at construction scale. Regional GCC licensing to manufacturing partners. Volume engine unlocked by in-house spawn at Series A.',
          status: 'future',
        },
      ],
    },
    revenue_chart: {
      label: 'Revenue Projection',
      heading: '$10M+ revenue by Year 5.',
      years: [
        { year: 'Y1', low: 0.1, high: 0.15, label: '$126K' },
        { year: 'Y2', low: 0.6, high: 0.85, label: '$701K' },
        { year: 'Y3', low: 1.5, high: 2.3, label: '$1.90M' },
        { year: 'Y4', low: 2.8, high: 4.0, label: '$3.41M' },
        { year: 'Y5', low: 7.5, high: 12.7, label: '$10.1M' },
      ],
    },
    competitive: {
      label: 'Competitive Position',
      heading: 'No direct comparable exists in the GCC.',
      players: [
        { name: 'Synthetic Imports', origin: 'EU / Asia', price: 'AED 400–600', bio: false, local: false, certified: true, feedstock: false, design: false, numu: false },
        { name: 'Desertboard', origin: 'UAE', price: '~AED 1,100', bio: false, local: true, certified: false, feedstock: false, design: false, numu: false },
        { name: 'Ecovative (US)', origin: 'Imported', price: 'AED 2,000+', bio: true, local: false, certified: true, feedstock: false, design: true, numu: false },
        { name: 'NUMU', origin: 'UAE', price: 'AED 1,000–1,800', bio: true, local: true, certified: false, certifiedPartial: true, feedstock: true, design: true, numu: true },
      ],
    },
    traction: {
      label: '02 — What Exists Today',
      heading: 'Two installations. One lab. Real feedstock.',
      items: [
        'Beyond Chrysant (Netherlands) — completed architectural installation',
        'KAVE Dubai — commercial installation in production',
        'Biomyc LOI — European packaging technology licensing pathway active',
        'Certification programme active — acoustic + fire performance testing',
        'Co-inventor on 2 Belgian patent families in mycelium materials (prior work)',
        '3 paid masterclasses delivered — architect + designer community building',
        'TSI MOU signed — NUMU designated Bio-Materials & ISRU Composites Partner',
        'France — bio-based urban pavement R&D co-development project active',
      ],
    },
    roadmap: {
      label: '09 — Roadmap',
      heading: 'Four phases. One compounding platform.',
      phases: [
        {
          year: 'M0–M6',
          label: 'Platform Activation',
          items: [
            'Funding close → immediate deployment',
            'Production facility + press line',
            'First operator hired',
            'Patent filing complete',
            'Certifications initiated',
          ],
        },
        {
          year: 'M6–M18',
          label: 'First Revenue',
          items: [
            'E1 + E2 revenue streams active',
            'KAVE + pipeline conversions',
            'Designer specification channel set',
            'Y1→Y2 revenue: $126K → $701K',
          ],
        },
        {
          year: 'M18–M24',
          label: 'Certification Scale',
          items: [
            'Fire + acoustic certifications achieved',
            'E3 commercial market unlocked',
            '3–5 commercial projects in spec',
            'Y3 revenue: $1.90M — acoustic + fire certified',
          ],
        },
        {
          year: 'M24+',
          label: 'Platform Leverage',
          items: [
            'Thermal + packaging scale to volume',
            'Saudi Arabia + NEOM pathway',
            'First regional licensing deal',
            '→ Series A: $2.5M · in-house spawn + Module 2',
            'Path to 300–400K m²/yr = Series B',
          ],
        },
      ],
    },
    business_model: {
      label: '10 — Business Model',
      heading: 'High-margin products transitioning to platform licensing.',
      body: 'Design-led products at premium price points establish brand and margin. Licensing the material platform to regional manufacturers scales without proportional capex.',
    },
    team: {
      label: '11 — Team',
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
      label: '12 — Use of Funds',
      heading: 'AED 2.2M to build the first certified bio-material manufacturing system in the GCC.',
      total: 'AED 2.2M',
      items: [
        { label: 'Production space + containers', pct: 30, amount: 'AED 660K' },
        { label: 'Team', pct: 25.5, amount: 'AED 561K' },
        { label: 'Machinery', pct: 24.8, amount: 'AED 545K' },
        { label: 'Certifications & IP', pct: 11.7, amount: 'AED 257K' },
        { label: 'Sales & Buffer', pct: 8, amount: 'AED 176K' },
      ],
    },
    cta: {
      label: '13 — Next Step',
      heading: 'Schedule a 30-min founder call.',
      body: '$600K SAFE · AED 2.2M · 18 months to certification scale · Series A target $2.5M',
      href: '#contact',
    },
  }
}
