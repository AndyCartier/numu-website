'use client'

import { useEffect, useRef } from 'react'

export type ExpandedImage = { src: string; alt: string; caption?: string }

export default function ImageDialog({ item, onClose }: { item: ExpandedImage; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const element = dialog.current
    const previous = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    element?.showModal()
    return () => {
      element?.close()
      document.body.style.overflow = overflow
      previous?.focus({ preventScroll: true })
    }
  }, [])
  return <dialog ref={dialog} className="image-dialog" aria-label={item.alt || 'Expanded NUMU image'}
    onKeyDown={event => {
      // The close control is the only focusable element in this image viewer.
      if (event.key === 'Tab') { event.preventDefault(); dialog.current?.querySelector('button')?.focus() }
    }}
    onCancel={event => { event.preventDefault(); onClose() }}
    onClick={event => { if (event.target === event.currentTarget) onClose() }}>
    <div className="image-dialog-content">
      <button type="button" className="image-dialog-close" onClick={onClose} aria-label="Close expanded image">Close ×</button>
      {/* Original media is intentionally used for full-resolution inspection. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={item.src} alt={item.alt} data-lightbox="off" />
      <p>{item.caption || item.alt}</p>
    </div>
  </dialog>
}
