'use client'

import Image from '@/components/SafariSafeImage'
import type { InvestorStory } from '@/lib/investorStory'
import { animate, motion, useInView, useReducedMotion } from 'framer-motion'
import { useEffect, useRef } from 'react'

const photos: Record<string, { src: string; alt: string }[]> = {
  material: [
    { src: '/images/materials/palm_leaf_substrate.png', alt: 'Palm fibre substrate used for grown materials' },
    { src: '/images/projects/Pressed_samples.jpg', alt: 'Pressed material samples' },
  ],
  traction: [
    { src: '/images/catalogue/fold/fold-drying-rack.jpg', alt: 'FOLD panels drying on a rack' },
    { src: '/images/user/fold-panel-studio.jpg', alt: 'FOLD relief panel photographed in the studio' },
  ],
}

function CountUp({ value, label, prefix = '', suffix = '', decimals = 0 }: NonNullable<InvestorStory['sections'][number]['stats']>[number]) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (!inView || reduceMotion) return
    const animation = animate(0, value, {
      duration: 1.3,
      ease: [0.25, 0.1, 0, 1],
      onUpdate: (number) => {
        if (ref.current) ref.current.textContent = prefix + number.toFixed(decimals) + suffix
      },
    })
    return animation.stop
  }, [decimals, inView, prefix, reduceMotion, suffix, value])

  const formatted = prefix + value.toFixed(decimals) + suffix
  return (
    <div className="border-t border-white/15 pt-5">
      <p className="font-display text-4xl text-[#d3bc98] md:text-6xl">
        <span className="sr-only">{formatted}</span>
        <span ref={ref} aria-hidden="true">{formatted}</span>
      </p>
      <p className="mt-2 font-sans text-sm text-white/70">{label}</p>
    </div>
  )
}

export default function InvestorView({ story }: { story: InvestorStory }) {
  const reduceMotion = useReducedMotion()

  return (
    <div className="mx-auto max-w-[1440px] px-6 md:px-12">
      {story.sections.map(section => (
        <section key={section.id} id={section.id} aria-labelledby={`investor-${section.id}`} className="scroll-mt-24 border-t border-white/15 py-16 md:py-24">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0.65, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 'some' }}
            transition={{ duration: 0.55 }}
          >
            <p className="mb-5 font-sans text-xs uppercase tracking-[0.2em] text-[#d3bc98]">{section.label}</p>
            <h2 id={`investor-${section.id}`} className="max-w-4xl font-display text-4xl leading-[1.03] tracking-tight md:text-6xl">{section.heading}</h2>
            {section.intro && <p className="mt-6 max-w-3xl font-sans text-base leading-relaxed text-white/80 md:text-lg">{section.intro}</p>}
            {section.stats && (
              <div className="mt-9 grid gap-7 md:grid-cols-2">
                {section.stats.map(stat => <CountUp key={stat.label} {...stat} />)}
              </div>
            )}
            {section.cards && (
              <div className="mt-9 grid gap-x-8 gap-y-6 md:grid-cols-2 lg:grid-cols-3">
                {section.cards.map(card => (
                  <div key={card.title} className="border-t border-white/15 pt-5">
                    <h3 className="font-display text-2xl">{card.title}</h3>
                    <p className="mt-2 max-w-md font-sans text-sm leading-relaxed text-white/75">{card.body}</p>
                  </div>
                ))}
              </div>
            )}
            {photos[section.id] && (
              <div className="mt-9 grid grid-cols-2 gap-3">
                {photos[section.id].map(photo => (
                  <div key={photo.src} className="relative aspect-[4/3] overflow-hidden bg-white/5 md:aspect-[16/9]">
                    <Image src={photo.src} alt={photo.alt} fill sizes="45vw" className="object-cover" />
                  </div>
                ))}
              </div>
            )}
            {section.projection && (
              <div className="mt-8 space-y-3" aria-label="Five-year revenue and EBITDA projection">
                {section.projection.map(row => (
                  <div key={row.year} className="grid grid-cols-[3.5rem_1fr] items-center gap-x-3 gap-y-2 border-t border-white/15 pt-3 font-sans text-sm md:grid-cols-[5rem_1fr_8rem_10rem]">
                    <span>{row.year}</span>
                    <div className="h-2 overflow-hidden bg-white/10" aria-hidden="true">
                      <motion.div
                        className="h-full bg-[#b29b7f]"
                        style={{ width: `${100 * row.revenue / Math.max(...section.projection!.map(item => item.revenue))}%`, transformOrigin: 'left' }}
                        initial={reduceMotion ? false : { scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                      />
                    </div>
                    <span className="col-start-2 md:col-start-auto">USD {row.revenue.toFixed(2)}M revenue</span>
                    <span className="col-start-2 text-white/75 md:col-start-auto">{row.ebitda} EBITDA</span>
                  </div>
                ))}
              </div>
            )}
            {section.note && <p className="mt-7 max-w-3xl font-sans text-sm leading-relaxed text-white/65">{section.note}</p>}
          </motion.div>
        </section>
      ))}
      <section className="border-t border-white/15 py-16 md:py-24">
        <h2 className="mb-5 font-display text-4xl md:text-5xl">Talk with Andy.</h2>
        <a href="mailto:andy@numu.bio?subject=NUMU%20seed%20round" className="inline-block border border-white/30 px-6 py-4 font-sans text-sm">Contact the founder →</a>
      </section>
    </div>
  )
}
