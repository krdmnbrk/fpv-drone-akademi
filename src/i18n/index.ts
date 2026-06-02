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
    fallbackLng: 'tr',
    supportedLngs: [...supportedLngs],
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'fpv-academy-lng',
    },
  });

export default i18n;
