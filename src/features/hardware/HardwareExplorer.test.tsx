import { describe, expect, it } from 'vitest';
import { renderWithProviders, screen, userEvent } from '@/test/utils';
import { HardwareExplorer } from './HardwareExplorer';

describe('HardwareExplorer', () => {
  it('lists every part and shows its detail when selected', async () => {
    const user = userEvent.setup();
    renderWithProviders(<HardwareExplorer />);

    expect(screen.getAllByRole('button').length).toBeGreaterThanOrEqual(11);

    await user.click(screen.getByRole('button', { name: 'ESC (Elektronik Hız Kontrolcüsü)' }));
    expect(
      screen.getByRole('heading', { name: 'ESC (Elektronik Hız Kontrolcüsü)' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Ne işe yarar')).toBeInTheDocument();
    expect(screen.getByText('Sık yapılan hatalar')).toBeInTheDocument();
  });

  it('renders the non-WebGL fallback when no GL context is available', () => {
    renderWithProviders(<HardwareExplorer />);
    expect(screen.getByText(/3B görünüm bu cihazda kullanılamıyor/)).toBeInTheDocument();
  });
});
