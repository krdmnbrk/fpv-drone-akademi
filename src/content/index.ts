import type { ComponentType } from 'react';
import type { HardwarePart, LessonFrontmatter, Level, Quiz } from './types';
import { flightLevels, plannedFlightLessons } from './curriculum';
import partsData from './hardware/parts.json';

// --- Lessons (authored MDX) ---
// All lessons live in a single chunk that route code-splitting keeps out of the
// entry bundle (loaded only when a content route is visited).
interface LessonModule {
  default: ComponentType;
  frontmatter: LessonFrontmatter;
}

const lessonModules = import.meta.glob<LessonModule>('./flight/**/*.mdx', { eager: true });

export interface LessonEntry {
  meta: LessonFrontmatter;
  Component: ComponentType;
}

const lessonRegistry = new Map<string, LessonEntry>();
for (const mod of Object.values(lessonModules)) {
  lessonRegistry.set(mod.frontmatter.id, { meta: mod.frontmatter, Component: mod.default });
}

export function getLesson(id: string): LessonEntry | undefined {
  return lessonRegistry.get(id);
}

// --- Quizzes (JSON) ---
const quizModules = import.meta.glob<{ default: Quiz }>('./quizzes/*.json', { eager: true });
const quizRegistry = new Map<string, Quiz>();
for (const mod of Object.values(quizModules)) {
  quizRegistry.set(mod.default.id, mod.default);
}

export function getQuiz(id: string): Quiz | undefined {
  return quizRegistry.get(id);
}

// --- Hardware parts (JSON) ---
export const hardwareParts: HardwarePart[] = [...(partsData as HardwarePart[])].sort(
  (a, b) => a.order - b.order,
);

export function getPart(id: string): HardwarePart | undefined {
  return hardwareParts.find((part) => part.id === id);
}

// --- Combined flight curriculum (authored + planned) ---
export interface FlightLessonItem {
  id: string;
  level: Level;
  order: number;
  title: string;
  summary: string;
  prerequisites: string[];
  available: boolean;
  estimatedMinutes?: number;
  quizId?: string;
}

function toItemFromMeta(meta: LessonFrontmatter): FlightLessonItem {
  return {
    id: meta.id,
    level: meta.level,
    order: meta.order,
    title: meta.title,
    summary: meta.summary,
    prerequisites: meta.prerequisites,
    available: true,
    estimatedMinutes: meta.estimatedMinutes,
    quizId: meta.quizId,
  };
}

/** All flight lessons (authored MDX + planned), grouped by level and ordered. */
export function getFlightCurriculum(): Record<Level, FlightLessonItem[]> {
  const authored = [...lessonRegistry.values()]
    .filter((entry) => entry.meta.track === 'flight')
    .map((entry) => toItemFromMeta(entry.meta));

  // Drop planned entries that have since been authored, so a newly added MDX
  // lesson automatically moves from "coming soon" to playable.
  const planned: FlightLessonItem[] = plannedFlightLessons
    .filter((ref) => !lessonRegistry.has(ref.id))
    .map((ref) => ({ ...ref, available: false }));

  const all = [...authored, ...planned];
  const grouped = {} as Record<Level, FlightLessonItem[]>;
  for (const level of flightLevels) {
    grouped[level] = all
      .filter((item) => item.level === level)
      .sort((a, b) => a.order - b.order);
  }
  return grouped;
}

/** Flat, ordered list of every flight lesson id (authored + planned). */
export function getOrderedFlightLessonIds(): string[] {
  const curriculum = getFlightCurriculum();
  return flightLevels.flatMap((level) => curriculum[level].map((item) => item.id));
}

/** Flat, ordered list of authored (playable) flight lesson ids only. */
export function getOrderedAvailableFlightLessonIds(): string[] {
  return getOrderedFlightLessonIds().filter((id) => lessonRegistry.has(id));
}

/** Nearest available previous/next authored lessons for in-lesson navigation. */
export function getAdjacentFlightLessons(id: string): { prev?: string; next?: string } {
  const ordered = getOrderedFlightLessonIds();
  const index = ordered.indexOf(id);
  if (index === -1) return {};
  const prev = ordered
    .slice(0, index)
    .reverse()
    .find((lessonId) => lessonRegistry.has(lessonId));
  const next = ordered.slice(index + 1).find((lessonId) => lessonRegistry.has(lessonId));
  return { ...(prev ? { prev } : {}), ...(next ? { next } : {}) };
}

export function getAvailableFlightLessonCount(): number {
  return [...lessonRegistry.values()].filter((entry) => entry.meta.track === 'flight').length;
}

/** Human-readable title for a flight lesson id (authored or planned). */
export function getFlightLessonTitle(id: string): string | undefined {
  const authored = lessonRegistry.get(id);
  if (authored) return authored.meta.title;
  return plannedFlightLessons.find((lesson) => lesson.id === id)?.title;
}
