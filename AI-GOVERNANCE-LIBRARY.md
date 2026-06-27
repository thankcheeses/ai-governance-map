# AI Governance Library — Framework & Control Reference

**Purpose:** A working *menu* of the AI-governance universe — frameworks, laws, standards, and
control taxonomies — so you can decide exactly what to encode into the AI Governance Map. This is
a **reference companion**, not the app's authoritative dataset.

**Status legend**
- ✅ **In map** — already encoded in `client/src/data/governance.ts`, status independently verified.
- 🟡 **Candidate** — strong fit; **verify legal status / effective date against a primary source
  before encoding** (project data-integrity rule: never encode unverified research as fact).
- ⚪ **Reference** — useful context / cross-walk target; not necessarily a map node.

**Scope recommendation:** keep the *encoded* map curated and verified (healthcare-/voice-AI core);
use this library as the expansion backlog. Grow the map in verified batches, not one big dump.

---

## 0. The "~200 controls" question — resolved

The map's control library is keyed to the **CSA Cloud Controls Matrix (CCM)** domain taxonomy but
currently encodes **27** controls across 16 domains. The figures near "~200" are real and sourceable:

| Control taxonomy | Approx. count | Notes |
|---|---|---|
| **CSA CCM v4** | **197 controls / 17 domains** | The classic cloud control set the map already borrows domains from. |
| **CSA AI Controls Matrix (AICM)** | **~243 control objectives / 18 domains** | CSA's new AI-specific matrix; maps to ISO 42001, NIST AI RMF, EU AI Act, BSI. Best target for an AI-native ~200-control library. |
| **ISO/IEC 42001 Annex A** | 38 controls / 9 objectives | The certifiable AIMS control set. |
| **NIST AI RMF** | 72 subcategories (Govern/Map/Measure/Manage) | Outcome statements, not "controls" per se. |
| **NIST SP 800-53 Rev 5** | 1000+ controls | Superset; the security backbone many AI controls inherit from. |

**To reach a ~200-control map:** adopt the **CSA AICM** as the control spine (AI-native, already
cross-walked to ISO 42001 / NIST AI RMF / EU AI Act), and keep the current 27 as the
"implemented/assessed" subset. I can encode AICM in verified batches by domain.

---

## 1. Global principles & intergovernmental instruments

| Framework | Type | Jurisdiction | Map status |
|---|---|---|---|
| OECD AI Principles (2019, upd. 2024) | Principles (voluntary) | Global/OECD | ✅ In map |
| UNESCO Recommendation on the Ethics of AI (2021) | Ethics standard | Global (193 states) | 🟡 Candidate |
| G7 Hiroshima AI Process + Code of Conduct (2023) | Principles/code | G7 | 🟡 Candidate |
| Bletchley Declaration (2023) / Seoul Declaration (2024) | Safety declaration | Multilateral | ⚪ Reference |
| Council of Europe Framework Convention on AI (2024) | **Binding treaty** | CoE + signatories | 🟡 Candidate |
| UN GA Resolution on AI (2024) | Resolution (non-binding) | UN | ⚪ Reference |

*Use as the "normative lineage" layer — map healthcare/patient-rights controls back to these.*

---

## 2. Management-system & risk frameworks (control schema)

| Framework | Type | Scope | Map status |
|---|---|---|---|
| ISO/IEC 42001:2023 (AI Management System) | Standard (certifiable) | Global | ✅ In map |
| NIST AI RMF 1.0 + GenAI Profile (NIST AI 600-1) | Framework (voluntary) | US/Global | ✅ In map |
| ISO/IEC 23894:2023 (AI risk management) | Standard | Global | 🟡 Candidate |
| ISO/IEC 42005 (AI system impact assessment) | Standard | Global | 🟡 Candidate |
| ISO/IEC 22989 / 23053 (concepts; ML framework) | Standard | Global | ⚪ Reference |
| ISO/IEC 24028 / TR 24027 / TR 24368 (trustworthiness, bias, ethics) | TR/Standard | Global | ⚪ Reference |
| ISO/IEC 5338 (AI system lifecycle) | Standard | Global | ⚪ Reference |
| ISO/IEC 42006 (audit/certification bodies) | Standard | Global | ⚪ Reference |
| Google Secure AI Framework (SAIF) v2 | Vendor framework | Global | 🟡 Candidate |
| NIST CSF 2.0 | Framework | US/Global | ⚪ Reference (cross-walk) |

---

## 3. Security, privacy & assurance backbones (cross-walk targets)

| Framework | Type | Map status |
|---|---|---|
| CSA Cloud Controls Matrix (CCM v4) | Control matrix (197 controls) | ✅ Domains in map (taxonomy) |
| **CSA AI Controls Matrix (AICM)** | AI control matrix (~243 objectives) | 🟡 Candidate (recommended spine) |
| ISO/IEC 27001 / 27002 (infosec) | Standard | ⚪ Reference |
| ISO/IEC 27701 (privacy info mgmt) | Standard | ⚪ Reference |
| SOC 2 (Trust Services Criteria) | Attestation | ⚪ Reference |
| NIST SP 800-53 Rev 5 | Control catalog | ⚪ Reference |
| HIPAA Security Rule (45 CFR §164.312) | **Binding law** (US health) | ✅ In map |
| GDPR | **Binding law** (EU) | 🟡 Candidate |
| OWASP Top 10 for LLM Apps (2025) | Security taxonomy | ✅ In map (w/ ATLAS) |
| MITRE ATLAS | Adversarial-ML matrix | ✅ In map (w/ OWASP) |
| OWASP ML Security Top 10 | Security taxonomy | ⚪ Reference |

---

## 4. Laws & regulations by region

### European Union / Europe
| Law | Status | Map status |
|---|---|---|
| EU AI Act (Reg. (EU) 2024/1689) | Binding, phased to 2027 | ✅ In map |
| GDPR (Reg. (EU) 2016/679) | Binding | 🟡 Candidate |
| Council of Europe AI Convention (2024) | Binding treaty | 🟡 Candidate |
| EU Data Act / DGA, DSA/DMA, DORA, NIS2, AI Liability Dir. | Binding (various) | ⚪ Reference (context) |

### United States — federal
| Instrument | Status | Map status |
|---|---|---|
| FDA AI/ML SaMD framework + PCCP guidance | Regulatory guidance (health) | 🟡 Candidate (healthcare-critical) |
| ONC HTI-1 — Decision Support Intervention transparency | **Binding rule** (health IT) | 🟡 Candidate (healthcare-critical) |
| OMB M-24-10 (federal agency AI use) | Policy | ⚪ Reference |
| Exec. actions on AI (EO 14110 and successors) | Policy — **verify current status** | ⚪ Reference |
| TCPA (robocall/AI-voice consent) | **Binding law** | 🟡 Candidate (voice-AI relevant) |
| FTC Act §5 (AI/UDAP guidance) | Enforcement | ⚪ Reference |

### United States — states
| Law | Status | Map status |
|---|---|---|
| Colorado AI Act (SB 24-205) | Binding | ✅ In map |
| California AI Transparency Act (SB 942) | Binding | ✅ In map |
| California AB 2013 (training-data transparency), SB 1001 (bot disclosure), CPPA ADMT rules | Binding | 🟡 Candidate |
| Illinois HB 3773 (AI in employment) + BIPA | Binding | ✅ In map (HB3773) |
| NYC Local Law 144 (AEDT bias audit) | Binding | ✅ In map |
| Texas TRAIGA (HB 149) | Binding | ✅ In map |
| Utah AI Policy Act (SB 149) | Binding | ✅ In map |
| Tennessee ELVIS Act (voice/likeness) | Binding | 🟡 Candidate (voice-AI relevant) |

### Canada
| Instrument | Status | Map status |
|---|---|---|
| AIDA / Bill C-27 | **Stalled — verify** | ✅ In map (as `none`) |
| Directive on Automated Decision-Making | Binding (federal public sector) | 🟡 Candidate |
| Quebec Law 25 (ADM provisions) | Binding | ⚪ Reference |

### Asia-Pacific
| Instrument | Status | Map status |
|---|---|---|
| China — Generative AI Interim Measures (+2025 labeling) | Binding | ✅ In map |
| China — Algorithm Recommendation / Deep Synthesis provisions | Binding | 🟡 Candidate |
| South Korea — AI Basic Act | Binding (in effect 2026) | ✅ In map |
| India — IT Rules synthetic-media amendment (2026) | Binding | ✅ In map |
| India — DPDP Act 2023 | Binding (data) | ⚪ Reference |
| Singapore — Model AI Governance Framework (+GenAI) | Voluntary | ✅ In map (as `none`) |
| Singapore — AI Verify (testing) + PDPA | Toolkit / binding | 🟡 Candidate |
| Japan — AI Promotion Act (2025) | Soft-law | ✅ In map (as `none`) |
| Australia — AI Ethics Principles; Voluntary AI Safety Standard | Voluntary | 🟡 Candidate |

### Latin America / Middle East / Africa
| Instrument | Status | Map status |
|---|---|---|
| Brazil — PL 2338/2023 (Marco Legal da IA) | In committee — **verify** | ✅ In map (as `none`) |
| Brazil — LGPD | Binding (data) | ⚪ Reference |
| Saudi Arabia — SDAIA AI Ethics Principles | Guidance | 🟡 Candidate |
| UAE — AI policy/charter | Guidance | ⚪ Reference |

---

## 5. Sector-specific — Healthcare & voice AI (priority for NHID-Clinical)

| Framework | Type | Map status |
|---|---|---|
| FDA AI/ML SaMD Action Plan + PCCP | Regulatory guidance | 🟡 Candidate (high value) |
| ONC HTI-1 — DSI algorithm transparency | Binding rule | 🟡 Candidate (high value) |
| WHO — Ethics & Governance of AI for Health; LMM guidance | Guidance | 🟡 Candidate |
| Coalition for Health AI (CHAI) — Responsible AI framework | Consensus framework | 🟡 Candidate |
| HIPAA Security Rule §164.312 | Binding | ✅ In map |
| EU MDR / IVDR (AI as medical device) | Binding (EU) | ⚪ Reference |
| UK MHRA / Australia TGA software-as-medical-device | Regulatory | ⚪ Reference |
| STIR/SHAKEN (call attestation) | Telecom standard | ✅ In map (NHID trust stack L1) |
| TCPA (AI-voice/robocall consent) | Binding law | 🟡 Candidate (voice-AI) |
| FHIR AuditEvent R4 (health audit logging) | Standard | ✅ In map (NHID trust stack L4) |
| **NHID-Clinical v1.3 behavioral baseline + NHID-Auth v2** | Open standard | ✅ In map (trust stack) |

---

## 6. Agentic / LLM / frontier AI

| Framework | Type | Map status |
|---|---|---|
| OWASP Top 10 for LLM Apps (2025) | Security taxonomy | ✅ In map |
| Google SAIF v2 (agent risk maps) | Vendor framework | 🟡 Candidate |
| OpenAI — practices for safe agentic AI (7 practices) | Best practice | 🟡 Candidate |
| Anthropic Responsible Scaling Policy; DeepMind Frontier Safety Framework | Lab policy | ⚪ Reference |
| CSA MAESTRO (agentic threat modeling) | Methodology | ⚪ Reference |
| NIST GenAI Profile (AI 600-1) | Framework profile | ✅ In map (under NIST) |

---

## 7. Testing, assurance & red-team

| Framework | Type | Map status |
|---|---|---|
| AI Verify (Singapore IMDA) | Testing toolkit | 🟡 Candidate |
| MITRE ATLAS | Adversarial matrix | ✅ In map |
| NIST ARIA / US CAISI & UK AISI evaluations | Eval programs | ⚪ Reference |
| OWASP LLM red-team guidance | Methodology | ⚪ Reference |

---

## 8. Capability / maturity / meta-governance

| Framework | Type | Map status |
|---|---|---|
| CSA AICM maturity mapping | Maturity model | 🟡 Candidate |
| TraceGov TRACE protocol/scoring | Scoring (EU-native) | ⚪ Reference |
| AI maturity models (various) | Maturity | ⚪ Reference |
| MATURITY_LEVELS (0 None → 5 Optimized) | In-app maturity scale | ✅ In map |

---

## 9. Aggregator libraries (treat as external "source" nodes, not facts)

These directories already track dozens-to-hundreds of frameworks; use them as **seed/verification
sources**, not as encoded data. *(Counts are as the directories advertise them — verify before
citing in-product.)*

- VerifyWise AI Governance Library — broad resource directory incl. agentic/LLM section
- Apparens AI Governance Framework Library — frameworks arranged on a red-team lifecycle
- Trusenta AI Governance Frameworks Library — curated key frameworks with summaries
- TraceGov Governance Library — regulatory frameworks with a cross-framework knowledge graph
- AI Governance Institute directory / MindXO navigator — directory-style trackers

---

## 10. Recommended path for the map

1. **Adopt CSA AICM as the control spine** → gets you to a real ~240-objective library, AI-native,
   already cross-walked to ISO 42001 / NIST AI RMF / EU AI Act. Keep the current 27 as the
   "assessed/implemented" subset so the posture score still means something.
2. **Encode the 🟡 healthcare/voice batch first** (highest NHID value): FDA SaMD/PCCP, ONC HTI-1,
   WHO health-AI, CHAI, TCPA, Tennessee ELVIS — each verified against a primary source.
3. **Add GDPR + Council of Europe Convention + UNESCO** as the EU/global normative layer.
4. **Leave aggregator libraries as external links**, not encoded nodes.

**Verification rule for every new map node:** confirm current legal status + effective date against
the primary/official source (or ≥2 reputable trackers) before it goes into `governance.ts`. Tag
`binding` vs `none` honestly; never guess.

---

*Companion to `AI-GOVERNANCE-MAP-MASTER-ARCHIVE.md`. Nothing in this file is encoded into the app
until independently verified.*
