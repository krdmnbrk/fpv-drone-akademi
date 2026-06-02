import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Quiz as QuizData } from '@/content/types';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';

interface QuizProps {
  quiz: QuizData;
  onComplete?: (scorePct: number) => void;
}

export function Quiz({ quiz, onComplete }: QuizProps) {
  const { t } = useTranslation();
  const total = quiz.questions.length;

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = quiz.questions[index];
  if (!question) return null;

  const isLast = index === total - 1;
  const isCorrect = revealed && selected === question.answerIndex;
  const scorePct = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  const handleSubmit = () => {
    if (selected === null) return;
    setRevealed(true);
    if (selected === question.answerIndex) {
      setCorrectCount((count) => count + 1);
    }
  };

  const handleNext = () => {
    if (isLast) {
      setFinished(true);
      onComplete?.(scorePct);
      return;
    }
    setIndex((value) => value + 1);
    setSelected(null);
    setRevealed(false);
  };

  const handleRetry = () => {
    setIndex(0);
    setSelected(null);
    setRevealed(false);
    setCorrectCount(0);
    setFinished(false);
  };

  if (finished) {
    return (
      <section aria-label={t('quiz.title')} className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold text-white">{t('quiz.resultTitle')}</h2>
        <p className="mt-4 text-4xl font-bold text-brand-300">{scorePct}%</p>
        <p className="mt-1 text-brand-200">{t('quiz.scoreLine', { correct: correctCount, total })}</p>
        <Button variant="secondary" className="mt-6" onClick={handleRetry}>
          {t('quiz.retry')}
        </Button>
      </section>
    );
  }

  return (
    <section aria-label={t('quiz.title')} className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-xl font-semibold text-white">{t('quiz.title')}</h2>
        <p className="text-sm text-brand-300">
          {t('quiz.question', { current: index + 1, total })}
        </p>
      </div>

      <fieldset className="mt-4">
        <legend className="text-base font-medium text-brand-50">{question.prompt}</legend>
        <div className="mt-4 flex flex-col gap-2">
          {question.options.map((option, optionIndex) => {
            const isAnswer = optionIndex === question.answerIndex;
            const isChosen = selected === optionIndex;
            return (
              <label
                key={optionIndex}
                className={cn(
                  'flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors duration-fast ease-standard',
                  !revealed && 'border-white/15 hover:border-brand-400/50',
                  revealed && isAnswer && 'border-emerald-400/60 bg-emerald-500/10',
                  revealed && isChosen && !isAnswer && 'border-red-400/60 bg-red-500/10',
                  revealed && !isAnswer && !isChosen && 'border-white/10 opacity-70',
                )}
              >
                <input
                  type="radio"
                  name={`quiz-${quiz.id}-${question.id}`}
                  value={optionIndex}
                  checked={isChosen}
                  disabled={revealed}
                  onChange={() => setSelected(optionIndex)}
                  className="h-4 w-4 accent-brand-500"
                />
                <span className="text-sm text-brand-50">{option}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div aria-live="polite" className="mt-4 min-h-[1.5rem]">
        {revealed && (
          <p className={cn('text-sm', isCorrect ? 'text-emerald-300' : 'text-red-300')}>
            <strong>{isCorrect ? t('quiz.correct') : t('quiz.incorrect')}</strong>{' '}
            <span className="text-brand-100">{question.explanation}</span>
          </p>
        )}
      </div>

      <div className="mt-4">
        {!revealed ? (
          <Button onClick={handleSubmit} disabled={selected === null}>
            {t('quiz.submit')}
          </Button>
        ) : (
          <Button onClick={handleNext}>{isLast ? t('quiz.finish') : t('quiz.nextQuestion')}</Button>
        )}
      </div>
    </section>
  );
}
