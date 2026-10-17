import { feature } from 'topojson-client';
import worldTopo from 'world-atlas/countries-110m.json';
import type { Feature, FeatureCollection, Geometry } from 'geojson';

// ---------------------------------------------------------------------------
// Coastal proximity, as a texture.
//
// Shallow water is turquoise because sunlight reaches the bottom and bounces
// back; deep water is near-black because it doesn't. The thing that makes a
// lagoon look like a lagoon is therefore DEPTH, and depth correlates with
// distance from land — continental shelves hug coastlines.
//
// This renders the bundled land outline into an equirectangular image and
// blurs it at two radii, giving every point at sea a cheap "how far from land
// am I" value. The ocean shader reads it to place pale shelf water against
// coasts and dark basin water offshore.
//
// WHAT THIS IS NOT: bathymetry. No depth soundings are bundled and none are
// fetched, so this cannot say the Mariana Trench is deeper than the North Sea.
// It is a lighting treatment that happens to be directionally true — shelves
// really are coastal — rather than noise dressed up as data. Nothing in the
// register reads it, and no claim is made from it.
// ---------------------------------------------------------------------------

/** Equirectangular, power-of-two so the shader can wrap longitude. */
export const COAST_W = 1024;
export const COAST_H = 512;

/** Blur radii in pixels. At this width 1px is roughly 39km at the equator. */
const SHELF_BLUR = 5; // ~195km — the near-coast shallows
const BASIN_BLUR = 22; // ~860km — the broad fade into open ocean

const landFeatures = (): Feature<Geometry>[] => {
  const topo = worldTopo as never as { objects: { land: never } };
  const fc = feature(worldTopo as never, topo.objects.land) as unknown as FeatureCollection<Geometry>;
  return fc.features ?? [];
};

/** lon/lat -> pixel, with the world drawn at an x offset so blurs can wrap. */
const project = (lon: number, lat: number, offsetX: number): [number, number] => [
  ((lon + 180) / 360) * COAST_W + offsetX,
  ((90 - lat) / 180) * COAST_H,
];

function tracePolygon(ctx: CanvasRenderingContext2D, rings: number[][][], offsetX: number) {
  for (const ring of rings) {
    let started = false;
    let prevLon = 0;
    for (const [lon, lat] of ring as [number, number][]) {
      // A ring that crosses the antimeridian would otherwise be drawn as a
      // band straight across the map. Break the subpath instead.
      if (started && Math.abs(lon - prevLon) > 180) {
        ctx.closePath();
        started = false;
      }
      const [x, y] = project(lon, lat, offsetX);
      if (!started) {
        ctx.moveTo(x, y);
        started = true;
      } else {
        ctx.lineTo(x, y);
      }
      prevLon = lon;
    }
    ctx.closePath();
  }
}

function drawLand(ctx: CanvasRenderingContext2D, offsetX: number) {
  ctx.beginPath();
  for (const f of landFeatures()) {
    const g = f.geometry;
    if (g.type === 'Polygon') tracePolygon(ctx, g.coordinates as number[][][], offsetX);
    else if (g.type === 'MultiPolygon') {
      for (const poly of g.coordinates as number[][][][]) tracePolygon(ctx, poly, offsetX);
    }
  }
  ctx.fill();
}

const blurOf = (source: HTMLCanvasElement, radius: number): Uint8ClampedArray | null => {
  const c = document.createElement('canvas');
  c.width = source.width;
  c.height = COAST_H;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;
  ctx.filter = `blur(${radius}px)`;
  ctx.drawImage(source, 0, 0);
  // Keep only the middle copy; the outer two existed so the blur wraps.
  return ctx.getImageData(COAST_W, 0, COAST_W, COAST_H).data;
};

/**
 * RGBA, COAST_W x COAST_H:
 *   R = near-coast proximity (1 at the shore, 0 a few hundred km out)
 *   G = broad proximity (1 at the shore, 0 in open ocean)
 *   B = land itself (255 on land, 0 at sea)
 * Returns null where no 2D canvas is available, and the caller falls back to
 * a flat ocean rather than failing.
 */
export function buildCoastField(): Uint8Array | null {
  if (typeof document === 'undefined') return null;

  // Three copies side by side so a blur near x=0 sees the far side of the map.
  const wide = document.createElement('canvas');
  wide.width = COAST_W * 3;
  wide.height = COAST_H;
  const wctx = wide.getContext('2d', { willReadFrequently: true });
  if (!wctx) return null;
  wctx.fillStyle = '#000';
  wctx.fillRect(0, 0, wide.width, wide.height);
  wctx.fillStyle = '#fff';
  for (const offset of [-COAST_W, 0, COAST_W]) drawLand(wctx, offset + COAST_W);

  const shelf = blurOf(wide, SHELF_BLUR);
  const basin = blurOf(wide, BASIN_BLUR);
  const crisp = wctx.getImageData(COAST_W, 0, COAST_W, COAST_H).data;
  if (!shelf || !basin) return null;

  const out = new Uint8Array(COAST_W * COAST_H * 4);
  for (let i = 0; i < COAST_W * COAST_H; i++) {
    const o = i * 4;
    out[o] = shelf[o];
    out[o + 1] = basin[o];
    out[o + 2] = crisp[o];
    out[o + 3] = 255;
  }
  return out;
}

// ---------------------------------------------------------------------------
// Reading the field back on the CPU.
//
// The shader samples this as a texture; anything outside WebGL needs the same
// numbers. Built once and cached, because it costs a few canvas blurs.
// ---------------------------------------------------------------------------

let cached: Uint8Array | null | undefined;

/**
 * How close to land a point is, 0 (open ocean) to 1 (on or beside a coast).
 * Returns 1 where the field could not be built, so callers that use this to
 * unlock something treat "unknown" as "not open ocean" rather than firing by
 * accident.
 */
export function coastalProximityAt(lng: number, lat: number): number {
  if (cached === undefined) cached = buildCoastField();
  if (!cached) return 1;
  const x = Math.min(COAST_W - 1, Math.max(0, Math.round(((lng + 180) / 360) * COAST_W)));
  const y = Math.min(COAST_H - 1, Math.max(0, Math.round(((90 - lat) / 180) * COAST_H)));
  const o = (y * COAST_W + x) * 4;
  // Broad proximity (G) plus the land mask (B): being ON land is maximal.
  return Math.max(cached[o + 1], cached[o + 2]) / 255;
}
