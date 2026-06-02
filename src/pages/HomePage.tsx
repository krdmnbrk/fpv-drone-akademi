import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Container } from '@/components/ui/Container';
import { ButtonLink } from '@/components/ui/Button';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { tokens, toSeconds } from '@/design/tokens';
import { useAppStore } from '@/store/useAppStore';
import { selectCompletedCount, selectResumeLessonId } from '@/store/selectors';
import { getFlightLessonTitle, getOrderedAvailableFlightLessonIds } from '@/content';

function TrackCard({ to, title, description }: { to: string; title: string; description: string }) {
  return (
    <Link
      to={to}
      className="group flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors duration-base ease-standard hover:border-brand-400/50 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
    >
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-brand-200">{description}</p>
      <span
        aria-hidden="true"
        className="mt-4 text-brand-300 transition-transform duration-base ease-standard group-hover:translate-x-1"
      >
        →
      </span>
    </Link>
  );
}

export function HomePage() {
  const { t } = useTranslation();
  const reducedMotion = usePrefersReducedMotion();
  const duration = toSeconds(tokens.motion.duration.base);

  const orderedIds = useMemo(() => getOrderedAvailableFlightLessonIds(), []);
  const completedCount = useAppStore(selectCompletedCount);
  const resumeId = useAppStore((state) => selectResumeLessonId(state, orderedIds));

  // The single, obvious next step: start, continue, or celebrate completion.
  const guided = !resumeId
    ? { to: '/progress', label: t('home.allDone') }
    : completedCount === 0
      ? { to: `/lesson/${resumeId}`, label: `${t('home.startHere')} →` }
      : {
          to: `/lesson/${resumeId}`,
          label: `${t('home.continue')}: ${getFlightLessonTitle(resumeId) ?? ''}`,
        };

  const reveal = {
    initial: reducedMotion ? { opacity: 1 } : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <Container className="py-16 sm:py-24">
      <section className="mx-auto max-w-3xl text-center">
        <motion.p
          {...reveal}
          transition={{ duration }}
          className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-300"
        >
          {t('home.heroKicker')}
        </motion.p>
        <motion.h1
          {...reveal}
          transition={{ duration, delay: reducedMotion ? 0 : 0.05 }}
          className="mt-4 text-4xl font-bold text-white sm:text-6xl"
        >
          {t('home.heroTitle')}
        </motion.h1>
        <motion.p
          {...reveal}
          transition={{ duration, delay: reducedMotion ? 0 : 0.1 }}
          className="mx-auto mt-5 max-w-xl text-balance text-brand-100"
        >
          {t('home.heroSubtitle')}
        </motion.p>
        <div className="mt-8 flex flex-col items-center gap-4">
          <ButtonLink to={guided.to} size="lg">
            {guided.label}
          </ButtonLink>
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-brand-300">
            <span>{t('home.exploreOwn')}:</span>
            <Link to="/flight" className="underline underline-offset-2 hover:text-brand-100">
              {t('home.ctaFlight')}
            </Link>
            <span aria-hidden="true">·</span>
            <Link to="/hardware" className="underline underline-offset-2 hover:text-brand-100">
              {t('home.ctaHardware')}
            </Link>
          </div>
        </div>
      </section>

      <aside className="mx-auto mt-12 max-w-2xl rounded-xl border border-amber-400/30 bg-amber-500/10 p-4">
        <p className="text-sm font-semibold text-amber-100">
          <span aria-hidden="true">⚠️ </span>
          {t('safety.spotterTitle')}
        </p>
        <p className="mt-1 text-sm text-amber-100/90">
          {t('safety.spotterText')}{' '}
          <Link
            to="/regulations"
            className="font-medium underline underline-offset-2 hover:text-white"
          >
            {t('safety.learnMore')}
          </Link>
        </p>
      </aside>

      <section className="mt-20" aria-labelledby="tracks-heading">
        <h2 id="tracks-heading" className="text-center text-2xl font-bold text-white">
          {t('home.tracksTitle')}
        </h2>
        <div className="mx-auto mt-8 grid max-w-3xl gap-6 sm:grid-cols-2">
          <TrackCard
            to="/hardware"
            title={t('home.hardwareCardTitle')}
            description={t('home.hardwareCardDesc')}
          />
          <TrackCard
            to="/flight"
            title={t('home.flightCardTitle')}
            description={t('home.flightCardDesc')}
          />
        </div>
      </section>
    </Container>
  );
}
