import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Globe } from 'lucide-react';
import SectionHeader from './SectionHeader';
import GlobeDetailsPanel from './GlobeDetailsPanel';
import GlobeParticles from './particles/GlobeParticles';
import { COUNTRY_AI_LAWS } from '@/data/governance';
import { useGlobeData } from '@/hooks/useGlobeData';

export default function GlobalGlobeVisualization() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const globeData = useGlobeData();
  const particlesContainer = useRef<HTMLDivElement>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    // Create base style using free OSM raster tiles
    const style: maplibregl.StyleSpecification = {
      version: 8,
      sources: {
        'osm': {
          type: 'raster',
          tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
          tileSize: 256,
          attribution: '© OpenStreetMap contributors',
        },
      },
      layers: [
        {
          id: 'osm',
          type: 'raster',
          source: 'osm',
          paint: {
            'raster-brightness-min': -0.2,
            'raster-brightness-max': 0.8,
            'raster-saturation': -0.5,
          },
        } as any,
      ],
    };

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style,
      center: [20, 0],
      zoom: 1.5,
      pitch: 30,
      bearing: 0,
    });

    // Add country data layer
    map.current.on('load', () => {
      if (!map.current) return;

      // Add source for country data
      map.current.addSource('countries', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: globeData.features,
        } as any,
      });

      // Add layer to render country circles
      map.current.addLayer({
        id: 'country-circles',
        type: 'circle',
        source: 'countries',
        paint: {
          'circle-radius': 8,
          'circle-color': ['get', 'color'],
          'circle-stroke-width': 2,
          'circle-stroke-color': ['case', ['boolean', ['feature-state', 'hover'], false], '#0F172A', '#E2E8F0'],
          'circle-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 1, 0.7],
        },
      });

      // Add layer for country labels
      map.current.addLayer({
        id: 'country-labels',
        type: 'symbol',
        source: 'countries',
        layout: {
          'text-field': ['get', 'name'],
          'text-size': 11,
          'text-offset': [0, 1.5],
          'text-anchor': 'top',
        },
        paint: {
          'text-color': '#0F172A',
          'text-halo-color': '#FFFFFF',
          'text-halo-width': 1,
          'text-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 1, 0.5],
        },
      });

      // Interaction: hover
      map.current.on('mousemove', 'country-circles', (e) => {
        if (!map.current) return;

        if (e.features && e.features[0]) {
          const countryName = e.features[0].properties.name;
          setHoveredCountry(countryName);

          if (map.current.isSourceLoaded('countries')) {
            const data = map.current.querySourceFeatures('countries');
            data.forEach((feature) => {
              if (feature.properties.name === countryName) {
                map.current?.setFeatureState(
                  { source: 'countries', id: feature.id },
                  { hover: true }
                );
              }
            });
          }
        }
      });

      // Interaction: unhover
      map.current.on('mouseleave', 'country-circles', () => {
        if (!map.current) return;
        setHoveredCountry(null);

        if (map.current.isSourceLoaded('countries')) {
          const data = map.current.querySourceFeatures('countries');
          data.forEach((feature) => {
            map.current?.setFeatureState(
              { source: 'countries', id: feature.id },
              { hover: false }
            );
          });
        }
      });

      // Interaction: click
      map.current.on('click', 'country-circles', (e) => {
        if (e.features && e.features[0]) {
          const countryName = e.features[0].properties.name;
          setSelectedCountry((prev) => (prev === countryName ? null : countryName));
        }
      });

      // Change cursor on hover
      map.current.on('mouseenter', 'country-circles', () => {
        if (map.current) map.current.getCanvas().style.cursor = 'pointer';
      });
      map.current.on('mouseleave', 'country-circles', () => {
        if (map.current) map.current.getCanvas().style.cursor = '';
      });
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [globeData]);

  return (
    <section id="global-map" className="scroll-mt-24">
      <SectionHeader
        icon={<Globe size={18} />}
        title="Global Compliance Map"
        subtitle="Country-level AI regulation — click for details"
      />

      <div className="card-elevated relative overflow-hidden" ref={particlesContainer}>
        <div
          ref={mapContainer}
          className="w-full h-96 bg-slate-50"
          style={{
            position: 'relative',
          }}
        />
        <GlobeParticles
          selectedCountry={selectedCountry}
          containerElement={particlesContainer.current}
        />
        <GlobeDetailsPanel country={selectedCountry} onClose={() => setSelectedCountry(null)} />
      </div>

      {/* Legend */}
      <div className="mt-4 flex gap-6 text-xs px-5">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary"></div>
          <span className="text-muted-foreground">Binding AI law</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-secondary"></div>
          <span className="text-muted-foreground">Researched — no law</span>
        </div>
      </div>
    </section>
  );
}
