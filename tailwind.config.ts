import type { Config } from 'tailwindcss';

/**
 * Tailwind is driven by the design tokens in `src/design/tokens.ts`.
 * This starter palette is refined in the design-system step (Phase 2).
 */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Aviation "sky/flight" brand blue
        brand: {
          50: '#eef6ff',
          100: '#d9ebff',
          200: '#bcdcff',
          300: '#8ec6ff',
          400: '#59a6ff',
          500: '#3385fb',
          600: '#1f66f0',
          700: '#1a51dd',
          800: '#1c43b3',
          900: '#1d3c8d',
          950: '#16265a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
