'use client'

// ─── Step definitions ─────────────────────────────────────────────────────────

const STEPS = [
  {
    index: '01',
    title: 'Agricultural inputs',
    sub: 'Crops, waste fibres, regional by-products',
    angle: -90, // top
  },
  {
    index: '02',
    title: 'Substrate preparation',
    sub: 'Fibres processed and sterilised',
    angle: -38,
  },
  {
    index: '03',
    title: 'Mycelium growth',
    sub: 'Biological binding phase',
    angle: 14,
  },
  {
    index: '04',
    title: 'Forming & shaping',
    sub: 'Panels and products take shape',
    angle: 66,
  },
  {
    index: '05',
    title: 'Use phase',
    sub: 'Installed in buildings and interiors',
    angle: 118,
  },
  {
    index: '06',
    title: 'End of life',
    sub: 'Biodegradation and compost',
    angle: 170,
  },
  {
    index: '07',
    title: 'Back to soil',
    sub: 'Nutrients return to agricultural land',
    angle: 222,
  },
]

// Convert polar → cartesian
function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  }
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function ProcessDiagram() {
  const cx = 300
  const cy = 300
  const ringR = 180      // radius of the orbit ring
  const nodeR = 6        // dot radius
  const labelR = 228     // radius where labels sit

  // Build the circular path string for the animated dot
  const circlePathD = `M ${cx} ${cy - ringR} A ${ringR} ${ringR} 0 1 1 ${cx - 0.001} ${cy - ringR}`

  return (
    <div>
      {/* Section heading */}
      <div className="mb-16">
        <h3
          className="font-display mb-3"
          style={{
            fontSize: 'clamp(1.75rem, 3.5vw, 3rem)',
            lineHeight: '1.05',
            letterSpacing: '-0.03em',
          }}
        >
          From growth to regeneration
        </h3>
        <p className="font-sans" style={{ fontSize: '0.9375rem', opacity: 0.42, lineHeight: 1.6 }}>
          A material system designed as a continuous biological loop.
        </p>
      </div>

      {/* Circular diagram */}
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">

        {/* SVG ring */}
        <div className="flex-shrink-0 w-full lg:w-auto" style={{ maxWidth: 420 }}>
          <svg
            viewBox="0 0 600 600"
            width="100%"
            style={{ overflow: 'hidden', display: 'block' }}
            aria-label="NUMU circular material process"
          >
            {/* ── Outer orbit ring ── */}
            <circle
              cx={cx} cy={cy} r={ringR}
              fill="none"
              stroke="rgba(244,239,232,0.08)"
              strokeWidth="1"
            />

            {/* ── Inner decorative ring ── */}
            <circle
              cx={cx} cy={cy} r={ringR * 0.52}
              fill="none"
              stroke="rgba(244,239,232,0.04)"
              strokeWidth="1"
            />

            {/* ── Connector spokes (faint radial lines) ── */}
            {STEPS.map(step => {
              const outer = polar(cx, cy, ringR - nodeR - 1, step.angle)
              const inner = polar(cx, cy, ringR * 0.52 + 2, step.angle)
              return (
                <line
                  key={step.index}
                  x1={inner.x} y1={inner.y}
                  x2={outer.x} y2={outer.y}
                  stroke="rgba(244,239,232,0.06)"
                  strokeWidth="1"
                />
              )
            })}

            {/* ── Return arrow arc from step 07 back to step 01 ── */}
            {(() => {
              const from = polar(cx, cy, ringR, 222)
              const to   = polar(cx, cy, ringR, 270) // top = -90 = 270
              // small arc from 222→270 (short arc, sweep=1)
              return (
                <path
                  d={`M ${from.x} ${from.y} A ${ringR} ${ringR} 0 0 1 ${to.x} ${to.y}`}
                  fill="none"
                  stroke="rgba(178,155,127,0.22)"
                  strokeWidth="1"
                  strokeDasharray="3 5"
                />
              )
            })()}

            {/* ── Animated travelling dot ── */}
            <path
              id="orbitPath"
              d={circlePathD}
              fill="none"
              stroke="none"
            />
            <circle r="3" fill="rgba(178,155,127,0.7)">
              <animateMotion
                dur="18s"
                repeatCount="indefinite"
                rotate="none"
              >
                <mpath href="#orbitPath" />
              </animateMotion>
            </circle>

            {/* ── Soft glow following the dot ── */}
            <circle r="10" fill="none">
              <animateMotion
                dur="18s"
                repeatCount="indefinite"
                rotate="none"
              >
                <mpath href="#orbitPath" />
              </animateMotion>
              <animate
                attributeName="opacity"
                values="0.15;0.35;0.15"
                dur="3s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="r"
                values="8;14;8"
                dur="3s"
                repeatCount="indefinite"
              />
            </circle>

            {/* ── Step nodes ── */}
            {STEPS.map((step, i) => {
              const pos = polar(cx, cy, ringR, step.angle)
              const isLast = i === STEPS.length - 1
              return (
                <g key={step.index}>
                  {/* Outer ring on node */}
                  <circle
                    cx={pos.x} cy={pos.y} r={nodeR + 5}
                    fill="none"
                    stroke={isLast ? 'rgba(178,155,127,0.18)' : 'rgba(244,239,232,0.06)'}
                    strokeWidth="1"
                  />
                  {/* Node dot */}
                  <circle
                    cx={pos.x} cy={pos.y} r={nodeR}
                    fill={i === 0 ? 'rgba(178,155,127,0.9)' : 'rgba(244,239,232,0.18)'}
                    stroke={i === 0 ? 'rgba(178,155,127,0.5)' : 'rgba(244,239,232,0.12)'}
                    strokeWidth="1"
                  />
                  {/* Step index */}
                  <text
                    x={pos.x} y={pos.y - nodeR - 10}
                    textAnchor="middle"
                    fill="rgba(244,239,232,0.22)"
                    style={{ fontFamily: 'var(--font-sans, Inter, sans-serif)', fontSize: '8px', letterSpacing: '0.15em' }}
                  >
                    {step.index}
                  </text>
                </g>
              )
            })}

            {/* ── Centre label ── */}
            <text
              x={cx} y={cy - 10}
              textAnchor="middle"
              fill="rgba(244,239,232,0.18)"
              style={{ fontFamily: 'var(--font-display, Playfair Display, serif)', fontSize: '13px', letterSpacing: '0.06em' }}
            >
              NUMU
            </text>
            <text
              x={cx} y={cy + 10}
              textAnchor="middle"
              fill="rgba(244,239,232,0.10)"
              style={{ fontFamily: 'var(--font-sans, Inter, sans-serif)', fontSize: '9px', letterSpacing: '0.18em' }}
            >
              MATERIAL LOOP
            </text>
          </svg>
        </div>

        {/* ── Step list ── */}
        <div className="flex-1 flex flex-col gap-0">
          {STEPS.map((step, i) => (
            <div
              key={step.index}
              className="flex gap-5 items-start py-5"
              style={{
                borderTop: '1px solid rgba(128,128,128,0.1)',
                opacity: i === 0 ? 1 : i < 4 ? 0.7 : 0.45,
              }}
            >
              {/* Index */}
              <span
                className="font-sans flex-shrink-0"
                style={{ fontSize: '9px', letterSpacing: '0.2em', opacity: 0.28, paddingTop: '3px', minWidth: '28px' }}
              >
                {step.index}
              </span>

              {/* Node indicator */}
              <div className="flex-shrink-0" style={{ paddingTop: '7px' }}>
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: i === 0 ? 'rgba(178,155,127,0.9)' : 'rgba(244,239,232,0.2)',
                }} />
              </div>

              {/* Text */}
              <div>
                <p
                  className="font-display"
                  style={{ fontSize: '1rem', letterSpacing: '-0.01em', lineHeight: 1.3, marginBottom: '3px' }}
                >
                  {step.title}
                </p>
                <p
                  className="font-sans"
                  style={{ fontSize: '12px', opacity: 0.4, lineHeight: 1.6 }}
                >
                  {step.sub}
                </p>
              </div>

              {/* Return arrow on last step */}
              {i === STEPS.length - 1 && (
                <div className="ml-auto flex-shrink-0 self-center" style={{ opacity: 0.3 }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 2 C10 2 3 2 3 10 C3 16 8 18 10 18" stroke="rgba(178,155,127,1)" strokeWidth="1" strokeLinecap="round" />
                    <polyline points="7,15 10,18 13,15" stroke="rgba(178,155,127,1)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </div>
          ))}
          {/* Close-the-loop note */}
          <div
            className="py-5"
            style={{ borderTop: '1px solid rgba(128,128,128,0.1)' }}
          >
            <p className="font-sans" style={{ fontSize: '11px', opacity: 0.22, letterSpacing: '0.12em' }}>
              ↑ NUTRIENTS RETURN TO AGRICULTURAL LAND — LOOP CLOSES
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
