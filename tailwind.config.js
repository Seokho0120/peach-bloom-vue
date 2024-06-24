/** @type {import('tailwindcss').Config} */
import containerQuery from '@tailwindcss/container-queries'

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx,vue}'],
  theme: {
    extend: {
      containers: {
        '8xl': '90rem',
        '9xl': '102rem',
        '10xl': '116rem',
        '11xl': '132rem',
        '12xl': '150rem'
      }
    }
  },
  plugins: [containerQuery],
  corePlugins: {
    preflight: true // css reset 적용 여부
  }
}
