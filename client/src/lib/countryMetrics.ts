import { COUNTRY_AI_LAWS, FRAMEWORKS, OBLIGATIONS, type Obligation } from '@/data/governance';

/**
 * The choropleth's metrics: what the map can colour a country by.
 *
 * Every number here is derived from the register this site already publishes —
 * `COUNTRY_AI_LAWS`, `FRAMEWORKS` and `OBLIGATIONS` — so a colour on the map is
 * always traceable to a cited row, and changing the register changes the map.
 * Nothing is sampled, modelled or estimated. A map of AI law that shaded
 * countries by invented scores would be publishing claims about real
 * jurisdictions, which this register exists not to do.
 *
 * Three kinds of country are kept apart on every metric, as they are
 * everywhere else on this site:
 *  - **binding**: a binding national AI statute is on file — measured;
 *  - **none**: researched, no binding national AI law — a real zero where the
 *    metric has one, or its own category where it does not;
 *  - **not researched**: `null`. A gap in the register, never shown as zero.
 */

export type MetricId = 'law' | 'obligations' | 'inForce' | 'nextDeadline' | 'evidence';

export interface MetricBin {
  /** Inclusive lower bound of the bin, in the metric's unit. */
  min: number;
  label: string;
  color: string;
}

export interface MetricDef {
  id: MetricId;
  /** Switcher label: short. */
  label: string;
  /** Legend title: the question the colours answer. */
  question: string;
  /** One line under the legend title saying where the numbers come from. */
  basis: string;
  /** Bins in ascending `min` order; a value takes the last bin it reaches. */
  bins: MetricBin[];
  /** Property written onto each map feature. */
  property: string;
  /** Formats a value for the tooltip and side panel. */
  format: (value: number) => string;
}

/** A value for one country on one metric. `null` = not researched. */
export interface MetricValue {
  value: number | null;
  display: string;
}

const NOT_RESEARCHED = 'Not yet researched';

/** Sequential ink, light to dark — "more" reads darker. */
const SEQ = ['#E9EEF5', '#BCCBE0', '#7F9CC6', '#45679F', '#1D3B70'];
/** Urgency ink for deadlines — nearer reads darker. */
const URGENT = ['#EEE9DD', '#F0D9B5', '#DDA567', '#B9662F', '#8A3418'];

const DAY = 86_400_000;

function startOfDay(d: Date): number {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c.getTime();
}

function dayNumber(iso: string): number {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).getTime();
}

const isDate = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s);

/** The obligations tracked for a country's binding national AI statute. */
export function obligationsFor(country: string): Obligation[] | null {
  const law = COUNTRY_AI_LAWS.find((c) => c.name === country);
  if (!law) return null;
  if (law.status !== 'binding' || !law.frameworkSlug) return [];
  const fw = FRAMEWORKS.find((f) => f.slug === law.frameworkSlug);
  return fw ? OBLIGATIONS.filter((o) => o.framework === fw.shortCode) : [];
}

export const METRICS: MetricDef[] = [
  {
    id: 'law',
    label: 'Binding law',
    question: 'Binding national AI law',
    basis: 'Colour says which instrument binds the country.',
    property: 'm_law',
    bins: [],
    format: () => '',
  },
  {
    id: 'obligations',
    label: 'Obligations',
    question: 'Obligations tracked under the national AI law',
    basis: 'Mandatory duties this register tracks for the country’s binding AI statute.',
    property: 'm_obligations',
    bins: [
      { min: 0, label: 'None — no binding national AI law', color: '#EEE9DD' },
      { min: 1, label: '1–2 obligations', color: SEQ[1] },
      { min: 3, label: '3–5 obligations', color: SEQ[2] },
      { min: 6, label: '6+ obligations', color: SEQ[4] },
    ],
    format: (v) => (v === 0 ? 'None — no binding national AI law' : `${v} obligation${v === 1 ? '' : 's'} tracked`),
  },
  {
    id: 'inForce',
    label: 'In force',
    question: 'How long binding AI rules have applied',
    basis: 'Months since the earliest tracked obligation took effect.',
    property: 'm_inForce',
    bins: [
      { min: 0, label: 'Not yet in force / no national law', color: '#EEE9DD' },
      { min: 1, label: 'Under 6 months', color: SEQ[1] },
      { min: 6, label: '6–12 months', color: SEQ[2] },
      { min: 12, label: '1–2 years', color: SEQ[3] },
      { min: 24, label: '2+ years', color: SEQ[4] },
    ],
    format: (v) =>
      v === 0
        ? 'Not in force'
        : v < 12
          ? `${v} month${v === 1 ? '' : 's'}`
          : `${Math.floor(v / 12)} yr ${v % 12} mo`,
  },
  {
    id: 'nextDeadline',
    label: 'Next deadline',
    question: 'Days to the next compliance deadline',
    basis: 'The next tracked obligation that has not taken effect yet.',
    property: 'm_nextDeadline',
    // Sorted ascending by min; -1 encodes "no upcoming deadline on file".
    bins: [
      { min: -1, label: 'None on file', color: URGENT[0] },
      { min: 0, label: 'Within 90 days', color: URGENT[4] },
      { min: 91, label: '3–6 months', color: URGENT[3] },
      { min: 181, label: '6–12 months', color: URGENT[2] },
      { min: 366, label: 'More than a year', color: URGENT[1] },
    ],
    format: (v) => (v < 0 ? 'No upcoming deadline on file' : v === 0 ? 'Today' : `In ${v} day${v === 1 ? '' : 's'}`),
  },
  {
    id: 'evidence',
    label: 'Evidence',
    question: 'Strongest source on file',
    basis: 'The best evidence tier cited for the country’s tracked obligations.',
    property: 'm_evidence',
    bins: [
      { min: 0, label: 'No citation on file yet', color: '#EEE9DD' },
      { min: 1, label: 'Secondary report', color: SEQ[1] },
      { min: 2, label: 'Official guidance', color: SEQ[2] },
      { min: 3, label: 'Primary text', color: SEQ[4] },
    ],
    format: (v) => ['No citation on file yet', 'Secondary report', 'Official guidance', 'Primary text'][v] ?? '',
  },
];

export const metricById = (id: MetricId): MetricDef => METRICS.find((m) => m.id === id) as MetricDef;

const TIER_RANK = { secondary: 1, 'official-guidance': 2, primary: 3 } as const;

/** The raw value of one metric for one country, as of `today`. */
export function metricValue(id: MetricId, country: string, today: Date = new Date()): number | null {
  const obligations = obligationsFor(country);
  if (obligations === null) return null;
  const now = startOfDay(today);
  const dated = obligations.filter((o) => isDate(o.effective)).map((o) => dayNumber(o.effective));

  switch (id) {
    case 'law':
      return null;
    case 'obligations':
      return obligations.length;
    case 'inForce': {
      const started = dated.filter((d) => d <= now);
      if (!started.length) return 0;
      const months = Math.floor((now - Math.min(...started)) / (DAY * 30.44));
      return Math.max(1, months);
    }
    case 'nextDeadline': {
      const upcoming = dated.filter((d) => d > now);
      if (!upcoming.length) return -1;
      return Math.ceil((Math.min(...upcoming) - now) / DAY);
    }
    case 'evidence': {
      const ranks = obligations.map((o) => (o.source ? TIER_RANK[o.source.tier] : 0));
      return ranks.length ? Math.max(...ranks) : 0;
    }
  }
}

/** The bin a value falls in, or null for "not researched". */
export function binFor(def: MetricDef, value: number | null): MetricBin | null {
  if (value === null) return null;
  let hit: MetricBin | null = null;
  for (const b of def.bins) if (value >= b.min) hit = b;
  return hit;
}

export function describeMetric(id: MetricId, country: string, today?: Date): MetricValue {
  const def = metricById(id);
  const value = metricValue(id, country, today);
  return { value, display: value === null ? NOT_RESEARCHED : def.format(value) };
}

/** Numeric properties for a map feature, one per metric; null when unresearched. */
export function metricProperties(country: string, today?: Date): Record<string, number | null> {
  const out: Record<string, number | null> = {};
  for (const m of METRICS) if (m.id !== 'law') out[m.property] = metricValue(m.id, country, today);
  return out;
}

/**
 * MapLibre `fill-color` expression for a metric: a `step` over the bins, with
 * unresearched countries (property null) left the colour of bare land.
 */
export function metricFillExpression(def: MetricDef, landColor: string): unknown[] {
  const [first, ...rest] = def.bins;
  const step: unknown[] = ['step', ['to-number', ['get', def.property]], first.color];
  for (const b of rest) step.push(b.min, b.color);
  return ['case', ['==', ['get', def.property], null], landColor, step];
}
