import { X } from 'lucide-react';
import { COUNTRY_AI_LAWS, FRAMEWORKS, OBLIGATIONS, daysUntil } from '@/data/governance';
import { GOVERNANCE_PLACES } from '@/data/places';
import SourceChip from '@/components/dashboard/SourceChip';

const STATUS_COPY: Record<string, string> = {
  binding: 'Binding AI-specific law in effect',
  none: 'Researched — no binding AI-specific law',
};

/**
 * What the map can honestly say about one jurisdiction. Three states are kept
 * apart: a binding instrument, a researched absence, and "not yet researched".
 * The third is a gap in this register, not a finding about the country, and the
 * copy says so rather than letting blank read as "no law".
 */
export default function CountryPanel({ country, onClose }: { country: string; onClose: () => void }) {
  const law = COUNTRY_AI_LAWS.find((c) => c.name === country);
  const framework = law?.frameworkSlug ? FRAMEWORKS.find((f) => f.slug === law.frameworkSlug) : undefined;
  const obligations = framework ? OBLIGATIONS.filter((o) => o.framework === framework.shortCode) : [];
  const places = GOVERNANCE_PLACES.filter((p) => p.country === country);

  const dated = obligations
    .filter((o) => /^\d{4}-\d{2}-\d{2}$/.test(o.effective))
    .map((o) => ({ o, days: daysUntil(o.effective) }))
    .sort((a, b) => a.days - b.days);
  const next = dated.find((d) => d.days > 0);

  return (
    <div className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-foreground">{country}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {law ? STATUS_COPY[law.status] : 'Not yet researched in this register'}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close jurisdiction panel"
          className="p-1 text-muted-foreground hover:text-foreground"
        >
          <X size={16} />
        </button>
      </div>

      {country === 'United States of America' && (
        <p className="text-xs text-foreground leading-relaxed mt-4 border border-border rounded-md p-3">
          There is no national AI statute, but states legislate on their own. Click a state on the
          map, or search it by name, to see that state’s instruments and the federal rules that
          apply there.
        </p>
      )}

      {!law && (
        <p className="text-xs text-muted-foreground leading-relaxed mt-4 border border-dashed border-border rounded-md p-3">
          This register has not researched {country}. That is a gap here, not a finding about the
          country — treat it as unknown rather than as an absence of law.
        </p>
      )}

      {framework && (
        <section className="mt-4">
          <p className="text-[0.6rem] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
            Instrument
          </p>
          <p className="text-sm font-medium text-foreground">{framework.name}</p>
          <p className="text-[0.65rem] font-mono text-muted-foreground mt-0.5">{framework.version}</p>
          <p className="text-xs text-muted-foreground leading-relaxed mt-1.5">{framework.summary}</p>
        </section>
      )}

      {next && (
        <section className="mt-4">
          <p className="text-[0.6rem] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
            Next clock
          </p>
          <div className="border border-border rounded-md p-2.5">
            <p className="text-xs font-medium text-foreground">{next.o.title}</p>
            <p className="text-[0.65rem] font-mono text-muted-foreground mt-0.5">
              {next.o.effective} · {next.days}d
            </p>
            <div className="mt-1.5">
              <SourceChip source={next.o.source} />
            </div>
          </div>
        </section>
      )}

      {obligations.length > 0 && (
        <section className="mt-4">
          <p className="text-[0.6rem] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
            Obligations · {obligations.length}
          </p>
          <ul className="flex flex-col divide-y divide-border border-t border-border">
            {obligations.slice(0, 8).map((o) => (
              <li key={o.id} className="py-2">
                <p className="text-xs text-foreground leading-snug">{o.title}</p>
                <div className="flex items-center gap-2 flex-wrap mt-1">
                  <span className="text-[0.6rem] font-mono text-muted-foreground">
                    {o.type} · {o.effective}
                  </span>
                  <SourceChip source={o.source} />
                </div>
              </li>
            ))}
          </ul>
          {obligations.length > 8 && (
            <p className="text-[0.65rem] text-muted-foreground mt-2">
              {obligations.length - 8} more in the full register.
            </p>
          )}
        </section>
      )}

      {places.length > 0 && (
        <section className="mt-4">
          <p className="text-[0.6rem] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
            Institutions here
          </p>
          {places.map((p) => (
            <p key={p.id} className="text-xs text-muted-foreground leading-snug">
              <span className="text-foreground">{p.name}</span> — {p.city}
            </p>
          ))}
        </section>
      )}
    </div>
  );
}
