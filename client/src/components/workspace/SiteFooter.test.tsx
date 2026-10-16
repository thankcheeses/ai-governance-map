import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SiteFooter, { type FooterColumn, type FooterLink } from './SiteFooter';

const columns: FooterColumn[] = [
  { heading: 'Assess', links: [{ label: 'Risk matrix', onSelect: vi.fn() }, { label: 'Controls', onSelect: vi.fn() }] },
  { heading: 'Obligations', links: [{ label: 'Timeline', onSelect: vi.fn() }] },
  { heading: 'Map', links: [{ label: 'Flat world map', onSelect: vi.fn() }] },
  {
    heading: 'NHID-Clinical',
    links: [{ label: 'Specification v1.3', href: 'https://nhid-clinical.org/specification.html' }],
  },
];
const quickLinks: FooterLink[] = [{ label: 'Risk matrix', onSelect: vi.fn() }];

const setup = (open = true, onToggle = vi.fn()) => {
  render(<SiteFooter open={open} onToggle={onToggle} columns={columns} quickLinks={quickLinks} />);
  return { onToggle };
};

describe('SiteFooter', () => {
  it('groups every link under a named heading', () => {
    setup();
    for (const col of columns) {
      const nav = screen.getByRole('navigation', { name: col.heading });
      expect(within(nav).getByRole('heading', { name: col.heading })).toBeInTheDocument();
      for (const link of col.links) {
        expect(within(nav).getByText(new RegExp(link.label))).toBeInTheDocument();
      }
    }
  });

  it('carries the brand block with a one-line description', () => {
    setup();
    expect(screen.getByText('AI Governance Map')).toBeInTheDocument();
    expect(screen.getByText(/never leaves this browser/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Repository on GitHub/i })).toBeInTheDocument();
  });

  it('puts copyright on the left and legal links on the right', () => {
    setup();
    expect(screen.getByText(new RegExp(`© ${new Date().getFullYear()}`))).toBeInTheDocument();
    // The register is reference material; the footer must not imply otherwise.
    expect(screen.getByText(/not legal advice/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /CC BY 4\.0/ })).toBeInTheDocument();
  });

  it('opens an in-app view rather than navigating away', async () => {
    const onSelect = vi.fn();
    render(
      <SiteFooter
        open
        onToggle={vi.fn()}
        columns={[{ heading: 'Assess', links: [{ label: 'Risk matrix', onSelect }] }]}
        quickLinks={[]}
      />,
    );
    await userEvent.click(within(screen.getByRole('navigation', { name: 'Assess' })).getByText('Risk matrix'));
    expect(onSelect).toHaveBeenCalled();
  });

  it('sends every external link out without a referrer', () => {
    setup();
    const external = screen.getAllByRole('link').filter((a) => a.getAttribute('target') === '_blank');
    expect(external.length).toBeGreaterThan(0);
    for (const a of external) expect(a.getAttribute('rel')).toMatch(/noreferrer/);
  });

  it('keeps named destinations on screen while collapsed', () => {
    setup(false);
    expect(screen.getByText('Risk matrix')).toBeInTheDocument();
    expect(screen.queryByRole('navigation', { name: 'Obligations' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /All views/ })).toHaveAttribute('aria-expanded', 'false');
  });
});
