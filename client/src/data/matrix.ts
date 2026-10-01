import {
  CCM_DOMAINS,
  CONTROLS,
  FRAMEWORKS,
  HEATMAP_CELLS,
  HEATMAP_IMPACTS,
  HEATMAP_LIKELIHOODS,
  OBLIGATIONS,
  RISK_BANDS,
  RISK_BAND_LABEL,
  RISK_DOMAINS,
  RISK_USE_CASES,
  daysUntil,
  type Obligation,
  type RiskBand,
  type RiskDomain,
  type SourceRef,
} from './governance';

// ---------------------------------------------------------------------------
// Matrix semantics
//
// Three matrices answer three different questions and DO NOT share a score.
// Each carries its own metric selector and its own legend, and the selected
// metric is named in the title so a screenshot can never be read against the
// wrong scale.
//
// The four cell states are kept distinct on purpose. A missing assessment is
// never rendered as low risk: `unassessed` means nobody has scored it,
// `not-applicable` means the question does not arise, and `no-data` means no
// record exists for that intersection. Only `assessed` carries a value.
// ---------------------------------------------------------------------------

export type MatrixId = 'risk' | 'exec' | 'grc';
export type CellState = 'assessed' | 'unassessed' | 'not-applicable' | 'no-data';

export const CELL_STATE_LABEL: Record<CellState, string> = {
  assessed: 'Assessed',
  unassessed: 'Not assessed',
  'not-applicable': 'Not applicable',
  'no-data': 'No data',
};

export interface MatrixRecord {
  id: string;
  title: string;
  detail?: string;
  meta?: string;
  source?: SourceRef;
}

export interface MatrixCell {
  row: string;
  col: string;
  state: CellState;
  /** Severity band, for band-valued metrics only. Count metrics leave it unset. */
  band?: RiskBand;
  /** Short text painted into the cell. Severity is never carried by colour alone. */
  display: string;
  count: number;
  records: MatrixRecord[];
  /** Why this cell reads the way it does — shown in the drilldown, not inferred. */
  rationale?: string;
  /** How much of the cell's control set has actually been scored. */
  coverage?: { scored: number; total: number };
  controlCodes?: string[];
}

export interface LegendEntry {
  key: string;
  label: string;
  /** Tailwind classes for the swatch; always paired with the label text. */
  swatch: string;
  band?: RiskBand;
}

export interface MetricDef {
  id: string;
  label: string;
  /** Which ramp the cells use. Counts must not borrow the severity palette. */
  scale: ScaleKind;
  /** Appears in the matrix title, so the active scale is always named. */
  titleSuffix: string;
  legend: LegendEntry[];
  /** Printed beside the legend. Empty when the metric is a plain count. */
  formula?: string;
  note: string;
}

export interface MatrixDef {
  id: MatrixId;
  label: string;
  title: string;
  question: string;
  rowAxis: string;
  colAxis: string;
  rows: string[];
  cols: string[];
  metrics: MetricDef[];
}

// --- scales ----------------------------------------------------------------
//
// Two ramps, because the three matrices measure different things and a shared
// palette would imply a shared score. SEVERITY carries warmth only as severity
// rises, so colour appears where it means something; NEUTRAL is used for plain
// counts, which are volume, not danger.
//
// Both ramps descend monotonically in relative luminance
// (severity 0.91 / 0.64 / 0.39 / 0.07; neutral 0.91 / 0.69 / 0.46 / 0.18), so
// the four steps stay ordered in greyscale and under colour-vision deficiency.
// Every cell also prints its value as text, so colour is never load-bearing.

export type ScaleKind = 'severity' | 'neutral';

const SEVERITY_CELL: Record<RiskBand, string> = {
  cool: 'bg-[#F3F5F7] text-[#334155] border-[#D7DEE5]',
  mild: 'bg-[#C9D3DD] text-[#1F2A37] border-[#A9B6C4]',
  warm: 'bg-[#D29C87] text-[#3A1D12] border-[#B5775C]',
  hot: 'bg-[#7F2D20] text-white border-[#5E1D13]',
};

const NEUTRAL_CELL: Record<RiskBand, string> = {
  cool: 'bg-[#F3F5F7] text-[#334155] border-[#D7DEE5]',
  mild: 'bg-[#D5DCE4] text-[#1F2A37] border-[#B4BFCC]',
  warm: 'bg-[#A9B7C6] text-[#111A24] border-[#8A9AAC]',
  hot: 'bg-[#64748B] text-white border-[#47546A]',
};

const SEVERITY_SWATCH: Record<RiskBand, string> = {
  cool: 'bg-[#F3F5F7] border-[#D7DEE5]',
  mild: 'bg-[#C9D3DD] border-[#A9B6C4]',
  warm: 'bg-[#D29C87] border-[#B5775C]',
  hot: 'bg-[#7F2D20] border-[#5E1D13]',
};

const NEUTRAL_SWATCH: Record<RiskBand, string> = {
  cool: 'bg-[#F3F5F7] border-[#D7DEE5]',
  mild: 'bg-[#D5DCE4] border-[#B4BFCC]',
  warm: 'bg-[#A9B7C6] border-[#8A9AAC]',
  hot: 'bg-[#64748B] border-[#47546A]',
};

export const bandCell = (band: RiskBand, scale: ScaleKind) =>
  (scale === 'neutral' ? NEUTRAL_CELL : SEVERITY_CELL)[band];

const swatch = (band: RiskBand, scale: ScaleKind) => (scale === 'neutral' ? NEUTRAL_SWATCH : SEVERITY_SWATCH)[band];

export const STATE_CELL: Record<Exclude<CellState, 'assessed'>, string> = {
  unassessed: 'bg-card text-muted-foreground border-border border-dashed',
  'not-applicable': 'bg-muted/40 text-muted-foreground border-border',
  'no-data': 'bg-transparent text-muted-foreground/60 border-border/60 border-dotted',
};

const STATE_LEGEND: LegendEntry[] = [
  {
    key: 'unassessed',
    label: 'Not assessed',
    swatch: 'bg-card border-border border-dashed',
  },
  {
    key: 'not-applicable',
    label: 'Not applicable',
    swatch: 'bg-muted/40 border-border',
  },
  {
    key: 'no-data',
    label: 'No data',
    swatch: 'bg-transparent border-border/60 border-dotted',
  },
];

const bandLegend = (): LegendEntry[] =>
  RISK_BANDS.map((band) => ({
    key: band,
    label: RISK_BAND_LABEL[band],
    swatch: swatch(band, 'severity'),
    band,
  }));

/** Legend for a count metric: same four steps, neutral ramp, caller-supplied labels. */
const countLegend = (labels: [string, string, string, string]): LegendEntry[] =>
  RISK_BANDS.map((band, i) => ({
    key: String(i + 1),
    label: labels[i],
    swatch: swatch(band, 'neutral'),
    band,
  }));

// --- residual risk ---------------------------------------------------------

/**
 * Risk domain -> the CCM controls that mitigate it. This is an editorial mapping
 * between records that already exist; it introduces no new assessment values.
 * Residual risk is computed only from the viewer's own control scores, so an
 * unscored register yields "Not assessed", never a flattering residual.
 */
export const DOMAIN_CONTROLS: Record<RiskDomain, string[]> = {
  Transparency: ['CTRL-STA-003', 'CTRL-IAM-002'],
  'Human oversight': ['CTRL-HRS-001'],
  'Data governance': ['CTRL-DSP-001', 'CTRL-DSP-002'],
  'Audit & traceability': ['CTRL-LOG-001', 'CTRL-AA-001'],
  'Monitoring & drift': ['CTRL-LOG-002', 'CTRL-CCC-001'],
  Documentation: ['CTRL-STA-002', 'CTRL-GRC-003'],
  'Lawfulness & conformance': ['CTRL-GRC-004', 'CTRL-AA-002'],
};

export const RESIDUAL_FORMULA =
  'effectiveness = mean(maturity of scored mitigating controls) ÷ 5 · ' +
  'residual band = max(Low, inherent band − 2 × effectiveness), rounded up.';

export const RESIDUAL_NOTE =
  'Residual uses only your own browser-local control scores. With no mitigating control scored, the cell stays Not assessed — it never falls back to the inherent band and never reads as low risk.';

const bandRank = (band: RiskBand) => RISK_BANDS.indexOf(band) + 1;
const rankBand = (rank: number): RiskBand => RISK_BANDS[Math.min(RISK_BANDS.length, Math.max(1, rank)) - 1];

type Maturities = Record<number, { maturity?: number }>;

function controlEffectiveness(codes: string[], controlState: Maturities) {
  const controls = CONTROLS.filter((c) => codes.includes(c.code));
  const scored = controls.filter((c) => (controlState[c.id]?.maturity ?? 0) > 0);
  if (scored.length === 0) return { effectiveness: null, scored: 0, total: controls.length };
  const mean = scored.reduce((a, c) => a + (controlState[c.id]?.maturity ?? 0), 0) / scored.length;
  return {
    effectiveness: mean / 5,
    scored: scored.length,
    total: controls.length,
  };
}

// --- obligation status -----------------------------------------------------

export const OBLIGATION_STATUSES = ['In force', 'Applies later', 'Ongoing (voluntary)'] as const;
export type ObligationStatus = (typeof OBLIGATION_STATUSES)[number];

export function obligationStatus(obl: Obligation): ObligationStatus {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(obl.effective)) return 'Ongoing (voluntary)';
  return daysUntil(obl.effective) <= 0 ? 'In force' : 'Applies later';
}

const frameworkOf = (code: string) => FRAMEWORKS.find((f) => f.shortCode === code);

/** Jurisdictions that actually carry at least one obligation. */
const activeJurisdictions = (): string[] => {
  const seen = new Map<string, number>();
  for (const obl of OBLIGATIONS) {
    const j = frameworkOf(obl.framework)?.jurisdiction;
    if (j) seen.set(j, (seen.get(j) ?? 0) + 1);
  }
  return Array.from(seen.keys()).sort((a, b) => (seen.get(b) ?? 0) - (seen.get(a) ?? 0));
};

const mappingFrameworks = (): string[] => {
  const seen = new Set<string>();
  CONTROLS.forEach((c) => Object.keys(c.mappings).forEach((k) => seen.add(k)));
  return Array.from(seen).sort();
};

const toRecord = (obl: Obligation): MatrixRecord => ({
  id: obl.id,
  title: obl.title,
  detail: obl.summary,
  meta: `${obl.framework} · ${obl.type} · effective ${obl.effective}`,
  source: obl.source,
});

// --- matrix definitions ----------------------------------------------------

export const MATRICES: MatrixDef[] = [
  {
    id: 'risk',
    label: 'Scenarios',
    title: 'AI use case × risk domain',
    question: 'Where do the mapped failure scenarios concentrate, and what is left after controls?',
    rowAxis: 'AI use case',
    colAxis: 'Risk domain',
    rows: [...RISK_USE_CASES],
    cols: [...RISK_DOMAINS],
    metrics: [
      {
        id: 'inherent',
        label: 'Inherent risk',
        scale: 'severity',
        titleSuffix: 'inherent risk',
        legend: [...bandLegend(), ...STATE_LEGEND.filter((s) => s.key === 'no-data')],
        note: 'Hand-authored severity for each mapped scenario, before any control credit. Where several scenarios share a cell, the cell takes the highest band and the count is shown.',
      },
      {
        id: 'residual',
        label: 'Residual risk',
        scale: 'severity',
        titleSuffix: 'residual risk after controls',
        legend: [...bandLegend(), ...STATE_LEGEND],
        formula: RESIDUAL_FORMULA,
        note: RESIDUAL_NOTE,
      },
    ],
  },
  {
    id: 'exec',
    label: 'Jurisdictions',
    title: 'Jurisdiction × obligation status',
    question: 'Which jurisdictions have duties already running, and which are still ahead?',
    rowAxis: 'Jurisdiction',
    colAxis: 'Obligation status',
    rows: activeJurisdictions(),
    cols: [...OBLIGATION_STATUSES],
    metrics: [
      {
        id: 'count',
        label: 'Obligation count',
        scale: 'neutral',
        titleSuffix: 'obligations by status',
        legend: [
          ...countLegend(['1 obligation', '2–4', '5–9', '10 or more']),
          ...STATE_LEGEND.filter((s) => s.key !== 'unassessed'),
        ],
        note: 'A count of tracked obligations, not a risk score. Density here means regulatory volume, not severity.',
      },
      {
        id: 'clock',
        label: 'Nearest clock',
        scale: 'severity',
        titleSuffix: 'nearest obligation date',
        legend: [
          {
            key: '1',
            label: 'Already in force',
            swatch: swatch('cool', 'severity'),
          },
          {
            key: '2',
            label: 'Over a year',
            swatch: swatch('mild', 'severity'),
          },
          {
            key: '3',
            label: '90–365 days',
            swatch: swatch('warm', 'severity'),
          },
          {
            key: '4',
            label: 'Under 90 days',
            swatch: swatch('hot', 'severity'),
          },
          ...STATE_LEGEND.filter((s) => s.key !== 'unassessed'),
        ],
        note: 'Urgency of the soonest dated obligation in the cell. Legal applicability only — it says nothing about risk severity or control coverage.',
      },
    ],
  },
  {
    id: 'grc',
    label: 'Control domains',
    title: 'Control domain × instrument',
    question: 'Which CCM domains carry mappings to which instruments, and how much is scored?',
    rowAxis: 'CCM domain',
    colAxis: 'Instrument',
    rows: [...CCM_DOMAINS],
    cols: mappingFrameworks(),
    metrics: [
      {
        id: 'mapped',
        label: 'Mapped controls',
        scale: 'neutral',
        titleSuffix: 'controls mapped to each instrument',
        legend: [
          ...countLegend(['1 control', '2–3', '4–5', '6 or more']),
          ...STATE_LEGEND.filter((s) => s.key !== 'unassessed'),
        ],
        note: 'A coverage count, not a risk score. A dense cell means many controls cite that instrument — it does not mean the domain is well governed.',
      },
      {
        id: 'scored',
        label: 'Assessment coverage',
        scale: 'severity',
        titleSuffix: 'share of mapped controls you have scored',
        legend: [
          { key: '1', label: 'All scored', swatch: swatch('cool', 'severity') },
          {
            key: '2',
            label: 'Most scored',
            swatch: swatch('mild', 'severity'),
          },
          {
            key: '3',
            label: 'Some scored',
            swatch: swatch('warm', 'severity'),
          },
          ...STATE_LEGEND,
        ],
        note: 'How much of your own maturity scoring is done. This measures the completeness of the assessment, not the strength of the controls.',
      },
    ],
  },
];

export const getMatrix = (id: MatrixId) => MATRICES.find((m) => m.id === id) ?? MATRICES[0];
export const getMetric = (id: MatrixId, metricId: string) => {
  const matrix = getMatrix(id);
  return matrix.metrics.find((m) => m.id === metricId) ?? matrix.metrics[0];
};

// --- builders --------------------------------------------------------------

const countBand = (n: number, thresholds: [number, number, number]): RiskBand =>
  n >= thresholds[2] ? 'hot' : n >= thresholds[1] ? 'warm' : n >= thresholds[0] ? 'mild' : 'cool';

function buildRisk(metricId: string, controlState: Maturities): MatrixCell[] {
  const cells: MatrixCell[] = [];
  for (const row of RISK_USE_CASES) {
    for (const col of RISK_DOMAINS) {
      const scenarios = HEATMAP_CELLS.filter((c) => c.useCase === row && c.riskDomain === col);
      if (scenarios.length === 0) {
        cells.push({
          row,
          col,
          state: 'no-data',
          display: '—',
          count: 0,
          records: [],
        });
        continue;
      }
      const records: MatrixRecord[] = scenarios.map((s) => {
        const obl = OBLIGATIONS.find((o) => o.id === s.obligationId);
        return {
          id: `${s.likelihoodIndex}-${s.impactIndex}`,
          title: s.label,
          detail: obl?.summary,
          meta: `${HEATMAP_LIKELIHOODS[s.likelihoodIndex]} likelihood × ${HEATMAP_IMPACTS[s.impactIndex]} impact · inherent ${RISK_BAND_LABEL[s.level]}${obl ? ` · ${obl.framework} ${obl.title}` : ''}`,
          source: obl?.source,
        };
      });
      const worst = scenarios.reduce((a, s) => Math.max(a, bandRank(s.level)), 0);
      const codes = DOMAIN_CONTROLS[col] ?? [];

      if (metricId === 'residual') {
        const { effectiveness, scored, total } = controlEffectiveness(codes, controlState);
        if (effectiveness === null) {
          cells.push({
            row,
            col,
            state: 'unassessed',
            display: 'Not assessed',
            count: scenarios.length,
            records,
            coverage: { scored, total },
            controlCodes: codes,
            rationale: `Inherent ${RISK_BAND_LABEL[rankBand(worst)]}. None of the ${total} mitigating control${total === 1 ? '' : 's'} (${codes.join(', ')}) has a maturity score, so no residual can be computed.`,
          });
          continue;
        }
        const band = rankBand(Math.ceil(worst - 2 * effectiveness));
        cells.push({
          row,
          col,
          state: 'assessed',
          band,
          display: `${RISK_BAND_LABEL[band]}${scenarios.length > 1 ? ` · ${scenarios.length}` : ''}`,
          count: scenarios.length,
          records,
          coverage: { scored, total },
          controlCodes: codes,
          rationale: `Inherent ${RISK_BAND_LABEL[rankBand(worst)]} (rank ${worst}); ${scored} of ${total} mitigating controls scored, effectiveness ${effectiveness.toFixed(2)}; residual rank ${Math.max(1, Math.ceil(worst - 2 * effectiveness))}.`,
        });
        continue;
      }

      const band = rankBand(worst);
      cells.push({
        row,
        col,
        state: 'assessed',
        band,
        display: `${RISK_BAND_LABEL[band]}${scenarios.length > 1 ? ` · ${scenarios.length}` : ''}`,
        count: scenarios.length,
        records,
        controlCodes: codes,
        rationale:
          scenarios.length > 1
            ? `${scenarios.length} mapped scenarios; the cell takes the highest inherent band (${RISK_BAND_LABEL[band]}).`
            : `One mapped scenario, inherent band ${RISK_BAND_LABEL[band]}.`,
      });
    }
  }
  return cells;
}

function buildExec(metricId: string): MatrixCell[] {
  const matrix = getMatrix('exec');
  const cells: MatrixCell[] = [];
  for (const row of matrix.rows) {
    const inJurisdiction = OBLIGATIONS.filter((o) => frameworkOf(o.framework)?.jurisdiction === row);
    const voluntaryOnly = inJurisdiction.every((o) => obligationStatus(o) === 'Ongoing (voluntary)');
    for (const col of matrix.cols) {
      const rows = inJurisdiction.filter((o) => obligationStatus(o) === col);
      if (rows.length === 0) {
        // A voluntary-only jurisdiction has no legal clock at all, so the dated
        // columns are genuinely out of scope rather than merely empty.
        const state: CellState = voluntaryOnly && col !== 'Ongoing (voluntary)' ? 'not-applicable' : 'no-data';
        cells.push({
          row,
          col,
          state,
          display: state === 'not-applicable' ? 'n/a' : '—',
          count: 0,
          records: [],
          rationale:
            state === 'not-applicable'
              ? 'This jurisdiction is tracked only through a voluntary instrument, which carries no legal commencement date.'
              : 'No tracked obligation falls in this cell.',
        });
        continue;
      }
      const records = rows.map(toRecord);
      if (metricId === 'clock') {
        const dated = rows.filter((o) => /^\d{4}-\d{2}-\d{2}$/.test(o.effective)).map((o) => daysUntil(o.effective));
        if (dated.length === 0) {
          cells.push({
            row,
            col,
            state: 'assessed',
            band: 'cool',
            display: 'Ongoing',
            count: rows.length,
            records,
            rationale: 'Continuous obligations with no commencement date.',
          });
          continue;
        }
        const soonest = Math.min(...dated.filter((d) => d > 0).concat(dated.every((d) => d <= 0) ? [0] : []));
        const band: RiskBand = soonest <= 0 ? 'cool' : soonest < 90 ? 'hot' : soonest <= 365 ? 'warm' : 'mild';
        cells.push({
          row,
          col,
          state: 'assessed',
          band,
          display: soonest <= 0 ? 'In force' : `${soonest}d`,
          count: rows.length,
          records,
          rationale: `${rows.length} obligation${rows.length === 1 ? '' : 's'}; nearest dated duty ${soonest <= 0 ? 'already in force' : `in ${soonest} days`}.`,
        });
        continue;
      }
      const band = countBand(rows.length, [2, 5, 10]);
      cells.push({
        row,
        col,
        state: 'assessed',
        band,
        display: String(rows.length),
        count: rows.length,
        records,
        rationale: `${rows.length} tracked obligation${rows.length === 1 ? '' : 's'} in this jurisdiction with status "${col}".`,
      });
    }
  }
  return cells;
}

function buildGrc(metricId: string, controlState: Maturities): MatrixCell[] {
  const matrix = getMatrix('grc');
  const cells: MatrixCell[] = [];
  for (const row of matrix.rows) {
    for (const col of matrix.cols) {
      const controls = CONTROLS.filter((c) => c.ccmDomain === row && Boolean(c.mappings[col]?.length));
      if (controls.length === 0) {
        cells.push({
          row,
          col,
          state: 'no-data',
          display: '—',
          count: 0,
          records: [],
          rationale: 'No control in this domain cites that instrument.',
        });
        continue;
      }
      const records: MatrixRecord[] = controls.map((c) => ({
        id: c.code,
        title: `${c.code} · ${c.title}`,
        detail: c.description,
        meta: `${c.priority} priority · ${c.riskTier} · ${col} ${c.mappings[col].join(', ')} · maturity ${controlState[c.id]?.maturity ?? 0}/5`,
      }));
      const scored = controls.filter((c) => (controlState[c.id]?.maturity ?? 0) > 0).length;

      if (metricId === 'scored') {
        if (scored === 0) {
          cells.push({
            row,
            col,
            state: 'unassessed',
            display: `0/${controls.length}`,
            count: controls.length,
            records,
            coverage: { scored, total: controls.length },
            rationale: `None of the ${controls.length} mapped control${controls.length === 1 ? '' : 's'} has a maturity score.`,
          });
          continue;
        }
        const ratio = scored / controls.length;
        const band: RiskBand = ratio === 1 ? 'cool' : ratio >= 0.66 ? 'mild' : 'warm';
        cells.push({
          row,
          col,
          state: 'assessed',
          band,
          display: `${scored}/${controls.length}`,
          count: controls.length,
          records,
          coverage: { scored, total: controls.length },
          rationale: `${scored} of ${controls.length} mapped controls scored (${Math.round(ratio * 100)}%).`,
        });
        continue;
      }

      cells.push({
        row,
        col,
        state: 'assessed',
        band: countBand(controls.length, [2, 4, 6]),
        display: String(controls.length),
        count: controls.length,
        records,
        coverage: { scored, total: controls.length },
        rationale: `${controls.length} control${controls.length === 1 ? '' : 's'} in ${row} cite ${col}.`,
      });
    }
  }
  return cells;
}

export function buildMatrix(id: MatrixId, metricId: string, controlState: Maturities): MatrixCell[] {
  if (id === 'exec') return buildExec(metricId);
  if (id === 'grc') return buildGrc(metricId, controlState);
  return buildRisk(metricId, controlState);
}
