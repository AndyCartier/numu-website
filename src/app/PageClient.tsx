'use client'

import { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import type { VisitorContent, InvestorContent } from '@/lib/content'
import { IS, IL, IH2, IBody, iBorder, iBorderSoft } from '@/components/investor/shared'
import {
  PlatformDiagram,
  BusinessModelDiagram,
  MarketDiagram,
  RoadmapDiagram,
  UnitEconomicsBars,
  FundingDonut,
} from '@/components/investor/InvestorDiagrams'
import { ProcessDiagram } from '@/components/visitor/ProcessDiagram'

const ModelViewer = dynamic(
  () => import('@/components/hero/ModelViewer').then(m => m.ModelViewer),
  { ssr: false }
)

// ─── Theme ────────────────────────────────────────────────────────────────────

const VISITOR  = { bg: '#f5f1e8', fg: '#1a1714' }
const INVESTOR = { bg: '#0e0e0e', fg: '#f5f1e8' }

const borderMid  = '1px solid rgba(128,128,128,0.15)'
const borderSoft = '1px solid rgba(128,128,128,0.09)'

// ─── Visitor primitives ───────────────────────────────────────────────────────

function Label({ text }: { text: string }) {
  return (
    <p className="font-sans text-label uppercase tracking-[0.18em] mb-6" style={{ opacity: 0.52, letterSpacing: '0.18em' }}>
      {text}
    </p>
  )
}

function H2({ text }: { text: string }) {
  return <h2 className="font-display text-headline mb-10 max-w-3xl" style={{ textWrap: 'balance' }}>{text}</h2>
}

function Body({ text }: { text: string }) {
  return (
    <p className="font-sans text-base md:text-[1.0625rem] leading-[1.75] mb-12 max-w-2xl" style={{ opacity: 0.65 }}>
      {text}
    </p>
  )
}


function S({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="px-6 md:px-12 py-40 md:py-52" style={{ borderTop: borderMid }}>
      <div className="max-w-[1440px] mx-auto">{children}</div>
    </section>
  )
}

// ─── Cinematic video section ──────────────────────────────────────────────────

function CinematicVideo() {
  const [playing, setPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  function handleOverlayClick() {
    const v = videoRef.current
    if (!v) return
    v.play()
    setPlaying(true)
  }

  function handleVideoClick() {
    const v = videoRef.current
    if (!v || !playing) return
    v.pause()
    setPlaying(false)
  }

  return (
    <section
      className="px-6 md:px-12 py-32 md:py-44"
      style={{ borderTop: borderMid }}
    >
      <div className="max-w-[1440px] mx-auto">
        {/* Label + caption */}
        <div className="mb-12">
          <p className="font-sans text-label uppercase tracking-[0.18em] mb-4" style={{ opacity: 0.38 }}>
            Production
          </p>
          <p className="font-sans text-base max-w-md" style={{ opacity: 0.48, lineHeight: 1.7 }}>
            Inside the NUMU production lab, Dubai. Mycelium grown from regional agricultural waste into construction-grade material.
          </p>
        </div>

        {/* Video block */}
        <div
          className="relative overflow-hidden mx-auto"
          style={{ aspectRatio: '16/9', maxWidth: '960px' }}
        >
          {/* Video element — no autoplay, no muted, plays with sound on click */}
          <video
            ref={videoRef}
            src="/videos/numu_story_enhanced.mp4"
            className="w-full h-full object-cover block"
            playsInline
            preload="metadata"
            onClick={handleVideoClick}
            onEnded={() => setPlaying(false)}
          />

          {/* Dark overlay — fades out when playing */}
          <div
            onClick={handleOverlayClick}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(10,8,6,0.52)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              opacity: playing ? 0 : 1,
              transition: 'opacity 0.55s cubic-bezier(0.4,0,0.2,1)',
              pointerEvents: playing ? 'none' : 'auto',
            }}
          >
            {/* Minimal play button — thin circle, small triangle */}
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                border: '1px solid rgba(245,241,232,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'border-color 0.2s, transform 0.2s',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget
                el.style.borderColor = 'rgba(245,241,232,0.9)'
                el.style.transform = 'scale(1.06)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget
                el.style.borderColor = 'rgba(245,241,232,0.5)'
                el.style.transform = 'scale(1)'
              }}
            >
              {/* Play triangle — offset 1px right to optically center */}
              <svg width="14" height="16" viewBox="0 0 14 16" fill="none" style={{ marginLeft: '2px' }}>
                <path d="M1 1 L13 8 L1 15 Z" fill="rgba(245,241,232,0.85)" />
              </svg>
            </div>
          </div>
        </div>

        {/* Pause hint — appears only while playing */}
        <p
          className="font-sans text-label uppercase tracking-[0.16em] mt-5 text-center"
          style={{
            opacity: playing ? 0.22 : 0,
            transition: 'opacity 0.4s 0.6s',
            fontSize: '11px',
          }}
        >
          Click to pause
        </p>
      </div>
    </section>
  )
}

// ─── Visitor sections ─────────────────────────────────────────────────────────

function VisitorSections({ v }: { v: VisitorContent }) {
  return (
    <>
      {/* 01 — Platform statement */}
      <S id="statement">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-14 lg:gap-20 items-start">
          <div className="lg:pt-2 lg:sticky lg:top-32">
            <Label text={v.statement.label} />
            <h2
              className="font-display mb-8"
              style={{ fontSize: 'clamp(2rem, 3.5vw, 3.75rem)', lineHeight: '1.06', letterSpacing: '-0.03em', textWrap: 'balance' }}
            >
              {v.statement.heading}
            </h2>
            <p className="font-sans leading-[1.75] mb-5 max-w-md" style={{ fontSize: '1rem', opacity: 0.65 }}>
              NUMU&apos;s proprietary material system uses mycelium — nature&apos;s binding network — to transform regional agricultural waste into construction-grade systems. Instead of relying on synthetic foams or mineral fibers, performance is grown directly into the material.
            </p>
            <p className="font-sans leading-[1.75] max-w-md" style={{ fontSize: '0.9375rem', opacity: 0.5 }}>
              Its structure can be tuned during growth for density, porosity, and application, enabling one core platform to evolve across acoustic panels, insulation, and molded protective forms. The result is a new category of material designed for local production, circularity, and architectural use.
            </p>
          </div>
          <div className="relative overflow-hidden">
            <video src="/videos/your-video.mp4" autoPlay muted loop playsInline className="w-full block" suppressHydrationWarning />
            <div
              className="absolute bottom-0 left-0 right-0 z-10 flex items-end px-8 pb-8"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%)', paddingTop: '80px' }}
            >
              <p className="font-display text-white" style={{ fontSize: 'clamp(1.25rem, 2.5vw, 2rem)' }}>Material in motion</p>
            </div>
          </div>
        </div>
      </S>

      {/* 02 — Core material: Biofoam */}
      <S id="material">
        {/* Grid stretches both columns to the same height, enabling bottom-alignment of substrate images */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-16 lg:gap-20">
          {/* Left — flex column so substrate images can be pushed to bottom */}
          <div className="flex flex-col">
            <div>
              <Label text={v.material.label} />
              <h2
                className="font-display mb-8"
                style={{ fontSize: 'clamp(2rem, 3.5vw, 3.5rem)', lineHeight: '1.08', letterSpacing: '-0.03em', textWrap: 'balance' }}
              >
                Biofoam — grown, not manufactured.
              </h2>
              <p className="font-sans leading-[1.75] mb-5" style={{ fontSize: '1rem', opacity: 0.65 }}>
                Biofoam is NUMU&apos;s core material system — a grown composite where mycelium acts as a natural binding network around regional plant fibers and agricultural residues.
              </p>
              <p className="font-sans leading-[1.75] mb-5" style={{ fontSize: '0.9375rem', opacity: 0.5 }}>
                The result is a rigid, lightweight panel that absorbs sound, resists moisture, and reaches end-of-life without leaving synthetic residue. No binders. No petroleum. No waste.
              </p>
              <p className="font-sans leading-[1.75]" style={{ fontSize: '0.9375rem', opacity: 0.45 }}>
                Because performance is engineered into the growth process itself, properties can be tuned per application — from dense acoustic cores to open-celled thermal matrices.
              </p>
            </div>

            {/* Substrate images — pushed to bottom of column, bottom-aligned with biofoam image */}
            <div className="mt-auto pt-12" style={{ borderTop: '1px solid rgba(128,128,128,0.1)', marginTop: 'auto' }}>
              <p className="font-sans uppercase tracking-[0.16em] mb-5" style={{ fontSize: '9px', opacity: 0.35 }}>
                Substrate inputs — regional agricultural residues
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="relative w-full overflow-hidden mb-3" style={{ aspectRatio: '3/2' }}>
                    <Image
                      src="/images/materials/palm_leaf_substrate.png"
                      alt="Palm leaf agricultural substrate"
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                  <p className="font-sans" style={{ fontSize: '11px', opacity: 0.42, letterSpacing: '0.04em' }}>Palm leaf fibre</p>
                </div>
                <div>
                  <div className="relative w-full overflow-hidden mb-3" style={{ aspectRatio: '3/2' }}>
                    <Image
                      src="/images/materials/plant_fiber_substrate.png"
                      alt="Plant fibre agricultural substrate"
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                  <p className="font-sans" style={{ fontSize: '11px', opacity: 0.42, letterSpacing: '0.04em' }}>Plant fibre blend</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: biofoam — fills column height set by left column */}
          <div className="relative overflow-hidden aspect-[3/4] lg:aspect-auto">
            <Image
              src="/images/products/biofoam_detail.png"
              alt="NUMU biofoam — material study"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </S>

      {/* 03 — Platform overview: three applications as a system */}
      <S id="applications">
        <Label text="The Platform" />
        <H2 text="One material platform, many applications." />
        <p className="font-sans leading-[1.75] mb-14 max-w-2xl" style={{ fontSize: '1rem', opacity: 0.58 }}>
          NUMU begins with acoustic panels as the first commercial application, while thermal systems and protective packaging extend the platform into broader construction and industrial use.
        </p>

        {/* Three application cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Acoustic',
              status: 'Market entry',
              active: true,
              desc: 'Bio-engineered acoustic panels replacing PET, mineral wool, and PU foam in interior fit-outs. First certified product.',
              image: '/images/materials/acoustic render 05.png',
              imageAlt: 'NUMU acoustic panels — installation view',
              rotate: false,
            },
            {
              title: 'Thermal',
              status: 'In development',
              active: false,
              desc: 'Passive insulation systems grown from palm fibre and mycelium, designed for hot-climate wall assemblies.',
              image: '/images/applications/thermal_panel_wall.png',
              imageAlt: 'NUMU thermal panel — wall system',
              rotate: false,
            },
            {
              title: 'Packaging',
              status: 'In development',
              active: false,
              desc: 'Molded protective packaging grown into shape — an alternative to petroleum-based foam for logistics and shipping.',
              image: '/images/applications/packaging_protective.png',
              imageAlt: 'NUMU protective packaging',
              rotate: true,
            },
          ].map(card => (
            <div key={card.title} style={{ border: borderMid }}>
              {/* Square image */}
              <div className="relative w-full overflow-hidden" style={{ aspectRatio: '1/1' }}>
                {card.rotate ? (
                  /* Packaging: inner wrapper rotated so the fill image content rotates correctly */
                  <div style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}>
                    <Image
                      src={card.image}
                      alt={card.imageAlt}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                ) : (
                  <Image
                    src={card.image}
                    alt={card.imageAlt}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                )}
                {/* Status badge */}
                <div className="absolute bottom-3 left-3">
                  <span
                    className="font-sans uppercase"
                    style={{
                      fontSize: '9px',
                      letterSpacing: '0.14em',
                      padding: '4px 8px',
                      backgroundColor: card.active ? 'rgba(26,23,20,0.82)' : 'rgba(26,23,20,0.48)',
                      color: '#f5f1e8',
                    }}
                  >
                    {card.status}
                  </span>
                </div>
              </div>
              {/* Caption */}
              <div className="px-5 py-6">
                <p
                  className="font-display mb-2"
                  style={{ fontSize: '1.25rem', letterSpacing: '-0.02em', opacity: card.active ? 1 : 0.55 }}
                >
                  {card.title}
                </p>
                <p className="font-sans leading-relaxed" style={{ fontSize: '13px', opacity: card.active ? 0.48 : 0.32 }}>
                  {card.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </S>

      {/* 04 — FOLD: first product */}
      <S id="fold">
        <Label text="Product — FOLD" />
        {/* Large product name + two-column intro text */}
        <div className="mb-12 grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-8 lg:gap-14 items-end">
          <h2
            className="font-display"
            style={{ fontSize: 'clamp(4rem, 9vw, 10rem)', lineHeight: '0.88', letterSpacing: '-0.04em' }}
          >
            FOLD
          </h2>
          {/* Two-column text: product explanation left, design inspiration right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 lg:pb-2">
            <p className="font-sans leading-[1.75]" style={{ fontSize: '1rem', opacity: 0.6 }}>
              FOLD is NUMU&apos;s first product — a modular acoustic panel system grown from bio-based material and designed for interior architecture. It translates the material platform into a real, specification-ready object: tactile, scalable, and visually distinctive.
            </p>
            <p className="font-sans leading-[1.75]" style={{ fontSize: '0.9375rem', opacity: 0.44 }}>
              Fold takes its name from the forces that shape it — the movement of fabric, the softness of drapery, and the way wind carves folds into sand and dunes. The result is a modular acoustic surface that feels both natural and architectural.
            </p>
          </div>
        </div>

        {/* A. Solo panel — product as object */}
        <div className="mb-3 relative w-full overflow-hidden" style={{ aspectRatio: '16/9', backgroundColor: 'rgba(128,128,128,0.04)' }}>
          <Image
            src="/images/products/fold_solo_panel.png"
            alt="FOLD — acoustic panel, product view"
            fill
            className="object-contain object-center"
            sizes="(max-width: 1440px) 100vw, 1440px"
          />
        </div>

        {/* B. Hero — dominant installed context */}
        <div className="mb-3 relative w-full overflow-hidden" style={{ aspectRatio: '16/9' }}>
          <Image
            src="/images/products/fold_hero_interior.png"
            alt="FOLD — interior installation"
            fill
            className="object-cover object-center"
            sizes="(max-width: 1440px) 100vw, 1440px"
          />
        </div>

        {/* C. Architectural context + video — bottom-aligned, shared height */}
        <div
          className="grid"
          style={{ gridTemplateColumns: '1fr 1.25fr', gap: '8px', height: 'clamp(220px, 34vw, 520px)' }}
        >
          <div className="relative overflow-hidden h-full">
            <Image
              src="/images/products/fold_context_scale.png"
              alt="FOLD — architectural scale"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 55vw"
            />
          </div>
          <div className="relative overflow-hidden h-full">
            <video
              src="/videos/numu_story.mp4"
              autoPlay muted loop playsInline
              className="w-full h-full object-cover block"
              suppressHydrationWarning
            />
          </div>
        </div>
      </S>

      {/* Thermal — future application */}
      <section id="thermal" className="px-6 md:px-12 py-28 md:py-36" style={{ borderTop: borderMid }}>
        <div className="max-w-[1440px] mx-auto">
          <p className="font-sans uppercase tracking-[0.18em] mb-10" style={{ fontSize: '0.6875rem', opacity: 0.5, letterSpacing: '0.18em' }}>
            Applications — Thermal
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-20 items-start">
            {/* Image: natural dimensions, no crop */}
            <div className="w-full overflow-hidden">
              <Image
                src="/images/applications/thermal_panel_wall.png"
                alt="NUMU thermal panel — wall integration"
                width={2400}
                height={1350}
                style={{ width: '100%', height: 'auto', display: 'block' }}
                sizes="(max-width: 1440px) 100vw, 60vw"
              />
            </div>
            {/* Text */}
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
              <p className="font-sans uppercase tracking-[0.16em] mt-8" style={{ fontSize: '9px', opacity: 0.28 }}>
                Currently in development — NUMU material platform
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Packaging — future application, text left / image right */}
      <section id="packaging" className="px-6 md:px-12 py-28 md:py-36" style={{ borderTop: borderMid }}>
        <div className="max-w-[1440px] mx-auto">
          <p className="font-sans uppercase tracking-[0.18em] mb-10" style={{ fontSize: '0.6875rem', opacity: 0.5, letterSpacing: '0.18em' }}>
            Applications — Packaging
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8 lg:gap-12 items-start">
            {/* Text — top-aligned with image */}
            <div>
              <p className="font-display mb-5" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.75rem)', lineHeight: '1.1', letterSpacing: '-0.025em', opacity: 0.8 }}>
                Molded protection, grown not manufactured.
              </p>
              <p className="font-sans leading-[1.75] mb-4" style={{ fontSize: '0.9375rem', opacity: 0.48 }}>
                NUMU materials can be shaped into protective packaging forms, offering a compostable alternative to petroleum-based foams.
              </p>
              <p className="font-sans leading-[1.75] mb-4" style={{ fontSize: '0.9375rem', opacity: 0.48 }}>
                Each piece is grown into shape, reducing waste while maintaining shock absorption and structural integrity.
              </p>
              <p className="font-sans uppercase tracking-[0.16em] mt-6" style={{ fontSize: '9px', opacity: 0.28 }}>
                Scalable application — logistics and product protection
              </p>
            </div>
            {/* Image: square container, inner wrapper rotated -90° for correct bottle orientation */}
            <div className="relative overflow-hidden w-full" style={{ aspectRatio: '1/1' }}>
              <div style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}>
                <Image
                  src="/images/applications/packaging_protective.png"
                  alt="NUMU protective packaging — molded form"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 05 — Process */}
      <S id="process">
        <Label text={v.process.label} />
        <H2 text={v.process.heading} />
        <ProcessDiagram />
      </S>

      {/* Cinematic video — production / human presence */}
      <CinematicVideo />

      {/* 06 — Installations */}
      <S id="installations">
        <Label text="Installations" />
        <H2 text="Two installations. Real conditions." />
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { project: 'Beyond Chrysant', location: 'Netherlands — 2022' },
            { project: 'KAVE',            location: 'Dubai, UAE — 2025'  },
          ].map(item => (
            <div key={item.project}>
              <div
                className="relative w-full mb-6 flex flex-col items-center justify-center gap-3"
                style={{ aspectRatio: '16/9', border: '1px dashed rgba(128,128,128,0.3)', backgroundColor: 'rgba(128,128,128,0.04)' }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2}
                  strokeLinecap="round" strokeLinejoin="round" width={28} height={28} style={{ opacity: 0.25 }}>
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
                <p className="font-sans text-center" style={{ fontSize: '12px', opacity: 0.28 }}>Photo coming soon</p>
              </div>
              <Label text={item.location} />
              <p className="font-display text-xl md:text-2xl">{item.project}</p>
            </div>
          ))}
        </div>
      </S>

      {/* 07 — Founder */}
      <S id="founder">
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-16 lg:gap-20 items-start">
          <div className="relative overflow-hidden" style={{ aspectRatio: '3/4' }}>
            <Image src="/images/founder/Portrait.PNG" alt="NUMU Founder" fill className="object-cover object-top" sizes="(max-width: 1024px) 100vw, 55vw" />
          </div>
          <div className="lg:pt-4 flex flex-col justify-between h-full">
            <div>
              <Label text={v.founder.label} />
              <H2 text={v.founder.heading} />
              <Body text={v.founder.body} />
            </div>
            <div className="pt-8 mt-auto" style={{ borderTop: borderMid }}>
              <Label text={v.founder.role} />
            </div>
          </div>
        </div>
      </S>

      {/* 08 — Contact */}
      <S id="contact">
        <Label text={v.contact.label} />
        <h2
          className="font-display mb-16"
          style={{ fontSize: 'clamp(3.5rem, 8vw, 9rem)', lineHeight: '0.9', letterSpacing: '-0.04em' }}
        >
          {v.contact.heading}
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 mb-24">
          {v.contact.ctas.map((cta, i) => (
            <a
              key={cta.label}
              href={cta.href}
              className="font-sans text-label uppercase tracking-[0.14em] px-8 py-4 border inline-block"
              style={{
                borderColor: i === 0 ? 'rgba(26,23,20,0.55)' : 'rgba(128,128,128,0.28)',
                backgroundColor: i === 0 ? 'rgba(26,23,20,0.07)' : 'transparent',
                transition: 'border-color 0.2s, background-color 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = i === 0 ? 'rgba(26,23,20,0.8)' : 'rgba(128,128,128,0.55)'
                e.currentTarget.style.backgroundColor = i === 0 ? 'rgba(26,23,20,0.12)' : 'rgba(128,128,128,0.06)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = i === 0 ? 'rgba(26,23,20,0.55)' : 'rgba(128,128,128,0.28)'
                e.currentTarget.style.backgroundColor = i === 0 ? 'rgba(26,23,20,0.07)' : 'transparent'
              }}
            >
              {cta.label} →
            </a>
          ))}
        </div>
        <div className="pt-10" style={{ borderTop: borderMid }}>
          <Image src="/branding/logo black numu.png" alt="NUMU" width={120} height={48} className="h-10 w-auto object-contain" style={{ opacity: 0.18 }} />
        </div>
      </S>
    </>
  )
}

// ─── Investor CTA with email form ────────────────────────────────────────────

function InvestorCTA({ iv }: { iv: InvestorContent }) {
  const [email, setEmail]   = useState('')
  const [state, setState]   = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || state === 'loading') return
    setState('loading')
    try {
      const res = await fetch('/api/contact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email }),
      })
      setState(res.ok ? 'sent' : 'error')
    } catch {
      setState('error')
    }
  }

  return (
    <div
      className="rounded-sm px-10 md:px-16 py-16 md:py-20"
      style={{ backgroundColor: 'rgba(245,241,232,0.04)', border: '1px solid rgba(245,241,232,0.08)' }}
    >
      <IL text={iv.cta.label} />
      <IH2 text={iv.cta.heading} />
      <IBody text={iv.cta.body} />

      {state === 'sent' ? (
        <div
          className="mt-6 max-w-lg"
          style={{ animation: 'cta-fade-in 0.5s cubic-bezier(0.25,0,0.2,1) both' }}
        >
          <p className="font-sans text-base" style={{ opacity: 0.75, lineHeight: 1.6 }}>
            Request received. We&apos;ll be in touch shortly.
          </p>
          <p className="font-sans text-xs mt-3" style={{ opacity: 0.3 }}>
            Sent to Andy@numu.bio
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mt-6 max-w-lg">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            disabled={state === 'loading'}
            className="flex-1 font-sans text-sm px-5 py-3.5 bg-transparent outline-none"
            style={{
              border: '1px solid rgba(245,241,232,0.22)',
              color: 'rgba(245,241,232,0.85)',
              opacity: state === 'loading' ? 0.5 : 1,
            }}
          />
          <button
            type="submit"
            disabled={state === 'loading'}
            className="font-sans text-label uppercase tracking-[0.14em] px-7 py-3.5 flex-shrink-0 flex items-center justify-center"
            style={{
              backgroundColor: 'rgba(245,241,232,0.1)',
              border: '1px solid rgba(245,241,232,0.22)',
              cursor: state === 'loading' ? 'wait' : 'pointer',
              opacity: state === 'loading' ? 0.55 : 1,
              transition: 'opacity 0.2s',
            }}
          >
            {state === 'loading' ? 'Sending…' : 'Request Deck →'}
          </button>
        </form>
      )}

      {state === 'error' && (
        <p className="font-sans text-xs mt-3" style={{ opacity: 0.45 }}>
          Something went wrong — email us directly at{' '}
          <a href="mailto:Andy@numu.bio" style={{ textDecoration: 'underline' }}>Andy@numu.bio</a>
        </p>
      )}

      {state !== 'sent' && (
        <p className="font-sans text-xs mt-4" style={{ opacity: 0.28 }}>
          No spam. Deck sent directly by the founder.
        </p>
      )}
    </div>
  )
}

// ─── Investor sections ────────────────────────────────────────────────────────

const iB     = '1px solid rgba(245,241,232,0.1)'
const iBSoft = '1px solid rgba(245,241,232,0.06)'

function InvestorSections({ iv }: { iv: InvestorContent }) {
  return (
    <>
      {/* Market */}
      <IS id="market">
        <IL text={iv.market.label} />
        <IH2 text={iv.market.heading} />
        <IBody text={iv.market.body} />
        <MarketDiagram />
      </IS>

      {/* Platform */}
      <IS id="platform">
        <IL text={iv.platform.label} />
        <IH2 text={iv.platform.heading} />
        <IBody text={iv.platform.body} />
        <PlatformDiagram />
      </IS>

      {/* Traction */}
      <IS id="traction">
        <IL text={iv.traction.label} />
        <IH2 text={iv.traction.heading} />
        <div
          className="mt-14 pl-5"
          style={{ borderTop: iB, borderLeft: '2px solid rgba(245,241,232,0.18)' }}
        >
          {iv.traction.items.map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-5 py-5"
              style={{ borderBottom: i < iv.traction.items.length - 1 ? iBSoft : 'none', lineHeight: 2.0 }}
            >
              {/* Checkmark */}
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5}
                strokeLinecap="round" strokeLinejoin="round" width={16} height={16}
                className="flex-shrink-0 mt-2" style={{ opacity: 0.6 }}>
                <polyline points="2,8 6,12 14,4" />
              </svg>
              <p className="font-sans text-base md:text-lg leading-snug" style={{ opacity: 0.78 }}>{item}</p>
            </div>
          ))}
        </div>

        {/* Installation photo placeholders */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6" style={{ borderTop: iB, paddingTop: '48px' }}>
          {[
            { project: 'Beyond Chrysant', location: 'Netherlands — 2022' },
            { project: 'KAVE',            location: 'Dubai, UAE — 2025'  },
          ].map(item => (
            <div key={item.project}>
              <div
                className="relative w-full mb-5 flex flex-col items-center justify-center gap-3"
                style={{
                  aspectRatio: '16/9',
                  border: '1px dashed rgba(245,241,232,0.18)',
                  backgroundColor: 'rgba(245,241,232,0.03)',
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2}
                  strokeLinecap="round" strokeLinejoin="round" width={26} height={26} style={{ opacity: 0.2 }}>
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
                <p className="font-sans text-center" style={{ fontSize: '12px', opacity: 0.22 }}>
                  Photo coming soon
                </p>
              </div>
              <p className="font-sans text-label uppercase tracking-[0.16em] mb-2" style={{ opacity: 0.3 }}>{item.location}</p>
              <p className="font-display text-xl" style={{ opacity: 0.7 }}>{item.project}</p>
            </div>
          ))}
        </div>
      </IS>

      {/* Roadmap */}
      <IS id="roadmap">
        <IL text={iv.roadmap.label} />
        <IH2 text={iv.roadmap.heading} />
        <RoadmapDiagram phases={iv.roadmap.phases} />
      </IS>

      {/* Business Model */}
      <IS id="business-model">
        <IL text={iv.business_model.label} />
        <IH2 text={iv.business_model.heading} />
        <IBody text={iv.business_model.body} />
        <BusinessModelDiagram />
        <UnitEconomicsBars />
      </IS>

      {/* Use of Funds */}
      <IS id="use-of-funds">
        <IL text="06 — Use of Funds" />
        <IH2 text="$600K to build the first certified bio-material manufacturing system in the GCC." />
        <FundingDonut />
      </IS>

      {/* Team */}
      <IS id="team">
        <IL text={iv.team.label} />
        <IH2 text={iv.team.heading} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start mt-16" style={{ borderTop: iB }}>
          <div className="pt-10">
            <IBody text={iv.team.body} />
          </div>
          <div className="relative aspect-square overflow-hidden">
            <Image
              src="/images/founder/founder_in_action.png"
              alt="NUMU Founder"
              fill
              className="object-cover object-top"
              sizes="600px"
            />
          </div>
        </div>
      </IS>

      {/* CTA */}
      <IS id="contact">
        <InvestorCTA iv={iv} />
      </IS>
    </>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

// ─── Password modal ───────────────────────────────────────────────────────────

function InvestorGate({ onUnlock, onCancel }: { onUnlock: () => void; onCancel: () => void }) {
  const [pw, setPw]       = useState('')
  const [shaking, shake]  = useState(false)
  const inputRef          = useRef<HTMLInputElement>(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (pw === 'NUMU2026') {
      onUnlock()
    } else {
      shake(true)
      setPw('')
      setTimeout(() => shake(false), 500)
    }
  }

  return (
    <motion.div
      key="gate"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        backgroundColor: 'rgba(14,14,14,0.78)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onClick={e => { if (e.target === e.currentTarget) onCancel() }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.98 }}
        transition={{ duration: 0.35, ease: [0.25, 0, 0.2, 1] }}
        style={{
          width: '100%', maxWidth: '380px', margin: '0 24px',
          padding: '48px 40px',
          backgroundColor: '#0e0e0e',
          border: '1px solid rgba(245,241,232,0.1)',
        }}
      >
        <p className="font-sans text-label uppercase tracking-[0.2em] mb-2" style={{ color: 'rgba(245,241,232,0.35)' }}>
          Investor Access
        </p>
        <p className="font-display mb-8" style={{ color: '#f5f1e8', fontSize: '1.5rem', letterSpacing: '-0.02em' }}>
          Enter access code
        </p>

        <form onSubmit={handleSubmit}>
          <motion.input
            ref={inputRef}
            type="password"
            value={pw}
            onChange={e => setPw(e.target.value)}
            placeholder="——————"
            animate={shaking ? { x: [-6, 6, -5, 5, -3, 3, 0] } : { x: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full font-sans text-sm px-5 py-4 bg-transparent outline-none mb-4 tracking-[0.18em]"
            style={{
              border: shaking ? '1px solid rgba(180,60,60,0.6)' : '1px solid rgba(245,241,232,0.18)',
              color: 'rgba(245,241,232,0.9)',
              transition: 'border-color 0.2s',
            }}
          />
          <button
            type="submit"
            className="w-full font-sans text-label uppercase tracking-[0.14em] py-3.5"
            style={{
              backgroundColor: 'rgba(245,241,232,0.09)',
              border: '1px solid rgba(245,241,232,0.18)',
              color: 'rgba(245,241,232,0.8)',
              cursor: 'pointer',
            }}
          >
            Enter →
          </button>
        </form>

        <button
          onClick={onCancel}
          className="w-full font-sans text-label uppercase tracking-[0.12em] mt-4 py-2"
          style={{ opacity: 0.28, cursor: 'pointer' }}
        >
          Cancel
        </button>
      </motion.div>
    </motion.div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function PageClient({
  visitor,
  investor,
}: {
  visitor: VisitorContent
  investor: InvestorContent
}) {
  const [isInvestor,  setIsInvestor]  = useState(false)
  const [showGate,    setShowGate]    = useState(false)
  const [isTransitioning, setTransitioning] = useState(false)
  // mounted guard: AnimatePresence must not render during SSR/hydration
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  function requestInvestor() { setShowGate(true) }

  function onUnlock() {
    setShowGate(false)
    setTransitioning(true)
    window.scrollTo({ top: 0, behavior: 'instant' })
    setTimeout(() => {
      setIsInvestor(true)
      setTransitioning(false)
    }, 320)
  }

  function switchToExplore() {
    setTransitioning(true)
    window.scrollTo({ top: 0, behavior: 'instant' })
    setTimeout(() => {
      setIsInvestor(false)
      setTransitioning(false)
    }, 320)
  }

  const theme   = isInvestor ? INVESTOR : VISITOR
  const content = isInvestor ? investor : visitor

  return (
    <div
      style={{
        backgroundColor: theme.bg,
        color: theme.fg,
        minHeight: '100vh',
        transition: 'background-color 0.6s cubic-bezier(0.25,0,0.2,1), color 0.6s cubic-bezier(0.25,0,0.2,1)',
      }}
    >
      {/* ── Password gate — only rendered after hydration to avoid SSR mismatch ── */}
      {mounted && (
        <AnimatePresence>
          {showGate && (
            <InvestorGate onUnlock={onUnlock} onCancel={() => setShowGate(false)} />
          )}
        </AnimatePresence>
      )}

      {/* ── Navigation ─────────────────────────────────────────────────────── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 h-16 md:h-20 flex items-center justify-between"
        style={{
          backgroundColor: isInvestor ? 'rgba(14,14,14,0.82)' : 'rgba(245,241,232,0.82)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          borderBottom: borderSoft,
          transition: 'background-color 0.6s cubic-bezier(0.25,0,0.2,1)',
        }}
      >
        <Image
          src={isInvestor ? '/branding/logo numu.png' : '/branding/logo black numu.png'}
          alt="NUMU"
          width={240}
          height={96}
          className="h-16 md:h-20 w-auto object-contain"
          style={isInvestor ? { filter: 'brightness(0) invert(1) sepia(1) saturate(0) brightness(0.92)' } : {}}
          priority
        />
        <div
          className="flex items-center"
          style={{ border: borderMid, borderRadius: '999px', padding: '3px' }}
        >
          {[
            { label: 'Explore',  active: !isInvestor, onClick: switchToExplore  },
            { label: 'Investor', active:  isInvestor, onClick: requestInvestor  },
          ].map(btn => (
            <button
              key={btn.label}
              onClick={btn.onClick}
              className="px-4 py-1.5 font-sans text-label uppercase tracking-[0.1em] rounded-full transition-colors duration-200"
              style={{
                backgroundColor: btn.active
                  ? (isInvestor ? 'rgba(245,241,232,0.14)' : 'rgba(26,23,20,0.12)')
                  : 'transparent',
                cursor: 'pointer',
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-end" style={{ overflow: 'hidden' }}>
        <div className="absolute inset-0" style={{ zIndex: 0 }}>
          <ModelViewer />
        </div>
        <div className="relative px-6 md:px-12 pt-32 pb-24 w-full max-w-[1440px] mx-auto" style={{ zIndex: 2 }}>
          <p
            className="font-sans uppercase tracking-[0.18em] mb-5 mt-2"
            style={{ opacity: 0.58, fontSize: 'clamp(0.875rem, 1.5vw, 1.125rem)' }}
          >
            {content.hero.sublabel}
          </p>
          {content.hero.lines.map((line, i) => (
            <h1
              key={i}
              className="font-display block"
              style={{ fontSize: 'var(--hero-size)', lineHeight: 'var(--hero-lh)' }}
            >
              {line}
            </h1>
          ))}
          <div className="mt-16 pt-8" style={{ borderTop: borderMid }}>
            <p
              className="font-sans text-label uppercase tracking-[0.14em] mb-8"
              style={{ opacity: 0.38 }}
            >
              {content.hero.meta}
            </p>
            <a
              href={content.hero.cta.href}
              className="font-sans text-label uppercase tracking-[0.14em] px-6 py-3.5 border inline-block"
              style={{
                borderColor: 'rgba(128,128,128,0.4)',
                transition: 'border-color 0.2s, opacity 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = isInvestor ? 'rgba(245,241,232,0.7)' : 'rgba(26,23,20,0.6)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(128,128,128,0.4)' }}
            >
              {content.hero.cta.label} ↓
            </a>
          </div>
        </div>
      </section>

      {/* ── Sections ───────────────────────────────────────────────────────── */}
      <div style={{ opacity: isTransitioning ? 0 : 1, transition: 'opacity 0.35s cubic-bezier(0.25,0,0.2,1)' }}>
        {isInvestor
          ? <InvestorSections iv={investor} />
          : <VisitorSections  v={visitor}   />
        }
      </div>
    </div>
  )
}
