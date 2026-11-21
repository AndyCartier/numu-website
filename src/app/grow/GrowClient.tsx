'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'

const CHARCOAL = '#1A1714'
const CREAM = '#F5F1E8'
const WARM_MID = '#B29B7F'
const WARM_DARK = '#4A3F34'
const BORDER = '1px solid rgba(26,23,20,0.16)'
const HERO_SRC = '/images/grow/mycelium-collection-floor-concept.jpg'
const EXAMPLE_SRC = '/images/grow/mycelium-coffee-insert-concept.jpg'
const EASE = [0.22, 1, 0.36, 1] as const

// Film grain as an inline SVG (data: images are allowed by the site's CSP).
const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.1 0 0 0 0 0.09 0 0 0 0 0.08 0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")"

const QUESTIONS = [
  'Does this product ship or sit in a foam or plastic protective insert today?',
  'Is the insert there only to hold and protect the product in transport or on display?',
  'Is the product’s shape fairly simple: a bottle, jar, box or tin, not a fragile tangle of parts?',
  'Is the product stored and displayed indoors?',
  'Is there a line where a small first run makes sense: a launch, gift set, seasonal or limited edition?',
  'Do you know roughly what today’s insert weighs, or could you weigh one this week?',
  'Would a material grown in the UAE from local agricultural waste add to this product’s story?',
  'Does your team have a plastic-reduction or sustainability goal this product could count towards?',
  'Is there one named person who could approve a small paid prototype?',
  'Can this product wait 4 to 5 weeks for a made-to-order prototype?',
]

const FIT_SIGNALS = [
  'It uses a foam or plastic insert today, so there is something to replace.',
  'The insert only holds and protects the product.',
  'Its shape is simple enough for a fitted recess.',
  'It is stored and displayed indoors.',
  'A small first run fits a launch, gift set or limited edition.',
  'The team knows today’s insert weight, so a result can be measured.',
  'A material grown in the UAE would add to the product’s story.',
  'There is a plastic-reduction goal it could count towards.',
  'One person can approve a small paid prototype.',
  'The timeline allows a 4 to 5 week prototype.',
]

const GAPS = [
  { unknown: 'Whether today’s insert is foam or plastic.', step: 'Pick a product that uses a foam or plastic insert today.' },
  { unknown: 'Whether the insert only protects the product.', step: 'Pick a product whose insert only holds and protects it.' },
  { unknown: 'Whether the shape suits a fitted recess.', step: 'Try a product with a simpler shape: a bottle, jar, box or tin.' },
  { unknown: 'Where the product is stored and displayed.', step: 'Pick a product that is stored and displayed indoors.' },
  { unknown: 'Which line could take a small first run.', step: 'Look for a launch, gift set or limited edition where a small first run fits.' },
  { unknown: 'The weight of the current insert.', step: 'Weigh one empty insert so the team has a baseline for comparison.' },
  { unknown: 'Whether a UAE-grown story fits the brand.', step: 'Ask the brand team whether a UAE-grown material fits this product’s story.' },
  { unknown: 'Whether a plastic-reduction goal applies.', step: 'Check whether this product could count towards a plastic-reduction goal.' },
  { unknown: 'Who could approve a small paid prototype.', step: 'Name one person who could approve a small paid prototype.' },
  { unknown: 'Whether the timeline allows 4 to 5 weeks.', step: 'Check the launch date: a made-to-order prototype takes 4 to 5 weeks.' },
]

const SIGNAL_PRIORITY = [4, 6, 7, 0, 2, 5, 8, 1, 3, 9]
const GAP_PRIORITY = [5, 8, 9, 1, 0, 2, 3, 4, 7, 6]

const BANDS = [
  { min: 7, label: 'Ready to grow', text: 'A strong first candidate. Weigh today’s insert, name the owner, and request a sample box.' },
  { min: 4, label: 'Sprouting', text: 'Promising. Turn your “no” answers into “yes” first, starting with the most important unknown in your brief.' },
  { min: 0, label: 'Still in the cupboard', text: 'Not the right first product. Try the test again with a gift set or a limited edition, where a small first run is easier.' },
]

const HOTSPOTS = [
  { id: 'edge', x: 19.5, y: 47.5, title: 'The fibrous edge', text: 'PALMYCO is regional plant fibre bound by mycelium. This is the surface your team would touch in a sample box.' },
  { id: 'recess', x: 49.5, y: 48, title: 'The fitted recess', text: 'In this concept each recess follows its product: here, three jars sit apart in their own pockets.' },
] as const

const MARQUEE = ['Made in Dubai', 'Grown from regional agricultural waste', 'Shaped to fit one product', '5 free sample boxes a month', 'Prototype in 4 to 5 weeks']

type Phase = 'signup' | 'test' | 'result'
type Brief = { product: string; score: number; label: string; text: string; signal: string; unknown: string; step: string; timing: string | null }

// Without a foam or plastic insert today there is nothing to compare, whatever the score.
const NO_INSERT = {
  label: 'Choose another product',
  text: 'This guide compares a grown insert with a foam or plastic one. This product has no foam or plastic insert today, so choose another product for this comparison.',
}

function bandFor(score: number) {
  return BANDS.find(b => score >= b.min) ?? BANDS[2]
}

function buildBrief(product: string, answers: boolean[]): Brief {
  const score = answers.filter(Boolean).length
  const noInsert = answers[0] === false
  const signalIndex = SIGNAL_PRIORITY.find(i => answers[i])
  const gapIndex = noInsert ? 0 : GAP_PRIORITY.find(i => !answers[i])
  return {
    product: product || 'One product (not named)',
    score,
    label: noInsert ? NO_INSERT.label : bandFor(score).label,
    text: noInsert ? NO_INSERT.text : bandFor(score).text,
    signal: signalIndex !== undefined ? FIT_SIGNALS[signalIndex] : 'None yet: every answer was no.',
    unknown: gapIndex !== undefined ? GAPS[gapIndex].unknown : 'None from this test.',
    step: gapIndex !== undefined ? GAPS[gapIndex].step : 'Request a free sample box and weigh today’s insert.',
    timing: answers[9] === false ? 'A made-to-order prototype takes 4 to 5 weeks. Check this against your launch date.' : null,
  }
}

function briefText(b: Brief) {
  return [
    'Grown insert brief (NUMU · Can your packaging be grown?)',
    `Product: ${b.product}`,
    `Score: ${b.score} / 10 (${b.label})`,
    `Strongest fit signal: ${b.signal}`,
    `Most important unknown: ${b.unknown}`,
    `Next step: ${b.step}`,
    ...(b.timing ? [`Timing: ${b.timing}`] : []),
    'Offer: free sample box (5 a month); bespoke prototype for one product AED 500, credited in full against the first order (subject to production capacity).',
  ].join('\n')
}

/* ---------- Motion building blocks ---------- */

function ScrollHairline() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })
  return <motion.div className="fixed top-0 left-0 right-0 h-[2px] z-50 origin-left" style={{ scaleX, backgroundColor: WARM_DARK }} aria-hidden="true" />
}

function RevealWords({ text, className }: { text: string; className?: string }) {
  const reduce = useReducedMotion()
  const words = text.split(' ')
  return (
    <h1 className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.08em] -mb-[0.08em]" aria-hidden="true">
          <motion.span
            className="inline-block"
            initial={{ y: '105%' }}
            animate={{ y: '0%' }}
            transition={reduce ? { duration: 0 } : { duration: 0.9, delay: 0.15 + i * 0.08, ease: EASE }}
          >
            {w}{i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </h1>
  )
}

// Fine ivory threads that grow across the hero: the mycelium metaphor.
function MyceliumThreads() {
  const reduce = useReducedMotion()
  const paths = [
    'M-20 120 C 180 60, 320 220, 520 140 S 860 40, 1120 160 S 1400 260, 1500 180',
    'M-40 420 C 160 360, 300 520, 540 430 S 900 300, 1180 420 S 1420 520, 1520 470',
    'M120 -20 C 160 160, 60 300, 180 460 S 380 700, 300 900',
    'M1280 -30 C 1220 160, 1340 320, 1240 500 S 1120 760, 1220 920',
    'M-30 700 C 220 640, 380 780, 620 700 S 980 580, 1240 720 S 1440 820, 1510 760',
  ]
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {paths.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          fill="none"
          stroke={i % 2 ? WARM_MID : '#ffffff'}
          strokeOpacity={i % 2 ? 0.35 : 0.7}
          strokeWidth={1}
          strokeLinecap="round"
          initial={{ pathLength: reduce ? 1 : 0 }}
          animate={{ pathLength: 1 }}
          transition={reduce ? { duration: 0 } : { duration: 4.5 + i * 0.6, delay: 0.4 + i * 0.35, ease: 'easeInOut' }}
        />
      ))}
    </svg>
  )
}

function Marquee() {
  const reduce = useReducedMotion()
  const items = [...MARQUEE, ...MARQUEE]
  return (
    <div className="relative overflow-hidden py-4" style={{ borderTop: BORDER, borderBottom: BORDER }} aria-label={MARQUEE.join(', ')}>
      <motion.div
        className="flex gap-10 whitespace-nowrap w-max"
        animate={reduce ? undefined : { x: ['0%', '-50%'] }}
        transition={{ duration: 38, repeat: Infinity, ease: 'linear' }}
        aria-hidden="true"
      >
        {items.map((t, i) => (
          <span key={i} className="uppercase text-label tracking-[0.2em] flex items-center gap-10" style={{ opacity: 0.6 }}>
            {t}
            <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><circle cx="5" cy="5" r="2" fill={WARM_MID} /></svg>
          </span>
        ))}
      </motion.div>
    </div>
  )
}

function ArrowButton({ children, onClick, type = 'button', disabled, dark = true, className = '' }: {
  children: React.ReactNode; onClick?: () => void; type?: 'button' | 'submit'; disabled?: boolean; dark?: boolean; className?: string
}) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? undefined : { y: -2 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      className={`group relative overflow-hidden whitespace-nowrap justify-center uppercase tracking-[0.14em] text-xs px-7 py-4 inline-flex items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${className}`}
      style={dark ? { backgroundColor: CHARCOAL, color: CREAM, opacity: disabled ? 0.6 : 1 } : { border: BORDER, color: CHARCOAL }}
    >
      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" style={{ backgroundColor: dark ? WARM_DARK : 'rgba(178,155,127,0.18)' }} aria-hidden="true" />
      <span className="relative">{children}</span>
      <span className="relative transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">→</span>
    </motion.button>
  )
}

function TypedText({ text, start, delay = 0 }: { text: string; start: boolean; delay?: number }) {
  const reduce = useReducedMotion()
  const [n, setN] = useState(reduce ? text.length : 0)
  useEffect(() => {
    if (!start || reduce) { if (reduce) setN(text.length); return }
    let i = 0
    let id: ReturnType<typeof setInterval> | undefined
    const t = setTimeout(() => {
      id = setInterval(() => { i += 2; setN(Math.min(i, text.length)); if (i >= text.length && id) clearInterval(id) }, 22)
    }, delay)
    return () => { clearTimeout(t); if (id) clearInterval(id) }
  }, [start, text, delay, reduce])
  return (
    <span>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{text.slice(0, n)}{start && n < text.length ? <span style={{ opacity: 0.5 }}>|</span> : null}</span>
    </span>
  )
}

function BriefCard({ brief, example = false }: { brief: Brief | null; example?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15% 0px' })
  const reduce = useReducedMotion()
  const rows: [string, string][] = example
    ? [
        ['Why consider it?', 'One simple shape in a seasonal gift set.'],
        ['What is missing?', 'The weight of the current foam insert.'],
        ['First step', 'Weigh one empty insert so the team has a baseline for comparison.'],
      ]
    : brief
      ? [
          ['Product', brief.product],
          ['Score', `${brief.score} / 10 · ${brief.label}`],
          ['Strongest fit signal', brief.signal],
          ['Most important unknown', brief.unknown],
          ['Next step', brief.step],
          ...(brief.timing ? [['Timing', brief.timing] as [string, string]] : []),
        ]
      : []
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: reduce ? 0 : 0.7, ease: EASE }}
      className="relative p-6 md:p-8 shadow-[0_30px_60px_-30px_rgba(26,23,20,0.35)]"
      style={{ border: BORDER, backgroundColor: 'rgba(250,247,240,0.94)' }}
    >
      <div className="flex items-center justify-between mb-5">
        <p className="uppercase text-label tracking-[0.18em]" style={{ color: WARM_DARK }}>
          {example ? 'Example · coffee gift tin' : 'Your one-page brief'}
        </p>
        <span className="uppercase text-[0.6rem] tracking-[0.2em] px-2 py-1" style={{ border: BORDER, opacity: 0.6 }}>
          {example ? 'Sample' : 'Ready to share'}
        </span>
      </div>
      {example && (
        <div className="relative w-full aspect-[16/9] overflow-hidden mb-6" style={{ border: BORDER }}>
          <Image
            src={EXAMPLE_SRC}
            alt="Example product: a coffee tin in a fitted, fibrous insert inside a cardboard gift box"
            fill
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="object-cover object-[70%_50%]"
          />
          <span className="absolute left-2 bottom-2 uppercase text-[0.55rem] tracking-[0.18em] px-2 py-1" style={{ backgroundColor: 'rgba(245,241,232,0.92)' }}>
            AI concept illustration
          </span>
        </div>
      )}
      <dl className="space-y-4">
        {rows.map(([k, v], i) => (
          <motion.div
            key={k}
            initial={{ opacity: 0, x: -10 }}
            animate={inView ? { opacity: 1, x: 0 } : undefined}
            transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : 0.25 + i * 0.12, ease: EASE }}
            className="grid grid-cols-[9.5rem_1fr] gap-3 text-sm max-sm:grid-cols-1 max-sm:gap-0.5 pb-4"
            style={{ borderBottom: i < rows.length - 1 ? '1px dashed rgba(26,23,20,0.12)' : undefined }}
          >
            <dt className="uppercase text-label tracking-[0.14em] pt-0.5" style={{ opacity: 0.55 }}>{k}</dt>
            <dd style={{ lineHeight: 1.55 }}>{example ? <TypedText text={v} start={inView} delay={400 + i * 650} /> : v}</dd>
          </motion.div>
        ))}
      </dl>
    </motion.div>
  )
}

function MaterialImage() {
  const reduce = useReducedMotion()
  const [exploring, setExploring] = useState(false)
  const [active, setActive] = useState<(typeof HOTSPOTS)[number] | null>(null)
  const frameRef = useRef<HTMLDivElement>(null)

  // Gentle pointer tilt on devices with a fine pointer.
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const tiltX = useSpring(rx, { stiffness: 120, damping: 18 })
  const tiltY = useSpring(ry, { stiffness: 120, damping: 18 })

  // Parallax drift as the page scrolls.
  const { scrollYProgress } = useScroll({ target: frameRef, offset: ['start end', 'end start'] })
  const drift = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-2%', '2%'])

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' && new URLSearchParams(window.location.search).get('demo') === 'explore') {
      setExploring(true)
      setActive(HOTSPOTS[0])
    }
  }, [])

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduce || e.pointerType !== 'mouse' || active) return
    const r = e.currentTarget.getBoundingClientRect()
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 6)
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 6)
  }
  function onLeave() { rx.set(0); ry.set(0) }

  return (
    <figure className="relative w-full" style={{ perspective: 1200 }}>
      <motion.div
        ref={frameRef}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{ rotateX: tiltX, rotateY: tiltY, border: BORDER, WebkitTransformStyle: 'preserve-3d' }}
        className="relative w-full aspect-[16/9] overflow-hidden isolate shadow-[0_40px_80px_-40px_rgba(26,23,20,0.55)]"
      >
        <motion.div className="absolute -inset-[2.5%] z-0" style={{ y: drift }}>
          <motion.div
            className="absolute inset-0"
            animate={{ scale: active ? 2.3 : 1 }}
            transition={reduce ? { duration: 0 } : { duration: 1.1, ease: EASE }}
            style={{ transformOrigin: active ? `${active.x}% ${active.y}%` : '50% 50%' }}
          >
            <Image
              src={HERO_SRC}
              alt="A collection of products, including a bottle, jars, cups, a tin, a vase and a candle, each sitting in its own fitted, fibrous insert on a stone floor"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover object-center"
            />
          </motion.div>
        </motion.div>

        {/* Soft light that follows the zoom for depth */}
        <div className="pointer-events-none absolute inset-0 z-[1]" style={{ background: 'radial-gradient(120% 80% at 80% 10%, rgba(255,248,235,0.22), transparent 60%)' }} aria-hidden="true" />

        <AnimatePresence>
          {exploring && !active && HOTSPOTS.map((h, i) => (
            <motion.button
              key={h.id}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: reduce ? 0 : 0.35, delay: reduce ? 0 : i * 0.12 }}
              onClick={() => setActive(h)}
              className="absolute z-10 -ml-[22px] -mt-[22px] w-11 h-11 rounded-full flex items-center justify-center focus-visible:outline focus-visible:outline-2"
              style={{ left: `${h.x}%`, top: `${h.y}%`, backgroundColor: 'rgba(245,241,232,0.9)', border: `1px solid ${WARM_DARK}` }}
              aria-label={`Show ${h.title.toLowerCase()}`}
            >
              {!reduce && (
                <motion.span
                  className="absolute inset-0 rounded-full"
                  style={{ border: `1px solid ${CREAM}` }}
                  animate={{ scale: [1, 1.8], opacity: [0.9, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                />
              )}
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: WARM_DARK }} />
            </motion.button>
          ))}
        </AnimatePresence>

        <button
          onClick={() => { setExploring(!exploring); setActive(null) }}
          className="absolute z-20 top-3 right-3 uppercase tracking-[0.14em] text-[0.65rem] px-3.5 py-2 inline-flex items-center gap-2 focus-visible:outline focus-visible:outline-2"
          style={{ backgroundColor: exploring ? CHARCOAL : 'rgba(245,241,232,0.94)', color: exploring ? CREAM : CHARCOAL }}
          aria-pressed={exploring}
        >
          {!exploring && <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: WARM_DARK }} aria-hidden="true" />}
          {exploring ? 'Close' : 'Explore the material'}
        </button>
      </motion.div>

      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            key={active.id}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: 6 }}
            transition={{ duration: 0.4, ease: EASE }}
            className={`relative z-20 mt-3 md:mt-0 md:absolute md:bottom-10 md:max-w-xs p-5 ${active.x < 50 ? 'md:right-4' : 'md:left-4'}`}
            style={{ backgroundColor: 'rgba(250,247,240,0.96)', border: BORDER, WebkitBackdropFilter: 'blur(6px)', backdropFilter: 'blur(6px)' }}
            aria-live="polite"
          >
            <p className="uppercase text-[0.6rem] tracking-[0.2em] mb-1" style={{ opacity: 0.55 }}>
              {HOTSPOTS.findIndex(h => h.id === active.id) + 1} / {HOTSPOTS.length}
            </p>
            <p className="font-display text-xl mb-1.5">{active.title}</p>
            <p className="text-xs mb-3" style={{ lineHeight: 1.65, opacity: 0.8 }}>{active.text}</p>
            <div className="flex gap-4 text-xs">
              {HOTSPOTS.filter(h => h.id !== active.id).map(h => (
                <button key={h.id} onClick={() => setActive(h)} className="underline underline-offset-4">{h.title} →</button>
              ))}
              <button onClick={() => setActive(null)} className="underline underline-offset-4" style={{ opacity: 0.6 }}>Full view</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <figcaption className="mt-3 text-[0.68rem] uppercase tracking-[0.18em] flex items-center gap-2" style={{ opacity: 0.55 }}>
        <span className="inline-block w-6 h-px" style={{ backgroundColor: CHARCOAL }} aria-hidden="true" />
        AI concept illustration
      </figcaption>
    </figure>
  )
}

function ProgressRing({ value, size = 56 }: { value: number; size?: number }) {
  const reduce = useReducedMotion()
  const r = size / 2 - 3
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true" className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(26,23,20,0.1)" strokeWidth={2} />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={WARM_DARK}
        strokeWidth={2}
        strokeLinecap="round"
        initial={false}
        animate={{ pathLength: value }}
        transition={{ duration: reduce ? 0 : 0.6, ease: EASE }}
      />
    </svg>
  )
}

function ScoreRing({ score }: { score: number }) {
  const reduce = useReducedMotion()
  const [shown, setShown] = useState(reduce ? score : 0)
  useEffect(() => {
    if (reduce) { setShown(score); return }
    let current = 0
    const id = setInterval(() => { current += 1; setShown(Math.min(current, score)); if (current >= score) clearInterval(id) }, 110)
    return () => clearInterval(id)
  }, [score, reduce])
  return (
    <div className="relative w-52 h-52 md:w-60 md:h-60">
      <svg viewBox="0 0 200 200" className="absolute inset-0 -rotate-90" aria-hidden="true">
        <circle cx="100" cy="100" r="88" fill="none" stroke="rgba(26,23,20,0.08)" strokeWidth="3" />
        {Array.from({ length: 10 }).map((_, i) => (
          <line
            key={i}
            x1="100" y1="6" x2="100" y2="14"
            transform={`rotate(${i * 36} 100 100)`}
            stroke={i < score ? WARM_DARK : 'rgba(26,23,20,0.18)'}
            strokeWidth="1.5"
          />
        ))}
        <motion.circle
          cx="100" cy="100" r="88" fill="none" stroke={WARM_DARK} strokeWidth="3" strokeLinecap="round"
          initial={{ pathLength: reduce ? score / 10 : 0 }}
          animate={{ pathLength: score / 10 }}
          transition={{ duration: reduce ? 0 : 1.4, ease: EASE, delay: 0.2 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-6xl md:text-7xl leading-none">{shown}</span>
        <span className="uppercase text-label tracking-[0.2em] mt-3" style={{ opacity: 0.5 }}>out of 10</span>
      </div>
    </div>
  )
}

/* ---------- Page ---------- */

export default function GrowClient() {
  const reduce = useReducedMotion()
  const [phase, setPhase] = useState<Phase>('signup')
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [errorText, setErrorText] = useState('')
  const [product, setProduct] = useState('')
  const [answers, setAnswers] = useState<boolean[]>([])
  const [lastAnswer, setLastAnswer] = useState<boolean | null>(null)
  const [copied, setCopied] = useState(false)
  const [sampleStatus, setSampleStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')
  const [token, setToken] = useState<string | null>(null)
  const [notice, setNotice] = useState('')
  const [resendStatus, setResendStatus] = useState<'hidden' | 'idle' | 'loading'>('hidden')
  const formRef = useRef<HTMLElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const guideRef = useRef<HTMLElement>(null)
  const resultRef = useRef<HTMLElement>(null)

  const step = answers.length
  const brief = phase === 'result' ? buildBrief(product, answers) : null

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' && new URLSearchParams(window.location.search).get('demo') === 'brief') {
      setEmail('demo@example.com')
      setProduct('Coffee gift tin')
      setAnswers([true, true, true, true, true, false, true, true, false, false])
      setPhase('result')
    }
  }, [])

  // Existing subscribers open the guide from the emailed link, on any device.
  // This only reads: no new signup, no email sent, no sequence restarted.
  useEffect(() => {
    const linkToken = new URLSearchParams(window.location.search).get('guide')
    if (!linkToken) return
    fetch('/api/grow-access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: linkToken }),
    })
      .then(res => (res.ok ? res.json() : Promise.reject(new Error('invalid'))))
      .then((data: { email: string }) => {
        setEmail(data.email)
        setToken(linkToken)
        setNotice('Welcome back. Your guide is open, and nothing new has been sent.')
        setPhase('test')
        setTimeout(() => guideRef.current?.scrollIntoView({ block: 'start' }), 150)
      })
      .catch(() => {
        setStatus('error')
        setErrorText('This guide link is not valid. Enter your email to get a new one.')
      })
  }, [])

  const scrollTo = useCallback((el: HTMLElement | null) => {
    el?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  }, [reduce])

  function goToForm() {
    scrollTo(formRef.current)
    setTimeout(() => emailRef.current?.focus({ preventScroll: true }), reduce ? 0 : 500)
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    if (status === 'loading') return
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setStatus('error')
      setErrorText('Please enter a valid email address.')
      return
    }
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, website, requestType: 'grow_test', source: 'grow-landing' }),
      })
      if (!res.ok) {
        setStatus('error')
        setErrorText(
          res.status === 400 ? 'Please enter a valid email address.'
            : res.status === 429 ? 'Too many attempts from this browser. Please wait a few minutes.'
              : 'We could not save your request just now. Please try again, or email andy@numu.bio.',
        )
        return
      }
      applySignupResult(await res.json().catch(() => ({})))
      setStatus('idle')
      setPhase('test')
      setTimeout(() => scrollTo(guideRef.current), 60)
    } catch {
      setStatus('error')
      setErrorText('We could not save your request just now. Please try again, or email andy@numu.bio.')
    }
  }

  function applySignupResult(data: { token?: string; returning?: boolean; emailSent?: boolean }) {
    if (data.token) {
      setToken(data.token)
      window.history.replaceState(null, '', `?guide=${encodeURIComponent(data.token)}`)
    }
    if (data.emailSent === false) {
      setResendStatus('idle')
      setNotice('Your request is saved, but the welcome email did not send.')
    } else {
      setResendStatus('hidden')
      setNotice(data.returning
        ? 'Welcome back. You are already signed up, so the emails were not sent again.'
        : 'Your guide is open. The welcome email with your personal link is on its way.')
    }
  }

  // Safe to repeat: the server keeps one lead per email and sends the sequence once.
  async function resendWelcome() {
    setResendStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, website: '', requestType: 'grow_test', source: 'grow-resend' }),
      })
      if (!res.ok) throw new Error('failed')
      applySignupResult(await res.json().catch(() => ({})))
    } catch {
      setResendStatus('idle')
      setNotice('The welcome email still did not send. Please try again shortly, or email andy@numu.bio.')
    }
  }

  const answer = useCallback((value: boolean) => {
    if (answers.length >= QUESTIONS.length) return
    const next = [...answers, value]
    setLastAnswer(value)
    setAnswers(next)
    if (next.length === QUESTIONS.length) {
      setPhase('result')
      setTimeout(() => scrollTo(resultRef.current), 80)
      fetch('/api/grow-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, score: next.filter(Boolean).length, answers: next, product }),
      }).catch(() => undefined)
    }
  }, [answers, token, product, scrollTo])

  // Keyboard shortcuts during the test: Y / N, Backspace to go back.
  useEffect(() => {
    if (phase !== 'test') return
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (e.key === 'y' || e.key === 'Y') answer(true)
      if (e.key === 'n' || e.key === 'N') answer(false)
      if (e.key === 'Backspace') setAnswers(a => a.slice(0, -1))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, answer])

  async function copyBrief() {
    if (!brief) return
    try {
      await navigator.clipboard.writeText(briefText(brief))
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      setCopied(false)
    }
  }

  async function requestSampleBox() {
    if (sampleStatus === 'loading' || sampleStatus === 'sent') return
    setSampleStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, website: '', requestType: 'samples', source: `grow-result-${brief?.score ?? 0}` }),
      })
      setSampleStatus(res.ok ? 'sent' : 'error')
    } catch {
      setSampleStatus('error')
    }
  }

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0 : 0.8, delay: reduce ? 0 : delay, ease: EASE },
  })

  return (
    <main className="relative min-h-screen font-sans overflow-x-hidden" style={{ backgroundColor: CREAM, color: CHARCOAL }}>
      <ScrollHairline />

      {/* Photograph as a soft background, washed in ivory, with growing threads and grain */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[115vh] overflow-hidden" aria-hidden="true">
        <Image src={HERO_SRC} alt="" fill sizes="100vw" className="object-cover object-[60%_40%] scale-110 blur-[3px]" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(245,241,232,0.84) 0%, rgba(245,241,232,0.9) 50%, #F5F1E8 100%)' }} />
        <MyceliumThreads />
      </div>
      <div className="pointer-events-none fixed inset-0 z-40 opacity-[0.07] mix-blend-multiply" style={{ backgroundImage: GRAIN }} aria-hidden="true" />

      <motion.header {...fadeUp(0)} className="relative z-10 flex items-center justify-between px-5 md:px-12 py-5" style={{ borderBottom: BORDER }}>
        <Link href="/" className="font-display text-xl tracking-wide">NUMU</Link>
        <span className="uppercase text-label tracking-[0.18em]" style={{ opacity: 0.6 }}>PALMYCO · Packaging pilot</span>
      </motion.header>

      <section className="relative z-10 grid lg:grid-cols-[0.92fr_1.08fr] gap-6 lg:gap-16 px-5 md:px-12 pt-8 md:pt-16 pb-14 max-w-7xl mx-auto items-center">
        <div>
          <motion.p {...fadeUp(0.05)} className="uppercase text-label tracking-[0.2em] mb-5 flex items-center gap-3" style={{ color: WARM_DARK }}>
            <span className="inline-block w-8 h-px" style={{ backgroundColor: WARM_DARK }} aria-hidden="true" />
            Free packaging pilot brief · 5 minutes
          </motion.p>
          <RevealWords text="Which product should you test first?" className="font-display text-[2.7rem] leading-[1.02] sm:text-6xl xl:text-[5.2rem] mb-6 tracking-[-0.01em]" />
          <motion.p {...fadeUp(0.7)} className="text-base sm:text-lg max-w-lg mb-5 md:mb-8" style={{ opacity: 0.82, lineHeight: 1.6 }}>
            Could a grown mycelium insert replace the foam or plastic around your product? Answer a few questions and get a one-page decision brief you can take to your team.
          </motion.p>
          <motion.div {...fadeUp(0.85)} className="flex flex-wrap items-center gap-6">
            <ArrowButton onClick={goToForm}>Get my free brief</ArrowButton>
            <button onClick={() => scrollTo(formRef.current)} className="group text-sm pb-1 relative" style={{ opacity: 0.8 }}>
              See the full example
              <span className="absolute left-0 right-0 bottom-0 h-px origin-left transition-transform duration-300 group-hover:scale-x-50" style={{ backgroundColor: CHARCOAL }} aria-hidden="true" />
            </button>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: reduce ? 0 : 1.1, delay: reduce ? 0 : 0.25, ease: EASE }}
        >
          <MaterialImage />
          <aside aria-label="Preview of an example packaging brief" className="relative mx-0 md:mx-4 mt-3 p-4 md:p-5"
            style={{ border: BORDER, backgroundColor: '#faf7f0', boxShadow: '0 18px 42px -28px rgba(26,23,20,0.5)' }}>
            <p className="uppercase text-label tracking-[0.16em] mb-2" style={{ color: WARM_DARK }}>Example brief · Coffee gift tin</p>
            <p className="font-display text-xl md:text-2xl leading-tight">Promising for a small trial.</p>
            <p className="mt-2 text-sm leading-relaxed">The simple shape makes it a candidate. Before pitching the switch, weigh the current foam insert so your team has a baseline.</p>
          </aside>
        </motion.div>
      </section>

      <div className="relative z-10"><Marquee /></div>

      <AnimatePresence mode="wait">
        {phase === 'signup' && (
          <motion.section
            key="signup"
            ref={formRef}
            exit={reduce ? undefined : { opacity: 0, y: -16, transition: { duration: 0.35 } }}
            className="relative z-10 px-5 md:px-12 py-16 md:py-24 max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16 items-start scroll-mt-6"
          >
            <BriefCard brief={null} example />
            <div>
              <h2 className="font-display text-4xl md:text-5xl leading-tight mb-4">Bring a recommendation to your next packaging meeting</h2>
              <p className="text-sm mb-5 max-w-md leading-relaxed">
                Pick one product that uses a foam or plastic insert. Your answers turn into a brief with three things your team can act on.
              </p>
              <dl className="mb-7 max-w-md space-y-3 border-y border-current/15 py-4 text-sm">
                <div><dt className="font-semibold">A fit recommendation</dt><dd>Start here, check a constraint first, or pick a better product.</dd></div>
                <div><dt className="font-semibold">The biggest unknown</dt><dd>Find out what to resolve before committing to a prototype.</dd></div>
                <div><dt className="font-semibold">One next action</dt><dd>Get a concrete step you can assign and a brief you can copy to your team.</dd></div>
              </dl>
              <form onSubmit={handleSignup} noValidate className="flex flex-col sm:flex-row gap-3 max-w-lg">
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={e => setWebsite(e.target.value)}
                  aria-hidden="true"
                  style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
                />
                <label htmlFor="grow-email" className="sr-only">Work email</label>
                <input
                  ref={emailRef}
                  id="grow-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); if (status === 'error') setStatus('idle') }}
                  placeholder="your@company.com"
                  disabled={status === 'loading'}
                  aria-invalid={status === 'error'}
                  aria-describedby="grow-email-help grow-email-error"
                  className="flex-1 min-w-0 px-5 py-4 outline-none text-base sm:text-sm transition-shadow focus:shadow-[0_0_0_1px_#4A3F34]"
                  style={{ border: status === 'error' ? '1px solid #8a3b2a' : BORDER, backgroundColor: 'rgba(250,247,240,0.95)', borderRadius: 0, WebkitAppearance: 'none' }}
                />
                <ArrowButton type="submit" disabled={status === 'loading'} className="shrink-0">
                  {status === 'loading' ? 'Opening…' : 'Get my free brief'}
                </ArrowButton>
              </form>
              <p id="grow-email-help" className="text-xs mt-3" style={{ opacity: 0.6 }}>
                Start immediately. We’ll email your access link and two short follow-ups. Reply STOP any time.
              </p>
              <p id="grow-email-error" className="text-sm mt-2 min-h-[1.25rem]" style={{ color: '#8a3b2a' }} role="alert">
                {status === 'error' ? errorText : ''}
              </p>
              <div className="mt-5 max-w-md border-l pl-4" style={{ borderColor: WARM_DARK }}>
                <p className="font-display text-xl mb-1">See how it could fit your product</p>
                <p className="text-sm leading-relaxed">Reply to the welcome email with a photo and dimensions. Andy will create an AI concept illustration of a grown insert shaped around it.</p>
              </div>
              <p className="text-xs mt-8 max-w-md" style={{ opacity: 0.5, lineHeight: 1.6 }}>
                A screening guide, not a product claim. NUMU&apos;s protective packaging is in development, made in Dubai from regional agricultural waste.
              </p>
            </div>
          </motion.section>
        )}

        {phase === 'test' && (
          <motion.section
            key="test"
            ref={guideRef}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.6, ease: EASE }}
            className="relative z-10 px-5 md:px-12 py-14 md:py-20 max-w-3xl mx-auto scroll-mt-6"
            aria-labelledby="guide-title"
          >
            <p id="guide-title" className="uppercase text-label tracking-[0.2em] mb-6" style={{ color: WARM_DARK }}>
              Your pilot guide · check your inbox too
            </p>
            {notice && (
              <div className="mb-6 px-4 py-3 text-sm flex flex-wrap items-center gap-3" style={{ border: BORDER, backgroundColor: 'rgba(178,155,127,0.12)' }} role="status">
                <span>{notice}</span>
                {resendStatus !== 'hidden' && (
                  <button onClick={resendWelcome} disabled={resendStatus === 'loading'} className="underline underline-offset-4">
                    {resendStatus === 'loading' ? 'Sending…' : 'Resend the welcome email'}
                  </button>
                )}
              </div>
            )}
            {step === 0 && (
              <div className="mb-8">
                <label htmlFor="grow-product" className="uppercase text-label tracking-[0.18em]" style={{ opacity: 0.6 }}>
                  Which product are you testing? (optional)
                </label>
                <input
                  id="grow-product"
                  type="text"
                  value={product}
                  onChange={e => setProduct(e.target.value)}
                  maxLength={120}
                  placeholder="For example: coffee gift tin"
                  className="mt-2 w-full px-5 py-3.5 outline-none text-base sm:text-sm focus:shadow-[0_0_0_1px_#4A3F34]"
                  style={{ border: BORDER, backgroundColor: 'rgba(250,247,240,0.95)', borderRadius: 0, WebkitAppearance: 'none' }}
                />
              </div>
            )}

            <div className="relative p-6 md:p-10 shadow-[0_30px_70px_-35px_rgba(26,23,20,0.4)]" style={{ border: BORDER, backgroundColor: 'rgba(250,247,240,0.96)' }}>
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <ProgressRing value={step / QUESTIONS.length} />
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-medium" aria-live="polite">
                    {Math.min(step + 1, 10)}/10
                  </span>
                </div>
                <div className="flex gap-1 flex-1" aria-hidden="true">
                  {QUESTIONS.map((_, i) => (
                    <motion.div
                      key={i}
                      className="h-1 flex-1 origin-left"
                      animate={{ backgroundColor: i < step ? (answers[i] ? WARM_DARK : WARM_MID) : 'rgba(26,23,20,0.1)', scaleY: i === step ? 1.8 : 1 }}
                      transition={{ duration: reduce ? 0 : 0.3 }}
                    />
                  ))}
                </div>
              </div>

              <AnimatePresence mode="wait" custom={lastAnswer}>
                <motion.p
                  key={step}
                  custom={lastAnswer}
                  initial={reduce ? false : { opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, x: lastAnswer ? 40 : -40, transition: { duration: 0.22 } }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="font-display text-2xl sm:text-[2.3rem] leading-tight mb-10 min-h-[7rem]"
                >
                  {QUESTIONS[Math.min(step, QUESTIONS.length - 1)]}
                </motion.p>
              </AnimatePresence>

              <div className="flex flex-wrap items-center gap-3">
                <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} onClick={() => answer(true)} className="uppercase tracking-[0.14em] text-xs px-10 py-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2" style={{ backgroundColor: CHARCOAL, color: CREAM }}>
                  Yes
                </motion.button>
                <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} onClick={() => answer(false)} className="uppercase tracking-[0.14em] text-xs px-10 py-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2" style={{ border: BORDER }}>
                  No
                </motion.button>
                {step > 0 && (
                  <button onClick={() => setAnswers(answers.slice(0, -1))} className="text-xs underline underline-offset-4 ml-2" style={{ opacity: 0.6 }}>Back</button>
                )}
                <span className="hidden md:inline ml-auto text-[0.7rem] uppercase tracking-[0.16em]" style={{ opacity: 0.4 }}>Keys: Y / N</span>
              </div>
            </div>
          </motion.section>
        )}

        {phase === 'result' && brief && (
          <motion.section
            key="result"
            ref={resultRef}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.7, ease: EASE }}
            className="relative z-10 px-5 md:px-12 py-14 md:py-20 max-w-6xl mx-auto scroll-mt-6"
            aria-live="polite"
          >
            <div className="grid lg:grid-cols-[0.75fr_1.25fr] gap-10 lg:gap-16 items-start">
              <div className="flex flex-col items-start">
                <p className="uppercase text-label tracking-[0.2em] mb-5" style={{ color: WARM_DARK }}>Your growability score</p>
                <ScoreRing score={brief.score} />
                <motion.p {...fadeUp(1.3)} className="font-display text-4xl mt-6 mb-3">{brief.label}</motion.p>
                <motion.p {...fadeUp(1.45)} className="text-sm max-w-sm" style={{ opacity: 0.8, lineHeight: 1.7 }}>
                  {brief.text}
                </motion.p>
              </div>
              <div>
                <BriefCard brief={brief} />
                <div className="flex flex-wrap gap-5 items-center mt-5">
                  <ArrowButton onClick={copyBrief}>{copied ? 'Brief copied' : 'Copy brief for my team'}</ArrowButton>
                  <button
                    onClick={() => { setAnswers([]); setProduct(''); setCopied(false); setLastAnswer(null); setPhase('test'); setTimeout(() => scrollTo(guideRef.current), 60) }}
                    className="text-xs underline underline-offset-4"
                    style={{ opacity: 0.6 }}
                  >
                    Test another product
                  </button>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5 mt-16">
              {[
                {
                  title: 'Free sample box',
                  text: 'Touch PALMYCO and judge it with your team. We send 5 boxes a month.',
                  action: (
                    <ArrowButton onClick={requestSampleBox} disabled={sampleStatus === 'loading'}>
                      {sampleStatus === 'sent' ? 'Sample box requested' : 'Request a free sample box'}
                    </ArrowButton>
                  ),
                },
                {
                  title: 'Bespoke prototype · AED 500',
                  text: 'One product, grown in Dubai in 4 to 5 weeks. Credited in full against your first order (subject to production capacity).',
                  action: (
                    <a
                      href="mailto:andy@numu.bio?subject=Bespoke%20prototype%20request%20(AED%20500)"
                      className="group inline-flex items-center gap-3 uppercase tracking-[0.14em] text-xs px-7 py-4 focus-visible:outline focus-visible:outline-2"
                      style={{ border: BORDER }}
                    >
                      Request a prototype <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">→</span>
                    </a>
                  ),
                },
              ].map((card, i) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-10% 0px' }}
                  whileHover={reduce ? undefined : { y: -4 }}
                  transition={{ duration: reduce ? 0 : 0.6, delay: reduce ? 0 : i * 0.12, ease: EASE }}
                  className="p-7 md:p-8 transition-shadow hover:shadow-[0_30px_60px_-35px_rgba(26,23,20,0.45)]"
                  style={{ border: BORDER, backgroundColor: 'rgba(250,247,240,0.9)' }}
                >
                  <p className="font-display text-3xl mb-3">{card.title}</p>
                  <p className="text-sm mb-6" style={{ opacity: 0.75, lineHeight: 1.7 }}>{card.text}</p>
                  {card.action}
                </motion.div>
              ))}
            </div>
            {sampleStatus === 'error' && <p className="text-sm mt-3" style={{ color: '#8a3b2a' }} role="alert">Please try again, or email andy@numu.bio.</p>}
            <p className="text-sm mt-10 max-w-2xl" style={{ opacity: 0.7, lineHeight: 1.7 }}>
              Want to see your own product in a grown insert? Reply to our email with a photo and its dimensions, and Andy will create a concept illustration.
            </p>
          </motion.section>
        )}
      </AnimatePresence>

      <footer className="relative z-10 px-5 md:px-12 py-10 text-xs flex flex-wrap gap-4 justify-between items-center" style={{ borderTop: BORDER }}>
        <span className="font-display text-base">Grown, not manufactured.</span>
        <span style={{ opacity: 0.6 }}>NUMU · Dubai, UAE · <Link href="/" className="underline underline-offset-4">numu.bio</Link></span>
      </footer>
    </main>
  )
}
