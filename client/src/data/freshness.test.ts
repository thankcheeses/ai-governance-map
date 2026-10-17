import { describe, expect, it } from 'vitest';
import {
  OBLIGATIONS,
  STALE_AFTER_DAYS,
  TIMELINE_EVENTS,
  formatAge,
  freshness,
  isStale,
  reconciledAgeDays,
  type SourceRef,
} from './governance';
import { GOVERNANCE_PLACES } from './places';

const src = (checked: string): SourceRef => ({ tier: 'primary', citation: 'x', checked });

describe('reconciliation age', () => {
  it('counts whole days, never negative', () => {
    expect(reconciledAgeDays('2026-10-01', '2026-10-17')).toBe(16);
    expect(reconciledAgeDays('2026-10-17', '2026-10-17')).toBe(0);
    // A date in the future is a data error, not a negative age.
    expect(reconciledAgeDays('2026-12-01', '2026-10-17')).toBe(0);
  });

  it('refuses dates it cannot read rather than guessing', () => {
    expect(reconciledAgeDays('Oct 2026', '2026-10-17')).toBeNaN();
    expect(formatAge(NaN)).toBe('date unknown');
    expect(isStale(NaN)).toBe(false);
  });

  it('reads at the precision a person would say it', () => {
    expect(formatAge(0)).toBe('today');
    expect(formatAge(16)).toBe('16d ago');
    expect(formatAge(200)).toBe('7mo ago');
    expect(formatAge(800)).toBe('2y ago');
  });

  it('flags stale at roughly six months, not sooner', () => {
    // Generous on purpose: a flag that fires constantly gets ignored.
    expect(STALE_AFTER_DAYS).toBeGreaterThanOrEqual(180);
    expect(isStale(STALE_AFTER_DAYS)).toBe(false);
    expect(isStale(STALE_AFTER_DAYS + 1)).toBe(true);
  });
});

describe('freshness queue', () => {
  const rows = [
    { name: 'recent', source: src('2026-10-10') },
    { name: 'old', source: src('2026-01-02') },
    { name: 'unsourced' },
    { name: 'middle', source: src('2026-06-01') },
  ];

  it('lists oldest reconciliation first', () => {
    const f = freshness(rows, (r) => r.name, '2026-10-17');
    expect(f.oldestFirst.map((r) => r.label)).toEqual(['old', 'middle', 'recent']);
  });

  it('leaves unsourced rows out rather than calling them stale', () => {
    // Never checked is a different gap from checked long ago, and the
    // evidence-coverage count already publishes it as its own number.
    const f = freshness(rows, (r) => r.name, '2026-10-17');
    expect(f.sourced).toBe(3);
    expect(f.oldestFirst.some((r) => r.label === 'unsourced')).toBe(false);
  });

  it('counts stale and fresh against the same threshold', () => {
    const f = freshness(rows, (r) => r.name, '2026-10-17');
    expect(f.stale).toBe(1); // 2026-01-02 is 288 days before
    expect(f.fresh).toBe(2);
    expect(f.fresh + f.stale).toBe(f.sourced);
  });
});

describe('the register itself', () => {
  const all: SourceRef[] = [
    ...OBLIGATIONS.flatMap((o) => (o.source ? [o.source] : [])),
    ...TIMELINE_EVENTS.flatMap((e) => (e.source ? [e.source] : [])),
    ...GOVERNANCE_PLACES.map((p) => p.source),
  ];

  it('records every reconciliation as a readable ISO date', () => {
    // An unreadable date silently ages as "unknown" and never goes stale,
    // which would hide exactly the rows that need re-checking.
    for (const s of all) expect(s.checked, s.citation).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('never claims a reconciliation that has not happened yet', () => {
    const today = new Date().toISOString().slice(0, 10);
    for (const s of all) expect(s.checked <= today, `${s.citation} checked ${s.checked}`).toBe(true);
  });
});
