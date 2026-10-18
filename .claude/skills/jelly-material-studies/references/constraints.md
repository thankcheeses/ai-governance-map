# Technical Constraints

These are non-negotiable for authentic Material Studies output.

## Deliverable

- **One self-contained HTML file**
- All CSS, JS, and WGSL inline
- Vanilla JavaScript only
- **No libraries, no CDNs, no external images, fonts, or requests**
- No scroll on the page
- Must run on first load if WebGPU is available

## Rendering

- Native WebGPU + WGSL
- Full-viewport canvas
- devicePixelRatio capped (typically 2)
- Prefer MSAA + HDR (rgba16float) where practical
- Proper handling of `navigator.gpu` missing or device lost → fallback card
- Filmic or Khronos PBR Neutral tone mapping + light dither

## Physics

- Fixed timestep with accumulator
- Shallow water for lagoon/sea scenes (staggered grid preferred)
- XPBD or position-based dynamics for soft bodies
- No per-frame allocations in the hot path
- Target < 5 ms sim time per frame

## Interaction

- Orbit (drag empty space or right-drag)
- Pinch / scroll to zoom
- Direct interaction with water, objects, and soft bodies
- Touch-friendly

## QA Hook

Expose a small debug object on `window` (e.g. `window.__aj`, `window.__vj`) containing state and step controls for testing.
