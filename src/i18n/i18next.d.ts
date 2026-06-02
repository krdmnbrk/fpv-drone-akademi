import 'i18next';
import type { Translation } from './locales/tr';

/**
 * Makes `t('nav.home')` keys type-checked against the Turkish locale shape.
 */
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      translation: Translation;
    };
  }
}
