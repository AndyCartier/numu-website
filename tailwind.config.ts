import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        headline: ['2.5rem', { lineHeight: '1.1' }],
        label: ['0.6875rem', { lineHeight: '1.5' }],
      },
      colors: {
        cream: '#F5F1E8',
        charcoal: '#1A1714',
        'warm-mid': '#B29B7F',
        'warm-light': '#C9B89F',
        'warm-dark': '#4A3F34',
      },
    },
  },
  plugins: [],
}

export default config
