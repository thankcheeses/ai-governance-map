import { useMemo, useState } from 'react';
import { Library, Search } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { CONTROLS, type Control } from '@/data/governance';
import {
  NIST_FUNCTIONS,
  controlsBySubcategory,
  useNistPlaybook,
  type NistFunction,
  type NistSubcategory,
} from '@/data/nist-playbook';
import SectionHeader from './SectionHeader';
import NistSubcategoryDetail, { PlaybookNote } from './NistSubcategoryDetail';

type FunctionFilter = 'ALL' | NistFunction;
type CoverageFilter = 'all' | 'mapped' | 'unmapped';

// One line per function, in NIST's own terms, so the grouping is legible to
// someone who has not read the RMF.
const FUNCTION_GLOSS: Record<NistFunction, string> = {
  GOVERN: 'Culture, policies, roles and accountability for AI risk',
  MAP: 'Context, intended use and impacts of the AI system',
  MEASURE: 'Testing, evaluation and tracking of identified risks',
  MANAGE: 'Prioritizing, responding to and monitoring risks',
};

const BY_SUB = controlsBySubcategory(CONTROLS);

const pill = (active: boolean) =>
  `font-mono text-xs px-2.5 py-1 rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 ${
    active
      ? 'bg-primary border-primary text-primary-foreground'
      : 'border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-primary'
  }`;

function matches(sub: NistSubcategory, cited: Control[], q: string): boolean {
  if (!q) return true;
  const hay = [
    sub.id,
    sub.statement,
    ...sub.actions.flatMap((a) => [a.text, ...a.sub]),
    ...sub.documentation.flatMap((d) => [d.text, ...d.sub]),
    ...cited.flatMap((c) => [c.code, c.title]),
  ];
  return hay.some((t) => t.toLowerCase().includes(q));
}

export default function NistPlaybookSection() {
  const playbook = useNistPlaybook();
  const [query, setQuery] = useState('');
  // Open on one function so the default view stays scannable; 'All' is one click away.
  const [fn, setFn] = useState<FunctionFilter>('GOVERN');
  const [coverage, setCoverage] = useState<CoverageFilter>('all');

  const subs = useMemo(() => playbook?.subcategories ?? [], [playbook]);
  const mappedCount = useMemo(() => subs.filter((s) => BY_SUB.has(s.id)).length, [subs]);
  const unmappedCount = subs.length - mappedCount;

  const perFunction = useMemo(
    () =>
      NIST_FUNCTIONS.map((f) => {
        const inFn = subs.filter((s) => s.function === f);
        return { fn: f, total: inFn.length, mapped: inFn.filter((s) => BY_SUB.has(s.id)).length };
      }),
    [subs],
  );

  const q = query.trim().toLowerCase();
  const visible = useMemo(
    () =>
      subs.filter((s) => {
        const cited = BY_SUB.get(s.id) ?? [];
        if (fn !== 'ALL' && s.function !== fn) return false;
        if (coverage === 'mapped' && cited.length === 0) return false;
        if (coverage === 'unmapped' && cited.length > 0) return false;
        return matches(s, cited, q);
      }),
    [subs, fn, coverage, q],
  );

  const groups = NIST_FUNCTIONS.map((f) => ({ fn: f, items: visible.filter((s) => s.function === f) })).filter((g) => g.items.length > 0);
  const filtersActive = q !== '' || fn !== 'ALL' || coverage !== 'all';
  // A search should reach every function, not just the tab that happens to be open.
  const onSearch = (value: string) => {
    if (value.trim() && !query.trim()) setFn('ALL');
    setQuery(value);
  };

  return (
    <section id="nist-playbook" className="scroll-mt-24">
      <SectionHeader
        icon={<Library size={18} />}
        title="NIST AI RMF Playbook"
        subtitle="All 72 subcategories with NIST's suggested actions and documentation questions, and the controls that cite each"
      />

      <div className="card-elevated p-5 flex flex-col gap-4">
        <PlaybookNote />

        {/* Coverage of the register against the RMF — read as gaps in this map's
            control set, not as findings about any organization. */}
        <div className="border-y border-border py-3">
          <p className="text-xs text-muted-foreground mb-3">
            {playbook ? (
              <>
                <span className="font-semibold text-foreground">{mappedCount} of {subs.length}</span> subcategories are cited by at
                least one of the {CONTROLS.length} controls.{' '}
                <span className="font-semibold text-foreground">{unmappedCount}</span> are not mapped by any control — coverage gaps
                in this register, not findings about your organization.
              </>
            ) : (
              'Loading the Playbook…'
            )}
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-3">
            {perFunction.map((p) => (
              <div key={p.fn} className="min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-mono text-[0.7rem] font-semibold text-foreground">{p.fn}</span>
                  <span className="font-mono text-[0.65rem] text-muted-foreground">
                    {playbook ? `${p.mapped}/${p.total} mapped` : '—'}
                  </span>
                </div>
                <div className="mt-1 h-1 rounded-full bg-secondary overflow-hidden" aria-hidden>
                  <div className="h-full bg-primary/70" style={{ width: p.total ? `${(p.mapped / p.total) * 100}%` : 0 }} />
                </div>
                <p className="hidden sm:block text-[0.65rem] text-muted-foreground mt-1 leading-snug">{FUNCTION_GLOSS[p.fn]}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            type="search"
            aria-label="Search the NIST AI RMF Playbook"
            className="w-full py-2.5 pl-10 pr-4 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
            placeholder="Search statements, actions, questions or control codes…"
            value={query}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:flex-wrap sm:gap-x-4">
          <div className="flex items-center gap-1.5 flex-wrap" role="group" aria-label="Function">
            <button type="button" className={pill(fn === 'ALL')} aria-pressed={fn === 'ALL'} onClick={() => setFn('ALL')}>
              All
            </button>
            {perFunction.map((p) => (
              <button key={p.fn} type="button" className={pill(fn === p.fn)} aria-pressed={fn === p.fn} onClick={() => setFn(p.fn)}>
                {p.fn} <span className="opacity-70">{p.total || ''}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5 flex-wrap" role="group" aria-label="Control coverage">
            <button type="button" className={pill(coverage === 'all')} aria-pressed={coverage === 'all'} onClick={() => setCoverage('all')}>
              Any coverage
            </button>
            <button type="button" className={pill(coverage === 'mapped')} aria-pressed={coverage === 'mapped'} onClick={() => setCoverage('mapped')}>
              Mapped
            </button>
            <button
              type="button"
              className={pill(coverage === 'unmapped')}
              aria-pressed={coverage === 'unmapped'}
              onClick={() => {
                if (coverage === 'unmapped') return setCoverage('all');
                // Gaps are most useful seen across all four functions at once.
                setCoverage('unmapped');
                setFn('ALL');
              }}
            >
              Not mapped by any control <span className="opacity-70">{playbook ? unmappedCount : ''}</span>
            </button>
          </div>
          <span className="sm:ml-auto text-xs text-muted-foreground font-mono">
            {visible.length} of {subs.length || 72}
          </span>
        </div>

        {!playbook && (
          <div className="flex flex-col gap-3 py-2" aria-busy="true">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="bg-secondary h-10 w-full" />
            ))}
          </div>
        )}

        {playbook && groups.length === 0 && (
          <div className="text-center py-10 text-sm text-muted-foreground">
            No subcategories match these filters.{' '}
            {filtersActive && (
              <button
                type="button"
                className="text-primary underline-offset-2 hover:underline"
                onClick={() => {
                  setQuery('');
                  setFn('ALL');
                  setCoverage('all');
                }}
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {groups.map((g) => (
          <div key={g.fn}>
            <div className="flex items-baseline gap-2 mb-1">
              <h3 className="font-mono text-xs font-semibold tracking-widest text-foreground">{g.fn}</h3>
              <span className="text-[0.7rem] text-muted-foreground truncate">{FUNCTION_GLOSS[g.fn]}</span>
            </div>
            <Accordion type="multiple" className="border-t border-border">
              {g.items.map((s) => {
                const cited = BY_SUB.get(s.id) ?? [];
                return (
                  <AccordionItem key={s.id} value={s.id} className="border-border">
                    <AccordionTrigger className="py-3 hover:no-underline gap-3 items-start [&[data-state=open]_.nist-statement]:line-clamp-none">
                      <span className="flex flex-1 min-w-0 flex-col gap-1 sm:flex-row sm:gap-3">
                        <span className="font-mono text-xs font-semibold text-foreground sm:w-24 flex-shrink-0">{s.id}</span>
                        <span className="nist-statement flex-1 min-w-0 text-xs font-normal text-muted-foreground leading-relaxed line-clamp-2">
                          {s.statement}
                        </span>
                      </span>
                      {cited.length > 0 ? (
                        <span className="flex-shrink-0 font-mono text-[0.65rem] text-primary border border-primary/30 bg-primary/5 rounded px-1.5 py-0.5 whitespace-nowrap">
                          {cited.length} {cited.length === 1 ? 'control' : 'controls'}
                        </span>
                      ) : (
                        <span className="flex-shrink-0 font-mono text-[0.65rem] text-muted-foreground border border-dashed border-border rounded px-1.5 py-0.5 whitespace-nowrap">
                          Not mapped
                        </span>
                      )}
                    </AccordionTrigger>
                    <AccordionContent className="sm:pl-[7.5rem] pr-1">
                      <NistSubcategoryDetail sub={s} showStatement={false}>
                        <div>
                          <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Cited by</p>
                          {cited.length > 0 ? (
                            <ul className="flex flex-col gap-1">
                              {cited.map((c) => (
                                <li key={c.id} className="text-xs text-foreground">
                                  <span className="font-mono text-[0.65rem] text-muted-foreground mr-1.5">{c.code}</span>
                                  {c.title}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-xs text-muted-foreground">
                              No control in this register cites this subcategory. Consider whether an existing control should, or
                              whether the outcome is out of scope for your program.
                            </p>
                          )}
                        </div>
                      </NistSubcategoryDetail>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        ))}
      </div>
    </section>
  );
}
