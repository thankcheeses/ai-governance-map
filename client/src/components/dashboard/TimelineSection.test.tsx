import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TimelineSection from './TimelineSection';
import { OBLIGATIONS } from '@/data/governance';

// framer-motion's whileInView needs IntersectionObserver, which jsdom lacks.
// Without it the register's rows never mount and every assertion below passes
// for the wrong reason, so stub it to report everything as on screen.
class IO {
  constructor(private cb: IntersectionObserverCallback) {}
  observe(el: Element) {
    this.cb([{ isIntersecting: true, target: el } as IntersectionObserverEntry], this as never);
  }
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
vi.stubGlobal('IntersectionObserver', IO);

describe('obligations register', () => {
  it('explains an empty filter instead of showing a blank card', async () => {
    const onChange = vi.fn();
    // CAISSI is the joint NIST/NSA/CISA incident guidance: voluntary practices,
    // no dated duties, so it is the register's zero-row case by construction.
    render(<TimelineSection frameworkFilter="CAISSI" onFrameworkFilterChange={onChange} />);

    expect(screen.getByText(/No dated obligations recorded for/i)).toBeInTheDocument();
    expect(screen.getByText(/property of the instrument, not a gap in the data/i)).toBeInTheDocument();

    // And it offers a way out rather than stranding the reader on the filter.
    await userEvent.click(screen.getByRole('button', { name: `Show all ${OBLIGATIONS.length} obligations` }));
    expect(onChange).toHaveBeenCalledWith('all');
  });

  it('shows rows, not the empty state, when the filter does match', () => {
    render(<TimelineSection frameworkFilter="EU" onFrameworkFilterChange={vi.fn()} />);
    expect(screen.queryByText(/No dated obligations recorded for/i)).not.toBeInTheDocument();
  });
});
