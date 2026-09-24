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
      borderRadius: {
        sm: '0.125rem',
        DEFAULT: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        full: '9999px',
      },
      boxShadow: {
        ambient: '0 4px 16px rgba(31, 32, 37, 0.06)',
      },
    },
  },
  plugins: [],
};
