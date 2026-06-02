import { describe, expect, it } from 'vitest';
import { lessonVideos } from './videos';
import { getFlightCurriculum } from './index';
import { flightLevels } from './curriculum';

describe('lesson videos', () => {
  it('every authored flight lesson has a video', () => {
    const curriculum = getFlightCurriculum();
    const authoredIds = flightLevels.flatMap((level) =>
      curriculum[level].filter((lesson) => lesson.available).map((lesson) => lesson.id),
    );
    const missing = authoredIds.filter((id) => !lessonVideos[id]);
    expect(missing).toEqual([]);
  });

  it('every video id looks like a YouTube id', () => {
    for (const video of Object.values(lessonVideos)) {
      expect(video.youtubeId).toMatch(/^[\w-]{11}$/);
    }
  });
});
