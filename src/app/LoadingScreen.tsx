'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const CRITICAL_ASSETS = [
  '/branding/logo-black-numu.png',
  '/branding/logo-numu.png',
  '/images/hero/mycofoam_block_01.png',
  '/images/products/biofoam_detail.png',
]

function preloadImage(src: string) {
  return new Promise<void>((resolve) => {
    const img = new window.Image()
    img.onload = () => resolve()
    img.onerror = () => resolve()
    img.src = src
  })
}

function waitForInitialPaint() {
  return new Promise<void>((resolve) => {
    if (typeof window === 'undefined') {
      resolve()
      return
    }

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => resolve())
    })
  })
}

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(8)
  const [status, setStatus] = useState('Preparing interface')
  const [exiting, setExiting] = useState(false)
  const [gone, setGone] = useState(false)
  const targetRef = useRef(8)

  useEffect(() => {
    const step = window.setInterval(() => {
      setProgress((current) => {
        const target = targetRef.current
        const next = current + (target - current) * 0.14

        if (target === 100 && next > 99.5) return 100
        if (Math.abs(target - next) < 0.12) return target
        return next
      })
    }, 16)

    return () => window.clearInterval(step)
  }, [])

  useEffect(() => {
    let cancelled = false
    let loadedAssets = 0
    let exitTimer = 0
    let goneTimer = 0

    const minimumDisplay = new Promise((resolve) => window.setTimeout(resolve, 900))
    const failSafe = new Promise((resolve) => window.setTimeout(resolve, 2200))
    const fontsReady = 'fonts' in document ? document.fonts.ready.catch(() => undefined) : Promise.resolve()

    targetRef.current = 16

    const assetPromises = CRITICAL_ASSETS.map((src) =>
      preloadImage(src).then(() => {
        loadedAssets += 1
        if (cancelled) return

        setStatus(loadedAssets < CRITICAL_ASSETS.length ? 'Loading material assets' : 'Finalizing layout')
        targetRef.current = 16 + (loadedAssets / CRITICAL_ASSETS.length) * 58
      })
    )

    Promise.race([
      Promise.all([Promise.all(assetPromises), waitForInitialPaint(), fontsReady, minimumDisplay]),
      failSafe,
    ]).then(() => {
      if (cancelled) return

      setStatus('Ready')
      targetRef.current = 100

      exitTimer = window.setTimeout(() => {
        if (cancelled) return
        setExiting(true)

        goneTimer = window.setTimeout(() => {
          if (cancelled) return
          setGone(true)
          onComplete()
        }, 320)
      }, 240)
    })

    return () => {
      cancelled = true
      window.clearTimeout(exitTimer)
      window.clearTimeout(goneTimer)
    }
  }, [onComplete])

  if (gone) return null

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={exiting ? { opacity: 0, scale: 1.01 } : { opacity: 1, scale: 1 }}
      transition={{ duration: 0.32, ease: [0.25, 0, 0.2, 1] }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: '#f5f1e8',
        color: '#1a1714',
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 66% 56% at 50% 44%, rgba(178,155,127,0.15) 0%, transparent 68%)',
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          opacity: 0.018,
          mixBlendMode: 'multiply',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'relative',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px',
        }}
      >
        <div
          style={{
            width: 'min(92vw, 420px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Image
            src="/branding/logo-black-numu.png"
            alt="NUMU"
            width={240}
            height={96}
            priority
            style={{
              width: 'auto',
              height: '72px',
              display: 'block',
              mixBlendMode: 'multiply',
            }}
          />

          <p
            className="font-sans uppercase tracking-[0.22em]"
            style={{
              fontSize: '0.625rem',
              opacity: 0.42,
              marginTop: '28px',
            }}
          >
            Preparing material system
          </p>

          <div
            style={{
              width: '100%',
              height: '2px',
              backgroundColor: 'rgba(26,23,20,0.12)',
              marginTop: '18px',
              overflow: 'hidden',
            }}
          >
            <motion.div
              style={{
                width: `${progress}%`,
                height: '100%',
                backgroundColor: '#1a1714',
                transformOrigin: 'left center',
              }}
            />
          </div>

          <div
            className="font-sans uppercase tracking-[0.16em]"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '10px',
              fontSize: '0.5625rem',
              opacity: 0.42,
            }}
          >
            <span>{status}</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
