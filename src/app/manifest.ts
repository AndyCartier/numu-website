import type { MetadataRoute } from 'next'

// Lets visitors (e.g. from an exhibition QR code) save NUMU to their home screen with the proper icon.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'NUMU — Grown materials, Dubai',
    short_name: 'NUMU',
    description: 'Grown materials, surfaces and objects from PALMYCO™, made in Dubai.',
    start_url: '/',
    display: 'browser',
    background_color: '#f5f1e8',
    theme_color: '#f5f1e8',
    icons: [
      { src: '/icon.png', sizes: '512x512', type: 'image/png' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  }
}
