import { useMemo } from 'react';
import { OBLIGATIONS, TIMELINE_EVENTS, EVIDENCE_TIER_LABEL, sourceCoverage, type EvidenceTier } from '@/data/governance';

const TIER_ORDER: EvidenceTier[] = ['primary', 'official-guidance', 'secondary'];

const TIER_BAR: Record<EvidenceTier, string> = {
  primary: 'bg-emerald-700',
  'official-guidance': 'bg-sky-700',
  secondary: 'bg-amber-600',
};

/**
 * Publishes the register's own evidence gap. The honest number here is low, and
 * that is the point: a reader can see exactly how much of the register is
 * attested to a named document and how much is not, instead of inferring that
 * a tidy table means a sourced one.
 */
export default function EvidenceCoverage() {
  const { obligations, events } = useMemo(
    () => ({ obligations: sourceCoverage(OBLIGATIONS), events: sourceCoverage(TIMELINE_EVENTS) }),
    [],
  );

  const rows = [
    { label: 'Obligations register', data: obligations },
    { label: 'Timeline events', data: events },
  ];

  return (
    <div className="border border-border bg-card rounded-md p-4">
      <div className="flex items-baseline justify-between gap-3 flex-wrap mb-1">
        <p className="text-[0.65rem] font-semibold tracking-widest uppercase text-muted-foreground">Evidence coverage</p>
        <p className="text-[0.65rem] font-mono text-muted-foreground">audited {obligations.total + events.total} rows</p>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed mb-3 max-w-2xl">
        How much of this register is attested to a named document. Rows marked{' '}
        <span className="font-semibold text-foreground">no source recorded</span> are unverified gaps, not
        confirmations — they are shown rather than hidden.
      </p>

      <div className="flex flex-col gap-3">
        {rows.map(({ label, data }) => (
          <div key={label}>
            <div className="flex items-baseline justify-between gap-2 mb-1">
              <p className="text-xs font-medium text-foreground">{label}</p>
              <p className="text-xs font-mono text-muted-foreground">
                {data.sourced} / {data.total} sourced
              </p>
            </div>
            <div
              className="flex h-2 w-full overflow-hidden rounded-full bg-secondary"
              role="img"
              aria-label={`${label}: ${TIER_ORDER.map((t) => `${data.byTier[t]} ${EVIDENCE_TIER_LABEL[t]}`).join(', ')}, ${data.unsourced} with no source recorded, of ${data.total} rows.`}
            >
              {TIER_ORDER.map((tier) =>
                data.byTier[tier] > 0 ? (
                  <span
                    key={tier}
                    className={TIER_BAR[tier]}
                    style={{ width: `${(data.byTier[tier] / data.total) * 100}%` }}
                  />
                ) : null,
              )}
            </div>
            <div className="flex items-center gap-x-3 gap-y-1 flex-wrap mt-1.5 text-[0.6rem] text-muted-foreground">
              {TIER_ORDER.map((tier) => (
                <span key={tier} className="inline-flex items-center gap-1">
                  <span className={`inline-block w-2 h-2 rounded-sm ${TIER_BAR[tier]}`} aria-hidden="true" />
                  {EVIDENCE_TIER_LABEL[tier]} {data.byTier[tier]}
                </span>
              ))}
              <span className="inline-flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-sm bg-secondary border border-border" aria-hidden="true" />
                No source recorded {data.unsourced}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
