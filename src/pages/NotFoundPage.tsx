import { useTranslation } from 'react-i18next';
import { Container } from '@/components/ui/Container';
import { ButtonLink } from '@/components/ui/Button';

export function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <Container className="py-24 text-center">
      <p className="text-6xl font-black text-brand-700" aria-hidden="true">
        404
      </p>
      <h1 className="mt-4 text-2xl font-bold text-white">{t('notFound.title')}</h1>
      <p className="mt-2 text-brand-200">{t('notFound.desc')}</p>
      <ButtonLink to="/" className="mt-8">
        {t('common.backToHome')}
      </ButtonLink>
    </Container>
  );
}
