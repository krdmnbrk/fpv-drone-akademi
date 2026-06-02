import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { router } from '@/router';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

export function App() {
  const { i18n } = useTranslation();
  const reducedMotion = usePrefersReducedMotion();

  // Keep <html lang> in sync with the active locale (a11y + SEO).
  useEffect(() => {
    const applyLang = (lng: string) => {
      document.documentElement.lang = lng;
    };
    applyLang(i18n.resolvedLanguage ?? i18n.language);
    i18n.on('languageChanged', applyLang);
    return () => {
      i18n.off('languageChanged', applyLang);
    };
  }, [i18n]);

  // Expose the resolved reduced-motion preference (OS + in-app override) to CSS so
  // Tailwind/CSS transitions are suppressed too, not just JS-driven motion.
  useEffect(() => {
    document.documentElement.dataset.reducedMotion = String(reducedMotion);
  }, [reducedMotion]);

  return <RouterProvider router={router} future={{ v7_startTransition: true }} />;
}
