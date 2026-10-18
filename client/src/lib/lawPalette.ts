// ---------------------------------------------------------------------------
// Country colour, by the instrument that actually binds the country.
//
// The register records exactly two verified national statuses — `binding` and
// `none` — plus `unknown` for countries nobody has checked yet. So a palette
// cannot encode "how strict" a country is: no such field exists, and inventing
// a severity scale would be inventing data.
//
// What the register *does* already carry on every bound country is
// `frameworkSlug`: WHICH instrument binds it. That is a real, sourced,
// multi-valued attribute, and it is what these colours encode. A reader can
// therefore see at a glance that the EU bloc is one instrument, and that Korea,
// China, India and Vietnam each legislated separately — a fact the previous
// single-teal globe actively hid.
//
// Two rules keep the encoding honest:
//
//   1. A family exists only where the register has a framework for it. Adding a
//      colour here without a corresponding entry in FRAMEWORKS is a bug, and a
//      test enforces it.
//   2. The five instrument colours sit on a deliberate luminance ramp, not just
//      on different hues, so they stay separable without colour vision. The
//      assignment was picked by search, not by eye: the worst pair differs by
//      1.25x in relative luminance, and a test holds that floor.
//   3. Colour is never the only channel. Extrusion height still encodes status,
//      the country panel still names the instrument in words, and the legend
//      spells out every swatch. Nobody has to distinguish magenta from orange
//      to use this map.
// ---------------------------------------------------------------------------

export type LawFamily =
  | 'eu'
  | 'korea'
  | 'china'
  | 'india'
  | 'vietnam'
  | 'no-national-law'
  | 'unresearched';

export interface LawFamilyStyle {
  id: LawFamily;
  /** Legend label. Says what the colour means, not what colour it is. */
  label: string;
  /** Slug in FRAMEWORKS, where the family corresponds to one instrument. */
  frameworkSlug?: string;
  /** Fill/extrusion colour on the globe. */
  color: string;
  /** Brighter edge colour for the border and its travelling trail. */
  edge: string;
  /** Fill opacity on the globe. Unresearched stays near-invisible on purpose. */
  fillOpacity: number;
  /** Extrusion height in metres — status, not strictness. Binding rises. */
  height: number;
  /** One line for the legend, where the colour alone would mislead. */
  note?: string;
}

// ONE SYSTEM, PRINTED-ATLAS STYLE. Land is pale sand paper; an instrument is
// ink on that paper. The five inks sit on a lightness ramp (so they survive
// colour-blindness and greyscale print), all muted to the same chroma so no
// one law shouts louder than another, and all dark enough to read against
// both the paper and the turquoise sea. Earlier pastel/neon fills were
// translucent over navy and turned muddy where they overlapped the relief.
export const LAND_PAPER = '#CBC4B3';

export const LAW_FAMILIES: LawFamilyStyle[] = [
  {
    id: 'eu',
    label: 'EU AI Act',
    frameworkSlug: 'eu-ai-act',
    color: '#1D3B70',
    edge: '#13284D',
    fillOpacity: 0.95,
    height: 230000,
  },
  {
    id: 'korea',
    label: 'Korea — AI Basic Act',
    frameworkSlug: 'korea-ai-basic-act',
    color: '#7D6EC2',
    edge: '#544896',
    fillOpacity: 0.95,
    height: 230000,
  },
  {
    id: 'china',
    label: 'China — GenAI Interim Measures',
    frameworkSlug: 'china-genai-interim-measures',
    color: '#9C4022',
    edge: '#6E2C17',
    fillOpacity: 0.95,
    height: 230000,
  },
  {
    id: 'india',
    label: 'India — IT Rules (synthetic media)',
    frameworkSlug: 'india-it-rules-synthetic-media',
    color: '#7F9236',
    edge: '#5A6825',
    fillOpacity: 0.95,
    height: 230000,
  },
  {
    id: 'vietnam',
    label: 'Vietnam — Law on AI',
    frameworkSlug: 'vietnam-ai-law',
    color: '#7C2F57',
    edge: '#55203C',
    fillOpacity: 0.95,
    height: 230000,
  },
  {
    id: 'no-national-law',
    label: 'No binding national AI law',
    color: '#EEE9DD',
    edge: 'rgba(15,23,42,0.38)',
    fillOpacity: 0.9,
    height: 80000,
    // Without this the United States reads as "nothing is happening here",
    // which the register's own state-law panel disproves.
    note: 'Checked. Sub-national law may still apply — see the USA map.',
  },
  {
    id: 'unresearched',
    label: 'Not yet researched',
    color: '#CBC4B3',
    edge: 'rgba(15,23,42,0.22)',
    fillOpacity: 0.0,
    height: 0,
    note: 'Nobody has checked — not evidence that no law exists.',
  },
];

const BY_ID = new Map(LAW_FAMILIES.map((f) => [f.id, f]));
const BY_SLUG = new Map(
  LAW_FAMILIES.filter((f) => f.frameworkSlug).map((f) => [f.frameworkSlug as string, f]),
);

export const lawFamilyById = (id: LawFamily) => BY_ID.get(id) as LawFamilyStyle;

/** The families that represent an actual binding instrument. */
export const BINDING_FAMILIES = LAW_FAMILIES.filter((f) => f.frameworkSlug);

/**
 * Resolve a country's family from what the register verified about it.
 * A binding country whose instrument has no colour yet falls back to the EU
 * teal rather than vanishing — visible and wrong beats invisible and wrong.
 */
export function resolveLawFamily(
  status: 'binding' | 'none' | 'unknown',
  frameworkSlug?: string,
): LawFamily {
  if (status === 'binding') return (frameworkSlug ? BY_SLUG.get(frameworkSlug)?.id : undefined) ?? 'eu';
  if (status === 'none') return 'no-national-law';
  return 'unresearched';
}

/** `['match', ['get','lawFamily'], 'eu', <v>, …, <fallback>]` for MapLibre. */
export function familyMatch<T>(pick: (f: LawFamilyStyle) => T, fallback: T): unknown[] {
  const out: unknown[] = ['match', ['get', 'lawFamily']];
  for (const f of LAW_FAMILIES) out.push(f.id, pick(f));
  out.push(fallback);
  return out;
}
