# AI Governance Map

A local-only reference map for AI governance — **29 frameworks and standards**, **27
CCM-mapped controls**, and an obligations register crosswalked across jurisdictions, with
interactive USA and global compliance maps. Built for practitioners evaluating AI systems,
with a first-class module for **AI voice agents and non-human identity** in healthcare.

**Live:** [thankcheeses.github.io/ai-governance-map](https://thankcheeses.github.io/ai-governance-map/)

> **Local-only, no tracking.** Everything runs in your browser. No data leaves the page,
> no analytics, no external calls except the basemap tiles for the compliance maps.

---

## What's inside

- **Governance posture overview** — frameworks tracked, controls mapped, critical controls, and an optional self-assessed posture score.
- **Risk heatmap** — likelihood × impact for healthcare voice-agent failure modes.
- **Voice Agent & NHID-Clinical** — the Healthcare-Voice Trust Stack Explorer (see below).
- **Controls** — 27 controls on the CCM v4.1.0 spine, each with performance indicators, SLO targets, and implementation guidance.
- **Maturity & trend**, **Obligations timeline**, and a **framework crosswalk** (control coverage across NIST AI RMF, ISO/IEC 42001, EU AI Act, CCM, HIPAA).
- **USA & global compliance maps** — verified, sourced status per state and country. No speculative data is ever painted onto these maps.
- **Exports** — CSV, JSON, and a print/PDF posture snapshot.

## NHID-Clinical — first-class in the map

[NHID-Clinical](https://nhid-clinical.org) is an **open voluntary proposal and reference
implementation** for transparent AI voice agents in healthcare — **not a product, not a
certification, not an organization** (public comment NIST-2025-0035-0026, CC BY 4.0). The
map treats it as a first-class framework:

- **Five permanent controls** — `IDG-01` (identity disclosure), `PDX-01` (pre-data-exchange
  authorization), `DBC-01` (no mimicry), `EIT-01` (human handoff), `ATR-01` (audit trail).
- **Five-Layer Trust Stack** — an interactive stack (Layers 1–5) resting on the NPI Registry
  foundation, with NHID-Clinical v2.0 as the behavioral baseline at Layer 2.
- **Impersonation latency** — surfaced as a first-class risk primitive: the measurable trust
  delay between an agent initiating a call and the receiving system verifying authorization,
  which is effectively infinite today because no standard verification pathway exists.
- **Call Authorization Score (CAS)** and honest **evidence indicators** (NHID's controls are
  labeled *Prototype / Simulation only* — a reference implementation, not deployed-at-scale
  conformance).

Every NHID surface links back to the open spec, the governance simulator, and GitHub — and
carries the open-proposal disclaimers. No product, pricing, or certification language.

## Data integrity

The compliance maps show only **verified, sourced** status. Illustrative material (e.g. the
impersonation-latency panel) is clearly labeled as conceptual and is never mixed into the
verified choropleths. Evidence indicators state what is actually substantiated.

## Tech stack

React 19 · Vite 7 · TypeScript · Tailwind CSS 4 · framer-motion · react-simple-maps.
All assets are self-hosted — no CDNs, no external fonts-as-tracking, no third-party scripts.

## Local development

```bash
pnpm install
pnpm dev        # start the dev server (http://localhost:5173)
pnpm check      # type-check (tsc --noEmit)
pnpm build      # production build
pnpm test       # unit tests
```

## Deployment

Deployed to **GitHub Pages** at
[thankcheeses.github.io/ai-governance-map](https://thankcheeses.github.io/ai-governance-map/).
The app is a fully static single-page site — no server, no API routes, no runtime environment
variables or secrets.

| Setting | Value |
| --- | --- |
| Build command | `pnpm build` |
| Build output directory | `dist/public` |
| Vite `base` | `/ai-governance-map/` (project-site subpath) |
| Node version | 22 |

Deployment is automated by `.github/workflows/deploy-pages.yml`: every push to `main` builds
with pnpm and publishes `dist/public` via GitHub Pages. **One-time repo setting:** under
*Settings → Pages*, set **Source: GitHub Actions**.

Two details that matter for a project-site subpath:

- **Base path.** `vite.config.ts` sets `base: "/ai-governance-map/"`, and the router derives its
  own base from `import.meta.env.BASE_URL`, so asset URLs and routes stay in step. The base is
  applied in dev too, so `pnpm dev` serves at `http://localhost:5173/ai-governance-map/` — path
  bugs surface locally instead of only after deploy.
- **SPA fallback.** GitHub Pages has no rewrite engine, so the build copies `index.html` to
  `404.html` (see the `gh-pages-spa-fallback` plugin). A `.nojekyll` file is published so Pages
  serves `_`-prefixed paths instead of letting Jekyll drop them.

## License & attribution

Code in this repository is provided for reference. NHID-Clinical material is licensed
**CC BY 4.0** and referenced here as an open proposal; see
[nhid-clinical.org](https://nhid-clinical.org) and
[github.com/NHID-Clinical](https://github.com/NHID-Clinical). Framework names and control
identifiers belong to their respective standards bodies.
