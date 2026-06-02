import { describe, expect, it } from 'vitest';
import { renderWithProviders, screen } from '@/test/utils';
import { Callout } from './Callout';
import { KeyTerm } from './KeyTerm';
import { PartHighlight } from './PartHighlight';
import { DemoPlaceholder } from './DemoPlaceholder';

describe('MDX components', () => {
  it('Callout renders its content as a note', () => {
    renderWithProviders(<Callout type="warning">Dikkat metni</Callout>);
    expect(screen.getByRole('note')).toHaveTextContent('Dikkat metni');
  });

  it('KeyTerm exposes the English term via title', () => {
    renderWithProviders(<KeyTerm en="flight controller">uçuş kontrolcüsü</KeyTerm>);
    expect(screen.getByText('uçuş kontrolcüsü')).toHaveAttribute('title', 'flight controller');
  });

  it('PartHighlight links to the related hardware part', () => {
    renderWithProviders(<PartHighlight part="esc" />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/hardware?part=esc');
    expect(link).toHaveTextContent(/ESC/);
  });

  it('PartHighlight renders nothing for an unknown part', () => {
    const { container } = renderWithProviders(<PartHighlight part="does-not-exist" />);
    expect(container).toBeEmptyDOMElement();
  });

  it('DemoPlaceholder renders its title', () => {
    renderWithProviders(<DemoPlaceholder title="Demo başlığı" note="açıklama" />);
    expect(screen.getByText('Demo başlığı')).toBeInTheDocument();
  });
});
