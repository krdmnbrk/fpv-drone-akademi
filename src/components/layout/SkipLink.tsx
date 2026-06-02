import { useTranslation } from 'react-i18next';

export const MAIN_CONTENT_ID = 'main-content';

/**
 * Keyboard-only "skip to content" link. Visually hidden until focused, so
 * keyboard users can bypass the header navigation.
 */
export function SkipLink() {
  const { t } = useTranslation();
  return (
    <a
      href={`#${MAIN_CONTENT_ID}`}
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-brand-500 focus:px-4 focus:py-2 focus:text-white focus:outline-none focus:ring-2 focus:ring-white"
    >
      {t('common.skipToContent')}
    </a>
  );
}
