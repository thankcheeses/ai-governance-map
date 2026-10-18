import { describe, expect, it } from 'vitest';
import { STATE_AI_LAWS } from './governance';
import { FEDERAL_BINDING, jurisdictionNamesState, stateHasBindingLaw, stateProfile } from './stateLaw';

describe('per-state law', () => {
  it('matches whole state names only', () => {
    expect(jurisdictionNamesState('Arkansas, USA', 'Kansas')).toBe(false);
    expect(jurisdictionNamesState('West Virginia, USA', 'Virginia')).toBe(false);
    expect(jurisdictionNamesState('Virginia, USA', 'Virginia')).toBe(true);
    expect(jurisdictionNamesState('New York City, USA', 'New York')).toBe(true);
    expect(jurisdictionNamesState('US (Tennessee)', 'Tennessee')).toBe(true);
  });

  it('gives California both of its statutes, not just one', () => {
    const codes = stateProfile('California')!.instruments.map((f) => f.shortCode);
    expect(codes).toEqual(expect.arrayContaining(['CA', 'TFAIA']));
  });

  it('keeps the map colour in step with the register', () => {
    // The globe colours a state from STATE_AI_LAWS; the panel lists what the
    // framework register holds. If those disagree, the map and the click say
    // different things about the same state.
    for (const s of STATE_AI_LAWS) {
      expect(s.status === 'binding', `${s.name}`).toBe(stateHasBindingLaw(s.name));
    }
  });

  it('every state carries obligations from its own instruments only', () => {
    for (const s of STATE_AI_LAWS) {
      const p = stateProfile(s.name)!;
      const codes = new Set(p.instruments.map((f) => f.shortCode));
      for (const o of p.obligations) expect(codes.has(o.framework)).toBe(true);
    }
  });

  it('lists only binding US-wide instruments as applying everywhere', () => {
    expect(FEDERAL_BINDING.length).toBeGreaterThan(0);
    for (const f of FEDERAL_BINDING) {
      expect(f.jurisdiction).toBe('US');
      expect(f.type).toMatch(/\(Binding\)/);
    }
  });

  it('says nothing about a state the register has not recorded', () => {
    expect(stateProfile('Atlantis')).toBeUndefined();
    expect(stateProfile('Ohio')!.instruments).toEqual([]);
  });
});
