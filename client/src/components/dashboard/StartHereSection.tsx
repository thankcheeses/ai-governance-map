import { useMemo, useState } from 'react';
import { Compass, AlertTriangle, CheckCircle2 } from 'lucide-react';
import SectionHeader from './SectionHeader';
import SourceChip from './SourceChip';
import {
  JURISDICTIONS,
  SYSTEM_PROFILES,
  startHereRows,
} from '@/data/startHere';
import { daysUntil } from '@/data/governance';

const SEVERITY: Record<string, string> = {
  critical: 'bg-rose-50 text-rose-800 border-rose-300',
  high: 'bg-amber-50 text-amber-800 border-amber-300',
  medium: 'bg-slate-100 text-slate-700 border-slate-300',
};

/**
 * The first ten seconds.
 *
 * The register is general by design, and the cost of general is a blank first
 * screen. Two questions narrow seventy-five rows to the handful a given reader
 * actually has to think about — without hiding anything, and without claiming
 * to have decided what applies to them.
 */
export default function StartHereSection({ onOpenAll }: { onOpenAll: () => void }) {
  const [systems, setSystems] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);

  const toggle = (list: string[], set: (v: string[]) => void, id: string) =>
    set(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);

  const answered = systems.length > 0 && regions.length > 0;
  const result = useMemo(() => startHereRows(systems, regions), [systems, regions]);
  const chosenProfiles = SYSTEM_PROFILES.filter((p) => systems.includes(p.id));

  return (
    <section id="start-here" className="scroll-mt-24">
      <SectionHeader
        icon={<Compass className="w-5 h-5" aria-hidden="true" />}
        title="Start here"
        subtitle={`Two questions, then the rows that matter most — out of ${result.total} in the register`}
      />

      <fieldset className="card-elevated p-5 mb-4">
        <legend className="text-xs font-semibold tracking-widest uppercase text-muted-foreground px-1">
          1 · What are you building?
        </legend>
        <div className="grid sm:grid-cols-2 gap-2 mt-3">
          {SYSTEM_PROFILES.map((p) => {
            const on = systems.includes(p.id);
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => toggle(systems, setSystems, p.id)}
                aria-pressed={on}
                className={`text-left p-3 rounded-lg border transition-colors ${
                  on ? 'border-teal-900 bg-teal-900/5' : 'border-border hover:border-primary/50'
                }`}
              >
                <span className="block text-body-sm font-semibold text-foreground">{p.label}</span>
                <span className="block text-[0.75rem] text-muted-foreground leading-snug mt-0.5">
                  {p.blurb}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="card-elevated p-5 mb-4">
        <legend className="text-xs font-semibold tracking-widest uppercase text-muted-foreground px-1">
          2 · Where do you operate?
        </legend>
        <div className="flex flex-wrap gap-2 mt-3">
          {JURISDICTIONS.map((j) => {
            const on = regions.includes(j.id);
            return (
              <button
                key={j.id}
                type="button"
                onClick={() => toggle(regions, setRegions, j.id)}
                aria-pressed={on}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                  on ? 'bg-teal-900 text-white border-teal-900' : 'border-border text-muted-foreground hover:border-primary/50'
                }`}
              >
                {j.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      {!answered && (
        <p className="text-body-sm text-muted-foreground px-1">
          Pick at least one of each. Nothing is hidden either way — the full register is in{' '}
          <button type="button" onClick={onOpenAll} className="text-teal-900 underline decoration-teal-900/40">
            the obligations timeline
          </button>
          .
        </p>
      )}

      {answered && (
        <>
          <div className="card-elevated p-5 mb-4">
            <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-2">
              Showing its working
            </p>
            <p className="text-body-sm text-foreground leading-relaxed">
              <strong>{result.rows.length}</strong> of {result.total} rows, filtered to the
              instruments that operate where you selected and to these topics:
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {result.topics.map((t) => (
                <span
                  key={t}
                  className="text-[0.7rem] px-2 py-0.5 rounded-full border border-border bg-card text-muted-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
            <ul className="mt-3 flex flex-col gap-1">
              {chosenProfiles.map((p) => (
                <li key={p.id} className="text-[0.78rem] text-muted-foreground leading-snug">
                  <span className="font-semibold text-foreground">{p.label}:</span> {p.rationale}
                </li>
              ))}
            </ul>
            {/* The honesty that makes the filter usable rather than dangerous. */}
            <p className="text-[0.78rem] text-muted-foreground leading-relaxed mt-3 pt-3 border-t border-border">
              <AlertTriangle size={11} className="inline mr-1 -mt-0.5" aria-hidden="true" />
              This is <strong>relevance, not applicability</strong>. Whether an instrument binds
              you turns on facts this tool has no access to — where you are established, your role
              in the supply chain, size thresholds, and whether a given deployment is in scope at
              all. It is a starting point for your own analysis and not legal advice.
            </p>
          </div>

          <ol className="flex flex-col gap-2">
            {result.rows.map((o) => {
              const days = /^\d{4}-\d{2}-\d{2}$/.test(o.effective) ? daysUntil(o.effective) : null;
              const inForce = days !== null && days <= 0;
              return (
                <li key={o.id} className="flex items-start gap-3 p-3 bg-card border border-border rounded-lg">
                  {inForce ? (
                    <CheckCircle2 size={15} className="text-teal-900 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  ) : (
                    <AlertTriangle size={15} className="text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-semibold text-sm text-foreground">{o.title}</span>
                      <span className={`text-[0.6rem] font-semibold uppercase px-1.5 py-0.5 rounded-full border ${SEVERITY[o.severity]}`}>
                        {o.severity}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-1.5">{o.summary}</p>
                    <div className="flex items-center gap-2 flex-wrap text-[0.65rem]">
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-teal-900 border border-primary/20 font-mono">
                        {o.framework}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-secondary border border-border text-slate-700">
                        {o.topic}
                      </span>
                      <span className="text-muted-foreground">
                        {inForce ? 'In force since' : 'Effective'} {o.effective}
                      </span>
                      <SourceChip source={o.source} />
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>

          {result.rows.length === 0 && (
            <p className="text-body-sm text-muted-foreground px-1">
              Nothing in the register matches that combination yet. That means no row has been
              recorded for it — not that no obligation exists.
            </p>
          )}
        </>
      )}
    </section>
  );
}
