import { useTranslation } from 'react-i18next';
import { Container } from '@/components/ui/Container';
import { HardwareExplorer } from '@/features/hardware/HardwareExplorer';

export function HardwarePage() {
  const { t } = useTranslation();
  return (
    <Container className="py-12">
      <h1 className="text-3xl font-bold text-white">{t('hardware.title')}</h1>
      <p className="mt-3 max-w-2xl text-brand-200">{t('hardware.intro')}</p>
      <div className="mt-8">
        <HardwareExplorer />
      </div>
    </Container>
  );
}
