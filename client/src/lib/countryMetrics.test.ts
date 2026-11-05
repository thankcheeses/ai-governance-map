import { describe, expect, it } from 'vitest';
import { COUNTRY_AI_LAWS, FRAMEWORKS, OBLIGATIONS } from '@/data/governance';
import {
  METRICS,
  binFor,
  describeMetric,
  metricById,
  metricFillExpression,
  metricProperties,
  metricValue,
} from './countryMetrics';

// Pinned so date-based metrics do not drift as the calendar moves.
const TODAY = new Date(2026, 9, 1); // 1 Oct 2026

describe('country metrics are derived from the register, not invented', () => {
  it('counts the obligations of the country’s binding statute', () => {
    const eu = FRAMEWORKS.find((f) => f.slug === 'eu-ai-act')!;
    const expected = OBLIGATIONS.filter((o) => o.framework === eu.shortCode).length;
    expect(metricValue('obligations', 'France', TODAY)).toBe(expected);
    expect(expected).toBeGreaterThan(0);
  });

  it('keeps the three kinds of country apart on every metric', () => {
    // Researched, no binding law: a real zero / its own category, never null.
    expect(metricValue('obligations', 'Japan', TODAY)).toBe(0);
    expect(metricValue('inForce', 'Japan', TODAY)).toBe(0);
    expect(metricValue('nextDeadline', 'Japan', TODAY)).toBe(-1);
    // Not researched: null on every metric, never zero.
    for (const m of METRICS) expect(metricValue(m.id, 'Atlantis', TODAY)).toBeNull();
    expect(describeMetric('obligations', 'Atlantis', TODAY).display).toBe('Not yet researched');
  });

  it('measures time in force from the earliest obligation that has taken effect', () => {
    // EU prohibited practices applied from 2 Feb 2025: ~20 months before 1 Oct 2026.
    expect(metricValue('inForce', 'Germany', TODAY)).toBe(19);
    // China's registration duty applied from 15 Aug 2023.
    expect(metricValue('inForce', 'China', TODAY)).toBeGreaterThanOrEqual(36);
  });

  it('finds the next deadline that has not taken effect yet', () => {
    // EU: 2 Dec 2026 is the next dated obligation after 1 Oct 2026.
    expect(metricValue('nextDeadline', 'Spain', TODAY)).toBe(62);
    // Korea's tracked duties all took effect in Jan 2026.
    expect(metricValue('nextDeadline', 'South Korea', TODAY)).toBe(-1);
  });

  it('reports the strongest evidence tier on file, and its absence honestly', () => {
    expect(metricValue('evidence', 'Italy', TODAY)).toBe(3); // EU rows cite the Official Journal
    expect(metricValue('evidence', 'Vietnam', TODAY)).toBe(0); // binding, but no citation on file yet
    expect(describeMetric('evidence', 'Vietnam', TODAY).display).toBe('No citation on file yet');
  });
});

describe('bins and paint', () => {
  it('puts every researched country in exactly one bin, and none in a bin for null', () => {
    for (const m of METRICS.filter((x) => x.id !== 'law')) {
      for (const c of COUNTRY_AI_LAWS) expect(binFor(m, metricValue(m.id, c.name, TODAY))).not.toBeNull();
      expect(binFor(m, null)).toBeNull();
      // Bins ascend, so the step expression is valid.
      const mins = m.bins.map((b) => b.min);
      expect([...mins].sort((a, b) => a - b)).toEqual(mins);
    }
  });

  it('builds a step expression that leaves unresearched land the land colour', () => {
    const def = metricById('obligations');
    const expr = metricFillExpression(def, '#LAND') as unknown[];
    expect(expr[0]).toBe('case');
    expect(expr[2]).toBe('#LAND');
    expect((expr[3] as unknown[])[0]).toBe('step');
  });

  it('writes one property per numeric metric onto each feature', () => {
    const props = metricProperties('France', TODAY);
    for (const m of METRICS.filter((x) => x.id !== 'law')) expect(m.property in props).toBe(true);
    expect(Object.values(metricProperties('Atlantis', TODAY)).every((v) => v === null)).toBe(true);
  });
});
