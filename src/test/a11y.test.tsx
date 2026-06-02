import { describe, expect, it } from 'vitest';
import { axe } from 'jest-axe';
import { renderWithProviders } from './utils';
import { HomePage } from '@/pages/HomePage';
import { HardwareExplorer } from '@/features/hardware/HardwareExplorer';
import { Quiz } from '@/components/quiz/Quiz';
import type { Quiz as QuizData } from '@/content/types';

// Page-composition rules (landmarks / single h1) are the layout's responsibility,
// so they are disabled when auditing components in isolation. Component-level
// rules (labels, roles, ARIA, control names) stay active.
const axeOptions = {
  rules: {
    region: { enabled: false },
    'landmark-one-main': { enabled: false },
    'page-has-heading-one': { enabled: false },
  },
};

const sampleQuiz: QuizData = {
  id: 'a11y',
  questions: [
    { id: 'q1', prompt: 'Örnek soru?', options: ['A', 'B'], answerIndex: 0, explanation: 'Çünkü.' },
  ],
};

describe('accessibility (axe)', () => {
  it('HomePage has no violations', async () => {
    const { container } = renderWithProviders(<HomePage />);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });

  it('HardwareExplorer (list + fallback) has no violations', async () => {
    const { container } = renderWithProviders(<HardwareExplorer />);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });

  it('Quiz has no violations', async () => {
    const { container } = renderWithProviders(<Quiz quiz={sampleQuiz} />);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
