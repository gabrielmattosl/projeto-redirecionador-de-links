/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'blue-base': '#2C46B1',
        'blue-dark': '#2C4091',
        'danger': '#B12C4D',
        'gray-100': '#F9F9FB',
        'gray-200': '#E4E6EC',
        'gray-300': '#CDCFD5',
        'gray-400': '#74798B',
        'gray-500': '#4D505C',
        'gray-600': '#1F2025',
      },
      fontFamily: {
        sans: ['"Open Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
