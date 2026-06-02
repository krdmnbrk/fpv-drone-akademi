import { useTranslation } from 'react-i18next';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/useAppStore';
import { selectBadgeCount, selectCompletedCount } from '@/store/selectors';

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-5">
      <dt className="text-sm text-brand-200">{label}</dt>
      <dd className="mt-1 text-3xl font-bold text-white">{value}</dd>
    </div>
  );
}

export function ProgressPage() {
  const { t } = useTranslation();
  const completed = useAppStore(selectCompletedCount);
  const badgeCount = useAppStore(selectBadgeCount);
  const badges = useAppStore((state) => state.badges);
  const resetProgress = useAppStore((state) => state.resetProgress);

  const handleReset = () => {
    if (window.confirm(t('progress.resetConfirm'))) {
      resetProgress();
    }
  };

  return (
    <Container className="py-12">
      <h1 className="text-3xl font-bold text-white">{t('progress.title')}</h1>

      <dl className="mt-8 grid gap-4 sm:grid-cols-2">
        <Stat label={t('progress.completedLessons')} value={completed} />
        <Stat label={t('progress.badges')} value={badgeCount} />
      </dl>

      <section className="mt-10" aria-labelledby="badges-heading">
        <h2 id="badges-heading" className="text-xl font-semibold text-white">
          {t('progress.badges')}
        </h2>
        {badgeCount === 0 ? (
          <p className="mt-3 text-brand-200">{t('progress.noBadges')}</p>
        ) : (
          <ul className="mt-4 flex flex-wrap gap-2">
            {Object.keys(badges).map((badgeId) => (
              <li
                key={badgeId}
                className="rounded-full border border-brand-400/40 bg-brand-500/10 px-3 py-1 text-sm text-brand-100"
              >
                {badgeId}
              </li>
            ))}
          </ul>
        )}
      </section>

      <Button variant="secondary" className="mt-12" onClick={handleReset}>
        {t('progress.reset')}
      </Button>
    </Container>
  );
}
