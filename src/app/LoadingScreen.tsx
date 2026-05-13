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

    const FILL_DUR = 1600
    const HOLD_DUR = 200
    const TOTAL = FILL_DUR + HOLD_DUR

    let raf = 0

    const img = new window.Image()
    img.src = '/branding/logo-black-numu.png'

    img.onload = () => {
      // Scale logo to ~42vw, max 320px
      const maxW = Math.min(W * 0.42, 320)
      const scale = maxW / img.width
      const dw = img.width * scale
      const dh = img.height * scale
      const dx = W / 2 - dw / 2
      const dy = H / 2 - dh / 2

      // Build mask canvas from dark pixels of the logo
      const maskCanvas = document.createElement('canvas')
      maskCanvas.width = W
      maskCanvas.height = H
      const mctx = maskCanvas.getContext('2d')!

      const tempC = document.createElement('canvas')
      tempC.width = W
      tempC.height = H
      const tctx = tempC.getContext('2d')!
      tctx.drawImage(img, dx, dy, dw, dh)

      const raw = tctx.getImageData(0, 0, W, H)
      const mask = mctx.createImageData(W, H)

      // Convert dark logo pixels → opaque charcoal mask; light → transparent
      for (let i = 0; i < raw.data.length; i += 4) {
        const brightness = (raw.data[i] + raw.data[i + 1] + raw.data[i + 2]) / 3
        if (brightness < 100) {
          mask.data[i]     = 26
          mask.data[i + 1] = 23
          mask.data[i + 2] = 20
          mask.data[i + 3] = Math.min(255, Math.round((100 - brightness) * 2.8))
        }
      }
      mctx.putImageData(mask, 0, 0)

      // Pixel bounds of logo shape
      let textTop = H, textBottom = 0
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          if (mask.data[(y * W + x) * 4 + 3] > 25) {
            if (y < textTop)    textTop    = y
            if (y > textBottom) textBottom = y
          }
        }
      }

      const fillCanvas = document.createElement('canvas')
      fillCanvas.width = W
      fillCanvas.height = H
      const fctx = fillCanvas.getContext('2d')!

      const textHeight = textBottom - textTop
      const waveAmplitude = dw * 0.012

      let startTs = 0

      function render(ts: number) {
        if (!startTs) startTs = ts
        const e = Math.min(ts - startTs, TOTAL)

        const raw = Math.min(e / FILL_DUR, 1)
        const ease = raw < 0.5
          ? 4 * raw * raw * raw
          : 1 - Math.pow(-2 * raw + 2, 3) / 2

        ctx.clearRect(0, 0, W, H)
        fctx.clearRect(0, 0, W, H)

        // Draw logo mask (full logo shape)
        fctx.drawImage(maskCanvas, 0, 0)

        // Clip away everything above the rising liquid level
        const liquidY = textBottom - ease * textHeight

        fctx.globalCompositeOperation = 'destination-out'
        fctx.beginPath()
        fctx.moveTo(0, 0)
        fctx.lineTo(0, liquidY)

        const wavePoints = 80
        for (let i = 0; i <= wavePoints; i++) {
          const wx = (i / wavePoints) * W
          const phase = (wx / W) * Math.PI * 3 + ts * 0.003
          const centerDip = Math.sin((wx / W) * Math.PI) * waveAmplitude * 0.6
          const wy = liquidY - waveAmplitude * Math.sin(phase) - centerDip
          fctx.lineTo(wx, wy)
        }

        fctx.lineTo(W, 0)
        fctx.closePath()
        fctx.fill()
        fctx.globalCompositeOperation = 'source-over'

        ctx.drawImage(fillCanvas, 0, 0)

        if (e < TOTAL) {
          raf = requestAnimationFrame(render)
        } else {
          setExiting(true)
          setTimeout(() => {
            setGone(true)
            onComplete()
          }, 750)
        }
      }

      raf = requestAnimationFrame(render)
    }

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
      transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
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
