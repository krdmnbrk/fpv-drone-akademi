import { describe, expect, it } from 'vitest';
import { evaluateBadges, getBadgeProgress } from './badges';
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

describe('getBadgeProgress', () => {
  it('tracks first-flight toward a target of 1', () => {
    expect(getBadgeProgress(stateWithCompleted([]), 'first-flight')).toEqual({
      current: 0,
      target: 1,
    });
    expect(getBadgeProgress(stateWithCompleted(['fpv-nedir']), 'first-flight')).toEqual({
      current: 1,
      target: 1,
    });
  });

  it('tracks beginner-graduate against the beginner lesson count', () => {
    const progress = getBadgeProgress(stateWithCompleted(['fpv-nedir']), 'beginner-graduate');
    expect(progress.target).toBe(8);
    expect(progress.current).toBe(1);
  });

  it('reaches its target when the whole curriculum is complete', () => {
    const progress = getBadgeProgress(stateWithCompleted(allIds), 'full-curriculum');
    expect(progress.current).toBe(progress.target);
    expect(progress.target).toBe(19);
  });
});
