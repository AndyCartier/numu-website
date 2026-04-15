'use client'

// Visual diagrams for investor mode.
// All data sourced from content/pages/investor.md and content/core/vision.md.

import { useRef, useState, useEffect } from 'react'

const cream   = 'rgba(245,241,232,1)'
const dim     = 'rgba(245,241,232,0.35)'
const soft    = 'rgba(245,241,232,0.12)'
const border  = '1px solid rgba(245,241,232,0.1)'
const borderS = '1px solid rgba(245,241,232,0.06)'

// ─── Shared: scroll visibility hook ───────────────────────────────────────────

function useOnScreen(threshold = 0.25) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, visible] as const
}

// ─── Shared: count-up on scroll ───────────────────────────────────────────────

function useCountUp(target: number, started: boolean, duration = 1200) {
  const [value, setValue] = useState(0)
  const rafRef = useRef<number>()
  const t0 = useRef<number | undefined>()
  useEffect(() => {
    if (!started) return
    t0.current = undefined
    const tick = (ts: number) => {
      if (t0.current === undefined) t0.current = ts
      const p = Math.min((ts - t0.current) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setValue(Math.round(target * eased))
      if (p < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current) }
  }, [started, target, duration])
  return value
}

// ─── Platform Expansion Diagram ───────────────────────────────────────────────

const platformLayers = [
  { index: '01', name: 'Acoustic Panels',      note: 'Entry point — active',  width: '32%',  status: 'active'  },
  { index: '02', name: 'Thermal Insulation',   note: 'Phase 2 — 2026',        width: '54%',  status: 'next'    },
  { index: '03', name: 'Interior Materials',   note: 'Phase 3 — 2026–27',     width: '75%',  status: 'future'  },
  { index: '04', name: 'Construction Systems', note: 'Long-term — 2027+',     width: '100%', status: 'future'  },
]

export function PlatformDiagram() {
  return (
    <div className="mt-16" style={{ borderTop: border }}>
      <p className="font-sans text-label uppercase tracking-[0.18em] mt-10 mb-12" style={{ opacity: 0.35 }}>
        Platform expansion — from entry point to system
      </p>
      <div className="space-y-0">
        {[...platformLayers].reverse().map((layer, i) => {
          const isActive = layer.status === 'active'
          return (
            <div key={layer.index} className="flex items-center gap-6 py-5"
              style={{ borderBottom: i < platformLayers.length - 1 ? borderS : 'none' }}>
              <span className="font-sans text-label uppercase tracking-[0.18em] flex-shrink-0 w-8" style={{ opacity: 0.28 }}>
                {layer.index}
              </span>
              <div className="flex-1">
                <div style={{ width: layer.width, height: '2px', backgroundColor: isActive ? cream : `rgba(245,241,232,${0.18 + (3 - i) * 0.06})`, marginBottom: '10px', transition: 'width 0.6s ease' }} />
                <div className="flex items-baseline gap-4">
                  <p className="font-display text-lg md:text-xl" style={{ opacity: isActive ? 1 : 0.55 }}>{layer.name}</p>
                  <span className="font-sans text-label uppercase tracking-[0.14em]" style={{ opacity: 0.28 }}>{layer.note}</span>
                </div>
              </div>
              {isActive && <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: cream, flexShrink: 0 }} />}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Business Model Diagram ────────────────────────────────────────────────────

export function BusinessModelDiagram() {
  return (
    <div className="mt-16" style={{ borderTop: border }}>
      <div className="grid grid-cols-1 md:grid-cols-2 mt-10" style={{ gap: '1px', backgroundColor: soft }}>
        <div className="p-10 md:p-14" style={{ backgroundColor: '#0e0e0e' }}>
          <p className="font-sans text-label uppercase tracking-[0.18em] mb-8" style={{ opacity: 0.35 }}>Stream 01</p>
          <p className="font-display text-2xl md:text-3xl mb-6">Design Products</p>
          <p className="font-sans text-base leading-[1.75] mb-10" style={{ opacity: 0.55 }}>
            Premium acoustic panels sold directly to architecture and interior design firms. High margin. Immediate market. Brand-establishing.
          </p>
          <div style={{ borderTop: borderS, paddingTop: '24px' }}>
            {['Direct sale', 'High margin', 'Near-term revenue'].map(tag => (
              <div key={tag} className="flex items-center gap-3 mb-3">
                <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: cream, opacity: 0.4 }} />
                <p className="font-sans text-sm" style={{ opacity: 0.5 }}>{tag}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="p-10 md:p-14" style={{ backgroundColor: '#0e0e0e' }}>
          <p className="font-sans text-label uppercase tracking-[0.18em] mb-8" style={{ opacity: 0.35 }}>Stream 02</p>
          <p className="font-display text-2xl md:text-3xl mb-6">Material Licensing</p>
          <p className="font-sans text-base leading-[1.75] mb-10" style={{ opacity: 0.55 }}>
            Licensing the material platform to regional manufacturers. Scalable without proportional capex. Compounds proprietary IP.
          </p>
          <div style={{ borderTop: borderS, paddingTop: '24px' }}>
            {['Platform fee', 'Scalable', 'Long-term compounding'].map(tag => (
              <div key={tag} className="flex items-center gap-3 mb-3">
                <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: cream, opacity: 0.4 }} />
                <p className="font-sans text-sm" style={{ opacity: 0.5 }}>{tag}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-8 flex items-center gap-4" style={{ opacity: 0.3 }}>
        <div style={{ flex: 1, height: '1px', backgroundColor: cream }} />
        <p className="font-sans text-label uppercase tracking-[0.16em] flex-shrink-0">Products establish brand → licensing scales margin</p>
        <div style={{ flex: 1, height: '1px', backgroundColor: cream }} />
      </div>
    </div>
  )
}

// ─── FIX 6: Market — Animated Concentric Circles ──────────────────────────────

const marketTiers = [
  { r: 138, size: '$1T+',    name: 'Global Construction Materials', detail: 'Outer market — proven technology, global deployment',    strokeOp: 0.28, fillOp: 0.04, delay: 0      },
  { r: 92,  size: '$4.5B',   name: 'Interior Acoustic Panels',      detail: "NUMU's entry category — premium specification",          strokeOp: 0.55, fillOp: 0.10, delay: 380    },
  { r: 48,  size: '$50–80M', name: 'UAE Beachhead',                  detail: 'Addressable now — 100% import dependency in the GCC',   strokeOp: 1,    fillOp: 0.22, delay: 760    },
]

export function MarketDiagram() {
  const [ref, visible] = useOnScreen(0.2)
  const cx = 148, cy = 148, size = 296

  return (
    <div ref={ref} className="mt-16" style={{ borderTop: border }}>
      <p className="font-sans text-label uppercase tracking-[0.18em] mt-10 mb-12" style={{ opacity: 0.35 }}>
        Market sizing — nested opportunity
      </p>
      <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">

        {/* SVG concentric circles */}
        <div style={{ flexShrink: 0 }}>
          <svg viewBox={`0 0 ${size} ${size}`} style={{ width: '100%', maxWidth: `${size}px`, display: 'block' }}>
            {/* Fills — back to front */}
            {[...marketTiers].reverse().map(t => (
              <circle key={`fill-${t.r}`} cx={cx} cy={cy} r={t.r}
                fill={`rgba(245,241,232,${t.fillOp})`} />
            ))}
            {/* Animated strokes */}
            {marketTiers.map(t => {
              const c = 2 * Math.PI * t.r
              return (
                <circle
                  key={`stroke-${t.r}`}
                  cx={cx} cy={cy} r={t.r}
                  fill="none"
                  stroke={`rgba(245,241,232,${t.strokeOp})`}
                  strokeWidth={1.5}
                  strokeDasharray={visible ? `${c} 0` : `0 ${c}`}
                  transform={`rotate(-90 ${cx} ${cy})`}
                  style={{ transition: `stroke-dasharray 1.2s ${t.delay}ms ease-out` }}
                />
              )
            })}
            {/* Center dot */}
            <circle cx={cx} cy={cy} r={4} fill={cream} opacity={visible ? 0.7 : 0}
              style={{ transition: 'opacity 0.4s 1.2s' }} />
          </svg>
        </div>

        {/* Labels */}
        <div className="flex-1 w-full">
          {marketTiers.map((t, i) => (
            <div
              key={t.name}
              className="py-6"
              style={{
                borderBottom: i < marketTiers.length - 1 ? borderS : 'none',
                opacity: visible ? 1 : 0,
                transform: visible ? 'none' : 'translateX(20px)',
                transition: `opacity 0.6s ${t.delay + 900}ms ease, transform 0.6s ${t.delay + 900}ms ease`,
              }}
            >
              <p className="font-display" style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', letterSpacing: '-0.03em', lineHeight: 1, opacity: t.strokeOp }}>
                {t.size}
              </p>
              <p className="font-display text-lg mt-2" style={{ opacity: t.strokeOp * 0.85 }}>{t.name}</p>
              <p className="font-sans text-sm mt-1" style={{ opacity: 0.35 }}>{t.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── FIX 8: Unit Economics Bars ────────────────────────────────────────────────

export function UnitEconomicsBars() {
  const [ref, visible] = useOnScreen()
  const cost  = useCountUp(120, visible)
  const price = useCountUp(300, visible, 1400)
  const margin = useCountUp(60, visible, 1600)

  const bars = [
    { label: 'Production Cost', value: cost,  unit: '/m²', suffix: '', widthPct: 40,  color: dim,   delay: '0s'    },
    { label: 'Selling Price',   value: price, unit: '/m²', suffix: '', widthPct: 100, color: cream, delay: '0.25s' },
  ]

  return (
    <div ref={ref} className="mt-16 pt-12" style={{ borderTop: border }}>
      <p className="font-sans text-label uppercase tracking-[0.18em] mb-10" style={{ opacity: 0.35 }}>
        Unit economics — per m²
      </p>
      <div className="space-y-8 max-w-xl">
        {bars.map(bar => (
          <div key={bar.label}>
            <div className="flex items-baseline justify-between mb-3">
              <p className="font-sans text-sm uppercase tracking-[0.12em]" style={{ opacity: 0.45 }}>{bar.label}</p>
              <p className="font-display text-2xl" style={{ opacity: 0.9 }}>
                ${bar.value}<span className="text-base">{bar.unit}</span>
              </p>
            </div>
            <div style={{ height: '2px', backgroundColor: soft, borderRadius: '1px' }}>
              <div style={{
                height: '100%',
                width: visible ? `${bar.widthPct}%` : '0%',
                backgroundColor: bar.color,
                borderRadius: '1px',
                transition: `width 0.9s ${bar.delay} cubic-bezier(0.4,0,0.2,1)`,
              }} />
            </div>
          </div>
        ))}
      </div>

      {/* Margin callout */}
      <div className="mt-8 flex items-center gap-3 max-w-xl" style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.6s 1.2s' }}>
        <div style={{ flex: 1, height: '1px', backgroundColor: soft }} />
        <p className="font-sans text-sm uppercase tracking-[0.14em] flex-shrink-0" style={{ opacity: 0.55 }}>
          ~{margin}% Gross Margin
        </p>
        <div style={{ flex: 1, height: '1px', backgroundColor: soft }} />
      </div>

      {/* Capacity pills */}
      <div className="mt-10 flex items-center gap-4 flex-wrap"
        style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.5s 1.5s' }}>
        {[
          { label: 'Today', value: '30 m²/mo' },
          { label: 'Target', value: '600 m²/mo' },
        ].map((pill, i) => (
          <div key={pill.label} className="flex items-center gap-4">
            {i > 0 && <span style={{ opacity: 0.3 }}>→</span>}
            <div style={{ border: borderS, padding: '8px 16px', borderRadius: '2px' }}>
              <p className="font-sans text-label uppercase tracking-[0.14em] mb-1" style={{ opacity: 0.35 }}>{pill.label}</p>
              <p className="font-display text-lg">{pill.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── FIX 9: Use of Funds Donut Chart ──────────────────────────────────────────

const donutSegments = [
  { label: 'Production Space', pct: 30,   amount: '$180K', opacity: 0.95  },
  { label: 'Team',             pct: 25.5,  amount: '$153K', opacity: 0.75  },
  { label: 'Machinery',        pct: 24.8,  amount: '$149K', opacity: 0.55  },
  { label: 'Certifications & IP', pct: 11.7, amount: '$70K',  opacity: 0.35  },
  { label: 'Sales & Buffer',   pct: 8,     amount: '$48K',  opacity: 0.20  },
]

export function FundingDonut() {
  const [ref, visible] = useOnScreen(0.2)
  const totalK = useCountUp(600, visible, 1400)

  // Donut geometry — thick stroke circles
  const cx = 130, cy = 130, svgSize = 260
  const r = 98             // mid-radius of the donut ring
  const strokeW = 44       // ring thickness
  const circ = 2 * Math.PI * r  // ≈ 615.7

  let cumulativeOffset = 0

  return (
    <div ref={ref} className="mt-16 pt-12" style={{ borderTop: border }}>
      <p className="font-sans text-label uppercase tracking-[0.18em] mb-10" style={{ opacity: 0.35 }}>
        Use of funds — $600K raise
      </p>
      <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">

        {/* Donut SVG */}
        <div style={{ flexShrink: 0, position: 'relative' }}>
          <svg viewBox={`0 0 ${svgSize} ${svgSize}`}
            style={{ width: '100%', maxWidth: `${svgSize}px`, display: 'block' }}>
            {donutSegments.map((seg, i) => {
              const segLen = circ * (seg.pct / 100)
              const offset = cumulativeOffset
              cumulativeOffset += segLen
              // Small gap between segments: reduce each segment by 3px
              const gappedLen = Math.max(segLen - 3, 0)
              return (
                <circle
                  key={seg.label}
                  cx={cx} cy={cy} r={r}
                  fill="none"
                  stroke={`rgba(245,241,232,${seg.opacity})`}
                  strokeWidth={strokeW}
                  strokeDasharray={visible ? `${gappedLen} ${circ - gappedLen}` : `0 ${circ}`}
                  strokeDashoffset={-offset}
                  transform={`rotate(-90 ${cx} ${cy})`}
                  style={{ transition: `stroke-dasharray 0.8s ${i * 0.18}s ease-out` }}
                />
              )
            })}
            {/* Center label */}
            <text x={cx} y={cy - 8} textAnchor="middle" fontFamily="var(--font-display)"
              fontSize="28" fill={cream} opacity={visible ? 0.95 : 0}
              style={{ transition: 'opacity 0.5s 1s', letterSpacing: '-1px' }}>
              ${totalK}K
            </text>
            <text x={cx} y={cy + 14} textAnchor="middle" fontFamily="var(--font-sans)"
              fontSize="9" fill={cream} opacity={visible ? 0.35 : 0}
              style={{ transition: 'opacity 0.5s 1.2s', letterSpacing: '1.5px' }}>
              18-MONTH RUNWAY
            </text>
          </svg>
        </div>

        {/* Legend */}
        <div className="w-full">
          {donutSegments.map((seg, i) => (
            <div
              key={seg.label}
              className="flex items-center justify-between py-3"
              style={{
                borderBottom: i < donutSegments.length - 1 ? borderS : 'none',
                opacity: visible ? 1 : 0,
                transition: `opacity 0.5s ${i * 0.12 + 0.4}s`,
              }}
            >
              <div className="flex items-center gap-3">
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: `rgba(245,241,232,${seg.opacity})`, flexShrink: 0 }} />
                <p className="font-sans text-sm" style={{ opacity: 0.65 }}>{seg.label}</p>
              </div>
              <div className="text-right">
                <p className="font-display text-base">{seg.pct}%</p>
                <p className="font-sans text-xs" style={{ opacity: 0.35 }}>{seg.amount}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── FIX 10: Roadmap Timeline — horizontal nodes ───────────────────────────────

type RoadmapPhase = {
  year: string
  label: string
  items: string[]
}

export function RoadmapDiagram({ phases }: { phases: RoadmapPhase[] }) {
  const [ref, visible] = useOnScreen(0.15)

  return (
    <div ref={ref} className="mt-16">

      {/* ── Desktop: horizontal timeline ───────────────────────────────────── */}
      <div className="hidden md:block">
        {/* Track + nodes */}
        <div className="flex items-center relative mb-10">
          {phases.map((phase, i) => (
            <div key={phase.year} className="flex items-center flex-1 last:flex-none">
              {/* Node */}
              <div style={{
                width: '12px', height: '12px', borderRadius: '50%', flexShrink: 0, zIndex: 1,
                backgroundColor: i === 0 ? cream : 'transparent',
                border: `1.5px solid rgba(245,241,232,${i === 0 ? 1 : 0.35})`,
                boxShadow: i === 0 ? `0 0 0 4px rgba(245,241,232,0.08)` : 'none',
                transition: `all 0.3s ${i * 0.3}s`,
              }} />
              {/* Connector track */}
              {i < phases.length - 1 && (
                <div style={{ flex: 1, height: '1px', position: 'relative', backgroundColor: soft, margin: '0 2px' }}>
                  {/* Animated fill */}
                  <div style={{
                    position: 'absolute', top: 0, left: 0, height: '100%',
                    width: visible ? '100%' : '0%',
                    backgroundColor: `rgba(245,241,232,0.3)`,
                    transition: `width 0.8s ${i * 0.3 + 0.2}s ease-out`,
                  }} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Year labels + content cards */}
        <div className="grid grid-cols-3" style={{ gap: '1px', backgroundColor: soft }}>
          {phases.map((phase, i) => (
            <div key={phase.year} className="p-10"
              style={{
                backgroundColor: '#0e0e0e',
                opacity: visible ? (i === 0 ? 1 : 0.6) : 0,
                transition: `opacity 0.5s ${i * 0.2 + 0.3}s`,
              }}>
              <p className="font-sans text-label uppercase tracking-[0.16em] mb-2" style={{ opacity: 0.35 }}>
                {phase.year}
              </p>
              <p className="font-display text-2xl md:text-3xl mb-8"
                style={{ letterSpacing: '-0.025em', opacity: i === 0 ? 1 : 0.45 }}>
                {phase.label}
              </p>
              <div>
                {phase.items.map((item, j) => (
                  <div key={j} className="flex items-start gap-4 py-3.5"
                    style={{ borderBottom: j < phase.items.length - 1 ? borderS : 'none' }}>
                    <span style={{ opacity: 0.25, flexShrink: 0, marginTop: '3px' }}>—</span>
                    <p className="font-sans text-base leading-snug" style={{ opacity: 0.75 }}>{item}</p>
                  </div>
                ))}
              </div>
              {i === 0 && (
                <div className="mt-8 pt-5" style={{ borderTop: borderS }}>
                  <div className="flex items-center gap-2">
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: cream, animation: 'process-pulse 2s ease-out infinite' }} />
                    <p className="font-sans text-label uppercase tracking-[0.16em]" style={{ opacity: 0.45 }}>In progress</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Mobile: vertical timeline ──────────────────────────────────────── */}
      <div className="md:hidden flex flex-col" style={{ borderLeft: '1px solid rgba(245,241,232,0.18)', paddingLeft: '24px' }}>
        {phases.map((phase, i) => (
          <div key={phase.year} className="relative mb-10 last:mb-0">
            {/* Node on the track */}
            <div style={{
              position: 'absolute', left: '-31px', top: '4px',
              width: '12px', height: '12px', borderRadius: '50%',
              backgroundColor: i === 0 ? cream : 'transparent',
              border: `1.5px solid rgba(245,241,232,${i === 0 ? 1 : 0.35})`,
            }} />
            <p className="font-sans text-label uppercase tracking-[0.16em] mb-1" style={{ opacity: 0.35 }}>{phase.year}</p>
            <p className="font-display text-2xl mb-5" style={{ opacity: i === 0 ? 1 : 0.55, letterSpacing: '-0.02em' }}>{phase.label}</p>
            <div>
              {phase.items.map((item, j) => (
                <p key={j} className="font-sans text-base leading-snug mb-2" style={{ opacity: 0.65 }}>— {item}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
