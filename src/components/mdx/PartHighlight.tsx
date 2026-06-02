import { Link } from 'react-router-dom';
import { getPart } from '@/content';

/**
 * Cross-link from a lesson to a hardware part. In the hardware explorer this
 * part id also drives the 3D highlight (Phase 3).
 */
export function PartHighlight({ part }: { part: string }) {
  const data = getPart(part);
  if (!data) return null;

  return (
    <Link
      to={`/hardware?part=${data.id}`}
      className="my-4 flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 no-underline transition-colors duration-base ease-standard hover:border-brand-400/50 hover:bg-white/10"
    >
      <span
        aria-hidden="true"
        className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-500/20 text-brand-200"
      >
        ⬡
      </span>
      <span className="flex flex-col">
        <span className="text-xs uppercase tracking-wide text-brand-300">İlgili donanım</span>
        <span className="font-medium text-brand-50">{data.name}</span>
      </span>
    </Link>
  );
}
