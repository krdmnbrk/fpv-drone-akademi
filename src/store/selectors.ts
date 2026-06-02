import type { AppState, LessonProgress, LessonStatus } from './useAppStore';

/**
 * Pure selectors over the store state. Kept separate from the store so they
 * can be unit-tested in isolation and reused across components.
 */

export function selectLessonProgress(
  state: AppState,
  lessonId: string,
): LessonProgress | undefined {
  return state.progress[lessonId];
}

export function selectLessonStatus(state: AppState, lessonId: string): LessonStatus {
  return state.progress[lessonId]?.status ?? 'not-started';
}

export function isLessonCompleted(state: AppState, lessonId: string): boolean {
  return selectLessonStatus(state, lessonId) === 'completed';
}

export function selectCompletedCount(state: AppState): number {
  return Object.values(state.progress).filter((p) => p.status === 'completed').length;
}

export function selectBadgeCount(state: AppState): number {
  return Object.keys(state.badges).length;
}

export function arePrerequisitesMet(
  state: AppState,
  prerequisites: readonly string[],
): boolean {
  return prerequisites.every((id) => isLessonCompleted(state, id));
}

/** Percentage of completed lessons out of a known total (0–100). */
export function overallProgressPct(completed: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((completed / total) * 100);
}
