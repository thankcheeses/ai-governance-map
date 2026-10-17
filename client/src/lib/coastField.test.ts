import { describe, expect, it } from 'vitest';
import { COAST_H, COAST_W, buildCoastField } from './coastField';

describe('coastal proximity field', () => {
  it('is power-of-two, which is what lets longitude wrap in the shader', () => {
    // WebGL1 only allows gl.REPEAT on power-of-two textures. Without REPEAT on
    // S, the ocean seams down the antimeridian.
    const pot = (n: number) => (n & (n - 1)) === 0;
    expect(pot(COAST_W)).toBe(true);
    expect(pot(COAST_H)).toBe(true);
    expect(COAST_W).toBe(COAST_H * 2); // equirectangular
  });

  it('returns null instead of throwing where no 2D canvas exists', () => {
    // jsdom has no canvas backend, which is the same situation as a browser
    // that refuses the context. The ocean must fall back to a flat deep tone,
    // not take the globe down with it.
    expect(() => buildCoastField()).not.toThrow();
    expect(buildCoastField()).toBeNull();
  });
});
