import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CONTROLS } from '@/data/governance';
import StatusStrip from './StatusStrip';

const setup = (props: Partial<Parameters<typeof StatusStrip>[0]> = {}) => {
  const onJump = vi.fn();
  render(<StatusStrip controlState={{}} overallScore={0} assessedCount={0} onJump={onJump} {...props} />);
  return { onJump };
};

describe('StatusStrip', () => {
  // This sentence is a release check: it states a duty that is already running,
  // and must not be softened into a future or conditional tense.
  it('states the Article 50 position verbatim', () => {
    setup();
    expect(screen.getByText(/Article 50 transparency has applied since 2 August 2026\./)).toBeInTheDocument();
  });

  it('keeps the Annex III deferral distinct from the Article 50 duty', () => {
    setup();
    expect(screen.getByText(/deferred to 2 December 2027/)).toBeInTheDocument();
    // The 2 Dec 2026 marking grace must not be generalised to all of Article 50.
    expect(screen.queryByText(/Article 50.*2 December 2026/)).not.toBeInTheDocument();
  });

  it('reads posture as not assessed rather than zero when nothing is scored', () => {
    setup();
    expect(screen.getByText('Not assessed')).toBeInTheDocument();
    expect(screen.getByText(`0 of ${CONTROLS.length} controls scored`)).toBeInTheDocument();
  });

  it('reports posture once controls carry browser-local scores', () => {
    setup({
      controlState: { 1: { maturity: 4 } },
      overallScore: 3,
      assessedCount: 1,
    });
    expect(screen.getByText('3%')).toBeInTheDocument();
    expect(screen.getByText(`1 of ${CONTROLS.length} controls scored`)).toBeInTheDocument();
  });

  it('counts unscored critical controls against the real critical total', () => {
    const critical = CONTROLS.filter((c) => c.priority === 'Critical');
    setup();
    expect(screen.getByText(`${critical.length}/${critical.length}`)).toBeInTheDocument();
  });

  it('navigates to the relevant section when a figure is activated', async () => {
    const { onJump } = setup();
    await userEvent.click(screen.getByRole('button', { name: /Unscored critical/ }));
    expect(onJump).toHaveBeenCalledWith('controls');
  });
});
