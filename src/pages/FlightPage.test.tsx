import { describe, expect, it } from 'vitest';
import { renderWithProviders, screen } from '@/test/utils';
import { FlightPage } from './FlightPage';

describe('FlightPage', () => {
  it('renders the three levels and links every authored lesson', () => {
    renderWithProviders(<FlightPage />);
    expect(screen.getByRole('heading', { level: 1, name: 'Uçuş Eğitimi' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Başlangıç' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Orta' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'İleri' })).toBeInTheDocument();

    // All 19 authored lessons are navigable links.
    expect(screen.getAllByRole('link')).toHaveLength(19);
    expect(screen.getByText('FPV nedir?')).toBeInTheDocument();
  });
});
