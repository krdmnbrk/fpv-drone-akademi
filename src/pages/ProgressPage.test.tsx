import { beforeEach, describe, expect, it } from 'vitest';
import { renderWithProviders, screen } from '@/test/utils';
import { ProgressPage } from './ProgressPage';
import { useAppStore } from '@/store/useAppStore';

describe('ProgressPage', () => {
  beforeEach(() => {
    useAppStore.setState({
      progress: {},
      badges: {},
      settings: { motion: 'system', quality: 'auto' },
    });
  });

  it('shows zero progress and locked badges with their target', () => {
    renderWithProviders(<ProgressPage />);
    expect(screen.getByRole('heading', { level: 1, name: 'İlerlemen' })).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
    // Locked badges are labelled for screen readers and show progress toward target.
    expect(screen.getAllByText('Kilitli').length).toBeGreaterThan(0);
    expect(screen.getByText('0 / 8')).toBeInTheDocument();
  });

  it('reflects an earned badge', () => {
    useAppStore.setState({
      progress: { 'fpv-nedir': { status: 'completed' } },
      badges: { 'first-flight': { earnedAt: 1 } },
    });
    renderWithProviders(<ProgressPage />);
    expect(screen.getByText('İlk dersini tamamladın.')).toBeInTheDocument();
  });
});
