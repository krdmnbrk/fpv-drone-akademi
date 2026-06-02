import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      css: false,
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json-summary', 'html'],
        include: ['src/**/*.{ts,tsx}'],
        exclude: [
          'src/**/*.d.ts',
          'src/main.tsx',
          'src/test/**',
          'src/**/*.test.{ts,tsx}',
          'src/**/*.stories.tsx',
          // R3F scenes need a real WebGL context; verified via the live preview.
          'src/scenes/**',
        ],
        // Logic-heavy modules carry a higher, enforced bar (KAPI 2).
        thresholds: {
          'src/store/**/*.ts': { lines: 90, functions: 90, branches: 85, statements: 90 },
        },
      },
    },
  }),
);
