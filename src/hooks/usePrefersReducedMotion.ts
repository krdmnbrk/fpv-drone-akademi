import { useReducedMotion as useSystemReducedMotion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';

/**
 * Resolves the effective reduced-motion preference by combining the OS-level
 * `prefers-reduced-motion` signal with the user's in-app override.
 *
 * - override "off"  -> always reduce motion
 * - override "on"   -> never reduce motion
 * - override "system" -> follow the OS setting
 */
export function usePrefersReducedMotion(): boolean {
  const systemPrefersReduced = useSystemReducedMotion();
  const preference = useAppStore((state) => state.settings.motion);

  if (preference === 'off') return true;
  if (preference === 'on') return false;
  return systemPrefersReduced ?? false;
}
