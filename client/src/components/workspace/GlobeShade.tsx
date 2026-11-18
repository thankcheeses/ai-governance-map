import { useEffect, useRef } from 'react';
import type maplibregl from 'maplibre-gl';

/**
 * Light on the globe.
 *
 * MapLibre draws the globe's fills flat: every country is lit the same on the
 * limb as at the centre, which is what made the sphere read as a disc. This
 * puts a sphere's lighting over it: a soft key light from the upper left and
 * a terminator falling off toward the lower right, in a circle sized and
 * centred to the globe itself.
 *
 * It is a CSS overlay rather than a shader, so it costs nothing per frame:
 * the globe always sits at the centre of the map, and its on-screen size
 * depends only on zoom, so the circle is resized on `zoom` and nothing else.
 *
 * It fades out as the reader zooms in (lighting a whole planet means nothing
 * when the view is one country), on the flat map, and when the camera is
 * pitched, where the globe is no longer a circle.
 */

/** Rough on-screen diameter of the globe at zoom 0, in CSS px: a first guess only. */
export const GLOBE_PX_AT_Z0 = 136;

/**
 * The globe's actual on-screen diameter, measured rather than estimated.
 *
 * Its apparent size depends on the camera as well as the zoom (a taller map
 * puts the camera further away), so no constant is right at every window
 * size. Instead, walk outward from the centre of the view along one bearing
 * and project each point: the projected distance grows until the horizon and
 * shrinks behind it, so the largest one is the globe's radius on screen.
 */
export function measureGlobeDiameter(map: maplibregl.Map): number {
  const c = map.getCenter();
  const origin = map.project(c);
  const lat1 = (c.lat * Math.PI) / 180;
  const lon1 = (c.lng * Math.PI) / 180;
  const bearing = Math.PI / 2;
  let max = 0;
  for (let deg = 40; deg <= 90; deg += 1) {
    const d = (deg * Math.PI) / 180;
    const lat2 = Math.asin(Math.sin(lat1) * Math.cos(d) + Math.cos(lat1) * Math.sin(d) * Math.cos(bearing));
    const lon2 =
      lon1 + Math.atan2(Math.sin(bearing) * Math.sin(d) * Math.cos(lat1), Math.cos(d) - Math.sin(lat1) * Math.sin(lat2));
    const p = map.project([(lon2 * 180) / Math.PI, (lat2 * 180) / Math.PI]);
    max = Math.max(max, Math.hypot(p.x - origin.x, p.y - origin.y));
  }
  return max * 2;
}

export default function GlobeShade({
  map,
  enabled,
}: {
  map: maplibregl.Map | null;
  enabled: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!map || !el) return;
    const update = () => {
      const zoom = map.getZoom();
      const d = map.getProjection?.()?.type === 'globe' ? measureGlobeDiameter(map) : GLOBE_PX_AT_Z0 * 2 ** zoom;
      el.style.width = `${d}px`;
      el.style.height = `${d}px`;
      // Full strength to zoom 2.4, gone by 3.6; and gone when tilted.
      const byZoom = Math.min(1, Math.max(0, (3.6 - zoom) / 1.2));
      const byPitch = map.getPitch() < 4 ? 1 : 0;
      el.style.opacity = String(enabled ? byZoom * byPitch : 0);
    };
    update();
    map.on('zoom', update);
    map.on('pitch', update);
    map.on('resize', update);
    return () => {
      map.off('zoom', update);
      map.off('pitch', update);
      map.off('resize', update);
    };
  }, [map, enabled]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-300"
      style={{ opacity: 0 }}
    >
      {/* Terminator: the far side of the sphere falls into shade. */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            'radial-gradient(circle at 36% 30%, rgba(2,6,16,0) 0%, rgba(2,6,16,0) 42%, rgba(2,6,16,0.32) 70%, rgba(2,6,16,0.62) 100%)',
        }}
      />
      {/* Key light: a broad, faint sheen on the near side. */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle at 32% 26%, rgba(170,205,255,0.16) 0%, rgba(170,205,255,0) 46%)',
          mixBlendMode: 'screen',
        }}
      />
    </div>
  );
}
