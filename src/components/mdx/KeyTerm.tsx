import type { ReactNode } from 'react';

/**
 * Inline jargon term. Shows the Turkish term with the English equivalent in a
 * tooltip (and announced to screen readers via the title).
 */
export function KeyTerm({ en, children }: { en: string; children: ReactNode }) {
  return (
    <span
      className="font-medium text-brand-200 underline decoration-brand-400/60 decoration-dotted underline-offset-2"
      title={en}
    >
      {children}
    </span>
  );
}
