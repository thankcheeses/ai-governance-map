import { describe, expect, it } from 'vitest';
import { buildGlobeStyle } from './globeStyle';

const style = () => buildGlobeStyle({ type: 'FeatureCollection', features: [] });

describe('globe style', () => {
  // The privacy default. MapLibre requests no tiles for an invisible raster
  // layer, so shipping satellite hidden means a normal visit contacts no map
  // host at all. Flip this to visible and every visitor's IP and viewport go to
  // the tile provider on load, whether or not they wanted imagery.
  it('ships satellite imagery hidden, so a normal load fetches no tiles', () => {
    const layer = style().layers.find((l) => l.id === 'satellite');
    expect(layer).toBeDefined();
    expect(layer!.layout?.visibility).toBe('none');
  });

  it('names the tile host and its attribution rather than hiding the dependency', () => {
    const source = style().sources.satellite as { tiles?: string[]; attribution?: string };
    expect(source.tiles?.[0]).toMatch(/^https:\/\/server\.arcgisonline\.com\//);
    expect(source.attribution).toMatch(/Esri/);
  });

  it('keeps every default-visible layer on bundled data, not a network source', () => {
    const s = style();
    const networkSources = new Set(
      Object.entries(s.sources)
        .filter(([, src]) => (src as { type?: string }).type === 'raster')
        .map(([id]) => id),
    );
    const visibleNetworkLayers = s.layers.filter(
      (l) => 'source' in l && networkSources.has(l.source as string) && l.layout?.visibility !== 'none',
    );
    expect(visibleNetworkLayers).toHaveLength(0);
  });

  it('draws the compliance layers the glass globe depends on', () => {
    const ids = style().layers.map((l) => l.id);
    for (const id of ['country-fill', 'country-extrusion', 'country-outline', 'place-dot']) {
      expect(ids).toContain(id);
    }
  });

  it('gives land a body, under the status tint', () => {
    // Without an opaque land fill the ocean shader behind the map canvas shows
    // straight through the continents and the globe reads as water all over.
    const layers = style().layers;
    const land = layers.findIndex((l) => l.id === 'land-base');
    const fill = layers.findIndex((l) => l.id === 'country-fill');
    expect(land).toBeGreaterThanOrEqual(0);
    expect(land).toBeLessThan(fill);
    expect((layers[land].paint as { 'fill-opacity': number })['fill-opacity']).toBeGreaterThan(0.8);
  });

  it('ships the border trail switched off, so motion is opt-in', () => {
    const trail = style().layers.find((l) => l.id === 'country-trail');
    expect(trail).toBeDefined();
    expect(trail!.layout?.visibility).toBe('none');
    // It must be driven by feature-state: animating the style itself was
    // measured at 4fps against a 61fps baseline.
    expect(JSON.stringify(trail!.paint)).toContain('feature-state');
  });

  it('gives the glow and trail only to countries with a verified instrument', () => {
    for (const id of ['country-glow', 'country-trail']) {
      const layer = style().layers.find((l) => l.id === id);
      expect(layer!.filter, id).toEqual(['==', ['get', 'status'], 'binding']);
    }
  });

  it('gives every country a stable id so feature-state can address it', () => {
    const src = style().sources.countries as { promoteId?: string };
    expect(src.promoteId).toBe('name');
  });

  it('colours countries by which instrument binds them', () => {
    const fill = style().layers.find((l) => l.id === 'country-fill');
    const expr = JSON.stringify((fill!.paint as { 'fill-color': unknown })['fill-color']);
    expect(expr).toContain('lawFamily');
    for (const id of ['eu', 'korea', 'china', 'india', 'vietnam']) expect(expr).toContain(id);
  });
});
