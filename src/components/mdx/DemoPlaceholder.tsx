import { useTranslation } from 'react-i18next';

/**
 * Marks where an interactive/animated demo will be wired. Renders a static,
 * descriptive placeholder so the lesson reads completely before the demo lands.
 */
export function DemoPlaceholder({ title, note }: { title: string; note?: string }) {
  const { t } = useTranslation();
  return (
    <figure className="my-5 rounded-xl border border-dashed border-brand-400/40 bg-brand-500/5 p-5">
      <div className="flex items-center gap-2 text-brand-200">
        <span aria-hidden="true">▶</span>
        <figcaption className="text-sm font-semibold">{title}</figcaption>
      </div>
      {note ? <p className="mt-2 text-sm text-brand-300">{note}</p> : null}
      <p className="mt-2 text-xs uppercase tracking-wide text-brand-400">
        {t('lesson.demoComingSoon')}
      </p>
    </figure>
  );
}
