import { describe, expect, it } from 'vitest';
import { DEEP_OCEAN_CARD, deepOceanReady } from './DeepOcean';

describe('deep-ocean card', () => {
  it('stays hidden until both written fields exist', () => {
    // A résumé card with the résumé missing is half a thing on a tool whose
    // argument is auditability, so the easter egg does not fire until it is
    // finished — whitespace does not count as finished.
    const base = { ...DEEP_OCEAN_CARD };
    expect(deepOceanReady({ ...base, headline: '', about: '' })).toBe(false);
    expect(deepOceanReady({ ...base, headline: 'Something', about: '' })).toBe(false);
    expect(deepOceanReady({ ...base, headline: '   ', about: 'Text' })).toBe(false);
    expect(deepOceanReady({ ...base, headline: 'Something', about: 'Text' })).toBe(true);
  });
});
