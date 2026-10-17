import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  BookOpenCheck,
  CalendarClock,
  Globe2,
  Grid3x3,
  LayoutDashboard,
  ListChecks,
  Map as MapIcon,
  Network,
  Radar,
  Search,
  ShieldAlert,
  ShieldCheck,
  Target,
  X,
} from 'lucide-react';
import { COUNTRY_AI_LAWS } from '@/data/governance';
import { GOVERNANCE_PLACES } from '@/data/places';
import { GLOBE_SKY, buildGlobeStyle } from '@/lib/globeStyle';
import { useGlobeData } from '@/hooks/useGlobeData';
import { useGovernanceState } from '@/hooks/useGovernanceState';
import PlaceCard from '@/components/dashboard/PlaceCard';
import CountryPanel from '@/components/workspace/CountryPanel';
import Starfield from '@/components/workspace/Starfield';
import GlassOcean from '@/components/workspace/GlassOcean';
import GlobeLegend from '@/components/workspace/GlobeLegend';
import SiteFooter, { type FooterColumn, type FooterLink } from '@/components/workspace/SiteFooter';
import RiskMatrix from '@/components/dashboard/RiskMatrix';
import StatusStrip from '@/components/dashboard/StatusStrip';
import EvidenceCoverage from '@/components/dashboard/EvidenceCoverage';
import ControlsSection from '@/components/dashboard/ControlsSection';
import MaturityRadarSection from '@/components/dashboard/MaturityRadarSection';
import TimelineSection from '@/components/dashboard/TimelineSection';
import CrosswalkSection from '@/components/dashboard/CrosswalkSection';
import NistPlaybookSection from '@/components/dashboard/NistPlaybookSection';
import FrameworksSection from '@/components/dashboard/FrameworksSection';
import IncidentPracticesSection from '@/components/dashboard/IncidentPracticesSection';
import NhidTrustStack from '@/components/dashboard/NhidTrustStack';
import USAComplianceMapSection from '@/components/dashboard/USAComplianceMapSection';

// ---------------------------------------------------------------------------
// The map workspace — the whole application.
//
// There is no second page with a second look. Every governance view the register
// used to scroll through opens here as a panel over the map, so toggling one
// never drops the reader into a differently-styled app.
// ---------------------------------------------------------------------------

type PanelId =
  | 'overview'
  | 'matrix'
  | 'controls'
  | 'maturity'
  | 'timeline'
  | 'crosswalk'
  | 'playbook'
  | 'frameworks'
  | 'incidents'
  | 'nhid'
  | 'usa';

interface PanelDef {
  id: PanelId;
  label: string;
  icon: typeof Globe2;
  /** Wide panels get the full width; registers and lists read better narrow. */
  wide?: boolean;
}

const PANELS: PanelDef[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, wide: true },
  { id: 'matrix', label: 'Risk matrix', icon: Grid3x3, wide: true },
  { id: 'controls', label: 'Controls', icon: ListChecks, wide: true },
  { id: 'maturity', label: 'Maturity', icon: Radar },
  { id: 'timeline', label: 'Timeline', icon: CalendarClock, wide: true },
  { id: 'crosswalk', label: 'Crosswalk', icon: Network, wide: true },
  { id: 'playbook', label: 'NIST playbook', icon: Target, wide: true },
  { id: 'frameworks', label: 'Frameworks', icon: BookOpenCheck, wide: true },
  { id: 'incidents', label: 'Agent incidents', icon: ShieldAlert, wide: true },
  { id: 'nhid', label: 'Voice agent & NHID', icon: ShieldCheck, wide: true },
  { id: 'usa', label: 'USA map', icon: MapIcon, wide: true },
];

type Selection = { kind: 'country'; id: string } | { kind: 'place'; id: string } | null;
type Projection = 'globe' | 'flat';

export default function MapWorkspace() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const globeData = useGlobeData();
  const { controlState, overallScore, assessedCount } = useGovernanceState();

  const [selection, setSelection] = useState<Selection>(null);
  const [panel, setPanel] = useState<PanelId | null>(null);
  const [projection, setProjection] = useState<Projection>('globe');
  const [placesOn, setPlacesOn] = useState(true);
  const [reliefOn, setReliefOn] = useState(true);
  // Opt-in, and off on arrival. Satellite tiles are the only map host this app
  // can contact, so leaving this off means a normal visit requests none and the
  // tile provider is never told who is looking or where.
  const [satelliteOn, setSatelliteOn] = useState(false);
  // The map instance as state, not just the ref: the ocean canvas is a child
  // component and needs a render to learn the map exists.
  const [mapObj, setMapObj] = useState<maplibregl.Map | null>(null);
  const [oceanOn, setOceanOn] = useState(true);
  const [trailOn, setTrailOn] = useState(true);
  const [query, setQuery] = useState('');
  const [ready, setReady] = useState(false);
  const [frameworkFilter, setFrameworkFilter] = useState('all');
  const [footerOpen, setFooterOpen] = useState(false);

  const flyTo = useCallback((lon: number, lat: number, zoom = 4.5) => {
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
      pitch: 0,
      maxPitch: 75,
      renderWorldCopies: false,
      attributionControl: { compact: true },
    });
    map.current = m;
    setMapObj(m);

    m.on('style.load', () => {
      m.setProjection({ type: 'globe' });
      m.setSky({ ...GLOBE_SKY } as never);
      setReady(true);
    });
    m.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right');

    // The container is a flex/grid child whose height settles after construction,
    // and panels change the box afterwards, so observe rather than resize once.
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

  // Globe and flat share one style, so flattening changes the projection only —
  // the compliance colours, relief and pins stay exactly as they are.
  useEffect(() => {
    const m = map.current;
    if (!ready || !m) return;
    m.setProjection({ type: projection === 'globe' ? 'globe' : 'mercator' });
    // A globe at zoom 1.95 shows the hemisphere; flat at the same zoom shows a
    // third of the world. Refit only while zoomed out, so switching projection
    // while inspecting a country does not throw the reader back to space.
    if (m.getZoom() < 3) {
      if (projection === 'flat') {
        m.fitBounds(
          [
            [-179, -58],
            [179, 78],
          ],
          { padding: 24, duration: 700 },
        );
      } else {
        m.easeTo({ zoom: 1.95, duration: 700 });
      }
    }
  }, [projection, ready]);

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

  useEffect(() => {
    const m = map.current;
    if (!ready || !m || !m.getLayer('satellite')) return;
    m.setLayoutProperty('satellite', 'visibility', satelliteOn ? 'visible' : 'none');
  }, [satelliteOn, ready]);

  // Where each bound country sits, east to west, so the sweep has an order to
  // follow. A bounding-box midpoint is enough to sequence a light: this is not
  // a centroid and nothing in the register depends on it being one.
  const trailStops = useMemo(() => {
    const out: { id: string; phase: number }[] = [];
    for (const f of globeData.features) {
      if (f.properties?.status !== 'binding' || !f.properties.name) continue;
      let min = 180;
      let max = -180;
      const scan = (co: unknown): void => {
        if (Array.isArray(co) && typeof co[0] === 'number') {
          const lng = co[0] as number;
          if (lng < min) min = lng;
          if (lng > max) max = lng;
          return;
        }
        if (Array.isArray(co)) for (const c of co) scan(c);
      };
      scan((f.geometry as { coordinates?: unknown }).coordinates);
      if (min > max) continue;
      out.push({ id: f.properties.name, phase: ((min + max) / 2 + 180) / 360 });
    }
    return out;
  }, [globeData]);

  // The border trail. A band of light sweeps west to east; each bound country
  // brightens as it passes and fades behind it.
  //
  // Both obvious implementations were measured and rejected: a `line-gradient`
  // window sliding along `line-progress` ran at 4fps against a 61fps baseline,
  // and an animated `line-dasharray` was just as bad. Both change the *style*,
  // which makes MapLibre rebuild per-feature textures or re-upload line
  // buckets. `setFeatureState` updates one attribute in place instead — the
  // same path this map's hover highlight already uses every mousemove.
  useEffect(() => {
    const m = map.current;
    if (!ready || !m || !m.getLayer('country-trail') || trailStops.length === 0) return;

    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const clear = () => {
      m.setLayoutProperty('country-trail', 'visibility', 'none');
      for (const s of trailStops) m.setFeatureState({ source: 'countries', id: s.id }, { trail: 0 });
    };
    if (!trailOn || reduced?.matches) {
      clear();
      return;
    }
    m.setLayoutProperty('country-trail', 'visibility', 'visible');

    const PERIOD = 9000; // ms for one lap of the globe
    const WIDTH = 0.1; // fraction of the globe lit at once
    let raf = 0;
    let last = 0;

    // Every feature-state write makes MapLibre recompute that layer's paint
    // attributes, and that cost is CPU-side — a faster GPU does not pay it
    // down. Writing all 31 bound countries each tick measured 6fps against a
    // 60fps baseline. Only a handful are inside the lit band at any moment, so
    // remember what was last written and touch only what actually changed.
    const written = new Map<string, number>();
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (document.hidden || now - last < 100) return;
      last = now;
      const head = (now % PERIOD) / PERIOD;
      for (const s of trailStops) {
        const raw = Math.abs(s.phase - head);
        const dist = Math.min(raw, 1 - raw); // the sweep wraps at the date line
        const lit = dist > WIDTH ? 0 : +(Math.max(0, 1 - dist / WIDTH) ** 2).toFixed(2);
        const prev = written.get(s.id) ?? 0;
        if (lit === prev) continue;
        written.set(s.id, lit);
        m.setFeatureState({ source: 'countries', id: s.id }, { trail: lit });
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      if (m.getLayer('country-trail')) clear();
    };
  }, [trailOn, ready, trailStops]);


  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    const places = GOVERNANCE_PLACES.filter(
      (p) => p.name.toLowerCase().includes(q) || p.city.toLowerCase().includes(q),
    )
      .slice(0, 4)
      .map((p) => ({ kind: 'place' as const, id: p.id, label: p.name, sub: `${p.city}, ${p.country}` }));
    const countries = COUNTRY_AI_LAWS.filter((c) => c.name.toLowerCase().includes(q))
      .slice(0, 5)
      .map((c) => ({
        kind: 'country' as const,
        id: c.name,
        label: c.name,
        sub: c.status === 'binding' ? 'Binding AI law' : 'No binding AI law',
      }));
    return [...places, ...countries];
  }, [query]);

  const openResult = (r: { kind: 'country' | 'place'; id: string }) => {
    setSelection({ kind: r.kind, id: r.id } as Selection);
    setQuery('');
    if (r.kind === 'place') {
      const p = GOVERNANCE_PLACES.find((x) => x.id === r.id);
      if (p && typeof p.lat === 'number' && typeof p.lon === 'number') flyTo(p.lon, p.lat);
    }
  };

  const selectedPlace = selection?.kind === 'place' ? GOVERNANCE_PLACES.find((p) => p.id === selection.id) : undefined;
  const unpinned = GOVERNANCE_PLACES.filter((p) => typeof p.lat !== 'number');
  const activePanel = PANELS.find((p) => p.id === panel);

  const go = (id: PanelId): FooterLink => ({
    label: PANELS.find((p) => p.id === id)!.label,
    onSelect: () => {
      setPanel(id);
      setFooterOpen(false);
    },
  });

  const footerColumns: FooterColumn[] = [
    { heading: 'Assess', links: [go('overview'), go('matrix'), go('controls'), go('maturity')] },
    { heading: 'Obligations', links: [go('timeline'), go('frameworks'), go('crosswalk'), go('playbook'), go('incidents')] },
    {
      heading: 'Map',
      links: [
        { label: 'Globe view', onSelect: () => { setProjection('globe'); setFooterOpen(false); } },
        { label: 'Flat world map', onSelect: () => { setProjection('flat'); setFooterOpen(false); } },
        go('usa'),
        { label: 'Institutions layer', onSelect: () => { setPlacesOn(true); setFooterOpen(false); } },
      ],
    },
    {
      heading: 'NHID-Clinical',
      links: [
        go('nhid'),
        { label: 'Specification v1.3', href: 'https://nhid-clinical.org/specification.html' },
        { label: 'Governance simulator', href: 'https://nhid-clinical.org/simulator.html' },
        { label: 'NHID-Clinical site', href: 'https://nhid-clinical.org/' },
      ],
    },
  ];

  // The views a first-time reader is most likely to go looking for.
  const quickLinks: FooterLink[] = [go('matrix'), go('controls'), go('timeline'), go('frameworks'), go('incidents'), go('nhid')];

  const panelBody = () => {
    switch (panel) {
      case 'overview':
        return (
          <div className="flex flex-col gap-5">
            <StatusStrip
              controlState={controlState}
              overallScore={overallScore}
              assessedCount={assessedCount}
              onJump={(id) => setPanel(id === 'controls' ? 'controls' : id === 'timeline' ? 'timeline' : 'frameworks')}
            />
            <EvidenceCoverage />
          </div>
        );
      case 'matrix':
        return <RiskMatrix controlState={controlState} />;
      case 'controls':
        return <ControlsSection />;
      case 'maturity':
        return <MaturityRadarSection />;
      case 'timeline':
        return <TimelineSection frameworkFilter={frameworkFilter} onFrameworkFilterChange={setFrameworkFilter} />;
      case 'crosswalk':
        return <CrosswalkSection />;
      case 'playbook':
        return <NistPlaybookSection />;
      case 'frameworks':
        return <FrameworksSection frameworkFilter={frameworkFilter} onFrameworkFilterChange={setFrameworkFilter} />;
      case 'incidents':
        return <IncidentPracticesSection />;
      case 'nhid':
        return <NhidTrustStack />;
      case 'usa':
        return <USAComplianceMapSection />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 flex bg-[#04070e]">
      {/* Side navigation: everything an AI governance map has to do, reachable
          without leaving the map. */}
      <nav className="w-14 lg:w-48 flex-shrink-0 border-r border-white/10 flex flex-col py-3 overflow-y-auto">
        <p className="px-3 text-[0.72rem] font-semibold uppercase tracking-widest text-white/70 mb-3 hidden lg:block">
          Governance map
        </p>
        {PANELS.map((item) => {
          const active = panel === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setPanel(active ? null : item.id)}
              aria-pressed={active}
              title={item.label}
              className={`flex items-center gap-2.5 px-3 py-2 text-xs text-left ${
                active ? 'bg-white/12 text-white border-l-2 border-teal-300' : 'text-white/80 hover:text-white border-l-2 border-transparent'
              }`}
            >
              <item.icon size={15} className="flex-shrink-0" aria-hidden="true" />
              <span className="hidden lg:inline truncate">{item.label}</span>
            </button>
          );
        })}

        <div className="mt-auto pt-3 px-3 hidden lg:block">
          <p className="text-[0.72rem] text-white/70 leading-relaxed">
            Local-only. Your assessment data never leaves this browser.
          </p>
        </div>
      </nav>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="flex items-center gap-3 px-4 h-12 border-b border-white/10 flex-shrink-0">
          <div className="relative flex-1 max-w-sm">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/70" aria-hidden="true" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search a jurisdiction or institution"
              aria-label="Search a jurisdiction or institution"
              className="w-full bg-white/5 border border-white/15 rounded-md pl-7 pr-2 py-1 text-xs text-white placeholder:text-white/70 focus:outline-none focus:border-white/40"
            />
            {results.length > 0 && (
              <ul className="absolute top-full left-0 right-0 mt-1 bg-[#0b1220] border border-white/15 rounded-md overflow-hidden z-40">
                {results.map((r) => (
                  <li key={`${r.kind}-${r.id}`}>
                    <button
                      type="button"
                      onClick={() => openResult(r)}
                      className="w-full text-left px-2.5 py-1.5 hover:bg-white/10"
                    >
                      <span className="block text-xs text-white">{r.label}</span>
                      <span className="block text-[0.75rem] text-white/70">{r.sub}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Projection toggle. Same style, same data — only the geometry changes. */}
          <div className="ml-auto flex items-center gap-1" role="group" aria-label="Projection">
            {(['globe', 'flat'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setProjection(p)}
                aria-pressed={projection === p}
                className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md border ${
                  projection === p ? 'bg-white text-[#0b1220] border-white' : 'border-white/20 text-white/70 hover:text-white'
                }`}
              >
                {p === 'globe' ? <Globe2 size={12} aria-hidden="true" /> : <MapIcon size={12} aria-hidden="true" />}
                {p === 'globe' ? 'Globe' : 'Flat map'}
              </button>
            ))}
          </div>
        </header>

        <div className="relative w-full flex-1 min-h-0">
          <Starfield />
          {/* Behind the (transparent) map canvas, in front of the stars. */}
          <GlassOcean map={mapObj} enabled={oceanOn} />
          <div ref={mapContainer} className="w-full h-full" />

          <div className="absolute top-3 left-3 w-52 z-10 flex flex-col gap-2 max-h-[calc(100%-1.5rem)] overflow-y-auto">
          <div className="bg-[#0b1220]/92 border border-white/12 rounded-md p-3">
            <p className="text-[0.72rem] font-semibold uppercase tracking-widest text-white/75 mb-2">Layers</p>
            <LayerToggle
              label="Compliance relief"
              hint="Extrusion height encodes verified status — binding law rises highest."
              on={reliefOn}
              onChange={setReliefOn}
            />
            <LayerToggle
              label="Satellite imagery"
              hint="Off by default. Streams photo tiles from Esri, the only outside map host this site can contact."
              on={satelliteOn}
              onChange={setSatelliteOn}
            />
            <LayerToggle
              label="Glass ocean"
              hint="Shades the sea so the globe reads as a body. Waves answer zoom and drag; click the water to drop a ripple."
              on={oceanOn}
              onChange={setOceanOn}
            />
            <LayerToggle
              label="Border trail"
              hint="A highlight runs round the borders of countries with a binding national law. Off under reduced-motion."
              on={trailOn}
              onChange={setTrailOn}
            />
            <LayerToggle
              label="Institutions"
              hint="Standards bodies and regulators behind the register. From zoom 2.6."
              on={placesOn}
              onChange={setPlacesOn}
            />
            {placesOn && unpinned.length > 0 && (
              <div className="mt-2 pt-2 border-t border-white/10">
                <p className="text-[0.72rem] text-white/70 leading-snug mb-1.5">
                  No verified coordinate — listed, not pinned:
                </p>
                {unpinned.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => setSelection({ kind: 'place', id: u.id })}
                    className="block w-full text-left text-[0.75rem] text-white/80 hover:text-white py-0.5"
                  >
                    {u.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <GlobeLegend />
          </div>

          {/* Clear of the layers/legend column, which now reaches further down. */}
          <p className="absolute bottom-3 left-[14.5rem] text-[0.72rem] text-white/70 max-w-xs pointer-events-none z-10">
            Click a country or an institution. Standards have no borders — open them from the side navigation.
          </p>

          {selection?.kind === 'country' && (
            <aside className="absolute top-0 right-0 h-full w-[23rem] max-w-full bg-background border-l border-border overflow-y-auto z-20">
              <CountryPanel country={selection.id} onClose={() => setSelection(null)} />
            </aside>
          )}
          {selectedPlace && (
            <aside className="absolute top-3 right-3 w-[21rem] max-w-[calc(100%-1.5rem)] z-20">
              <PlaceCard place={selectedPlace} onClose={() => setSelection(null)} />
            </aside>
          )}

          {/* Every register view, as a panel over the map. */}
          {activePanel && (
            <section
              aria-label={activePanel.label}
              className={`absolute inset-y-0 right-0 bg-background border-l border-border overflow-y-auto z-30 ${
                activePanel.wide ? 'w-full max-w-[64rem]' : 'w-full max-w-[36rem]'
              }`}
            >
              <div className="sticky top-0 bg-background border-b border-border px-4 py-2 flex items-center justify-between z-10">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {activePanel.label}
                </p>
                <button
                  type="button"
                  onClick={() => setPanel(null)}
                  aria-label={`Close ${activePanel.label}`}
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  <X size={13} aria-hidden="true" /> Close
                </button>
              </div>
              <div className="p-4">{panelBody()}</div>
            </section>
          )}
        </div>

        <SiteFooter
          open={footerOpen}
          onToggle={() => setFooterOpen((v) => !v)}
          columns={footerColumns}
          quickLinks={quickLinks}
        />
      </div>
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
      <input type="checkbox" checked={on} onChange={(e) => onChange(e.target.checked)} className="mt-0.5 accent-teal-400" />
      <span className="min-w-0">
        <span className="block text-xs text-white/90 leading-tight">{label}</span>
        <span className="block text-[0.72rem] text-white/70 leading-snug mt-0.5">{hint}</span>
      </span>
    </label>
  );
}
