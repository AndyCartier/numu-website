import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { loadInvestorContent } from '@/lib/content'
import { hasValidInvestorAccessToken, INVESTOR_ACCESS_COOKIE } from '@/lib/investorAccess'
import './deck.css'

export const metadata: Metadata = {
  title: 'NUMU — Investor Deck',
  robots: 'noindex, nofollow',
}

const CREAM  = '#F4EFE8'
const GOLD   = '#B29B7F'
const BORDER = 'rgba(244,239,232,0.10)'

function ScreenFrame({ children }: { children: React.ReactNode }) {
  return <section className="deck-screen-frame">{children}</section>
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="deck-label" style={{ marginBottom: '0.75rem' }}>
      {children}
    </p>
  )
}

function SlideNum({ n }: { n: number }) {
  return (
    <span className="slide-num">
      {String(n).padStart(2, '0')} / 16
    </span>
  )
}

function ImgPlaceholder({ label }: { label: string }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        border: '1px dashed rgba(178,155,127,0.32)',
        background: 'rgba(178,155,127,0.025)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '0.75rem',
        padding: '1.5rem',
        boxSizing: 'border-box',
      }}
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(178,155,127,0.45)" strokeWidth="1.2">
        <rect x="3" y="3" width="18" height="18" rx="1.5" />
        <circle cx="8.5" cy="8.5" r="1.5" fill="rgba(178,155,127,0.45)" stroke="none" />
        <path d="M3 16l6-5 4 4 3-3 5 5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span style={{
        fontSize: '0.6rem',
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color: 'rgba(178,155,127,0.45)',
        textAlign: 'center',
        lineHeight: 1.7,
        maxWidth: '80%',
      }}>
        {label}
      </span>
    </div>
  )
}

// ─── 01 — Cover ─────────────────────────────────────────────────────────────

function SlideCover() {
  const coverProof = [
    ['Operational', 'Dubai lab active'],
    ['Installed', '2 installations · NL + UAE'],
    ['Margins', '60–70% · GROSS'],
  ]

  return (
    <div className="slide slide-cover">
      <div className="slide-cover-left">
        <div>
          <Label>Investor Overview — Confidential</Label>
        </div>
        <div>
          <div className="deck-h1" style={{ fontSize: '7.5rem', marginBottom: '1.25rem', letterSpacing: '-0.035em' }}>
            NUMU
          </div>
          <div style={{ fontSize: '1.55rem', color: 'rgba(244,239,232,0.9)', lineHeight: 1.35, fontFamily: 'var(--font-display, Playfair Display, serif)', maxWidth: '18rem' }}>
            The GCC&apos;s first bio-composite manufacturing platform.
          </div>
          <p style={{ fontSize: '1rem', color: 'rgba(244,239,232,0.68)', lineHeight: 1.68, margin: '1.2rem 0 0', maxWidth: '24rem', fontFamily: 'var(--font-sans, Inter, system-ui, sans-serif)' }}>
            Regional agricultural waste, manufactured into acoustic, composite, and specification-ready materials.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0', borderTop: BORDER, borderBottom: BORDER, padding: '1rem 0', margin: '0.5rem 0 1rem' }}>
          {coverProof.map(([label, value], index) => (
            <div key={label} style={{ borderLeft: index > 0 ? BORDER : 'none', paddingLeft: index > 0 ? '1rem' : '0' }}>
              <div className="deck-label" style={{ marginBottom: '0.25rem' }}>{label}</div>
              <div style={{ fontSize: '1rem', color: CREAM, fontFamily: 'var(--font-sans, Inter, system-ui, sans-serif)', fontWeight: 500, lineHeight: 1.35 }}>
                {value}
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: BORDER, paddingTop: '1.2rem' }}>
          <div className="deck-label" style={{ marginBottom: '0.3rem' }}>
            Founded by Andy Cartier — Dubai, UAE
          </div>
          <div className="deck-label">Series Seed · Raising $600K SAFE · 2026 · Confidential</div>
        </div>
      </div>
      <div className="slide-cover-right">
        <img src="/images/projects/Beyond01.jpg" alt="NUMU installation — Beyond Chrysant, Netherlands" style={{ objectPosition: 'center center' }} />
      </div>
      <SlideNum n={1} />
    </div>
  )
}

// ─── 02 — Thesis ─────────────────────────────────────────────────────────────

function SlideThesis() {
  return (
    <div className="slide" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '8% 10%' }}>
      <Label>02 — Thesis</Label>
      <div
        className="deck-h2"
        style={{ fontSize: '4.1rem', lineHeight: 1.03, marginBottom: '2.4rem', marginTop: '1rem', maxWidth: '82%' }}
      >
        The GCC bio-composite industry will exist.
        NUMU is building it — now.
      </div>
      <hr className="deck-rule-gold" style={{ width: '4rem', marginBottom: '3rem' }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: '5%' }}>
        <p style={{ fontSize: '1.08rem', color: 'rgba(244,239,232,0.78)', lineHeight: 1.72, margin: 0, fontFamily: 'var(--font-sans, Inter, system-ui, sans-serif)', maxWidth: '28rem' }}>
          This is not a bet on consumer sustainability branding. It is a timing bet on regional manufacturing, local feedstock, and a category that remains completely import dependent.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
          {[
            ['100%', 'GCC market imported today'],
            ['AED 2.5B+', 'regional annual demand'],
            ['2 installs', 'Installed, not prototyped'],
            ['0 local', 'direct GCC bio-composite players'],
          ].map(([value, note]) => (
            <div key={value} style={{ border: `1px solid ${BORDER}`, background: 'rgba(244,239,232,0.03)', padding: '1rem 1.1rem' }}>
              <div style={{ fontFamily: 'var(--font-sans, Inter, system-ui, sans-serif)', fontSize: '1.7rem', color: GOLD, fontWeight: 300, letterSpacing: '-0.04em', lineHeight: 1 }}>
                {value}
              </div>
              <div className="deck-label" style={{ marginTop: '0.45rem', fontSize: '0.56rem' }}>{note}</div>
            </div>
          ))}
        </div>
      </div>
      <SlideNum n={2} />
    </div>
  )
}

// ─── 03 — Problem — supply chain diagram ────────────────────────────────────

function ProblemDiagram() {
  const sources = [
    { cx: 80,  label: 'EUROPE',         value: 'AED 1.4B+', share: '~55%', detail: 'Rockwool · Knauf · Saint-Gobain' },
    { cx: 250, label: 'SE ASIA / CHINA', value: 'AED 800M+', share: '~32%', detail: 'synthetic foam · mineral wool' },
    { cx: 420, label: 'AMERICAS',        value: 'AED 300M+', share: '~13%', detail: 'specialty + fire-rated systems' },
  ]

  const risks = [
    { label: 'LEAD TIME',       value: '8–14 wks' },
    { label: 'IMPORT DUTY',     value: '5–15%' },
    { label: 'FX EXPOSURE',     value: '100%' },
    { label: 'LOCAL ALT.',      value: 'zero' },
  ]

  // Risk box layout: 4 equal boxes across 500px, with 10px margin each side
  const riskW = 110
  const riskGap = (500 - 8 - riskW * 4) / 3
  const riskBoxes = risks.map((r, i) => ({
    ...r,
    x: 8 + i * (riskW + riskGap),
  }))

  return (
    <svg
      viewBox="0 0 500 410"
      style={{ width: '100%', height: '100%', display: 'block' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <marker id="arr" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto">
          <polygon points="0 0, 7 2.5, 0 5" fill="rgba(178,155,127,0.55)" />
        </marker>
      </defs>

      {/* ── Source nodes ── */}
      {sources.map(({ cx, label, value, share, detail }) => (
        <g key={label}>
          <rect
            x={cx - 72} y="12" width="144" height="70" rx="2"
            fill="rgba(178,155,127,0.07)" stroke="rgba(178,155,127,0.28)" strokeWidth="1"
          />
          <text x={cx} y="33" textAnchor="middle" fontSize="6" fill="#c9a96e" letterSpacing="2.5" fontFamily="Inter,sans-serif">
            {label}
          </text>
          <text x={cx} y="56" textAnchor="middle" fontSize="20" fill="#F4EFE8" fontFamily="Inter,sans-serif" fontWeight="200" letterSpacing="-1">
            {value}
          </text>
          <text x={cx} y="72" textAnchor="middle" fontSize="7" fill="rgba(244,239,232,0.42)" fontFamily="Inter,sans-serif">
            {share} · {detail}
          </text>
        </g>
      ))}

      {/* ── Converging arrows to GCC ── */}
      {/* EU diagonal */}
      <line x1="80"  y1="82" x2="195" y2="163" stroke="rgba(178,155,127,0.38)" strokeWidth="1.5" strokeDasharray="5,3.5" markerEnd="url(#arr)" />
      {/* SE Asia straight */}
      <line x1="250" y1="82" x2="250" y2="163" stroke="rgba(178,155,127,0.6)"  strokeWidth="2"   markerEnd="url(#arr)" />
      {/* Americas diagonal */}
      <line x1="420" y1="82" x2="305" y2="163" stroke="rgba(178,155,127,0.38)" strokeWidth="1.5" strokeDasharray="5,3.5" markerEnd="url(#arr)" />

      {/* ── GCC demand box ── */}
      <rect
        x="88" y="168" width="324" height="84" rx="2"
        fill="rgba(10,8,6,0.95)" stroke="rgba(178,155,127,0.52)" strokeWidth="1.5"
      />
      <text x="250" y="192" textAnchor="middle" fontSize="6.5" fill="#c9a96e" letterSpacing="2.5" fontFamily="Inter,sans-serif">
        GCC ANNUAL DEMAND
      </text>
      <text x="250" y="221" textAnchor="middle" fontSize="30" fill="#F4EFE8" fontFamily="Inter,sans-serif" fontWeight="200" letterSpacing="-1.5">
        AED 2.5B+
      </text>
      <text x="250" y="241" textAnchor="middle" fontSize="7.5" fill="rgba(244,239,232,0.5)" fontFamily="Inter,sans-serif">
        acoustic · thermal · insulation · composites
      </text>

      {/* ── Divider ── */}
      <line x1="40" y1="270" x2="460" y2="270" stroke="rgba(244,239,232,0.07)" strokeWidth="1" />

      {/* ── Local production = 0 ── */}
      <text x="250" y="292" textAnchor="middle" fontSize="6.5" fill="rgba(244,239,232,0.3)" letterSpacing="2.5" fontFamily="Inter,sans-serif">
        LOCAL BIO-MATERIAL MANUFACTURERS
      </text>
      <text x="250" y="322" textAnchor="middle" fontSize="38" fill="rgba(244,239,232,0.16)" fontFamily="Inter,sans-serif" fontWeight="200" letterSpacing="-2">
        zero.
      </text>

      {/* ── Risk metrics ── */}
      {riskBoxes.map(({ x, label, value }) => (
        <g key={label}>
          <rect x={x} y="342" width={riskW} height="50" rx="2"
            fill="rgba(244,239,232,0.025)" stroke="rgba(244,239,232,0.08)" strokeWidth="1" />
          <text x={x + riskW / 2} y="359" textAnchor="middle" fontSize="6" fill="rgba(244,239,232,0.38)" letterSpacing="1.5" fontFamily="Inter,sans-serif">
            {label}
          </text>
          <text x={x + riskW / 2} y="380" textAnchor="middle" fontSize="15" fill="rgba(244,239,232,0.72)" fontFamily="Inter,sans-serif" fontWeight="300" letterSpacing="-0.3">
            {value}
          </text>
        </g>
      ))}

      {/* ── Source note ── */}
      <text x="250" y="406" textAnchor="middle" fontSize="5.5" fill="rgba(244,239,232,0.18)" fontFamily="Inter,sans-serif">
        Sources: MEED GCC Construction Report 2024 · Euroconstruct · GCC Trade Statistics · ASTM import data
      </text>
    </svg>
  )
}

function SlideProblem() {
  return (
    <div className="slide slide-two-col">
      <div className="slide-two-col-content" style={{ justifyContent: 'space-between', padding: '8% 6% 8% 8%' }}>
        <Label>03 — The Problem</Label>

        <div>
          <div className="deck-h2" style={{ fontSize: '6rem', lineHeight: 0.9, marginBottom: '0.2rem' }}>
            100%
          </div>
          <div className="deck-h2" style={{ fontSize: '6rem', lineHeight: 0.9, color: GOLD, marginBottom: '1.5rem' }}>
            imported.
          </div>
          <div style={{ fontSize: '1.05rem', color: 'rgba(244,239,232,0.6)', fontFamily: 'var(--font-sans, Inter, system-ui, sans-serif)', lineHeight: 1.5 }}>
            Zero local bio-material production in the GCC.
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {[
            ['01', 'Zero regional alternative.', 'GCC acoustic + thermal construction: 100% import-dependent.'],
            ['02', 'Broken supply chain.', 'Every panel ships in — tariffs, lead times, zero local specification pathway.'],
            ['03', 'Policy misalignment.', 'Petroleum-derived materials now in conflict with UAE Net Zero + GCC mandates.'],
          ].map(([n, title, body]) => (
            <div key={n} style={{ paddingBottom: '1.25rem', marginBottom: '1.25rem', borderBottom: BORDER }}>
              <div className="deck-eyebrow" style={{ marginBottom: '0.4rem' }}>{n}</div>
              <div style={{ fontSize: '1rem', color: CREAM, fontFamily: 'var(--font-sans, Inter, system-ui, sans-serif)', fontWeight: 500, marginBottom: '0.25rem' }}>
                {title}
              </div>
              <div style={{ fontSize: '1rem', color: 'rgba(244,239,232,0.68)', fontFamily: 'var(--font-sans, Inter, system-ui, sans-serif)', lineHeight: 1.55 }}>
                {body}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — supply chain diagram */}
      <div className="slide-two-col-image" style={{ background: 'rgba(8,6,4,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5% 6%' }}>
        <ProblemDiagram />
      </div>

      <SlideNum n={3} />
    </div>
  )
}

// ─── 04 — Market Scale Diagram ───────────────────────────────────────────────

function MarketScaleDiagram() {
  // Proportional widths: TAM = full, SAM ≈ 5% of TAM, SOM ≈ 8% of SAM
  // Visually scaled for legibility (not pixel-perfect proportion)
  const W = 800
  const tamW = W
  const samW = Math.round(W * 0.38)
  const somW = Math.round(samW * 0.28)
  const barH = 22
  const gap = 18
  const labelX = tamW + 14

  return (
    <svg viewBox={`0 0 ${W + 220} 110`} style={{ width: '100%', display: 'block' }} xmlns="http://www.w3.org/2000/svg">
      {/* TAM */}
      <rect x="0" y="0" width={tamW} height={barH} rx="2" fill="rgba(244,239,232,0.07)" />
      <text x="8" y="15" fontSize="7" fill="rgba(244,239,232,0.38)" letterSpacing="1.8" fontFamily="Inter,sans-serif">
        TAM — $50B+ GLOBAL BIO-BASED BUILDING MATERIALS
      </text>
      <line x1={tamW} y1={barH / 2} x2={tamW + 10} y2={barH / 2} stroke="rgba(244,239,232,0.18)" strokeWidth="0.8" />
      <text x={labelX} y="8" fontSize="6.5" fill="rgba(244,239,232,0.32)" letterSpacing="1" fontFamily="Inter,sans-serif">BY 2030</text>
      <text x={labelX} y="18" fontSize="7.5" fill="rgba(244,239,232,0.50)" letterSpacing="-0.2" fontFamily="Inter,sans-serif">$50B+</text>

      {/* SAM */}
      <rect x="0" y={barH + gap} width={samW} height={barH} rx="2" fill="rgba(244,239,232,0.12)" />
      <text x="8" y={barH + gap + 15} fontSize="7" fill="rgba(244,239,232,0.55)" letterSpacing="1.8" fontFamily="Inter,sans-serif">
        SAM — AED 2.5B+ GCC ACOUSTIC + THERMAL IMPORTS
      </text>
      <line x1={samW} y1={barH + gap + barH / 2} x2={tamW + 10} y2={barH + gap + barH / 2} stroke="rgba(244,239,232,0.15)" strokeWidth="0.8" strokeDasharray="3,2" />
      <text x={labelX} y={barH + gap + 8} fontSize="6.5" fill="rgba(244,239,232,0.38)" letterSpacing="1" fontFamily="Inter,sans-serif">ANNUAL</text>
      <text x={labelX} y={barH + gap + 18} fontSize="7.5" fill="rgba(244,239,232,0.58)" letterSpacing="-0.2" fontFamily="Inter,sans-serif">AED 2.5B+</text>

      {/* SOM */}
      <rect x="0" y={(barH + gap) * 2} width={somW} height={barH} rx="2" fill="rgba(201,169,110,0.18)" stroke="rgba(201,169,110,0.55)" strokeWidth="1" />
      <text x="8" y={(barH + gap) * 2 + 15} fontSize="7" fill="#c9a96e" letterSpacing="1.8" fontFamily="Inter,sans-serif">
        SOM — AED 150–300M NUMU SERVICEABLE 3–5 YRS
      </text>
      <line x1={somW} y1={(barH + gap) * 2 + barH / 2} x2={tamW + 10} y2={(barH + gap) * 2 + barH / 2} stroke="rgba(201,169,110,0.3)" strokeWidth="0.8" strokeDasharray="3,2" />
      <text x={labelX} y={(barH + gap) * 2 + 8} fontSize="6.5" fill="rgba(201,169,110,0.65)" letterSpacing="1" fontFamily="Inter,sans-serif">TARGET</text>
      <text x={labelX} y={(barH + gap) * 2 + 18} fontSize="7.5" fill="#c9a96e" letterSpacing="-0.2" fontFamily="Inter,sans-serif">AED 150–300M</text>
    </svg>
  )
}

// ─── 04 — Market Opportunity ─────────────────────────────────────────────────

function SlideMarket() {
  const tiers = [
    {
      label: 'TAM',
      value: '$50B+',
      name: 'Global bio-based building materials',
      note: 'By 2030 · 12–15% CAGR · Grand View Research',
      gold: false,
    },
    {
      label: 'SAM',
      value: 'AED 2.5B+',
      name: 'GCC acoustic & thermal construction imports',
      note: 'Annual spend · 100% synthetic today · MEED 2024',
      gold: false,
    },
    {
      label: 'SOM',
      value: 'AED 150–300M',
      name: 'NUMU serviceable in 3–5 years',
      note: 'Acoustic · decorative · certified spec · licensing',
      gold: true,
    },
  ]

  return (
    <div className="slide" style={{ display: 'flex', flexDirection: 'column', padding: '6% 8%', justifyContent: 'space-between' }}>
      <div style={{ marginBottom: '4%' }}>
        <Label>04 — Market Opportunity</Label>
        <div className="deck-h2" style={{ fontSize: '3.5rem', marginTop: '0.5rem' }}>
          A billion-dirham import dependency.<br />No local alternative exists.
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0', alignItems: 'flex-start', marginBottom: '3%' }}>
        {tiers.map((t, i) => (
          <div
            key={t.label}
            style={{
              borderLeft: i > 0 ? BORDER : 'none',
              paddingLeft: i > 0 ? '6%' : '0',
              paddingRight: i < 2 ? '6%' : '0',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            <div className="deck-eyebrow" style={{ fontSize: '0.75rem' }}>{t.label}</div>
            <div
              style={{
                fontFamily: 'var(--font-sans, Inter, system-ui, sans-serif)',
                fontSize: '3.75rem',
                lineHeight: 0.92,
                letterSpacing: '-0.045em',
                fontWeight: 200,
                color: t.gold ? GOLD : CREAM,
              }}
            >
              {t.value}
            </div>
            <div style={{ fontSize: '1rem', color: CREAM, fontFamily: 'var(--font-sans, Inter, system-ui, sans-serif)', lineHeight: 1.4 }}>
              {t.name}
            </div>
            <div className="deck-label" style={{ fontSize: '0.6rem' }}>{t.note}</div>
          </div>
        ))}
      </div>

      <div style={{ borderTop: BORDER, paddingTop: '3%' }}>
        <MarketScaleDiagram />
      </div>

      <SlideNum n={4} />
    </div>
  )
}

// ─── 05 — Why Now ────────────────────────────────────────────────────────────

function ThreeForceColumn({ n, title, bigNumber, support }: { n: string; title: string; bigNumber: string; support: string }) {
  return (
    <div className="col-card" style={{ padding: '6% 6%', justifyContent: 'flex-start', gap: '0', flexDirection: 'column' }}>
      <div className="deck-eyebrow" style={{ marginBottom: '0.85rem' }}>{n}</div>
      <div className="deck-h3" style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>{title}</div>
      <div style={{
        fontFamily: 'var(--font-display, Playfair Display, Georgia, serif)',
        fontSize: '6rem',
        lineHeight: 0.88,
        letterSpacing: '-0.04em',
        fontWeight: 400,
        color: '#c9a96e',
        marginBottom: '1.5rem',
      }}>
        {bigNumber}
      </div>
      <p style={{ fontSize: '0.95rem', color: 'rgba(244,239,232,0.72)', lineHeight: 1.65, margin: 0, fontFamily: 'var(--font-sans, Inter, system-ui, sans-serif)' }}>
        {support}
      </p>
    </div>
  )
}

function SlideWhyNow() {
  return (
    <div className="slide" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '6% 7% 4%', borderBottom: BORDER }}>
        <Label>05 — Why Now</Label>
        <div className="deck-h2" style={{ fontSize: '3rem', marginBottom: 0 }}>
          Three forces converging now.
        </div>
      </div>

      <div className="slide-three-col" style={{ flex: 1 }}>
        <ThreeForceColumn
          n="01"
          title="Policy Tailwinds"
          bigNumber="2050"
          support="UAE Net Zero 2050 and GCC circular mandates pushing procurement toward local bio-based materials. Compliance pressure active now."
        />
        <ThreeForceColumn
          n="02"
          title="Supply Gap"
          bigNumber="100%"
          support="of GCC acoustic and thermal construction foam is imported. Zero local manufacturers exist."
        />
        <ThreeForceColumn
          n="03"
          title="Market Reset"
          bigNumber="$300M+"
          support="Bolt Threads and MycoWorks collapsed pursuing industrial-scale vertical integration. The field is cleared for disciplined regional specialists."
        />
      </div>

      <SlideNum n={5} />
    </div>
  )
}

// ─── 06 — Traction ───────────────────────────────────────────────────────────

function SlideTraction() {
  const proof = [
    'Beyond Chrysant (Netherlands) — completed architectural installation',
    'KAVE Dubai — commercial installation in production',
    'Biomyc LOI — European packaging licensing pathway secured',
    'Certification programme active — acoustic + fire performance testing',
  ]

  return (
    <div className="slide" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '5% 7% 3%', borderBottom: BORDER }}>
        <Label>06 — Traction</Label>
        <div className="deck-h2" style={{ fontSize: '3rem', marginBottom: 0 }}>
          Early traction that de-risks the thesis.
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', flex: 1, gap: '0' }}>
        {/* Left — stats + proof */}
        <div style={{ padding: '4% 5% 4% 7%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRight: BORDER }}>
          {/* Three big stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0', borderBottom: BORDER, paddingBottom: '4%', marginBottom: '4%' }}>
            {[
              ['AED 184K', 'founder capital deployed'],
              ['2', 'International installs'],
              ['1 LOI', 'packaging pathway active'],
            ].map(([num, lbl], i) => (
              <div key={lbl} style={{ borderLeft: i > 0 ? BORDER : 'none', paddingLeft: i > 0 ? '1.5rem' : '0' }}>
                <div style={{ fontFamily: 'var(--font-sans, Inter, system-ui, sans-serif)', fontSize: '3rem', lineHeight: 1, letterSpacing: '-0.04em', fontWeight: 200, color: '#c9a96e' }}>
                  {num}
                </div>
                <div className="deck-label" style={{ marginTop: '0.5rem' }}>{lbl}</div>
              </div>
            ))}
          </div>

          {/* Proof points — 4 bullets only */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0' }}>
            {proof.map((item, i) => (
              <div key={i} className="traction-item">
                <div className="traction-dot" />
                <span style={{ fontSize: '1rem', color: CREAM, fontFamily: 'var(--font-sans, Inter, system-ui, sans-serif)', fontWeight: 500, lineHeight: 1.5 }}>
                  {item}
                </span>
              </div>
            ))}
          </div>

          <p style={{ fontSize: '0.9rem', color: 'rgba(244,239,232,0.5)', fontFamily: 'var(--font-sans, Inter, system-ui, sans-serif)', margin: 0, marginTop: '3%' }}>
            4 academic partnerships across 3 countries ·<br />De Montfort · AUS · Heriot-Watt Dubai · DIDI
          </p>
        </div>

        {/* Right — installation photo (full bleed) */}
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <img
            src="/images/projects/Beyond01.jpg"
            alt="Beyond Chrysant installation — Netherlands"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center center', display: 'block' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 60%, rgba(14,12,10,0.65) 100%)' }} />
          <div style={{ position: 'absolute', bottom: '6%', left: '6%', right: '6%' }}>
            <div className="deck-eyebrow" style={{ marginBottom: '0.3rem' }}>Installed</div>
            <div style={{ fontSize: '1.05rem', color: CREAM, fontFamily: 'var(--font-sans, Inter, system-ui, sans-serif)', fontWeight: 500 }}>
              Beyond Chrysant · Netherlands
            </div>
          </div>
        </div>
      </div>

      <SlideNum n={6} />
    </div>
  )
}

// ─── 07 — Material System ────────────────────────────────────────────────────

function SlideWhatNumuBuilds() {
  return (
    <div className="slide slide-two-col">
      <div className="slide-two-col-content" style={{ justifyContent: 'center', gap: '2rem', padding: '7% 6% 7% 7%' }}>
        <div>
          <Label>07 — The Material System</Label>
          <div className="deck-h2" style={{ fontSize: '3.25rem', marginBottom: '1.25rem' }}>
            What NUMU builds.
          </div>
          <p style={{ fontSize: '1.05rem', color: 'rgba(244,239,232,0.8)', lineHeight: 1.68, margin: 0, maxWidth: '28rem', fontFamily: 'var(--font-sans, Inter, system-ui, sans-serif)' }}>
            A proprietary bio-composite using mycelium as a natural binder for
            regional waste — palm fibre, date kernels, spent substrate.
            Tunable. Grown for UAE hot-arid climate.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {[
            ['Feedstock', 'Regional agricultural waste — near-zero input cost'],
            ['Process', 'Proprietary hot-arid growth + pressing system'],
            ['Output', 'Acoustic panels · composite boards · specification material'],
            ['Moat', 'First GCC operating knowledge + regional climate IP'],
          ].map(([k, v]) => (
            <div
              key={k}
              style={{ display: 'grid', gridTemplateColumns: '7rem 1fr', gap: '1rem', alignItems: 'start', paddingBottom: '1rem', marginBottom: '1rem', borderBottom: BORDER }}
            >
              <span className="deck-label" style={{ paddingTop: '0.1rem' }}>{k}</span>
              <span style={{ fontSize: '1rem', color: CREAM, fontFamily: 'var(--font-sans, Inter, system-ui, sans-serif)', fontWeight: 500, lineHeight: 1.45 }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="slide-two-col-image">
        <img src="/images/products/biofoam_detail.png" alt="NUMU bio-composite material detail" style={{ objectPosition: 'center center' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 50%, rgba(26,23,20,0.6) 100%)' }} />
      </div>

      <SlideNum n={7} />
    </div>
  )
}

// ─── 08 — Platform ───────────────────────────────────────────────────────────

function SlidePlatform() {
  const engines = [
    { id: 'E1', name: 'Grown acoustic panels',      status: 'ACTIVE NOW',    desc: 'Interior designers, boutique hospitality, high-end retail. Premium-margin. No certification required.' },
    { id: 'E2', name: 'Pressed composite boards',    status: 'ACTIVE NOW',    desc: 'Events, brand activations, temporary architecture. Near-zero feedstock cost. High volume potential.' },
    { id: 'E3', name: 'Certified spec. acoustic',    status: '12–24 MONTHS',  desc: 'Architects specifying commercial projects. Unlocks offices, hospitality, cultural spaces at scale.' },
    { id: 'E4', name: 'Packaging + licensing',       status: '18–36 MONTHS',  desc: 'Biomyc LOI secured. Regional GCC licensing pathway to manufacturing partners.' },
  ]

  return (
    <div className="slide" style={{ display: 'flex', flexDirection: 'column', padding: '5.5% 7%' }}>
      <Label>08 — Platform</Label>

      <div style={{ marginBottom: '3%' }}>
        <div className="deck-h2" style={{ fontSize: '2.75rem', marginBottom: '0.75rem' }}>
          One platform. Multiple revenue engines.
        </div>
        <p style={{ fontSize: '1rem', color: 'rgba(244,239,232,0.68)', lineHeight: 1.6, margin: 0, fontFamily: 'var(--font-sans, Inter, system-ui, sans-serif)', maxWidth: '52rem' }}>
          Shared feedstock. Shared IP. Different markets. Infrastructure — not a single product bet.
        </p>
      </div>

      {/* Platform core card */}
      <div style={{ background: 'rgba(178,155,127,0.10)', border: `1px solid ${GOLD}`, padding: '1.1rem 1.6rem', marginBottom: '2.5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div className="deck-eyebrow" style={{ marginBottom: '0.2rem' }}>Platform Core</div>
          <div style={{ fontSize: '1.1rem', color: CREAM, fontFamily: 'var(--font-display, Playfair Display, serif)' }}>
            Mycelium material platform
          </div>
        </div>
        <div className="deck-label" style={{ textAlign: 'right' }}>
          Feedstock · Process IP · Hot-arid formulation · GCC knowledge
        </div>
      </div>

      {/* Four engines — full width 4-column */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0', flex: 1 }}>
        {engines.map((e, i) => (
          <div
            key={e.id}
            style={{
              borderLeft: i > 0 ? BORDER : 'none',
              borderTop: BORDER,
              padding: '1.4rem 1.5rem',
              background: e.status === 'ACTIVE NOW' ? 'rgba(178,155,127,0.05)' : 'transparent',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="deck-eyebrow" style={{ fontSize: '0.6rem' }}>{e.id}</span>
              <span style={{
                fontSize: '0.52rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: e.status === 'ACTIVE NOW' ? '#c9a96e' : 'rgba(244,239,232,0.35)',
                fontFamily: 'var(--font-sans, Inter, system-ui, sans-serif)',
                fontWeight: 500,
              }}>{e.status}</span>
            </div>
            <div style={{ fontSize: '1rem', color: CREAM, fontFamily: 'var(--font-sans, Inter, system-ui, sans-serif)', fontWeight: 500, lineHeight: 1.3 }}>
              {e.name}
            </div>
            <p style={{ fontSize: '0.88rem', color: 'rgba(244,239,232,0.62)', lineHeight: 1.6, margin: 0, fontFamily: 'var(--font-sans, Inter, system-ui, sans-serif)' }}>
              {e.desc}
            </p>
          </div>
        ))}
      </div>

      <SlideNum n={8} />
    </div>
  )
}

// ─── 09 — Revenue Engines ────────────────────────────────────────────────────

function SlideFourEngines() {
  const engines = [
    {
      id: 'E1',
      name: 'Grown Decorative Acoustic',
      timeline: '0–12 months',
      price: 'AED 1,000–1,500 / m²',
      margin: '60–70%',
      status: 'active' as const,
      desc: 'Interior designers, boutique hospitality, high-end retail. No certification required. Premium-margin. Revenue active now.',
    },
    {
      id: 'E2',
      name: 'Pressed Composite Boards',
      timeline: '0–12 months',
      price: 'AED 200–500 / m²',
      margin: '50–65%',
      status: 'active' as const,
      desc: 'Events, brand activations, temporary architecture. Near-zero feedstock cost. High volume potential.',
    },
    {
      id: 'E3',
      name: 'Certified Acoustic Specification',
      timeline: '12–24 months',
      price: 'AED 1,100–1,800 / m²',
      margin: '55–65%',
      status: 'next' as const,
      desc: 'Architects specifying commercial projects: offices, hospitality, cultural spaces. Unlocks commercial scale.',
    },
    {
      id: 'E4',
      name: 'Packaging & Licensing',
      timeline: '18–36 months',
      price: 'Anchor + licensing',
      margin: '30–45%',
      status: 'future' as const,
      desc: 'Biodegradable packaging via Biomyc LOI. Regional GCC licensing to manufacturing partners.',
    },
  ]

  const pillClass: Record<string, string> = {
    active: 'engine-pill-active',
    next: 'engine-pill-next',
    future: 'engine-pill-future',
  }

  return (
    <div className="slide" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '4.5% 7% 3%', borderBottom: BORDER }}>
        <Label>09 — Revenue Engines</Label>
        <div className="deck-h2" style={{ fontSize: '3rem', marginBottom: 0 }}>
          Four engines. One platform.
        </div>
      </div>

      <div className="engine-cards" style={{ flex: 1 }}>
        {engines.map((e) => (
          <div
            key={e.id}
            className={`engine-card${e.status === 'active' ? ' engine-card-active' : ''}`}
            style={{ opacity: e.status === 'future' ? 0.55 : 1 }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span className="engine-id">{e.id}</span>
                <span className={`engine-pill ${pillClass[e.status]}`}>{e.timeline}</span>
              </div>
              <div style={{ fontSize: '1rem', color: CREAM, fontFamily: 'var(--font-sans, Inter, system-ui, sans-serif)', fontWeight: 500, lineHeight: 1.35, marginBottom: '1.25rem' }}>
                {e.name}
              </div>
              <p style={{ fontSize: '0.95rem', color: 'rgba(244,239,232,0.68)', lineHeight: 1.6, margin: 0, fontFamily: 'var(--font-sans, Inter, system-ui, sans-serif)' }}>
                {e.desc}
              </p>
            </div>
            <div style={{ borderTop: BORDER, paddingTop: '1rem' }}>
              <div className={e.status === 'active' ? 'engine-margin' : 'engine-margin-dim'}>{e.margin}</div>
              <div className="deck-label" style={{ marginTop: '0.4rem' }}>gross margin</div>
              <div style={{ fontSize: '0.9rem', color: 'rgba(244,239,232,0.55)', marginTop: '0.5rem', fontFamily: 'var(--font-sans, Inter, system-ui, sans-serif)' }}>
                {e.price}
              </div>
            </div>
          </div>
        ))}
      </div>

      <SlideNum n={9} />
    </div>
  )
}

// ─── 10 — Competitive Position ────────────────────────────────────────────────

function SlideCompetitive() {
  type CertStatus = boolean | 'pending'
  type Row = { name: string; origin: string; price: string; bio: boolean; local: boolean; certified: CertStatus; feedstock: boolean; design: boolean; numu: boolean }

  const players: Row[] = [
    { name: 'Synthetic Imports', origin: 'EU / Asia',  price: 'AED 400–600',     bio: false, local: false, certified: true,      feedstock: false, design: false, numu: false },
    { name: 'Desertboard',       origin: 'UAE',        price: '~AED 1,100',       bio: false, local: true,  certified: false,     feedstock: false, design: false, numu: false },
    { name: 'Ecovative (US)',    origin: 'Imported',   price: 'AED 2,000+',       bio: true,  local: false, certified: true,      feedstock: false, design: true,  numu: false },
    { name: 'NUMU',             origin: 'UAE',        price: 'AED 1,000–1,800',  bio: true,  local: true,  certified: 'pending', feedstock: true,  design: true,  numu: true  },
  ]

  const cols: { key: keyof Row; label: string }[] = [
    { key: 'bio',       label: 'Bio-based' },
    { key: 'local',     label: 'GCC local' },
    { key: 'feedstock', label: 'Local feedstock' },
    { key: 'design',    label: 'Design freedom' },
    { key: 'certified', label: 'Certified' },
  ]

  function Check({ val }: { val: CertStatus }) {
    if (val === 'pending') return <span style={{ color: '#c9a96e', fontSize: '1rem' }} title="In progress">◐</span>
    return <span className={val ? 'chk-yes' : 'chk-no'} style={{ fontSize: '1rem' }}>{val ? '●' : '○'}</span>
  }

  return (
    <div className="slide" style={{ display: 'flex', flexDirection: 'column', padding: '5.5% 7%' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <Label>10 — Competitive Position</Label>
        <div className="deck-h2" style={{ fontSize: '3rem' }}>
          No direct comparable exists in the GCC.
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <table className="deck-table">
          <thead>
            <tr>
              <th style={{ width: '18%' }}>Player</th>
              <th style={{ width: '10%' }}>Origin</th>
              <th style={{ width: '16%' }}>Price / m²</th>
              {cols.map((c) => (
                <th key={c.key} style={{ width: '11%', textAlign: 'center' }}>{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {players.map((p) => (
              <tr key={p.name} className={p.numu ? 'numu-row' : ''}>
                <td style={{ fontWeight: p.numu ? 500 : 400, fontSize: '1rem' }}>{p.name}</td>
                <td style={{ color: 'rgba(244,239,232,0.65)', fontSize: '1rem' }}>{p.origin}</td>
                <td style={{ fontSize: '1rem' }}>{p.price}</td>
                {cols.map((c) => (
                  <td key={c.key} style={{ textAlign: 'center' }}>
                    <Check val={p[c.key] as CertStatus} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p style={{ marginTop: '1.75rem', marginBottom: '0.85rem', fontSize: '0.88rem', color: 'rgba(244,239,232,0.62)', lineHeight: 1.65, fontFamily: 'var(--font-sans, Inter, system-ui, sans-serif)', maxWidth: '88%' }}>
        Context: Bolt Threads and MycoWorks raised over $300M combined chasing industrial-scale vertical integration in mycelium leather and packaging. Both collapsed in 2024–2025. NUMU is structurally different — specialty-scale, licensing-pathway, regionally locked-in. The failure pattern is not our pattern.
      </p>
      <p className="deck-label" style={{ marginTop: '0.5rem' }}>
        ● Present &nbsp;&nbsp; ○ Absent &nbsp;&nbsp; ◐ In progress
        &nbsp;&nbsp;&nbsp;&nbsp;
        NUMU: only player with bio-based + GCC local + local feedstock + design freedom.
        Certification initiated 2026.
      </p>

      <SlideNum n={10} />
    </div>
  )
}

// ─── Revenue bar chart (used in slide 11) ────────────────────────────────────

function RevenueBarChart() {
  const years = [
    { label: 'AED 1–2M',   low: 1,  high: 2,  year: 'Y1', badge: 'CURRENT RAISE · AED 2.2M', badgeAccent: false },
    { label: 'AED 4–8M',   low: 4,  high: 8,  year: 'Y2', badge: null, badgeAccent: false },
    { label: 'AED 10–18M', low: 10, high: 18, year: 'Y3', badge: 'SERIES A · AED 11M', badgeAccent: true },
    { label: 'AED 17–30M', low: 17, high: 30, year: 'Y4', badge: null, badgeAccent: false },
  ]
  const MAX_VAL = 34
  // SVG layout: total width 900, 4 equal bars with gaps
  const W = 900
  const BAR_AREA_H = 140  // bar zone height in SVG units
  const barW = 160
  const gapW = (W - barW * 4) / 3
  const BADGE_H = 42       // fixed badge zone below baseline
  const LABEL_H = 32       // fixed label zone above badge

  return (
    <svg
      viewBox={`0 0 ${W} ${BAR_AREA_H + LABEL_H + BADGE_H}`}
      style={{ width: '100%', display: 'block' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Shared baseline */}
      <line x1="0" y1={BAR_AREA_H} x2={W} y2={BAR_AREA_H} stroke="rgba(244,239,232,0.10)" strokeWidth="1" />

      {years.map((yr, i) => {
        const x = i * (barW + gapW)
        const cx = x + barW / 2
        const lowH  = Math.max((yr.low  / MAX_VAL) * BAR_AREA_H, 8)
        const highH = Math.max((yr.high / MAX_VAL) * BAR_AREA_H, lowH + 6)
        const rangeH = highH - lowH
        const isLast = i === years.length - 1
        const barColor = isLast ? 'rgba(201,169,110,0.75)' : i === 0 ? 'rgba(244,239,232,0.45)' : 'rgba(244,239,232,0.72)'
        const rangeColor = isLast ? 'rgba(201,169,110,0.22)' : 'rgba(244,239,232,0.18)'

        return (
          <g key={yr.year}>
            {/* Upside range */}
            <rect x={x} y={BAR_AREA_H - highH} width={barW} height={rangeH}
              fill={rangeColor} />
            {/* Base bar */}
            <rect x={x} y={BAR_AREA_H - lowH} width={barW} height={lowH}
              fill={barColor} />

            {/* Top value label — above bar */}
            <text x={cx} y={BAR_AREA_H - highH - 5} textAnchor="middle"
              fontSize="7.5" fill={isLast ? '#c9a96e' : 'rgba(244,239,232,0.55)'}
              letterSpacing="0.5" fontFamily="Inter,sans-serif">
              {yr.label}
            </text>

            {/* Year label — fixed zone below baseline */}
            <text x={cx} y={BAR_AREA_H + 14} textAnchor="middle"
              fontSize="6" fill="rgba(244,239,232,0.38)"
              letterSpacing="1.8" fontFamily="Inter,sans-serif">
              {yr.year}
            </text>
            <text x={cx} y={BAR_AREA_H + 24} textAnchor="middle"
              fontSize="8" fill={isLast ? '#c9a96e' : 'rgba(244,239,232,0.68)'}
              letterSpacing="-0.2" fontFamily="Inter,sans-serif" fontWeight={isLast ? '400' : '300'}>
              {/* short label below year */}
            </text>

            {/* Badge — fixed zone, same height for all columns */}
            {yr.badge && (
              <g>
                <rect
                  x={cx - 72} y={BAR_AREA_H + LABEL_H + 2}
                  width={144} height={BADGE_H - 6} rx="1"
                  fill={yr.badgeAccent ? 'rgba(201,169,110,0.12)' : 'rgba(244,239,232,0.05)'}
                  stroke={yr.badgeAccent ? 'rgba(201,169,110,0.45)' : 'rgba(244,239,232,0.20)'}
                  strokeWidth="0.8"
                />
                <text x={cx} y={BAR_AREA_H + LABEL_H + 16} textAnchor="middle"
                  fontSize="5.5" fill={yr.badgeAccent ? '#c9a96e' : 'rgba(244,239,232,0.55)'}
                  letterSpacing="1.4" fontFamily="Inter,sans-serif">
                  {yr.badge}
                </text>
              </g>
            )}
          </g>
        )
      })}
    </svg>
  )
}

// ─── 11 — Unit Economics ─────────────────────────────────────────────────────

function SlideUnitEconomics() {
  const rows = [
    { id: 'E1', name: 'Grown Decorative Acoustic',     price: 'AED 1,000–1,500 / m²', cost: 'AED 350–450 / m²', margin: '60–70%', notes: 'No cert. barrier. Direct to designer / contractor. Active now.' },
    { id: 'E2', name: 'Pressed Composite Boards',       price: 'AED 200–500 / m²',     cost: 'AED 120–180 / m²', margin: '50–65%', notes: 'Near-zero feedstock cost. High volume via events + activations.' },
    { id: 'E3', name: 'Certified Acoustic Spec.',       price: 'AED 1,100–1,800 / m²', cost: 'AED 400–500 / m²', margin: '55–65%', notes: 'Fire + acoustic cert. (12–24mo). Unlocks commercial scale.' },
  ]

  return (
    <div className="slide" style={{ display: 'flex', flexDirection: 'column', padding: '5.5% 7%' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <Label>11 — Unit Economics</Label>
        <div className="deck-h2" style={{ fontSize: '3rem' }}>
          Strong margins across all active engines.
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <table className="deck-table">
          <thead>
            <tr>
              <th style={{ width: '3rem' }}></th>
              <th style={{ width: '22%' }}>Engine</th>
              <th style={{ width: '18%' }}>Price / m²</th>
              <th style={{ width: '16%' }}>Cost / m²</th>
              <th style={{ width: '9%' }}>Margin</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td><span className="deck-eyebrow" style={{ fontSize: '0.6rem' }}>{r.id}</span></td>
                <td style={{ color: CREAM, fontSize: '1rem' }}>{r.name}</td>
                <td style={{ fontSize: '1rem' }}>{r.price}</td>
                <td style={{ color: 'rgba(244,239,232,0.62)', fontSize: '1rem' }}>{r.cost}</td>
                <td>
                  <span style={{ color: '#c9a96e', fontWeight: 500, fontFamily: 'var(--font-sans, Inter, system-ui, sans-serif)', fontSize: '1rem' }}>
                    {r.margin}
                  </span>
                </td>
                <td style={{ color: 'rgba(244,239,232,0.68)', fontSize: '0.95rem' }}>{r.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Revenue projections — bar chart with shared baseline */}
      <div style={{ borderTop: BORDER, paddingTop: '1.25rem' }}>
        <RevenueBarChart />
      </div>

      <SlideNum n={11} />
    </div>
  )
}

// ─── 12 — Moat ───────────────────────────────────────────────────────────────

function SlideMoat() {
  const moat = [
    ['01', 'Process IP', 'Proprietary hot-arid growth + pressing parameters. No one has solved this for the GCC climate.'],
    ['02', 'Regional feedstock', 'Palm fibre + date kernel formulations specific to UAE agricultural waste. Price-locked inputs.'],
    ['03', 'First operating knowledge', 'First commercial GCC mycelium manufacturer. Temperate-climate experience does not transfer.'],
    ['04', 'Local supply', 'Direct feedstock sourcing from UAE agricultural producers. Contracted and operational.'],
  ]

  return (
    <div className="slide" style={{ display: 'flex', flexDirection: 'column', padding: '5.5% 7%' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <Label>12 — Moat</Label>
        <div className="deck-h2" style={{ fontSize: '3rem' }}>
          Four layers of defensibility.
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', flex: 1, gap: '0' }}>
        {moat.map(([num, title, body]) => (
          <div key={num} className="moat-item" style={{ padding: '2rem 3rem 2rem 0', alignItems: 'flex-start' }}>
            <span className="moat-num" style={{ fontSize: '0.65rem', paddingTop: '0.2rem' }}>{num}</span>
            <div>
              <div style={{ fontSize: '1.1rem', color: CREAM, fontFamily: 'var(--font-sans, Inter, system-ui, sans-serif)', fontWeight: 500, marginBottom: '0.6rem' }}>
                {title}
              </div>
              <p style={{ fontSize: '1rem', color: 'rgba(244,239,232,0.72)', lineHeight: 1.62, margin: 0, fontFamily: 'var(--font-sans, Inter, system-ui, sans-serif)' }}>
                {body}
              </p>
            </div>
          </div>
        ))}
      </div>

      <SlideNum n={12} />
    </div>
  )
}

// ─── 13 — Roadmap ────────────────────────────────────────────────────────────

// Phase proportions (in "months"): M0-M6=6, M6-M18=12, M18-M24=6, M24+=10 (open)
// Total units = 34  →  widths proportional to duration

function SlideRoadmap() {
  const phases = [
    {
      period: 'M0 – M6',
      label: 'Platform Activation',
      units: 6,
      funded: true,
      items: ['Funding close → immediate deployment', 'Production facility + press line', 'First operator hired', 'Patent filing complete', 'Certifications initiated'],
    },
    {
      period: 'M6 – M18',
      label: 'First Revenue',
      units: 12,
      funded: false,
      items: ['E1 + E2 revenue streams active', 'KAVE + pipeline conversions', 'Designer specification channel set', 'AED 1–2M run rate'],
    },
    {
      period: 'M18 – M24',
      label: 'Certification Scale',
      units: 6,
      funded: false,
      items: ['Fire + acoustic certifications achieved', 'E3 commercial market unlocked', '3–5 commercial projects in spec', 'AED 4–8M revenue trajectory'],
    },
    {
      period: 'M24+',
      label: 'Platform Leverage',
      units: 10,
      funded: false,
      items: ['Packaging + thermal activated', 'Saudi Arabia + NEOM pathway', 'First regional licensing deal', '→ Series A: AED 11M target'],
    },
  ]

  const totalUnits = phases.reduce((s, p) => s + p.units, 0)
  const W = 1000
  const barH = 36
  const gap = 2

  // compute x offsets
  let cursor = 0
  const bars = phases.map((ph) => {
    const w = Math.round((ph.units / totalUnits) * W) - gap
    const x = cursor
    cursor += w + gap
    return { ...ph, x, w }
  })

  return (
    <div className="slide" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '4.5% 7% 2.5%', borderBottom: BORDER }}>
        <Label>13 — Roadmap</Label>
        <div className="deck-h2" style={{ fontSize: '2.75rem', marginBottom: '0.5rem' }}>Phased platform expansion.</div>
        <div className="deck-label" style={{ fontSize: '0.6rem', letterSpacing: '0.2em' }}>
          AED 2.2M RAISE FUNDS PHASES 1 + 2 · SERIES A AT AED 11M FUNDS PHASES 3 + 4
        </div>
      </div>

      {/* Time axis */}
      <div style={{ padding: '3% 7% 0', borderBottom: BORDER }}>
        <svg viewBox={`0 0 ${W} ${barH + 28}`} style={{ width: '100%', display: 'block' }} xmlns="http://www.w3.org/2000/svg">
          {/* "You are here" marker above phase 1 */}
          <text x={bars[0].x + 4} y="10" fontSize="6" fill="#c9a96e" letterSpacing="1.5" fontFamily="Inter,sans-serif">
            ← YOU ARE HERE · M0
          </text>
          <line x1={bars[0].x + 2} y1="12" x2={bars[0].x + 2} y2="18" stroke="#c9a96e" strokeWidth="1" />

          {bars.map((b) => (
            <g key={b.period}>
              <rect
                x={b.x} y="18" width={b.w} height={barH} rx="2"
                fill={b.funded ? 'rgba(201,169,110,0.22)' : 'rgba(244,239,232,0.05)'}
                stroke={b.funded ? 'rgba(201,169,110,0.65)' : 'rgba(244,239,232,0.12)'}
                strokeWidth="1"
              />
              <text x={b.x + 8} y="33" fontSize="6" fill={b.funded ? '#c9a96e' : 'rgba(244,239,232,0.38)'} letterSpacing="1.5" fontFamily="Inter,sans-serif">
                {b.period}
              </text>
              <text x={b.x + 8} y="46" fontSize="9" fill={b.funded ? '#f4efe8' : 'rgba(244,239,232,0.70)'} fontFamily="Inter,sans-serif" fontWeight={b.funded ? '500' : '400'}>
                {b.label}
              </text>
              {/* taper indicator for open-ended last phase */}
              {b.period === 'M24+' && (
                <text x={b.x + b.w - 10} y="44" fontSize="10" fill="rgba(244,239,232,0.25)" fontFamily="Inter,sans-serif">›</text>
              )}
            </g>
          ))}
        </svg>
      </div>

      {/* Milestones below time axis — 4 columns aligned to bars */}
      <div style={{ display: 'grid', gridTemplateColumns: phases.map(p => `${p.units}fr`).join(' '), flex: 1, padding: '2.5% 7%', gap: '2%' }}>
        {phases.map((ph) => (
          <div key={ph.period}>
            {ph.funded && (
              <div style={{ fontSize: '0.52rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: GOLD, background: 'rgba(178,155,127,0.1)', border: `1px solid rgba(178,155,127,0.25)`, padding: '0.15rem 0.45rem', marginBottom: '0.75rem', display: 'inline-block' }}>
                Funded by this raise
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {ph.items.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <span style={{ color: ph.funded ? GOLD : 'rgba(244,239,232,0.3)', fontSize: '0.5rem', paddingTop: '0.36rem', flexShrink: 0 }}>▸</span>
                  <span style={{ fontSize: '0.88rem', color: 'rgba(244,239,232,0.82)', lineHeight: 1.5, fontFamily: 'var(--font-sans, Inter, system-ui, sans-serif)' }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <SlideNum n={13} />
    </div>
  )
}

// ─── 14 — Team ───────────────────────────────────────────────────────────────

function SlideTeam() {
  const members = [
    {
      name: 'Andy Cartier',
      role: 'Founder & CEO',
      focus: 'Mycelium Industrialization',
      bio: '7 years lab-to-production. Two installations. Co-founder: UFO + Hyphen (US).',
      credential: 'Published: Routledge — Designing Mycelium (2024)',
      img: '/images/founder/processed/andy_public_v2.png',
    },
    {
      name: 'Benjamin Rieux',
      role: 'Cofounder & CFO',
      focus: 'Construction Finance',
      bio: '15+ years construction + real estate finance across GCC + Europe. Leads financial strategy and investor reporting.',
      credential: undefined,
      img: '/images/founder/benjamin_2026.png',
    },
    {
      name: 'Othman Ihrai',
      role: 'Cofounder & Head of IP',
      focus: 'IP + Legal Strategy',
      bio: 'PhD IP Law. 15+ years CEO of French Tech-certified startups. Patent strategy, technology governance, venture structuring.',
      credential: undefined,
      img: '/images/founder/othman_2026.png',
    },
    {
      name: 'Matthew Zelitt',
      role: 'Chief Growth Officer',
      focus: 'Partnerships & Go-to-Market',
      bio: '10+ years healthcare + early-stage startups. Commercial pipeline, strategic partnerships, investor relations.',
      credential: undefined,
      img: '/images/founder/matthew_2026.png',
    },
  ]

  return (
    <div className="slide" style={{ display: 'grid', gridTemplateRows: 'auto 1fr', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '4% 7% 3%', borderBottom: BORDER }}>
        <Label>14 — Team</Label>
        <div className="deck-h2" style={{ fontSize: '3rem', marginBottom: 0 }}>
          People who execute.
        </div>
      </div>

      {/* Cards — photo fills 1fr, text is auto at bottom */}
      <div className="team-grid">
        {members.map((m) => (
          <div key={m.name} className="team-card">
            {/* Photo fills the available space */}
            <div className="team-photo-wrap">
              <img src={m.img} alt={m.name} />
            </div>
            {/* Text — fixed at bottom */}
            <div className="team-text">
              <div style={{ fontSize: '1.1rem', color: CREAM, fontFamily: 'var(--font-sans, Inter, system-ui, sans-serif)', fontWeight: 600, marginBottom: '0.2rem', letterSpacing: '-0.01em' }}>
                {m.name}
              </div>
              <div className="deck-eyebrow" style={{ fontSize: '0.58rem', marginBottom: '0.3rem' }}>{m.role}</div>
              <div style={{ fontSize: '0.8rem', color: GOLD, fontFamily: 'var(--font-sans, Inter, system-ui, sans-serif)', fontWeight: 500, marginBottom: '0.7rem' }}>
                {m.focus}
              </div>
              <p style={{ fontSize: '0.9rem', color: 'rgba(244,239,232,0.7)', lineHeight: 1.55, margin: 0, fontFamily: 'var(--font-sans, Inter, system-ui, sans-serif)' }}>
                {m.bio}
              </p>
              {m.credential && (
                <div style={{ marginTop: '0.55rem', fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#c9a96e', fontFamily: 'var(--font-sans, Inter, system-ui, sans-serif)', fontWeight: 500 }}>
                  {m.credential}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <SlideNum n={14} />
    </div>
  )
}

// ─── 15 — The Ask ────────────────────────────────────────────────────────────

function SlideAsk() {
  const fundItems = [
    { label: 'Production space + containers', pct: 30,   amount: 'AED 660K' },
    { label: 'Team',                          pct: 25.5, amount: 'AED 561K' },
    { label: 'Machinery + equipment',         pct: 24.8, amount: 'AED 545K' },
    { label: 'Certifications + IP',           pct: 11.7, amount: 'AED 257K' },
    { label: 'Sales, marketing + buffer',     pct: 8,    amount: 'AED 176K' },
  ]

  return (
    <div className="slide" style={{ display: 'flex', flexDirection: 'column', padding: '5.5% 7%', justifyContent: 'center' }}>
      <Label>15 — The Ask</Label>

      <div className="ask-amount" style={{ marginTop: '0.75rem' }}>
        $600,000
      </div>

      <div className="ask-meta-strip" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="ask-meta-item" style={{ paddingLeft: 0 }}>
          <div className="ask-meta-label">Instrument</div>
          <div className="ask-meta-value">SAFE Note</div>
        </div>
        <div className="ask-meta-item">
          <div className="ask-meta-label">AED Equivalent</div>
          <div className="ask-meta-value">AED 2.2M</div>
        </div>
        <div className="ask-meta-item">
          <div className="ask-meta-label">Runway</div>
          <div className="ask-meta-value">18 months</div>
        </div>
        <div className="ask-meta-item">
          <div className="ask-meta-label">Valuation Cap · Discount</div>
          <div className="ask-meta-value" style={{ fontSize: '0.95rem' }}>
            Cap open · founder discretion this round
          </div>
        </div>
      </div>

      <div className="deck-label" style={{ marginBottom: '1rem' }}>Use of funds</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem 6%' }}>
        {fundItems.map((item) => (
          <div key={item.label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.4rem' }}>
              <span style={{ fontFamily: 'var(--font-sans, Inter, system-ui, sans-serif)', fontSize: '1rem', color: CREAM }}>{item.label}</span>
              <span style={{ fontFamily: 'var(--font-sans, Inter, system-ui, sans-serif)', fontSize: '1rem', color: GOLD, fontWeight: 500 }}>{item.amount}</span>
            </div>
            <div className="funds-bar-track">
              <div className="funds-bar-fill" style={{ width: `${item.pct}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '2rem', borderTop: BORDER, paddingTop: '1.3rem', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
        {[
          ['Milestone 1', 'Production space live + first operator hired'],
          ['Milestone 2', 'Revenue engines E1 + E2 active'],
          ['Milestone 3', 'Certification pathway underway'],
          ['Milestone 4', 'Biomyc European licensing activation'],
        ].map(([label, value]) => (
          <div key={label}>
            <div className="deck-label" style={{ marginBottom: '0.25rem' }}>{label}</div>
            <div style={{ fontSize: '0.96rem', color: 'rgba(244,239,232,0.82)', lineHeight: 1.5, fontFamily: 'var(--font-sans, Inter, system-ui, sans-serif)' }}>
              {value}
            </div>
          </div>
        ))}
      </div>

      <SlideNum n={15} />
    </div>
  )
}

// ─── 16 — Closing ────────────────────────────────────────────────────────────

function SlideClosing() {
  return (
    <div className="slide" style={{ background: '#0e0c0a', display: 'grid', gridTemplateColumns: '1fr 1px 1fr' }}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '8% 7% 8% 8%' }}>
        <div style={{ fontFamily: 'var(--font-sans, Inter, system-ui, sans-serif)', fontSize: '0.65rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: GOLD, marginBottom: '2.5rem' }}>
          NUMU
        </div>
        <div className="deck-h2" style={{ fontSize: '3.5rem', lineHeight: 1.06, marginBottom: '2rem' }}>
          The GCC doesn&apos;t have<br />a bio-composite industry yet.
          <br />
          <span style={{ color: GOLD }}>We&apos;re building it first.</span>
        </div>
        <p style={{ fontSize: '1.1rem', color: 'rgba(244,239,232,0.75)', lineHeight: 1.65, margin: 0, fontFamily: 'var(--font-sans, Inter, system-ui, sans-serif)' }}>
          First mover. Operational. Regional. Certified within 18 months.
        </p>
      </div>

      <div style={{ background: 'rgba(244,239,232,0.08)', width: '1px' }} />

      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '8% 8% 8% 7%', gap: '2.25rem' }}>
        {[
          ['Raise',           '$600,000 · SAFE · AED 2.2M'],
          ['Runway',          '18 months to certification scale'],
          ['Series A target', 'AED 11M'],
          ['Next step',       'Schedule a 30-min founder call'],
          ['Contact',         'office@studio-cartier.com'],
          ['',                'numu.bio · Dubai, UAE'],
        ].map(([label, value], i) => (
          <div key={i}>
            {label && <div className="deck-label" style={{ marginBottom: '0.3rem' }}>{label}</div>}
            <div style={{
              fontFamily: 'var(--font-sans, Inter, system-ui, sans-serif)',
              fontSize: label === 'Next step' || label === 'Contact' ? '1.1rem' : label ? '1.05rem' : '0.9rem',
              color: label === 'Next step' ? GOLD : label ? CREAM : 'rgba(244,239,232,0.4)',
              fontWeight: label === 'Raise' ? 500 : 400,
              letterSpacing: label === 'Raise' ? '-0.01em' : 'normal',
            }}>
              {value}
            </div>
          </div>
        ))}
      </div>

      <SlideNum n={16} />
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function InvestorDeckPage() {
  const token = cookies().get(INVESTOR_ACCESS_COOKIE)?.value

  if (!hasValidInvestorAccessToken(token)) {
    notFound()
  }

  void loadInvestorContent()

  return (
    <main className="deck-root">
      <ScreenFrame><SlideCover /></ScreenFrame>
      <ScreenFrame><SlideThesis /></ScreenFrame>
      <ScreenFrame><SlideProblem /></ScreenFrame>
      <ScreenFrame><SlideMarket /></ScreenFrame>
      <ScreenFrame><SlideWhyNow /></ScreenFrame>
      <ScreenFrame><SlideTraction /></ScreenFrame>
      <ScreenFrame><SlideWhatNumuBuilds /></ScreenFrame>
      <ScreenFrame><SlidePlatform /></ScreenFrame>
      <ScreenFrame><SlideFourEngines /></ScreenFrame>
      <ScreenFrame><SlideCompetitive /></ScreenFrame>
      <ScreenFrame><SlideUnitEconomics /></ScreenFrame>
      <ScreenFrame><SlideMoat /></ScreenFrame>
      <ScreenFrame><SlideRoadmap /></ScreenFrame>
      <ScreenFrame><SlideTeam /></ScreenFrame>
      <ScreenFrame><SlideAsk /></ScreenFrame>
      <ScreenFrame><SlideClosing /></ScreenFrame>
    </main>
  )
}
