'use client'

import { useEffect, useState } from 'react'
import ImageDialog, { type ExpandedImage } from './ImageDialog'

function eligible(img: HTMLImageElement) {
  if (!img.alt || img.closest('[data-lightbox="off"], nav, dialog, [aria-hidden="true"], a, button, [role="dialog"]')) return false
  if (img.parentElement?.closest('[role="button"]') || !img.closest('main')) return false
  const rect = img.getBoundingClientRect()
  return rect.width >= 72 && rect.height >= 72 && Boolean(img.currentSrc || img.src)
}

export default function GlobalImageLightbox() {
  const [item, setItem] = useState<ExpandedImage | null>(null)
  useEffect(() => {
    const owned = new Map<HTMLImageElement, { tab: string | null; role: string | null; label: string | null }>()
    const refresh = () => {
      document.querySelectorAll<HTMLImageElement>('main img').forEach(img => {
        if (!eligible(img) || owned.has(img)) return
        owned.set(img, { tab: img.getAttribute('tabindex'), role: img.getAttribute('role'), label: img.getAttribute('aria-label') })
        img.tabIndex = 0
        img.setAttribute('role', 'button')
        img.setAttribute('aria-label', `Enlarge: ${img.alt}`)
      })
    }
    const open = (img: HTMLImageElement) => {
      img.focus({ preventScroll: true })
      setItem({ src: img.getAttribute('data-full-src') || img.currentSrc || img.src, alt: img.alt, caption: img.getAttribute('data-lightbox-caption') || img.alt })
    }
    const click = (event: MouseEvent) => {
      if (event.target instanceof HTMLImageElement && eligible(event.target)) {
        event.preventDefault(); event.stopPropagation(); open(event.target)
      }
    }
    const key = (event: KeyboardEvent) => {
      if ((event.key === 'Enter' || event.key === ' ') && event.target instanceof HTMLImageElement && eligible(event.target)) {
        event.preventDefault(); open(event.target)
      }
    }
    refresh()
    const observer = new MutationObserver(refresh)
    observer.observe(document.body, { childList: true, subtree: true })
    document.addEventListener('load', refresh, true)
    document.addEventListener('click', click, true)
    document.addEventListener('keydown', key)
    return () => {
      observer.disconnect()
      document.removeEventListener('load', refresh, true)
      document.removeEventListener('click', click, true)
      document.removeEventListener('keydown', key)
      owned.forEach((original, img) => {
        for (const [name, value] of [['tabindex', original.tab], ['role', original.role], ['aria-label', original.label]]) {
          if (value === null) img.removeAttribute(name!); else img.setAttribute(name!, value!)
        }
      })
    }
  }, [])
  return item ? <ImageDialog item={item} onClose={() => setItem(null)} /> : null
}
