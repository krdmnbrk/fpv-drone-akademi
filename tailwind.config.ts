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
        // "Cockpit HUD" instrument cyan — the brand scale every component reads
        // through `brand-*`. Light shades are cool inks on a near-black panel;
        // mid shades are the glowing cyan accent; dark shades are the cockpit
        // surfaces. (Amber/emerald semantic colors stay as-is for caution/ok.)
        brand: {
          50: '#eafaf8',
          100: '#d8efed',
          200: '#bfe9e4',
          300: '#5fe3da',
          400: '#2fd6cd',
          500: '#16b6ad',
          600: '#0f928b',
          700: '#0c726d',
          800: '#0b524f',
          900: '#08131c',
          950: '#04070d',
        },
      },
      fontFamily: {
        // Barlow = body; Chakra Petch = HUD display (headings); Share Tech Mono
        // = technical labels/telemetry.
        sans: ['Barlow', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Chakra Petch"', 'system-ui', 'sans-serif'],
        mono: ['"Share Tech Mono"', 'ui-monospace', 'monospace'],
      },
      // Crisper, instrument-panel corners — sharpen the large radii globally so
      // existing rounded-xl/2xl cards read as HUD panels without per-file edits.
      borderRadius: {
        lg: '0.25rem',
        xl: '0.25rem',
        '2xl': '0.375rem',
        '3xl': '0.5rem',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(47,214,205,0.25), 0 0 28px rgba(47,214,205,0.25)',
        'glow-strong': '0 0 0 1px rgba(47,214,205,0.4), 0 0 40px rgba(47,214,205,0.4)',
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
