import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Container } from '@/components/ui/Container';
import {
  getFlightCurriculum,
  getFlightLessonTitle,
  getOrderedAvailableFlightLessonIds,
  type FlightLessonItem,
} from '@/content';
import { flightLevels } from '@/content/curriculum';
import { useAppStore } from '@/store/useAppStore';
import { arePrerequisitesMet, selectLessonStatus, selectResumeLessonId } from '@/store/selectors';
import { cn } from '@/lib/cn';

function LessonRow({
  item,
  step,
  isResume,
}: {
  item: FlightLessonItem;
  step: number;
  isResume: boolean;
}) {
  const { t } = useTranslation();
  const status = useAppStore((state) => selectLessonStatus(state, item.id));
  const prereqMet = useAppStore((state) => arePrerequisitesMet(state, item.prerequisites));
  const locked = item.available && !prereqMet;

  let badge: { label: string; className: string } | null = null;
  if (!item.available) {
    badge = { label: t('flight.comingSoon'), className: 'border-white/10 text-brand-400' };
  } else if (status === 'completed') {
    badge = { label: t('lesson.completed'), className: 'border-emerald-400/40 text-emerald-300' };
  } else if (status === 'in-progress') {
    badge = { label: t('flight.inProgress'), className: 'border-brand-400/40 text-brand-200' };
  }

  const stepCircle = (
    <span
      aria-hidden="true"
      className={cn(
        'grid h-8 w-8 shrink-0 place-items-center rounded-full border text-sm font-semibold',
        status === 'completed'
          ? 'border-emerald-400/50 bg-emerald-500/15 text-emerald-200'
          : isResume
            ? 'border-brand-400 bg-brand-500/20 text-white'
            : 'border-white/15 text-brand-300',
      )}
    >
      {status === 'completed' ? '✓' : item.available ? step : '–'}
    </span>
  );

  const inner = (
    <div
      className={cn(
        'flex items-center gap-3 rounded-xl border p-4',
        item.available
          ? 'border-white/10 bg-white/5'
          : 'border-dashed border-white/10 bg-transparent opacity-70',
        isResume && 'ring-2 ring-brand-400/60',
        locked && 'opacity-60',
      )}
    >
      {stepCircle}
      <div className="min-w-0 flex-1">
        <p className="font-medium text-brand-50">{item.title}</p>
        <p className="mt-1 text-sm text-brand-300">{item.summary}</p>
        {locked && (
          <p className="mt-1 text-xs text-amber-300">
            {t('flight.prereqHint')}:{' '}
            {item.prerequisites.map((id) => getFlightLessonTitle(id) ?? id).join(', ')}
          </p>
        )}
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        {item.estimatedMinutes !== undefined && (
          <span className="text-xs text-brand-400">
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

  // Soft gate: prerequisites unmet -> discourage but allow an explicit override.
  if (locked) {
    return (
      <div>
        {inner}
        <div className="mt-1 pl-11">
          <Link
            to={`/lesson/${item.id}`}
            className="text-xs text-brand-300 underline underline-offset-2 hover:text-brand-100"
          >
            {t('flight.openAnyway')}
          </Link>
        </div>
      </div>
    );
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
  const orderedIds = useMemo(() => getOrderedAvailableFlightLessonIds(), []);
  const resumeId = useAppStore((state) => selectResumeLessonId(state, orderedIds));

  const stepOf = useMemo(() => {
    const map = new Map<string, number>();
    orderedIds.forEach((id, index) => map.set(id, index + 1));
    return map;
  }, [orderedIds]);

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
                  <LessonRow
                    item={item}
                    step={stepOf.get(item.id) ?? 0}
                    isResume={item.id === resumeId}
                  />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </Container>
  );
}
