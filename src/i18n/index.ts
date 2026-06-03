import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { tr } from './locales/tr';
import { en } from './locales/en';

export const defaultNS = 'translation';

export const resources = {
  tr: { translation: tr },
  en: { translation: en },
};

export const supportedLngs = ['tr', 'en'] as const;
export type AppLocale = (typeof supportedLngs)[number];

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    defaultNS,
    // Turkish is the default/shipping language. We only honour an explicit,
    // remembered choice (localStorage) — the browser's language never auto-
    // switches the app, so a first visit always opens in Turkish while a saved
    // 'en' choice is still restored.
    fallbackLng: 'tr',
    supportedLngs: [...supportedLngs],
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage'],
      caches: ['localStorage'],
      lookupLocalStorage: 'fpv-academy-lng',
    },
  });

export default i18n;
