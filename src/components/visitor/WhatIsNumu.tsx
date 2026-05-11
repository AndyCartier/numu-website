'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'

const fade = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
}

export function WhatIsNumu() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      id="material"
      ref={ref}
      className="bg-numu-cream py-24 md:py-36 overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left: text */}
          <div>
            <motion.span
              className="section-label block mb-8"
              variants={fade}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              custom={0}
            >
              What is NUMU
            </motion.span>

            <motion.h2
              className="font-display text-headline text-numu-dark mb-10"
              variants={fade}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              custom={1}
            >
              Bio-engineered materials grown from natural fibers.
            </motion.h2>

            <motion.p
              className="font-sans text-base md:text-lg leading-relaxed text-numu-bark max-w-lg"
              variants={fade}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              custom={2}
            >
              NUMU develops bio-engineered materials grown from natural fibers
              to replace synthetic foams in architecture and design. Starting
              with acoustic performance, expanding into thermal insulation and
              beyond.
            </motion.p>

            {/* Properties */}
            <motion.div
              className="mt-14 grid grid-cols-3 gap-px bg-numu-sand"
              variants={fade}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              custom={3}
            >
              {[
                { label: 'Origin', value: 'Natural fibers' },
                { label: 'Category', value: 'Bio-material' },
                { label: 'Base', value: 'UAE' },
              ].map((item) => (
                <div key={item.label} className="bg-numu-cream py-6 pr-6">
                  <div className="section-label mb-2">{item.label}</div>
                  <div className="font-display text-lg text-numu-dark">{item.value}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: texture image */}
          <motion.div
            className="relative aspect-[4/5] lg:aspect-auto lg:h-[600px] overflow-hidden"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src="/images/textures/texture_closeup_01.jpg"
              alt="NUMU material texture — close up"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {/* Subtle overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-numu-cream/20 to-transparent" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
