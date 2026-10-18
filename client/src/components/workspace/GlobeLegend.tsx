import { LAND_PAPER, LAW_FAMILIES } from '@/lib/lawPalette';
import { BINDING_STATES, STATE_BINDING_COLOR } from '@/hooks/useStatesLayer';

/**
 * What the colours on the globe mean.
 *
 * A seven-colour map without a key is decoration. This is the key, and it sits
 * on the map rather than behind a toggle, because a reader who has to go
 * looking for it has already guessed wrong.
 *
 * Two entries carry a `note`, and both exist to stop a colour lying:
 * grey means "checked, no binding *national* law" — not "nothing is happening
 * here", which the state register would contradict — and the dimmest swatch
 * means "nobody has checked", not "no law exists".
 */
/**
 * Each swatch is shown as it appears on the map: ink on a chip of the land
 * paper. Dark inks laid straight onto this dark panel disappeared.
 */
function Swatch({ color }: { color: string }) {
  return (
    <span
      aria-hidden="true"
      className="mt-[0.2rem] flex-shrink-0 rounded-[3px] p-[2px]"
      style={{ backgroundColor: LAND_PAPER }}
    >
      <span className="block w-2.5 h-2.5 rounded-[2px] border border-black/15" style={{ backgroundColor: color }} />
    </span>
  );
}

export default function GlobeLegend() {
  return (
    <div className="bg-[#0b1220]/92 border border-white/12 rounded-md p-3">
      <p className="text-[0.72rem] font-semibold uppercase tracking-widest text-white/75 mb-1">
        Binding national AI law
      </p>
      <p className="text-[0.72rem] text-white/70 leading-snug mb-2">
        Colour says which instrument binds the country.
      </p>
      <ul className="flex flex-col gap-1">
        {LAW_FAMILIES.map((f) => (
          <li key={f.id} className="flex items-start gap-2">
            <Swatch color={f.color} />
            <span className="min-w-0">
              <span className="block text-[0.75rem] text-white/90 leading-snug">{f.label}</span>
              {f.note && (
                <span className="block text-[0.72rem] text-white/70 leading-snug">{f.note}</span>
              )}
            </span>
          </li>
        ))}
      </ul>

      {/* Kept as its own group on purpose. A state statute and the EU AI Act
          are not the same kind of instrument, and folding them into one scale
          would imply they are. */}
      <div className="mt-3 pt-3 border-t border-white/10">
        <p className="text-[0.72rem] font-semibold uppercase tracking-widest text-white/75 mb-1.5">
          US state law
        </p>
        <div className="flex items-start gap-2">
          <Swatch color={STATE_BINDING_COLOR} />
          <span className="min-w-0">
            <span className="block text-[0.75rem] text-white/90 leading-snug">
              Binding state statute ({BINDING_STATES.length})
            </span>
            <span className="block text-[0.72rem] text-white/70 leading-snug">
              {BINDING_STATES.map((s) => s.postalCode).join(' · ')}. Click a state for the
              instrument.
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
