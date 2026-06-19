import { Fragment, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame } from 'lucide-react';
import {
  HEATMAP_CELLS,
  HEATMAP_IMPACTS,
  HEATMAP_LIKELIHOODS,
  OBLIGATIONS,
  FRAMEWORKS,
} from '@/data/governance';

const LEVEL_STYLES: Record<string, string> = {
  cool: 'bg-teal-50 border-teal-200 text-teal-800 hover:bg-teal-100',
  mild: 'bg-cyan-100 border-cyan-300 text-slate-800 hover:bg-cyan-200',
  warm: 'bg-amber-100 border-amber-300 text-amber-900 hover:bg-amber-200',
  hot: 'bg-rose-100 border-rose-300 text-rose-900 hover:bg-rose-200',
};

interface GovernanceHeatmapProps {
  frameworkFilter: string;
  onFrameworkFilterChange: (fw: string) => void;
}

export default function GovernanceHeatmap({ frameworkFilter, onFrameworkFilterChange }: GovernanceHeatmapProps) {
  const [selected, setSelected] = useState<{ l: number; i: number } | null>(null);

  const cellMap = useMemo(() => {
    const m = new Map<string, typeof HEATMAP_CELLS[number]>();
    HEATMAP_CELLS.forEach((c) => m.set(`${c.likelihoodIndex}-${c.impactIndex}`, c));
    return m;
  }, []);

  const selectedCell = selected ? cellMap.get(`${selected.l}-${selected.i}`) : undefined;
  const selectedObligation = selectedCell ? OBLIGATIONS.find((o) => o.id === selectedCell.obligationId) : undefined;

  const isDimmed = (cell: typeof HEATMAP_CELLS[number] | undefined) => {
    if (frameworkFilter === 'all' || !cell) return false;
    const obl = OBLIGATIONS.find((o) => o.id === cell.obligationId);
    return obl ? obl.framework !== frameworkFilter : true;
  };

  return (
    <section id="heatmap" className="scroll-mt-24">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Flame size={18} />
          </div>
          <div>
            <h2 className="text-heading-lg text-foreground">Governance Risk Heatmap</h2>
            <p className="text-body-sm text-muted-foreground">Likelihood × Impact — click a cell to inspect the mapped obligation</p>
          </div>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <button
            onClick={() => onFrameworkFilterChange('all')}
            className={`text-xs font-medium px-2.5 py-1 rounded-full border transition-colors ${
              frameworkFilter === 'all' ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/50'
            }`}
          >
            All
          </button>
          {FRAMEWORKS.slice(0, 4).map((fw) => (
            <button
              key={fw.shortCode}
              onClick={() => onFrameworkFilterChange(fw.shortCode)}
              className={`text-xs font-medium px-2.5 py-1 rounded-full border transition-colors ${
                frameworkFilter === fw.shortCode ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/50'
              }`}
            >
              {fw.shortCode}
            </button>
          ))}
        </div>
      </div>

      <div className="card-elevated p-5">
        <div
          className="grid gap-1.5"
          style={{ gridTemplateColumns: `100px repeat(${HEATMAP_IMPACTS.length}, 1fr)` }}
        >
          <div />
          {HEATMAP_IMPACTS.map((label) => (
            <div key={label} className="text-[0.65rem] font-semibold uppercase tracking-wide text-muted-foreground text-center pb-1">
              {label}
            </div>
          ))}
          {HEATMAP_LIKELIHOODS.map((lLabel, li) => (
            <Fragment key={`row-${li}`}>
              <div className="text-[0.65rem] font-semibold uppercase tracking-wide text-muted-foreground flex items-center justify-end pr-2">
                {lLabel}
              </div>
              {HEATMAP_IMPACTS.map((_, ii) => {
                const cell = cellMap.get(`${li}-${ii}`);
                const dimmed = isDimmed(cell);
                return (
                  <motion.button
                    key={`${li}-${ii}`}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: dimmed ? 0.25 : 1, scale: 1 }}
                    transition={{ delay: (li * 5 + ii) * 0.012, duration: 0.25 }}
                    whileHover={{ scale: dimmed ? 1 : 1.05 }}
                    onClick={() => setSelected({ l: li, i: ii })}
                    className={`aspect-square rounded-md border text-[0.6rem] font-medium leading-tight p-1.5 flex items-center justify-center text-center transition-colors ${
                      cell ? LEVEL_STYLES[cell.level] : 'bg-secondary/40 border-border text-muted-foreground'
                    } ${selected?.l === li && selected?.i === ii ? 'ring-2 ring-primary ring-offset-1' : ''}`}
                  >
                    {cell ? cell.label : '—'}
                  </motion.button>
                );
              })}
            </Fragment>
          ))}
        </div>

        <div className="flex items-center gap-4 mt-4 text-[0.65rem] text-muted-foreground">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-teal-50 border border-teal-200" />Low</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-cyan-100 border border-cyan-300" />Moderate</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-amber-100 border border-amber-300" />Elevated</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-rose-100 border border-rose-300" />Critical</span>
        </div>

        <AnimatePresence mode="wait">
          {selected && (
            <motion.div
              key={`${selected.l}-${selected.i}`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2">
                  <span className="font-semibold text-foreground">{HEATMAP_LIKELIHOODS[selected.l]}</span> likelihood ×{' '}
                  <span className="font-semibold text-foreground">{HEATMAP_IMPACTS[selected.i]}</span> impact
                </p>
                {selectedObligation ? (
                  <div className="bg-secondary/50 border border-border rounded-lg p-4">
                    <p className="font-semibold text-sm text-foreground mb-1">{selectedObligation.title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-2">{selectedObligation.summary}</p>
                    <div className="flex items-center gap-2 flex-wrap text-[0.65rem]">
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-mono">{selectedObligation.framework}</span>
                      <span className="px-2 py-0.5 rounded-full bg-secondary border border-border text-muted-foreground">{selectedObligation.type}</span>
                      <span className="px-2 py-0.5 rounded-full bg-secondary border border-border text-muted-foreground">{selectedObligation.severity}</span>
                      <span className="text-muted-foreground">Effective {selectedObligation.effective}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">No direct obligation mapped to this cell.</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
