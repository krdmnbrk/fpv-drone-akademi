import { useId, useState, type ReactNode } from 'react';

/**
 * Inline jargon term. Tapping/focusing reveals the English equivalent in a small
 * popover — works on touch (the old hover-only `title` was invisible on phones).
 */
export function KeyTerm({ en, children }: { en: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const tooltipId = useId();

  return (
    <span className="relative inline-block">
      <button
        type="button"
        aria-expanded={open}
        aria-describedby={open ? tooltipId : undefined}
        onClick={() => setOpen((value) => !value)}
        onBlur={() => setOpen(false)}
        className="rounded font-medium text-brand-200 underline decoration-brand-400/60 decoration-dotted underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
      >
        {children}
      </button>
      {open && (
        <span
          id={tooltipId}
          role="tooltip"
          className="absolute bottom-full left-0 z-50 mb-1 w-max max-w-[16rem] rounded-md border border-white/15 bg-brand-900 px-2 py-1 text-xs font-normal text-brand-100 shadow-lg"
        >
          {en}
        </span>
      )}
    </span>
  );
}
