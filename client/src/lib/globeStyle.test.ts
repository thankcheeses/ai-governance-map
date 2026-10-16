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
});
