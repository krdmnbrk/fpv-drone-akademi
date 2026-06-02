import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container } from '@/components/ui/Container';

const DISMISS_KEY = 'fpv-academy-safety-dismissed';

/** Persistent, dismissible reminder to read the safety/regulation rules before flying. */
export function SafetyBanner() {
  const { t } = useTranslation();
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem(DISMISS_KEY) === '1';
    } catch {
      return false;
    }
  });

  if (dismissed) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, '1');
    } catch {
      // ignore storage failures
    }
    setDismissed(true);
  };

  return (
    <div
      role="region"
      aria-label={t('safety.bannerLabel')}
      className="border-b border-amber-400/30 bg-amber-500/10"
    >
      <Container className="flex items-center justify-between gap-3 py-2">
        <p className="text-sm text-amber-100">
          <span aria-hidden="true">⚠️ </span>
          <Link
            to="/regulations"
            className="font-medium underline underline-offset-2 hover:text-white"
          >
            {t('safety.bannerText')}
          </Link>
        </p>
        <button
          type="button"
          onClick={dismiss}
          aria-label={t('common.dismiss')}
          className="shrink-0 rounded p-1 text-amber-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
        >
          <span aria-hidden="true">✕</span>
        </button>
      </Container>
    </div>
  );
}
