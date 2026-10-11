import images from '@/generated/responsive-images.json'

// Per-image framing so products stay whole and centred when a frame's shape differs from the photo.
// `focus` moves the crop (CSS object-position); `fit: 'contain'` shows the entire product on a matte
// sampled from the photo's own edge colours, for very wide or tall pieces that no crop can keep whole.
export type ImageFraming = { focus?: string; fit?: 'contain'; matte?: string }

const sizes = images as Record<string, { width: number; height: number }>

// Feather the photo's own edges into the matte. With object-fit: contain the drawn image sits inside
// the element box, so the mask stops are placed where the image edges actually fall for this frame.
function featherMask(src: string, boxAspect: number) {
  const size = sizes[src]
  if (!size) return undefined
  const imageAspect = size.width / size.height
  const wide = imageAspect > boxAspect
  const filled = wide ? boxAspect / imageAspect : imageAspect / boxAspect
  if (filled > 0.97) return undefined
  const start = ((1 - filled) / 2) * 100
  const end = 100 - start
  const soft = filled * 6
  const direction = wide ? 'to bottom' : 'to right'
  const mask = `linear-gradient(${direction}, transparent ${start}%, #000 ${start + soft}%, #000 ${end - soft}%, transparent ${end}%)`
  return { maskImage: mask, WebkitMaskImage: mask }
}

export function framing(image?: ImageFraming & { src?: string }, boxAspect?: number) {
  if (!image) return { imgStyle: undefined, frameStyle: undefined }
  if (image.fit === 'contain') {
    const feather = image.src && boxAspect ? featherMask(image.src, boxAspect) : undefined
    return {
      imgStyle: { objectFit: 'contain' as const, objectPosition: image.focus || '50% 50%', ...feather },
      frameStyle: image.matte ? { background: image.matte } : undefined,
    }
  }
  return { imgStyle: image.focus ? { objectPosition: image.focus } : undefined, frameStyle: undefined }
}
