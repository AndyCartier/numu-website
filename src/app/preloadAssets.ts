'use client'

export type VideoWarmupAsset = {
  src: string
  poster?: string
}

export const CRITICAL_IMAGE_ASSETS = [
  '/branding/logo-black-numu.png',
  '/branding/logo-numu.png',
  '/images/hero/mycofoam_block_01.png',
  '/images/products/biofoam_detail.png',
] as const

export const NEXT_SWEEP_IMAGE_ASSETS = [
  '/images/materials/palm_leaf_substrate.png',
  '/images/materials/hemp_shivs.jpg',
  '/images/products/Chair.jpg',
  '/images/products/pressed_detail.jpg',
  '/images/products/fold_solo_panel.png',
  '/images/products/fold_hero_interior.png',
  '/images/products/fold_context_scale.png',
  // First carousel items (visible without scrolling)
  '/images/textures/texture_closeup_01.jpg',
  '/images/products/biofoam_detail.png',
  '/images/founder/founder_in_action.jpg',
  '/images/textures/texture_closeup_02.jpg',
] as const

export const DEFERRED_IMAGE_ASSETS = [
  '/images/applications/packaging01.jpg',
  '/images/applications/thermal_panel_wall.png',
  '/images/founder/Portrait.PNG',
  '/images/projects/acoustic_render_07.jpg',
  // Remaining carousel images
  '/images/projects/Mymo01.jpg',
  '/images/projects/Insulation.jpg',
  '/images/projects/Kinoko.jpg',
  '/images/projects/Kinoko02.jpg',
  '/images/projects/Lamp01.jpg',
  '/images/projects/Lamp02.jpg',
  '/images/projects/Pressed_samples.jpg',
  '/images/projects/Reroot_panels.jpg',
  '/images/projects/Spora_panels.jpg',
  '/images/projects/pressed_booth.jpg',
  '/images/applications/event_board.jpg',
] as const

export const NEXT_SWEEP_VIDEO_ASSETS: readonly VideoWarmupAsset[] = [
  { src: '/videos/numu_timelapse.mp4', poster: '/images/products/biofoam_detail.png' },
  { src: '/videos/numu_story_enhanced.mp4', poster: '/images/products/biofoam_detail.png' },
]

export const DEFERRED_VIDEO_ASSETS: readonly VideoWarmupAsset[] = [
  { src: '/videos/numu_story.mp4', poster: '/images/products/fold_hero_interior.png' },
]

type IdleCallbackHandle = number | ReturnType<typeof globalThis.setTimeout>
type IdleCallback = (deadline: IdleDeadline) => void

export function requestIdleTask(callback: IdleCallback, timeout = 1200): IdleCallbackHandle {
  if (typeof window === 'undefined') return 0

  if ('requestIdleCallback' in window) {
    return (window as Window & typeof globalThis).requestIdleCallback(callback, { timeout })
  }

  return globalThis.setTimeout(
    () =>
      callback({
        didTimeout: false,
        timeRemaining: () => 0,
      } as IdleDeadline),
    Math.min(timeout, 300)
  )
}

export function cancelIdleTask(handle: IdleCallbackHandle) {
  if (typeof window === 'undefined' || !handle) return

  if ('cancelIdleCallback' in window) {
    ;(window as Window & typeof globalThis).cancelIdleCallback(handle as number)
    return
  }

  globalThis.clearTimeout(handle)
}

export function preloadImage(src: string, fetchPriority: 'high' | 'low' = 'low') {
  return new Promise<void>((resolve) => {
    if (typeof window === 'undefined') {
      resolve()
      return
    }

    const img = new window.Image()
    let settled = false

    const finish = () => {
      if (settled) return
      settled = true
      resolve()
    }

    img.decoding = 'async'
    ;(img as HTMLImageElement & { fetchPriority?: 'high' | 'low' }).fetchPriority = fetchPriority

    img.onload = finish
    img.onerror = finish
    img.src = src

    if (img.complete) finish()
  })
}

export function preloadVideoMetadata(asset: VideoWarmupAsset) {
  return new Promise<void>((resolve) => {
    if (typeof document === 'undefined') {
      resolve()
      return
    }

    const video = document.createElement('video')
    let settled = false
    const timeout = window.setTimeout(finish, 4500)

    function finish() {
      if (settled) return
      settled = true
      window.clearTimeout(timeout)
      video.removeAttribute('src')
      video.load()
      resolve()
    }

    video.preload = 'metadata'
    video.muted = true
    video.playsInline = true
    video.onloadedmetadata = finish
    video.oncanplay = finish
    video.onerror = finish

    if (asset.poster) {
      void preloadImage(asset.poster)
    }

    video.src = asset.src
    video.load()
  })
}

export async function warmMediaAssets({
  images = [],
  videos = [],
  concurrency = 3,
  onProgress,
}: {
  images?: readonly string[]
  videos?: readonly VideoWarmupAsset[]
  concurrency?: number
  onProgress?: (completed: number, total: number) => void
}) {
  const tasks = [
    ...images.map((src) => () => preloadImage(src)),
    ...videos.map((asset) => () => preloadVideoMetadata(asset)),
  ]

  const total = tasks.length

  if (!total) {
    onProgress?.(0, 0)
    return
  }

  let index = 0
  let completed = 0

  const workers = Array.from({ length: Math.min(concurrency, total) }, async () => {
    while (index < total) {
      const taskIndex = index
      index += 1

      await tasks[taskIndex]().catch(() => undefined)
      completed += 1
      onProgress?.(completed, total)
    }
  })

  await Promise.all(workers)
}
