import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Container } from '@/components/ui/Container';
import { getFlightCurriculum, type FlightLessonItem } from '@/content';
import { flightLevels } from '@/content/curriculum';
import { useAppStore } from '@/store/useAppStore';
import { selectLessonStatus } from '@/store/selectors';
import { cn } from '@/lib/cn';

function LessonRow({ item }: { item: FlightLessonItem }) {
  const { t } = useTranslation();
  const status = useAppStore((state) => selectLessonStatus(state, item.id));

  let badge: { label: string; className: string } | null = null;
  if (!item.available) {
    badge = { label: t('flight.comingSoon'), className: 'border-white/10 text-brand-400' };
  } else if (status === 'completed') {
    badge = { label: t('lesson.completed'), className: 'border-emerald-400/40 text-emerald-300' };
  } else if (status === 'in-progress') {
    badge = { label: t('flight.inProgress'), className: 'border-brand-400/40 text-brand-200' };
  }

  const inner = (
    <div
      className={cn(
        'flex items-center justify-between gap-4 rounded-xl border p-4',
        item.available
          ? 'border-white/10 bg-white/5'
          : 'border-dashed border-white/10 bg-transparent opacity-70',
      )}
    >
      <div>
        <p className="font-medium text-brand-50">{item.title}</p>
        <p className="mt-1 text-sm text-brand-300">{item.summary}</p>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        {item.estimatedMinutes !== undefined && (
          <span className="hidden text-xs text-brand-400 sm:inline">
            {item.estimatedMinutes} {t('common.minutesShort')}
          </span>
        )}
        {badge && (
          <span className={cn('rounded-full border px-2 py-0.5 text-xs', badge.className)}>
            {badge.label}
          </span>
        )}
      </div>
    </div>
  );

  if (!item.available) {
    return <div aria-disabled="true">{inner}</div>;
  }

  return (
    <Link
      to={`/lesson/${item.id}`}
      className="block rounded-xl transition-transform duration-fast ease-standard hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
    >
      {inner}
    </Link>
  );
}

export function FlightPage() {
  const { t } = useTranslation();
  const curriculum = getFlightCurriculum();

  return (
    <Container className="py-12">
      <h1 className="text-3xl font-bold text-white">{t('flight.title')}</h1>
      <p className="mt-3 max-w-2xl text-brand-200">{t('flight.intro')}</p>

      <div className="mt-10 space-y-10">
        {flightLevels.map((level) => (
          <section key={level} aria-labelledby={`level-${level}`}>
            <h2 id={`level-${level}`} className="text-xl font-semibold text-white">
              {t(`flight.levels.${level}`)}
            </h2>
            <ul className="mt-4 grid gap-3">
              {curriculum[level].map((item) => (
                <li key={item.id}>
                  <LessonRow item={item} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </Container>
  );
}
