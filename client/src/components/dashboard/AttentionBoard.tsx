import { useMemo } from 'react';
import { CONTROLS, OBLIGATIONS, daysUntil, type Obligation, type SourceRef } from '@/data/governance';
import type { ControlState } from '@/hooks/useGovernanceState';
import EvidenceCoverage from './EvidenceCoverage';
import SourceChip from './SourceChip';

interface AttentionBoardProps {
  controlState: ControlState;
  assessedCount: number;
  onJump: (id: string) => void;
}

function parseEffective(value: string): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  return daysUntil(value);
}

function clockLabel(days: number): string {
  if (days < 0) return `${Math.abs(days)}d in force`;
  if (days === 0) return 'Applies today';
  return `${days}d`;
}

export default function AttentionBoard({ controlState, assessedCount, onJump }: AttentionBoardProps) {
  const model = useMemo(() => {
    const dated = OBLIGATIONS.map((obl) => ({ obl, days: parseEffective(obl.effective) })).filter(
      (row): row is { obl: Obligation; days: number } => row.days !== null,
    );
    const inForce = dated
      .filter((row) => row.days <= 0 && row.obl.type === 'mandatory')
      .sort((a, b) => a.days - b.days);
    const upcoming = dated
      .filter((row) => row.days > 0)
      .sort((a, b) => a.days - b.days)
      .slice(0, 3);
    const unscoredCritical = CONTROLS.filter(
      (control) => control.priority === 'Critical' && !(controlState[control.id]?.maturity),
    );
    const next = upcoming[0];
    return { inForce, upcoming, unscoredCritical, next };
  }, [controlState]);

  const action = model.next
    ? `Next clock: ${model.next.obl.title} · ${clockLabel(model.next.days)}.`
    : 'No dated obligation is inside the forward window.';

  return (
    <section id="overview" className="scroll-mt-24">
      <div className="flex items-end justify-between gap-4 flex-wrap mb-4">
        <div>
          <p className="text-[0.65rem] font-semibold tracking-widest uppercase text-muted-foreground">Decision desk</p>
          <h2 className="text-lg font-semibold text-foreground mt-1">What needs attention</h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Dates checked 1 October 2026. Article 50 transparency has applied since 2 August 2026.
            Annex III high-risk rules were deferred to 2 December 2027 by Regulation (EU) 2026/1744.
            Every date below carries the document it came from — or says that none is recorded.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onJump(assessedCount === 0 ? 'controls' : 'heatmap')}
          className="text-xs font-semibold bg-primary text-primary-foreground rounded-md px-3 py-2"
        >
          {assessedCount === 0 ? 'Score first control' : 'Open heatmap'}
        </button>
      </div>

      <div className="flex items-center gap-2 flex-wrap text-sm text-foreground border border-border bg-card rounded-md px-3 py-2 mb-4">
        <span>{action}</span>
        {model.next && <SourceChip source={model.next.obl.source} />}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <Queue
          title="In force"
          empty="No dated mandatory obligation is in force."
          rows={model.inForce.slice(0, 4).map((row) => ({
            id: row.obl.id,
            kicker: row.obl.framework,
            title: row.obl.title,
            meta: clockLabel(row.days),
            source: row.obl.source,
            showSource: true,
          }))}
          onJump={() => onJump('timeline')}
        />
        <Queue
          title="Next clock"
          empty="No upcoming dated obligation."
          rows={model.upcoming.map((row) => ({
            id: row.obl.id,
            kicker: row.obl.framework,
            title: row.obl.title,
            meta: clockLabel(row.days),
            source: row.obl.source,
            showSource: true,
          }))}
          onJump={() => onJump('timeline')}
        />
        <Queue
          title="Unscored critical"
          empty="Every critical control has a maturity score."
          rows={model.unscoredCritical.slice(0, 4).map((control) => ({
            id: control.code,
            kicker: control.code,
            title: control.title,
            meta: control.ccmDomain,
          }))}
          onJump={() => onJump('controls')}
        />
      </div>

      <div className="mt-3">
        <EvidenceCoverage />
      </div>
    </section>
  );
}

function Queue({
  title,
  empty,
  rows,
  onJump,
}: {
  title: string;
  empty: string;
  rows: { id: string; kicker: string; title: string; meta: string; source?: SourceRef; showSource?: boolean }[];
  onJump: () => void;
}) {
  return (
    <div className="border border-border bg-card rounded-md p-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[0.65rem] font-semibold tracking-widest uppercase text-muted-foreground">{title}</p>
        <button type="button" onClick={onJump} className="text-[0.65rem] text-primary font-medium">
          Open
        </button>
      </div>
      {rows.length === 0 ? (
        <p className="text-xs text-muted-foreground">{empty}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {rows.map((row) => (
            <li key={row.id} className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[0.65rem] font-mono text-muted-foreground">{row.kicker}</p>
                <p className="text-sm text-foreground leading-snug">{row.title}</p>
                {row.showSource && (
                  <div className="mt-1">
                    <SourceChip source={row.source} />
                  </div>
                )}
              </div>
              <span className="text-[0.65rem] font-mono text-muted-foreground whitespace-nowrap">{row.meta}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
