'use client'

import { useEffect } from 'react'

function isLocalAsset(src: string) {
  try {
    const url = new URL(src, window.location.href)
    return url.origin === window.location.origin && !src.startsWith('data:') && !src.startsWith('blob:')
  } catch {
    return false
  }
}

/**
 * Safari on this machine occasionally rejects an otherwise valid local media
 * element. Fetching the same local asset and assigning its object URL gives
 * WebKit a media source it consistently decodes. This only runs in Safari and
 * only after the original element has failed.
 */
export default function SafariMediaRecovery() {
  useEffect(() => {
    const objectUrls: string[] = []
    const recovering = new WeakSet<Element>()

    async function recoverImage(image: HTMLImageElement) {
      if (recovering.has(image)) return
      const source = image.currentSrc || image.src
      if (!source || !isLocalAsset(source)) return

      recovering.add(image)
      try {
        const response = await fetch(source, { cache: 'force-cache' })
        if (!response.ok) return
        const url = URL.createObjectURL(await response.blob())
        objectUrls.push(url)
        image.src = url
      } finally {
        recovering.delete(image)
      }
    }

    async function recoverVideo(video: HTMLVideoElement) {
      if (recovering.has(video)) return
      const source = video.currentSrc || video.src
      if (!source || !isLocalAsset(source)) return

      recovering.add(video)
      try {
        const response = await fetch(source, { cache: 'force-cache' })
        if (!response.ok) return
        const url = URL.createObjectURL(await response.blob())
        objectUrls.push(url)
        video.src = url
        video.load()
        void video.play().catch(() => undefined)
      } finally {
        recovering.delete(video)
      }
    }

    function retryFailedMedia() {
      document.querySelectorAll('img').forEach((image) => {
        if (image.complete && image.naturalWidth === 0) void recoverImage(image)
      })
      document.querySelectorAll('video').forEach((video) => {
        if (video.error) void recoverVideo(video)
      })
    }

    function onError(event: Event) {
      if (event.target instanceof HTMLImageElement) void recoverImage(event.target)
      if (event.target instanceof HTMLVideoElement) void recoverVideo(event.target)
    }

    document.addEventListener('error', onError, true)
    const observer = new MutationObserver(retryFailedMedia)
    observer.observe(document.body, { childList: true, subtree: true })
    const firstPass = window.setTimeout(retryFailedMedia, 250)
    const secondPass = window.setTimeout(retryFailedMedia, 1600)

    return () => {
      document.removeEventListener('error', onError, true)
      observer.disconnect()
      window.clearTimeout(firstPass)
      window.clearTimeout(secondPass)
      objectUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [])

  return null
}
