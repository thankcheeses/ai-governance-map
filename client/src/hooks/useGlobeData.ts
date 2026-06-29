import { useMemo } from 'react';
import { feature } from 'topojson-client';
import type { FeatureCollection, Geometry } from 'geojson';
import worldTopo from 'world-atlas/countries-110m.json';
import { COUNTRY_AI_LAWS } from '@/data/governance';

export interface CountryProperties {
  name: string;
  status: 'binding' | 'none' | 'unknown';
  frameworkSlug?: string;
  fillColor: string;
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

      let status: CountryProperties['status'] = 'unknown';
      let fillColor = '#E2E8F0'; // slate-200 — not yet researched (recedes on light globe)

      if (law?.status === 'binding') {
        status = 'binding';
        fillColor = '#14B8A6'; // teal — binding AI law
      } else if (law?.status === 'none') {
        status = 'none';
        fillColor = '#94A3B8'; // slate-400 — researched, no binding law
      }

      return {
        ...f,
        geometry,
        properties: {
          name,
          status,
          frameworkSlug: law?.frameworkSlug,
          fillColor,
        },
      };
    });

    return { type: 'FeatureCollection', features } as FeatureCollection<Geometry, CountryProperties>;
  }, []);
}
