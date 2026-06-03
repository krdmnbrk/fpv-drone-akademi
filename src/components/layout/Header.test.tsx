import { describe, expect, it } from 'vitest';
import { renderWithProviders, screen, userEvent } from '@/test/utils';
import { Header } from './Header';

describe('Header', () => {
  it('renders navigation links and settings controls', () => {
    renderWithProviders(<Header />);
    expect(screen.getByRole('link', { name: 'Ana Sayfa' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Donanım' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Uçuş Eğitimi' })).toBeInTheDocument();
    expect(screen.getByLabelText('Dil')).toBeInTheDocument();
  });

  it('toggles the accessible mobile menu', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Header />);
    const toggle = screen.getByRole('button', { name: 'Menüyü aç' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await user.click(toggle);
    expect(screen.getByRole('button', { name: 'Menüyü kapat' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });
});
