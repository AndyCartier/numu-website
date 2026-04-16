'use client'

import { Fragment } from 'react'

// ─── SVG Icons ────────────────────────────────────────────────────────────────

function WheatIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}
      strokeLinecap="round" strokeLinejoin="round" width={22} height={22}>
      <line x1="12" y1="21" x2="12" y2="6" />
      <path d="M12 16 C12 16 7 15 6.5 10 C9 9.5 12 13 12 16" />
      <path d="M12 11 C12 11 17 10 17.5 5 C15 4.5 12 8 12 11" />
    </svg>
  )
}

function DropletIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}
      strokeLinecap="round" strokeLinejoin="round" width={22} height={22}>
      <path d="M12 2 C12 2 5 10 5 14 a7 7 0 0 0 14 0 C19 10 12 2 12 2 Z" />
    </svg>
  )
}

function ExpandIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}
      strokeLinecap="round" strokeLinejoin="round" width={22} height={22}>
      <polyline points="15,3 21,3 21,9" />
      <polyline points="9,21 3,21 3,15" />
      <line x1="21" y1="3" x2="14" y2="10" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  )
}

function MoldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}
      strokeLinecap="round" strokeLinejoin="round" width={22} height={22}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <rect x="8" y="8" width="8" height="8" rx="1" />
    </svg>
  )
}

function CubeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}
      strokeLinecap="round" strokeLinejoin="round" width={22} height={22}>
      <path d="M12 3 L20.5 7.5 L20.5 16.5 L12 21 L3.5 16.5 L3.5 7.5 Z" />
      <path d="M3.5 7.5 L12 12 L20.5 7.5" />
      <line x1="12" y1="12" x2="12" y2="21" />
    </svg>
  )
}

// ─── Step definitions ─────────────────────────────────────────────────────────

const STEPS = [
  { index: '01', label: 'Raw Fiber',       Icon: WheatIcon,   active: false },
  { index: '02', label: 'Inoculation',     Icon: DropletIcon, active: false },
  { index: '03', label: 'Growth',          Icon: ExpandIcon,  active: false },
  { index: '04', label: 'Shaping',         Icon: MoldIcon,    active: false },
  { index: '05', label: 'Final Material',  Icon: CubeIcon,    active: true  },
]

// ─── Dashed connector ─────────────────────────────────────────────────────────

function Connector() {
  return (
    <div className="hidden md:block flex-1" style={{ paddingTop: '25px' }}>
      <div className="process-connector" />
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function ProcessDiagram() {
  return (
    <div className="mt-16 flex flex-col md:flex-row items-start gap-8 md:gap-0">
      {STEPS.map((step, i) => (
        <Fragment key={step.index}>

          {/* ── Step node ──────────────────────────────────────────────────── */}
          <div className="flex md:flex-col items-center gap-5 md:gap-0 md:text-center w-full md:w-auto flex-shrink-0">
            {/* Icon circle */}
            <div className="relative flex-shrink-0 flex items-center justify-center"
              style={{ width: '52px', height: '52px' }}>

              {/* Pulse rings (active step only) */}
              {step.active && (
                <>
                  <div className="absolute inset-0 rounded-full process-pulse"
                    style={{ border: '1px solid currentColor' }} />
                  <div className="absolute inset-0 rounded-full process-pulse process-pulse--delay"
                    style={{ border: '1px solid currentColor' }} />
                </>
              )}

              <div style={{
                width: '52px', height: '52px', borderRadius: '50%',
                border: '1px solid rgba(128,128,128,0.22)',
                backgroundColor: step.active ? 'rgba(128,128,128,0.07)' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative', zIndex: 1,
              }}>
                <step.Icon />
              </div>
            </div>

            {/* Label group */}
            <div className="md:mt-5">
              <p className="font-sans text-label uppercase tracking-[0.2em] mb-1.5"
                style={{ opacity: 0.28 }}>
                {step.index}
              </p>
              <p className="font-display text-base md:text-lg leading-tight"
                style={{ opacity: step.active ? 1 : 0.6 }}>
                {step.label}
              </p>
            </div>
          </div>

          {/* ── Connector (desktop only) ───────────────────────────────────── */}
          {i < STEPS.length - 1 && <Connector />}

        </Fragment>
      ))}
    </div>
  )
}
