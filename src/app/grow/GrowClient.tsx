'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

const CHARCOAL = '#1A1714'
const CREAM = '#F5F1E8'
const WARM_MID = '#B29B7F'
const WARM_DARK = '#4A3F34'
const BORDER = '1px solid rgba(26,23,20,0.16)'
const HERO_SRC = '/images/grow/mycelium-coffee-insert-concept.jpg'

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

// What a "yes" says in the brief (strongest fit signal), by question.
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

// What a "no" leaves open (unknown) and the concrete next step, by question.
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
  { min: 4, label: 'Sprouting', text: 'Promising. Turn your “no” answers into “yes” first, starting with the most important unknown below.' },
  { min: 0, label: 'Still in the cupboard', text: 'Not the right first product. Try the test again with a gift set or a limited edition, where a small first run is easier.' },
]

const HOTSPOTS = [
  {
    id: 'edge',
    x: 30,
    y: 47,
    title: 'The fibrous edge',
    text: 'PALMYCO is regional plant fibre bound by mycelium. This is the surface your team would touch in a sample box.',
  },
  {
    id: 'recess',
    x: 63,
    y: 62,
    title: 'The fitted recess',
    text: 'In this concept the recess follows the curve of the tin, so the product sits snugly in one grown piece.',
  },
] as const

type Phase = 'signup' | 'test' | 'result'
type Brief = { product: string; score: number; label: string; signal: string; unknown: string; step: string; timing: string | null }

function buildBrief(product: string, answers: boolean[]): Brief {
  const score = answers.filter(Boolean).length
  const band = BANDS.find(b => score >= b.min) ?? BANDS[2]
  const signalIndex = SIGNAL_PRIORITY.find(i => answers[i])
  const gapIndex = GAP_PRIORITY.find(i => !answers[i])
  return {
    product: product || 'One product (not named)',
    score,
    label: band.label,
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

function CountUp({ to, instant }: { to: number; instant: boolean }) {
  const [value, setValue] = useState(instant ? to : 0)
  useEffect(() => {
    if (instant) { setValue(to); return }
    let current = 0
    const id = setInterval(() => {
      current += 1
      setValue(Math.min(current, to))
      if (current >= to) clearInterval(id)
    }, 80)
    return () => clearInterval(id)
  }, [to, instant])
  return <>{value}</>
}

function BriefCard({ brief, example = false }: { brief: Brief | null; example?: boolean }) {
  const rows = example
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
          ...(brief.timing ? [['Timing', brief.timing]] : []),
        ]
      : []
  return (
    <div className="p-6 md:p-7" style={{ border: BORDER, backgroundColor: 'rgba(245,241,232,0.92)' }}>
      <p className="uppercase text-label tracking-[0.18em] mb-4" style={{ color: WARM_DARK }}>
        {example ? 'Example · coffee gift tin' : 'Your one-page brief'}
      </p>
      <dl className="space-y-3">
        {rows.map(([k, v]) => (
          <div key={k} className="grid grid-cols-[9.5rem_1fr] gap-3 text-sm max-sm:grid-cols-1 max-sm:gap-0.5">
            <dt className="uppercase text-label tracking-[0.14em] pt-0.5" style={{ opacity: 0.55 }}>{k}</dt>
            <dd style={{ lineHeight: 1.55 }}>{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

function MaterialImage() {
  const reduce = useReducedMotion()
  const [exploring, setExploring] = useState(false)
  const [active, setActive] = useState<(typeof HOTSPOTS)[number] | null>(null)

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' && new URLSearchParams(window.location.search).get('demo') === 'explore') {
      setExploring(true)
      setActive(HOTSPOTS[0])
    }
  }, [])

  const zoomTransition = reduce ? { duration: 0 } : { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const }

  return (
    <figure className="relative w-full">
      <div className="relative w-full aspect-[16/10] overflow-hidden" style={{ border: BORDER }}>
        <motion.div
          className="absolute inset-0"
          animate={{ scale: active ? 2.3 : 1 }}
          transition={zoomTransition}
          style={{ transformOrigin: active ? `${active.x}% ${active.y}%` : '50% 50%' }}
        >
          <Image
            src={HERO_SRC}
            alt="A coffee tin sitting in a grown, fibrous insert inside a cardboard box, next to an empty insert showing its curved recess"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 55vw"
            className="object-cover object-[70%_50%]"
          />
        </motion.div>

        {exploring && !active && HOTSPOTS.map(h => (
          <button
            key={h.id}
            onClick={() => setActive(h)}
            className="absolute -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center focus-visible:outline focus-visible:outline-2"
            style={{ left: `${h.x}%`, top: `${h.y}%`, backgroundColor: 'rgba(245,241,232,0.88)', border: `1px solid ${WARM_DARK}` }}
            aria-label={`Show ${h.title.toLowerCase()}`}
          >
            {!reduce && (
              <motion.span
                className="absolute inset-0 rounded-full"
                style={{ border: `1px solid ${CREAM}` }}
                animate={{ scale: [1, 1.7], opacity: [0.9, 0] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
            )}
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: WARM_DARK }} />
          </button>
        ))}

        <button
          onClick={() => { setExploring(!exploring); setActive(null) }}
          className="absolute top-3 right-3 uppercase tracking-[0.14em] text-[0.65rem] px-3.5 py-2"
          style={{ backgroundColor: exploring ? CHARCOAL : 'rgba(245,241,232,0.92)', color: exploring ? CREAM : CHARCOAL }}
          aria-pressed={exploring}
        >
          {exploring ? 'Close' : 'Explore the material'}
        </button>
      </div>

      <AnimatePresence>
          {active && (
            <motion.div
              key={active.id}
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0 }}
              className="relative mt-3 md:mt-0 md:absolute md:left-4 md:bottom-10 md:max-w-xs p-4"
              style={{ backgroundColor: 'rgba(245,241,232,0.95)', border: BORDER }}
              aria-live="polite"
            >
              <p className="font-display text-lg mb-1">{active.title}</p>
              <p className="text-xs mb-3" style={{ lineHeight: 1.6, opacity: 0.8 }}>{active.text}</p>
              <div className="flex gap-4 text-xs">
                {HOTSPOTS.filter(h => h.id !== active.id).map(h => (
                  <button key={h.id} onClick={() => setActive(h)} className="underline">{h.title}</button>
                ))}
                <button onClick={() => setActive(null)} className="underline" style={{ opacity: 0.6 }}>Full view</button>
              </div>
            </motion.div>
          )}
      </AnimatePresence>
      <figcaption className="mt-2 text-[0.7rem] uppercase tracking-[0.16em]" style={{ opacity: 0.5 }}>
        AI concept illustration
      </figcaption>
    </figure>
  )
}

export default function GrowClient() {
  const reduce = useReducedMotion()
  const [phase, setPhase] = useState<Phase>('signup')
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [errorText, setErrorText] = useState('')
  const [product, setProduct] = useState('')
  const [answers, setAnswers] = useState<boolean[]>([])
  const [copied, setCopied] = useState(false)
  const [sampleStatus, setSampleStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')
  const formRef = useRef<HTMLElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const guideRef = useRef<HTMLElement>(null)

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

  function scrollTo(el: HTMLElement | null) {
    el?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  }

  function goToForm() {
    scrollTo(formRef.current)
    setTimeout(() => emailRef.current?.focus({ preventScroll: true }), reduce ? 0 : 450)
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
              : 'We could not send the guide just now. Please try again, or email andy@numu.bio.',
        )
        return
      }
      setStatus('idle')
      setPhase('test')
      setTimeout(() => scrollTo(guideRef.current), 50)
    } catch {
      setStatus('error')
      setErrorText('We could not send the guide just now. Please try again, or email andy@numu.bio.')
    }
  }

  function answer(value: boolean) {
    const next = [...answers, value]
    setAnswers(next)
    if (next.length === QUESTIONS.length) {
      setPhase('result')
      fetch('/api/grow-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, score: next.filter(Boolean).length, answers: next, product }),
      }).catch(() => undefined)
    }
  }

  async function copyBrief() {
    if (!brief) return
    try {
      await navigator.clipboard.writeText(briefText(brief))
      setCopied(true)
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

  // Always animate to visible; reduced motion only removes the duration.
  const fade = { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: reduce ? 0 : 0.6 } }

  return (
    <main className="relative min-h-screen font-sans overflow-x-hidden" style={{ backgroundColor: CREAM, color: CHARCOAL }}>
      {/* The photograph as a soft background, washed in ivory for readability */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[120vh] overflow-hidden" aria-hidden="true">
        <Image src={HERO_SRC} alt="" fill sizes="100vw" className="object-cover object-[60%_40%] blur-[2px] scale-105" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(245,241,232,0.86) 0%, rgba(245,241,232,0.93) 55%, #F5F1E8 100%)' }} />
      </div>

      <header className="relative flex items-center justify-between px-5 md:px-12 py-5" style={{ borderBottom: BORDER }}>
        <Link href="/" className="font-display text-xl tracking-wide">NUMU</Link>
        <span className="uppercase text-label tracking-[0.18em]" style={{ opacity: 0.6 }}>PALMYCO · Packaging pilot</span>
      </header>

      <section className="relative grid lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-14 px-5 md:px-12 pt-8 md:pt-14 pb-10 max-w-7xl mx-auto items-center">
        <motion.div {...fade}>
          <p className="uppercase text-label tracking-[0.18em] mb-4" style={{ color: WARM_DARK }}>A 5-minute pilot guide</p>
          <h1 className="font-display text-[2.6rem] leading-[1.03] sm:text-6xl xl:text-7xl mb-5">Can your packaging be grown?</h1>
          <p className="text-base sm:text-lg max-w-lg mb-7" style={{ opacity: 0.82, lineHeight: 1.6 }}>
            Pick one product. In five minutes, build a brief your team can use to decide whether to explore a grown insert.
          </p>
          <div className="flex flex-wrap items-center gap-5">
            <button
              onClick={goToForm}
              className="uppercase tracking-[0.14em] text-xs px-7 py-4 transition-transform hover:-translate-y-0.5"
              style={{ backgroundColor: CHARCOAL, color: CREAM }}
            >
              Get the free pilot guide
            </button>
            <button onClick={() => scrollTo(formRef.current)} className="text-sm underline underline-offset-4" style={{ opacity: 0.75 }}>
              See an example brief
            </button>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={reduce ? { duration: 0 } : { duration: 0.8, delay: 0.1 }}>
          <MaterialImage />
        </motion.div>
      </section>

      <AnimatePresence mode="wait">
        {phase === 'signup' && (
          <motion.section
            key="signup"
            ref={formRef}
            exit={reduce ? undefined : { opacity: 0, y: -10 }}
            className="relative px-5 md:px-12 py-12 max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-14 items-start scroll-mt-6"
          >
            <BriefCard brief={null} example />
            <div>
              <h2 className="font-display text-3xl mb-3">Build your own brief</h2>
              <p className="text-sm mb-6 max-w-md" style={{ opacity: 0.75, lineHeight: 1.6 }}>
                Ten yes-or-no questions about one product. Your answers fill in a brief like the example, ready to copy for your team.
              </p>
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
                  autoComplete="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); if (status === 'error') setStatus('idle') }}
                  placeholder="your@company.com"
                  disabled={status === 'loading'}
                  aria-invalid={status === 'error'}
                  aria-describedby="grow-email-help grow-email-error"
                  className="flex-1 px-5 py-4 bg-transparent outline-none text-sm focus-visible:outline focus-visible:outline-1"
                  style={{ border: status === 'error' ? '1px solid #8a3b2a' : BORDER, backgroundColor: 'rgba(245,241,232,0.9)' }}
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="uppercase tracking-[0.14em] text-xs px-7 py-4"
                  style={{ backgroundColor: CHARCOAL, color: CREAM, opacity: status === 'loading' ? 0.6 : 1 }}
                >
                  {status === 'loading' ? 'Opening…' : 'Get the free pilot guide'}
                </button>
              </form>
              <p id="grow-email-help" className="text-xs mt-3" style={{ opacity: 0.6 }}>
                Get the guide now, then two short follow-ups. Reply STOP any time.
              </p>
              <p id="grow-email-error" className="text-sm mt-2 min-h-[1.25rem]" style={{ color: '#8a3b2a' }} role="alert">
                {status === 'error' ? errorText : ''}
              </p>
              <p className="text-xs mt-4 max-w-md" style={{ opacity: 0.5, lineHeight: 1.6 }}>
                A screening guide, not a product claim. NUMU&apos;s protective packaging is in development, made in Dubai from regional agricultural waste.
              </p>
            </div>
          </motion.section>
        )}

        {phase === 'test' && (
          <motion.section
            key="test"
            ref={guideRef}
            {...fade}
            className="relative px-5 md:px-12 py-12 max-w-3xl mx-auto scroll-mt-6"
            aria-labelledby="guide-title"
          >
            <p id="guide-title" className="uppercase text-label tracking-[0.18em] mb-5" style={{ color: WARM_DARK }}>
              Your pilot guide · check your inbox too
            </p>
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
                  className="mt-2 w-full px-5 py-3 bg-transparent outline-none text-sm"
                  style={{ border: BORDER }}
                />
              </div>
            )}
            <div className="flex gap-1.5 mb-6" aria-hidden="true">
              {QUESTIONS.map((_, i) => (
                <div key={i} className="h-1 flex-1 transition-colors duration-300" style={{ backgroundColor: i < step ? (answers[i] ? WARM_DARK : WARM_MID) : 'rgba(26,23,20,0.12)' }} />
              ))}
            </div>
            <p className="uppercase text-label tracking-[0.18em] mb-3" style={{ opacity: 0.55 }} aria-live="polite">
              Question {step + 1} of 10
            </p>
            <AnimatePresence mode="wait">
              <motion.p
                key={step}
                initial={reduce ? false : { opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduce ? undefined : { opacity: 0, x: -24 }}
                transition={{ duration: 0.25 }}
                className="font-display text-2xl sm:text-4xl leading-tight mb-10 min-h-[6.5rem]"
              >
                {QUESTIONS[step]}
              </motion.p>
            </AnimatePresence>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => answer(true)} className="uppercase tracking-[0.14em] text-xs px-10 py-4" style={{ backgroundColor: CHARCOAL, color: CREAM }}>Yes</button>
              <button onClick={() => answer(false)} className="uppercase tracking-[0.14em] text-xs px-10 py-4" style={{ border: BORDER }}>No</button>
              {step > 0 && (
                <button onClick={() => setAnswers(answers.slice(0, -1))} className="text-xs underline ml-2" style={{ opacity: 0.6 }}>Back</button>
              )}
            </div>
          </motion.section>
        )}

        {phase === 'result' && brief && (
          <motion.section key="result" {...fade} className="relative px-5 md:px-12 py-12 max-w-5xl mx-auto" aria-live="polite">
            <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-8 lg:gap-12 items-start">
              <div>
                <p className="uppercase text-label tracking-[0.18em] mb-3" style={{ color: WARM_DARK }}>Your growability score</p>
                <p className="font-display text-7xl md:text-8xl leading-none mb-2">
                  <CountUp to={brief.score} instant={!!reduce} /><span className="text-3xl" style={{ opacity: 0.4 }}> / 10</span>
                </p>
                <p className="font-display text-3xl mb-4">{brief.label}</p>
                <p className="text-sm" style={{ opacity: 0.8, lineHeight: 1.65 }}>
                  {(BANDS.find(b => brief.score >= b.min) ?? BANDS[2]).text}
                </p>
              </div>
              <div>
                <BriefCard brief={brief} />
                <div className="flex flex-wrap gap-4 items-center mt-4">
                  <button onClick={copyBrief} className="uppercase tracking-[0.14em] text-xs px-6 py-3.5" style={{ backgroundColor: CHARCOAL, color: CREAM }}>
                    {copied ? 'Brief copied' : 'Copy brief for my team'}
                  </button>
                  <button onClick={() => { setAnswers([]); setProduct(''); setCopied(false); setPhase('test') }} className="text-xs underline" style={{ opacity: 0.6 }}>
                    Test another product
                  </button>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-12">
              <div className="p-6" style={{ border: BORDER }}>
                <p className="font-display text-2xl mb-2">Free sample box</p>
                <p className="text-sm mb-5" style={{ opacity: 0.75, lineHeight: 1.6 }}>Touch PALMYCO and judge it with your team. We send 5 boxes a month.</p>
                <button
                  onClick={requestSampleBox}
                  className="uppercase tracking-[0.14em] text-xs px-6 py-3.5"
                  style={{ backgroundColor: CHARCOAL, color: CREAM, opacity: sampleStatus === 'loading' ? 0.6 : 1 }}
                >
                  {sampleStatus === 'sent' ? 'Sample box requested' : 'Request a free sample box'}
                </button>
                {sampleStatus === 'error' && <p className="text-xs mt-2" style={{ color: '#8a3b2a' }} role="alert">Please try again, or email andy@numu.bio.</p>}
              </div>
              <div className="p-6" style={{ border: BORDER }}>
                <p className="font-display text-2xl mb-2">Bespoke prototype · AED 500</p>
                <p className="text-sm mb-5" style={{ opacity: 0.75, lineHeight: 1.6 }}>
                  One product, grown in Dubai in 4 to 5 weeks. Credited in full against your first order (subject to production capacity).
                </p>
                <a href="mailto:andy@numu.bio?subject=Bespoke%20prototype%20request%20(AED%20500)" className="inline-block uppercase tracking-[0.14em] text-xs px-6 py-3.5" style={{ border: BORDER }}>
                  Request a prototype
                </a>
              </div>
            </div>
            <p className="text-sm mt-8 max-w-2xl" style={{ opacity: 0.7, lineHeight: 1.6 }}>
              Want to see your own product in a grown insert? Reply to our email with a photo and its dimensions, and Andy will create a concept illustration.
            </p>
          </motion.section>
        )}
      </AnimatePresence>

      <footer className="relative px-5 md:px-12 py-8 text-xs flex justify-between" style={{ borderTop: BORDER, opacity: 0.6 }}>
        <span>Grown, not manufactured. NUMU, Dubai.</span>
        <Link href="/" className="underline">numu.bio</Link>
      </footer>
    </main>
  )
}
