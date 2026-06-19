import { Fragment, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  HEATMAP_CELLS,
  HEATMAP_IMPACTS,
  HEATMAP_LIKELIHOODS,
  OBLIGATIONS,
  FRAMEWORKS,
} from '@/data/governance';
import SectionHeader from './SectionHeader';

const LEVEL_STYLES: Record<string, string> = {
  cool: 'bg-teal-100 border-teal-300 text-teal-900 hover:bg-teal-200 hover:border-teal-400',
  mild: 'bg-cyan-200 border-cyan-400 text-slate-900 hover:bg-cyan-300 hover:border-cyan-500',
  warm: 'bg-amber-200 border-amber-400 text-amber-950 hover:bg-amber-300 hover:border-amber-500',
  hot: 'bg-rose-300 border-rose-500 text-rose-950 hover:bg-rose-400 hover:border-rose-600',
};

const LEVEL_LABELS: Record<string, string> = {
  cool: 'Low',
  mild: 'Moderate',
  warm: 'Elevated',
  hot: 'Critical',
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
      <SectionHeader
        icon={<Flame size={18} />}
        eyebrow="Module 02 · Risk Radar"
        title="Governance Risk Heatmap"
        subtitle="Likelihood × Impact — hover to preview, click a cell to inspect the mapped obligation"
        action={
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-teal-50 border border-teal-200">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
              </span>
              <span className="text-[0.6rem] font-mono font-bold uppercase tracking-wider text-primary">Live Risk Feed</span>
            </span>
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
        }
      />

      <div className="card-elevated p-5 relative">
        <span className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#0F172A]/30 rounded-tl-md pointer-events-none" />
        <span className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#0F172A]/30 rounded-tr-md pointer-events-none" />
        <span className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#0F172A]/30 rounded-bl-md pointer-events-none" />
        <span className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#0F172A]/30 rounded-br-md pointer-events-none" />
        <div className="overflow-x-auto">
          <div
            className="grid gap-1.5 min-w-[480px]"
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
                  const isSelected = selected?.l === li && selected?.i === ii;
                  const cellButton = (
                    <motion.button
                      key={`${li}-${ii}`}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: dimmed ? 0.2 : 1, scale: 1 }}
                      transition={{ delay: (li * 5 + ii) * 0.015, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      whileHover={{ scale: dimmed ? 1 : 1.08, zIndex: 1 }}
                      whileTap={{ scale: dimmed ? 1 : 0.94 }}
                      onClick={() => setSelected({ l: li, i: ii })}
                      className={`relative aspect-square rounded-md border text-[0.6rem] font-semibold leading-tight p-1.5 flex items-center justify-center text-center transition-colors ${
                        cell ? LEVEL_STYLES[cell.level] : 'bg-secondary/40 border-border text-muted-foreground'
                      } ${isSelected ? 'ring-2 ring-[#0F172A] ring-offset-2 ring-offset-card' : ''}`}
                    >
                      {cell ? cell.label : '—'}
                    </motion.button>
                  );
                  return (
                    <Tooltip key={`${li}-${ii}`}>
                      <TooltipTrigger asChild>{cellButton}</TooltipTrigger>
                      <TooltipContent>
                        <p className="font-semibold">{lLabel} × {HEATMAP_IMPACTS[ii]}</p>
                        {cell ? (
                          <p className="text-[0.65rem] opacity-80">{LEVEL_LABELS[cell.level]} risk · click for obligation</p>
                        ) : (
                          <p className="text-[0.65rem] opacity-80">No obligation mapped</p>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </Fragment>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 mt-4 text-[0.65rem] text-muted-foreground flex-wrap">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-teal-100 border border-teal-300" />Low</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-cyan-200 border border-cyan-400" />Moderate</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-amber-200 border border-amber-400" />Elevated</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-rose-300 border border-rose-500" />Critical</span>
        </div>

        <AnimatePresence mode="wait">
          {selected && (
            <motion.div
              key={`${selected.l}-${selected.i}`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2">
                  <span className="font-semibold text-foreground">{HEATMAP_LIKELIHOODS[selected.l]}</span> likelihood ×{' '}
                  <span className="font-semibold text-foreground">{HEATMAP_IMPACTS[selected.i]}</span> impact
                </p>
                {selectedObligation ? (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05, duration: 0.2 }}
                    className="bg-secondary/50 border border-border rounded-lg p-4 border-l-2 border-l-[#0F172A]"
                  >
                    <p className="font-semibold text-sm text-foreground mb-1">{selectedObligation.title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-2">{selectedObligation.summary}</p>
                    <div className="flex items-center gap-2 flex-wrap text-[0.65rem]">
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-mono">{selectedObligation.framework}</span>
                      <span className="px-2 py-0.5 rounded-full bg-secondary border border-border text-muted-foreground">{selectedObligation.type}</span>
                      <span className="px-2 py-0.5 rounded-full bg-secondary border border-border text-muted-foreground">{selectedObligation.severity}</span>
                      <span className="text-muted-foreground">Effective {selectedObligation.effective}</span>
                    </div>
                  </motion.div>
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
