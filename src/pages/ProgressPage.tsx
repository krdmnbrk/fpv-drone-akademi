import { useTranslation } from 'react-i18next';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/useAppStore';
import { overallProgressPct, selectCompletedCount } from '@/store/selectors';
import { getAvailableFlightLessonCount } from '@/content';
import { badgeDefinitions } from '@/lib/badges';
import { cn } from '@/lib/cn';

export function ProgressPage() {
  const { t } = useTranslation();
  const completed = useAppStore(selectCompletedCount);
  const badges = useAppStore((state) => state.badges);
  const resetProgress = useAppStore((state) => state.resetProgress);

  const total = getAvailableFlightLessonCount();
  const pct = overallProgressPct(completed, total);
  const earnedCount = badgeDefinitions.filter((badge) => badges[badge.id]).length;

  const badgeText: Record<string, { name: string; desc: string }> = {
    'first-flight': { name: t('badges.firstFlight.name'), desc: t('badges.firstFlight.desc') },
    'beginner-graduate': {
      name: t('badges.beginnerGraduate.name'),
      desc: t('badges.beginnerGraduate.desc'),
    },
    'intermediate-graduate': {
      name: t('badges.intermediateGraduate.name'),
      desc: t('badges.intermediateGraduate.desc'),
    },
    'advanced-graduate': {
      name: t('badges.advancedGraduate.name'),
      desc: t('badges.advancedGraduate.desc'),
    },
    'full-curriculum': {
      name: t('badges.fullCurriculum.name'),
      desc: t('badges.fullCurriculum.desc'),
    },
  };

  const handleReset = () => {
    if (window.confirm(t('progress.resetConfirm'))) {
      resetProgress();
    }
  };

  return (
    <Container className="py-12">
      <h1 className="text-3xl font-bold text-white">{t('progress.title')}</h1>

      <section
        className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6"
        aria-labelledby="overall-heading"
      >
        <div className="flex items-baseline justify-between">
          <h2 id="overall-heading" className="text-lg font-semibold text-white">
            {t('progress.overall')}
          </h2>
          <span className="text-sm text-brand-200">
            {completed} / {total}
          </span>
        </div>
        <div
          className="mt-3 h-3 overflow-hidden rounded-full bg-white/10"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={t('progress.overall')}
        >
          <div
            className="h-full rounded-full bg-brand-500 transition-[width] duration-slow ease-standard"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-2 text-sm text-brand-300">{pct}%</p>
      </section>

      <section className="mt-10" aria-labelledby="badges-heading">
        <div className="flex items-baseline justify-between">
          <h2 id="badges-heading" className="text-xl font-semibold text-white">
            {t('progress.badges')}
          </h2>
          <span className="text-sm text-brand-300">
            {earnedCount} / {badgeDefinitions.length}
          </span>
        </div>
        {earnedCount === 0 && <p className="mt-3 text-brand-200">{t('progress.noBadges')}</p>}
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {badgeDefinitions.map((badge) => {
            const earned = Boolean(badges[badge.id]);
            const text = badgeText[badge.id];
            return (
              <li
                key={badge.id}
                className={cn(
                  'flex items-center gap-3 rounded-xl border p-4',
                  earned
                    ? 'border-brand-400/50 bg-brand-500/10'
                    : 'border-white/10 bg-white/5 opacity-60',
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'grid h-10 w-10 shrink-0 place-items-center rounded-full text-lg',
                    earned ? 'bg-brand-500/30' : 'bg-white/10',
                  )}
                >
                  {earned ? '🏅' : '🔒'}
                </span>
                <div>
                  <p className="font-medium text-brand-50">{text?.name}</p>
                  <p className="text-sm text-brand-300">{earned ? text?.desc : t('badges.locked')}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <Button variant="secondary" className="mt-12" onClick={handleReset}>
        {t('progress.reset')}
      </Button>
    </Container>
  );
}
