import { describe, expect, it } from 'vitest';
import { FRAMEWORKS } from './governance';
import { GOVERNANCE_PLACES, PLOTTABLE_PLACES, placesGeoJSON } from './places';

describe('governance places', () => {
  it('never pins a place without a verified coordinate', () => {
    const plotted = new Set(placesGeoJSON().features.map((f) => f.properties.id));
    for (const place of GOVERNANCE_PLACES) {
      const located = typeof place.lat === 'number' && typeof place.lon === 'number';
      expect(plotted.has(place.id)).toBe(located);
    }
    // The catalogue must actually contain an unpinned entry, otherwise this
    // rule is untested in practice.
    expect(GOVERNANCE_PLACES.length).toBeGreaterThan(PLOTTABLE_PLACES.length);
  });

  it('cites a source for every coordinate it does plot', () => {
    for (const place of PLOTTABLE_PLACES) {
      expect(place.coordSource).toBeDefined();
      expect(place.coordSource!.url).toMatch(/^https:\/\//);
      expect(place.coordSource!.checked).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('keeps coordinates inside valid decimal-degree ranges', () => {
    for (const place of PLOTTABLE_PLACES) {
      expect(place.lat).toBeGreaterThanOrEqual(-90);
      expect(place.lat).toBeLessThanOrEqual(90);
      expect(place.lon).toBeGreaterThanOrEqual(-180);
      expect(place.lon).toBeLessThanOrEqual(180);
    }
  });

  it('gives every place a source and a stated relation to the register', () => {
    for (const place of GOVERNANCE_PLACES) {
      expect(place.source.url).toMatch(/^https:\/\//);
      expect(place.relation.length).toBeGreaterThan(40);
      expect(place.role.length).toBeGreaterThan(20);
    }
  });

  it('references only frameworks that exist in the register', () => {
    const slugs = new Set(FRAMEWORKS.map((f) => f.slug));
    for (const place of GOVERNANCE_PLACES) {
      expect(place.frameworkSlugs.length).toBeGreaterThan(0);
      for (const slug of place.frameworkSlugs) expect(slugs.has(slug)).toBe(true);
    }
  });

  it('describes the NIST docket as a filing, never as endorsement or approval', () => {
    const nist = GOVERNANCE_PLACES.find((p) => p.id === 'nist-gaithersburg');
    expect(nist?.relation).toMatch(/NIST-2025-0035-0026/);
    expect(nist?.relation).toMatch(/not an endorsement, approval/i);
    expect(nist?.relation).not.toMatch(/\bapproved by\b|\bcertified\b|\bendorses\b/i);
  });

  it('keeps every place off the globe until the viewer zooms in', () => {
    for (const place of GOVERNANCE_PLACES) expect(place.minZoom).toBeGreaterThan(2);
  });

  it('has unique ids', () => {
    const ids = GOVERNANCE_PLACES.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
