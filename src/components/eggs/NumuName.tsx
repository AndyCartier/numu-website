'use client'
import { useState } from 'react'

/** The Arabic name under the wordmark. Hover, focus or tap it to read what it means. */
export default function NumuName() {
  const [open, setOpen] = useState(false)
  return (
    <p className="numu-name">
      <button
        type="button"
        className="numu-name-ar"
        aria-expanded={open}
        aria-controls="numu-name-meaning"
        onClick={() => setOpen(o => !o)}
      >
        <span lang="ar" dir="rtl">نُمُوّ</span>
        <span className="sr-only">: what the name means</span>
      </button>
      <span id="numu-name-meaning" className="numu-name-meaning" data-open={open || undefined}>
        numū, Arabic for growth
      </span>
    </p>
  )
}
