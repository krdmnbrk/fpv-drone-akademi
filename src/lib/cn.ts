/**
 * Minimal className combiner — joins truthy class strings with a space.
 * Kept dependency-free; sufficient for our conditional-class needs.
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
