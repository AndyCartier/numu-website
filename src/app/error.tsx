'use client'

import { useEffect } from 'react'

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Keep the original error available in the local browser console while
    // always leaving visitors with a usable recovery screen.
    console.error('NUMU page render failed')
  }, [])

  return (
    <main
      className="min-h-screen flex items-center justify-center px-6"
      style={{ backgroundColor: '#f5f1e8', color: '#1a1714' }}
    >
      <div className="max-w-xl text-center">
        <p className="font-sans uppercase tracking-[0.18em] mb-6" style={{ fontSize: '0.7rem', opacity: 0.5 }}>NUMU</p>
        <h1 className="font-display mb-6" style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)', lineHeight: 0.95, letterSpacing: '-0.04em' }}>
          Refreshing the material system.
        </h1>
        <p className="font-sans leading-[1.7] mb-9" style={{ opacity: 0.62 }}>
          The page encountered a temporary rendering issue. Please try again.
        </p>
        <button
          type="button"
          onClick={reset}
          className="font-sans uppercase tracking-[0.14em] px-7 py-4"
          style={{ border: '1px solid rgba(26,23,20,0.55)', background: 'transparent', cursor: 'pointer', fontSize: '0.75rem' }}
        >
          Reload website
        </button>
      </div>
    </main>
  )
}
