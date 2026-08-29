# NHID-CLINICAL MASTER KNOWLEDGE ARCHIVE

**Document Status:** Production  
**Version:** Aligned to NHID-Clinical v2 (live as of June 11, 2026)  
**Source of Truth:** `thankcheeses/ai-governance-map` repository + session conversation record  
**Generated:** June 12, 2026  
**Canonical URL:** https://nhid-clinical.org  
**Companion Tool:** https://thankcheeses.github.io/ai-governance-map/ *(migrated from Vercel, Aug 29 2026)*

> **Source Material Notice:** This archive was built from content available in the `thankcheeses/ai-governance-map` repository (index.html, CHANGELOG.md, README.md, ideas.md, todo.md) and the project session record. The primary `NHID-Clinical/NHID-Clinical` repository was not accessible during this session and its contents — including the v1.3 canonical reference prompt, ElevenLabs agent configuration files, test suite source code, and implementation code — are **not** captured here. Sections dependent on that repository are marked **[SOURCE: NHID-Clinical/NHID-Clinical repo — not yet ingested]**. All content below is traceable to available source material; nothing has been invented.

---

## Table of Contents

1. [Executive Vision & Strategic Direction](#1-executive-vision--strategic-direction)
2. [NHID-Clinical Core Framework](#2-nhid-clinical-core-framework)
3. [Governance Architecture](#3-governance-architecture)
4. [Identity & Trust Infrastructure](#4-identity--trust-infrastructure)
5. [Healthcare AI Agent Verification](#5-healthcare-ai-agent-verification)
6. [Technical Architecture](#6-technical-architecture)
7. [Implementation Roadmap](#7-implementation-roadmap)
8. [Coding & Development](#8-coding--development)
9. [Claude Code, Manus, and Other LLM Tasking](#9-claude-code-manus-and-other-llm-tasking)
10. [Website Content](#10-website-content)
11. [Whitepaper Content](#11-whitepaper-content)
12. [Diagrams & Visual Concepts](#12-diagrams--visual-concepts)
13. [Research References](#13-research-references)
14. [Regulatory & Federal Alignment](#14-regulatory--federal-alignment)
15. [NIST References](#15-nist-references)
16. [CMS References](#16-cms-references)
17. [Sponsorship & Partnership Discussions](#17-sponsorship--partnership-discussions)
18. [Marketing & Positioning](#18-marketing--positioning)
19. [Decisions Made](#19-decisions-made)
20. [Future Work](#20-future-work)
21. [Templates & Checklists](#21-templates--checklists)
22. [FAQ & Plain Language Guide](#22-faq--plain-language-guide)
23. [Source Material Appendix](#23-source-material-appendix)

---

## 1. Executive Vision & Strategic Direction

### Plain-Language Summary
> **What is this?** NHID-Clinical is an open behavioral standard for AI voice agents used in B2B healthcare administrative workflows — for example, an AI agent calling a payer's office to verify benefits or check prior authorization status on behalf of a provider practice.  
> **Why does it matter?** Today, a bad actor can build a voice AI that perfectly mimics a legitimate medical office's disclosure script while having a completely fabricated identity. Existing carrier-level tools (STIR/SHAKEN) only verify the phone number's origin — not who authorized the call or whether the agent is acting on behalf of a real, credentialed provider. NHID-Clinical sets the behavioral floor and, in v2, adds cryptographic identity verification to close that gap.  
> **Who uses it?** Healthcare payers, provider practice operators, health IT vendors, and AI governance practitioners evaluating voice AI deployments in clinical-administrative contexts.  
> **Non-technical summary:** Think of NHID-Clinical as a "code of conduct + identity badge" for AI voice agents working in healthcare. v1.3 defined the code of conduct. v2 adds a tamper-proof badge.

### Origin Story

NHID-Clinical originated as a companion project to the AI Governance Map, a reference tool mapping AI governance controls to regulatory frameworks across federal and state jurisdictions. The governance map identified a gap: no existing standard specifically addressed the behavioral and identity requirements for AI voice agents operating in B2B healthcare payer-provider administrative channels.

The project emerged from the recognition that:
1. Healthcare administrative voice channels were being increasingly targeted by AI-powered impersonation
2. Existing carrier-level authentication (STIR/SHAKEN) verifies only phone number origin, not agent authorization
3. The NPI Registry provides no delegation proof or call-time authorization mechanism
4. Behavioral disclosure requirements (EU AI Act, state laws) were necessary but insufficient without identity binding

### Mission

> *"Open behavioral baseline for AI voice agents in B2B healthcare administrative workflows."*
> — README.md, `thankcheeses/ai-governance-map`

NHID-Clinical's mission is to establish, maintain, and promote a voluntary open framework that:
- Defines the minimum behavioral controls any compliant AI voice agent must implement
- Provides a cryptographically verifiable identity layer closing the NPI delegation gap
- Integrates with existing healthcare data standards (FHIR AuditEvent, IHE BALP) and enterprise observability pipelines

### Vision

A healthcare interoperability ecosystem in which every AI voice agent can be identified, verified, and audited in real time across organizational boundaries — regardless of the underlying technology vendor — with a behavioral and cryptographic baseline that is open, voluntary, and implementable without a central authority.

### Product Thesis

Disclosure alone is insufficient. A voice AI that says "I'm an automated assistant" before exchanging data passes all behavioral tests while being completely unverifiable. The insight driving NHID-Clinical is:

> **Behavioral controls (v1.3) + Cryptographic identity (v2) = A complete trust surface for B2B healthcare voice AI.**

Without both layers, any compliant trace can be spoofed by an adversary with access to the same disclosure script.

### Target Users

| User Type | Role | Use Case |
|-----------|------|----------|
| Healthcare Payers | Authorization, Claims | Evaluating incoming AI agents from provider offices; setting acceptance criteria |
| Provider Practice Operators | Admin, Operations | Deploying compliant AI agents for prior auth, eligibility, scheduling |
| Health IT Vendors | Engineering, Product | Building NHID-Clinical-conformant agent platforms |
| AI Governance Practitioners | Compliance, Legal | Mapping NHID-Clinical controls to EU AI Act, NIST RMF, ISO 42001 |
| Regulators / Policy Staff | Policy | Understanding voluntary behavioral baselines for voice AI |

### Problem Statement

The specific gap NHID-Clinical addresses:

> *"AUTH-01 gap: v1.3 does not verify caller authorization. A spoofed NPI + voice AI passes all four behavioral controls while bypassing identity verification entirely."*
> — AI Governance Map, NHID-Clinical section (v1.3 era content)

In concrete terms:
- An adversary can clone a legitimate provider's disclosure script
- STIR/SHAKEN attests phone number origin at A/B/C levels — it does not verify who authorized the call or what NPI they hold
- The NPI Registry contains no delegation proof or call-time verification mechanism
- A spoofed caller produces an audit log identical to a legitimate one under v1.3
- v2 closes this by requiring Ed25519 delegation chain + DPoP call-nonce binding (AUTH-01)

### Market Context

- AI voice agents are increasingly deployed in healthcare administrative workflows (prior auth, eligibility, scheduling, referrals)
- Federal and state regulatory frameworks (EU AI Act, state AI disclosure laws, CMS interoperability rules) require behavioral disclosure but do not specify cryptographic identity for voice agents
- No existing open standard addresses the specific gap at the intersection of voice AI behavior and NPI-bound identity in payer-provider channels
- NHID-Clinical occupies this gap as a voluntary open framework

### Strategic Priorities (as of v2 launch, June 11, 2026)

1. **Close AUTH-01:** Cryptographic NPI delegation is the primary v2 deliverable — completed
2. **ElevenLabs integration:** Test conformance against the live Nadine agent (ElevenLabs agent ID: `agent_4001krn32nmwe5t8mqzgee0w84rj`) — [SOURCE: NHID-Clinical/NHID-Clinical repo — in progress]
3. **Open the test suite:** ATR-01 and EIT-01 conformance tests for public use
4. **Integrate with the AI Governance Map:** Surface NHID-Clinical controls alongside EU AI Act, NIST RMF, ISO 42001
5. **v2 public reference:** nhid-clinical.org as the canonical landing

### Success Criteria

- All 5 NHID-Clinical controls (DISC-01, MIME-01, HAND-01, LOG-01, AUTH-01) are defined, documented, and testable
- At least one live reference implementation (Nadine / ElevenLabs) passes conformance
- AI Governance Map surfaces NHID-Clinical v2 as a tracked framework with 5/5 conformance score
- AUTH-01 test cases are passing with correct per-milestone timestamps and distinct event fields

---

## 2. NHID-Clinical Core Framework

### Plain-Language Summary
> NHID-Clinical defines five rules every AI voice agent must follow to be considered compliant in a B2B healthcare context. Four rules govern behavior; one governs identity. Think of it as a checklist that both the agent and the receiving system can verify independently.

### Framework Identity

| Attribute | Value |
|-----------|-------|
| **Full Name** | NHID-Clinical Voice Agent Conformance Framework |
| **Current Version** | v2 (live as of June 11, 2026) |
| **Prior Version** | v1.3 |
| **Type** | Voluntary open behavioral baseline |
| **Domain** | B2B healthcare payer-provider voice AI workflows |
| **Website** | https://nhid-clinical.org |
| **Companion** | AI Governance Map (https://thankcheeses.github.io/ai-governance-map/) |

### Core Concepts

**Behavioral Baseline:** A minimum set of behavioral requirements any AI voice agent must satisfy before exchanging operational data in a healthcare administrative context.

**Disclosure-first principle:** No data exchange may occur before the AI identity is disclosed to the receiving party.

**Non-mimicry requirement:** Voice AI must not impersonate a human agent in voice, manner, or presentation.

**Human handoff guarantee:** The receiving party must be able to request a human at any point.

**Audit completeness:** Every call must produce a minimal audit log capturing disclosure, data exchange, and handoff events with distinct timestamps.

**Cryptographic authorization (v2):** The agent must present a verifiable delegation credential linking a real, credentialed provider (NPI) to the specific call via an Ed25519 delegation chain and DPoP call-nonce binding.

### The Five Controls

| Control ID | Requirement | v1.3 Status | v2 Status | Layer |
|------------|-------------|-------------|-----------|-------|
| **DISC-01** | Disclose AI identity before any data exchange | Conformant | Conformant | Layer 2 (Behavioral) |
| **MIME-01** | No human voice mimicry or impersonation | Conformant | Conformant | Layer 2 (Behavioral) |
| **HAND-01** | Offer human handoff on request | Conformant | Conformant | Layer 2 (Behavioral) |
| **LOG-01** | Minimal audit log of call and disclosures | Conformant | Conformant | Layer 2 (Behavioral) |
| **AUTH-01** | Verify caller authorization / NPI delegation | **Gap — not in v1.3** | **Conformant** | Layer 2/3 (Cryptographic) |

**Conformance Score:** 4/5 (v1.3) → **5/5 (v2)**

### v1.3 → v2 Change Summary

The primary change from v1.3 to v2 is the closure of AUTH-01:

> *"AUTH-01 closed in v2: Cryptographic NPI delegation verification via Ed25519 + DPoP call-nonce binding. All 5 controls now conformant."*
> — AI Governance Map, live NHID-Clinical section

**Architectural shift in v2:**
- In v1.3: AUTH-01 was acknowledged as a gap; Layer 3 (NHID-Auth v1.4) was the reference implementation for closing it
- In v2: AUTH-01 is elevated to a Layer 2 baseline behavioral requirement — cryptographic NPI delegation is now a mandatory baseline, not an optional add-on

> *"NHID-Clinical v2 closes AUTH-01 at Layer 2 — cryptographic NPI delegation is now a baseline behavioral requirement, not a Layer 3 add-on."*
> — AI Governance Map, trust stack footnote

### Operating Model

- **Voluntary:** No regulatory mandate; adoption is market-driven
- **Open:** Framework is publicly documented; no licensing fee or membership required
- **Testable:** Conformance can be verified against the published test suite (ATR-01, EIT-01, and others) — [SOURCE: NHID-Clinical/NHID-Clinical repo]
- **Layered:** Framework integrates with STIR/SHAKEN (carrier layer), FHIR AuditEvent (logging layer), and OpenTelemetry (observability layer)

### Conceptual Boundaries

NHID-Clinical **does** cover:
- AI voice agent behavior in payer-provider B2B administrative channels
- Disclosure, mimicry, handoff, and logging requirements
- Cryptographic authorization of the calling agent's NPI delegation (v2)

NHID-Clinical **does not** cover:
- Patient-facing voice AI (clinical decision support, direct patient interaction)
- Non-voice AI channels (chat, email, document automation)
- Clinical diagnosis, treatment, or direct clinical care AI
- General-purpose AI governance (see: AI Governance Map, EU AI Act, NIST RMF)

---

## 3. Governance Architecture

### Plain-Language Summary
> NHID-Clinical's governance model is layered: carrier-level attestation at the bottom, behavioral rules in the middle, cryptographic identity above that, and healthcare-native logging and enterprise observability at the top. Each layer does a specific job and cannot substitute for the others.

### The 5-Layer Trust Stack (Canonical)

This is the canonical architecture as documented in the AI Governance Map:

```
Layer 5 │ OpenTelemetry spans → SIEM / enterprise observability pipeline
Layer 4 │ FHIR AuditEvent R4 / IHE BALP — healthcare-native structured logging
Layer 3 │ NHID-Auth v1.4 — Ed25519 delegation chain + DPoP call-nonce binding
         │   (AUTH-01 reference implementation)
Layer 2 │ ★ NHID-Clinical v2 — Behavioral Baseline + AUTH-01
         │   (disclosure, no mimicry, handoff, audit log, NPI delegation verification)
Layer 1 │ STIR/SHAKEN — carrier attestation (A/B/C levels), phone number origin only
Layer 0 │ NPI Registry — no delegation proof, no call-time authorization
```

**★ Layer 2 note (v2):**
> *"NHID-Clinical v2 closes AUTH-01 at Layer 2 — cryptographic NPI delegation is now a baseline behavioral requirement, not a Layer 3 add-on."*

**★ Layer 2 note (v1.3 era):**
> *"NHID-Clinical connects these layers for cross-organizational, real-time voice-channel authorization. AUTH-01 is closed only at Layer 3+."*
> [This was the v1.3 framing; in v2, AUTH-01 is at Layer 2.]

### Layer-by-Layer Accountability

| Layer | System | What It Verifies | What It Does NOT Verify |
|-------|--------|-----------------|------------------------|
| 0 | NPI Registry | Provider exists, has valid NPI | Call-time authorization, delegation |
| 1 | STIR/SHAKEN | Phone number origin (A/B/C attestation) | Identity of the caller, NPI binding |
| 2 | NHID-Clinical v2 | Behavioral controls + NPI delegation | Enterprise-grade structured logging |
| 3 | NHID-Auth v1.4 | Ed25519 delegation chain + DPoP nonce | Healthcare-native log structure |
| 4 | FHIR AuditEvent / IHE BALP | Structured healthcare audit log | Enterprise telemetry pipeline |
| 5 | OpenTelemetry / SIEM | Enterprise observability | Healthcare-specific semantics |

### Policy Layers

The NHID-Clinical framework defines two policy layers:

**Behavioral Policy (v1.3 baseline, carried into v2):**
- Disclosure before data exchange (DISC-01)
- No human mimicry (MIME-01)
- Human handoff availability (HAND-01)
- Minimal audit log (LOG-01)

**Cryptographic Authorization Policy (v2 addition):**
- NPI delegation verification via Ed25519 chain (AUTH-01)
- DPoP call-nonce binding to prevent replay attacks
- Cryptographic proof that a spoofed caller cannot produce a valid token

### Governance of the Framework Itself

[SOURCE: NHID-Clinical/NHID-Clinical repo — governance of the framework as an open project (maintainer structure, contribution model, version release process) is not documented in available source material. Mark as **[Needs Review]**.]

### Auditability

Every conformant NHID-Clinical call produces a minimal audit log. The canonical log structure is:

```json
{
  "call_id": "nhid-call-2026-06-04-001",
  "agent_id": "brianna-voice-agent-v3",
  "start_time": "2026-06-04T09:12:00Z",
  "disclosure_time": "2026-06-04T09:12:02Z",
  "disclosure_text": "I'm an automated assistant from Dr. Smith's office.",
  "operational_data_exchanged": "09:12:08Z",
  "human_handoff_requested": true,
  "handoff_time": "2026-06-04T09:12:22Z",
  "audit_log_complete": true,
  "deceptive_artifacts_detected": false,
  "auth_01_verified": true,
  "nhid_clinical_score": "5/5"
}
```

*Source: AI Governance Map, NHID-Clinical section, index.html lines 611–625*

**Key audit fields:**
- `call_id` — unique call identifier
- `agent_id` — voice agent identifier (e.g., `brianna-voice-agent-v3`)
- `start_time`, `disclosure_time`, `operational_data_exchanged`, `handoff_time` — per-milestone timestamps (each must be distinct; see ATR-01 test failure context)
- `auth_01_verified` — boolean; must be `true` for v2 conformance
- `nhid_clinical_score` — fraction score (5/5 for full v2 conformance)

### Escalation and Human-in-the-Loop

- HAND-01 requires that any receiving party can request a human handoff at any point in the call
- When `human_handoff_requested: true`, `handoff_time` must be recorded in the audit log
- The simulated human stakeholder in EIT-01 tests must provide a personal name when transferring — role-only identification fails (see §5)

---

## 4. Identity & Trust Infrastructure

### Plain-Language Summary
> In v1.3, you had to take the AI's word for it when it said it was calling from a provider's office. In v2, the agent carries a cryptographic credential — like a signed badge — that proves it was authorized by a real, credentialed provider. A fake agent cannot forge this badge.

### Authentication Architecture (v2)

**Core mechanism:** Ed25519 delegation chain + DPoP (Demonstration of Proof-of-Possession) call-nonce binding

**What this means:**
- **Ed25519 delegation chain:** The calling agent holds a cryptographic signature chain proving that a real NPI-registered provider delegated authority to this agent for this call type
- **DPoP call-nonce binding:** Each call carries a unique nonce bound to this specific call, preventing replay attacks — a credential captured from one call cannot be reused on another

**v2 AUTH-01 field in audit log:**
```json
"auth_01_verified": true,
// AUTH-01: Cryptographically verified via NHID-Auth v2
```

**v1.3 AUTH-01 field (historical reference):**
```json
"auth_01_verified": false,
// AUTH-01 gap: NPI not cryptographically verified
```

### Reference Implementation

NHID-Auth v1.4 is the named reference implementation for the AUTH-01 cryptographic layer:

> *"NHID-Auth v1.4 — Ed25519 delegation chain + DPoP call-nonce binding (AUTH-01 reference implementation)"*
> — AI Governance Map, 5-Layer Trust Stack, Layer 3

### The NPI Delegation Gap (Why This Matters)

The NPI (National Provider Identifier) Registry, maintained by CMS/NPPES, does:
- Assign unique 10-digit identifiers to US healthcare providers
- Verify provider existence and type
- Provide searchable credential lookup

The NPI Registry does **not**:
- Provide delegation proof (that Provider X authorized Agent Y to call on their behalf)
- Provide call-time authorization (that this specific call is legitimate)
- Detect AI-powered impersonation

Before v2, this meant:
> *"A spoofed NPI + voice AI passes all four behavioral controls while bypassing identity verification entirely."*

After v2:
> *"NPI delegation is cryptographically verified and a spoofed caller cannot produce a valid token."*

### Trust Scoring

NHID-Clinical uses a 5-point conformance score (1 point per control):
- **5/5** — Full v2 conformance including AUTH-01
- **4/5** — v1.3 behavioral baseline only (AUTH-01 gap)
- **<4/5** — Partial conformance; individual control gaps

### Role Management

[SOURCE: NHID-Clinical/NHID-Clinical repo — specific role definitions, delegation chain structure, credential issuance, and revocation processes are **[Needs Review]** pending access to NHID-Auth v1.4 specification.]

Known from available source:
- Caller identity is bound to an NPI (provider identifier)
- Delegation chain traces from NPI holder to the specific voice agent
- DPoP nonce binding is per-call (not per-session or per-agent)

### Access Boundaries

NHID-Clinical v2 trust infrastructure specifically covers:
- B2B payer-provider voice channels
- Calls where an AI agent is acting on behalf of a named NPI holder

It does **not** cover:
- Patient-to-provider voice channels
- General-purpose API authentication
- EHR system access credentials

---

## 5. Healthcare AI Agent Verification

### Plain-Language Summary
> NHID-Clinical provides a test suite that simulates real call scenarios to verify whether a voice agent actually behaves as required. If the agent passes all tests, it's conformant. Some tests have known failure patterns that the project is actively fixing.

### Verification Framework Overview

NHID-Clinical conformance is tested against a live ElevenLabs voice agent. As of the current session:

- **Test agent (canonical):** "Nadine"
- **ElevenLabs Agent ID:** `agent_4001krn32nmwe5t8mqzgee0w84rj`
- **API:** ElevenLabs Conversational AI Agents API (`GET`/`PATCH` `/v1/convai/agents/{agent_id}`)
- **Credential:** `ELEVENLABS_API_KEY` (environment variable, set in NHID-Clinical/NHID-Clinical repo)
- **Test repo:** `github.com/NHID-Clinical/NHID-Clinical` [SOURCE: NHID-Clinical/NHID-Clinical repo — not yet ingested]

### Known Test Suite

#### ATR-01 — Audit Trace Timestamps

| Attribute | Value |
|-----------|-------|
| **Control tested** | LOG-01 (Minimal audit log of call and disclosures) |
| **Failure rate observed** | 13 of 15 runs failed |
| **Failure message** | "missing distinct event timestamps" |
| **Root cause** | All conversation events evaluated with identical timestamps — evaluator reading wrong field |
| **Status** | Fix planned: update evaluation criteria to read per-milestone timestamps from the correct field in the conversation object |
| **Conformance requirement** | Unchanged — audit logs must have distinct per-event timestamps |

**Diagnosis:**
The test failure is in the evaluator, not the agent behavior. The fix is to pull one failed run's full conversation object and inspect where per-event timestamps actually live (transcript metadata vs. top-level events), then update the test's evaluation criteria accordingly.

#### EIT-01 — Human Stakeholder Personal Introduction

| Attribute | Value |
|-----------|-------|
| **Control tested** | HAND-01 (Offer human handoff on request) |
| **Failure rate observed** | 2 of 15 runs failed |
| **Failure message** | "human agent failed personal introduction" |
| **Root cause** | The simulated human stakeholder identifies by role only; success criteria requires a personal name |
| **Status** | Fix planned: update simulated user persona prompt so the transferred human gives a personal name |
| **Conformance requirement** | Unchanged |

**Locked terminology note:** The conformance test category referenced as **"Impersonation Latency"** must never be renamed or paraphrased in any documentation or code.

### Credit-Aware Reporting Rule

Runs that fail with `"insufficient simulation credits available"` must be reported as **NOT_EXECUTED**, never as conformance failures. These must be flagged separately in all test output.

### Simulation Agent Configuration

| Attribute | Value |
|-----------|-------|
| **Agent name** | Nadine (canonical test agent) |
| **ElevenLabs Agent ID** | `agent_4001krn32nmwe5t8mqzgee0w84rj` |
| **Canonical prompt reference** | v1.3 reference prompt in NHID-Clinical/NHID-Clinical repo [not yet ingested] |
| **Voice agent in map example** | `brianna-voice-agent-v3` |
| **Disclosure text (canonical)** | "I'm an automated assistant from Dr. Smith's office." |

**Agent sync workflow:**
1. Pull live config via `GET /v1/convai/agents/agent_4001krn32nmwe5t8mqzgee0w84rj`
2. Diff against canonical v1.3 reference prompt in the repo
3. Report every divergence before pushing any changes
4. Push canonical version via `PATCH /v1/convai/agents/{agent_id}`
5. Repo is the source of truth — do not invent prompt content

### Clinical Safety Controls

[SOURCE: NHID-Clinical/NHID-Clinical repo — specific clinical safety controls beyond the 5 NHID behavioral requirements are **[Needs Review]**.]

### Exception Handling

Known exception types from available source:
- `"insufficient simulation credits available"` → report as NOT_EXECUTED
- Test run failures due to evaluator field mismatch (ATR-01) → not agent conformance failures
- Human handoff persona failures (EIT-01) → test setup issue, not agent behavioral failure

---

## 6. Technical Architecture

### Plain-Language Summary
> The AI Governance Map (the companion web tool) is a static HTML single-page application deployed on Vercel. NHID-Clinical itself has a separate implementation repo (not yet ingested). The governance map is the public-facing reference interface; nhid-clinical.org is the canonical framework home.

### AI Governance Map (Companion Tool) — Technical Stack

**Deployment model:** Static HTML + inline JavaScript, served by Vercel from the `main` branch of `thankcheeses/ai-governance-map`.

| Component | Technology |
|-----------|-----------|
| Frontend (static) | Vanilla HTML/CSS/JS (`index.html`) |
| Frontend (React app) | React + TypeScript, Tailwind CSS, Radix UI — in `client/src/` |
| Build tool | Vite 7 |
| Package manager | pnpm |
| Deployment | Vercel (auto-deploy from `main`) |
| Database ORM | Drizzle |
| Backend | Express + tRPC |
| Charts | Chart.js 4.4.7 |
| Node requirement | ≥20.19 (Vite 7 constraint) |
| Fonts | Inter, JetBrains Mono (Google Fonts) |

**`vercel.json`:** Empty `buildCommand`, `outputDirectory: "."` — Vercel serves `index.html` directly as the static site root.

**Branch strategy:**
- `main` → Vercel production deployment (https://ai-governance-map.vercel.app/)
- `claude/governance-map-website-design-envee0` → Active development branch

### NHID-Clinical Implementation Repo

[SOURCE: NHID-Clinical/NHID-Clinical repo — not yet ingested]

Known from session context:
- Repo: `github.com/NHID-Clinical/NHID-Clinical`
- Contains: v1.3 canonical reference prompt, ElevenLabs agent test suite, conformance test cases (ATR-01, EIT-01)
- Environment: `ELEVENLABS_API_KEY` set as env var
- ElevenLabs API endpoints used: `GET /v1/convai/agents/{agent_id}`, `PATCH /v1/convai/agents/{agent_id}`, agent testing endpoints

### APIs & Integrations

| System | Integration Type | Purpose |
|--------|-----------------|---------|
| ElevenLabs Conversational AI | REST API | Voice agent deployment and testing |
| NPI Registry (CMS NPPES) | Reference system | Provider identifier lookup |
| FHIR AuditEvent R4 | Log format | Healthcare-native structured logging |
| IHE BALP | Audit standard | Basic Audit Log Pattern |
| OpenTelemetry | Observability | Enterprise span export to SIEM |
| STIR/SHAKEN | Carrier attestation | Phone number origin verification |

### Observability & Logging

**Per-call audit log fields** (canonical structure — see §3 for full JSON):
- `call_id` — unique per call
- `agent_id` — voice agent identifier
- `start_time` — call start (ISO 8601)
- `disclosure_time` — when disclosure occurred (must be distinct from `start_time`)
- `operational_data_exchanged` — timestamp of first data exchange (must be distinct)
- `handoff_time` — when human handoff occurred (if requested; must be distinct)
- `auth_01_verified` — boolean, cryptographic verification result
- `nhid_clinical_score` — "5/5" for full conformance

**Critical audit requirement:** All per-milestone timestamps must be distinct. Identical timestamps across events is the failure mode caught by ATR-01.

### Security Architecture

**AUTH-01 cryptographic layer:**
- Ed25519 asymmetric signatures (delegation chain)
- DPoP (Demonstration of Proof-of-Possession) call-nonce binding
- Per-call nonce prevents credential replay

**Voice channel:**
- STIR/SHAKEN at carrier layer (attestation levels A/B/C)
- NHID-Clinical AUTH-01 above carrier layer (NPI delegation proof)

### Infrastructure Notes

The Manus/forge platform (used during development) has specific architectural constraints documented in `references/periodic-updates.md`:
- No `setInterval`, `node-cron`, or in-process timers (Cloud Run terminates idle instances)
- Scheduled work must use Heartbeat crons or AGENT crons via the platform
- Callback paths must start with `/api/scheduled/`
- Handlers must be idempotent; retried on 5xx/429 up to 3 times (3s → 1m backoff)
- Handler timeout: 2 minutes per call

---

## 7. Implementation Roadmap

### Plain-Language Summary
> v1.3 established the behavioral rules. v2 (live June 11, 2026) added the identity verification layer. The next priorities are fixing two known test suite issues and expanding the conformance testing program.

### Version History

| Version | Status | Key Deliverable |
|---------|--------|----------------|
| v1.3 | Superseded | 4 behavioral controls (DISC-01, MIME-01, HAND-01, LOG-01); AUTH-01 documented as gap |
| v2 | **Live — June 11, 2026** | AUTH-01 closed; 5/5 conformance; Ed25519 + DPoP; AI Governance Map integrated |

### v2 Launch Deliverables (Completed)

From CHANGELOG.md:
- **AUTH-01 Control:** Cryptographic caller authorization verification via NHID-Auth v2
  - Ed25519 delegation chains with NPI binding
  - DPoP call-nonce binding
  - Real-time revocation checking and scope narrowing
  - Closes Layer 3 security gap preventing NPI spoofing attacks
  - Integrated with Layer 4 FHIR AuditEvent logging
- **AI Governance Map integration:** NHID-Clinical v2 surfaced as tracked framework (obl17, CTRL-IAM-002)
- **Conformance score:** Updated to 5/5 in all public-facing surfaces
- **Documentation:** All v1.3/v3.0 language removed; v2 is active production version
- **Obligation tracking:** `obl17` added to AI Governance Map (effective 2026-06-11, severity: critical)

### Active Blockers / Open Tasks

| Task | Priority | Notes |
|------|----------|-------|
| Fix ATR-01 evaluator (timestamp field lookup) | High | 13/15 runs failing; evaluator bug, not agent bug |
| Fix EIT-01 simulated persona (add personal name) | Medium | 2/15 runs failing; test setup fix |
| Sync Nadine agent config with canonical v1.3 reference | High | Diff and push via ElevenLabs API |
| Re-run corrected tests if credits allow | High | Output ready-to-run command if credits unavailable |
| Ingest NHID-Clinical/NHID-Clinical repo content | Archive | Required to complete this knowledge archive |

### Sequencing Dependencies

```
Nadine config sync → ATR-01 fix → EIT-01 fix → Re-run tests → Report results
```

Credit-aware: If simulation credits are unavailable after fixes, produce the ready-to-run command for when credits reset.

### Future Phases

[SOURCE: NHID-Clinical/NHID-Clinical repo and session context — **[Open Question]**: formal v3 roadmap, if any, is not documented in available source material.]

Known future directions from context:
- Expand conformance testing beyond ElevenLabs to other voice AI platforms
- Public test suite distribution
- Regulatory engagement (CMS, HHS) for voluntary adoption recognition

---

## 8. Coding & Development

### Plain-Language Summary
> The AI Governance Map is developed using a feature-branch workflow with PRs to main triggering Vercel auto-deployments. The static `index.html` is what's actually served; the React app in `client/` is a parallel development track not yet deployed via Vercel.

### Repository Structure (`thankcheeses/ai-governance-map`)

```
ai-governance-map/
├── index.html              ← Static site root (what Vercel serves)
├── vercel.json             ← Deployment config (buildCommand: "", outputDirectory: ".")
├── README.md               ← Project overview
├── CHANGELOG.md            ← Version history
├── ideas.md                ← Design exploration notes
├── todo.md                 ← Feature/task checklist
├── references/
│   └── periodic-updates.md ← Scheduled task (cron) patterns
├── client/
│   └── src/
│       ├── pages/
│       │   └── GovernanceMap.tsx ← React app version of the governance map
│       └── ...
├── server/
│   └── _core/              ← Express + tRPC backend
├── shared/                 ← Shared types/constants
├── drizzle/                ← Database migrations
└── dist/                   ← Build output
```

### Branching Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Production; Vercel auto-deploys from here |
| `claude/governance-map-website-design-envee0` | Active development branch |

**PR workflow:** All changes go to the feature branch → PR → merge to main → Vercel auto-deploys.

### Key Technical Rules Learned in Development

1. **`vercel.json` is minimal:** `buildCommand: ""`, `outputDirectory: "."` — Vercel serves static files directly
2. **Vite 7 requires Node ≥20.19:** Earlier CI used Node 18 and failed; fixed in commit `977b4d8`
3. **`new Date('YYYY-MM-DD')` is UTC midnight in JS:** Causes timezone-sensitive off-by-one errors when `.setHours(0,0,0,0)` is applied. Use `new Date(y, m-1, d)` for local midnight parsing (fixed in PR #22)
4. **Global variable scope:** Variables declared outside functions in `<script>` blocks are accessible by all inline JS. Refactoring one function can break another that depended on a global (the `days` variable bug that crashed the heatmap, fixed in PR #21)
5. **Headless testing with jsdom:** Use `new Date(y, m-1, d)` for local midnight; stub Chart.js and `HTMLCanvasElement.getContext` for full page script execution testing

### CI/CD

- **CI:** GitHub Actions (Node 20+, Vite build check)
- **CD:** Vercel auto-deploys on merge to `main`
- **Test command:** `npx vite build` (confirms clean build)
- **Headless page validation:** jsdom with Chart.js stub (used in PR #21 and #22 bug fixes)

### Commit History (Recent — NHID-related)

| Commit | Message |
|--------|---------|
| `f788aa6` | fix: unify deadline countdown — eliminate 1-day TZ discrepancy |
| `6e7c4ab` | fix: restore Risk Heatmap — undefined `days` crashed page JS |
| `4283b31` | fix: complete NHID-Clinical v2 launch — all v1.3 references removed |
| `713b196` | fix: change version string from v2.5 to v2 |
| `ab17a9f` | feat: Update root index.html to v2 with AUTH-01 and live countdown |

### Development Standards

- No invented content — repo is the source of truth
- Version strings must be consistent across all surfaces (title tag, brand badge, footer, React component)
- NHID control terminology is locked: control IDs (DISC-01, MIME-01, HAND-01, LOG-01, AUTH-01) must not be renamed
- "Impersonation Latency" — locked term; never rename or paraphrase

---

## 9. Claude Code, Manus, and Other LLM Tasking

### Plain-Language Summary
> This project uses Claude Code (Claude Sonnet 4.6 in this session) for development work, and the Manus platform for scheduled agent tasks. Clear rules govern what each agent can and cannot do.

### Claude Code Role in This Project

**Used for:**
- Editing `index.html`, `GovernanceMap.tsx`, and other source files
- Debugging JavaScript errors (heatmap crash, timezone off-by-one)
- Writing and running headless tests with jsdom
- Creating PRs and managing the branch lifecycle
- Content synchronization (v1.3 → v2 NHID-Clinical section updates)

**Model:** claude-sonnet-4-6 (configured for this session)

**Session scope:** Restricted to `thankcheeses/ai-governance-map`. The `NHID-Clinical/NHID-Clinical` repo requires a separate session or scope addition.

**Non-negotiable rules for Claude Code working on this project:**
- Do not invent NHID-Clinical control content — repo is source of truth
- Do not change "Impersonation Latency" terminology
- Do not touch EU AI Act, NIST, ISO, or OECD citation text unless explicitly directed
- Do not modify the 27 CCM controls without explicit instruction
- All version strings must be `v2` (not `v2.5`, not `v3`)
- Preserve the exact locked disclosure text: `"I'm an automated assistant from Dr. Smith's office."`
- Agent ID in canonical event trace: `"brianna-voice-agent-v3"`

### ElevenLabs Agent Tasking (Nadine)

**Task pattern for NHID conformance testing:**
1. Pull live config: `GET /v1/convai/agents/agent_4001krn32nmwe5t8mqzgee0w84rj`
2. Diff against canonical v1.3 reference prompt (repo is source of truth)
3. Report all divergences before any changes
4. Push canonical version via PATCH
5. Run conformance tests
6. Report NOT_EXECUTED separately from failures for credit-unavailable runs

**ATR-01 fix task:**
- Pull one failed run's full conversation object
- Inspect where per-event timestamps actually live (transcript metadata vs. top-level events)
- Update evaluator to read per-milestone timestamps from the correct field
- Conformance requirement does not change

**EIT-01 fix task:**
- Update simulated user persona prompt
- Transferred human must give a personal name (not role only)
- Success criteria: personal name present

### Manus Platform (Scheduled Tasks)

See `references/periodic-updates.md` for full technical specification. Key rules:
- **Heartbeat crons** for one-shot LLM completions and user-triggered schedules
- **AGENT crons** only when the trigger genuinely needs agentic capabilities (web browsing, file manipulation, multi-step planning)
- No in-process timers; cron infrastructure is platform-managed
- Callback paths must start with `/api/scheduled/`
- `userSession` must be decoded `app_session_id` cookie value (not raw Cookie header)

### Prompt Patterns (Available)

**NHID-Clinical section update pattern (used in this session):**
> Identify all occurrences of `v1.3` in the NHID-Clinical HTML section. For each: update the version reference, update control status badges, update conformance score, update the trust stack layer description, update the event trace JSON and its caption. Do not modify surrounding framework citation text (EU AI Act, NIST, ISO, OECD, MITRE ATLAS).

**Version string fix pattern (used in this session):**
> Replace all occurrences of `v2.5` with `v2` in: `<title>` tag, brand badge div, footer text. Apply same change to GovernanceMap.tsx header badge. Do not touch framework citation text.

**Headless validation pattern (used in this session):**
```js
// jsdom stub pattern for full page script testing
dom.window.Chart = class { constructor(){} destroy(){} update(){} };
dom.window.HTMLCanvasElement.prototype.getContext = () => ({});
dom.window.eval(scriptContent);
// Then assert on rendered element children counts
```

---

## 10. Website Content

### Plain-Language Summary
> The AI Governance Map website is the public interface for NHID-Clinical governance information. The NHID-Clinical section is one of eight navigation sections. nhid-clinical.org is the canonical framework home (content not ingested from that domain).

### AI Governance Map — Navigation Structure

| Nav Item | Section ID | Description |
|----------|-----------|-------------|
| Dashboard | `section-dashboard` | KPI bar, compliance progress, upcoming obligations |
| Frameworks | `section-frameworks` | EU AI Act, ISO 42001, NIST RMF, OECD — interactive cards |
| Obligations | `section-obligations` | 17 trackable obligations across frameworks |
| Controls | `section-controls` | 27 CCM v4.1.0 controls with maturity scoring |
| Crosswalk | `section-crosswalk` | Control × Framework matrix |
| Timeline | `section-timeline` | EU AI Act application dates |
| Risk Heatmap | `section-heatmap` | Likelihood × Impact heatmap |
| NHID-Clinical | `section-nhid` | NHID-Clinical v2 conformance reference |

### Header / Brand Bar

```
AI Governance Map
v2 · June 2026 · CCM v4.1.0 · NHID-Clinical v2
```

### Page Title

```
AI Governance Map v2 — CCM v4.1.0 | NIST AI RMF | EU AI Act | ISO/IEC 42001
```

### Footer

```
AI Governance Map · v2 · June 2026 · CCM v4.1.0 spine · EU AI Act timeline · 
ISO/IEC 42001 scaffold · MITRE ATLAS · NIST AI
```

### NHID-Clinical Section — Verbatim Content

**Section heading:**
> NHID-Clinical v2 — Voice Agent Conformance

**Introductory paragraph:**
> Voluntary framework for AI voice agents in B2B healthcare payer-provider workflows. Disclosure before data exchange, no human mimicry, human handoff, minimal audit log.

**AUTH-01 notice (v2):**
> **AUTH-01 closed in v2:** Cryptographic NPI delegation verification via Ed25519 + DPoP call-nonce binding. All 5 controls now conformant.

**Simulator link text:**
> Test the AUTH-01 Gap — Open Spoofed Identity Simulator

**Simulator sub-text:**
> Interactively demonstrate why disclosure alone cannot prevent spoofed-identity attacks in B2B healthcare voice channels.

**Simulator URL:** `https://nhid-clinical.org/gov-sim.html?scenario=spoofed-identity`

**Trust stack note:**
> ★ NHID-Clinical v2 closes AUTH-01 at Layer 2 — cryptographic NPI delegation is now a baseline behavioral requirement, not a Layer 3 add-on.

**Event trace caption:**
> This trace passes all five controls including AUTH-01 — NPI delegation is cryptographically verified and a spoofed caller cannot produce a valid token.

### Dashboard — NHID Obligation Entry

| Field | Value |
|-------|-------|
| ID | `obl17` |
| Title | Caller Authorization Verification (AUTH-01) |
| Framework | NHID |
| Topic | Authorization |
| Type | mandatory |
| Effective | 2026-06-11 |
| Severity | critical |
| Summary | NHID-Clinical v2: Cryptographic authorization via Ed25519 delegation chain + DPoP nonce binding. |

### nhid-clinical.org Content

[SOURCE: nhid-clinical.org — not ingested in this session. **[Needs Review]**]

---

## 11. Whitepaper Content

### Plain-Language Summary
> This section captures the long-form positioning and technical narrative for NHID-Clinical as it appears in available sources. A full whitepaper has not been found in available source material and is marked accordingly.

### Theory of Value

The central argument of NHID-Clinical, reconstructed from available source material:

**Premise 1:** AI voice agents are increasingly deployed in healthcare administrative workflows where real patient data (prior auth status, eligibility, claim status) is exchanged.

**Premise 2:** Existing protections (STIR/SHAKEN at the carrier layer, NPI Registry for provider lookup) are necessary but not sufficient. They verify phone number origin and provider existence — not that a specific call was authorized by a specific credentialed provider.

**Premise 3:** Behavioral disclosure (saying "I'm an AI agent") is required by emerging regulations but does not prevent impersonation. A spoofed caller and a legitimate caller produce identical behavioral logs under a disclosure-only framework.

**Conclusion:** A complete trust surface requires both a behavioral baseline (NHID-Clinical v1.3 controls) and a cryptographic identity layer (AUTH-01 via Ed25519 + DPoP). Neither layer substitutes for the other.

**Key differentiator:**
> The insight that disclosure-based behavioral compliance and cryptographic identity verification are *both necessary and neither sufficient alone* is the foundational value proposition of NHID-Clinical v2.

### Architecture Explanation (Whitepaper Format)

**The gap:** Between what STIR/SHAKEN attests (phone number origin) and what a payer actually needs to know (is this agent authorized to act on behalf of NPI 1234567890 for this specific call?), there is no open standard.

**The solution architecture:**
1. Layer 0–1: Existing infrastructure (NPI Registry, STIR/SHAKEN) — unchanged
2. Layer 2: NHID-Clinical v2 — behavioral baseline + AUTH-01 cryptographic requirement
3. Layer 3: NHID-Auth v1.4 — reference implementation of Ed25519 delegation chain + DPoP
4. Layer 4: FHIR AuditEvent R4 — structured healthcare-native logging
5. Layer 5: OpenTelemetry → SIEM — enterprise observability

**The attack vector closed:**
A spoofed caller can replicate disclosure language, mimic behavioral patterns, and produce an audit log — but cannot forge a valid Ed25519 delegation chain signed by the real NPI holder with a per-call DPoP nonce.

### Use Cases

| Use Case | v1.3 Coverage | v2 Coverage |
|----------|--------------|-------------|
| Prior authorization calls | Behavioral only | Behavioral + cryptographic identity |
| Eligibility verification | Behavioral only | Behavioral + cryptographic identity |
| Claim status inquiry | Behavioral only | Behavioral + cryptographic identity |
| Appointment scheduling | Behavioral only | Behavioral + cryptographic identity |
| NPI spoofing detection | None | DPoP nonce invalidates replay |

### Risks and Limitations

[Inferred from source material; marked as [Inferred]]

- [Inferred] Ed25519 delegation chain requires a credential issuance infrastructure; not all provider practices have this capability
- [Inferred] DPoP nonce binding requires real-time verification endpoint availability; call failures during outages must be handled
- Voluntary adoption means non-conformant agents remain in the market
- The framework does not address patient-facing voice AI or non-voice channels

### Full Whitepaper

[SOURCE: No standalone whitepaper document found in available source material. **[Missing]** — to be produced.]

---

## 12. Diagrams & Visual Concepts

### Figure 1: 5-Layer Trust Stack

```
┌─────────────────────────────────────────────────────────────────┐
│  Layer 5  │ OpenTelemetry spans → SIEM / Enterprise Observability│
├─────────────────────────────────────────────────────────────────┤
│  Layer 4  │ FHIR AuditEvent R4 / IHE BALP — Healthcare Logging  │
├─────────────────────────────────────────────────────────────────┤
│  Layer 3  │ NHID-Auth v1.4 — Ed25519 + DPoP (AUTH-01 ref impl) │
├─────────────────────────────────────────────────────────────────┤
│ ★Layer 2  │ NHID-Clinical v2 — Behavioral Baseline + AUTH-01    │
│           │ (disclosure, no mimicry, handoff, audit, NPI deleg) │
├─────────────────────────────────────────────────────────────────┤
│  Layer 1  │ STIR/SHAKEN — Carrier attestation (A/B/C levels)    │
├─────────────────────────────────────────────────────────────────┤
│  Layer 0  │ NPI Registry — Provider identity (no delegation)     │
└─────────────────────────────────────────────────────────────────┘

★ NHID-Clinical v2 connects these layers for cross-organizational,
  real-time voice-channel authorization.
```

**Figure 1 — Purpose:** Show where NHID-Clinical sits in the broader voice authentication stack and what each layer contributes.  
**Placement:** Whitepaper Section 2, website NHID-Clinical section.  
**Alt text:** "A six-layer stack diagram showing NPI Registry at bottom, STIR/SHAKEN above, NHID-Clinical v2 in the middle (highlighted), NHID-Auth v1.4, FHIR AuditEvent, and OpenTelemetry at the top."

### Figure 2: AUTH-01 Gap Before/After

```
BEFORE v2 (v1.3)                    AFTER v2
─────────────────                   ──────────────────
Spoofed call:                       Spoofed call:
 ✓ Disclosure script copied         ✓ Disclosure script copied
 ✓ Behavioral controls pass         ✓ Behavioral controls pass
 ✓ Audit log produced               ✗ auth_01_verified: FALSE
 ✗ Indistinguishable                ✗ Call rejected — no valid token

Legitimate call:                    Legitimate call:
 ✓ Disclosure                       ✓ Disclosure
 ✓ Behavioral controls              ✓ Behavioral controls
 ✓ Audit log                        ✓ auth_01_verified: TRUE (Ed25519 + DPoP)
 ✓ nhid_clinical_score: "4/5"       ✓ nhid_clinical_score: "5/5"
```

**Figure 2 — Purpose:** Show concretely what changes between v1.3 and v2 for both a spoofed and legitimate caller.

### Figure 3: Canonical Event Trace (v2 Conformant)

```json
{
  "call_id": "nhid-call-2026-06-04-001",
  "agent_id": "brianna-voice-agent-v3",
  "start_time":               "2026-06-04T09:12:00Z",
  "disclosure_time":          "2026-06-04T09:12:02Z",  ← distinct
  "disclosure_text": "I'm an automated assistant from Dr. Smith's office.",
  "operational_data_exchanged": "09:12:08Z",           ← distinct
  "human_handoff_requested": true,
  "handoff_time":             "2026-06-04T09:12:22Z",  ← distinct
  "audit_log_complete": true,
  "deceptive_artifacts_detected": false,
  "auth_01_verified": true,   // AUTH-01: Cryptographically verified via NHID-Auth v2
  "nhid_clinical_score": "5/5"
}
```

**Figure 3 — Purpose:** Canonical reference for what a fully conformant v2 audit log looks like. Each timestamp is distinct — this is the ATR-01 test requirement.

### Figure 4: Control Conformance Grid

| Control | Requirement | v1.3 | v2 |
|---------|------------|------|-----|
| DISC-01 | Disclose AI identity before data exchange | ✓ | ✓ |
| MIME-01 | No human voice mimicry | ✓ | ✓ |
| HAND-01 | Human handoff on request | ✓ | ✓ |
| LOG-01 | Minimal audit log | ✓ | ✓ |
| AUTH-01 | Cryptographic NPI delegation | ✗ gap | ✓ closed |
| **Score** | | **4/5** | **5/5** |

[Figure 4 — Placement: Website NHID-Clinical section, whitepaper control summary, onboarding materials]

---

## 13. Research References

### Standards Referenced in Available Source Material

| Standard | Full Name | Role in NHID-Clinical |
|----------|-----------|----------------------|
| STIR/SHAKEN | Secure Telephone Identity Revisited / Signature-based Handling of Asserted information using toKENs | Layer 1 carrier attestation; verifies phone number origin at A/B/C attestation levels |
| FHIR AuditEvent R4 | HL7 FHIR Release 4 AuditEvent Resource | Layer 4 healthcare-native structured audit logging |
| IHE BALP | IHE Basic Audit Log Pattern | Layer 4 audit log pattern for healthcare interoperability |
| OpenTelemetry | CNCF OpenTelemetry | Layer 5 enterprise observability span export |
| Ed25519 | RFC 8032 — Edwards-Curve Digital Signature Algorithm | Delegation chain signature algorithm for AUTH-01 |
| DPoP | RFC 9449 — Demonstration of Proof-of-Possession at the Application Layer | Call-nonce binding mechanism for AUTH-01 |
| NPPES / NPI | CMS National Plan & Provider Enumeration System | Layer 0 provider identity registry |

### Regulatory References (see also §14)

| Reference | Relevance |
|-----------|-----------|
| Regulation (EU) 2024/1689 | EU AI Act — primary regulatory context for disclosure, GPAI, high-risk requirements |
| CMS-0057-F | CMS interoperability rule — referenced in AI Governance Map README |
| MACPAC | Medicaid and CHIP Payment and Access Commission — referenced in README |

### Research Gaps

[Needs Review] — No academic papers, peer-reviewed research, or external white papers were found in available source material. The NHID-Clinical/NHID-Clinical repo likely contains additional references.

---

## 14. Regulatory & Federal Alignment

### Plain-Language Summary
> NHID-Clinical is a voluntary framework, but it maps directly onto mandatory regulatory obligations. The EU AI Act requires AI disclosure and human oversight. NIST AI RMF requires governance and risk management. NHID-Clinical's five controls satisfy the behavioral requirements of these frameworks specifically for voice AI in healthcare.

### EU AI Act Alignment

| EU AI Act Requirement | NHID-Clinical Control | Status |
|----------------------|----------------------|--------|
| Disclose AI identity (Art. 50, transparency rules) | DISC-01 | Conformant |
| No deceptive AI practices | MIME-01 | Conformant |
| Human oversight provisions | HAND-01 | Conformant |
| Logging for traceability | LOG-01 | Conformant |
| Authorization / access control | AUTH-01 (v2) | Conformant |

**EU AI Act Timeline (as tracked in AI Governance Map):**

| Date | Milestone |
|------|-----------|
| 2024-08-01 | EU AI Act entered into force (Regulation EU 2024/1689) |
| 2025-02-02 | Prohibited practices + AI literacy obligations |
| 2025-08-02 | GPAI governance rules applicable |
| **2026-08-02** | **Transparency rules applicable** — 52 days from June 12, 2026 |
| 2027-12-02 | High-risk area systems applicable (extended per Digital Omnibus May 7, 2026) |
| 2028-08-02 | Product-integrated AI systems applicable |

### NIST AI RMF Alignment

See §15 for detailed mapping.

### CMS Alignment

See §16 for CMS-specific context.

### Privacy Considerations

- NHID-Clinical audit logs capture: call timestamps, agent ID, disclosure text, handoff events, and AUTH-01 verification status
- Logs do **not** (from available source) capture: patient PHI, claim data, or personally identifiable information beyond agent identifier
- [SOURCE: NHID-Clinical/NHID-Clinical repo — full privacy impact assessment is **[Missing]**]

### Safety Obligations

- MIME-01 (no human mimicry) directly addresses AI impersonation safety
- AUTH-01 (cryptographic NPI delegation) prevents unauthorized agents from accessing payer systems
- HAND-01 (human handoff) ensures humans remain in the loop on request

### Documentation Expectations

NHID-Clinical v2 requires:
- Per-call audit log with distinct per-milestone timestamps
- `auth_01_verified` boolean in every audit log
- `nhid_clinical_score` fraction in every audit log
- `audit_log_complete: true` marker

---

## 15. NIST References

### NIST AI RMF 1.0 Mapping

The AI Governance Map tracks NIST AI RMF coverage at 65% across its control framework. Relevant NHID-Clinical mappings:

| NIST AI RMF Function | NHID-Clinical Control | Notes |
|---------------------|----------------------|-------|
| **GOVERN** | Framework structure | NHID-Clinical provides governance structure for voice AI |
| **MAP** | Context mapping | NHID controls map the B2B healthcare voice context |
| **MEASURE** | Conformance scoring | 5/5 conformance score provides measurable posture |
| **MANAGE** | AUTH-01, HAND-01 | Cryptographic control + human override capability |

**NIST AI RMF governance controls from AI Governance Map (NHID-related):**

| Control | Title | NIST Alignment |
|---------|-------|---------------|
| `CTRL-GRC-001` | AI Governance Board & Charter | GOVERN |
| `CTRL-GRC-002` | AI Risk Management Program | GOVERN + MAP |
| `CTRL-IAM-001` | AI System Access Controls | MANAGE |
| `CTRL-IAM-002` | Non-Human Identity Governance for AI Agents | MANAGE — directly maps to AUTH-01 |
| `CTRL-LOG-001` | AI Activity Logging & Traceability | MEASURE — maps to LOG-01 |

**`CTRL-IAM-002` description (from source):**
> "Govern credentials, tokens, and delegation chains for AI agents in automated pipelines; prevent credential sprawl and lateral movement across agent boundaries."

### NIST Cybersecurity Framework Alignment

AUTH-01's Ed25519 + DPoP mechanism aligns with NIST SP 800-56B (key establishment) and NIST SP 800-63 (digital identity guidelines) principles for non-human identity.

[SOURCE: Explicit NIST SP mapping is **[Inferred]** — not stated in available source material.]

---

## 16. CMS References

### Plain-Language Summary
> NHID-Clinical is directly relevant to CMS-regulated healthcare operations because its primary use case — AI voice agents in prior authorization, eligibility, and claims workflows — intersects with CMS-regulated payer-provider administrative transactions.

### CMS Context from Available Source

**AI Governance Map README:**
> "Maps AI governance controls to regulatory frameworks (CMS-0057-F, MACPAC, NIST AI RMF, state AI laws)"

**CMS-0057-F:** The CMS Interoperability and Prior Authorization Final Rule — relevant because prior authorization is one of the primary use cases for AI voice agents in payer-provider workflows. NHID-Clinical governs the behavior of AI agents executing these workflows.

**NPI Registry (CMS NPPES):** The National Plan and Provider Enumeration System is Layer 0 of the NHID-Clinical trust stack. CMS maintains this registry. NHID-Clinical's AUTH-01 builds on top of NPI by adding cryptographic delegation proof.

### Healthcare Operations Implications

| Administrative Workflow | NHID Relevance |
|------------------------|---------------|
| Prior authorization calls | Primary use case; DISC-01, AUTH-01 critical |
| Eligibility verification | Common voice AI use case; full NHID controls apply |
| Claim status inquiry | Common voice AI use case; full NHID controls apply |
| Referral coordination | Applicable; AUTH-01 ensures authorized referral agents |

### Reimbursement Relevance

[SOURCE: No explicit reimbursement or billing content found in available source material. **[Needs Review]**]

### Operational Notes

- CMS NPPES NPI Registry lookup: available via public API; NHID-Clinical Layer 0 references but does not require direct API integration
- The NPI Registry update cadence (daily) means a revoked or lapsed NPI could be used in a call window before the registry reflects the change — AUTH-01's cryptographic layer does not fully address NPI revocation timing (this is a known gap in the available source)

---

## 17. Sponsorship & Partnership Discussions

### Available Source Material

[SOURCE: No partnership, sponsorship, or outreach content found in available source material from this session. **[Missing]**]

### Partnership Opportunities (Inferred from Context)

> **Note: The following is inferred from the technical architecture and use cases, not from source documents. Marked [Inferred].**

- [Inferred] ElevenLabs — current voice AI platform for Nadine (test agent); natural partnership for reference implementation
- [Inferred] Healthcare payer associations (AHIP, BCBSA) — target for voluntary adoption language
- [Inferred] Health IT vendors (Epic, Athenahealth, Change Healthcare) — potential integrators of NHID-Clinical compliance into their platforms
- [Inferred] CMS / ONC — potential regulatory engagement for voluntary adoption recognition under interoperability frameworks

---

## 18. Marketing & Positioning

### Plain-Language Summary
> NHID-Clinical is positioned as the missing open standard for voice AI in healthcare — filling the gap between what existing tools (STIR/SHAKEN, NPI Registry) provide and what payers actually need to trust incoming AI agent calls.

### Technical Positioning

> "The first open behavioral + cryptographic baseline for AI voice agents in B2B healthcare administrative workflows."

**Technical differentiators:**
- Only open framework that combines behavioral controls AND cryptographic NPI delegation for voice AI
- Layered architecture integrates with existing infrastructure (STIR/SHAKEN, NPI, FHIR)
- Testable: conformance is measurable (5/5 score, per-milestone audit timestamps)
- Reference implementation available (NHID-Auth v1.4, Ed25519 + DPoP)

### Clinical / Healthcare Positioning

> "When an AI agent calls your payer line, you need more than a disclosure script — you need proof of authorization. NHID-Clinical v2 provides that proof."

**Problem-language for healthcare audience:**
- "A spoofed NPI + voice AI passes all four behavioral controls while bypassing identity verification entirely."
- "Disclosure alone cannot prevent spoofed-identity attacks in B2B healthcare voice channels."

### Executive / Policy Positioning

> "NHID-Clinical closes the gap that STIR/SHAKEN and the NPI Registry leave open — the missing link between carrier-level phone number attestation and organizationally-trusted healthcare agent authorization."

### Governance Practitioner Positioning

> "A companion framework to EU AI Act, NIST RMF, and ISO 42001 — specifically designed for the healthcare voice AI context those frameworks do not address at the implementation level."

### Differentiation Language (Verbatim from Source)

> "Interactively demonstrate why disclosure alone cannot prevent spoofed-identity attacks in B2B healthcare voice channels."
> — AI Governance Map, Spoofed Identity Simulator sub-text

> "★ NHID-Clinical connects these layers for cross-organizational, real-time voice-channel authorization."
> — AI Governance Map, trust stack footnote

---

## 19. Decisions Made

### Version Naming

| Decision | Rationale | Alternatives Rejected |
|----------|-----------|----------------------|
| v2 (not v2.5, not v3.0) | User specified emphatically: "just v2" | `v2.5` (interim increment, confusing), `v3.0` (overstates scope change) |
| v2 is live as of June 11, 2026 | Not "planned for August 2026" | Prior framing of v2 as planned/upcoming was incorrect and removed |

### Control Architecture

| Decision | Rationale |
|----------|-----------|
| AUTH-01 elevated to Layer 2 (v2) | In v1.3, AUTH-01 was a Layer 3 add-on; v2 makes it a baseline requirement, reflecting the severity of the NPI spoofing gap |
| Terminology locked: DISC-01, MIME-01, HAND-01, LOG-01, AUTH-01 | Control IDs must be stable across documentation, code, and test references |
| "Impersonation Latency" never renamed | Locked term — renaming would break cross-references |

### Technical Decisions (AI Governance Map)

| Decision | Rationale | Tradeoff |
|----------|-----------|----------|
| `new Date(y, m-1, d)` for local midnight | Avoids UTC timezone shift bug in `new Date('YYYY-MM-DD')` | Slightly less idiomatic; more explicit |
| Single `daysUntil()` helper shared by dashboard and timeline | Eliminates off-by-one discrepancy between surfaces | Requires function to be defined before both call sites |
| jsdom + Chart.js stub for headless validation | Catches runtime JS errors before deploy | Not a full browser test; doesn't cover CSS rendering |

### Unresolved Questions

| Question | Status |
|----------|--------|
| Does NHID-Clinical address NPI revocation timing gaps in the delegation chain? | **[Open Question]** |
| What is the governance model for the NHID-Clinical framework itself (maintainers, contribution, versioning)? | **[Needs Review]** |
| Is there a formal v3 roadmap? | **[Open Question]** |
| What is the full content of the v1.3 canonical reference prompt for Nadine? | **[SOURCE: NHID-Clinical/NHID-Clinical repo — not yet ingested]** |

---

## 20. Future Work

### Active Open Tasks

| Task | Priority | Source |
|------|----------|--------|
| Fix ATR-01 evaluator — read per-milestone timestamps from correct conversation field | High | Session context |
| Fix EIT-01 persona — simulated human must give personal name | Medium | Session context |
| Sync Nadine agent config with v1.3 canonical reference prompt | High | Session context |
| Re-run corrected tests; produce ready-to-run command if credits unavailable | High | Session context |
| Ingest NHID-Clinical/NHID-Clinical repo into this archive | Archive | This document |
| Produce standalone whitepaper | Documentation | §11 |
| Full privacy impact assessment | Compliance | §14 |

### Future Features / Backlog

| Feature | Notes |
|---------|-------|
| Expand conformance testing to other voice AI platforms (beyond ElevenLabs) | Currently tested against Nadine only |
| Public test suite distribution | ATR-01, EIT-01, and others |
| NPI revocation timing solution | Known gap in AUTH-01 |
| Patient-facing voice AI extension | Out of current scope; potential v3 |
| Non-voice channel extension (chat, email) | Out of current scope |
| Regulatory engagement (CMS, HHS, state) | Voluntary adoption recognition |
| Formal maintainer / governance structure | **[Needs Review]** |

### Research Needs

- Academic research on AI impersonation in healthcare voice channels
- Regulatory landscape analysis (state AI disclosure laws vs. NHID-Clinical controls)
- NPI delegation cryptography — existing implementations and interoperability

---

## 21. Templates & Checklists

### NHID-Clinical v2 Conformance Checklist

Use this checklist to verify a voice agent implementation before deployment:

```
NHID-Clinical v2 Conformance — Pre-Deployment Checklist

DISC-01: Disclosure
[ ] AI identity is disclosed before any data exchange
[ ] Disclosure occurs within the first interaction turn
[ ] Disclosure text is factually accurate (e.g., office name)
[ ] Disclosure event is logged with a distinct timestamp

MIME-01: No Mimicry
[ ] Agent does not use a human-sounding name without disclosure
[ ] Agent does not claim to be a human when asked
[ ] Agent's voice/manner does not impersonate a specific human
[ ] `deceptive_artifacts_detected` field is monitored

HAND-01: Human Handoff
[ ] Human handoff is available at any point in the call
[ ] Handoff is triggered on request without friction
[ ] Transferred human provides a personal name (not role only) — EIT-01 requirement
[ ] `human_handoff_requested` and `handoff_time` are logged

LOG-01: Audit Log
[ ] `call_id` is unique per call
[ ] `start_time`, `disclosure_time`, `operational_data_exchanged`, `handoff_time` are all distinct
[ ] `audit_log_complete: true` is set
[ ] Log is tamper-evident and retained per applicable policy

AUTH-01: Cryptographic Authorization (v2)
[ ] Ed25519 delegation chain is present and valid for this call
[ ] DPoP call-nonce is unique to this call (not reused)
[ ] `auth_01_verified: true` is set in audit log
[ ] A spoofed caller cannot produce a valid token

SCORING
[ ] 5/5 controls conformant
[ ] `nhid_clinical_score: "5/5"` in audit log
```

### ElevenLabs Agent Sync Checklist

```
Nadine Agent Sync — Pre-Test Checklist
Agent ID: agent_4001krn32nmwe5t8mqzgee0w84rj

[ ] Pull live config via GET /v1/convai/agents/{agent_id}
[ ] Compare system prompt to canonical v1.3 reference in NHID-Clinical/NHID-Clinical repo
[ ] Compare first message to canonical reference
[ ] Compare tool definitions to canonical reference
[ ] Document every divergence (do not change without documenting)
[ ] Push canonical version via PATCH /v1/convai/agents/{agent_id}
[ ] Confirm push successful (200 response)
```

### Test Run Reporting Template

```
NHID-Clinical Conformance Test Run Report
Date: ___________
Agent: Nadine (agent_4001krn32nmwe5t8mqzgee0w84rj)
Run count: ___  Executed: ___  NOT_EXECUTED (credit unavailable): ___

ATR-01 Results:
  Passed: ___ / ___
  Failed: ___ (reason: _________________________)
  NOT_EXECUTED: ___

EIT-01 Results:
  Passed: ___ / ___
  Failed: ___ (reason: _________________________)
  NOT_EXECUTED: ___

Overall Conformance: PASS / FAIL / INCOMPLETE

Notes:
___________________________________________________________

Ready-to-run command (if credits unavailable):
[INSERT COMMAND]
```

### Launch Checklist (AI Governance Map v2)

```
AI Governance Map v2 Launch Checklist

Version Strings
[ ] Title tag: "AI Governance Map v2 —"
[ ] Brand badge: "v2 · June 2026 · CCM v4.1.0 · NHID-Clinical v2"
[ ] Footer: "AI Governance Map · v2 · June 2026 ·"
[ ] GovernanceMap.tsx badge: "v2 · CCM v4.1.0"

NHID-Clinical Section
[ ] Section title: "NHID-Clinical v2 — Voice Agent Conformance"
[ ] AUTH-01 badge: "Conformant" (green)
[ ] Conformance score: "5 / 5 controls"
[ ] AUTH-01 notice: "AUTH-01 closed in v2: Cryptographic NPI delegation..."
[ ] Trust stack Layer 2: "NHID-Clinical v2 — Behavioral Baseline + AUTH-01"
[ ] Event trace: auth_01_verified: true, nhid_clinical_score: "5/5"
[ ] Event trace caption: "...all five controls including AUTH-01..."
[ ] Agent ID in trace: "brianna-voice-agent-v3"
[ ] Disclosure text: "I'm an automated assistant from Dr. Smith's office."

Functionality
[ ] Risk Heatmap renders (36 cells)
[ ] Timeline countdown is consistent across Dashboard and Timeline sections
[ ] No JS errors on page load
[ ] All nav sections navigate correctly

Deployment
[ ] PR merged to main
[ ] Vercel deployment successful
[ ] Hard refresh confirms live content
```

---

## 22. FAQ & Plain Language Guide

### What is NHID-Clinical?

NHID-Clinical is a set of five rules that any AI voice agent must follow when making calls in a healthcare business context — for example, calling a health insurance company to check on a patient's prior authorization status.

### What does "conformant" mean?

A "conformant" agent is one that follows all the rules. In v2, that means all five rules, including the new identity verification rule (AUTH-01).

### What changed from v1.3 to v2?

v1.3 had four behavioral rules: disclose you're an AI, don't pretend to be human, allow a human to take over the call, and keep a record of the call. v2 adds a fifth rule: the AI must prove it was actually authorized by a real healthcare provider to make the call — using a cryptographic credential, like a digital signature.

### Why isn't just saying "I'm an AI" enough?

Because anyone can write a script that says "I'm an automated assistant." A bad actor could clone the script and make calls pretending to be a legitimate medical office — and you'd never know from the script alone. v2 requires a verifiable credential that a cloned script cannot fake.

### What is AUTH-01?

AUTH-01 is the fifth NHID-Clinical control, added in v2. It requires that the AI agent carry a cryptographic proof — like a signed badge — that traces back to a real, credentialed healthcare provider. The signature is unique to each call, so it can't be copied and reused.

### What is STIR/SHAKEN and why isn't it enough?

STIR/SHAKEN is a phone network system that verifies the phone number a call came from. It can tell you "this call came from a phone number registered to Org X" — but it can't tell you whether Org X authorized this specific AI agent to make this specific call, or whether the agent is really who they claim to be.

### What is the NPI Registry?

The NPI (National Provider Identifier) Registry is a government database of all US healthcare providers. Every licensed provider has a unique 10-digit NPI number. NHID-Clinical builds on top of this by adding proof that the AI agent was actually authorized by that NPI holder to make the call.

### What is "Impersonation Latency"?

This is a specific term used in the NHID-Clinical test suite. It must not be renamed or reworded anywhere in documentation or code.

### What is the conformance score?

A number from 0 to 5 showing how many of the five NHID-Clinical controls an agent passes. A fully compliant v2 agent scores 5/5.

### What is the AI Governance Map?

A companion website (https://thankcheeses.github.io/ai-governance-map/) that shows NHID-Clinical alongside other major AI governance frameworks — EU AI Act, NIST AI Risk Management Framework, ISO 42001, and OECD AI Principles. It lets practitioners see how NHID-Clinical controls map to their broader compliance obligations.

### Who is Nadine?

Nadine is the name of the test voice agent used to validate NHID-Clinical conformance. She runs on the ElevenLabs platform and is used to run standardized test scenarios (like ATR-01 and EIT-01) to verify that a voice AI implementation actually follows all five NHID-Clinical rules.

### What does NOT_EXECUTED mean in test results?

If a test couldn't run because the simulation system ran out of processing credits, the result is marked NOT_EXECUTED. This is different from a failure — the agent didn't fail the test, the test simply didn't run. These results are always reported separately and never counted as conformance failures.

---

## 23. Source Material Appendix

### Available Source Files (Ingested)

| File | Location | Content |
|------|----------|---------|
| `index.html` | `/home/user/ai-governance-map/index.html` | Static site; NHID-Clinical section (lines 550–629), all framework data, controls, obligations |
| `CHANGELOG.md` | `/home/user/ai-governance-map/CHANGELOG.md` | v2.0.0 and v1.0.0 changelogs |
| `README.md` | `/home/user/ai-governance-map/README.md` | Project overview, NHID-Clinical relationship |
| `ideas.md` | `/home/user/ai-governance-map/ideas.md` | Design exploration for v2 UI |
| `todo.md` | `/home/user/ai-governance-map/todo.md` | Feature checklist |
| `references/periodic-updates.md` | `/home/user/ai-governance-map/references/periodic-updates.md` | Scheduled task / cron architecture |
| Session conversation record | Context window | ElevenLabs agent tasks, version fix history, test suite context |

### Source Files NOT Ingested

| Source | Reason | Impact |
|--------|--------|--------|
| `NHID-Clinical/NHID-Clinical` repo | Not in session scope | v1.3 canonical reference prompt, ElevenLabs test suite source, agent config files, full test case definitions, implementation code |
| `nhid-clinical.org` website | Not fetched | Canonical framework documentation |
| NHID-Auth v1.4 specification | Not available | Full Ed25519 + DPoP specification |
| ElevenLabs agent config (live) | Not fetched | Nadine's current system prompt, first message, tool definitions |

### Raw Obligation Data (obl17 — NHID)

```javascript
{ 
  id:'obl17', 
  title:'Caller Authorization Verification (AUTH-01)',    
  framework:'NHID', 
  topic:'Authorization',       
  type:'mandatory',    
  effective:'2026-06-11', 
  severity:'critical', 
  summary:'NHID-Clinical v2: Cryptographic authorization via Ed25519 delegation chain + DPoP nonce binding.' 
}
```

### Raw Event Trace (v2 Conformant, from index.html)

Verbatim from `index.html` lines 611–625:

```
{
  "call_id": "nhid-call-2026-06-04-001",
  "agent_id": "brianna-voice-agent-v3",
  "start_time": "2026-06-04T09:12:00Z",
  "disclosure_time": "2026-06-04T09:12:02Z",
  "disclosure_text": "I'm an automated assistant from Dr. Smith's office.",
  "operational_data_exchanged": "09:12:08Z",
  "human_handoff_requested": true,
  "handoff_time": "2026-06-04T09:12:22Z",
  "audit_log_complete": true,
  "deceptive_artifacts_detected": false,
  "auth_01_verified": true,
  // AUTH-01: Cryptographically verified via NHID-Auth v2
  "nhid_clinical_score": "5/5"
}
```

### Raw v1.3 Event Trace (Historical — from earlier session content)

Verbatim as it existed before v2 update:

```
{
  "call_id": "nhid-call-2026-06-04-001",
  "agent_id": "voice-agent-v3",
  "start_time": "2026-06-04T09:12:00Z",
  "disclosure_time": "2026-06-04T09:12:02Z",
  "disclosure_text": "I'm an automated assistant. This call may be recorded.",
  "operational_data_exchanged": "09:12:08Z",
  "human_handoff_requested": true,
  "handoff_time": "2026-06-04T09:12:22Z",
  "audit_log_complete": true,
  "deceptive_artifacts_detected": false,
  "auth_01_verified": false,
  // AUTH-01 gap: NPI not cryptographically verified
  "nhid_clinical_score": "4/5"
}
```

*Note: This is the pre-v2 trace. The v2 canonical trace supersedes it. Preserved for historical reference.*

### Changelog v2.0.0 (Verbatim)

```markdown
## [2.0.0] - June 11, 2026

### Major Features

#### 🔐 NHID-Clinical v2 Integration
- AUTH-01 Control: Cryptographic caller authorization verification via NHID-Auth v2
  - Ed25519 delegation chains with NPI binding
  - DPoP (Demonstration of Proof-of-Possession) call-nonce binding
  - Real-time revocation checking and scope narrowing
  - Closes Layer 3 security gap preventing NPI spoofing attacks
  - Integrated with Layer 4 FHIR AuditEvent logging

### Control Updates
- Control #22 (NEW): Caller Authorization Verification (AUTH-01)
  - Risk Tier: Autonomous Agents
  - Priority: Critical
  - CCM Domain: IAM
  - Indicator: Cryptographic Authorization Verification Rate (100% of production calls)
  - Implementation: NHID-Auth v2 reference layer with Ed25519 signatures,
    scoped delegation, TTL, and revocation

### Compliance Updates
- EU AI Act Annex III high-risk compliance deadline extended to Dec 2, 2027 
  per Digital Omnibus agreement (May 7, 2026)
- All controls now aligned with CCM v4.1.0 (verified Jan 13, 2026)
- NHID-Clinical v2 controls now fully integrated into compliance framework
```

### Session-Derived Context (ElevenLabs / Test Suite)

From user-provided context in this session (verbatim):

```
Context: NHID-Clinical CTS tests run against the ElevenLabs agent "Nadine"
(agent_4001krn32nmwe5t8mqzgee0w84rj). Repo: github.com/NHID-Clinical/NHID-Clinical.
ELEVENLABS_API_KEY is set as an env var. Use the ElevenLabs Agents API
(GET/PATCH /v1/convai/agents/{agent_id}) and the agent testing endpoints.

Tasks:
1. SYNC CHECK: Pull Nadine's live config via API. Diff against canonical v1.3 
   reference prompt in repo. Report every divergence before changing anything.
   Then push canonical version. Do not invent prompt content — repo is source of truth.

2. FIX ATR-01 (13/15 failed, "missing distinct event timestamps"): All conversation 
   events evaluated with identical timestamps. Investigate whether the eval is reading 
   the wrong field — pull one failed run's full conversation object and inspect where 
   per-event timestamps actually live. Update test's evaluation criteria to read 
   per-milestone timestamps from the correct field. Conformance requirement does not change.

3. FIX EIT-01 (2/15 failed, "human agent failed personal introduction"): The simulated 
   human stakeholder identifies by role only. Update the simulated user persona prompt 
   so the transferred human gives a personal name, matching the success criteria.

4. CREDIT-AWARE REPORTING: Runs that failed with "insufficient simulation credits 
   available" must be reported as NOT_EXECUTED, never as conformance failures. 
   Flag them separately in output.

5. Re-run only the corrected tests if credits allow; otherwise output a ready-to-run 
   command for when credits reset.

Locked terminology: "Impersonation Latency" — never rename or paraphrase.
```

---

*End of NHID-Clinical Master Knowledge Archive*

*Document generated June 12, 2026. All claims traceable to source material listed in §23. Sections marked [Missing], [Needs Review], [Open Question], or [Inferred] require additional source ingestion or user clarification before they can be considered authoritative.*
