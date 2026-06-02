/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'media',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-body)'],
        display: ['var(--font-display)'],
      },
    },
  },
  plugins: [],
}
