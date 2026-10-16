import { MapPin, MapPinOff } from 'lucide-react';
import { FRAMEWORKS } from '@/data/governance';
import { PLACE_KIND_LABEL, type GovernancePlace } from '@/data/places';
import SourceChip from './SourceChip';

/**
 * One institution on the governance-geography layer. The "relation" line is the
 * point of the card: it says what this body has to do with the register, so a
 * reader never infers authority from a pin being near something.
 */
export default function PlaceCard({ place, onClose }: { place: GovernancePlace; onClose?: () => void }) {
  const frameworks = FRAMEWORKS.filter((f) => place.frameworkSlugs.includes(f.slug));
  const located = typeof place.lat === 'number' && typeof place.lon === 'number';

  return (
    <div className="border border-border bg-card rounded-md p-4 text-left">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[0.6rem] font-medium uppercase tracking-widest text-muted-foreground">
            {PLACE_KIND_LABEL[place.kind]}
          </p>
          <h3 className="text-sm font-semibold text-foreground mt-0.5">{place.name}</h3>
          {place.site && <p className="text-xs text-muted-foreground">{place.site}</p>}
        </div>
        {onClose && (
          <button type="button" onClick={onClose} className="text-[0.65rem] text-muted-foreground hover:text-foreground">
            Close
          </button>
        )}
      </div>

      <p className="text-xs text-foreground leading-relaxed mt-2">{place.role}</p>

      <dl className="mt-3 flex flex-col gap-1.5 text-[0.7rem]">
        <div className="flex gap-2">
          <dt className="text-muted-foreground w-20 flex-shrink-0">Address</dt>
          <dd className="text-foreground">
            {place.address}, {place.country}
          </dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-muted-foreground w-20 flex-shrink-0">Location</dt>
          <dd className={located ? 'text-foreground font-mono' : 'text-muted-foreground'}>
            {located ? (
              <span className="inline-flex items-center gap-1">
                <MapPin size={11} aria-hidden="true" />
                {place.lat!.toFixed(5)}, {place.lon!.toFixed(5)}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1">
                <MapPinOff size={11} aria-hidden="true" />
                Not verified — listed without a map pin
              </span>
            )}
          </dd>
        </div>
      </dl>

      {/* Why this place is in a governance register at all. */}
      <p className="text-[0.7rem] text-muted-foreground leading-relaxed mt-3 border-l-2 border-border pl-3">
        <span className="uppercase tracking-widest text-[0.6rem] text-foreground mr-1.5">Relation</span>
        {place.relation}
      </p>

      {frameworks.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap mt-3">
          {frameworks.map((f) => (
            <span
              key={f.slug}
              className="text-[0.6rem] font-mono px-1.5 py-0.5 rounded border border-border text-muted-foreground"
            >
              {f.shortCode} · {f.name}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 flex-wrap mt-3 pt-3 border-t border-border">
        <SourceChip source={place.source} />
        {place.coordSource && <SourceChip source={place.coordSource} />}
      </div>
    </div>
  );
}
