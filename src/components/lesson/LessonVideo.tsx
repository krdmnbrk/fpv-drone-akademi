import { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { LessonVideo as LessonVideoData } from '@/content/videos';

/**
 * Lazy "lite" YouTube embed: shows a thumbnail facade and only mounts the
 * (heavy, cookie-setting) iframe after the user clicks play. Uses the
 * privacy-friendly youtube-nocookie domain.
 */
export function LessonVideo({ video }: { video: LessonVideoData }) {
  const { t } = useTranslation();
  const headingId = useId();
  const [active, setActive] = useState(false);
  const thumbnail = `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`;

  return (
    <section aria-labelledby={headingId}>
      <h2 id={headingId} className="text-xl font-semibold text-white">
        {t('lesson.video')}
      </h2>
      <div className="relative mt-4 aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black">
        {active ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setActive(true)}
            aria-label={`${video.title} — ${t('lesson.playVideo')}`}
            className="group absolute inset-0 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-300"
          >
            <img
              src={thumbnail}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover opacity-80 transition-opacity duration-base ease-standard group-hover:opacity-100"
            />
            <span
              aria-hidden="true"
              className="relative grid h-16 w-16 place-items-center rounded-full bg-brand-500/90 text-2xl text-white shadow-lg transition-transform duration-base ease-standard group-hover:scale-110"
            >
              ▶
            </span>
          </button>
        )}
      </div>
      <p className="mt-2 text-xs text-brand-300">
        {video.title}
        {video.channel ? ` — ${video.channel}` : ''}
        {video.lang === 'en' ? ` (${t('lesson.videoEnglish')})` : ''}
      </p>
    </section>
  );
}
