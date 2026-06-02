import { describe, expect, it, vi } from 'vitest';
import { renderWithProviders, screen, userEvent } from '@/test/utils';
import type { Quiz as QuizData } from '@/content/types';
import { Quiz } from './Quiz';

const sampleQuiz: QuizData = {
  id: 'sample',
  questions: [
    {
      id: 'q1',
      prompt: 'Soru 1?',
      options: ['Doğru cevap', 'Yanlış cevap'],
      answerIndex: 0,
      explanation: 'Birinci açıklama',
    },
    {
      id: 'q2',
      prompt: 'Soru 2?',
      options: ['Seçenek A', 'Seçenek B'],
      answerIndex: 1,
      explanation: 'İkinci açıklama',
    },
  ],
};

describe('Quiz', () => {
  it('disables submit until an option is selected', () => {
    renderWithProviders(<Quiz quiz={sampleQuiz} />);
    expect(screen.getByRole('button', { name: 'Cevapla' })).toBeDisabled();
  });

  it('walks through the questions and reports the score', async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    renderWithProviders(<Quiz quiz={sampleQuiz} onComplete={onComplete} />);

    // Q1 — pick the correct answer.
    await user.click(screen.getByLabelText('Doğru cevap'));
    await user.click(screen.getByRole('button', { name: 'Cevapla' }));
    expect(screen.getByText(/Birinci açıklama/)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Sonraki soru' }));

    // Q2 — pick the wrong answer (correct is "Seçenek B").
    await user.click(screen.getByLabelText('Seçenek A'));
    await user.click(screen.getByRole('button', { name: 'Cevapla' }));
    await user.click(screen.getByRole('button', { name: 'Bitir' }));

    // 1 of 2 correct -> 50%
    expect(onComplete).toHaveBeenCalledWith(50);
    expect(screen.getByText('50%')).toBeInTheDocument();
  });
});
