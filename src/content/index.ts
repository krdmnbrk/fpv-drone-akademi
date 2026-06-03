import type { ComponentType } from 'react';
import i18n from '@/i18n';
import type { HardwarePart, LessonFrontmatter, Level, Quiz } from './types';
import { flightLevels, plannedFlightLessons } from './curriculum';
import partsData from './hardware/parts.json';

export type ContentLocale = 'tr' | 'en';

/**
 * The content layer is locale-aware: it reads the active i18n language at call
 * time and returns the English variant when one exists, otherwise it falls back
 * to the Turkish source. Consumers (which all use `useTranslation`) re-render on
 * language change, so the content swaps automatically. Turkish is the source of
 * truth; English files are optional overlays.
 */
function currentLocale(): ContentLocale {
  const lng = i18n.resolvedLanguage || i18n.language || 'tr';
  return lng.startsWith('en') ? 'en' : 'tr';
}

// --- Lessons (authored MDX, per-locale) ---
// Turkish: ./flight/<level>/<id>.mdx · English overlay: ./flight/<level>/<id>.en.mdx
interface LessonModule {
  default: ComponentType;
  frontmatter: LessonFrontmatter;
}

const lessonModules = import.meta.glob<LessonModule>('./flight/**/*.mdx', { eager: true });

export interface LessonEntry {
  meta: LessonFrontmatter;
  Component: ComponentType;
}

type LocaleSlots = { tr?: LessonEntry; en?: LessonEntry };
const lessonByIdLocale = new Map<string, LocaleSlots>();
for (const [path, mod] of Object.entries(lessonModules)) {
  const locale: ContentLocale = path.endsWith('.en.mdx') ? 'en' : 'tr';
  const id = mod.frontmatter.id;
  const slot = lessonByIdLocale.get(id) ?? {};
  slot[locale] = { meta: mod.frontmatter, Component: mod.default };
  lessonByIdLocale.set(id, slot);
}

/** A lesson is "authored" (playable) once its Turkish source exists. */
function isAuthored(id: string): boolean {
  return Boolean(lessonByIdLocale.get(id)?.tr);
}

function lessonEntry(id: string, locale: ContentLocale): LessonEntry | undefined {
  const slot = lessonByIdLocale.get(id);
  if (!slot) return undefined;
  return slot[locale] ?? slot.tr;
}

export function getLesson(id: string): LessonEntry | undefined {
  return lessonEntry(id, currentLocale());
}

// --- Quizzes (JSON, per-locale) ---
// Turkish: ./quizzes/<id>.json · English overlay: ./quizzes/en/<id>.json
const quizModules = import.meta.glob<{ default: Quiz }>('./quizzes/**/*.json', { eager: true });
const quizByIdLocale = new Map<string, { tr?: Quiz; en?: Quiz }>();
for (const [path, mod] of Object.entries(quizModules)) {
  const locale: ContentLocale = path.includes('/quizzes/en/') ? 'en' : 'tr';
  const id = mod.default.id;
  const slot = quizByIdLocale.get(id) ?? {};
  slot[locale] = mod.default;
  quizByIdLocale.set(id, slot);
}

export function getQuiz(id: string): Quiz | undefined {
  const slot = quizByIdLocale.get(id);
  if (!slot) return undefined;
  return slot[currentLocale()] ?? slot.tr;
}

// --- Hardware parts (JSON, per-locale) ---
// Turkish source + optional ./hardware/parts.en.json overlay.
const partsEnModules = import.meta.glob<{ default: HardwarePart[] }>('./hardware/parts.en.json', {
  eager: true,
});
const partsEnData = Object.values(partsEnModules)[0]?.default;

function sortByOrder(parts: HardwarePart[]): HardwarePart[] {
  return [...parts].sort((a, b) => a.order - b.order);
}

/** Turkish parts (source of truth). Kept as a named export for tests/tooling. */
export const hardwareParts: HardwarePart[] = sortByOrder(partsData as HardwarePart[]);
const hardwarePartsEn: HardwarePart[] | undefined = partsEnData
  ? sortByOrder(partsEnData)
  : undefined;

/** Locale-aware hardware parts (English overlay when available). */
export function getHardwareParts(): HardwarePart[] {
  return currentLocale() === 'en' && hardwarePartsEn ? hardwarePartsEn : hardwareParts;
}

export function getPart(id: string): HardwarePart | undefined {
  return getHardwareParts().find((part) => part.id === id);
}

// --- Regulations (MDX, per-locale) ---
// Turkish: ./regulations/shgm.mdx · English overlay: ./regulations/shgm.en.mdx
const regulationModules = import.meta.glob<{ default: ComponentType }>('./regulations/*.mdx', {
  eager: true,
});
const regulationByLocale: { tr?: ComponentType; en?: ComponentType } = {};
for (const [path, mod] of Object.entries(regulationModules)) {
  const locale: ContentLocale = path.endsWith('.en.mdx') ? 'en' : 'tr';
  regulationByLocale[locale] = mod.default;
}

export function getRegulationsDoc(): ComponentType | undefined {
  return regulationByLocale[currentLocale()] ?? regulationByLocale.tr;
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
  const locale = currentLocale();
  const authored: FlightLessonItem[] = [];
  for (const slot of lessonByIdLocale.values()) {
    const base = slot.tr;
    if (!base || base.meta.track !== 'flight') continue;
    authored.push(toItemFromMeta((slot[locale] ?? base).meta));
  }

  // Drop planned entries that have since been authored, so a newly added MDX
  // lesson automatically moves from "coming soon" to playable.
  const planned: FlightLessonItem[] = plannedFlightLessons
    .filter((ref) => !isAuthored(ref.id))
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
  return getOrderedFlightLessonIds().filter((id) => isAuthored(id));
}

/** Nearest available previous/next authored lessons for in-lesson navigation. */
export function getAdjacentFlightLessons(id: string): { prev?: string; next?: string } {
  const ordered = getOrderedFlightLessonIds();
  const index = ordered.indexOf(id);
  if (index === -1) return {};
  const prev = ordered
    .slice(0, index)
    .reverse()
    .find((lessonId) => isAuthored(lessonId));
  const next = ordered.slice(index + 1).find((lessonId) => isAuthored(lessonId));
  return { ...(prev ? { prev } : {}), ...(next ? { next } : {}) };
}

export function getAvailableFlightLessonCount(): number {
  let count = 0;
  for (const slot of lessonByIdLocale.values()) {
    if (slot.tr?.meta.track === 'flight') count += 1;
  }
  return count;
}

/** Human-readable title for a flight lesson id (authored or planned). */
export function getFlightLessonTitle(id: string): string | undefined {
  const entry = lessonEntry(id, currentLocale());
  if (entry) return entry.meta.title;
  return plannedFlightLessons.find((lesson) => lesson.id === id)?.title;
}
