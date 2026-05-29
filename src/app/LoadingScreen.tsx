'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  cancelIdleTask,
  CRITICAL_IMAGE_ASSETS,
  DEFERRED_IMAGE_ASSETS,
  DEFERRED_VIDEO_ASSETS,
  NEXT_SWEEP_IMAGE_ASSETS,
  NEXT_SWEEP_VIDEO_ASSETS,
  preloadImage,
  requestIdleTask,
  warmMediaAssets,
} from './preloadAssets'

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
    let warmedAssets = 0
    let exitTimer = 0
    let goneTimer = 0
    let idleHandle: ReturnType<typeof requestIdleTask> = 0

    const minimumDisplay = new Promise((resolve) => window.setTimeout(resolve, 1400))
    const failSafe = new Promise((resolve) => window.setTimeout(resolve, 5000))
    const fontsReady = 'fonts' in document ? document.fonts.ready.catch(() => undefined) : Promise.resolve()

    targetRef.current = 16

    const criticalReady = Promise.all(
      CRITICAL_IMAGE_ASSETS.map((src) =>
        preloadImage(src, 'high').then(() => {
          loadedAssets += 1
          if (cancelled) return

          setStatus(loadedAssets < CRITICAL_IMAGE_ASSETS.length ? 'Loading key surfaces' : 'Warming next sections')
          targetRef.current = 16 + (loadedAssets / CRITICAL_IMAGE_ASSETS.length) * 54
        })
      )
    )

    const nextSweepReady = Promise.race([
      warmMediaAssets({
        images: NEXT_SWEEP_IMAGE_ASSETS,
        videos: NEXT_SWEEP_VIDEO_ASSETS,
        concurrency: 3,
        onProgress: (completed, total) => {
          warmedAssets = completed
          if (cancelled || total === 0) return

          setStatus(completed < total ? 'Warming media' : 'Preparing motion and video')
          targetRef.current = Math.max(targetRef.current, 70 + (completed / total) * 22)
        },
      }),
      new Promise((resolve) => window.setTimeout(resolve, 1100)),
    ])

    idleHandle = requestIdleTask(() => {
      void warmMediaAssets({
        images: DEFERRED_IMAGE_ASSETS,
        videos: DEFERRED_VIDEO_ASSETS,
        concurrency: 2,
        onProgress: () => {
          if (cancelled) return
          const total = DEFERRED_IMAGE_ASSETS.length + DEFERRED_VIDEO_ASSETS.length
          warmedAssets += 1
          if (total > 0) {
            targetRef.current = Math.max(targetRef.current, 92 + (warmedAssets / (NEXT_SWEEP_IMAGE_ASSETS.length + NEXT_SWEEP_VIDEO_ASSETS.length + total)) * 4)
          }
        },
      })
    }, 1300)

    Promise.race([
      Promise.all([criticalReady, nextSweepReady, waitForInitialPaint(), fontsReady, minimumDisplay]),
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
      cancelIdleTask(idleHandle)
      window.clearTimeout(exitTimer)
      window.clearTimeout(goneTimer)
    }
  }, [onComplete])

  if (gone) return null

  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      animate={exiting ? { opacity: 0, y: '-3%' } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.4, 0, 0.15, 1] }}
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
