'use client'

import { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { motion, AnimatePresence, useInView, useMotionValue, useTransform, animate } from 'framer-motion'
import type { VisitorContent, InvestorContent } from '@/lib/content'

const PanelViewer = dynamic(() => import('./PanelViewer'), { ssr: false })
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
    <p className="font-sans text-label uppercase tracking-[0.18em] mb-6" style={{ opacity: 0.65 }}>
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
    <p className="font-sans text-base md:text-[1.0625rem] leading-[1.75] mb-12 max-w-2xl" style={{ opacity: 0.65 }}>
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
    <h2 className="font-display text-headline mb-10 max-w-3xl" style={{ textWrap: 'balance' as React.CSSProperties['textWrap'] }}>
      {text}
    </h2>
  )
}

function IBody({ text }: { text: string }) {
  return (
    <p className="font-sans text-base md:text-[1.0625rem] leading-[1.75] mb-10 max-w-2xl" style={{ opacity: 0.55 }}>
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
          <p className="font-sans text-label uppercase tracking-[0.18em] mb-3" style={{ opacity: 0.38 }}>Production — Dubai lab</p>
          <p className="font-sans text-base max-w-lg" style={{ opacity: 0.48, lineHeight: 1.75 }}>
            NUMU operates an active production lab in Dubai since 2025. Material is grown and pressed from regional agricultural waste — no imports, no synthetic resins.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-[1.75fr_1fr] gap-3">
          {/* Main feature image */}
          <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
            <Image
              src="/images/founder/founder_in_action.png"
              alt="NUMU production lab — Dubai"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 65vw"
            />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px', background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)' }}>
              <p className="font-sans uppercase tracking-[0.14em]" style={{ fontSize: 9, opacity: 0.6, color: '#f5f1e8' }}>Production lab — Dubai, 2025</p>
            </div>
          </div>
          {/* Right column placeholders */}
          <div className="flex flex-col gap-3">
            <ImagePlaceholder
              aspect="4:3"
              brief="Lab documentation — growth chamber, substrate preparation, and panel finishing in the Dubai production lab. Photography Q2 2026."
              label="Lab documentation — coming"
            />
            <ImagePlaceholder
              aspect="4:3"
              brief="KAVE installation — Dubai 2025. FOLD acoustic panel system installed in situ. Full photography session scheduled."
              label="KAVE install — photography pending"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Process & Test Carousel ─────────────────────────────────────────────────

const CAROUSEL_ITEMS = [
  { src: '/images/textures/texture_closeup_01.jpg', alt: 'Material surface — texture study', aspect: '1/1', label: 'Surface texture' },
  { src: '/images/products/biofoam_detail.png', alt: 'Biofoam block — material study', aspect: '4/3', label: 'Biofoam material' },
  { src: '/images/founder/founder_in_action.png', alt: 'Production lab — process documentation', aspect: '3/4', label: 'Lab process' },
  { src: '/images/textures/texture_closeup_02.jpg', alt: 'Material surface — detail', aspect: '1/1', label: 'Surface detail' },
  { src: '/images/products/fold_solo_panel.png', alt: 'FOLD panel — product study', aspect: '3/4', label: 'FOLD panel' },
  { src: '/images/hero/mycofoam_block_01.png', alt: 'Mycofoam composite block', aspect: '4/3', label: 'Composite form' },
  { src: '/images/applications/event_board.png', alt: 'Pressed composite board — test batch', aspect: '16/9', label: 'Pressed board' },
  { src: '/images/materials/acoustic_render_05.png', alt: 'Acoustic tile — geometry study', aspect: '1/1', label: 'Acoustic tile' },
  { src: '/images/products/fold_context_scale.png', alt: 'FOLD installation — scale context', aspect: '4/3', label: 'Scale context' },
]

function ProcessCarousel() {
  return (
    <section className="px-6 md:px-12 py-24 md:py-32" style={{ borderTop: BORDER }}>
      <div className="max-w-[1440px] mx-auto mb-8">
        <p className="font-sans text-label uppercase tracking-[0.18em] mb-2" style={{ opacity: 0.35 }}>
          Process & material studies
        </p>
        <p className="font-sans text-xs" style={{ opacity: 0.28 }}>← scroll →</p>
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
        {CAROUSEL_ITEMS.map((item, i) => {
          const heights: Record<string, number> = { '1/1': 280, '4/3': 280, '3/4': 360, '16/9': 210 }
          const widths: Record<string, number> = { '1/1': 280, '4/3': 374, '3/4': 270, '16/9': 374 }
          return (
            <div
              key={i}
              style={{
                flexShrink: 0,
                scrollSnapAlign: 'start',
                width: widths[item.aspect] || 280,
                height: heights[item.aspect] || 280,
                position: 'relative',
                overflow: 'hidden',
                border: BORDER,
              }}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover object-center"
                sizes="300px"
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
          )
        })}
        {/* Placeholder slots for new content */}
        {[
          { label: 'Growth cycle — time-lapse', brief: 'Growth chamber time-lapse documentation. Mycelium colonization from inoculation to full substrate coverage over 5 days.' },
          { label: 'Substrate testing — batch 04', brief: 'Substrate composition tests — palm fibre ratios and moisture content variations affecting final density and acoustic performance.' },
          { label: 'Panel installation — close', brief: 'Panel installation close-up documentation — adhesive fixing, grout line, and surface consistency across a multi-panel wall installation.' },
        ].map((ph, i) => (
          <div
            key={`ph-${i}`}
            style={{
              flexShrink: 0,
              scrollSnapAlign: 'start',
              width: 280,
              height: 280,
              position: 'relative',
            }}
          >
            <ImagePlaceholder aspect="1:1" brief={ph.brief} label={ph.label} />
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── Investor contact form ────────────────────────────────────────────────────

function InvestorContact({ iv }: { iv: InvestorContent }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || status === 'loading') return
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) })
      setStatus(res.ok ? 'sent' : 'error')
    } catch { setStatus('error') }
  }

  return (
    <div className="rounded-sm px-10 md:px-16 py-16 md:py-20" style={{ backgroundColor: 'rgba(245,241,232,0.04)', border: '1px solid rgba(245,241,232,0.08)' }}>
      <ILabel text={iv.cta.label} />
      <h2 className="font-display text-headline mb-6 max-w-2xl">{iv.cta.heading}</h2>
      <p className="font-sans text-base leading-[1.75] mb-6 max-w-xl" style={{ opacity: 0.55 }}>{iv.cta.body}</p>
      {status === 'sent' ? (
        <div className="mt-6 max-w-lg">
          <p className="font-sans text-base" style={{ opacity: 0.75, lineHeight: 1.6 }}>Request received. We&apos;ll be in touch shortly.</p>
          <p className="font-sans text-xs mt-3" style={{ opacity: 0.3 }}>Sent to andy@numu.bio</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mt-6 max-w-lg">
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com" required disabled={status === 'loading'}
            className="flex-1 font-sans text-sm px-5 py-3.5 bg-transparent outline-none"
            style={{ border: '1px solid rgba(245,241,232,0.22)', color: 'rgba(245,241,232,0.85)', opacity: status === 'loading' ? 0.5 : 1 }}
          />
          <button
            type="submit" disabled={status === 'loading'}
            className="font-sans text-label uppercase tracking-[0.14em] px-7 py-3.5 flex-shrink-0"
            style={{ backgroundColor: 'rgba(245,241,232,0.1)', border: '1px solid rgba(245,241,232,0.22)', cursor: status === 'loading' ? 'wait' : 'pointer', opacity: status === 'loading' ? 0.55 : 1, transition: 'opacity 0.2s' }}
          >
            {status === 'loading' ? 'Sending…' : 'Request Deck →'}
          </button>
        </form>
      )}
      {status === 'error' && (
        <p className="font-sans text-xs mt-3" style={{ opacity: 0.4 }}>Something went wrong — email andy@numu.bio directly.</p>
      )}
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
            <div style={{ position: 'absolute', top: -8, right: 16, fontFamily: "'Playfair Display', Georgia, serif", fontSize: '7rem', lineHeight: 1, color: 'rgba(245,241,232,1)', opacity: 0.04, fontWeight: 700, letterSpacing: '-0.04em', userSelect: 'none', pointerEvents: 'none' }}>
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
    { value: 600, prefix: '$', suffix: 'K', unit: 'SAFE RAISE', decimals: 0 },
    { value: 18, prefix: '', suffix: ' mo', unit: 'RUNWAY', decimals: 0 },
    { value: 65, prefix: '', suffix: '%', unit: 'GROSS MARGIN', decimals: 0 },
    { value: 2.2, prefix: 'AED ', suffix: 'M', unit: 'TOTAL RAISE', decimals: 1 },
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
  { index: '01', name: 'Acoustic + Pressed Boards', note: '2026 — Active', width: '32%', status: 'active' },
  { index: '02', name: 'Certified Specification Channel', note: '2027 — Next', width: '55%', status: 'next' },
  { index: '03', name: 'Packaging + Thermal', note: '2028 — Future', width: '75%', status: 'future' },
  { index: '04', name: 'Licensing + Regional Expansion', note: '2028+ — Long-term', width: '100%', status: 'future' },
]

function PlatformExpansion() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px' })

  return (
    <div ref={ref} className="mt-16" style={{ borderTop: INV_BORDER }}>
      <p className="font-sans text-label uppercase tracking-[0.18em] mt-10 mb-12" style={{ opacity: 0.35 }}>
        Platform expansion — from entry point to system
      </p>
      <div>
        {[...PLATFORM_TIERS].reverse().map((tier, i) => {
          const isActive = tier.status === 'active'
          const barColor = isActive ? ACCENT : tier.status === 'next' ? 'rgba(245,241,232,0.45)' : 'rgba(245,241,232,0.18)'
          return (
            <div key={tier.index} className="flex items-center gap-6 py-5" style={{ borderBottom: i < PLATFORM_TIERS.length - 1 ? INV_BORDER_SUBTLE : 'none' }}>
              <span className="font-sans text-label uppercase tracking-[0.18em] flex-shrink-0 w-8" style={{ opacity: isActive ? 0.8 : 0.28, color: isActive ? ACCENT : undefined }}>{tier.index}</span>
              <div className="flex-1">
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, margin: '0px' }}
                  transition={{ duration: 0.8, delay: i * 0.12, ease: [0.25, 0, 0.2, 1] }}
                  style={{ width: tier.width, height: isActive ? 3 : 2, backgroundColor: barColor, marginBottom: 10, transformOrigin: 'left', boxShadow: isActive ? `0 0 8px ${ACCENT}66` : 'none' }}
                />
                <div className="flex items-baseline gap-4">
                  <p className="font-display text-lg md:text-xl" style={{ opacity: isActive ? 1 : 0.55, color: isActive ? undefined : undefined }}>{tier.name}</p>
                  <span className="font-sans text-label uppercase tracking-[0.14em]" style={{ opacity: isActive ? 0.6 : 0.28, color: isActive ? ACCENT : undefined }}>{tier.note}</span>
                </div>
              </div>
              {isActive && <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: ACCENT, flexShrink: 0, boxShadow: `0 0 8px ${ACCENT}88` }} />}
            </div>
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
            <p className="font-display text-2xl mb-3" style={{ letterSpacing: '-0.02em' }}>{engine.name}</p>
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
  const inView = useInView(ref, { once: true, margin: '0px' })
  const MAX_VAL = 35

  return (
    <div ref={ref} className="mt-20" style={{ borderTop: INV_BORDER }}>
      <p className="font-sans text-label uppercase tracking-[0.18em] mt-10 mb-4" style={{ opacity: 0.35 }}>
        {data.label}
      </p>
      <h3 className="font-display mb-14" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.75rem)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
        {data.heading}
      </h3>
      <div className="flex items-end gap-4 md:gap-8" style={{ height: 300 }}>
        {data.years.map((yr, i) => {
          const lowPct = (yr.low / MAX_VAL) * 100
          const rangePct = ((yr.high - yr.low) / MAX_VAL) * 100
          const isLast = i === data.years.length - 1

          return (
            <div key={yr.year} className="flex-1 flex flex-col items-center gap-3" style={{ height: '100%' }}>
              <div className="flex-1 flex flex-col justify-end w-full" style={{ position: 'relative' }}>
                {/* Floating count-up label above bar */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '0px' }}
                  transition={{ duration: 0.4, delay: 0.8 + i * 0.15 }}
                  style={{ position: 'absolute', bottom: `${(yr.high / MAX_VAL) * 100 + 2}%`, left: 0, right: 0, textAlign: 'center' }}
                >
                  <span className="font-sans" style={{ fontSize: 10, opacity: 0.45, letterSpacing: '0.06em', color: isLast ? ACCENT : undefined }}>
                    <CountUp to={yr.high} suffix="M" prefix="AED " duration={1.2 + i * 0.1} />
                  </span>
                </motion.div>

                {/* Range bar */}
                <motion.div
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true, margin: '0px' }}
                  transition={{ duration: 0.75, delay: 0.25 + i * 0.15, ease: [0.25, 0, 0.2, 1] }}
                  style={{
                    position: 'absolute', bottom: `${lowPct}%`, left: 0, right: 0,
                    height: `${rangePct}%`,
                    backgroundColor: isLast ? `${ACCENT}44` : 'rgba(245,241,232,0.2)',
                    transformOrigin: 'bottom',
                  }}
                />
                {/* Base bar */}
                <motion.div
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true, margin: '0px' }}
                  transition={{ duration: 0.75, delay: 0.15 + i * 0.15, ease: [0.25, 0, 0.2, 1] }}
                  style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    height: `${lowPct}%`,
                    backgroundColor: isLast ? ACCENT : i === 0 ? 'rgba(245,241,232,0.45)' : 'rgba(245,241,232,0.72)',
                    transformOrigin: 'bottom',
                  }}
                />
              </div>
              <div className="text-center">
                <p className="font-display text-sm md:text-base" style={{ letterSpacing: '-0.01em', opacity: isLast ? 1 : 0.75, color: isLast ? ACCENT : undefined }}>{yr.label}</p>
                <p className="font-sans text-label uppercase tracking-[0.14em] mt-1" style={{ opacity: 0.35 }}>{yr.year}</p>
              </div>
            </div>
          )
        })}
      </div>
      <div className="mt-8 flex items-center gap-6" style={{ opacity: 0.35 }}>
        <div className="flex items-center gap-2">
          <div style={{ width: 12, height: 12, backgroundColor: 'rgba(245,241,232,0.7)' }} />
          <p className="font-sans text-label uppercase tracking-[0.12em]">Base case</p>
        </div>
        <div className="flex items-center gap-2">
          <div style={{ width: 12, height: 12, backgroundColor: 'rgba(245,241,232,0.25)' }} />
          <p className="font-sans text-label uppercase tracking-[0.12em]">Upside range</p>
        </div>
      </div>
      <p className="font-sans text-label mt-5" style={{ opacity: 0.22 }}>
        * Projections assume successful certification by month 18 and activation of E3 specification channel. Base case excludes licensing revenue.
      </p>
    </div>
  )
}

// ─── Competitive Grid ─────────────────────────────────────────────────────────

function CompetitiveGrid({ data }: { data: InvestorContent['competitive'] }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px' })

  const Check = ({ val, highlight }: { val: boolean; highlight?: boolean }) => (
    <span style={{ opacity: val ? (highlight ? 1 : 0.8) : 0.2 }}>
      {val
        ? <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={14} height={14}><polyline points="2,8 6,12 14,4" /></svg>
        : <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={14} height={14}><line x1="4" y1="4" x2="12" y2="12" /><line x1="12" y1="4" x2="4" y2="12" /></svg>
      }
    </span>
  )

  const cols = ['Bio-based', 'GCC Local', 'Certified', 'Price / m²']

  return (
    <div ref={ref} className="mt-20" style={{ borderTop: INV_BORDER }}>
      <p className="font-sans text-label uppercase tracking-[0.18em] mt-10 mb-4" style={{ opacity: 0.35 }}>
        {data.label}
      </p>
      <h3 className="font-display mb-12" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.75rem)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
        {data.heading}
      </h3>
      <div className="overflow-x-auto">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: INV_BORDER }}>
              <th className="font-sans text-label uppercase tracking-[0.14em] text-left py-4 pr-6" style={{ opacity: 0.35 }}>Player</th>
              {cols.map(col => (
                <th key={col} className="font-sans text-label uppercase tracking-[0.12em] text-center py-4 px-4" style={{ opacity: 0.35 }}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.players.map((player, i) => (
              <motion.tr
                key={player.name}
                initial={{ opacity: 0, x: -10 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.08, ease: [0.25, 0, 0.2, 1] }}
                style={{
                  borderBottom: i < data.players.length - 1 ? INV_BORDER_SUBTLE : 'none',
                  backgroundColor: player.numu ? `${ACCENT}12` : 'transparent',
                  boxShadow: player.numu ? `inset 3px 0 0 ${ACCENT}` : 'none',
                }}
              >
                <td className="py-5 pr-6 pl-4">
                  <div className="flex items-center gap-3">
                    {player.numu && (
                      <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: ACCENT, flexShrink: 0, boxShadow: `0 0 8px ${ACCENT}88` }} />
                    )}
                    <div>
                      <p className="font-display text-base md:text-lg" style={{ opacity: player.numu ? 1 : 0.55, color: player.numu ? ACCENT : undefined }}>{player.name}</p>
                      <p className="font-sans text-label" style={{ opacity: 0.3 }}>{player.origin}</p>
                    </div>
                  </div>
                </td>
                <td className="text-center px-4"><Check val={player.bio} highlight={player.numu} /></td>
                <td className="text-center px-4"><Check val={player.local} highlight={player.numu} /></td>
                <td className="text-center px-4"><Check val={player.certified} highlight={player.numu} /></td>
                <td className="text-center px-4 font-sans text-sm" style={{ opacity: player.numu ? 1 : 0.45, color: player.numu ? ACCENT : undefined }}>{player.price}</td>
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
    phase: '01', label: 'UAE Acoustic', period: '2026 — Entry',
    tam: 'AED 200–300M', sam: 'AED 60M', som: 'AED 15M',
    tamR: 44, samR: 28, somR: 15, active: true,
  },
  {
    phase: '02', label: 'GCC Acoustic Spec', period: '2027 — Certification',
    tam: 'AED 1.5B', sam: 'AED 350M', som: 'AED 50M',
    tamR: 60, samR: 37, somR: 18, active: false,
  },
  {
    phase: '03', label: 'GCC Multi-material', period: '2028 — Platform',
    tam: 'AED 6B+', sam: 'AED 1.2B', som: 'AED 150M',
    tamR: 76, samR: 47, somR: 22, active: false,
  },
  {
    phase: '04', label: 'Regional Licensing', period: '2029+ — Scale',
    tam: 'AED 20B+', sam: 'AED 4B', som: 'AED 400M',
    tamR: 92, samR: 57, somR: 28, active: false,
  },
]

function MarketTAMDiagram() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px' })
  const SVG_W = 760
  const SVG_H = 300
  const CY = 130
  const centers = [95, 282, 469, 660]

  return (
    <div ref={ref} className="mt-16" style={{ borderTop: INV_BORDER }}>
      <p className="font-sans text-label uppercase tracking-[0.18em] mt-10 mb-10" style={{ opacity: 0.35 }}>
        Market phases — addressable opportunity expands as platform activates
      </p>
      <div style={{ overflowX: 'auto', overflowY: 'hidden' }}>
        <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} style={{ width: '100%', maxWidth: SVG_W, display: 'block', minWidth: 360, margin: '0 auto' }}>
          {MARKET_TAM_DATA.map((p, i) => {
            const cx = centers[i]
            const tamCirc = 2 * Math.PI * p.tamR
            const samCirc = 2 * Math.PI * p.samR
            const somCirc = 2 * Math.PI * p.somR
            return (
              <g key={p.phase}>
                {/* TAM — outer fill */}
                <motion.circle
                  cx={cx} cy={CY} r={p.tamR}
                  fill={p.active ? `${ACCENT}0e` : 'rgba(245,241,232,0.03)'}
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.18 + 0.1 }}
                />
                {/* TAM — outer stroke */}
                <motion.circle
                  cx={cx} cy={CY} r={p.tamR}
                  fill="none"
                  stroke={p.active ? ACCENT : 'rgba(245,241,232,0.2)'}
                  strokeWidth={p.active ? 1.2 : 0.75}
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
                  stroke={p.active ? ACCENT : 'rgba(245,241,232,0.32)'}
                  strokeWidth={p.active ? 1.5 : 0.9}
                  strokeDasharray={samCirc}
                  initial={{ strokeDashoffset: samCirc }}
                  animate={inView ? { strokeDashoffset: 0 } : {}}
                  transition={{ duration: 0.85, delay: i * 0.18 + 0.35, ease: [0.25, 0, 0.2, 1] }}
                  transform={`rotate(-90 ${cx} ${CY})`}
                />
                {/* SOM — inner fill + stroke */}
                <motion.circle
                  cx={cx} cy={CY} r={p.somR}
                  fill={p.active ? `${ACCENT}28` : 'rgba(245,241,232,0.07)'}
                  stroke={p.active ? ACCENT : 'rgba(245,241,232,0.45)'}
                  strokeWidth={p.active ? 1.8 : 1.1}
                  strokeDasharray={somCirc}
                  initial={{ strokeDashoffset: somCirc }}
                  animate={inView ? { strokeDashoffset: 0 } : {}}
                  transition={{ duration: 0.65, delay: i * 0.18 + 0.55, ease: [0.25, 0, 0.2, 1] }}
                  transform={`rotate(-90 ${cx} ${CY})`}
                />
                {/* Phase number */}
                <motion.text
                  x={cx} y={CY - p.tamR - 12}
                  textAnchor="middle"
                  fontFamily="'Inter', sans-serif"
                  fontSize={7.5}
                  fill={p.active ? ACCENT : 'rgba(245,241,232,1)'}
                  fillOpacity={p.active ? 1 : 0.28}
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
                  fontSize={p.active ? 11 : 9.5}
                  fill={p.active ? ACCENT : 'rgba(245,241,232,0.5)'}
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
                  fill="rgba(245,241,232,1)"
                  fillOpacity={p.active ? 0.45 : 0.2}
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
        {MARKET_TAM_DATA.map((p, i) => (
          <motion.div
            key={p.phase}
            className="flex items-start gap-6 py-5"
            initial={{ opacity: 0, x: 16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.12 + 0.6, ease: [0.25, 0, 0.2, 1] }}
            style={{ borderBottom: i < MARKET_TAM_DATA.length - 1 ? INV_BORDER_SUBTLE : 'none' }}
          >
            <p className="font-sans text-label uppercase tracking-[0.14em] flex-shrink-0 w-8" style={{ opacity: 0.3, color: p.active ? ACCENT : undefined }}>{p.phase}</p>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-1">
                <p className="font-display" style={{ fontSize: 'clamp(1.25rem, 2vw, 1.75rem)', letterSpacing: '-0.025em', lineHeight: 1, color: p.active ? ACCENT : undefined, opacity: p.active ? 1 : 0.55 }}>{p.tam}</p>
                <p className="font-sans text-label uppercase tracking-[0.12em]" style={{ opacity: 0.3, color: p.active ? ACCENT : undefined }}>{p.period}</p>
              </div>
              <p className="font-sans text-sm" style={{ opacity: 0.38 }}>{p.label}</p>
            </div>
          </motion.div>
        ))}
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
            <p className="font-display text-2xl md:text-3xl mb-8" style={{ letterSpacing: '-0.025em', opacity: i === 0 ? 1 : 0.45 }}>{phase.label}</p>
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
      <div className="grid grid-cols-1 md:grid-cols-2 mt-10" style={{ gap: 1, backgroundColor: 'rgba(245,241,232,0.12)' }}>
        {[
          { stream: 'Stream 01', title: 'Design Products', desc: 'Grown acoustic panels and pressed composite boards sold direct to interior designers, architects, and events clients. Two production routes, one material system. High margin. Immediate market. Brand-establishing.', bullets: ['Direct sale', 'High margin', 'Near-term revenue'] },
          { stream: 'Stream 02', title: 'Material Licensing', desc: 'Licensing the material platform to regional manufacturers. Scalable without proportional capex. Compounds proprietary IP.', bullets: ['Platform fee', 'Scalable', 'Long-term compounding'] },
        ].map(s => (
          <div key={s.stream} className="p-10 md:p-14" style={{ backgroundColor: '#0e0e0e' }}>
            <p className="font-sans text-label uppercase tracking-[0.18em] mb-8" style={{ opacity: 0.35 }}>{s.stream}</p>
            <p className="font-display text-2xl md:text-3xl mb-6">{s.title}</p>
            <p className="font-sans text-base leading-[1.75] mb-10" style={{ opacity: 0.55 }}>{s.desc}</p>
            <div style={{ borderTop: INV_BORDER_SUBTLE, paddingTop: 24 }}>
              {s.bullets.map(b => (
                <div key={b} className="flex items-center gap-3 mb-3">
                  <div style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: 'rgba(245,241,232,1)', opacity: 0.4 }} />
                  <p className="font-sans text-sm" style={{ opacity: 0.5 }}>{b}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 flex items-center gap-4" style={{ opacity: 0.3 }}>
        <div style={{ flex: 1, height: 1, backgroundColor: 'rgba(245,241,232,1)' }} />
        <p className="font-sans text-label uppercase tracking-[0.16em] flex-shrink-0">Products establish brand → licensing scales margin</p>
        <div style={{ flex: 1, height: 1, backgroundColor: 'rgba(245,241,232,1)' }} />
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

  const PhotoSlot = () => (
    <div className="relative mb-8 overflow-hidden" style={{ aspectRatio: large ? '3/2' : '1/1', backgroundColor: 'rgba(245,241,232,0.04)', border: '1px solid rgba(245,241,232,0.08)' }}>
      {member.imageKey === 'founder' ? (
        <Image
          src="/images/founder/Portrait.PNG"
          alt={member.name}
          fill
          className="object-cover object-top"
          sizes={large ? '(max-width: 768px) 100vw, 60vw' : '300px'}
          style={{ filter: 'grayscale(100%)' }}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" width={20} height={20} style={{ opacity: 0.15 }}>
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <p className="font-sans text-label" style={{ fontSize: 9, opacity: 0.18, letterSpacing: '0.1em' }}>Photo coming soon</p>
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
      <p className="font-display mb-1" style={{ fontSize: large ? 'clamp(1.25rem, 2vw, 1.75rem)' : '1.125rem' }}>{member.name}</p>
      <p className="font-sans text-label uppercase tracking-[0.14em] mb-5" style={{ opacity: 0.32 }}>{member.role}</p>
      <p className="font-sans leading-[1.75]" style={{ fontSize: large ? '0.9375rem' : '0.8125rem', opacity: 0.45 }}>{member.bio}</p>
    </motion.div>
  )
}

function TeamGrid({ members }: { members: InvestorContent['team']['members'] }) {
  const founder = members.find(m => m.imageKey === 'founder')!
  const cofounders = members.filter(m => m.imageKey === 'benjamin' || m.imageKey === 'othman')
  const cgo = members.find(m => m.imageKey === 'matthew')!

  return (
    <div className="mt-16" style={{ borderTop: INV_BORDER }}>
      {/* Row 1 — Founder (larger, full-width card) */}
      <div className="grid grid-cols-1" style={{ gap: 1, backgroundColor: 'rgba(245,241,232,0.1)', marginBottom: 1 }}>
        <TeamMemberCard member={founder} i={0} large />
      </div>
      {/* Row 2 — Cofounders */}
      <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 1, backgroundColor: 'rgba(245,241,232,0.1)', marginBottom: 1 }}>
        {cofounders.map((m, i) => <TeamMemberCard key={m.name} member={m} i={i + 1} />)}
      </div>
      {/* Row 3 — CGO */}
      <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 1, backgroundColor: 'rgba(245,241,232,0.1)' }}>
        <TeamMemberCard member={cgo} i={3} />
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

function LabVideo() {
  const ref = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)

  const play = () => { ref.current?.play(); setPlaying(true) }
  const pause = () => { ref.current?.pause(); setPlaying(false) }

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ aspectRatio: '16/9', cursor: playing ? 'default' : 'pointer', backgroundColor: 'rgba(128,128,128,0.05)' }}
      onMouseEnter={play}
      onMouseLeave={pause}
      onClick={() => playing ? pause() : play()}
    >
      <video
        ref={ref}
        src="/videos/numu_timelapse.mp4"
        poster="/images/products/biofoam_detail.png"
        muted
        loop
        playsInline
        className="w-full h-full object-cover block"
        suppressHydrationWarning
      />
      {/* Play overlay — hidden when playing */}
      <div
        style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12,
          opacity: playing ? 0 : 1, transition: 'opacity 0.3s',
          pointerEvents: 'none',
        }}
      >
        <div style={{ width: 56, height: 56, borderRadius: '50%', border: '1px solid rgba(26,23,20,0.35)', backgroundColor: 'rgba(255,252,245,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="14" height="16" viewBox="0 0 14 16" fill="none" style={{ marginLeft: 3 }}>
            <path d="M1 1L13 8L1 15Z" fill="rgba(26,23,20,0.8)" />
          </svg>
        </div>
        <p className="font-sans uppercase tracking-[0.18em]" style={{ fontSize: '0.5625rem', opacity: 0.45 }}>
          Hover to play · ~2 min
        </p>
      </div>
    </div>
  )
}

// ─── Explore CTA ──────────────────────────────────────────────────────────────

function ExploreCTA() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    window.location.href = `mailto:andy@numu.bio?subject=Sample Request&body=From: ${encodeURIComponent(email)}%0A%0AI would like to request samples of NUMU Biofoam.`
    setSent(true)
  }

  return (
    <VSection id="specify">
      <VLabel text="Specify NUMU" />
      <h2 className="font-display mb-8" style={{ fontSize: 'clamp(2rem, 4vw, 5rem)', lineHeight: '0.96', letterSpacing: '-0.04em' }}>
        Bring Biofoam into your project.
      </h2>
      <p className="font-sans leading-[1.75] max-w-xl mb-14" style={{ fontSize: '1rem', opacity: 0.55 }}>
        Samples, specification sheets, and project conversations for architects, interior designers, and fit-out teams. Based in Dubai. Delivering regionally.
      </p>
      {sent ? (
        <p className="font-sans uppercase tracking-[0.16em]" style={{ fontSize: 12, opacity: 0.55 }}>Opening your email client — we'll be in touch.</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg">
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="font-sans flex-1 px-5 py-4 bg-transparent"
            style={{
              border: BORDER, outline: 'none', fontSize: '0.875rem', opacity: 0.75,
              color: 'inherit',
            }}
          />
          <button
            type="submit"
            className="font-sans uppercase tracking-[0.14em] px-7 py-4 flex-shrink-0"
            style={{
              border: '1px solid rgba(26,23,20,0.55)',
              backgroundColor: 'rgba(26,23,20,0.07)',
              fontSize: '0.75rem',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
          >
            Request samples →
          </button>
        </form>
      )}
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

function VisitorView({ v }: { v: VisitorContent }) {
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
              NUMU operates a bio-composites platform built for the GCC. A single material system, Biofoam, is tuned across density, porosity, and form to serve multiple construction applications from shared production infrastructure.
            </p>
            <p className="font-sans leading-[1.75] max-w-md" style={{ fontSize: '0.9375rem', opacity: 0.5 }}>
              The platform runs two processes. Grown Biofoam is cultivated inside proprietary molds over a controlled growth cycle, producing panels with distinctive texture and three-dimensional form. Pressed Biofoam is formed from spent mushroom substrate, heat-pressed into flat boards in short cycles. Same material logic, two production routes, four revenue lines.
            </p>
          </div>
          <div className="relative overflow-hidden">
            <video src="/videos/numu_timelapse.mp4" poster="/images/products/biofoam_detail.png" autoPlay muted loop playsInline className="w-full block" suppressHydrationWarning />
            <div className="absolute bottom-0 left-0 right-0 z-10 flex flex-col items-start px-8 pb-8" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%)', paddingTop: 100 }}>
              <p className="font-display text-white mb-2" style={{ fontSize: 'clamp(1.25rem, 2.5vw, 2rem)' }}>Material in motion</p>
              <p className="font-sans text-white" style={{ fontSize: '0.8125rem', opacity: 0.6, lineHeight: 1.6, maxWidth: 340 }}>
                A material grown over time — not manufactured. From agricultural fibres to structural form, the process unfolds through controlled biological growth over 5–7 days.
              </p>
            </div>
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
                Biofoam — grown, not manufactured.
              </h2>
              <p className="font-sans leading-[1.75] mb-5" style={{ fontSize: '1rem', opacity: 0.65 }}>
                Biofoam is NUMU&apos;s core material system. Mycelium acts as a natural binding network around regional agricultural residues, producing a lightweight composite that is rigid, breathable, sound-absorbent, and home-compostable at end of life. No binders. No petroleum. No synthetic residue.
              </p>
              <p className="font-sans leading-[1.75]" style={{ fontSize: '0.9375rem', opacity: 0.5 }}>
                Properties are engineered into the growth process itself. The same material can be tuned for dense acoustic cores, open-celled thermal matrices, or structural pressed board — one material system, multiple applications.
              </p>
            </div>
            <div className="mt-auto pt-12" style={{ borderTop: '1px solid rgba(128,128,128,0.1)', marginTop: 'auto' }}>
              <p className="font-sans uppercase tracking-[0.16em] mb-5" style={{ fontSize: 9, opacity: 0.35 }}>
                Substrate inputs — regional agricultural residues
              </p>
              <div className="grid grid-cols-2 gap-4 mb-12">
                {[
                  { src: '/images/materials/palm_leaf_substrate.png', alt: 'Palm leaf agricultural substrate from UAE date palm pruning waste', label: 'Palm leaf fibre', desc: 'UAE date palm pruning waste, the region\'s largest agricultural residue stream.' },
                  { src: '/images/materials/plant_fiber_substrate.png', alt: 'Plant fibre blend — mixed agricultural by-products', label: 'Plant fibre blend', desc: 'Mixed agricultural by-products sourced regionally.' },
                ].map(img => (
                  <div key={img.label}>
                    <div className="relative w-full mb-3" style={{ aspectRatio: '3/2' }}>
                      <Image src={img.src} alt={img.alt} fill unoptimized className="object-contain object-center" sizes="(max-width: 1024px) 50vw, 25vw" />
                    </div>
                    <p className="font-sans mb-1" style={{ fontSize: 11, opacity: 0.55, letterSpacing: '0.04em' }}>{img.label}</p>
                    <p className="font-sans leading-snug" style={{ fontSize: 10, opacity: 0.32 }}>{img.desc}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-start gap-3 p-4" style={{ border: '1px solid rgba(128,128,128,0.1)', backgroundColor: 'rgba(128,128,128,0.03)' }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: 'rgba(26,23,20,0.4)', flexShrink: 0, marginTop: 5 }} />
                <div>
                  <p className="font-sans mb-1" style={{ fontSize: 11, opacity: 0.55, letterSpacing: '0.04em' }}>Spent mushroom substrate (SMS)</p>
                  <p className="font-sans leading-snug" style={{ fontSize: 10, opacity: 0.32 }}>A waste stream already generated by regional commercial mushroom farms. Near-zero feedstock cost. Powers the pressed board production line.</p>
                </div>
              </div>
            </div>
            {/* Production routes */}
            <div className="pt-12 mt-12" style={{ borderTop: '1px solid rgba(128,128,128,0.1)' }}>
              <p className="font-sans uppercase tracking-[0.16em] mb-6" style={{ fontSize: 9, opacity: 0.35 }}>
                Production routes
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5" style={{ border: '1px solid rgba(128,128,128,0.14)' }}>
                  <p className="font-sans uppercase tracking-[0.14em] mb-3" style={{ fontSize: 10, opacity: 0.45 }}>Grown</p>
                  <p className="font-sans leading-[1.7] mb-4" style={{ fontSize: '0.875rem', opacity: 0.6 }}>
                    Mycelium cultivated inside proprietary molds over a controlled growth cycle, then heat-stabilized into a finished form. Produces distinctive surface texture and complex three-dimensional form factors.
                  </p>
                  <p className="font-sans" style={{ fontSize: 10, opacity: 0.35, letterSpacing: '0.04em' }}>Used in: Acoustic panels, architectural surface.</p>
                </div>
                <div className="p-5" style={{ border: '1px solid rgba(128,128,128,0.14)' }}>
                  <p className="font-sans uppercase tracking-[0.14em] mb-3" style={{ fontSize: 10, opacity: 0.45 }}>Pressed</p>
                  <div className="relative w-full mb-4 overflow-hidden" style={{ aspectRatio: '16/9' }}>
                    <Image src="/images/applications/event_board.png" alt="NUMU pressed mycelium board — heat-pressed composite from spent mushroom substrate" fill className="object-cover object-center" sizes="(max-width: 1024px) 100vw, 25vw" />
                  </div>
                  <p className="font-sans leading-[1.7] mb-4" style={{ fontSize: '0.875rem', opacity: 0.6 }}>
                    Spent mycelium biomass shredded and heat-pressed directly into flat board formats. Minutes of press time rather than weeks of cultivation.
                  </p>
                  <p className="font-sans" style={{ fontSize: 10, opacity: 0.35, letterSpacing: '0.04em' }}>Used in: Event structures, temporary architecture, pressed board applications.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden aspect-[3/4] lg:aspect-auto">
            <Image src="/images/products/biofoam_detail.png" alt="NUMU biofoam — material study" fill className="object-cover object-center" sizes="(max-width: 1024px) 100vw, 50vw" />
          </div>
        </div>
      </VSection>

      {/* Applications */}
      <VSection id="applications">
        <VLabel text="The Platform" />
        <VHeading text="One material platform, many applications." />
        <p className="font-sans leading-[1.75] mb-3 max-w-2xl" style={{ fontSize: '1rem', opacity: 0.58 }}>
          Acoustic panels are the entry product. The platform expands across four revenue lines, each running on the same material system and the same production infrastructure.
        </p>
        <p className="font-sans leading-[1.75] mb-14 max-w-2xl" style={{ fontSize: '0.9375rem', opacity: 0.38 }}>
          Grown Biofoam enters the market through decorative acoustic panels, scales through certified architectural specification, and extends into thermal wall assemblies. Pressed Biofoam serves events, brand activations, and non-structural interior applications, with scalable throughput on a separate production line. Packaging and regional licensing open in phase two.
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
                <p className="font-sans leading-relaxed" style={{ fontSize: 13, opacity: app.active ? 0.48 : 0.32 }}>{app.tagline}</p>
              </div>
            </div>
          ))}
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
              <video src="/videos/numu_story.mp4" poster="/images/products/fold_hero_interior.png" autoPlay muted loop playsInline className="w-full h-full object-cover block" suppressHydrationWarning />
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
              { field: 'Panel dimensions', value: '400mm × 400mm × 25mm (standard)' },
              { field: 'Weight', value: 'Approx. 1.8–2.2 kg/m²' },
              { field: 'Acoustic performance', value: 'NRC rating — in certification' },
              { field: 'Fire performance', value: 'ASTM E84 Class A target — in certification' },
              { field: 'Installation', value: 'Concealed adhesive mount or mechanical fixing' },
              { field: 'Finish', value: 'Natural Biofoam surface, raw or sealed' },
              { field: 'Lead time', value: '6–8 weeks from order' },
              { field: 'Origin', value: 'Manufactured in Dubai, UAE' },
            ].map(spec => (
              <div key={spec.field} className="px-6 py-7" style={{ backgroundColor: 'rgba(26,23,20,0.03)' }}>
                <p className="font-sans uppercase tracking-[0.14em] mb-2" style={{ fontSize: '0.5625rem', opacity: 0.35 }}>{spec.field}</p>
                <p className="font-sans" style={{ fontSize: '0.875rem', opacity: 0.72 }}>{spec.value}</p>
              </div>
            ))}
          </div>
        </div>
      </VSection>

      {/* Thermal application detail */}
      <section id="thermal" className="px-6 md:px-12 py-24 md:py-32" style={{ borderTop: BORDER }}>
        <div className="max-w-[1440px] mx-auto">
          <p className="font-sans uppercase tracking-[0.18em] mb-10" style={{ fontSize: '0.6875rem', opacity: 0.5 }}>Applications — Thermal</p>
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-20 items-start">
            <div className="w-full overflow-hidden">
              <Image src="/images/applications/thermal_panel_wall.png" alt="NUMU thermal panel — wall integration" width={2400} height={1350} style={{ width: '100%', height: 'auto', display: 'block' }} sizes="(max-width: 1440px) 100vw, 60vw" />
            </div>
            <div className="lg:pt-4">
              <p className="font-display mb-6" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.75rem)', lineHeight: '1.1', letterSpacing: '-0.025em', opacity: 0.8 }}>
                Bio-based thermal systems.
              </p>
              <p className="font-sans leading-[1.75] mb-4" style={{ fontSize: '0.9375rem', opacity: 0.48 }}>
                NUMU materials can be integrated within wall assemblies to provide passive thermal performance. The porous structure of the material enables insulation while remaining breathable.
              </p>
              <p className="font-sans leading-[1.75] mb-4" style={{ fontSize: '0.9375rem', opacity: 0.48 }}>
                Designed for hot climates, the system supports reduced energy demand and improved indoor comfort without synthetic foams.
              </p>
              <p className="font-sans uppercase tracking-[0.16em] mt-8" style={{ fontSize: 10, opacity: 0.28 }}>
                Currently in development — NUMU material platform
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Packaging application detail */}
      <section id="packaging" className="px-6 md:px-12 py-24 md:py-32" style={{ borderTop: BORDER }}>
        <div className="max-w-[1440px] mx-auto">
          <p className="font-sans uppercase tracking-[0.18em] mb-10" style={{ fontSize: '0.6875rem', opacity: 0.5 }}>Applications — Packaging</p>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-20 items-start">
            <div className="lg:pt-4">
              <p className="font-display mb-6" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.75rem)', lineHeight: '1.1', letterSpacing: '-0.025em', opacity: 0.8 }}>
                Molded protection, grown not manufactured.
              </p>
              <p className="font-sans leading-[1.75] mb-4" style={{ fontSize: '0.9375rem', opacity: 0.48 }}>
                NUMU materials can be shaped into protective packaging forms, offering a compostable alternative to petroleum-based foams.
              </p>
              <p className="font-sans leading-[1.75] mb-4" style={{ fontSize: '0.9375rem', opacity: 0.48 }}>
                Each piece is grown into shape, reducing waste while maintaining shock absorption and structural integrity.
              </p>
              <p className="font-sans uppercase tracking-[0.16em] mt-8" style={{ fontSize: 10, opacity: 0.28 }}>
                Scalable application — logistics and product protection
              </p>
              <p className="font-sans uppercase tracking-[0.16em] mt-3" style={{ fontSize: 10, opacity: 0.22 }}>
                European pathway — partnership under Biomyc LOI
              </p>
            </div>
            <div className="w-full overflow-hidden" style={{ position: 'relative', aspectRatio: '3/4' }}>
              <Image src="/images/applications/packaging_protective.png" alt="NUMU protective packaging — molded form" fill className="object-cover object-center" sizes="(max-width: 1024px) 100vw, 50vw" />
            </div>
          </div>
        </div>
      </section>

      {/* 04 Process */}
      <section id="process" className="px-6 md:px-12 py-24 md:py-32" style={{ borderTop: BORDER }}>
        <div className="max-w-[1440px] mx-auto">
          <VLabel text={v.process.label} />
          <VHeading text={v.process.heading} />
          <div className="mt-8 max-w-[820px] mx-auto">
            <ProcessDiagram />
          </div>
        </div>
      </section>

      {/* Production feature */}
      <ProductionFeature />

      {/* Lab Process Feature */}
      <section id="lab" className="px-6 md:px-12 py-24 md:py-32" style={{ borderTop: BORDER }}>
        <div className="max-w-[1440px] mx-auto">
          <p className="font-sans uppercase tracking-[0.18em] mb-10" style={{ fontSize: '0.6875rem', opacity: 0.5 }}>Production lab — Dubai</p>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-20 items-start">
            <div>
              <h2 className="font-display mb-8" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: 1.05, letterSpacing: '-0.03em' }}>
                The process, documented.
              </h2>
              <p className="font-sans leading-[1.75] mb-4" style={{ fontSize: '0.9375rem', opacity: 0.55 }}>
                Biofoam is produced in a lab operational in Dubai since 2025. The video shows actual production: substrate preparation, mycelium inoculation, growth cycle, stabilization, and finishing. No renders, no simulations. Real conditions, regional feedstock, repeatable process.
              </p>
              <p className="font-sans uppercase tracking-[0.16em] mt-8" style={{ fontSize: 10, opacity: 0.28 }}>
                Duration — approx. 2 min
              </p>
            </div>
            <div>
              <LabVideo />
              <p className="font-sans uppercase tracking-[0.14em] mt-3" style={{ fontSize: 9, opacity: 0.28 }}>
                Lab footage, Dubai, 2025–2026. Unedited sequence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process carousel */}
      <ProcessCarousel />

      {/* Manifesto */}
      <section id="manifesto" className="px-6 md:px-12 py-24 md:py-32" style={{ borderTop: BORDER }}>
        <div className="max-w-[1440px] mx-auto">
          <p className="font-sans uppercase tracking-[0.18em] mb-16" style={{ fontSize: '0.6875rem', opacity: 0.35 }}>Manifesto</p>
          <h2 className="font-sans uppercase tracking-[0.14em] mb-14" style={{ fontSize: '0.6875rem', opacity: 0.4 }}>What we believe.</h2>
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

      {/* Installations */}
      <VSection id="installations">
        <VLabel text="Installations" />
        <VHeading text="Two installations. Real conditions." />
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              project: 'Beyond Chrysant',
              location: 'Netherlands — 2022',
              caption: 'Project photography in archive retrieval. Interim render shown.',
              brief: 'Mycelium acoustic installation — private residential interior, Netherlands 2022. Archive retrieval in progress.',
            },
            {
              project: 'KAVE',
              location: 'Dubai, UAE — 2025',
              caption: 'Documentation in progress. Interim render shown.',
              brief: 'FOLD acoustic panel installation — KAVE, Dubai 2025. Photography session scheduled.',
            },
          ].map(inst => (
            <div key={inst.project}>
              <div className="mb-3">
                <ImagePlaceholder aspect="16:9" brief={inst.brief} label={inst.caption} />
              </div>
              <VLabel text={inst.location} />
              <p className="font-display text-xl md:text-2xl mt-1">{inst.project}</p>
            </div>
          ))}
        </div>
      </VSection>

      {/* Specify NUMU CTA */}
      <ExploreCTA />

      {/* 06 Founder */}
      <VSection id="founder">
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-16 lg:gap-20 items-start">
          <div className="relative overflow-hidden" style={{ aspectRatio: '3/4' }}>
            <Image src="/images/founder/Portrait.PNG" alt="NUMU Founder" fill className="object-cover object-top" sizes="(max-width: 1024px) 100vw, 55vw" />
          </div>
          <div className="lg:pt-4 flex flex-col justify-between h-full">
            <div>
              <VLabel text={v.founder.label} />
              <VHeading text={v.founder.heading} />
              <VBody text={v.founder.body} />
            </div>
            <div className="pt-8 mt-auto" style={{ borderTop: BORDER }}>
              <VLabel text={v.founder.role} />
            </div>
          </div>
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
          <Image src="/branding/logo-black-numu.png" alt="NUMU" width={120} height={48} className="h-10 w-auto object-contain" style={{ opacity: 0.18 }} />
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
      {/* 01 Problem — Three Forces */}
      <ISection id="forces">
        <ILabel text={iv.forces.label} />
        <IHeading text={iv.forces.heading} />
        <ThreeForces forces={iv.forces} />
        <InvestorMetricsStrip />
      </ISection>

      {/* 02 Platform */}
      <ISection id="platform">
        <ILabel text={iv.platform.label} />
        <IHeading text={iv.platform.heading} />
        <IBody text={iv.platform.body} />
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

      {/* 04 Market */}
      <ISection id="market">
        <ILabel text={iv.market.label} />
        <IHeading text={iv.market.heading} />
        <IBody text={iv.market.body} />
        <MarketTAMDiagram />
      </ISection>

      {/* 07 Why NUMU Survives */}
      <ISection id="why-it-survives">
        <ILabel text="07 — Why It Survives" />
        <IHeading text="NUMU is structured against the failure pattern." />
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
            &ldquo;Specialty first. Margin first. Licensing scale later. The exact inverse of every failed player.&rdquo;
          </p>
        </motion.div>
        <div className="mt-8 max-w-3xl space-y-0">
          <p className="font-sans text-base md:text-lg leading-[1.85] pb-8" style={{ opacity: 0.65, borderBottom: INV_BORDER_SUBTLE }}>
            The mycelium materials sector has two patterns. One failed publicly. Bolt Threads, MycoWorks, and other venture-capital-funded biomaterials ventures collapsed after attempting industrial-scale vertical integration against single-product dependency. The other persisted quietly. Ecovative, Mogu, and Grown.bio operate profitably in Europe and the US, scaled deliberately through specialty production, diversified revenue, and licensing rather than owned industrial capex.
          </p>
          <p className="font-sans text-base md:text-lg leading-[1.85] py-8" style={{ opacity: 0.65, borderBottom: INV_BORDER_SUBTLE }}>
            NUMU is <em style={{ fontStyle: 'italic', color: ACCENT }}>structured against the failed pattern</em>, explicitly. Specialty-scale production, not industrial-scale vertical integration. Performance-led pricing, not sustainability premium. Four revenue engines on shared infrastructure, not a single-product bet. Licensing pathway to Year 3+ scale, not proportional capex.
          </p>
          <p className="font-sans text-base md:text-lg leading-[1.85] pt-8" style={{ opacity: 0.65 }}>
            The AED 2.2M raise funds an 18-month path to certified specification revenue and the operational foundation for regional licensing. It does not attempt to build a billion-dollar industrial facility on seed capital. That is the failure mode. NUMU is designed around it.
          </p>
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

      {/* 08 Traction */}
      <ISection id="traction">
        <ILabel text={iv.traction.label} />
        <IHeading text={iv.traction.heading} />
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
              <p className="font-sans text-label uppercase tracking-[0.14em] mt-1" style={{ opacity: 0.32, fontSize: '0.5625rem' }}>{s.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-14 pl-5" style={{ borderTop: INV_BORDER, borderLeft: '2px solid rgba(245,241,232,0.18)' }}>
          {iv.traction.items.map((item, i) => (
            <div key={item} className="flex items-start gap-5 py-5" style={{ borderBottom: i < iv.traction.items.length - 1 ? INV_BORDER_SUBTLE : 'none', lineHeight: 2 }}>
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" width={16} height={16} className="flex-shrink-0 mt-2" style={{ opacity: 0.6 }}>
                <polyline points="2,8 6,12 14,4" />
              </svg>
              <p className="font-sans text-base md:text-lg leading-snug" style={{ opacity: 0.78 }}>{item}</p>
            </div>
          ))}
        </div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6" style={{ borderTop: INV_BORDER, paddingTop: 48 }}>
          {[
            { project: 'Beyond Chrysant', location: 'Netherlands — 2022', caption: 'Project photography in archive retrieval. Interim render shown.' },
            { project: 'KAVE', location: 'Dubai, UAE — 2025', caption: 'Documentation in progress. Interim render shown.' },
          ].map(inst => (
            <div key={inst.project}>
              <div className="relative w-full mb-3 overflow-hidden" style={{ aspectRatio: '16/9' }}>
                <Image
                  src="/images/products/fold_context_scale.png"
                  alt={`FOLD — interim render, ${inst.project} installation`}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <p className="font-sans uppercase tracking-[0.14em] mb-4" style={{ fontSize: 9, opacity: 0.28 }}>
                {inst.caption}
              </p>
              <ILabel text={inst.location} />
              <p className="font-display text-lg md:text-xl">{inst.project}</p>
            </div>
          ))}
        </div>
      </ISection>

      {/* 09 Founder Credibility */}
      <ISection id="founder-credibility">
        <ILabel text="09 — Founder" />
        <IHeading text="Not a research project. An operator." />
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-px" style={{ backgroundColor: 'rgba(245,241,232,0.1)' }}>
          {[
            { num: '7', unit: 'YEARS', label: 'Operational mycelium industrialization, Europe and Middle East' },
            { num: '2', unit: 'PATENTS', label: 'Process-level IP (Belgium)' },
            { num: '1', unit: 'BOOK', label: 'Designing Mycelium, Routledge 2024' },
            { num: '2', unit: 'INSTALLATIONS', label: 'Real conditions, documented (Netherlands 2022, Dubai 2025)' },
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
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-10 items-start" style={{ borderTop: INV_BORDER, paddingTop: 48 }}>
          <div className="relative overflow-hidden" style={{ aspectRatio: '3/4', backgroundColor: 'rgba(245,241,232,0.04)', border: '1px solid rgba(245,241,232,0.08)' }}>
            <Image
              src="/images/founder/Portrait.PNG"
              alt="Andy Cartier — NUMU founder, Dubai lab"
              fill
              className="object-cover object-top"
              sizes="(max-width: 1024px) 100vw, 45vw"
              style={{ filter: 'grayscale(100%)' }}
            />
          </div>
          <div>
            <p className="font-sans text-base md:text-lg leading-[1.8]" style={{ opacity: 0.6 }}>
              Andy Cartier compressed the lab-to-production gap across two continents before founding NUMU. Operational knowledge, not research aspiration. Two built installations, not prototypes. Published technical work in the Routledge reference volume for mycelium-based material design. A no-mold growth technique developed in-house and applied commercially.
            </p>
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
            { label: 'Amount', value: 'AED 2.2M / USD 600K' },
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
    <div style={{ backgroundColor: theme.bg, color: theme.fg, minHeight: '100vh', transition: 'background-color 0.6s cubic-bezier(0.25,0,0.2,1), color 0.6s cubic-bezier(0.25,0,0.2,1)' }}>

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
          style={isInvestor ? { filter: 'brightness(0) invert(1) sepia(1) saturate(0) brightness(0.92)' } : {}}
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
      <section className="flex flex-col items-center justify-center text-center px-6" style={{ height: '100vh', minHeight: 600 }}>
        <h1 className="font-display" style={{ fontSize: 'var(--hero-size)', lineHeight: 'var(--hero-lh)', letterSpacing: '-0.04em' }}>NUMU</h1>
        <p lang="ar" className="font-display mt-4" style={{ fontSize: 'clamp(1.5rem, 4vw, 3.5rem)', lineHeight: 1.1, opacity: 0.38, letterSpacing: '0.02em' }}>نُمُوّ</p>
        <p className="font-sans mt-5 uppercase tracking-[0.18em]" style={{ fontSize: '0.625rem', opacity: 0.32 }}>
          UAE — Bio-composites platform
        </p>
        <p className="font-sans mt-6" style={{ fontSize: 'clamp(0.8125rem, 1vw, 0.9375rem)', opacity: 0.4, letterSpacing: '0.06em', lineHeight: 1.7 }}>
          Grown, not manufactured.
        </p>
      </section>

      {/* Hero 2 — product with 3D panel */}
      <section
        className="relative flex flex-col items-center justify-end px-6 pb-20 text-center"
        style={{ height: '100vh', minHeight: 600, borderTop: BORDER }}
      >
        {/* 3D rotating panel — centered absolutely */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ width: '130vmin', height: '130vmin', maxWidth: 1200, maxHeight: 1200, position: 'relative' }}>
            {/* Dark radial backdrop — makes normalmap shadows visible on light background */}
            {!isInvestor && (
              <div style={{
                position: 'absolute', inset: 0, zIndex: 0, borderRadius: '50%',
                background: 'radial-gradient(ellipse 80% 75% at 50% 50%, rgba(18,12,8,0.42) 0%, transparent 68%)',
                pointerEvents: 'none',
              }} />
            )}
            <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%' }}>
              <PanelViewer isInvestor={isInvestor} />
            </div>
          </div>
        </div>
        <div className="relative w-full max-w-[1440px] mx-auto" style={{ zIndex: 2 }}>
          <p className="font-sans uppercase tracking-[0.18em] mb-6" style={{ opacity: 0.38, fontSize: '0.6875rem' }}>
            {isInvestor ? investor.hero.sublabel : visitor.hero.sublabel}
          </p>
          {(isInvestor ? investor.hero.lines : visitor.hero.lines).map((line, i) => (
            <h2 key={i} className="font-display block" style={{ fontSize: 'var(--hero-size)', lineHeight: 'var(--hero-lh)' }}>{line}</h2>
          ))}
          <div className="mt-10 pt-8 flex flex-col items-center" style={{ borderTop: BORDER }}>
            <p className="font-sans text-label uppercase tracking-[0.14em] mb-8" style={{ opacity: 0.38 }}>
              {isInvestor ? investor.hero.meta : visitor.hero.meta}
            </p>
            <a
              href={isInvestor ? investor.hero.cta.href : visitor.hero.cta.href}
              className="font-sans text-label uppercase tracking-[0.14em] px-6 py-3.5 border inline-block"
              style={{ borderColor: 'rgba(128,128,128,0.4)', transition: 'border-color 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = isInvestor ? 'rgba(245,241,232,0.7)' : 'rgba(26,23,20,0.6)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(128,128,128,0.4)' }}
            >
              {isInvestor ? investor.hero.cta.label : visitor.hero.cta.label} ↓
            </a>
          </div>
        </div>
      </section>

      {/* Page content */}
      <div style={{ opacity: transitioning ? 0 : 1, transition: 'opacity 0.35s cubic-bezier(0.25,0,0.2,1)' }}>
        {isInvestor ? <InvestorView iv={investor} /> : <VisitorView v={visitor} />}
      </div>

    </div>
  )
}
