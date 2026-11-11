// ---------------------------------------------------------------------------
// One ink set for every layer on the map.
//
// The globe is a night globe: a deep-navy sea, slate land, and law drawn in
// light. An earlier version printed dark inks on sand-coloured land, which
// read as a paper cut-out floating in space — flat, and at odds with the dark
// workspace around it. Here the map is made of the same night as its chrome,
// and the only bright things on it are the things the register knows.
//
//  - **Ground.** `OCEAN` is the sea. `LAND_PAPER` is land nobody has
//    researched: one step above the sea, so continents read without claiming
//    anything. `PAPER` is a country that was checked and has no binding
//    national law: one more step up, visibly "looked at", still unlit. Every
//    metric's "none" bin is that same tone.
//  - **Inks.** Each instrument is a light. All six (five national laws plus US
//    state law) share one OKLCH chroma (0.14) and sit on one lightness ramp
//    from L 0.60 to L 0.87, so none shouts over another and they still
//    separate in greyscale. Edges are the same hue, lighter, for the keyline.
//  - **Ramps.** The two metric ramps are interpolated in OKLab from `PAPER` to
//    an ink already on the map: cool ramps end in the EU blue, the deadline
//    ramp ends in the coral. "More" and "sooner" read brighter.
//  - **Chrome.** The cards, switcher and tooltip share one surface, and
//    `ACCENT` marks what is selected or checked.
//
// (`LAND_PAPER` and `PAPER` keep their names from the printed-atlas version;
// they are the two ground tones, whatever the ground is made of.)
//
// Values were generated, not picked by eye; lawPalette.test.ts holds the
// separation floors.
// ---------------------------------------------------------------------------

/** The sea. */
export const OCEAN = '#0B1930';
/** Bare land: a country nobody has researched yet. */
export const LAND_PAPER = '#233048';
/** Checked, nothing binding. Also every metric's "none" bin. */
export const PAPER = '#3B4A66';

export const INK = {
  eu: { color: '#4081D2', edge: '#6A9EE0' },
  vietnam: { color: '#D871A1', edge: '#EB96BC' },
  china: { color: '#F68F5F', edge: '#FFB38D' },
  korea: { color: '#C8AEFF', edge: '#E3CFFF' },
  india: { color: '#B9E67E', edge: '#D9FDAC' },
  /** US state statutes: sub-national, so its own gold, on its own row. */
  state: { color: '#F0C551', edge: '#FFE48E' },
} as const;

/** PAPER → EU ink, five steps. "More" reads brighter. */
export const RAMP_COOL = ['#3B4A66', '#3E5780', '#3F659A', '#4073B6', '#4081D2'] as const;
/** PAPER → coral ink, five steps. "Sooner" reads brighter. */
export const RAMP_WARM = ['#3B4A66', '#695D69', '#976F69', '#C67F66', '#F68F5F'] as const;

/** Selected and checked controls. */
export const ACCENT = '#E6EDF7';
/** Borders between countries, and anything else drawn as a hairline on land. */
export const HAIRLINE = 'rgba(203,213,225,0.26)';

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
