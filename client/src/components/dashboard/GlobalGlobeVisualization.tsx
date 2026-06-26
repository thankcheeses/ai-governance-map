import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Globe } from 'lucide-react';
import SectionHeader from './SectionHeader';
import GlobeDetailsPanel from './GlobeDetailsPanel';
import GlobeParticles from './particles/GlobeParticles';
import { useGlobeData } from '@/hooks/useGlobeData';

// Soft ocean / atmosphere palette — light, calm, operational (no dark "space" look).
const OCEAN = '#EEF2F7';
const ATMOSPHERE = '#dbe6f0';

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
      // No external tile sources — only the bundled vector country polygons.
      sources: {
        countries: {
          type: 'geojson',
          data: globeData as never,
          generateId: true,
        },
      },
      layers: [
        // Ocean / globe sphere base
        { id: 'ocean', type: 'background', paint: { 'background-color': OCEAN } },
        // Country fills by compliance status
        {
          id: 'country-fill',
          type: 'fill',
          source: 'countries',
          paint: {
            'fill-color': ['get', 'fillColor'],
            'fill-opacity': [
              'case',
              ['boolean', ['feature-state', 'hover'], false],
              0.95,
              0.8,
            ],
          },
        },
        // Country outlines for crisp separation
        {
          id: 'country-outline',
          type: 'line',
          source: 'countries',
          paint: {
            'line-color': '#FFFFFF',
            'line-width': [
              'case',
              ['boolean', ['feature-state', 'hover'], false],
              1.4,
              0.5,
            ],
          },
        },
      ],
    };

    const m = new maplibregl.Map({
      container: mapContainer.current,
      style,
      center: [10, 25],
      zoom: 1.1,
      minZoom: 0.5,
      maxZoom: 4,
      renderWorldCopies: false,
      attributionControl: false,
    });
    map.current = m;

    // Globe projection + soft light atmosphere.
    m.on('style.load', () => {
      m.setProjection({ type: 'globe' });
      m.setSky({
        'sky-color': ATMOSPHERE,
        'sky-horizon-blend': 0.6,
        'horizon-color': '#ffffff',
        'horizon-fog-blend': 0.6,
        'fog-color': '#ffffff',
        'fog-ground-blend': 0.3,
        'atmosphere-blend': 0.7,
      });
    });

    m.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

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

    // Subtle auto-rotation that pauses while the user interacts.
    const SPIN_DEG_PER_FRAME = 0.02;
    const spin = () => {
      if (!interactingRef.current && map.current) {
        const c = map.current.getCenter();
        c.lng = ((c.lng + SPIN_DEG_PER_FRAME + 180) % 360) - 180;
        map.current.setCenter(c);
      }
      spinRef.current = requestAnimationFrame(spin);
    };
    const pause = () => {
      interactingRef.current = true;
    };
    const resume = () => {
      interactingRef.current = false;
    };
    m.on('mousedown', pause);
    m.on('touchstart', pause);
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

  // Pause rotation whenever a country detail panel is open.
  useEffect(() => {
    interactingRef.current = selectedCountry !== null;
  }, [selectedCountry]);

  return (
    <section id="global-map" className="scroll-mt-24">
      <SectionHeader
        icon={<Globe size={18} />}
        title="Global Compliance Map"
        subtitle="Country-level AI regulation — drag to rotate, click a country for detail"
      />

      <div className="card-elevated relative overflow-hidden" ref={frameRef}>
        <div
          ref={mapContainer}
          className="w-full h-[460px]"
          style={{ background: OCEAN }}
        />
        <GlobeParticles active={selectedCountry !== null} containerElement={frameRef.current} />
        <GlobeDetailsPanel country={selectedCountry} onClose={() => setSelectedCountry(null)} />
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs px-1">
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-sm" style={{ background: '#14B8A6' }} />
          <span className="text-muted-foreground">Binding AI law in effect</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-sm" style={{ background: '#94A3B8' }} />
          <span className="text-muted-foreground">Researched — no binding law</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-sm" style={{ background: '#E2E8F0' }} />
          <span className="text-muted-foreground">Not yet researched</span>
        </div>
      </div>
    </section>
  );
}
