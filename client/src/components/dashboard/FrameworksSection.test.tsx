import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { FRAMEWORKS, OBLIGATIONS, frameworkSources, isBinding } from '@/data/governance';
import { FrameworkSourceList } from './FrameworksSection';

describe('frameworkSources', () => {
  it('returns every framework once, in register order', () => {
    expect(frameworkSources().map((r) => r.framework.slug)).toEqual(FRAMEWORKS.map((f) => f.slug));
  });

  it('cites only documents the obligation rows already cite', () => {
    const cited = new Set(OBLIGATIONS.flatMap((o) => (o.source ? [o.source.url ?? o.source.citation] : [])));
    for (const row of frameworkSources()) {
      for (const s of row.sources) expect(cited.has(s.url ?? s.citation)).toBe(true);
    }
  });

  it('leaves the ISO/IEC 42001 entry unsourced rather than filling it in', () => {
    const iso = frameworkSources().find((r) => r.framework.shortCode === 'ISO')!;
    expect(iso.rows).toBeGreaterThan(0);
    expect(iso.sourced).toBe(0);
    expect(iso.sources).toEqual([]);
  });

  it('splits the register into binding and non-binding by the type each entry declares', () => {
    const binding = FRAMEWORKS.filter(isBinding);
    expect(binding.every((f) => f.type.includes('(Binding)'))).toBe(true);
    expect(FRAMEWORKS.filter((f) => !isBinding(f)).some((f) => f.type.includes('(Binding)'))).toBe(false);
  });
});

describe('FrameworkSourceList', () => {
  it('lists one entry per framework, with the count in its heading', () => {
    render(<FrameworkSourceList />);
    expect(screen.getByRole('heading', { name: `Sources for all ${FRAMEWORKS.length} frameworks` })).toBeInTheDocument();
    const list = screen.getAllByRole('list')[0];
    expect(within(list).getAllByRole('listitem').filter((li) => li.parentElement === list)).toHaveLength(FRAMEWORKS.length);
  });

  it('says so when an entry has no source, instead of leaving it blank', () => {
    render(<FrameworkSourceList />);
    expect(screen.getAllByText('No source recorded.').length).toBeGreaterThan(0);
  });
});
