import { motion } from 'framer-motion';
import { BookOpenCheck, ArrowUpRight } from 'lucide-react';
import { EVIDENCE_TIER_LABEL, FRAMEWORKS, frameworkSources } from '@/data/governance';
import { SI_PRACTICES_SOURCE } from '@/data/si-incident-practices';
import SectionHeader from './SectionHeader';

const EASE = [0.16, 1, 0.3, 1] as const;

interface FrameworksSectionProps {
  frameworkFilter: string;
  onFrameworkFilterChange: (fw: string) => void;
  /** Whether the NHID-Clinical reference module is switched on. */
  nhidModuleOn?: boolean;
  onNhidModuleChange?: (on: boolean) => void;
}

export default function FrameworksSection({
  frameworkFilter,
  onFrameworkFilterChange,
  nhidModuleOn = false,
  onNhidModuleChange,
}: FrameworksSectionProps) {
  // Every card does the same thing, NHID-Clinical included. It used to open
  // its own dedicated section instead, which made the author's framework the
  // only one in the register with a door of its own.
  const handleSelect = (shortCode: string) => {
    onFrameworkFilterChange(frameworkFilter === shortCode ? 'all' : shortCode);
    document.getElementById('heatmap')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="frameworks" className="scroll-mt-24">
      <SectionHeader
        icon={<BookOpenCheck size={18} />}
        title="Frameworks"
        subtitle="Click a framework to filter the heatmap and obligations timeline"
      />

      {onNhidModuleChange && (
        <label className="flex items-start gap-2.5 mb-4 p-3 border border-border rounded-lg bg-card text-xs text-muted-foreground leading-relaxed cursor-pointer">
          <input
            type="checkbox"
            checked={nhidModuleOn}
            onChange={(e) => onNhidModuleChange(e.target.checked)}
            className="mt-0.5 accent-teal-700"
          />
          <span>
            <span className="font-semibold text-foreground">Show the NHID-Clinical reference module.</span>{' '}
            Off by default. It adds a view for the voice-agent trust stack and its five controls.
            NHID-Clinical is authored by the person who built this map, so it is listed above as one
            framework among the rest and its module is opt-in, not part of the default tour.
          </span>
        </label>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {FRAMEWORKS.map((fw, i) => {
          const active = frameworkFilter === fw.shortCode;
          return (
            <motion.button
              key={fw.slug}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              whileHover={{ y: -2 }}
              transition={{ delay: i * 0.06, duration: 0.4, ease: EASE }}
              onClick={() => handleSelect(fw.shortCode)}
              className={`flex flex-col text-left card-elevated p-5 transition-colors duration-200 ${
                active ? 'border-[#0F172A]/40 ring-1 ring-[#0F172A]/20' : 'hover:border-primary/30'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-mono text-[0.65rem] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-teal-900 border border-primary/20">
                  {fw.shortCode}
                </span>
                <ArrowUpRight size={14} className={active ? 'text-primary' : 'text-muted-foreground'} />
              </div>
              <p className="font-semibold text-sm text-foreground mb-1 leading-snug">{fw.name}</p>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">{fw.summary}</p>
              <div className="flex items-center gap-2 text-[0.65rem] text-muted-foreground mb-2">
                <span>{fw.type}</span>
                <span>·</span>
                <span>{fw.jurisdiction}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${fw.coverage}%` }} />
                </div>
                <span className="font-mono text-[0.65rem] text-muted-foreground">
                  {fw.coverage}%
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      <FrameworkSourceList />
    </section>
  );
}

/**
 * The documents behind each framework, generated from the register's own rows.
 * The header's framework count links here, so the number on the first screen
 * can be checked against what each entry actually cites.
 */
export function FrameworkSourceList() {
  // The CAISSI practices are held in their own register, not as obligations.
  const list = frameworkSources({ CAISSI: [SI_PRACTICES_SOURCE] });
  return (
    <div id="framework-sources" className="scroll-mt-16 mt-8 border border-border bg-card rounded-md p-4">
      <h3 className="text-sm font-semibold text-foreground">Sources for all {list.length} frameworks</h3>
      <p className="text-xs text-muted-foreground leading-relaxed mt-1 mb-3 max-w-2xl">
        Each entry lists the documents this register cites for it, and the tier of each. An entry with no
        cited document says so. The full citation, provision and note are on each row in the Timeline view.
      </p>
      <ol className="flex flex-col divide-y divide-border">
        {list.map(({ framework, rows, sourced, sources }) => (
          <li key={framework.slug} className="py-2.5 text-xs">
            <div className="flex items-baseline justify-between gap-3 flex-wrap">
              <span className="font-medium text-foreground">{framework.name}</span>
              <span className="text-[0.65rem] text-muted-foreground">
                {framework.type} · {rows === 0 ? 'no obligation rows' : `${sourced} of ${rows} rows sourced`}
              </span>
            </div>
            {sources.length === 0 ? (
              <p className="mt-1 text-muted-foreground">No source recorded.</p>
            ) : (
              <ul className="mt-1 flex flex-col gap-1">
                {sources.map((s) => (
                  <li key={s.url ?? s.citation} className="flex items-baseline gap-2">
                    <span className="flex-shrink-0 text-[0.6rem] font-semibold uppercase tracking-wider text-muted-foreground w-28">
                      {EVIDENCE_TIER_LABEL[s.tier]}
                    </span>
                    {s.url ? (
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="min-w-0 break-words text-foreground underline underline-offset-2 hover:no-underline"
                      >
                        {s.citation}
                      </a>
                    ) : (
                      <span className="min-w-0 break-words text-foreground">{s.citation}</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
