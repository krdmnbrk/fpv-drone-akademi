import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getFlightLessonTitle, getPart, hardwareParts } from '@/content';
import type { HardwarePart } from '@/content/types';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { hasWebGL } from '@/lib/webgl';
import { cn } from '@/lib/cn';

// Heavy Three.js scene — kept out of the entry bundle.
const DroneScene = lazy(() => import('@/scenes/DroneScene'));

// Parts carried on the airframe (and therefore shown/highlighted in the 3D
// model). Goggles and the radio are used off the craft, so they have no mesh.
const OFF_CRAFT = new Set(['goggles', 'radio']);
const isOnCraft = (part: HardwarePart) => !OFF_CRAFT.has(part.meshName);

function PartDetail({ part }: { part: HardwarePart }) {
  const { t } = useTranslation();
  const sections = [
    { label: t('hardware.whatItDoes'), text: part.whatItDoes },
    { label: t('hardware.howToChoose'), text: part.howToChoose },
    { label: t('hardware.howItConnects'), text: part.howItConnects },
  ];
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <h3 className="text-xl font-semibold text-white">{part.name}</h3>
      {!isOnCraft(part) && (
        <p className="mt-2 rounded-lg border border-amber-400/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-100">
          <span aria-hidden="true">ℹ️ </span>
          {t('hardware.notOnCraft')}
        </p>
      )}
      <dl className="mt-4 space-y-4">
        {sections.map((section) => (
          <div key={section.label}>
            <dt className="text-sm font-semibold text-brand-300">{section.label}</dt>
            <dd className="mt-1 text-sm leading-relaxed text-brand-100">{section.text}</dd>
          </div>
        ))}
        <div>
          <dt className="text-sm font-semibold text-brand-300">{t('hardware.commonMistakes')}</dt>
          <dd className="mt-1">
            <ul className="list-disc space-y-1 pl-5 text-sm text-brand-100">
              {part.commonMistakes.map((mistake) => (
                <li key={mistake}>{mistake}</li>
              ))}
            </ul>
          </dd>
        </div>
      </dl>
      {part.relatedLessonIds.length > 0 && (
        <p className="mt-4 text-sm text-brand-300">
          {t('hardware.relatedLessons')}:{' '}
          {part.relatedLessonIds.map((id, position) => (
            <span key={id}>
              {position > 0 && ', '}
              <Link to={`/lesson/${id}`} className="text-brand-200 underline">
                {getFlightLessonTitle(id) ?? id}
              </Link>
            </span>
          ))}
        </p>
      )}
    </div>
  );
}

function SceneFallback({ message }: { message: string }) {
  return (
    <div className="flex h-full items-center justify-center p-6 text-center text-sm text-brand-300">
      {message}
    </div>
  );
}

export function HardwareExplorer() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const reducedMotion = usePrefersReducedMotion();

  // Only accept a deep-linked part id that actually exists.
  const [selectedId, setSelectedId] = useState<string | null>(() => {
    const param = searchParams.get('part');
    return param && getPart(param) ? param : null;
  });
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  const webglAvailable = useMemo(() => hasWebGL(), []);
  const show3D = webglAvailable;
  const selectedPart = selectedId ? getPart(selectedId) : undefined;

  // Reflect deep links such as /hardware?part=esc; ignore and scrub unknown ids
  // so the UI never shows a "selected" state with no matching part.
  useEffect(() => {
    const param = searchParams.get('part');
    if (!param) return;
    if (getPart(param)) {
      if (param !== selectedId) setSelectedId(param);
    } else {
      const next = new URLSearchParams(searchParams);
      next.delete('part');
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, selectedId, setSearchParams]);

  // Bring the detail panel into view when a part is selected — mainly helps on
  // small screens where the detail sits well below the list. `block: 'nearest'`
  // keeps it a no-op when the panel is already visible (e.g. desktop).
  useEffect(() => {
    const el = detailRef.current;
    if (selectedPart && el && typeof el.scrollIntoView === 'function') {
      try {
        el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'nearest' });
      } catch {
        /* jsdom / older browsers: no-op */
      }
    }
  }, [selectedId, selectedPart, reducedMotion]);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    const next = new URLSearchParams(searchParams);
    next.set('part', id);
    setSearchParams(next, { replace: true });
  };

  // Return to the assembled drone (clears the lifted/selected part).
  const handleDeselect = () => {
    setSelectedId(null);
    setHoveredId(null);
    const next = new URLSearchParams(searchParams);
    next.delete('part');
    setSearchParams(next, { replace: true });
  };

  const onCraftParts = hardwareParts.filter(isOnCraft);
  const offCraftParts = hardwareParts.filter((part) => !isOnCraft(part));

  const renderPartButton = (part: HardwarePart) => {
    const selected = selectedId === part.id;
    return (
      <li key={part.id}>
        <button
          type="button"
          aria-pressed={selected}
          onClick={() => handleSelect(part.id)}
          onMouseEnter={() => setHoveredId(part.id)}
          onMouseLeave={() => setHoveredId(null)}
          onFocus={() => setHoveredId(part.id)}
          onBlur={() => setHoveredId(null)}
          className={cn(
            'w-full rounded-lg border px-3 py-2 text-left text-sm transition-colors duration-fast ease-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300',
            selected
              ? 'border-brand-400/60 bg-brand-500/15 text-white'
              : 'border-white/10 bg-white/5 text-brand-100 hover:border-brand-400/40 hover:bg-white/10',
          )}
        >
          {part.name}
        </button>
      </li>
    );
  };

  return (
    <div>
      {/* Announce the focused part to assistive tech (the canvas is aria-hidden). */}
      <p className="sr-only" role="status" aria-live="polite">
        {selectedPart ? t('hardware.partFocused', { name: selectedPart.name }) : ''}
      </p>
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-brand-900 to-brand-950">
            {show3D ? (
              <div aria-hidden="true" className="h-full w-full">
                <Suspense fallback={<SceneFallback message={t('common.loading')} />}>
                  <DroneScene
                    selectedId={selectedId}
                    hoveredId={hoveredId}
                    onSelect={handleSelect}
                    onHover={setHoveredId}
                    onDeselect={handleDeselect}
                    reducedMotion={reducedMotion}
                  />
                </Suspense>
              </div>
            ) : (
              <SceneFallback message={t('hardware.threeDUnavailable')} />
            )}
          </div>
          <p className="mt-2 text-xs text-brand-400">
            {show3D
              ? `${t('hardware.rotateHint')} ${t('hardware.onCraftNote')}`
              : t('hardware.onCraftNote')}
          </p>
        </div>

        <div>
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-lg font-semibold text-white">{t('hardware.partsHeading')}</h2>
            {selectedPart && (
              <button
                type="button"
                onClick={handleDeselect}
                className="rounded text-sm text-brand-300 underline underline-offset-2 hover:text-brand-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
              >
                {t('hardware.showAll')}
              </button>
            )}
          </div>

          <h3
            id="parts-on-craft"
            className="mt-4 text-xs font-semibold uppercase tracking-wide text-brand-300"
          >
            {t('hardware.onCraftHeading')}
          </h3>
          <ul className="mt-2 grid gap-2" aria-labelledby="parts-on-craft">
            {onCraftParts.map(renderPartButton)}
          </ul>

          {offCraftParts.length > 0 && (
            <>
              <h3
                id="parts-off-craft"
                className="mt-5 text-xs font-semibold uppercase tracking-wide text-brand-300"
              >
                {t('hardware.offCraftHeading')}
              </h3>
              <ul className="mt-2 grid gap-2" aria-labelledby="parts-off-craft">
                {offCraftParts.map(renderPartButton)}
              </ul>
            </>
          )}
        </div>
      </div>

      <div className="mt-6" ref={detailRef}>
        {selectedPart ? (
          <PartDetail part={selectedPart} />
        ) : (
          <p className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-6 text-center text-brand-300">
            {t('hardware.selectPartHint')}
          </p>
        )}
      </div>
    </div>
  );
}
