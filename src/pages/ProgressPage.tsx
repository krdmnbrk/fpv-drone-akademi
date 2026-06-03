import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/useAppStore';
import { overallProgressPct, selectCompletedCount } from '@/store/selectors';
import { getAvailableFlightLessonCount } from '@/content';
import { badgeDefinitions, getBadgeProgress } from '@/lib/badges';
import { useBadgeText } from '@/lib/useBadgeText';
import { cn } from '@/lib/cn';

export function ProgressPage() {
  const { t } = useTranslation();
  const state = useAppStore();
  const { badges } = state;
  const badgeText = useBadgeText();

  const completed = selectCompletedCount(state);
  const total = getAvailableFlightLessonCount();
  const pct = overallProgressPct(completed, total);
  const earnedCount = badgeDefinitions.filter((badge) => badges[badge.id]).length;

  const [confirmOpen, setConfirmOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);

  // Focus the confirm button when the dialog opens.
  useEffect(() => {
    if (confirmOpen) confirmRef.current?.focus();
  }, [confirmOpen]);

  const closeConfirm = () => {
    setConfirmOpen(false);
    triggerRef.current?.focus(); // restore focus to the trigger
  };

  const confirmReset = () => {
    state.resetProgress();
    closeConfirm();
  };

  // While the dialog is open: Esc dismisses, and Tab is trapped between the two
  // buttons. Handled at the document level so it works regardless of focus.
  useEffect(() => {
    if (!confirmOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setConfirmOpen(false);
        triggerRef.current?.focus();
        return;
      }
      if (event.key === 'Tab') {
        const first = cancelRef.current;
        const last = confirmRef.current;
        if (!first || !last) return;
        const active = document.activeElement;
        if (event.shiftKey && active === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && active === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [confirmOpen]);

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
            const prog = getBadgeProgress(state, badge.id);
            const progPct = prog.target > 0 ? Math.round((prog.current / prog.target) * 100) : 0;
            return (
              <li
                key={badge.id}
                className={cn(
                  'flex items-start gap-3 rounded-xl border p-4',
                  earned
                    ? 'border-brand-400/50 bg-brand-500/10'
                    : 'border-white/10 bg-white/5 opacity-80',
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
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-brand-50">{text?.name}</p>
                  {earned ? (
                    <p className="text-sm text-brand-300">{text?.desc}</p>
                  ) : (
                    <>
                      <p className="text-sm text-brand-300">
                        <span className="sr-only">{t('badges.locked')}</span>
                        <span>
                          {prog.current} / {prog.target}
                        </span>
                      </p>
                      {prog.target > 0 && (
                        <div
                          aria-hidden="true"
                          className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10"
                        >
                          <div
                            className="h-full rounded-full bg-brand-500"
                            style={{ width: `${progPct}%` }}
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <Button
        ref={triggerRef}
        variant="secondary"
        className="mt-12"
        onClick={() => setConfirmOpen(true)}
      >
        {t('progress.reset')}
      </Button>

      {confirmOpen && (
        <div
          className="fixed inset-0 z-[200] grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) closeConfirm();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="reset-dialog-title"
            aria-describedby="reset-dialog-desc"
            className="w-full max-w-sm rounded-2xl border border-white/10 bg-brand-900 p-6 shadow-xl"
          >
            <h2 id="reset-dialog-title" className="text-lg font-semibold text-white">
              {t('progress.reset')}
            </h2>
            <p id="reset-dialog-desc" className="mt-2 text-sm text-brand-200">
              {t('progress.resetConfirm')}
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button ref={cancelRef} variant="secondary" onClick={closeConfirm}>
                {t('common.cancel')}
              </Button>
              <Button ref={confirmRef} variant="primary" onClick={confirmReset}>
                {t('progress.reset')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}
