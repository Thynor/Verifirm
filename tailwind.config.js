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
        sky: {
          DEFAULT: '#A0D2EB',
          50: '#f4f9fd',
          100: '#e8f3fa',
          200: '#c5e2f4',
          300: '#A0D2EB',
          400: '#7bbfe1',
          500: '#52a7d3',
        },
        mist: {
          DEFAULT: '#E5EAF5',
          light: '#f2f5fb',
          dark: '#d5deee'
        },
        lavender: {
          DEFAULT: '#D0BDF4',
          light: '#e7ddfa',
          dark: '#b89ced'
        },
        violet: {
          DEFAULT: '#8458B3',
          hover: '#7346a0',
          dark: '#62358e',
          light: '#976ec4',
          50: '#f7f4fb',
          100: '#ede6f6',
          200: '#d0bdf4',
          500: '#8458B3',
          600: '#7346a0',
          700: '#62358e',
          800: '#51277a',
          900: '#3c185e'
        },
        vfslate: {
          DEFAULT: '#494D5F',
          muted: '#5d6180',
          darkbg: '#2f3242',
          darkcard: '#3a3e4f',
          darkborder: 'rgba(208,189,244,0.2)'
        },
        status: {
          highRisk: '#C62828',
          warning: '#B26A00',
          lowRisk: '#14803C',
          notChecked: '#5d6180',
          unverified: '#8458B3'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      }
    },
  },
  plugins: [],
}
