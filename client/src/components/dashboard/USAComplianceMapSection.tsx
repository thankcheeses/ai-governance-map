import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { feature } from 'topojson-client';
import type { FeatureCollection, Geometry } from 'geojson';
import { Map as MapIcon, ChevronDown } from 'lucide-react';
import { STATE_AI_LAWS, FRAMEWORKS, OBLIGATIONS, type Framework, type Obligation } from '@/data/governance';
import SectionHeader from './SectionHeader';
import usStates from 'us-atlas/states-10m.json';

const EASE = [0.16, 1, 0.3, 1] as const;

// Esri World Imagery — same realistic satellite basemap used by the global map.
const ESRI_IMAGERY =
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
const SPACE = '#05070f';

interface StateProps {
  name: string;
  status: 'binding' | 'none';
}

// Bundled us-atlas topojson -> GeoJSON state polygons with compliance status. In-browser, no network.
function useStatesData(): FeatureCollection<Geometry, StateProps> {
  return useMemo(() => {
    const collection = feature(
      usStates as never,
      (usStates as never as { objects: { states: never } }).objects.states,
    ) as unknown as FeatureCollection<Geometry, { name: string }>;
    const features = collection.features.map((f) => {
      const name = f.properties?.name ?? '';
      const law = STATE_AI_LAWS.find((s) => s.name === name);
      return { ...f, properties: { name, status: (law?.status ?? 'none') as 'binding' | 'none' } };
    });
    return { type: 'FeatureCollection', features } as FeatureCollection<Geometry, StateProps>;
  }, []);
}

// National frameworks apply across every state (US-scoped or US/Global hybrid);
// Global frameworks apply regardless of jurisdiction. Both render as collapsible
// tiers under whatever State-specific law (if any) is mapped for the clicked state.
const NATIONAL_FRAMEWORKS = FRAMEWORKS.filter((f) => f.jurisdiction === 'US' || f.jurisdiction === 'US / Global');
const GLOBAL_FRAMEWORKS = FRAMEWORKS.filter((f) => f.jurisdiction === 'Global');

const TIER_STYLES: Record<'state' | 'national' | 'global', { badge: string; accent: string }> = {
  state: { badge: 'bg-primary/10 text-primary border-primary/20', accent: 'border-l-[#0F172A]' },
  national: { badge: 'bg-amber-100 text-amber-800 border-amber-300', accent: 'border-l-amber-500' },
  global: { badge: 'bg-violet-100 text-violet-800 border-violet-300', accent: 'border-l-violet-500' },
};

function FrameworkCard({ framework, obligations, tier }: { framework: Framework; obligations: Obligation[]; tier: 'state' | 'national' | 'global' }) {
  const style = TIER_STYLES[tier];
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`bg-secondary/50 border border-border rounded-lg p-4 border-l-2 ${style.accent}`}
    >
      <p className="font-semibold text-sm text-foreground mb-1">{framework.name}</p>
      <p className="text-xs text-muted-foreground leading-relaxed mb-3">{framework.summary}</p>
      <div className="flex flex-col gap-2">
        {obligations.map((o) => (
          <div key={o.id} className="bg-background border border-border rounded-md p-3">
            <p className="font-semibold text-xs text-foreground mb-1">{o.title}</p>
            <p className="text-[0.7rem] text-muted-foreground leading-relaxed mb-2">{o.summary}</p>
            <div className="flex items-center gap-2 flex-wrap text-[0.65rem]">
              <span className={`px-2 py-0.5 rounded-full border font-mono ${style.badge}`}>{o.framework}</span>
              <span className="px-2 py-0.5 rounded-full bg-secondary border border-border text-muted-foreground">{o.type}</span>
              <span className="px-2 py-0.5 rounded-full bg-secondary border border-border text-muted-foreground">{o.severity}</span>
              <span className="text-muted-foreground">Effective {o.effective}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function TierSection({
  label,
  tier,
  expanded,
  onToggle,
  frameworks,
}: {
  label: string;
  tier: 'national' | 'global';
  expanded: boolean;
  onToggle: () => void;
  frameworks: Framework[];
}) {
  const style = TIER_STYLES[tier];
  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between text-[0.65rem] font-semibold uppercase tracking-wide text-muted-foreground py-1 hover:text-foreground transition-colors"
      >
        <span className="flex items-center gap-1.5">
          {label}
          <span className={`px-1.5 rounded-full border text-[0.6rem] font-mono normal-case ${style.badge}`}>{frameworks.length}</span>
        </span>
        <ChevronDown size={12} className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-2 pt-1.5">
              {frameworks.map((fw) => (
                <FrameworkCard key={fw.slug} framework={fw} obligations={OBLIGATIONS.filter((o) => o.framework === fw.shortCode)} tier={tier} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function USAComplianceMapSection() {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [expandedTier, setExpandedTier] = useState({ national: false, global: false });
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const statesData = useStatesData();

  const selectedLaw = selectedState ? STATE_AI_LAWS.find((s) => s.name === selectedState) : undefined;
  const selectedFramework = selectedLaw?.frameworkSlug ? FRAMEWORKS.find((f) => f.slug === selectedLaw.frameworkSlug) : undefined;
  const selectedObligations = selectedFramework ? OBLIGATIONS.filter((o) => o.framework === selectedFramework.shortCode) : [];

  useEffect(() => {
    if (!mapContainer.current) return;

    const style: maplibregl.StyleSpecification = {
      version: 8,
      sources: {
        satellite: {
          type: 'raster',
          tiles: [ESRI_IMAGERY],
          tileSize: 256,
          maxzoom: 19,
          attribution: 'Imagery © Esri, Maxar, Earthstar Geographics, NASA, NOAA, USGS',
        },
        states: { type: 'geojson', data: statesData as never, generateId: true },
      },
      layers: [
        { id: 'space', type: 'background', paint: { 'background-color': SPACE } },
        { id: 'satellite', type: 'raster', source: 'satellite' },
        {
          id: 'state-fill',
          type: 'fill',
          source: 'states',
          paint: {
            'fill-color': ['match', ['get', 'status'], 'binding', '#2dd4bf', '#cbd5e1'],
            'fill-opacity': [
              'case',
              ['boolean', ['feature-state', 'hover'], false],
              0.6,
              ['match', ['get', 'status'], 'binding', 0.45, 0.22],
            ],
          },
        },
        // 3D compliance relief — extrusion HEIGHT encodes the same verified status
        // (states with a binding AI law rise; others stay a low plateau). Visual
        // encoding of `status` only — no fabricated data.
        {
          id: 'state-extrusion',
          type: 'fill-extrusion',
          source: 'states',
          paint: {
            'fill-extrusion-color': ['match', ['get', 'status'], 'binding', '#2dd4bf', '#94a3b8'],
            'fill-extrusion-height': [
              'case',
              ['boolean', ['feature-state', 'selected'], false],
              ['match', ['get', 'status'], 'binding', 150000, 60000],
              ['case', ['boolean', ['feature-state', 'hover'], false],
                ['match', ['get', 'status'], 'binding', 130000, 55000],
                ['match', ['get', 'status'], 'binding', 90000, 30000]],
            ],
            'fill-extrusion-base': 0,
            'fill-extrusion-opacity': 0.72,
          },
        },
        {
          id: 'state-outline',
          type: 'line',
          source: 'states',
          paint: {
            'line-color': ['case', ['boolean', ['feature-state', 'selected'], false], '#ffffff', 'rgba(255,255,255,0.5)'],
            'line-width': ['case', ['boolean', ['feature-state', 'selected'], false], 2, ['case', ['boolean', ['feature-state', 'hover'], false], 1.4, 0.6]],
          },
        },
      ],
    };

    const m = new maplibregl.Map({
      container: mapContainer.current,
      style,
      center: [-96, 38],
      zoom: 3.1,
      minZoom: 2,
      maxZoom: 8,
      pitch: 48,
      maxPitch: 74,
      renderWorldCopies: false,
      attributionControl: { compact: true },
    });
    map.current = m;
    m.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-left');

    const popup = new maplibregl.Popup({ closeButton: false, closeOnClick: false, offset: 8 });
    let hoveredId: number | string | undefined;
    const clearHover = () => {
      if (hoveredId !== undefined) {
        m.setFeatureState({ source: 'states', id: hoveredId }, { hover: false });
        hoveredId = undefined;
      }
    };

    m.on('mousemove', 'state-fill', (e) => {
      if (!e.features?.length) return;
      const f = e.features[0];
      if (f.id !== hoveredId) {
        clearHover();
        hoveredId = f.id;
        m.setFeatureState({ source: 'states', id: hoveredId }, { hover: true });
      }
      m.getCanvas().style.cursor = 'pointer';
      const name = f.properties?.name as string;
      const law = STATE_AI_LAWS.find((s) => s.name === name);
      const fw = law?.frameworkSlug ? FRAMEWORKS.find((x) => x.slug === law.frameworkSlug) : undefined;
      popup
        .setLngLat(e.lngLat)
        .setHTML(
          `<div style="font:600 12px Inter,sans-serif;color:#0f172a">${name}</div>` +
            `<div style="font:400 10px Inter,sans-serif;color:#64748b">${fw ? fw.name : 'No AI-specific law tracked'}</div>`,
        )
        .addTo(m);
    });
    m.on('mouseleave', 'state-fill', () => {
      clearHover();
      m.getCanvas().style.cursor = '';
      popup.remove();
    });
    m.on('click', 'state-fill', (e) => {
      if (!e.features?.length) return;
      const name = e.features[0].properties?.name as string;
      setSelectedState((s) => (s === name ? null : name));
      setExpandedTier({ national: false, global: false });
    });

    return () => {
      m.remove();
      map.current = null;
    };
  }, [statesData]);

  // Reflect the selected state as a highlighted outline on the map.
  useEffect(() => {
    const m = map.current;
    if (!m || !m.isStyleLoaded()) return;
    statesData.features.forEach((f, i) => {
      m.setFeatureState({ source: 'states', id: i }, { selected: f.properties.name === selectedState });
    });
  }, [selectedState, statesData]);

  return (
    <section id="usa-map" className="scroll-mt-24">
      <SectionHeader
        icon={<MapIcon size={18} />}
        title="USA Compliance Map"
        subtitle="State-level AI regulation on a live 3D satellite map — relief height encodes verified status; hover a state for a quick read, click for the full obligation detail"
      />

      <div className="card-elevated p-5">
        <div className="relative rounded-lg overflow-hidden" style={{ background: SPACE }}>
          <div ref={mapContainer} className="w-full h-[520px]" />
        </div>

        <div className="flex items-center gap-4 mt-4 text-[0.65rem] text-muted-foreground flex-wrap justify-center">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm" style={{ background: '#2dd4bf' }} />AI-specific law in effect</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm" style={{ background: '#cbd5e1' }} />No AI-specific law tracked</span>
        </div>

        {/* Data-currency disclosure — states plainly what this dataset is and is not. */}
        <p className="mt-3 text-[0.62rem] leading-relaxed text-muted-foreground border-t border-border pt-3">
          <span className="font-semibold">Data currency:</span> state-law status last reviewed
          mid-August 2026. Individual entries carry no per-row provenance (no source or
          verified-on field), so freshness cannot be audited entry by entry. This map is{' '}
          <span className="font-semibold">not comprehensively current for all 50 states</span> —
          it tracks a reviewed subset, and states shown as &ldquo;no AI-specific law tracked&rdquo;
          may have activity not yet reviewed here. Note that an enacted law may have obligations
          that begin later (e.g. Colorado&rsquo;s SB 26-189 duties begin 1 January 2027).
        </p>

        <AnimatePresence mode="wait">
          {selectedState && (
            <motion.div
              key={selectedState}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-border space-y-3">
                <p className="text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">{selectedState}</span>
                </p>

                <div>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">State</p>
                  {selectedFramework ? (
                    <FrameworkCard framework={selectedFramework} obligations={selectedObligations} tier="state" />
                  ) : (
                    <p className="text-xs text-muted-foreground">No AI-specific obligations mapped for this state yet.</p>
                  )}
                </div>

                <TierSection
                  label="National"
                  tier="national"
                  frameworks={NATIONAL_FRAMEWORKS}
                  expanded={expandedTier.national}
                  onToggle={() => setExpandedTier((t) => ({ ...t, national: !t.national }))}
                />

                <TierSection
                  label="Global"
                  tier="global"
                  frameworks={GLOBAL_FRAMEWORKS}
                  expanded={expandedTier.global}
                  onToggle={() => setExpandedTier((t) => ({ ...t, global: !t.global }))}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
