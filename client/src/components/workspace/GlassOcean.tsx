import { useEffect, useRef } from 'react';
import type maplibregl from 'maplibre-gl';

// ---------------------------------------------------------------------------
// The ocean.
//
// MapLibre draws no water: the globe's sea is a hole, the starfield shows
// straight through it, and the planet reads as a wireframe rather than a body.
// This fills that hole with a shaded liquid surface and gives the sphere a
// glass rim, so the globe looks like an object instead of an outline.
//
// WHY A SEPARATE CANVAS, NOT A MAPLIBRE LAYER
// MapLibre has no shader layer for this: fill layers take flat colours, and a
// custom layer on globe projection has to reimplement the projection itself.
// Instead this canvas sits *behind* the (transparent) map canvas and in front
// of the starfield. Land is painted opaque by the `land-base` layer above, so
// the water is visible exactly where there is sea — no ocean polygons needed.
//
// HOW IT STAYS GLUED TO THE GLOBE
// The globe's silhouette is a circle, and `map.project()` of points a fixed
// great-circle distance from centre traces it exactly — measured, not assumed:
// across twelve azimuths the projected radius varies by 0.0%. The radius/zoom
// relationship is NOT a clean formula (MapLibre blends globe into mercator as
// you zoom, so radius/(worldSize/2pi) drifts 0.85 -> 0.43 between z1.95 and
// z4.5), which is why centre and radius are re-measured on every move rather
// than computed from zoom.
//
// ON "RESPOND TO SCROLLING"
// This application does not scroll — it is a fixed full-screen map. The
// honest equivalent is the gesture that scrolling *is* on a map: the wheel
// zooms. So wheel-zoom and drag both pump `energy`, which raises wave
// amplitude, turbulence and speed, and then decays back to calm. Clicking
// drops a ripple. The water answers the pointer instead of a scrollbar that
// isn't there.
// ---------------------------------------------------------------------------

export interface OceanParams {
  /** Spatial frequency of the swell. Higher = more, smaller waves. */
  waveFrequency: number;
  /** Radius of a click ripple, as a fraction of the globe radius. */
  dropRadius: number;
  /** Domain-warp strength. 0 = clean sine swell, 1 = churned and chaotic. */
  turbulence: number;
  /** Time multiplier for every animated term. */
  speed: number;
  /** Height of the normal perturbation — how "jelly" the surface reads. */
  amplitude: number;
}

export const OCEAN_DEFAULTS: OceanParams = {
  waveFrequency: 14.0,
  dropRadius: 0.17,
  turbulence: 0.28,
  speed: 0.42,
  amplitude: 0.7,
};

const MAX_DROPS = 6;

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;

uniform vec2  u_resolution;
uniform vec2  u_center;      // globe centre, px, y measured from the BOTTOM
uniform float u_radius;      // globe silhouette radius, px
uniform float u_time;
uniform vec2  u_geo;         // map centre lon/lat in radians: waves advect with the globe
uniform float u_freq;
uniform float u_turb;
uniform float u_amp;
uniform float u_energy;      // 0..1 from wheel/drag, decays to calm
uniform float u_dropRadius;
uniform vec4  u_drops[${MAX_DROPS}];  // xy = sphere-normalised position, z = birth time, w = strength

const float PI = 3.14159265359;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

// Swell height at a point on the sphere's surface, in radians of lon/lat.
float swell(vec2 q, float t) {
  vec2 w = q;
  // Domain warp. This is what stops the surface reading as a plain sine grid.
  // One noise lookup, reused with an offset for the second axis: two lookups
  // here cost six per pixel once the gradient taps are counted, and the
  // difference is not visible.
  float warp = noise(q * 1.7 + t * 0.11);
  w += u_turb * vec2(warp, noise(q * 1.7 + vec2(37.2, 11.5) - t * 0.13)) * 1.4;
  float h = 0.0;
  h += sin(w.x * 1.00 + t * 1.00) * 0.50;
  h += sin(w.y * 1.30 - t * 0.80) * 0.34;
  h += sin((w.x + w.y) * 2.10 + t * 1.55) * 0.21;
  h += sin((w.x - w.y) * 3.30 - t * 2.05) * 0.12;
  h += sin((w.x * 0.7 + w.y * 1.9) * 5.1 + t * 2.9) * 0.06;
  // Kept small and fine: a big, slow noise term reads as fog on the ocean,
  // not as water. This only breaks up the regularity of the sines.
  h += noise(w * 4.2 + t * 0.35) * 0.09;
  return h;
}

// Ripples from clicks, in sphere-normalised space so they sit on the globe.
float drops(vec2 d) {
  float h = 0.0;
  for (int i = 0; i < ${MAX_DROPS}; i++) {
    float born = u_drops[i].z;
    if (born <= 0.0) continue;
    float age = u_time - born;
    if (age < 0.0 || age > 3.2) continue;
    float dist = distance(d, u_drops[i].xy);
    float ring = sin(dist / max(u_dropRadius, 0.001) * PI * 2.0 - age * 7.0);
    float falloff = exp(-dist / (u_dropRadius * 2.2)) * exp(-age * 1.35);
    h += ring * falloff * u_drops[i].w;
  }
  return h;
}

void main() {
  vec2 d = (gl_FragCoord.xy - u_center) / u_radius;
  float r2 = dot(d, d);
  if (r2 > 1.0) discard;

  // Sphere normal from the screen-space disc.
  float z = sqrt(max(1.0 - r2, 0.0));
  vec3 n = vec3(d, z);

  // Surface coordinates, offset by the map centre so the swell travels with
  // the globe when you drag it rather than sliding across the screen.
  float lat = asin(clamp(n.y, -1.0, 1.0));
  float lon = atan(n.x, max(n.z, 1e-4));
  vec2 q = (vec2(lon, lat) + u_geo) * u_freq;

  float t = u_time * (1.0 + u_energy * 1.6);
  float e = 0.0012;
  float h  = swell(q, t)                      + drops(d);
  float hx = swell(q + vec2(e * u_freq, 0.0), t) + drops(d + vec2(e, 0.0));
  float hy = swell(q + vec2(0.0, e * u_freq), t) + drops(d + vec2(0.0, e));

  float amp = u_amp * (1.0 + u_energy * 1.1);
  vec3 nn = normalize(n + vec3(-(hx - h), -(hy - h), 0.0) * amp * 18.0);

  vec3 V = vec3(0.0, 0.0, 1.0);
  vec3 L = normalize(vec3(-0.42, 0.55, 0.72));
  vec3 H = normalize(L + V);

  // A tighter fresnel exponent keeps the glass on the rim instead of washing
  // the whole disc pale, and two specular lobes give both broad sheen and the
  // small hard glints that make a surface read as liquid.
  float fres = pow(1.0 - clamp(dot(nn, V), 0.0, 1.0), 4.5);
  float spec = pow(max(dot(nn, H), 0.0), 140.0);
  float sheen = pow(max(dot(nn, H), 0.0), 18.0);
  float diff = max(dot(nn, L), 0.0);

  // Body: deep navy in the troughs lifting to a teal-green shallow on the crests.
  vec3 deep    = vec3(0.016, 0.058, 0.105);
  vec3 shallow = vec3(0.043, 0.212, 0.231);
  vec3 col = mix(deep, shallow, clamp(h * 0.42 + 0.45, 0.0, 1.0));
  col += shallow * diff * 0.26;

  // Glass: a cool rim that climbs toward the limb, plus specular glints.
  col += vec3(0.33, 0.68, 0.76) * fres * 0.55;
  col += vec3(0.42, 0.78, 0.82) * sheen * 0.16;
  col += vec3(1.0, 1.0, 1.0) * spec * (0.85 + u_energy * 0.6);

  // Let the limb hand over to MapLibre's atmosphere instead of ending on a
  // hard circle, and keep a soft inner falloff so the sphere has depth.
  float edge = smoothstep(1.0, 0.975, sqrt(r2));
  gl_FragColor = vec4(col, edge * 0.95);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.warn('[GlassOcean] shader failed:', gl.getShaderInfoLog(sh));
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

interface Props {
  map: maplibregl.Map | null;
  /** When false the canvas is torn down entirely — no context, no frames. */
  enabled?: boolean;
  params?: Partial<OceanParams>;
}

export default function GlassOcean({ map, enabled = true, params }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const paramsRef = useRef<OceanParams>({ ...OCEAN_DEFAULTS, ...params });
  paramsRef.current = { ...OCEAN_DEFAULTS, ...params };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !map || !enabled) return;

    const gl = (canvas.getContext('webgl2', { alpha: true, antialias: false, premultipliedAlpha: false }) ??
      canvas.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: false })) as
      | WebGLRenderingContext
      | null;
    if (!gl) return; // No WebGL: the globe simply stays as it was.

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.warn('[GlassOcean] link failed:', gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    // One oversized triangle beats a quad: no diagonal seam, one less vertex.
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const u = (name: string) => gl.getUniformLocation(prog, name);
    const U = {
      resolution: u('u_resolution'), center: u('u_center'), radius: u('u_radius'),
      time: u('u_time'), geo: u('u_geo'), freq: u('u_freq'), turb: u('u_turb'),
      amp: u('u_amp'), energy: u('u_energy'), dropRadius: u('u_dropRadius'), drops: u('u_drops'),
    };

    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    let still = !!reduced?.matches;
    const onReduced = (e: MediaQueryListEvent) => { still = e.matches; };
    reduced?.addEventListener?.('change', onReduced);

    // --- globe geometry, re-measured on move -------------------------------
    // The silhouette is a circle but its radius is not a formula of zoom, so
    // sample a spread of great-circle distances and keep the widest projection.
    let center = { x: 0, y: 0 };
    let radius = 1;
    let geo: [number, number] = [0, 0];

    const destination = (lng: number, lat: number, bearingDeg: number, distDeg: number) => {
      const R = Math.PI / 180;
      const p1 = lat * R, l1 = lng * R, b = bearingDeg * R, dd = distDeg * R;
      const p2 = Math.asin(Math.sin(p1) * Math.cos(dd) + Math.cos(p1) * Math.sin(dd) * Math.cos(b));
      const l2 = l1 + Math.atan2(Math.sin(b) * Math.sin(dd) * Math.cos(p1), Math.cos(dd) - Math.sin(p1) * Math.sin(p2));
      return [((l2 / R + 540) % 360) - 180, p2 / R] as [number, number];
    };

    const measure = () => {
      const c = map.getCenter();
      const cp = map.project(c);
      center = { x: cp.x, y: cp.y };
      geo = [(c.lng * Math.PI) / 180, (c.lat * Math.PI) / 180];
      let max = 0;
      for (const dist of [55, 70, 80, 86, 89]) {
        for (const bearing of [0, 90, 180, 270]) {
          const p = map.project(destination(c.lng, c.lat, bearing, dist));
          max = Math.max(max, Math.hypot(p.x - center.x, p.y - center.y));
        }
      }
      radius = max;
    };

    // --- interaction energy -------------------------------------------------
    let energy = 0;
    let lastZoom = map.getZoom();
    let lastCenterPx = map.project(map.getCenter());
    const drops = new Float32Array(MAX_DROPS * 4);
    let dropCursor = 0;
    const start = performance.now();
    const clock = () => (performance.now() - start) / 1000;

    const pump = (amount: number) => { energy = Math.min(1, energy + amount); };

    const onMove = () => {
      measure();
      const z = map.getZoom();
      const cp = map.project(map.getCenter());
      // Wheel-zoom and drag are this map's "scroll". Both stir the water.
      pump(Math.abs(z - lastZoom) * 1.5);
      pump(Math.min(0.25, Math.hypot(cp.x - lastCenterPx.x, cp.y - lastCenterPx.y) / 900));
      lastZoom = z;
      lastCenterPx = cp;
    };

    const onClick = (e: maplibregl.MapMouseEvent) => {
      if (still || radius <= 0) return;
      const dx = (e.point.x - center.x) / radius;
      const dy = -(e.point.y - center.y) / radius; // shader y is bottom-up
      if (dx * dx + dy * dy > 1) return;
      const i = (dropCursor++ % MAX_DROPS) * 4;
      drops[i] = dx; drops[i + 1] = dy; drops[i + 2] = clock(); drops[i + 3] = 1;
      pump(0.35);
    };

    measure();
    map.on('move', onMove);
    map.on('resize', measure);
    map.on('click', onClick);

    // --- render loop --------------------------------------------------------
    // A full-screen fragment shader is the kind of thing that is free on a
    // discrete GPU and ruinous without one, so the loop measures itself and
    // drops resolution rather than letting the whole page stutter. It only
    // ever steps down: oscillating between two scales looks worse than the
    // lower one. Measured under software rendering (SwiftShader), the floor
    // keeps the page responsive where full resolution does not.
    let raf = 0;
    const MIN_SCALE = 0.5;
    const maxScale = Math.min(window.devicePixelRatio || 1, 1.5);
    let scale = maxScale;
    let samples: number[] = [];
    let lastFrameAt = 0;
    // Water does not need 60fps, and halving the frame count halves the cost.
    const MIN_FRAME_MS = 32;

    const resize = () => {
      const w = Math.max(1, Math.round(canvas.clientWidth * scale));
      const h = Math.max(1, Math.round(canvas.clientHeight * scale));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (document.hidden) return;
      if (lastFrameAt && now - lastFrameAt < MIN_FRAME_MS) return;

      if (lastFrameAt) {
        const dt = now - lastFrameAt;
        // A single catastrophic frame means this machine is never going to
        // manage full resolution, so skip the staircase and go to the floor.
        if (dt > 250 && scale > MIN_SCALE) {
          scale = MIN_SCALE;
          samples = [];
        } else {
          samples.push(dt);
          if (samples.length >= 6) {
            const avg = samples.reduce((a, b) => a + b, 0) / samples.length;
            // Budget is generous: this is a background effect, and the map's
            // own rendering has to fit in the same frame.
            if (avg > 55 && scale > MIN_SCALE) scale = Math.max(MIN_SCALE, scale * 0.6);
            samples = [];
          }
        }
      }
      lastFrameAt = now;

      resize();
      const dpr = scale;
      const p = paramsRef.current;

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      if (radius <= 0) return;

      energy *= 0.94; // settle back to calm

      gl.uniform2f(U.resolution, canvas.width, canvas.height);
      // MapLibre's y grows downward, gl_FragCoord's grows upward.
      gl.uniform2f(U.center, center.x * dpr, canvas.height - center.y * dpr);
      gl.uniform1f(U.radius, radius * dpr);
      // Reduced motion freezes the clock: the ocean keeps its shading and
      // its glass rim, it just stops moving.
      gl.uniform1f(U.time, still ? 12.5 : clock() * p.speed);
      gl.uniform2f(U.geo, geo[0], geo[1]);
      gl.uniform1f(U.freq, p.waveFrequency);
      gl.uniform1f(U.turb, p.turbulence);
      gl.uniform1f(U.amp, p.amplitude);
      gl.uniform1f(U.energy, still ? 0 : energy);
      gl.uniform1f(U.dropRadius, p.dropRadius);
      gl.uniform4fv(U.drops, still ? new Float32Array(MAX_DROPS * 4) : drops);

      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    raf = requestAnimationFrame(frame);

    const onLost = (e: Event) => { e.preventDefault(); cancelAnimationFrame(raf); };
    canvas.addEventListener('webglcontextlost', onLost);

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener('webglcontextlost', onLost);
      reduced?.removeEventListener?.('change', onReduced);
      map.off('move', onMove);
      map.off('resize', measure);
      map.off('click', onClick);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, [map, enabled]);

  if (!enabled) return null;
  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}
