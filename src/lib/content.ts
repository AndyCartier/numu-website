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

export function loadVisitorContent(): VisitorContent {
  return {
    hero: {
      lines: ['Grown materials,', 'surfaces and objects.', 'Made in Dubai.'],
      sublabel: 'Material design & manufacturing — Dubai, UAE',
      meta: 'Est. 2025 — Dubai, UAE',
      cta: { label: 'Look inside NUMU', href: '#inside' },
    },
    statement: {
      label: 'What NUMU is',
      heading: 'Bio-composites grown from biology, engineered for construction.',
    },
    material: {
      label: 'The material',
    },
    process: {
      label: 'Process',
      heading: 'From palm fibre to finished piece.',
    },
    founder: {
      label: 'Founder',
      heading: 'Built by 7 years of hands-on industrialization.',
      body: "NUMU was founded by Andy Cartier — a mycelium industrialization specialist who has spent 7 years compressing the learning curve from lab to production across Europe and the Middle East. A completed installation in the Netherlands. An operational production lab in Dubai. This isn't research — it's execution.",
      role: 'Founder & CEO — Mycelium Industrialization',
    },
    contact: {
      label: 'Contact',
      heading: 'Specify NUMU.',
      ctas: [
        { label: 'Explore the material system', href: '/palmyco' },
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
