'use client'

import { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { motion, AnimatePresence, useInView, useMotionValue, useTransform, animate } from 'framer-motion'
import type { VisitorContent, InvestorContent } from '@/lib/content'
import {
  cancelIdleTask,
  DEFERRED_IMAGE_ASSETS,
  DEFERRED_VIDEO_ASSETS,
  requestIdleTask,
  warmMediaAssets,
} from './preloadAssets'

const LoadingScreen = dynamic(() => import('./LoadingScreen'), { ssr: false })
import ProcessDiagram from '@/components/ProcessDiagram'

// ─── Themes ───────────────────────────────────────────────────────────────────
const VISITOR = { bg: '#f5f1e8', fg: '#1a1714' }
const INVESTOR = { bg: '#0e0e0e', fg: '#f5f1e8' }
const BORDER = '1px solid rgba(128,128,128,0.15)'
const INV_BORDER = '1px solid rgba(245,241,232,0.1)'
const INV_BORDER_SUBTLE = '1px solid rgba(245,241,232,0.06)'
const ACCENT = '#B29B7F'  // warm-mid — accent for investor highlights

// ─── CountUp ──────────────────────────────────────────────────────────────────

function CountUp({ to, decimals = 0, suffix = '', prefix = '', duration = 1.4 }: {
  to: number; decimals?: number; suffix?: string; prefix?: string; duration?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px' })
  const motionVal = useMotionValue(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(motionVal, to, {
      duration,
      ease: [0.25, 0.1, 0, 1],
      onUpdate: (v) => {
        if (ref.current) {
          ref.current.textContent = prefix + v.toFixed(decimals) + suffix
        }
      },
    })
    return controls.stop
  }, [inView, to, duration, decimals, suffix, prefix, motionVal])

  return <span ref={ref}>{prefix}0{suffix}</span>
}

// ─── HoverVideo ───────────────────────────────────────────────────────────────

// ─── Social links ────────────────────────────────────────────────────────────

const SOCIAL = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/numu.bio',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" width={18} height={18}>
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/numu-bio',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" width={18} height={18}>
        <rect x="2" y="2" width="20" height="20" rx="3" />
        <line x1="8" y1="11" x2="8" y2="17" />
        <line x1="8" y1="8" x2="8" y2="8.5" strokeWidth={2.2} strokeLinecap="round" />
        <path d="M12 17 V13 C12 11.9 12.9 11 14 11 C15.1 11 16 11.9 16 13 V17" />
        <line x1="12" y1="11" x2="12" y2="17" />
      </svg>
    ),
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/971505384166',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" width={18} height={18}>
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    ),
  },
]

const TEAM_PHOTO_MAP: Record<string, string> = {
  founder: '/images/founder/Portrait.PNG',
  benjamin: '/images/founder/benjamin_2026.png',
  othman: '/images/founder/othman_2026.png',
  matthew: '/images/founder/matthew_2026.png',
}

const PUBLIC_TEAM_PHOTO_MAP: Record<string, string> = {
  founder: '/images/founder/processed/andy_public_v2.png',
  benjamin: '/images/founder/benjamin_2026.png',
  othman: '/images/founder/othman_2026.png',
  matthew: '/images/founder/matthew_2026.png',
}

const PUBLIC_TEAM_BLURBS: Record<string, string> = {
  founder: 'Leads industrialization, production development, and material execution across Europe and the GCC.',
  benjamin: 'Oversees finance, construction economics, and the operational discipline behind scale.',
  othman: 'Leads IP, legal structure, and long-term defensibility of the platform.',
  matthew: 'Drives partnerships, pipeline development, and commercial growth for early deployments.',
}

type ContactRequestType = 'investor_deck' | 'project' | 'samples'

function SocialLinks({ dark = false }: { dark?: boolean }) {
  const base = dark ? 'rgba(245,241,232,1)' : 'rgba(26,23,20,1)'
  const borderCol = dark ? 'rgba(245,241,232,0.18)' : 'rgba(26,23,20,0.18)'
  const hoverBorder = dark ? 'rgba(245,241,232,0.45)' : 'rgba(26,23,20,0.45)'

  return (
    <div className="flex items-center gap-3">
      {SOCIAL.map(s => (
        <a
          key={s.label}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.label}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 38, height: 38,
            border: `1px solid ${borderCol}`,
            color: base,
            opacity: 0.65,
            transition: 'opacity 0.2s, border-color 0.2s',
            flexShrink: 0,
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLAnchorElement
            el.style.opacity = '1'
            el.style.borderColor = hoverBorder
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLAnchorElement
            el.style.opacity = '0.65'
            el.style.borderColor = borderCol
          }}
        >
          {s.icon}
        </a>
      ))}
    </div>
  )
}

function DirectContactForm({
  requestType,
  source,
  submitLabel,
  dark = false,
}: {
  requestType: ContactRequestType
  source: string
  submitLabel: string
  dark?: boolean
}) {
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')

  const border = dark ? '1px solid rgba(245,241,232,0.22)' : BORDER
  const buttonBorder = dark ? '1px solid rgba(245,241,232,0.22)' : '1px solid rgba(26,23,20,0.55)'
  const buttonBg = dark ? 'rgba(245,241,232,0.1)' : 'rgba(26,23,20,0.07)'
  const inputColor = dark ? 'rgba(245,241,232,0.85)' : 'rgba(26,23,20,0.88)'
  const primaryTextOpacity = dark ? 0.76 : 0.68
  const secondaryTextOpacity = dark ? 0.34 : 0.48
  const errorTextOpacity = dark ? 0.55 : 0.58

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || status === 'loading') return

    setStatus('loading')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, website, requestType, source }),
      })

      if (!res.ok) throw new Error('Request failed')

      setStatus('sent')
      setEmail('')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="max-w-lg">
        <p className="font-sans text-base" style={{ opacity: primaryTextOpacity, lineHeight: 1.6 }}>
          Request sent.
        </p>
        <p className="font-sans text-sm mt-2" style={{ opacity: secondaryTextOpacity, lineHeight: 1.6 }}>
          Your request has been sent to andy@numu.bio.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-lg">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={e => setWebsite(e.target.value)}
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: '-9999px',
            width: 1,
            height: 1,
            opacity: 0,
            pointerEvents: 'none',
          }}
        />
        <input
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="your@email.com"
          disabled={status === 'loading'}
          className="font-sans flex-1 px-5 py-4 bg-transparent outline-none"
          style={{
            border,
            fontSize: '0.875rem',
            color: inputColor,
            opacity: status === 'loading' ? 0.5 : 0.88,
          }}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="font-sans uppercase tracking-[0.14em] px-7 py-4 flex-shrink-0"
          style={{
            border: buttonBorder,
            backgroundColor: buttonBg,
            fontSize: '0.75rem',
            cursor: status === 'loading' ? 'wait' : 'pointer',
            opacity: status === 'loading' ? 0.55 : 1,
            transition: 'background-color 0.2s, opacity 0.2s',
          }}
        >
          {status === 'loading' ? 'Sending…' : submitLabel}
        </button>
      </form>
      {status === 'error' && (
        <p className="font-sans text-xs mt-3" style={{ opacity: errorTextOpacity }}>
          Sending is temporarily unavailable. Please try again shortly.
        </p>
      )}
    </div>
  )
}

// ─── Image Placeholder ────────────────────────────────────────────────────────

type AspectRatio = '16:9' | '4:3' | '1:1' | '3:4'
const ASPECT_MAP: Record<AspectRatio, string> = { '16:9': '16/9', '4:3': '4/3', '1:1': '1/1', '3:4': '3/4' }

function ImagePlaceholder({ aspect, brief, label }: { aspect: AspectRatio; brief: string; label?: string }) {
  const [hover, setHover] = useState(false)
  return (
    <div
      className="relative w-full"
      style={{ aspectRatio: ASPECT_MAP[aspect], backgroundColor: 'rgba(128,128,128,0.06)', border: '1px solid rgba(128,128,128,0.12)' }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" width={22} height={22} style={{ opacity: 0.2 }}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
        {label && <p className="font-sans uppercase tracking-[0.16em]" style={{ fontSize: '0.5625rem', opacity: 0.28 }}>{label}</p>}
      </div>
      {/* Brief visible on hover */}
      <div
        style={{
          position: 'absolute', inset: 0, backgroundColor: 'rgba(10,8,6,0.82)', padding: '1.5rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: hover ? 1 : 0, transition: 'opacity 0.25s',
          pointerEvents: 'none',
        }}
      >
        <p className="font-sans text-center" style={{ fontSize: '0.75rem', opacity: 0.75, lineHeight: 1.65, color: 'rgba(245,241,232,1)', maxWidth: 280 }}>{brief}</p>
      </div>
    </div>
  )
}

function HoverVideo({ src, className, style }: { src: string; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [active, setActive] = useState(false)
  return (
    <div
      style={{ position: 'relative', width: '100%', height: '100%', cursor: 'pointer' }}
      onMouseEnter={() => { ref.current?.play(); setActive(true) }}
      onMouseLeave={() => { ref.current?.pause(); setActive(false) }}
      onClick={() => { if (active) { ref.current?.pause(); setActive(false) } else { ref.current?.play(); setActive(true) } }}
    >
      <video ref={ref} src={src} muted loop playsInline className={className} style={style} suppressHydrationWarning />
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: active ? 0 : 1, transition: 'opacity 0.4s',
        pointerEvents: 'none',
      }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', border: '1px solid rgba(245,241,232,0.5)', backgroundColor: 'rgba(10,8,6,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="12" height="14" viewBox="0 0 12 14" fill="none" style={{ marginLeft: 2 }}>
            <path d="M1 1L11 7L1 13Z" fill="rgba(245,241,232,0.85)" />
          </svg>
        </div>
      </div>
    </div>
  )
}

function AutoplayVideoBlock({
  src,
  poster,
  altLabel,
  preload = 'metadata',
  className,
  style,
  overlay,
}: {
  src: string
  poster?: string
  altLabel?: string
  preload?: 'none' | 'metadata' | 'auto'
  className?: string
  style?: React.CSSProperties
  overlay?: React.ReactNode
}) {
  return (
    <div className="relative w-full h-full overflow-hidden" style={{ backgroundColor: '#1a1714' }}>
      {poster && (
        <Image
          src={poster}
          alt={altLabel ?? ''}
          fill
          aria-hidden={altLabel ? undefined : true}
          className="object-cover object-center"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      )}

      <video
        src={src}
        poster={poster}
        preload={preload}
        autoPlay
        muted
        loop
        playsInline
        className={className}
        style={style}
        suppressHydrationWarning
      />

      {overlay}
    </div>
  )
}

function BackgroundAssetWarmup() {
  useEffect(() => {
    const idleHandle = requestIdleTask(() => {
      void warmMediaAssets({
        images: DEFERRED_IMAGE_ASSETS,
        videos: DEFERRED_VIDEO_ASSETS,
        concurrency: 2,
      })
    }, 1500)

    return () => {
      cancelIdleTask(idleHandle)
    }
  }, [])

  return null
}

// ─── Spore Field — visitor hero: organic growing hyphae + spore flutter ────────

function SporeField() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()

    // Each root grows from a seed point, branches off children, then fades
    type Segment = { x: number; y: number }
    type Root = {
      segs: Segment[]
      angle: number
      speed: number
      wobble: number
      width: number
      alpha: number
      targetAlpha: number
      growing: boolean
      maxSegs: number
      branchAt: number   // segment index to spawn a child branch
      branched: boolean
      phase: number
    }

    const roots: Root[] = []

    const makeRoot = (x?: number, y?: number, angle?: number, width?: number): Root => {
      const W = canvas.width, H = canvas.height
      const sx = x ?? Math.random() * W
      const sy = y ?? H * 0.5 + (Math.random() - 0.5) * H * 0.7
      const a = angle ?? Math.random() * Math.PI * 2
      const w = width ?? 0.6 + Math.random() * 1.4
      return {
        segs: [{ x: sx, y: sy }],
        angle: a,
        speed: 2.2 + Math.random() * 2.8,
        wobble: (Math.random() - 0.5) * 0.09,
        width: w,
        alpha: 0,
        targetAlpha: 0.22 + Math.random() * 0.38,
        growing: true,
        maxSegs: 40 + Math.floor(Math.random() * 50),
        branchAt: 15 + Math.floor(Math.random() * 20),
        branched: false,
        phase: Math.random() * Math.PI * 2,
      }
    }

    const MAX_SEGS = 55
    const BASE_COUNT = 16   // sparse phase
    const PEAK_COUNT = 52   // dense phase
    const CYCLE_TICKS = 1080 // ~18s at 60fps
    const hyphae: Root[] = Array.from({ length: BASE_COUNT }, makeRoot)

    type Spore = { x: number; y: number; vx: number; vy: number; r: number; alpha: number; targetAlpha: number; phase: number; freq: number }
    const makeSpore = (): Spore => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.14,
      vy: -0.04 - Math.random() * 0.1,
      r: Math.random() * 1.4 + 0.35,
      alpha: Math.random() * 0.08,
      targetAlpha: 0.06 + Math.random() * 0.14,
      phase: Math.random() * Math.PI * 2,
      freq: 0.003 + Math.random() * 0.007,
    })
    const spores: Spore[] = Array.from({ length: 28 }, makeSpore)

    let tick = 0
    let raf: number

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      tick++

      // Density breathing: sine wave from BASE_COUNT→PEAK_COUNT→BASE_COUNT per cycle
      const breathPhase = (tick % CYCLE_TICKS) / CYCLE_TICKS
      const breathWave = Math.sin(breathPhase * Math.PI)  // 0 → 1 → 0
      const densityTarget = BASE_COUNT + Math.round((PEAK_COUNT - BASE_COUNT) * breathWave)

      for (const h of hyphae) {
        h.alpha += (h.targetAlpha - h.alpha) * 0.016

        if (h.growing) {
          if (h.segs.length < MAX_SEGS) {
            h.angle += h.wobble + (Math.random() - 0.5) * 0.032
            const last = h.segs[h.segs.length - 1]
            h.segs.push({ x: last.x + Math.cos(h.angle) * h.speed, y: last.y + Math.sin(h.angle) * h.speed })
            if (!h.branched && h.segs.length >= h.branchAt && h.width > 0.5) {
              h.branched = true
              const tip = h.segs[h.segs.length - 1]
              if (tip) {
                const child = makeRoot(tip.x, tip.y, h.angle + (Math.random() > 0.5 ? 1 : -1) * (0.4 + Math.random() * 0.5), h.width * 0.55)
                child.targetAlpha = h.targetAlpha * 0.75
                hyphae.push(child)
                if (hyphae.length > 62) hyphae.splice(0, 1)
              }
            }
          } else {
            h.growing = false
            h.targetAlpha = 0
          }
        }

        if (!h.growing && h.alpha < 0.003) {
          // Only respawn if we're below the current density target
          const alive = hyphae.filter(x => x.growing || x.alpha > 0.01).length
          if (alive < densityTarget) {
            Object.assign(h, makeRoot())
          }
          continue
        }

        if (h.segs.length < 2) continue

        const flutter = h.growing ? 0 : 0.55
        ctx.save()
        ctx.globalAlpha = h.alpha
        ctx.strokeStyle = 'rgba(26,23,20,1)'
        ctx.lineWidth = h.width
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.beginPath()
        ctx.moveTo(h.segs[0].x, h.segs[0].y)
        for (let i = 1; i < h.segs.length; i++) {
          const p = i / h.segs.length
          const s = h.segs[i]
          ctx.lineTo(
            s.x + Math.sin(tick * 0.016 + h.phase + i * 0.13) * flutter * p,
            s.y + Math.cos(tick * 0.012 + h.phase + i * 0.09) * flutter * 0.45 * p,
          )
        }
        ctx.stroke()
        ctx.restore()
      }

      for (const s of spores) {
        s.alpha += (s.targetAlpha - s.alpha) * 0.009
        if (Math.abs(s.alpha - s.targetAlpha) < 0.004) s.targetAlpha = Math.random() * 0.14 + 0.03
        s.x += s.vx + Math.sin(tick * s.freq + s.phase) * 0.14
        s.y += s.vy
        if (s.y < -12) { s.y = canvas.height + 6; s.x = Math.random() * canvas.width }
        if (s.x < -12) s.x = canvas.width + 8
        if (s.x > canvas.width + 12) s.x = -8
        ctx.save()
        ctx.globalAlpha = s.alpha
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(26,23,20,1)'
        ctx.fill()
        ctx.restore()
      }

      raf = requestAnimationFrame(draw)
    }

    draw()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  }, [])

  return (
    <canvas
      ref={ref}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
    />
  )
}

// ─── Hyphae Field — investor hero: organic growth lines expanding from center ──

function HyphaeField() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()

    const MAX_SEGS = 110

    type Hypha = {
      pts: [number, number][]
      angle: number
      alpha: number
      targetAlpha: number
      width: number
      speed: number
      growing: boolean
      wobble: number
    }

    const make = (): Hypha => {
      const cw = canvas.width
      const ch = canvas.height
      const spread = Math.min(cw, ch) * 0.22
      const ox = cw * 0.5 + (Math.random() - 0.5) * spread
      const oy = ch * 0.5 + (Math.random() - 0.5) * spread * 0.55
      return {
        pts: [[ox, oy]],
        angle: Math.random() * Math.PI * 2,
        alpha: 0,
        targetAlpha: 0.18 + Math.random() * 0.26,
        width: 0.7 + Math.random() * 1.25,
        speed: 0.95 + Math.random() * 1.25,
        growing: true,
        wobble: (Math.random() - 0.5) * 0.05,
      }
    }

    const N = 96
    const hyphae: Hypha[] = Array.from({ length: N }, make)
    let raf: number

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const h of hyphae) {
        h.alpha += (h.targetAlpha - h.alpha) * 0.016

        if (h.growing) {
          if (h.pts.length < MAX_SEGS) {
            h.angle += h.wobble + (Math.random() - 0.5) * 0.028
            const [lx, ly] = h.pts[h.pts.length - 1]
            h.pts.push([lx + Math.cos(h.angle) * h.speed, ly + Math.sin(h.angle) * h.speed])
          } else {
            h.growing = false
            h.targetAlpha = 0
          }
        }

        if (!h.growing && h.alpha < 0.003) {
          Object.assign(h, make())
          continue
        }

        if (h.pts.length < 2) continue

        ctx.save()
        ctx.globalAlpha = h.alpha
        ctx.beginPath()
        ctx.moveTo(h.pts[0][0], h.pts[0][1])
        for (let i = 1; i < h.pts.length; i++) {
          ctx.lineTo(h.pts[i][0], h.pts[i][1])
        }
        ctx.strokeStyle = 'rgba(178,155,127,1)'
        ctx.lineWidth = h.width
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.stroke()
        ctx.restore()
      }

      raf = requestAnimationFrame(draw)
    }

    draw()

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  }, [])

  return (
    <canvas
      ref={ref}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
    />
  )
}

// ─── Visitor shared components ────────────────────────────────────────────────

function VSection({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <section id={id} className="px-6 md:px-12 py-24 md:py-32" style={{ borderTop: BORDER }}>
      <div className="max-w-[1440px] mx-auto">{children}</div>
    </section>
  )
}

function VLabel({ text }: { text: string }) {
  return (
    <p className="font-sans text-label uppercase tracking-[0.18em] mb-6" style={{ opacity: 0.68, fontSize: 'clamp(0.68rem, 1.2vw, 0.78rem)' }}>
      {text}
    </p>
  )
}

function VHeading({ text }: { text: string }) {
  return (
    <h2 className="font-display text-headline mb-10 max-w-3xl" style={{ textWrap: 'balance' as React.CSSProperties['textWrap'] }}>
      {text}
    </h2>
  )
}

function VBody({ text }: { text: string }) {
  return (
    <p className="font-sans text-base md:text-[1.0625rem] leading-[1.75] mb-12 max-w-2xl" style={{ opacity: 0.7 }}>
      {text}
    </p>
  )
}

// ─── Investor shared components ───────────────────────────────────────────────

function ISection({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <section id={id} className="px-6 md:px-12 py-20 md:py-28" style={{ borderTop: INV_BORDER }}>
      <div className="max-w-[1440px] mx-auto">{children}</div>
    </section>
  )
}

function ILabel({ text }: { text: string }) {
  return (
    <p className="font-sans text-label uppercase tracking-[0.2em] mb-6" style={{ opacity: 0.35 }}>
      {text}
    </p>
  )
}

function IHeading({ text }: { text: string }) {
  return (
    <h2 className="font-display mb-10 max-w-3xl" style={{ fontSize: 'clamp(2.25rem, 4.5vw, 3.75rem)', lineHeight: 1.08, letterSpacing: '-0.03em', fontWeight: 700, textWrap: 'balance' as React.CSSProperties['textWrap'] }}>
      {text}
    </h2>
  )
}

function IBody({ text }: { text: string }) {
  return (
    <p className="font-sans text-base md:text-[1.0625rem] leading-[1.75] mb-10 max-w-2xl" style={{ opacity: 0.68 }}>
      {text}
    </p>
  )
}


// ─── Production feature (image + placeholders) ───────────────────────────────

function ProductionFeature() {
  return (
    <section className="px-6 md:px-12 py-24 md:py-32" style={{ borderTop: BORDER }}>
      <div className="max-w-[1440px] mx-auto">
        <div className="mb-10">
          <p className="font-sans text-label uppercase tracking-[0.18em] mb-3" style={{ opacity: 0.38 }}>Production</p>
          <p className="font-sans text-base max-w-lg" style={{ opacity: 0.48, lineHeight: 1.75 }}>
            NUMU operates an active production lab in Dubai since 2025. Material is grown and pressed from regional agricultural waste — no imports, no synthetic resins.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-[1.75fr_1fr] gap-3">
          <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
            <Image src="/images/founder/founder_in_action.jpg" alt="NUMU production lab — Dubai 2025" fill unoptimized className="object-cover object-center" sizes="(max-width: 768px) 100vw, 65vw" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              '/images/projects/production_detail_01.jpg',
              '/images/projects/production_detail_02.jpg',
              '/images/projects/production_detail_03.jpg',
              '/images/projects/production_detail_04.jpg',
            ].map((src, i) => (
              <div key={i} className="relative overflow-hidden" style={{ aspectRatio: '1/1' }}>
                <Image src={src} alt={`Production lab detail ${i + 1}`} fill unoptimized className="object-cover object-center" sizes="20vw" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Process & Test Carousel ─────────────────────────────────────────────────

const CAROUSEL_ITEMS = [
  { src: '/images/textures/texture_closeup_01.jpg', alt: 'Material surface — texture study', label: 'Surface texture' },
  { src: '/images/products/biofoam_detail.png', alt: 'Biofoam block — material study', label: 'Biofoam material' },
  { src: '/images/founder/founder_in_action.jpg', alt: 'Production lab — process documentation', label: 'Lab process' },
  { src: '/images/textures/texture_closeup_02.jpg', alt: 'Material surface — detail', label: 'Surface detail' },
  { src: '/images/products/fold_solo_panel.png', alt: 'FOLD panel — product study', label: 'FOLD panel' },
  { src: '/images/hero/mycofoam_block_01.png', alt: 'Mycofoam composite block', label: 'Composite form' },
  { src: '/images/applications/event_board.jpg', alt: 'Pressed composite board — test batch', label: 'Pressed board' },
  { src: '/images/projects/Mymo01.jpg', alt: 'Mymo — material experiment', label: 'Mymo' },
  { src: '/images/products/fold_context_scale.png', alt: 'FOLD installation — scale context', label: 'Scale context' },
  { src: '/images/projects/Insulation.jpg', alt: 'Mycelium insulation — material research', label: 'Insulation' },
  { src: '/images/projects/Kinoko.jpg', alt: 'Kinoko project — grown form', label: 'Kinoko' },
  { src: '/images/projects/Kinoko02.jpg', alt: 'Kinoko project — detail', label: 'Kinoko detail' },
  { src: '/images/projects/Lamp01.jpg', alt: 'Mycelium lamp — applied research', label: 'Lamp 01' },
  { src: '/images/projects/Lamp02.jpg', alt: 'Mycelium lamp — form study', label: 'Lamp 02' },
  { src: '/images/projects/Pressed_samples.jpg', alt: 'Pressed samples — batch testing', label: 'Pressed samples' },
  { src: '/images/projects/Reroot_panels.jpg', alt: 'Reroot panels — acoustic surface', label: 'Reroot panels' },
  { src: '/images/projects/Spora_panels.jpg', alt: 'Spora panels — grown acoustic', label: 'Spora panels' },
  { src: '/images/projects/pressed_booth.jpg', alt: 'Pressed booth — applied installation', label: 'Pressed booth' },
]
const CAROUSEL_W = 400
const CAROUSEL_H = 300

function ProcessCarousel() {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null)

  useEffect(() => {
    if (!lightbox) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightbox(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox])

  return (
    <section className="px-6 md:px-12 py-24 md:py-32" style={{ borderTop: BORDER }}>
      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9000,
            backgroundColor: 'rgba(10,8,6,0.92)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'zoom-out',
          }}
        >
          <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }} onClick={e => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={lightbox.src} alt={lightbox.alt} style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', display: 'block' }} />
            <button
              onClick={() => setLightbox(null)}
              style={{ position: 'absolute', top: -36, right: 0, background: 'none', border: 'none', color: '#f5f1e8', opacity: 0.6, fontSize: 22, cursor: 'pointer', fontFamily: 'sans-serif' }}
            >✕</button>
          </div>
        </div>
      )}

      <div className="max-w-[1440px] mx-auto mb-8">
        <p className="font-sans text-label uppercase tracking-[0.18em] mb-2" style={{ opacity: 0.35 }}>
          Material Experiments &amp; Applied Research
        </p>
        <p className="font-sans text-xs" style={{ opacity: 0.28 }}>← scroll · click to enlarge →</p>
      </div>
      <div
        style={{
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          paddingLeft: 24,
          paddingRight: 24,
          WebkitOverflowScrolling: 'touch',
        }}
        className="md:px-12 carousel-scroll"
      >
        {CAROUSEL_ITEMS.map((item, i) => (
          <div
            key={i}
            onClick={() => setLightbox({ src: item.src, alt: item.alt })}
            style={{
              flexShrink: 0,
              scrollSnapAlign: 'start',
              width: CAROUSEL_W,
              height: CAROUSEL_H,
              position: 'relative',
              overflow: 'hidden',
              border: BORDER,
              cursor: 'zoom-in',
            }}
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              className="object-cover object-center"
              sizes="400px"
            />
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '10px 12px',
                background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%)',
              }}
            >
              <p className="font-sans uppercase tracking-[0.12em]" style={{ fontSize: 8, opacity: 0.55, color: '#f5f1e8' }}>{item.label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── KAVE countdown + feature section ────────────────────────────────────────
const KAVE_TARGET_DATE = new Date('2026-06-30T00:00:00')

function KaveCountdown() {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, KAVE_TARGET_DATE.getTime() - Date.now())
      setTime({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex items-center gap-8 mt-8">
      {([
        { value: time.days, unit: 'Days' },
        { value: time.hours, unit: 'Hours' },
        { value: time.minutes, unit: 'Min' },
        { value: time.seconds, unit: 'Sec' },
      ] as { value: number; unit: string }[]).map(({ value, unit }, i) => (
        <div key={unit} className="flex items-start gap-8">
          <div className="text-center">
            <p className="font-display" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '-0.045em', lineHeight: 1, color: '#f5f1e8', opacity: 0.9 }}>
              {String(value).padStart(2, '0')}
            </p>
            <p className="font-sans uppercase tracking-[0.2em] mt-1" style={{ fontSize: '0.5625rem', opacity: 0.38, color: '#f5f1e8' }}>
              {unit}
            </p>
          </div>
          {i < 3 && <p className="font-display" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1, color: '#f5f1e8', opacity: 0.3, marginTop: 0 }}>:</p>}
        </div>
      ))}
    </div>
  )
}

const BEYOND_SLIDES = [
  '/images/projects/Beyond01.jpg',
  '/images/projects/Beyond02.jpg',
  '/images/projects/Mymo01.jpg',
]

function BeyondSlideshow() {
  const [slide, setSlide] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setSlide(s => (s + 1) % BEYOND_SLIDES.length), 3500)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="relative w-full overflow-hidden mb-4" style={{ aspectRatio: '4/3', backgroundColor: 'rgba(128,128,128,0.06)' }}>
      {BEYOND_SLIDES.map((src, i) => (
        <div key={src} style={{ position: 'absolute', inset: 0, backgroundImage: `url(${src})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: i === slide ? 1 : 0, transition: 'opacity 1s ease-in-out' }} />
      ))}
      <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 5, zIndex: 2 }}>
        {BEYOND_SLIDES.map((_, i) => (
          <div key={i} onClick={() => setSlide(i)} style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: '#f5f1e8', opacity: i === slide ? 0.9 : 0.3, cursor: 'pointer', transition: 'opacity 0.3s' }} />
        ))}
      </div>
    </div>
  )
}

function KaveSection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ height: '85vh', minHeight: 560, borderTop: BORDER }}
    >
      <div
        style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/images/projects/acoustic_render_07.jpg)',
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'blur(2px)',
          transform: 'scale(1.05)',
          opacity: 0.85,
        }}
      />
      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(10,8,6,0.42)' }} />

      {/* Content */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
        style={{ zIndex: 2 }}
      >
        <p className="font-sans uppercase tracking-[0.24em] mb-6" style={{ fontSize: '0.5rem', opacity: 0.42, color: '#f5f1e8' }}>
          Installation — Dubai, UAE · 2026 Q2
        </p>
        <h2 className="font-display" style={{ fontSize: 'clamp(4rem, 12vw, 9rem)', lineHeight: 0.9, letterSpacing: '-0.045em', color: '#f5f1e8', opacity: 0.95 }}>
          KAVE
        </h2>
        <div className="mt-5 flex items-center gap-3">
          <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: '#f5f1e8', opacity: 0.55, animation: 'process-pulse 2s ease-out infinite' }} />
          <p className="font-sans uppercase tracking-[0.22em]" style={{ fontSize: '0.6875rem', opacity: 0.55, color: '#f5f1e8' }}>
            Currently being built
          </p>
        </div>
        <KaveCountdown />
      </div>
    </section>
  )
}

// ─── Investor contact form ────────────────────────────────────────────────────

function InvestorContact({ iv }: { iv: InvestorContent }) {
  return (
    <div className="rounded-sm px-10 md:px-16 py-16 md:py-20" style={{ backgroundColor: 'rgba(245,241,232,0.04)', border: '1px solid rgba(245,241,232,0.08)' }}>
      <ILabel text={iv.cta.label} />
      <h2 className="font-display text-headline mb-6 max-w-2xl">{iv.cta.heading}</h2>
      <p className="font-sans text-base leading-[1.75] mb-6 max-w-xl" style={{ opacity: 0.55 }}>{iv.cta.body}</p>
      <div className="mt-6">
        <DirectContactForm
          requestType="investor_deck"
          source="investor-contact"
          submitLabel="Request Deck →"
          dark
        />
      </div>
      <div className="mt-10 pt-8 flex flex-col sm:flex-row sm:items-center gap-6" style={{ borderTop: '1px solid rgba(245,241,232,0.1)' }}>
        <p className="font-sans text-label uppercase tracking-[0.16em]" style={{ opacity: 0.28 }}>Connect</p>
        <SocialLinks dark />
      </div>
    </div>
  )
}

// ─── Three Forces ─────────────────────────────────────────────────────────────

function ThreeForces({ forces }: { forces: InvestorContent['forces'] }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px' })

  return (
    <div ref={ref} className="mt-16" style={{ borderTop: INV_BORDER }}>
      <p className="font-sans text-label uppercase tracking-[0.18em] mt-10 mb-12" style={{ opacity: 0.35 }}>
        Why now — three converging forces
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 1, backgroundColor: 'rgba(245,241,232,0.1)' }}>
        {forces.items.map((force, i) => (
          <motion.div
            key={force.id}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: i * 0.15, ease: [0.25, 0, 0.2, 1] }}
            className="p-10 md:p-12"
            style={{ backgroundColor: '#0e0e0e', position: 'relative', overflow: 'hidden' }}
          >
            {/* Large background number */}
            <div style={{ position: 'absolute', top: -8, right: 16, fontFamily: "'Playfair Display', Georgia, serif", fontSize: '7rem', lineHeight: 1, color: 'rgba(245,241,232,1)', opacity: 0.08, fontWeight: 700, letterSpacing: '-0.04em', userSelect: 'none', pointerEvents: 'none' }}>
              {String(i + 1).padStart(2, '0')}
            </div>
            <div className="mb-8 flex items-center gap-3">
              <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: ACCENT, opacity: 0.9 }} />
              <p className="font-sans text-label uppercase tracking-[0.2em]" style={{ opacity: 0.35 }}>Force {String(i + 1).padStart(2, '0')}</p>
            </div>
            <p className="font-display mb-5" style={{ fontSize: 'clamp(1.75rem, 2.5vw, 2.5rem)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>{force.title}</p>
            <div style={{ width: 32, height: 1.5, backgroundColor: ACCENT, opacity: 0.6, marginBottom: 20 }} />
            <p className="font-sans text-base leading-[1.85]" style={{ opacity: 0.58 }}>{force.body}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ─── Investor key metrics strip ──────────────────────────────────────────────

function InvestorMetricsStrip() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px' })

  const metrics = [
    { value: 2.2, prefix: 'AED ', suffix: 'M', unit: 'CURRENT RAISE', decimals: 1 },
    { value: 18, prefix: '', suffix: ' mo', unit: 'RUNWAY', decimals: 0 },
    { value: 65, prefix: '', suffix: '%', unit: 'GROSS MARGIN', decimals: 0 },
    { value: 11, prefix: 'AED ', suffix: 'M', unit: 'SERIES A TARGET', decimals: 0 },
  ]

  return (
    <div
      ref={ref}
      className="grid grid-cols-2 md:grid-cols-4"
      style={{ gap: 1, backgroundColor: 'rgba(245,241,232,0.08)', borderTop: INV_BORDER, marginTop: 48 }}
    >
      {metrics.map((m, i) => (
        <motion.div
          key={m.unit}
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: i * 0.1, ease: [0.25, 0, 0.2, 1] }}
          className="px-8 py-8"
          style={{ backgroundColor: '#0e0e0e' }}
        >
          <p className="font-display mb-1" style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', letterSpacing: '-0.04em', lineHeight: 1, color: ACCENT }}>
            {inView
              ? <><span style={{ fontSize: '0.55em', opacity: 0.7 }}>{m.prefix}</span><CountUp to={m.value} decimals={m.decimals} suffix={m.suffix} duration={1.2 + i * 0.1} /></>
              : <>{m.prefix}0{m.suffix}</>
            }
          </p>
          <p className="font-sans text-label uppercase tracking-[0.16em] mt-2" style={{ opacity: 0.35, fontSize: '0.625rem' }}>{m.unit}</p>
        </motion.div>
      ))}
    </div>
  )
}

// ─── Investor platform expansion ──────────────────────────────────────────────

const PLATFORM_TIERS = [
  {
    index: '01', name: 'Acoustic + Pressed Boards', note: '2026 — Active', width: '32%', status: 'active',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" width={16} height={16}>
        <rect x="2" y="4" width="16" height="12" rx="1.5" />
        <path d="M6 9.5 Q8 7 10 9.5 Q12 12 14 9.5" />
      </svg>
    ),
  },
  {
    index: '02', name: 'Certified Specification Channel', note: '2027 — Next', width: '55%', status: 'next',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" width={16} height={16}>
        <circle cx="10" cy="10" r="7.5" />
        <polyline points="6.5,10 9,12.5 13.5,7" />
      </svg>
    ),
  },
  {
    index: '03', name: 'Packaging + Thermal', note: '2028 — Future', width: '75%', status: 'future',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" width={16} height={16}>
        <path d="M3 7L10 3.5L17 7V13L10 16.5L3 13V7Z" />
        <line x1="10" y1="3.5" x2="10" y2="10" />
        <line x1="3" y1="7" x2="10" y2="10" />
        <line x1="17" y1="7" x2="10" y2="10" />
      </svg>
    ),
  },
  {
    index: '04', name: 'Licensing + Regional Expansion', note: '2028+ — Long-term', width: '100%', status: 'future',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" width={16} height={16}>
        <circle cx="10" cy="10" r="2.5" />
        <circle cx="4" cy="4.5" r="1.5" />
        <circle cx="16" cy="4.5" r="1.5" />
        <circle cx="4" cy="15.5" r="1.5" />
        <circle cx="16" cy="15.5" r="1.5" />
        <line x1="7.8" y1="8.2" x2="5.2" y2="6" />
        <line x1="12.2" y1="8.2" x2="14.8" y2="6" />
        <line x1="7.8" y1="11.8" x2="5.2" y2="14" />
        <line x1="12.2" y1="11.8" x2="14.8" y2="14" />
      </svg>
    ),
  },
]

function PlatformExpansion() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px' })

  return (
    <div ref={ref} className="mt-16" style={{ borderTop: INV_BORDER }}>
      <p className="font-sans text-label uppercase tracking-[0.18em] mt-10 mb-12" style={{ opacity: 0.35 }}>
        Platform expansion — 2026 to long-term
      </p>
      <div>
        {PLATFORM_TIERS.map((tier, i) => {
          const isActive = tier.status === 'active'
          const isNext = tier.status === 'next'
          const barColor = isActive ? ACCENT : isNext ? 'rgba(245,241,232,0.42)' : 'rgba(245,241,232,0.16)'
          const nameOpacity = isActive ? 1 : isNext ? 0.65 : 0.42
          return (
            <motion.div
              key={tier.index}
              initial={{ opacity: 0, x: -16 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.25, 0, 0.2, 1] }}
              className="flex items-center gap-6 py-6"
              style={{ borderBottom: i < PLATFORM_TIERS.length - 1 ? INV_BORDER_SUBTLE : 'none' }}
            >
              {/* Index + icon */}
              <div className="flex-shrink-0 flex flex-col items-center gap-1.5" style={{ width: 40 }}>
                <span className="font-sans text-label uppercase tracking-[0.18em]" style={{ opacity: isActive ? 0.9 : 0.25, color: isActive ? ACCENT : undefined, fontSize: '0.5625rem' }}>{tier.index}</span>
                <div style={{ opacity: isActive ? 0.9 : isNext ? 0.45 : 0.22, color: isActive ? ACCENT : 'rgba(245,241,232,1)' }}>
                  {tier.icon}
                </div>
              </div>
              {/* Bar + label */}
              <div className="flex-1 min-w-0">
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={inView ? { scaleX: 1 } : {}}
                  transition={{ duration: 0.85, delay: i * 0.12 + 0.1, ease: [0.25, 0, 0.2, 1] }}
                  style={{ width: tier.width, height: isActive ? 3 : 1.5, backgroundColor: barColor, marginBottom: 12, transformOrigin: 'left', boxShadow: isActive ? `0 0 10px ${ACCENT}55` : 'none' }}
                />
                <div className="flex flex-wrap items-baseline gap-3">
                  <p className="font-display" style={{ fontSize: 'clamp(1rem, 1.8vw, 1.375rem)', letterSpacing: '-0.02em', opacity: nameOpacity, color: isActive ? undefined : undefined }}>{tier.name}</p>
                  <span className="font-sans text-label uppercase tracking-[0.14em]" style={{ opacity: isActive ? 0.65 : isNext ? 0.35 : 0.22, color: isActive ? ACCENT : undefined }}>{tier.note}</span>
                </div>
              </div>
              {/* Active pulse dot */}
              {isActive && <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: ACCENT, flexShrink: 0, boxShadow: `0 0 8px ${ACCENT}88` }} />}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Revenue Engines ──────────────────────────────────────────────────────────

function RevenueEngines({ data }: { data: InvestorContent['revenue_engines'] }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px' })
  const statusColor: Record<string, string> = { active: 'rgba(245,241,232,1)', next: 'rgba(245,241,232,0.5)', future: 'rgba(245,241,232,0.2)' }

  return (
    <div ref={ref} className="mt-16" style={{ borderTop: INV_BORDER }}>
      <p className="font-sans text-label uppercase tracking-[0.18em] mt-10 mb-12" style={{ opacity: 0.35 }}>
        Four revenue engines — one platform
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 1, backgroundColor: 'rgba(245,241,232,0.1)' }}>
        {data.engines.map((engine, i) => (
          <motion.div
            key={engine.id}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.1, ease: [0.25, 0, 0.2, 1] }}
            className="p-10"
            style={{ backgroundColor: '#0e0e0e' }}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: statusColor[engine.status], flexShrink: 0, marginTop: 2 }} />
                <p className="font-sans text-label uppercase tracking-[0.18em]" style={{ opacity: 0.35 }}>{engine.id}</p>
              </div>
              <span
                className="font-sans text-label uppercase tracking-[0.12em] px-2 py-0.5"
                style={{
                  opacity: engine.status === 'active' ? 1 : 0.35,
                  color: engine.status === 'active' ? ACCENT : undefined,
                  border: engine.status === 'active' ? `1px solid ${ACCENT}55` : '1px solid rgba(245,241,232,0.15)',
                  borderRadius: 2,
                }}
              >
                {engine.status === 'active' ? 'Active' : engine.status === 'next' ? 'Phase 2' : 'Phase 3'}
              </span>
            </div>
            <p className="font-display text-2xl md:text-3xl mb-3" style={{ letterSpacing: '-0.02em', fontWeight: 700 }}>{engine.name}</p>
            <p className="font-sans text-base leading-[1.75] mb-8" style={{ opacity: 0.5 }}>{engine.desc}</p>
            <div className="grid grid-cols-3 gap-4 pt-6" style={{ borderTop: INV_BORDER_SUBTLE }}>
              <div>
                <p className="font-sans text-label uppercase tracking-[0.14em] mb-1" style={{ opacity: 0.3 }}>Price</p>
                <p className="font-display text-base md:text-lg" style={{ letterSpacing: '-0.015em' }}>{engine.price}</p>
              </div>
              <div>
                <p className="font-sans text-label uppercase tracking-[0.14em] mb-1" style={{ opacity: 0.3 }}>Margin</p>
                <p className="font-display text-xl md:text-2xl" style={{ letterSpacing: '-0.025em', color: engine.status === 'active' ? ACCENT : undefined, opacity: engine.status === 'active' ? 1 : 0.85 }}>{engine.margin}</p>
              </div>
              <div>
                <p className="font-sans text-label uppercase tracking-[0.14em] mb-1" style={{ opacity: 0.3 }}>Activation</p>
                <p className="font-display text-base" style={{ opacity: 0.75, color: engine.status === 'active' ? ACCENT : undefined }}>{engine.activation}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ─── Revenue Chart ────────────────────────────────────────────────────────────

function RevenueChart({ data }: { data: InvestorContent['revenue_chart'] }) {
  const ref = useRef(null)
  const MAX_VAL = 35

  return (
    <div ref={ref} className="mt-20" style={{ borderTop: INV_BORDER }}>
      <p className="font-sans text-label uppercase tracking-[0.18em] mt-10 mb-4" style={{ opacity: 0.35 }}>
        {data.label}
      </p>
      <h3 className="font-display mb-14" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.75rem)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
        {data.heading}
      </h3>
      <div className="rounded-sm px-4 py-8 md:px-8 md:py-10" style={{ border: INV_BORDER_SUBTLE, backgroundColor: 'rgba(245,241,232,0.03)' }}>
        <div className="flex items-end gap-4 md:gap-10" style={{ height: 'clamp(340px, 38vw, 430px)' }}>
          {data.years.map((yr, i) => {
            const lowPct = (yr.low / MAX_VAL) * 100
            const highPct = (yr.high / MAX_VAL) * 100
            const displayLowPct = yr.low > 0 ? Math.max(lowPct, 6) : 0
            const displayHighPct = Math.max(highPct, displayLowPct + (yr.high > yr.low ? 4.5 : 0))
            const displayRangePct = Math.max(displayHighPct - displayLowPct, yr.high > yr.low ? 4.5 : 0)
            const isLast = i === data.years.length - 1

            return (
              <div key={yr.year} className="flex-1 flex flex-col items-center gap-4" style={{ height: '100%' }}>
                <div className="flex-1 flex flex-col justify-end w-full" style={{ position: 'relative', maxWidth: 240, margin: '0 auto' }}>
                  <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 1, backgroundColor: 'rgba(245,241,232,0.08)' }} />
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '0px' }}
                    transition={{ duration: 0.4, delay: 0.8 + i * 0.15 }}
                    style={{ position: 'absolute', bottom: `${displayHighPct + 3}%`, left: 0, right: 0, textAlign: 'center' }}
                  >
                    <span className="font-sans" style={{ fontSize: 11, opacity: 0.58, letterSpacing: '0.08em', color: isLast ? ACCENT : undefined }}>
                      <CountUp to={yr.high} suffix="M" prefix="AED " duration={1.2 + i * 0.1} />
                    </span>
                  </motion.div>

                  <motion.div
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true, margin: '0px' }}
                    transition={{ duration: 0.75, delay: 0.25 + i * 0.15, ease: [0.25, 0, 0.2, 1] }}
                    style={{
                      position: 'absolute',
                      bottom: `${displayLowPct}%`,
                      left: 0,
                      right: 0,
                      height: `${displayRangePct}%`,
                      backgroundColor: isLast ? `${ACCENT}4d` : 'rgba(245,241,232,0.22)',
                      boxShadow: 'inset 0 0 0 1px rgba(245,241,232,0.07)',
                      transformOrigin: 'bottom',
                    }}
                  />
                  <motion.div
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true, margin: '0px' }}
                    transition={{ duration: 0.75, delay: 0.15 + i * 0.15, ease: [0.25, 0, 0.2, 1] }}
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: `${displayLowPct}%`,
                      backgroundColor: isLast ? ACCENT : i === 0 ? 'rgba(245,241,232,0.52)' : 'rgba(245,241,232,0.78)',
                      boxShadow: 'inset 0 0 0 1px rgba(245,241,232,0.08)',
                      transformOrigin: 'bottom',
                    }}
                  />
                </div>
                <div className="text-center">
                  <p className="font-display text-base md:text-lg" style={{ letterSpacing: '-0.01em', opacity: isLast ? 1 : 0.8, color: isLast ? ACCENT : undefined }}>{yr.label}</p>
                  <p className="font-sans text-label uppercase tracking-[0.16em] mt-1.5" style={{ opacity: 0.42 }}>{yr.year}</p>
                  {yr.year === 'Y1' && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '0px' }}
                      transition={{ duration: 0.5, delay: 0.7 }}
                      className="mt-4 inline-block px-3.5 py-3"
                      style={{ border: '1.5px solid rgba(245,241,232,0.32)', backgroundColor: 'rgba(245,241,232,0.06)', minWidth: 110 }}
                    >
                      <p className="font-sans uppercase tracking-[0.14em]" style={{ fontSize: 7, color: 'rgba(245,241,232,0.64)', whiteSpace: 'nowrap' }}>Current Raise</p>
                      <p className="font-display" style={{ fontSize: 16, color: 'rgba(245,241,232,0.84)', letterSpacing: '-0.02em', lineHeight: 1.1, marginTop: 4 }}>AED 2.2M</p>
                    </motion.div>
                  )}
                  {yr.year === 'Y3' && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '0px' }}
                      transition={{ duration: 0.5, delay: 1.0 }}
                      className="mt-4 inline-block px-3.5 py-3"
                      style={{ border: `1.5px solid ${ACCENT}88`, backgroundColor: `${ACCENT}18`, minWidth: 110 }}
                    >
                      <p className="font-sans uppercase tracking-[0.14em]" style={{ fontSize: 7, color: ACCENT, opacity: 0.76, whiteSpace: 'nowrap' }}>Series A</p>
                      <p className="font-display" style={{ fontSize: 18, color: ACCENT, letterSpacing: '-0.02em', lineHeight: 1.1, marginTop: 4 }}>AED 11M</p>
                    </motion.div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div className="mt-8 flex items-center gap-6" style={{ opacity: 0.46 }}>
        <div className="flex items-center gap-2">
          <div style={{ width: 12, height: 12, backgroundColor: 'rgba(245,241,232,0.7)' }} />
          <p className="font-sans text-label uppercase tracking-[0.12em]">Base case</p>
        </div>
        <div className="flex items-center gap-2">
          <div style={{ width: 12, height: 12, backgroundColor: 'rgba(245,241,232,0.25)' }} />
          <p className="font-sans text-label uppercase tracking-[0.12em]">Upside range</p>
        </div>
      </div>
      <p className="font-sans text-label mt-5" style={{ opacity: 0.32 }}>
        * Projections assume successful certification by month 18 and activation of E3 specification channel. Base case excludes licensing revenue.
      </p>
    </div>
  )
}

// ─── Competitive Grid ─────────────────────────────────────────────────────────

function CompetitiveGrid({ data }: { data: InvestorContent['competitive'] }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px' })

  const CheckIcon = ({ val, highlight }: { val: boolean; highlight?: boolean }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: 36 }}>
      {val ? (
        <svg viewBox="0 0 16 16" fill="none" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" width={15} height={15}
          stroke={highlight ? ACCENT : 'rgba(245,241,232,0.75)'}>
          <polyline points="2,8 6,12 14,4" />
        </svg>
      ) : (
        <svg viewBox="0 0 16 16" fill="none" strokeWidth={1.8} strokeLinecap="round" width={13} height={13}
          stroke="rgba(245,241,232,0.22)">
          <line x1="4" y1="4" x2="12" y2="12" /><line x1="12" y1="4" x2="4" y2="12" />
        </svg>
      )}
    </div>
  )

  const COL_W = 80

  return (
    <div ref={ref} className="mt-20" style={{ borderTop: INV_BORDER }}>
      <p className="font-sans text-label uppercase tracking-[0.18em] mt-10 mb-4" style={{ opacity: 0.35 }}>
        {data.label}
      </p>
      <h3 className="font-display mb-12" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.75rem)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
        {data.heading}
      </h3>
      <div className="overflow-x-auto">
        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed', minWidth: 620 }}>
          <colgroup>
            <col style={{ width: 'auto' }} />
            {(['Bio-based', 'GCC Local', 'Certified', 'UAE Feedstock', 'Design-Led'] as const).map(c => (
              <col key={c} style={{ width: COL_W }} />
            ))}
            <col style={{ width: 110 }} />
          </colgroup>
          <thead>
            <tr style={{ borderBottom: INV_BORDER }}>
              <th className="font-sans text-label uppercase tracking-[0.14em] text-left py-4 pr-6 pl-2" style={{ opacity: 0.35, fontSize: '0.5625rem' }}>Player</th>
              {['Bio-based', 'GCC Local', 'Certified', 'UAE Feedstock', 'Design-Led'].map(col => (
                <th key={col} className="font-sans text-label uppercase tracking-[0.1em] text-center py-4" style={{ opacity: 0.35, fontSize: '0.5625rem' }}>{col}</th>
              ))}
              <th className="font-sans text-label uppercase tracking-[0.1em] text-center py-4 pr-2" style={{ opacity: 0.35, fontSize: '0.5625rem' }}>Price / m²</th>
            </tr>
          </thead>
          <tbody>
            {data.players.map((player, i) => (
              <motion.tr
                key={player.name}
                initial={{ opacity: 0, x: -10 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.09, ease: [0.25, 0, 0.2, 1] }}
                style={{
                  borderBottom: i < data.players.length - 1 ? INV_BORDER_SUBTLE : 'none',
                  backgroundColor: player.numu ? `${ACCENT}10` : 'transparent',
                  boxShadow: player.numu ? `inset 3px 0 0 ${ACCENT}` : 'none',
                }}
              >
                <td className="py-4 pr-4 pl-4">
                  <div className="flex items-center gap-3">
                    {player.numu && (
                      <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: ACCENT, flexShrink: 0, boxShadow: `0 0 7px ${ACCENT}88` }} />
                    )}
                    <div>
                      <p className="font-display" style={{ fontSize: '1rem', opacity: player.numu ? 1 : 0.6, color: player.numu ? ACCENT : undefined }}>{player.name}</p>
                      <p className="font-sans" style={{ fontSize: '0.6875rem', opacity: 0.28, marginTop: 1 }}>{player.origin}</p>
                    </div>
                  </div>
                </td>
                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}><CheckIcon val={player.bio} highlight={player.numu} /></td>
                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}><CheckIcon val={player.local} highlight={player.numu} /></td>
                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}><CheckIcon val={player.certified} highlight={player.numu} /></td>
                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}><CheckIcon val={player.feedstock} highlight={player.numu} /></td>
                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}><CheckIcon val={player.design} highlight={player.numu} /></td>
                <td style={{ textAlign: 'center', verticalAlign: 'middle', paddingRight: 8 }}>
                  <p className="font-sans text-sm" style={{ opacity: player.numu ? 1 : 0.45, color: player.numu ? ACCENT : undefined }}>{player.price}</p>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="font-sans text-label mt-6" style={{ opacity: 0.25 }}>
        * NUMU certification in progress — acoustic + fire performance testing initiated
      </p>
    </div>
  )
}

// ─── Market TAM/SAM/SOM diagram ──────────────────────────────────────────────

const MARKET_TAM_DATA = [
  {
    phase: '01', label: 'UAE Acoustic', period: '2026 — Beachhead',
    tam: 'AED 200–300M', sam: 'AED 60M', som: 'AED 15M',
    tamR: 60, samR: 38, somR: 21, active: true,
  },
  {
    phase: '02', label: 'GCC Acoustic Spec', period: '2027 — Certification',
    tam: 'AED 1.5B', sam: 'AED 350M', som: 'AED 50M',
    tamR: 78, samR: 48, somR: 25, active: false,
  },
  {
    phase: '03', label: 'GCC Multi-material', period: '2028 — Platform',
    tam: 'AED 6B+', sam: 'AED 1.2B', som: 'AED 150M',
    tamR: 97, samR: 59, somR: 29, active: false,
  },
  {
    phase: '04', label: 'Regional Licensing', period: '2029+ — Full Scale',
    tam: 'AED 20B+', sam: 'AED 4B', som: 'AED 400M',
    tamR: 120, samR: 74, somR: 37, active: false,
  },
]

// Grey-to-gold gradient: phase 01 = muted grey, phase 04 = warm ACCENT gold
const PHASE_COLORS = [
  { tamStroke: 'rgba(245,241,232,0.22)', samStroke: 'rgba(245,241,232,0.34)', somStroke: 'rgba(245,241,232,0.46)', somFill: 'rgba(245,241,232,0.06)', tamFill: 'rgba(245,241,232,0.02)', text: 'rgba(245,241,232,0.42)' },
  { tamStroke: 'rgba(215,200,174,0.40)', samStroke: 'rgba(215,200,174,0.55)', somStroke: 'rgba(215,200,174,0.68)', somFill: 'rgba(215,200,174,0.09)', tamFill: 'rgba(215,200,174,0.03)', text: 'rgba(215,200,174,0.60)' },
  { tamStroke: 'rgba(192,168,134,0.62)', samStroke: 'rgba(192,168,134,0.78)', somStroke: 'rgba(192,168,134,0.90)', somFill: 'rgba(192,168,134,0.12)', tamFill: 'rgba(192,168,134,0.05)', text: 'rgba(192,168,134,0.80)' },
  { tamStroke: ACCENT, samStroke: ACCENT, somStroke: ACCENT, somFill: `${ACCENT}30`, tamFill: `${ACCENT}0e`, text: ACCENT },
]

function MarketTAMDiagram() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px' })
  const SVG_W = 900
  const SVG_H = 380
  const CY = 162
  const centers = [108, 310, 530, 762]

  return (
    <div ref={ref} className="mt-16" style={{ borderTop: INV_BORDER }}>
      <p className="font-sans text-label uppercase tracking-[0.18em] mt-10 mb-10" style={{ opacity: 0.35 }}>
        Market phases — addressable opportunity expands as platform activates
      </p>
      <div style={{ overflowX: 'auto', overflowY: 'hidden' }}>
        <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} style={{ width: '100%', maxWidth: SVG_W, display: 'block', minWidth: 420, margin: '0 auto' }}>
          {MARKET_TAM_DATA.map((p, i) => {
            const cx = centers[i]
            const isLast = i === MARKET_TAM_DATA.length - 1
            const tamCirc = 2 * Math.PI * p.tamR
            const samCirc = 2 * Math.PI * p.samR
            const somCirc = 2 * Math.PI * p.somR
            const col = PHASE_COLORS[i]
            return (
              <g key={p.phase}>
                {/* TAM — outer fill */}
                <motion.circle
                  cx={cx} cy={CY} r={p.tamR}
                  fill={col.tamFill}
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.18 + 0.1 }}
                />
                {/* TAM — outer stroke */}
                <motion.circle
                  cx={cx} cy={CY} r={p.tamR}
                  fill="none"
                  stroke={col.tamStroke}
                  strokeWidth={isLast ? 1.4 : 0.8}
                  strokeDasharray={tamCirc}
                  initial={{ strokeDashoffset: tamCirc }}
                  animate={inView ? { strokeDashoffset: 0 } : {}}
                  transition={{ duration: 1.0, delay: i * 0.18 + 0.1, ease: [0.25, 0, 0.2, 1] }}
                  transform={`rotate(-90 ${cx} ${CY})`}
                />
                {/* SAM — middle stroke */}
                <motion.circle
                  cx={cx} cy={CY} r={p.samR}
                  fill="none"
                  stroke={col.samStroke}
                  strokeWidth={isLast ? 1.6 : 1.0}
                  strokeDasharray={samCirc}
                  initial={{ strokeDashoffset: samCirc }}
                  animate={inView ? { strokeDashoffset: 0 } : {}}
                  transition={{ duration: 0.85, delay: i * 0.18 + 0.35, ease: [0.25, 0, 0.2, 1] }}
                  transform={`rotate(-90 ${cx} ${CY})`}
                />
                {/* SOM — inner fill + stroke */}
                <motion.circle
                  cx={cx} cy={CY} r={p.somR}
                  fill={col.somFill}
                  stroke={col.somStroke}
                  strokeWidth={isLast ? 2 : 1.2}
                  strokeDasharray={somCirc}
                  initial={{ strokeDashoffset: somCirc }}
                  animate={inView ? { strokeDashoffset: 0 } : {}}
                  transition={{ duration: 0.65, delay: i * 0.18 + 0.55, ease: [0.25, 0, 0.2, 1] }}
                  transform={`rotate(-90 ${cx} ${CY})`}
                />
                {/* Beachhead / end-market badges */}
                {(p.active || isLast) && (
                  <motion.text
                    x={cx} y={CY - p.tamR - 20}
                    textAnchor="middle"
                    fontFamily="'Inter', sans-serif"
                    fontSize={7}
                    fill={ACCENT}
                    letterSpacing={1.4}
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.4, delay: i * 0.18 + 0.65 }}
                  >
                    {p.active ? '← START HERE' : 'FULL SCALE →'}
                  </motion.text>
                )}
                {/* Phase number */}
                <motion.text
                  x={cx} y={CY - p.tamR - 8}
                  textAnchor="middle"
                  fontFamily="'Inter', sans-serif"
                  fontSize={7.5}
                  fill={col.text}
                  letterSpacing={1.8}
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.4, delay: i * 0.18 + 0.7 }}
                >
                  {p.phase}
                </motion.text>
                {/* TAM value below */}
                <motion.text
                  x={cx} y={CY + p.tamR + 20}
                  textAnchor="middle"
                  fontFamily="'Playfair Display', Georgia, serif"
                  fontSize={isLast ? 11.5 : i === 0 ? 10 : 9.5}
                  fill={col.text}
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.4, delay: i * 0.18 + 0.8 }}
                >
                  {p.tam}
                </motion.text>
                {/* Category label */}
                <motion.text
                  x={cx} y={CY + p.tamR + 36}
                  textAnchor="middle"
                  fontFamily="'Inter', sans-serif"
                  fontSize={7}
                  fill={col.text}
                  letterSpacing={1.2}
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.4, delay: i * 0.18 + 0.9 }}
                >
                  {p.label.toUpperCase()}
                </motion.text>
              </g>
            )
          })}
        </svg>
      </div>
      {/* Legend */}
      <div className="mt-8 flex items-center gap-8" style={{ opacity: 0.38 }}>
        {[
          { label: 'TAM', w: 14, h: 14, bg: 'transparent', border: '1px solid rgba(245,241,232,0.45)', radius: '50%' },
          { label: 'SAM', w: 11, h: 11, bg: 'transparent', border: '1px solid rgba(245,241,232,0.45)', radius: '50%' },
          { label: 'SOM', w: 7, h: 7, bg: 'rgba(245,241,232,0.45)', border: 'none', radius: '50%' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-2">
            <div style={{ width: item.w, height: item.h, backgroundColor: item.bg, border: item.border, borderRadius: item.radius, flexShrink: 0 }} />
            <p className="font-sans text-label uppercase tracking-[0.12em]">{item.label}</p>
          </div>
        ))}
      </div>
      {/* Phase detail rows */}
      <div className="mt-12">
        {MARKET_TAM_DATA.map((p, i) => {
          const rowCol = PHASE_COLORS[i]
          return (
            <motion.div
              key={p.phase}
              className="flex items-start gap-6 py-5"
              initial={{ opacity: 0, x: 16 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.12 + 0.6, ease: [0.25, 0, 0.2, 1] }}
              style={{ borderBottom: i < MARKET_TAM_DATA.length - 1 ? INV_BORDER_SUBTLE : 'none' }}
            >
              <p className="font-sans text-label uppercase tracking-[0.14em] flex-shrink-0 w-8" style={{ color: rowCol.text }}>{p.phase}</p>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-1">
                  <p className="font-display" style={{ fontSize: 'clamp(1.25rem, 2vw, 1.75rem)', letterSpacing: '-0.025em', lineHeight: 1, color: rowCol.text }}>{p.tam}</p>
                  <p className="font-sans text-label uppercase tracking-[0.12em]" style={{ color: rowCol.text, opacity: 0.65 }}>{p.period}</p>
                </div>
                <p className="font-sans text-sm" style={{ opacity: 0.38 }}>{p.label}</p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Investor roadmap ─────────────────────────────────────────────────────────

function Roadmap({ phases }: { phases: InvestorContent['roadmap']['phases'] }) {
  return (
    <div className="mt-16">
      {/* Horizontal timeline */}
      <div className="hidden md:flex items-center mb-0 px-0 relative" style={{ height: 48 }}>
        {/* Background track */}
        <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 1, backgroundColor: 'rgba(245,241,232,0.1)' }} />
        {/* Animated fill line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: '0px' }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.25, 0, 0.2, 1] }}
          style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 2, backgroundColor: ACCENT, transformOrigin: 'left', marginTop: -1 }}
        />
        {/* Phase nodes */}
        {phases.map((phase, i) => (
          <div key={phase.year} style={{ position: 'absolute', left: `${(i / (phases.length - 1)) * 100}%`, top: '50%', transform: 'translate(-50%, -50%)' }}>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, margin: '0px' }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.35, ease: [0.25, 0, 0.2, 1] }}
              style={{
                width: i === 0 ? 14 : 10, height: i === 0 ? 14 : 10,
                borderRadius: '50%',
                backgroundColor: i === 0 ? ACCENT : 'rgba(245,241,232,0.4)',
                border: i === 0 ? `2px solid ${ACCENT}` : '1px solid rgba(245,241,232,0.3)',
                boxShadow: i === 0 ? `0 0 12px ${ACCENT}55` : 'none',
              }}
            />
          </div>
        ))}
      </div>

      {/* Phase columns */}
      <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 1, backgroundColor: 'rgba(245,241,232,0.12)' }}>
        {phases.map((phase, i) => (
          <motion.div
            key={phase.year}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px' }}
            transition={{ duration: 0.6, delay: i * 0.2, ease: [0.25, 0, 0.2, 1] }}
            className="p-10"
            style={{ backgroundColor: '#0e0e0e' }}
          >
            <p className="font-sans text-label uppercase tracking-[0.16em] mb-2" style={{ opacity: 0.35, color: i === 0 ? ACCENT : undefined }}>{phase.year}</p>
            <p className="font-display text-2xl md:text-3xl mb-8" style={{ letterSpacing: '-0.025em', fontWeight: 700, opacity: i === 0 ? 1 : 0.65 }}>{phase.label}</p>
            <div>
              {phase.items.map((item, j) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '0px' }}
                  transition={{ duration: 0.4, delay: i * 0.1 + j * 0.06, ease: [0.25, 0, 0.2, 1] }}
                  className="flex items-start gap-4 py-3.5"
                  style={{ borderBottom: j < phase.items.length - 1 ? INV_BORDER_SUBTLE : 'none' }}
                >
                  <span style={{ opacity: i === 0 ? 0.6 : 0.25, flexShrink: 0, marginTop: 3, color: i === 0 ? ACCENT : undefined }}>—</span>
                  <p className="font-sans text-base leading-snug" style={{ opacity: i === 0 ? 0.85 : 0.55 }}>{item}</p>
                </motion.div>
              ))}
            </div>
            {i === 0 && (
              <div className="mt-8 pt-5" style={{ borderTop: INV_BORDER_SUBTLE }}>
                <div className="flex items-center gap-2">
                  <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: ACCENT, animation: 'process-pulse 2s ease-out infinite' }} />
                  <p className="font-sans text-label uppercase tracking-[0.14em]" style={{ opacity: 0.55, color: ACCENT }}>Active phase</p>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ─── Investor business model ──────────────────────────────────────────────────

function BusinessModelStreams() {
  return (
    <div className="mt-16" style={{ borderTop: INV_BORDER }}>
      <div className="mt-10 mb-12 flex justify-center">
        <div className="w-full max-w-[920px] rounded-sm px-6 py-8 md:px-10 md:py-10" style={{ border: INV_BORDER_SUBTLE, backgroundColor: 'rgba(245,241,232,0.03)' }}>
          <p className="font-sans text-label uppercase tracking-[0.18em] mb-6 text-center" style={{ opacity: 0.38 }}>
            Platform monetization structure
          </p>
          <div className="md:hidden">
            <div
              className="rounded-sm px-4 py-5"
              style={{ border: '1px solid rgba(245,241,232,0.08)', backgroundColor: 'rgba(245,241,232,0.02)' }}
            >
              <div className="flex justify-center">
                <div
                  className="px-4 py-3"
                  style={{ border: `1px solid ${ACCENT}`, backgroundColor: `${ACCENT}14`, borderRadius: 4 }}
                >
                  <p className="font-sans uppercase tracking-[0.16em] text-center" style={{ fontSize: '0.625rem', color: ACCENT }}>
                    Mycelium Platform
                  </p>
                </div>
              </div>
              <div className="mx-auto" style={{ width: 1, height: 18, backgroundColor: 'rgba(245,241,232,0.22)' }} />
              <div className="grid grid-cols-1 gap-3">
                <div
                  className="px-4 py-4"
                  style={{ border: `1px solid ${ACCENT}88`, backgroundColor: `${ACCENT}12`, borderRadius: 4 }}
                >
                  <p className="font-sans uppercase tracking-[0.14em] mb-2" style={{ fontSize: '0.625rem', color: ACCENT, opacity: 0.82 }}>
                    Design Products
                  </p>
                  <p className="font-sans" style={{ fontSize: '0.875rem', lineHeight: 1.6, opacity: 0.72 }}>
                    High-margin direct products sold into near-term architecture and design demand.
                  </p>
                </div>
                <div
                  className="px-4 py-4"
                  style={{ border: '1px solid rgba(245,241,232,0.16)', backgroundColor: 'rgba(245,241,232,0.03)', borderRadius: 4 }}
                >
                  <p className="font-sans uppercase tracking-[0.14em] mb-2" style={{ fontSize: '0.625rem', opacity: 0.62 }}>
                    Material Licensing
                  </p>
                  <p className="font-sans" style={{ fontSize: '0.875rem', lineHeight: 1.6, opacity: 0.58 }}>
                    Scalable platform licensing to regional manufacturers without proportional capex.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <svg className="hidden md:block" viewBox="0 0 760 180" style={{ width: '100%', maxWidth: 760, margin: '0 auto' }}>
            <motion.rect x={290} y={18} width={180} height={40} rx={3}
              fill={`${ACCENT}14`} stroke={ACCENT} strokeWidth={1.25}
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
            />
            <text x={380} y={43} textAnchor="middle" fontFamily="'Inter',sans-serif" fontSize={11} fill={ACCENT} fillOpacity={0.9} letterSpacing={1.5}>MYCELIUM PLATFORM</text>

            <motion.line x1={380} y1={58} x2={380} y2={84}
              stroke={ACCENT} strokeWidth={1.3}
              initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.3 }}
            />
            <motion.line x1={190} y1={84} x2={570} y2={84}
              stroke="rgba(245,241,232,0.2)" strokeWidth={1}
              initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.4 }}
            />
            <motion.line x1={190} y1={84} x2={190} y2={108}
              stroke={ACCENT} strokeWidth={1.3}
              initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.55 }}
            />
            <motion.line x1={570} y1={84} x2={570} y2={108}
              stroke="rgba(245,241,232,0.34)" strokeWidth={1.05}
              initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.6 }}
            />

            <motion.rect x={54} y={108} width={272} height={34} rx={2.5}
              fill={`${ACCENT}12`} stroke={ACCENT} strokeWidth={1.05}
              initial={{ opacity: 0, y: 5 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.7 }}
            />
            <text x={190} y={130} textAnchor="middle" fontFamily="'Inter',sans-serif" fontSize={10.5} fill={ACCENT} fillOpacity={0.88} letterSpacing={1.1}>DESIGN PRODUCTS — HIGH MARGIN</text>

            <motion.rect x={434} y={108} width={272} height={34} rx={2.5}
              fill="rgba(245,241,232,0.04)" stroke="rgba(245,241,232,0.28)" strokeWidth={0.95}
              initial={{ opacity: 0, y: 5 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.75 }}
            />
            <text x={570} y={130} textAnchor="middle" fontFamily="'Inter',sans-serif" fontSize={10.5} fill="rgba(245,241,232,0.62)" letterSpacing={1.1}>MATERIAL LICENSING — SCALABLE</text>
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 1, backgroundColor: 'rgba(245,241,232,0.12)' }}>
        {[
          { stream: 'Stream 01', title: 'Design Products', desc: 'Grown acoustic panels and pressed composite boards sold direct to interior designers, architects, and events clients. Two production routes, one material system. High margin. Immediate market. Brand-establishing.', bullets: ['Direct sale', 'High margin', 'Near-term revenue'], accent: true },
          { stream: 'Stream 02', title: 'Material Licensing', desc: 'Licensing the material platform to regional manufacturers. Scalable without proportional capex. Compounds proprietary IP.', bullets: ['Platform fee', 'Scalable', 'Long-term compounding'], accent: false },
        ].map(s => (
          <div key={s.stream} className="p-10 md:p-16" style={{ backgroundColor: '#0f0f0d' }}>
            <p className="font-sans text-label uppercase tracking-[0.18em] mb-8" style={{ opacity: 0.4, color: s.accent ? ACCENT : undefined }}>{s.stream}</p>
            <p className="font-display text-[2rem] md:text-[2.6rem] mb-6" style={{ letterSpacing: '-0.03em', opacity: s.accent ? 1 : 0.8 }}>{s.title}</p>
            <p className="font-sans text-base md:text-[1.0625rem] leading-[1.85] mb-10" style={{ opacity: 0.68 }}>{s.desc}</p>
            <div style={{ borderTop: INV_BORDER_SUBTLE, paddingTop: 24 }}>
              {s.bullets.map(b => (
                <div key={b} className="flex items-center gap-3 mb-3">
                  <div style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: s.accent ? ACCENT : 'rgba(245,241,232,1)', opacity: s.accent ? 0.8 : 0.35 }} />
                  <p className="font-sans text-sm md:text-[0.9375rem]" style={{ opacity: 0.62 }}>{b}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Use of Funds Bars ────────────────────────────────────────────────────────

function UseOfFundsChart({ items }: { items: InvestorContent['use_of_funds']['items'] }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px' })
  return (
    <div ref={ref} className="mt-12">
      {items.map((item, i) => (
        <div key={item.label} className="flex items-center gap-5 py-4" style={{ borderBottom: i < items.length - 1 ? INV_BORDER_SUBTLE : 'none' }}>
          <p className="font-sans text-sm flex-shrink-0" style={{ width: 160, opacity: 0.65 }}>{item.label}</p>
          <div className="flex-1 relative" style={{ height: 4, backgroundColor: 'rgba(245,241,232,0.08)' }}>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 0.9, delay: i * 0.1, ease: [0.25, 0, 0.2, 1] }}
              style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${item.pct}%`, backgroundColor: 'rgba(245,241,232,0.8)', transformOrigin: 'left' }}
            />
          </div>
          <div className="flex-shrink-0 text-right" style={{ minWidth: 110 }}>
            <p className="font-display text-xl" style={{ letterSpacing: '-0.025em' }}>{item.pct}%</p>
            <p className="font-sans text-xs mt-0.5" style={{ opacity: 0.35 }}>{item.amount}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Team Grid ────────────────────────────────────────────────────────────────

function TeamMemberCard({ member, i, large }: { member: InvestorContent['team']['members'][0]; i: number; large?: boolean }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px' })
  const photoSrc = TEAM_PHOTO_MAP[member.imageKey]

  const PhotoSlot = () => (
    <div className="relative mb-8 overflow-hidden" style={{ aspectRatio: '4/5', backgroundColor: '#1e1b17', border: '1px solid rgba(245,241,232,0.08)' }}>
      {photoSrc ? (
        <Image
          src={photoSrc}
          alt={member.name}
          fill
          className="object-cover object-top"
          sizes="(max-width: 768px) 50vw, 25vw"
          style={{ filter: 'grayscale(100%) contrast(1.05)' }}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" width={20} height={20} style={{ opacity: 0.15 }}>
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <p className="font-sans text-label" style={{ fontSize: 9, opacity: 0.42, letterSpacing: '0.16em' }}>Portrait — archival</p>
        </div>
      )}
    </div>
  )

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: i * 0.1, ease: [0.25, 0, 0.2, 1] }}
      className="p-8 md:p-10"
      style={{ backgroundColor: '#0e0e0e' }}
    >
      <PhotoSlot />
      <p className="font-display mb-1" style={{ fontSize: large ? 'clamp(1.5rem, 2.5vw, 2rem)' : '1.25rem', fontWeight: 700 }}>{member.name}</p>
      <p className="font-sans text-label uppercase tracking-[0.14em] mb-5" style={{ opacity: 0.42 }}>{member.role}</p>
      <p className="font-sans leading-[1.75]" style={{ fontSize: large ? '0.9375rem' : '0.875rem', opacity: 0.58 }}>{member.bio}</p>
    </motion.div>
  )
}

function TeamGrid({ members }: { members: InvestorContent['team']['members'] }) {
  return (
    <div className="mt-16 grid grid-cols-2 md:grid-cols-4" style={{ gap: 1, backgroundColor: 'rgba(245,241,232,0.1)', borderTop: INV_BORDER }}>
      {members.map((m, i) => (
        <TeamMemberCard key={m.name} member={m} i={i} />
      ))}
    </div>
  )
}

function PublicTeamCard({ member }: { member: InvestorContent['team']['members'][0] }) {
  const photoSrc = PUBLIC_TEAM_PHOTO_MAP[member.imageKey] ?? TEAM_PHOTO_MAP[member.imageKey]

  return (
    <div className="h-full flex flex-col">
      {/* Fixed 4:5 portrait container — same for all four */}
      <div
        className="relative mb-5 overflow-hidden"
        style={{
          aspectRatio: '4/5',
          backgroundColor: '#f5f1e8',
          border: '1px solid rgba(26,23,20,0.08)',
        }}
      >
        {photoSrc && (
          <Image
            src={photoSrc}
            alt={member.name}
            fill
            className="object-cover object-top"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
          />
        )}
      </div>
      <div
        className="pt-4 px-1"
        style={{ borderTop: '1px solid rgba(26,23,20,0.08)' }}
      >
        <p className="font-display mb-1" style={{ fontSize: '1.35rem', lineHeight: 1.05, letterSpacing: '-0.02em' }}>
          {member.name}
        </p>
        <p className="font-sans uppercase tracking-[0.14em] mb-4" style={{ fontSize: '0.7rem', opacity: 0.58 }}>
          {member.role}
        </p>
        <p className="font-sans leading-[1.7]" style={{ fontSize: '0.9rem', opacity: 0.62 }}>
          {PUBLIC_TEAM_BLURBS[member.imageKey] ?? member.bio}
        </p>
      </div>
    </div>
  )
}

// ─── Founder Ecosystem ───────────────────────────────────────────────────────

function FounderEcosystem() {
  return (
    <div className="mt-14 pt-12" style={{ borderTop: INV_BORDER }}>
      <p className="font-sans text-label uppercase tracking-[0.18em] mb-6" style={{ opacity: 0.28 }}>
        Founder ecosystem
      </p>
      <p className="font-sans text-base leading-[1.8]" style={{ maxWidth: 680, opacity: 0.5 }}>
        Andy also holds cofounder positions in UFO (US, pressed mycelium composites) and Hyphen (US, bio-materials ecosystem). These relationships extend NUMU&apos;s long-term technology and IP pipeline without diverting operational focus. NUMU is the primary vehicle. Approximately 90% of operational time is dedicated to NUMU.
      </p>
    </div>
  )
}

// ─── Lab video (hover-to-play desktop, tap-to-play mobile) ───────────────────
const MAX_VIDEO_TIME = 90  // seconds — trim point

function LabVideo() {
  const containerRef = useRef<HTMLDivElement>(null)
  const ref = useRef<HTMLVideoElement>(null)
  const userPausedRef = useRef(false)
  const [playing, setPlaying] = useState(false)
  const [ready, setReady] = useState(false)
  const [progress, setProgress] = useState(0)
  const [hovering, setHovering] = useState(false)
  const inView = useInView(containerRef, { once: false, amount: 0.35 })

  const play = () => {
    const video = ref.current
    if (!video) return

    void video.play().then(() => {
      setPlaying(true)
    }).catch(() => {
      setPlaying(false)
    })
  }

  const pause = () => {
    ref.current?.pause()
    setPlaying(false)
  }

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation()

    if (playing) {
      userPausedRef.current = true
      pause()
      return
    }

    userPausedRef.current = false
    play()
  }

  useEffect(() => {
    const v = ref.current
    if (!v) return
    const onTime = () => {
      if (v.currentTime >= MAX_VIDEO_TIME) { v.currentTime = 0; v.play() }
      setProgress(Math.min(v.currentTime / MAX_VIDEO_TIME, 1))
    }
    v.addEventListener('timeupdate', onTime)
    return () => v.removeEventListener('timeupdate', onTime)
  }, [ready])

  useEffect(() => {
    if (!ready) return

    if (inView && !userPausedRef.current) {
      play()
      return
    }

    if (!inView && playing) {
      pause()
    }
  }, [inView, ready, playing])

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = e.currentTarget.getBoundingClientRect()
    const p = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    ref.current.currentTime = p * MAX_VIDEO_TIME
    setProgress(p)
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{ aspectRatio: '16/9', backgroundColor: 'rgba(128,128,128,0.05)' }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <video
        ref={ref}
        src="/videos/numu_story_enhanced.mp4"
        muted
        loop
        playsInline
        preload="metadata"
        poster="/images/products/biofoam_detail.png"
        onCanPlay={() => setReady(true)}
        onEnded={() => { if (ref.current) { ref.current.currentTime = 0; ref.current.play() } }}
        className="w-full h-full object-cover block"
        style={{ opacity: ready ? 1 : 0.92, transition: 'opacity 0.25s ease' }}
        suppressHydrationWarning
      />

      {/* Placeholder */}
      {!ready && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3" style={{ border: '1px solid rgba(128,128,128,0.1)', backgroundColor: 'rgba(26,23,20,0.08)' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" width={28} height={28} style={{ opacity: 0.18 }}>
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          <p className="font-sans uppercase tracking-[0.16em]" style={{ fontSize: '0.625rem', opacity: 0.4 }}>Loading process documentation</p>
        </div>
      )}

      {/* Play hint — only when ready and not yet played */}
      {ready && !playing && !hovering && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <p className="font-sans uppercase tracking-[0.18em]" style={{ fontSize: '0.625rem', opacity: 0.48 }}>Process documentation</p>
        </div>
      )}

      {/* Minimal hover controls — time bar + pause */}
      {ready && (
        <div
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            padding: '14px 16px 12px',
            background: 'linear-gradient(to top, rgba(0,0,0,0.52) 0%, transparent 100%)',
            opacity: hovering ? 1 : 0,
            transition: 'opacity 0.25s ease',
            display: 'flex', alignItems: 'center', gap: 12,
          }}
        >
          {/* Pause / play icon */}
          <button onClick={toggle} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
            {playing ? (
              <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
                <rect x="0" y="0" width="3.5" height="12" rx="1" fill="rgba(245,241,232,0.85)" />
                <rect x="6.5" y="0" width="3.5" height="12" rx="1" fill="rgba(245,241,232,0.85)" />
              </svg>
            ) : (
              <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
                <path d="M0 0L10 6L0 12Z" fill="rgba(245,241,232,0.85)" />
              </svg>
            )}
          </button>
          {/* Scrubber bar */}
          <div
            onClick={seek}
            style={{ flex: 1, height: 2, backgroundColor: 'rgba(245,241,232,0.2)', borderRadius: 1, cursor: 'pointer', position: 'relative' }}
          >
            <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${progress * 100}%`, backgroundColor: 'rgba(245,241,232,0.85)', borderRadius: 1, transition: 'width 0.25s linear' }} />
            {/* Playhead dot */}
            <div style={{ position: 'absolute', top: '50%', left: `${progress * 100}%`, transform: 'translate(-50%,-50%)', width: 7, height: 7, borderRadius: '50%', backgroundColor: 'rgba(245,241,232,0.95)' }} />
          </div>
          {/* Time remaining */}
          <p className="font-sans" style={{ fontSize: '0.5rem', opacity: 0.5, color: '#f5f1e8', flexShrink: 0, letterSpacing: '0.08em' }}>
            {Math.floor((1 - progress) * MAX_VIDEO_TIME)}s
          </p>
        </div>
      )}
    </div>
  )
}

// ─── Explore CTA ──────────────────────────────────────────────────────────────

function ExploreCTA() {
  return (
    <VSection id="specify">
      <VLabel text="Specify NUMU" />
      <h2 className="font-display mb-8" style={{ fontSize: 'clamp(2rem, 4vw, 5rem)', lineHeight: '0.96', letterSpacing: '-0.04em' }}>
        Bring PALMYCO™ into your project.
      </h2>
      <p className="font-sans leading-[1.75] max-w-xl mb-14" style={{ fontSize: '1rem', opacity: 0.55 }}>
        Samples, specification sheets, and project conversations for architects, interior designers, and fit-out teams. Based in Dubai. Delivering regionally.
      </p>
      <DirectContactForm
        requestType="samples"
        source="public-specify"
        submitLabel="Request samples →"
      />
    </VSection>
  )
}

// ─── Partners Strip ───────────────────────────────────────────────────────────

const PARTNERS = [
  { name: 'NYXO Design Studio', note: 'Design partner' },
  { name: 'Biomyc', note: 'Packaging — LOI' },
  { name: 'De Montfort University', note: 'Academic' },
  { name: 'American University of Sharjah', note: 'Academic' },
  { name: 'Heriot-Watt University Dubai', note: 'Academic' },
  { name: 'DIDI', note: 'Design network' },
]

function PartnersStrip() {
  return (
    <div className="pt-14 mt-14" style={{ borderTop: BORDER }}>
      <p className="font-sans uppercase tracking-[0.18em] mb-8" style={{ fontSize: '0.625rem', opacity: 0.3 }}>
        Partners &amp; institutions
      </p>
      <div className="flex flex-wrap gap-x-10 gap-y-5">
        {PARTNERS.map(p => (
          <div key={p.name}>
            <p className="font-sans" style={{ fontSize: '0.8125rem', opacity: 0.55 }}>{p.name}</p>
            <p className="font-sans uppercase tracking-[0.14em] mt-0.5" style={{ fontSize: '0.5625rem', opacity: 0.25 }}>{p.note}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Visitor view ─────────────────────────────────────────────────────────────

function VisitorView({ v, teamMembers }: { v: VisitorContent; teamMembers: InvestorContent['team']['members'] }) {
  return (
    <>
      {/* 01 Statement */}
      <VSection id="statement">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-14 lg:gap-20 items-start">
          <div className="lg:pt-2">
            <VLabel text={v.statement.label} />
            <h2 className="font-display mb-8" style={{ fontSize: 'clamp(2rem, 3.5vw, 3.75rem)', lineHeight: '1.06', letterSpacing: '-0.03em', textWrap: 'balance' as React.CSSProperties['textWrap'] }}>
              {v.statement.heading}
            </h2>
            <p className="font-sans leading-[1.75] mb-5 max-w-md" style={{ fontSize: '1rem', opacity: 0.65 }}>
              NUMU operates a bio-composites platform built for the GCC. Our flagship material, <strong>PALMYCO™</strong>, is a grown mycelium foam — a proprietary bio-composite cultivated inside molds from regional agricultural fibers, producing lightweight panels with distinctive three-dimensional texture.
            </p>
            <p className="font-sans leading-[1.75] max-w-md" style={{ fontSize: '0.9375rem', opacity: 0.62 }}>
              Alongside PALMYCO™, NUMU leverages spent mushroom substrate — a regional waste stream — to produce heat-pressed composite boards. Two distinct material outputs, shared production infrastructure, four revenue lines. Circular by design.
            </p>
          </div>
          <div className="relative overflow-hidden">
            <AutoplayVideoBlock
              src="/videos/numu_timelapse.mp4"
              preload="auto"
              className="w-full block"
              overlay={
                <div className="absolute bottom-0 left-0 right-0 z-10 flex flex-col items-start px-6 md:px-8 pb-6 md:pb-8" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%)', paddingTop: 100 }}>
                  <p className="font-display text-white mb-2" style={{ fontSize: 'clamp(1.25rem, 2.5vw, 2rem)' }}>Material in motion</p>
                  <p className="font-sans text-white" style={{ fontSize: 'clamp(0.875rem, 1.8vw, 0.95rem)', opacity: 0.72, lineHeight: 1.6, maxWidth: 340 }}>
                    A material grown over time, not manufactured. From agricultural fibres to structural form, the process unfolds through controlled biological growth over 5–7 days.
                  </p>
                </div>
              }
            />
          </div>
        </div>
      </VSection>

      {/* 02 Material */}
      <VSection id="material">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-16 lg:gap-20">
          <div className="flex flex-col">
            <div>
              <VLabel text={v.material.label} />
              <h2 className="font-display mb-8" style={{ fontSize: 'clamp(2rem, 3.5vw, 3.5rem)', lineHeight: '1.08', letterSpacing: '-0.03em', textWrap: 'balance' as React.CSSProperties['textWrap'] }}>
                PALMYCO™ — grown, not manufactured.
              </h2>
              <p className="font-sans leading-[1.75] mb-5" style={{ fontSize: '1rem', opacity: 0.65 }}>
                PALMYCO™ is NUMU&apos;s proprietary grown mycelium foam — a bio-composite cultivated from regional agricultural fibers bound by a living mycelium network. Rigid, breathable, sound-absorbent, and home-compostable. No binders. No petroleum. No synthetic residue. Trademarked material, grown in Dubai.
              </p>
              <p className="font-sans leading-[1.75]" style={{ fontSize: '0.9375rem', opacity: 0.5 }}>
                PALMYCO™ properties are tuned through the growth cycle itself. Alongside it, NUMU presses composite boards from spent mushroom substrate — a separate material, a separate waste stream, a separate product line. The platform compounds both.
              </p>
            </div>
            <div className="mt-auto pt-12" style={{ borderTop: '1px solid rgba(128,128,128,0.1)', marginTop: 'auto' }}>
              <p className="font-sans uppercase tracking-[0.16em] mb-5" style={{ fontSize: 9, opacity: 0.55 }}>
                Substrate inputs — regional agricultural residues
              </p>
              <div className="grid grid-cols-2 gap-4 mb-12">
                {/* Palm leaf — existing image */}
                <div>
                  <div className="relative w-full mb-3" style={{ aspectRatio: '1/1' }}>
                    <Image src="/images/materials/palm_leaf_substrate.png" alt="Palm leaf agricultural substrate from UAE date palm pruning waste" fill unoptimized className="object-contain object-center" sizes="(max-width: 1024px) 50vw, 25vw" />
                  </div>
                  <p className="font-sans mb-1" style={{ fontSize: 11, opacity: 0.7, letterSpacing: '0.04em' }}>Palm leaf fibre</p>
                  <p className="font-sans leading-snug" style={{ fontSize: 10, opacity: 0.5 }}>UAE date palm pruning waste, the region&apos;s largest agricultural residue stream.</p>
                </div>
                <div>
                  <div className="relative w-full mb-3" style={{ aspectRatio: '1/1' }}>
                    <Image src="/images/materials/hemp_shivs.jpg" alt="Plant fibre blend — mixed agricultural by-products sourced regionally" fill unoptimized className="object-cover object-center" sizes="(max-width: 1024px) 50vw, 25vw" style={{ mixBlendMode: 'multiply' }} />
                  </div>
                  <p className="font-sans mb-1" style={{ fontSize: 11, opacity: 0.7, letterSpacing: '0.04em' }}>Plant fibre blend</p>
                  <p className="font-sans leading-snug" style={{ fontSize: 10, opacity: 0.5 }}>Mixed agricultural by-products sourced regionally.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4" style={{ border: '1px solid rgba(128,128,128,0.1)', backgroundColor: 'rgba(128,128,128,0.03)' }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: 'rgba(26,23,20,0.4)', flexShrink: 0, marginTop: 5 }} />
                <div>
                  <p className="font-sans mb-1" style={{ fontSize: 11, opacity: 0.7, letterSpacing: '0.04em' }}>Spent mushroom substrate (SMS)</p>
                  <p className="font-sans leading-snug" style={{ fontSize: 10, opacity: 0.5 }}>A waste stream already generated by regional commercial mushroom farms. Near-zero feedstock cost. Powers the pressed board production line.</p>
                </div>
              </div>
            </div>
            {/* Production routes */}
            <div className="pt-12 mt-12" style={{ borderTop: '1px solid rgba(128,128,128,0.1)' }}>
              <p className="font-sans uppercase tracking-[0.16em] mb-6" style={{ fontSize: 9, opacity: 0.55 }}>
                Production routes
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div style={{ border: '1px solid rgba(128,128,128,0.14)' }}>
                  <div className="relative w-full overflow-hidden" style={{ aspectRatio: '1/1' }}>
                    <Image src="/images/products/Chair.jpg" alt="Grown mycelium chair — NUMU material formed into product application" fill unoptimized className="object-contain object-center" sizes="(max-width: 640px) 100vw, 50vw" style={{ mixBlendMode: 'multiply' }} />
                  </div>
                  <div className="p-5">
                    <p className="font-sans uppercase tracking-[0.14em] mb-3" style={{ fontSize: 10, opacity: 0.62 }}>Grown</p>
                    <p className="font-sans leading-[1.7] mb-4" style={{ fontSize: '0.875rem', opacity: 0.6 }}>
                      Mycelium cultivated inside proprietary molds over a controlled growth cycle, then heat-stabilized into a finished form. Produces distinctive surface texture and complex three-dimensional form factors.
                    </p>
                    <p className="font-sans" style={{ fontSize: 10, opacity: 0.35, letterSpacing: '0.04em' }}>Used in: Acoustic panels, architectural surface.</p>
                  </div>
                </div>
                <div style={{ border: '1px solid rgba(128,128,128,0.14)' }}>
                  <div className="relative w-full overflow-hidden" style={{ aspectRatio: '1/1' }}>
                    <Image src="/images/products/pressed_detail.jpg" alt="Pressed mycelium board close-up — surface texture and cross-section detail" fill unoptimized className="object-cover object-center" sizes="(max-width: 640px) 100vw, 50vw" />
                  </div>
                  <div className="p-5">
                    <p className="font-sans uppercase tracking-[0.14em] mb-3" style={{ fontSize: 10, opacity: 0.62 }}>Pressed</p>
                    <p className="font-sans leading-[1.7] mb-4" style={{ fontSize: '0.875rem', opacity: 0.6 }}>
                      Spent mycelium biomass shredded and heat-pressed directly into flat board formats. Minutes of press time rather than weeks of cultivation.
                    </p>
                    <p className="font-sans" style={{ fontSize: 10, opacity: 0.35, letterSpacing: '0.04em' }}>Used in: Event structures, temporary architecture, pressed board applications.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden aspect-[3/4] lg:aspect-auto">
            <Image src="/images/products/biofoam_detail.png" alt="NUMU PALMYCO™ — material study" fill className="object-cover object-center" sizes="(max-width: 1024px) 100vw, 50vw" />
          </div>
        </div>
      </VSection>

      {/* FOLD product */}
      <VSection id="fold">
        <VLabel text="Product — FOLD" />
        <div className="mb-12 grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-8 lg:gap-14 items-end">
          <div>
            <h2 className="font-display" style={{ fontSize: 'clamp(3rem, 7vw, 7.5rem)', lineHeight: '0.9', letterSpacing: '-0.04em' }}>FOLD</h2>
            <p className="font-sans uppercase tracking-[0.16em] mt-3" style={{ fontSize: '0.625rem', opacity: 0.32 }}>
              Surface design in collaboration with NYXO Design Studio.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 lg:pb-2">
            <p className="font-sans leading-[1.75]" style={{ fontSize: '1rem', opacity: 0.6 }}>
              FOLD is NUMU&apos;s first product — a modular acoustic panel system grown from bio-based material and designed for interior architecture. It translates the material platform into a real, specification-ready object: tactile, scalable, and visually distinctive.
            </p>
            <p className="font-sans leading-[1.75]" style={{ fontSize: '0.9375rem', opacity: 0.44 }}>
              Fold takes its name from the forces that shape it — the movement of fabric, the softness of drapery, the way wind carves form into sand and dunes. Each panel surface carries that memory: a topography grown into material rather than cut from it.
            </p>
            <p className="font-sans leading-[1.75]" style={{ fontSize: '0.875rem', opacity: 0.35 }}>
              The material system, manufacturing process, and engineering are NUMU. The surface design pattern is co-developed with NYXO Design Studio.
            </p>
          </div>
        </div>
        <div className="mb-3 relative w-full overflow-hidden" style={{ aspectRatio: '16/9', backgroundColor: 'rgba(128,128,128,0.04)' }}>
          <Image src="/images/products/fold_solo_panel.png" alt="FOLD — acoustic panel, product view" fill className="object-contain object-center" sizes="(max-width: 1440px) 100vw, 1440px" />
        </div>
        <div className="mb-3 relative w-full overflow-hidden" style={{ aspectRatio: '16/9' }}>
          <Image src="/images/products/fold_hero_interior.png" alt="FOLD — interior installation view" fill className="object-cover object-center" sizes="(max-width: 1440px) 100vw, 1440px" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <div className="relative overflow-hidden w-full" style={{ aspectRatio: '4/3' }}>
              <Image src="/images/products/fold_context_scale.png" alt="Render — FOLD acoustic panel, urban concrete installation, 3x3 grid module" fill className="object-cover object-center" sizes="(max-width: 640px) 100vw, 55vw" />
            </div>
            <p className="font-sans uppercase tracking-[0.14em] mt-2" style={{ fontSize: 9, opacity: 0.3 }}>
              Render — Urban concrete installation, 3×3 grid module
            </p>
          </div>
          <div>
            <div className="relative overflow-hidden w-full" style={{ aspectRatio: '4/3' }}>
              <AutoplayVideoBlock
                src="/videos/numu_story.mp4"
                poster="/images/products/fold_hero_interior.png"
                altLabel="FOLD installation render while the animation loads"
                preload="metadata"
                className="w-full h-full object-cover block"
                style={{ objectFit: 'cover' }}
              />
            </div>
            <p className="font-sans uppercase tracking-[0.14em] mt-2" style={{ fontSize: 9, opacity: 0.3 }}>
              Render — Urban concrete installation, variation
            </p>
          </div>
        </div>

        {/* FOLD Technical Specifications */}
        <div className="mt-16 pt-14" style={{ borderTop: BORDER }}>
          <p className="font-sans uppercase tracking-[0.18em] mb-10" style={{ fontSize: '0.625rem', opacity: 0.35 }}>
            Technical specifications
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-px" style={{ backgroundColor: 'rgba(128,128,128,0.12)' }}>
            {[
              { field: 'Panel dimensions', value: '400 mm × 400 mm × 60 mm' },
              { field: 'Weight', value: 'Approx. 1.8–2.2 kg/m²' },
              { field: 'Acoustic performance', value: 'NRC ~0.7 target — certification pending' },
              { field: 'Fire performance', value: 'ASTM E84 Class B — target (certification pending)' },
              { field: 'Installation', value: 'Concealed adhesive mount or mechanical fixing' },
              { field: 'Finish', value: 'Natural PALMYCO™ surface, raw or sealed' },
              { field: 'Lead time', value: '6–8 weeks from order' },
              { field: 'Origin', value: 'Manufactured in Dubai, UAE' },
              { field: 'End of life', value: '100% bio-based, biodegradable under natural composting conditions' },
            ].map(spec => (
              <div key={spec.field} className="px-6 py-7" style={{ backgroundColor: 'rgba(26,23,20,0.03)' }}>
                <p className="font-sans uppercase tracking-[0.12em] mb-2.5" style={{ fontSize: '0.625rem', opacity: 0.4 }}>{spec.field}</p>
                <p className="font-sans" style={{ fontSize: '0.9375rem', opacity: 0.78 }}>{spec.value}</p>
              </div>
            ))}
          </div>
        </div>
      </VSection>

      {/* Installations — moved up: proof of execution, right after FOLD */}
      <VSection id="installations">
        <VLabel text="03 — Installations" />
        <VHeading text="Two installations. Real conditions." />
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-start">
          <div className="h-full p-4 md:p-5" style={{ border: BORDER, backgroundColor: 'rgba(26,23,20,0.02)' }}>
            <BeyondSlideshow />
            <VLabel text="Netherlands — 2022" />
            <p className="font-display text-xl md:text-2xl mt-1">Beyond Chrysant</p>
            <p className="font-sans mt-3 leading-[1.7]" style={{ fontSize: '0.875rem', opacity: 0.56 }}>
              Prototype installation demonstrating the folded acoustic language in a built exhibition context.
            </p>
          </div>
          <div className="h-full p-4 md:p-5" style={{ border: BORDER, backgroundColor: 'rgba(26,23,20,0.02)' }}>
            <div className="relative mb-4 overflow-hidden" style={{ aspectRatio: '4/3', backgroundColor: 'rgba(128,128,128,0.06)' }}>
              <Image src="/images/projects/acoustic_render_07.jpg" alt="KAVE — FOLD acoustic panel installation, Dubai 2026" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
            <VLabel text="Dubai, UAE — 2026 Q2 · in progress" />
            <p className="font-display text-xl md:text-2xl mt-1">KAVE</p>
            <p className="font-sans mt-3 leading-[1.7]" style={{ fontSize: '0.875rem', opacity: 0.56 }}>
              Current Dubai client installation translating FOLD into a live interior environment.
            </p>
          </div>
        </div>
      </VSection>

      {/* KAVE — dedicated section with countdown */}
      <KaveSection />

      {/* Specify NUMU CTA */}
      <ExploreCTA />

      {/* 04 Process */}
      <section id="process" style={{ borderTop: BORDER, paddingTop: '5rem', paddingBottom: '4rem' }}>
        {/* Title — compact, above the diagram */}
        <div className="px-6 md:px-12 mb-6 max-w-[1440px] mx-auto">
          <VLabel text={v.process.label} />
          <VHeading text={v.process.heading} />
        </div>
        {/* Diagram — full bleed, no max-width constraint */}
        <div style={{ width: '100%', maxWidth: 1200, margin: '0 auto' }}>
          <ProcessDiagram />
        </div>
      </section>

      {/* Production feature */}
      <ProductionFeature />

      {/* Lab Process Feature */}
      <section id="lab" className="px-6 md:px-12 py-24 md:py-32" style={{ borderTop: BORDER }}>
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-20 items-start">
            <div>
              <h2 className="font-display mb-8" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: 1.05, letterSpacing: '-0.03em' }}>
                The process, documented.
              </h2>
              <p className="font-sans leading-[1.75] mb-4" style={{ fontSize: '0.9375rem', opacity: 0.55 }}>
                PALMYCO™ is produced in our active production lab. This footage documents the full process cycle — substrate preparation, mycelium inoculation, growth, heat-stabilization, and finishing. No renders, no simulations. Real production conditions, repeatable process.
              </p>
              <p className="font-sans uppercase tracking-[0.16em] mt-8" style={{ fontSize: 10, opacity: 0.28 }}>
                Duration — 1 min 34 sec
              </p>
            </div>
            <div>
              <LabVideo />
            </div>
          </div>
        </div>
      </section>

      {/* Process carousel */}
      <ProcessCarousel />

      {/* Applications — platform horizons */}
      <VSection id="applications">
        <VLabel text="07 — Platform Horizons" />
        <VHeading text="One material platform. Current product. Future lines." />
        <p className="font-sans leading-[1.75] mb-3 max-w-2xl" style={{ fontSize: '1rem', opacity: 0.62 }}>
          Acoustic panels are the entry product, available now. The platform expands across four revenue lines, each running on the same material system and the same production infrastructure.
        </p>
        <p className="font-sans leading-[1.75] mb-14 max-w-2xl" style={{ fontSize: '0.9375rem', opacity: 0.55 }}>
          PALMYCO™ — the grown line — enters the market through decorative acoustic panels, scales through certified architectural specification, and extends into thermal wall assemblies. The pressed-board line — built from spent mushroom substrate on the same production infrastructure — serves events, brand activations, and non-structural interior applications. Packaging and regional licensing open in phase two.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            {
              title: 'Acoustic — Grown',
              tagline: 'Decorative and specification-grade mycelium panels for interior architecture. First product: FOLD.',
              status: 'Active',
              active: true,
              image: '/images/materials/acoustic_render_05.png',
              imageAlt: 'NUMU grown acoustic panels — FOLD product line, interior architecture',
            },
            {
              title: 'Boards — Pressed',
              tagline: 'Heat-pressed mycelium composite boards for events, brand activations, and temporary architecture.',
              status: 'Active',
              active: true,
              image: '/images/applications/event_board.png',
              imageAlt: 'NUMU pressed mycelium composite board — event and temporary architecture application',
            },
            {
              title: 'Thermal',
              tagline: 'Passive insulation grown from palm fibre, designed for hot-climate wall assemblies.',
              status: 'In Development',
              active: false,
              image: '/images/applications/thermal_panel_wall.png',
              imageAlt: 'NUMU thermal panel — wall assembly integration',
            },
            {
              title: 'Packaging',
              tagline: 'Molded protective forms, compostable alternative to petroleum-based foams.',
              status: 'In Development',
              active: false,
              image: '/images/applications/packaging_protective.png',
              imageAlt: 'NUMU protective packaging — molded mycelium form',
            },
          ].map(app => (
            <div key={app.title} style={{ border: BORDER }}>
              <div className="relative w-full overflow-hidden" style={{ aspectRatio: '1/1' }}>
                <Image src={app.image} alt={app.imageAlt} fill className="object-cover object-center" sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw" />
                <div className="absolute bottom-3 left-3">
                  <span className="font-sans uppercase" style={{ fontSize: 9, letterSpacing: '0.14em', padding: '4px 8px', backgroundColor: app.active ? 'rgba(26,23,20,0.82)' : 'rgba(26,23,20,0.48)', color: '#f5f1e8' }}>
                    {app.status}
                  </span>
                </div>
              </div>
              <div className="px-5 py-6">
                <p className="font-display mb-2" style={{ fontSize: '1.25rem', letterSpacing: '-0.02em', opacity: app.active ? 1 : 0.55 }}>{app.title}</p>
                <p className="font-sans leading-relaxed" style={{ fontSize: 13, opacity: app.active ? 0.6 : 0.42 }}>{app.tagline}</p>
              </div>
            </div>
          ))}
        </div>
      </VSection>

      {/* Platform horizon — Thermal */}
      <section id="thermal" className="px-6 md:px-12 py-24 md:py-32" style={{ borderTop: BORDER }}>
        <div className="max-w-[1440px] mx-auto">
          <p className="font-sans uppercase tracking-[0.18em] mb-10" style={{ fontSize: '0.6875rem', opacity: 0.55 }}>Platform horizon — Thermal</p>
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-20 items-start">
            <div className="w-full overflow-hidden">
              <Image src="/images/applications/thermal_panel_wall.png" alt="NUMU thermal panel — wall integration" width={2400} height={1350} style={{ width: '100%', height: 'auto', display: 'block' }} sizes="(max-width: 1440px) 100vw, 60vw" />
            </div>
            <div className="lg:pt-4">
              <p className="font-display mb-6" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.75rem)', lineHeight: '1.1', letterSpacing: '-0.025em', opacity: 0.85 }}>
                Bio-based thermal systems.
              </p>
              <p className="font-sans leading-[1.75] mb-4" style={{ fontSize: '0.9375rem', opacity: 0.58 }}>
                NUMU materials can be integrated within wall assemblies to provide passive thermal performance. The porous structure of the material enables insulation while remaining breathable.
              </p>
              <p className="font-sans leading-[1.75] mb-4" style={{ fontSize: '0.9375rem', opacity: 0.58 }}>
                Designed for hot climates, the system supports reduced energy demand and improved indoor comfort without synthetic foams.
              </p>
              <p className="font-sans uppercase tracking-[0.16em] mt-8" style={{ fontSize: 10, opacity: 0.42 }}>
                In development — opens after certification of the acoustic line
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform horizon — Packaging */}
      <section id="packaging" className="px-6 md:px-12 py-24 md:py-32" style={{ borderTop: BORDER }}>
        <div className="max-w-[1440px] mx-auto">
          <p className="font-sans uppercase tracking-[0.18em] mb-10" style={{ fontSize: '0.6875rem', opacity: 0.55 }}>Platform horizon — Packaging</p>

          <div className="grid grid-cols-1 lg:grid-cols-[1.55fr_1fr] gap-12 lg:gap-20 items-start mb-16">
            <div>
              <p className="font-display mb-6" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.75rem)', lineHeight: '1.1', letterSpacing: '-0.025em', opacity: 0.85 }}>
                Molded protection, grown not manufactured.
              </p>
              <p className="font-sans leading-[1.75] mb-4" style={{ fontSize: '0.9375rem', opacity: 0.6 }}>
                NUMU materials can be shaped into protective packaging forms — a compostable alternative to petroleum-based foams. Each piece is grown into shape from agricultural waste, maintaining shock absorption while remaining fully biodegradable at end of life.
              </p>
              <p className="font-sans leading-[1.75] mb-10" style={{ fontSize: '0.9375rem', opacity: 0.5 }}>
                Working with mycelium means manufacturing with a living material system. Each object is grown from natural fibers, shaped through biological growth, and stabilized into a functional product. Sustainability is not added afterward — it is built into the material process itself.
              </p>
              <p className="font-sans uppercase tracking-[0.16em] mb-1" style={{ fontSize: 10, opacity: 0.48 }}>
                Scalable application — logistics and product protection
              </p>
              <p className="font-sans uppercase tracking-[0.16em]" style={{ fontSize: 10, opacity: 0.42 }}>
                European pathway — Biomyc partnership, LOI signed
              </p>
            </div>
            <div className="w-full overflow-hidden" style={{ position: 'relative', aspectRatio: '1/1' }}>
              <Image src="/images/applications/packaging01.jpg" alt="NUMU mycelium packaging — protective molded form grown from agricultural waste" fill unoptimized className="object-cover object-center" sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
          </div>

          <div>
            <p className="font-sans uppercase tracking-[0.18em] mb-6" style={{ fontSize: '0.5625rem', opacity: 0.5 }}>Material comparison</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px" style={{ backgroundColor: 'rgba(128,128,128,0.12)' }}>
              {[
                {
                  name: 'Styrofoam — EPS',
                  items: [
                    'Fossil-based petroleum derivative',
                    'Persistent pollutant — 500+ year lifespan',
                    'Extremely difficult to recycle',
                    'Non-biodegradable in natural conditions',
                    'High embedded carbon',
                  ],
                  highlight: false,
                },
                {
                  name: 'Mycelium packaging',
                  items: [
                    'Grown from agricultural waste residues',
                    'Bio-based — no synthetic binders or polymers',
                    'Equal or superior shock absorption',
                    'Home-compostable at end of life',
                    'Carbon-sequestering feedstock',
                  ],
                  highlight: true,
                },
              ].map((col) => (
                <div key={col.name} className="px-7 py-8" style={{ backgroundColor: col.highlight ? 'rgba(26,23,20,0.04)' : 'rgba(26,23,20,0.01)' }}>
                  <p className="font-sans uppercase tracking-[0.16em] mb-6" style={{ fontSize: '0.5625rem', opacity: col.highlight ? 0.72 : 0.5 }}>{col.name}</p>
                  {col.items.map((item, j) => (
                    <div key={j} className="flex items-start gap-3 mb-3">
                      <span style={{ fontSize: 7, opacity: col.highlight ? 0.6 : 0.42, flexShrink: 0, marginTop: 4 }}>
                        {col.highlight ? '◆' : '○'}
                      </span>
                      <p className="font-sans leading-snug" style={{ fontSize: '0.8125rem', opacity: col.highlight ? 0.72 : 0.55 }}>{item}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Manifesto */}
      <section id="manifesto" className="px-6 md:px-12 py-24 md:py-32" style={{ borderTop: BORDER }}>
        <div className="max-w-[1440px] mx-auto">
          <p className="font-sans uppercase tracking-[0.18em] mb-16" style={{ fontSize: '0.6875rem', opacity: 0.55 }}>Manifesto</p>
          <h2 className="font-sans uppercase tracking-[0.14em] mb-14" style={{ fontSize: '0.6875rem', opacity: 0.6 }}>What we believe.</h2>
          <div>
            {[
              'Performance before narrative.',
              'Waste is feedstock.',
              'The region builds its own.',
              'Platforms outlast products.',
              'Grown, not manufactured.',
            ].map((statement, i) => (
              <p
                key={i}
                className="font-display"
                style={{
                  fontSize: 'clamp(1.75rem, 4vw, 3.5rem)',
                  lineHeight: 1.15,
                  letterSpacing: '-0.025em',
                  opacity: 0.82,
                  paddingTop: i === 0 ? 0 : 'clamp(1.5rem, 3vw, 2.5rem)',
                  paddingBottom: 'clamp(1.5rem, 3vw, 2.5rem)',
                  borderBottom: i < 4 ? BORDER : 'none',
                }}
              >
                {statement}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <VSection id="team">
        <VLabel text="08 — Team" />
        <VHeading text="Built by a team already executing." />
        <VBody text="NUMU is not a solo-founder story. The company combines industrialization, construction finance, IP strategy, and commercial growth to turn the material platform into real projects." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {teamMembers.map((member) => (
            <PublicTeamCard key={member.name} member={member} />
          ))}
        </div>
      </VSection>

      {/* 07 Contact */}
      <VSection id="contact">
        <VLabel text={v.contact.label} />
        <h2 className="font-display mb-10" style={{ fontSize: 'clamp(2.5rem, 5.5vw, 6.5rem)', lineHeight: '0.92', letterSpacing: '-0.04em' }}>
          {v.contact.heading}
        </h2>
        <p className="font-sans mb-12 max-w-md" style={{ fontSize: '0.9375rem', lineHeight: 1.75, opacity: 0.5 }}>
          Based in Dubai. Samples, project consultation, and specification support for architects, interior designers, and fit-out teams.
        </p>
        <div className="mb-14">
          <DirectContactForm
            requestType="project"
            source="public-contact"
            submitLabel="Send project inquiry →"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mb-24">
          {v.contact.ctas.map((cta, i) => (
            <a
              key={cta.label} href={cta.href}
              className="font-sans text-label uppercase tracking-[0.14em] px-8 py-4 border inline-block"
              style={{ borderColor: i === 0 ? 'rgba(26,23,20,0.65)' : 'rgba(128,128,128,0.28)', backgroundColor: i === 0 ? 'rgba(26,23,20,0.09)' : 'transparent', transition: 'border-color 0.2s, background-color 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = i === 0 ? 'rgba(26,23,20,0.9)' : 'rgba(128,128,128,0.55)'; (e.currentTarget as HTMLAnchorElement).style.backgroundColor = i === 0 ? 'rgba(26,23,20,0.16)' : 'rgba(128,128,128,0.06)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = i === 0 ? 'rgba(26,23,20,0.65)' : 'rgba(128,128,128,0.28)'; (e.currentTarget as HTMLAnchorElement).style.backgroundColor = i === 0 ? 'rgba(26,23,20,0.09)' : 'transparent' }}
            >
              {cta.label} →
            </a>
          ))}
        </div>
        <div className="pt-10 flex flex-col sm:flex-row sm:items-center gap-6" style={{ borderTop: BORDER }}>
          <Image src="/branding/logo-black-numu.png" alt="NUMU" width={120} height={48} className="h-10 w-auto object-contain" style={{ opacity: 0.30 }} />
          <SocialLinks />
        </div>
        <PartnersStrip />
      </VSection>
    </>
  )
}

// ─── Investor view ────────────────────────────────────────────────────────────

function InvestorView({ iv }: { iv: InvestorContent }) {
  return (
    <>
      {/* 02 — What Exists Today (Traction) */}
      <ISection id="traction">
        <ILabel text="02 — What Exists Today" />
        <IHeading text={iv.traction.heading} />
        {/* Centered content container — stats + list + photos */}
        <div style={{ maxWidth: 880, marginLeft: 'auto', marginRight: 'auto' }}>
          {/* Traction stats */}
          <div className="grid grid-cols-3 gap-px mt-8 mb-2" style={{ backgroundColor: 'rgba(245,241,232,0.08)' }}>
            {[
              { to: 180, prefix: 'AED ', suffix: 'K', label: 'Founder capital deployed' },
              { to: 2, prefix: '', suffix: '', label: 'Real installations built' },
              { to: 7, prefix: '', suffix: 'yrs', label: 'Operational experience' },
            ].map((s, i) => (
              <div key={s.label} className="px-6 py-6" style={{ backgroundColor: '#0e0e0e' }}>
                <p className="font-display mb-1" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', letterSpacing: '-0.04em', lineHeight: 1, color: ACCENT }}>
                  <span style={{ fontSize: '0.5em', opacity: 0.7 }}>{s.prefix}</span>
                  <CountUp to={s.to} suffix={s.suffix} duration={1.1 + i * 0.1} />
                </p>
                <p className="font-sans text-label uppercase tracking-[0.14em] mt-1" style={{ opacity: 0.5, fontSize: '0.5625rem' }}>{s.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-14 pl-5" style={{ borderTop: INV_BORDER, borderLeft: '2px solid rgba(245,241,232,0.18)' }}>
            {iv.traction.items.map((item, i) => (
              <div key={item} className="flex items-start gap-5 py-5" style={{ borderBottom: i < iv.traction.items.length - 1 ? INV_BORDER_SUBTLE : 'none', lineHeight: 2 }}>
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" width={16} height={16} className="flex-shrink-0 mt-2" style={{ opacity: 0.6 }}>
                  <polyline points="2,8 6,12 14,4" />
                </svg>
                <p className="font-sans text-base md:text-lg leading-snug" style={{ opacity: 0.82 }}>{item}</p>
              </div>
            ))}
          </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6" style={{ borderTop: INV_BORDER, paddingTop: 48 }}>
            {[
              {
                project: 'Beyond Chrysant',
                location: 'Netherlands — 2022',
                caption: 'Beyond Chrysant — Netherlands, 2022',
                brief: 'Beyond Chrysant — mycelium acoustic installation, Netherlands 2022.',
                image: '/images/projects/Beyond01.jpg',
                tint: 'grayscale(40%) brightness(0.92)',
              },
              {
                project: 'KAVE',
                location: 'Dubai, UAE — 2026 Q2 · in progress',
                caption: 'KAVE — Dubai, UAE 2026 Q2',
                brief: 'KAVE — FOLD acoustic panel installation, Dubai 2026 Q2 (in progress).',
                image: '/images/projects/acoustic_render_07.jpg',
                tint: 'grayscale(40%) brightness(0.92)',
              },
            ].map(inst => (
              <div key={inst.project}>
                <div className="relative mb-3 overflow-hidden" style={{ aspectRatio: '16/9', backgroundColor: 'rgba(245,241,232,0.04)', border: '1px solid rgba(245,241,232,0.08)' }}>
                  <Image src={inst.image} alt={inst.brief} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" style={{ filter: inst.tint ?? 'none' }} />
                </div>
                <ILabel text={inst.location} />
                <p className="font-display text-lg md:text-xl">{inst.project}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Featured In */}
        <div className="mt-16" style={{ borderTop: INV_BORDER, paddingTop: 40 }}>
          <p className="font-sans uppercase tracking-[0.2em] mb-10" style={{ fontSize: '0.6875rem', opacity: 0.5 }}>Featured In</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-px" style={{ backgroundColor: 'rgba(245,241,232,0.08)' }}>
            {[
              { pub: 'Wallpaper*', headline: 'Postcard from Dubai Design Week 2024: the highlights', url: 'https://www.wallpaper.com/design-interiors/design-events/dubai-design-week-highlights', date: 'Nov 2024' },
              { pub: 'The National', headline: 'How coral stones, reefs and mycelium inspired the winning Abwab projects', url: 'https://www.thenationalnews.com/arts-culture/art-design/2024/10/03/abwab-dubai-design-week-coral-stones-reefs-mycelium/', date: 'Oct 2024' },
              { pub: 'STIRworld', headline: 'A decade on, Dubai Design Week is still growing alongside the MENA culture scene', url: 'https://www.stirworld.com/inspire-visits-a-decade-on-dubai-design-week-is-still-growing-alongside-the-mena-culture-scene', date: 'Nov 2024' },
              { pub: 'Design Anthology', headline: 'Dubai Design Week Celebrates its Tenth Edition', url: 'https://design-anthology.com/story/dubai-design-week-2024', date: 'Jul 2025' },
            ].map((item, i) => (
              <motion.a
                key={i}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px' }}
                transition={{ duration: 0.4, delay: i * 0.08, ease: [0.25, 0, 0.2, 1] }}
                className="flex flex-col gap-3 p-6"
                style={{
                  backgroundColor: '#0e0e0e',
                  textDecoration: 'none',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(245,241,232,0.04)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#0e0e0e' }}
              >
                <p className="font-sans uppercase tracking-[0.14em]" style={{ fontSize: '0.625rem', opacity: 0.55, letterSpacing: '0.16em' }}>{item.pub}</p>
                <p className="font-sans leading-[1.55] flex-1" style={{ fontSize: '0.8125rem', opacity: 0.76 }}>{item.headline}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="font-sans" style={{ fontSize: '0.625rem', opacity: 0.42, letterSpacing: '0.08em' }}>{item.date}</p>
                  <span style={{ fontSize: '0.625rem', opacity: 0.42 }}>↗</span>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </ISection>

      {/* 03 — Why Now (Market Forces) */}
      <ISection id="forces">
        <ILabel text="03 — Why Now" />
        <IHeading text={iv.forces.heading} />
        <ThreeForces forces={iv.forces} />
        <InvestorMetricsStrip />
      </ISection>

      {/* 02 Platform */}
      <ISection id="platform">
        <ILabel text={iv.platform.label} />
        <IHeading text={iv.platform.heading} />
        {/* Strategic thesis: PALMYCO™ platform → multiple applications */}
        <div className="mt-2 mb-16 grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-8 lg:gap-14 items-center">
          <div>
            <p className="font-sans text-base md:text-[1.0625rem] leading-[1.8] mb-10" style={{ opacity: 0.68 }}>
              {iv.platform.body}
            </p>
            <div style={{ border: INV_BORDER, padding: '28px', backgroundColor: `${ACCENT}06` }}>
              <p className="font-sans uppercase tracking-[0.2em] mb-6" style={{ fontSize: '0.5rem', opacity: 0.38, letterSpacing: '0.22em' }}>Material system → Applications</p>
              <div>
                <div className="flex items-center gap-3 pb-4" style={{ borderBottom: INV_BORDER_SUBTLE }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: ACCENT, flexShrink: 0, boxShadow: `0 0 10px ${ACCENT}55` }} />
                  <p className="font-sans" style={{ fontSize: '0.875rem', opacity: 0.88, letterSpacing: '-0.01em' }}>Grown PALMYCO™ — bio-composite substrate</p>
                </div>
                <div className="pt-4 grid grid-cols-2 gap-x-4 gap-y-3">
                  {[
                    { app: 'Acoustic panels', status: 'Active', active: true },
                    { app: 'Pressed boards', status: 'Active', active: true },
                    { app: 'Thermal insulation', status: 'Phase 2', active: false },
                    { app: 'Regional licensing', status: 'Phase 3', active: false },
                  ].map(a => (
                    <div key={a.app} className="flex items-center gap-2.5">
                      <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: a.active ? ACCENT : 'rgba(245,241,232,0.28)', flexShrink: 0 }} />
                      <div>
                        <p className="font-sans" style={{ fontSize: '0.8125rem', opacity: a.active ? 0.82 : 0.44 }}>{a.app}</p>
                        <p className="font-sans uppercase tracking-[0.1em]" style={{ fontSize: '0.5rem', opacity: 0.3, color: a.active ? ACCENT : undefined }}>{a.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '0px' }}
            transition={{ duration: 0.8, ease: [0.25, 0, 0.2, 1] }}
            className="relative overflow-hidden"
            style={{ aspectRatio: '3/4', maxHeight: 560 }}
          >
            <Image
              src="/images/products/biofoam_detail.png"
              alt="NUMU PALMYCO™ — material platform"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to bottom, rgba(14,14,14,0.08) 0%, transparent 25%, transparent 52%, rgba(14,14,14,0.92) 100%)',
            }} />
            <div style={{ position: 'absolute', bottom: 28, left: 28, right: 28 }}>
              <p className="font-sans uppercase tracking-[0.18em]" style={{ fontSize: '0.5rem', opacity: 0.5, color: '#f5f1e8', marginBottom: 8 }}>
                Grown PALMYCO™ · UAE production · 2025
              </p>
              <p className="font-display" style={{ fontSize: 'clamp(1rem, 1.8vw, 1.375rem)', lineHeight: 1.25, letterSpacing: '-0.02em', color: '#f5f1e8', opacity: 0.95 }}>
                One substrate. Multiple product engines.
              </p>
            </div>
          </motion.div>
        </div>
        <PlatformExpansion />
      </ISection>

      {/* 03 Revenue Engines */}
      <ISection id="revenue-engines">
        <ILabel text={iv.revenue_engines.label} />
        <IHeading text={iv.revenue_engines.heading} />
        <IBody text={iv.revenue_engines.body} />
        <RevenueEngines data={iv.revenue_engines} />
        <RevenueChart data={iv.revenue_chart} />
        <CompetitiveGrid data={iv.competitive} />
      </ISection>

      {/* 06 Why NUMU Endures */}
      <ISection id="why-it-survives">
        <ILabel text="06 — Why It Endures" />
        <IHeading text="Built around the pattern that has held." />
        {/* Pull-quote thesis */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px' }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0, 0.2, 1] }}
          className="my-10 px-8 py-8"
          style={{ borderLeft: `3px solid ${ACCENT}`, backgroundColor: `${ACCENT}0a`, maxWidth: 680 }}
        >
          <p className="font-display" style={{ fontSize: 'clamp(1.125rem, 2vw, 1.5rem)', lineHeight: 1.55, letterSpacing: '-0.02em', color: ACCENT, opacity: 0.92 }}>
            &ldquo;Specialty first. Margin first. Licensing scale later. The inverse of the heavy-capex playbook.&rdquo;
          </p>
        </motion.div>

        {/* Text + platform resilience diagram */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16 items-start">
          <div className="space-y-0">
            <p className="font-sans text-base md:text-lg leading-[1.85] pb-8" style={{ opacity: 0.72, borderBottom: INV_BORDER_SUBTLE }}>
              The mycelium materials sector has shown two distinct patterns. Several heavily venture-funded entrants — including Bolt Threads (Mylo) and MycoWorks — scaled back commercial operations after pursuing industrial-scale vertical integration tied to a single end-market. A separate cohort — Ecovative, Mogu, Grown.bio — has continued operating through specialty production, diversified revenue, and partner-led scale rather than owned industrial capex.
            </p>
            <p className="font-sans text-base md:text-lg leading-[1.85] py-8" style={{ opacity: 0.72, borderBottom: INV_BORDER_SUBTLE }}>
              NUMU is <em style={{ fontStyle: 'italic', color: ACCENT }}>structured around the pattern that has endured</em>. Specialty-scale production, not industrial vertical integration. Performance-led pricing, not sustainability premium. Four revenue engines on shared infrastructure, not a single-product bet. A licensing pathway to Year 3+ scale, not proportional capex.
            </p>
            <p className="font-sans text-base md:text-lg leading-[1.85] pt-8" style={{ opacity: 0.7 }}>
              The AED 2.2M raise funds an 18-month path to certified specification revenue and the operational foundation for regional licensing. It does not depend on building a heavy industrial facility on seed capital — the failure mode NUMU is designed to avoid.
            </p>
          </div>

          {/* Platform resilience diagram — each branch is an independent growth path */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '0px' }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0, 0.2, 1] }}
            className="lg:sticky lg:top-24"
            style={{ border: INV_BORDER, backgroundColor: 'rgba(245,241,232,0.03)', padding: '40px 34px' }}
          >
            <p className="font-sans text-label uppercase tracking-[0.18em] mb-8 text-center" style={{ opacity: 0.4, fontSize: '0.625rem' }}>Platform structure — resilience diagram</p>
            <svg viewBox="0 0 460 360" style={{ width: '100%', maxWidth: 460, display: 'block', margin: '0 auto' }}>
              <motion.rect
                x={160}
                y={18}
                width={140}
                height={56}
                rx={28}
                fill={`${ACCENT}14`}
                stroke={ACCENT}
                strokeWidth={1.5}
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.24 }}
              />
              <text x={230} y={42} textAnchor="middle" fontFamily="'Playfair Display',serif" fontSize={15} fill={ACCENT} fillOpacity={0.94} letterSpacing={0.4}>NUMU</text>
              <text x={230} y={59} textAnchor="middle" fontFamily="'Inter',sans-serif" fontSize={9} fill={ACCENT} fillOpacity={0.66} letterSpacing={1.4}>PLATFORM</text>

              <motion.line x1={230} y1={74} x2={230} y2={104}
                stroke={ACCENT} strokeWidth={1.35}
                initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }} transition={{ duration: 0.42, delay: 0.38 }}
              />
              <motion.line x1={80} y1={104} x2={380} y2={104}
                stroke="rgba(245,241,232,0.18)" strokeWidth={1}
                initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }} transition={{ duration: 0.52, delay: 0.46 }}
              />

              {[
                { x: 28, y: 120, w: 112, h: 54, title: 'Acoustics', sub: 'E1 + E3', active: true },
                { x: 174, y: 120, w: 112, h: 54, title: 'Packaging', sub: 'E2 + E4', active: false },
                { x: 320, y: 120, w: 112, h: 54, title: 'Thermal', sub: 'E4 future', active: false },
              ].map((branch, bi) => {
                const cx = branch.x + branch.w / 2

                return (
                  <g key={branch.title}>
                    <motion.line
                      x1={cx}
                      y1={104}
                      x2={cx}
                      y2={120}
                      stroke={branch.active ? ACCENT : 'rgba(245,241,232,0.22)'}
                      strokeWidth={branch.active ? 1.35 : 1}
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.38, delay: 0.58 + bi * 0.08 }}
                    />
                    <motion.rect
                      x={branch.x}
                      y={branch.y}
                      width={branch.w}
                      height={branch.h}
                      rx={27}
                      fill={branch.active ? `${ACCENT}12` : 'rgba(245,241,232,0.03)'}
                      stroke={branch.active ? ACCENT : 'rgba(245,241,232,0.2)'}
                      strokeWidth={branch.active ? 1.35 : 1}
                      initial={{ opacity: 0, y: 5 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.66 + bi * 0.08 }}
                    />
                    <text
                      x={cx}
                      y={151}
                      textAnchor="middle"
                      fontFamily="'Inter',sans-serif"
                      fontSize={10.5}
                      fill={branch.active ? ACCENT : 'rgba(245,241,232,0.76)'}
                      letterSpacing={0.25}
                    >
                      {branch.title}
                    </text>
                    <text
                      x={cx}
                      y={166}
                      textAnchor="middle"
                      fontFamily="'Inter',sans-serif"
                      fontSize={8.5}
                      fill={branch.active ? ACCENT : 'rgba(245,241,232,0.46)'}
                      letterSpacing={1}
                    >
                      {branch.sub}
                    </text>
                    <motion.line
                      x1={cx}
                      y1={174}
                      x2={cx}
                      y2={234}
                      stroke={branch.active ? ACCENT : 'rgba(245,241,232,0.16)'}
                      strokeWidth={branch.active ? 1.2 : 0.85}
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.38, delay: 0.76 + bi * 0.08 }}
                    />
                    <text
                      x={cx}
                      y={260}
                      textAnchor="middle"
                      fontFamily="'Inter',sans-serif"
                      fontSize={8.5}
                      fill={branch.active ? 'rgba(178,155,127,0.72)' : 'rgba(245,241,232,0.36)'}
                      letterSpacing={0.7}
                    >
                      Independent revenue
                    </text>
                    <text
                      x={cx}
                      y={275}
                      textAnchor="middle"
                      fontFamily="'Inter',sans-serif"
                      fontSize={8.5}
                      fill={branch.active ? 'rgba(178,155,127,0.72)' : 'rgba(245,241,232,0.36)'}
                      letterSpacing={0.7}
                    >
                      path
                    </text>
                  </g>
                )
              })}

              <motion.rect
                x={134}
                y={300}
                width={192}
                height={28}
                rx={14}
                fill="rgba(245,241,232,0.03)"
                stroke="rgba(245,241,232,0.12)"
                strokeWidth={0.9}
                initial={{ opacity: 0, y: 4 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 1.05 }}
              />
              <text
                x={230}
                y={318}
                textAnchor="middle"
                fontFamily="'Inter',sans-serif"
                fontSize={9}
                fill="rgba(245,241,232,0.48)"
                letterSpacing={1}
              >
                If one path is delayed, others continue
              </text>
            </svg>
            <p className="font-sans text-label mt-6 text-center" style={{ opacity: 0.34, fontSize: '0.5625rem', letterSpacing: '0.06em' }}>
              Shared production infrastructure — each branch activates independently
            </p>
          </motion.div>
        </div>

        {/* Failure vs survival comparison */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-px" style={{ backgroundColor: 'rgba(245,241,232,0.1)' }}>
          {[
            {
              label: 'Failed pattern',
              color: 'rgba(180,60,60,0.7)',
              items: ['Industrial-scale vertical integration', 'Single-product bet', 'Sustainability premium pricing', 'Proportional capex scaling'],
            },
            {
              label: 'NUMU strategy',
              color: ACCENT,
              items: ['Specialty-scale modular production', 'Four engines on shared infrastructure', 'Performance-led pricing', 'Licensing scale without capex'],
            },
          ].map(col => (
            <div key={col.label} className="px-10 py-10" style={{ backgroundColor: '#0e0e0e' }}>
              <p className="font-sans text-label uppercase tracking-[0.18em] mb-8" style={{ opacity: 0.5, color: col.color }}>{col.label}</p>
              {col.items.map(item => (
                <div key={item} className="flex items-start gap-3 mb-4">
                  <div style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: col.color, flexShrink: 0, marginTop: 7 }} />
                  <p className="font-sans text-base leading-snug" style={{ opacity: 0.65 }}>{item}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </ISection>

      {/* 07 Market — positioned after the resilience thesis */}
      <ISection id="market">
        <ILabel text="07 — Market" />
        <IHeading text={iv.market.heading} />
        <IBody text={iv.market.body} />
        <MarketTAMDiagram />
      </ISection>

      {/* 08 Founder Credibility */}
      <ISection id="founder-credibility">
        <ILabel text="08 — Founder" />
        <IHeading text="Not a research project. An operator." />
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-px" style={{ backgroundColor: 'rgba(245,241,232,0.1)' }}>
          {[
            { num: '7', unit: 'YEARS', label: 'Operational mycelium industrialization, Europe and Middle East' },
            { num: '2', unit: 'PATENTS', label: 'Process-level IP (Belgium)' },
            { num: '1', unit: 'BOOK', label: 'Designing Mycelium, Routledge 2024' },
            { num: '2', unit: 'INSTALLATIONS', label: 'Real conditions, documented (Netherlands 2022 — built; Dubai 2026 Q2 — in progress)' },
          ].map((stat, i) => (
            <motion.div
              key={stat.unit}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px' }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.25, 0, 0.2, 1] }}
              className="p-8 flex flex-col"
              style={{ backgroundColor: '#0e0e0e', minHeight: 160 }}
            >
              <p className="font-display mb-0.5" style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', letterSpacing: '-0.04em', lineHeight: 1, color: ACCENT }}>
                {stat.num}
              </p>
              <p className="font-sans uppercase tracking-[0.12em] mb-3" style={{ fontSize: '0.6875rem', opacity: 0.55 }}>{stat.unit}</p>
              <p className="font-sans text-sm leading-[1.65] mt-auto" style={{ opacity: 0.4 }}>{stat.label}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-[1fr_3fr] gap-10 items-start" style={{ borderTop: INV_BORDER, paddingTop: 48 }}>
          <div className="relative overflow-hidden" style={{ aspectRatio: '1/1', backgroundColor: 'rgba(245,241,232,0.04)', border: '1px solid rgba(245,241,232,0.08)', maxWidth: 240 }}>
            <Image
              src="/images/founder/Portrait.PNG"
              alt="Andy Cartier — NUMU founder"
              fill
              className="object-cover object-top"
              sizes="240px"
              style={{ filter: 'grayscale(100%)' }}
            />
          </div>
          <div>
            <p className="font-sans text-base md:text-lg leading-[1.85] mb-6" style={{ opacity: 0.68 }}>
              Andy dropped out of university to open his own design studio. He built a practice around material experimentation, product development, and applied design — working with manufacturers and clients across Europe and the Middle East. That path led to mycelium, not through academia, but through the practical problem of industrializing a biological process at production scale.
            </p>
            <p className="font-sans text-base leading-[1.85] mb-6" style={{ opacity: 0.55 }}>
              He has set up labs, run growth cycles, failed batches, fixed processes, and shipped real installations — Netherlands 2022 (built); Dubai 2026 Q2 (KAVE, in progress). He holds process-level patents in Belgium and published in the Routledge reference volume for bio-based material design. He is not a researcher who started a company. He is a builder who learned through real-world evidence what works in production and what does not.
            </p>
            <p className="font-sans text-base leading-[1.85]" style={{ opacity: 0.48 }}>
              Andy also holds co-founder positions in UFO (US, pressed mycelium composites) and Hyphen (US, bio-materials ecosystem) — relationships that extend NUMU&apos;s long-term technology and IP pipeline without diverting operational focus. Approximately 90% of his time is dedicated to NUMU. The point is not the credentials. The point is that he has already paid the tuition, on two continents, in real production conditions. NUMU is built on that foundation.
            </p>
          </div>
        </div>

        {/* Selected Recognition */}
        <div className="mt-16" style={{ borderTop: INV_BORDER, paddingTop: 40 }}>
          <p className="font-sans uppercase tracking-[0.2em] mb-10" style={{ fontSize: '0.6875rem', opacity: 0.35 }}>Selected Recognition</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0" style={{ borderTop: INV_BORDER_SUBTLE }}>
            {[
              { year: '2024', text: 'Chapter author — Designing with Mycelium, Routledge (global reference volume for bio-based material design)' },
              { year: '2022–23', text: '2 process-level patents filed — Belgium (mycelium composite formation and no-mold growth technique)' },
              { year: '2026 Q2', text: 'KAVE acoustic installation — in progress, Dubai (first mycelium acoustic installation in the GCC)' },
              { year: '2022', text: 'Beyond Chrysant installation — Netherlands (multi-panel grown acoustic system, public documentation)' },
              { year: 'Ongoing', text: 'Academic partnerships — De Montfort University, American University of Sharjah, Heriot-Watt Dubai, DIDI' },
              { year: 'Ongoing', text: '7+ years applied industrialization — mycelium composites, EU and GCC production environments' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '0px' }}
                transition={{ duration: 0.4, delay: i * 0.07, ease: [0.25, 0, 0.2, 1] }}
                className="flex items-baseline gap-6 py-4 px-0"
                style={{ borderBottom: INV_BORDER_SUBTLE }}
              >
                <span className="font-sans flex-shrink-0 w-16 text-right" style={{ fontSize: '0.6875rem', opacity: 0.32, letterSpacing: '0.06em' }}>{item.year}</span>
                <p className="font-sans leading-[1.65]" style={{ fontSize: '0.875rem', opacity: 0.62 }}>{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </ISection>

      {/* 10 Roadmap */}
      <ISection id="roadmap">
        <ILabel text={iv.roadmap.label} />
        <IHeading text={iv.roadmap.heading} />
        <Roadmap phases={iv.roadmap.phases} />
      </ISection>

      {/* 07 Business Model */}
      <ISection id="business-model">
        <ILabel text={iv.business_model.label} />
        <IHeading text={iv.business_model.heading} />
        <IBody text={iv.business_model.body} />
        <BusinessModelStreams />
      </ISection>

      {/* 08 Team */}
      <ISection id="team">
        <ILabel text={iv.team.label} />
        <IHeading text={iv.team.heading} />
        <IBody text={iv.team.body} />
        <TeamGrid members={iv.team.members} />
        <FounderEcosystem />
      </ISection>

      {/* 09 Use of Funds */}
      <ISection id="use-of-funds">
        <ILabel text={iv.use_of_funds.label} />
        <IHeading text={iv.use_of_funds.heading} />
        {/* Deal terms strip */}
        <div className="flex flex-wrap gap-6 mt-2 mb-10">
          {[
            { label: 'Instrument', value: 'Post-money SAFE' },
            { label: 'Amount', value: 'AED 2.2M' },
            { label: 'Runway', value: '18 months' },
            { label: 'Stage', value: 'Pre-seed / Seed' },
          ].map(t => (
            <div key={t.label} className="px-5 py-3" style={{ border: INV_BORDER, backgroundColor: 'rgba(245,241,232,0.03)' }}>
              <p className="font-sans text-label uppercase tracking-[0.14em] mb-1" style={{ opacity: 0.3 }}>{t.label}</p>
              <p className="font-sans text-sm" style={{ opacity: 0.75 }}>{t.value}</p>
            </div>
          ))}
        </div>
        <UseOfFundsChart items={iv.use_of_funds.items} />
      </ISection>

      {/* 10 CTA */}
      <ISection id="contact">
        <InvestorContact iv={iv} />
      </ISection>
    </>
  )
}

// ─── Investor password gate ───────────────────────────────────────────────────

function InvestorGate({ onUnlock, onCancel }: { onUnlock: () => void; onCancel: () => void }) {
  const [code, setCode] = useState('')
  const [shaking, setShaking] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
      style={{ position: 'fixed', inset: 0, zIndex: 200, backgroundColor: 'rgba(14,14,14,0.78)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={e => { if (e.target === e.currentTarget) onCancel() }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.98 }} transition={{ duration: 0.35, ease: [0.25, 0, 0.2, 1] }}
        style={{ width: '100%', maxWidth: 380, margin: '0 24px', padding: '48px 40px', backgroundColor: '#0e0e0e', border: '1px solid rgba(245,241,232,0.1)' }}
      >
        <p className="font-sans text-label uppercase tracking-[0.2em] mb-2" style={{ color: 'rgba(245,241,232,0.35)' }}>Investor Access</p>
        <p className="font-display mb-8" style={{ color: '#f5f1e8', fontSize: '1.5rem', letterSpacing: '-0.02em' }}>Enter access code</p>
        <form onSubmit={e => {
          e.preventDefault()
          if (code === 'NUMU2026') { onUnlock() }
          else { setShaking(true); setCode(''); setTimeout(() => setShaking(false), 500) }
        }}>
          <motion.input
            type="password" value={code} onChange={e => setCode(e.target.value)}
            placeholder="——————"
            animate={shaking ? { x: [-6, 6, -5, 5, -3, 3, 0] } : { x: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full font-sans text-sm px-5 py-4 bg-transparent outline-none mb-4 tracking-[0.18em]"
            style={{ border: shaking ? '1px solid rgba(180,60,60,0.6)' : '1px solid rgba(245,241,232,0.18)', color: 'rgba(245,241,232,0.9)', transition: 'border-color 0.2s' }}
          />
          <button type="submit" className="w-full font-sans text-label uppercase tracking-[0.14em] py-3.5" style={{ backgroundColor: 'rgba(245,241,232,0.09)', border: '1px solid rgba(245,241,232,0.18)', color: 'rgba(245,241,232,0.8)', cursor: 'pointer' }}>
            Enter →
          </button>
        </form>
        <button onClick={onCancel} className="w-full font-sans text-label uppercase tracking-[0.12em] mt-4 py-2" style={{ opacity: 0.28, cursor: 'pointer' }}>
          Cancel
        </button>
      </motion.div>
    </motion.div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function PageClient({ visitor, investor }: { visitor: VisitorContent; investor: InvestorContent }) {
  const [isInvestor, setIsInvestor] = useState(false)
  const [showGate, setShowGate] = useState(false)
  const [transitioning, setTransitioning] = useState(false)
  const [loadingDone, setLoadingDone] = useState(false)

  const theme = isInvestor ? INVESTOR : VISITOR

  function switchToInvestor() {
    setTransitioning(true)
    window.scrollTo({ top: 0, behavior: 'instant' })
    setTimeout(() => { setIsInvestor(true); setTransitioning(false) }, 320)
  }

  function switchToVisitor() {
    setTransitioning(true)
    window.scrollTo({ top: 0, behavior: 'instant' })
    setTimeout(() => { setIsInvestor(false); setTransitioning(false) }, 320)
  }

  return (
    <div style={{ backgroundColor: theme.bg, color: theme.fg, minHeight: '100vh', transition: 'background-color 0.6s cubic-bezier(0.25,0,0.2,1), color 0.6s cubic-bezier(0.25,0,0.2,1)', position: 'relative' }}>
      <BackgroundAssetWarmup />

      {/* Subtle grain overlay — adds depth without visual noise */}
      {!isInvestor && (
        <div aria-hidden style={{
          position: 'fixed', inset: 0, zIndex: 9998, pointerEvents: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          opacity: 0.022,
          mixBlendMode: 'multiply',
        }} />
      )}

      {/* Loading screen */}
      {!loadingDone && <LoadingScreen onComplete={() => setLoadingDone(true)} />}

      {/* Password gate */}
      <AnimatePresence>
        {showGate && (
          <InvestorGate
            onUnlock={() => { setShowGate(false); switchToInvestor() }}
            onCancel={() => setShowGate(false)}
          />
        )}
      </AnimatePresence>

      {/* Nav */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 h-16 md:h-20 flex items-center justify-between"
        style={{
          backgroundColor: isInvestor ? 'rgba(14,14,14,0.82)' : 'rgba(245,241,232,0.82)',
          backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
          borderBottom: BORDER,
          transition: 'background-color 0.6s cubic-bezier(0.25,0,0.2,1)',
        }}
      >
        <Image
          src={isInvestor ? '/branding/logo-numu.png' : '/branding/logo-black-numu.png'}
          alt="NUMU" width={240} height={96}
          className="h-16 md:h-20 w-auto object-contain"
          style={isInvestor
            ? { filter: 'brightness(0) invert(1) sepia(1) saturate(0) brightness(0.92)' }
            : { mixBlendMode: 'multiply' }}
          priority
        />
        <div className="flex items-center" style={{ border: BORDER, borderRadius: 999, padding: 3 }}>
          {[
            { label: 'Explore', active: !isInvestor, onClick: () => { if (isInvestor) switchToVisitor() } },
            { label: 'Investor', active: isInvestor, onClick: () => { if (!isInvestor) setShowGate(true) } },
          ].map(btn => (
            <button
              key={btn.label} onClick={btn.onClick}
              className="px-4 py-1.5 font-sans text-label uppercase tracking-[0.1em] rounded-full transition-colors duration-200"
              style={{ backgroundColor: btn.active ? (isInvestor ? 'rgba(245,241,232,0.14)' : 'rgba(26,23,20,0.12)') : 'transparent', cursor: 'pointer' }}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Hero 1 — identity */}
      <section className="flex flex-col items-center justify-center text-center px-6" style={{ height: '100vh', minHeight: 600, position: 'relative' }}>
        <h1 className="font-display" style={{ fontSize: 'var(--hero-size)', lineHeight: 'var(--hero-lh)', letterSpacing: '-0.04em' }}>NUMU</h1>
        <p
          lang="ar"
          dir="rtl"
          className="mt-4"
          style={{
            fontFamily: '"Geeza Pro", "Noto Naskh Arabic", serif',
            fontSize: 'clamp(1.65rem, 3.1vw, 2.8rem)',
            lineHeight: 1.05,
            opacity: 0.48,
            letterSpacing: 0,
            unicodeBidi: 'plaintext',
          }}
        >
          نُمُوّ
        </p>
        <p className="font-sans mt-5 uppercase tracking-[0.18em]" style={{ fontSize: 'clamp(0.72rem, 1.1vw, 0.8rem)', opacity: 0.56 }}>
          UAE — Bio-composites platform
        </p>
        <p className="font-sans mt-6" style={{ fontSize: 'clamp(0.9rem, 1vw, 0.98rem)', opacity: 0.68, letterSpacing: '0.04em', lineHeight: 1.7 }}>
          Grown, not manufactured.
        </p>
        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.34 }}
          transition={{ delay: 1.4, duration: 1.0 }}
          style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
        >
          <p className="font-sans uppercase tracking-[0.2em]" style={{ fontSize: 7 }}>Scroll</p>
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.3 }}
          >
            <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
              <path d="M5 0v10M1 7l4 4 4-4" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        </motion.div>
      </section>

      {/* Hero 2 — product visual */}
      <section
        className="relative flex flex-col items-center justify-center px-6 text-center"
        style={{
          height: '100vh',
          minHeight: 600,
          borderTop: BORDER,
          overflow: 'hidden',
          paddingTop: isInvestor ? '7rem' : '6rem',
          paddingBottom: isInvestor ? '5rem' : '6.5rem',
        }}
      >
        {/* Background — visitor: spore field, investor: 3D rotating panel */}
        {!isInvestor ? (
          <>
            {/* Soft warm center glow — full-bleed, no clip */}
            <div style={{
              position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
              background: 'radial-gradient(ellipse 74% 64% at 50% 40%, rgba(178,155,127,0.16) 0%, transparent 67%)',
            }} />
            <SporeField />
          </>
        ) : (
          <>
            {/* Subtle warm center glow for investor */}
            <div style={{
              position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
              background: 'radial-gradient(ellipse 58% 54% at 50% 46%, rgba(178,155,127,0.11) 0%, transparent 64%)',
            }} />
            <div style={{
              position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
              background: 'radial-gradient(circle at 50% 52%, rgba(245,241,232,0.035) 0%, transparent 42%)',
            }} />
            <HyphaeField />
          </>
        )}

        {/* Bottom vignette — softens transition to first content section */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '32%', zIndex: 1, pointerEvents: 'none',
          background: isInvestor
            ? 'linear-gradient(to top, rgba(14,14,14,0.65) 0%, transparent 100%)'
            : 'linear-gradient(to top, rgba(245,241,232,0.88) 0%, transparent 100%)',
        }} />

        {/* Foam block cutout — FILE: /public/images/hero/mycofoam_block_01.png
             Using the existing PNG keeps the hero dependable in local/dev and deploy. */}
        {!isInvestor && (
          <div style={{
            position: 'absolute', bottom: '24%', left: '50%',
            transform: 'translateX(-50%)',
            width: 'min(54vw, 440px)',
            zIndex: 1,
            pointerEvents: 'none',
            mixBlendMode: 'multiply' as React.CSSProperties['mixBlendMode'],
            opacity: 0.46,
            filter: 'contrast(1.02) saturate(0.88)',
          }}>
            <Image
              src="/images/hero/mycofoam_block_01.png"
              alt=""
              aria-hidden
              width={440}
              height={440}
              priority
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
        )}

        <div
          className="relative w-full mx-auto text-center"
          style={{
            zIndex: 2,
            maxWidth: isInvestor ? 960 : 1080,
            transform: isInvestor ? 'translateY(-4vh)' : 'translateY(-3vh)',
          }}
        >
          <p className="font-sans uppercase tracking-[0.18em] mb-6" style={{ opacity: 0.44, fontSize: '0.75rem' }}>
            {isInvestor ? investor.hero.sublabel : visitor.hero.sublabel}
          </p>
          {(isInvestor ? investor.hero.lines : visitor.hero.lines).map((line, i) => (
            <h2
              key={i}
              className="font-display block text-center"
              style={{
                fontSize: isInvestor ? 'clamp(2.6rem, 5.2vw, 4.75rem)' : 'clamp(2.9rem, 6.3vw, 6.2rem)',
                lineHeight: 1.02,
                letterSpacing: '-0.03em',
              }}
            >{line}</h2>
          ))}
          <div
            className="mt-8 pt-6 flex flex-col items-center mx-auto"
            style={{ borderTop: BORDER, width: isInvestor ? 'min(100%, 820px)' : 'min(100%, 780px)' }}
          >
            <p className="font-sans text-label uppercase tracking-[0.14em] mb-8" style={{ opacity: 0.44 }}>
              {isInvestor ? investor.hero.meta : visitor.hero.meta}
            </p>
            <a
              href={isInvestor ? investor.hero.cta.href : visitor.hero.cta.href}
              className="font-sans text-label uppercase tracking-[0.14em] px-7 py-4 border inline-block"
              style={{ borderColor: 'rgba(128,128,128,0.4)', transition: 'border-color 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = isInvestor ? 'rgba(245,241,232,0.7)' : 'rgba(26,23,20,0.6)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(128,128,128,0.4)' }}
            >
              {isInvestor ? investor.hero.cta.label : visitor.hero.cta.label} ↓
            </a>
            {isInvestor && (
              <div className="mt-10 grid grid-cols-3 gap-px overflow-hidden rounded-sm" style={{ backgroundColor: 'rgba(245,241,232,0.2)', maxWidth: 700, width: '100%' }}>
                {[
                  { v: 'AED 2.2M', l: 'Raise' },
                  { v: '18 mo', l: 'Runway to certified spec' },
                  { v: 'UAE', l: 'Production + first market' },
                ].map(s => (
                  <div key={s.l} className="px-4 py-4 md:px-5 md:py-5" style={{ backgroundColor: 'rgba(14,14,14,0.86)' }}>
                    <p className="font-display" style={{ fontSize: 'clamp(1rem, 1.8vw, 1.35rem)', letterSpacing: '-0.02em', lineHeight: 1.1, color: ACCENT }}>{s.v}</p>
                    <p className="font-sans uppercase tracking-[0.14em] mt-1.5" style={{ fontSize: '0.5625rem', opacity: 0.52 }}>{s.l}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Page content */}
      <div style={{ opacity: transitioning ? 0 : 1, transition: 'opacity 0.35s cubic-bezier(0.25,0,0.2,1)' }}>
        {isInvestor ? <InvestorView iv={investor} /> : <VisitorView v={visitor} teamMembers={investor.team.members} />}
      </div>

    </div>
  )
}
