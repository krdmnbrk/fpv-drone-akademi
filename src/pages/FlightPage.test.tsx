import { beforeEach, describe, expect, it } from 'vitest';
import { renderWithProviders, screen } from '@/test/utils';
import { useAppStore } from '@/store/useAppStore';
import { FlightPage } from './FlightPage';

describe('FlightPage', () => {
  beforeEach(() => {
    useAppStore.setState({
      progress: {},
      badges: {},
      settings: { motion: 'system', quality: 'auto' },
    });
  });

  it('renders the three levels and links every authored lesson', () => {
    renderWithProviders(<FlightPage />);
    expect(screen.getByRole('heading', { level: 1, name: 'Uçuş Eğitimi' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Başlangıç' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Orta' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'İleri' })).toBeInTheDocument();

    // One navigable link per authored lesson (the row, or its soft-gate override).
    expect(screen.getAllByRole('link')).toHaveLength(19);
    expect(screen.getByText('FPV nedir?')).toBeInTheDocument();
  });

  it('soft-gates lessons whose prerequisites are not met', () => {
    renderWithProviders(<FlightPage />);
    // With no progress, lessons that have prerequisites show an "open anyway" override.
    expect(screen.getAllByText('Yine de aç').length).toBeGreaterThan(0);
  });
});
