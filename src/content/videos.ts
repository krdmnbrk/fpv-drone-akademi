export interface LessonVideo {
  /** 11-character YouTube video id. */
  youtubeId: string;
  title: string;
  lang: 'tr' | 'en';
  channel?: string;
}

/**
 * lessonId -> recommended YouTube video. Each entry is researched and verified
 * (YouTube oembed) to exist and be embeddable. Turkish preferred, English fallback.
 */
export const lessonVideos: Record<string, LessonVideo> = {};

export function getLessonVideo(lessonId: string): LessonVideo | undefined {
  return lessonVideos[lessonId];
}
