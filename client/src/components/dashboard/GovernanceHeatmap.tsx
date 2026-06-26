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
  cool: 'bg-teal-100 border-teal-300 text-teal-900 hover:bg-teal-200 hover:border-teal-400 hover:brightness-105',
  mild: 'bg-cyan-200 border-cyan-400 text-slate-900 hover:bg-cyan-300 hover:border-cyan-500 hover:brightness-105',
  warm: 'bg-amber-200 border-amber-400 text-amber-950 hover:bg-amber-300 hover:border-amber-500 hover:brightness-105',
  hot: 'bg-rose-300 border-rose-500 text-rose-950 hover:bg-rose-400 hover:border-rose-600 hover:brightness-110',
};

const LEVEL_LABELS: Record<string, string> = {
  cool: 'Low',
  mild: 'Moderate',
  warm: 'Elevated',
  hot: 'Critical',
};

// rgb triples used to build the radiating glow + pulse on hover, matching each level's palette
const LEVEL_GLOW: Record<string, string> = {
  cool: '20,184,166',
  mild: '34,211,238',
  warm: '245,158,11',
  hot: '244,63,94',
};

// Hover particles: rising embers for hot/warm (fire), drifting petals for cool/mild (foliage).
// Particle count + speed scale with risk level — more, faster embers for hot than warm, and so on.
const EMBER_OFFSETS = [-10, 6, -4, 12, -14, 2];
const PETAL_OFFSETS = [-12, 10, -6];

function HeatParticles({ level }: { level: 'cool' | 'mild' | 'warm' | 'hot' }) {
  const color = LEVEL_GLOW[level];
  if (level === 'hot' || level === 'warm') {
    const offsets = EMBER_OFFSETS.slice(0, level === 'hot' ? 6 : 4);
    const duration = level === 'hot' ? 1.0 : 1.4;
    return (
      <>
        {offsets.map((x, idx) => (
          <motion.span
            key={idx}
            className="absolute rounded-full pointer-events-none"
            style={{ left: '50%', bottom: '15%', width: 4, height: 4, marginLeft: -2, background: `rgb(${color})`, boxShadow: `0 0 6px 1px rgba(${color},0.85)` }}
            initial={{ opacity: 0, x, y: 0, scale: 0.5 }}
            animate={{ opacity: [0, 1, 0.7, 0], y: [0, -10, -18, -27], x: [x, x - 3, x + 3, x], scale: [0.5, 1, 0.8, 0.3] }}
            transition={{ duration, repeat: Infinity, delay: idx * (duration / offsets.length), ease: 'easeOut' }}
          />
        ))}
      </>
    );
  }
  const offsets = PETAL_OFFSETS.slice(0, level === 'mild' ? 3 : 2);
  const duration = level === 'mild' ? 1.9 : 2.4;
  return (
    <>
      {offsets.map((x, idx) => (
        <motion.span
          key={idx}
          className="absolute rounded-full pointer-events-none"
          style={{ left: '50%', top: '40%', width: 5, height: 5, marginLeft: -2.5, background: `rgba(${color},0.85)` }}
          initial={{ opacity: 0, x, y: 0, rotate: 0 }}
          animate={{ opacity: [0, 0.9, 0.9, 0], x: [x, x + 8, x - 6, x + 4], y: [0, -4, 4, -2], rotate: [0, 25, -15, 10] }}
          transition={{ duration, repeat: Infinity, delay: idx * (duration / offsets.length), ease: 'easeInOut' }}
        />
      ))}
    </>
  );
}

interface GovernanceHeatmapProps {
  frameworkFilter: string;
  onFrameworkFilterChange: (fw: string) => void;
}

export default function GovernanceHeatmap({ frameworkFilter, onFrameworkFilterChange }: GovernanceHeatmapProps) {
  const [selected, setSelected] = useState<{ l: number; i: number } | null>(null);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

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
        title="Governance Risk Heatmap"
        subtitle="Likelihood × Impact — hover to preview, click a cell to inspect the mapped obligation"
        action={
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
        }
      />

      <div className="card-elevated p-5">
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
                  const cellKey = `${li}-${ii}`;
                  const isHovered = hoveredKey === cellKey && !!cell && !dimmed;
                  const glow = cell ? LEVEL_GLOW[cell.level] : '15,23,42';
                  const cellButton = (
                    <motion.button
                      key={cellKey}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{
                        opacity: dimmed ? 0.2 : 1,
                        scale: 1,
                        boxShadow: isHovered
                          ? `0 0 0 1px rgba(${glow},0.45), 0 0 22px 6px rgba(${glow},0.5)`
                          : '0 0 0 0 rgba(0,0,0,0)',
                      }}
                      transition={{ delay: (li * 5 + ii) * 0.015, duration: 0.3, ease: [0.16, 1, 0.3, 1], boxShadow: { duration: 0.35, ease: 'easeOut' } }}
                      whileHover={{ scale: dimmed ? 1 : 1.12, zIndex: 2 }}
                      whileTap={{ scale: dimmed ? 1 : 0.94 }}
                      onMouseEnter={() => cell && !dimmed && setHoveredKey(cellKey)}
                      onMouseLeave={() => setHoveredKey((k) => (k === cellKey ? null : k))}
                      onClick={() => setSelected({ l: li, i: ii })}
                      className={`relative aspect-square rounded-md border text-[0.6rem] font-semibold leading-tight p-1.5 flex items-center justify-center text-center transition-colors ${
                        cell ? LEVEL_STYLES[cell.level] : 'bg-secondary/40 border-border text-muted-foreground'
                      } ${isSelected ? 'ring-2 ring-[#0F172A] ring-offset-2 ring-offset-card' : ''}`}
                    >
                      {isHovered && (
                        <motion.span
                          className="absolute inset-0 rounded-md pointer-events-none"
                          style={{ background: `radial-gradient(circle, rgba(${glow},0.55), transparent 70%)` }}
                          initial={{ opacity: 0, scale: 0.6 }}
                          animate={{ opacity: [0.55, 0], scale: [0.7, 1.7] }}
                          transition={{ duration: 1.1, repeat: Infinity, ease: 'easeOut' }}
                        />
                      )}
                      {isHovered && cell && <HeatParticles level={cell.level} />}
                      <span className="relative z-10">{cell ? cell.label : '—'}</span>
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
