import { useMemo } from 'react';
import { feature } from 'topojson-client';
import usStates from 'us-atlas/states-10m.json';
import type { FeatureCollection, Geometry } from 'geojson';
import { FRAMEWORKS, STATE_AI_LAWS } from '@/data/governance';

// ---------------------------------------------------------------------------
// US state law, on the globe itself.
//
// The globe paints the United States grey, because there is no binding
// national AI law — true, and the legend says so. But grey next to a coloured
// Europe reads as "nothing is happening here", which is wrong: six states have
// binding statutes, and this project keeps a whole register of them. Until now
// that fact only existed inside the USA panel, two clicks away.
//
// So the states are drawn on the globe. The country stays grey — the national
// finding has not changed — and the state patchwork sits on top of it, which
// is exactly the relationship between the two facts.
//
// Scale is kept honest by NOT colouring states by instrument the way countries
// are. Eleven instrument colours cannot be told apart on a sphere, and a state
// statute and the EU AI Act are not the same kind of object. States get one
// colour meaning "binding state law", and the instrument is named on click.
// ---------------------------------------------------------------------------

export interface StateLayerProps {
  name: string;
  postalCode: string;
  status: 'binding' | 'none';
  /** Slug in FRAMEWORKS, where one is recorded. */
  frameworkSlug?: string;
  /** The instrument's display name, for the click panel. */
  instrument?: string;
}

/** One colour, one meaning: this state has a binding AI statute. */
export const STATE_BINDING_COLOR = '#FBBF24';
export const STATE_BINDING_EDGE = '#FDE68A';
export const STATE_NONE_COLOR = '#64748B';

export function useStatesLayer(): FeatureCollection<Geometry, StateLayerProps> {
  return useMemo(() => {
    const collection = feature(
      usStates as never,
      (usStates as never as { objects: { states: never } }).objects.states,
    ) as unknown as FeatureCollection<Geometry, { name: string }>;

    const features = collection.features.map((f) => {
      const name = f.properties?.name ?? '';
      const law = STATE_AI_LAWS.find((s) => s.name === name);
      const framework = law?.frameworkSlug
        ? FRAMEWORKS.find((fw) => fw.slug === law.frameworkSlug)
        : undefined;
      return {
        ...f,
        id: name,
        properties: {
          name,
          postalCode: law?.postalCode ?? '',
          status: (law?.status ?? 'none') as 'binding' | 'none',
          frameworkSlug: law?.frameworkSlug,
          instrument: framework?.name,
        },
      };
    });

    return { type: 'FeatureCollection', features } as FeatureCollection<Geometry, StateLayerProps>;
  }, []);
}

/** The states carrying a binding statute, for the legend and for tests. */
export const BINDING_STATES = STATE_AI_LAWS.filter((s) => s.status === 'binding');
