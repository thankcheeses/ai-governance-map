import type { StyleSpecification } from 'maplibre-gl';
import { placesGeoJSON } from '@/data/places';
import { LAND_PAPER, familyMatch } from '@/lib/lawPalette';
import { HAIRLINE, OCEAN } from '@/lib/mapInk';
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

// The atmosphere is what makes a sphere read as a planet rather than a disc: a
// thin band of light at the limb, strongest when the whole globe is in view
// and gone by the time the reader is looking at one country.
export const GLOBE_SKY = {
  'sky-color': '#060B16',
  'sky-horizon-blend': 0.6,
  'horizon-color': '#4F9BD9',
  'horizon-fog-blend': 0.8,
  'fog-color': '#0A1A33',
  'fog-ground-blend': 0.15,
  'atmosphere-blend': ['interpolate', ['linear'], ['zoom'], 0, 1, 4, 0.75, 6.5, 0.15],
} as const;

/**
 * Meridians and parallels every 30°, as bundled geometry. Faint, but they are
 * what tells the eye the surface curves: without them a single-colour sea is a
 * flat disc. Each line is sampled every 5° so it bends with the globe.
 */
function graticule() {
  const features: unknown[] = [];
  const line = (coordinates: number[][]) =>
    features.push({ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates } });
  for (let lon = -180; lon < 180; lon += 30) {
    const c: number[][] = [];
    for (let lat = -80; lat <= 80; lat += 5) c.push([lon, lat]);
    line(c);
  }
  for (let lat = -60; lat <= 60; lat += 30) {
    const c: number[][] = [];
    for (let lon = -180; lon <= 180; lon += 5) c.push([lon, lat]);
    line(c);
  }
  return { type: 'FeatureCollection', features };
}

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
      graticule: { type: 'geojson', data: graticule() as never },
      countries: { type: 'geojson', data: globeData as never, promoteId: 'name' },
      places: { type: 'geojson', data: placesGeoJSON() as never },
      states: {
        type: 'geojson',
        data: (statesData ?? { type: 'FeatureCollection', features: [] }) as never,
        promoteId: 'name',
      },
    },
    layers: [
      // The sea: one deep tone over the whole sphere. The animated glass ocean
      // is still available from Layers; this is what the globe is by default,
      // because a still sea lets the countries be the subject.
      { id: 'ocean-base', type: 'background', paint: { 'background-color': OCEAN } },
      {
        id: 'graticule',
        type: 'line',
        source: 'graticule',
        paint: { 'line-color': 'rgba(130,170,220,0.2)', 'line-width': 0.7 },
      },
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
            // Low enough to read as relief rather than slabs. At 140 km the
            // walls of countries near the limb swept across the sphere as it
            // turned, so each one appeared to drag a shadow behind it.
            ['match', ['get', 'status'], 'binding', 60000, 0],
            ['match', ['get', 'status'], 'binding', 40000, 0],
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
            HAIRLINE,
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
          'hillshade-shadow-color': 'rgba(2,6,14,0.6)',
          'hillshade-highlight-color': 'rgba(190,215,245,0.35)',
          'hillshade-accent-color': 'rgba(2,6,14,0.3)',
        },
      },
      // Light bleeding off the border of a country that has a binding law, in
      // that law's own colour. Wide, blurred and faint: it lifts the lit
      // countries off the dark land without drawing a second outline.
      {
        id: 'country-halo',
        type: 'line',
        source: 'countries',
        filter: ['==', ['get', 'status'], 'binding'],
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': familyMatch((f) => f.color, '#64748B') as never,
          'line-width': ['interpolate', ['linear'], ['zoom'], 1, 5, 6, 12] as never,
          'line-blur': ['interpolate', ['linear'], ['zoom'], 1, 5, 6, 10] as never,
          'line-opacity': 0.4,
        },
      },
      {
        id: 'country-glow',
        type: 'line',
        source: 'countries',
        filter: ['==', ['get', 'status'], 'binding'],
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          // A crisp keyline in the instrument's own lighter ink.
          'line-color': familyMatch((f) => f.edge, HAIRLINE) as never,
          'line-width': ['interpolate', ['linear'], ['zoom'], 1, 0.9, 6, 1.8] as never,
          'line-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 1, 0.85] as never,
        },
      },
      {
        id: 'country-outline',
        type: 'line',
        source: 'countries',
        paint: {
          'line-color': ['case', ['boolean', ['feature-state', 'hover'], false], '#F8FAFC', HAIRLINE] as never,
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
          'circle-color': '#F8FAFC',
          'circle-opacity': 0.16,
        },
      },
      {
        id: 'place-dot',
        type: 'circle',
        source: 'places',
        minzoom: 2.6,
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 2.6, 2.6, 6, 5.5],
          'circle-color': '#F8FAFC',
          'circle-stroke-color': OCEAN,
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
          'text-color': '#F1F5F9',
          'text-halo-color': 'rgba(11,25,48,0.9)',
          'text-halo-width': 1.4,
        },
      },
    ],
  }
}
