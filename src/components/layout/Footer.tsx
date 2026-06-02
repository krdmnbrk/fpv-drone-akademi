import { useTranslation } from 'react-i18next';
import { Container } from '@/components/ui/Container';

export function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-brand-950">
      <Container className="flex flex-col gap-2 py-8 text-sm text-brand-200">
        <p className="font-semibold text-brand-50">{t('common.appName')}</p>
        <p>{t('footer.tagline')}</p>
        <p className="text-xs text-brand-300">{t('footer.disclaimer')}</p>
        <p className="text-xs text-brand-400">© {year}</p>
      </Container>
    </footer>
  );
}
