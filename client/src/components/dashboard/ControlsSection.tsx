import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ChevronDown, Filter, TrendingUp, Zap, FileText, Globe, Network, CheckCircle2, ListChecks,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CONTROLS, MATURITY_LEVELS } from '@/data/governance';
import { useGovernanceState } from '@/hooks/useGovernanceState';
import { ShieldWaveformIcon } from './icons';
import SectionHeader from './SectionHeader';

const EASE = [0.16, 1, 0.3, 1] as const;

const ALL_TIERS = ['All', 'High-Risk', 'All Systems'];

const priorityColor = (p: string) =>
  p === 'Critical' ? 'w-1 h-9 rounded flex-shrink-0 bg-rose-500' :
  p === 'High' ? 'w-1 h-9 rounded flex-shrink-0 bg-amber-500' :
  'w-1 h-9 rounded flex-shrink-0 bg-primary';

export default function ControlsSection() {
  const { getMaturity, getNotes, updateMaturity, updateNotes } = useGovernanceState();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState('All');
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const filteredData = useMemo(
    () => CONTROLS.filter((item) => {
      const s = searchTerm.toLowerCase();
      const matchSearch = !s || item.title.toLowerCase().includes(s) || item.description.toLowerCase().includes(s) || item.code.toLowerCase().includes(s);
      const matchTier = selectedTier === 'All' || item.riskTier === selectedTier;
      return matchSearch && matchTier;
    }),
    [searchTerm, selectedTier],
  );

  const toggleRow = (id: number) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <section id="controls" className="scroll-mt-24">
      <SectionHeader
        icon={<ListChecks size={18} />}
        title="Controls — CCM v4.1.0"
        subtitle="Score maturity, capture evidence, and map each control to its governing frameworks"
      />

      <div className="card-elevated p-5">
        <div className="relative mb-4">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            className="w-full py-2.5 pl-10 pr-4 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
            placeholder="Search controls by name, code, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground uppercase tracking-widest mr-1">
            <Filter size={11} />Tier
          </span>
          {ALL_TIERS.map((tier) => (
            <button
              key={tier}
              onClick={() => setSelectedTier(tier)}
              className={`font-mono text-xs px-2.5 py-1 rounded-full border transition-all ${
                selectedTier === tier
                  ? 'bg-primary border-primary text-primary-foreground'
                  : 'border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-primary'
              }`}
            >
              {tier}
            </button>
          ))}
          <span className="ml-auto text-xs text-muted-foreground font-mono">
            {filteredData.length} of {CONTROLS.length}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {filteredData.length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">No controls match your filters.</div>
          )}
          {filteredData.map((item, i) => {
            const mat = getMaturity(item.id);
            const isOpen = expandedRows.has(item.id);
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: Math.min(i, 8) * 0.035, duration: 0.35, ease: EASE }}
                className={`bg-card border rounded-xl overflow-hidden transition-all duration-200 ${
                  isOpen ? 'border-[#0F172A]/30 shadow-md shadow-primary/5' : 'border-border hover:border-primary/25'
                }`}
              >
                <div className="flex items-center gap-3 p-4 cursor-pointer" onClick={() => toggleRow(item.id)}>
                  <div className={priorityColor(item.priority)} />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-foreground mb-1 flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[0.65rem] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
                        {item.code}
                      </span>
                      {item.title}
                      {item.priority === 'Critical' && (
                        <Badge variant="destructive" className="text-[0.6rem] px-1.5 py-0 h-4">Critical</Badge>
                      )}
                      {item.priority === 'High' && (
                        <Badge className="text-[0.6rem] px-1.5 py-0 h-4 bg-amber-100 text-amber-800 border-amber-300">High</Badge>
                      )}
                      {mat > 0 && (
                        <Badge variant="outline" className="text-[0.6rem] px-1.5 py-0 h-4 text-primary border-primary/40">
                          L{mat}·{MATURITY_LEVELS[mat].label}
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">{item.description}</div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="hidden sm:inline font-mono text-[0.6rem] text-muted-foreground border border-border px-1.5 py-0.5 rounded">
                      {item.ccmDomain}
                    </span>
                    <ChevronDown size={15} className={`text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.28, ease: EASE }}
                      className="overflow-hidden"
                    >
                  <div className="border-t border-border p-6 bg-background grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3 flex items-center gap-1.5">
                        <TrendingUp size={11} />Maturity Level
                      </p>
                      <div className="grid grid-cols-6 gap-1.5 mb-5">
                        {MATURITY_LEVELS.map((lvl) => (
                          <button
                            key={lvl.level}
                            onClick={() => updateMaturity(item.id, lvl.level)}
                            className={`flex flex-col items-center p-2 rounded-lg border transition-all ${
                              mat === lvl.level ? 'bg-primary border-primary' : 'bg-card border-border hover:border-primary/50'
                            }`}
                          >
                            <span className={`font-mono text-sm font-medium leading-none ${mat === lvl.level ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
                              {lvl.level}
                            </span>
                            <span className={`text-[0.5rem] mt-0.5 text-center leading-tight ${mat === lvl.level ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                              {lvl.label}
                            </span>
                          </button>
                        ))}
                      </div>

                      <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3 flex items-center gap-1.5">
                        <Zap size={11} />Performance Indicator
                      </p>
                      <div className="bg-primary/5 border border-dashed border-primary/40 rounded-lg p-4 mb-4">
                        <p className="text-sm font-semibold text-primary mb-1.5">{item.indicator.name}</p>
                        <p className="text-[0.65rem] text-muted-foreground uppercase tracking-widest font-semibold mb-0.5 mt-2">Method</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{item.indicator.method}</p>
                        <p className="text-[0.65rem] text-muted-foreground uppercase tracking-widest font-semibold mb-0.5 mt-2">SLO Target</p>
                        <span className="inline-block mt-0.5 font-mono text-xs bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.5 rounded">
                          {item.indicator.slo}
                        </span>
                      </div>

                      <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-2 flex items-center gap-1.5">
                        <CheckCircle2 size={11} />Implementation Guidance
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.implementation}</p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3 flex items-center gap-1.5">
                        <FileText size={11} />Assessment Notes
                      </p>
                      <textarea
                        className="w-full p-3 bg-card border border-border rounded-lg text-xs text-foreground resize-y min-h-[90px] focus:border-primary focus:outline-none transition-colors font-mono"
                        placeholder="Evidence, findings, remediation actions, owner, target date..."
                        value={getNotes(item.id)}
                        onChange={(e) => updateNotes(item.id, e.target.value)}
                      />

                      <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3 mt-5 flex items-center gap-1.5">
                        <Globe size={11} />Framework Mappings
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(item.mappings).map(([fw, codes]) => (
                          <span key={fw} className="flex items-center gap-1 text-[0.65rem] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded font-mono">
                            {fw === 'NHID-Clinical' && <ShieldWaveformIcon className="w-3 h-3 flex-shrink-0" />}
                            {fw}: {codes.join(', ')}
                          </span>
                        ))}
                      </div>

                      <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-2 mt-5 flex items-center gap-1.5">
                        <Network size={11} />CCM Domain
                      </p>
                      <div className="flex gap-2">
                        <span className="font-mono text-xs bg-secondary border border-border px-2 py-1 rounded text-muted-foreground">
                          {item.ccmDomain}
                        </span>
                        <span className="text-xs text-muted-foreground capitalize px-2 py-1">
                          {item.riskTier} · {item.priority} · {item.status} · {item.automation}
                        </span>
                      </div>
                    </div>
                  </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
