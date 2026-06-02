export type Track = 'flight' | 'hardware';
export type Level = 'beginner' | 'intermediate' | 'advanced';

/** Frontmatter of a lesson MDX file. */
export interface LessonFrontmatter {
  id: string;
  track: Track;
  level: Level;
  order: number;
  title: string;
  summary: string;
  estimatedMinutes: number;
  objectives: string[];
  prerequisites: string[];
  quizId?: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  /** Index into `options` of the correct answer. */
  answerIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  questions: QuizQuestion[];
}

export interface HardwarePart {
  id: string;
  name: string;
  /** Name of the corresponding mesh in the 3D model (equals `id`). */
  meshName: string;
  order: number;
  whatItDoes: string;
  howToChoose: string;
  howItConnects: string;
  commonMistakes: string[];
  relatedLessonIds: string[];
}
