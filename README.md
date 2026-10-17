# AI Governance Map

A local-only reference map for AI governance — **31 frameworks and standards**, **27
CCM-mapped controls**, **75 dated obligations** and a **16-event timeline**, crosswalked
across jurisdictions on an interactive globe and flat world map. Built for practitioners
evaluating AI systems in any sector.

> **Conflict of interest.** The author of this map also wrote
> [NHID-Clinical](https://nhid-clinical.org), one of the 31 frameworks in it. It is listed
> as one framework among the rest, not first, and its reference module is **off by default**.
> See [below](#nhid-clinical--optional-reference-module).

**Start here** opens on a first visit: say what you are building and where, and it narrows
the register to the rows most likely to be relevant — *relevance, not applicability*, with
its reasoning shown. The registers work without WebGL, so the tool still opens on managed
laptops where the GPU is blocked; only the globe needs it.

**Live:** [thankcheeses.github.io/ai-governance-map](https://thankcheeses.github.io/ai-governance-map/)

> **Local-only, no tracking.** Everything runs in your browser. No data leaves the page,
> no analytics, no third-party scripts — and on a normal visit, **no network request to any
> outside host at all**. Fonts, map geometry and elevation-free basemap rendering are all
> bundled. Two layers can reach outside and both ship switched off: *Satellite imagery*
> (Esri tiles) and *Terrain relief* (AWS Terrain Tiles). Until you tick one, nothing is
> requested — enforced by a test, not just a promise.

---

## What's inside

- **Governance posture overview** — frameworks tracked, controls mapped, critical controls, and an optional self-assessed posture score.
- **Risk matrix** — the main working surface. Three grids that deliberately do *not* share a
  score: *Scenarios* (AI use case × risk domain), *Jurisdictions* (jurisdiction × obligation
  status) and *Control domains* (CCM domain × instrument). See below.
- **Voice Agent & NHID-Clinical** — the Healthcare-Voice Trust Stack Explorer (see below).
- **Controls** — 27 controls on the CCM v4.1.0 spine, each with performance indicators, SLO targets, and implementation guidance.
- **Maturity & trend**, **Obligations timeline**, and a **framework crosswalk** (control coverage across NIST AI RMF, ISO/IEC 42001, EU AI Act, CCM, HIPAA).
- **NIST AI RMF Playbook** — all 72 subcategories with NIST's verbatim outcome statements, suggested actions and documentation questions, searchable, with the controls that cite each and the subcategories no control maps to. Control mappings open the cited subcategory directly; the review behind them is in [`docs/nist-playbook-mapping-review.md`](docs/nist-playbook-mapping-review.md).
- **The map itself** — a glass globe with a shaded ocean, or a flat world map, both carrying
  the same data. Countries are coloured by *which instrument binds them* (EU AI Act, Korea,
  China, India, Vietnam each distinct), US states by whether they carry a binding statute, and
  a band of light sweeps the borders of countries with binding national law. All 52 states and
  every country render verified, sourced status only — no speculative data is ever painted on.
- **Agent incident readiness** — the ten voluntary practices and 50 sub-practices from the
  NIST CAISSI / NSA SISC / CISA joint publication, transcribed verbatim, with their NIST CSF
  2.0 crosswalk and the open problems the document names.
- **Exports** — CSV, JSON, and a print/PDF posture snapshot.

## NHID-Clinical — optional reference module

[NHID-Clinical](https://nhid-clinical.org) is an **open voluntary proposal and reference
implementation** for transparent AI voice agents in healthcare — **not a product, not a
certification, not an organization** (public comment NIST-2025-0035-0026, CC BY 4.0).

**It is written by the same person who built this map**, so it is handled like this:

- **One framework among 31.** It sits in the register like any other entry — not first, no
  dedicated card behaviour, no special badge. Its five obligations are listed last.
- **Coverage 0%, stated plainly.** None of the register's 27 controls maps to any of its five
  v1.3 controls by code. It used to read 100% only because its own module supplied its own
  controls.
- **The module is opt-in.** A view with its trust stack, five controls and the
  impersonation-latency concept exists, but it is off by default and switched on from the
  Frameworks view. The default tour never passes through it.
- **The conflict is disclosed at the top** of that module and of this README, not in a
  footnote.

## Data integrity

The compliance maps show only **verified, sourced** status. Illustrative material (e.g. the
impersonation-latency panel) is clearly labeled as conceptual and is never mixed into the
verified choropleths. Evidence indicators state what is actually substantiated.

### The risk matrix

Each grid carries its own metric selector, and the selected metric is named in the title and
the legend, so a screenshot can never be read against the wrong scale. Two scales are used:
a **severity** ramp where warmth appears only as severity rises, and a **neutral** ramp for
plain counts — because a dense cell on the Jurisdictions grid means regulatory volume, not
danger.

Four cell states are kept distinct, and a missing assessment is never rendered as low risk:

| State | Meaning |
| --- | --- |
| **Assessed** | A value exists and is shown as text in the cell. |
| **Not assessed** | Records exist, but nobody has scored the mitigating controls. |
| **Not applicable** | The question does not arise — e.g. a voluntary-only jurisdiction has no legal commencement date. |
| **No data** | No record exists at that intersection. |

Inherent and residual risk are separate. Inherent is the hand-authored band for each mapped
scenario. Residual is computed *only* from your own browser-local control scores:

```
effectiveness = mean(maturity of scored mitigating controls) ÷ 5
residual band = max(Low, inherent band − 2 × effectiveness), rounded up
```

With no mitigating control scored, the cell reads **Not assessed** — it never falls back to the
inherent band and never flatters an empty register. The formula and thresholds are printed
beside the legend, not buried in a tooltip.

Every cell is a focusable button with an accessible name, reachable by arrow keys with a single
tab stop into the grid, and clicking one opens the underlying records with their source
provisions, scoring rationale, mitigating controls, and assessment coverage. A sortable table
equivalent carries the same cells, and is the default layout below 768px — a seven-column
matrix squeezed to phone width is unreadable, and shrinking it would be worse than switching.

### Per-row provenance

A compliance date is only as good as the document behind it, so every obligation and timeline
event can carry a `SourceRef` — the citation, the specific provision, a link to the official
document, and the date the row was last reconciled against it. Three tiers classify the
*document cited*, not how carefully it was read:

| Tier | Meaning |
| --- | --- |
| **Primary text** | The enacted instrument itself (Official Journal, Federal Register, statute book). |
| **Official guidance** | Published by the regulator or enforcing authority, but not the law. |
| **Secondary report** | Law-firm notes, trade press, or other third-party reporting. |

Where a row rests on a summary rather than the enacted text, the chip's `note` says so
explicitly — for example, the Regulation (EU) 2026/1744 deferral dates are marked as
reconciled against Commission guidance and commentary rather than the Official Journal text.

Rows with no citation render **“no source recorded”** rather than being left blank, so an
unattested row reads as a known gap instead of inheriting the credibility of its neighbours.
The **Evidence coverage** panel on the decision desk publishes the resulting ratio for the
register as a whole. The number is deliberately unflattering; closing it is ordinary editorial
work, and hiding it would not be.

### Freshness

Sourced is not the same as checked recently. Every sourced row carries the date it was last
reconciled against its document, and that age is printed **on the source chip itself**, next
to the date it vouches for — `reconciled 16d ago` — because a reader decides whether to trust a
date before they think to hover anything.

Rows not re-checked in about six months are marked **stale**, in amber rather than red: it
means *re-check me*, not *this is wrong*. The Overview publishes the share of rows reconciled
within six months and lists every sourced row **oldest first**, which doubles as the
maintainer's re-check queue. A stale flag only builds trust if stale rows actually get
reconciled; the threshold is deliberately generous so that it can be honoured.

Citation links carry `rel="noreferrer"` by design: following a source must not tell the
destination that the reader came from this tool.

## Tech stack

React 19 · Vite 7 · TypeScript · Tailwind CSS 4 · MapLibre GL 5 · framer-motion ·
topojson-client · world-atlas / us-atlas.

All assets are self-hosted — no CDNs, no external fonts-as-tracking, no third-party scripts.
The ocean is a WebGL layer drawn behind the (transparent) MapLibre canvas; it measures the
globe's silhouette from `map.project()` on every move rather than assuming a formula, because
MapLibre blends globe into mercator as you zoom. Water colour comes from a coastal-proximity
field built in-browser from the bundled land outline — a lighting treatment, **not**
bathymetry, and the module says so.

## Cache recovery

Asset filenames carry a content hash and each deploy replaces the whole site, so a browser
holding a cached `index.html` would request bundles that no longer exist and render a blank
page — indistinguishable from a broken deploy. `client/index.html` carries a small inline
script that catches the missing bundle and reloads **once** against a URL the cache has never
seen. The guard is released on mount rather than on `load`, so a genuinely missing asset fails
once instead of looping. Both behaviours are covered by tests.

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
