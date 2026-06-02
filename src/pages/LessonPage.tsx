import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container } from '@/components/ui/Container';
import { ButtonLink } from '@/components/ui/Button';

/**
 * Lesson view. Wires the MDX content + quiz + progress controls in Phase 4.
 */
export function LessonPage() {
  const { t } = useTranslation();
  const { lessonId } = useParams<{ lessonId: string }>();

  return (
    <Container className="py-12">
      <p className="text-sm text-brand-300">{lessonId}</p>
      <div className="mt-8 rounded-xl border border-dashed border-white/15 bg-white/5 p-10 text-center text-brand-300">
        {t('lesson.notFound')}
      </div>
      <ButtonLink to="/flight" variant="secondary" className="mt-8">
        {t('lesson.previous')}
      </ButtonLink>
    </Container>
  );
}
