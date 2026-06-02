import { useTranslation } from 'react-i18next';
import { useAppStore, type QualityPreference } from '@/store/useAppStore';
import { cn } from '@/lib/cn';

const options: QualityPreference[] = ['auto', 'high', 'low'];

const selectClasses =
  'rounded-md border border-white/15 bg-brand-900 px-2 py-1.5 text-sm text-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300';

export function QualityToggle({ className }: { className?: string }) {
  const { t } = useTranslation();
  const quality = useAppStore((state) => state.settings.quality);
  const setQuality = useAppStore((state) => state.setQualityPreference);

  const labels: Record<QualityPreference, string> = {
    auto: t('settings.qualityAuto'),
    high: t('settings.qualityHigh'),
    low: t('settings.qualityLow'),
  };

  return (
    <label className={cn('flex items-center gap-2', className)}>
      <span className="text-xs font-medium uppercase tracking-wide text-brand-200">
        {t('settings.quality')}
      </span>
      <select
        className={selectClasses}
        value={quality}
        onChange={(event) => setQuality(event.target.value as QualityPreference)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {labels[option]}
          </option>
        ))}
      </select>
    </label>
  );
}
