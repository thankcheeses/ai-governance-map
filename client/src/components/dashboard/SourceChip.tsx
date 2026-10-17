import { ExternalLink, FileText, Landmark, Newspaper, HelpCircle } from 'lucide-react';
import {
  EVIDENCE_TIER_DESCRIPTION,
  EVIDENCE_TIER_LABEL,
  STALE_AFTER_DAYS,
  formatAge,
  isStale,
  reconciledAgeDays,
  type EvidenceTier,
  type SourceRef,
} from '@/data/governance';

// Tier is encoded three ways over — icon, short label text and border weight —
// so the chip never depends on colour alone to say how strong the citation is.
const TIER_ICON: Record<EvidenceTier, typeof FileText> = {
  primary: Landmark,
  'official-guidance': FileText,
  secondary: Newspaper,
};

// Tier is carried by the icon and the label text. The fills differ only in
// weight, so a row of chips reads as a register rather than a set of badges.
const TIER_CLASS: Record<EvidenceTier, string> = {
  primary: 'border-[#A9B7C6] bg-[#E8EDF2] text-[#1F2A37]',
  'official-guidance': 'border-[#C2CBD6] bg-[#F1F4F7] text-[#334155]',
  secondary: 'border-border bg-transparent text-muted-foreground',
};

/**
 * Renders the evidence behind one register row. An absent source is shown
 * explicitly rather than omitted, so an unattested row reads as a known gap.
 *
 * External citation links carry rel="noreferrer" by design: following one must
 * not tell the destination that the reader came from this tool.
 */
export default function SourceChip({ source }: { source?: SourceRef }) {
  if (!source) {
    return (
      <span
        className="inline-flex items-center gap-1 text-[0.6rem] font-medium px-1.5 py-0.5 rounded border border-dashed border-border text-muted-foreground"
        title="No official source is recorded for this row. Treat the date and status as unverified."
      >
        <HelpCircle size={10} aria-hidden="true" />
        No source recorded
      </span>
    );
  }

  const Icon = TIER_ICON[source.tier];
  // How long ago someone last checked this row against its document. It sits
  // in the chip itself, beside the date it vouches for, because a reader
  // decides whether to trust a date before they think to hover anything.
  const days = reconciledAgeDays(source.checked);
  const stale = isStale(days);
  const age = formatAge(days);
  const tooltip = [
    source.citation,
    source.provision ? `Provision: ${source.provision}` : null,
    `${EVIDENCE_TIER_LABEL[source.tier]} — ${EVIDENCE_TIER_DESCRIPTION[source.tier]}`,
    `Last reconciled ${source.checked} (${age})`,
    stale ? `Not re-checked in over ${Math.round(STALE_AFTER_DAYS / 30.44)} months — treat the date as unverified until it is.` : null,
    source.note,
  ]
    .filter(Boolean)
    .join('\n');

  const body = (
    <>
      <Icon size={10} aria-hidden="true" />
      <span className="font-semibold">{EVIDENCE_TIER_LABEL[source.tier]}</span>
      {source.provision && <span className="font-mono opacity-80">{source.provision}</span>}
      <span className={stale ? 'font-semibold' : 'opacity-80'}>
        {stale ? `stale · reconciled ${age}` : `reconciled ${age}`}
      </span>
      {source.url && <ExternalLink size={9} aria-hidden="true" />}
    </>
  );

  // Stale is amber, never red: it means "re-check me", not "this is wrong".
  const tone = stale ? 'border-amber-400 bg-amber-50 text-amber-900' : TIER_CLASS[source.tier];
  const className = `inline-flex items-center gap-1 text-[0.6rem] px-1.5 py-0.5 rounded border ${tone}`;

  if (!source.url) {
    return (
      <span className={className} title={tooltip}>
        {body}
      </span>
    );
  }

  return (
    <a
      href={source.url}
      target="_blank"
      rel="noreferrer noopener"
      className={`${className} hover:underline`}
      title={tooltip}
      aria-label={`Source: ${source.citation}${source.provision ? `, ${source.provision}` : ''}, last reconciled ${age}${stale ? ', stale' : ''} (opens in a new tab)`}
    >
      {body}
    </a>
  );
}
