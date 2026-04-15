'use client'

import { useRef, useState, useEffect } from 'react'

function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

/**
 * Animates a number from 0 to `target` when `started` becomes true.
 * Use with an IntersectionObserver to trigger on scroll entry.
 *
 * @example
 * const [ref, visible] = useOnScreen()
 * const count = useCountUp(600, visible)
 */
export function useCountUp(
  target: number,
  started: boolean,
  duration = 1200,
): number {
  const [value, setValue] = useState(0)
  const rafRef = useRef<number | undefined>(undefined)
  const t0 = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (!started) return
    t0.current = undefined

    const tick = (ts: number) => {
      if (t0.current === undefined) t0.current = ts
      const p = Math.min((ts - t0.current) / duration, 1)
      setValue(Math.round(target * easeOut(p)))
      if (p < 1) rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current)
    }
  }, [started, target, duration])

  return value
}
