import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Link } from 'wouter';
import { Grid3x3, Layers, ListTree, Search, X } from 'lucide-react';
import { COUNTRY_AI_LAWS } from '@/data/governance';
import { GOVERNANCE_PLACES } from '@/data/places';
import { GLOBE_SKY, SPACE, buildGlobeStyle } from '@/lib/globeStyle';
import { useGlobeData } from '@/hooks/useGlobeData';
import { useGovernanceState } from '@/hooks/useGovernanceState';
import PlaceCard from '@/components/dashboard/PlaceCard';
import CountryPanel from '@/components/workspace/CountryPanel';
import RiskMatrix from '@/components/dashboard/RiskMatrix';

// ---------------------------------------------------------------------------
// The map workspace
//
// The globe is the application, not a figure inside one. Everything else —
// layers, search, the matrix — is a state of the map rather than a section
// below it, and the chrome stays out of the way until asked for.
//
// The full scrolling register is not removed; it is one click away. A globe
// cannot honestly carry every governance concept (a standard has no borders),
// so the register remains the place where non-geographic material lives.
// ---------------------------------------------------------------------------

type Selection = { kind: 'country'; id: string } | { kind: 'place'; id: string } | null;

export default function MapWorkspace() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const globeData = useGlobeData();
  const { controlState } = useGovernanceState();

  const [selection, setSelection] = useState<Selection>(null);
  const [placesOn, setPlacesOn] = useState(true);
  const [reliefOn, setReliefOn] = useState(true);
  const [analysisOpen, setAnalysisOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [ready, setReady] = useState(false);

  const flyTo = useCallback((lon: number, lat: number, zoom = 4) => {
    map.current?.flyTo({ center: [lon, lat], zoom, duration: 1400, essential: true });
  }, []);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const m = new maplibregl.Map({
      container: mapContainer.current,
      style: buildGlobeStyle(globeData),
      center: [-20, 20],
      zoom: 1.95,
      minZoom: 0.8,
      maxZoom: 7,
      // Flat at world view so the globe sits centred; tilt is for close inspection.
      pitch: 0,
      maxPitch: 75,
      renderWorldCopies: false,
      attributionControl: { compact: true },
    });
    map.current = m;

    m.on('style.load', () => {
      m.setProjection({ type: 'globe' });
      m.setSky({ ...GLOBE_SKY } as never);
      setReady(true);
    });
    m.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right');

    // The container is a flex child, so its height is not final when the map is
    // constructed — without this the canvas initialises at zero size and the
    // globe never paints. Observing beats a one-shot resize because the drawer
    // and panels change the box afterwards too.
    const ro = new ResizeObserver(() => m.resize());
    ro.observe(mapContainer.current);

    let hovered: string | number | undefined;
    const clearHover = () => {
      if (hovered !== undefined) {
        m.setFeatureState({ source: 'countries', id: hovered }, { hover: false });
        hovered = undefined;
      }
    };
    m.on('mousemove', 'country-fill', (e) => {
      const f = e.features?.[0];
      if (!f || f.id === hovered) return;
      clearHover();
      hovered = f.id;
      m.setFeatureState({ source: 'countries', id: hovered }, { hover: true });
      m.getCanvas().style.cursor = 'pointer';
    });
    m.on('mouseleave', 'country-fill', () => {
      clearHover();
      m.getCanvas().style.cursor = '';
    });
    m.on('mouseenter', 'place-dot', () => { m.getCanvas().style.cursor = 'pointer'; });
    m.on('mouseleave', 'place-dot', () => { m.getCanvas().style.cursor = ''; });

    // Pins sit above countries, so this runs first and suppresses the country click.
    m.on('click', 'place-dot', (e) => {
      const id = e.features?.[0]?.properties?.id as string | undefined;
      if (!id) return;
      e.preventDefault();
      setSelection({ kind: 'place', id });
    });
    m.on('click', 'country-fill', (e) => {
      if (e.defaultPrevented) return;
      const name = e.features?.[0]?.properties?.name as string | undefined;
      if (!name) return;
      setSelection((prev) => (prev?.kind === 'country' && prev.id === name ? null : { kind: 'country', id: name }));
    });

    return () => {
      ro.disconnect();
      m.remove();
      map.current = null;
      setReady(false);
    };
  }, [globeData]);

  useEffect(() => {
    const m = map.current;
    if (!ready || !m) return;
    for (const id of ['place-halo', 'place-dot', 'place-label']) {
      if (m.getLayer(id)) m.setLayoutProperty(id, 'visibility', placesOn ? 'visible' : 'none');
    }
    if (!placesOn) setSelection((prev) => (prev?.kind === 'place' ? null : prev));
  }, [placesOn, ready]);

  useEffect(() => {
    const m = map.current;
    if (!ready || !m || !m.getLayer('country-extrusion')) return;
    m.setLayoutProperty('country-extrusion', 'visibility', reliefOn ? 'visible' : 'none');
  }, [reliefOn, ready]);

  // Search spans both kinds of thing the globe can hold: jurisdictions and
  // institutions. A standard with no borders is deliberately not in here.
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    const countries = COUNTRY_AI_LAWS.filter((c) => c.name.toLowerCase().includes(q))
      .slice(0, 5)
      .map((c) => ({ kind: 'country' as const, id: c.name, label: c.name, sub: c.status === 'binding' ? 'Binding AI law' : 'No binding AI law' }));
    const places = GOVERNANCE_PLACES.filter(
      (p) => p.name.toLowerCase().includes(q) || p.city.toLowerCase().includes(q),
    )
      .slice(0, 5)
      .map((p) => ({ kind: 'place' as const, id: p.id, label: p.name, sub: `${p.city}, ${p.country}` }));
    return [...places, ...countries];
  }, [query]);

  const openResult = (r: { kind: 'country' | 'place'; id: string }) => {
    setSelection({ kind: r.kind, id: r.id } as Selection);
    setQuery('');
    if (r.kind === 'place') {
      const p = GOVERNANCE_PLACES.find((x) => x.id === r.id);
      if (p && typeof p.lat === 'number' && typeof p.lon === 'number') flyTo(p.lon, p.lat, 4.5);
    }
  };

  const selectedPlace = selection?.kind === 'place' ? GOVERNANCE_PLACES.find((p) => p.id === selection.id) : undefined;
  const unpinned = GOVERNANCE_PLACES.filter((p) => typeof p.lat !== 'number');

  return (
    <div className="fixed inset-0 flex flex-col" style={{ background: SPACE }}>
      <header className="flex items-center gap-3 px-4 h-12 border-b border-white/10 flex-shrink-0 z-20">
        <p className="text-xs font-semibold tracking-widest uppercase text-white/80 whitespace-nowrap">
          AI Governance Map
        </p>

        <div className="relative flex-1 max-w-sm">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/40" aria-hidden="true" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a jurisdiction or institution"
            aria-label="Search a jurisdiction or institution"
            className="w-full bg-white/5 border border-white/15 rounded-md pl-7 pr-2 py-1 text-xs text-white placeholder:text-white/35 focus:outline-none focus:border-white/40"
          />
          {results.length > 0 && (
            <ul className="absolute top-full left-0 right-0 mt-1 bg-[#0b1220] border border-white/15 rounded-md overflow-hidden z-30">
              {results.map((r) => (
                <li key={`${r.kind}-${r.id}`}>
                  <button
                    type="button"
                    onClick={() => openResult(r)}
                    className="w-full text-left px-2.5 py-1.5 hover:bg-white/10"
                  >
                    <span className="block text-xs text-white">{r.label}</span>
                    <span className="block text-[0.65rem] text-white/45">{r.sub}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setAnalysisOpen((v) => !v)}
            aria-pressed={analysisOpen}
            className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md border ${
              analysisOpen ? 'bg-white text-[#0b1220] border-white' : 'border-white/20 text-white/70 hover:text-white'
            }`}
          >
            <Grid3x3 size={12} aria-hidden="true" /> Analysis
          </button>
          <Link
            href="/register"
            className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md border border-white/20 text-white/70 hover:text-white"
          >
            <ListTree size={12} aria-hidden="true" /> Full register
          </Link>
        </div>
      </header>

      <div className="relative w-full h-[calc(100dvh-3rem)] min-h-0">
        <div ref={mapContainer} className="w-full h-full" />

        {/* Layer rail. Each entry says what it encodes, so a toggle is never a
            mystery switch. */}
        <div className="absolute top-3 left-3 w-52 bg-[#0b1220]/92 border border-white/12 rounded-md p-3 z-10">
          <p className="inline-flex items-center gap-1.5 text-[0.6rem] font-semibold uppercase tracking-widest text-white/55 mb-2">
            <Layers size={11} aria-hidden="true" /> Layers
          </p>
          <LayerToggle
            label="Compliance relief"
            hint="Extrusion height encodes verified status — binding law rises highest."
            on={reliefOn}
            onChange={setReliefOn}
          />
          <LayerToggle
            label="Institutions"
            hint="Standards bodies and regulators behind the register. Appears from zoom 2.6."
            on={placesOn}
            onChange={setPlacesOn}
          />
          {placesOn && unpinned.length > 0 && (
            <div className="mt-2 pt-2 border-t border-white/10">
              <p className="text-[0.6rem] text-white/40 leading-snug mb-1.5">
                No verified coordinate — listed, not pinned:
              </p>
              {unpinned.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => setSelection({ kind: 'place', id: u.id })}
                  className="block w-full text-left text-[0.65rem] text-white/60 hover:text-white py-0.5"
                >
                  {u.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <p className="absolute bottom-3 left-3 text-[0.6rem] text-white/35 max-w-xs pointer-events-none z-10">
          Click a country or an institution. Standards have no borders — those live in the full register.
        </p>

        {/* Contextual detail. The panel content is chosen by what was selected,
            not a single generic shape reused for everything. */}
        {selection?.kind === 'country' && (
          <aside className="absolute top-0 right-0 h-full w-[23rem] max-w-full bg-background border-l border-border overflow-y-auto z-10">
            <CountryPanel country={selection.id} onClose={() => setSelection(null)} />
          </aside>
        )}
        {selectedPlace && (
          <aside className="absolute top-3 right-3 w-[21rem] max-w-[calc(100%-1.5rem)] z-10">
            <PlaceCard place={selectedPlace} onClose={() => setSelection(null)} />
          </aside>
        )}
      </div>

      {/* Analysis is a drawer over the map, so the map keeps its position and
          selection while the matrix is open. */}
      {analysisOpen && (
        <div className="absolute inset-x-0 bottom-0 top-12 bg-background/97 border-t border-border overflow-y-auto z-30">
          <div className="flex items-center justify-between px-4 py-2 border-b border-border sticky top-0 bg-background">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Analysis</p>
            <button
              type="button"
              onClick={() => setAnalysisOpen(false)}
              aria-label="Close analysis"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <X size={13} aria-hidden="true" /> Close
            </button>
          </div>
          <div className="p-4 max-w-[1400px] mx-auto">
            <RiskMatrix controlState={controlState} />
          </div>
        </div>
      )}
    </div>
  );
}

function LayerToggle({
  label,
  hint,
  on,
  onChange,
}: {
  label: string;
  hint: string;
  on: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-start gap-2 py-1 cursor-pointer">
      <input
        type="checkbox"
        checked={on}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 accent-teal-400"
      />
      <span className="min-w-0">
        <span className="block text-xs text-white/90 leading-tight">{label}</span>
        <span className="block text-[0.6rem] text-white/40 leading-snug mt-0.5">{hint}</span>
      </span>
    </label>
  );
}
