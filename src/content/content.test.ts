import { describe, expect, it } from 'vitest';
import { getFlightCurriculum, getLesson, getPart, getQuiz, hardwareParts } from './index';

describe('content loader', () => {
  it('loads authored beginner lessons as available', () => {
    const { beginner } = getFlightCurriculum();
    expect(beginner.find((lesson) => lesson.id === 'fpv-nedir')?.available).toBe(true);
  });

  it('lists all 8 beginner lessons with unique ids', () => {
    const { beginner } = getFlightCurriculum();
    expect(beginner).toHaveLength(8);
    const ids = beginner.map((lesson) => lesson.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('orders lessons within a level', () => {
    const orders = getFlightCurriculum().beginner.map((lesson) => lesson.order);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
  });

  it('loads a quiz for an authored lesson', () => {
    expect(getQuiz('fpv-nedir')?.questions.length ?? 0).toBeGreaterThan(0);
  });

  it('exposes a component for an authored lesson', () => {
    expect(getLesson('fpv-nedir')?.Component).toBeTypeOf('function');
  });

  it('loads all 11 hardware parts sorted by order with mesh names equal to ids', () => {
    expect(hardwareParts).toHaveLength(11);
    expect(hardwareParts[0]?.order).toBe(1);
    expect(getPart('esc')?.meshName).toBe('esc');
    expect(hardwareParts.every((part) => part.meshName === part.id)).toBe(true);
  });
});
