'use client'

import images from '@/generated/responsive-images.json'
type ResponsiveImage = { src: string; srcSet: string; width: number; height: number }
const assets: Record<string, ResponsiveImage> = images

type SafariSafeImageProps = Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  src: string
  alt: string
  fill?: boolean
  priority?: boolean
  unoptimized?: boolean
}

export default function SafariSafeImage({ src, alt, fill = false, priority = false, unoptimized: _unoptimized, style, ...props }: SafariSafeImageProps) {
  // Branding artwork depends on its original alpha channel. The responsive-media
  // pipeline emits JPEG fallbacks, which put an opaque rectangle behind the logo.
  const preserveOriginal = src.startsWith('/branding/') || src.endsWith('.svg')
  const asset = preserveOriginal ? undefined : assets[src]
  // Existing pre-generated srcsets avoid duplicate optimization and retain originals.
  // The lightbox reads data-full-src: use the largest web derivative, since some keys (/collections/...) are not public files.
  // eslint-disable-next-line @next/next/no-img-element
  return <img {...props} alt={alt} src={asset?.src || src} srcSet={props.srcSet || asset?.srcSet}
    sizes={props.sizes || (fill ? '100vw' : undefined)}
    width={props.width || (!fill ? asset?.width : undefined)} height={props.height || (!fill ? asset?.height : undefined)}
    data-full-src={asset?.src || src}
    loading={priority ? 'eager' : props.loading || 'lazy'} fetchPriority={priority ? 'high' : 'auto'} decoding="async"
    style={fill ? { position: 'absolute', inset: 0, width: '100%', height: '100%', ...style } : style} />
}
