import { X, ExternalLink } from 'lucide-react';

// ---------------------------------------------------------------------------
// The thing in the deep water.
//
// Zoom far enough into open ocean — away from any coast, which the coastal
// proximity field already knows how to tell — and this surfaces. It is the
// only part of this map that is not governance data, so it is held to two
// rules: it must be genuinely hard to reach by accident, and it must be
// dismissible and never come back in the same session.
//
// ON THE CONTENT. Everything below is a fact this repository already states
// somewhere else — the NHID-Clinical description and docket number come from
// the framework register, the counts from the data files. Nothing about a
// career, a title, an employer, a certification or a date of anything is
// invented here, because making up a line on a real person's résumé is worse
// than making up a line of law. The two fields marked EDIT ME are left for
// their author to write; until then the card simply does not show them.
// ---------------------------------------------------------------------------

export interface DeepOceanCard {
  name: string;
  /** EDIT ME — one line. Rendered only when non-empty. */
  headline: string;
  /** EDIT ME — two or three sentences at most. Rendered only when non-empty. */
  about: string;
  facts: { label: string; value: string }[];
  links: { label: string; href: string }[];
}

export const DEEP_OCEAN_CARD: DeepOceanCard = {
  name: 'Brianna Baynard',
  headline: '',
  about: '',
  facts: [
    {
      label: 'NHID-Clinical',
      value:
        'Open voluntary proposal and reference implementation for transparent AI voice agents in healthcare. Not a product, not a certification, not an organisation.',
    },
    {
      label: 'Filed',
      value: 'Public comment NIST-2025-0035-0026 · CC BY 4.0',
    },
    {
      label: 'This map',
      value:
        '31 frameworks · 27 CCM-mapped controls · 75 dated obligations · runs entirely in your browser',
    },
  ],
  links: [
    { label: 'nhid-clinical.org', href: 'https://nhid-clinical.org/' },
    { label: 'Specification v1.3', href: 'https://nhid-clinical.org/specification.html' },
    { label: 'github.com/NHID-Clinical', href: 'https://github.com/NHID-Clinical' },
  ],
};

/**
 * Whether the card has anything worth finding. A résumé card with the résumé
 * missing is half a thing, and a half-finished surface on a tool whose whole
 * argument is auditability costs more than it earns — so until both fields are
 * written, the easter egg simply does not exist.
 */
export const deepOceanReady = (card: DeepOceanCard = DEEP_OCEAN_CARD) =>
  card.headline.trim().length > 0 && card.about.trim().length > 0;

export default function DeepOcean({ onClose }: { onClose: () => void }) {
  const card = DEEP_OCEAN_CARD;
  return (
    <aside
      aria-label="Deep ocean"
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[22rem] max-w-[calc(100%-2rem)] z-30 bg-[#06121c]/95 border border-[#2dd4bf]/30 rounded-lg p-5 shadow-2xl"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-2 right-2 text-white/70 hover:text-white"
      >
        <X size={14} aria-hidden="true" />
      </button>

      <p className="text-[0.72rem] font-semibold uppercase tracking-widest text-[#5EEAD4] mb-1">
        You found the bottom
      </p>
      <p className="text-base font-semibold text-white leading-tight">{card.name}</p>
      {card.headline && (
        <p className="text-[0.8rem] text-white/85 leading-snug mt-1">{card.headline}</p>
      )}
      {card.about && (
        <p className="text-[0.78rem] text-white/75 leading-relaxed mt-2">{card.about}</p>
      )}

      <dl className="mt-3 flex flex-col gap-2">
        {card.facts.map((f) => (
          <div key={f.label}>
            <dt className="text-[0.7rem] font-semibold uppercase tracking-widest text-white/70">
              {f.label}
            </dt>
            <dd className="text-[0.78rem] text-white/85 leading-snug">{f.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-3 pt-3 border-t border-white/10 flex flex-col gap-1">
        {card.links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1.5 text-[0.78rem] text-[#5EEAD4] hover:underline"
          >
            <ExternalLink size={10} aria-hidden="true" />
            {l.label}
          </a>
        ))}
      </div>
    </aside>
  );
}
