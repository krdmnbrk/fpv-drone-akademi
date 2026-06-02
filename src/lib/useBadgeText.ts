import { useTranslation } from 'react-i18next';

export interface BadgeText {
  name: string;
  desc: string;
}

/**
 * Translated name/description per badge id. Uses literal i18n keys so the keys stay
 * type-checked. Shared by the progress page and the lesson completion toast.
 */
export function useBadgeText(): Record<string, BadgeText> {
  const { t } = useTranslation();
  return {
    'first-flight': { name: t('badges.firstFlight.name'), desc: t('badges.firstFlight.desc') },
    'beginner-graduate': {
      name: t('badges.beginnerGraduate.name'),
      desc: t('badges.beginnerGraduate.desc'),
    },
    'intermediate-graduate': {
      name: t('badges.intermediateGraduate.name'),
      desc: t('badges.intermediateGraduate.desc'),
    },
    'advanced-graduate': {
      name: t('badges.advancedGraduate.name'),
      desc: t('badges.advancedGraduate.desc'),
    },
    'full-curriculum': {
      name: t('badges.fullCurriculum.name'),
      desc: t('badges.fullCurriculum.desc'),
    },
  };
}
