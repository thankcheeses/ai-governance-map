import { useMemo } from 'react';
import { feature } from 'topojson-client';
import type { FeatureCollection, Geometry } from 'geojson';
import worldTopo from 'world-atlas/countries-110m.json';
import { COUNTRY_AI_LAWS } from '@/data/governance';
import { type LawFamily, lawFamilyById, resolveLawFamily } from '@/lib/lawPalette';

export interface CountryProperties {
  name: string;
  status: 'binding' | 'none' | 'unknown';
  frameworkSlug?: string;
  /** Which instrument binds this country — the globe's colour channel. */
  lawFamily: LawFamily;
  fillColor: string;
}

/**
 * Rings that cross the date line jump from +180 to -180 between two vertices.
 * MapLibre draws that jump as an edge all the way round the planet, which put
 * a band across the Arctic (Russia) and a line across the South Atlantic
 * (Fiji). Unwrapping each ring so consecutive points never differ by more
 * than 180 degrees of longitude keeps every polygon in one piece.
 */
export function unwrapAntimeridian(geometry: Geometry): Geometry {
  const ring = (pts: number[][]) => {
    let shift = 0;
    return pts.map((pt, i) => {
      if (i > 0) {
        const d = pt[0] - pts[i - 1][0];
        if (d > 180) shift -= 360;
        else if (d < -180) shift += 360;
      }
      return [pt[0] + shift, pt[1]];
    });
  };
  if (geometry.type === 'Polygon') {
    return { ...geometry, coordinates: geometry.coordinates.map((r) => ring(r as number[][])) };
  }
  if (geometry.type === 'MultiPolygon') {
    return { ...geometry, coordinates: geometry.coordinates.map((poly) => poly.map((r) => ring(r as number[][]))) };
  }
  return geometry;
}

/**
 * Convert the bundled world-atlas topojson into a GeoJSON FeatureCollection of
 * country polygons, attaching AI-law compliance status to each feature.
 *
 * Everything happens in-browser from a bundled asset — no network requests,
 * preserving the app's "no data leaves your browser" guarantee.
 */
export function useGlobeData(): FeatureCollection<Geometry, CountryProperties> {
  return useMemo(() => {
    // topojson `objects.countries` -> GeoJSON FeatureCollection
    const collection = feature(
      worldTopo as never,
      (worldTopo as never as { objects: { countries: never } }).objects.countries,
    ) as unknown as FeatureCollection<Geometry, { name: string }>;

    const features = collection.features.map((f) => {
      const name = f.properties?.name ?? '';
      const law = COUNTRY_AI_LAWS.find((c) => c.name === name);

      // France's polygon in Natural Earth includes French Guiana (a sizeable
      // landmass on the north coast of South America). It's legally part of
      // France/the EU, but on a compliance globe a teal "France" blob sitting on
      // top of Brazil reads as an error. Highlight metropolitan France only by
      // dropping the trans-Atlantic (Americas) polygons from the France feature.
      let geometry = f.geometry;
      if (name === 'France' && geometry?.type === 'MultiPolygon') {
        const polys = (geometry.coordinates as number[][][][]).filter((poly) => {
          const lng = poly?.[0]?.[0]?.[0];
          return typeof lng !== 'number' || lng > -20; // keep European polygons only
        });
        geometry = { ...geometry, coordinates: polys } as Geometry;
      }

      geometry = unwrapAntimeridian(geometry);

      let status: CountryProperties['status'] = 'unknown';
      if (law?.status === 'binding') status = 'binding';
      else if (law?.status === 'none') status = 'none';

      // Colour now says WHICH instrument binds the country, not merely that one
      // does. `status` is untouched: extrusion height, the country panel and
      // every existing test still read it.
      const lawFamily = resolveLawFamily(status, law?.frameworkSlug);

      return {
        ...f,
        geometry,
        properties: {
          name,
          status,
          frameworkSlug: law?.frameworkSlug,
          lawFamily,
          fillColor: lawFamilyById(lawFamily).color,
        },
      };
    });

    return { type: 'FeatureCollection', features } as FeatureCollection<Geometry, CountryProperties>;
  }, []);
}
