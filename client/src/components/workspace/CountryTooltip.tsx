import { COUNTRY_AI_LAWS, FRAMEWORKS } from '@/data/governance';
import { type MetricId, binFor, describeMetric, metricById } from '@/lib/countryMetrics';

export interface HoverState {
  country: string;
  /** Pointer position inside the map container, px. */
  x: number;
  y: number;
}

/**
 * What the pointer is over: the country, its law in one line, and the value of
 * the metric the map is coloured by. Follows the pointer, flips to the other
 * side near the right and bottom edges so it is never clipped, and takes no
 * pointer events, so it can never get between the reader and the map.
 */
export default function CountryTooltip({
  hover,
  metric,
  width,
  height,
}: {
  hover: HoverState;
  metric: MetricId;
  width: number;
  height: number;
}) {
  const law = COUNTRY_AI_LAWS.find((c) => c.name === hover.country);
  const framework = law?.frameworkSlug ? FRAMEWORKS.find((f) => f.slug === law.frameworkSlug) : undefined;
  const status = !law
    ? 'Not yet researched'
    : law.status === 'binding'
      ? framework?.name ?? 'Binding national AI law'
      : 'No binding national AI law';

  const def = metricById(metric);
  const value = metric === 'law' ? null : describeMetric(metric, hover.country);
  const bin = value ? binFor(def, value.value) : null;

  const W = 240;
  const flipX = hover.x + 16 + W > width;
  const flipY = hover.y + 110 > height;
  const left = flipX ? hover.x - W - 12 : hover.x + 16;
  const top = flipY ? hover.y - 96 : hover.y + 14;

  return (
    <div
      role="tooltip"
      className="pointer-events-none absolute z-20 rounded-md border border-white/15 bg-[#0b1220]/95 px-3 py-2 shadow-xl backdrop-blur-sm"
      style={{ left, top, width: W, transition: 'left 60ms linear, top 60ms linear' }}
    >
      <p className="text-sm font-semibold text-white leading-tight">{hover.country}</p>
      <p className="mt-0.5 text-[0.72rem] text-white/70 leading-snug">{status}</p>
      {value ? (
        <div className="mt-2 flex items-center gap-2 border-t border-white/10 pt-2">
          {bin ? (
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 flex-shrink-0 rounded-[2px] border border-black/20"
              style={{ backgroundColor: bin.color }}
            />
          ) : null}
          <span className="text-[0.75rem] text-white/90 leading-snug">
            <span className="text-white/60">{def.label}: </span>
            {value.display}
          </span>
        </div>
      ) : null}
      <p className="mt-1.5 text-[0.68rem] text-white/50">Click for details</p>
    </div>
  );
}
