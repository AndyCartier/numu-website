'use client'

import { useEffect, useMemo, useState } from 'react'

type WoodshowProcessLoopProps = {
  animate?: boolean
}

const TAU = Math.PI * 2
const LOOP_MS = 10_000
const centerX = 960
const centerY = 540
const radius = 292

const nodes = [
  {
    title: 'WASTE',
    subtitle: 'palm fibre + sawdust',
    detail: 'Regional waste streams become feedstock',
    angle: -Math.PI / 2,
    fill: 'rgba(201, 167, 116, 0.16)',
  },
  {
    title: 'GROW',
    subtitle: 'mycelium colonises',
    detail: 'Nature binds the substrate into form',
    angle: 0,
    fill: 'rgba(239, 234, 216, 0.08)',
  },
  {
    title: 'PRESS',
    subtitle: 'heat-press to panel',
    detail: 'Density, finish, and geometry are fixed',
    angle: Math.PI / 2,
    fill: 'rgba(198, 106, 63, 0.18)',
  },
  {
    title: 'USE',
    subtitle: 'acoustic + fit-out',
    detail: 'Installed surfaces return value locally',
    angle: Math.PI,
    fill: 'rgba(239, 234, 216, 0.08)',
  },
] as const

function polarPoint(angle: number, distance: number) {
  return {
    x: centerX + Math.cos(angle) * distance,
    y: centerY + Math.sin(angle) * distance,
  }
}

function wrapProgress(value: number) {
  const mod = value % 1
  return mod < 0 ? mod + 1 : mod
}

export default function WoodshowProcessLoop({ animate = true }: WoodshowProcessLoopProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!animate) {
      setProgress(0.18)
      return
    }

    let frame = 0
    let mounted = true
    const startedAt = performance.now()

    const tick = (now: number) => {
      if (!mounted) return
      setProgress(((now - startedAt) % LOOP_MS) / LOOP_MS)
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => {
      mounted = false
      cancelAnimationFrame(frame)
    }
  }, [animate])

  const particles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, index) => {
        const offset = index / 18
        const local = wrapProgress(progress - offset * 0.18)
        const angle = -Math.PI / 2 + local * TAU
        const point = polarPoint(angle, radius)
        return {
          id: index,
          x: point.x,
          y: point.y,
          r: 5 + ((index * 7) % 8) * 0.35,
          opacity: 0.18 + (1 - offset) * 0.44,
        }
      }),
    [progress]
  )

  const activeStep = Math.floor(progress * nodes.length) % nodes.length

  return (
    <svg
      viewBox="0 0 1920 1080"
      role="img"
      aria-label="Circular material process diagram for NUMU"
      className="woodshow-process-svg"
    >
      <defs>
        <radialGradient id="woodshowGlow" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="rgba(217, 168, 120, 0.34)" />
          <stop offset="65%" stopColor="rgba(217, 168, 120, 0.10)" />
          <stop offset="100%" stopColor="rgba(217, 168, 120, 0)" />
        </radialGradient>
        <linearGradient id="woodshowArc" x1="0%" x2="100%" y1="0%" y2="0%">
          <stop offset="0%" stopColor="#e9dec8" stopOpacity="0.18" />
          <stop offset="48%" stopColor="#d9a878" stopOpacity="0.82" />
          <stop offset="100%" stopColor="#c66a3f" stopOpacity="0.42" />
        </linearGradient>
        <pattern id="woodshowHyphae" width="28" height="28" patternUnits="userSpaceOnUse">
          <path
            d="M0 14h28M14 0v28M4 4c8 2 10 8 10 10M24 24c-8-2-10-8-10-10"
            fill="none"
            stroke="rgba(239,234,216,0.08)"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </pattern>
      </defs>

      <rect x="0" y="0" width="1920" height="1080" fill="#17120f" />
      <rect x="0" y="0" width="1920" height="1080" fill="url(#woodshowHyphae)" opacity="0.28" />
      <circle cx={centerX} cy={centerY} r="452" fill="url(#woodshowGlow)" />
      <circle
        cx={centerX}
        cy={centerY}
        r={radius}
        fill="none"
        stroke="rgba(239,234,216,0.07)"
        strokeWidth="122"
      />
      <circle
        cx={centerX}
        cy={centerY}
        r={radius}
        fill="none"
        stroke="url(#woodshowArc)"
        strokeWidth="122"
        strokeDasharray="430 1410"
        strokeDashoffset={-progress * 820}
        strokeLinecap="round"
        transform={`rotate(-90 ${centerX} ${centerY})`}
      />

      {nodes.map((node, index) => {
        const point = polarPoint(node.angle, radius)
        const isActive = index === activeStep

        return (
          <g key={node.title} transform={`translate(${point.x} ${point.y})`}>
            <circle
              r={isActive ? 108 : 96}
              fill={node.fill}
              stroke={isActive ? 'rgba(217,168,120,0.85)' : 'rgba(239,234,216,0.16)'}
              strokeWidth={isActive ? 2.5 : 1.2}
            />
            <circle
              r={isActive ? 128 : 118}
              fill="none"
              stroke={isActive ? 'rgba(217,168,120,0.34)' : 'rgba(239,234,216,0.08)'}
              strokeWidth="1.4"
            />
            <text
              x="0"
              y="-10"
              textAnchor="middle"
              fill="#efe7d8"
              fontFamily="var(--woodshow-font-display), 'Big Shoulders Display', Impact, sans-serif"
              fontSize="50"
              letterSpacing="1.2"
            >
              {node.title}
            </text>
            <text
              x="0"
              y="22"
              textAnchor="middle"
              fill="rgba(239,234,216,0.76)"
              fontFamily="var(--woodshow-font-mono), 'DM Mono', 'IBM Plex Mono', monospace"
              fontSize="18"
            >
              {node.subtitle}
            </text>
            <text
              x="0"
              y="50"
              textAnchor="middle"
              fill="rgba(239,234,216,0.48)"
              fontFamily="var(--woodshow-font-serif), 'Instrument Serif', Georgia, serif"
              fontSize="18"
              fontStyle="italic"
            >
              {node.detail}
            </text>
          </g>
        )
      })}

      {particles.map((particle) => (
        <circle
          key={particle.id}
          cx={particle.x}
          cy={particle.y}
          r={particle.r}
          fill="#f4efe8"
          opacity={particle.opacity}
        />
      ))}

      <circle cx={centerX} cy={centerY} r="152" fill="rgba(16,12,9,0.78)" stroke="rgba(239,234,216,0.10)" />
      <text
        x={centerX}
        y={centerY - 16}
        textAnchor="middle"
        fill="#d9a878"
        fontFamily="var(--woodshow-font-mono), 'DM Mono', 'IBM Plex Mono', monospace"
        fontSize="18"
        letterSpacing="5"
      >
        NUMU
      </text>
      <text
        x={centerX}
        y={centerY + 26}
        textAnchor="middle"
        fill="#f4efe8"
        fontFamily="var(--woodshow-font-serif), 'Instrument Serif', Georgia, serif"
        fontSize="34"
        fontStyle="italic"
      >
        waste to material loop
      </text>
    </svg>
  )
}
