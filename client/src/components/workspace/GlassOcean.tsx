import { useEffect, useRef } from 'react';
import type maplibregl from 'maplibre-gl';
import { COAST_H, COAST_W, buildCoastField } from '@/lib/coastField';

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
  speed: 0.55,
  amplitude: 0.95,
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
uniform float u_radius;      // globe silhouette radius, px (drop coordinates)
uniform float u_camDist;     // camera distance from globe centre, in globe radii
uniform float u_k;           // projection scale: r_px = u_k * sin(theta)/(D - cos(theta))
uniform float u_time;
uniform vec2  u_centerGeo;   // map centre lon/lat in radians
uniform float u_freq;
uniform float u_cfreq;      // caustic cells per radian: about 30px on screen at any zoom
uniform float u_turb;
uniform float u_amp;
uniform float u_energy;      // 0..1 from wheel/drag, decays to calm
uniform float u_dropRadius;
uniform float u_hasCoast;    // 0 when the coast field could not be built
uniform float u_flat;        // 1 in mercator, 0 on the globe
uniform vec4  u_merc;        // flat mode: west lon, east lon, top mercY, bottom mercY (radians)
uniform vec2  u_slosh;       // drag direction, decaying — the water lags the hand
uniform sampler2D u_coast;   // R near-coast, G broad, B land
uniform vec4  u_drops[${MAX_DROPS}];  // xy = sphere-normalised, z = birth, w = strength

const float PI  = 3.14159265359;
const float TAU = 6.28318530718;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

// Screen-space sphere normal -> true geographic direction. The globe is drawn
// with the map centre at the sub-viewer point, so undoing that rotation gives
// real longitude and latitude and lets the water be sampled and advected in
// geographic space instead of sliding across the screen when you drag.
vec3 toGeo(vec3 n, float lam0, float phi0) {
  float cp = cos(phi0), sp = sin(phi0);
  vec3 a = vec3(n.x, n.y * cp + n.z * sp, -n.y * sp + n.z * cp);
  float cl = cos(lam0), sl = sin(lam0);
  return vec3(a.x * cl + a.z * sl, a.y, -a.x * sl + a.z * cl);
}

// Swell height in radians of lon/lat.
float swell(vec2 q, float t) {
  vec2 w = q;
  float warp = noise(q * 1.7 + t * 0.11);
  w += u_turb * vec2(warp, noise(q * 1.7 + vec2(37.2, 11.5) - t * 0.13)) * 1.4;
  float h = 0.0;
  h += sin(w.x * 1.00 + t * 1.00) * 0.50;
  h += sin(w.y * 1.30 - t * 0.80) * 0.34;
  h += sin((w.x + w.y) * 2.10 + t * 1.55) * 0.21;
  h += sin((w.x - w.y) * 3.30 - t * 2.05) * 0.12;
  h += sin((w.x * 0.7 + w.y * 1.9) * 3.4 + t * 2.9) * 0.06;
  h += noise(w * 2.2 + t * 0.35) * 0.09;
  return h;
}

// Sunlight focused by the surface into a net of bright lines on the floor —
// the reference's look, not a grid of blobs. Each pass bends the sample point
// by the previous one, which is what draws the cells together into filaments.
float caustic(vec2 uv, float t) {
  vec2 p = mod(uv * TAU, TAU) - 250.0;
  vec2 i = p;
  float c = 1.0;
  const float inten = 0.005;
  for (int n = 0; n < 4; n++) {
    float tt = t * (1.0 - 3.5 / float(n + 1));
    i = p + vec2(cos(tt - i.x) + sin(tt + i.y), sin(tt - i.y) + cos(tt + i.x));
    c += 1.0 / length(vec2(p.x / (sin(i.x + tt) / inten), p.y / (cos(i.y + tt) / inten)));
  }
  c /= 4.0;
  c = 1.17 - pow(c, 1.4);
  return clamp(pow(abs(c), 8.0), 0.0, 1.5);
}

// A pale studio sky for the surface to reflect: warm below the horizon,
// cool above, two soft lamps. Taken from the reference's own environment.
vec3 environment(vec3 r) {
  float up = smoothstep(-0.1, 0.7, r.y);
  vec3 c = mix(vec3(0.51, 0.48, 0.42), vec3(0.86, 0.92, 0.93), up);
  c += vec3(1.2, 1.15, 1.0) * pow(clamp(dot(r, normalize(vec3(-0.7, 1.2, 0.4))), 0.0, 1.0), 54.0);
  c += vec3(0.52, 0.64, 0.69) * pow(clamp(dot(r, normalize(vec3(0.8, 0.6, -0.7))), 0.0, 1.0), 100.0);
  return c;
}

float drops(vec2 d) {
  float h = 0.0;
  for (int i = 0; i < ${MAX_DROPS}; i++) {
    float born = u_drops[i].z;
    if (born <= 0.0) continue;
    float age = u_time - born;
    if (age < 0.0 || age > 3.2) continue;
    float dist = distance(d, u_drops[i].xy);
    float ring = sin(dist / max(u_dropRadius, 0.001) * TAU - age * 7.0);
    float falloff = exp(-dist / (u_dropRadius * 2.2)) * exp(-age * 1.35);
    h += ring * falloff * u_drops[i].w;
  }
  return h;
}

void main() {
  vec3 n;
  vec2 d;
  float lam, phi, r2;

  if (u_flat > 0.5) {
    // Mercator. There is no limb and no sphere: the water fills the viewport,
    // and longitude/latitude come straight back out of the projection. x is
    // linear in longitude, y is linear in mercator-y, so inverting is exact.
    vec2 uv = gl_FragCoord.xy / u_resolution;
    lam = mix(u_merc.x, u_merc.y, uv.x);
    float my = mix(u_merc.w, u_merc.z, uv.y);
    phi = 2.0 * atan(exp(my)) - PI * 0.5;
    n = vec3(0.0, 0.0, 1.0);
    // Ripples still want a stable local frame; use screen space scaled to the
    // viewport's short side so a drop is round rather than stretched.
    d = (gl_FragCoord.xy - u_resolution * 0.5) / min(u_resolution.x, u_resolution.y);
    r2 = 0.0;
  } else {
    // MapLibre's globe is a PERSPECTIVE view of a sphere, not an orthographic
    // one. Treating it as orthographic put the water's silhouette in a
    // different place from the land's, and zooming in showed the two edges
    // apart — the globe appeared to double.
    //
    // For a camera D globe-radii from the centre, a surface point at angular
    // distance theta from the sub-viewer point projects to
    //     r = k * sin(theta) / (D - cos(theta))
    // which inverts exactly:
    //     theta = asin( u*D / sqrt(1+u*u) ) - atan(u),   u = r / k
    // and the horizon is where that asin argument reaches 1. Same geometry
    // MapLibre uses, so the two limbs now coincide at every zoom.
    vec2 pv = gl_FragCoord.xy - u_center;
    float rpx = length(pv);
    d = pv / max(u_radius, 1.0);
    r2 = dot(d, d);

    float u = rpx / max(u_k, 1e-4);
    float sArg = u * u_camDist / sqrt(1.0 + u * u);
    if (sArg >= 1.0) discard;                 // beyond the horizon
    float theta = asin(sArg) - atan(u);
    float az = atan(pv.y, pv.x);
    n = vec3(sin(theta) * cos(az), sin(theta) * sin(az), cos(theta));

    vec3 g = toGeo(n, u_centerGeo.x, u_centerGeo.y);
    lam = atan(g.x, g.z);
    phi = asin(clamp(g.y, -1.0, 1.0));
    r2 = sArg * sArg;                          // 1 exactly at the limb
  }

  vec2 geoUV = vec2(lam / TAU + 0.5, 0.5 - phi / PI);

  // How far out to sea this point is. Without the field everything is open
  // ocean, which is the old flat look rather than a broken one.
  float shelf = 0.0, basin = 0.0;
  if (u_hasCoast > 0.5) {
    vec3 c = texture2D(u_coast, geoUV).rgb;
    shelf = c.r;
    basin = c.g;
  }
  float depth = clamp(1.0 - (shelf * 0.62 + basin * 0.38), 0.0, 1.0);

  vec2 q = vec2(lam, phi) * u_freq + u_slosh;
  float t = u_time * (1.0 + u_energy * 1.6);
  float e = 0.0012;
  float h  = swell(q, t)                         + drops(d);
  float hx = swell(q + vec2(e * u_freq, 0.0), t) + drops(d + vec2(e, 0.0));
  float hy = swell(q + vec2(0.0, e * u_freq), t) + drops(d + vec2(0.0, e));

  float amp = u_amp * (1.0 + u_energy * 1.1);
  // Gentle, glassy slopes: the reference reads as a smooth jelly surface, and
  // steep normals turned every crest into a bright scribble.
  vec3 nn = normalize(n + vec3(-(hx - h), -(hy - h), 0.0) * amp * 6.0);

  // On a sphere every pixel has its own normal, so a hard specular lands as a
  // scatter of glints. On a plane every pixel shares one normal, so the same
  // highlight fires along whole slope contours at once and the ocean fills
  // with long diagonal streaks. Giving the flat view a camera above the plane
  // — a view vector that fans out from the centre — breaks that coherence the
  // way perspective would, and the sharp lobe is damped on top of it.
  vec2 fanUV = gl_FragCoord.xy / u_resolution - 0.5;
  vec3 V = normalize(mix(vec3(0.0, 0.0, 1.0), vec3(fanUV * 1.25, 1.0), u_flat));
  vec3 L = normalize(vec3(-0.42, 0.55, 0.72));
  vec3 H = normalize(L + V);
  float spec = pow(max(dot(nn, H), 0.0), 140.0);

  // THE WATER IS CLEAR, NOT PAINTED. This follows the reference (Atoll
  // Jelly) term for term: light reaches a pale sand floor, crosses some
  // length of water on the way back, and that water absorbs red fast and
  // green-blue slowly. Shallow water is therefore sand-coloured, and depth
  // alone turns it turquoise — no colour ramp is chosen by hand. Absorption,
  // scatter tint and sand are the reference's own "Turquoise" palette values.
  const vec3 ABSORB = vec3(1.65, 0.22, 0.28);
  const vec3 TINT   = vec3(0.015, 0.44, 0.40);
  const vec3 SAND   = vec3(0.89, 0.82, 0.65);

  // Water crossed, from distance to the coast: lagoon shallows on the shelf,
  // a long path over the open basin.
  float path = mix(0.03, 1.7, pow(depth, 1.1));

  // Refraction: the floor is seen through a tilted surface, so the caustic
  // net is sampled where the bent ray lands, and it wobbles with the waves.
  vec2 floorUV = geoUV + (nn.xy - n.xy) * 0.0035 * min(path, 3.0);
  vec2 cq = (floorUV * vec2(TAU, PI)) * u_cfreq;
  float cz = caustic(cq, t * 0.9);
  vec3 floorLight = SAND * 0.98 + vec3(0.45, 0.40, 0.25) * cz * 2.4 * exp(-path * 0.5);

  vec3 trans = exp(-ABSORB * path);
  vec3 col = floorLight * trans + TINT * (vec3(1.0) - trans) * 0.76;

  // Light shafts: a faint glow of the caustics through the body of the water.
  col += TINT * cz * 0.12 * (1.0 - trans.g);

  // Glass. Schlick fresnel toward a pale sky, as the reference does: little
  // reflection looking straight down, a bright rim at grazing angles. The
  // flat map looks straight down everywhere, so it keeps only a trace.
  float ndv  = clamp(dot(nn, V), 0.0, 1.0);
  float fres = (0.026 + 0.974 * pow(1.0 - ndv, 5.0)) * mix(1.0, 0.25, u_flat);
  col = mix(col, environment(reflect(-V, nn)), clamp(fres, 0.0, 0.92));
  col += vec3(1.0, 0.96, 0.84) * spec * (0.6 + u_energy * 0.4) * mix(1.0, 0.25, u_flat);

  // Lace foam where the water meets land, broken up so it reads as surf.
  float lace = smoothstep(0.78, 0.97, shelf) * u_hasCoast;
  lace *= 0.40 + 0.60 * smoothstep(0.25, 0.65, noise(geoUV * vec2(1400.0, 700.0) + t * 0.16));
  col = mix(col, vec3(0.92, 0.98, 0.94), clamp(lace * 0.65, 0.0, 0.96));

  float edge = u_flat > 0.5 ? 1.0 : smoothstep(1.0, 0.975, sqrt(r2));
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
      time: u('u_time'), centerGeo: u('u_centerGeo'), freq: u('u_freq'), cfreq: u('u_cfreq'), turb: u('u_turb'),
      amp: u('u_amp'), energy: u('u_energy'), dropRadius: u('u_dropRadius'), drops: u('u_drops'),
      hasCoast: u('u_hasCoast'), coast: u('u_coast'),
      flat: u('u_flat'), merc: u('u_merc'), slosh: u('u_slosh'),
      camDist: u('u_camDist'), k: u('u_k'),
    };

    // Coastal proximity, built once. It drives the depth ramp that makes
    // shelves read turquoise and open ocean read near-black. Built lazily and
    // tolerated as absent: without it the uniform stays 0 and the ocean falls
    // back to a single deep tone rather than failing.
    const coastTex = gl.createTexture();
    let hasCoast = 0;
    const field = buildCoastField();
    if (coastTex && field) {
      gl.bindTexture(gl.TEXTURE_2D, coastTex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, COAST_W, COAST_H, 0, gl.RGBA, gl.UNSIGNED_BYTE, field);
      // Longitude wraps; latitude must not, or the poles bleed across.
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      hasCoast = 1;
    }
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, coastTex);
    gl.uniform1i(U.coast, 0);
    gl.uniform1f(U.hasCoast, hasCoast);

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
    let camDist = 4;
    let projK = 1;
    let flat = false;
    let merc: [number, number, number, number] = [-Math.PI, Math.PI, 1, -1];

    const destination = (lng: number, lat: number, bearingDeg: number, distDeg: number) => {
      const R = Math.PI / 180;
      const p1 = lat * R, l1 = lng * R, b = bearingDeg * R, dd = distDeg * R;
      const p2 = Math.asin(Math.sin(p1) * Math.cos(dd) + Math.cos(p1) * Math.sin(dd) * Math.cos(b));
      const l2 = l1 + Math.atan2(Math.sin(b) * Math.sin(dd) * Math.cos(p1), Math.cos(dd) - Math.sin(p1) * Math.sin(p2));
      return [((l2 / R + 540) % 360) - 180, p2 / R] as [number, number];
    };

    // Mercator y, in radians, for the flat-mode inverse in the shader.
    const mercY = (lat: number) => {
      const p = Math.max(-85.05112878, Math.min(85.05112878, lat)) * (Math.PI / 180);
      return Math.log(Math.tan(Math.PI / 4 + p / 2));
    };

    // Radians of arc per screen pixel at the reference view (globe, z1.95,
    // 267px radius). Frequencies are scaled against this so a wave is the same
    // size on screen in every projection and at every zoom.
    const REF_RAD_PER_PX = Math.PI / (2 * 267);
    let radPerPx = REF_RAD_PER_PX;

    const measure = () => {
      const c = map.getCenter();
      const cp = map.project(c);
      center = { x: cp.x, y: cp.y };
      geo = [(c.lng * Math.PI) / 180, (c.lat * Math.PI) / 180];

      // The flat map is a plain rectangle, so the shader needs its geographic
      // extent rather than a silhouette. Linear interpolation across the
      // viewport is exact for mercator only while the camera is square-on, so
      // a pitched or rotated view turns the water off rather than drawing it
      // in the wrong place.
      flat = map.getProjection?.()?.type === 'mercator';
      if (flat) {
        const square = Math.abs(map.getPitch()) < 1 && Math.abs(map.getBearing()) < 1;
        if (!square) {
          flat = false;
          radius = 0;
          return;
        }
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        const tl = map.unproject([0, 0]);
        const br = map.unproject([w, h]);
        merc = [
          (tl.lng * Math.PI) / 180,
          (br.lng * Math.PI) / 180,
          mercY(tl.lat),
          mercY(br.lat),
        ];
        radPerPx = Math.abs(merc[1] - merc[0]) / Math.max(1, w);
        radius = Math.max(w, h); // non-zero so the frame loop draws
        return;
      }

      // Fit the perspective projection rather than assuming an orthographic
      // one. Two points at known angular distance, both comfortably inside the
      // horizon at any zoom, determine the camera distance D and the scale k in
      //     r = k * sin(theta) / (D - cos(theta))
      // and the visible limb then falls out as k / sqrt(D^2 - 1). Taking the
      // widest projected sample instead — the old approach — picked up points
      // BEHIND the horizon, which project outside the limb, so the water disc
      // came out too big and the globe looked doubled.
      const sample = (deg: number) => {
        let sum = 0;
        for (const bearing of [0, 90, 180, 270]) {
          const p = map.project(destination(c.lng, c.lat, bearing, deg));
          sum += Math.hypot(p.x - center.x, p.y - center.y);
        }
        return sum / 4;
      };

      const t1 = (20 * Math.PI) / 180;
      const t2 = (50 * Math.PI) / 180;
      const r1 = sample(20);
      const r2 = sample(50);
      const ratio = r2 > 0 ? r1 / r2 : 0;
      const denom = ratio * Math.sin(t2) - Math.sin(t1);
      const D = Math.abs(denom) > 1e-9
        ? (ratio * Math.sin(t2) * Math.cos(t1) - Math.sin(t1) * Math.cos(t2)) / denom
        : NaN;

      if (Number.isFinite(D) && D > 1.0005 && r1 > 0) {
        camDist = D;
        projK = (r1 * (D - Math.cos(t1))) / Math.sin(t1);
        radius = projK / Math.sqrt(D * D - 1);
      } else {
        // Degenerate fit (the globe-to-mercator blend at high zoom can produce
        // one): fall back to something that still draws rather than vanishing.
        camDist = 1e4;
        projK = r1 > 0 ? (r1 * camDist) / Math.sin(t1) : 1;
        radius = Math.max(canvas.clientWidth, canvas.clientHeight) * 4;
      }
      radPerPx = radius > 0 ? Math.PI / (2 * radius) : REF_RAD_PER_PX;
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

    // How far the water lags the hand, and in which direction. Dragging shears
    // the wave field; it springs back when you let go. This is the part that
    // reads as "jelly" rather than as a texture sliding past.
    let slosh: [number, number] = [0, 0];
    let wakeDebt = 0;

    const onMove = () => {
      measure();
      const z = map.getZoom();
      const cp = map.project(map.getCenter());
      const dz = Math.abs(z - lastZoom);
      const dx = cp.x - lastCenterPx.x;
      const dy = cp.y - lastCenterPx.y;
      const travel = Math.hypot(dx, dy);

      // Wheel-zoom and drag are this map's "scroll". Both stir the water.
      pump(dz * 2.2);
      pump(Math.min(0.4, travel / 420));

      // The surface shears opposite the drag and relaxes back, so spinning the
      // globe visibly drags the water with it.
      slosh[0] = Math.max(-0.5, Math.min(0.5, slosh[0] - dx / 260));
      slosh[1] = Math.max(-0.5, Math.min(0.5, slosh[1] + dy / 260));

      // A wake: drop ripples along the path so motion throws spray rather than
      // just rippling in place. Spaced by distance, not by frame, so a fast
      // flick and a slow drag leave the same trail density.
      if (!still && radius > 0) {
        wakeDebt += travel;
        if (wakeDebt > 55) {
          wakeDebt = 0;
          const jitter = () => (Math.random() - 0.5) * 0.55;
          const i = (dropCursor++ % MAX_DROPS) * 4;
          drops[i] = jitter();
          drops[i + 1] = jitter();
          drops[i + 2] = clock();
          drops[i + 3] = 0.55;
        }
      }

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
      // Springs back a little slower than the energy fades, so the water is
      // still settling after the globe has stopped.
      slosh[0] *= 0.955;
      slosh[1] *= 0.955;

      gl.uniform2f(U.resolution, canvas.width, canvas.height);
      // MapLibre's y grows downward, gl_FragCoord's grows upward.
      gl.uniform2f(U.center, center.x * dpr, canvas.height - center.y * dpr);
      gl.uniform1f(U.radius, radius * dpr);
      gl.uniform1f(U.camDist, camDist);
      gl.uniform1f(U.k, projK * dpr);
      // Reduced motion freezes the clock: the ocean keeps its shading and
      // its glass rim, it just stops moving.
      gl.uniform1f(U.time, still ? 12.5 : clock() * p.speed);
      gl.uniform2f(U.centerGeo, geo[0], geo[1]);
      // Clamped: past these bounds the swell either aliases into moire or
      // stretches into featureless bands.
      const freqScale = Math.max(0.35, Math.min(2.2, REF_RAD_PER_PX / radPerPx));
      gl.uniform1f(U.freq, p.waveFrequency * freqScale);
      // Caustics keep a constant on-screen size instead: a light net on the
      // sea floor that grew to the size of a state when zoomed in read as
      // scattered scribbles, not as light.
      gl.uniform1f(U.cfreq, 1 / (30 * radPerPx));
      gl.uniform1f(U.turb, p.turbulence);
      gl.uniform1f(U.amp, p.amplitude);
      gl.uniform1f(U.energy, still ? 0 : energy);
      gl.uniform1f(U.dropRadius, p.dropRadius);
      gl.uniform1f(U.flat, flat ? 1 : 0);
      gl.uniform4f(U.merc, merc[0], merc[1], merc[2], merc[3]);
      gl.uniform2f(U.slosh, still ? 0 : slosh[0], still ? 0 : slosh[1]);
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
      if (coastTex) gl.deleteTexture(coastTex);
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
