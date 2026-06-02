import { useTranslation } from 'react-i18next';
import { Container } from '@/components/ui/Container';

const levels = ['beginner', 'intermediate', 'advanced'] as const;

/**
 * Curriculum overview. Lesson lists per level are populated once the content
 * pipeline and curriculum modules land (Phase 4).
 */
export function FlightPage() {
  const { t } = useTranslation();
  return (
    <Container className="py-12">
      <h1 className="text-3xl font-bold text-white">{t('flight.title')}</h1>
      <p className="mt-3 max-w-2xl text-brand-200">{t('flight.intro')}</p>

      <div className="mt-10 space-y-8">
        {levels.map((level) => (
          <section key={level} aria-labelledby={`level-${level}`}>
            <h2 id={`level-${level}`} className="text-xl font-semibold text-white">
              {t(`flight.levels.${level}`)}
            </h2>
            <div className="mt-3 rounded-xl border border-dashed border-white/15 bg-white/5 p-6 text-brand-300">
              {t('common.loading')}
            </div>
          </section>
        ))}
      </div>
    </Container>
  );
}
