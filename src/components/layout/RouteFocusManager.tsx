import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { MAIN_CONTENT_ID } from './SkipLink';

/**
 * On every route change, scroll to the top and move focus to the main region
 * so keyboard and screen-reader users land on the new page content. Honors the
 * reduced-motion preference for the scroll behavior.
 */
export function RouteFocusManager() {
  const { pathname } = useLocation();
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    document.getElementById(MAIN_CONTENT_ID)?.focus({ preventScroll: true });
  }, [pathname, reducedMotion]);

  return null;
}
