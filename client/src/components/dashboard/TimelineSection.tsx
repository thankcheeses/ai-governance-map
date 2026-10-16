import { useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { CalendarClock, CheckCircle2, ChevronLeft, ChevronRight, Clock, AlertTriangle } from 'lucide-react';
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
  const railRef = useRef<HTMLDivElement>(null);
  const filteredObligations = useMemo(
    () => (frameworkFilter === 'all' ? OBLIGATIONS : OBLIGATIONS.filter((o) => o.framework === frameworkFilter)),
    [frameworkFilter],
  );

  return (
    <section id="timeline" className="scroll-mt-24">
      <SectionHeader
        icon={<CalendarClock size={18} />}
        title="Obligations Timeline"
        subtitle="EU AI Act phase-in schedule on a horizontal rail, plus obligations across all tracked frameworks"
      />

      {/* Horizontal rail. A phase-in schedule is a sequence in time, so it reads
          along one axis; the vertical stack made the reader scroll the page to
          compare two dates that belong side by side. The container is focusable
          and labelled so the rail is reachable by keyboard, not just by wheel. */}
      <div className="card-elevated p-5 mb-5">
        <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
          <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
            Phase-in schedule — {TIMELINE_EVENTS.length} dated events
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => railRef.current?.scrollBy({ left: -360, behavior: 'smooth' })}
              aria-label="Scroll timeline earlier"
              className="p-1 rounded border border-border text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              type="button"
              onClick={() => railRef.current?.scrollBy({ left: 360, behavior: 'smooth' })}
              aria-label="Scroll timeline later"
              className="p-1 rounded border border-border text-muted-foreground hover:text-foreground"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        <div
          ref={railRef}
          tabIndex={0}
          role="group"
          aria-label={`Obligations timeline, ${TIMELINE_EVENTS.length} events from ${TIMELINE_EVENTS[0]?.date} to ${TIMELINE_EVENTS[TIMELINE_EVENTS.length - 1]?.date}. Scroll horizontally.`}
          className="overflow-x-auto overscroll-x-contain pb-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground rounded"
        >
          <div className="relative flex gap-0 min-w-max pt-7">
            {/* The axis itself, behind the markers. */}
            <span aria-hidden="true" className="absolute left-0 right-0 top-[1.1rem] h-px bg-border" />
            {TIMELINE_EVENTS.map((ev, i) => {
              const days = daysUntil(ev.date);
              return (
                <motion.article
                  key={ev.date}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-20px' }}
                  transition={{ delay: Math.min(i, 8) * 0.05, duration: 0.35, ease: EASE }}
                  className="relative w-[17rem] flex-shrink-0 px-3 first:pl-0"
                >
                  <span
                    aria-hidden="true"
                    className={`absolute left-3 first:left-0 top-[0.72rem] w-3.5 h-3.5 rounded-full border-2 ${
                      ev.status === 'past'
                        ? 'bg-muted border-border'
                        : ev.status === 'current'
                          ? 'bg-amber-400 border-amber-500'
                          : 'bg-card border-foreground'
                    }`}
                  />
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-mono text-xs text-muted-foreground">{ev.date}</span>
                    <span
                      className={`text-[0.6rem] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full border ${STATUS_STYLES[ev.status]}`}
                    >
                      {ev.status}
                    </span>
                    {ev.status !== 'past' && (
                      <span className="text-[0.65rem] font-mono text-muted-foreground flex items-center gap-1">
                        {days >= 0 ? <Clock size={10} /> : <CheckCircle2 size={10} />}
                        {days >= 0 ? `${days}d` : 'elapsed'}
                      </span>
                    )}
                  </div>
                  <p className="font-semibold text-sm text-foreground leading-snug">{ev.label}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{ev.detail}</p>
                  <div className="mt-1.5">
                    <SourceChip source={ev.source} />
                  </div>
                </motion.article>
              );
            })}
          </div>
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
