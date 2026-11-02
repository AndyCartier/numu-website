'use client'

/** Starts the "left alone, it grows" egg, so it can be found and reached by keyboard. */
export default function GrowButton({ label = 'Let it grow', className = 'numu-footer-control' }: { label?: string; className?: string }) {
  return (
    <button type="button" className={className} data-grow-trigger onClick={() => window.dispatchEvent(new Event('numu:grow'))}>
      {label}
    </button>
  )
}
