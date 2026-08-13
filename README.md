# AI Governance Map

A local-only reference map for AI governance — **29 frameworks and standards**, **27
CCM-mapped controls**, and an obligations register crosswalked across jurisdictions, with
interactive USA and global compliance maps. Built for practitioners evaluating AI systems,
with a first-class module for **AI voice agents and non-human identity** in healthcare.

**Live:** [ai-governance-map.vercel.app](https://ai-governance-map.vercel.app)

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

The app is a fully static single-page site (no server, no API routes), so any static host
works. Target host is **Cloudflare Pages**:

| Setting | Value |
| --- | --- |
| Framework preset | None (Vite) |
| Build command | `pnpm build` |
| Build output directory | `dist/public` |
| Node version | 20+ |

Client-side routing (wouter) is handled by `client/public/_redirects` (`/* /index.html 200`),
which Vite copies into the build output — no extra host config needed.

To connect it: in the Cloudflare dashboard, **Workers & Pages → Create → Pages → Connect to
Git**, pick this repository, enter the build command and output directory above, and deploy.
Each push to `main` publishes automatically; pull requests get preview URLs.

## License & attribution

Code in this repository is provided for reference. NHID-Clinical material is licensed
**CC BY 4.0** and referenced here as an open proposal; see
[nhid-clinical.org](https://nhid-clinical.org) and
[github.com/NHID-Clinical](https://github.com/NHID-Clinical). Framework names and control
identifiers belong to their respective standards bodies.
