'use client'

import { useState, useEffect, useRef } from 'react'

// ─── Layout constants ────────────────────────────────────────────────────────
const CX  = 500
const CY  = 400
const RR  = 220
const NR  = 30    // base node radius
const LR  = 330   // label radius
const ISZ = 26    // icon viewport size

const ORBIT_PERIOD = 18000   // ms — smooth, not too slow
const ACT_RANGE    = 28      // degrees either side of step angle to trigger highlight

// ─── Steps ───────────────────────────────────────────────────────────────────
const STEPS = [
  {
    angle: -90,
    label: 'Agricultural Input',
    sub: 'Fibers & regional crops',
    icon: (
      // Date palm / stalk with radiating fronds
      <>
        <line x1="12" y1="22" x2="12" y2="4" strokeWidth={1.5} />
        <path d="M12 17 C10 15.5 7.5 14.5 5 12" strokeWidth={1.1} />
        <path d="M12 13.5 C10 12 7.5 10 6 7.5" strokeWidth={1.1} />
        <path d="M12 10 C10.5 8.5 9 7 7.5 5.5" strokeWidth={1.1} />
        <path d="M12 17 C14 15.5 16.5 14.5 19 12" strokeWidth={1.1} />
        <path d="M12 13.5 C14 12 16.5 10 18 7.5" strokeWidth={1.1} />
        <path d="M12 10 C13.5 8.5 15 7 16.5 5.5" strokeWidth={1.1} />
        <path d="M11 4 C10 3.2 9.5 2.2 11 1.5" strokeWidth={0.9} />
        <path d="M13 4 C14 3.2 14.5 2.2 13 1.5" strokeWidth={0.9} />
        <line x1="8" y1="22" x2="16" y2="22" strokeWidth={0.9} strokeOpacity={0.4} />
        <line x1="6" y1="22.5" x2="18" y2="22.5" strokeWidth={0.5} strokeOpacity={0.2} />
      </>
    ),
  },
  {
    angle: -30,
    label: 'Fiber Preparation',
    sub: 'Processing & sorting',
    icon: (
      // Parallel fibers being carded / separated
      <>
        <rect x="3" y="4.5" width="18" height="2" rx="0.4" strokeWidth={1.5} />
        {[5.5, 8.5, 11.5, 14.5, 17.5].map((x, i) => (
          <line key={i} x1={x} y1="6.5" x2={x} y2="9" strokeWidth={1.1} />
        ))}
        <line x1="4" y1="11" x2="20" y2="11" strokeWidth={1} />
        <line x1="4" y1="13.5" x2="20" y2="13.5" strokeWidth={1} />
        <line x1="4" y1="16" x2="18" y2="16" strokeWidth={1} strokeOpacity={0.65} />
        <line x1="4" y1="18.5" x2="16" y2="18.5" strokeWidth={1} strokeOpacity={0.35} />
        <path d="M18 17 L21 18.5 L18 20" strokeWidth={1.2} strokeLinejoin="round" />
      </>
    ),
  },
  {
    angle: 30,
    label: 'Mycelium Growth',
    sub: 'Inoculation & bonding',
    icon: (
      // Radial hyphal network with branching
      <>
        <circle cx="12" cy="12" r="1.8" strokeWidth={1.5} />
        {/* 8 main hyphae with side branches */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => {
          const r = (a * Math.PI) / 180
          const ex = +(12 + 7.5 * Math.cos(r)).toFixed(2)
          const ey = +(12 + 7.5 * Math.sin(r)).toFixed(2)
          const mx = +(12 + 4.5 * Math.cos(r)).toFixed(2)
          const my = +(12 + 4.5 * Math.sin(r)).toFixed(2)
          const perp = r + Math.PI / 2
          const b1x = +(mx + 2 * Math.cos(perp)).toFixed(2)
          const b1y = +(my + 2 * Math.sin(perp)).toFixed(2)
          const b2x = +(mx - 2 * Math.cos(perp)).toFixed(2)
          const b2y = +(my - 2 * Math.sin(perp)).toFixed(2)
          return (
            <g key={i}>
              <line x1="12" y1="12" x2={ex} y2={ey} strokeWidth={i % 2 === 0 ? 1.1 : 0.9} />
              <line x1={mx} y1={my} x2={b1x} y2={b1y} strokeWidth={0.75} />
              <line x1={mx} y1={my} x2={b2x} y2={b2y} strokeWidth={0.75} />
              <circle cx={ex} cy={ey} r="0.9" strokeWidth={1} />
            </g>
          )
        })}
      </>
    ),
  },
  {
    angle: 90,
    label: 'Shaping & Forming',
    sub: 'Moulding to specification',
    icon: (
      // Mold cavity with panel + compression arrows
      <>
        <rect x="2.5" y="7.5" width="19" height="11" rx="1" strokeWidth={1.5} />
        <rect x="5.5" y="10.5" width="13" height="5" rx="0.4" strokeWidth={1} strokeOpacity={0.7} />
        {/* Texture relief lines */}
        <line x1="7.5" y1="12" x2="7.5" y2="14.5" strokeWidth={0.7} strokeOpacity={0.45} />
        <line x1="10.5" y1="12" x2="10.5" y2="14.5" strokeWidth={0.7} strokeOpacity={0.45} />
        <line x1="13.5" y1="12" x2="13.5" y2="14.5" strokeWidth={0.7} strokeOpacity={0.45} />
        <line x1="16.5" y1="12" x2="16.5" y2="14.5" strokeWidth={0.7} strokeOpacity={0.45} />
        {/* Press arrow down */}
        <line x1="12" y1="1.5" x2="12" y2="6" strokeWidth={1.3} />
        <path d="M9.5 4.5 L12 7 L14.5 4.5" strokeWidth={1.3} strokeLinejoin="round" />
      </>
    ),
  },
  {
    angle: 150,
    label: 'Installation',
    sub: 'Built environment',
    icon: (
      // Wall of acoustic panels in a grid
      <>
        {/* Wall backing */}
        <line x1="2" y1="21" x2="22" y2="21" strokeWidth={1} strokeOpacity={0.3} />
        {/* 2-column × 3-row panel grid */}
        {([
          [3, 3], [13, 3],
          [3, 9], [13, 9],
          [3, 15], [13, 15],
        ] as [number, number][]).map(([px, py], i) => (
          <rect key={i} x={px} y={py} width="8" height="5.5" rx="0.4" strokeWidth={1.3} />
        ))}
        {/* Centre gap */}
        <line x1="11.5" y1="3" x2="11.5" y2="20.5" strokeWidth={0.4} strokeOpacity={0.15} />
        {/* Mounting dot on top panel */}
        <circle cx="7" cy="3" r="0.7" strokeWidth={0.8} strokeOpacity={0.5} />
        <circle cx="17" cy="3" r="0.7" strokeWidth={0.8} strokeOpacity={0.5} />
      </>
    ),
  },
  {
    angle: 210,
    label: 'Degradation & Return',
    sub: 'Back to soil',
    icon: (
      // Leaf decomposing with circular arrows + roots
      <>
        <path
          d="M5 5.5 A8 8 0 1 1 4 15"
          strokeWidth={1.4} fill="none"
        />
        <polyline points="2.5 12 4 15.5 7.5 14" strokeWidth={1.4} strokeLinejoin="round" />
        {/* Organic leaf form */}
        <path d="M12 8 C9.5 6 7 9 9.5 12.5 C10.5 14 12 14.5 12 14.5 C12 14.5 13.5 14 14.5 12.5 C17 9 14.5 6 12 8Z" strokeWidth={1.2} />
        <line x1="12" y1="8.5" x2="12" y2="14" strokeWidth={0.8} strokeOpacity={0.55} />
        {/* Soil horizon */}
        <line x1="7" y1="20" x2="17" y2="20" strokeWidth={1.1} strokeOpacity={0.55} />
        {/* Roots */}
        <path d="M10 20 C10 21 8.5 21.5 8 22" strokeWidth={0.9} strokeOpacity={0.35} />
        <line x1="12" y1="20" x2="12" y2="22.5" strokeWidth={0.9} strokeOpacity={0.35} />
        <path d="M14 20 C14 21 15.5 21.5 16 22" strokeWidth={0.9} strokeOpacity={0.35} />
      </>
    ),
  },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────
const DEG = (d: number) => (d * Math.PI) / 180
const XY  = (r: number, d: number) => ({
  x: +(CX + r * Math.cos(DEG(d))).toFixed(2),
  y: +(CY + r * Math.sin(DEG(d))).toFixed(2),
})
const TA = (d: number): 'start' | 'middle' | 'end' => {
  const nx = CX + RR * Math.cos(DEG(d))
  return nx > CX + 20 ? 'start' : nx < CX - 20 ? 'end' : 'middle'
}

const ARC_S = XY(RR, -70)
const ARC_E = XY(RR, -52)

export default function ProcessDiagram() {
  const [activeStep, setActiveStep] = useState(-1)
  const dotRef = useRef<SVGGElement>(null)
  const rafRef = useRef<number>(0)
  const startRef = useRef<number | null>(null)
  const lastStepRef = useRef(-1)

  useEffect(() => {
    const tick = (ts: number) => {
      if (!startRef.current) startRef.current = ts
      const elapsed = ts - startRef.current
      const frac = (elapsed % ORBIT_PERIOD) / ORBIT_PERIOD
      // Start at angle -90° (top), go clockwise
      const angleDeg = frac * 360 - 90
      const angleRad = DEG(angleDeg)

      // GPU-accelerated: CSS transform instead of SVG attribute
      if (dotRef.current) {
        const tx = RR * Math.cos(angleRad)
        const ty = RR * (1 + Math.sin(angleRad))
        dotRef.current.style.transform = `translate(${tx.toFixed(3)}px, ${ty.toFixed(3)}px)`
      }

      // Determine active step (max 6 React state updates per orbit — cheap)
      const norm = ((angleDeg % 360) + 360) % 360
      let nearest = -1
      let minDist = ACT_RANGE
      STEPS.forEach((step, i) => {
        const sn = ((step.angle % 360) + 360) % 360
        let dist = Math.abs(norm - sn)
        if (dist > 180) dist = 360 - dist
        if (dist < minDist) { minDist = dist; nearest = i }
      })
      if (nearest !== lastStepRef.current) {
        lastStepRef.current = nearest
        setActiveStep(nearest)
      }

      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <div className="w-full select-none">
      <svg
        viewBox="0 0 1000 810"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: 'auto', display: 'block' }}
        role="img"
        aria-label="NUMU material lifecycle diagram"
      >
        <defs>
          <marker
            id="pd-tip"
            viewBox="0 0 9 9"
            refX="7" refY="4.5"
            markerWidth="5.5" markerHeight="5.5"
            orient="auto"
          >
            <path
              d="M 0 1.5 L 7 4.5 L 0 7.5"
              fill="none" stroke="#1a1714" strokeOpacity="0.4"
              strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round"
            />
          </marker>
        </defs>

        {/* Outer ring */}
        <circle cx={CX} cy={CY} r={RR} fill="#1a1714" fillOpacity={0.016} stroke="#1a1714" strokeWidth={1} strokeOpacity={0.16} />

        {/* Inner dashed ring */}
        <circle cx={CX} cy={CY} r={RR * 0.38} stroke="#1a1714" strokeWidth={0.5} strokeOpacity={0.08} strokeDasharray="3 6" />

        {/* Clockwise direction indicator */}
        <path
          d={`M ${ARC_S.x},${ARC_S.y} A ${RR},${RR} 0 0,1 ${ARC_E.x},${ARC_E.y}`}
          stroke="#1a1714" strokeWidth={1.4} strokeOpacity={0.25}
          markerEnd="url(#pd-tip)"
        />

        {/* Steps */}
        {STEPS.map(({ angle, label, sub, icon }, i) => {
          const n  = XY(RR, angle)
          const l  = XY(LR, angle)
          const ta = TA(angle)
          const top = angle === -90
          const bot = angle === 90
          const isActive = i === activeStep

          const numY  = top ? l.y - 24 : bot ? l.y - 4  : l.y - 20
          const mainY = top ? l.y - 10 : bot ? l.y + 12 : l.y - 6
          const subY  = top ? l.y + 8  : bot ? l.y + 26 : l.y + 10

          const lineStart = XY(RR + NR + 4, angle)
          const lineEnd   = XY(LR - 18, angle)

          // Node scale + fill — CSS transition on SVG transform
          const nodeNR  = isActive ? NR * 1.3  : NR
          const nodeFO  = isActive ? 0.14 : 0.04
          const nodeSO  = isActive ? 0.55 : 0.2
          const nodeSW  = isActive ? 1.2  : 0.8
          const iconO   = isActive ? 0.9  : 0.52
          const labelO  = isActive ? 0.9  : 0.65
          const subO    = isActive ? 0.48 : 0.28
          const numO    = isActive ? 0.45 : 0.22

          const transition = 'all 0.45s cubic-bezier(0.25, 0, 0.2, 1)'

          return (
            <g key={i}>
              {/* Pulse rings on active */}
              {isActive && (
                <>
                  {[0, 1].map(j => (
                    <circle
                      key={j}
                      cx={n.x} cy={n.y} r={nodeNR + 14}
                      fill="none"
                      stroke="#1a1714"
                      strokeWidth={0.7}
                      style={{
                        transformOrigin: `${n.x}px ${n.y}px`,
                        animation: `numuPulse 2.8s ease-in-out ${j * 1.4}s infinite`,
                      }}
                    />
                  ))}
                </>
              )}

              {/* Node circle */}
              <circle
                cx={n.x} cy={n.y} r={nodeNR}
                fill="#1a1714" fillOpacity={nodeFO}
                stroke="#1a1714" strokeWidth={nodeSW} strokeOpacity={nodeSO}
                style={{ transition }}
              />

              {/* Icon */}
              <svg
                x={n.x - ISZ / 2} y={n.y - ISZ / 2}
                width={isActive ? ISZ * 1.22 : ISZ}
                height={isActive ? ISZ * 1.22 : ISZ}
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1a1714"
                strokeOpacity={iconO}
                strokeWidth={1.4}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  x: `${n.x - (isActive ? ISZ * 1.22 : ISZ) / 2}`,
                  y: `${n.y - (isActive ? ISZ * 1.22 : ISZ) / 2}`,
                  transition,
                }}
              >
                {icon}
              </svg>

              {/* Leader line */}
              <line
                x1={lineStart.x} y1={lineStart.y}
                x2={lineEnd.x} y2={lineEnd.y}
                stroke="#1a1714" strokeWidth={0.4} strokeOpacity={isActive ? 0.28 : 0.14}
                style={{ transition }}
              />

              {/* Step number */}
              <text
                x={l.x} y={numY}
                textAnchor={ta}
                fontFamily="'Inter', 'Helvetica Neue', Arial, sans-serif"
                fontSize={10}
                fill="#1a1714"
                fillOpacity={numO}
                letterSpacing={1.5}
                style={{ transition }}
              >
                {String(i + 1).padStart(2, '0')}
              </text>

              {/* Main label */}
              <text
                x={l.x} y={mainY}
                textAnchor={ta}
                fontFamily="'Inter', 'Helvetica Neue', Arial, sans-serif"
                fontSize={isActive ? 15.5 : 13.5}
                fontWeight={isActive ? 600 : 500}
                fill="#1a1714"
                fillOpacity={labelO}
                letterSpacing={0.3}
                style={{ transition }}
              >
                {label}
              </text>

              {/* Sub label */}
              <text
                x={l.x} y={subY}
                textAnchor={ta}
                fontFamily="'Inter', 'Helvetica Neue', Arial, sans-serif"
                fontSize={11}
                fill="#1a1714"
                fillOpacity={subO}
                letterSpacing={0.2}
                style={{ transition }}
              >
                {sub}
              </text>
            </g>
          )
        })}

        {/* Centre wordmark */}
        <text x={CX} y={CY - 12} textAnchor="middle" fontFamily="'Playfair Display', Georgia, serif" fontSize={30} fontWeight={700} fill="#1a1714" fillOpacity={0.09} letterSpacing={5}>NUMU</text>
        <text x={CX} y={CY + 13} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={11} fill="#1a1714" fillOpacity={0.22} letterSpacing={3.5}>MATERIAL CYCLE</text>

        {/* Orbiting dot — GPU-composited via CSS transform */}
        <g ref={dotRef} style={{ willChange: 'transform' }}>
          <circle cx={CX} cy={CY - RR} r={4.5} fill="#1a1714" fillOpacity={0.6} />
          <circle cx={CX} cy={CY - RR} r={8} fill="#1a1714" fillOpacity={0.06} />
        </g>

        <style>{`
          @keyframes numuPulse {
            0%, 100% { opacity: 0.22; transform: scale(1); }
            60%       { opacity: 0; transform: scale(1.6); }
          }
        `}</style>
      </svg>
    </div>
  )
}
