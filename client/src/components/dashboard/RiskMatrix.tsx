import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { RISK_BAND_LABEL } from '@/data/governance';
import {
  CELL_STATE_LABEL,
  bandCell,
  MATRICES,
  STATE_CELL,
  buildMatrix,
  getMatrix,
  getMetric,
  type MatrixCell,
  type MatrixId,
  type ScaleKind,
} from '@/data/matrix';
import type { ControlState } from '@/hooks/useGovernanceState';
import SourceChip from './SourceChip';

type ViewMode = 'matrix' | 'table';
type SortKey = 'row' | 'col' | 'state' | 'value';

function cellClass(cell: MatrixCell, scale: ScaleKind): string {
  if (cell.state === 'assessed' && cell.band) return bandCell(cell.band, scale);
  return STATE_CELL[cell.state as Exclude<MatrixCell['state'], 'assessed'>];
}

function cellAriaLabel(cell: MatrixCell, rowAxis: string, colAxis: string, metricLabel: string): string {
  const head = `${rowAxis} ${cell.row}, ${colAxis} ${cell.col}.`;
  if (cell.state !== 'assessed') return `${head} ${CELL_STATE_LABEL[cell.state]}.`;
  const band = cell.band ? ` ${RISK_BAND_LABEL[cell.band]}.` : '';
  return `${head} ${metricLabel}: ${cell.display}.${band} ${cell.count} record${cell.count === 1 ? '' : 's'}.`;
}

interface RiskMatrixProps {
  controlState: ControlState;
  /** The page lens picks the opening matrix; the selector still overrides it. */
  preferredMatrix?: MatrixId;
}

export default function RiskMatrix({ controlState, preferredMatrix = 'risk' }: RiskMatrixProps) {
  const [matrixId, setMatrixId] = useState<MatrixId>(preferredMatrix);
  const [metricId, setMetricId] = useState(() => getMatrix(preferredMatrix).metrics[0].id);
  const [view, setView] = useState<ViewMode>('matrix');
  const [selected, setSelected] = useState<string | null>(null);
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({
    key: 'row',
    dir: 1,
  });
  const [focusIndex, setFocusIndex] = useState(0);
  const gridRef = useRef<HTMLTableSectionElement>(null);

  const matrix = getMatrix(matrixId);
  const metric = getMetric(matrixId, metricId);
  const cells = useMemo(() => buildMatrix(matrixId, metric.id, controlState), [matrixId, metric.id, controlState]);
  const cellAt = useCallback((row: string, col: string) => cells.find((c) => c.row === row && c.col === col), [cells]);
  const selectedCell = selected ? cells.find((c) => `${c.row}||${c.col}` === selected) : undefined;

  // Narrow viewports get the table by default: a 7-column matrix squeezed to
  // phone width is unreadable, and shrinking it would be worse than switching.
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const apply = () => setView(mq.matches ? 'table' : 'matrix');
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    setMatrixId(preferredMatrix);
    setMetricId(getMatrix(preferredMatrix).metrics[0].id);
    setSelected(null);
    setFocusIndex(0);
  }, [preferredMatrix]);

  const switchMatrix = (id: MatrixId) => {
    setMatrixId(id);
    setMetricId(getMatrix(id).metrics[0].id);
    setSelected(null);
    setFocusIndex(0);
  };

  const cols = matrix.cols.length;

  /** Roving focus across the grid; arrows move by one cell, Home/End by row. */
  const onGridKeyDown = (e: React.KeyboardEvent) => {
    const total = matrix.rows.length * cols;
    const deltas: Record<string, number> = {
      ArrowRight: 1,
      ArrowLeft: -1,
      ArrowDown: cols,
      ArrowUp: -cols,
    };
    let next: number | null = null;
    if (e.key in deltas) next = focusIndex + deltas[e.key];
    else if (e.key === 'Home') next = Math.floor(focusIndex / cols) * cols;
    else if (e.key === 'End') next = Math.floor(focusIndex / cols) * cols + cols - 1;
    if (next === null || next < 0 || next >= total) return;
    e.preventDefault();
    setFocusIndex(next);
    gridRef.current?.querySelectorAll<HTMLButtonElement>('button[data-cell]')[next]?.focus();
  };

  const sortedCells = useMemo(() => {
    const rank = (c: MatrixCell) =>
      sort.key === 'value' ? c.count : sort.key === 'state' ? CELL_STATE_LABEL[c.state] : c[sort.key];
    return [...cells].sort((a, b) => {
      const av = rank(a);
      const bv = rank(b);
      if (av === bv) return a.col.localeCompare(b.col);
      return (av > bv ? 1 : -1) * sort.dir;
    });
  }, [cells, sort]);

  const toggleSort = (key: SortKey) => setSort((s) => ({ key, dir: s.key === key && s.dir === 1 ? -1 : 1 }));

  return (
    <section id="heatmap" className="scroll-mt-24">
      <div className="border border-border bg-card rounded-md">
        {/* Header: the active matrix and metric are both named in the title, so a
            screenshot can never be read against the wrong scale. */}
        <div className="border-b border-border px-4 py-3">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-foreground">
                {matrix.title} — {metric.titleSuffix}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5 max-w-2xl">{matrix.question}</p>
            </div>
            <div className="flex items-center gap-1" role="group" aria-label="View mode">
              {(['matrix', 'table'] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setView(v)}
                  aria-pressed={view === v}
                  className={`text-xs px-2 py-1 rounded border ${view === v ? 'bg-foreground text-background border-foreground' : 'border-border text-muted-foreground hover:text-foreground'}`}
                >
                  {v === 'matrix' ? 'Matrix' : 'Table'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap mt-3">
            <div className="flex items-center gap-1" role="group" aria-label="Matrix">
              <span className="text-[0.65rem] uppercase tracking-widest text-muted-foreground mr-1">Matrix</span>
              {MATRICES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => switchMatrix(m.id)}
                  aria-pressed={matrixId === m.id}
                  className={`text-xs px-2 py-1 rounded border ${matrixId === m.id ? 'bg-foreground text-background border-foreground' : 'border-border text-muted-foreground hover:text-foreground'}`}
                >
                  {m.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1" role="group" aria-label="Metric">
              <span className="text-[0.65rem] uppercase tracking-widest text-muted-foreground mr-1">Metric</span>
              {matrix.metrics.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setMetricId(m.id);
                    setSelected(null);
                  }}
                  aria-pressed={metric.id === m.id}
                  className={`text-xs px-2 py-1 rounded border ${metric.id === m.id ? 'bg-foreground text-background border-foreground' : 'border-border text-muted-foreground hover:text-foreground'}`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="px-4 py-4">
          {view === 'matrix' ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-xs">
                <caption className="sr-only">
                  {matrix.title}, {metric.titleSuffix}. Rows are {matrix.rowAxis}, columns are {matrix.colAxis}. Cells
                  state their own value in text; colour is a secondary cue only.
                </caption>
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="text-left font-medium text-muted-foreground pb-2 pr-3 align-bottom w-[9rem]"
                    >
                      {matrix.rowAxis}
                    </th>
                    {matrix.cols.map((col) => (
                      <th
                        key={col}
                        scope="col"
                        className="font-medium text-muted-foreground pb-2 px-1 align-bottom text-center leading-tight"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody ref={gridRef} onKeyDown={onGridKeyDown}>
                  {matrix.rows.map((row, ri) => (
                    <tr key={row}>
                      <th
                        scope="row"
                        className="text-left font-medium text-foreground pr-3 py-0.5 align-middle whitespace-nowrap"
                      >
                        {row}
                      </th>
                      {matrix.cols.map((col, ci) => {
                        const cell = cellAt(row, col);
                        if (!cell) return <td key={col} />;
                        const index = ri * cols + ci;
                        const isSelected = selected === `${row}||${col}`;
                        return (
                          <td key={col} className="p-0.5">
                            <button
                              type="button"
                              data-cell
                              tabIndex={index === focusIndex ? 0 : -1}
                              onFocus={() => setFocusIndex(index)}
                              onClick={() => setSelected(isSelected ? null : `${row}||${col}`)}
                              aria-label={cellAriaLabel(cell, matrix.rowAxis, matrix.colAxis, metric.label)}
                              aria-pressed={isSelected}
                              className={`w-full h-11 border rounded-sm px-1 text-[0.65rem] font-medium tabular-nums leading-tight
                                focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-1 focus-visible:ring-offset-card
                                ${cellClass(cell, metric.scale)} ${isSelected ? 'ring-2 ring-foreground ring-offset-1 ring-offset-card' : ''}`}
                            >
                              {cell.display}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <caption className="sr-only">
                  Sortable table equivalent of the {matrix.title} matrix, {metric.titleSuffix}.
                </caption>
                <thead>
                  <tr className="border-b border-border">
                    {(
                      [
                        ['row', matrix.rowAxis],
                        ['col', matrix.colAxis],
                        ['state', 'State'],
                        ['value', 'Records'],
                        // aria-sort belongs on the column header, not on the control inside it.
                      ] as [SortKey, string][]
                    ).map(([key, label]) => (
                      <th
                        key={key}
                        scope="col"
                        aria-sort={sort.key === key ? (sort.dir === 1 ? 'ascending' : 'descending') : 'none'}
                        className="text-left font-medium text-muted-foreground py-1.5 pr-3"
                      >
                        <button
                          type="button"
                          onClick={() => toggleSort(key)}
                          className="inline-flex items-center gap-1 hover:text-foreground"
                        >
                          {label}
                          {sort.key === key && <span aria-hidden="true">{sort.dir === 1 ? '↑' : '↓'}</span>}
                        </button>
                      </th>
                    ))}
                    <th scope="col" className="text-left font-medium text-muted-foreground py-1.5">
                      {metric.label}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedCells.map((cell) => (
                    <tr
                      key={`${cell.row}||${cell.col}`}
                      className="border-b border-border/60 last:border-0 hover:bg-muted/40"
                    >
                      <td className="py-1.5 pr-3 text-foreground">{cell.row}</td>
                      <td className="py-1.5 pr-3 text-muted-foreground">{cell.col}</td>
                      <td className="py-1.5 pr-3 text-muted-foreground">{CELL_STATE_LABEL[cell.state]}</td>
                      <td className="py-1.5 pr-3 tabular-nums text-muted-foreground">{cell.count}</td>
                      <td className="py-1.5">
                        <button
                          type="button"
                          onClick={() => setSelected(`${cell.row}||${cell.col}`)}
                          className="text-foreground underline underline-offset-2 decoration-border hover:decoration-foreground"
                        >
                          {cell.display}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Legend is metric-specific and always visible, with the scoring rule
              printed beside it rather than buried in a tooltip. */}
          <div className="mt-4 pt-3 border-t border-border">
            <div className="flex items-center gap-x-4 gap-y-1.5 flex-wrap text-[0.65rem] text-muted-foreground">
              <span className="uppercase tracking-widest">{metric.label}</span>
              {metric.legend.map((entry) => (
                <span key={entry.key} className="inline-flex items-center gap-1.5">
                  <span className={`inline-block w-3 h-3 rounded-sm border ${entry.swatch}`} aria-hidden="true" />
                  {entry.label}
                </span>
              ))}
            </div>
            {metric.formula && (
              <p className="text-[0.65rem] text-muted-foreground mt-2 font-mono leading-relaxed">{metric.formula}</p>
            )}
            <p className="text-[0.65rem] text-muted-foreground mt-1.5 leading-relaxed max-w-3xl">{metric.note}</p>
          </div>

          {selectedCell && (
            <div className="mt-4 pt-3 border-t border-border" aria-live="polite">
              <div className="flex items-baseline justify-between gap-3 flex-wrap">
                <p className="text-sm font-semibold text-foreground">
                  {selectedCell.row} · {selectedCell.col}
                </p>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="text-[0.65rem] text-muted-foreground hover:text-foreground"
                >
                  Close
                </button>
              </div>
              <dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2 mt-2 text-[0.65rem]">
                <div>
                  <dt className="text-muted-foreground uppercase tracking-widest">State</dt>
                  <dd className="text-foreground mt-0.5">{CELL_STATE_LABEL[selectedCell.state]}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground uppercase tracking-widest">{metric.label}</dt>
                  <dd className="text-foreground mt-0.5 tabular-nums">{selectedCell.display}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground uppercase tracking-widest">Assessment coverage</dt>
                  <dd className="text-foreground mt-0.5 tabular-nums">
                    {selectedCell.coverage
                      ? `${selectedCell.coverage.scored} / ${selectedCell.coverage.total} controls scored`
                      : 'Not applicable'}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground uppercase tracking-widest">Owner</dt>
                  <dd className="text-muted-foreground mt-0.5">Not recorded</dd>
                </div>
              </dl>
              {selectedCell.rationale && (
                <p className="text-xs text-muted-foreground mt-3 leading-relaxed max-w-3xl">
                  <span className="uppercase tracking-widest text-[0.65rem] mr-1.5">Rationale</span>
                  {selectedCell.rationale}
                </p>
              )}
              {selectedCell.controlCodes && selectedCell.controlCodes.length > 0 && (
                <p className="text-[0.65rem] text-muted-foreground mt-1.5 font-mono">
                  Mitigating controls: {selectedCell.controlCodes.join(', ')}
                </p>
              )}

              {selectedCell.records.length > 0 ? (
                <ul className="mt-3 flex flex-col divide-y divide-border border-t border-border">
                  {selectedCell.records.map((record) => (
                    <li key={record.id} className="py-2">
                      <p className="text-xs font-medium text-foreground">{record.title}</p>
                      {record.detail && (
                        <p className="text-[0.7rem] text-muted-foreground leading-relaxed mt-0.5">{record.detail}</p>
                      )}
                      <div className="flex items-center gap-2 flex-wrap mt-1">
                        {record.meta && (
                          <span className="text-[0.65rem] font-mono text-muted-foreground">{record.meta}</span>
                        )}
                        <SourceChip source={record.source} />
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-muted-foreground mt-3">
                  No underlying record. {CELL_STATE_LABEL[selectedCell.state]} is the finding, not a score of zero.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
