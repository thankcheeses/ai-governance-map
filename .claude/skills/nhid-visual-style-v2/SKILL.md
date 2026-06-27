---
name: nhid-visual-style-v2
description: Use when producing ANY NHID-Clinical / AI Governance Map brand asset — logos, favicons, icon packs, diagrams, infographics, SVG marks — or when the user references "Visual Style System v2", "Phase A logo", "icon pack", brand colors, transparent SVG assets, or asks to elevate/upgrade a logo or graphic to production brand quality. Enforces transparent backgrounds, the strict navy/teal/cyan token palette, vector-first output, and calm clinical craft. Strongly avoid dark backgrounds, off-palette colors, gradients-as-decoration, raster where vector is possible, and consumer/startup-SaaS aesthetics.
---

# NHID-Clinical Visual Style System v2

Production asset doctrine for **NHID-Clinical** and its companion **AI Governance Map** —
a precise, open technical standard for transparent, attestable AI voice agents in
healthcare. Every asset must feel calm, clinical, trustworthy, and operationally excellent —
at home beside high-end governance tooling and formal standards documentation.

## Non-Negotiable Rules

**Background & format**
- Every asset has a **transparent background**. Never generate dark/opaque backgrounds.
- **Vector-first**: prefer pure SVG for logos, icons, and diagrams so assets work in light
  and dark mode on nhid-clinical.org and the AI Governance Map. Raster only as a fallback or
  when the user supplies raster source art (then treat their raster as the source of truth).

**Color system (strict — use only these)**
- Deep Navy: `#082a5b` or `#0F172A` (primary trust)
- Medical Teal: `#188eaa` or `#14B8A6` (verification / clinical)
- Soft Cyan: `#3ecece` or `#67E8F9` (accent / signal)
- Clean neutrals from the NHID design system (Mist, Paper, Ink-Soft, Line)
- Semantic: Success `#10a36c`, Warning/Amber, Error — used sparingly via StatusPill language

**Typography**
- Raleway for display/headings; Inter or IBM Plex Mono for labels, data, technical text.
- Excellent legibility, generous spacing.

**Craft standard**
- Refined geometry, subtle/intentional depth, premium material quality (Apple-level
  precision meets calm clinical governance). Never flashy, glossy, consumer, or startup-SaaS.
- Every visual decision must improve clarity, trust, or professionalism.

## SVG / Diagram Rules

- Clean vector construction, logical grouping, clear IDs.
- Subtle professional layering/depth (governance-stack-diagram quality).
- Consistent stroke weights and corner radii aligned to the NHID design system.
- Strong visual hierarchy and scannability. Transparent background, production-ready.
- Include `role`/`aria-label` and a short top comment (variant + viewBox) for maintainability.

## Logo & Brand Mark Rules

The mark is an **abstract "N"**: a left navy rounded bar (left stem), a navy→teal gradient
blade (the diagonal, wide rounded top necking to a teal foot), a navy circle (top-right
satellite), and a soft-cyan rounded square (bottom-right satellite).

When elevating it, preserve that structure and proportions exactly, and produce three
purposeful variants — all transparent, all the same calm brand family:
1. **Restrained / Minimal** — flat brand colors, no shadow; for dense UI + favicon.
2. **Rich Material Depth** — subtle gradients + a soft blue-tinted drop shadow; for hero/marketing.
3. **Dark-mode** — lifted navy/teal/cyan tones for dark backgrounds, still transparent.

Favicon sizes: optimize for 16×16, 32×32, 180×180, 512×512 (an SVG favicon covers all).

**Canonical SVG geometry (viewBox `0 0 120 120`)** — the in-repo marks live at
`client/public/logo-mark.svg` (minimal), `logo-mark-depth.svg` (material), and
`logo-mark-dark.svg` (dark). Reuse this geometry; do not redraw from scratch:
- Left bar: `rect x=4 y=39 w=29 h=47 rx=7`
- Blade: `path d="M46 6 H79 a8 8 0 0 1 8 8 V40 L57 84 a9 9 0 0 1 -8 5 H45 a7 7 0 0 1 -7 -8 L40 14 a8 8 0 0 1 6 -8 Z"`
- Circle: `circle cx=104 cy=43 r=12.5`
- Square: `rect x=92 y=62 w=25 h=28 rx=5`
- Blade gradient: navy `#143a66` → `#16708f` → teal `#16b3a4` (top→bottom).
- The high-res raster master is `client/public/nhid-logo.png` (1080², transparent).

## Icon System Rules

When building icon packs (voice-AI governance, disclosure, attestation, escalation, consent,
audit, verification, etc.):
- Consistent stroke weight (1.5–2px) and corner treatment across the entire set.
- Semantic clarity first — one precise concept per icon, legible at 16–24px.
- Subtle depth only where it aids recognition; designed to sit alongside Material Symbols
  Rounded already used in the NHID design system.
- Transparent background, SVG preferred, brand palette only.

## Output Discipline

1. Deliver the highest-craft version possible under these rules.
2. Add a short note: how it keeps NHID brand consistency and why key decisions were made.
3. For SVGs/diagrams, give clean, well-commented, integration-ready code.
4. Logo vectorization from raster is **iterative** — render a comparison against the source,
   refine, then show the user before swapping any live asset.

Every output must feel like it came from the same rigorous, precise, trustworthy team that
built the NHID standard itself.
