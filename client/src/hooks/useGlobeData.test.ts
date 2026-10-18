import { describe, expect, it } from 'vitest';
import type { Polygon } from 'geojson';
import { unwrapAntimeridian } from './useGlobeData';

describe('date-line rings', () => {
  it('never lets two consecutive vertices jump across the planet', () => {
    // Fiji-like ring straddling 180°: drawn raw, MapLibre joins 179.9 to
    // -179.9 the long way round and paints a band across the globe.
    const raw: Polygon = {
      type: 'Polygon',
      coordinates: [[[179.5, -16], [-179.8, -16.2], [-179.9, -17], [179.4, -17.1], [179.5, -16]]],
    };
    const ring = (unwrapAntimeridian(raw) as Polygon).coordinates[0];
    for (let i = 1; i < ring.length; i++) {
      expect(Math.abs(ring[i][0] - ring[i - 1][0])).toBeLessThanOrEqual(180);
    }
  });

  it('leaves ordinary rings untouched', () => {
    const raw: Polygon = { type: 'Polygon', coordinates: [[[10, 50], [12, 50], [12, 52], [10, 50]]] };
    expect(unwrapAntimeridian(raw)).toEqual(raw);
  });
});
