import type { StyleSpecification } from 'maplibre-gl';
import { placesGeoJSON } from '@/data/places';

// Esri World Imagery. Satellite photography cannot be bundled — the tiles stream
// from a host, which is the only map host this application contacts. It is
// therefore declared with `visibility: none` and stays dark until a viewer asks
// for it: on a normal page load no tile is requested and Esri learns nothing.
export const ESRI_IMAGERY =
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

export const SPACE = '#05070f';

export const GLOBE_SKY = {
  'sky-color': '#0a1a3a',
  'sky-horizon-blend': 0.5,
  'horizon-color': '#4a7fb5',
  'horizon-fog-blend': 0.7,
  'fog-color': '#0a1a3a',
  'fog-ground-blend': 0.2,
  'atmosphere-blend': ['interpolate', ['linear'], ['zoom'], 0, 0.9, 6, 0.2],
} as const;

/**
 * The one definition of how the governance globe looks.
 *
 * The default is the glass globe: country shapes, borders, compliance relief and
 * the starfield all render from bundled data, so a normal load contacts no map
 * host. Satellite imagery exists as an opt-in layer, off until asked for. Both the register's globe
 * section and the full-screen map workspace build their map from this, so the two
 * can never drift into showing the same data two different ways.
 */
export function buildGlobeStyle(globeData: unknown): StyleSpecification {
return {
    version: 8,
    sources: {
      satellite: {
        type: 'raster',
        tiles: [ESRI_IMAGERY],
        tileSize: 256,
        maxzoom: 19,
        attribution: 'Imagery © Esri, Maxar, Earthstar Geographics, NASA, NOAA, USGS',
      },
      countries: { type: 'geojson', data: globeData as never, generateId: true },
      places: { type: 'geojson', data: placesGeoJSON() as never },
    },
    layers: [
      // Hidden on load. MapLibre fetches no tiles for an invisible raster layer,
      // so the opt-in is real rather than cosmetic.
      {
        id: 'satellite',
        type: 'raster',
        source: 'satellite',
        layout: { visibility: 'none' },
        paint: { 'raster-opacity': 1 },
      },
      // Compliance overlay — tints binding/none countries, leaves "unknown" terrain bare.
      {
        id: 'country-fill',
        type: 'fill',
        source: 'countries',
        paint: {
          'fill-color': [
            'match',
            ['get', 'status'],
            'binding', '#2dd4bf',
            'none', '#cbd5e1',
            'rgba(0,0,0,0)',
          ],
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            0.6,
            ['match', ['get', 'status'], 'binding', 0.42, 'none', 0.2, 0],
          ],
        },
      },
      // 3D compliance relief — extrusion HEIGHT encodes the same verified status
      // (binding AI law rises highest, researched-no-law a low plateau, unknown flat).
      // No fabricated data: height is a visual encoding of `status`, nothing more.
      {
        id: 'country-extrusion',
        type: 'fill-extrusion',
        source: 'countries',
        filter: ['!=', ['get', 'status'], 'unknown'],
        paint: {
          'fill-extrusion-color': [
            'match',
            ['get', 'status'],
            'binding', '#2dd4bf',
            'none', '#94a3b8',
            '#94a3b8',
          ],
          'fill-extrusion-height': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            ['match', ['get', 'status'], 'binding', 340000, 'none', 150000, 0],
            ['match', ['get', 'status'], 'binding', 230000, 'none', 80000, 0],
          ],
          'fill-extrusion-base': 0,
          'fill-extrusion-opacity': 0.82,
        },
      },
      {
        id: 'country-outline',
        type: 'line',
        source: 'countries',
        paint: {
          'line-color': [
            'match',
            ['get', 'status'],
            'binding', '#5eead4',
            'none', '#e2e8f0',
            'rgba(255,255,255,0.25)',
          ],
          'line-width': ['case', ['boolean', ['feature-state', 'hover'], false], 1.8, 0.7],
        },
      },
      // Institution pins. Zoom-gated so the globe stays quiet until someone
      // actually goes looking: nothing shows at world view.
      {
        id: 'place-halo',
        type: 'circle',
        source: 'places',
        minzoom: 2.6,
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 2.6, 5, 6, 13],
          'circle-color': '#5eead4',
          'circle-opacity': 0.14,
        },
      },
      {
        id: 'place-dot',
        type: 'circle',
        source: 'places',
        minzoom: 2.6,
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 2.6, 2.6, 6, 5.5],
          'circle-color': '#5eead4',
          'circle-stroke-color': '#04231f',
          'circle-stroke-width': 1,
        },
      },
      {
        id: 'place-label',
        type: 'symbol',
        source: 'places',
        minzoom: 3.4,
        layout: {
          'text-field': ['get', 'name'],
          'text-size': 11,
          'text-offset': [0, 1.1],
          'text-anchor': 'top',
          'text-allow-overlap': false,
        },
        paint: {
          'text-color': '#d7f5ef',
          'text-halo-color': '#04231f',
          'text-halo-width': 1.4,
        },
      },
    ],
  }
}
