import { describe, expect, it } from 'vitest';
import { renderWithProviders, screen } from '@/test/utils';
import { HomePage } from './HomePage';

describe('HomePage', () => {
  it('renders a single top-level heading', () => {
    renderWithProviders(<HomePage />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('FPV Drone Akademi');
  });

  it('links the primary CTAs to both learning tracks', () => {
    renderWithProviders(<HomePage />);
    expect(screen.getByRole('link', { name: 'Donanımı Keşfet' })).toHaveAttribute(
      'href',
      '/hardware',
    );
    expect(screen.getByRole('link', { name: 'Uçmayı Öğren' })).toHaveAttribute('href', '/flight');
  });
});
