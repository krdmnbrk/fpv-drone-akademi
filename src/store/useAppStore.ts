import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type LessonStatus = 'not-started' | 'in-progress' | 'completed';

export interface LessonProgress {
  status: LessonStatus;
  /** Best quiz score as a percentage 0–100, if a quiz was taken. */
  quizScorePct?: number;
  /** Epoch ms when the lesson was marked complete. */
  completedAt?: number;
}

export type MotionPreference = 'system' | 'on' | 'off';
export type QualityPreference = 'auto' | 'high' | 'low';

export interface Settings {
  motion: MotionPreference;
  quality: QualityPreference;
}

export interface AppState {
  /** lessonId -> progress */
  progress: Record<string, LessonProgress>;
  /** badgeId -> award metadata */
  badges: Record<string, { earnedAt: number }>;
  settings: Settings;

  // --- progress actions ---
  startLesson: (lessonId: string) => void;
  completeLesson: (lessonId: string, quizScorePct?: number) => void;
  recordQuizScore: (lessonId: string, scorePct: number) => void;

  // --- badge actions ---
  awardBadge: (badgeId: string) => void;

  // --- settings actions ---
  setMotionPreference: (motion: MotionPreference) => void;
  setQualityPreference: (quality: QualityPreference) => void;

  resetProgress: () => void;
}

const initialSettings: Settings = { motion: 'system', quality: 'auto' };

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      progress: {},
      badges: {},
      settings: initialSettings,

      startLesson: (lessonId) =>
        set((state) => {
          const existing = state.progress[lessonId];
          // Never downgrade a completed lesson back to in-progress.
          if (existing?.status === 'completed') return state;
          return {
            progress: {
              ...state.progress,
              [lessonId]: { ...existing, status: 'in-progress' },
            },
          };
        }),

      completeLesson: (lessonId, quizScorePct) =>
        set((state) => {
          const existing = state.progress[lessonId];
          const bestScore = mergeBestScore(existing?.quizScorePct, quizScorePct);
          return {
            progress: {
              ...state.progress,
              [lessonId]: {
                status: 'completed',
                completedAt: Date.now(),
                ...(bestScore !== undefined ? { quizScorePct: bestScore } : {}),
              },
            },
          };
        }),

      recordQuizScore: (lessonId, scorePct) =>
        set((state) => {
          const existing = state.progress[lessonId];
          const clamped = clampPct(scorePct);
          const bestScore = mergeBestScore(existing?.quizScorePct, clamped);
          return {
            progress: {
              ...state.progress,
              [lessonId]: {
                // In-app, LessonPage calls startLesson first, so `existing` is set
                // before a quiz is submitted; the fallback only applies if a score is
                // recorded for a never-started lesson.
                status: existing?.status ?? 'in-progress',
                ...(existing?.completedAt !== undefined
                  ? { completedAt: existing.completedAt }
                  : {}),
                ...(bestScore !== undefined ? { quizScorePct: bestScore } : {}),
              },
            },
          };
        }),

      awardBadge: (badgeId) =>
        set((state) => {
          if (state.badges[badgeId]) return state; // idempotent
          return { badges: { ...state.badges, [badgeId]: { earnedAt: Date.now() } } };
        }),

      setMotionPreference: (motion) =>
        set((state) => ({ settings: { ...state.settings, motion } })),

      setQualityPreference: (quality) =>
        set((state) => ({ settings: { ...state.settings, quality } })),

      resetProgress: () => set({ progress: {}, badges: {} }),
    }),
    {
      name: 'fpv-academy-store',
      version: 1,
      partialize: (state) => ({
        progress: state.progress,
        badges: state.badges,
        settings: state.settings,
      }),
    },
  ),
);

// --- pure helpers (exported for unit testing) ---

export function clampPct(pct: number): number {
  if (Number.isNaN(pct)) return 0;
  return Math.max(0, Math.min(100, Math.round(pct)));
}

/** Keeps the higher of an existing and a new score; tolerates undefineds. */
export function mergeBestScore(
  existing: number | undefined,
  incoming: number | undefined,
): number | undefined {
  if (incoming === undefined) return existing;
  const clamped = clampPct(incoming);
  if (existing === undefined) return clamped;
  return Math.max(existing, clamped);
}
