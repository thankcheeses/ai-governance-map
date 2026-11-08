import { useMemo } from 'react';
import { COUNTRY_AI_LAWS } from '@/data/governance';
import { METRICS, type MetricDef, type MetricId, binFor, metricValue } from '@/lib/countryMetrics';
import { LAND_PAPER } from '@/lib/lawPalette';
import { MAP_CARD, MAP_CARD_HEADING, PAPER } from '@/lib/mapInk';
import { Swatch } from './GlobeLegend';

/**
 * "Colour by": the choropleth's metric switcher.
 *
 * A radio group rather than a dropdown, because there are five metrics and
 * seeing all five at once is how a reader learns what the map can answer.
 * It scrolls sideways on a narrow screen instead of wrapping, so it stays one
 * line over the map.
 */
export function MetricSwitcher({ value, onChange }: { value: MetricId; onChange: (id: MetricId) => void }) {
  return (
    <div
      role="radiogroup"
      aria-label="Colour countries by"
      className={`${MAP_CARD} flex items-center gap-1 p-1 max-w-full overflow-x-auto`}
    >
      <span className={`${MAP_CARD_HEADING} px-2 whitespace-nowrap`}>
        Colour by
      </span>
      {METRICS.map((m) => {
        const on = m.id === value;
        return (
          <button
            key={m.id}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(m.id)}
            // The selected metric is "printed" in paper, the same material as
            // the checked layers and the land itself.
            style={on ? { backgroundColor: PAPER } : undefined}
            className={`whitespace-nowrap rounded-md px-2.5 py-1 text-xs transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 ${
              on ? 'text-[#0b1220] font-semibold' : 'text-white/75 hover:text-white hover:bg-white/10'
            }`}
          >
            {m.label}
          </button>
        );
      })}
    </div>
  );
}

/**
 * The key for a numeric metric: the question it answers, where the numbers
 * come from, each bin with how many countries fall in it, and the
 * not-researched swatch last, worded so blank never reads as zero.
 * Renders bare: the map card it sits in supplies the surface.
 */
export function MetricLegend({ def }: { def: MetricDef }) {
  const counts = useMemo(() => {
    const out = new Map<string, number>();
    for (const c of COUNTRY_AI_LAWS) {
      const bin = binFor(def, metricValue(def.id, c.name));
      if (bin) out.set(bin.label, (out.get(bin.label) ?? 0) + 1);
    }
    return out;
  }, [def]);

  // Highest bin first: the eye reads a key top-down as "most" to "least".
  const bins = [...def.bins].reverse();

  return (
    <div>
      <p className={`${MAP_CARD_HEADING} mb-1`}>{def.question}</p>
      <p className="text-[0.72rem] text-white/70 leading-snug mb-2">{def.basis}</p>
      <ul className="flex flex-col gap-1">
        {bins.map((b) => (
          <li key={b.label} className="flex items-start gap-2">
            <Swatch color={b.color} />
            <span className="flex-1 text-[0.75rem] text-white/90 leading-snug">{b.label}</span>
            <span className="text-[0.72rem] tabular-nums text-white/60">{counts.get(b.label) ?? 0}</span>
          </li>
        ))}
        <li className="flex items-start gap-2 mt-1 pt-1.5 border-t border-white/10">
          <Swatch color={LAND_PAPER} />
          <span className="min-w-0">
            <span className="block text-[0.75rem] text-white/90 leading-snug">Not yet researched</span>
            <span className="block text-[0.72rem] text-white/70 leading-snug">A gap in this register — not a zero.</span>
          </span>
        </li>
      </ul>
      <p className="mt-2 text-[0.68rem] text-white/55 leading-snug">
        Derived from the register’s cited entries. Counts are countries.
      </p>
    </div>
  );
}
