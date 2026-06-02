import { beforeEach, describe, expect, it } from 'vitest';
import { clampPct, mergeBestScore, useAppStore } from './useAppStore';
import {
  arePrerequisitesMet,
  isLessonCompleted,
  overallProgressPct,
  selectBadgeCount,
  selectCompletedCount,
  selectLessonStatus,
  selectResumeLessonId,
} from './selectors';

const resetStore = () =>
  useAppStore.setState({
    progress: {},
    badges: {},
    settings: { motion: 'system', quality: 'auto' },
  });

beforeEach(() => {
  resetStore();
  localStorage.clear();
});

describe('clampPct', () => {
  it('clamps to 0..100 and rounds', () => {
    expect(clampPct(-5)).toBe(0);
    expect(clampPct(150)).toBe(100);
    expect(clampPct(66.6)).toBe(67);
  });

  it('treats NaN as 0', () => {
    expect(clampPct(Number.NaN)).toBe(0);
  });
});

describe('mergeBestScore', () => {
  it('returns the existing score when incoming is undefined', () => {
    expect(mergeBestScore(50, undefined)).toBe(50);
  });

  it('clamps the incoming score when there is no existing score', () => {
    expect(mergeBestScore(undefined, 120)).toBe(100);
  });

  it('keeps the higher of the two scores', () => {
    expect(mergeBestScore(80, 60)).toBe(80);
    expect(mergeBestScore(40, 90)).toBe(90);
  });

  it('returns undefined when both are undefined', () => {
    expect(mergeBestScore(undefined, undefined)).toBeUndefined();
  });
});

describe('progress actions', () => {
  it('startLesson marks a lesson in-progress', () => {
    useAppStore.getState().startLesson('a');
    expect(selectLessonStatus(useAppStore.getState(), 'a')).toBe('in-progress');
  });

  it('does not downgrade a completed lesson to in-progress', () => {
    const store = useAppStore.getState();
    store.completeLesson('a');
    store.startLesson('a');
    expect(selectLessonStatus(useAppStore.getState(), 'a')).toBe('completed');
  });

  it('completeLesson records completion time and quiz score', () => {
    useAppStore.getState().completeLesson('a', 70);
    const progress = useAppStore.getState().progress['a'];
    expect(progress?.status).toBe('completed');
    expect(progress?.quizScorePct).toBe(70);
    expect(typeof progress?.completedAt).toBe('number');
  });

  it('recordQuizScore keeps the best score and stays in-progress', () => {
    const store = useAppStore.getState();
    store.recordQuizScore('a', 40);
    store.recordQuizScore('a', 80);
    store.recordQuizScore('a', 55);
    const progress = useAppStore.getState().progress['a'];
    expect(progress?.quizScorePct).toBe(80);
    expect(progress?.status).toBe('in-progress');
  });

  it('completeLesson does not lower a previously higher quiz score', () => {
    const store = useAppStore.getState();
    store.recordQuizScore('a', 90);
    store.completeLesson('a', 50);
    expect(useAppStore.getState().progress['a']?.quizScorePct).toBe(90);
  });
});

describe('badges', () => {
  it('awards a badge only once (idempotent)', () => {
    const store = useAppStore.getState();
    store.awardBadge('first-flight');
    const firstAward = useAppStore.getState().badges['first-flight'];
    store.awardBadge('first-flight');
    const secondAward = useAppStore.getState().badges['first-flight'];
    expect(selectBadgeCount(useAppStore.getState())).toBe(1);
    expect(secondAward).toBe(firstAward);
  });
});

describe('settings actions', () => {
  it('updates motion and quality preferences', () => {
    const store = useAppStore.getState();
    store.setMotionPreference('off');
    store.setQualityPreference('low');
    expect(useAppStore.getState().settings).toEqual({ motion: 'off', quality: 'low' });
  });
});

describe('resetProgress', () => {
  it('clears progress and badges but preserves settings', () => {
    const store = useAppStore.getState();
    store.completeLesson('a');
    store.awardBadge('b');
    store.setMotionPreference('on');
    store.resetProgress();
    const state = useAppStore.getState();
    expect(state.progress).toEqual({});
    expect(state.badges).toEqual({});
    expect(state.settings.motion).toBe('on');
  });
});

describe('selectors', () => {
  it('defaults an unknown lesson to not-started', () => {
    expect(selectLessonStatus(useAppStore.getState(), 'x')).toBe('not-started');
    expect(isLessonCompleted(useAppStore.getState(), 'x')).toBe(false);
  });

  it('counts only completed lessons', () => {
    const store = useAppStore.getState();
    store.completeLesson('a');
    store.completeLesson('b');
    store.startLesson('c');
    expect(selectCompletedCount(useAppStore.getState())).toBe(2);
  });

  it('evaluates prerequisites', () => {
    const store = useAppStore.getState();
    store.completeLesson('a');
    const state = useAppStore.getState();
    expect(arePrerequisitesMet(state, ['a'])).toBe(true);
    expect(arePrerequisitesMet(state, ['a', 'b'])).toBe(false);
    expect(arePrerequisitesMet(state, [])).toBe(true);
  });

  it('computes overall progress percentage', () => {
    expect(overallProgressPct(0, 0)).toBe(0);
    expect(overallProgressPct(1, 4)).toBe(25);
    expect(overallProgressPct(3, 3)).toBe(100);
  });
});

describe('selectResumeLessonId', () => {
  const order = ['a', 'b', 'c'];

  it('returns the first lesson when nothing is completed', () => {
    expect(selectResumeLessonId(useAppStore.getState(), order)).toBe('a');
  });

  it('returns the first non-completed lesson', () => {
    useAppStore.getState().completeLesson('a');
    expect(selectResumeLessonId(useAppStore.getState(), order)).toBe('b');
  });

  it('returns undefined when every lesson is completed', () => {
    const store = useAppStore.getState();
    order.forEach((id) => store.completeLesson(id));
    expect(selectResumeLessonId(useAppStore.getState(), order)).toBeUndefined();
  });
});
