'use client'

import { useRef, useEffect, useState } from 'react'

const CREAM  = '#EFEAD8'
const GOLD   = '#D9A878'
const AMBER  = '#C66A3F'
const MUTED  = '#807B70'
const BORDER = 'rgba(239,234,216,0.10)'
const TOTAL_SLIDES = 18

// ─── Hooks ───────────────────────────────────────────────────────────────────

function useInView(threshold = 0.12): [React.RefObject<HTMLDivElement>, boolean] {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    if (window.location.search.includes('snapshot=1')) { setInView(true); return }
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, inView]
}

function useCounter(target: number, active: boolean, duration = 1200, delay = 0): number {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!active) return
    let rafId: number
    const t = setTimeout(() => {
      let start: number | null = null
      const tick = (ts: number) => {
        if (!start) start = ts
        const p = Math.min((ts - start) / duration, 1)
        const eased = 1 - (1 - p) ** 3
        setVal(Math.round(eased * target))
        if (p < 1) { rafId = requestAnimationFrame(tick) } else { setVal(target) }
      }
      rafId = requestAnimationFrame(tick)
    }, delay)
    return () => { clearTimeout(t); cancelAnimationFrame(rafId) }
  }, [active, target, duration, delay])
  return val
}

function fade(visible: boolean, delay = 0): React.CSSProperties {
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? 'none' : 'translateY(28px)',
    transition: `opacity 0.55s ease-out ${delay}s, transform 0.55s ease-out ${delay}s`,
  }
}

// ─── Shared primitives ───────────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return <p className="deck-label" style={{ marginBottom: '0.75rem' }}>{children}</p>
}

function SlideNum({ n }: { n: number }) {
  return (
    <span className="slide-num">
      {String(n).padStart(2, '0')} / {TOTAL_SLIDES}
    </span>
  )
}

function NumuWordmark() {
  return <span style={{ whiteSpace: 'nowrap' }}>NUMU</span>
}

function PalmycoMark() {
  return (
    <span style={{ whiteSpace: 'nowrap' }}>
      Palmyco<sup style={{ fontSize: '0.55em', verticalAlign: 'super', lineHeight: 0 }}>™</sup>
    </span>
  )
}

// ─── 01 — Cover ──────────────────────────────────────────────────────────────

function SlideCover() {
  const coverProof = [
    ['Operational', 'Dubai lab active'],
    ['Installed', '2 installations · NL + UAE'],
    ['Margins', '49–66% · GROSS'],
  ]
  return (
    <div className="slide slide-cover">
      <div className="slide-cover-left">
        <div className="slide-cover-anim-1">
          <Label>Investor Overview — Confidential</Label>
        </div>
        <div className="slide-cover-anim-2">
          <div className="deck-h1" style={{ fontSize: '7.5rem', marginBottom: '1.25rem', letterSpacing: '-0.035em' }}>NUMU</div>
          <div style={{ fontSize: '1.55rem', color: 'rgba(244,239,232,0.9)', lineHeight: 1.35, fontFamily: 'var(--font-display, serif)', maxWidth: '18rem' }}>
            The GCC&apos;s first bio-composite manufacturing platform.
          </div>
          <p style={{ fontSize: '1rem', color: 'rgba(244,239,232,0.68)', lineHeight: 1.68, margin: '1.2rem 0 0', maxWidth: '24rem', fontFamily: 'var(--font-sans, sans-serif)' }}>
            Regional agricultural waste, manufactured into acoustic, composite, and specification-ready materials.
          </p>
        </div>
        <div className="slide-cover-anim-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0', borderTop: BORDER, borderBottom: BORDER, padding: '1rem 0', margin: '0.5rem 0 1rem' }}>
          {coverProof.map(([label, value], index) => (
            <div key={label} style={{ borderLeft: index > 0 ? BORDER : 'none', paddingLeft: index > 0 ? '1rem' : '0' }}>
              <div className="deck-label" style={{ marginBottom: '0.25rem' }}>{label}</div>
              <div style={{ fontSize: '1rem', color: CREAM, fontFamily: 'var(--font-sans, sans-serif)', fontWeight: 500, lineHeight: 1.35 }}>{value}</div>
            </div>
          ))}
        </div>
        <div className="slide-cover-anim-4" style={{ borderTop: BORDER, paddingTop: '1.2rem' }}>
          <div className="deck-label" style={{ marginBottom: '0.3rem' }}>Founded by Andy Cartier — Dubai, UAE</div>
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
  const [ref, inView] = useInView()
  const stats = [
    ['100%', 'GCC market imported today'],
    ['AED 2.5B+', 'regional annual demand'],
    ['2 installs', 'Installed, not prototyped'],
    ['0 local', 'direct GCC bio-composite players'],
  ]
  return (
    <div ref={ref} className="slide" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '8% 10%' }}>
      <div className="anim-fade" style={fade(inView, 0)}>
        <Label>02 — Thesis</Label>
      </div>
      <div className="anim-fade" style={{ ...fade(inView, 0.08), fontSize: '4.1rem', lineHeight: 1.03, marginBottom: '2.4rem', marginTop: '1rem', maxWidth: '82%', fontFamily: 'var(--font-display, serif)', color: CREAM, letterSpacing: '-0.025em', fontWeight: 400 }}>
        The GCC bio-composite industry will exist.{' '}
        <NumuWordmark /> is building it — now.
      </div>
      <hr className="deck-rule-gold" style={{ ...fade(inView, 0.16), width: '4rem', marginBottom: '3rem' }} />
      <div className="anim-fade" style={{ ...fade(inView, 0.22), display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: '5%' }}>
        <p style={{ fontSize: '1.08rem', color: 'rgba(244,239,232,0.78)', lineHeight: 1.72, margin: 0, fontFamily: 'var(--font-sans, sans-serif)', maxWidth: '28rem' }}>
          This is not a bet on consumer sustainability branding. It is a timing bet on regional manufacturing, local feedstock, and a category that remains completely import dependent.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
          {stats.map(([value, note], i) => (
            <div key={value} className="anim-fade" style={{ ...fade(inView, 0.28 + i * 0.08), border: `1px solid ${BORDER}`, background: 'rgba(244,239,232,0.03)', padding: '1rem 1.1rem' }}>
              <div style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: '1.7rem', color: GOLD, fontWeight: 300, letterSpacing: '-0.04em', lineHeight: 1 }}>{value}</div>
              <div className="deck-label" style={{ marginTop: '0.45rem', fontSize: '0.56rem' }}>{note}</div>
            </div>
          ))}
        </div>
      </div>
      <SlideNum n={2} />
    </div>
  )
}

// ─── 03 — Problem ────────────────────────────────────────────────────────────

function ProblemDiagram() {
  const sources = [
    { cx: 80,  label: 'EUROPE',          value: 'AED 1.4B+', share: '~55%', detail: 'Rockwool · Knauf · Saint-Gobain' },
    { cx: 250, label: 'SE ASIA / CHINA', value: 'AED 800M+', share: '~32%', detail: 'synthetic foam · mineral wool' },
    { cx: 420, label: 'AMERICAS',        value: 'AED 300M+', share: '~13%', detail: 'specialty + fire-rated systems' },
  ]
  const risks = [
    { label: 'LEAD TIME',  value: '8–14 wks' },
    { label: 'IMPORT DUTY', value: '5–15%' },
    { label: 'FX EXPOSURE', value: '100%' },
    { label: 'LOCAL ALT.',  value: 'zero' },
  ]
  const riskW = 110
  const riskGap = (500 - 8 - riskW * 4) / 3
  const riskBoxes = risks.map((r, i) => ({ ...r, x: 8 + i * (riskW + riskGap) }))

  return (
    <svg viewBox="0 0 500 410" style={{ width: '100%', height: '100%', display: 'block' }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="arr" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto">
          <polygon points="0 0, 7 2.5, 0 5" fill="rgba(178,155,127,0.55)" />
        </marker>
      </defs>
      {sources.map(({ cx, label, value, share, detail }) => (
        <g key={label}>
          <rect x={cx - 72} y="12" width="144" height="70" rx="2" fill="rgba(178,155,127,0.07)" stroke="rgba(178,155,127,0.28)" strokeWidth="1" />
          <text x={cx} y="33" textAnchor="middle" fontSize="6" fill="#c9a96e" letterSpacing="2.5" fontFamily="Inter,sans-serif">{label}</text>
          <text x={cx} y="56" textAnchor="middle" fontSize="20" fill="#F4EFE8" fontFamily="Inter,sans-serif" fontWeight="200" letterSpacing="-1">{value}</text>
          <text x={cx} y="72" textAnchor="middle" fontSize="7" fill="rgba(244,239,232,0.42)" fontFamily="Inter,sans-serif">{share} · {detail}</text>
        </g>
      ))}
      <line x1="80"  y1="82" x2="195" y2="163" stroke="rgba(178,155,127,0.38)" strokeWidth="1.5" strokeDasharray="5,3.5" markerEnd="url(#arr)" />
      <line x1="250" y1="82" x2="250" y2="163" stroke="rgba(178,155,127,0.6)"  strokeWidth="2"   markerEnd="url(#arr)" />
      <line x1="420" y1="82" x2="305" y2="163" stroke="rgba(178,155,127,0.38)" strokeWidth="1.5" strokeDasharray="5,3.5" markerEnd="url(#arr)" />
      <rect x="88" y="168" width="324" height="84" rx="2" fill="rgba(10,8,6,0.95)" stroke="rgba(178,155,127,0.52)" strokeWidth="1.5" />
      <text x="250" y="192" textAnchor="middle" fontSize="6.5" fill="#c9a96e" letterSpacing="2.5" fontFamily="Inter,sans-serif">GCC ANNUAL DEMAND</text>
      <text x="250" y="221" textAnchor="middle" fontSize="30" fill="#F4EFE8" fontFamily="Inter,sans-serif" fontWeight="200" letterSpacing="-1.5">AED 2.5B+</text>
      <text x="250" y="241" textAnchor="middle" fontSize="7.5" fill="rgba(244,239,232,0.5)" fontFamily="Inter,sans-serif">acoustic · thermal · insulation · composites</text>
      <line x1="40" y1="270" x2="460" y2="270" stroke="rgba(244,239,232,0.07)" strokeWidth="1" />
      <text x="250" y="292" textAnchor="middle" fontSize="6.5" fill="rgba(244,239,232,0.3)" letterSpacing="2.5" fontFamily="Inter,sans-serif">LOCAL BIO-MATERIAL MANUFACTURERS</text>
      <text x="250" y="322" textAnchor="middle" fontSize="38" fill="rgba(244,239,232,0.16)" fontFamily="Inter,sans-serif" fontWeight="200" letterSpacing="-2">zero.</text>
      {riskBoxes.map(({ x, label, value }) => (
        <g key={label}>
          <rect x={x} y="342" width={riskW} height="50" rx="2" fill="rgba(244,239,232,0.025)" stroke="rgba(244,239,232,0.08)" strokeWidth="1" />
          <text x={x + riskW / 2} y="359" textAnchor="middle" fontSize="6" fill="rgba(244,239,232,0.38)" letterSpacing="1.5" fontFamily="Inter,sans-serif">{label}</text>
          <text x={x + riskW / 2} y="380" textAnchor="middle" fontSize="15" fill="rgba(244,239,232,0.72)" fontFamily="Inter,sans-serif" fontWeight="300" letterSpacing="-0.3">{value}</text>
        </g>
      ))}
      <text x="250" y="406" textAnchor="middle" fontSize="5.5" fill="rgba(244,239,232,0.18)" fontFamily="Inter,sans-serif">
        Sources: MEED GCC Construction Report 2024 · Euroconstruct · GCC Trade Statistics · ASTM import data
      </text>
    </svg>
  )
}

function SlideProblem() {
  const [ref, inView] = useInView()
  const points = [
    ['01', 'Zero regional alternative.', 'GCC acoustic + thermal construction: 100% import-dependent.'],
    ['02', 'Broken supply chain.', 'Every panel ships in — tariffs, lead times, zero local specification pathway.'],
    ['03', 'Policy misalignment.', 'Petroleum-derived materials now in conflict with UAE Net Zero + GCC mandates.'],
  ]
  return (
    <div ref={ref} className="slide slide-two-col">
      <div className="slide-two-col-content" style={{ justifyContent: 'space-between', padding: '8% 6% 8% 8%' }}>
        <div className="anim-fade" style={fade(inView, 0)}>
          <Label>03 — The Problem</Label>
        </div>
        <div>
          <div className="anim-fade deck-h2" style={{ ...fade(inView, 0.08), fontSize: '6rem', lineHeight: 0.9, marginBottom: '0.2rem' }}>100%</div>
          <div className="anim-fade deck-h2" style={{ ...fade(inView, 0.14), fontSize: '6rem', lineHeight: 0.9, color: GOLD, marginBottom: '1.5rem' }}>imported.</div>
          <div className="anim-fade" style={{ ...fade(inView, 0.2), fontSize: '1.05rem', color: 'rgba(244,239,232,0.6)', fontFamily: 'var(--font-sans, sans-serif)', lineHeight: 1.5 }}>
            Zero local bio-material production in the GCC.
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {points.map(([n, title, body], i) => (
            <div key={n} className="anim-fade" style={{ ...fade(inView, 0.28 + i * 0.1), paddingBottom: '1.25rem', marginBottom: '1.25rem', borderBottom: BORDER }}>
              <div className="deck-eyebrow" style={{ marginBottom: '0.4rem' }}>{n}</div>
              <div style={{ fontSize: '1rem', color: CREAM, fontFamily: 'var(--font-sans, sans-serif)', fontWeight: 500, marginBottom: '0.25rem' }}>{title}</div>
              <div style={{ fontSize: '1rem', color: 'rgba(244,239,232,0.68)', fontFamily: 'var(--font-sans, sans-serif)', lineHeight: 1.55 }}>{body}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="slide-two-col-image" style={{ background: 'rgba(8,6,4,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5% 6%' }}>
        <ProblemDiagram />
      </div>
      <SlideNum n={3} />
    </div>
  )
}

// ─── 04 — Market ─────────────────────────────────────────────────────────────

function SlideMarket() {
  const [ref, inView] = useInView()
  const tiers = [
    { label: 'TAM', value: '$50B+',        name: 'Global bio-based building materials',         note: 'By 2030 · 12–15% CAGR · Grand View Research', gold: false },
    { label: 'SAM', value: 'AED 2.5B+',    name: 'GCC acoustic & thermal construction imports', note: 'Annual spend · 100% synthetic today · MEED 2024', gold: false },
    { label: 'SOM', value: 'AED 150–300M', name: 'NUMU serviceable in 3–5 years',               note: 'Acoustic · decorative · certified spec · licensing', gold: true },
  ]
  return (
    <div ref={ref} className="slide" style={{ display: 'flex', flexDirection: 'column', padding: '6% 8%', justifyContent: 'space-between' }}>
      <div className="anim-fade" style={{ ...fade(inView, 0), marginBottom: '5%' }}>
        <Label>04 — Market Opportunity</Label>
        <div className="deck-h2" style={{ fontSize: '3.5rem', marginTop: '0.5rem' }}>
          A billion-dirham import dependency.<br />No local alternative exists.
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', alignItems: 'stretch', flex: 1 }}>
        {tiers.map((t, i) => (
          <div key={t.label} className="anim-fade" style={{ ...fade(inView, 0.18 + i * 0.12), border: BORDER, background: t.gold ? 'rgba(198,106,63,0.07)' : 'rgba(239,234,216,0.02)', padding: '1.35rem 1.3rem 1.18rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '15rem' }}>
            <div className="deck-eyebrow" style={{ fontSize: '0.75rem' }}>{t.label}</div>
            <div style={{ fontFamily: 'var(--font-display, serif)', fontSize: '3.45rem', lineHeight: 0.92, letterSpacing: '-0.05em', fontWeight: 400, color: t.gold ? GOLD : CREAM }}>{t.value}</div>
            <div style={{ fontSize: '1.02rem', color: CREAM, fontFamily: 'var(--font-sans, sans-serif)', lineHeight: 1.42, marginTop: '0.45rem' }}>{t.name}</div>
            <div className="deck-label" style={{ fontSize: '0.6rem', marginTop: '0.9rem' }}>{t.note}</div>
          </div>
        ))}
      </div>
      <p className="anim-fade" style={{ ...fade(inView, 0.56), fontSize: '0.8rem', color: 'rgba(244,239,232,0.54)', lineHeight: 1.62, margin: '1.4rem 0 0', fontFamily: 'var(--font-display, serif)', fontStyle: 'italic', maxWidth: '44rem' }}>
        NUMU targets a bounded beachhead — local manufacturing displacing imports, then expanding via licensing across the GCC.
      </p>
      <SlideNum n={4} />
    </div>
  )
}

// ─── 05 — Why Now ────────────────────────────────────────────────────────────

function SlideWhyNow() {
  const [ref, inView] = useInView()
  const year = useCounter(2050, inView, 1200, 150)
  const pct  = useCounter(100,  inView, 1200, 250)
  const mkt  = useCounter(300,  inView, 1200, 350)

  const cols = [
    { n: '01', title: 'Policy Tailwinds',  display: String(year),   support: 'UAE Net Zero 2050 and GCC circular mandates pushing procurement toward local bio-based materials. Compliance pressure active now.' },
    { n: '02', title: 'Supply Gap',        display: `${pct}%`,      support: 'of GCC acoustic and thermal construction foam is imported. Zero local manufacturers exist.' },
    { n: '03', title: 'Market Reset',      display: `$${mkt}M+`,    support: 'Bolt Threads and MycoWorks collapsed pursuing industrial-scale vertical integration. The field is cleared for disciplined regional specialists.' },
  ]

  return (
    <div ref={ref} className="slide" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="anim-fade" style={{ ...fade(inView, 0), padding: '6% 7% 4%', borderBottom: BORDER }}>
        <Label>05 — Why Now</Label>
        <div className="deck-h2" style={{ fontSize: '3rem', marginBottom: 0 }}>Three forces converging now.</div>
      </div>
      <div className="slide-three-col" style={{ flex: 1 }}>
        {cols.map((c, i) => (
          <div key={c.n} className="col-card anim-fade" style={{ ...fade(inView, 0.18 + i * 0.14), padding: '6% 6%', justifyContent: 'flex-start', gap: '0', flexDirection: 'column' }}>
            <div className="deck-eyebrow" style={{ marginBottom: '0.85rem' }}>{c.n}</div>
            <div className="deck-h3" style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>{c.title}</div>
            <div style={{ fontFamily: 'var(--font-display, serif)', fontSize: '6rem', lineHeight: 0.88, letterSpacing: '-0.04em', fontWeight: 400, color: '#c9a96e', marginBottom: '1.5rem' }}>
              {c.display}
            </div>
            <p style={{ fontSize: '0.95rem', color: 'rgba(244,239,232,0.72)', lineHeight: 1.65, margin: 0, fontFamily: 'var(--font-sans, sans-serif)' }}>{c.support}</p>
          </div>
        ))}
      </div>
      <SlideNum n={5} />
    </div>
  )
}

// ─── 06 — Traction ───────────────────────────────────────────────────────────

function SlideTraction() {
  const [ref, inView] = useInView()
  const proof = [
    'Beyond Chrysant (Netherlands) — completed architectural installation',
    'KAVE Dubai — commercial installation in production',
    'Biomyc LOI — European packaging technology licensing pathway',
    'Certification programme active — acoustic + fire performance testing',
    'Co-inventor on 2 Belgian patent families in mycelium materials (prior work)',
    'France — bio-based urban pavement R&D project for water infiltration (active)',
  ]
  const stats = [
    ['AED 184K', 'founder capital deployed'],
    ['2', 'International installs'],
    ['1 LOI', 'packaging pathway active'],
    ['3', 'Paid masterclasses'],
  ]

  return (
    <div ref={ref} className="slide" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="anim-fade" style={{ ...fade(inView, 0), padding: '5% 7% 3%', borderBottom: BORDER }}>
        <Label>06 — Traction</Label>
        <div className="deck-h2" style={{ fontSize: '3rem', marginBottom: 0 }}>Early traction that de-risks the thesis.</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', flex: 1, gap: '0' }}>
        <div style={{ padding: '4% 5% 4% 7%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRight: BORDER }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.65rem', borderBottom: BORDER, paddingBottom: '3.4%', marginBottom: '3.4%' }}>
            {stats.map(([num, lbl], i) => (
              <div key={lbl} className="anim-fade" style={{ ...fade(inView, 0.12 + i * 0.08), border: BORDER, background: 'rgba(239,234,216,0.025)', padding: '0.72rem 0.88rem 0.68rem', minHeight: '5.45rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ fontFamily: 'var(--font-display, serif)', fontSize: '2.2rem', lineHeight: 0.96, letterSpacing: '-0.045em', fontWeight: 400, color: GOLD }}>{num}</div>
                <div className="deck-label" style={{ marginTop: '0.35rem', color: 'rgba(239,234,216,0.56)' }}>{lbl}</div>
              </div>
            ))}
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0' }}>
            {proof.map((item, i) => (
              <div key={i} className="traction-item anim-fade" style={fade(inView, 0.42 + i * 0.06)}>
                <div className="traction-dot" />
                <span style={{ fontSize: '0.94rem', color: CREAM, fontFamily: 'var(--font-sans, sans-serif)', fontWeight: 500, lineHeight: 1.44 }}>{item}</span>
              </div>
            ))}
          </div>
          <p className="anim-fade" style={{ ...fade(inView, 0.82), fontSize: '0.82rem', color: 'rgba(244,239,232,0.5)', fontFamily: 'var(--font-sans, sans-serif)', margin: 0, marginTop: '2.4%', lineHeight: 1.4 }}>
            4 academic partnerships across 3 countries ·<br />De Montfort · AUS · Heriot-Watt Dubai · DIDI
          </p>
        </div>
        <div style={{ padding: '4.7% 5.2% 4.7% 4.4%', display: 'flex', flexDirection: 'column', background: 'rgba(239,234,216,0.015)' }}>
          <div className="anim-fade" style={{ ...fade(inView, 0.2), position: 'relative', overflow: 'hidden', border: BORDER, flex: 1, minHeight: 0 }}>
            <img src="/images/projects/Beyond01.jpg" alt="Beyond Chrysant installation — Netherlands" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center center', display: 'block' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(12,10,8,0.08) 0%, rgba(12,10,8,0.36) 48%, rgba(12,10,8,0.78) 100%), linear-gradient(90deg, rgba(12,10,8,0.56) 0%, rgba(12,10,8,0.14) 42%, rgba(12,10,8,0.34) 100%)' }} />
            <div style={{ position: 'absolute', top: '4.8%', left: '4.8%', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {['LIVE INSTALLATION', 'NETHERLANDS'].map((tag) => (
                <span key={tag} style={{ fontSize: '0.48rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: tag === 'LIVE INSTALLATION' ? GOLD : 'rgba(239,234,216,0.72)', border: `1px solid ${tag === 'LIVE INSTALLATION' ? 'rgba(217,168,120,0.35)' : 'rgba(239,234,216,0.18)'}`, background: tag === 'LIVE INSTALLATION' ? 'rgba(198,106,63,0.12)' : 'rgba(12,10,8,0.24)', padding: '0.2rem 0.45rem' }}>{tag}</span>
              ))}
            </div>
            <div style={{ position: 'absolute', bottom: '5.5%', left: '5.5%', right: '5.5%', padding: '0.85rem 0.95rem', background: 'rgba(12,10,8,0.34)', border: '1px solid rgba(239,234,216,0.12)' }}>
              <div className="deck-eyebrow" style={{ marginBottom: '0.32rem' }}>Installed proof</div>
              <div style={{ fontSize: '1.08rem', color: CREAM, fontFamily: 'var(--font-sans, sans-serif)', fontWeight: 500 }}>Beyond Chrysant · Netherlands</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(239,234,216,0.78)', fontFamily: 'var(--font-sans, sans-serif)', lineHeight: 1.48, marginTop: '0.35rem', maxWidth: '20rem' }}>
                Architectural installation proof: built, photographed, and referenced in a real design context.
              </div>
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
  const [ref, inView] = useInView()
  const attrs = [
    ['Material',     'Palmyco · proprietary mycelium + regional palm-fibre composite'],
    ['Feedstock',    'Regional agricultural waste · near-zero input cost'],
    ['Process',      'Proprietary hot-arid growth + pressing · in-house spawn + substrate'],
    ['Applications', 'Acoustic · thermal · packaging · certified specification'],
  ]
  return (
    <div ref={ref} className="slide slide-two-col">
      <div className="slide-two-col-content" style={{ justifyContent: 'center', gap: '2rem', padding: '7% 6% 7% 7%' }}>
        <div className="anim-fade" style={fade(inView, 0)}>
          <Label>07 — The Material System</Label>
          <div className="deck-h2" style={{ fontSize: '3.25rem', marginBottom: '1.25rem' }}>What <NumuWordmark /> builds.</div>
          <p style={{ fontSize: '1.05rem', color: 'rgba(244,239,232,0.8)', lineHeight: 1.68, margin: 0, maxWidth: '28rem', fontFamily: 'var(--font-sans, sans-serif)' }}>
            NUMU is a material platform built on <PalmycoMark /> — a proprietary mycelium-and-palm-fibre biocomposite grown for the UAE hot-arid climate. One material system, tuned and applied across acoustic, thermal, packaging, and specification-grade products.
          </p>
          <p style={{ fontSize: '0.64rem', color: 'rgba(239,234,216,0.46)', lineHeight: 1.5, margin: '0.8rem 0 0', fontFamily: 'var(--font-serif, serif)', fontStyle: 'italic' }}>
            Trademark application pending.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {attrs.map(([k, v], i) => (
            <div key={k} className="anim-fade" style={{ ...fade(inView, 0.22 + i * 0.1), display: 'grid', gridTemplateColumns: '8rem 1fr', gap: '1rem', alignItems: 'start', paddingBottom: '1rem', marginBottom: '1rem', borderBottom: BORDER }}>
              <span className="deck-label" style={{ paddingTop: '0.1rem' }}>{k}</span>
              <span style={{ fontSize: '1rem', color: CREAM, fontFamily: 'var(--font-sans, sans-serif)', fontWeight: 500, lineHeight: 1.45 }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="slide-two-col-image">
        <img src="/images/products/biofoam_detail.png" alt="Palmyco material detail" style={{ objectPosition: 'center center' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 50%, rgba(26,23,20,0.6) 100%)' }} />
      </div>
      <SlideNum n={7} />
    </div>
  )
}

// ─── 08 — Platform ───────────────────────────────────────────────────────────

function SlidePlatform() {
  const [ref, inView] = useInView()
  const engines = [
    { id: 'E1', name: 'Grown acoustic panels',          status: 'ACTIVE NOW',    desc: 'Interior designers, boutique hospitality, high-end retail. Premium-margin. No certification required.' },
    { id: 'E2', name: 'Pressed composite boards',        status: 'ACTIVE NOW',    desc: 'Events, brand activations, temporary architecture. Near-zero feedstock cost. High volume potential.' },
    { id: 'E3', name: 'Certified spec. acoustic',        status: '12–24 MONTHS',  desc: 'Architects specifying commercial projects. Unlocks offices, hospitality, cultural spaces at scale.' },
    { id: 'E4', name: 'Packaging · Thermal · Licensing', status: '18–36 MONTHS',  desc: 'Biomyc tech licensed inbound for packaging. Thermal insulation replacing imported mineral wool / PU foam at construction scale. Regional GCC licensing to manufacturing partners. Unlocked by in-house spawn (Series A).' },
  ]
  return (
    <div ref={ref} className="slide" style={{ display: 'flex', flexDirection: 'column', padding: '5.5% 7%' }}>
      <div className="anim-fade" style={fade(inView, 0)}>
        <Label>08 — Platform</Label>
        <div style={{ marginBottom: '3%' }}>
          <div className="deck-h2" style={{ fontSize: '2.75rem', marginBottom: '0.75rem' }}>One platform. Multiple revenue engines.</div>
          <p style={{ fontSize: '1rem', color: 'rgba(244,239,232,0.68)', lineHeight: 1.6, margin: 0, fontFamily: 'var(--font-sans, sans-serif)', maxWidth: '52rem' }}>
            Shared feedstock. Shared IP. Different markets. Infrastructure — not a single product bet.
          </p>
        </div>
        <div style={{ background: 'rgba(178,155,127,0.10)', border: `1px solid ${GOLD}`, padding: '1.1rem 1.6rem', marginBottom: '2.5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="deck-eyebrow" style={{ marginBottom: '0.2rem' }}>Platform Core</div>
            <div style={{ fontSize: '1.1rem', color: CREAM, fontFamily: 'var(--font-display, serif)' }}><PalmycoMark /> platform</div>
          </div>
          <div className="deck-label" style={{ textAlign: 'right' }}>Feedstock · Process IP · Hot-arid formulation · in-house spawn</div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0', flex: 1 }}>
        {engines.map((e, i) => (
          <div key={e.id} className="anim-fade" style={{ ...fade(inView, 0.2 + i * 0.1), borderLeft: i > 0 ? BORDER : 'none', borderTop: BORDER, padding: '1.4rem 1.5rem', background: e.status === 'ACTIVE NOW' ? 'rgba(178,155,127,0.05)' : 'transparent', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="deck-eyebrow" style={{ fontSize: '0.6rem' }}>{e.id}</span>
              <span style={{ fontSize: '0.52rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: e.status === 'ACTIVE NOW' ? '#c9a96e' : 'rgba(244,239,232,0.35)', fontFamily: 'var(--font-sans, sans-serif)', fontWeight: 500 }}>{e.status}</span>
            </div>
            <div style={{ fontSize: '1rem', color: CREAM, fontFamily: 'var(--font-sans, sans-serif)', fontWeight: 500, lineHeight: 1.3 }}>{e.name}</div>
            <p style={{ fontSize: '0.88rem', color: 'rgba(244,239,232,0.62)', lineHeight: 1.6, margin: 0, fontFamily: 'var(--font-sans, sans-serif)' }}>{e.desc}</p>
          </div>
        ))}
      </div>
      <SlideNum n={8} />
    </div>
  )
}

// ─── 09 — Revenue Engines ────────────────────────────────────────────────────

function SlideFourEngines() {
  const [ref, inView] = useInView()
  const engines = [
    { id: 'E1', name: 'Grown Decorative Acoustic',    timeline: '0–12 months',  price: 'AED 1,000–1,500 / m²', margin: '60–66%', status: 'active' as const, desc: 'Interior designers, boutique hospitality, high-end retail. No certification required. Premium-margin. Revenue active now.' },
    { id: 'E2', name: 'Pressed Composite Boards',     timeline: '0–12 months',  price: 'AED 200–500 / m²',     margin: '36–40%', status: 'active' as const, desc: 'Events, brand activations, temporary architecture. Near-zero feedstock cost. High volume potential.' },
    { id: 'E3', name: 'Certified Acoustic Specification', timeline: '12–24 months', price: 'AED 1,100–1,800 / m²', margin: '60–66%', status: 'next' as const,   desc: 'Architects specifying commercial projects: offices, hospitality, cultural spaces. Unlocks commercial scale.' },
    { id: 'E4', name: 'Packaging · Thermal',          timeline: '18–36 months', price: 'AED 130–220 / m²',     margin: '28–42%', status: 'future' as const, desc: 'Biomyc inbound packaging tech plus thermal insulation replacing imported mineral wool. Volume engine unlocked by in-house spawn and scaled regionally through licensing.' },
  ]
  const pillClass: Record<string, string> = { active: 'engine-pill-active', next: 'engine-pill-next', future: 'engine-pill-future' }
  return (
    <div ref={ref} className="slide" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="anim-fade" style={{ ...fade(inView, 0), padding: '4.5% 7% 3%', borderBottom: BORDER }}>
        <Label>09 — Revenue Engines</Label>
        <div className="deck-h2" style={{ fontSize: '3rem', marginBottom: 0 }}>Four engines. One platform.</div>
      </div>
      <div className="engine-cards" style={{ flex: 1 }}>
        {engines.map((e, i) => (
          <div key={e.id} className={`engine-card anim-fade${e.status === 'active' ? ' engine-card-active' : ''}`} style={{ ...fade(inView, 0.18 + i * 0.12), opacity: e.status === 'future' ? (inView ? 0.55 : 0) : (inView ? 1 : 0), transition: `opacity 0.55s ease-out ${0.18 + i * 0.12}s, transform 0.55s ease-out ${0.18 + i * 0.12}s`, transform: inView ? 'none' : 'translateY(28px)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span className="engine-id">{e.id}</span>
                <span className={`engine-pill ${pillClass[e.status]}`}>{e.timeline}</span>
              </div>
              <div style={{ fontSize: '1rem', color: CREAM, fontFamily: 'var(--font-sans, sans-serif)', fontWeight: 500, lineHeight: 1.35, marginBottom: '1.25rem' }}>{e.name}</div>
              <p style={{ fontSize: '0.95rem', color: 'rgba(244,239,232,0.68)', lineHeight: 1.6, margin: 0, fontFamily: 'var(--font-sans, sans-serif)' }}>{e.desc}</p>
            </div>
            <div style={{ borderTop: BORDER, paddingTop: '1rem' }}>
              <div className={e.status === 'active' ? 'engine-margin' : 'engine-margin-dim'}>{e.margin}</div>
              <div className="deck-label" style={{ marginTop: '0.4rem' }}>gross margin</div>
              <div style={{ fontSize: '0.9rem', color: 'rgba(244,239,232,0.55)', marginTop: '0.5rem', fontFamily: 'var(--font-sans, sans-serif)' }}>{e.price}</div>
            </div>
          </div>
        ))}
      </div>
      <SlideNum n={9} />
    </div>
  )
}

// ─── 10 — Competitive ────────────────────────────────────────────────────────

function SlideCompetitive() {
  const [ref, inView] = useInView()
  type CertStatus = boolean | 'pending'
  type Row = { name: string; origin: string; price: string; bio: boolean; local: boolean; certified: CertStatus; feedstock: boolean; design: boolean; numu: boolean }
  const players: Row[] = [
    { name: 'Synthetic Imports', origin: 'EU / Asia',  price: 'AED 400–600',    bio: false, local: false, certified: true,      feedstock: false, design: false, numu: false },
    { name: 'Desertboard',       origin: 'UAE',        price: '~AED 1,100',      bio: false, local: true,  certified: false,     feedstock: false, design: false, numu: false },
    { name: 'Ecovative (US)',    origin: 'Imported',   price: 'AED 2,000+',      bio: true,  local: false, certified: true,      feedstock: false, design: true,  numu: false },
    { name: 'NUMU',             origin: 'UAE',        price: 'AED 1,000–1,800', bio: true,  local: true,  certified: 'pending', feedstock: true,  design: true,  numu: true  },
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
    <div ref={ref} className="slide" style={{ display: 'flex', flexDirection: 'column', padding: '5.5% 7%' }}>
      <div className="anim-fade" style={{ ...fade(inView, 0), marginBottom: '2.5rem' }}>
        <Label>10 — Competitive Position</Label>
        <div className="deck-h2" style={{ fontSize: '3rem' }}>No direct comparable exists in the GCC.</div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <table className="deck-table">
          <thead>
            <tr>
              <th style={{ width: '18%' }}>Player</th>
              <th style={{ width: '10%' }}>Origin</th>
              <th style={{ width: '16%' }}>Price / m²</th>
              {cols.map((c) => <th key={c.key} style={{ width: '11%', textAlign: 'center' }}>{c.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {players.map((p, i) => (
              <tr key={p.name} className={`anim-fade${p.numu ? ' numu-row' : ''}`} style={fade(inView, 0.14 + i * 0.1)}>
                <td style={{ fontWeight: p.numu ? 500 : 400, fontSize: '1rem' }}>{p.name}</td>
                <td style={{ color: 'rgba(244,239,232,0.65)', fontSize: '1rem' }}>{p.origin}</td>
                <td style={{ fontSize: '1rem' }}>{p.price}</td>
                {cols.map((c) => <td key={c.key} style={{ textAlign: 'center' }}><Check val={p[c.key] as CertStatus} /></td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="anim-fade" style={{ ...fade(inView, 0.52), marginTop: '1.75rem', marginBottom: '0.85rem', fontSize: '0.88rem', color: 'rgba(244,239,232,0.62)', lineHeight: 1.65, fontFamily: 'var(--font-sans, sans-serif)', maxWidth: '88%' }}>
        Context: Bolt Threads and MycoWorks raised over $300M combined chasing industrial-scale vertical integration in mycelium leather and packaging. Both collapsed in 2024–2025. NUMU is structurally different — specialty-scale, licensing-pathway, regionally locked-in. The failure pattern is not our pattern.
      </p>
      <div className="anim-fade" style={{ ...fade(inView, 0.6), marginTop: '1rem', marginBottom: '0.95rem', maxWidth: '88%', border: '1px solid rgba(198,106,63,0.35)', background: 'linear-gradient(90deg, rgba(198,106,63,0.10) 0%, rgba(198,106,63,0.04) 55%, rgba(198,106,63,0.00) 100%)', padding: '0.8rem 1rem 0.78rem' }}>
        <div className="deck-label" style={{ color: AMBER, marginBottom: '0.3rem' }}>Market signal — Europe, May 27, 2026</div>
        <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(239,234,216,0.9)', lineHeight: 1.62, fontFamily: 'var(--font-sans, sans-serif)' }}>
          Mykor (UK) announced a £4M funding round and said it has secured more than £338M in commercial agreements across the UK and Europe. The category is taking off in Europe. NUMU is the regional execution play.
        </p>
      </div>
      <p className="deck-label anim-fade" style={{ ...fade(inView, 0.66), marginTop: '0.5rem' }}>
        ● Present &nbsp;&nbsp; ○ Absent &nbsp;&nbsp; ◐ In progress
        &nbsp;&nbsp;&nbsp;&nbsp;
        NUMU: only player with bio-based + GCC local + local feedstock + design freedom. Certification initiated 2026.
      </p>
      <SlideNum n={10} />
    </div>
  )
}

// ─── 11 — Financial Projection ───────────────────────────────────────────────

function CapacityRampChart({ inView }: { inView: boolean }) {
  const bars = [
    { year: 'Y1', cap: 30,    detail: ['Founder-led lab'],                              raise: false },
    { year: 'Y2', cap: 600,   detail: ['Post-SAFE', 'Module 1 · Phase 1'],             raise: true  },
    { year: 'Y3', cap: 1200,  detail: ['Module 1 full', '+ certification'],            raise: false },
    { year: 'Y4', cap: 3000,  detail: ['Series A deploys', 'thermal + packaging line'], raise: true  },
    { year: 'Y5', cap: 12000, detail: ['Full factory', 'two-line industrial scale'],   raise: false },
  ]
  const MAX_CAP = 12500
  const W = 860
  const ABOVE_H = 22
  const BAR_AREA_H = 168
  const BELOW_H = 58
  const svgH = ABOVE_H + BAR_AREA_H + BELOW_H
  const barW = 128
  const gapW = (W - barW * 5) / 4
  const baselineY = ABOVE_H + BAR_AREA_H

  const points = bars.map((b, i) => {
    const x = i * (barW + gapW)
    const cx = x + barW / 2
    const barH = Math.max((b.cap / MAX_CAP) * BAR_AREA_H, 5)
    const barY = ABOVE_H + BAR_AREA_H - barH
    return `${cx},${barY}`
  }).join(' ')

  return (
    <svg viewBox={`0 0 ${W} ${svgH}`} style={{ width: '100%', height: '12.4rem', display: 'block' }} xmlns="http://www.w3.org/2000/svg">
      {[0.25, 0.5, 0.75, 1].map((step) => {
        const y = ABOVE_H + BAR_AREA_H - BAR_AREA_H * step
        return <line key={step} x1="0" y1={y} x2={W} y2={y} stroke={step === 1 ? 'rgba(239,234,216,0.16)' : 'rgba(239,234,216,0.06)'} strokeWidth="1" strokeDasharray={step === 1 ? undefined : '4,4'} />
      })}
      <line x1="0" y1={baselineY} x2={W} y2={baselineY} stroke="rgba(244,239,232,0.12)" strokeWidth="1" />
      <polyline points={points} fill="none" stroke="rgba(217,168,120,0.28)" strokeWidth="1.2" strokeDasharray="4,4" />
      {bars.map((b, i) => {
        const x = i * (barW + gapW)
        const cx = x + barW / 2
        const barH = Math.max((b.cap / MAX_CAP) * BAR_AREA_H, 5)
        const barY = ABOVE_H + BAR_AREA_H - barH
        const isY5 = b.year === 'Y5'
        const barFill = isY5 ? 'rgba(217,168,120,0.80)' : b.raise ? 'rgba(198,106,63,0.48)' : 'rgba(239,234,216,0.22)'
        return (
          <g key={b.year}>
            <g className="anim-bar" style={{ transform: inView ? 'scaleY(1)' : 'scaleY(0)', transformOrigin: `${cx}px ${baselineY}px`, transition: `transform 0.7s ease-out ${i * 0.12}s` }}>
              <rect x={x} y={barY} width={barW} height={barH} fill={barFill} rx="2" />
              <circle cx={cx} cy={barY} r="3" fill={isY5 ? GOLD : b.raise ? AMBER : 'rgba(239,234,216,0.55)'} />
            </g>
            <text x={cx} y={Math.max(barY - 14, 9)} textAnchor="middle" fontSize="5.5" fill="rgba(239,234,216,0.45)" letterSpacing="0.8" fontFamily="var(--font-sans, sans-serif)">sq.m / mo</text>
            <text x={cx} y={Math.max(barY - 2, 22)} textAnchor="middle" fontSize="13" fill={isY5 ? CREAM : '#F4EFE8'} fontFamily="var(--font-display, serif)" fontWeight="400" letterSpacing="-0.5">{b.cap.toLocaleString()}</text>
            <text x={cx} y={baselineY + 14} textAnchor="middle" fontSize="11" fill={b.raise ? GOLD : isY5 ? CREAM : 'rgba(239,234,216,0.62)'} fontFamily="var(--font-display, serif)" fontWeight={b.raise ? '500' : '400'} letterSpacing="-0.3">{b.year}</text>
            {b.detail.map((line, li) => (
              <text key={li} x={cx} y={baselineY + 28 + li * 9} textAnchor="middle" fontSize="5.3" fill="rgba(239,234,216,0.48)" letterSpacing="0.36" fontFamily="var(--font-sans, sans-serif)">{line}</text>
            ))}
            {b.raise && (
              <g>
                <rect x={cx - 33} y={barY - 34} width="66" height="16" rx="8" fill="rgba(198,106,63,0.16)" stroke="rgba(198,106,63,0.4)" strokeWidth="1" />
                <text x={cx} y={barY - 23} textAnchor="middle" fontSize="5.2" fill={AMBER} letterSpacing="0.8" fontFamily="var(--font-sans, sans-serif)">raise year</text>
              </g>
            )}
          </g>
        )
      })}
    </svg>
  )
}

function SlideFinancialProjection() {
  const [ref, inView] = useInView()
  type YearData = { year: string; sub: string; raise: boolean; revenue: string; margin: string; ebitda: string; ebitdaMargin: string }
  const years: YearData[] = [
    { year: 'Y1', sub: 'FOUNDER-LED',   raise: false, revenue: '$126K',  margin: '65%', ebitda: '$35K',   ebitdaMargin: '28%' },
    { year: 'Y2', sub: 'SAFE DEPLOYS',  raise: true,  revenue: '$701K',  margin: '64%', ebitda: '$187K',  ebitdaMargin: '27%' },
    { year: 'Y3', sub: 'PHASE 2 LIVE',  raise: false, revenue: '$1.90M', margin: '63%', ebitda: '$573K',  ebitdaMargin: '30%' },
    { year: 'Y4', sub: 'SERIES A',      raise: true,  revenue: '$3.41M', margin: '60%', ebitda: '$743K',  ebitdaMargin: '22%' },
    { year: 'Y5', sub: 'THERMAL SCALE', raise: false, revenue: '$10.1M', margin: '49%', ebitda: '$2.56M', ebitdaMargin: '25%' },
  ]
  const tableRows = [
    { label: 'Revenue',       getValue: (y: YearData) => y.revenue,       accent: false, dim: false },
    { label: 'Gross margin',  getValue: (y: YearData) => y.margin,        accent: false, dim: true  },
    { label: 'EBITDA',        getValue: (y: YearData) => y.ebitda,        accent: true,  dim: false },
    { label: 'EBITDA margin', getValue: (y: YearData) => y.ebitdaMargin,  accent: false, dim: true  },
  ]

  return (
    <div ref={ref} className="slide" style={{ display: 'flex', flexDirection: 'column', padding: '3.2% 5.6% 2.4%', gap: '0.55rem' }}>
      <div className="anim-fade" style={fade(inView, 0)}>
        <Label>11 — Financial Projection</Label>
        <div className="deck-h2" style={{ fontSize: '2.18rem', marginBottom: '0.18rem' }}>Five-year trajectory.</div>
        <p style={{ fontSize: '0.8rem', color: 'rgba(239,234,216,0.70)', margin: 0, fontFamily: 'var(--font-serif, serif)', fontStyle: 'italic', lineHeight: 1.38, maxWidth: '68rem' }}>
          Bottom-up from production economics. Two raises, four engines, two modules. Conservative ramp, compounding margins.
        </p>
      </div>
      <div className="anim-fade" style={{ ...fade(inView, 0.12), border: BORDER, background: 'rgba(239,234,216,0.025)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '11rem repeat(5, 1fr)', borderBottom: `1px solid ${AMBER}` }}>
          <div style={{ padding: '0.52rem 0.72rem' }} />
          {years.map(yr => (
            <div key={yr.year} style={{ padding: '0.52rem 0.72rem', borderLeft: BORDER, background: yr.raise ? 'rgba(198,106,63,0.10)' : 'transparent' }}>
              <div style={{ fontFamily: 'var(--font-display, serif)', fontSize: '1.22rem', lineHeight: 1, color: yr.raise ? GOLD : CREAM }}>{yr.year}</div>
              <div style={{ fontSize: '0.46rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(239,234,216,0.46)', marginTop: '0.18rem' }}>{yr.sub}</div>
            </div>
          ))}
        </div>
        {tableRows.map((row, ri) => (
          <div key={row.label} className="anim-fade" style={{ ...fade(inView, 0.24 + ri * 0.1), display: 'grid', gridTemplateColumns: '11rem repeat(5, 1fr)', borderBottom: ri < tableRows.length - 1 ? BORDER : 'none', background: row.accent ? 'rgba(198,106,63,0.08)' : 'transparent' }}>
            <div style={{ padding: '0.5rem 0.72rem', display: 'flex', alignItems: 'center' }}>
              <span style={{ fontSize: '0.52rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: row.accent ? CREAM : 'rgba(239,234,216,0.54)', fontFamily: 'var(--font-sans, sans-serif)' }}>{row.label}</span>
            </div>
            {years.map(yr => (
              <div key={yr.year} style={{ padding: '0.5rem 0.72rem', borderLeft: BORDER, background: yr.raise ? 'rgba(198,106,63,0.05)' : 'transparent', display: 'flex', alignItems: 'center' }}>
                <span style={{ fontFamily: row.accent ? 'var(--font-display, serif)' : 'var(--font-sans, sans-serif)', fontSize: row.accent ? '1.02rem' : row.dim ? '0.9rem' : '0.96rem', color: row.accent ? GOLD : row.dim ? 'rgba(239,234,216,0.78)' : CREAM, fontWeight: row.accent ? 400 : row.dim ? 400 : 500, letterSpacing: row.accent ? '-0.02em' : 'normal' }}>{row.getValue(yr)}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '0.44fr 0.56fr', gap: '0.8rem', alignItems: 'stretch' }}>
        <div className="anim-fade" style={{ ...fade(inView, 0.62), border: BORDER, background: 'linear-gradient(180deg, rgba(198,106,63,0.06) 0%, rgba(239,234,216,0.015) 100%)', padding: '0.7rem 0.8rem 0.68rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '0.55rem' }}>
          <div>
            <div className="deck-label" style={{ color: AMBER, marginBottom: '0.28rem' }}>Margin story</div>
            <p style={{ margin: 0, fontSize: '0.7rem', color: 'rgba(239,234,216,0.84)', lineHeight: 1.46, fontFamily: 'var(--font-sans, sans-serif)' }}>
              Premium acoustic margins early (60–65%). As Series A unlocks construction-scale thermal and packaging, blended margin compresses to ~49% while absolute gross profit grows 60x. We trade margin points for volume and market share.
            </p>
          </div>
          <div style={{ borderTop: BORDER, paddingTop: '0.48rem' }}>
            <div className="deck-label" style={{ color: 'rgba(239,234,216,0.46)', marginBottom: '0.22rem' }}>Utilization assumption</div>
            <p style={{ margin: 0, fontSize: '0.62rem', color: 'rgba(239,234,216,0.6)', lineHeight: 1.42, fontFamily: 'var(--font-sans, sans-serif)' }}>
              Chart shows full installed factory capacity. Financial model assumes staged utilization against that capacity: roughly 30% in Y2, 39% in Y3-Y4, and 94% in Y5.
            </p>
          </div>
        </div>
        <div className="anim-fade" style={{ ...fade(inView, 0.7), border: BORDER, background: 'linear-gradient(180deg, rgba(239,234,216,0.04) 0%, rgba(239,234,216,0.015) 100%)', padding: '0.72rem 0.85rem 0.48rem', display: 'flex', flexDirection: 'column', gap: '0.28rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.5rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: GOLD, fontFamily: 'var(--font-sans, sans-serif)' }}>Factory Capacity Ramp · sq.m per month</span>
            <span style={{ fontSize: '0.78rem', color: 'rgba(239,234,216,0.78)', fontFamily: 'var(--font-serif, serif)', fontStyle: 'italic' }}>Not pre-revenue. Pre-leverage.</span>
          </div>
          <div>
            <CapacityRampChart inView={inView} />
          </div>
        </div>
      </div>
      <div className="anim-fade" style={{ ...fade(inView, 0.78), fontSize: '0.5rem', letterSpacing: '0.1em', color: 'rgba(239,234,216,0.38)', fontFamily: 'var(--font-sans, sans-serif)' }}>
        Source: NUMU 5-Year Financial Model v4 · P&L uses staged utilization; chart reflects installed factory capacity · available on request.
      </div>
      <SlideNum n={11} />
    </div>
  )
}

// ─── 12 — Thermal Cost Curve ─────────────────────────────────────────────────

function ThermalSpawnCostCurve({ inView }: { inView: boolean }) {
  const phases = [
    { name: 'Phase 1', years: 'Y1–2', value: 4000, note: '100% bought-in (Kineco)', delta: null,    fill: 'rgba(239,234,216,0.22)' },
    { name: 'Phase 2', years: 'Y3',   value: 1600, note: 'In-house substrate fusion + 10% bought', delta: '−60%', fill: 'rgba(198,106,63,0.48)' },
    { name: 'Phase 3', years: 'Y4–5', value: 900,  note: 'Full in-house spawn', delta: '−78%',      fill: 'rgba(217,168,120,0.80)' },
  ]
  const W = 480; const H = 250; const max = 4200; const baseY = 186; const barW = 88; const gap = 58

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', display: 'block' }} xmlns="http://www.w3.org/2000/svg">
      {[0.25, 0.5, 0.75, 1].map((step) => {
        const y = baseY - 140 * step
        return <line key={step} x1="0" y1={y} x2={W} y2={y} stroke={step === 1 ? 'rgba(239,234,216,0.16)' : 'rgba(239,234,216,0.06)'} strokeWidth="1" strokeDasharray={step === 1 ? undefined : '4,4'} />
      })}
      <line x1="0" y1={baseY} x2={W} y2={baseY} stroke="rgba(239,234,216,0.14)" strokeWidth="1" />
      <polyline points={phases.map((phase, index) => { const x = 20 + index * (barW + gap); const cx = x + barW / 2; const h = (phase.value / max) * 140; return `${cx},${baseY - h}` }).join(' ')} fill="none" stroke="rgba(217,168,120,0.42)" strokeWidth="1.5" strokeDasharray="4,4" />
      {phases.map((phase, index) => {
        const x = 20 + index * (barW + gap)
        const cx = x + barW / 2
        const h = (phase.value / max) * 140
        const y = baseY - h
        return (
          <g key={phase.name}>
            <g className="anim-bar" style={{ transform: inView ? 'scaleY(1)' : 'scaleY(0)', transformOrigin: `${cx}px ${baseY}px`, transition: `transform 0.7s ease-out ${index * 0.15}s` }}>
              <rect x={x} y={y} width={barW} height={h} rx="2" fill={phase.fill} />
              <circle cx={cx} cy={y} r="3.2" fill={index === 2 ? GOLD : index === 1 ? AMBER : 'rgba(239,234,216,0.55)'} />
            </g>
            <text x={cx} y={y - 14} textAnchor="middle" fontSize="7" fill="rgba(239,234,216,0.50)" letterSpacing="0.6" fontFamily="var(--font-sans, sans-serif)">USD / t</text>
            <text x={cx} y={y - 2} textAnchor="middle" fontSize="16" fill={CREAM} letterSpacing="-0.5" fontFamily="var(--font-display, serif)">${phase.value.toLocaleString()}</text>
            <text x={cx} y={baseY + 16} textAnchor="middle" fontSize="10.5" fill={index === 2 ? GOLD : CREAM} fontFamily="var(--font-display, serif)">{phase.name}</text>
            <text x={cx} y={baseY + 27} textAnchor="middle" fontSize="5.2" fill="rgba(239,234,216,0.46)" letterSpacing="1.2" fontFamily="var(--font-sans, sans-serif)">{phase.years}</text>
            <text x={cx} y={baseY + 39} textAnchor="middle" fontSize="5.7" fill="rgba(239,234,216,0.62)" fontFamily="var(--font-sans, sans-serif)">{phase.note}</text>
            {phase.delta && (
              <>
                <rect x={cx - 22} y={y - 36} width="44" height="15" rx="7.5" fill="rgba(198,106,63,0.16)" stroke="rgba(198,106,63,0.42)" strokeWidth="1" />
                <text x={cx} y={y - 25} textAnchor="middle" fontSize="5.3" fill={AMBER} letterSpacing="0.7" fontFamily="var(--font-sans, sans-serif)">{phase.delta}</text>
              </>
            )}
          </g>
        )
      })}
    </svg>
  )
}

function SlideThermalCostCurve() {
  const [ref, inView] = useInView()
  const costs = [
    ['Palm fibre (free local waste)', '$0.70'],
    ['Spawn (in-house @ $900/t)', '$0.90'],
    ['Nutrient', '$0.15'],
    ['Grow + dry energy', '$5.50'],
    ['Direct labor', '$4.50'],
    ['Logistics', '$4.00'],
    ['Mfg overhead + depreciation', '$5.75'],
  ]
  const totals: Array<[string, string, boolean]> = [
    ['Total cost',   '$21.50', true  ],
    ['Selling price','$35.00', false ],
    ['Gross margin', '39%',    true  ],
  ]
  return (
    <div ref={ref} className="slide" style={{ display: 'flex', flexDirection: 'column', padding: '4.2% 6.2% 3.2%', gap: '0.95rem' }}>
      <div className="anim-fade" style={fade(inView, 0)}>
        <Label>12 — Thermal Cost Curve</Label>
        <div className="deck-h2" style={{ fontSize: '2.6rem', marginBottom: '0.3rem' }}>The cost curve is the whole game.</div>
        <p style={{ fontSize: '0.9rem', color: 'rgba(239,234,216,0.68)', margin: 0, fontFamily: 'var(--font-serif, serif)', fontStyle: 'italic', lineHeight: 1.48, maxWidth: '72rem' }}>
          Thermal insulation only works at construction-competitive pricing because of two regional advantages: near-free palm waste, and in-house spawn production. The Series A funds exactly this.
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '1rem', flex: 1 }}>
        <div className="anim-fade" style={{ ...fade(inView, 0.14), border: BORDER, background: 'rgba(239,234,216,0.025)', padding: '0.95rem 1rem 0.85rem', display: 'flex', flexDirection: 'column' }}>
          <div className="deck-label" style={{ color: GOLD, marginBottom: '0.65rem' }}>Spawn cost curve · USD / tonne</div>
          <div style={{ flex: 1 }}>
            <ThermalSpawnCostCurve inView={inView} />
          </div>
        </div>
        <div className="anim-fade" style={{ ...fade(inView, 0.22), border: BORDER, background: 'rgba(239,234,216,0.02)', padding: '0.95rem 1rem 0.85rem', display: 'flex', flexDirection: 'column' }}>
          <div className="deck-label" style={{ color: GOLD, marginBottom: '0.7rem' }}>Thermal panel cost stack · $ / m² @ 100mm · Phase 3</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {costs.map(([label, value], i) => (
              <div key={label} className="anim-fade" style={{ ...fade(inView, 0.3 + i * 0.06), display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.7rem', padding: '0.48rem 0', borderBottom: BORDER, alignItems: 'baseline' }}>
                <span style={{ fontSize: '0.84rem', lineHeight: 1.38, color: 'rgba(239,234,216,0.82)', fontFamily: 'var(--font-sans, sans-serif)' }}>{label}</span>
                <span style={{ fontSize: '0.86rem', color: CREAM, fontFamily: 'var(--font-mono, monospace)' }}>{value}</span>
              </div>
            ))}
            {totals.map(([label, value, accent]) => (
              <div key={label} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.7rem', padding: '0.6rem 0', borderBottom: label === 'Gross margin' ? 'none' : BORDER, alignItems: 'baseline' }}>
                <span style={{ fontSize: '0.86rem', lineHeight: 1.38, color: accent ? CREAM : 'rgba(239,234,216,0.82)', fontFamily: 'var(--font-sans, sans-serif)', fontWeight: accent ? 600 : 500 }}>{label}</span>
                <span style={{ fontSize: accent ? '1rem' : '0.92rem', color: accent ? GOLD : CREAM, fontFamily: accent ? 'var(--font-display, serif)' : 'var(--font-mono, monospace)' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="anim-fade" style={{ ...fade(inView, 0.76), border: '1px solid rgba(198,106,63,0.34)', background: 'linear-gradient(90deg, rgba(198,106,63,0.12) 0%, rgba(198,106,63,0.04) 52%, rgba(198,106,63,0.00) 100%)', padding: '0.8rem 1rem 0.78rem' }}>
        <div className="deck-label" style={{ color: AMBER, marginBottom: '0.26rem' }}>Structural cost edge</div>
        <p style={{ margin: 0, fontSize: '0.88rem', color: 'rgba(239,234,216,0.92)', lineHeight: 1.58, fontFamily: 'var(--font-sans, sans-serif)' }}>
          With bought-in spawn, the same panel costs ~$24.60/m² → 30% margin. In-house spawn + free palm waste gives NUMU a ~$8–12/m² structural cost edge over European hemp-mycelium. And unlike those models, NUMU&apos;s thermal is profitable on panel sales alone — no reliance on carbon credits.
        </p>
      </div>
      <div className="anim-fade" style={{ ...fade(inView, 0.82), fontSize: '0.5rem', letterSpacing: '0.1em', color: 'rgba(239,234,216,0.38)', fontFamily: 'var(--font-sans, sans-serif)' }}>
        Source: NUMU 5-Year Financial Model v4 · spawn curve + thermal cost stack · available on request.
      </div>
      <SlideNum n={12} />
    </div>
  )
}

// ─── 13 — Moat ───────────────────────────────────────────────────────────────

function SlideMoat() {
  const [ref, inView] = useInView()
  const moat = [
    ['01', 'Process IP',               'Proprietary hot-arid growth + pressing parameters. No one has solved this for the GCC climate.'],
    ['02', 'Regional feedstock',       'Palm fibre + date kernel formulations specific to UAE agricultural waste. Price-locked inputs.'],
    ['03', 'First operating knowledge','First commercial GCC mycelium manufacturer. Temperate-climate experience does not transfer.'],
    ['04', 'Local supply',             'Direct feedstock sourcing from UAE agricultural producers. Contracted and operational.'],
  ]
  return (
    <div ref={ref} className="slide" style={{ display: 'flex', flexDirection: 'column', padding: '5.5% 7%' }}>
      <div className="anim-fade" style={{ ...fade(inView, 0), marginBottom: '2.5rem' }}>
        <Label>13 — Moat</Label>
        <div className="deck-h2" style={{ fontSize: '3rem' }}>Four layers of defensibility.</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', flex: 1, gap: '0' }}>
        {moat.map(([num, title, body], i) => (
          <div key={num} className="moat-item anim-fade" style={{ ...fade(inView, 0.16 + i * 0.12), padding: '2rem 3rem 2rem 0', alignItems: 'flex-start' }}>
            <span className="moat-num" style={{ fontSize: '0.65rem', paddingTop: '0.2rem' }}>{num}</span>
            <div>
              <div style={{ fontSize: '1.1rem', color: CREAM, fontFamily: 'var(--font-sans, sans-serif)', fontWeight: 500, marginBottom: '0.6rem' }}>{title}</div>
              <p style={{ fontSize: '1rem', color: 'rgba(244,239,232,0.72)', lineHeight: 1.62, margin: 0, fontFamily: 'var(--font-sans, sans-serif)' }}>{body}</p>
            </div>
          </div>
        ))}
      </div>
      <SlideNum n={13} />
    </div>
  )
}

// ─── 14 — Ecosystem ──────────────────────────────────────────────────────────

function SlideEcosystem() {
  const [ref, inView] = useInView()
  const ecosystemNodes = [
    { name: 'NUMU',   detail: 'GCC manufacturing anchor' },
    { name: 'UFO',    detail: 'Sport + social product line' },
    { name: 'Hyphen', detail: 'Waste → nanomaterials' },
  ]
  const columns = [
    {
      header: { status: 'Dubai, UAE · Operational', accent: true, name: 'NUMU', desc: 'GCC bio-composite manufacturing platform', role: 'Andy Cartier · Founder & CEO' },
      badges: [
        { text: '$600K SAFE · Raising', color: '#c9a96e', bg: 'rgba(201,169,110,0.12)', border: 'rgba(201,169,110,0.35)' },
        { text: 'BASE39 Creative Accelerator · Dubai', color: '#7A9B6E', bg: 'rgba(122,155,110,0.12)', border: 'rgba(122,155,110,0.35)' },
      ],
      partnerLabel: 'Active partnerships',
      partners: [
        ['NYXO Design Studio (UAE)', 'FOLD acoustic tile collaboration'],
        ['Gulf Craft / Hussain (UAE)', 'Marine pathway · paddle board → interior components → leisure boats'],
        ['Biomyc (Netherlands)', 'Inbound E4 packaging technology licence'],
      ],
      devLabel: 'In development',
      devItems: [
        ['UAE Pavilion architect', 'Next World Cup · in active discussion'],
        ['France', 'Bio-based urban pavement R&D · co-developing'],
      ],
    },
    {
      header: { status: 'Los Angeles, USA · Prototype', accent: false, name: 'UFO', desc: 'Pressed mycelium composite boards — sport, social, environmental', role: 'Andy Cartier · Co-founder · 33%' },
      note: 'First product: mycelium skateboard — sport meets environmental movement. First product launch: end of summer 2026.',
      partnerLabel: 'Active partner',
      partners: [['ASTRO · Los Angeles', 'Additive manufacturing + aerospace testing. Prototype development, mold financing, and launch co-organization in Los Angeles.']],
    },
    {
      header: { status: 'Los Angeles, USA · Development', accent: false, name: 'Hyphen', desc: 'Waste-to-nanomaterial platform · plastic, textile, mycelium → graphene', role: 'Andy Cartier · Co-founder · 7.5%' },
      note: 'Converts plastic, textile, and mycelium waste into nanomaterials — particularly graphene.',
      partnerLabel: 'Cross-cutting leadership',
      partners: [['ASTRO CEO = Hyphen CTO', 'Shared technical leadership across UFO, ASTRO, and Hyphen.']],
    },
  ]

  return (
    <div ref={ref} className="slide" style={{ display: 'flex', flexDirection: 'column', padding: '3.8% 6.2% 3.2%' }}>
      <div className="anim-fade" style={{ ...fade(inView, 0), marginBottom: '1.1%' }}>
        <Label>14 — Ecosystem</Label>
        <div className="deck-h2" style={{ fontSize: '2.45rem', marginBottom: '0.34rem' }}>One founder. Three companies. One material thesis.</div>
        <p style={{ fontSize: '0.84rem', color: 'rgba(244,239,232,0.60)', margin: 0, fontFamily: 'var(--font-serif, serif)', lineHeight: 1.52, maxWidth: '76rem', fontStyle: 'italic' }}>
          NUMU is the GCC anchor. UFO and Hyphen extend the mycelium platform across sport, aerospace, and waste valorization. IP and process knowledge flow between all three. The bridge between proven technology and regional execution.
        </p>
      </div>
      <div className="anim-fade" style={{ ...fade(inView, 0.1), marginBottom: '1.05%', padding: '0.72rem 0.95rem', border: BORDER, background: 'rgba(239,234,216,0.03)' }}>
        <div className="deck-label" style={{ marginBottom: '0.42rem', color: GOLD }}>Founder Network · IP Fluidity</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr auto 1fr', alignItems: 'center', gap: '0.9rem' }}>
          {ecosystemNodes.map((node, index) => (
            <div key={node.name} style={{ display: 'contents' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display, serif)', fontSize: '1.2rem', color: CREAM }}>{node.name}</div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(239,234,216,0.60)', fontFamily: 'var(--font-sans, sans-serif)' }}>{node.detail}</div>
              </div>
              {index < ecosystemNodes.length - 1 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <div style={{ width: '3.2rem', height: '1px', background: 'linear-gradient(90deg, rgba(217,168,120,0.65), rgba(217,168,120,0.12))' }} />
                  <div style={{ width: '0.34rem', height: '0.34rem', borderRadius: '999px', background: GOLD }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.82rem', flex: 1 }}>
        {columns.map((col, i) => (
          <div key={col.header.name} className="anim-fade" style={{ ...fade(inView, 0.2 + i * 0.14), border: BORDER, background: i === 0 ? 'rgba(239,234,216,0.025)' : 'rgba(239,234,216,0.02)', padding: '0.9rem 0.9rem 0.74rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div>
              <div style={{ fontSize: '0.5rem', letterSpacing: '0.20em', textTransform: 'uppercase', color: col.header.accent ? '#c9a96e' : 'rgba(244,239,232,0.40)', marginBottom: '0.25rem', fontFamily: 'var(--font-sans, sans-serif)' }}>{col.header.status}</div>
              <div style={{ fontFamily: 'var(--font-display, serif)', fontSize: '1.55rem', color: CREAM, lineHeight: 1.1, marginBottom: '0.25rem' }}>{col.header.name}</div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(244,239,232,0.60)', fontFamily: 'var(--font-sans, sans-serif)', lineHeight: 1.45, marginBottom: '0.3rem' }}>{col.header.desc}</div>
              <div className="deck-label" style={{ marginBottom: '0.5rem' }}>{col.header.role}</div>
              {col.badges && (
                <div style={{ display: 'flex', gap: '0.34rem', flexWrap: 'wrap' }}>
                  {col.badges.map(b => (
                    <span key={b.text} style={{ background: b.bg, border: `1px solid ${b.border}`, color: b.color, fontSize: '0.48rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.15rem 0.45rem', borderRadius: '1px' }}>{b.text}</span>
                  ))}
                </div>
              )}
              {col.note && (
                <div style={{ background: 'rgba(244,239,232,0.03)', border: BORDER, padding: '0.46rem 0.6rem', borderRadius: '1px' }}>
                  <div style={{ fontSize: '0.78rem', color: CREAM, fontFamily: 'var(--font-sans, sans-serif)', lineHeight: 1.5 }}>{col.note}</div>
                </div>
              )}
            </div>
            <div>
              <div className="deck-label" style={{ fontSize: '0.5rem', marginBottom: '0.4rem' }}>{col.partnerLabel}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {col.partners.map(([name, desc]) => (
                  <div key={name} style={{ padding: '0.42rem 0.54rem', border: BORDER, background: 'rgba(239,234,216,0.02)' }}>
                    <div style={{ fontSize: '0.8rem', color: CREAM, fontFamily: 'var(--font-sans, sans-serif)', fontWeight: 500, lineHeight: 1.3 }}>{name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'rgba(244,239,232,0.56)', fontFamily: 'var(--font-sans, sans-serif)', lineHeight: 1.42 }}>{desc}</div>
                  </div>
                ))}
              </div>
            </div>
            {col.devItems && (
              <div>
                <div className="deck-label" style={{ fontSize: '0.5rem', marginBottom: '0.4rem' }}>{col.devLabel}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {col.devItems.map(([name, desc]) => (
                    <div key={name} style={{ padding: '0.42rem 0.54rem', border: BORDER, background: 'rgba(239,234,216,0.02)' }}>
                      <div style={{ fontSize: '0.8rem', color: CREAM, fontFamily: 'var(--font-sans, sans-serif)', fontWeight: 500, lineHeight: 1.3 }}>{name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'rgba(244,239,232,0.56)', fontFamily: 'var(--font-sans, sans-serif)', lineHeight: 1.42 }}>{desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="anim-fade" style={{ ...fade(inView, 0.62), marginTop: '0.92%', padding: '0.72rem 0.9rem', background: 'linear-gradient(90deg, rgba(198,106,63,0.12) 0%, rgba(239,234,216,0.03) 32%, rgba(239,234,216,0.02) 100%)', border: BORDER, display: 'grid', gridTemplateColumns: '15.5rem 1fr 12rem', gap: '0.85rem', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.22rem' }}>
          <span style={{ fontSize: '0.5rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#c9a96e', fontFamily: 'var(--font-sans, sans-serif)', padding: '0.22rem 0.45rem', border: '1px solid rgba(217,168,120,0.28)', background: 'rgba(198,106,63,0.08)', whiteSpace: 'nowrap', width: 'fit-content' }}>Neal Lachman / TSI</span>
          <div className="deck-label" style={{ fontSize: '0.48rem', color: 'rgba(244,239,232,0.42)' }}>MOU effective May 28, 2026</div>
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: '0.82rem', color: CREAM, fontFamily: 'var(--font-sans, sans-serif)', lineHeight: 1.38, fontWeight: 500, marginBottom: '0.18rem' }}>NUMU designated Bio-Materials &amp; ISRU Composites Partner within TSI&apos;s Space &amp; Lunar Economy Consortium.</div>
          <div style={{ fontSize: '0.7rem', color: 'rgba(244,239,232,0.56)', fontFamily: 'var(--font-sans, sans-serif)', lineHeight: 1.42 }}>Strategic bridge into orbital payloads, lunar materials, and closed-loop life support. Advisory-board role at TSI supports direct founder-level alignment.</div>
        </div>
        <div style={{ justifySelf: 'end', textAlign: 'right' }}>
          <div style={{ fontSize: '0.5rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(244,239,232,0.36)', fontFamily: 'var(--font-sans, sans-serif)', marginBottom: '0.2rem' }}>US-anchored aerospace consortium</div>
          <div style={{ fontSize: '0.68rem', color: '#c9a96e', fontFamily: 'var(--font-serif, serif)', fontStyle: 'italic', lineHeight: 1.3 }}>Proof, not aspiration.</div>
        </div>
      </div>
      <div className="anim-fade" style={{ ...fade(inView, 0.7), marginTop: '0.72%', paddingTop: '0.42rem', borderTop: BORDER }}>
        <p style={{ fontSize: '0.72rem', color: 'rgba(239,234,216,0.62)', fontFamily: 'var(--font-serif, serif)', fontStyle: 'italic', margin: 0, lineHeight: 1.4 }}>
          Patents, formulations, and process knowledge flow between NUMU, UFO, and Hyphen. What we develop in the UAE deploys in the US. What&apos;s built in the US scales in the GCC. A worldwide mycelium ecosystem connected by one founder.
        </p>
      </div>
      <SlideNum n={14} />
    </div>
  )
}

// ─── 15 — Roadmap ────────────────────────────────────────────────────────────

function SlideRoadmap() {
  const [ref, inView] = useInView()
  const phases = [
    { period: 'M0 – M6',   label: 'Platform Activation', units: 6,  funded: true,  bg: 'rgba(198,106,63,0.10)',    items: ['Funding close → immediate deployment', 'Production facility + press line', 'First operator hired', 'Patent filing complete', 'Certifications initiated'] },
    { period: 'M6 – M18',  label: 'First Revenue',       units: 12, funded: false, bg: 'rgba(239,234,216,0.04)',   items: ['E1 + E2 revenue streams active', 'KAVE + pipeline conversions', 'Designer specification channel set', 'Y1→Y2 revenue: $126K → $701K'] },
    { period: 'M18 – M24', label: 'Certification Scale', units: 6,  funded: false, bg: 'rgba(217,168,120,0.06)',   items: ['Fire + acoustic certifications achieved', 'E3 commercial market unlocked', '3–5 commercial projects in spec', 'Y3 revenue: $1.90M · acoustic + fire certified'] },
    { period: 'M24+',      label: 'Platform Leverage',   units: 10, funded: false, bg: 'rgba(239,234,216,0.03)',   items: ['Thermal + packaging scale to volume', 'Saudi Arabia + NEOM pathway', 'First regional licensing deal', '→ Series A: $2.5M · in-house spawn + Module 2 + thermal/packaging at construction scale', 'Path to 300–400K m²/yr = Series B'] },
  ]
  return (
    <div ref={ref} className="slide" style={{ display: 'flex', flexDirection: 'column', padding: '4.5% 7% 4%', gap: '1.2rem' }}>
      <div className="anim-fade" style={fade(inView, 0)}>
        <Label>15 — Roadmap</Label>
        <div className="deck-h2" style={{ fontSize: '2.75rem', marginBottom: '0.5rem' }}>Phased platform expansion.</div>
        <div className="deck-label" style={{ fontSize: '0.6rem', letterSpacing: '0.2em' }}>$600K SAFE FUNDS PHASES 1 + 2 · $2.5M SERIES A FUNDS PHASES 3 + 4</div>
      </div>
      <div className="anim-fade" style={{ ...fade(inView, 0.12), padding: '0.95rem 1rem', border: BORDER, background: 'rgba(239,234,216,0.025)' }}>
        <div className="deck-label" style={{ color: GOLD, marginBottom: '0.55rem' }}>Timeline</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.85rem', alignItems: 'center' }}>
          {phases.map((phase, index) => (
            <div key={phase.period} style={{ padding: '0.65rem 0.8rem', border: BORDER, background: index === 0 ? 'rgba(198,106,63,0.12)' : 'rgba(239,234,216,0.02)' }}>
              <div style={{ fontSize: '0.52rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: index === 0 ? GOLD : 'rgba(239,234,216,0.42)', fontFamily: 'var(--font-sans, sans-serif)', marginBottom: '0.22rem' }}>{phase.period}</div>
              <div style={{ fontSize: '1rem', color: CREAM, fontFamily: 'var(--font-sans, sans-serif)', fontWeight: 500 }}>{phase.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.95rem', flex: 1 }}>
        {phases.map((ph, i) => (
          <div key={ph.period} className="anim-fade" style={{ ...fade(inView, 0.22 + i * 0.1), border: BORDER, background: ph.bg, padding: '1rem 1rem 0.9rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.7rem' }}>
              <div>
                <div style={{ fontSize: '0.5rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: ph.funded ? GOLD : 'rgba(239,234,216,0.40)', fontFamily: 'var(--font-sans, sans-serif)', marginBottom: '0.22rem' }}>{ph.period}</div>
                <div style={{ fontFamily: 'var(--font-display, serif)', fontSize: '1.12rem', color: CREAM, lineHeight: 1.15 }}>{ph.label}</div>
              </div>
              {ph.funded && <span style={{ fontSize: '0.48rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: GOLD, border: '1px solid rgba(217,168,120,0.3)', background: 'rgba(217,168,120,0.08)', padding: '0.18rem 0.36rem' }}>funded</span>}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.62rem' }}>
              {ph.items.map((item, j) => (
                <div key={j} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <span style={{ color: ph.funded ? GOLD : 'rgba(239,234,216,0.32)', fontSize: '0.55rem', paddingTop: '0.35rem', flexShrink: 0 }}>▸</span>
                  <span style={{ fontSize: '0.9rem', color: 'rgba(239,234,216,0.88)', lineHeight: 1.5, fontFamily: 'var(--font-sans, sans-serif)' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <SlideNum n={15} />
    </div>
  )
}

// ─── 16 — Team ───────────────────────────────────────────────────────────────

function SlideTeam() {
  const [ref, inView] = useInView()
  const members = [
    { name: 'Andy Cartier',   role: 'Founder & CEO',          focus: 'Mycelium Industrialization', bio: '7 years lab-to-production. Two installations. Co-founder: UFO (33%) + Hyphen (7.5%) in the US. Co-inventor on 2 Belgian patent families. Paid mycelium masterclass instructor (3 sold-out sessions).', credential: 'Routledge author (2024) · TSI adviser · Neal Lachman MOU (May 28, 2026)', img: '/images/founder/processed/andy_public_v2.png' },
    { name: 'Benjamin Rieux', role: 'Cofounder & CFO',         focus: 'Construction Finance',       bio: '15+ years construction + real estate finance across GCC + Europe. Leads financial strategy and investor reporting.', credential: undefined, img: '/images/founder/benjamin_2026.png' },
    { name: 'Othman Ihrai',   role: 'Cofounder & Head of IP',  focus: 'IP + Legal Strategy',        bio: 'PhD IP Law. 15+ years CEO of French Tech-certified startups. Patent strategy, technology governance, venture structuring.', credential: undefined, img: '/images/founder/othman_2026.png' },
    { name: 'Matthew Zelitt', role: 'Chief Growth Officer',    focus: 'Partnerships & Go-to-Market',bio: '10+ years healthcare + early-stage startups. Commercial pipeline, strategic partnerships, investor relations.', credential: undefined, img: '/images/founder/matthew_2026.png' },
  ]
  return (
    <div ref={ref} className="slide" style={{ display: 'grid', gridTemplateRows: 'auto 1fr', overflow: 'hidden' }}>
      <div className="anim-fade" style={{ ...fade(inView, 0), padding: '4% 7% 3%', borderBottom: BORDER }}>
        <Label>16 — Team</Label>
        <div className="deck-h2" style={{ fontSize: '3rem', marginBottom: 0 }}>People who execute.</div>
      </div>
      <div className="team-grid">
        {members.map((m, i) => (
          <div key={m.name} className="team-card anim-fade" style={fade(inView, 0.18 + i * 0.12)}>
            <div className="team-photo-wrap"><img src={m.img} alt={m.name} /></div>
            <div className="team-text">
              <div style={{ fontSize: '1.1rem', color: CREAM, fontFamily: 'var(--font-sans, sans-serif)', fontWeight: 600, marginBottom: '0.2rem', letterSpacing: '-0.01em' }}>{m.name}</div>
              <div className="deck-eyebrow" style={{ fontSize: '0.58rem', marginBottom: '0.3rem' }}>{m.role}</div>
              <div style={{ fontSize: '0.8rem', color: GOLD, fontFamily: 'var(--font-sans, sans-serif)', fontWeight: 500, marginBottom: '0.7rem' }}>{m.focus}</div>
              <p style={{ fontSize: '0.9rem', color: 'rgba(244,239,232,0.7)', lineHeight: 1.55, margin: 0, fontFamily: 'var(--font-sans, sans-serif)' }}>{m.bio}</p>
              {m.credential && <div style={{ marginTop: '0.55rem', fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#c9a96e', fontFamily: 'var(--font-sans, sans-serif)', fontWeight: 500 }}>{m.credential}</div>}
            </div>
          </div>
        ))}
      </div>
      <SlideNum n={16} />
    </div>
  )
}

// ─── 17 — The Ask ────────────────────────────────────────────────────────────

function SlideAsk() {
  const [ref, inView] = useInView()
  const fundItems = [
    { label: 'Production space + containers', pct: 30,   amount: 'AED 660K' },
    { label: 'Team',                          pct: 25.5, amount: 'AED 561K' },
    { label: 'Machinery + equipment',         pct: 24.8, amount: 'AED 545K' },
    { label: 'Certifications + IP',           pct: 11.7, amount: 'AED 257K' },
    { label: 'Sales, marketing + buffer',     pct: 8,    amount: 'AED 176K' },
  ]
  return (
    <div ref={ref} className="slide" style={{ display: 'flex', flexDirection: 'column', padding: '5.5% 7%', justifyContent: 'center' }}>
      <div className="anim-fade" style={fade(inView, 0)}>
        <Label>17 — The Ask</Label>
      </div>
      <div className="ask-amount anim-fade" style={{ ...fade(inView, 0.08), marginTop: '0.75rem' }}>$600,000</div>
      <div className="ask-meta-strip anim-fade" style={{ ...fade(inView, 0.18), gridTemplateColumns: 'repeat(4, 1fr)' }}>
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
          <div className="ask-meta-value" style={{ fontSize: '0.95rem' }}>Cap open · founder discretion this round</div>
        </div>
      </div>
      <div className="anim-fade" style={fade(inView, 0.28)}>
        <div className="deck-label" style={{ marginBottom: '1rem' }}>Use of funds</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem 6%' }}>
          {fundItems.map((item, i) => (
            <div key={item.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.4rem' }}>
                <span style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: '1rem', color: CREAM }}>{item.label}</span>
                <span style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: '1rem', color: GOLD, fontWeight: 500 }}>{item.amount}</span>
              </div>
              <div className="funds-bar-track">
                <div className="funds-bar-fill" style={{ width: inView ? `${item.pct}%` : '0%', transition: `width 0.7s ease-out ${0.4 + i * 0.08}s` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: '2rem', borderTop: BORDER, paddingTop: '1.3rem', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
        {[
          ['Milestone 1', 'Production space live + first operator hired'],
          ['Milestone 2', 'Revenue engines E1 + E2 active'],
          ['Milestone 3', 'Certification pathway underway'],
          ['Milestone 4', 'Biomyc European licensing activation'],
        ].map(([label, value], i) => (
          <div key={label} className="anim-fade" style={fade(inView, 0.56 + i * 0.08)}>
            <div className="deck-label" style={{ marginBottom: '0.25rem' }}>{label}</div>
            <div style={{ fontSize: '0.96rem', color: 'rgba(244,239,232,0.82)', lineHeight: 1.5, fontFamily: 'var(--font-sans, sans-serif)' }}>{value}</div>
          </div>
        ))}
      </div>
      <SlideNum n={17} />
    </div>
  )
}

// ─── 18 — Closing (CTA untouched) ────────────────────────────────────────────

function SlideClosing() {
  const [ref, inView] = useInView()
  return (
    <div ref={ref} className="slide" style={{ background: '#0e0c0a', display: 'grid', gridTemplateColumns: '1fr 1px 1fr' }}>
      {/* Left — animated */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '8% 7% 8% 8%' }}>
        <div className="anim-fade" style={{ ...fade(inView, 0), fontFamily: 'var(--font-sans, sans-serif)', fontSize: '0.65rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: GOLD, marginBottom: '2.5rem' }}>NUMU</div>
        <div className="anim-fade deck-h2" style={{ ...fade(inView, 0.1), fontSize: '3.5rem', lineHeight: 1.06, marginBottom: '2rem' }}>
          The GCC doesn&apos;t have<br />a bio-composite industry yet.
          <br /><span style={{ color: GOLD }}>We&apos;re building it first.</span>
        </div>
        <p className="anim-fade" style={{ ...fade(inView, 0.22), fontSize: '1.1rem', color: 'rgba(244,239,232,0.75)', lineHeight: 1.65, margin: 0, fontFamily: 'var(--font-sans, sans-serif)' }}>
          First mover. Operational. Regional. Certified within 18 months.
        </p>
      </div>

      <div style={{ background: 'rgba(244,239,232,0.08)', width: '1px' }} />

      {/* Right — CTA, never animated */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '8% 8% 8% 7%', gap: '2.25rem' }}>
        {[
          ['Raise',           '$600,000 · SAFE · AED 2.2M'],
          ['Runway',          '18 months to certification scale'],
          ['Series A target', '$2.5M'],
          ['Next step',       'Schedule a 30-min founder call'],
          ['Contact',         'office@studio-cartier.com'],
          ['',                'numu.bio · Dubai, UAE'],
        ].map(([label, value], i) => (
          <div key={i}>
            {label && <div className="deck-label" style={{ marginBottom: '0.3rem' }}>{label}</div>}
            <div style={{
              fontFamily: 'var(--font-sans, sans-serif)',
              fontSize: label === 'Next step' || label === 'Contact' ? '1.1rem' : label ? '1.05rem' : '0.9rem',
              color: label === 'Next step' ? GOLD : label ? CREAM : 'rgba(244,239,232,0.4)',
              fontWeight: label === 'Raise' ? 500 : 400,
              letterSpacing: label === 'Raise' ? '-0.01em' : 'normal',
            }}>{value}</div>
          </div>
        ))}
      </div>

      <SlideNum n={18} />
    </div>
  )
}

// ─── DeckClient ───────────────────────────────────────────────────────────────

export default function DeckClient({ fontVars }: { fontVars: string }) {
  return (
    <main className={`${fontVars} deck-root`}>
      <section className="deck-screen-frame"><SlideCover /></section>
      <section className="deck-screen-frame"><SlideThesis /></section>
      <section className="deck-screen-frame"><SlideProblem /></section>
      <section className="deck-screen-frame"><SlideMarket /></section>
      <section className="deck-screen-frame"><SlideWhyNow /></section>
      <section className="deck-screen-frame"><SlideTraction /></section>
      <section className="deck-screen-frame"><SlideWhatNumuBuilds /></section>
      <section className="deck-screen-frame"><SlidePlatform /></section>
      <section className="deck-screen-frame"><SlideFourEngines /></section>
      <section className="deck-screen-frame"><SlideCompetitive /></section>
      <section className="deck-screen-frame"><SlideFinancialProjection /></section>
      <section className="deck-screen-frame"><SlideThermalCostCurve /></section>
      <section className="deck-screen-frame"><SlideMoat /></section>
      <section className="deck-screen-frame"><SlideEcosystem /></section>
      <section className="deck-screen-frame"><SlideRoadmap /></section>
      <section className="deck-screen-frame"><SlideTeam /></section>
      <section className="deck-screen-frame"><SlideAsk /></section>
      <section className="deck-screen-frame"><SlideClosing /></section>
    </main>
  )
}
