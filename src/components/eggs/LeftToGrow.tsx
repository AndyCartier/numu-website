'use client'
import { useEffect, useRef, useState } from 'react'
import { Colony } from './growth'

/**
 * Easter egg: left alone, it grows.
 * After 45 s without scrolling, typing or clicking (desktop pointer only), hyphae grow in from the
 * edge of the screen and the pointer becomes their food. Any scroll, key or click and they fade away.
 * Also started by typing "grow" (outside a field) or by the footer's "Let it grow" button,
 * which dispatch the window event `numu:grow`.
 * The drawing never takes pointer events and is hidden from assistive technology.
 * Reduced motion: no idle start; a manual start shows the finished drawing at once, without movement.
 */
const IDLE_MS = 45_000
const LINE = ['rgba(138,114,86,0.85)', 'rgba(138,114,86,0.7)', 'rgba(138,114,86,0.58)', 'rgba(138,114,86,0.46)']
const WIDTH = [1.3, 1, 0.8, 0.6]

export default function LeftToGrow() {
  const canvas = useRef<HTMLCanvasElement>(null)
  const [state, setState] = useState<'off' | 'growing' | 'leaving'>('off')
  const stateRef = useRef(state)
  stateRef.current = state

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const finePointer = window.matchMedia('(pointer: fine)').matches
    let idle: ReturnType<typeof setTimeout> | undefined
    let raf = 0
    let colony: Colony | null = null
    let drawn = 0
    let last = 0
    let typed = ''
    let pace = 1

    const draw = () => {
      const c = canvas.current
      const g = c?.getContext('2d')
      if (!c || !g || !colony) return
      const s = colony.segs, k = colony.stride
      g.lineCap = 'round'
      for (let i = drawn; i < colony.segCount; i++) {
        const o = i * k, d = Math.min(3, s[o + 4]!)
        g.strokeStyle = LINE[d]!; g.lineWidth = WIDTH[d]!
        g.beginPath(); g.moveTo(s[o]!, s[o + 1]!); g.lineTo(s[o + 2]!, s[o + 3]!); g.stroke()
      }
      drawn = colony.segCount
    }

    const frame = (now: number) => {
      raf = 0
      if (!colony) return
      const dt = last ? (now - last) / 1000 : 0
      for (let k = 0; k < pace; k++) colony.update(dt)
      last = now
      draw()
      if (colony.active && stateRef.current === 'growing' && !document.hidden) raf = requestAnimationFrame(frame)
    }

    const start = (fast: boolean) => {
      if (stateRef.current !== 'off') return
      const c = canvas.current
      if (!c) return
      const w = window.innerWidth, h = window.innerHeight
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      c.width = Math.round(w * dpr); c.height = Math.round(h * dpr)
      c.getContext('2d')?.setTransform(dpr, 0, 0, dpr, 0, 0)
      const phone = w < 700
      colony = new Colony({ width: w, height: h, seed: (Date.now() % 100000) + 7, maxSegments: phone ? 1800 : 4200, hardSegments: phone ? 2600 : 6000, maxTips: phone ? 70 : 120 })
      // Inoculate where the page edge meets the floor, like a sample left on a bench.
      const fromLeft = Math.random() < 0.5
      colony.inoculate(fromLeft ? 6 : w - 6, h - 6, 6)
      drawn = 0; last = 0; pace = fast ? 3 : 1
      setState('growing'); stateRef.current = 'growing'
      if (reduced) { for (let i = 0; i < 4000 && colony.active; i++) colony.update(0.05); draw(); return }
      if (fast) for (let i = 0; i < 40; i++) colony.update(0.05)
      raf = requestAnimationFrame(frame)
    }

    const stop = () => {
      if (stateRef.current !== 'growing') return
      cancelAnimationFrame(raf); raf = 0
      setState('leaving'); stateRef.current = 'leaving'
      setTimeout(() => {
        colony = null
        const c = canvas.current
        c?.getContext('2d')?.clearRect(0, 0, c.width, c.height)
        setState('off'); stateRef.current = 'off'
      }, 1200)
    }

    const armIdle = () => {
      clearTimeout(idle)
      if (reduced || !finePointer) return
      idle = setTimeout(() => start(false), IDLE_MS)
    }

    const onActivity = (event: Event) => {
      // A click on the footer button starts it; it must not also end it.
      if (event.type === 'pointerdown' && (event.target as Element | null)?.closest?.('[data-grow-trigger]')) return
      stop(); armIdle()
    }
    const onKey = (event: KeyboardEvent) => {
      const t = event.target as HTMLElement | null
      const typing = t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))
      if (!typing && event.key.length === 1) {
        typed = (typed + event.key.toLowerCase()).slice(-4)
        if (typed === 'grow') { typed = ''; start(true); return }
      }
      if (stateRef.current === 'growing' && event.key !== 'Shift') onActivity(event)
      else armIdle()
    }
    const onMove = (event: PointerEvent) => {
      if (colony && stateRef.current === 'growing') colony.pointer = { x: event.clientX, y: event.clientY }
      else armIdle()
    }
    const onGrow = () => start(true)

    window.addEventListener('scroll', onActivity, { passive: true })
    window.addEventListener('pointerdown', onActivity)
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('numu:grow', onGrow)
    armIdle()
    return () => {
      clearTimeout(idle); cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onActivity)
      window.removeEventListener('pointerdown', onActivity)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('numu:grow', onGrow)
    }
  }, [])

  return (
    <>
      <canvas ref={canvas} aria-hidden="true" className="numu-grow-canvas" data-state={state} />
      <p className="numu-grow-note" data-state={state} aria-hidden="true">
        Left alone, it grows. Give it 5–7 days in a mould and this would be a panel.
      </p>
      <p className="sr-only" role="status">{state === 'growing' ? 'Mycelium is growing across the page. Scroll or press any key to clear it.' : ''}</p>
    </>
  )
}
