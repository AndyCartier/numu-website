'use client'

import { useState, useRef, useEffect } from 'react'
import Image from '@/components/SafariSafeImage'
import Link from 'next/link'
import { motion, AnimatePresence, useInView, useMotionValue, animate, MotionConfig, useReducedMotion } from 'framer-motion'
import { useModalFocus } from '@/components/useModalFocus'
import type { InvestorStory } from '@/lib/investorStory'
import InvestorView from './InvestorView'
import type { VisitorContent, PublicTeamMember } from '@/lib/content'
import { PRIMARY_NAV_LINKS } from '@/lib/navigation'
import {
  cancelIdleTask,
  DEFERRED_IMAGE_ASSETS,
  DEFERRED_VIDEO_ASSETS,
  requestIdleTask,
  warmMediaAssets,
} from './preloadAssets'
import ProcessDiagram from '@/components/ProcessDiagram'
import { framing, type ImageFraming } from '@/lib/commerce/imageFit'
import CollectionFeatures, { HomeIntroduction } from '@/components/CollectionFeatures'
import MobileNav from '@/components/MobileNav'
import ImageDialog from '@/components/ImageDialog'
import { DESIGN } from '@/lib/design'
import NumuName from '@/components/eggs/NumuName'
import { CHAPTERS, type Chapter } from '@/lib/chapters'


// ─── Themes ───────────────────────────────────────────────────────────────────
const INVESTOR = { bg: '#0e0e0e', fg: '#f5f1e8' }
const VISITOR = { bg: '#f5f1e8', fg: '#1a1714' }
const BORDER = '1px solid rgba(128,128,128,0.15)'
const ACCENT = '#B29B7F'  // warm-mid — accent for investor highlights

// ─── CountUp ──────────────────────────────────────────────────────────────────

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
  const [errorMessage, setErrorMessage] = useState('Sending is temporarily unavailable. Please try again shortly.')

  const border = dark ? '1px solid rgba(245,241,232,0.22)' : BORDER
  const buttonBorder = dark ? '1px solid rgba(245,241,232,0.22)' : '1px solid #1a1714'
  const buttonBg = dark ? 'rgba(245,241,232,0.1)' : '#1a1714'
  const inputColor = dark ? 'rgba(245,241,232,0.85)' : 'rgba(26,23,20,0.88)'
  const primaryTextOpacity = dark ? 0.76 : 0.68
  const secondaryTextOpacity = dark ? 0.68 : 0.7
  const errorTextOpacity = dark ? 0.55 : 0.58

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || status === 'loading') return

    setStatus('loading')
    setErrorMessage('Sending is temporarily unavailable. Please try again shortly.')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, website, requestType, source }),
      })

      if (!res.ok) {
        const payload = await res.json().catch(() => null)
        const message = typeof payload?.error === 'string' ? payload.error : 'Request failed'

        if (res.status === 429) {
          setErrorMessage('Too many attempts from this browser right now. Please wait a few minutes and try again.')
        } else if (res.status === 400) {
          setErrorMessage(message)
        } else {
          setErrorMessage('Sending is temporarily unavailable. Please try again shortly.')
        }

        throw new Error(message)
      }

      setStatus('sent')
      setEmail('')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div role="status" className="max-w-lg">
        <p className="font-sans text-base" style={{ opacity: primaryTextOpacity, lineHeight: 1.6 }}>
          Request sent.
        </p>
        <p className="font-sans text-sm mt-2" style={{ opacity: secondaryTextOpacity, lineHeight: 1.6 }}>
          We&apos;ll review it and reply directly if there&apos;s a fit.
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
          aria-label="Email address"
          autoComplete="email"
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
          className="font-sans uppercase tracking-[0.14em] px-7 py-4 flex-shrink-0 numu-form-submit"
          style={{
            border: buttonBorder,
            backgroundColor: buttonBg,
            color: dark ? undefined : '#f5f1e8',
            fontSize: '0.75rem',
            cursor: status === 'loading' ? 'wait' : 'pointer',
            opacity: status === 'loading' ? 0.55 : 1,
            transition: 'background-color 0.2s, opacity 0.2s',
          }}
        >
          {status === 'loading' ? 'Sending…' : submitLabel}
        </button>
      </form>
      <p className="font-sans text-xs mt-3" style={{ opacity: secondaryTextOpacity, lineHeight: 1.7 }}>
        By submitting, you agree that NUMU may use your email to respond to this request in line with our{' '}
        <Link href="/privacy" style={{ color: 'inherit', textDecoration: 'underline' }}>
          Privacy Policy
        </Link>
        {' '}and{' '}
        <Link href="/terms" style={{ color: 'inherit', textDecoration: 'underline' }}>
          Terms
        </Link>
        .
      </p>
      {status === 'error' && (
        <p role="alert" className="font-sans text-xs mt-3" style={{ opacity: errorTextOpacity }}>
          {errorMessage}
        </p>
      )}
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
  const reducedMotion = useReducedMotion()
  const videoRef = useRef<HTMLVideoElement>(null)
  useEffect(() => { if (reducedMotion) videoRef.current?.pause() }, [reducedMotion])
  const [videoFailed, setVideoFailed] = useState(false)
  const [playing, setPlaying] = useState(false)
  // Load and play only near the viewport, pause when scrolled away: phones on mobile data
  // (e.g. visitors arriving from an exhibition QR code) no longer download every film up front.
  const frameRef = useRef<HTMLDivElement>(null)
  const [near, setNear] = useState(false)
  useEffect(() => {
    const frame = frameRef.current
    if (!frame || typeof IntersectionObserver === 'undefined') { setNear(true); return }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setNear(true)
      const video = videoRef.current
      if (!video || reducedMotion) return
      if (entry.isIntersecting) void video.play().catch(() => undefined)
      else video.pause()
    }, { rootMargin: '400px 0px' })
    observer.observe(frame)
    return () => observer.disconnect()
  }, [reducedMotion])
  const togglePlayback = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) void video.play().catch(() => setPlaying(false))
    else video.pause()
  }
  return (
    <div ref={frameRef} style={{ position: 'absolute', inset: 0, backgroundColor: '#1a1714', overflow: 'hidden' }}>
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
        ref={videoRef}
        aria-label={altLabel || "NUMU material film"}
        controls={Boolean(reducedMotion)}
        poster={poster}
        src={near ? src : undefined}
        preload={near ? preload : 'none'}
        autoPlay={!reducedMotion && near}
        muted
        loop
        playsInline
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => setVideoFailed(true)}
        onCanPlay={(event) => {
          setVideoFailed(false)
          if (!reducedMotion) void event.currentTarget.play().catch(() => undefined)
        }}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: videoFailed ? 'none' : undefined, ...style }}
        suppressHydrationWarning
      />

      {overlay}
      {!videoFailed && !playing && (
        <button
          type="button"
          aria-label="Play NUMU material film"
          onClick={togglePlayback}
          className="video-play-button"
        >
          <svg width="14" height="16" viewBox="0 0 14 16" aria-hidden="true"><path d="M1 1l12 7-12 7z" fill="currentColor" /></svg>
        </button>
      )}
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

// ─── Event notice ────────────────────────────────────────────────────────────
// Shown in the hero only while an event is current. Wording and dates match the printed
// Taghazout leaflet (numu-exhibition-leaflet/variants/taghazout.json). Hidden automatically after.
const CURRENT_EVENT = {
  label: 'Taghazout Surf Festival · Morocco · 22–25 October',
  ends: '2026-10-26T00:00:00+01:00',
  href: '/palmyco#surf-research',
}

function EventNotice() {
  const [show, setShow] = useState(false)
  useEffect(() => { setShow(Date.now() < new Date(CURRENT_EVENT.ends).getTime()) }, [])
  if (!show) return null
  return (
    <a href={CURRENT_EVENT.href} className="event-notice">
      <span className="event-notice-dot" aria-hidden />
      <span>Meet NUMU at the {CURRENT_EVENT.label}</span>
    </a>
  )
}

// ─── Spore Field — visitor hero: organic growing hyphae + spore flutter ────────

function SporeField() {
  const ref = useRef<HTMLCanvasElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let visible = true
    let viewportWidth = 0
    let viewportHeight = 0

    const resize = () => {
      const host = canvas.parentElement
      const rect = host?.getBoundingClientRect() ?? canvas.getBoundingClientRect()
      const nextWidth = Math.max(1, Math.round(rect.width))
      const nextHeight = Math.max(1, Math.round(rect.height))
      const dpr = Math.min(window.devicePixelRatio || 1, 2)

      viewportWidth = nextWidth
      viewportHeight = nextHeight

      canvas.style.width = `${nextWidth}px`
      canvas.style.height = `${nextHeight}px`
      canvas.width = Math.round(nextWidth * dpr)
      canvas.height = Math.round(nextHeight * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
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
      const W = viewportWidth
      const H = viewportHeight
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
      x: Math.random() * viewportWidth,
      y: Math.random() * viewportHeight,
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
      if (!visible || document.hidden) return
      ctx.clearRect(0, 0, viewportWidth, viewportHeight)
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
        if (s.y < -12) { s.y = viewportHeight + 6; s.x = Math.random() * viewportWidth }
        if (s.x < -12) s.x = viewportWidth + 8
        if (s.x > viewportWidth + 12) s.x = -8
        ctx.save()
        ctx.globalAlpha = s.alpha
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(26,23,20,1)'
        ctx.fill()
        ctx.restore()
      }

      if (!reducedMotion) raf = requestAnimationFrame(draw)
    }

    draw()
    const redraw = () => { cancelAnimationFrame(raf); resize(); draw() }
    const ro = new ResizeObserver(redraw)
    ro.observe(canvas.parentElement || canvas)
    const visibility = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; cancelAnimationFrame(raf); if (visible) draw() })
    visibility.observe(canvas.parentElement || canvas)
    document.addEventListener('visibilitychange', redraw)
    return () => { cancelAnimationFrame(raf); ro.disconnect(); visibility.disconnect(); document.removeEventListener('visibilitychange', redraw) }
  }, [reducedMotion])

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
    />
  )
}

function HyphaeField() {
  const ref = useRef<HTMLCanvasElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let visible = true
    let viewportWidth = 0
    let viewportHeight = 0

    const resize = () => {
      const host = canvas.parentElement
      const rect = host?.getBoundingClientRect() ?? canvas.getBoundingClientRect()
      const nextWidth = Math.max(1, Math.round(rect.width))
      const nextHeight = Math.max(1, Math.round(rect.height))
      const dpr = Math.min(window.devicePixelRatio || 1, 2)

      viewportWidth = nextWidth
      viewportHeight = nextHeight

      canvas.style.width = `${nextWidth}px`
      canvas.style.height = `${nextHeight}px`
      canvas.width = Math.round(nextWidth * dpr)
      canvas.height = Math.round(nextHeight * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
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
      const cw = viewportWidth
      const ch = viewportHeight
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
      if (!visible || document.hidden) return
      ctx.clearRect(0, 0, viewportWidth, viewportHeight)

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

      if (!reducedMotion) raf = requestAnimationFrame(draw)
    }

    draw()

    const redraw = () => { cancelAnimationFrame(raf); resize(); draw() }
    const ro = new ResizeObserver(redraw)
    ro.observe(canvas.parentElement || canvas)

    const visibility = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; cancelAnimationFrame(raf); if (visible) draw() })
    visibility.observe(canvas.parentElement || canvas)
    document.addEventListener('visibilitychange', redraw)
    return () => { cancelAnimationFrame(raf); ro.disconnect(); visibility.disconnect(); document.removeEventListener('visibilitychange', redraw) }
  }, [reducedMotion])

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
    />
  )
}

function VSection({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <section id={id} className="px-6 md:px-12 py-20 md:py-[104px]" style={{ borderTop: BORDER, scrollMarginTop: 'calc(var(--nav-h) + 16px)' }}>
      <div className="max-w-[1440px] mx-auto">{children}</div>
    </section>
  )
}

function VSectionFullBleed({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <section id={id} className="py-20 md:py-[104px]" style={{ borderTop: BORDER }}>
      {children}
    </section>
  )
}

function VLabel({ text }: { text: string }) {
  return (
    <p data-reveal className="font-sans text-label uppercase tracking-[0.18em] mb-6" style={{ opacity: 0.68, fontSize: 'clamp(0.68rem, 1.2vw, 0.78rem)' }}>
      {text}
    </p>
  )
}

function VHeading({ text }: { text: string }) {
  return (
    <h2 data-reveal className="font-display text-headline mb-10 max-w-3xl" style={{ textWrap: 'balance' as React.CSSProperties['textWrap'] }}>
      {text}
    </h2>
  )
}

function VBody({ text }: { text: string }) {
  return (
    <p className="font-sans text-base md:text-[1.0625rem] leading-[1.75] mb-12 max-w-2xl" style={{ opacity: 0.84 }}>
      {text}
    </p>
  )
}


export function ProductionFeature() {
  return (
    <section className="px-6 md:px-12 py-20 md:py-[104px]" style={{ borderTop: BORDER }}>
      <div className="max-w-[1440px] mx-auto">
        <div className="mb-10">
          <p className="font-sans text-label uppercase tracking-[0.18em] mb-3" style={{ opacity: 0.68 }}>Production</p>
          <p className="font-sans text-base max-w-lg" style={{ opacity: 0.48, lineHeight: 1.75 }}>
            NUMU has run an active production lab in Dubai since 2025. Material is grown and pressed from regional agricultural waste — no imports, no synthetic resins.
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

const CAROUSEL_ITEMS = [
  { src: '/images/catalogue/material/palmyco-samples-in-hand.jpg', alt: 'Two PALMYCO™ grown samples held in hand, showing the section', label: 'Grown samples' },
  { src: '/images/textures/texture_closeup_01.jpg', alt: 'Close view of the grown PALMYCO™ surface', label: 'Surface texture' },
  { src: '/images/catalogue/veneer/veneer-material-02.jpg', alt: 'Grown veneer surface with dark veins through a pale ground', label: 'Grown veneer' },
  { src: '/images/applications/event_board.jpg', alt: 'Pressed mycelium composite board from a test batch', label: 'Pressed board' },
  { src: '/images/projects/Pressed_samples.jpg', alt: 'Pressed composite samples laid out for batch testing', label: 'Batch testing' },
  { src: '/images/textures/texture_closeup_02.jpg', alt: 'Macro view of fibre bound by mycelium', label: 'Surface detail' },
  { src: '/images/projects/pressed_booth.jpg', alt: 'Pressed board panels assembled into a booth', label: 'Pressed board in use' },
]
const CAROUSEL_W = 400
const CAROUSEL_H = 300

export function ProcessCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null)
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null)

  useEffect(() => {
    if (!lightbox) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightbox(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox])

  return (
    <section className="px-6 md:px-12 py-20 md:py-[104px]" style={{ borderTop: BORDER }}>
      {lightbox && <ImageDialog item={lightbox} onClose={() => setLightbox(null)} />}

      <div className="max-w-[1440px] mx-auto mb-8">
        <p className="font-sans text-label uppercase tracking-[0.18em] mb-2" style={{ opacity: 0.68 }}>
          Material &amp; process — photographs from the Dubai lab
        </p>
        <p className="font-sans text-xs" style={{ opacity: 0.7 }}>← scroll · click to enlarge →</p>
        <div className="carousel-actions"><button type="button" aria-label="Previous material images" onClick={() => carouselRef.current?.scrollBy({ left: -408, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })}>← Previous</button><button type="button" aria-label="Next material images" onClick={() => carouselRef.current?.scrollBy({ left: 408, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })}>Next →</button></div>
      </div>
      <div
        ref={carouselRef}
        role="region" aria-label="Material experiments gallery" tabIndex={0}
        data-lightbox="off"
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
          <button type="button" aria-label={`Enlarge: ${item.alt}`}
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
              <p className="font-sans uppercase tracking-[0.12em]" style={{ fontSize: 12, opacity: 0.94, color: '#f5f1e8' }}>{item.label}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}

// ─── Built work ───────────────────────────────────────────────────────────────
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

// Full-bleed entry into the inquiry catalogue. Real artwork photograph, no claims.
function CollectionBand() {
  return (
    <section
      id="collection"
      className="relative overflow-hidden"
      style={{ height: '78vh', minHeight: 520, borderTop: BORDER }}
    >
      <Image
        src="/images/catalogue/aurum/aurum-gold-detail.jpg"
        alt="Gold traced into the grown relief of an Aurum work, Fungal Art Series"
        data-lightbox="off"
        fill
        className="object-cover object-center"
        sizes="100vw"
      />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,8,6,0.72) 0%, rgba(10,8,6,0.28) 55%, rgba(10,8,6,0.18) 100%)' }} />
      <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-12 pb-12 md:pb-16" style={{ zIndex: 2 }}>
        <div className="max-w-[1440px] w-full mx-auto">
          <p className="font-sans uppercase tracking-[0.24em] mb-5" style={{ fontSize: '0.75rem', opacity: 0.78, color: '#f5f1e8' }}>
            The collection — Objects &amp; Surfaces
          </p>
          <h2 className="font-display max-w-4xl" style={{ fontSize: 'clamp(2.6rem, 7vw, 6.5rem)', lineHeight: 0.92, letterSpacing: '-0.045em', color: '#f5f1e8' }}>
            Surfaces, light and works, grown to order.
          </h2>
          <p className="font-sans mt-6 max-w-xl leading-[1.7]" style={{ fontSize: '1rem', color: '#f5f1e8', opacity: 0.78 }}>
            Acoustic surfaces, grown veneer furniture and cladding, Mushroomiya lighting, Fungal Art Series® works and bespoke commissions. Every piece is offered by inquiry, with price on request.
          </p>
          <Link
            href="/shop"
            className="font-sans uppercase tracking-[0.16em] inline-block mt-8 px-7 py-4"
            style={{ fontSize: '0.75rem', color: '#f5f1e8', border: '1px solid rgba(245,241,232,0.55)', textDecoration: 'none' }}
          >
            View the collection →
          </Link>
        </div>
      </div>
    </section>
  )
}


function PublicTeamCard({ member }: { member: PublicTeamMember }) {
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
        <p className="font-sans uppercase tracking-[0.14em] mb-4" style={{ fontSize: '0.75rem', opacity: 0.68 }}>
          {member.role}
        </p>
        <p className="font-sans leading-[1.7]" style={{ fontSize: '0.9rem', opacity: 0.84 }}>
          {member.bio || PUBLIC_TEAM_BLURBS[member.imageKey]}
        </p>
      </div>
    </div>
  )
}

// ─── Founder Ecosystem ───────────────────────────────────────────────────────

const MAX_VIDEO_TIME = 90  // seconds — trim point

function LabVideo() {
  const reducedMotion = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)
  const ref = useRef<HTMLVideoElement>(null)
  const userPausedRef = useRef(false)
  const [playing, setPlaying] = useState(false)
  const [ready, setReady] = useState(false)
  const [progress, setProgress] = useState(0)
  const [hovering, setHovering] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)
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
    const video = ref.current
    if (video && video.readyState >= 1) {
      setReady(true)
    }

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

    if (inView && !userPausedRef.current && !reducedMotion) {
      play()
      return
    }

    if (!inView && playing) {
      pause()
    }
  }, [inView, ready, playing, reducedMotion])

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = e.currentTarget.getBoundingClientRect()
    const p = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    ref.current.currentTime = p * MAX_VIDEO_TIME
    setProgress(p)
  }

  return (
    <div>
      <div
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{ aspectRatio: '16/9', backgroundColor: 'rgba(128,128,128,0.05)' }}
      onFocusCapture={() => setHovering(true)}
      onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setHovering(false) }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <Image
        src="/images/products/lab-film-poster.jpg"
        alt="Inspecting a freshly grown panel at the drying rack, from the NUMU process film"
        fill
        className="object-cover"
        sizes="(max-width: 1024px) 100vw, 80vw"
        style={{ opacity: ready && !videoFailed && (playing || progress > 0) ? 0 : 1, transition: 'opacity 0.25s ease' }}
      />
      <video
        ref={ref}
        src="/videos/numu_story_enhanced.mp4"
        muted
        loop
        playsInline
        preload="metadata"
        onLoadedMetadata={() => { setVideoFailed(false); setReady(true) }}
        onCanPlay={() => { setVideoFailed(false); setReady(true) }}
        onError={() => { setVideoFailed(true); setReady(false); setPlaying(false) }}
        onEnded={() => { if (ref.current) { ref.current.currentTime = 0; ref.current.play() } }}
        className="w-full h-full object-cover block"
        style={{ opacity: ready && !videoFailed && (playing || progress > 0) ? 1 : 0, transition: 'opacity 0.25s ease' }}
        suppressHydrationWarning
      />

      {/* Play hint — only when ready and not yet played */}
      {ready && !playing && !hovering && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <p className="font-sans uppercase tracking-[0.18em] px-4 py-2" style={{ fontSize: '0.75rem', color: '#f5f1e8', backgroundColor: 'rgba(26,23,20,0.62)' }}>Play process film</p>
        </div>
      )}

      {/* Minimal hover controls — time bar + pause */}
      {ready && (
        <div className="lab-controls"
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            padding: '14px 16px 12px',
            background: 'linear-gradient(to top, rgba(0,0,0,0.52) 0%, transparent 100%)',
            opacity: hovering || !playing ? 1 : 0,
            transition: 'opacity 0.25s ease',
            display: 'flex', alignItems: 'center', gap: 12,
          }}
        >
          {/* Pause / play icon */}
          <button aria-label={playing ? 'Pause' : 'Play'} onClick={toggle} style={{ background: 'none', border: 'none', padding: 12, minWidth: 44, minHeight: 44, cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
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
            role="slider" tabIndex={0} aria-label="Video position" aria-valuemin={0} aria-valuemax={MAX_VIDEO_TIME} aria-valuenow={Math.round(progress * MAX_VIDEO_TIME)} aria-valuetext={`${Math.round(progress * MAX_VIDEO_TIME)} seconds`}
            onKeyDown={event => {
              if (!ref.current || !['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return
              event.preventDefault()
              const next = event.key === 'Home' ? 0 : event.key === 'End' ? MAX_VIDEO_TIME - 0.1 : Math.max(0, Math.min(MAX_VIDEO_TIME - 0.1, ref.current.currentTime + (event.key === 'ArrowRight' ? 5 : -5)))
              ref.current.currentTime = next
              setProgress(next / MAX_VIDEO_TIME)
            }}
            style={{ flex: 1, height: 2, backgroundColor: 'rgba(245,241,232,0.2)', borderRadius: 1, cursor: 'pointer', position: 'relative' }}
          >
            <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${progress * 100}%`, backgroundColor: 'rgba(245,241,232,0.85)', borderRadius: 1, transition: 'width 0.25s linear' }} />
            {/* Playhead dot */}
            <div style={{ position: 'absolute', top: '50%', left: `${progress * 100}%`, transform: 'translate(-50%,-50%)', width: 7, height: 7, borderRadius: '50%', backgroundColor: 'rgba(245,241,232,0.95)' }} />
          </div>
          {/* Time remaining */}
          <p className="font-sans" style={{ fontSize: '0.75rem', opacity: 0.9, color: '#f5f1e8', flexShrink: 0, letterSpacing: '0.08em' }}>
            {Math.floor((1 - progress) * MAX_VIDEO_TIME)}s
          </p>
        </div>
      )}
      </div>
    </div>
  )
}

const MOODBOARDS = [
  {
    label: 'Hospitality',
    heading: 'Atmosphere, grown into place.',
    copy: 'Warm, tactile interiors where acoustic surface, lighting, and material character create a memorable guest experience.',
    images: [
      { src: '/images/moodboards/hospitality-fold-restaurant.webp', alt: 'FOLD acoustic panels in a restaurant ceiling concept', featured: true },
      { src: '/images/moodboards/hospitality-mushroomiya-lounge.webp', alt: 'Mushroomiya lighting in a hotel lounge concept', featured: true },
      { src: '/images/moodboards/hospitality-fungal-art-lounge.webp', alt: 'Fungal art installation in a hospitality lounge concept' },
      { src: '/images/moodboards/hospitality-fold-wall-wash.webp', alt: 'FOLD acoustic wall panels in a hospitality interior concept' },
    ],
  },
  {
    label: 'Workplace',
    heading: 'A calmer kind of work.',
    copy: 'Biobased acoustic elements give offices visual warmth and a more considered sense of focus, from shared rooms to open-plan ceilings.',
    images: [
      { src: '/images/moodboards/workplace-fold-ceiling-pendant.webp', alt: 'FOLD acoustic ceiling with Mushroomiya pendants in an office concept', featured: true },
      { src: '/images/moodboards/workplace-meeting-room.webp', alt: 'FOLD texture detail in a meeting room concept' },
      { src: '/images/moodboards/workplace-fold-feature-wall.webp', alt: 'FOLD feature wall in an office concept' },
      { src: '/images/moodboards/workplace-fold-linear-ceiling.webp', alt: 'FOLD linear ceiling installation in an office concept' },
    ],
  },
  {
    label: 'Furniture & cladding',
    heading: 'Between wood and marble.',
    copy: 'Grown veneer, a technique developed in house: plates, 20 × 20 cm tiles or sizes cut to the drawing, set into walnut and oak furniture or run across a wall. Visualisation studies of the exclusive collection.',
    wide: true,
    links: [{ href: '/shop/grown-veneer-furniture', label: 'Grown veneer furniture' }, { href: '/shop/architectural-surfaces', label: 'Grown veneer cladding' }],
    images: [
      { src: '/images/catalogue/veneer/veneer-tile-sideboard.jpg', alt: 'Walnut sideboard with a front of grown veneer tiles, visualisation', fit: 'contain', matte: 'linear-gradient(#baa99a 0%, #baa99a 50%, #cdb7a6 50%, #cdb7a6 100%)' },
      { src: '/images/catalogue/veneer/veneer-plate-cabinet.jpg', alt: 'Cabinet with grown veneer plate doors, visualisation', focus: '62% 50%' },
      { src: '/images/catalogue/veneer/veneer-cladding-bedroom.jpg', alt: 'Bedroom wall clad in grown veneer plates, visualisation' },
      { src: '/images/catalogue/veneer/veneer-material-01.jpg', alt: 'Grown veneer plates, material photograph' },
    ],
  },
]

export function Moodboards() {
  return (
    <VSection id="moodboards">
      <div className="mb-14 md:mb-20 max-w-2xl">
        <VLabel text="Spatial applications" />
        <VHeading text="Material with a point of view." />
        <p className="font-sans leading-[1.75] mt-6" style={{ fontSize: '1rem', opacity: 0.84 }}>
          Three material-led directions for hospitality, workplace and furniture. Visualisations are indicative of application, not completed installations.
        </p>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-14 xl:gap-8">
        {MOODBOARDS.map((board) => (
          <article key={board.label} className={`p-4 md:p-5 ${'wide' in board && board.wide ? 'xl:col-span-2' : ''}`} style={{ border: BORDER, backgroundColor: 'rgba(26,23,20,0.018)' }}>
            <div className="pb-6 md:pb-7" style={{ minHeight: '15rem' }}>
              <VLabel text={board.label} />
              <h3 className="font-display mb-4" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.7rem)', lineHeight: 1, letterSpacing: '-0.035em' }}>{board.heading}</h3>
              <p className="font-sans leading-[1.7] max-w-lg" style={{ fontSize: '1rem', opacity: 0.84 }}>{board.copy}</p>
              {'links' in board && board.links && (
                <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
                  {board.links.map(link => (
                    <Link key={link.href} href={link.href} className="font-sans uppercase tracking-[0.14em]" style={{ fontSize: '0.75rem', color: 'inherit', textDecoration: 'none', borderBottom: '1px solid rgba(26,23,20,0.34)', paddingBottom: 4 }}>{link.label} →</Link>
                  ))}
                </div>
              )}
            </div>
            <div
              className={'wide' in board && board.wide ? 'grid grid-cols-2 md:grid-cols-4 gap-2' : 'grid grid-cols-2 grid-rows-2 gap-2 aspect-square'}
            >
              {board.images.map((image) => (
                <div
                  key={image.src}
                  className="relative overflow-hidden bg-[#e7e0d5]"
                  style={{ ...('wide' in board && board.wide ? { aspectRatio: '4 / 5' } : {}), ...framing(image as ImageFraming & { src: string }, 'wide' in board && board.wide ? 4 / 5 : 1).frameStyle }}
                >
                  <Image src={image.src} alt={image.alt} fill className="object-cover transition-transform duration-700 hover:scale-[1.04]" style={framing(image as ImageFraming & { src: string }, 'wide' in board && board.wide ? 4 / 5 : 1).imgStyle} sizes="(max-width: 1280px) 50vw, 25vw" />
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </VSection>
  )
}

// ─── Explore CTA ──────────────────────────────────────────────────────────────

export function ExploreCTA() {
  return (
    <VSection id="specify">
      <VLabel text="Specify NUMU" />
      <h2 className="font-display mb-8" style={{ fontSize: 'clamp(2rem, 4vw, 5rem)', lineHeight: '0.96', letterSpacing: '-0.04em' }}>
        Bring PALMYCO™ into your project.
      </h2>
      <p className="font-sans leading-[1.75] max-w-xl mb-14" style={{ fontSize: '1rem', opacity: 0.84 }}>
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
  { name: 'NYXO Design Studio', note: 'Design partner', href: 'https://www.nyxostudio.com/' },
  { name: 'Biomyc', note: 'Packaging — LOI', href: 'https://new.biomyc.eu/' },
  { name: 'Base39', note: 'Creative accelerator — winning finalist 2026', href: 'https://base39.com/' },
  { name: 'De Montfort University', note: 'Academic' },
  { name: 'American University of Sharjah', note: 'Academic' },
  { name: 'Heriot-Watt University Dubai', note: 'Academic' },
  { name: 'DIDI', note: 'Design network' },
]

function PartnersStrip() {
  return (
    <div className="pt-14 mt-14" style={{ borderTop: BORDER }}>
      <p className="font-sans uppercase tracking-[0.18em] mb-8" style={{ fontSize: '0.75rem', opacity: 0.68 }}>
        Partners &amp; institutions
      </p>
      <div className="flex flex-wrap gap-x-10 gap-y-5">
        {PARTNERS.map(p => (
          <div key={p.name}>
            {p.href ? (
              <a
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans"
                style={{ fontSize: '0.8125rem', opacity: 0.62, color: 'inherit', textDecoration: 'none' }}
              >
                {p.name}
              </a>
            ) : (
              <p className="font-sans" style={{ fontSize: '0.8125rem', opacity: 0.55 }}>{p.name}</p>
            )}
            <p className="font-sans uppercase tracking-[0.14em] mt-0.5" style={{ fontSize: '0.75rem', opacity: 0.68 }}>{p.note}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Platform Without Borders ────────────────────────────────────────────────

export function PlatformWithoutBorders() {
  const platformImages = [
    {
      src: '/images/talk/woodshow/waste-pile-palm-agricultural.jpg',
      alt: 'A pile of date-palm agricultural waste, the regional feedstock behind PALMYCO™',
      label: 'Regional feedstock',
      note: 'Local biomass becomes manufacturing input. Photograph.',
    },
    {
      src: '/images/catalogue/material/palmyco-sample-block.jpg',
      alt: 'A solid PALMYCO™ sample block grown by NUMU, labelled C-02',
      label: 'Grown composite',
      note: 'A material system grown into function. Photograph.',
    },
    {
      src: '/images/catalogue/space/nasa-artemis2-lunar-terminator.jpg',
      alt: 'The lunar terminator photographed by the Artemis II crew. Image: NASA',
      label: 'Extreme environments',
      note: 'The same ISRU logic, as research. Image: NASA, Artemis II.',
    },
  ]

  return (
    <VSectionFullBleed id="platform-without-borders">
      <div className="px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-14 lg:gap-20 items-start">
          <div>
            <VLabel text="ONE PLATFORM, MANY ENVIRONMENTS" />
            <h2 className="font-display mb-9 max-w-4xl" style={{ fontSize: 'clamp(2.2rem, 4.4vw, 4.75rem)', lineHeight: '0.92', letterSpacing: '-0.04em', textWrap: 'balance' as React.CSSProperties['textWrap'] }}>
              A material platform for the GCC, the world, and beyond.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-7 md:gap-10 max-w-4xl">
              <p className="font-sans leading-[1.75]" style={{ fontSize: '1rem', opacity: 0.84 }}>
                NUMU is built on a single principle. You make materials from what is around you, not what you ship in. In the Gulf that means turning regional agricultural waste into a local manufacturing base for acoustics, insulation, and composites. The same principle reaches much further.
              </p>
              <p className="font-sans leading-[1.75]" style={{ fontSize: '1rem', opacity: 0.84 }}>
                In resource-constrained and extreme environments, including space, the constraint is identical. You cannot ship everything in. You grow and build with what is local. Mycelium is one of the few material systems that works under both sets of conditions, which is why the NUMU platform extends naturally from regional industry to the hardest environments there are.
              </p>
            </div>
          </div>

          <div className="p-6 md:p-8" style={{ border: BORDER, backgroundColor: 'rgba(26,23,20,0.025)' }}>
            <p className="font-sans uppercase tracking-[0.18em] mb-5" style={{ fontSize: '0.75rem', opacity: 0.68 }}>
              Strategic partnership
            </p>
            <h3 className="font-display mb-5" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.75rem)', lineHeight: 1.05, letterSpacing: '-0.03em' }}>
              Titans Space Industries
            </h3>
            <p className="font-sans leading-[1.75] mb-7" style={{ fontSize: '1rem', opacity: 0.84 }}>
              NUMU has signed a Memorandum of Understanding with Titans Space Industries (TSI), the Orlando-based developer of reusable spaceplanes and orbital infrastructure. NUMU joins the consortium as its Bio-Materials and ISRU Composites Partner, exploring, as research, how mycelium biomanufacturing could produce composites and structures in extreme environments.
            </p>
            <Link
              href="/partnerships/titans-space"
              className="font-sans text-label uppercase tracking-[0.14em] inline-block"
              style={{ color: 'inherit', opacity: 0.78, textDecoration: 'none', borderBottom: '1px solid rgba(26,23,20,0.34)', paddingBottom: 6 }}
            >
              Read about the partnership →
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-3">
        {platformImages.map((item) => (
          <div key={item.src}>
            <div className="relative overflow-hidden" style={{ aspectRatio: '1/1', backgroundColor: 'rgba(128,128,128,0.05)' }}>
              <Image
                src={item.src}
                alt={item.alt}
                fill
                unoptimized
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <div className="px-6 md:px-8 pt-4">
              <p className="font-sans uppercase tracking-[0.14em] mb-2" style={{ fontSize: '0.75rem', opacity: 0.68 }}>
                {item.label}
              </p>
              <p className="font-sans leading-snug" style={{ fontSize: '0.8125rem', opacity: 0.84 }}>
                {item.note}
              </p>
            </div>
          </div>
        ))}
      </div>
    </VSectionFullBleed>
  )
}

// ─── Visitor view ─────────────────────────────────────────────────────────────

export function MaterialDetail() {
  return (
    <>
      {/* 02 Material */}
      <VSection id="material">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-16 lg:gap-20">
          <div className="flex flex-col">
            <div>
              <VLabel text="The material" />
              <h2 className="font-display mb-8" style={{ fontSize: 'clamp(2rem, 3.5vw, 3.5rem)', lineHeight: '1.08', letterSpacing: '-0.03em', textWrap: 'balance' as React.CSSProperties['textWrap'] }}>
                PALMYCO™ — the material.
              </h2>
              <p className="font-sans leading-[1.75] mb-5" style={{ fontSize: '1rem', opacity: 0.84 }}>
                PALMYCO™ is NUMU&apos;s proprietary grown mycelium foam — a bio-composite cultivated from regional agricultural fibres bound by a living mycelium network. Rigid, breathable, sound-absorbent, and home-compostable. No binders. No petroleum. No synthetic residue. Trademark pending. Grown in Dubai.
              </p>
              <p className="font-sans leading-[1.75]" style={{ fontSize: '1rem', opacity: 0.84 }}>
                PALMYCO™ properties are tuned through the growth cycle itself. Alongside it, NUMU presses composite boards from spent mushroom substrate — a separate material, a separate waste stream, a separate product line, made on the same Dubai production base.
              </p>
            </div>
            <div className="mt-auto pt-12" style={{ borderTop: '1px solid rgba(128,128,128,0.1)', marginTop: 'auto' }}>
              <p className="font-sans uppercase tracking-[0.16em] mb-5" style={{ fontSize: 12, opacity: 0.68 }}>
                Substrate inputs — regional agricultural residues
              </p>
              <div className="grid grid-cols-2 gap-4 mb-12">
                {/* Palm leaf — existing image */}
                <div>
                  <div className="relative w-full mb-3" style={{ aspectRatio: '1/1' }}>
                    <Image src="/images/materials/palm_leaf_substrate.png" alt="Palm leaf agricultural substrate from UAE date palm pruning waste" fill unoptimized className="object-contain object-center" sizes="(max-width: 1024px) 50vw, 25vw" />
                  </div>
                  <p className="font-sans mb-1" style={{ fontSize: 12, opacity: 0.7, letterSpacing: '0.04em' }}>Palm leaf fibre</p>
                  <p className="font-sans leading-snug" style={{ fontSize: 12, opacity: 0.84 }}>UAE date palm pruning waste, the region&apos;s largest agricultural residue stream.</p>
                </div>
                <div>
                  <div className="relative w-full mb-3" style={{ aspectRatio: '1/1' }}>
                    <Image src="/images/materials/hemp_shivs.jpg" alt="Plant fibre blend — mixed agricultural by-products sourced regionally" fill unoptimized className="object-cover object-center" sizes="(max-width: 1024px) 50vw, 25vw" style={{ mixBlendMode: 'multiply' }} />
                  </div>
                  <p className="font-sans mb-1" style={{ fontSize: 12, opacity: 0.7, letterSpacing: '0.04em' }}>Plant fibre blend</p>
                  <p className="font-sans leading-snug" style={{ fontSize: 12, opacity: 0.84 }}>Mixed agricultural by-products sourced regionally.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4" style={{ border: '1px solid rgba(128,128,128,0.1)', backgroundColor: 'rgba(128,128,128,0.03)' }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: 'rgba(26,23,20,0.4)', flexShrink: 0, marginTop: 5 }} />
                <div>
                  <p className="font-sans mb-1" style={{ fontSize: 12, opacity: 0.7, letterSpacing: '0.04em' }}>Spent mushroom substrate (SMS)</p>
                  <p className="font-sans leading-snug" style={{ fontSize: 12, opacity: 0.84 }}>A waste stream already generated by regional commercial mushroom farms, given a second life as pressed board.</p>
                </div>
              </div>
            </div>
            {/* Production routes */}
            <div className="pt-12 mt-12" style={{ borderTop: '1px solid rgba(128,128,128,0.1)' }}>
              <p className="font-sans uppercase tracking-[0.16em] mb-6" style={{ fontSize: 12, opacity: 0.68 }}>
                Production routes
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div style={{ border: '1px solid rgba(128,128,128,0.14)' }}>
                  <div className="relative w-full overflow-hidden" style={{ aspectRatio: '1/1' }}>
                    <Image src="/images/products/Chair.jpg" alt="Grown mycelium chair — NUMU material formed into product application" fill unoptimized className="object-contain object-center" sizes="(max-width: 640px) 100vw, 50vw" style={{ mixBlendMode: 'multiply' }} />
                  </div>
                  <div className="p-5">
                    <p className="font-sans uppercase tracking-[0.14em] mb-3" style={{ fontSize: 12, opacity: 0.68 }}>Grown</p>
                    <p className="font-sans leading-[1.7] mb-4" style={{ fontSize: '1rem', opacity: 0.84 }}>
                      Mycelium cultivated inside proprietary moulds over a controlled growth cycle, then heat-stabilised into a finished form. Produces distinctive surface texture and complex three-dimensional form factors.
                    </p>
                    <p className="font-sans" style={{ fontSize: 12, opacity: 0.35, letterSpacing: '0.04em' }}>Used in: Acoustic panels, architectural surface.</p>
                  </div>
                </div>
                <div style={{ border: '1px solid rgba(128,128,128,0.14)' }}>
                  <div className="relative w-full overflow-hidden" style={{ aspectRatio: '1/1' }}>
                    <Image src="/images/products/pressed_detail.jpg" alt="Pressed mycelium board close-up — surface texture and cross-section detail" fill unoptimized className="object-cover object-center" sizes="(max-width: 640px) 100vw, 50vw" />
                  </div>
                  <div className="p-5">
                    <p className="font-sans uppercase tracking-[0.14em] mb-3" style={{ fontSize: 12, opacity: 0.68 }}>Pressed</p>
                    <p className="font-sans leading-[1.7] mb-4" style={{ fontSize: '1rem', opacity: 0.84 }}>
                      Spent mycelium biomass shredded and heat-pressed directly into flat board formats. Minutes of press time rather than weeks of cultivation.
                    </p>
                    <p className="font-sans" style={{ fontSize: 12, opacity: 0.35, letterSpacing: '0.04em' }}>Used in: Event structures, temporary architecture, pressed board applications.</p>
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
    </>
  )
}

export function FoldDetail() {
  return (
    <>
      {/* FOLD product */}
      <VSection id="fold">
        <VLabel text="Product — FOLD" />
        <div className="mb-12 grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-8 lg:gap-14 items-end">
          <div>
            <h2 className="font-display" style={{ fontSize: 'clamp(3rem, 7vw, 7.5rem)', lineHeight: '0.9', letterSpacing: '-0.04em' }}>FOLD</h2>
            <p className="font-sans uppercase tracking-[0.16em] mt-3" style={{ fontSize: '0.75rem', opacity: 0.68 }}>
              Surface design in collaboration with NYXO Design Studio.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 lg:pb-2">
            <p className="font-sans leading-[1.75]" style={{ fontSize: '1rem', opacity: 0.84 }}>
              FOLD is NUMU&apos;s first product — a modular acoustic panel system grown from bio-based material and designed for interior architecture. It translates the material platform into a real, specification-ready object: tactile, scalable, and visually distinctive.
            </p>
            <p className="font-sans leading-[1.75]" style={{ fontSize: '1rem', opacity: 0.44 }}>
              Fold takes its name from the forces that shape it — the movement of fabric, the softness of drapery, the way wind carves form into sand and dunes. Each panel surface carries that memory: a topography grown into material rather than cut from it.
            </p>
            <p className="font-sans leading-[1.75]" style={{ fontSize: '1rem', opacity: 0.35 }}>
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
            <p className="font-sans uppercase tracking-[0.14em] mt-2" style={{ fontSize: 12, opacity: 0.68 }}>
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
            <p className="font-sans uppercase tracking-[0.14em] mt-2" style={{ fontSize: 12, opacity: 0.68 }}>
              Render — Urban concrete installation, variation
            </p>
          </div>
        </div>

        {/* FOLD Technical Specifications */}
        <div className="mt-16 pt-14" style={{ borderTop: BORDER }}>
          <p className="font-sans uppercase tracking-[0.18em] mb-10" style={{ fontSize: '0.75rem', opacity: 0.68 }}>
            Technical specifications
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-px" style={{ backgroundColor: 'rgba(128,128,128,0.12)' }}>
            {[
              { field: 'Panel dimensions', value: '400 × 400 mm module, 60 mm nominal (provisional)' },
              { field: 'Weight', value: 'Confirmed with samples' },
              { field: 'Acoustic performance', value: 'NRC 0.72–0.80 — design target, testing in progress' },
              { field: 'Fire performance', value: 'ASTM E84 Class B — design target, testing in progress' },
              { field: 'Installation', value: 'Concealed adhesive mount or mechanical fixing' },
              { field: 'Finish', value: 'Natural PALMYCO™ surface, raw or sealed' },
              { field: 'Lead time', value: 'Quoted per project' },
              { field: 'Origin', value: 'Manufactured in Dubai, UAE' },
              { field: 'End of life', value: 'Bio-based material; end-of-life route confirmed for the chosen finish' },
            ].map(spec => (
              <div key={spec.field} className="px-6 py-7" style={{ backgroundColor: 'rgba(26,23,20,0.03)' }}>
                <p className="font-sans uppercase tracking-[0.12em] mb-2.5" style={{ fontSize: '0.75rem', opacity: 0.68 }}>{spec.field}</p>
                <p className="font-sans" style={{ fontSize: '0.9375rem', opacity: 0.78 }}>{spec.value}</p>
              </div>
            ))}
          </div>
        </div>
      </VSection>
    </>
  )
}

export function BuiltWorkDetail() {
  return (
    <>
      {/* Built work — proof of execution, right after FOLD. Only completed or physically existing work. */}
      <VSection id="installations">
        <VLabel text="Built work" />
        <VHeading text="Built, grown, documented." />
        <p className="font-sans leading-[1.75] max-w-2xl" style={{ fontSize: '1rem', opacity: 0.84 }}>
          A completed installation in the Netherlands, and full-scale material work grown in NUMU&apos;s Dubai lab. Prototypes are shown as prototypes; visualisations elsewhere on this site are labelled as such.
        </p>
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-start">
          <div className="h-full p-4 md:p-5" style={{ border: BORDER, backgroundColor: 'rgba(26,23,20,0.02)' }}>
            <BeyondSlideshow />
            <VLabel text="Netherlands — 2022 · Completed" />
            <p className="font-display text-xl md:text-2xl mt-1">Beyond Chrysant</p>
            <p className="font-sans mt-3 leading-[1.7]" style={{ fontSize: '1rem', opacity: 0.84 }}>
              Prototype installation demonstrating the folded acoustic language in a built exhibition context.
            </p>
          </div>
          <div className="h-full p-4 md:p-5" style={{ border: BORDER, backgroundColor: 'rgba(26,23,20,0.02)' }}>
            <div className="relative mb-4 overflow-hidden" style={{ aspectRatio: '4/3', backgroundColor: 'rgba(128,128,128,0.06)' }}>
              <Image src="/images/catalogue/fold/fold-drying-rack.jpg" alt="Freshly grown FOLD panels drying on a rack in the NUMU lab, Dubai" fill className="object-cover" style={{ objectPosition: '50% 62%' }} sizes="(max-width: 768px) 100vw, 33vw" />
            </div>
            <VLabel text="Dubai, UAE — 2026 · Prototype" />
            <p className="font-display text-xl md:text-2xl mt-1">FOLD panels</p>
            <p className="font-sans mt-3 leading-[1.7]" style={{ fontSize: '1rem', opacity: 0.84 }}>
              Full-scale FOLD panels grown and finished in the Dubai lab. Acoustic and fire testing is in progress; performance figures remain design targets until reports are issued.
            </p>
          </div>
          <div className="h-full p-4 md:p-5" style={{ border: BORDER, backgroundColor: 'rgba(26,23,20,0.02)' }}>
            <div className="relative mb-4 overflow-hidden" style={{ aspectRatio: '4/3', backgroundColor: 'rgba(128,128,128,0.06)' }}>
              <Image src="/images/catalogue/material/palmyco-panels-stacked.jpg" alt="Stacked PALMYCO™ grown material panels from NUMU production runs" fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
            </div>
            <VLabel text="Dubai, UAE — Ongoing · Production" />
            <p className="font-display text-xl md:text-2xl mt-1">PALMYCO™ batches</p>
            <p className="font-sans mt-3 leading-[1.7]" style={{ fontSize: '1rem', opacity: 0.84 }}>
              Repeat growth cycles on regional palm fibre: the material base behind every panel, lamp and commission.
            </p>
          </div>
        </div>
      </VSection>
    </>
  )
}

export function ProcessBlock() {
  return (
    <>
      {/* 04 Process */}
      <section id="process" style={{ borderTop: BORDER, paddingTop: '5rem', paddingBottom: '4rem' }}>
        {/* Title — compact, above the diagram */}
        <div className="px-6 md:px-12 mb-6 max-w-[1440px] mx-auto">
          <VLabel text="Process" />
          <VHeading text="From palm fibre to finished piece." />
        </div>
        {/* Diagram — full bleed, no max-width constraint */}
        <div style={{ width: '100%', maxWidth: 1200, margin: '0 auto' }}>
          <ProcessDiagram />
        </div>
      </section>
    </>
  )
}

export function LabBlock() {
  return (
    <>
      {/* Lab Process Feature */}
      <section id="lab" className="px-6 md:px-12 py-20 md:py-[104px]" style={{ borderTop: BORDER }}>
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-20 items-start">
            <div>
              <h2 className="font-display mb-8" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: 1.05, letterSpacing: '-0.03em' }}>
                The process, documented.
              </h2>
              <p className="font-sans leading-[1.75] mb-4" style={{ fontSize: '1rem', opacity: 0.84 }}>
                PALMYCO™ is produced in our active production lab. This footage documents the full process cycle — substrate preparation, mycelium inoculation, growth, heat-stabilisation, and finishing. No renders, no simulations. Real production conditions, repeatable process.
              </p>
              <p className="font-sans uppercase tracking-[0.16em] mt-8" style={{ fontSize: 12, opacity: 0.68 }}>
                Duration — 1 min 34 sec
              </p>
            </div>
            <div>
              <LabVideo />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export function ApplicationsDetail() {
  return (
    <>
      {/* Applications — platform horizons */}
      <VSection id="applications">
        <VLabel text="Applications" />
        <VHeading text="What the material does today, and what comes next." />
        <p className="font-sans leading-[1.75] mb-3 max-w-2xl" style={{ fontSize: '1rem', opacity: 0.84 }}>
          Grown acoustic surfaces and pressed boards are in production today. Thermal insulation and protective packaging are in development on the same material system and the same Dubai production base.
        </p>
        <p className="font-sans leading-[1.75] mb-14 max-w-2xl" style={{ fontSize: '1rem', opacity: 0.84 }}>
          PALMYCO™, the grown material, is used for acoustic panels, wall surfaces, lighting and furniture. The pressed board, made from spent mushroom substrate, serves events, brand activations and non-structural interiors.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            {
              title: 'Acoustic — Grown',
              href: '/shop/fold',
              tagline: 'Decorative and specification-grade mycelium panels for interior architecture. First product: FOLD.',
              status: 'Active',
              active: true,
              image: '/images/materials/acoustic_render_05.png',
              imageAlt: 'NUMU grown acoustic panels — FOLD product line, interior architecture',
            },
            {
              title: 'Boards — Pressed',
              href: '/shop/bespoke-commissions',
              tagline: 'Heat-pressed mycelium composite boards for events, brand activations, and temporary architecture.',
              status: 'Active',
              active: true,
              image: '/images/applications/event_board.jpg',
              imageAlt: 'NUMU pressed mycelium composite board — event and temporary architecture application',
            },
            {
              title: 'Thermal',
              href: '/thermal-insulation-uae',
              tagline: 'Passive insulation grown from palm fibre, designed for hot-climate wall assemblies.',
              status: 'In Development',
              active: false,
              image: '/images/applications/thermal_panel_wall.png',
              imageAlt: 'NUMU thermal panel — wall assembly integration',
            },
            {
              title: 'Packaging',
              href: '/mycelium-packaging-uae',
              tagline: 'Molded protective forms, compostable alternative to petroleum-based foams.',
              status: 'In Development',
              active: false,
              image: '/images/applications/packaging_protective.png',
              imageAlt: 'NUMU protective packaging — molded mycelium form',
            },
          ].map(app => (
            <Link key={app.title} href={app.href} className="group" style={{ border: BORDER, color: 'inherit', textDecoration: 'none', display: 'block' }}>
              <div className="relative w-full overflow-hidden" style={{ aspectRatio: '1/1' }}>
                <Image src={app.image} alt={app.imageAlt} fill className="object-cover object-center" sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw" />
                <div className="absolute bottom-3 left-3">
                  <span className="font-sans uppercase" style={{ fontSize: 12, letterSpacing: '0.14em', padding: '4px 8px', backgroundColor: app.active ? 'rgba(26,23,20,0.82)' : 'rgba(26,23,20,0.48)', color: '#f5f1e8' }}>
                    {app.status}
                  </span>
                </div>
              </div>
              <div className="px-5 py-6">
                <p className="font-display mb-2" style={{ fontSize: '1.25rem', letterSpacing: '-0.02em', opacity: app.active ? 1 : 0.55 }}>{app.title}</p>
                <p className="font-sans leading-relaxed" style={{ fontSize: 13, opacity: app.active ? 0.6 : 0.42 }}>{app.tagline}</p>
                <p className="font-sans uppercase tracking-[0.14em] mt-4" style={{ fontSize: 12, opacity: 0.6 }}>{app.active ? 'View' : 'Read more'} →</p>
              </div>
            </Link>
          ))}
        </div>
        <div id="surf-research" className="mt-12 grid grid-cols-1 md:grid-cols-[0.8fr_1.2fr] gap-6 md:gap-12 p-6 md:p-8 scroll-mt-24" style={{ border: BORDER, backgroundColor: 'rgba(26,23,20,0.025)' }}>
          <div>
            <p className="font-sans uppercase tracking-[0.16em] mb-3" style={{ fontSize: '0.75rem', opacity: 0.68 }}>In research</p>
            <p className="font-display" style={{ fontSize: 'clamp(1.6rem, 2.6vw, 2.4rem)', lineHeight: 1.05, letterSpacing: '-0.025em' }}>Surf &amp; shaped products.</p>
          </div>
          <div>
            <p className="font-sans leading-[1.75]" style={{ fontSize: '1rem', opacity: 0.84 }}>
              Research into bio-based foam and composite-core materials for surfboards and other shaped products, exploring where naturally grown alternatives could replace selected synthetic components. Research stage: no surf product is offered yet.
            </p>
            <a href="/#contact" className="font-sans uppercase tracking-[0.14em] inline-block mt-5" style={{ fontSize: '0.75rem', color: 'inherit', textDecoration: 'none', borderBottom: '1px solid rgba(26,23,20,0.34)', paddingBottom: 4 }}>
              Talk to us about surf research →
            </a>
          </div>
        </div>
      </VSection>
    </>
  )
}

export function ManifestoBlock() {
  return (
    <>
      {/* Manifesto */}
      <section id="manifesto" className="px-6 md:px-12 py-20 md:py-[104px]" style={{ borderTop: BORDER }}>
        <div className="max-w-[1440px] mx-auto">
          <p className="font-sans uppercase tracking-[0.18em] mb-16" style={{ fontSize: '0.75rem', opacity: 0.68 }}>Manifesto</p>
          <h2 className="font-sans uppercase tracking-[0.14em] mb-14" style={{ fontSize: '0.75rem', opacity: 0.6 }}>What we believe.</h2>
          <div>
            {[
              'Performance before narrative.',
              'Waste is feedstock.',
              'The region builds its own.',
              'Every piece is grown, so no two repeat.',
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
    </>
  )
}

export function TeamBlock({ teamMembers }: { teamMembers: PublicTeamMember[] }) {
  return (
    <>
      {/* Team */}
      <VSection id="team">
        <VLabel text="Team" />
        <VHeading text="The people behind the material." />
        <VBody text="A Dubai team combining material design and industrialisation, construction finance, IP strategy and commercial growth, from the first sample to delivery." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {teamMembers.map((member) => (
            <PublicTeamCard key={member.name} member={member} />
          ))}
        </div>
      </VSection>
    </>
  )
}

// ─── Home as an overview: the map, then a glimpse of every chapter ──────────

function InsideNumu() {
  const [active, setActive] = useState(0)
  const shown = CHAPTERS[active]
  return (
    <section id="inside" className="numu-inside" aria-labelledby="inside-title">
      <div className="numu-inside-inner">
        <div className="numu-inside-head" data-reveal>
          <h2 id="inside-title" className="font-display">Inside NUMU.</h2>
          <p>Seven chapters, one material. Here is a glimpse of each; every chapter has its own page to dive into.</p>
        </div>
        <div className="numu-inside-grid">
          <ol className="numu-inside-list">
            {CHAPTERS.map((c, i) => (
              <li key={c.id}>
                <Link
                  href={c.href}
                  className="numu-inside-row"
                  data-active={i === active || undefined}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                >
                  <span className="numu-inside-thumb" aria-hidden="true">
                    <Image src={c.image} alt="" fill sizes="96px" className="object-cover" />
                  </span>
                  <span className="numu-inside-name font-display">{c.name}</span>
                  <span className="numu-inside-glimpse">{c.glimpse}</span>
                  <span className="numu-inside-go" aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ol>
          <figure className="numu-inside-preview" aria-hidden="true">
            <div className="numu-inside-frame">
              {CHAPTERS.map((c, i) => (
                <Image key={c.id} src={c.image} alt="" fill sizes="(max-width: 1024px) 0px, 40vw" className="object-cover" style={{ opacity: i === active ? 1 : 0, transition: 'opacity .6s cubic-bezier(.2,.7,.2,1)' }} />
              ))}
            </div>
            <figcaption>{shown.caption}</figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}

function ChapterGlimpse({ chapter: c, index }: { chapter: Chapter; index: number }) {
  const flip = index % 2 === 1
  return (
    <section id={`chapter-${c.id}`} data-chapter={c.id} className={`numu-glimpse${flip ? ' numu-glimpse--flip' : ''}`} aria-labelledby={`chapter-${c.id}-title`}>
      <div className="numu-glimpse-inner">
        <div className="numu-glimpse-copy">
          <h2 id={`chapter-${c.id}-title`} className="font-display" data-reveal>{c.name}</h2>
          <p className="numu-glimpse-lead" data-reveal>{c.glimpse}</p>
          <ul className="numu-glimpse-facts" data-reveal>
            {c.facts.map(f => <li key={f}>{f}</li>)}
          </ul>
          <Link href={c.href} className="numu-button" data-reveal>{c.enter} <span aria-hidden>→</span></Link>
        </div>
        <figure className="numu-glimpse-media" data-reveal>
          {c.id === 'material' ? (
            <div className="numu-glimpse-frame">
              <AutoplayVideoBlock
                src="/videos/numu_timelapse.mp4"
                poster="/images/hero/timelapse-poster.jpg"
                altLabel="Timelapse: loose fibre poured into a mould, then bound into a white block by growing mycelium"
                preload="metadata"
              />
            </div>
          ) : (
            <Link href={c.href} className="numu-glimpse-frame" tabIndex={-1} aria-hidden="true">
              <Image src={c.image} alt="" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover numu-slow-zoom" />
            </Link>
          )}
          <figcaption>{c.id === 'material' ? 'From loose fibre to grown block in 5–7 days. Timelapse, NUMU lab.' : c.caption}</figcaption>
        </figure>
      </div>
    </section>
  )
}

function VisitorView({
  v,
}: {
  v: VisitorContent
}) {
  return (
    <>
      <InsideNumu />
      {CHAPTERS.map((chapter, i) => <ChapterGlimpse key={chapter.id} chapter={chapter} index={i} />)}

      {/* 07 Contact */}
      <VSection id="contact">
        <VLabel text={v.contact.label} />
        <h2 className="font-display mb-10" style={{ fontSize: 'clamp(2.5rem, 5.5vw, 6.5rem)', lineHeight: '0.92', letterSpacing: '-0.04em' }}>
          {v.contact.heading}
        </h2>
        <p className="font-sans mb-12 max-w-md" style={{ fontSize: '0.9375rem', lineHeight: 1.75, opacity: 0.84 }}>
          Based in Dubai. Samples, project consultation, and specification support for architects, interior designers, and fit-out teams.
        </p>
        <div className="mb-14">
          <DirectContactForm
            requestType="project"
            source="public-contact"
            submitLabel="Send project inquiry →"
          />
        </div>
        <div className="mb-4">
          <SocialLinks />
        </div>
        <PartnersStrip />
        <section id="investor-request" className="mt-14 scroll-mt-28 border-t border-black/15 pt-8" aria-labelledby="investor-request-heading">
          <h3 id="investor-request-heading" className="font-display text-3xl mb-4">Investor inquiries</h3>
          <DirectContactForm requestType="investor_deck" source="public-investor-request" submitLabel="Request investor deck →" />
        </section>
      </VSection>
    </>
  )
}


// ─── Main component ───────────────────────────────────────────────────────────

function InvestorGate({
  onUnlock,
  onCancel,
}: {
  onUnlock: (code: string) => Promise<string | null>
  onCancel: () => void
}) {
  const [code, setCode] = useState('')
  const [shaking, setShaking] = useState(false)
  const [error, setError] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const inputRef = useRef<HTMLInputElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  useModalFocus(dialogRef, onCancel)

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 80)
    return () => clearTimeout(t)
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!code || status === 'loading') return
    setStatus('loading')
    const message = await onUnlock(code).catch(() => 'Could not connect. Please try again.')
    if (!message) return
    setError(message)
    setStatus('error')
    setShaking(true)
    setCode('')
    setTimeout(() => setShaking(false), 700)
  }

  const fillPct = Math.min((code.length / 8) * 100, 100)

  return (
    <motion.div ref={dialogRef} role="dialog" aria-modal="true" aria-label="Investor access"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        backgroundColor: '#080808',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}
    >
      {/* Grain */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        opacity: 0.045,
      }} />
      {/* Radial glow */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 55% 45% at 50% 52%, rgba(178,155,127,0.07) 0%, transparent 70%)',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0, 0.2, 1] }}
        style={{ textAlign: 'center', width: '100%', padding: '0 32px', maxWidth: 480 }}
      >
        {/* Logo */}
        <div style={{ marginBottom: 52 }}>
          <Image
            src="/branding/logo-numu.png"
            alt="NUMU"
            width={160} height={64}
            style={{ height: 38, width: 'auto', display: 'inline-block', filter: 'brightness(0) invert(1) sepia(1) saturate(0) brightness(0.8)', opacity: 0.55 }}
          />
        </div>

        {/* Label */}
        <p className="font-sans uppercase tracking-[0.3em]" style={{ fontSize: '0.6875rem', color: ACCENT, marginBottom: 44, opacity: 0.85, letterSpacing: '0.32em' }}>
          Investor Access
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          {/* Code input — visible text, premium styled */}
          <motion.div
            animate={shaking ? { x: [-10, 10, -7, 7, -4, 4, 0] } : { x: 0 }}
            transition={{ duration: 0.45 }}
            style={{ marginBottom: 16 }}
          >
            <input
              ref={inputRef}
              type="password"
              aria-label="Investor access code"
              value={code}
              onChange={e => {
                setCode(e.target.value)
                if (status === 'error') setStatus('idle')
              }}
              autoComplete="current-password"
              maxLength={256}
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              placeholder="— — — — — —"
              className="font-mono"
              style={{
                width: '100%',
                textAlign: 'center',
                fontSize: 'clamp(1.625rem, 5vw, 2.75rem)',
                letterSpacing: '0.22em',
                color: status === 'error' ? 'rgba(210,65,50,0.9)' : '#f5f1e8',
                background: 'none',
                border: 'none',
                borderBottom: status === 'error'
                  ? '1px solid rgba(210,65,50,0.45)'
                  : `1px solid rgba(245,241,232,0.12)`,
                outline: 'none',
                padding: '8px 0 20px',
                caretColor: ACCENT,
                caretShape: 'block',
                transition: 'color 0.25s, border-color 0.25s',
              }}
            />
          </motion.div>

          {/* Fill line */}
          <div style={{ width: '100%', height: 1, backgroundColor: 'transparent', marginBottom: 32, position: 'relative' }}>
            <motion.div
              style={{
                position: 'absolute', top: 0, left: 0, height: '100%',
                backgroundColor: status === 'error' ? 'rgba(210,65,50,0.55)' : ACCENT,
                opacity: 0.7,
                transition: 'background-color 0.25s',
              }}
              animate={{ width: `${fillPct}%` }}
              transition={{ duration: 0.12, ease: 'easeOut' }}
            />
          </div>

          {/* Status hint */}
          <p aria-live="polite" className="font-sans uppercase tracking-[0.22em]" style={{
            fontSize: '0.6875rem',
            color: status === 'error' ? 'rgba(210,65,50,0.8)' : ACCENT,
            opacity: status === 'loading' ? 0.4 : code.length > 0 ? 0.85 : 0.28,
            transition: 'opacity 0.2s, color 0.2s',
            marginBottom: 0,
            letterSpacing: '0.24em',
          }}>
            {status === 'loading' ? 'Verifying…' : status === 'error' ? error : code.length > 0 ? 'Press ↵ Enter' : 'Type your access code'}
          </p>

          <button type="submit" disabled={status === 'loading' || !code} className="mt-5 px-6 py-3 border border-white/25 font-sans text-sm disabled:opacity-40">Unlock overview</button>
        </form>

        <a href="#investor-request" onClick={onCancel} className="block mt-6 font-sans text-sm underline underline-offset-4">
          Request access
        </a>

        {/* Back */}
        <button
          onClick={onCancel}
          className="font-sans uppercase tracking-[0.2em]"
          style={{ marginTop: 18, fontSize: '0.5625rem', color: '#f5f1e8', opacity: 0.72, minHeight: 44, background: 'none', border: 'none', cursor: 'pointer', transition: 'opacity 0.2s', letterSpacing: '0.22em' }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.5')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '0.18')}
        >
          ← Back
        </button>
      </motion.div>
    </motion.div>
  )
}

export default function PageClient({
  visitor,
}: {
  visitor: VisitorContent
}) {
  const [investor, setInvestor] = useState<InvestorStory | null>(null)
  const [isInvestor, setIsInvestor] = useState(false)
  const [showGate, setShowGate] = useState(false)
  const [transitioning, setTransitioning] = useState(false)
  const [investorStatus, setInvestorStatus] = useState<'idle' | 'loading'>('idle')
  const unlockRequest = useRef<AbortController | null>(null)

  const investorMode = isInvestor && investor !== null
  const theme = investorMode ? INVESTOR : VISITOR

  // On the home page, the navigation shows which chapter is being read.
  const [activeChapter, setActiveChapter] = useState<string | null>(null)
  useEffect(() => {
    if (investorMode || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(entries => {
      for (const e of entries) if (e.isIntersecting) setActiveChapter((e.target as HTMLElement).dataset.chapter ?? null)
    }, { rootMargin: '-45% 0px -50% 0px' })
    const sections = document.querySelectorAll('[data-chapter]')
    sections.forEach(el => observer.observe(el))
    const clear = () => { const first = sections[0] as HTMLElement | undefined; const last = sections[sections.length - 1] as HTMLElement | undefined; if (!first || !last) return; const y = window.innerHeight / 2; if (first.getBoundingClientRect().top > y || last.getBoundingClientRect().bottom < y) setActiveChapter(null) }
    window.addEventListener('scroll', clear, { passive: true })
    return () => { observer.disconnect(); window.removeEventListener('scroll', clear) }
  }, [investorMode])

  // No silent preload — gate is always shown on fresh page load

  function switchToInvestor() {
    setTransitioning(true)
    window.scrollTo({ top: 0, behavior: 'instant' })
    setTimeout(() => { setIsInvestor(true); setTransitioning(false) }, 320)
  }

  function switchToVisitor() {
    void fetch('/api/investor-content', { method: 'DELETE' }).catch(() => {})
    setTransitioning(true)
    window.scrollTo({ top: 0, behavior: 'instant' })
    setTimeout(() => { setIsInvestor(false); setInvestor(null); setTransitioning(false) }, 320)
  }

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('mode') === 'investor') setShowGate(true)
  }, [])

  async function handleInvestorUnlock(code: string) {
    const request = new AbortController()
    unlockRequest.current = request
    setInvestorStatus('loading')
    try {
      const access = await fetch('/api/investor-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
        signal: request.signal,
      })
      if (!access.ok) {
        if (access.status === 401) return 'Code not recognised.'
        if (access.status === 429) return 'Too many attempts. Please try again shortly.'
        return 'Investor access is temporarily unavailable.'
      }

      const response = await fetch('/api/investor-content', { cache: 'no-store', signal: request.signal })
      if (!response.ok) return 'The investor overview is temporarily unavailable.'
      const story = await response.json() as InvestorStory
      if (request.signal.aborted) return null
      setInvestor(story)
      setShowGate(false)
      switchToInvestor()
      return null
    } catch {
      return 'Could not connect. Please try again.'
    } finally {
      if (unlockRequest.current === request) {
        unlockRequest.current = null
        setInvestorStatus('idle')
      }
    }
  }

  function closeInvestorGate() {
    unlockRequest.current?.abort()
    setShowGate(false)
  }

  function handleInvestorClick() {
    if (!investorMode && investorStatus !== 'loading') setShowGate(true)
  }

  return (
    <MotionConfig reducedMotion="user">
    <div style={{ backgroundColor: theme.bg, color: theme.fg, minHeight: '100vh', transition: 'background-color 0.6s cubic-bezier(0.25,0,0.2,1), color 0.6s cubic-bezier(0.25,0,0.2,1)', position: 'relative' }}>


      {/* Subtle grain overlay — adds depth without visual noise */}
      {!investorMode && (
        <div aria-hidden style={{
          position: 'fixed', inset: 0, zIndex: 9998, pointerEvents: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          opacity: 0.022,
          mixBlendMode: 'multiply',
        }} />
      )}

      {/* Original media warm-up and branded transition. */}

      {/* Investor gate */}
      <AnimatePresence>
        {showGate && (
          <InvestorGate
            onUnlock={handleInvestorUnlock}
            onCancel={closeInvestorGate}
          />
        )}
      </AnimatePresence>

      {/* Nav */}
      <a href="#main-content" className="skip-link">Skip to content</a>
      <nav aria-label="Primary navigation"
        className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 h-16 md:h-20 flex items-center justify-between"
        style={{
          backgroundColor: investorMode ? 'rgba(14,14,14,0.82)' : 'rgba(245,241,232,0.82)',
          backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
          borderBottom: BORDER,
          transition: 'background-color 0.6s cubic-bezier(0.25,0,0.2,1)',
        }}
      >
        <Link href="/" aria-label="NUMU homepage">
        <Image
          src={investorMode ? '/branding/logo-numu.png' : '/branding/logo-black-numu.png'}
          alt="NUMU" width={240} height={96}
          className="h-12 md:h-16 w-auto object-contain"
          style={investorMode
            ? { filter: 'brightness(0) invert(1) sepia(1) saturate(0) brightness(0.92)' }
            : { mixBlendMode: 'multiply' }}
          priority
        />
        </Link>
        <div className="flex items-center gap-2 md:gap-4">
          {!investorMode && <MobileNav />}
          <div className="hidden xl:flex items-center gap-4">
            {(investorMode
              ? [{ id: 'traction', href: '#traction', label: 'Traction' }, { id: 'roadmap', href: '#roadmap', label: 'Operating plan' }, { id: 'ask', href: '#ask', label: 'Seed round' }]
              : PRIMARY_NAV_LINKS).map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="font-sans uppercase tracking-[0.14em] numu-nav-link"
                data-active={(!investorMode && activeChapter === link.id) || undefined}
                aria-current={!investorMode && activeChapter === link.id ? 'location' : undefined}
                style={{
                  fontSize: '0.75rem',
                  color: investorMode ? 'rgba(245,241,232,0.72)' : 'rgba(26,23,20,0.72)',
                  textDecoration: 'none',
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center" style={{ border: BORDER, borderRadius: 999, padding: 3 }}>
            {[
              { id: 'explore', label: 'Explore', active: !investorMode, onClick: () => { if (investorMode) switchToVisitor() } },
              { id: 'investor', label: investorStatus === 'loading' ? 'Checking…' : 'Investor', active: investorMode, onClick: handleInvestorClick },
            ].map(btn => (
              <button
                key={btn.id} onClick={() => { void btn.onClick() }}
                className="px-2 md:px-4 py-1.5 font-sans text-label uppercase tracking-[0.1em] rounded-full transition-colors duration-200"
                disabled={investorStatus === 'loading' && btn.id === 'investor'}
                style={{ backgroundColor: btn.active ? (investorMode ? 'rgba(245,241,232,0.14)' : 'rgba(26,23,20,0.12)') : 'transparent', cursor: investorStatus === 'loading' && btn.id === 'investor' ? 'wait' : 'pointer', opacity: investorStatus === 'loading' && btn.id === 'investor' ? 0.8 : 1 }}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main id="main-content">
      {/* Hero 1 — identity. A slow welcome: the name, then its meaning, then what NUMU is. */}
      {!investorMode && <section className="flex flex-col items-center justify-center text-center px-6" style={{ height: '100vh', minHeight: 600, position: 'relative' }}>
        <motion.p
          className="font-display numu-welcome-word"
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.4, ease: [0.2, 0.7, 0.2, 1] }}
          style={{ fontSize: 'var(--hero-size)', lineHeight: 'var(--hero-lh)', letterSpacing: '-0.04em', margin: 0 }}
        >NUMU</motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 1.6 }}>
          <NumuName variant="welcome" />
        </motion.div>
        <motion.p
          className="font-sans mt-6 uppercase tracking-[0.18em]"
          initial={{ opacity: 0 }} animate={{ opacity: 0.68 }} transition={{ delay: 1.8, duration: 1.2 }}
          style={{ fontSize: 'clamp(0.75rem, 1.1vw, 0.82rem)' }}
        >
          UAE — Bio-composites platform
        </motion.p>
        <motion.p
          className="font-sans mt-5"
          initial={{ opacity: 0 }} animate={{ opacity: 0.78 }} transition={{ delay: 2.4, duration: 1.2 }}
          style={{ fontSize: 'clamp(1rem, 1.2vw, 1.1rem)', letterSpacing: '0.02em', lineHeight: 1.7 }}
        >
          Grown, not manufactured.
        </motion.p>
        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.34 }}
          transition={{ delay: 3.2, duration: 1.0 }}
          style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
        >
          <p className="font-sans uppercase tracking-[0.2em]" style={{ fontSize: 12 }}>Scroll</p>
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.3 }}
          >
            <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
              <path d="M5 0v10M1 7l4 4 4-4" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        </motion.div>
      </section>}

      {/* Hero 2 — product visual */}
      <section
        className="relative flex flex-col items-center justify-center px-6 text-center"
        style={{
          height: '100vh',
          minHeight: 600,
          borderTop: BORDER,
          overflow: 'hidden',
          paddingTop: investorMode ? '7rem' : '6rem',
          paddingBottom: investorMode ? '5rem' : '6.5rem',
        }}
      >
        {/* Background — visitor: spore field, investor: 3D rotating panel */}
        {!investorMode ? (
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
          background: investorMode
            ? 'linear-gradient(to top, rgba(14,14,14,0.65) 0%, transparent 100%)'
            : 'linear-gradient(to top, rgba(245,241,232,0.88) 0%, transparent 100%)',
        }} />

        {/* Foam block cutout — FILE: /public/images/hero/mycofoam_block_01.png
             Using the existing PNG keeps the hero dependable in local/dev and deploy. */}
        {!investorMode && (
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
              src="/images/hero/mycofoam_block_01_multiply.jpg"
              alt=""
              aria-hidden
              width={440}
              height={550}
              sizes="(max-width: 815px) 54vw, 440px"
              priority
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
        )}

        <div
          className="relative w-full mx-auto text-center"
          style={{
            zIndex: 2,
            maxWidth: investorMode ? 960 : 1080,
            transform: investorMode ? 'translateY(-4vh)' : 'translateY(-3vh)',
          }}
        >
          <p className="font-sans uppercase tracking-[0.18em] mb-6" style={{ opacity: 0.68, fontSize: '0.75rem' }}>
            {investorMode && investor ? investor.hero.sublabel : visitor.hero.sublabel}
          </p>
          <h1
              className="font-display block text-center"
              style={{
                fontSize: investorMode ? 'clamp(2.6rem, 5.2vw, 4.75rem)' : 'clamp(2.9rem, 6.3vw, 6.2rem)',
                lineHeight: 1.02,
                letterSpacing: '-0.03em',
              }}
            >
              {(investorMode && investor ? investor.hero.lines : visitor.hero.lines).map((line) => (
                <span key={line} className="block">{line}</span>
              ))}
          </h1>
          <div
            className="mt-8 pt-6 flex flex-col items-center mx-auto"
            style={{ borderTop: BORDER, width: investorMode ? 'min(100%, 820px)' : 'min(100%, 780px)' }}
          >
            <p className="font-sans text-label uppercase tracking-[0.14em] mb-8" style={{ opacity: 0.68 }}>
              {investorMode && investor ? investor.hero.meta : visitor.hero.meta}
            </p>
            <a
              href={investorMode && investor ? '#opportunity' : visitor.hero.cta.href}
              className="font-sans text-label uppercase tracking-[0.14em] px-7 py-4 border inline-block"
              style={{ borderColor: 'rgba(128,128,128,0.4)', transition: 'border-color 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = investorMode ? 'rgba(245,241,232,0.7)' : 'rgba(26,23,20,0.6)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(128,128,128,0.4)' }}
            >
              {investorMode && investor ? 'View opportunity' : visitor.hero.cta.label} ↓
            </a>
            {!investorMode && <EventNotice />}
            {investorMode && (
              <div className="mt-10 grid grid-cols-3 gap-px overflow-hidden rounded-sm" style={{ backgroundColor: 'rgba(245,241,232,0.2)', maxWidth: 700, width: '100%' }}>
                {investor?.hero.stats.map(stat => (
                  <div key={stat.label} className="px-4 py-4 md:px-5 md:py-5" style={{ backgroundColor: 'rgba(14,14,14,0.86)' }}>
                    <p className="font-display" style={{ fontSize: 'clamp(1rem, 1.8vw, 1.35rem)', letterSpacing: '-0.02em', lineHeight: 1.1, color: ACCENT }}>{stat.value}</p>
                    <p className="font-sans uppercase tracking-[0.14em] mt-1.5" style={{ fontSize: '0.75rem', opacity: 0.68 }}>{stat.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {!investorMode && <HomeIntroduction />}

      {/* Page content */}
      <div style={{ opacity: transitioning ? 0 : 1, transition: 'opacity 0.35s cubic-bezier(0.25,0,0.2,1)' }}>
        {investorMode && investor ? <InvestorView story={investor} /> : <VisitorView v={visitor} />}
      </div>

      </main>
    </div>
    </MotionConfig>
  )
}
