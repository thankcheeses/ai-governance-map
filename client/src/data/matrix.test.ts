import { describe, expect, it } from 'vitest';
import {
  CONTROLS,
  FRAMEWORKS,
  HEATMAP_CELLS,
  NHID_CONFORMANCE_CONTROLS,
  NHID_LAYERS,
  OBLIGATIONS,
  RISK_DOMAINS,
  RISK_USE_CASES,
  TIMELINE_EVENTS,
  sourceCoverage,
} from './governance';
import { DOMAIN_CONTROLS, MATRICES, buildMatrix, getMatrix, obligationStatus } from './matrix';

const EMPTY = {};

/** Every control referenced by the residual model must exist in the register. */
describe('risk domain to control mapping', () => {
  it('covers every risk domain', () => {
    for (const domain of RISK_USE_CASES.length ? RISK_DOMAINS : RISK_DOMAINS) {
      expect(DOMAIN_CONTROLS[domain]?.length ?? 0).toBeGreaterThan(0);
    }
  });

  it('references only real control codes', () => {
    const codes = new Set(CONTROLS.map((c) => c.code));
    for (const mapped of Object.values(DOMAIN_CONTROLS)) {
      for (const code of mapped) expect(codes.has(code)).toBe(true);
    }
  });
});

describe('scenario classification', () => {
  it('classifies all 25 scenarios onto both axes', () => {
    expect(HEATMAP_CELLS).toHaveLength(25);
    for (const cell of HEATMAP_CELLS) {
      expect(RISK_USE_CASES).toContain(cell.useCase);
      expect(RISK_DOMAINS).toContain(cell.riskDomain);
    }
  });

  it('loses no scenario when re-plotted onto the risk matrix', () => {
    const cells = buildMatrix('risk', 'inherent', EMPTY);
    const plotted = cells.reduce((a, c) => a + c.count, 0);
    expect(plotted).toBe(HEATMAP_CELLS.length);
  });
});

describe('missing-data states', () => {
  it('marks intersections with no scenario as no-data, never as low risk', () => {
    const cells = buildMatrix('risk', 'inherent', EMPTY);
    const empties = cells.filter((c) => c.count === 0);
    expect(empties.length).toBeGreaterThan(0);
    for (const cell of empties) {
      expect(cell.state).toBe('no-data');
      expect(cell.band).toBeUndefined();
    }
  });

  it('reports residual as not assessed while no mitigating control is scored', () => {
    const cells = buildMatrix('risk', 'residual', EMPTY).filter((c) => c.count > 0);
    expect(cells.length).toBeGreaterThan(0);
    for (const cell of cells) {
      expect(cell.state).toBe('unassessed');
      expect(cell.display).toBe('Not assessed');
      expect(cell.band).toBeUndefined();
    }
  });

  it('never lets residual exceed inherent, and never drops below Low', () => {
    const maxed = Object.fromEntries(CONTROLS.map((c) => [c.id, { maturity: 5 }]));
    const inherent = buildMatrix('risk', 'inherent', EMPTY);
    const residual = buildMatrix('risk', 'residual', maxed);
    for (const cell of residual.filter((c) => c.count > 0)) {
      const base = inherent.find((c) => c.row === cell.row && c.col === cell.col);
      expect(cell.state).toBe('assessed');
      expect(cell.band).toBeDefined();
      // Full maturity drops two bands at most, and Low is the floor.
      expect(['cool', 'mild', 'warm', 'hot']).toContain(cell.band!);
      expect(['cool', 'mild', 'warm', 'hot'].indexOf(cell.band!)).toBeLessThanOrEqual(
        ['cool', 'mild', 'warm', 'hot'].indexOf(base!.band!)
      );
    }
  });

  it('distinguishes not-applicable from no-data on the jurisdiction matrix', () => {
    const cells = buildMatrix('exec', 'count', EMPTY);
    const states = new Set(cells.map((c) => c.state));
    expect(states.has('not-applicable')).toBe(true);
    expect(states.has('no-data')).toBe(true);
    // A voluntary-only jurisdiction has no legal clock, so its dated columns are n/a.
    const na = cells.filter((c) => c.state === 'not-applicable');
    for (const cell of na) expect(cell.col).not.toBe('Ongoing (voluntary)');
  });
});

describe('metric switching', () => {
  it('gives every matrix at least two metrics, each with its own legend', () => {
    for (const matrix of MATRICES) {
      expect(matrix.metrics.length).toBeGreaterThanOrEqual(2);
      for (const metric of matrix.metrics) {
        expect(metric.legend.length).toBeGreaterThan(0);
        expect(metric.titleSuffix).toBeTruthy();
        expect(metric.note).toBeTruthy();
      }
    }
  });

  it('keeps count metrics off the severity ramp', () => {
    expect(getMatrix('exec').metrics.find((m) => m.id === 'count')?.scale).toBe('neutral');
    expect(getMatrix('grc').metrics.find((m) => m.id === 'mapped')?.scale).toBe('neutral');
    expect(getMatrix('risk').metrics.every((m) => m.scale === 'severity')).toBe(true);
  });

  it('produces different cell values for different metrics of the same matrix', () => {
    const count = buildMatrix('exec', 'count', EMPTY);
    const clock = buildMatrix('exec', 'clock', EMPTY);
    expect(count.map((c) => c.display).join()).not.toBe(clock.map((c) => c.display).join());
  });

  it('reflects the viewer’s own scores in GRC assessment coverage', () => {
    const none = buildMatrix('grc', 'scored', EMPTY).filter((c) => c.count > 0);
    expect(none.every((c) => c.state === 'unassessed')).toBe(true);
    const all = Object.fromEntries(CONTROLS.map((c) => [c.id, { maturity: 3 }]));
    const scored = buildMatrix('grc', 'scored', all).filter((c) => c.count > 0);
    expect(scored.every((c) => c.state === 'assessed')).toBe(true);
  });
});

describe('obligation status', () => {
  it('treats undated obligations as ongoing, not as in force', () => {
    const ongoing = OBLIGATIONS.filter((o) => o.effective === 'Ongoing');
    expect(ongoing.length).toBeGreaterThan(0);
    for (const obl of ongoing) expect(obligationStatus(obl)).toBe('Ongoing (voluntary)');
  });

  it('places the Article 50 disclosure duty in force', () => {
    const art50 = OBLIGATIONS.find((o) => o.id === 'obl1');
    expect(art50?.effective).toBe('2026-08-02');
    expect(obligationStatus(art50!)).toBe('In force');
  });

  it('keeps the 2 December 2026 marking grace separate from Article 50 generally', () => {
    const marking = OBLIGATIONS.find((o) => o.id === 'obl-art50-mark');
    expect(marking?.effective).toBe('2026-12-02');
    // The grace must not be generalised: the general duty is already in force.
    expect(obligationStatus(marking!)).toBe('Applies later');
    expect(marking?.summary).toMatch(/already on the market before that date/i);
  });

  it('keeps the Annex III deferral at 2 December 2027', () => {
    for (const id of ['obl2', 'obl3', 'obl4', 'obl5', 'obl6']) {
      expect(OBLIGATIONS.find((o) => o.id === id)?.effective).toBe('2027-12-02');
    }
  });
});

describe('provenance', () => {
  it('reports coverage honestly rather than counting unsourced rows as sourced', () => {
    const coverage = sourceCoverage([...OBLIGATIONS, ...TIMELINE_EVENTS]);
    expect(coverage.total).toBe(OBLIGATIONS.length + TIMELINE_EVENTS.length);
    expect(coverage.sourced + coverage.unsourced).toBe(coverage.total);
    expect(coverage.unsourced).toBeGreaterThan(0);
  });
});

describe('NHID-Clinical scope and status', () => {
  it('is carried as a voluntary proposal, never as law or certification', () => {
    const nhid = FRAMEWORKS.find((f) => f.shortCode === 'NHID');
    expect(nhid?.type).toMatch(/voluntary/i);
    expect(nhid?.summary).toMatch(/not law/i);
    expect(nhid?.summary).toMatch(/not a certification/i);
    expect(nhid?.summary).toMatch(/not an official standard/i);
  });

  // The citable artifact is the v1.3 public-comment spec. Labelling the baseline
  // "v2.0" claimed a released version the site does not publish and the map's own
  // status note contradicts, so the version label is pinned to what is citable.
  it('labels the baseline at the version that is actually citable', () => {
    const nhid = FRAMEWORKS.find((f) => f.shortCode === 'NHID');
    expect(nhid?.name).toBe('NHID-Clinical v1.3');
    expect(nhid?.version).toMatch(/v1\.3/);
    expect(nhid?.version).toMatch(/NIST-2025-0035-0026/);
    expect(nhid?.name).not.toMatch(/v2\.0/);
    expect(NHID_LAYERS.find((l) => l.layer === 2)?.title).toMatch(/v1\.3/);
  });

  it('carries no NHID-Clinical v2.0 label anywhere in the register', () => {
    const surfaces = [
      ...FRAMEWORKS.map((f) => `${f.name} ${f.version} ${f.summary}`),
      ...OBLIGATIONS.filter((o) => o.framework === 'NHID').map((o) => `${o.title} ${o.summary}`),
      ...NHID_LAYERS.map((l) => `${l.title} ${l.scope}`),
    ];
    for (const text of surfaces) {
      expect(text).not.toMatch(/NHID-Clinical v2\.0/i);
    }
  });

  it('states the B2B administrative scope and its exclusions', () => {
    const nhid = FRAMEWORKS.find((f) => f.shortCode === 'NHID');
    expect(nhid?.summary).toMatch(/payer–provider administrative/i);
    expect(nhid?.summary).toMatch(/patient-facing calls and clinical decision support are expressly out of scope/i);
  });

  it('never classifies an NHID obligation as mandatory', () => {
    const nhidObligations = OBLIGATIONS.filter((o) => o.framework === 'NHID');
    expect(nhidObligations.length).toBeGreaterThanOrEqual(5);
    for (const obl of nhidObligations) {
      expect(obl.type).toBe('recommended');
      expect(obligationStatus(obl)).toBe('Ongoing (voluntary)');
    }
  });

  it('keeps delegated authorization outside the five-control baseline', () => {
    const baseline = ['obl-nhid-idg', 'obl-nhid-pdx', 'obl-nhid-dbc', 'obl-nhid-eit', 'obl-nhid-atr'];
    for (const id of baseline) {
      expect(OBLIGATIONS.find((o) => o.id === id)?.framework).toBe('NHID');
    }
    // NHID-Auth v2 is an optional layer, not one of the five, and says so.
    const delegated = OBLIGATIONS.find((o) => o.id === 'obl17');
    expect(baseline).not.toContain('obl17');
    expect(delegated?.type).toBe('recommended');
    expect(delegated?.summary).toMatch(/^Optional/i);
  });

  it('separates the audit trail from the behavioural gates', () => {
    const byCode = Object.fromEntries(NHID_CONFORMANCE_CONTROLS.map((c) => [c.code, c]));
    expect(Object.keys(byCode).sort()).toEqual(['ATR-01', 'DBC-01', 'EIT-01', 'IDG-01', 'PDX-01']);
    expect(byCode['ATR-01'].kind).toBe('evidence');
    for (const code of ['IDG-01', 'PDX-01', 'DBC-01', 'EIT-01']) {
      expect(byCode[code].kind).toBe('behavioral gate');
    }
  });

  it('does not claim deployed-at-scale evidence', () => {
    for (const control of NHID_CONFORMANCE_CONTROLS) {
      expect(control.evidence).toBe('Prototype / Simulation only');
    }
  });
});
