import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { router } from '@/router';

export function App() {
  const { i18n } = useTranslation();

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

  return <RouterProvider router={router} future={{ v7_startTransition: true }} />;
}
