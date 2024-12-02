/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'twc-theme': {
          50: 'var(--twc-theme-50)',
          100: 'var(--twc-theme-100)',
          200: 'var(--twc-theme-200)',
          300: 'var(--twc-theme-300)',
          400: 'var(--twc-theme-400)',
          500: 'var(--twc-theme-500)',
          600: 'var(--twc-theme-600)',
          700: 'var(--twc-theme-700)',
          800: 'var(--twc-theme-800)',
          900: 'var(--twc-theme-900)',
          950: 'var(--twc-theme-950)',
        },
      },
    },
  },
  plugins: [],
};
