/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        theme1: {
          50: '#f1f6fd',
          100: '#dfebfa',
          200: '#c7dbf6',
          300: '#a0c5f0',
          400: '#87b2ea',
          500: '#5386de',
          600: '#3e6ad2',
          700: '#3557c0',
          800: '#30499d',
          900: '#2c407c',
          950: '#1f284c',
        },
        theme2: {
          50: '#fef9ee',
          100: '#fcf2d8',
          200: '#f8e2b0',
          300: '#f4cf88',
          400: '#edab4a',
          500: '#e99326',
          600: '#da791c',
          700: '#b55e19',
          800: '#904a1c',
          900: '#743e1a',
          950: '#3f1e0b',
        },
      },
    },
  },
  plugins: [],
};
