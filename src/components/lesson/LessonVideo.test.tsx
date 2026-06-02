import { describe, expect, it } from 'vitest';
import { renderWithProviders, screen, userEvent } from '@/test/utils';
import { LessonVideo } from './LessonVideo';

const video = {
  youtubeId: 'dQw4w9WgXcQ',
  title: 'Örnek video',
  lang: 'en' as const,
  channel: 'Test Kanalı',
};

describe('LessonVideo', () => {
  it('renders a play facade and mounts the iframe only after clicking', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LessonVideo video={video} />);

    // No iframe until the user opts in.
    expect(document.querySelector('iframe')).toBeNull();

    await user.click(screen.getByRole('button', { name: /Örnek video/ }));

    const iframe = document.querySelector('iframe');
    expect(iframe).not.toBeNull();
    expect(iframe).toHaveAttribute('title', 'Örnek video');
  });
});
