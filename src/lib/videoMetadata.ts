import { buildAbsoluteUrl } from './site'

export const videoJsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: 'NUMU material process timelapse',
    description: 'Silent footage of NUMU material-process stages.',
    contentUrl: buildAbsoluteUrl('/videos/numu_timelapse.mp4').toString(),
    thumbnailUrl: buildAbsoluteUrl('/images/products/biofoam_detail.png').toString(),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: 'NUMU FOLD material animation',
    description: 'Silent footage of the FOLD acoustic-panel system.',
    contentUrl: buildAbsoluteUrl('/videos/numu_story.mp4').toString(),
    thumbnailUrl: buildAbsoluteUrl('/images/products/fold_hero_interior.png').toString(),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: 'NUMU production documentation',
    description: 'NUMU production documentation showing the material process from substrate preparation through finishing.',
    contentUrl: buildAbsoluteUrl('/videos/numu_story_enhanced.mp4').toString(),
    thumbnailUrl: buildAbsoluteUrl('/images/products/biofoam_detail.png').toString(),
  },
]

