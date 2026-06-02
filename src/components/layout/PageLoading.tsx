import { useTranslation } from 'react-i18next';

/** Fallback shown while a lazily-loaded route chunk is fetched. */
export function PageLoading() {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-[40vh] items-center justify-center" role="status" aria-live="polite">
      <span className="text-sm text-brand-300">{t('common.loading')}</span>
    </div>
  );
}
