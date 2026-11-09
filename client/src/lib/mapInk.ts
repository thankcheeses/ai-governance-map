// ---------------------------------------------------------------------------
// One ink set for every layer on the map.
//
// The map used to pick its colours layer by layer: five law colours chosen one
// at a time, an amber for US states, a blue ramp and a rust ramp for the
// metrics, and a teal accent on the controls. Each was reasonable alone; side
// by side they read as five different maps stacked on top of each other.
//
// Everything now comes from here:
//
//  - **Paper.** Land is sand paper (`LAND_PAPER`); a country that was checked
//    and has no binding national law is the lighter `PAPER`. Every metric's
//    "none" bin is that same paper, so "checked, nothing" looks the same
//    whichever way the map is coloured.
//  - **Inks.** Each instrument is an ink printed on that paper. All six inks
//    (five national laws plus US state law) share one OKLCH chroma (0.105;
//    0.12 for the state ochre, which sits on the lighter paper) and sit on one
//    lightness ramp from L 0.36 to L 0.70, so no instrument shouts louder than
//    another and they still separate in greyscale. Edges are the same hue
//    12 lightness points darker.
//  - **Ramps.** The two metric ramps are interpolated in OKLab from `PAPER` to
//    an ink already on the map: cool ramps end in the EU ink, the deadline
//    ramp ends in the rust ink. A metric map is the law map's own inks,
//    thinned with paper.
//  - **Chrome.** The cards, switcher and tooltip share one surface and use
//    `PAPER` as their selected/checked accent, so the controls are visibly
//    made of the same material as the map.
//
// Values were generated, not picked by eye; the script's rules are the
// comments above, and lawPalette.test.ts holds the separation floors.
// ---------------------------------------------------------------------------

/** Bare land: a country nobody has researched yet. */
export const LAND_PAPER = '#CBC4B3';
/** Checked, nothing binding. Also every metric's "none" bin. */
export const PAPER = '#EEE9DD';

export const INK = {
  eu: { color: '#1C3A73', edge: '#011950' },
  vietnam: { color: '#793456', edge: '#551136' },
  china: { color: '#954B34', edge: '#6F2912' },
  korea: { color: '#796BB0', edge: '#57488A' },
  india: { color: '#869546', edge: '#647120' },
  /** US state statutes: sub-national, so the lightest ink, on its own row. */
  state: { color: '#C7943C', edge: '#9C7225' },
} as const;

/** PAPER → EU ink, five steps. "More" reads darker. */
export const RAMP_COOL = ['#EEE9DD', '#B5BBC4', '#7F8FAA', '#4C648F', '#1C3A73'] as const;
/** PAPER → rust ink, five steps. "Sooner" reads darker. */
export const RAMP_WARM = ['#EEE9DD', '#DAC0B1', '#C49986', '#AD725D', '#954B34'] as const;

/** Night panel the map's controls sit on. */
export const CHROME_SURFACE = '#0b1220';

/**
 * The one card treatment for anything floating over the map: layers, legend,
 * colour-by switcher, tooltip. Change it here, not per component.
 */
export const MAP_CARD =
  'bg-[#0b1220]/92 border border-white/12 rounded-lg shadow-lg backdrop-blur-sm';

/** Section heading inside a map card. */
export const MAP_CARD_HEADING =
  'text-[0.68rem] font-semibold uppercase tracking-widest text-white/70';
