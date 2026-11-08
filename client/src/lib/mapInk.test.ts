import { describe, expect, it } from 'vitest';
import { STATE_BINDING_COLOR } from '@/hooks/useStatesLayer';
import { METRICS } from './countryMetrics';
import { BINDING_FAMILIES, lawFamilyById } from './lawPalette';
import { INK, PAPER, RAMP_COOL, RAMP_WARM } from './mapInk';

// The map's layers are one system only if they draw from one ink set. These
// tests fail the moment a layer picks a colour of its own.
describe('one ink set for every layer', () => {
  it('colours every instrument, national or state, from INK', () => {
    const inks = new Set(Object.values(INK).map((i) => i.color));
    for (const f of BINDING_FAMILIES) expect(inks.has(f.color), f.id).toBe(true);
    expect(STATE_BINDING_COLOR).toBe(INK.state.color);
  });

  it('builds the metric ramps from paper to an ink already on the map', () => {
    expect(RAMP_COOL[0]).toBe(PAPER);
    expect(RAMP_WARM[0]).toBe(PAPER);
    expect(RAMP_COOL[RAMP_COOL.length - 1]).toBe(INK.eu.color);
    expect(RAMP_WARM[RAMP_WARM.length - 1]).toBe(INK.china.color);
  });

  it('paints "checked, nothing" the same paper on every metric and on the law map', () => {
    expect(lawFamilyById('no-national-law').color).toBe(PAPER);
    const allowed = new Set<string>([...RAMP_COOL, ...RAMP_WARM]);
    for (const m of METRICS.filter((x) => x.id !== 'law')) {
      expect(m.bins[0].color, m.id).toBe(PAPER);
      for (const b of m.bins) expect(allowed.has(b.color), `${m.id}: ${b.label}`).toBe(true);
    }
  });
});
