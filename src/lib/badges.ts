import type { AppState } from '@/store/useAppStore';
import { getFlightCurriculum } from '@/content';
import { flightLevels } from '@/content/curriculum';
import type { Level } from '@/content/types';

export interface BadgeDefinition {
  id: string;
  /** camelCase key under the `badges.` i18n namespace. */
  i18nKey: string;
}

export const badgeDefinitions: BadgeDefinition[] = [
  { id: 'first-flight', i18nKey: 'firstFlight' },
  { id: 'beginner-graduate', i18nKey: 'beginnerGraduate' },
  { id: 'intermediate-graduate', i18nKey: 'intermediateGraduate' },
  { id: 'advanced-graduate', i18nKey: 'advancedGraduate' },
  { id: 'full-curriculum', i18nKey: 'fullCurriculum' },
];

function completedLessonIds(state: AppState): Set<string> {
  return new Set(
    Object.entries(state.progress)
      .filter(([, progress]) => progress.status === 'completed')
      .map(([id]) => id),
  );
}

/** Badge ids the learner has earned given their current progress. */
export function evaluateBadges(state: AppState): string[] {
  const completed = completedLessonIds(state);
  const curriculum = getFlightCurriculum();
  // Only count authored (available) lessons — a planned "coming soon" lesson has no
  // page to complete, so it must not block a level's graduate badge.
  const levelComplete = (level: Level) => {
    const lessons = curriculum[level].filter((lesson) => lesson.available);
    return lessons.length > 0 && lessons.every((lesson) => completed.has(lesson.id));
  };

  const earned: string[] = [];
  if (completed.size >= 1) earned.push('first-flight');
  if (levelComplete('beginner')) earned.push('beginner-graduate');
  if (levelComplete('intermediate')) earned.push('intermediate-graduate');
  if (levelComplete('advanced')) earned.push('advanced-graduate');
  if (flightLevels.every(levelComplete)) earned.push('full-curriculum');
  return earned;
}

export interface BadgeProgress {
  current: number;
  target: number;
}

/** Progress toward a badge (e.g. 6/8 beginner lessons) for the locked-badge display. */
export function getBadgeProgress(state: AppState, badgeId: string): BadgeProgress {
  const curriculum = getFlightCurriculum();
  const completed = completedLessonIds(state);
  const levelProgress = (level: Level): BadgeProgress => {
    const lessons = curriculum[level].filter((lesson) => lesson.available);
    return {
      current: lessons.filter((lesson) => completed.has(lesson.id)).length,
      target: lessons.length,
    };
  };

  switch (badgeId) {
    case 'first-flight':
      return { current: Math.min(completed.size, 1), target: 1 };
    case 'beginner-graduate':
      return levelProgress('beginner');
    case 'intermediate-graduate':
      return levelProgress('intermediate');
    case 'advanced-graduate':
      return levelProgress('advanced');
    case 'full-curriculum': {
      const all = flightLevels.flatMap((level) =>
        curriculum[level].filter((lesson) => lesson.available),
      );
      return {
        current: all.filter((lesson) => completed.has(lesson.id)).length,
        target: all.length,
      };
    }
    default:
      return { current: 0, target: 0 };
  }
}
