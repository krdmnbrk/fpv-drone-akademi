import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type CalloutType = 'info' | 'warning' | 'tip';

const styles: Record<CalloutType, string> = {
  info: 'border-brand-400/40 bg-brand-500/10',
  warning: 'border-amber-400/40 bg-amber-500/10',
  tip: 'border-emerald-400/40 bg-emerald-500/10',
};

const icons: Record<CalloutType, string> = {
  info: 'ℹ️',
  warning: '⚠️',
  tip: '💡',
};

export function Callout({ type = 'info', children }: { type?: CalloutType; children: ReactNode }) {
  return (
    <div role="note" className={cn('my-4 flex gap-3 rounded-xl border p-4', styles[type])}>
      <span aria-hidden="true" className="text-lg leading-none">
        {icons[type]}
      </span>
      <div className="text-sm leading-relaxed text-brand-50 [&>p+p]:mt-2 [&>p]:my-0">{children}</div>
    </div>
  );
}
