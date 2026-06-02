import { describe, expect, it } from 'vitest';
import { evaluateBadges } from './badges';
import { getFlightCurriculum } from '@/content';
import type { AppState } from '@/store/useAppStore';

function stateWithCompleted(ids: string[]): AppState {
  const progress = Object.fromEntries(ids.map((id) => [id, { status: 'completed' as const }]));
  return { progress } as unknown as AppState;
}

const curriculum = getFlightCurriculum();
const beginnerIds = curriculum.beginner.map((lesson) => lesson.id);
const allIds = [...curriculum.beginner, ...curriculum.intermediate, ...curriculum.advanced].map(
  (lesson) => lesson.id,
);

describe('evaluateBadges', () => {
  it('awards nothing with no completed lessons', () => {
    expect(evaluateBadges(stateWithCompleted([]))).toEqual([]);
  });

  it('awards first-flight after one completed lesson', () => {
    expect(evaluateBadges(stateWithCompleted(['fpv-nedir']))).toContain('first-flight');
  });

  it('awards beginner-graduate when all beginner lessons are complete', () => {
    const earned = evaluateBadges(stateWithCompleted(beginnerIds));
    expect(earned).toContain('beginner-graduate');
    expect(earned).not.toContain('intermediate-graduate');
    expect(earned).not.toContain('full-curriculum');
  });

  it('awards full-curriculum and all graduate badges when everything is complete', () => {
    const earned = evaluateBadges(stateWithCompleted(allIds));
    expect(earned).toEqual(
      expect.arrayContaining([
        'first-flight',
        'beginner-graduate',
        'intermediate-graduate',
        'advanced-graduate',
        'full-curriculum',
      ]),
    );
  });
});
