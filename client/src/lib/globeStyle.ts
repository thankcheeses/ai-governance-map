import type { StyleSpecification } from 'maplibre-gl';
import { placesGeoJSON } from '@/data/places';
import { LAND_PAPER, familyMatch } from '@/lib/lawPalette';
import { STATE_BINDING_COLOR, STATE_BINDING_EDGE, STATE_NONE_COLOR } from '@/hooks/useStatesLayer';

// Esri World Imagery. Satellite photography cannot be bundled — the tiles stream
// from a host, which is the only map host this application contacts. It is
// therefore declared with `visibility: none` and stays dark until a viewer asks
// for it: on a normal page load no tile is requested and Esri learns nothing.
export const ESRI_IMAGERY =
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

export const SPACE = '#05070f';

// AWS Terrain Tiles (Terrarium encoding) — open elevation data, no key. Like
// the satellite imagery this is a second outside host, so it is declared and
// never used until a viewer asks: terrain is a style property, not a layer,
// and `buildGlobeStyle` deliberately does not set it. With terrain unset
// MapLibre requests not one DEM tile, so a normal load still contacts nothing.
export const TERRAIN_DEM =
  'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png';

export const GLOBE_SKY = {
  'sky-color': '#0B1426',
  'sky-horizon-blend': 0.5,
  'horizon-color': '#2E5A7A',
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
export function buildGlobeStyle(globeData: unknown, statesData?: unknown): StyleSpecification {
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
      // `promoteId` gives every country a stable id (its name) so feature-state
      // can be addressed without first querying the source for generated ids.
      'terrain-dem': {
        type: 'raster-dem',
        tiles: [TERRAIN_DEM],
        tileSize: 256,
        maxzoom: 13,
        encoding: 'terrarium',
        attribution:
          'Elevation: AWS Terrain Tiles (SRTM, GMTED2010, NED, and other public sources)',
      },
      countries: { type: 'geojson', data: globeData as never, promoteId: 'name' },
      places: { type: 'geojson', data: placesGeoJSON() as never },
      states: {
        type: 'geojson',
        data: (statesData ?? { type: 'FeatureCollection', features: [] }) as never,
        promoteId: 'name',
      },
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
      // Land body. Without it every country is a transparent hole and the ocean
      // shader behind the map shows through the continents, so the globe reads
      // as water all the way round. This gives land something to be.
      {
        id: 'land-base',
        type: 'fill',
        source: 'countries',
        paint: {
          'fill-color': LAND_PAPER,
          'fill-opacity': 1,
        },
      },
      // Compliance overlay — colour now says WHICH instrument binds the country.
      {
        id: 'country-fill',
        type: 'fill',
        source: 'countries',
        paint: {
          'fill-color': familyMatch((f) => f.color, '#64748B') as never,
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            // Hover deepens the ink a step; it never changes the hue.
            1,
            familyMatch((f) => f.fillOpacity, 0),
          ] as never,
        },
      },
      // 3D compliance relief — extrusion HEIGHT encodes the same verified status
      // (binding AI law rises highest, researched-no-law a low plateau, unknown flat).
      // No fabricated data: height is a visual encoding of `status`, nothing more.
      {
        id: 'country-extrusion',
        type: 'fill-extrusion',
        source: 'countries',
        filter: ['==', ['get', 'status'], 'binding'],
        paint: {
          'fill-extrusion-color': familyMatch((f) => f.color, LAND_PAPER) as never,
          'fill-extrusion-height': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            ['match', ['get', 'status'], 'binding', 180000, 0],
            ['match', ['get', 'status'], 'binding', 140000, 0],
          ],
          'fill-extrusion-base': 0,
          // Opaque, with the built-in vertical shade for the walls. Translucent
          // extrusions showed pale ghost walls along every coast.
          'fill-extrusion-opacity': 1,
          'fill-extrusion-vertical-gradient': true,
        },
      },
      // US state law, over the grey United States. The country-level finding
      // (no binding national statute) is unchanged underneath; this is the
      // sub-national layer the legend has been pointing at all along.
      //
      // One colour, not six: a state statute and the EU AI Act are not the
      // same kind of instrument, and eleven hues on one sphere cannot be told
      // apart. Which statute it is gets named when you click the state.
      {
        id: 'state-fill',
        type: 'fill',
        source: 'states',
        paint: {
          'fill-color': [
            'match', ['get', 'status'],
            'binding', STATE_BINDING_COLOR,
            STATE_NONE_COLOR,
          ] as never,
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            ['match', ['get', 'status'], 'binding', 1, 0.1],
            ['match', ['get', 'status'], 'binding', 0.92, 0],
          ] as never,
        },
      },
      {
        id: 'state-outline',
        type: 'line',
        source: 'states',
        paint: {
          'line-color': [
            'match', ['get', 'status'],
            'binding', STATE_BINDING_EDGE,
            'rgba(15,23,42,0.22)',
          ] as never,
          'line-width': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            1.6,
            ['match', ['get', 'status'], 'binding', 0.8, 0.4],
          ] as never,
        },
      },
      // Border glow. A wide, soft, low-opacity line under the crisp outline
      // reads as light bleeding off the edge. Only countries with a verified
      // instrument glow, so the bloom marks where law exists rather than
      // decorating every border on earth.
      // Terrain as a printed atlas does it: hillshade, light from the
      // north-west, inked over the paper and the law colours alike rather than a second colour scheme.
      // Off until the reader asks — it is the only layer that reads DEM tiles.
      {
        id: 'terrain-hillshade',
        type: 'hillshade',
        source: 'terrain-dem',
        layout: { visibility: 'none' },
        paint: {
          'hillshade-exaggeration': ['interpolate', ['linear'], ['zoom'], 1, 0.6, 6, 0.6] as never,
          'hillshade-illumination-direction': 315,
          'hillshade-shadow-color': 'rgba(42,36,24,0.55)',
          'hillshade-highlight-color': 'rgba(255,252,244,0.45)',
          'hillshade-accent-color': 'rgba(42,36,24,0.25)',
        },
      },
      {
        id: 'country-glow',
        type: 'line',
        source: 'countries',
        filter: ['==', ['get', 'status'], 'binding'],
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          // A crisp keyline in the instrument's own darker ink — no blur, no
          // neon. Binding countries are marked by a firmer edge, not by bloom.
          'line-color': familyMatch((f) => f.edge, '#0F172A') as never,
          'line-width': ['interpolate', ['linear'], ['zoom'], 1, 1.1, 6, 2.2] as never,
          'line-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 1, 0.85] as never,
        },
      },
      {
        id: 'country-outline',
        type: 'line',
        source: 'countries',
        paint: {
          'line-color': ['case', ['boolean', ['feature-state', 'hover'], false], '#0F172A', 'rgba(15,23,42,0.32)'] as never,
          'line-width': ['case', ['boolean', ['feature-state', 'hover'], false], 1.6, 0.5],
        },
      },
      // The trail: a band of light that sweeps west to east around the globe,
      // brightening each bound country's border as it passes.
      //
      // Two earlier versions were measured and thrown away. `line-gradient`
      // sliding along `line-progress` ran at 4fps against a 61fps baseline —
      // MapLibre rebuilds a gradient ramp texture per feature on every change.
      // An animated `line-dasharray` was no better, because changing it
      // re-uploads the line buckets. Both animate the *style*; the cheap path
      // is to animate *data*. `feature-state` updates a per-feature attribute
      // in place, which is exactly what this map's hover already does at
      // 60fps, so the trail rides the same mechanism. Driven from MapWorkspace.
      {
        id: 'country-trail',
        type: 'line',
        source: 'countries',
        filter: ['==', ['get', 'status'], 'binding'],
        layout: { 'line-cap': 'round', visibility: 'none' },
        paint: {
          'line-color': '#F8FAFC',
          'line-width': [
            'interpolate', ['linear'], ['zoom'],
            1, ['*', 3.0, ['coalesce', ['feature-state', 'trail'], 0]],
            6, ['*', 6.0, ['coalesce', ['feature-state', 'trail'], 0]],
          ] as never,
          'line-blur': 0.8,
          'line-opacity': ['*', 0.8, ['coalesce', ['feature-state', 'trail'], 0]] as never,
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
          'circle-color': '#0F172A',
          'circle-opacity': 0.12,
        },
      },
      {
        id: 'place-dot',
        type: 'circle',
        source: 'places',
        minzoom: 2.6,
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 2.6, 2.6, 6, 5.5],
          'circle-color': '#0F172A',
          'circle-stroke-color': '#F8FAFC',
          'circle-stroke-width': 1.5,
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
          'text-color': '#0F172A',
          'text-halo-color': 'rgba(248,250,252,0.92)',
          'text-halo-width': 1.4,
        },
      },
    ],
  }
}
