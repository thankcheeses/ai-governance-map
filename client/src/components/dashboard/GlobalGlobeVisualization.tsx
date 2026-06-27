import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Globe } from 'lucide-react';
import SectionHeader from './SectionHeader';
import GlobeDetailsPanel from './GlobeDetailsPanel';
import { useGlobeData } from '@/hooks/useGlobeData';

// Esri World Imagery — realistic satellite basemap (land greens/browns, ocean blues).
// Fetched client-side as generic public map tiles; carries no user/governance data.
const ESRI_IMAGERY =
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
const SPACE = '#05070f';

export default function GlobalGlobeVisualization() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const spinRef = useRef<number | null>(null);
  const interactingRef = useRef(false);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const globeData = useGlobeData();

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
        countries: { type: 'geojson', data: globeData as never, generateId: true },
      },
      layers: [
        { id: 'space', type: 'background', paint: { 'background-color': SPACE } },
        { id: 'satellite', type: 'raster', source: 'satellite', paint: { 'raster-opacity': 1 } },
        // Compliance overlay — tints binding/none countries, leaves "unknown" terrain bare.
        {
          id: 'country-fill',
          type: 'fill',
          source: 'countries',
          paint: {
            'fill-color': [
              'match',
              ['get', 'status'],
              'binding', '#2dd4bf',
              'none', '#cbd5e1',
              'rgba(0,0,0,0)',
            ],
            'fill-opacity': [
              'case',
              ['boolean', ['feature-state', 'hover'], false],
              0.6,
              ['match', ['get', 'status'], 'binding', 0.42, 'none', 0.2, 0],
            ],
          },
        },
        {
          id: 'country-outline',
          type: 'line',
          source: 'countries',
          paint: {
            'line-color': [
              'match',
              ['get', 'status'],
              'binding', '#5eead4',
              'none', '#e2e8f0',
              'rgba(255,255,255,0.25)',
            ],
            'line-width': ['case', ['boolean', ['feature-state', 'hover'], false], 1.8, 0.7],
          },
        },
      ],
    };

    const m = new maplibregl.Map({
      container: mapContainer.current,
      style,
      center: [-30, 20],
      zoom: 1.55,
      minZoom: 0.8,
      maxZoom: 6,
      renderWorldCopies: false,
      attributionControl: { compact: true },
    });
    map.current = m;

    m.on('style.load', () => {
      m.setProjection({ type: 'globe' });
      m.setSky({
        'sky-color': '#0a1a3a',
        'sky-horizon-blend': 0.5,
        'horizon-color': '#4a7fb5',
        'horizon-fog-blend': 0.7,
        'fog-color': '#0a1a3a',
        'fog-ground-blend': 0.2,
        'atmosphere-blend': ['interpolate', ['linear'], ['zoom'], 0, 0.9, 6, 0.2],
      });
    });

    // Zoom control bottom-left so it never collides with the detail panel's close button.
    m.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-left');

    let hoveredId: number | string | undefined;
    const clearHover = () => {
      if (hoveredId !== undefined) {
        m.setFeatureState({ source: 'countries', id: hoveredId }, { hover: false });
        hoveredId = undefined;
      }
    };
    m.on('mousemove', 'country-fill', (e) => {
      if (!e.features?.length) return;
      const f = e.features[0];
      if (f.id === hoveredId) return;
      clearHover();
      hoveredId = f.id;
      m.setFeatureState({ source: 'countries', id: hoveredId }, { hover: true });
      m.getCanvas().style.cursor = 'pointer';
    });
    m.on('mouseleave', 'country-fill', () => {
      clearHover();
      m.getCanvas().style.cursor = '';
    });
    m.on('click', 'country-fill', (e) => {
      if (!e.features?.length) return;
      const name = e.features[0].properties?.name as string;
      setSelectedCountry((prev) => (prev === name ? null : name));
    });

    // Gentle auto-rotation; pauses on interaction or when a detail panel is open.
    const SPIN = 0.018;
    const spin = () => {
      if (!interactingRef.current && map.current) {
        const c = map.current.getCenter();
        c.lng = ((c.lng + SPIN + 180) % 360) - 180;
        map.current.setCenter(c);
      }
      spinRef.current = requestAnimationFrame(spin);
    };
    const pause = () => { interactingRef.current = true; };
    const resume = () => { if (!selectedCountry) interactingRef.current = false; };
    m.on('mousedown', pause);
    m.on('dragstart', pause);
    m.getCanvas().addEventListener('mouseenter', pause);
    m.getCanvas().addEventListener('mouseleave', resume);
    spinRef.current = requestAnimationFrame(spin);

    return () => {
      if (spinRef.current) cancelAnimationFrame(spinRef.current);
      m.remove();
      map.current = null;
    };
  }, [globeData]);

  useEffect(() => {
    interactingRef.current = selectedCountry !== null;
  }, [selectedCountry]);

  return (
    <section id="global-map" className="scroll-mt-24">
      <SectionHeader
        icon={<Globe size={18} />}
        title="Global Compliance Map"
        subtitle="Country-level AI regulation on a live globe — drag to rotate, click a country for detail"
      />

      <div className="card-elevated relative overflow-hidden" ref={frameRef} style={{ background: SPACE }}>
        {/* starfield behind the globe */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.7) 50%, transparent), radial-gradient(1px 1px at 70% 60%, rgba(255,255,255,0.5) 50%, transparent), radial-gradient(1px 1px at 40% 80%, rgba(255,255,255,0.6) 50%, transparent), radial-gradient(1px 1px at 85% 20%, rgba(255,255,255,0.5) 50%, transparent), radial-gradient(1px 1px at 55% 15%, rgba(255,255,255,0.4) 50%, transparent), radial-gradient(1px 1px at 10% 70%, rgba(255,255,255,0.5) 50%, transparent)',
          }}
        />
        <div ref={mapContainer} className="w-full h-[600px] relative" />
        <GlobeDetailsPanel country={selectedCountry} onClose={() => setSelectedCountry(null)} />
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs px-1">
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-sm" style={{ background: '#2dd4bf' }} />
          <span className="text-muted-foreground">Binding AI law in effect</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-sm" style={{ background: '#cbd5e1' }} />
          <span className="text-muted-foreground">Researched — no binding law</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-sm border border-white/30" style={{ background: 'transparent' }} />
          <span className="text-muted-foreground">Not yet researched (terrain only)</span>
        </div>
      </div>
    </section>
  );
}
