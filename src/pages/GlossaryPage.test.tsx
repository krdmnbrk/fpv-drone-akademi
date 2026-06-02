import { describe, expect, it } from 'vitest';
import { renderWithProviders, screen, userEvent } from '@/test/utils';
import { GlossaryPage } from './GlossaryPage';

describe('GlossaryPage', () => {
  it('renders the glossary and narrows it with a search query', async () => {
    const user = userEvent.setup();
    renderWithProviders(<GlossaryPage />);

    expect(screen.getByRole('heading', { level: 1, name: 'Sözlük' })).toBeInTheDocument();
    const allTerms = screen.getAllByRole('term').length;
    expect(allTerms).toBeGreaterThan(20);

    await user.type(screen.getByRole('searchbox'), 'failsafe');
    const filtered = screen.getAllByRole('term');
    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.length).toBeLessThan(allTerms);
  });
});
