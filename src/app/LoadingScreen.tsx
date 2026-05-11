'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [exiting, setExiting] = useState(false)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const W = window.innerWidth
    const H = window.innerHeight
    canvas.width = W
    canvas.height = H
    const ctx = canvas.getContext('2d')!

    // Offscreen canvas — text mask
    const maskCanvas = document.createElement('canvas')
    maskCanvas.width = W
    maskCanvas.height = H
    const mctx = maskCanvas.getContext('2d')!

    const fontSize = Math.min(W * 0.26, 240)

    function renderMask() {
      mctx.clearRect(0, 0, W, H)
      mctx.fillStyle = '#1a1714'
      mctx.font = `700 ${fontSize}px 'Playfair Display', Georgia, serif`
      mctx.textAlign = 'center'
      mctx.textBaseline = 'middle'
      mctx.fillText('NUMU', W / 2, H / 2)
    }

    let raf = 0

    document.fonts.ready.then(() => {
      renderMask()

      // Find exact pixel bounds of rendered text
      const maskData = mctx.getImageData(0, 0, W, H)
      let textTop = H, textBottom = 0
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          if (maskData.data[(y * W + x) * 4 + 3] > 25) {
            if (y < textTop) textTop = y
            if (y > textBottom) textBottom = y
          }
        }
      }

      // Offscreen canvas for liquid fill — same size as mask
      const fillCanvas = document.createElement('canvas')
      fillCanvas.width = W
      fillCanvas.height = H
      const fctx = fillCanvas.getContext('2d')!

      const FILL_DUR = 2200   // ms for liquid to rise 0→100%
      const HOLD_DUR = 400    // ms to hold fully filled
      const TOTAL = FILL_DUR + HOLD_DUR

      const textHeight = textBottom - textTop
      const waveAmplitude = fontSize * 0.018  // subtle meniscus

      let startTs = 0

      function render(ts: number) {
        if (!startTs) startTs = ts
        const e = Math.min(ts - startTs, TOTAL)

        // Ease: cubic bezier approximation — slow start, steady rise
        const raw = Math.min(e / FILL_DUR, 1)
        const ease = raw < 0.5
          ? 4 * raw * raw * raw
          : 1 - Math.pow(-2 * raw + 2, 3) / 2

        ctx.clearRect(0, 0, W, H)

        // Build fill canvas: solid fill clipped to current liquid level
        fctx.clearRect(0, 0, W, H)

        // Draw the full text solid
        fctx.drawImage(maskCanvas, 0, 0)

        // Clip away everything above the liquid level using destination-out
        // Liquid surface Y: starts at textBottom, rises to textTop
        const liquidY = textBottom - ease * textHeight

        // Sine wave meniscus along the liquid surface
        fctx.globalCompositeOperation = 'destination-out'
        fctx.beginPath()
        fctx.moveTo(0, 0)
        fctx.lineTo(0, liquidY)

        const wavePoints = 80
        for (let i = 0; i <= wavePoints; i++) {
          const wx = (i / wavePoints) * W
          // Meniscus: sine wave + slight center dip (surface tension effect)
          const phase = (wx / W) * Math.PI * 3 + ts * 0.003
          const centerDip = Math.sin((wx / W) * Math.PI) * waveAmplitude * 0.6
          const wy = liquidY - waveAmplitude * Math.sin(phase) - centerDip
          if (i === 0) fctx.lineTo(wx, wy)
          else fctx.lineTo(wx, wy)
        }

        fctx.lineTo(W, 0)
        fctx.closePath()
        fctx.fill()
        fctx.globalCompositeOperation = 'source-over'

        // Draw the clipped fill result onto main canvas
        ctx.drawImage(fillCanvas, 0, 0)

        if (e < TOTAL) {
          raf = requestAnimationFrame(render)
        } else {
          setExiting(true)
          setTimeout(() => {
            setGone(true)
            onComplete()
          }, 900)
        }
      }

      raf = requestAnimationFrame(render)
    })

    return () => { if (raf) cancelAnimationFrame(raf) }
  }, [onComplete])

  if (gone) return null

  return (
    <motion.div
      initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
      animate={exiting ? {
        scale: 0.06,
        x: typeof window !== 'undefined' ? -window.innerWidth * 0.455 : 0,
        y: typeof window !== 'undefined' ? -window.innerHeight * 0.455 : 0,
        opacity: 0,
      } : {}}
      transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        backgroundColor: '#f5f1e8',
        pointerEvents: 'none',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      />
    </motion.div>
  )
}
