'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

const CHARCOAL = '#1A1714'
const CREAM = '#F5F1E8'
const WARM_MID = '#B29B7F'
const WARM_DARK = '#4A3F34'
const BORDER = '1px solid rgba(26,23,20,0.16)'

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

const RESULTS = [
  {
    min: 0,
    label: 'Still in the cupboard',
    text: 'Not the right first product. Try the test again with a gift set or a limited edition, where a small first run is easier.',
  },
  {
    min: 4,
    label: 'Sprouting',
    text: 'Promising. Turn your “no” answers into “yes” first. The three that matter most: question 2 (a protective role), question 6 (know today’s insert weight) and question 9 (one person who can approve).',
  },
  {
    min: 7,
    label: 'Ready to grow',
    text: 'A strong first candidate. Weigh today’s insert, name the owner, and request a sample box.',
  },
]

function resultFor(score: number) {
  return [...RESULTS].reverse().find(r => score >= r.min) ?? RESULTS[0]
}

type Phase = 'signup' | 'test' | 'result'

// A mycelium sprout that grows with every "yes".
function Sprout({ growth }: { growth: number }) {
  const reduce = useReducedMotion()
  const t = reduce ? { duration: 0 } : { duration: 0.9, ease: 'easeOut' as const }
  const leaves = [
    { d: 'M100 150 C 80 140, 70 125, 72 112 C 88 116, 98 130, 100 150', at: 0.2 },
    { d: 'M100 125 C 120 116, 132 100, 130 88 C 114 92, 102 106, 100 125', at: 0.4 },
    { d: 'M100 100 C 80 92, 72 76, 74 64 C 90 68, 99 82, 100 100', at: 0.6 },
    { d: 'M100 78 C 118 70, 128 56, 126 44 C 110 48, 101 61, 100 78', at: 0.8 },
  ]
  return (
    <svg viewBox="0 0 200 220" className="w-full h-full" aria-hidden="true">
      {/* mycelium threads in the ground */}
      {[0, 1, 2, 3, 4].map(i => (
        <motion.path
          key={i}
          d={`M100 182 Q ${60 + i * 20} ${196 + (i % 2) * 8}, ${30 + i * 35} ${206 - (i % 3) * 4}`}
          fill="none"
          stroke={WARM_MID}
          strokeWidth={1}
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.55 }}
          transition={reduce ? { duration: 0 } : { duration: 1.6, delay: i * 0.15 }}
        />
      ))}
      <line x1="20" y1="182" x2="180" y2="182" stroke={CHARCOAL} strokeOpacity={0.25} strokeWidth={1} />
      <circle cx="100" cy="182" r="4" fill={WARM_DARK} />
      {/* stem */}
      <motion.path
        d="M100 182 C 100 150, 100 100, 100 40"
        fill="none"
        stroke={WARM_DARK}
        strokeWidth={1.6}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: Math.max(0.04, growth) }}
        transition={t}
      />
      {leaves.map(leaf => (
        <motion.path
          key={leaf.d}
          d={leaf.d}
          fill={WARM_MID}
          fillOpacity={0.35}
          stroke={WARM_DARK}
          strokeWidth={1.2}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: growth >= leaf.at ? 1 : 0, scale: growth >= leaf.at ? 1 : 0.6 }}
          style={{ transformOrigin: '100px 120px' }}
          transition={t}
        />
      ))}
      <motion.circle
        cx="100"
        cy="38"
        r="7"
        fill={CREAM}
        stroke={WARM_DARK}
        strokeWidth={1.4}
        initial={{ opacity: 0 }}
        animate={{ opacity: growth >= 1 ? 1 : 0 }}
        transition={t}
      />
    </svg>
  )
}

function CountUp({ to }: { to: number }) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    let current = 0
    const id = setInterval(() => {
      current += 1
      setValue(Math.min(current, to))
      if (current >= to) clearInterval(id)
    }, 90)
    return () => clearInterval(id)
  }, [to])
  return <>{value}</>
}

export default function GrowClient() {
  const [phase, setPhase] = useState<Phase>('signup')
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [product, setProduct] = useState('')
  const [answers, setAnswers] = useState<boolean[]>([])
  const [copied, setCopied] = useState(false)
  const [sampleStatus, setSampleStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')

  const step = answers.length
  const yesCount = answers.filter(Boolean).length
  const score = phase === 'result' ? yesCount : 0
  const result = resultFor(yesCount)
  const growth = phase === 'signup' ? 0 : yesCount / 10

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    if (!email || status === 'loading') return
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, website, requestType: 'grow_test', source: 'grow-landing' }),
      })
      if (!res.ok) throw new Error('failed')
      setStatus('idle')
      setPhase('test')
    } catch {
      setStatus('error')
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

  function restart() {
    setAnswers([])
    setProduct('')
    setCopied(false)
    setPhase('test')
  }

  const teamSummary = [
    'Can Your Packaging Be Grown? (NUMU)',
    `Product tested: ${product || '-'}`,
    `Score: ${yesCount} / 10 (${result.label})`,
    `"No" answers: ${answers.map((a, i) => (a ? null : i + 1)).filter(Boolean).join(', ') || 'none'}`,
    'Today’s insert (material, approx. grams): ',
    'Next step: ',
    'Owner: ',
  ].join('\n')

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(teamSummary)
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
        body: JSON.stringify({ email, website: '', requestType: 'samples', source: `grow-result-${yesCount}` }),
      })
      setSampleStatus(res.ok ? 'sent' : 'error')
    } catch {
      setSampleStatus('error')
    }
  }

  return (
    <main className="min-h-screen font-sans" style={{ backgroundColor: CREAM, color: CHARCOAL }}>
      <header className="flex items-center justify-between px-6 md:px-12 py-6" style={{ borderBottom: BORDER }}>
        <Link href="/" className="font-display text-xl tracking-wide">NUMU</Link>
        <span className="uppercase text-label tracking-[0.18em]" style={{ opacity: 0.6 }}>
          PALMYCO · Packaging pilot
        </span>
      </header>

      <section className="grid md:grid-cols-[1.2fr_0.8fr] gap-10 px-6 md:px-12 py-12 md:py-20 max-w-6xl mx-auto items-center">
        <div>
          <AnimatePresence mode="wait">
            {phase === 'signup' && (
              <motion.div key="signup" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                <p className="uppercase text-label tracking-[0.18em] mb-5" style={{ color: WARM_DARK }}>
                  A 5-minute test
                </p>
                <h1 className="font-display text-5xl md:text-7xl leading-[1.02] mb-6">
                  Can Your Packaging Be Grown?
                </h1>
                <p className="text-lg max-w-xl mb-3" style={{ opacity: 0.8, lineHeight: 1.6 }}>
                  Find the right first product for a grown-packaging pilot. The outside of a premium pack tells a
                  sustainability story. This test checks whether the inside can tell it too.
                </p>
                <p className="text-sm max-w-xl mb-8" style={{ opacity: 0.55, lineHeight: 1.6 }}>
                  A screening test, not a product claim. NUMU&apos;s protective packaging is in development, made in
                  Dubai from regional agricultural waste.
                </p>

                <form onSubmit={handleSignup} className="flex flex-col sm:flex-row gap-3 max-w-xl">
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
                    id="grow-email"
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@company.com"
                    disabled={status === 'loading'}
                    className="flex-1 px-5 py-4 bg-transparent outline-none text-sm"
                    style={{ border: BORDER }}
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="uppercase tracking-[0.14em] text-xs px-7 py-4"
                    style={{ backgroundColor: CHARCOAL, color: CREAM, opacity: status === 'loading' ? 0.6 : 1 }}
                  >
                    {status === 'loading' ? 'Starting…' : 'Start the test'}
                  </button>
                </form>
                {status === 'error' && (
                  <p className="text-sm mt-3" style={{ color: '#8a3b2a' }} role="alert">
                    Something went wrong. Please try again, or email andy@numu.bio.
                  </p>
                )}
                <p className="text-xs mt-3" style={{ opacity: 0.5 }}>
                  We email you the test and two short follow-ups. Reply STOP any time.
                </p>

                <div className="mt-10 p-6 max-w-xl" style={{ border: BORDER }}>
                  <p className="uppercase text-label tracking-[0.18em] mb-2" style={{ opacity: 0.55 }}>
                    Question 1 of 10
                  </p>
                  <p className="font-display text-xl leading-snug">{QUESTIONS[0]}</p>
                </div>
              </motion.div>
            )}

            {phase === 'test' && (
              <motion.div key="test" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                {step === 0 && (
                  <div className="mb-8 max-w-xl">
                    <label htmlFor="grow-product" className="uppercase text-label tracking-[0.18em]" style={{ opacity: 0.6 }}>
                      Which product are you testing? (optional)
                    </label>
                    <input
                      id="grow-product"
                      type="text"
                      value={product}
                      onChange={e => setProduct(e.target.value)}
                      maxLength={120}
                      placeholder="For example: a gift box of dates"
                      className="mt-2 w-full px-5 py-3 bg-transparent outline-none text-sm"
                      style={{ border: BORDER }}
                    />
                  </div>
                )}

                <div className="flex gap-1.5 mb-6" aria-hidden="true">
                  {QUESTIONS.map((_, i) => (
                    <div
                      key={i}
                      className="h-1 flex-1 transition-colors duration-300"
                      style={{ backgroundColor: i < step ? (answers[i] ? WARM_DARK : WARM_MID) : 'rgba(26,23,20,0.12)' }}
                    />
                  ))}
                </div>
                <p className="uppercase text-label tracking-[0.18em] mb-3" style={{ opacity: 0.55 }}>
                  Question {step + 1} of 10
                </p>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={step}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.25 }}
                    className="font-display text-3xl md:text-4xl leading-tight mb-10 max-w-xl min-h-[7rem]"
                  >
                    {QUESTIONS[step]}
                  </motion.p>
                </AnimatePresence>
                <div className="flex gap-3">
                  {[true, false].map(value => (
                    <button
                      key={String(value)}
                      onClick={() => answer(value)}
                      className="uppercase tracking-[0.14em] text-xs px-10 py-4 transition-transform hover:-translate-y-0.5"
                      style={value ? { backgroundColor: CHARCOAL, color: CREAM } : { border: BORDER }}
                    >
                      {value ? 'Yes' : 'No'}
                    </button>
                  ))}
                  {step > 0 && (
                    <button onClick={() => setAnswers(answers.slice(0, -1))} className="text-xs underline ml-2" style={{ opacity: 0.55 }}>
                      Back
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {phase === 'result' && (
              <motion.div key="result" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} aria-live="polite">
                <p className="uppercase text-label tracking-[0.18em] mb-3" style={{ color: WARM_DARK }}>
                  Your growability score{product ? ` for ${product}` : ''}
                </p>
                <p className="font-display text-7xl md:text-8xl leading-none mb-2">
                  <CountUp to={score} /><span className="text-3xl" style={{ opacity: 0.4 }}> / 10</span>
                </p>
                <p className="font-display text-3xl mb-4">{result.label}</p>
                <p className="text-base max-w-xl mb-8" style={{ opacity: 0.8, lineHeight: 1.6 }}>{result.text}</p>

                <div className="p-6 max-w-xl mb-6" style={{ border: BORDER }}>
                  <p className="uppercase text-label tracking-[0.18em] mb-3" style={{ opacity: 0.55 }}>Send this to your team</p>
                  <pre className="text-xs whitespace-pre-wrap font-sans mb-4" style={{ opacity: 0.8, lineHeight: 1.7 }}>{teamSummary}</pre>
                  <button onClick={copySummary} className="uppercase tracking-[0.14em] text-xs px-5 py-3" style={{ border: BORDER }}>
                    {copied ? 'Copied' : 'Copy summary'}
                  </button>
                </div>

                <div className="p-6 max-w-xl mb-8" style={{ backgroundColor: 'rgba(178,155,127,0.14)' }}>
                  <p className="uppercase text-label tracking-[0.18em] mb-2" style={{ opacity: 0.6 }}>See your product in grown packaging</p>
                  <p className="text-sm" style={{ lineHeight: 1.7, opacity: 0.85 }}>
                    PALMYCO is grown to fit the shape of your product. Reply to our email with your product&apos;s size
                    and a photo, and we will send you one AI concept render of a grown insert made for it. It is an
                    illustration, not a photo of a real prototype.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 max-w-xl mb-4">
                  <button
                    onClick={requestSampleBox}
                    className="uppercase tracking-[0.14em] text-xs px-7 py-4"
                    style={{ backgroundColor: CHARCOAL, color: CREAM, opacity: sampleStatus === 'loading' ? 0.6 : 1 }}
                  >
                    {sampleStatus === 'sent' ? 'Sample box requested' : 'Request a free sample box'}
                  </button>
                  <a
                    href="mailto:andy@numu.bio?subject=Bespoke%20prototype%20request%20(AED%20500)"
                    className="uppercase tracking-[0.14em] text-xs px-7 py-4 text-center"
                    style={{ border: BORDER }}
                  >
                    Bespoke prototype · AED 500
                  </a>
                </div>
                {sampleStatus === 'error' && (
                  <p className="text-sm mb-3" style={{ color: '#8a3b2a' }} role="alert">Please try again, or email andy@numu.bio.</p>
                )}
                <p className="text-xs max-w-xl mb-6" style={{ opacity: 0.55, lineHeight: 1.6 }}>
                  We send 5 free sample boxes a month. The AED 500 prototype for one product is credited in full against
                  your first order (subject to production capacity) and made in Dubai in 4 to 5 weeks.
                </p>
                <button onClick={restart} className="text-xs underline" style={{ opacity: 0.55 }}>
                  Test another product
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative aspect-[10/11] max-w-sm w-full mx-auto">
          <Sprout growth={growth} />
          <p className="absolute bottom-0 left-0 right-0 text-center uppercase text-label tracking-[0.18em]" style={{ opacity: 0.5 }}>
            {phase === 'signup' ? 'Grown, not manufactured' : `${yesCount} of 10 growing conditions met`}
          </p>
        </div>
      </section>

      <footer className="px-6 md:px-12 py-8 text-xs flex justify-between" style={{ borderTop: BORDER, opacity: 0.6 }}>
        <span>Grown, not manufactured. NUMU, Dubai.</span>
        <Link href="/" className="underline">numu.bio</Link>
      </footer>
    </main>
  )
}
