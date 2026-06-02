import { useTranslation } from 'react-i18next';
import { supportedLngs, type AppLocale } from '@/i18n';
import { cn } from '@/lib/cn';

const selectClasses =
  'rounded-md border border-white/15 bg-brand-900 px-2 py-1.5 text-sm text-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300';

export function LanguageSwitcher({ className }: { className?: string }) {
  const { t, i18n } = useTranslation();
  const current = i18n.resolvedLanguage ?? i18n.language;
  const value: AppLocale = supportedLngs.includes(current as AppLocale)
    ? (current as AppLocale)
    : 'tr';

  const labels: Record<AppLocale, string> = {
    tr: t('settings.turkish'),
    en: t('settings.english'),
  };

  return (
    <label className={cn('flex items-center gap-2', className)}>
      <span className="text-xs font-medium uppercase tracking-wide text-brand-200">
        {t('settings.language')}
      </span>
      <select
        className={selectClasses}
        value={value}
        onChange={(event) => void i18n.changeLanguage(event.target.value)}
      >
        {supportedLngs.map((lng) => (
          <option key={lng} value={lng}>
            {labels[lng]}
          </option>
        ))}
      </select>
    </label>
  );
}
