import { useMemo } from 'react';
import {
  CONTROLS,
  FRAMEWORKS,
  OBLIGATIONS,
  TIMELINE_EVENTS,
  daysUntil,
  sourceCoverage,
  type Obligation,
} from '@/data/governance';
import type { ControlState } from '@/hooks/useGovernanceState';
import SourceChip from './SourceChip';

interface StatusStripProps {
  controlState: ControlState;
  overallScore: number;
  assessedCount: number;
  onJump: (id: string) => void;
}

/**
 * The decision desk, compressed to a single strip. It answers four questions at a
 * glance — what is running, what is next, what is unscored, how much is sourced —
 * and hands the rest of the page to the matrix. Nothing here is decorative: every
 * figure is a count or a date drawn from the register.
 */
export default function StatusStrip({ controlState, overallScore, assessedCount, onJump }: StatusStripProps) {
  const model = useMemo(() => {
    const dated = OBLIGATIONS.map((obl) => ({
      obl,
      days: /^\d{4}-\d{2}-\d{2}$/.test(obl.effective) ? daysUntil(obl.effective) : null,
    })).filter((row): row is { obl: Obligation; days: number } => row.days !== null);

    const inForce = dated.filter((r) => r.days <= 0 && r.obl.type === 'mandatory').length;
    const next = dated.filter((r) => r.days > 0).sort((a, b) => a.days - b.days)[0];
    const unscoredCritical = CONTROLS.filter((c) => c.priority === 'Critical' && !controlState[c.id]?.maturity).length;
    const criticalCount = CONTROLS.filter((c) => c.priority === 'Critical').length;
    const evidence = sourceCoverage([...OBLIGATIONS, ...TIMELINE_EVENTS]);
    return { inForce, next, unscoredCritical, criticalCount, evidence };
  }, [controlState]);

  const stats: {
    label: string;
    value: string;
    detail: string;
    target?: string;
  }[] = [
    {
      label: 'In force',
      value: String(model.inForce),
      detail: 'dated mandatory obligations',
      target: 'timeline',
    },
    {
      label: 'Next clock',
      value: model.next ? `${model.next.days}d` : '—',
      detail: model.next ? model.next.obl.title : 'no upcoming dated obligation',
      target: 'timeline',
    },
    {
      label: 'Unscored critical',
      value: `${model.unscoredCritical}/${model.criticalCount}`,
      detail: 'critical controls without a maturity score',
      target: 'controls',
    },
    {
      label: 'Posture',
      value: assessedCount === 0 ? 'Not assessed' : `${overallScore}%`,
      detail: `${assessedCount} of ${CONTROLS.length} controls scored`,
      target: 'controls',
    },
    {
      label: 'Sourced rows',
      value: `${model.evidence.sourced}/${model.evidence.total}`,
      detail: 'obligations and events citing a named document',
      target: 'timeline',
    },
    {
      label: 'Frameworks',
      value: String(FRAMEWORKS.length),
      detail: `tracked · ${CONTROLS.length} CCM controls`,
      target: 'frameworks',
    },
  ];

  return (
    <section id="overview" className="scroll-mt-24">
      <div className="border border-border bg-card rounded-md">
        <div className="px-4 py-2.5 border-b border-border flex items-baseline justify-between gap-3 flex-wrap">
          <p className="text-xs text-foreground">
            Article 50 transparency has applied since 2 August 2026.{' '}
            <span className="text-muted-foreground">
              Annex III high-risk duties were deferred to 2 December 2027. Dates checked 1 October 2026.
            </span>
          </p>
          <SourceChip source={OBLIGATIONS.find((o) => o.id === 'obl1')?.source} />
        </div>
        <dl className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-y sm:divide-y-0 divide-border">
          {stats.map((stat, i) => (
            <button
              key={stat.label}
              type="button"
              onClick={() => stat.target && onJump(stat.target)}
              className={`text-left px-4 py-3 hover:bg-muted/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-foreground ${
                i % 2 === 1 ? 'border-l border-border sm:border-l' : ''
              } ${i >= 1 ? 'sm:border-l sm:border-border' : ''}`}
            >
              <dt className="text-[0.6rem] font-medium uppercase tracking-widest text-muted-foreground">
                {stat.label}
              </dt>
              <dd className="text-lg font-semibold text-foreground tabular-nums leading-tight mt-0.5">{stat.value}</dd>
              <dd className="text-[0.65rem] text-muted-foreground leading-snug mt-0.5 line-clamp-2">{stat.detail}</dd>
            </button>
          ))}
        </dl>
      </div>
    </section>
  );
}
