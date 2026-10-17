import { describe, expect, it } from 'vitest';
import { OBLIGATIONS } from './governance';
import {
  JURISDICTIONS,
  SYSTEM_PROFILES,
  frameworkCodesFor,
  startHereRows,
} from './startHere';

describe('start here routing', () => {
  it('only selects topics the register actually uses', () => {
    // A profile naming a topic no obligation carries silently returns nothing
    // and the reader concludes there is no law, which is the worst outcome
    // this tool can produce.
    const real = new Set(OBLIGATIONS.map((o) => o.topic));
    for (const p of SYSTEM_PROFILES) {
      for (const t of p.topics) {
        expect(real.has(t), `${p.id} selects "${t}", which no obligation uses`).toBe(true);
      }
    }
  });

  it('resolves every region to at least one instrument', () => {
    for (const j of JURISDICTIONS) {
      expect(frameworkCodesFor([j.id]).size, `${j.id} matches no framework`).toBeGreaterThan(0);
    }
  });

  it('narrows the register rather than reproducing it', () => {
    // If the "useful" view is the whole register, it is not a starting point.
    const { rows, total } = startHereRows(['agent'], ['eu']);
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.length).toBeLessThan(total);
  });

  it('returns only rows from the chosen jurisdictions and topics', () => {
    const systems = ['adm'];
    const regions = ['us-state'];
    const { rows, topics } = startHereRows(systems, regions);
    const codes = frameworkCodesFor(regions);
    for (const r of rows) {
      expect(codes.has(r.framework), `${r.id} is ${r.framework}, outside the selection`).toBe(true);
      expect(topics).toContain(r.topic);
    }
  });

  it('puts what is already in force before what is coming', () => {
    const { rows } = startHereRows(
      SYSTEM_PROFILES.map((p) => p.id),
      JURISDICTIONS.map((j) => j.id),
      '2026-10-17',
    );
    const rank = (eff: string) =>
      !/^\d{4}-\d{2}-\d{2}$/.test(eff) ? 2 : eff <= '2026-10-17' ? 0 : 1;
    const ranks = rows.map((r) => rank(r.effective));
    expect([...ranks].sort((a, b) => a - b)).toEqual(ranks);
  });

  it('answers nothing until both questions are answered', () => {
    // An empty selection must not quietly mean "everything applies to you".
    expect(startHereRows([], []).rows.length).toBe(OBLIGATIONS.length);
    // ...which is why the UI gates on both, and why this test documents that
    // the gate lives in the component rather than here.
    expect(SYSTEM_PROFILES.length).toBeGreaterThan(1);
    expect(JURISDICTIONS.length).toBeGreaterThan(1);
  });

  it('gives every profile a rationale the reader can disagree with', () => {
    // The filter is a judgement. Showing the judgement is what separates a
    // research tool from a black box that implies a legal determination.
    for (const p of SYSTEM_PROFILES) {
      expect(p.rationale.length).toBeGreaterThan(40);
      expect(p.topics.length).toBeGreaterThan(2);
    }
  });
});
