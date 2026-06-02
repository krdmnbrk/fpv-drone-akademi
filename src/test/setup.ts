import '@testing-library/jest-dom/vitest';
import { afterEach, expect } from 'vitest';
import { cleanup } from '@testing-library/react';
import { toHaveNoViolations } from 'jest-axe';
import i18n from '@/i18n';

expect.extend(toHaveNoViolations);

// Force Turkish in tests so assertions are deterministic regardless of the
// jsdom navigator locale.
void i18n.changeLanguage('tr');

// jsdom does not implement canvas.getContext; stub it so WebGL detection returns
// false cleanly (no noisy "not implemented" output) and the 3D fallback renders.
HTMLCanvasElement.prototype.getContext = (() => null) as typeof HTMLCanvasElement.prototype.getContext;

// jsdom does not implement matchMedia; Framer Motion's reduced-motion hook needs it.
if (typeof window.matchMedia !== 'function') {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList;
}

afterEach(() => {
  cleanup();
});
