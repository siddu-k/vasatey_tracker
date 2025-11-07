/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1dd3b0',
        'primary-dark': '#17b899',
        dark: '#1a1f2e',
        'dark-light': '#252b3d',
        'dark-lighter': '#2d3548',
      },
    },
  },
  plugins: [],
}
