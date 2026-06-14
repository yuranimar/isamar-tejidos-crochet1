/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        burgundy: {
          DEFAULT: '#5B0E1B',
          dark:    '#4A121D',
          mid:     '#6B1E2A',
          soft:    '#7A1E3A',
          muted:   '#8B3A45',
          hover:   '#A54552',
        },
        gold: {
          DEFAULT: '#D4AF37',
          warm:    '#C5A059',
          light:   '#CBB38B',
          button:  '#D4A75D',
        },
        rose: {
          DEFAULT: '#F5EBE6',
          cool:    '#F5E6E6',
          deep:    '#EAD8D8',
          muted:   '#F8F0F0',
          card:    '#F4E5E5',
        },
        brown: {
          DEFAULT: '#3D2E23',
          dark:    '#3B2A1A',
          stitch:  '#3B2412',
        },
        cream: {
          DEFAULT: '#FAF6F3',
          warm:    '#F3E7D3',
          light:   '#FFF9F7',
          stitch:  '#F8F4EF',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans:  ['Jost', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
