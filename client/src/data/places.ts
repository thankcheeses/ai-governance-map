import type { SourceRef } from './governance';

// ---------------------------------------------------------------------------
// Governance geography
//
// Where AI governance physically happens: the standards bodies, regulators and
// institutions behind the instruments in the register. This is the map's
// "discovery" layer, and it earns its place only by being true — a pin here is
// a claim about a real building, so it carries the same provenance discipline
// as an obligation row.
//
// Two rules keep it honest:
//
//   1. A place without verified coordinates gets NO PIN. It stays in the
//      catalogue, listed and searchable, marked "location not verified".
//      Dropping a marker on a guessed coordinate would look more finished and
//      be worth less than nothing.
//   2. `relation` says what the institution actually has to do with the
//      register. Proximity is not authority: NIST publishes the AI RMF and
//      hosts the docket NHID-Clinical was filed into — it does not approve,
//      endorse or enforce anything here, and the copy must not imply it does.
// ---------------------------------------------------------------------------

export type PlaceKind = 'standards-body' | 'regulator' | 'research' | 'court' | 'institution';

export const PLACE_KIND_LABEL: Record<PlaceKind, string> = {
  'standards-body': 'Standards body',
  regulator: 'Regulator',
  research: 'Research institution',
  court: 'Court',
  institution: 'Public institution',
};

export interface GovernancePlace {
  id: string;
  name: string;
  /** The building or campus, where it has a name of its own. */
  site?: string;
  kind: PlaceKind;
  /** One line: what this body actually does. No adjectives. */
  role: string;
  address: string;
  city: string;
  country: string;
  /** Decimal degrees. Omitted when no coordinate could be verified — see rule 1. */
  lat?: number;
  lon?: number;
  /** Who says it is at those coordinates. Required whenever lat/lon are set. */
  coordSource?: SourceRef;
  /** Minimum globe zoom at which the pin appears, so the globe stays quiet. */
  minZoom: number;
  /** Framework slugs in FRAMEWORKS this body is responsible for. */
  frameworkSlugs: string[];
  /** What this place has to do with the register. Documented links only. */
  relation: string;
  source: SourceRef;
}

const WIKI_COORD = (article: string, url: string): SourceRef => ({
  tier: 'secondary',
  citation: `Wikipedia — ${article} (infobox coordinates)`,
  url,
  checked: '2026-10-16',
  note: 'Coordinate taken from an encyclopaedia infobox, not from a surveyed or official geospatial record.',
});

export const GOVERNANCE_PLACES: GovernancePlace[] = [
  {
    id: 'nist-gaithersburg',
    name: 'NIST',
    site: 'Gaithersburg campus',
    kind: 'standards-body',
    role: 'US federal measurement and standards agency; publishes the AI Risk Management Framework.',
    address: '100 Bureau Drive, Gaithersburg, MD 20899',
    city: 'Gaithersburg',
    country: 'United States',
    lat: 39.13306,
    lon: -77.22361,
    coordSource: WIKI_COORD(
      'National Institute of Standards and Technology',
      'https://en.wikipedia.org/wiki/National_Institute_of_Standards_and_Technology',
    ),
    minZoom: 2.6,
    frameworkSlugs: ['nist-ai-rmf'],
    relation:
      'Publishes the NIST AI RMF, which 20 controls in this register cite. NHID-Clinical v1.3 was filed as a public comment into a NIST docket (NIST-2025-0035-0026) — a submission, not an endorsement, approval or any form of NIST review.',
    source: {
      tier: 'primary',
      citation: 'NIST — Headquarters contact details',
      url: 'https://www.nist.gov/',
      checked: '2026-10-16',
      note: 'Address taken from nist.gov itself.',
    },
  },
  {
    id: 'ec-berlaymont',
    name: 'European Commission',
    site: 'Berlaymont building',
    kind: 'institution',
    role: 'Executive of the European Union; issues guidance on the AI Act and hosts the AI Office.',
    address: '200 rue de la Loi / Wetstraat, 1049 Brussels',
    city: 'Brussels',
    country: 'Belgium',
    lat: 50.8437,
    lon: 4.38266,
    coordSource: WIKI_COORD('Berlaymont building', 'https://en.wikipedia.org/wiki/Berlaymont_building'),
    minZoom: 2.6,
    frameworkSlugs: ['eu-ai-act'],
    relation:
      'Source of the Article 50 transparency guidance cited by the EU rows in this register. Regulation (EU) 2024/1689 and the 2026/1744 deferrals are EU law, not Commission policy — the Commission interprets and enforces, it does not legislate alone.',
    source: {
      tier: 'secondary',
      citation: 'Wikipedia — Berlaymont building',
      url: 'https://en.wikipedia.org/wiki/Berlaymont_building',
      checked: '2026-10-16',
      note: 'Building identity and street address confirmed from the encyclopaedia entry; not re-checked against a Commission publication.',
    },
  },
  {
    id: 'iso-geneva',
    name: 'ISO Central Secretariat',
    kind: 'standards-body',
    role: 'Secretariat of the International Organization for Standardization; publishes ISO/IEC 42001.',
    address: 'Chemin de Blandonnet 8, CP 401, 1214 Vernier',
    city: 'Geneva',
    country: 'Switzerland',
    // No coordinate verified. Catalogued without a pin rather than guessed —
    // "somewhere in Vernier" is not a location.
    minZoom: 2.6,
    frameworkSlugs: ['iso-iec-42001'],
    relation:
      'Publishes ISO/IEC 42001, cited by 20 controls in this register. The standard text is paywalled, which is why those rows carry no primary source.',
    source: {
      tier: 'secondary',
      citation: 'Wikipedia — International Organization for Standardization',
      url: 'https://en.wikipedia.org/wiki/International_Organization_for_Standardization',
      checked: '2026-10-16',
      note: 'Street address confirmed; no coordinate verified, so this place is listed without a map pin.',
    },
  },
];

/** Places that can actually be drawn. The rest stay in the list, unpinned. */
export const PLOTTABLE_PLACES = GOVERNANCE_PLACES.filter(
  (p): p is GovernancePlace & { lat: number; lon: number } =>
    typeof p.lat === 'number' && typeof p.lon === 'number',
);

export const placesGeoJSON = () => ({
  type: 'FeatureCollection' as const,
  features: PLOTTABLE_PLACES.map((p) => ({
    type: 'Feature' as const,
    id: p.id,
    geometry: { type: 'Point' as const, coordinates: [p.lon, p.lat] },
    properties: { id: p.id, name: p.name, kind: p.kind, minZoom: p.minZoom },
  })),
});
