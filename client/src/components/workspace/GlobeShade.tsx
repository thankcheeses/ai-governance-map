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

/** On-screen diameter of the globe at zoom 0, in CSS px, measured. */
export const GLOBE_PX_AT_Z0 = 136;

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
      const d = GLOBE_PX_AT_Z0 * 2 ** zoom;
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
