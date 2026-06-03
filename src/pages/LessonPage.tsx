import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container } from '@/components/ui/Container';
import { Button, ButtonLink } from '@/components/ui/Button';
import { MdxProvider } from '@/components/mdx';
import { Quiz } from '@/components/quiz/Quiz';
import { LessonVideo } from '@/components/lesson/LessonVideo';
import { getAdjacentFlightLessons, getFlightLessonTitle, getLesson, getQuiz } from '@/content';
import { getLessonVideo } from '@/content/videos';
import { useAppStore } from '@/store/useAppStore';
import { selectLessonStatus } from '@/store/selectors';
import { evaluateBadges } from '@/lib/badges';
import { useBadgeText } from '@/lib/useBadgeText';

export function LessonPage() {
  const { t } = useTranslation();
  const { lessonId } = useParams<{ lessonId: string }>();
  const lesson = lessonId ? getLesson(lessonId) : undefined;

  const status = useAppStore((state) =>
    lessonId ? selectLessonStatus(state, lessonId) : 'not-started',
  );
  const startLesson = useAppStore((state) => state.startLesson);
  const completeLesson = useAppStore((state) => state.completeLesson);
  const recordQuizScore = useAppStore((state) => state.recordQuizScore);
  const awardBadge = useAppStore((state) => state.awardBadge);
  const quizAttempted = useAppStore((state) =>
    lessonId ? state.progress[lessonId]?.quizScorePct !== undefined : false,
  );
  const badgeText = useBadgeText();
  const [celebrated, setCelebrated] = useState<string[]>([]);

  useEffect(() => {
    if (lesson && lessonId) {
      startLesson(lessonId);
    }
  }, [lesson, lessonId, startLesson]);

  useEffect(() => {
    if (celebrated.length === 0) return;
    const timer = setTimeout(() => setCelebrated([]), 4500);
    return () => clearTimeout(timer);
  }, [celebrated]);

  if (!lesson || !lessonId) {
    return (
      <Container className="py-16 text-center">
        <p className="text-brand-200">{t('lesson.notFound')}</p>
        <ButtonLink to="/flight" variant="secondary" className="mt-6">
          {t('nav.flight')}
        </ButtonLink>
      </Container>
    );
  }

  const { meta, Component } = lesson;
  const quiz = meta.quizId ? getQuiz(meta.quizId) : undefined;
  const video = getLessonVideo(lessonId);
  const { prev, next } = getAdjacentFlightLessons(lessonId);
  const isCompleted = status === 'completed';

  return (
    <Container className="py-12">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm text-brand-300">
          {t(`flight.levels.${meta.level}`)} • {meta.estimatedMinutes} {t('common.minutesShort')}
        </p>
        <h1 className="mt-2 text-3xl font-bold text-white">{meta.title}</h1>

        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-lg font-semibold text-white">{t('lesson.objectives')}</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-brand-100">
            {meta.objectives.map((objective) => (
              <li key={objective}>{objective}</li>
            ))}
          </ul>
          {meta.prerequisites.length > 0 && (
            <p className="mt-4 text-sm text-brand-300">
              {t('lesson.prerequisites')}:{' '}
              {meta.prerequisites.map((id, position) => (
                <span key={id}>
                  {position > 0 && ', '}
                  <Link to={`/lesson/${id}`} className="text-brand-200 underline">
                    {getFlightLessonTitle(id) ?? id}
                  </Link>
                </span>
              ))}
            </p>
          )}
        </div>

        <MdxProvider>
          <article className="prose prose-invert mt-8 max-w-none prose-headings:text-white prose-a:text-brand-300 prose-strong:text-white">
            <Component />
          </article>
        </MdxProvider>

        {video && (
          <div className="mt-10">
            <LessonVideo video={video} />
          </div>
        )}

        {quiz && (
          <div className="mt-10">
            <Quiz quiz={quiz} onComplete={(score) => recordQuizScore(lessonId, score)} />
          </div>
        )}

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6">
          <Button
            variant={isCompleted ? 'secondary' : 'primary'}
            onClick={() => {
              const before = new Set(Object.keys(useAppStore.getState().badges));
              completeLesson(lessonId);
              for (const badgeId of evaluateBadges(useAppStore.getState())) {
                awardBadge(badgeId);
              }
              const fresh = Object.keys(useAppStore.getState().badges).filter(
                (id) => !before.has(id),
              );
              if (fresh.length > 0) setCelebrated(fresh);
            }}
            disabled={isCompleted}
          >
            {isCompleted ? t('lesson.completed') : t('lesson.markComplete')}
          </Button>
          {quiz && !quizAttempted && !isCompleted && (
            <p className="text-center text-xs text-brand-300">💡 {t('lesson.quizNudge')}</p>
          )}
          <div className="flex items-center justify-between gap-3">
            {prev ? (
              <ButtonLink to={`/lesson/${prev}`} variant="ghost" size="sm">
                ← {t('lesson.previous')}
              </ButtonLink>
            ) : (
              <span />
            )}
            {next && (
              <ButtonLink to={`/lesson/${next}`} size="lg">
                {t('lesson.next')} →
              </ButtonLink>
            )}
          </div>
        </div>
      </div>

      {celebrated.length > 0 && (
        <div
          role="status"
          aria-live="polite"
          className="fixed inset-x-0 bottom-4 z-50 mx-auto w-fit max-w-[90vw] rounded-xl border border-brand-400/50 bg-brand-900 px-5 py-3 text-center shadow-lg"
        >
          <p className="text-sm font-semibold text-white">🏅 {t('lesson.badgeEarned')}</p>
          <p className="mt-0.5 text-sm text-brand-200">
            {celebrated
              .map((id) => badgeText[id]?.name)
              .filter(Boolean)
              .join(', ')}
          </p>
        </div>
      )}
    </Container>
  );
}
