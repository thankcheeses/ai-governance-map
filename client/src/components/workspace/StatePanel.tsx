import { X } from 'lucide-react';
import { daysUntil } from '@/data/governance';
import { stateProfile } from '@/data/stateLaw';
import SourceChip from '@/components/dashboard/SourceChip';

/**
 * One US state: its own instruments first, then the federal ones that apply
 * there anyway. A state with nothing in the register says exactly that — a gap
 * in this register, not a finding that the state has no AI law.
 */
export default function StatePanel({ state, onClose }: { state: string; onClose: () => void }) {
  const profile = stateProfile(state);
  if (!profile) return null;
  const { instruments, obligations, federal } = profile;

  const next = obligations
    .filter((o) => /^\d{4}-\d{2}-\d{2}$/.test(o.effective))
    .map((o) => ({ o, days: daysUntil(o.effective) }))
    .filter((d) => d.days > 0)
    .sort((a, b) => a.days - b.days)[0];

  return (
    <div className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[0.6rem] font-semibold uppercase tracking-widest text-muted-foreground">
            US state · {profile.postalCode}
          </p>
          <h2 className="text-base font-semibold text-foreground">{profile.name}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {instruments.length > 0
              ? `${instruments.length} state-level instrument${instruments.length === 1 ? '' : 's'} in this register`
              : 'No state-level instrument in this register yet'}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close state panel"
          className="p-1 text-muted-foreground hover:text-foreground"
        >
          <X size={16} />
        </button>
      </div>

      {instruments.length === 0 && (
        <p className="text-xs text-muted-foreground leading-relaxed mt-4 border border-dashed border-border rounded-md p-3">
          This register tracks broad AI statutes. {profile.name} may still have narrower AI
          provisions — election deepfakes, synthetic intimate images, government use — that are not
          recorded here. Treat this as unknown, not as an absence of law.
        </p>
      )}

      {instruments.map((f) => (
        <section key={f.slug} className="mt-4">
          <p className="text-[0.6rem] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
            {f.jurisdiction.toLowerCase().includes('city') ? 'City instrument' : 'State instrument'}
          </p>
          <p className="text-sm font-medium text-foreground">{f.name}</p>
          <p className="text-[0.65rem] font-mono text-muted-foreground mt-0.5">
            {f.type} · {f.version}
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed mt-1.5">{f.summary}</p>
        </section>
      ))}

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
          </div>
        </section>
      )}

      {obligations.length > 0 && (
        <section className="mt-4">
          <p className="text-[0.6rem] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
            Obligations · {obligations.length}
          </p>
          <ul className="flex flex-col divide-y divide-border border-t border-border">
            {obligations.map((o) => (
              <li key={o.id} className="py-2">
                <p className="text-xs text-foreground leading-snug">{o.title}</p>
                <p className="text-[0.7rem] text-muted-foreground leading-snug mt-0.5">{o.summary}</p>
                <div className="flex items-center gap-2 flex-wrap mt-1">
                  <span className="text-[0.6rem] font-mono text-muted-foreground">
                    {o.type} · {o.effective}
                  </span>
                  <SourceChip source={o.source} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {federal.length > 0 && (
        <section className="mt-5">
          <p className="text-[0.6rem] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
            Also applies here · federal
          </p>
          <ul className="flex flex-col gap-1">
            {federal.map((f) => (
              <li key={f.slug} className="text-xs text-muted-foreground leading-snug">
                <span className="text-foreground">{f.name}</span> — {f.version}
              </li>
            ))}
          </ul>
          <p className="text-[0.65rem] text-muted-foreground mt-2 leading-relaxed">
            Sector rules: whether they reach your system depends on what it does, not where it is.
          </p>
        </section>
      )}
    </div>
  );
}
