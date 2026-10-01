import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { CalendarClock, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { OBLIGATIONS, TIMELINE_EVENTS, FRAMEWORKS, daysUntil } from '@/data/governance';
import SectionHeader from './SectionHeader';
import SourceChip from './SourceChip';

const EASE = [0.16, 1, 0.3, 1] as const;

const STATUS_STYLES: Record<string, string> = {
  past: 'bg-muted text-muted-foreground border-border',
  current: 'bg-amber-100 text-amber-900 border-amber-300',
  upcoming: 'bg-primary/10 text-primary border-primary/30',
};

const SEVERITY_STYLES: Record<string, string> = {
  critical: 'bg-rose-100 text-rose-900 border-rose-300',
  high: 'bg-amber-100 text-amber-900 border-amber-300',
  medium: 'bg-cyan-100 text-slate-800 border-cyan-300',
};

interface TimelineSectionProps {
  frameworkFilter: string;
  onFrameworkFilterChange: (fw: string) => void;
}

export default function TimelineSection({ frameworkFilter, onFrameworkFilterChange }: TimelineSectionProps) {
  const filteredObligations = useMemo(
    () => (frameworkFilter === 'all' ? OBLIGATIONS : OBLIGATIONS.filter((o) => o.framework === frameworkFilter)),
    [frameworkFilter],
  );

  return (
    <section id="timeline" className="scroll-mt-24">
      <SectionHeader
        icon={<CalendarClock size={18} />}
        title="Obligations Timeline"
        subtitle="EU AI Act phase-in schedule plus obligations across all tracked frameworks"
      />

      <div className="card-elevated p-5 mb-5">
        <div className="relative pl-6 border-l-2 border-border ml-2">
          {TIMELINE_EVENTS.map((ev, i) => {
            const days = daysUntil(ev.date);
            return (
              <motion.div
                key={ev.date}
                initial={{ opacity: 0, x: -14 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ delay: i * 0.07, duration: 0.4, ease: EASE }}
                className="relative pb-6 last:pb-0"
              >
                <span
                  className={`absolute -left-[1.97rem] top-0.5 w-3.5 h-3.5 rounded-full border-2 ${
                    ev.status === 'past' ? 'bg-muted border-border' : ev.status === 'current' ? 'bg-amber-400 border-amber-500' : 'bg-card border-[#0F172A]'
                  }`}
                />
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-mono text-xs text-muted-foreground">{ev.date}</span>
                  <span className={`text-[0.6rem] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full border ${STATUS_STYLES[ev.status]}`}>
                    {ev.status}
                  </span>
                  {ev.status !== 'past' && (
                    <span className="text-[0.65rem] font-mono text-muted-foreground flex items-center gap-1">
                      {days >= 0 ? <Clock size={10} /> : <CheckCircle2 size={10} />}
                      {days >= 0 ? `${days}d` : 'elapsed'}
                    </span>
                  )}
                </div>
                <p className="font-semibold text-sm text-foreground">{ev.label}</p>
                <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{ev.detail}</p>
                <div className="mt-1.5">
                  <SourceChip source={ev.source} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="card-elevated p-5">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
            Obligations Register — {filteredObligations.length} of {OBLIGATIONS.length}
          </p>
          <div className="flex gap-1.5 flex-wrap">
            <button
              onClick={() => onFrameworkFilterChange('all')}
              className={`text-xs font-medium px-2.5 py-1 rounded-full border transition-colors ${
                frameworkFilter === 'all' ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/50'
              }`}
            >
              All
            </button>
            {FRAMEWORKS.map((fw) => (
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

        <div className="flex flex-col gap-2">
          {filteredObligations.map((obl, i) => (
            <motion.div
              key={obl.id}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ delay: Math.min(i, 10) * 0.04, duration: 0.3, ease: EASE }}
              className="flex items-start gap-3 p-3 bg-background border border-border rounded-lg"
            >
              {obl.severity === 'critical' ? (
                <AlertTriangle size={15} className="text-rose-600 flex-shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 size={15} className="text-primary flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-semibold text-sm text-foreground">{obl.title}</span>
                  <span className={`text-[0.6rem] font-semibold uppercase px-1.5 py-0.5 rounded-full border ${SEVERITY_STYLES[obl.severity]}`}>
                    {obl.severity}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-1.5">{obl.summary}</p>
                <div className="flex items-center gap-2 flex-wrap text-[0.65rem]">
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-mono">{obl.framework}</span>
                  <span className="px-2 py-0.5 rounded-full bg-secondary border border-border text-muted-foreground">{obl.topic}</span>
                  <span className="px-2 py-0.5 rounded-full bg-secondary border border-border text-muted-foreground">{obl.type}</span>
                  <span className="text-muted-foreground">Effective {obl.effective}</span>
                  <SourceChip source={obl.source} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
