import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Globe } from 'lucide-react';
import SectionHeader from './SectionHeader';
import GlobeDetailsPanel from './GlobeDetailsPanel';
import PlaceCard from './PlaceCard';
import { GOVERNANCE_PLACES } from '@/data/places';
import { GLOBE_SKY, SPACE, buildGlobeStyle } from '@/lib/globeStyle';
import { useGlobeData } from '@/hooks/useGlobeData';

export default function GlobalGlobeVisualization() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const spinRef = useRef<number | null>(null);
  const interactingRef = useRef(false);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);
  const [placesOn, setPlacesOn] = useState(true);
  const globeData = useGlobeData();

  useEffect(() => {
    if (!mapContainer.current) return;

    const style = buildGlobeStyle(globeData);

    const m = new maplibregl.Map({
      container: mapContainer.current,
      style,
      center: [-30, 20],
      zoom: 1.55,
      minZoom: 0.8,
      maxZoom: 6,
      pitch: 45,
      maxPitch: 75,
      renderWorldCopies: false,
      attributionControl: { compact: true },
    });
    map.current = m;

    m.on('style.load', () => {
      m.setProjection({ type: 'globe' });
      m.setSky({ ...GLOBE_SKY } as never);
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
    m.on('mouseenter', 'place-dot', () => { m.getCanvas().style.cursor = 'pointer'; });
    m.on('mouseleave', 'place-dot', () => { m.getCanvas().style.cursor = ''; });
    // Pins sit above countries, so this handler runs first and the country
    // click below is suppressed for the same event.
    m.on('click', 'place-dot', (e) => {
      const id = e.features?.[0]?.properties?.id as string | undefined;
      if (!id) return;
      e.preventDefault();
      setSelectedPlace((prev) => (prev === id ? null : id));
      setSelectedCountry(null);
    });
    m.on('click', 'country-fill', (e) => {
      if (e.defaultPrevented) return;
      if (!e.features?.length) return;
      const name = e.features[0].properties?.name as string;
      setSelectedPlace(null);
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
    interactingRef.current = selectedCountry !== null || selectedPlace !== null;
  }, [selectedCountry, selectedPlace]);

  useEffect(() => {
    const m = map.current;
    if (!m?.isStyleLoaded()) return;
    for (const id of ['place-halo', 'place-dot', 'place-label']) {
      if (m.getLayer(id)) m.setLayoutProperty(id, 'visibility', placesOn ? 'visible' : 'none');
    }
    if (!placesOn) setSelectedPlace(null);
  }, [placesOn]);

  const place = GOVERNANCE_PLACES.find((p) => p.id === selectedPlace);
  const unpinned = GOVERNANCE_PLACES.filter((p) => typeof p.lat !== 'number');

  return (
    <section id="global-map" className="scroll-mt-24">
      <SectionHeader
        icon={<Globe size={18} />}
        title="Global Compliance Map"
        subtitle="Country-level AI regulation on a live 3D globe — relief height encodes verified status; drag to rotate, click a country for detail"
        action={
          <button
            type="button"
            onClick={() => setPlacesOn((v) => !v)}
            aria-pressed={placesOn}
            className={`text-xs font-medium px-2.5 py-1 rounded-md border ${
              placesOn ? 'bg-foreground text-background border-foreground' : 'border-border text-muted-foreground'
            }`}
          >
            Institutions
          </button>
        }
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
        {place && typeof place.lat === 'number' && (
          <div className="absolute top-4 right-4 w-[20rem] max-w-[calc(100%-2rem)] z-10">
            <PlaceCard place={place} onClose={() => setSelectedPlace(null)} />
          </div>
        )}
        {placesOn && (
          <p className="absolute bottom-3 right-4 text-[0.6rem] text-white/45 pointer-events-none">
            Zoom in to reveal institutions
          </p>
        )}
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
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-sm bg-gradient-to-t from-slate-400 to-teal-400" />
          <span className="text-muted-foreground">Relief height = verified status (binding rises highest)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full" style={{ background: '#5eead4' }} />
          <span className="text-muted-foreground">Institution — click for its relation to the register</span>
        </div>
      </div>

      {/* A place with no verified coordinate gets no pin, so it would vanish
          from the map entirely. It is listed here instead of being dropped. */}
      {placesOn && unpinned.length > 0 && (
        <div className="mt-3">
          <p className="text-[0.65rem] text-muted-foreground mb-2">
            Catalogued without a verified coordinate — listed rather than pinned at a guess:
          </p>
          <div className="flex flex-wrap gap-2">
            {unpinned.map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => setSelectedPlace((prev) => (prev === u.id ? null : u.id))}
                className="text-[0.65rem] px-2 py-1 rounded border border-dashed border-border text-muted-foreground hover:text-foreground"
              >
                {u.name} · {u.city}
              </button>
            ))}
          </div>
          {place && typeof place.lat !== 'number' && (
            <div className="mt-3 max-w-md">
              <PlaceCard place={place} onClose={() => setSelectedPlace(null)} />
            </div>
          )}
        </div>
      )}
    </section>
  );
}
