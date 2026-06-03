import { cn } from '@/lib/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 rounded-sm font-display font-semibold tracking-wide transition-[colors,box-shadow,transform] duration-base ease-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-950 disabled:pointer-events-none disabled:opacity-50';

const variantClasses: Record<ButtonVariant, string> = {
  // Dark ink on the glowing cyan accent — high contrast, instrument-key feel.
  primary:
    'bg-brand-500 text-brand-950 shadow-glow hover:bg-brand-400 hover:shadow-glow-strong active:bg-brand-600',
  secondary:
    'border border-brand-400/30 bg-white/5 text-brand-50 hover:border-brand-400/60 hover:bg-white/10 active:bg-white/5',
  ghost: 'text-brand-100 hover:bg-white/10 active:bg-white/5',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-5 text-base',
  lg: 'h-12 px-6 text-base',
};

export interface ButtonStyleOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

export function buttonClasses({
  variant = 'primary',
  size = 'md',
  className,
}: ButtonStyleOptions = {}): string {
  return cn(base, variantClasses[variant], sizeClasses[size], className);
}
