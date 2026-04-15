import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        numu: {
          cream: '#F4EFE8',
          sand:  '#E2D8CB',
          beige: '#C9B89F',
          stone: '#9C8E7F',
          bark:  '#4A3F34',
          dark:  '#1A1714',
          charcoal: '#221F1B',
          warm:  '#B5A08B',
          mist:  '#EDE7DE',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans:    ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display':  ['clamp(4rem, 11vw, 11.5rem)', { lineHeight: '0.87',  letterSpacing: '-0.04em' }],
        'headline': ['clamp(2.25rem, 5vw, 4.5rem)',  { lineHeight: '1.06',  letterSpacing: '-0.03em' }],
        'subhead':  ['clamp(1.25rem, 2.2vw, 2rem)',   { lineHeight: '1.22',  letterSpacing: '-0.02em' }],
        'label':    ['0.6875rem', { lineHeight: '1', letterSpacing: '0.15em' }],
      },
      transitionTimingFunction: {
        'natural': 'cubic-bezier(0.22, 1, 0.36, 1)',
        'sharp':   'cubic-bezier(0.76, 0, 0.24, 1)',
      },
    },
  },
  plugins: [],
}

export default config
