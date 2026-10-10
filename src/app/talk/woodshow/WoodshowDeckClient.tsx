'use client'

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  WOODSHOW_ANDY_IN_ACTION,
  WOODSHOW_FEEDSTOCK_PHOTO,
  WOODSHOW_HEMP_SHIVS,
  WOODSHOW_KINOKO,
  WOODSHOW_LIVING_SHELTER,
  WOODSHOW_MYMO,
  WOODSHOW_OPENING_MUSHROOM,
  WOODSHOW_OPENING_MUSHROOM_MYCELIUM,
  WOODSHOW_PRESSED_SAMPLES,
  WOODSHOW_REROOT_MAIN,
  WOODSHOW_TEXTURE_CLOSEUP_01,
  WOODSHOW_THERMAL_WALL,
  SHOW_QR,
  WOODSHOW_SLIDE_COUNT,
  WOODSHOW_SURFBOARD_PLACEHOLDERS,
  WOODSHOW_THESIS_HOOK,
  WOODSHOW_THIRD_QUESTION_PRODUCT,
  WOODSHOW_TIMELAPSE_VIDEO,
  WOODSHOW_UFO_PLACEHOLDERS,
  WOODSHOW_WASTE_PILE,
  woodshowSlides,
} from '@/lib/woodshowDeck'
import ProcessDiagram from '@/components/ProcessDiagram'

type WoodshowDeckClientProps = {
  singleSlide?: number
  snapshot?: boolean
}

type SlideShellProps = {
  slide: number
  surface?: 'dark' | 'light'
  backgroundSrc?: string | null
  backgroundAlt?: string
  backgroundExpectedPath?: string
  backgroundLabel?: string
  overlay?: 'dark' | 'soft' | 'light' | 'none'
  children?: ReactNode
  showWatermark?: boolean
  showCounter?: boolean
  noPadding?: boolean
}

type AssetSlotProps = {
  src?: string | null
  alt?: string
  expectedPath?: string
  label?: string
  fit?: 'cover' | 'contain'
  className?: string
}

function Frame({ children, singleSlide = false }: { children: ReactNode; singleSlide?: boolean }) {
  const frame = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [expanded, setExpanded] = useState(false)
  useEffect(() => {
    const element = frame.current
    if (!element) return
    const resize = () => setScale(Math.min(1, element.clientWidth / 1280))
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])
  return <div className={`woodshow-slide-group${singleSlide ? ' woodshow-slide-group--single' : ''}`}>
    <div className="woodshow-reader-controls"><button type="button" aria-expanded={expanded} onClick={() => setExpanded(value => !value)}>{expanded ? 'Fit slide' : 'Enlarge slide'}</button><span>{expanded ? 'Scroll to read every detail.' : 'Full composition · enlarge to read.'}</span></div>
    <div ref={frame} tabIndex={0} role="region" aria-label="Talk slide" className={`woodshow-frame${singleSlide ? ' woodshow-frame--single' : ''}${expanded ? ' woodshow-frame--expanded' : ''}`} style={{ '--ws-scale': scale } as React.CSSProperties}>
      <div className="woodshow-canvas">{children}</div>
    </div>
  </div>
}

function PreviewOrSingle({ children, singleSlide }: { children: ReactNode; singleSlide?: number }) {
  if (singleSlide) return <Frame singleSlide>{children}</Frame>
  return <Frame>{children}</Frame>
}

function SlideCounter({ slide }: { slide: number }) {
  return (
    <div className="woodshow-counter">
      {String(slide).padStart(2, '0')} / {String(WOODSHOW_SLIDE_COUNT).padStart(2, '0')}
    </div>
  )
}

function Watermark({ surface }: { surface: 'dark' | 'light' }) {
  const logo = surface === 'dark' ? '/branding/logo-numu.png' : '/branding/logo-black-numu.png'
  return (
    <div className="woodshow-watermark">
      <img src={logo} alt="NUMU watermark" />
    </div>
  )
}

function AssetSlot({
  src,
  alt = '',
  expectedPath,
  label = 'TODO asset',
  fit = 'cover',
  className = '',
}: AssetSlotProps) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <div className={`woodshow-asset-placeholder ${className}`}>
        <p className="woodshow-asset-placeholder__label">{label}</p>
        <p className="woodshow-asset-placeholder__path">{expectedPath ?? 'Missing asset path'}</p>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className={`woodshow-asset woodshow-asset--${fit} ${className}`.trim()}
    />
  )
}

function SlideShell({
  slide,
  surface = 'dark',
  backgroundSrc,
  backgroundAlt,
  backgroundExpectedPath,
  backgroundLabel,
  overlay = 'dark',
  children,
  showWatermark = true,
  showCounter = false,
  noPadding = false,
}: SlideShellProps) {
  return (
    <div className={`woodshow-slide woodshow-slide--${surface}`}>
      {backgroundSrc ? (
        <div className="woodshow-slide__media">
          <AssetSlot
            src={backgroundSrc}
            alt={backgroundAlt}
            expectedPath={backgroundExpectedPath}
            label={backgroundLabel}
            fit="cover"
            className="woodshow-slide__background-asset"
          />
          {overlay !== 'none' ? <div className={`woodshow-slide__veil woodshow-slide__veil--${overlay}`} /> : null}
        </div>
      ) : backgroundExpectedPath ? (
        <div className="woodshow-slide__media">
          <AssetSlot
            src={null}
            alt={backgroundAlt}
            expectedPath={backgroundExpectedPath}
            label={backgroundLabel}
            fit="cover"
            className="woodshow-slide__background-asset"
          />
          {overlay !== 'none' ? <div className={`woodshow-slide__veil woodshow-slide__veil--${overlay}`} /> : null}
        </div>
      ) : null}

      {showWatermark ? <Watermark surface={surface} /> : null}

      <div className={`woodshow-slide__inner${noPadding ? ' woodshow-slide__inner--flush' : ''}`}>{children}</div>

      {showCounter ? (
        <div className="woodshow-slide__footer">
          <SlideCounter slide={slide} />
        </div>
      ) : null}
    </div>
  )
}

function Eyebrow({ children, accent = false }: { children: ReactNode; accent?: boolean }) {
  return <p className={`woodshow-eyebrow${accent ? ' woodshow-eyebrow--accent' : ''}`}>{children}</p>
}

function Headline({
  children,
  tone = 'light',
  question = false,
  size,
}: {
  children: ReactNode
  tone?: 'light' | 'dark'
  question?: boolean
  size?: 'xl'
}) {
  return (
    <h2
      className={[
        'woodshow-headline',
        `woodshow-headline--${tone}`,
        question ? 'woodshow-headline--question' : '',
        size === 'xl' ? 'woodshow-headline--xl' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </h2>
  )
}

function Body({ children, tone = 'light' }: { children: ReactNode; tone?: 'light' | 'dark' }) {
  return <p className={`woodshow-body woodshow-body--${tone}`}>{children}</p>
}

function CopyBlock({
  children,
  align = 'bottom-left',
  narrow = false,
  lightPanel = false,
}: {
  children: ReactNode
  align?: 'bottom-left' | 'top-left' | 'center' | 'bottom-right'
  narrow?: boolean
  lightPanel?: boolean
}) {
  return (
    <div
      className={[
        'woodshow-copy',
        `woodshow-copy--${align}`,
        narrow ? 'woodshow-copy--narrow' : '',
        lightPanel ? 'woodshow-copy--light' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
}

function InsetCard({
  src,
  alt,
  label,
  expectedPath,
}: {
  src?: string | null
  alt?: string
  label: string
  expectedPath?: string
}) {
  return (
    <div className="woodshow-inset-card">
      <div className="woodshow-inset-card__media">
        <AssetSlot src={src} alt={alt} expectedPath={expectedPath} label={label} fit="cover" />
      </div>
      <p className="woodshow-inset-card__label">{label}</p>
    </div>
  )
}

// ─── Slide components ──────────────────────────────────────────────────────────

function TitleSlide() {
  return (
    <SlideShell slide={1} surface="dark" overlay="none" showWatermark={false} noPadding>
      <CopyBlock align="center" narrow>
        <div className="woodshow-title-lockup">
          <img
            src="/branding/logo-numu.png"
            alt="NUMU"
            className="woodshow-title-lockup__logo woodshow-title-lockup__logo--hero woodshow-title-lockup__logo--white"
          />
          <div className="woodshow-title-lockup__wordmarks">
            <h1 className="woodshow-title-lockup__name">NUMU</h1>
            <p className="woodshow-title-lockup__arabic" lang="ar" dir="rtl">
              نُمُوّ
            </p>
          </div>
          <p className="woodshow-title-lockup__tagline">Building with local waste.</p>
          <p className="woodshow-title-lockup__event">Dubai WoodShow · 2026</p>
        </div>
      </CopyBlock>
    </SlideShell>
  )
}

function SplitHeroSlide({
  slide,
  imageSide = 'right',
  imageSrc,
  imageExpectedPath,
  imageLabel,
  imageAlt,
  title,
  body,
  showWatermark = true,
}: {
  slide: number
  imageSide?: 'left' | 'right'
  imageSrc?: string | null
  imageExpectedPath?: string
  imageLabel?: string
  imageAlt: string
  title: string
  body?: string
  showWatermark?: boolean
}) {
  return (
    <SlideShell slide={slide} surface="dark" overlay="none" showWatermark={showWatermark} noPadding>
      <div className={`woodshow-split woodshow-split--image-${imageSide}`}>
        <div className="woodshow-split__copy">
          <div className="woodshow-split__copy-inner">
            <Headline question>{title}</Headline>
            {body ? <Body>{body}</Body> : null}
          </div>
        </div>
        <div className="woodshow-split__media">
          <AssetSlot
            src={imageSrc}
            alt={imageAlt}
            expectedPath={imageExpectedPath}
            label={imageLabel}
            fit="cover"
            className="woodshow-split__asset"
          />
        </div>
      </div>
    </SlideShell>
  )
}

function QuestionSlide({
  slide,
  question,
  backgroundSrc,
  backgroundExpectedPath,
  backgroundLabel,
}: {
  slide: number
  question: string
  backgroundSrc?: string | null
  backgroundExpectedPath?: string
  backgroundLabel?: string
}) {
  return (
    <SlideShell
      slide={slide}
      surface="dark"
      backgroundSrc={backgroundSrc}
      backgroundAlt={question}
      backgroundExpectedPath={backgroundExpectedPath}
      backgroundLabel={backgroundLabel}
      overlay="dark"
      showWatermark={false}
      noPadding
    >
      <CopyBlock align="center" narrow>
        <Headline question>{question}</Headline>
      </CopyBlock>
    </SlideShell>
  )
}

function ThesisSlide() {
  return (
    <SlideShell
      slide={5}
      surface="dark"
      backgroundSrc={WOODSHOW_WASTE_PILE}
      backgroundAlt="Palm agricultural waste"
      overlay="dark"
      showWatermark={false}
      noPadding
    >
      <CopyBlock align="center">
        <Headline size="xl">{WOODSHOW_THESIS_HOOK}</Headline>
      </CopyBlock>
    </SlideShell>
  )
}

function WhatIsMyceliumSlide() {
  return (
    <SlideShell
      slide={6}
      surface="dark"
      backgroundSrc="/images/projects/production_detail_01.jpg"
      backgroundAlt="Living mycelium growth in hand"
      overlay="dark"
      noPadding
    >
      <CopyBlock align="bottom-left">
        <Eyebrow accent>{woodshowSlides[5].label}</Eyebrow>
        <Headline>Mycelium is the root network of fungi.</Headline>
        <Body>Underground, it binds, digests, and connects matter. In the right conditions, that behavior becomes material.</Body>
      </CopyBlock>
    </SlideShell>
  )
}

function TimelapseSlide({ snapshot = false }: { snapshot?: boolean }) {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    if (snapshot) return
    const video = videoRef.current
    if (!video) return
    const play = () => void video.play().catch(() => {})
    play()
    video.addEventListener('canplay', play)
    return () => video.removeEventListener('canplay', play)
  }, [snapshot])

  return (
    <SlideShell slide={7} surface="dark" overlay="none" showWatermark noPadding>
      <div className="woodshow-video woodshow-video--portrait">
        {snapshot ? (
          <img
            src="/images/projects/production_detail_03.jpg"
            alt="NUMU process still"
            className="woodshow-video__media"
          />
        ) : (
          <video
            ref={videoRef}
            className="woodshow-video__media"
            src={WOODSHOW_TIMELAPSE_VIDEO}
            autoPlay
            muted
            loop
            playsInline
            poster="/images/projects/production_detail_03.jpg"
          />
        )}
        <div className="woodshow-video__veil" />
        <CopyBlock align="bottom-left" narrow>
          <Eyebrow accent>{woodshowSlides[6].label}</Eyebrow>
          <Headline>It grows.</Headline>
          <Body>A living binder, then a stable material.</Body>
        </CopyBlock>
      </div>
    </SlideShell>
  )
}

function MyPathSlide() {
  return (
    <SplitHeroSlide
      slide={8}
      imageSrc={WOODSHOW_ANDY_IN_ACTION}
      imageExpectedPath={WOODSHOW_ANDY_IN_ACTION}
      imageLabel="Andy working with mycelium"
      imageAlt="Andy working with mycelium material"
      title="I developed mycelium for years in Europe, then moved to Dubai."
      body="That is the bridge into this chapter, local waste, local material, local relevance."
      showWatermark
    />
  )
}

// NEW — Slide 9: The scale of the waste problem. Split layout for visual variety from thesis.
function WasteScaleSlide() {
  return (
    <SlideShell slide={9} surface="dark" overlay="none" noPadding>
      <div className="woodshow-split woodshow-split--image-right">
        <div className="woodshow-split__copy">
          <div className="woodshow-split__copy-inner">
            <Eyebrow accent>{woodshowSlides[8].label}</Eyebrow>
            <div className="woodshow-stat-block">
              <p className="woodshow-stat-block__number">1 billion</p>
              <p className="woodshow-stat-block__unit">tonnes per year</p>
            </div>
            <Body>Agricultural waste with nowhere to go. Palm fronds. Wood chips. Rice husks. Each one already a potential substrate.</Body>
          </div>
        </div>
        <div className="woodshow-split__media">
          <AssetSlot
            src={WOODSHOW_FEEDSTOCK_PHOTO}
            alt="Agricultural waste feedstock"
            fit="cover"
            className="woodshow-split__asset"
          />
        </div>
      </div>
    </SlideShell>
  )
}

// Merged feedstock slide — hands in palm waste, combined copy.
function FeedstockSlide() {
  return (
    <SlideShell
      slide={10}
      surface="dark"
      backgroundSrc="/images/projects/production_detail_02.jpg"
      backgroundAlt="Hands in palm waste feedstock"
      overlay="dark"
      noPadding
    >
      <CopyBlock align="bottom-left" narrow>
        <Eyebrow accent>{woodshowSlides[9].label}</Eyebrow>
        <Headline>The feedstock is already here.</Headline>
        <Body>Palm waste and wood shivs, sourced directly from a regional manufacturer. Their residue is the start of a new material.</Body>
      </CopyBlock>
    </SlideShell>
  )
}

// NEW — Slide 11: WoodShow-specific. The waste in this room is exactly what we need.
function WoodshowConnectionSlide() {
  return (
    <SlideShell
      slide={11}
      surface="dark"
      backgroundSrc={WOODSHOW_HEMP_SHIVS}
      backgroundAlt="Wood fiber and hemp substrate material"
      overlay="dark"
      noPadding
    >
      <CopyBlock align="bottom-left" narrow>
        <Eyebrow accent>{woodshowSlides[10].label}</Eyebrow>
        <Headline>The waste from this industry is exactly what we need.</Headline>
        <Body>Wood chips. Sawdust. Shavings. Every offcut made in this hall is a potential substrate.</Body>
      </CopyBlock>
    </SlideShell>
  )
}

// NEW — Slide 12: The process reveal. Same grow-room image as slide 7 — connects the growth moment to the product.
function InsideTheMoldSlide() {
  return (
    <SlideShell
      slide={12}
      surface="dark"
      backgroundSrc="/images/projects/production_detail_03.jpg"
      backgroundAlt="Mycelium growing inside production mold"
      overlay="dark"
      noPadding
    >
      <CopyBlock align="bottom-left" narrow>
        <Eyebrow accent>{woodshowSlides[11].label}</Eyebrow>
        <Headline>Seven days. In the dark. At room temperature.</Headline>
        <Body>No kilns. No chemicals. No pressure. The organism binds the substrate into a stable composite.</Body>
      </CopyBlock>
    </SlideShell>
  )
}

function ObjectsSlide() {
  return (
    <SlideShell
      slide={13}
      surface="dark"
      backgroundSrc="/images/projects/Lamp02.jpg"
      backgroundAlt="Object grown from local waste"
      overlay="dark"
      noPadding
    >
      <CopyBlock align="bottom-left" narrow>
        <Eyebrow accent>{woodshowSlides[12].label}</Eyebrow>
        <Headline>Objects grown from local waste.</Headline>
        <Body>Lighting, furniture, packaging. Same process, different form.</Body>
      </CopyBlock>
    </SlideShell>
  )
}

function ApplicationsSlide() {
  return (
    <SlideShell
      slide={14}
      surface="dark"
      backgroundSrc="/images/materials/acoustic_render_05.png"
      backgroundAlt="Acoustic wall application"
      overlay="dark"
      noPadding
    >
      <CopyBlock align="bottom-left" narrow>
        <Eyebrow accent>{woodshowSlides[13].label}</Eyebrow>
        <Headline>This is not one product category.</Headline>
        <div className="woodshow-chip-row">
          {['Acoustic', 'Insulation', 'Panels', 'Composites', 'Construction'].map((item) => (
            <span key={item} className="woodshow-chip">
              {item}
            </span>
          ))}
        </div>
      </CopyBlock>
    </SlideShell>
  )
}

function PropertyIcon({ type }: { type: 'carbon' | 'fire' | 'soil' | 'outdoor' | 'thermal' }) {
  if (type === 'carbon') {
    return (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M16 28V12" />
        <path d="M10 18c0-6 3-10 6-10" />
        <path d="M22 18c0-6-3-10-6-10" />
        <path d="M10 18c0 4 2 7 6 7" />
        <path d="M22 18c0 4-2 7-6 7" />
        <path d="M13 24l3 3 3-3" />
      </svg>
    )
  }
  if (type === 'fire') {
    return (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M16 4c0 5-5 8-5 13a5 5 0 0 0 10 0c0-3-2-5-2-8" />
        <path d="M13 20c0-3 1.5-5 3-5" />
      </svg>
    )
  }
  if (type === 'soil') {
    return (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="16" cy="14" r="8" />
        <path d="M16 22v6" />
        <path d="M12 26h8" />
        <path d="M12 11c1-2 2.5-3 4-3" />
      </svg>
    )
  }
  if (type === 'outdoor') {
    return (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="16,4 28,16 16,28 4,16" />
        <polygon points="16,10 22,16 16,22 10,16" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <path d="M6 10c3-3 5 3 8 0s5-3 8 0" />
      <path d="M6 17c3-3 5 3 8 0s5-3 8 0" />
      <path d="M6 24c3-3 5 3 8 0s5-3 8 0" />
    </svg>
  )
}

function PropertiesSlide() {
  const properties = [
    { icon: 'carbon' as const, headline: 'Low carbon', sub: 'Low to negative CO₂ depending on substrate' },
    { icon: 'fire' as const, headline: 'Fire safe', sub: 'Naturally fire retardant' },
    { icon: 'soil' as const, headline: 'Biodegradable', sub: 'Fully returns to the ground at end of life' },
    { icon: 'outdoor' as const, headline: 'Durable', sub: 'Stable in outdoor conditions' },
    { icon: 'thermal' as const, headline: 'Insulation', sub: 'Thermal and acoustic performance' },
  ]

  return (
    <SlideShell slide={15} surface="light" noPadding>
      <div className="woodshow-properties-stage">
        <div className="woodshow-properties-copy">
          <Eyebrow accent>{woodshowSlides[14].label}</Eyebrow>
          <Headline tone="dark">Why this material matters.</Headline>
        </div>
        <div className="woodshow-properties-grid">
          {properties.map(({ icon, headline, sub }) => (
            <div key={icon} className="woodshow-property-card">
              <div className="woodshow-property-card__icon">
                <PropertyIcon type={icon} />
              </div>
              <div>
                <p className="woodshow-property-card__headline">{headline}</p>
                <p className="woodshow-property-card__label">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SlideShell>
  )
}

// Slide 16: Bridge from properties → architectural application.
function MaterialCloseUpSlide() {
  return (
    <SlideShell
      slide={16}
      surface="dark"
      backgroundSrc={WOODSHOW_TEXTURE_CLOSEUP_01}
      backgroundAlt="Mycelium material surface texture close-up"
      overlay="soft"
      showWatermark={false}
      noPadding
    >
      <CopyBlock align="center">
        <Headline>The biology stays the same.</Headline>
        <Headline>Only the mold changes.</Headline>
      </CopyBlock>
    </SlideShell>
  )
}

// NEW — Slide 17: Thermal / insulation application at architectural scale.
function ThermalSlide() {
  return (
    <SlideShell
      slide={17}
      surface="dark"
      backgroundSrc={WOODSHOW_THERMAL_WALL}
      backgroundAlt="Mycelium thermal insulation panels installed on wall"
      overlay="dark"
      noPadding
    >
      <CopyBlock align="bottom-left" narrow>
        <Eyebrow accent>{woodshowSlides[16].label}</Eyebrow>
        <Headline>The same process. Applied to building performance.</Headline>
        <Body>Thermal insulation. Acoustic panels. The substrate changes. The biology does not.</Body>
      </CopyBlock>
    </SlideShell>
  )
}

// Circularity — full 6-step process diagram from the website.
function CircularitySlide({ snapshot = false }: { snapshot?: boolean }) {
  return (
    <SlideShell slide={18} surface="light" noPadding>
      <div className="woodshow-diagram-stage">
        <div className="woodshow-diagram-copy">
          <Eyebrow accent>{woodshowSlides[17].label}</Eyebrow>
          <Headline tone="dark">Waste in. Material out. Back to earth.</Headline>
          <Body tone="dark">Six steps. One unbroken loop. From agricultural residue back to soil.</Body>
        </div>
        <div className="woodshow-diagram-wrap">
          <ProcessDiagram animate={!snapshot} activeIndex={2} />
        </div>
      </div>
    </SlideShell>
  )
}

// Slide 19: Kinoko — first named project, small-object scale.
function KinokoSlide() {
  return (
    <SlideShell
      slide={19}
      surface="dark"
      backgroundSrc={WOODSHOW_KINOKO}
      backgroundAlt="Kinoko mycelium project"
      overlay="soft"
      noPadding
    >
      <CopyBlock align="bottom-left" narrow>
        <Eyebrow accent>{woodshowSlides[18].label}</Eyebrow>
        <Headline>Kinoko.</Headline>
        <Body>Grown mycelium object. Hemp substrate. Form driven entirely by the mold.</Body>
      </CopyBlock>
    </SlideShell>
  )
}

// Slide 20: Mymo — panel/surface scale.
function MymoSlide() {
  return (
    <SlideShell
      slide={20}
      surface="dark"
      backgroundSrc={WOODSHOW_MYMO}
      backgroundAlt="Mymo mycelium pressed composite modules"
      overlay="soft"
      noPadding
    >
      <CopyBlock align="bottom-left" narrow>
        <Eyebrow accent>{woodshowSlides[19].label}</Eyebrow>
        <Headline>Mymo.</Headline>
        <Body>Pressed composite modules. Palm waste substrate. Variable density by compression.</Body>
      </CopyBlock>
    </SlideShell>
  )
}

// Slide 23: Reroot — architecture scale, Dubai. The climax project before the close.
function InstallationsSlide() {
  return (
    <SlideShell
      slide={23}
      surface="dark"
      backgroundSrc={WOODSHOW_REROOT_MAIN}
      backgroundAlt="Reroot mycelium installation in Dubai"
      overlay="soft"
      noPadding
    >
      <CopyBlock align="bottom-left" narrow>
        <Eyebrow accent>{woodshowSlides[22].label}</Eyebrow>
        <Headline>Reroot.</Headline>
        <Body>A built-space test of mycelium panels in Dubai. Bio-based envelope at architecture scale.</Body>
      </CopyBlock>
    </SlideShell>
  )
}

function ProjectsGridSlide() {
  return (
    <SlideShell slide={21} surface="light" noPadding>
      <div className="woodshow-project-grid-stage">
        <CopyBlock align="top-left" narrow>
          <Eyebrow accent>{woodshowSlides[20].label}</Eyebrow>
          <Headline tone="dark">Projects that prove the process.</Headline>
        </CopyBlock>

        <div className="woodshow-project-grid">
          <div className="woodshow-project-grid__item">
            <div className="woodshow-project-grid__media">
              <AssetSlot src="/images/projects/Beyond01.jpg" alt="Beyond Chrysant installation" fit="cover" />
            </div>
            <p className="woodshow-project-grid__title">Beyond Chrysant</p>
            <p className="woodshow-project-grid__meta">Installation, Netherlands</p>
          </div>

          <div className="woodshow-project-grid__item">
            <div className="woodshow-project-grid__media">
              <AssetSlot
                src={WOODSHOW_LIVING_SHELTER}
                alt="Living Shelter project"
                expectedPath={WOODSHOW_LIVING_SHELTER}
                label="Living Shelter image"
                fit="cover"
              />
            </div>
            <p className="woodshow-project-grid__title">Living Shelter</p>
            <p className="woodshow-project-grid__meta">Built-space exploration</p>
          </div>

          <div className="woodshow-project-grid__item">
            <div className="woodshow-project-grid__media">
              <AssetSlot
                src={WOODSHOW_SURFBOARD_PLACEHOLDERS[0]}
                alt="Surfboard core development"
                expectedPath={WOODSHOW_SURFBOARD_PLACEHOLDERS[0]}
                label="TODO surfboard image"
                fit="cover"
              />
            </div>
            <p className="woodshow-project-grid__title">Surfboard core</p>
            <p className="woodshow-project-grid__meta">Material pushed into performance</p>
          </div>

          <div className="woodshow-project-grid__item">
            <div className="woodshow-project-grid__media woodshow-project-grid__media--contain">
              <AssetSlot
                src={WOODSHOW_UFO_PLACEHOLDERS[0]}
                alt="UFO skateboard work"
                expectedPath={WOODSHOW_UFO_PLACEHOLDERS[0]}
                label="TODO UFO skateboard image"
                fit="contain"
              />
            </div>
            <p className="woodshow-project-grid__title">UFO x Astro</p>
            <p className="woodshow-project-grid__meta">Pressed composite deck, US</p>
          </div>
        </div>
      </div>
    </SlideShell>
  )
}

function PressedSamplesSlide() {
  return (
    <SlideShell
      slide={22}
      surface="dark"
      backgroundSrc={WOODSHOW_PRESSED_SAMPLES}
      backgroundAlt="Pressed mycelium samples in multiple substrates"
      overlay="dark"
      noPadding
    >
      <CopyBlock align="bottom-left" narrow>
        <Eyebrow accent>{woodshowSlides[21].label}</Eyebrow>
        <Headline>Every substrate, a different material.</Headline>
        <Body>Colour, density, texture. All driven by what goes in. The process stays the same.</Body>
      </CopyBlock>
    </SlideShell>
  )
}

function ClosingSlide() {
  return (
    <SlideShell
      slide={24}
      surface="dark"
      backgroundSrc="/images/projects/pressed_booth.jpg"
      backgroundAlt="NUMU material installation at scale"
      overlay="dark"
      showWatermark={false}
      noPadding
    >
      <CopyBlock align="center">
        <Headline size="xl">{woodshowSlides[23].title}</Headline>
      </CopyBlock>
    </SlideShell>
  )
}

function QrSlide() {
  return (
    <SlideShell
      slide={25}
      surface="light"
      backgroundSrc="/images/textures/texture_closeup_02.jpg"
      backgroundAlt="NUMU texture background"
      overlay="light"
      noPadding
    >
      <CopyBlock align="top-left" narrow lightPanel>
        <Eyebrow accent>{woodshowSlides[24].label}</Eyebrow>
        <Headline tone="dark">Come talk to me after.</Headline>
        <Body tone="dark">Happy to connect.</Body>
      </CopyBlock>

      <div className="woodshow-qr-card">
        <p className="woodshow-qr-card__name">Andy Cartier</p>
        <p className="woodshow-qr-card__role">Founder, NUMU</p>
        <img src="/qr/numu-connect-qr.svg" alt="NUMU contact QR code" className="woodshow-qr-card__code" />
      </div>
    </SlideShell>
  )
}

// ─── Router ────────────────────────────────────────────────────────────────────

function slideForIndex(index: number, snapshot?: boolean) {
  switch (index) {
    case 1:  return <TitleSlide />
    case 2:  return (
      <SplitHeroSlide
        slide={2}
        title={woodshowSlides[1].title}
        imageSrc={WOODSHOW_OPENING_MUSHROOM}
        imageExpectedPath={WOODSHOW_OPENING_MUSHROOM}
        imageLabel="Opening mushroom image"
        imageAlt="Mushroom portrait"
        showWatermark={false}
      />
    )
    case 3:  return (
      <QuestionSlide
        slide={3}
        question={woodshowSlides[2].title}
        backgroundSrc={WOODSHOW_OPENING_MUSHROOM_MYCELIUM}
        backgroundExpectedPath={WOODSHOW_OPENING_MUSHROOM_MYCELIUM}
        backgroundLabel="Opening mycelium image"
      />
    )
    case 4:  return (
      <QuestionSlide
        slide={4}
        question={woodshowSlides[3].title}
        backgroundSrc={WOODSHOW_THIRD_QUESTION_PRODUCT}
        backgroundExpectedPath={WOODSHOW_THIRD_QUESTION_PRODUCT}
        backgroundLabel="Third question product image"
      />
    )
    case 5:  return <ThesisSlide />
    case 6:  return <WhatIsMyceliumSlide />
    case 7:  return <TimelapseSlide snapshot={snapshot} />
    case 8:  return <MyPathSlide />
    case 9:  return <WasteScaleSlide />
    case 10: return <FeedstockSlide />
    case 11: return <WoodshowConnectionSlide />
    case 12: return <InsideTheMoldSlide />
    case 13: return <ObjectsSlide />
    case 14: return <ApplicationsSlide />
    case 15: return <PropertiesSlide />
    case 16: return <MaterialCloseUpSlide />
    case 17: return <ThermalSlide />
    case 18: return <CircularitySlide snapshot={snapshot} />
    case 19: return <KinokoSlide />
    case 20: return <MymoSlide />
    case 21: return <ProjectsGridSlide />
    case 22: return <PressedSamplesSlide />
    case 23: return <InstallationsSlide />
    case 24: return <ClosingSlide />
    case 25: return SHOW_QR ? <QrSlide /> : null
    default: return null
  }
}

export default function WoodshowDeckClient({ singleSlide, snapshot = false }: WoodshowDeckClientProps) {
  const slideIndexes = useMemo(
    () =>
      singleSlide
        ? [singleSlide]
        : Array.from({ length: WOODSHOW_SLIDE_COUNT }, (_, i) => i + 1),
    [singleSlide]
  )

  return (
    <div className="woodshow-root">
      <div className={`woodshow-preview${singleSlide ? ' woodshow-preview--single' : ''}`}>
        {slideIndexes.map((slideIndex) => (
          <PreviewOrSingle key={slideIndex} singleSlide={singleSlide}>
            {slideForIndex(slideIndex, snapshot)}
          </PreviewOrSingle>
        ))}
      </div>
    </div>
  )
}
