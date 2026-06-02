import { beforeEach, describe, expect, it } from 'vitest';
import { renderWithProviders, screen, userEvent } from '@/test/utils';
import { SafetyBanner } from './SafetyBanner';

describe('SafetyBanner', () => {
  beforeEach(() => localStorage.clear());

  it('links to the rules and hides after being dismissed', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SafetyBanner />);

    expect(screen.getByRole('region', { name: 'Güvenlik uyarısı' })).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/regulations');

    await user.click(screen.getByRole('button', { name: 'Kapat' }));
    expect(screen.queryByRole('region', { name: 'Güvenlik uyarısı' })).toBeNull();
  });
});
