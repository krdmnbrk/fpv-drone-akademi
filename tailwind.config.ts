import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';
import { motion, easingToCss } from './src/design/tokens';

// Motion scale is owned by src/design/tokens.ts; mirror it into Tailwind so
// utility classes and Framer Motion variants stay in sync.
const transitionDuration = Object.fromEntries(
  Object.entries(motion.duration).map(([name, ms]) => [name, `${ms}ms`]),
);

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
      transitionDuration,
      transitionTimingFunction: {
        standard: easingToCss(motion.easing.standard),
        emphasized: easingToCss(motion.easing.emphasized),
        exit: easingToCss(motion.easing.exit),
      },
    },
  },
  plugins: [typography],
} satisfies Config;
