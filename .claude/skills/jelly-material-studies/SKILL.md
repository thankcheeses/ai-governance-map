---
name: jelly-material-studies
description: "Generate self-contained interactive WebGPU + WGSL 'Material Studies' jelly dioramas and soft-body specimens. Use when the user asks for jelly scenes, jelly dioramas, Material Studies pages, interactive WebGPU jelly, Atoll Jelly-style scenes, or wants to create tactile editorial jelly experiences like those from @vib3coded. Claude Code first: produce complete single-file HTML that runs immediately."
type: workflow
lifecycle: active
---

# Jelly Material Studies — Interactive WebGPU Dioramas

Generate single self-contained HTML files that render interactive, physically simulated "Material Studies" jelly dioramas and soft-body specimens using native WebGPU + WGSL. No libraries, no external requests. Everything is procedural and inline.

These scenes belong to an editorial series characterized by warm paper backdrops, italic serif titles ("Name / Jelly."), "MATERIAL STUDIES" eyebrows, glass control panels, and tactile jelly physics (shallow water, XPBD soft bodies, refraction, caustics, foam, meniscus).

**Claude Code first:** Prefer producing a complete, immediately runnable HTML file. Iterate with targeted edits rather than full rewrites. Prioritize visual fidelity and physical correctness over premature optimization.

## Core Workflow

1. **Clarify the subject** if needed (diorama block vs soft-body specimen, theme, key interactions).
2. **Load the aesthetic and constraints** from `references/aesthetic.md` and `references/constraints.md`.
3. **Structure the prompt or code** using the patterns in `references/prompt-patterns.md`.
4. **Implement**:
   - Editorial page layout (paper background, masthead, glass panel, how-to-play)
   - WebGPU pipeline (MSAA HDR, refraction, caustics, absorption)
   - Physics (shallow water for dioramas; XPBD for soft bodies)
   - Procedural geometry (palms, bungalows, coral, seaplanes, etc.)
   - Interactions and UI controls
5. **Validate** against the checklist in `references/qa-checklist.md`.
6. **Output** a single HTML file. Offer Claude Code / Cursor / Windsurf style iterative refinement commands if appropriate.

## When to Use This Skill

- User shows or describes Atoll Jelly, Villa Jelly, Harbor Jelly, Island Jelly, Citrus Jelly, or similar scenes
- User asks to "design like this", "make a jelly diorama", "WebGPU jelly scene", or "Material Studies"
- User wants side-by-side model comparisons of complex interactive 3D
- User requests Claude Code-first generation of tactile interactive experiences

## References

- `references/aesthetic.md` — Exact visual language, colors, typography, layout
- `references/constraints.md` — Hard technical rules (single file, WebGPU only, performance)
- `references/prompt-patterns.md` — How to structure high-quality prompts for these scenes
- `references/physics.md` — Shallow water, XPBD, buoyancy, foam notes
- `references/qa-checklist.md` — What "done" looks like

## Common Issues

| Issue | Fix |
|-------|-----|
| Scene too heavy / low FPS | Reduce grid resolution, fewer boids, simpler coral, lower MSAA |
| Water doesn't feel like jelly | Increase surface tension, adjust damping, add meniscus on cut edges |
| No refraction / flat look | Ensure correct absorption (Beer-Lambert) and Fresnel on cut faces |
| Seaplane or boat ignores water | Sample heightfield for buoyancy; displace volume into sim |
| Console errors / WebGPU fail | Implement fallback card; handle device.lost |
| Layout breaks on mobile | Bottom sheet panel, touch orbit, no page scroll |
