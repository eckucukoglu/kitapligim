/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        paper: {
          50: '#fbf9f5',
          100: '#f6f1e9',
          200: '#ede2d3',
          300: '#dfcdb7',
          400: '#cbb094',
          500: '#b89476',
          800: '#342921',
          900: '#1e1813',
          950: '#140f0c',
        },
        ink: {
          50: '#f3f4f6',
          100: '#e5e7eb',
          200: '#d1d5db',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#090d16',
        },
      },
      fontFamily: {
        serif: ['"Fraunces"', '"Merriweather"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
