# AI GOVERNANCE MAP — MASTER PROJECT KNOWLEDGE ARCHIVE

**Document Status:** Production
**Version:** Aligned to AI Governance Map v2 (live since June 11, 2026)
**Source of Truth:** `thankcheeses/ai-governance-map` repository + project session record
**Generated:** June 26, 2026
**Live Tool:** https://ai-governance-map.vercel.app
**Companion Standard:** https://nhid-clinical.org

> **Source Material Notice:** This archive is built strictly from material present in the
> `thankcheeses/ai-governance-map` repository — primarily the canonical data layer
> (`client/src/data/governance.ts`), the React component tree under `client/src/`,
> `README.md`, `CHANGELOG.md`, and the git history (146 commits as of generation). Every
> figure, framework, obligation, and control below is traceable to that data layer; nothing
> has been invented. Where the companion **NHID-Clinical** standard is referenced, the
> authoritative source is the separate `NHID-CLINICAL-MASTER-ARCHIVE.md` and
> https://nhid-clinical.org — claims about NHID internals not present in this repo are
> marked **[SOURCE: NHID-Clinical — see companion archive]**.

---

## Table of Contents

1. [Executive Vision & Strategic Direction](#1-executive-vision--strategic-direction)
2. [Product Overview & Core Purpose](#2-product-overview--core-purpose)
3. [Information Architecture & Dashboard Sections](#3-information-architecture--dashboard-sections)
4. [Data Model & Source of Truth](#4-data-model--source-of-truth)
5. [Frameworks Catalog](#5-frameworks-catalog)
6. [Obligations Register](#6-obligations-register)
7. [Controls Library](#7-controls-library)
8. [USA Compliance Map](#8-usa-compliance-map)
9. [Global Compliance Map](#9-global-compliance-map)
10. [NHID-Clinical Trust Stack Integration](#10-nhid-clinical-trust-stack-integration)
11. [Risk Heatmap & Crosswalks](#11-risk-heatmap--crosswalks)
12. [Technical Architecture](#12-technical-architecture)
13. [Design System & Visual Doctrine](#13-design-system--visual-doctrine)
14. [Coding & Development Practices](#14-coding--development-practices)
15. [Claude Code & LLM Tasking](#15-claude-code--llm-tasking)
16. [Regulatory & Federal Alignment](#16-regulatory--federal-alignment)
17. [Data Integrity & Research Methodology](#17-data-integrity--research-methodology)
18. [Decisions Made](#18-decisions-made)
19. [Future Work](#19-future-work)
20. [Templates & Checklists](#20-templates--checklists)
21. [FAQ & Plain Language Guide](#21-faq--plain-language-guide)
22. [Source Material Appendix](#22-source-material-appendix)

---

## 1. Executive Vision & Strategic Direction

The **AI Governance Map** is a live, browser-based reference tool that maps AI governance
frameworks, regulatory obligations, and compliance controls across federal, state, and
international jurisdictions. It exists to support practitioners — payer and provider
operations, compliance, and risk teams — who are evaluating AI voice agents and other AI
systems in healthcare administrative workflows.

**Strategic positioning.** The Map is the *companion tool* to **NHID-Clinical**, an open
behavioral baseline for AI voice agents in B2B healthcare administrative workflows. Where
NHID-Clinical defines *how an AI agent should behave* on a call, the AI Governance Map
defines *the regulatory and control universe that behavior sits inside*. The two are
deliberately complementary: the Map's control library and obligations register cross-link
to the NHID trust stack rather than duplicating it.

**Design philosophy.** The product is built as calm, operational GRC tooling — closer to
Linear.app or Stripe Radar than a consumer dashboard or a 3D "Google Earth" experience. It
favors restraint, clear hierarchy, and data integrity over spectacle. This doctrine is
captured formally in the project skills (`.claude/skills/`) and is the explicit reason the
global map was built as a calm light-themed vector globe rather than a dark threat-map.

**Privacy as a first principle.** The tool ships a hard guarantee, stated in the footer:
*"Local-only reference — no data leaves your browser."* There is no backend, no analytics
hooked up in practice, no user accounts. All interactive state lives in `localStorage`.
This constraint actively shapes engineering decisions (see §12 and §17).

---

## 2. Product Overview & Core Purpose

**What it does (per `README.md`):**

- Maps AI governance controls to regulatory frameworks (CMS-0057-F, MACPAC, NIST AI RMF,
  state AI laws, and more).
- Tracks compliance coverage across jurisdictions.
- Surfaces alignment gaps for payer and provider operations teams.

**Core artifacts the user can produce** (client-side exports, no server round-trip):

- Controls CSV export
- Progress JSON export
- Printable posture snapshot

**Headline scope (verified counts from the data layer):**

| Dimension | Count | Notes |
|---|---|---|
| Frameworks | 16 | EU, ISO, NIST, OECD, Singapore, OWASP/ATLAS, + 7 US state/municipal, + KR, CN, IN |
| Obligations | 47 | `obl1`–`obl47`, each mapped to a framework |
| Controls | 27 | CCM-aligned, `CTRL-*`, IDs 1–27 |
| CCM domains | 16 | A&A, AIS, BCR, CCC, CEK, DCS, DSP, GRC, HRS, IAM, IPY, LOG, SEF, STA, TVM, UEM |
| US jurisdictions | 52 | 50 states + DC + Puerto Rico; 6 with binding AI law |
| Countries tracked | 35 | 29 binding (26 EU members + KR + CN + IN), 6 researched-none |
| Timeline events | 7 | EU AI Act + Colorado milestones, 2024–2028 |
| Heatmap cells | 25 | 5×5 likelihood × impact grid |
| NHID trust layers | 6 | Layer 0–5 |

---

## 3. Information Architecture & Dashboard Sections

The application is a single-page dashboard (`client/src/pages/Dashboard.tsx`) rendered
inside a collapsible sidebar shell. The left sidebar (`AppSidebar.tsx`) provides scroll-spy
navigation; `TopBar.tsx` carries the posture summary and export actions.

**Section order (top to bottom), as rendered in `Dashboard.tsx`:**

1. **Intro Banner** (`IntroBanner.tsx`) — shown only when no controls have been assessed yet.
2. **Hero KPIs** (`HeroKpis.tsx`) — overall posture score + assessed count.
3. **Governance Risk Heatmap** (`GovernanceHeatmap.tsx`) — 5×5 grid with hover particles.
4. **NHID Trust Stack** (`NhidTrustStack.tsx`) — the 6-layer identity/trust ladder.
5. **Controls** (`ControlsSection.tsx`) — the 27-control library with assessment state.
6. **Maturity & Trend** (`MaturityRadarSection.tsx`) — radar + trend charts (recharts).
7. **Obligations Timeline** (`TimelineSection.tsx`) — chronological obligations register.
8. **Crosswalk** (`CrosswalkSection.tsx`) — topic×framework and actor-obligation matrices.
9. **Global Compliance Map** (`GlobalGlobeVisualization.tsx`) — country-level vector globe.
10. **USA Compliance Map** (`USAComplianceMapSection.tsx`) — state-level choropleth.
11. **Frameworks** (`FrameworksSection.tsx`) — the 16-framework catalog.

> **Map ordering note:** The Global map is rendered *above* the USA map. The country detail
> panel, when the United States is selected, points the reader *down* to the USA map
> ("See the USA Compliance Map below for state-level detail"). This directional reference and
> the section order are kept consistent — a fix applied during the v2 globe work.

**Supporting components:** `SectionHeader.tsx` (consistent section chrome),
`DemoModeOverlay.tsx` (guided demo), `icons.tsx` (custom brand icons —
`GovernanceLatticeIcon`, `ShieldWaveformIcon`), and `GlobeDetailsPanel.tsx` /
`particles/GlobeParticles.tsx` (globe interaction surfaces).

---

## 4. Data Model & Source of Truth

The single canonical data module is **`client/src/data/governance.ts`** (629 lines). It is
the source of truth for everything the dashboard renders. Its own header documents its
provenance: frameworks/obligations/timeline/heatmap/NHID content were ported from the
original static `index.html`; control definitions were ported from a richer `complianceData`
once embedded in `pages/GovernanceMap.tsx`, then merged with status/automation fields by
CCM-domain order.

**Exported types and tables:**

| Export | Type | Shape / Key fields |
|---|---|---|
| `FRAMEWORKS` | `Framework[]` | slug, shortCode, name, type, jurisdiction, version, coverage, summary |
| `OBLIGATIONS` | `Obligation[]` | id, title, framework, topic, type, effective, severity, summary |
| `STATE_AI_LAWS` | `StateAILaw[]` | name, postalCode, status, frameworkSlug? |
| `COUNTRY_AI_LAWS` | `CountryAILaw[]` | name, status, frameworkSlug? |
| `CONTROLS` | `Control[]` | id, code, title, description, ccmDomain, riskTier, priority, status, automation, mappings, indicator, implementation |
| `CCM_DOMAINS` | `string[]` | 16 CCM domain codes |
| `MATURITY_LEVELS` | array | 0 None → 5 Optimized |
| `TIMELINE_EVENTS` | `TimelineEvent[]` | date, label, status, detail |
| `HEATMAP_CELLS` | `HeatmapCell[]` | likelihoodIndex, impactIndex, level, label, obligationId |
| `HEATMAP_LIKELIHOODS` / `HEATMAP_IMPACTS` | `string[]` | 5 labels each |
| `CROSSWALK_TOPICS` / `CROSSWALK_ACTORS` | objects | matrix headers + rows |
| `NHID_LAYERS` | `NhidLayer[]` | layer, title, scope, isCore? |
| `NHID_CONFORMANCE_CONTROLS` | `NhidConformanceControl[]` | code, requirement, status, indicator, implementation |
| `NHID_EVENT_TRACE` / `NHID_EVENT_TRACE_FAIL` | objects | passing / failing call trace examples |
| `daysUntil(dateStr)` | function | countdown helper for live deadline display |

**The `shortCode` union** is the join key between frameworks and obligations:
`'EU' | 'ISO' | 'NIST' | 'OECD' | 'SG' | 'OWASP' | 'CO' | 'HIPAA' | 'CA' | 'IL' | 'NY' | 'TX' | 'UT' | 'KR' | 'CN' | 'IN'`.

---

## 5. Frameworks Catalog

All 16 frameworks, verbatim from `FRAMEWORKS`:

| Code | Name | Type | Jurisdiction | Version | Coverage |
|---|---|---|---|---|---|
| EU | EU Artificial Intelligence Act | Regulation (Binding) | EU | Regulation (EU) 2024/1689 | 72 |
| ISO | ISO/IEC 42001:2023 | Standard (Voluntary) | Global | 2023 Edition | 58 |
| NIST | NIST AI RMF 1.0 | Framework (Voluntary) | US / Global | 1.0 (Jan 2023) | 65 |
| OECD | OECD AI Principles | Principles (Voluntary) | Global | 2019 / Updated 2024 | 50 |
| SG | Singapore Model AI Governance Framework | Framework (Voluntary) | Singapore | Gen AI Framework, 2nd Ed. (2024) | 40 |
| OWASP | OWASP Top 10 for LLM Apps / MITRE ATLAS | Security Framework (Voluntary) | Global | OWASP LLM 2025 · ATLAS v4 | 45 |
| CO | Colorado AI Act (SB 24-205) | Regulation (Binding) | Colorado, USA | SB 24-205 | 35 |
| HIPAA | HIPAA Security Rule | Regulation (Binding) | US | 45 CFR §164.312 | 30 |
| CA | California AI Transparency Act (SB 942) | Regulation (Binding) | California, USA | SB 942 | 32 |
| IL | Illinois HB 3773 (AI in Employment) | Regulation (Binding) | Illinois, USA | HB 3773 | 28 |
| NY | NYC Local Law 144 | Regulation (Binding) | New York City, USA | Local Law 144 of 2021 | 30 |
| TX | Texas Responsible AI Governance Act (TRAIGA) | Regulation (Binding) | Texas, USA | HB 149 | 27 |
| UT | Utah AI Policy Act | Regulation (Binding) | Utah, USA | S.B. 149 | 25 |
| KR | South Korea AI Basic Act | Regulation (Binding) | South Korea | In effect Jan 22, 2026 | 24 |
| CN | China Generative AI Services Interim Measures | Regulation (Binding) | China | Effective Aug 15, 2023 (2025 labeling additions) | 26 |
| IN | India IT Rules Amendment, 2026 (Synthetic Media) | Regulation (Binding) | India | G.S.R. 120(E), in force Feb 20, 2026 | 20 |

The "coverage" figure is a project-defined relative-completeness estimate of how much of
each framework's obligation surface the Map currently models — not an external metric.

---

## 6. Obligations Register

The `OBLIGATIONS` table holds 47 entries (`obl1`–`obl47`). Each binds to a framework
`shortCode`, carries a `topic`, a `type` (`mandatory` / `recommended`), an `effective`
date, a `severity` (`critical` / `high` / `medium`), and a plain-language `summary`.

**Distribution by framework:**

- **EU AI Act:** `obl1`–`obl8` (transparency, human oversight, logging, risk management,
  data governance, documentation, GPAI, prohibited practices) plus `obl17` (Caller
  Authorization Verification / NHID-Auth v2).
- **ISO/IEC 42001:** `obl9`–`obl12` (documented information, AIMS scope, leadership, audit).
- **NIST AI RMF:** `obl13`–`obl14` (governance inventory, map context).
- **OECD:** `obl15`–`obl16` (transparency, robustness/security).
- **Singapore MGF:** `obl18`–`obl19` (GenAI testing, provenance & incident reporting).
- **OWASP/ATLAS:** `obl20`–`obl21` (LLM Top 10, ATLAS TTP mapping).
- **Colorado AI Act:** `obl22`–`obl23` (discrimination risk program, consumer notice).
- **HIPAA Security Rule:** `obl24`–`obl35` — the full §164.312 Technical Safeguards set
  (access control, unique user ID, emergency access, automatic logoff, encryption at rest,
  audit controls, integrity, authentication, transmission security, transmission integrity,
  encryption in transit). Note `obl28` and `obl35` explicitly credit NHID-Auth v2 as the
  satisfying control for voice-agent call data.
- **California / Illinois / NYC / Texas / Utah:** `obl36`–`obl40` (state transparency,
  employment notice, bias audit, prohibited uses, GenAI disclosure).
- **South Korea:** `obl41`–`obl43` (AI-use disclosure, risk/oversight, domestic rep).
- **China:** `obl44`–`obl45` (CAC algorithm registration, content labeling).
- **India:** `obl46`–`obl47` (synthetic-media labelling/provenance, 3-hour takedown duty).

**Severity is used to color and rank** in the timeline and heatmap; `critical` obligations
include human oversight (`obl2`), prohibited-practices screening (`obl8`), NHID-Auth
authorization (`obl17`), Colorado discrimination program (`obl22`), most HIPAA required
safeguards, NYC bias audit (`obl38`), Texas prohibited uses (`obl39`), KR high-impact
risk management (`obl42`), CN algorithm registration (`obl44`), and IN takedown (`obl47`).

---

## 7. Controls Library

27 controls (`CONTROLS`, IDs 1–27), each coded `CTRL-<DOMAIN>-NNN` and aligned to a Cloud
Security Alliance **CCM domain**. Each control carries: risk tier (`High-Risk` /
`All Systems`), priority (`Critical` / `High` / `Medium`), status (`Implemented` /
`In Progress` / `Planned`), automation level (`automated` / `semi-automated` / `manual`),
cross-framework `mappings`, a measurable `indicator` (name / method / SLO), and an
`implementation` note.

| ID | Code | Title | CCM | Priority | Status |
|---|---|---|---|---|---|
| 1 | CTRL-GRC-001 | AI Governance Board & Charter | GRC | Critical | Implemented |
| 2 | CTRL-GRC-002 | AI Risk Management Program | GRC | Critical | In Progress |
| 3 | CTRL-GRC-003 | AI Policy & Standards Framework | GRC | High | Implemented |
| 4 | CTRL-GRC-004 | AI Compliance Obligations Tracker | GRC | High | In Progress |
| 5 | CTRL-DSP-001 | AI Training Data Governance | DSP | Critical | In Progress |
| 6 | CTRL-DSP-002 | Personal Data Minimization for AI | DSP | High | Planned |
| 7 | CTRL-IAM-001 | AI System Access Controls | IAM | Critical | Implemented |
| 8 | CTRL-IAM-002 | Non-Human Identity Governance for AI Agents | IAM | High | Planned |
| 9 | CTRL-LOG-001 | AI Activity Logging & Traceability | LOG | High | In Progress |
| 10 | CTRL-LOG-002 | AI Performance & Drift Monitoring | LOG | High | Planned |
| 11 | CTRL-STA-001 | AI Third-Party & Supplier Oversight | STA | High | In Progress |
| 12 | CTRL-STA-002 | AI Model Provenance & Documentation | STA | High | In Progress |
| 13 | CTRL-STA-003 | AI System Disclosure & Transparency Notice | STA | Medium | In Progress |
| 14 | CTRL-TVM-001 | AI Adversarial Testing & Red-Teaming | TVM | Critical | Planned |
| 15 | CTRL-TVM-002 | AI Model Vulnerability Assessment | TVM | High | Planned |
| 16 | CTRL-AA-001 | AI Internal Audit Program | A&A | High | Planned |
| 17 | CTRL-AA-002 | AI Third-Party Audit & Attestation | A&A | Medium | Planned |
| 18 | CTRL-HRS-001 | Human Override & Escalation Protocols | HRS | Critical | Planned |
| 19 | CTRL-HRS-002 | AI Workforce Competency & Ethics Training | HRS | High | In Progress |
| 20 | CTRL-AIS-001 | AI API Security & Input Validation | AIS | High | In Progress |
| 21 | CTRL-BCR-001 | AI System Continuity & Recovery Planning | BCR | Medium | Planned |
| 22 | CTRL-CCC-001 | AI Model Change Management | CCC | High | In Progress |
| 23 | CTRL-CEK-001 | AI Data Encryption & Key Management | CEK | High | Implemented |
| 24 | CTRL-DCS-001 | AI Compute Environment Isolation | DCS | Medium | Implemented |
| 25 | CTRL-IPY-001 | AI Model Portability & Interoperability | IPY | Medium | Planned |
| 26 | CTRL-SEF-001 | AI Security Incident Response & Remediation | SEF | Critical | Planned |
| 27 | CTRL-UEM-001 | AI Agent Endpoint Registration & Control | UEM | High | Planned |

**Cross-framework mapping is the control library's core value.** Controls 7 (Access
Controls) and 23 (Encryption & Key Management) explicitly map to HIPAA §164.312 clauses
*and* to NHID-Clinical Layer 3 (NHID-Auth v2), making the bridge between generic AI
governance and the healthcare voice-agent use case concrete.

User assessment state (which controls a practitioner has marked as assessed, and at what
maturity) is held in `useGovernanceState` and persisted to `localStorage`; the Hero KPI
posture score and the "Posture" chip in the TopBar are derived from it.

---

## 8. USA Compliance Map

`USAComplianceMapSection.tsx` renders a state-level choropleth using **react-simple-maps**
with the **us-atlas** `states-10m` topology. Source data is `STATE_AI_LAWS` — 52 entries
(50 states + DC + Puerto Rico).

**Binding-law states (6):** California (`california-ai-transparency-act`), Colorado
(`colorado-ai-act`), Illinois (`illinois-hb3773`), New York (`nyc-local-law-144`), Texas
(`texas-traiga`), Utah (`utah-ai-policy-act`). All other states render in the
"No AI-specific law tracked" tier.

The section presents a **three-tier obligation view** for the selected jurisdiction: a
State tier, a National tier (collapsible), and a Global tier (collapsible) — so a user
clicking, say, California sees the state law *and* the federal/global obligations that also
apply. The map background carries a stylized terrain texture (`#usa-terrain` SVG pattern)
consistent with the calm visual doctrine.

---

## 9. Global Compliance Map

`GlobalGlobeVisualization.tsx` renders a country-level **3D vector globe** using
**MapLibre GL** with the globe projection. This is the v2 rebuild; the design and
engineering decisions behind it are central to the project's privacy and aesthetic posture.

**Key properties:**

- **Fully local data.** Country polygons come from the bundled `world-atlas`
  `countries-110m` topojson, converted to GeoJSON in-browser via `topojson-client`
  (`useGlobeData.ts`). There are **no external tile/network requests** — preserving the
  "no data leaves your browser" guarantee. (An earlier pass pulled OpenStreetMap raster
  tiles; that was removed precisely because it violated the privacy promise.)
- **Light, calm aesthetic.** Soft ocean (`#EEF2F7`) and a subtle light atmosphere — not a
  dark "space"/threat-map look. This was a deliberate response to the brief ("the concept …
  no dark background of course").
- **Choropleth by status:** teal `#14B8A6` = binding AI law; slate `#94A3B8` = researched,
  no binding law; light slate `#E2E8F0` = not yet researched. White country outlines, hover
  emphasis, and a restrained NHID-teal focus glow when a country is selected.
- **Subtle auto-rotation** that pauses on hover/drag and while a detail panel is open.
- **Detail panel** (`GlobeDetailsPanel.tsx`) shows status, the bound framework, and key
  obligations; for the USA it points down to the USA map for state detail.

**Country coverage (`COUNTRY_AI_LAWS`, 35 entries):**

- **Binding — EU AI Act (26 member states):** Austria, Belgium, Bulgaria, Croatia, Cyprus,
  Czechia, Denmark, Estonia, Finland, France, Germany, Greece, Hungary, Ireland, Italy,
  Latvia, Lithuania, Luxembourg, Netherlands, Poland, Portugal, Romania, Slovakia, Slovenia,
  Spain, Sweden. *(Malta is an EU member but is absent — see Future Work §19; it is not a
  standalone polygon in the 110m Natural Earth set.)*
- **Binding — own national law (3):** South Korea (`korea-ai-basic-act`),
  China (`china-genai-interim-measures`), India (`india-it-rules-synthetic-media`).
- **Researched, confirmed no binding AI-specific law (6):** United Kingdom, Canada, Brazil,
  United States of America, Singapore, Japan.

Every other country renders as *not yet researched* rather than being guessed as "none" —
a deliberate data-integrity choice documented in the data file's own comments (see §17).

---

## 10. NHID-Clinical Trust Stack Integration

`NhidTrustStack.tsx` renders the 6-layer identity/trust ladder from `NHID_LAYERS`:

| Layer | Title | Scope |
|---|---|---|
| 0 | NPI Registry | No delegation proof, no call-time authorization. |
| 1 | STIR/SHAKEN | Carrier attestation (A/B/C) — verifies phone-number origin only. |
| 2 | **NHID-Clinical v1.3 — Behavioral Baseline** (core) | Disclosure, no mimicry, human handoff, audit log. |
| 3 | NHID-Auth v2 | Cryptographic authorization: Ed25519 delegation chain + DPoP call-nonce binding (reference impl, CC BY 4.0). |
| 4 | FHIR AuditEvent R4 | Healthcare-native structured logging (HL7 v4.0.1); **no named IG (e.g. IHE BALP) conformance claimed**. |
| 5 | OpenTelemetry → SIEM | Spans forwarded to enterprise observability / security pipeline. |

**Behavioral conformance controls** (`NHID_CONFORMANCE_CONTROLS`), each `Conformant` with a
measurable indicator:

- **IDG-01** — Disclose AI identity before any data exchange (100% pre-exchange disclosure).
- **DBC-01** — No human voice mimicry or impersonation (0 flagged per 1,000 calls).
- **EIT-01** — Offer human handoff on request (100% honored, median < 60s).
- **ATR-01** — Minimal audit log of call and disclosures (100% logged, FHIR AuditEvent R4).

The data layer ships two worked examples — `NHID_EVENT_TRACE` (a passing 4/4 call) and
`NHID_EVENT_TRACE_FAIL` (a failing 1/4 call: no disclosure, deceptive artifacts, broken
handoff, incomplete audit, unverified delegation) — used to demonstrate scoring. A live
simulator is linked at `NHID_SIMULATOR_URL`.

> The deeper NHID-Clinical standard (the v1.3 canonical prompt, agent configs, test suite)
> lives outside this repository. **[SOURCE: NHID-Clinical — see companion archive and
> https://nhid-clinical.org]**

---

## 11. Risk Heatmap & Crosswalks

**Heatmap** (`GovernanceHeatmap.tsx`, data `HEATMAP_CELLS`): a 5×5 grid of likelihood
(`Rare`→`Almost Certain`) × impact (`Negligible`→`Severe`). Each of the 25 cells carries a
healthcare-voice-agent failure scenario (e.g. "Patient not told it's AI", "Clinician
override ignored", "Catastrophic triage failure"), a heat `level` (cool/mild/warm/hot), and
a link to the governing obligation. Clicking a cell opens that obligation's detail.

The heatmap ships a hover **particle system**: rising embers for hot/warm cells and drifting
petals for cool/mild cells, with count/speed/duration scaling by risk level — an
intentional, contained flourish (verified rendering without console errors).

**Crosswalks** (`CrosswalkSection.tsx`):

- **`CROSSWALK_TOPICS`** — an obligation-topic × framework matrix (11 topic rows ×
  7 framework columns: EU, ISO, NIST, OECD, Singapore, OWASP/ATLAS, Colorado), showing where
  each topic is mandatory, principle-based, or unaddressed.
- **`CROSSWALK_ACTORS`** — the EU AI Act actor-obligation matrix (Provider / Deployer /
  Importer / Distributor across 7 obligation areas).

The coverage tab carries an explicit note that NHID-Clinical's voice-agent conformance
*complements* the CCM control coverage rather than duplicating it.

---

## 12. Technical Architecture

**Stack (from `package.json`):**

- **Runtime/UI:** React 19 + React DOM 19, TypeScript, **Vite 7** build.
- **Routing:** `wouter` (lightweight client router; pages `Dashboard.tsx`, `NotFound.tsx`).
- **Styling:** Tailwind CSS (v4-style, `@tailwindcss/vite`), `tailwindcss-animate` /
  `tw-animate-css`, `tailwind-merge`, `class-variance-authority`, `clsx`.
- **Components:** shadcn/ui pattern over a broad **Radix UI** primitive set; `lucide-react`
  icons; `sonner` toasts; `vaul`, `cmdk`, `embla-carousel`, `react-resizable-panels`.
- **Forms/validation:** `react-hook-form` + `@hookform/resolvers` + `zod`.
- **Charts:** `recharts` (maturity radar + trend).
- **Maps:** `react-simple-maps` + `us-atlas` (USA choropleth); `maplibre-gl` +
  `world-atlas` + `topojson-client` (global vector globe); `three` available for future 3D.
- **Animation:** `framer-motion`.
- **Theming:** `next-themes`.

**State & persistence.** No backend. Interactive state (control assessments, maturity,
demo mode) is managed in React hooks — chiefly `useGovernanceState.ts` — and persisted to
`localStorage`. Supporting hooks: `useScrollSpy` (sidebar active section),
`useComposition`, `usePersistFn`, `useMobile`.

**Scripts:** `dev` (vite), `build` (vite build), `preview`, `check` (`tsc --noEmit`),
`format` (prettier), `test` (vitest run).

**Deployment.** Hosted on **Vercel** (`ai-governance-map.vercel.app`); PR previews deploy
automatically. CI signals observed in-session: Vercel preview build + CodeRabbit review bot.

**Known build note:** the production bundle exceeds Vite's 500 kB chunk-size warning
threshold (~2.5 MB / ~715 kB gzip with MapLibre added) — a candidate for code-splitting
(see §19). Two pre-existing dev-console warnings are unrelated to app logic: an unset
`VITE_ANALYTICS_ENDPOINT` env var and sandbox-blocked Google Fonts.

---

## 13. Design System & Visual Doctrine

The project encodes its visual standards as **Claude project skills** under `.claude/skills/`:

- **`enterprise-graphics-designer`** — NHID-Clinical-grade visual systems doctrine: strict
  8pt grid, ≤3-level type hierarchy, token-first color (Navy `#082a5b`/`#0F172A`, Teal
  `#188eaa`/`#14B8A6`, Cyan), restrained depth, consistent stroke-based iconography, and a
  hard rejection of "AI slop" (random gradients, decorative fluff, broken grids). Defaults
  to clean code-generated SVG for diagrams/icons.
- **`governance-dashboard-designer`** — dashboard-specific design guidance.

**Operative principles applied across the app:**

- Calm, operational GRC aesthetic (Linear/Stripe Radar reference), not consumer/startup.
- NHID palette: navy ink, medical teal, soft blue-tinted shadows, pill controls, no emoji.
- Restraint over spectacle: the heatmap particles and the globe focus-glow are deliberately
  subtle; the globe is light, not a dark threat-map.
- Consistent section chrome via `SectionHeader.tsx`; custom brand marks in `icons.tsx`.

This doctrine is *why* certain plausible feature ideas were declined or reshaped (e.g. the
3D dark threat-globe was reshaped into a calm light vector globe — see §18).

---

## 14. Coding & Development Practices

- **Language/typing:** TypeScript throughout; `pnpm check` (`tsc --noEmit`) is the
  type-safety gate and is run before every ship.
- **Verification doctrine:** changes are verified by *running the app* (dev server +
  Playwright against `localhost:5173`), not by unit tests alone — capturing real runtime
  observation (render, interactions, console, network). For the globe this specifically
  included asserting **zero external network requests**.
- **Branching:** feature work happens on dedicated branches (current:
  `claude/governance-map-website-design-envee0`); changes land via **draft PRs** to `main`.
- **Commits:** descriptive, scoped messages; co-authored trailers and session links per repo
  convention.
- **Package manager:** `pnpm`.
- **Formatting:** Prettier (`pnpm format`).
- **Data integrity rule (non-negotiable):** pasted/AI-generated research is never encoded as
  fact without independent verification (see §17).

---

## 15. Claude Code & LLM Tasking

This project is developed with Claude Code under a structured workflow:

- **Task tracking** via the task list (33+ completed tasks spanning the NHID conformance
  model, dashboard animations, the USA map, the global map, heatmap particles, and the v2
  globe rebuild).
- **Plan-then-build** for non-trivial features (architecture planning agent → implementation
  → run-the-app verification → draft PR).
- **PR stewardship:** sessions can subscribe to PR activity and respond to CI/review events;
  Vercel preview + CodeRabbit are the active bots.
- **Project skills** (`.claude/skills/`) carry durable design/engineering doctrine so visual
  and data-integrity standards survive across sessions.

**Reusable prompt patterns established here:** "verify by running, not by testing";
"never encode pasted research as fact"; "keep the aesthetic calm/operational"; "preserve the
no-data-leaves-the-browser guarantee in every networked feature."

---

## 16. Regulatory & Federal Alignment

The Map's regulatory spine, as modeled in the data:

- **EU AI Act (Regulation (EU) 2024/1689)** — the most heavily modeled framework
  (coverage 72; obligations `obl1`–`obl8`, `obl17`), with a live milestone timeline:
  - 2024-08-01 entered into force
  - 2025-02-02 prohibited practices + AI literacy
  - 2025-08-02 GPAI governance rules
  - 2026-06-30 *(current)* Colorado AI Act applicable
  - 2026-08-02 *(current)* transparency rules applicable
  - 2027-12-02 high-risk systems applicable
  - 2028-08-02 product-integrated AI systems applicable
- **US federal:** HIPAA Security Rule §164.312 Technical Safeguards modeled in full
  (`obl24`–`obl35`); `README` cites CMS-0057-F and MACPAC as part of the broader mapping
  context; NIST AI RMF 1.0 (Govern/Map/Measure/Manage) is a primary voluntary anchor.
- **US state/municipal:** Colorado, California, Illinois, NYC, Texas, Utah binding laws.
- **International:** EU (binding bloc), South Korea, China, India binding; UK, Canada, Brazil,
  Singapore, Japan researched-none; ISO/IEC 42001, OECD Principles, Singapore MGF,
  OWASP/ATLAS as voluntary standards.

**NIST references** appear pervasively in control `mappings` (GOV/MAP/MEASURE/MANAGE
function codes). **CMS references** anchor the healthcare use case via the README and the
NHID-Clinical companion. Specific NIST/CMS document internals beyond what the data encodes
are **[SOURCE: NHID-Clinical — see companion archive]**.

---

## 17. Data Integrity & Research Methodology

The project's foundational rule: **pasted, AI-generated, or secondary-source research is a
hint list, never fact.** Before any jurisdiction is encoded, its status is independently
verified against primary/official sources and reputable legal trackers (e.g. White & Case AI
Watch, IAPP, Lexology, IBA, DLA Piper, Fasken).

**Worked example — the Singapore / Japan / India expansion (mid-2026):**

| Country | Verified status | Classification | Why |
|---|---|---|---|
| Singapore | No enacted AI statute; IMDA Model Framework + MAS guidance are voluntary | **none** | Voluntary/supervisory, not legislation |
| Japan | AI Promotion Act (May 2025) is enacted but soft-law (no fines) | **none** | Advisory/"name-and-shame" only |
| India | IT Rules Amendment 2026 (G.S.R. 120(E), in force Feb 20, 2026) — binding, AI-specific, penalized | **binding** | Labelling/provenance + 3-hr takedown + safe-harbor loss |
| Canada | AIDA/Bill C-27 died on prorogation; replacement is privacy-only | **none** | No AI-specific binding law |
| Brazil | PL 2338/2023 still in committee, no floor vote | **none** | Not yet enacted |

**Coverage-honesty principle (encoded in the data file's comments):** countries with no
*verified* status are rendered as **"not yet researched"** rather than guessed as "none".
The subtitle and detail panel state plainly that the set is "a researched starting set, not
an exhaustive survey." This is the same discipline applied to the US state set.

Out-of-scope material is excluded by design — e.g. an unrelated healthcare-fraud/NHID report
pasted during research was explicitly not incorporated.

---

## 18. Decisions Made

- **Companion, not competitor, to NHID-Clinical.** The Map models the governance universe;
  NHID-Clinical models agent behavior. Controls cross-link rather than duplicate.
- **No backend / local-only.** All state in `localStorage`; the "no data leaves your
  browser" guarantee is a product promise, not just an implementation detail.
- **Calm operational aesthetic** over consumer/startup spectacle (Linear/Stripe Radar).
- **Global map = light vector globe, not dark threat-map.** The Global Threat Map *concept*
  (interactive world view) was adopted; its dark consumer aesthetic was explicitly rejected.
- **MapLibre + bundled topojson over Mapbox/OSM tiles.** Open-source, no API keys, and —
  critically — no external network requests, preserving privacy. The first globe pass that
  used OpenStreetMap raster tiles was rebuilt for exactly this reason.
- **Map ordering fixed:** Global above USA, with the USA detail pointing "below" to the
  state map; the superseded flat `GlobalComplianceMapSection` was deleted.
- **Three visual tiers for jurisdictions:** binding / researched-none / not-yet-researched —
  never collapse "unknown" into "none".
- **India classified `binding`** alongside China's similarly-scoped delegated rules.
- **Verify by running the app**, not by unit tests or typecheck alone.

---

## 19. Future Work

- **Malta (EU member) is missing** from `COUNTRY_AI_LAWS` because it is not a standalone
  polygon in the 110m Natural Earth dataset; consider a higher-resolution topology or a
  point marker so all 27 EU members show as binding.
- **Bundle code-splitting** to clear the Vite 500 kB chunk warning (lazy-load MapLibre and
  the globe section).
- **Expand researched country coverage** beyond the current 35 (Australia, Gulf states,
  LATAM, more of APAC) — under the same verification discipline.
- **Lazy-mount the globe** via IntersectionObserver to avoid initializing WebGL until the
  section is scrolled into view.
- **Wire real analytics** only if/when a privacy-preserving approach is chosen (the unset
  `VITE_ANALYTICS_ENDPOINT` currently produces a benign dev warning).
- **Legal/disclaimer surface:** a clear non-legal-advice disclaimer is appropriate now; a
  full privacy policy / ToS becomes relevant only if a backend, accounts, or analytics are
  ever introduced.
- **Deepen NHID-Auth v2 visualization** (delegation chain / DPoP nonce flow) drawing on the
  companion standard.

---

## 20. Templates & Checklists

**Add-a-jurisdiction checklist (state or country):**

1. Independently verify status against ≥2 primary/reputable sources (not the paste).
2. Classify as `binding` or `none` — never guess "none" for unverified; leave unlisted
   (renders as "not yet researched").
3. If `binding`, add a `Framework` (with `shortCode` added to the union) and 1–2
   `Obligation` rows mirroring the existing KR/CN/IN style.
4. Add the `StateAILaw` / `CountryAILaw` row with `frameworkSlug`; include a one-line comment
   recording the verification rationale.
5. Confirm the name matches the atlas dataset (`states-10m` / `countries-110m` Natural Earth).
6. `pnpm check` → `pnpm build` → run the app, scroll to the map, confirm the new tier/panel.

**Ship checklist (any change):**

1. `pnpm check` clean. 2. `pnpm build` clean. 3. Run dev + Playwright; observe the actual
surface (render, interactions, console, network). 4. For networked features, assert no
unexpected external requests. 5. Commit on a feature branch. 6. Open/refresh a **draft PR**.
7. Watch Vercel preview + CodeRabbit; address actionable items.

**Control assessment indicator pattern:** every control defines `{ name, method, slo }` —
a named metric, how it's measured, and a target. Reuse this shape for any new control.

---

## 21. FAQ & Plain Language Guide

**Q: What is the AI Governance Map, in one sentence?**
A live, private, browser-only reference that shows which AI laws, obligations, and controls
apply across jurisdictions — built for healthcare AI-voice-agent teams.

**Q: Does my data leave the browser?**
No. There is no backend; assessment state lives in your browser's `localStorage`, and even
the world map renders from bundled data with no external network calls.

**Q: Is this legal advice?**
No. It is a reference tool. Coverage figures are project estimates and the jurisdiction set
is a researched starting point, not an exhaustive or authoritative legal survey.

**Q: Why is most of the world map grey?**
Grey means "not yet researched," not "no law." The project only colors a country once its
status has been independently verified — honesty over false completeness.

**Q: How does it relate to NHID-Clinical?**
NHID-Clinical is the behavioral standard for AI voice agents; the Map is its companion that
situates that behavior inside the wider regulatory and control landscape. Controls 7 and 23,
and obligations 17/28/35, are the concrete bridges.

**Q: Why a light globe and not a flashy dark one?**
By design. The product's aesthetic is calm, operational GRC tooling; a dark consumer
threat-map would fight that. The globe is interactive and 3D, but quiet.

**Q: How current is it?**
The data reflects mid-2026 (e.g. EU AI Act timeline through 2028, Korea AI Basic Act in
effect Jan 2026, India IT Rules Amendment in force Feb 2026).

---

## 22. Source Material Appendix

**Primary sources for this archive (all in-repo):**

- `client/src/data/governance.ts` — canonical data layer (629 lines): all frameworks,
  obligations, controls, state/country laws, timeline, heatmap, crosswalks, NHID stack.
- `client/src/pages/Dashboard.tsx` — section composition and order.
- `client/src/components/dashboard/*.tsx` — 16 dashboard components incl.
  `GlobalGlobeVisualization`, `GlobeDetailsPanel`, `USAComplianceMapSection`,
  `GovernanceHeatmap`, `NhidTrustStack`, `CrosswalkSection`, `ControlsSection`,
  `MaturityRadarSection`, `TimelineSection`, `FrameworksSection`, `HeroKpis`, `TopBar`,
  `AppSidebar`, `IntroBanner`, `SectionHeader`, `DemoModeOverlay`, `icons`.
- `client/src/components/dashboard/particles/GlobeParticles.tsx` — globe focus glow.
- `client/src/hooks/*` — `useGovernanceState`, `useGlobeData`, `useScrollSpy`,
  `useComposition`, `usePersistFn`, `useMobile`.
- `.claude/skills/enterprise-graphics-designer/SKILL.md`,
  `.claude/skills/governance-dashboard-designer/` — design doctrine.
- `README.md`, `CHANGELOG.md`, `package.json` — product framing, v2.0.0 notes, stack.
- Git history — 146 commits as of generation; PRs #36–#46 (animations, USA map, global map,
  heatmap particles, global data expansion, globe rebuild).

**Companion / external (not in this repo):**

- **NHID-Clinical** standard internals (v1.3 canonical prompt, agent configs, test suite,
  NHID-Auth v2 reference implementation) — **[SOURCE: NHID-Clinical — see
  `NHID-CLINICAL-MASTER-ARCHIVE.md` and https://nhid-clinical.org]**.
- Regulatory primary sources used during data verification (official government sites;
  trackers: White & Case AI Watch, IAPP, Lexology, IBA, DLA Piper, Fasken) — consulted for
  status verification, not redistributed here.

**Verification status of this archive:** every count and table above was read directly from
the current `governance.ts` and repository state on the generation date. Items dependent on
the external NHID-Clinical repository are explicitly marked and not asserted as in-repo fact.

---

*End of AI Governance Map Master Project Knowledge Archive.*
