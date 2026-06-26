import { useMemo } from 'react';
import { COUNTRY_AI_LAWS, FRAMEWORKS } from '@/data/governance';

export interface CountryProperties {
  name: string;
  status: 'binding' | 'none';
  frameworkSlug?: string;
  color: string;
}

export interface CountryFeature {
  type: 'Feature';
  properties: CountryProperties;
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
}

export interface GeoJSONFeatureCollection {
  type: 'FeatureCollection';
  features: CountryFeature[];
}

const COUNTRY_COORDINATES: Record<string, [number, number]> = {
  'China': [105, 35],
  'South Korea': [127, 37],
  'Brazil': [-51.9, -14.2],
  'Canada': [-95, 60],
  'Japan': [138, 36],
  'India': [78.96, 20.59],
  'Singapore': [103.85, 1.35],
  'United States of America': [-95.7129, 37.0902],
  'United Kingdom': [-3.4, 55.4],
  'Australia': [133.8, -25.3],
  'Germany': [10.5, 51.2],
  'France': [2.2, 46.6],
  'South Africa': [22.9, -30.6],
};

export function useGlobeData(): GeoJSONFeatureCollection {
  return useMemo(() => {
    const features: CountryFeature[] = COUNTRY_AI_LAWS.map((law) => {
      const color = law.status === 'binding' ? '#14B8A6' : '#E2E8F0'; // Teal or secondary

      const coords = COUNTRY_COORDINATES[law.name] || [0, 0];

      return {
        type: 'Feature',
        properties: {
          name: law.name,
          status: law.status,
          frameworkSlug: law.frameworkSlug,
          color,
        },
        geometry: {
          type: 'Point',
          coordinates: coords,
        },
      };
    });

    return {
      type: 'FeatureCollection',
      features,
    };
  }, []);
}
