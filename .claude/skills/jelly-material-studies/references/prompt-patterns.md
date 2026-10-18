# Prompt Patterns

High-quality Material Studies prompts are dense, structured, and extremely specific.

## Recommended Structure

1. **Deliverable sentence**  
   "Build '[Name] Jelly' — one self-contained HTML file, native WebGPU + WGSL, sim in plain JS, no external requests."

2. **Series membership**  
   "An entry in the editorial 'MATERIAL STUDIES' series of interactive jelly dioramas..."

3. **Page / Layout block**  
   Exact colors, typography, masthead copy, status pill, panel contents, how-to-play line, mobile behavior.

4. **Scene / Specimen block**  
   Precise dimensions, terrain, objects, counts, materials.

5. **Physics block**  
   Simulation type, grid resolution, constraints, interactions.

6. **Key actors** (seaplane, boat, fish, soft body, etc.)  
   Behavior loops, buoyancy, animation details.

7. **UI controls**  
   Buttons, flavour swatches, sliders (Firmness, Wave damping, Tide, etc.).

8. **QA / Acceptance**  
   List of behaviors that must work and performance bounds.

## Tips for Claude Code

- Ask the model to output the complete HTML in one go when possible.
- For very large scenes, generate in stages (layout + water first, then objects, then interactions) and merge.
- Always include the fallback card and zero-console-error requirement.
- Reference previous successful scenes in the series when iterating.
