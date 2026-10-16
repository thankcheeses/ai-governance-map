import { useMemo, useState } from 'react';
import { ShieldAlert, ExternalLink } from 'lucide-react';
import SectionHeader from './SectionHeader';
import SourceChip from './SourceChip';
import {
  BEST_PRACTICE_SOURCES,
  SI_KEY_PRACTICES,
  SI_PRACTICES_AUDIENCE,
  SI_PRACTICES_CISA_URL,
  SI_PRACTICES_DEFINITIONS,
  SI_PRACTICES_FUTURE_WORK,
  SI_PRACTICES_SOURCE,
  SI_PRACTICES_STAGES,
  SI_PRACTICES_URL,
  citedCsfSubcategories,
  sourceByNumber,
  type PracticeStage,
} from '@/data/si-incident-practices';
import { STAGE_INTENT } from '@/data/si-incident-practices';

type Filter = 'all' | PracticeStage;

// Agent incident readiness, as published. The panel's job is to make the ten
// practices usable without flattening them: every sentence is the publishers'
// own, the CSF crosswalk is shown as a crosswalk, and the fact that the whole
// document is voluntary is stated before any practice is read.
export default function IncidentPracticesSection() {
  const [filter, setFilter] = useState<Filter>('all');

  const practices = useMemo(
    () => (filter === 'all' ? SI_KEY_PRACTICES : SI_KEY_PRACTICES.filter((p) => p.stage === filter)),
    [filter],
  );
  const csfCount = useMemo(() => citedCsfSubcategories().length, []);
  const itemCount = useMemo(
    () => SI_KEY_PRACTICES.reduce((n, p) => n + p.items.length, 0),
    [],
  );

  return (
    <section id="si-incidents" className="scroll-mt-24">
      <SectionHeader
        icon={<ShieldAlert className="w-5 h-5" aria-hidden="true" />}
        title="Agent Incident Readiness"
        subtitle={`${SI_KEY_PRACTICES.length} voluntary practices · ${itemCount} sub-practices · ${csfCount} NIST CSF 2.0 subcategories cited`}
        action={<SourceChip source={SI_PRACTICES_SOURCE} />}
      />

      {/* Status before substance: nothing here is a requirement. */}
      <div className="card-elevated p-5 mb-5">
        <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-2">
          What this is
        </p>
        <p className="text-body-sm text-foreground leading-relaxed">
          Ten <strong>voluntary</strong> practices published 16 October 2026 by NIST CAISSI, the
          NSA Super Intelligence Security Center and CISA, for managing{' '}
          <em>SI control incidents</em> during the training and evaluation of highly capable
          agents. It creates no legal obligation, confers no certification, and carries its own
          disclaimer of endorsement. It is guidance a developer or evaluator may choose to adopt —
          nothing in this register makes it binding.
        </p>
        <p className="text-body-sm text-muted-foreground leading-relaxed mt-3">
          <span className="font-semibold text-foreground">Who it addresses.</span>{' '}
          {SI_PRACTICES_AUDIENCE}
        </p>
        <div className="flex flex-wrap gap-3 mt-3">
          <a
            href={SI_PRACTICES_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-900 underline decoration-teal-900/40 hover:decoration-teal-900"
          >
            <ExternalLink size={11} aria-hidden="true" />
            NIST landing page (opens in a new tab)
          </a>
          <a
            href={SI_PRACTICES_CISA_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-900 underline decoration-teal-900/40 hover:decoration-teal-900"
          >
            <ExternalLink size={11} aria-hidden="true" />
            CISA co-publication (opens in a new tab)
          </a>
        </div>
        <p className="text-[0.75rem] text-muted-foreground leading-relaxed mt-3">
          Terminology note: the publication and both publishers&rsquo; pages read &ldquo;Super
          Intelligence (SI)&rdquo; and name the authors &ldquo;NIST CAISSI&rdquo; and &ldquo;NSA
          SISC&rdquo;, while older URLs and the titles of documents it cites still read
          &ldquo;AI&rdquo;. Quoted here as published, not normalised in either direction.
        </p>
      </div>

      {/* Lifecycle stage filter. */}
      <div
        className="flex flex-wrap gap-1.5 mb-4"
        role="group"
        aria-label="Filter practices by incident lifecycle stage"
      >
        {(['all', ...SI_PRACTICES_STAGES] as Filter[]).map((s) => {
          const active = filter === s;
          const count = s === 'all' ? SI_KEY_PRACTICES.length : SI_KEY_PRACTICES.filter((p) => p.stage === s).length;
          return (
            <button
              key={s}
              type="button"
              onClick={() => setFilter(s)}
              aria-pressed={active}
              className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                active
                  ? 'bg-teal-900 text-white border-teal-900'
                  : 'border-border text-muted-foreground hover:border-primary/50'
              }`}
            >
              {s === 'all' ? 'All stages' : s}
              <span className="font-mono opacity-80">{count}</span>
            </button>
          );
        })}
      </div>

      {filter !== 'all' && (
        <p className="text-body-sm text-muted-foreground leading-relaxed mb-4 px-3 py-2.5 bg-primary/5 border border-dashed border-primary/30 rounded-lg">
          <span className="font-semibold text-foreground">{filter}.</span> {STAGE_INTENT[filter]}
        </p>
      )}

      <ol className="flex flex-col gap-4 mb-6">
        {practices.map((p) => (
          <li key={p.id} className="card-elevated p-5">
            <div className="flex items-baseline gap-3 mb-3 flex-wrap">
              <span className="font-mono text-xs font-semibold text-teal-900">
                {String(p.id).padStart(2, '0')}
              </span>
              <h3 className="text-heading-sm text-foreground leading-tight flex-1 min-w-[12rem]">
                {p.title}
              </h3>
              <span className="text-[0.7rem] font-semibold uppercase tracking-widest text-muted-foreground border border-border rounded px-1.5 py-0.5">
                {p.stage}
              </span>
            </div>

            <ul className="flex flex-col gap-3">
              {p.items.map((item) => (
                <li key={item.ref} className="flex gap-3">
                  <span className="font-mono text-[0.72rem] text-muted-foreground pt-0.5 w-9 flex-shrink-0">
                    {item.ref}
                  </span>
                  <div className="min-w-0">
                    <p className="text-body-sm text-foreground leading-relaxed">{item.text}</p>
                    {(item.csf.length > 0 || item.sources || item.futureWork) && (
                      <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                        {item.csf.map((c) => (
                          <span
                            key={c}
                            title={`NIST Cybersecurity Framework 2.0 subcategory ${c}, cited by the publication for this practice`}
                            className="font-mono text-[0.65rem] px-1.5 py-0.5 rounded border border-border bg-card text-muted-foreground"
                          >
                            {c}
                          </span>
                        ))}
                        {item.sources?.map((n) => {
                          const src = sourceByNumber(n);
                          if (!src) return null;
                          return (
                            <a
                              key={n}
                              href={src.url}
                              target="_blank"
                              rel="noreferrer noopener"
                              title={src.title}
                              aria-label={`Cited resource: ${src.title} (opens in a new tab)`}
                              className="inline-flex items-center gap-1 text-[0.65rem] px-1.5 py-0.5 rounded border border-dashed border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
                            >
                              <ExternalLink size={9} aria-hidden="true" />
                              {src.title.split(':')[0]}
                            </a>
                          );
                        })}
                        {item.futureWork && (
                          <span
                            title={`The publication marks this an open problem under "Areas for Future Work": ${item.futureWork}`}
                            className="text-[0.65rem] px-1.5 py-0.5 rounded border border-border text-muted-foreground italic"
                          >
                            Open problem · {item.futureWork}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      <details className="card-elevated p-5 mb-4">
        <summary className="text-xs font-semibold tracking-widest uppercase text-muted-foreground cursor-pointer">
          Definitions, verbatim ({SI_PRACTICES_DEFINITIONS.length})
        </summary>
        <dl className="mt-4 flex flex-col gap-4">
          {SI_PRACTICES_DEFINITIONS.map((d) => (
            <div key={d.term}>
              <dt className="text-body-sm font-semibold text-foreground">{d.term}</dt>
              <dd className="text-body-sm text-muted-foreground leading-relaxed mt-1">
                {d.text}
                {'note' in d && d.note && (
                  <span className="block mt-1.5 text-[0.75rem] text-muted-foreground">{d.note}</span>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </details>

      <details className="card-elevated p-5 mb-4">
        <summary className="text-xs font-semibold tracking-widest uppercase text-muted-foreground cursor-pointer">
          Open problems the publication names ({SI_PRACTICES_FUTURE_WORK.length})
        </summary>
        <p className="text-[0.75rem] text-muted-foreground mt-3 mb-3 leading-relaxed">
          The document is explicit that these are unsolved. Where a practice depends on one, the
          practice above carries an &ldquo;Open problem&rdquo; marker.
        </p>
        <dl className="flex flex-col gap-3">
          {SI_PRACTICES_FUTURE_WORK.map((f) => (
            <div key={f.title}>
              <dt className="text-body-sm font-semibold text-foreground">{f.title}</dt>
              <dd className="text-body-sm text-muted-foreground leading-relaxed">{f.text}</dd>
            </div>
          ))}
        </dl>
      </details>

      <details className="card-elevated p-5">
        <summary className="text-xs font-semibold tracking-widest uppercase text-muted-foreground cursor-pointer">
          Instruments it builds on ({BEST_PRACTICE_SOURCES.length})
        </summary>
        <ul className="mt-3 flex flex-col gap-1.5">
          {BEST_PRACTICE_SOURCES.map((s) => (
            <li key={s.n} className="flex gap-2.5 text-body-sm">
              <span className="font-mono text-[0.72rem] text-muted-foreground w-5 flex-shrink-0 text-right">
                {s.n}
              </span>
              <a
                href={s.url}
                target="_blank"
                rel="noreferrer noopener"
                className="text-foreground hover:text-teal-900 hover:underline inline-flex items-start gap-1.5"
              >
                {s.title}
                <ExternalLink size={10} className="mt-1 flex-shrink-0" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </details>
    </section>
  );
}
