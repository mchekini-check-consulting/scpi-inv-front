/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#F5F7F5',
        secondary: '#5B9F5A',
        tertiary: '#2D5F2E',
      }
    },
  },
  plugins: [],
}