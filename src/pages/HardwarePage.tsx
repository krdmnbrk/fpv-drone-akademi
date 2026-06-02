import { useTranslation } from 'react-i18next';
import { Container } from '@/components/ui/Container';

/**
 * Placeholder for the interactive 3D part explorer (Phase 3). The 3D scene and
 * accessible part list are added by the animation-3d-specialist work.
 */
export function HardwarePage() {
  const { t } = useTranslation();
  return (
    <Container className="py-12">
      <h1 className="text-3xl font-bold text-white">{t('hardware.title')}</h1>
      <p className="mt-3 max-w-2xl text-brand-200">{t('hardware.intro')}</p>
      <div className="mt-8 rounded-xl border border-dashed border-white/15 bg-white/5 p-10 text-center text-brand-300">
        {t('hardware.selectPartHint')}
      </div>
    </Container>
  );
}
