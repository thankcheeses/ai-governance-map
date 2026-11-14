// Canonical data layer for the AI Governance Map.
// Frameworks/obligations/timeline/heatmap/NHID content ported from the
// original static index.html; control definitions ported from the richer
// complianceData previously embedded in pages/GovernanceMap.tsx, merged with
// the status/automation fields from index.html's controls list (zipped by
// CCM domain order — both lists share the same 27-control sequence).

export interface Framework {
  slug: string;
  shortCode: 'EU' | 'ISO' | 'NIST' | 'CAISSI' | 'OECD' | 'SG' | 'OWASP' | 'CO' | 'HIPAA' | 'CA' | 'IL' | 'NY' | 'TX' | 'UT' | 'KR' | 'CN' | 'IN' | 'GDPR' | 'COE' | 'UNESCO' | 'FDA' | 'ONC' | 'WHO' | 'CHAI' | 'TCPA' | 'TN' | 'TFAIA' | 'AICM' | 'IEEE' | 'VN' | 'NHID';
  name: string;
  type: string;
  jurisdiction: string;
  version: string;
  coverage: number;
  summary: string;
}

export const FRAMEWORKS: Framework[] = [
  {
    slug: 'eu-ai-act', shortCode: 'EU', name: 'EU Artificial Intelligence Act',
    type: 'Regulation (Binding)', jurisdiction: 'EU', version: 'Regulation (EU) 2024/1689', coverage: 72,
    summary: 'Risk-based legal framework. Prohibited practices from Feb 2025 and GPAI rules from Aug 2025 are in force. Article 50 transparency has applied since 2 Aug 2026. Annex III high-risk application was deferred to 2 Dec 2027, and product-integrated high-risk to 2 Aug 2028, by Regulation (EU) 2026/1744.',
  },
  {
    slug: 'iso-iec-42001', shortCode: 'ISO', name: 'ISO/IEC 42001:2023',
    type: 'Standard (Voluntary)', jurisdiction: 'Global', version: '2023 Edition', coverage: 58,
    summary: 'AI management system standard — Clauses 4-10 cover context, leadership, planning, support, operation, evaluation, improvement.',
  },
  {
    slug: 'nist-ai-rmf', shortCode: 'NIST', name: 'NIST AI RMF 1.0',
    type: 'Framework (Voluntary)', jurisdiction: 'US / Global', version: '1.0 (Jan 2023)', coverage: 65,
    summary: 'Four-function risk framework: Govern · Map · Measure · Manage. Lifecycle-oriented and iterative.',
  },
  {
    slug: 'si-incident-key-practices', shortCode: 'CAISSI', name: 'Key Practices for Incident Readiness and Response in Super Intelligence Training and Evaluation',
    type: 'Joint Agency Guidance (Voluntary)', jurisdiction: 'US / Global', version: 'PP-26-4396 · Ver 1.0 (16 Oct 2026)', coverage: 0,
    summary: 'Ten voluntary practices for managing "SI control incidents" — occurrences in which one or more agents take significant uninstructed actions that compromise the policies, controls or security measures an operator imposed to scope the task or keep human oversight. Published jointly by NIST CAISSI, NSA SISC and CISA and organised into five lifecycle stages (prepare, detect, respond, recover, report), with explicit NIST CSF 2.0 subcategory references throughout. Aimed at organisations training or evaluating highly capable agents on long-horizon tasks with limited supervision. Voluntary guidance only: it creates no legal obligation and carries its own disclaimer of endorsement. Coverage reads 0% because none of the 27 CCM controls in this register cites it yet — the practices govern incident management during training and evaluation, not CCM control domains.',
  },
  {
    slug: 'oecd-ai-principles', shortCode: 'OECD', name: 'OECD AI Principles',
    type: 'Principles (Voluntary)', jurisdiction: 'Global', version: '2019 / Updated 2024', coverage: 50,
    summary: '5 values-based principles + 5 policy recommendations. Human rights, transparency, robustness, accountability.',
  },
  {
    slug: 'singapore-model-ai-gov', shortCode: 'SG', name: 'Singapore Model AI Governance Framework',
    type: 'Framework (Voluntary)', jurisdiction: 'Singapore', version: 'Gen AI Framework, 2nd Ed. (2024)', coverage: 40,
    summary: 'IMDA/AIVerify guidance for traditional and generative AI — testing & assurance, content provenance, incident reporting, security.',
  },
  {
    slug: 'owasp-atlas', shortCode: 'OWASP', name: 'OWASP Top 10 for LLM Apps / MITRE ATLAS',
    type: 'Security Framework (Voluntary)', jurisdiction: 'Global', version: 'OWASP LLM 2025 · ATLAS v4', coverage: 45,
    summary: 'Application-security taxonomy for LLM-specific risks (prompt injection, insecure output handling) paired with MITRE ATLAS adversarial ML tactics/techniques.',
  },
  {
    slug: 'colorado-ai-act', shortCode: 'CO', name: 'Colorado AI Act (SB 26-189)',
    type: 'Regulation (Binding)', jurisdiction: 'Colorado, USA', version: 'SB 26-189 (repeals & replaces SB 24-205)', coverage: 35,
    summary: 'Enacted 14 May 2026, repealing and replacing SB 24-205 before that Act became operative. The operative regime is now a narrower ADMT (automated decision-making technology) transparency framework rather than the original high-risk / algorithmic-discrimination risk-management model. Substantive obligations begin 1 January 2027.',
  },
  {
    slug: 'hipaa-security-rule', shortCode: 'HIPAA', name: 'HIPAA Security Rule',
    type: 'Regulation (Binding)', jurisdiction: 'US', version: '45 CFR §164.312 (Technical Safeguards)', coverage: 30,
    summary: 'Binding US healthcare privacy law. Scoped here to the Technical Safeguards — access control, audit controls, integrity, authentication, and transmission security for systems that touch ePHI.',
  },
  {
    slug: 'california-ai-transparency-act', shortCode: 'CA', name: 'California AI Transparency Act (SB 942, as amended by SB 1000)',
    type: 'Regulation (Binding)', jurisdiction: 'California, USA', version: 'SB 942, as amended by SB 1000 (Ch. 861, Stats. 2026)', coverage: 32,
    summary: 'State-level binding law requiring covered GenAI providers to offer free AI-content detection tools and embed latent/visible disclosures in AI-generated image, video, and audio content. Amended by SB 1000, chaptered 30 September 2026 as Chapter 861, Statutes of 2026, which carried an urgency clause and so took effect immediately. SB 1000 amends Business and Professions Code sections 22757.1 to 22757.5 and adds section 22757.4.1; the substance of those amendments has not been read against the chaptered text, so treat the detail of the current duties as unverified here and read the code sections.',
  },
  {
    slug: 'california-tfaia', shortCode: 'TFAIA', name: 'California Transparency in Frontier Artificial Intelligence Act (SB 53)',
    type: 'Regulation (Binding)', jurisdiction: 'California, USA', version: 'Ch. 138, Stats. 2025 — BPC ch. 25.1 (§22757.10 et seq.)', coverage: 30,
    summary: 'Binding California statute for large developers of frontier AI models. Chaptered 29 September 2025 as Chapter 138, Statutes of 2025, adding Chapter 25.1 to the Business and Professions Code (sections 22757.10 to 22757.16), Government Code section 11546.8, and Chapter 5.1 to Part 3 of Division 2 of the Labor Code (section 1107). The bill carried no urgency clause, so California\u2019s default operative date applies and it has been in force since 1 January 2026. Scope is frontier-model developers above a size threshold \u2014 transparency and safety-framework publication, incident reporting, and whistleblower protection \u2014 and it is separate from the SB 942 content-marking regime above.',
  },
  {
    slug: 'illinois-hb3773', shortCode: 'IL', name: 'Illinois HB 3773 (AI in Employment)',
    type: 'Regulation (Binding)', jurisdiction: 'Illinois, USA', version: 'HB 3773 (amends Human Rights Act)', coverage: 28,
    summary: 'State-level binding law restricting employer use of AI in employment decisions where it has a discriminatory effect, and requiring notice when AI is used for that purpose.',
  },
  {
    slug: 'nyc-local-law-144', shortCode: 'NY', name: 'NYC Local Law 144 (Automated Employment Decision Tools)',
    type: 'Regulation (Binding)', jurisdiction: 'New York City, USA', version: 'Local Law 144 of 2021', coverage: 30,
    summary: 'Binding municipal law requiring an independent bias audit of automated employment decision tools within one year before use, public posting of audit results, and advance candidate notice.',
  },
  {
    slug: 'texas-traiga', shortCode: 'TX', name: 'Texas Responsible AI Governance Act (TRAIGA)',
    type: 'Regulation (Binding)', jurisdiction: 'Texas, USA', version: 'TRAIGA (HB 149)', coverage: 27,
    summary: 'State-level binding law prohibiting specified harmful AI uses (e.g. manipulation, unlawful discrimination) and imposing disclosure duties on state agencies and certain AI developers/deployers.',
  },
  {
    slug: 'utah-ai-policy-act', shortCode: 'UT', name: 'Utah Artificial Intelligence Policy Act',
    type: 'Regulation (Binding)', jurisdiction: 'Utah, USA', version: 'S.B. 149', coverage: 25,
    summary: 'State-level binding law requiring clear disclosure when generative AI is used in consumer interactions involving regulated professions, with disclosure obligations triggered upon consumer request or proactively in high-risk contexts.',
  },
  {
    slug: 'korea-ai-basic-act', shortCode: 'KR', name: 'South Korea AI Basic Act',
    type: 'Regulation (Binding)', jurisdiction: 'South Korea', version: 'In effect Jan 22, 2026', coverage: 24,
    summary: 'Binding national law requiring disclosure for high-impact and generative AI, risk management and human-oversight duties for high-impact AI operators, and a domestic-representative requirement for large foreign providers. A grace period defers most enforcement and fines through 2026 except for serious harms.',
  },
  {
    slug: 'china-genai-interim-measures', shortCode: 'CN', name: 'China Generative AI Services Interim Measures',
    type: 'Regulation (Binding)', jurisdiction: 'China', version: 'Effective Aug 15, 2023 (2025 labeling & standards additions)', coverage: 26,
    summary: 'Binding national rules for public-facing generative AI services: algorithm registration and security assessment with the Cyberspace Administration of China, content governance, and — from Sept 1, 2025 — mandatory AI-generated content labeling.',
  },
  {
    slug: 'india-it-rules-synthetic-media', shortCode: 'IN', name: 'India IT Rules Amendment, 2026 (Synthetic Media)',
    type: 'Regulation (Binding)', jurisdiction: 'India', version: 'G.S.R. 120(E), in force Feb 20, 2026', coverage: 20,
    summary: 'Binding amendment to the IT Rules 2021 (delegated under the IT Act, 2000) targeting AI-generated/synthetic content: mandatory labelling and provenance metadata, a 3-hour takedown duty for unlabeled synthetic media, and loss of intermediary safe-harbor for noncompliance.',
  },
  // ── International / EU normative layer (verified mid-2026; see docs/AI-GOVERNANCE-LIBRARY.md) ──
  {
    slug: 'gdpr', shortCode: 'GDPR', name: 'General Data Protection Regulation (EU 2016/679)',
    type: 'Regulation (Binding)', jurisdiction: 'EU', version: 'Regulation (EU) 2016/679, applicable 25 May 2018', coverage: 30,
    summary: 'Binding EU data-protection law with AI-relevant provisions: Art 22 restricts solely-automated decisions with legal/significant effects, and Arts 13–15 require meaningful information about the logic and consequences of automated processing. Enforced by DPAs with fines up to €20M or 4% of global turnover.',
  },
  {
    slug: 'coe-ai-convention', shortCode: 'COE', name: 'Council of Europe Framework Convention on AI (CETS 225)',
    type: 'Treaty (Binding)', jurisdiction: 'Council of Europe + signatories', version: 'CETS No. 225, opened for signature 5 Sep 2024; not yet in force', coverage: 18,
    summary: 'First international treaty on AI intended to be legally binding, not yet in force: two of the five ratifications it needs were recorded as of 13 Nov 2026. It requires Parties to ensure AI-lifecycle activities are consistent with human rights, democracy, and the rule of law. As a framework convention it binds ratifying states (implemented via national law) rather than regulating private actors directly.',
  },
  {
    slug: 'unesco-ai-ethics', shortCode: 'UNESCO', name: 'UNESCO Recommendation on the Ethics of AI',
    type: 'Recommendation (Voluntary)', jurisdiction: 'Global', version: 'Adopted 23 Nov 2021 by 193 member states', coverage: 22,
    summary: 'First global standard-setting instrument on AI ethics, adopted by all 193 UNESCO member states. Non-binding; states commit to implementing values (human rights/dignity, transparency, fairness, human oversight, sustainability) via national policy and tools like the Ethical Impact Assessment.',
  },
  // ── Healthcare & voice-AI sector (verified mid-2026; see docs/AI-GOVERNANCE-LIBRARY.md) ──
  {
    slug: 'fda-ai-pccp', shortCode: 'FDA', name: 'FDA AI-Enabled Device Software — PCCP Guidance',
    type: 'Guidance (Non-binding)', jurisdiction: 'US', version: 'Final guidance 3 Dec 2024 (under FD&C Act §515C / FDORA 2022)', coverage: 20,
    summary: 'FDA final guidance on Predetermined Change Control Plans for AI-enabled medical device software: manufacturers can pre-specify and obtain authorization for future model changes. The guidance is non-binding but rests on binding statute (FD&C Act §515C).',
  },
  {
    slug: 'onc-hti-1-dsi', shortCode: 'ONC', name: 'ONC HTI-1 — Decision Support Intervention Transparency',
    type: 'Regulation (Binding)', jurisdiction: 'US', version: '89 FR 1192, effective 11 Mar 2024 (DSI compliance by 1 Jan 2025)', coverage: 25,
    summary: 'Binding HHS/ASTP-ONC rule requiring certified health IT to disclose "source attributes" for Decision Support Interventions — 31 attributes for Predictive DSIs (training data, fairness, validity, intended use) — and to implement intervention risk management practices.',
  },
  {
    slug: 'who-ai-health-lmm', shortCode: 'WHO', name: 'WHO Ethics & Governance of AI for Health (LMM Guidance)',
    type: 'Guidance (Non-binding)', jurisdiction: 'Global', version: 'Released 18 Jan 2024 (extends 2021 report)', coverage: 18,
    summary: 'Voluntary WHO guidance on large multi-modal models in health: identifies five health application areas and associated risks, with 40+ recommendations to governments, developers, and providers. No legal force.',
  },
  {
    slug: 'chai-assurance', shortCode: 'CHAI', name: 'Coalition for Health AI (CHAI) Assurance Standards',
    type: 'Framework (Voluntary)', jurisdiction: 'US', version: 'Assurance Standards Guide v1.0, 26 Jun 2024', coverage: 20,
    summary: 'Voluntary, consensus-based responsible-AI framework for healthcare from a multi-stakeholder non-profit: assurance standards across the AI lifecycle (usefulness, fairness, safety, transparency, privacy) plus reporting checklists. Not a regulation.',
  },
  {
    slug: 'tcpa-ai-voice', shortCode: 'TCPA', name: 'TCPA — FCC AI-Voice Declaratory Ruling',
    type: 'Regulation (Binding)', jurisdiction: 'US', version: 'FCC 24-17, effective 8 Feb 2024 (47 U.S.C. §227)', coverage: 22,
    summary: 'Binding FCC ruling confirming AI-generated/cloned voices are "artificial voice" under the TCPA, requiring prior express (written, for marketing) consent before such calls, with caller-identification and opt-out duties. Enforceable by the FCC, state AGs, and private plaintiffs.',
  },
  {
    slug: 'tn-elvis-act', shortCode: 'TN', name: 'Tennessee ELVIS Act (Voice & Likeness)',
    type: 'Regulation (Binding)', jurisdiction: 'US (Tennessee)', version: 'Public Chapter 2024, effective 1 Jul 2024', coverage: 18,
    summary: 'First US law to add "voice" to the right of publicity to target AI voice cloning/deepfakes. Prohibits unauthorized commercial use of a person\'s voice/likeness (incl. AI simulations) and distribution of tools whose primary purpose is unauthorized replication. Civil and criminal liability.',
  },
  // ── Control matrix (reference only — catalog text not reproduced; © CSA, non-commercial license) ──
  {
    slug: 'csa-aicm', shortCode: 'AICM', name: 'CSA AI Controls Matrix (AICM)',
    type: 'Control Matrix (Voluntary)', jurisdiction: 'Global', version: 'v1.1 — 247 control objectives / 18 domains (2025)', coverage: 28,
    summary: 'Cloud Security Alliance AI-specific control framework: 247 control objectives across 18 domains (CCM v4\'s 17 domains plus a new Model Security domain), cross-walked to ISO/IEC 42001, ISO/IEC 27001, NIST AI RMF + 600-1, EU AI Act, and BSI AIC4. Referenced here as the candidate control spine — the AICM catalog is © CSA under a non-commercial, no-redistribution license, so its control text is not reproduced in this open-source dataset.',
  },
  // ── Ethical engineering standard ──
  {
    slug: 'ieee-7000', shortCode: 'IEEE', name: 'IEEE 7000-2021 (Ethical System Design)',
    type: 'Standard (Voluntary)', jurisdiction: 'Global', version: 'IEEE Std 7000-2021 (Sept 2021)', coverage: 20,
    summary: 'International standard giving a model process for addressing ethical concerns during system design — eliciting stakeholder values and translating them into traceable ethical value requirements and design characteristics across the engineering lifecycle. Complements NIST AI RMF and ISO/IEC 42001 (which focus on risk and management systems) by operationalizing ethics at the requirements/design stage. Voluntary.',
  },
  // ── National binding AI statute (verified mid-2026) ──
  {
    slug: 'vietnam-ai-law', shortCode: 'VN', name: 'Vietnam Law on Artificial Intelligence (No. 134/2025/QH15)',
    type: 'Regulation (Binding)', jurisdiction: 'Vietnam', version: 'Law No. 134/2025/QH15, in force 1 Mar 2026', coverage: 22,
    summary: 'Binding, risk-based national AI statute applying to domestic and foreign entities across the AI lifecycle. High-risk AI must meet impact-assessment, risk-management, technical-documentation, logging, transparency, and incident-reporting duties; unacceptable-risk uses are prohibited. Enforced with system suspension/recall and administrative fines up to 2% of annual revenue (grace periods to 2027).',
  },
  {
    slug: 'nhid-clinical', shortCode: 'NHID', name: 'NHID-Clinical v1.3',
    type: 'Reference Implementation (Voluntary)', jurisdiction: 'Healthcare voice / Global', version: 'v1.3 — public comment NIST-2025-0035-0026', coverage: 0,
    summary: 'Open behavioral baseline for AI voice agents on B2B healthcare payer–provider administrative calls — identity disclosure before any protected data, no claim of human status, human handoff on request, and an audit trace. Scope is administrative calls only: patient-facing calls and clinical decision support are expressly out of scope. A voluntary, testable proposal (CC BY 4.0) — not law, not an official standard, not a certification, and not a general healthcare AI mandate. Reference-implementation, evaluation and audit-event work has continued past the published v1.3 baseline; v1.3 remains the citable public-comment artifact. Orthogonal to CCM: it governs voice-channel behavior, not CCM control domains. Conflict of interest: authored by the same person who built this register, disclosed here and at the top of its panel rather than in a footnote. Listed here as one framework among the rest, not first, and its reference module is off by default. Coverage reads 0%: none of the register\u2019s 27 controls maps to any of its five v1.3 controls by code; two cite its Layer 3 authentication layer, which is not one of the five. It previously read 100% only because its own module supplied its own controls.',
  },
];

// ---------------------------------------------------------------------------
// Provenance layer
//
// A compliance date is only as good as the document behind it. Every dated row
// may carry a SourceRef naming what it was taken from. `tier` classifies the
// *document cited* — not how carefully it was read — and `checked` records when
// the row was last reconciled against it. Rows with no SourceRef render as
// "no source recorded" rather than inheriting the credibility of the sourced
// ones, so the coverage figures below are deliberately unflattering: an
// unsourced row is a known gap, not a silent assumption.
// ---------------------------------------------------------------------------
export type EvidenceTier = 'primary' | 'official-guidance' | 'secondary';

export interface SourceRef {
  /** Class of the cited document, not a judgement about how it was verified. */
  tier: EvidenceTier;
  /** Full legal or documentary citation, written out. */
  citation: string;
  /** Specific article/section the row rests on, where one applies. */
  provision?: string;
  /** Official landing page for the cited document, when a public one exists. */
  url?: string;
  /** ISO date this row was last reconciled against the cited document. */
  checked: string;
  /** Caveats — above all, when the row rests on a summary of the text. */
  note?: string;
}

export const EVIDENCE_TIER_LABEL: Record<EvidenceTier, string> = {
  primary: 'Primary text',
  'official-guidance': 'Official guidance',
  secondary: 'Secondary report',
};

export const EVIDENCE_TIER_DESCRIPTION: Record<EvidenceTier, string> = {
  primary: 'The enacted legal instrument itself (Official Journal, statute book).',
  'official-guidance': 'Published by the regulator or enforcing authority, but not the law.',
  secondary: 'Law-firm notes, trade press or other third-party reporting.',
};

const OJ_AI_ACT = 'https://eur-lex.europa.eu/eli/reg/2024/1689/oj';
const EC_ART50_FAQ = 'https://digital-strategy.ec.europa.eu/en/faqs/transparency-obligations-under-article-50-ai-act';
const OMNIBUS_RECONCILED =
  'Deferral dates reconciled against Commission guidance and legal commentary on Regulation (EU) 2026/1744; the Official Journal text was not re-read for this row.';

export interface Obligation {
  id: string;
  title: string;
  framework: Framework['shortCode'];
  topic: string;
  type: 'mandatory' | 'recommended';
  effective: string;
  severity: 'critical' | 'high' | 'medium';
  summary: string;
  source?: SourceRef;
}

export const OBLIGATIONS: Obligation[] = [
  // In force since 2026-08-02 (EU AI Act Art. 50 transparency obligations applicable).
  { id: 'obl1', title: 'Disclose AI interaction at first contact', framework: 'EU', topic: 'Transparency', type: 'mandatory', effective: '2026-08-02', severity: 'high', summary: 'In force since 2 Aug 2026. Art. 50 transparency: providers must ensure people are informed they are interacting with an AI system unless it is obvious to a reasonably well-informed person, and AI-generated content must be marked machine-readably.', source: { tier: 'primary', citation: 'Regulation (EU) 2024/1689 (AI Act)', provision: 'Art. 50(1)', url: OJ_AI_ACT, checked: '2026-10-01' } },
  { id: 'obl-art50-mark', title: 'Machine-readable marking grace ends', framework: 'EU', topic: 'Transparency', type: 'mandatory', effective: '2026-12-02', severity: 'high', summary: 'Article 50(2) marking applies now to generative systems placed on the market from 2 Aug 2026. Systems already on the market before that date have until 2 Dec 2026. Not legal advice.', source: { tier: 'official-guidance', citation: 'European Commission — Transparency obligations under Article 50 of the AI Act (FAQ)', provision: 'Art. 50(2)', url: EC_ART50_FAQ, checked: '2026-10-01', note: 'The Commission FAQ states the grace period applies only to systems placed on the market before 2 Aug 2026 and only to the Art. 50(2) marking and detection duty.' } },
  { id: 'obl2', title: 'Implement appropriate human oversight', framework: 'EU', topic: 'Human Oversight', type: 'mandatory', effective: '2027-12-02', severity: 'critical', summary: 'High-risk AI systems must include measures enabling appropriate human oversight.', source: { tier: 'primary', citation: 'Regulation (EU) 2024/1689, as deferred by Regulation (EU) 2026/1744', provision: 'Art. 14', url: OJ_AI_ACT, checked: '2026-10-01', note: OMNIBUS_RECONCILED } },
  { id: 'obl3', title: 'Maintain logging for traceability', framework: 'EU', topic: 'Logging', type: 'mandatory', effective: '2027-12-02', severity: 'critical', summary: 'High-risk systems must log activity to support traceability and compliance review.', source: { tier: 'primary', citation: 'Regulation (EU) 2024/1689, as deferred by Regulation (EU) 2026/1744', provision: 'Art. 12', url: OJ_AI_ACT, checked: '2026-10-01', note: OMNIBUS_RECONCILED } },
  { id: 'obl4', title: 'Risk management system for high-risk AI', framework: 'EU', topic: 'Risk Management', type: 'mandatory', effective: '2027-12-02', severity: 'critical', summary: 'Continuous, iterative risk management process throughout the AI system lifecycle.', source: { tier: 'primary', citation: 'Regulation (EU) 2024/1689, as deferred by Regulation (EU) 2026/1744', provision: 'Art. 9', url: OJ_AI_ACT, checked: '2026-10-01', note: OMNIBUS_RECONCILED } },
  { id: 'obl5', title: 'Data governance & quality for high-risk', framework: 'EU', topic: 'Data Governance', type: 'mandatory', effective: '2027-12-02', severity: 'high', summary: 'Training, validation, and testing datasets must meet quality and governance standards.', source: { tier: 'primary', citation: 'Regulation (EU) 2024/1689, as deferred by Regulation (EU) 2026/1744', provision: 'Art. 10', url: OJ_AI_ACT, checked: '2026-10-01', note: OMNIBUS_RECONCILED } },
  { id: 'obl6', title: 'Technical documentation for high-risk', framework: 'EU', topic: 'Documentation', type: 'mandatory', effective: '2027-12-02', severity: 'high', summary: 'Comprehensive technical documentation must be maintained and provided to authorities.', source: { tier: 'primary', citation: 'Regulation (EU) 2024/1689, as deferred by Regulation (EU) 2026/1744', provision: 'Art. 11 & Annex IV', url: OJ_AI_ACT, checked: '2026-10-01', note: OMNIBUS_RECONCILED } },
  { id: 'obl7', title: 'GPAI model transparency obligations', framework: 'EU', topic: 'GPAI', type: 'mandatory', effective: '2025-08-02', severity: 'high', summary: 'General-purpose AI model providers must disclose training data summaries and comply with copyright rules.', source: { tier: 'primary', citation: 'Regulation (EU) 2024/1689 (AI Act)', provision: 'Art. 53', url: OJ_AI_ACT, checked: '2026-10-01' } },
  { id: 'obl8', title: 'Prohibited practices screening', framework: 'EU', topic: 'Prohibited Practices', type: 'mandatory', effective: '2025-02-02', severity: 'critical', summary: 'Screen for 8 banned practices: manipulation, exploitation, social scoring, certain biometric uses, etc.', source: { tier: 'primary', citation: 'Regulation (EU) 2024/1689 (AI Act)', provision: 'Art. 5', url: OJ_AI_ACT, checked: '2026-10-01' } },
  { id: 'obl9', title: 'Control documented information', framework: 'ISO', topic: 'Documentation', type: 'recommended', effective: 'Ongoing', severity: 'high', summary: 'Documented information must be created, updated, controlled, retained, and protected per Clause 7.5.' },
  { id: 'obl10', title: 'Establish AIMS scope & context', framework: 'ISO', topic: 'Governance', type: 'recommended', effective: 'Ongoing', severity: 'medium', summary: 'Understand internal/external issues, interested parties, and define AIMS scope per Clause 4.' },
  { id: 'obl11', title: 'Leadership commitment & AI policy', framework: 'ISO', topic: 'Governance', type: 'recommended', effective: 'Ongoing', severity: 'high', summary: 'Top management must demonstrate leadership and establish an AI policy per Clause 5.' },
  { id: 'obl12', title: 'Internal audit & management review', framework: 'ISO', topic: 'Monitoring', type: 'recommended', effective: 'Ongoing', severity: 'medium', summary: 'Conduct internal audits and management reviews per Clause 9.' },
  { id: 'obl13', title: 'Maintain AI governance inventory & roles', framework: 'NIST', topic: 'Risk Management', type: 'recommended', effective: 'Ongoing', severity: 'high', summary: 'GOVERN 1.6: mechanisms are in place to inventory AI systems. GOVERN 2.1: roles, responsibilities and lines of communication for mapping, measuring and managing AI risks are documented and clear across the organization.', source: { tier: 'official-guidance', citation: 'NIST AI 100-1, Artificial Intelligence Risk Management Framework (AI RMF 1.0), January 2023', provision: 'GOVERN 1.6; GOVERN 2.1', url: 'https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf', checked: '2026-11-14', note: 'Voluntary framework published by NIST; subcategory text read in the published PDF.' } },
  { id: 'obl14', title: 'Map system context & stakeholders', framework: 'NIST', topic: 'Risk Management', type: 'recommended', effective: 'Ongoing', severity: 'medium', summary: 'MAP 1.1: intended purposes, context-specific laws, norms and expectations, and prospective deployment settings are understood and documented, including the types of users and potential impacts. MAP 5.2: practices for regular engagement with relevant AI actors and for integrating their feedback are in place.', source: { tier: 'official-guidance', citation: 'NIST AI 100-1, Artificial Intelligence Risk Management Framework (AI RMF 1.0), January 2023', provision: 'MAP 1.1; MAP 5.2', url: 'https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf', checked: '2026-11-14', note: 'Voluntary framework published by NIST; subcategory text read in the published PDF.' } },
  { id: 'obl15', title: 'Provide transparency & responsible disclosure', framework: 'OECD', topic: 'Transparency', type: 'recommended', effective: 'Ongoing', severity: 'high', summary: 'Principle 1.3: AI actors should commit to transparency and responsible disclosure, providing meaningful information about capabilities and limitations, making people aware of their interactions with AI systems, and enabling those adversely affected to challenge an output.', source: { tier: 'primary', citation: 'OECD, Recommendation of the Council on Artificial Intelligence, OECD/LEGAL/0449 (adopted 22 May 2019; amended 8 Nov 2023 and 3 May 2024)', provision: 'Principle 1.3 (Transparency and explainability)', url: 'https://legalinstruments.oecd.org/en/instruments/OECD-LEGAL-0449', checked: '2026-11-14', note: 'A non-binding OECD legal instrument; text read as amended 3 May 2024.' } },
  { id: 'obl16', title: 'Ensure robustness, security & safety', framework: 'OECD', topic: 'Cybersecurity', type: 'recommended', effective: 'Ongoing', severity: 'high', summary: 'Principle 1.4: AI systems should be robust, secure and safe throughout their lifecycle, with mechanisms so that systems risking undue harm can be overridden, repaired or decommissioned safely.', source: { tier: 'primary', citation: 'OECD, Recommendation of the Council on Artificial Intelligence, OECD/LEGAL/0449 (adopted 22 May 2019; amended 8 Nov 2023 and 3 May 2024)', provision: 'Principle 1.4 (Robustness, security and safety)', url: 'https://legalinstruments.oecd.org/en/instruments/OECD-LEGAL-0449', checked: '2026-11-14', note: 'A non-binding OECD legal instrument; text read as amended 3 May 2024.' } },
  // Reclassified: NHID-Auth v2 is a voluntary reference implementation, not an EU
  // mandate. It was previously encoded as framework 'EU' / mandatory / critical with
  // a 2026-06-11 compliance date, which over-claimed a voluntary spec as binding law.
  { id: 'obl17', title: 'Caller Authorization Verification (NHID-Auth v2)', framework: 'NHID', topic: 'Voice Agent & Non-Human Identity', type: 'recommended', effective: 'Ongoing', severity: 'high', summary: 'Optional NHID-Auth v2 layer (Layer 3): Ed25519 agent passports, NPI binding, scoped delegation, revocation and call binding, verified offline against a trust anchor the deployer configures. Separate from the five NHID-Clinical controls; identity verification is not authorization to receive data. Voluntary reference implementation — not a regulatory requirement.', source: { tier: 'primary', citation: 'NHID-Clinical repository README, "NHID-Auth v2" (reference implementation; code Apache-2.0, specification and documents CC BY 4.0)', provision: 'NHID-Auth v2; DLG-01 Delegated Authority (opt-in)', url: 'https://github.com/NHID-Clinical/NHID-Clinical', checked: '2026-11-14', note: 'The author\'s own voluntary project, cited to its own repository. Read in the repository README on 14 Nov 2026. An earlier version of this row said "DPoP nonce binding"; the README describes call-SID binding and does not mention DPoP.' } },
  { id: 'obl18', title: 'Generative AI testing & assurance guidance', framework: 'SG', topic: 'Testing & Evaluation', type: 'recommended', effective: 'Ongoing', severity: 'medium', summary: 'Dimension 5 (Testing and Assurance): provide external validation and added trust through third-party testing, and develop common AI testing standards for consistency (Model AI Governance Framework for Generative AI, 2024).', source: { tier: 'official-guidance', citation: 'IMDA and AI Verify Foundation (Singapore), Model AI Governance Framework for Generative AI (finalised 30 May 2024)', provision: 'Dimension 5, Testing and Assurance', url: 'https://aiverifyfoundation.sg/resources/mgf-gen-ai/', checked: '2026-11-14', note: 'Reconciled against the nine dimension summaries on the publisher\'s framework page; the full PDF was not read. An earlier version of this row called it the "2nd Ed": the second edition is the separate 2020 framework for traditional AI.' } },
  { id: 'obl19', title: 'Content provenance & incident reporting', framework: 'SG', topic: 'Transparency', type: 'recommended', effective: 'Ongoing', severity: 'medium', summary: 'Dimension 7 (Content Provenance): transparency about where content comes from, as a useful signal for end-users. Dimension 4 (Incident Reporting): an incident management system for timely notification, remediation and continuous improvement.', source: { tier: 'official-guidance', citation: 'IMDA and AI Verify Foundation (Singapore), Model AI Governance Framework for Generative AI (finalised 30 May 2024)', provision: 'Dimension 4, Incident Reporting; Dimension 7, Content Provenance', url: 'https://aiverifyfoundation.sg/resources/mgf-gen-ai/', checked: '2026-11-14', note: 'Reconciled against the nine dimension summaries on the publisher\'s framework page; the full PDF was not read. An earlier version of this row called it the "2nd Ed": the second edition is the separate 2020 framework for traditional AI.' } },
  { id: 'obl20', title: 'Mitigate OWASP LLM Top 10 risks', framework: 'OWASP', topic: 'Application Security', type: 'recommended', effective: 'Ongoing', severity: 'high', summary: 'Address the 2025 list, including prompt injection (LLM01), sensitive information disclosure (LLM02), data and model poisoning (LLM04), improper output handling (LLM05) and excessive agency (LLM06).', source: { tier: 'primary', citation: 'OWASP Gen AI Security Project, OWASP Top 10 for LLM Applications 2025', provision: 'LLM01:2025 to LLM10:2025', url: 'https://genai.owasp.org/llm-top-10/', checked: '2026-11-14', note: 'A voluntary community list, cited to its publisher; "primary" here means the issuing body\'s own text, not law. The ten entry names were read; the per-entry guidance was not. Entry names updated from the earlier edition to the 2025 list.' } },
  { id: 'obl21', title: 'Map adversarial TTPs to MITRE ATLAS', framework: 'OWASP', topic: 'Threat Modeling', type: 'recommended', effective: 'Ongoing', severity: 'high', summary: 'Use MITRE ATLAS, a living knowledge base of adversary tactics and techniques involving AI based on real-world attacks and red-team demonstrations, to model threats to AI-enabled systems.', source: { tier: 'primary', citation: 'MITRE ATLAS (Adversarial Threat Landscape for Artificial-Intelligence Systems) knowledge base', provision: 'ATLAS matrix of tactics and techniques', url: 'https://atlas.mitre.org/', checked: '2026-11-14', note: 'A voluntary knowledge base, cited to its publisher. Only the home-page description was read; the matrix itself did not load, so the tactic names in an earlier version of this row were removed rather than left unchecked.' } },
  // SUPERSEDED REGIME: SB 24-205's high-risk / algorithmic-discrimination risk-management
  // duties were repealed and replaced by SB 26-189 (signed 14 May 2026) before taking effect.
  // Both Colorado obligations now reflect the narrower ADMT transparency framework, which
  // begins 1 Jan 2027. Severities left unchanged (no basis in the data model to re-rank).
  { id: 'obl22', title: 'ADMT developer documentation duties (SB 26-189)', framework: 'CO', topic: 'Transparency', type: 'mandatory', effective: '2027-01-01', severity: 'critical', summary: 'SB 26-189 repealed and re-enacted the SB 24-205 provisions with new requirements for automated decision-making technology (ADMT). On and after 1 January 2027 a developer must make available to each deployer of a covered ADMT documentation of its intended uses, categories of training data, known limitations and instructions for appropriate use and human review, and must notify deployers of material updates.', source: { tier: 'primary', citation: 'Colorado Senate Bill 26-189, Automated Decision-Making Technology (signed 14 May 2026; Session Laws 2026, ch. 131)', provision: 'C.R.S. § 6-1-1702(1)', url: 'https://leg.colorado.gov/bills/sb26-189', checked: '2026-11-14', note: 'Read in the signed act and the legislature\'s enacted-bill summary. The act applies to consequential decisions made on or after 1 January 2027.' } },
  { id: 'obl23', title: 'ADMT consumer disclosure (SB 26-189)', framework: 'CO', topic: 'Transparency', type: 'mandatory', effective: '2027-01-01', severity: 'high', summary: 'Before using a covered ADMT to materially influence a consequential decision, a deployer must give the consumer a clear and conspicuous notice. Where the decision is adverse, the deployer must provide, within 30 days, a plain-language description of the decision and the role the ADMT played, and a way to request more information. Applies to consequential decisions made on or after 1 January 2027.', source: { tier: 'primary', citation: 'Colorado Senate Bill 26-189, Automated Decision-Making Technology (signed 14 May 2026; Session Laws 2026, ch. 131)', provision: 'C.R.S. § 6-1-1704(1) and (3)', url: 'https://leg.colorado.gov/bills/sb26-189', checked: '2026-11-14', note: 'Read in the signed act. The Attorney General must adopt rules on the post-adverse-outcome disclosure by 1 January 2027 (§ 6-1-1704). The act applies to consequential decisions made on or after 1 January 2027.' } },
  { id: 'obl24', title: 'Implement access control for ePHI systems', framework: 'HIPAA', topic: 'Access Control', type: 'mandatory', effective: '2005-04-20', severity: 'critical', summary: '§164.312(a)(1) (standard): Implement technical policies and procedures for information systems that maintain electronic PHI to allow access only to persons or software programs that have been granted access rights.', source: { tier: 'primary', citation: '45 CFR § 164.312 (HIPAA Security Rule, technical safeguards), 68 FR 8376 (20 Feb 2003) as amended at 78 FR 5694 (25 Jan 2013)', provision: '§ 164.312(a)(1)', url: 'https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-164/subpart-C/section-164.312', checked: '2026-11-14', note: 'Read on eCFR, current to 10 Nov 2026. The date is the § 164.318 compliance date: 20 April 2005 (20 April 2006 for small health plans). This paragraph is a standard; the Required/Addressable labels attach only to implementation specifications.' } },
  { id: 'obl25', title: 'Assign unique user identification', framework: 'HIPAA', topic: 'Access Control', type: 'mandatory', effective: '2005-04-20', severity: 'critical', summary: '§164.312(a)(2)(i) (required): Assign a unique name and/or number for identifying and tracking user identity.', source: { tier: 'primary', citation: '45 CFR § 164.312 (HIPAA Security Rule, technical safeguards), 68 FR 8376 (20 Feb 2003) as amended at 78 FR 5694 (25 Jan 2013)', provision: '§ 164.312(a)(2)(i)', url: 'https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-164/subpart-C/section-164.312', checked: '2026-11-14', note: 'Read on eCFR, current to 10 Nov 2026. The date is the § 164.318 compliance date: 20 April 2005 (20 April 2006 for small health plans). Marked "(Required)" in the text, so it must be implemented (§ 164.306(d)(2)).' } },
  { id: 'obl26', title: 'Define emergency access procedure', framework: 'HIPAA', topic: 'Access Control', type: 'mandatory', effective: '2005-04-20', severity: 'high', summary: '§164.312(a)(2)(ii) (required): Establish (and implement as needed) procedures for obtaining necessary electronic PHI during an emergency.', source: { tier: 'primary', citation: '45 CFR § 164.312 (HIPAA Security Rule, technical safeguards), 68 FR 8376 (20 Feb 2003) as amended at 78 FR 5694 (25 Jan 2013)', provision: '§ 164.312(a)(2)(ii)', url: 'https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-164/subpart-C/section-164.312', checked: '2026-11-14', note: 'Read on eCFR, current to 10 Nov 2026. The date is the § 164.318 compliance date: 20 April 2005 (20 April 2006 for small health plans). Marked "(Required)" in the text, so it must be implemented (§ 164.306(d)(2)).' } },
  { id: 'obl27', title: 'Enforce automatic logoff', framework: 'HIPAA', topic: 'Access Control', type: 'mandatory', effective: '2005-04-20', severity: 'medium', summary: '§164.312(a)(2)(iii) (addressable): Implement electronic procedures that terminate an electronic session after a predetermined time of inactivity.', source: { tier: 'primary', citation: '45 CFR § 164.312 (HIPAA Security Rule, technical safeguards), 68 FR 8376 (20 Feb 2003) as amended at 78 FR 5694 (25 Jan 2013)', provision: '§ 164.312(a)(2)(iii)', url: 'https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-164/subpart-C/section-164.312', checked: '2026-11-14', note: 'Read on eCFR, current to 10 Nov 2026. The date is the § 164.318 compliance date: 20 April 2005 (20 April 2006 for small health plans). Marked "(Addressable)" in the text. Addressable is not optional: under § 164.306(d)(3) the entity must assess the specification, then either implement it or document why it is not reasonable and appropriate and implement an equivalent alternative.' } },
  { id: 'obl28', title: 'Encrypt and decrypt ePHI', framework: 'HIPAA', topic: 'Encryption', type: 'mandatory', effective: '2005-04-20', severity: 'critical', summary: '§164.312(a)(2)(iv) (addressable): Implement a mechanism to encrypt and decrypt electronic PHI.', source: { tier: 'primary', citation: '45 CFR § 164.312 (HIPAA Security Rule, technical safeguards), 68 FR 8376 (20 Feb 2003) as amended at 78 FR 5694 (25 Jan 2013)', provision: '§ 164.312(a)(2)(iv)', url: 'https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-164/subpart-C/section-164.312', checked: '2026-11-14', note: 'Read on eCFR, current to 10 Nov 2026. The date is the § 164.318 compliance date: 20 April 2005 (20 April 2006 for small health plans). Marked "(Addressable)" in the text. Addressable is not optional: under § 164.306(d)(3) the entity must assess the specification, then either implement it or document why it is not reasonable and appropriate and implement an equivalent alternative.' } },
  { id: 'obl29', title: 'Maintain audit controls', framework: 'HIPAA', topic: 'Audit & Logging', type: 'mandatory', effective: '2005-04-20', severity: 'critical', summary: '§164.312(b) (standard): Implement hardware, software, and/or procedural mechanisms that record and examine activity in information systems that contain or use electronic PHI.', source: { tier: 'primary', citation: '45 CFR § 164.312 (HIPAA Security Rule, technical safeguards), 68 FR 8376 (20 Feb 2003) as amended at 78 FR 5694 (25 Jan 2013)', provision: '§ 164.312(b)', url: 'https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-164/subpart-C/section-164.312', checked: '2026-11-14', note: 'Read on eCFR, current to 10 Nov 2026. The date is the § 164.318 compliance date: 20 April 2005 (20 April 2006 for small health plans). This paragraph is a standard; the Required/Addressable labels attach only to implementation specifications.' } },
  { id: 'obl30', title: 'Protect ePHI integrity', framework: 'HIPAA', topic: 'Data Integrity', type: 'mandatory', effective: '2005-04-20', severity: 'high', summary: '§164.312(c)(1) (standard): Implement policies and procedures to protect electronic PHI from improper alteration or destruction.', source: { tier: 'primary', citation: '45 CFR § 164.312 (HIPAA Security Rule, technical safeguards), 68 FR 8376 (20 Feb 2003) as amended at 78 FR 5694 (25 Jan 2013)', provision: '§ 164.312(c)(1)', url: 'https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-164/subpart-C/section-164.312', checked: '2026-11-14', note: 'Read on eCFR, current to 10 Nov 2026. The date is the § 164.318 compliance date: 20 April 2005 (20 April 2006 for small health plans). This paragraph is a standard; the Required/Addressable labels attach only to implementation specifications.' } },
  { id: 'obl31', title: 'Authenticate ePHI has not been altered', framework: 'HIPAA', topic: 'Data Integrity', type: 'mandatory', effective: '2005-04-20', severity: 'medium', summary: '§164.312(c)(2) (addressable): Implement electronic mechanisms to corroborate that ePHI has not been altered or destroyed in an unauthorized manner.', source: { tier: 'primary', citation: '45 CFR § 164.312 (HIPAA Security Rule, technical safeguards), 68 FR 8376 (20 Feb 2003) as amended at 78 FR 5694 (25 Jan 2013)', provision: '§ 164.312(c)(2)', url: 'https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-164/subpart-C/section-164.312', checked: '2026-11-14', note: 'Read on eCFR, current to 10 Nov 2026. The date is the § 164.318 compliance date: 20 April 2005 (20 April 2006 for small health plans). Marked "(Addressable)" in the text. Addressable is not optional: under § 164.306(d)(3) the entity must assess the specification, then either implement it or document why it is not reasonable and appropriate and implement an equivalent alternative.' } },
  { id: 'obl32', title: 'Authenticate persons or entities seeking ePHI access', framework: 'HIPAA', topic: 'Authentication', type: 'mandatory', effective: '2005-04-20', severity: 'critical', summary: '§164.312(d) (standard): Implement procedures to verify that a person or entity seeking access to electronic PHI is the one claimed.', source: { tier: 'primary', citation: '45 CFR § 164.312 (HIPAA Security Rule, technical safeguards), 68 FR 8376 (20 Feb 2003) as amended at 78 FR 5694 (25 Jan 2013)', provision: '§ 164.312(d)', url: 'https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-164/subpart-C/section-164.312', checked: '2026-11-14', note: 'Read on eCFR, current to 10 Nov 2026. The date is the § 164.318 compliance date: 20 April 2005 (20 April 2006 for small health plans). This paragraph is a standard; the Required/Addressable labels attach only to implementation specifications.' } },
  { id: 'obl33', title: 'Guard against unauthorized access during transmission', framework: 'HIPAA', topic: 'Transmission Security', type: 'mandatory', effective: '2005-04-20', severity: 'critical', summary: '§164.312(e)(1) (standard): Implement technical security measures to guard against unauthorized access to electronic PHI that is being transmitted over an electronic communications network.', source: { tier: 'primary', citation: '45 CFR § 164.312 (HIPAA Security Rule, technical safeguards), 68 FR 8376 (20 Feb 2003) as amended at 78 FR 5694 (25 Jan 2013)', provision: '§ 164.312(e)(1)', url: 'https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-164/subpart-C/section-164.312', checked: '2026-11-14', note: 'Read on eCFR, current to 10 Nov 2026. The date is the § 164.318 compliance date: 20 April 2005 (20 April 2006 for small health plans). This paragraph is a standard; the Required/Addressable labels attach only to implementation specifications.' } },
  { id: 'obl34', title: 'Apply transmission integrity controls', framework: 'HIPAA', topic: 'Transmission Security', type: 'mandatory', effective: '2005-04-20', severity: 'medium', summary: '§164.312(e)(2)(i) (addressable): Implement security measures to ensure that electronically transmitted electronic PHI is not improperly modified without detection until disposed of.', source: { tier: 'primary', citation: '45 CFR § 164.312 (HIPAA Security Rule, technical safeguards), 68 FR 8376 (20 Feb 2003) as amended at 78 FR 5694 (25 Jan 2013)', provision: '§ 164.312(e)(2)(i)', url: 'https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-164/subpart-C/section-164.312', checked: '2026-11-14', note: 'Read on eCFR, current to 10 Nov 2026. The date is the § 164.318 compliance date: 20 April 2005 (20 April 2006 for small health plans). Marked "(Addressable)" in the text. Addressable is not optional: under § 164.306(d)(3) the entity must assess the specification, then either implement it or document why it is not reasonable and appropriate and implement an equivalent alternative.' } },
  { id: 'obl35', title: 'Encrypt ePHI in transit', framework: 'HIPAA', topic: 'Transmission Security', type: 'mandatory', effective: '2005-04-20', severity: 'critical', summary: '§164.312(e)(2)(ii) (addressable): Implement a mechanism to encrypt electronic PHI whenever deemed appropriate.', source: { tier: 'primary', citation: '45 CFR § 164.312 (HIPAA Security Rule, technical safeguards), 68 FR 8376 (20 Feb 2003) as amended at 78 FR 5694 (25 Jan 2013)', provision: '§ 164.312(e)(2)(ii)', url: 'https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-164/subpart-C/section-164.312', checked: '2026-11-14', note: 'Read on eCFR, current to 10 Nov 2026. The date is the § 164.318 compliance date: 20 April 2005 (20 April 2006 for small health plans). Marked "(Addressable)" in the text. Addressable is not optional: under § 164.306(d)(3) the entity must assess the specification, then either implement it or document why it is not reasonable and appropriate and implement an equivalent alternative.' } },
  // Covered-provider duties operative 2 Aug 2026 (was previously dated 2026-01-01 here).
  { id: 'obl36', title: 'Latent disclosure in AI-generated media', framework: 'CA', topic: 'Transparency', type: 'mandatory', effective: '2026-08-02', severity: 'high', summary: 'Operative since 2 Aug 2026. To the extent technically feasible, a covered provider must include a latent disclosure in image, video or audio content created or altered by its GenAI system (provider, system name and version, time and date, unique identifier), and must make a disclosure verification tool available at no cost (California AI Transparency Act, SB 942 as amended).', source: { tier: 'primary', citation: 'California Business and Professions Code, Division 8, Chapter 25 (California AI Transparency Act), added by Stats. 2024, ch. 291 (SB 942); amended by Stats. 2025, ch. 674 (AB 853) and Stats. 2026, ch. 861 (SB 1000)', provision: '§§ 22757.2(a), 22757.3(a), 22757.6', url: 'https://leginfo.legislature.ca.gov/faces/codes_displayText.xhtml?lawCode=BPC&division=8.&title=&part=&chapter=25.&article=', checked: '2026-11-14', note: 'Read on the California Legislature\'s code site as amended by SB 1000. § 22757.6: the chapter became operative on 2 August 2026. The section as now in force contains no separate visible-disclosure duty, so that clause was removed from this row.' } },
  { id: 'obl37', title: 'Notice for AI-driven employment decisions', framework: 'IL', topic: 'Employment', type: 'mandatory', effective: '2026-01-01', severity: 'high', summary: 'It is a civil rights violation for an employer to use AI that has the effect of subjecting employees to discrimination on the basis of protected classes, or to use zip codes as a proxy for protected classes, in recruitment, hiring, promotion, discipline, discharge and other employment decisions; or to fail to provide notice to an employee that it is using AI for those purposes (Illinois HB 3773).', source: { tier: 'primary', citation: 'Illinois Public Act 103-0804 (HB 3773), amending the Illinois Human Rights Act', provision: '775 ILCS 5/2-102(L)', url: 'https://www.ilga.gov/Legislation/publicacts/view/103-0804', checked: '2026-11-14', note: 'Read on the Illinois General Assembly site. Section 99: the Act takes effect 1 January 2026.' } },
  { id: 'obl38', title: 'Independent bias audit of hiring AI', framework: 'NY', topic: 'Employment', type: 'mandatory', effective: '2023-07-05', severity: 'critical', summary: 'An employer or employment agency may not use an automated employment decision tool unless it has had a bias audit no more than one year before use and a summary of the results is public on its website. Candidates and employees who live in the city must be notified at least ten business days before use, in a notice that allows a candidate to request an alternative selection process or accommodation (NYC Local Law 144).', source: { tier: 'primary', citation: 'New York City Local Law 144 of 2021 (Int. 1894-2020), adding Administrative Code Title 20, Chapter 5, Subchapter 25', provision: 'N.Y.C. Admin. Code § 20-871(a) and (b)', url: 'https://legistar.council.nyc.gov/LegislationDetail.aspx?ID=4344524&GUID=B051915D-A9AC-451E-81F8-6596032FA3F9&Options=ID%7CText%7C&Search=', checked: '2026-11-14', note: 'Law text read on the City Council legislation site. The local law took effect 1 January 2023; the date on this row is the start of enforcement, 5 July 2023, as stated by the Department of Consumer and Worker Protection. The law gives no general opt-out: the notice must allow a candidate to request an alternative selection process or accommodation.' } },
  { id: 'obl39', title: 'Prohibited harmful AI uses', framework: 'TX', topic: 'Prohibited Practices', type: 'mandatory', effective: '2026-01-01', severity: 'critical', summary: 'A person may not develop or deploy an AI system that intentionally aims to incite or encourage self-harm, with the sole intent to infringe constitutional rights, or with the intent to unlawfully discriminate against a protected class. Social scoring and biometric identification without consent are barred for governmental entities (Texas TRAIGA).', source: { tier: 'primary', citation: 'Texas H.B. 149, 89th Legislature (Texas Responsible Artificial Intelligence Governance Act), adding Business & Commerce Code ch. 552', provision: 'Bus. & Com. Code §§ 552.052, 552.055, 552.056(b); §§ 552.053, 552.054 (governmental entities)', url: 'https://capitol.texas.gov/tlodocs/89R/billtext/html/HB00149F.htm', checked: '2026-11-14', note: 'Read in the enrolled bill. Section 10: the Act takes effect 1 January 2026. An earlier version of this row applied the biometric-identification restriction to all developers and deployers; § 552.054 binds governmental entities only.' } },
  { id: 'obl40', title: 'Disclose generative AI in regulated interactions', framework: 'UT', topic: 'Transparency', type: 'mandatory', effective: '2024-05-01', severity: 'high', summary: 'An individual providing services in a regulated occupation must prominently disclose generative AI use where it is a high-risk AI interaction, verbally at the start of a verbal interaction and in writing before a written one. A supplier using generative AI in a consumer transaction must disclose it when clearly and unambiguously asked (Utah AI Policy Act as amended).', source: { tier: 'primary', citation: 'Utah S.B. 226 (2025 General Session), Artificial Intelligence Consumer Protection Amendments, enacting Utah Code § 13-75-103', provision: 'Utah Code § 13-75-103(1)-(3)', url: 'https://le.utah.gov/Session/2025/bills/enrolled/SB0226.pdf', checked: '2026-11-14', note: 'Read in the enrolled S.B. 226, whose § 13-75-103 took effect 7 May 2025 and replaced the original 2024 disclosure section (§ 13-2-12, repealed by the same bill). The 2024 enactment was not re-read, so the 1 May 2024 date on this row is unchecked. An earlier version said lower-risk disclosure "upon request" applied to regulated occupations; that duty falls on suppliers in consumer transactions.' } },
  { id: 'obl41', title: 'Disclose high-impact or generative AI use', framework: 'KR', topic: 'Transparency', type: 'mandatory', effective: '2026-01-22', severity: 'high', summary: 'Providers and operators of high-impact or generative AI systems must proactively disclose AI involvement to users before or during the interaction (AI Basic Act).' },
  { id: 'obl42', title: 'Risk management & human oversight for high-impact AI', framework: 'KR', topic: 'Risk Management', type: 'mandatory', effective: '2026-01-22', severity: 'critical', summary: 'Operators of high-impact AI systems must implement a risk management plan, ensure human oversight, and maintain technical documentation. A grace period defers most fines through 2026 except for serious harms.' },
  { id: 'obl43', title: 'Appoint a domestic representative', framework: 'KR', topic: 'Governance', type: 'mandatory', effective: '2026-01-22', severity: 'medium', summary: 'Foreign AI providers exceeding revenue or user thresholds (KRW 1T total revenue, KRW 10B AI revenue, or 1M+ daily Korean users) must appoint a Korea-based representative.' },
  { id: 'obl44', title: 'File generative AI algorithms and run a security assessment', framework: 'CN', topic: 'Governance', type: 'mandatory', effective: '2023-08-15', severity: 'critical', summary: 'Article 17: providers of generative AI services with public-opinion attributes or social-mobilisation capability must carry out a security assessment under the relevant state provisions and complete algorithm filing (and changes or cancellation of filing) under the algorithm-recommendation provisions. In force 15 August 2023.', source: { tier: 'primary', citation: 'Interim Measures for the Management of Generative Artificial Intelligence Services (生成式人工智能服务管理暂行办法), Order No. 15 of the Cyberspace Administration of China and six other bodies', provision: 'Article 17; Article 24', url: 'https://www.cac.gov.cn/2023-07/13/c_1690898327029107.htm', checked: '2026-11-14', note: 'Reconciled against the Chinese original on the CAC site; no official English text exists. An earlier version of this row applied the duty to all public-facing services and said the assessment must be passed before launch; Article 17 covers services with public-opinion attributes or social-mobilisation capability and refers to the relevant state provisions.' } },
  { id: 'obl45', title: 'Label AI-generated content', framework: 'CN', topic: 'Transparency', type: 'mandatory', effective: '2025-09-01', severity: 'high', summary: 'Service providers must add explicit labels that users can clearly perceive to generated or synthetic content in the cases the deep-synthesis provisions specify, and implicit labels in file metadata recording the content\'s nature, the provider and a content number. In force 1 September 2025.', source: { tier: 'primary', citation: 'Measures for Labelling AI-Generated and Synthetic Content (人工智能生成合成内容标识办法), Guo Xin Ban Tong Zi [2025] No. 2, Cyberspace Administration of China and three other bodies', provision: 'Articles 3, 4, 5, 14', url: 'https://www.cac.gov.cn/2025-03/14/c_1743654684782215.htm', checked: '2026-11-14', note: 'Reconciled against the Chinese original on the CAC site; no official English text exists.' } },
  { id: 'obl46', title: 'Label and embed provenance metadata for synthetic media', framework: 'IN', topic: 'Transparency', type: 'mandatory', effective: '2026-02-20', severity: 'high', summary: 'An intermediary whose computer resource enables the creation of synthetically generated information must ensure it is prominently labelled (or carries a prefixed audio disclosure) and, to the extent technically feasible, is embedded with permanent metadata including a unique identifier, and must not enable removal of the label or metadata.', source: { tier: 'primary', citation: 'Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, as amended by G.S.R. 120(E) dated 10 February 2026 (Ministry of Electronics and Information Technology)', provision: 'Rule 3(3)(a)(ii) and (b)', url: 'https://www.meity.gov.in/static/uploads/2026/03/0b576f2071694b52e4cd6bb1b6dfab1e.pdf', checked: '2026-11-14', note: 'Read in the consolidated text published by MeitY. That text shows the notification date (10 Feb 2026); the 20 Feb 2026 commencement date on this row was not confirmed from it.' } },
  { id: 'obl47', title: 'Remove unlawful content within 3 hours of actual knowledge', framework: 'IN', topic: 'Content Moderation', type: 'mandatory', effective: '2026-02-20', severity: 'critical', summary: 'On receiving actual knowledge that its computer resource hosts information used to commit an unlawful act, an intermediary must remove or disable access to it within three hours. Under rule 2(1A), "information" in this context includes synthetically generated information.', source: { tier: 'primary', citation: 'Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, as amended by G.S.R. 120(E) dated 10 February 2026 (Ministry of Electronics and Information Technology)', provision: 'Rule 3(1)(d)', url: 'https://www.meity.gov.in/static/uploads/2026/03/0b576f2071694b52e4cd6bb1b6dfab1e.pdf', checked: '2026-11-14', note: 'Read in the consolidated text published by MeitY. An earlier version of this row said unlabelled AI-generated content must be removed within 3 hours. The three-hour limit in rule 3(1)(d) runs from actual knowledge of unlawful information and is not specific to unlabelled synthetic content. The 20 Feb 2026 commencement date was not confirmed from this text.' } },
  // GDPR
  { id: 'obl48', title: 'Right not to be subject to solely automated decisions', framework: 'GDPR', topic: 'Automated Decision-Making', type: 'mandatory', effective: '2018-05-25', severity: 'high', summary: 'Art 22: individuals have the right not to be subject to decisions based solely on automated processing (incl. profiling) with legal or similarly significant effects, absent consent, contractual necessity, or law — with safeguards including human intervention and the right to contest.' },
  { id: 'obl49', title: 'Meaningful information about automated processing', framework: 'GDPR', topic: 'Transparency', type: 'mandatory', effective: '2018-05-25', severity: 'medium', summary: 'Arts 13–15: where automated decision-making exists, controllers must disclose its existence and provide meaningful information about the logic involved and the significance and consequences for the data subject.' },
  // Council of Europe AI Convention
  { id: 'obl50', title: 'Bind AI lifecycle to human rights & rule of law', framework: 'COE', topic: 'Fundamental Rights', type: 'mandatory', effective: 'Not yet in force', severity: 'high', summary: 'Once the Convention is in force for it, each Party must adopt or maintain measures so that activities within the AI lifecycle are consistent with human-rights obligations and are not used to undermine democratic institutions and processes (implemented via national law). Not yet in force.', source: { tier: 'primary', citation: 'Council of Europe Framework Convention on Artificial Intelligence and Human Rights, Democracy and the Rule of Law (CETS No. 225), opened for signature at Vilnius, 5 September 2024', provision: 'Articles 1, 4, 5; Article 30(3)', url: 'https://www.coe.int/en/web/conventions/full-list?module=treaty-detail&treatynum=225', checked: '2026-11-14', note: 'Convention text read in the Council of Europe PDF; status read from the Treaty Office chart of signatures and ratifications, as of 13 Nov 2026: two ratifications (European Union, 15 May 2026; Bosnia and Herzegovina, 28 Oct 2026) and no entry-into-force date. Article 30(3) requires five, including at least three member States. An earlier version of this row gave an in-force date of 1 November 2025, which the Treaty Office record does not support.' } },
  { id: 'obl51', title: 'Transparency, oversight, accountability & remedies', framework: 'COE', topic: 'Accountability', type: 'mandatory', effective: 'Not yet in force', severity: 'medium', summary: 'Once the Convention is in force for it, each Party must adopt or maintain transparency and oversight requirements (including identification of AI-generated content), accountability for adverse impacts, accessible and effective remedies, and procedural safeguards for affected persons. Not yet in force.', source: { tier: 'primary', citation: 'Council of Europe Framework Convention on Artificial Intelligence and Human Rights, Democracy and the Rule of Law (CETS No. 225), opened for signature at Vilnius, 5 September 2024', provision: 'Articles 8, 9, 14, 15; Article 30(3)', url: 'https://www.coe.int/en/web/conventions/full-list?module=treaty-detail&treatynum=225', checked: '2026-11-14', note: 'Convention text read in the Council of Europe PDF; status read from the Treaty Office chart of signatures and ratifications, as of 13 Nov 2026: two ratifications (European Union, 15 May 2026; Bosnia and Herzegovina, 28 Oct 2026) and no entry-into-force date. Article 30(3) requires five, including at least three member States. An earlier version of this row gave an in-force date of 1 November 2025, which the Treaty Office record does not support.' } },
  // UNESCO
  { id: 'obl52', title: 'Implement AI-ethics principles via national policy', framework: 'UNESCO', topic: 'AI Ethics', type: 'recommended', effective: '2021-11-23', severity: 'medium', summary: 'Member states are encouraged to translate the Recommendation\'s values (human rights/dignity, transparency, fairness, safety, accountability, human oversight, sustainability) into domestic law and policy across 11 action areas.', source: { tier: 'primary', citation: 'UNESCO, Recommendation on the Ethics of Artificial Intelligence (adopted by the General Conference, Paris, 23 November 2021)', provision: 'Operative paragraph 2; Policy Areas 1-11', url: 'https://www.unesco.org/en/legal-affairs/recommendation-ethics-artificial-intelligence', checked: '2026-11-14', note: 'A non-binding recommendation: Member States are to apply it on a voluntary basis.' } },
  { id: 'obl53', title: 'Conduct Ethical Impact Assessments', framework: 'UNESCO', topic: 'Impact Assessment', type: 'recommended', effective: '2021-11-23', severity: 'medium', summary: 'Member States should introduce impact-assessment frameworks such as ethical impact assessment (para. 50) and credibly and transparently monitor and evaluate their AI-ethics policies (para. 131); UNESCO supports this with its Ethical Impact Assessment and Readiness Assessment methodologies (paras. 49, 131).', source: { tier: 'primary', citation: 'UNESCO, Recommendation on the Ethics of Artificial Intelligence (adopted by the General Conference, Paris, 23 November 2021)', provision: 'Paragraphs 49, 50, 131', url: 'https://www.unesco.org/en/legal-affairs/recommendation-ethics-artificial-intelligence', checked: '2026-11-14', note: 'A non-binding recommendation. An earlier version of this row said Member States periodically report; paragraph 131 speaks of monitoring and evaluating policies.' } },
  // FDA AI/ML SaMD — PCCP
  { id: 'obl54', title: 'Include a Predetermined Change Control Plan', framework: 'FDA', topic: 'Change Management', type: 'recommended', effective: '2024-12-04', severity: 'high', summary: 'FDA recommends that a PCCP in a marketing submission contain a Description of Modifications, a Modification Protocol and an Impact Assessment, so that the planned AI modifications can be implemented without a new submission for each.', source: { tier: 'official-guidance', citation: 'U.S. Food and Drug Administration, Marketing Submission Recommendations for a Predetermined Change Control Plan for Artificial Intelligence-Enabled Device Software Functions: Guidance for Industry and FDA Staff (originally issued 4 December 2024; reissued 18 August 2025), Docket FDA-2022-D-2628', provision: 'Sections V to VIII', url: 'https://www.fda.gov/regulatory-information/search-fda-guidance-documents/marketing-submission-recommendations-predetermined-change-control-plan-artificial-intelligence', checked: '2026-11-14', note: 'Non-binding guidance; read in the guidance PDF. Original issue date corrected from 3 to 4 December 2024.' } },
  { id: 'obl55', title: 'Transparency when a device has an authorized PCCP', framework: 'FDA', topic: 'Transparency', type: 'recommended', effective: '2024-12-04', severity: 'medium', summary: 'FDA recommends that labeling state that the device has an authorized PCCP, and that labeling be updated as modifications are implemented so users are aware of changes that affect use of the device.', source: { tier: 'official-guidance', citation: 'U.S. Food and Drug Administration, Marketing Submission Recommendations for a Predetermined Change Control Plan for Artificial Intelligence-Enabled Device Software Functions: Guidance for Industry and FDA Staff (originally issued 4 December 2024; reissued 18 August 2025), Docket FDA-2022-D-2628', provision: 'Section V.C', url: 'https://www.fda.gov/regulatory-information/search-fda-guidance-documents/marketing-submission-recommendations-predetermined-change-control-plan-artificial-intelligence', checked: '2026-11-14', note: 'Non-binding guidance; read in the guidance PDF. Original issue date corrected from 3 to 4 December 2024.' } },
  // ONC HTI-1
  { id: 'obl56', title: 'Make source attributes available for Predictive DSIs', framework: 'ONC', topic: 'Algorithm Transparency', type: 'mandatory', effective: '2025-01-01', severity: 'critical', summary: 'Certified health IT must give users access to the source attributes listed for each Predictive Decision Support Intervention, in nine categories: details and output, purpose, cautioned out-of-scope use, development and input features, fairness process, external validation, quantitative performance measures, ongoing maintenance, and update schedule.', source: { tier: 'primary', citation: '45 CFR § 170.315(b)(11), Decision support interventions (ONC HTI-1 Final Rule, 89 FR 1192, 9 Jan 2024)', provision: '§ 170.315(b)(11)(iv)(B) and (v)', url: 'https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-D/part-170/subpart-C/section-170.315', checked: '2026-11-14', note: 'Read on eCFR. The date reflects the expiry of the predecessor criterion, § 170.315(a)(9), on 1 January 2025. The attribute count ("31") in an earlier version of this row could not be confirmed by counting the eCFR text and was replaced with the nine categories the text lists.' } },
  { id: 'obl57', title: 'Implement Intervention Risk Management practices', framework: 'ONC', topic: 'Risk Management', type: 'mandatory', effective: '2025-01-01', severity: 'high', summary: 'Risk analysis, risk mitigation and governance practices must be applied for each Predictive DSI a developer supplies as part of its Health IT Module, and summary information about those practices must be publicly accessible by hyperlink.', source: { tier: 'primary', citation: '45 CFR § 170.315(b)(11), Decision support interventions (ONC HTI-1 Final Rule, 89 FR 1192, 9 Jan 2024)', provision: '§ 170.315(b)(11)(vi); 45 CFR § 170.523(f)(1)(xxi)', url: 'https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-D/part-170/subpart-C/section-170.315', checked: '2026-11-14', note: 'Read on eCFR. The public-summary duty sits in § 170.523(f)(1)(xxi): summary information is submitted via a publicly accessible hyperlink.' } },
  // WHO health-AI / LMM
  { id: 'obl58', title: 'Government oversight & assurance for health LMMs', framework: 'WHO', topic: 'Governance', type: 'recommended', effective: 'Ongoing', severity: 'medium', summary: 'WHO recommends that governments assign a regulatory agency to assess and approve health LMMs, require impact assessments audited by an independent third party, and introduce mandatory post-release auditing and impact assessments when an LMM is deployed at large scale.', source: { tier: 'official-guidance', citation: 'World Health Organization, Ethics and governance of artificial intelligence for health: guidance on large multi-modal models (2024), ISBN 978-92-4-008475-9', provision: 'Sections 5.2 and 6.4, recommendations to governments', url: 'https://www.who.int/publications/i/item/9789240084759', checked: '2026-11-14', note: 'Non-binding WHO guidance; recommendations read in the published PDF.' } },
  { id: 'obl59', title: 'Developer transparency & stakeholder engagement for LMMs', framework: 'WHO', topic: 'Transparency', type: 'recommended', effective: 'Ongoing', severity: 'medium', summary: 'WHO recommends that developers engage potential users and stakeholders, including health-care professionals and patients, from the early stages of design; design LMMs to perform well-defined tasks with the necessary accuracy and reliability; and be transparent about training data.', source: { tier: 'official-guidance', citation: 'World Health Organization, Ethics and governance of artificial intelligence for health: guidance on large multi-modal models (2024), ISBN 978-92-4-008475-9', provision: 'Section 4.4, recommendations to developers', url: 'https://www.who.int/publications/i/item/9789240084759', checked: '2026-11-14', note: 'Non-binding WHO guidance; recommendations read in the published PDF.' } },
  // CHAI
  { id: 'obl60', title: 'Complete assurance reporting across the AI lifecycle', framework: 'CHAI', topic: 'Assurance', type: 'recommended', effective: '2024-06-26', severity: 'medium', summary: 'CHAI\'s draft Assurance Reporting Checklists give criteria for evaluating health-AI solutions across the lifecycle, from use-case definition to deployment and monitoring, for use by independent reviewers and adopting organizations. Released as a draft for public comment.', source: { tier: 'primary', citation: 'Coalition for Health AI, "CHAI Releases Draft Responsible Health AI Framework for Public Comment" (26 June 2024), announcing the draft Assurance Standards Guide and Assurance Reporting Checklists', provision: 'Draft Assurance Reporting Checklists', url: 'https://www.chai.org/blog/chai-releases-draft-responsible-health-ai-framework-for-public-comment', checked: '2026-11-14', note: 'A voluntary industry document, cited to its publisher. Only CHAI\'s announcement was read; the Guide and the Checklists themselves were not. They were released as drafts for public comment, which an earlier version of this row did not say.' } },
  { id: 'obl61', title: 'Establish AI governance, monitoring & bias mitigation', framework: 'CHAI', topic: 'Governance', type: 'recommended', effective: 'Ongoing', severity: 'medium', summary: 'CHAI recommends governance structures, ongoing performance monitoring, bias mitigation, data-protection safeguards, and clinician training.' },
  // TCPA — FCC AI-voice ruling
  { id: 'obl62', title: 'Obtain prior express consent before AI-voice calls', framework: 'TCPA', topic: 'Consent', type: 'mandatory', effective: '2024-02-08', severity: 'critical', summary: 'The FCC confirmed that the TCPA\'s restrictions on "artificial or prerecorded voice" calls cover AI technologies that generate human voices, so such calls require the called party\'s prior express consent (prior express written consent for advertising or telemarketing) absent an emergency purpose or exemption.', source: { tier: 'primary', citation: 'FCC Declaratory Ruling, Implications of Artificial Intelligence Technologies on Protecting Consumers from Unwanted Robocalls and Robotexts, FCC 24-17, CG Docket No. 23-362 (adopted 2 Feb 2024; released 8 Feb 2024); 47 CFR § 64.1200', provision: 'Declaratory Ruling; 47 CFR § 64.1200(a)(1)-(3)', url: 'https://docs.fcc.gov/public/attachments/FCC-24-17A1.pdf', checked: '2026-11-14', note: 'Ruling read in the FCC PDF and the rule on eCFR. The ruling was effective upon release.' } },
  { id: 'obl63', title: 'Identify caller and provide opt-out for AI-voice calls', framework: 'TCPA', topic: 'Disclosure', type: 'mandatory', effective: '2024-02-08', severity: 'high', summary: 'Every artificial or prerecorded voice message must state at the beginning the identity of the entity responsible for the call and give its telephone number. Where the message is advertising or telemarketing, it must also offer an automated opt-out mechanism.', source: { tier: 'primary', citation: 'FCC Declaratory Ruling, Implications of Artificial Intelligence Technologies on Protecting Consumers from Unwanted Robocalls and Robotexts, FCC 24-17, CG Docket No. 23-362 (adopted 2 Feb 2024; released 8 Feb 2024); 47 CFR § 64.1200', provision: 'Declaratory Ruling; 47 CFR § 64.1200(b)(1)-(3)', url: 'https://docs.fcc.gov/public/attachments/FCC-24-17A1.pdf', checked: '2026-11-14', note: 'Ruling read in the FCC PDF and the rule on eCFR. An earlier version of this row implied the opt-out mechanism applies to every artificial-voice call; § 64.1200(b)(3) requires it where the message is advertising or telemarketing, or made under a residential-line exemption.' } },
  // Tennessee ELVIS Act
  { id: 'obl64', title: 'No unauthorized use of a person\'s voice/likeness', framework: 'TN', topic: 'Right of Publicity', type: 'mandatory', effective: '2024-07-01', severity: 'critical', summary: 'A person is liable to a civil action for knowingly using an individual\'s name, photograph, voice or likeness for advertising, fundraising or solicitation without consent, or for making an individual\'s voice or likeness available to the public knowing the use was not authorized. "Voice" includes a simulation of the individual\'s voice.', source: { tier: 'primary', citation: 'Tennessee Public Chapter No. 588 (2024), House Bill 2091 / Senate Bill 2096, Ensuring Likeness, Voice, and Image Security (ELVIS) Act of 2024', provision: 'Tenn. Code Ann. § 47-25-1105(a)(1)-(2); § 47-25-1102 ("voice")', url: 'https://publications.tnsosfiles.com/acts/113/pub/pc0588.pdf', checked: '2026-11-14', note: 'Read in the public chapter on the Tennessee Secretary of State site. Takes effect 1 July 2024. An earlier version of this row described a general prohibition; the text creates civil liability for the specific knowing uses described here.' } },
  { id: 'obl65', title: 'No distribution of unauthorized voice-cloning tools', framework: 'TN', topic: 'Secondary Liability', type: 'mandatory', effective: '2024-07-01', severity: 'high', summary: 'A person is liable to a civil action for distributing or making available an algorithm, software, tool or other technology whose primary purpose or function is producing a particular, identifiable individual\'s photograph, voice or likeness, with knowledge that doing so was not authorized.', source: { tier: 'primary', citation: 'Tennessee Public Chapter No. 588 (2024), House Bill 2091 / Senate Bill 2096, Ensuring Likeness, Voice, and Image Security (ELVIS) Act of 2024', provision: 'Tenn. Code Ann. § 47-25-1105(a)(3)', url: 'https://publications.tnsosfiles.com/acts/113/pub/pc0588.pdf', checked: '2026-11-14', note: 'Read in the public chapter on the Tennessee Secretary of State site. Takes effect 1 July 2024.' } },
  // IEEE 7000-2021
  { id: 'obl66', title: 'Translate stakeholder values into ethical value requirements', framework: 'IEEE', topic: 'Value-Based Design', type: 'recommended', effective: '2021-09-15', severity: 'medium', summary: 'Apply the IEEE 7000 process to elicit stakeholder values and translate them into traceable ethical value requirements (EVRs) early in system design.' },
  { id: 'obl67', title: 'Maintain an ethical-values traceability record', framework: 'IEEE', topic: 'Documentation', type: 'recommended', effective: '2021-09-15', severity: 'medium', summary: 'Document the traceability from identified values through ethical value requirements to design characteristics, supporting transparency and ethical accountability across the lifecycle.' },
  // Vietnam Law on AI
  { id: 'obl68', title: 'Risk management & documentation for high-risk AI', framework: 'VN', topic: 'Risk Management', type: 'mandatory', effective: '2026-03-01', severity: 'critical', summary: 'Providers/deployers of high-risk AI must conduct impact assessments and maintain a risk-management system, technical documentation, and logging (grace periods to 2027 for existing systems in finance, healthcare, and education).' },
  { id: 'obl69', title: 'Transparency & serious-incident reporting', framework: 'VN', topic: 'Transparency', type: 'mandatory', effective: '2026-03-01', severity: 'high', summary: 'Deployers must disclose how high-risk AI systems operate and report serious AI-caused incidents to the regulator; unacceptable-risk uses are prohibited.' },
  // NHID-Clinical (author's own voluntary proposal) — listed last, like any other voluntary entry.
  { id: 'obl-nhid-idg', title: 'IDG-01 · Identity Disclosure Gate — disclose non-human identity before any PHI exchange', framework: 'NHID', topic: 'Voice Agent & Non-Human Identity', type: 'recommended', effective: 'Ongoing', severity: 'high', summary: 'Voluntary NHID-Clinical baseline: the calling agent discloses that it is not human before any PHI exchange, and a disclosure counts only if it was heard. It shows the agent said it is automated, not that its other claims are true.', source: { tier: 'primary', citation: 'NHID-Clinical v1.3 baseline specification (public-comment artifact NIST-2025-0035-0026), CC BY 4.0', provision: 'IDG-01', url: 'https://nhid-clinical.org/', checked: '2026-10-01', note: 'Voluntary proposal, not law and not a certification. Reference-implementation work has continued past the published v1.3 baseline; v1.3 remains the citable public artifact.' } },
  { id: 'obl-nhid-pdx', title: 'PDX-01 · Pre-Data Exchange Gate — no protected data until identity is disclosed', framework: 'NHID', topic: 'Voice Agent & Non-Human Identity', type: 'recommended', effective: 'Ongoing', severity: 'high', summary: 'Voluntary NHID-Clinical baseline: no protected data is exchanged until the agent has disclosed its identity, which closes the impersonation-latency window. A disclosure and a request in the same turn still fails. Disclosure is not authorization: authority to receive the data is a separate check.', source: { tier: 'primary', citation: 'NHID-Clinical v1.3 baseline specification (public-comment artifact NIST-2025-0035-0026), CC BY 4.0', provision: 'PDX-01', url: 'https://nhid-clinical.org/', checked: '2026-10-01', note: 'Voluntary proposal, not law and not a certification. Reference-implementation work has continued past the published v1.3 baseline; v1.3 remains the citable public artifact.' } },
  { id: 'obl-nhid-dbc', title: 'DBC-01 · Deceptive Behavior Check — no claim of human status or licensed-professional standing', framework: 'NHID', topic: 'Voice Agent & Non-Human Identity', type: 'recommended', effective: 'Ongoing', severity: 'medium', summary: 'Voluntary NHID-Clinical baseline: the agent makes no claim, explicit or implied, to be human or a licensed professional. Judged on the agent\'s own words in the transcript; non-blocking, logged and routed to human review.', source: { tier: 'primary', citation: 'NHID-Clinical v1.3 baseline specification (public-comment artifact NIST-2025-0035-0026), CC BY 4.0', provision: 'DBC-01', url: 'https://nhid-clinical.org/', checked: '2026-10-01', note: 'Voluntary proposal, not law and not a certification. Reference-implementation work has continued past the published v1.3 baseline; v1.3 remains the citable public artifact.' } },
  { id: 'obl-nhid-eit', title: 'EIT-01 · Escalation Implementation Test — a clear human-handoff path, honored on request', framework: 'NHID', topic: 'Voice Agent & Non-Human Identity', type: 'recommended', effective: 'Ongoing', severity: 'medium', summary: 'Voluntary NHID-Clinical baseline: a request for a human is honored through a clear handoff path. A handoff counts only when it is recorded with a timestamp and an outcome.', source: { tier: 'primary', citation: 'NHID-Clinical v1.3 baseline specification (public-comment artifact NIST-2025-0035-0026), CC BY 4.0', provision: 'EIT-01', url: 'https://nhid-clinical.org/', checked: '2026-10-01', note: 'Voluntary proposal, not law and not a certification. Reference-implementation work has continued past the published v1.3 baseline; v1.3 remains the citable public artifact.' } },
  { id: 'obl-nhid-atr', title: 'ATR-01 · Audit Trail Requirements — every interaction produces a machine-readable trace', framework: 'NHID', topic: 'Voice Agent & Non-Human Identity', type: 'recommended', effective: 'Ongoing', severity: 'medium', summary: 'Voluntary NHID-Clinical baseline: every interaction produces a machine-readable trace recording what the other four controls decided. It changes no behavior.', source: { tier: 'primary', citation: 'NHID-Clinical v1.3 baseline specification (public-comment artifact NIST-2025-0035-0026), CC BY 4.0', provision: 'ATR-01', url: 'https://nhid-clinical.org/', checked: '2026-10-01', note: 'Voluntary proposal, not law and not a certification. Reference-implementation work has continued past the published v1.3 baseline; v1.3 remains the citable public artifact.' } },
];

export interface StateAILaw {
  name: string;
  postalCode: string;
  status: 'binding' | 'none';
  frameworkSlug?: string;
}

export const STATE_AI_LAWS: StateAILaw[] = [
  { name: 'Alabama', postalCode: 'AL', status: 'none' },
  { name: 'Alaska', postalCode: 'AK', status: 'none' },
  { name: 'Arizona', postalCode: 'AZ', status: 'none' },
  { name: 'Arkansas', postalCode: 'AR', status: 'none' },
  { name: 'California', postalCode: 'CA', status: 'binding', frameworkSlug: 'california-ai-transparency-act' },
  { name: 'Colorado', postalCode: 'CO', status: 'binding', frameworkSlug: 'colorado-ai-act' },
  { name: 'Connecticut', postalCode: 'CT', status: 'none' },
  { name: 'Delaware', postalCode: 'DE', status: 'none' },
  { name: 'District of Columbia', postalCode: 'DC', status: 'none' },
  { name: 'Florida', postalCode: 'FL', status: 'none' },
  { name: 'Georgia', postalCode: 'GA', status: 'none' },
  { name: 'Hawaii', postalCode: 'HI', status: 'none' },
  { name: 'Idaho', postalCode: 'ID', status: 'none' },
  { name: 'Illinois', postalCode: 'IL', status: 'binding', frameworkSlug: 'illinois-hb3773' },
  { name: 'Indiana', postalCode: 'IN', status: 'none' },
  { name: 'Iowa', postalCode: 'IA', status: 'none' },
  { name: 'Kansas', postalCode: 'KS', status: 'none' },
  { name: 'Kentucky', postalCode: 'KY', status: 'none' },
  { name: 'Louisiana', postalCode: 'LA', status: 'none' },
  { name: 'Maine', postalCode: 'ME', status: 'none' },
  { name: 'Maryland', postalCode: 'MD', status: 'none' },
  { name: 'Massachusetts', postalCode: 'MA', status: 'none' },
  { name: 'Michigan', postalCode: 'MI', status: 'none' },
  { name: 'Minnesota', postalCode: 'MN', status: 'none' },
  { name: 'Mississippi', postalCode: 'MS', status: 'none' },
  { name: 'Missouri', postalCode: 'MO', status: 'none' },
  { name: 'Montana', postalCode: 'MT', status: 'none' },
  { name: 'Nebraska', postalCode: 'NE', status: 'none' },
  { name: 'Nevada', postalCode: 'NV', status: 'none' },
  { name: 'New Hampshire', postalCode: 'NH', status: 'none' },
  { name: 'New Jersey', postalCode: 'NJ', status: 'none' },
  { name: 'New Mexico', postalCode: 'NM', status: 'none' },
  { name: 'New York', postalCode: 'NY', status: 'binding', frameworkSlug: 'nyc-local-law-144' },
  { name: 'North Carolina', postalCode: 'NC', status: 'none' },
  { name: 'North Dakota', postalCode: 'ND', status: 'none' },
  { name: 'Ohio', postalCode: 'OH', status: 'none' },
  { name: 'Oklahoma', postalCode: 'OK', status: 'none' },
  { name: 'Oregon', postalCode: 'OR', status: 'none' },
  { name: 'Pennsylvania', postalCode: 'PA', status: 'none' },
  { name: 'Rhode Island', postalCode: 'RI', status: 'none' },
  { name: 'South Carolina', postalCode: 'SC', status: 'none' },
  { name: 'South Dakota', postalCode: 'SD', status: 'none' },
  { name: 'Tennessee', postalCode: 'TN', status: 'binding', frameworkSlug: 'tn-elvis-act' },
  { name: 'Texas', postalCode: 'TX', status: 'binding', frameworkSlug: 'texas-traiga' },
  { name: 'Utah', postalCode: 'UT', status: 'binding', frameworkSlug: 'utah-ai-policy-act' },
  { name: 'Vermont', postalCode: 'VT', status: 'none' },
  { name: 'Virginia', postalCode: 'VA', status: 'none' },
  { name: 'Washington', postalCode: 'WA', status: 'none' },
  { name: 'West Virginia', postalCode: 'WV', status: 'none' },
  { name: 'Wisconsin', postalCode: 'WI', status: 'none' },
  { name: 'Wyoming', postalCode: 'WY', status: 'none' },
  { name: 'Puerto Rico', postalCode: 'PR', status: 'none' },
];

// Country names match world-atlas/countries-110m.json's properties.name (Natural Earth).
// Coverage here is intentionally limited to countries with a verified status — every other
// country renders as 'unresearched' rather than guessing at a 'none' that hasn't been checked.
export interface CountryAILaw {
  name: string;
  status: 'binding' | 'none';
  frameworkSlug?: string;
}

export const COUNTRY_AI_LAWS: CountryAILaw[] = [
  // EU AI Act (Regulation (EU) 2024/1689) binds all member states.
  { name: 'Austria', status: 'binding', frameworkSlug: 'eu-ai-act' },
  { name: 'Belgium', status: 'binding', frameworkSlug: 'eu-ai-act' },
  { name: 'Bulgaria', status: 'binding', frameworkSlug: 'eu-ai-act' },
  { name: 'Croatia', status: 'binding', frameworkSlug: 'eu-ai-act' },
  { name: 'Cyprus', status: 'binding', frameworkSlug: 'eu-ai-act' },
  { name: 'Czechia', status: 'binding', frameworkSlug: 'eu-ai-act' },
  { name: 'Denmark', status: 'binding', frameworkSlug: 'eu-ai-act' },
  { name: 'Estonia', status: 'binding', frameworkSlug: 'eu-ai-act' },
  { name: 'Finland', status: 'binding', frameworkSlug: 'eu-ai-act' },
  { name: 'France', status: 'binding', frameworkSlug: 'eu-ai-act' },
  { name: 'Germany', status: 'binding', frameworkSlug: 'eu-ai-act' },
  { name: 'Greece', status: 'binding', frameworkSlug: 'eu-ai-act' },
  { name: 'Hungary', status: 'binding', frameworkSlug: 'eu-ai-act' },
  { name: 'Ireland', status: 'binding', frameworkSlug: 'eu-ai-act' },
  { name: 'Italy', status: 'binding', frameworkSlug: 'eu-ai-act' },
  { name: 'Latvia', status: 'binding', frameworkSlug: 'eu-ai-act' },
  { name: 'Lithuania', status: 'binding', frameworkSlug: 'eu-ai-act' },
  { name: 'Luxembourg', status: 'binding', frameworkSlug: 'eu-ai-act' },
  { name: 'Netherlands', status: 'binding', frameworkSlug: 'eu-ai-act' },
  { name: 'Poland', status: 'binding', frameworkSlug: 'eu-ai-act' },
  { name: 'Portugal', status: 'binding', frameworkSlug: 'eu-ai-act' },
  { name: 'Romania', status: 'binding', frameworkSlug: 'eu-ai-act' },
  { name: 'Slovakia', status: 'binding', frameworkSlug: 'eu-ai-act' },
  { name: 'Slovenia', status: 'binding', frameworkSlug: 'eu-ai-act' },
  { name: 'Spain', status: 'binding', frameworkSlug: 'eu-ai-act' },
  { name: 'Sweden', status: 'binding', frameworkSlug: 'eu-ai-act' },
  // Countries with their own verified, binding AI-specific national law.
  { name: 'South Korea', status: 'binding', frameworkSlug: 'korea-ai-basic-act' },
  { name: 'China', status: 'binding', frameworkSlug: 'china-genai-interim-measures' },
  { name: 'India', status: 'binding', frameworkSlug: 'india-it-rules-synthetic-media' },
  // Vietnam: Law on AI No. 134/2025/QH15, a binding risk-based statute in force 1 Mar 2026.
  { name: 'Vietnam', status: 'binding', frameworkSlug: 'vietnam-ai-law' },
  // Researched and confirmed to have no binding AI-specific law as of mid-2026.
  { name: 'United Kingdom', status: 'none' },
  { name: 'Canada', status: 'none' },
  { name: 'Brazil', status: 'none' },
  { name: 'United States of America', status: 'none' },
  // Singapore: IMDA's Model AI Governance Framework (incl. its 2026 Agentic AI edition) and MAS AI risk guidelines are voluntary/supervisory, not legislation.
  { name: 'Singapore', status: 'none' },
  // Japan: the 2025 AI Promotion Act is enacted but explicitly soft-law — no fines or penalties, only advisory/disclosure measures.
  { name: 'Japan', status: 'none' },
];

export const CCM_DOMAINS = ['A&A', 'AIS', 'BCR', 'CCC', 'CEK', 'DCS', 'DSP', 'GRC', 'HRS', 'IAM', 'IPY', 'LOG', 'SEF', 'STA', 'TVM', 'UEM'];

export const MATURITY_LEVELS = [
  { level: 0, label: 'None' },
  { level: 1, label: 'Initial' },
  { level: 2, label: 'Managed' },
  { level: 3, label: 'Defined' },
  { level: 4, label: 'Measured' },
  { level: 5, label: 'Optimized' },
];

export interface ControlIndicator {
  name: string;
  method: string;
  slo: string;
}

export interface Control {
  id: number;
  code: string;
  title: string;
  description: string;
  ccmDomain: string;
  riskTier: 'High-Risk' | 'All Systems';
  priority: 'Critical' | 'High' | 'Medium';
  status: 'Implemented' | 'In Progress' | 'Planned';
  automation: 'automated' | 'semi-automated' | 'manual';
  mappings: Record<string, string[]>;
  indicator: ControlIndicator;
  implementation: string;
}

// 'NIST AI RMF' mappings cite subcategories by NIST's own ids ("GOVERN 1.1", not
// "GOV 1.1") and were reviewed one by one against the official subcategory
// statements in the NIST AI RMF Playbook — see docs/nist-playbook-mapping-review.md.
// A control with no fitting subcategory carries no NIST mapping rather than a loose one.
// nist-playbook.test.ts fails if any id here does not exist in the Playbook data.
export const CONTROLS: Control[] = [
  { id: 1, code: 'CTRL-GRC-001', title: 'AI Governance Board & Charter', riskTier: 'High-Risk', priority: 'Critical', ccmDomain: 'GRC', status: 'Implemented', automation: 'manual',
    description: 'Establish a cross-functional AI Governance Board with documented charter, roles, and decision rights over AI system deployment and oversight.',
    mappings: { 'NIST AI RMF': ['GOVERN 2.1', 'GOVERN 2.3'], 'ISO/IEC 42001': ['5.1', '5.3'], 'EU AI Act': ['Art 4', 'Art 26'] },
    indicator: { name: 'Board Meeting Cadence & Quorum Rate', method: 'Meetings held / scheduled with quorum', slo: '≥90% quorum on monthly cadence' },
    implementation: 'Document charter with mandate, membership (CISO, CLO, CPO, business leads), voting thresholds, and escalation paths. Publish minutes within 5 business days.' },
  { id: 2, code: 'CTRL-GRC-002', title: 'AI Risk Management Program', riskTier: 'High-Risk', priority: 'Critical', ccmDomain: 'GRC', status: 'In Progress', automation: 'manual',
    description: 'Systematic program to identify, assess, treat, and monitor AI-related risks aligned to enterprise risk appetite.',
    mappings: { 'NIST AI RMF': ['GOVERN 1.3', 'MAP 5.1', 'MANAGE 1.3'], 'ISO/IEC 42001': ['8.2', '8.4'], 'EU AI Act': ['Art 9'], 'Colorado AI Act': ['Risk Mgmt Program'] },
    indicator: { name: 'Open Risk Finding Resolution Rate', method: 'Risks closed / total identified per cycle', slo: '≥90% resolved within 30 days of target date' },
    implementation: 'Maintain AI Risk Register with threat, likelihood, impact, owner, and remediation deadline. Conduct quarterly reviews. Escalate critical findings to Board.' },
  { id: 3, code: 'CTRL-GRC-003', title: 'AI Policy & Standards Framework', riskTier: 'All Systems', priority: 'High', ccmDomain: 'GRC', status: 'Implemented', automation: 'manual',
    description: 'Authoritative policy hierarchy governing acceptable AI use, prohibited applications, and mandatory technical standards.',
    mappings: { 'NIST AI RMF': ['GOVERN 1.2', 'GOVERN 1.4'], 'ISO/IEC 42001': ['5.2', '7.5'], 'EU AI Act': ['Art 4'] },
    indicator: { name: 'Policy Coverage & Review Rate', method: 'Policies current (≤12 months) / total active policies', slo: '100% of policies reviewed annually' },
    implementation: 'Publish Acceptable Use Policy, Prohibited AI Use List, Data Governance for AI Standard, and Model Risk Standard. Review annually or after major regulatory updates.' },
  { id: 4, code: 'CTRL-GRC-004', title: 'AI Compliance Obligations Tracker', riskTier: 'All Systems', priority: 'High', ccmDomain: 'GRC', status: 'In Progress', automation: 'semi-automated',
    description: 'Centralized register mapping applicable legal and regulatory obligations (EU AI Act, GDPR, sector rules) to internal controls.',
    mappings: { 'NIST AI RMF': ['GOVERN 1.1'], 'ISO/IEC 42001': ['6.1.1', '9.3'], 'EU AI Act': ['Art 16', 'Art 49'] },
    indicator: { name: 'Obligations Mapped to Controls %', method: 'Obligations with ≥1 mapped control / total obligations', slo: '100%' },
    implementation: 'Maintain register in GRC platform. Tag each obligation with jurisdiction, effective date, control owners, and evidence cadence. Trigger gap analysis on new regulation.' },
  { id: 5, code: 'CTRL-DSP-001', title: 'AI Training Data Governance', riskTier: 'High-Risk', priority: 'Critical', ccmDomain: 'DSP', status: 'In Progress', automation: 'semi-automated',
    description: 'Formal data lineage, quality, and consent controls for datasets used in AI model training and fine-tuning.',
    mappings: { 'NIST AI RMF': ['MAP 2.3', 'MEASURE 2.10'], 'ISO/IEC 42001': ['8.3', '8.6'], 'EU AI Act': ['Art 10'] },
    indicator: { name: 'Training Dataset Documentation Coverage', method: 'Datasets with complete data cards / total training datasets', slo: '100% before model release' },
    implementation: 'Require data cards for all training datasets covering source, collection method, known biases, consent basis, and retention period. Scan for PII before ingestion.' },
  { id: 6, code: 'CTRL-DSP-002', title: 'Personal Data Minimization for AI', riskTier: 'High-Risk', priority: 'High', ccmDomain: 'DSP', status: 'Planned', automation: 'semi-automated',
    description: 'Enforce data minimization, purpose limitation, and storage restriction for personal data processed in AI pipelines.',
    mappings: { 'NIST AI RMF': ['MEASURE 2.10'], 'ISO/IEC 42001': ['8.3'], 'EU AI Act': ['Art 10'], 'GDPR': ['Art 5(1)(b)(c)(e)'] },
    indicator: { name: 'PII Retention Policy Compliance Rate', method: 'AI datasets within retention limits / total datasets', slo: '100%' },
    implementation: 'Apply automated PII scanning to training data pipelines. Enforce retention schedules via data catalog. Document legal basis for each personal data use in AI.' },
  { id: 7, code: 'CTRL-IAM-001', title: 'AI System Access Controls', riskTier: 'All Systems', priority: 'Critical', ccmDomain: 'IAM', status: 'Implemented', automation: 'automated',
    description: 'Role-based access controls (RBAC) enforcing least privilege for AI model endpoints, training infrastructure, and MLOps pipelines.',
    mappings: { 'NIST AI RMF': ['MEASURE 2.7'], 'ISO/IEC 42001': ['8.5'], 'CCM': ['IAM-01', 'IAM-02'], 'HIPAA': ['§164.312(a)(1)', '§164.312(a)(2)(i)', '§164.312(a)(2)(iii)', '§164.312(d)'], 'NHID-Clinical': ['Layer 3 — NHID-Auth v2'] },
    indicator: { name: 'Privileged Access Review Completion Rate', method: 'Accounts reviewed on schedule / total privileged accounts', slo: '100% quarterly' },
    implementation: 'Implement RBAC with model-owner, reviewer, deployer, and read-only roles. Enforce MFA on all privileged AI system access. Quarterly access recertification.' },
  { id: 8, code: 'CTRL-IAM-002', title: 'Non-Human Identity Governance for AI Agents', riskTier: 'High-Risk', priority: 'High', ccmDomain: 'IAM', status: 'Planned', automation: 'automated',
    description: 'Lifecycle management of service accounts, API keys, and machine identities used by AI agents and automated pipelines.',
    mappings: { 'NIST AI RMF': ['GOVERN 1.6', 'GOVERN 1.7', 'MEASURE 2.7'], 'ISO/IEC 42001': ['8.5'], 'EU AI Act': ['Art 17'], 'HIPAA': ['§164.312(a)(2)(i)', '§164.312(d)'] },
    indicator: { name: 'Orphaned Machine Identity Rate', method: 'Active machine identities with no owner / total machine identities', slo: '<1%' },
    implementation: 'Register all AI agent identities in PAM solution. Rotate API keys every 90 days. Automatically disable identities when agent is decommissioned.' },
  { id: 9, code: 'CTRL-LOG-001', title: 'AI Activity Logging & Traceability', riskTier: 'All Systems', priority: 'High', ccmDomain: 'LOG', status: 'In Progress', automation: 'automated',
    description: 'Comprehensive, tamper-evident audit logs for AI model inference requests, training runs, and configuration changes.',
    mappings: { 'NIST AI RMF': ['MEASURE 2.8'], 'ISO/IEC 42001': ['9.1'], 'EU AI Act': ['Art 12', 'Art 19'], 'HIPAA': ['§164.312(b)', '§164.312(c)(1)'] },
    indicator: { name: 'Audit Log Coverage Rate', method: 'AI systems with complete audit logs / total production AI systems', slo: '100%' },
    implementation: 'Configure structured logging for all inference calls (inputs, outputs, model version, user/session). Retain logs for minimum 3 years. Protect with WORM storage.' },
  { id: 10, code: 'CTRL-LOG-002', title: 'AI Performance & Drift Monitoring', riskTier: 'High-Risk', priority: 'High', ccmDomain: 'LOG', status: 'Planned', automation: 'automated',
    description: 'Continuous monitoring of model performance metrics and statistical drift indicators with automated alerting thresholds.',
    mappings: { 'NIST AI RMF': ['MEASURE 2.4', 'MANAGE 4.1'], 'ISO/IEC 42001': ['9.1'], 'EU AI Act': ['Art 9', 'Art 72'] },
    indicator: { name: 'Model Drift Alert Response Time', method: 'Time from drift alert to acknowledged investigation', slo: '<4 hours for critical, <24 hours for high' },
    implementation: 'Deploy monitoring for input distribution shift, prediction drift, and performance degradation. Set automated SLO breach alerts. Trigger re-evaluation workflow on threshold breach.' },
  { id: 11, code: 'CTRL-STA-001', title: 'AI Third-Party & Supplier Oversight', riskTier: 'High-Risk', priority: 'High', ccmDomain: 'STA', status: 'In Progress', automation: 'manual',
    description: 'Due diligence and contractual controls for AI vendors, foundation model providers, and data suppliers.',
    mappings: { 'NIST AI RMF': ['GOVERN 6.1', 'MANAGE 3.1'], 'ISO/IEC 42001': ['8.6'], 'EU AI Act': ['Art 25'] },
    indicator: { name: 'AI Vendor Risk Assessment Coverage', method: 'Critical AI vendors with completed risk assessments / total critical vendors', slo: '100% annually' },
    implementation: 'Conduct AI-specific vendor risk assessments. Require SLAs covering model update notifications, bias testing results, and security incident disclosure within 48 hours.' },
  { id: 12, code: 'CTRL-STA-002', title: 'AI Model Provenance & Documentation', riskTier: 'All Systems', priority: 'High', ccmDomain: 'STA', status: 'In Progress', automation: 'manual',
    description: 'Model cards and technical documentation capturing architecture, training data, evaluation results, and known limitations for all production AI models.',
    mappings: { 'NIST AI RMF': ['MAP 2.2', 'MEASURE 2.9'], 'ISO/IEC 42001': ['8.3', '8.4'], 'EU AI Act': ['Art 11', 'Ann IV'] },
    indicator: { name: 'Model Card Completeness Rate', method: 'Production models with approved model cards / total production models', slo: '100%' },
    implementation: 'Mandate model cards for all production deployments. Include: intended use, out-of-scope uses, evaluation benchmarks, fairness metrics, and contact for reporting issues.' },
  { id: 13, code: 'CTRL-STA-003', title: 'AI System Disclosure & Transparency Notice', riskTier: 'All Systems', priority: 'Medium', ccmDomain: 'STA', status: 'In Progress', automation: 'automated',
    description: 'User-facing disclosure that AI is involved in decisions or content generation, consistent with regulatory transparency requirements.',
    mappings: { 'NIST AI RMF': ['MEASURE 2.8', 'GOVERN 1.4'], 'ISO/IEC 42001': ['8.7'], 'EU AI Act': ['Art 50'], 'Singapore MGF': ['Transparency'], 'Colorado AI Act': ['Consumer Notice'] },
    indicator: { name: 'AI Disclosure Implementation Rate', method: 'User-facing AI touchpoints with disclosure / total touchpoints', slo: '100%' },
    implementation: 'Display plain-language AI disclosure at point of interaction. For GPAI-generated content include labeling. For chatbots, disclose AI nature at session start.' },
  { id: 14, code: 'CTRL-TVM-001', title: 'AI Adversarial Testing & Red-Teaming', riskTier: 'High-Risk', priority: 'Critical', ccmDomain: 'TVM', status: 'Planned', automation: 'manual',
    description: 'Structured adversarial testing program including red-teaming exercises targeting prompt injection, jailbreaks, model extraction, and harmful output generation.',
    mappings: { 'NIST AI RMF': ['MEASURE 2.7', 'MEASURE 2.6'], 'ISO/IEC 42001': ['8.4'], 'EU AI Act': ['Art 9', 'Art 55'], 'OWASP/ATLAS': ['LLM01', 'LLM02'], 'Singapore MGF': ['Testing & Assurance'] },
    indicator: { name: 'Pre-Release Red-Team Coverage Rate', method: 'High-risk AI systems red-teamed before deployment / total high-risk deployments', slo: '100%' },
    implementation: 'Conduct structured red-team exercises before each high-risk system deployment. Document attack surface, test scenarios, findings, and mitigations. Track remediation to closure.' },
  { id: 15, code: 'CTRL-TVM-002', title: 'AI Model Vulnerability Assessment', riskTier: 'All Systems', priority: 'High', ccmDomain: 'TVM', status: 'Planned', automation: 'semi-automated',
    description: 'Periodic assessment of AI model vulnerabilities including membership inference, model inversion, poisoning susceptibility, and supply chain risks in dependencies.',
    mappings: { 'NIST AI RMF': ['MEASURE 2.7', 'MAP 4.2'], 'ISO/IEC 42001': ['8.4'], 'CCM': ['TVM-01', 'TVM-02'], 'OWASP/ATLAS': ['ATLAS TA0001–TA0011'] },
    indicator: { name: 'Critical Vulnerability Remediation Rate', method: 'Critical AI vulns remediated within SLA / total critical vulns', slo: '100% within 30 days' },
    implementation: 'Run AI-specific vulnerability scans quarterly. Include dependency scanning of ML frameworks and model serving infrastructure. Track CVEs for all model serving libraries.' },
  { id: 16, code: 'CTRL-AA-001', title: 'AI Internal Audit Program', riskTier: 'High-Risk', priority: 'High', ccmDomain: 'A&A', status: 'Planned', automation: 'manual',
    description: 'Annual internal audit program verifying AI governance controls, model risk management practices, and regulatory compliance posture.',
    mappings: { 'NIST AI RMF': ['MEASURE 1.2', 'MEASURE 1.3', 'GOVERN 1.5'], 'ISO/IEC 42001': ['9.2'], 'EU AI Act': ['Art 17'] },
    indicator: { name: 'Audit Finding Remediation Rate', method: 'High/critical audit findings closed on time / total high/critical findings', slo: '≥95% within agreed remediation date' },
    implementation: 'Scope annual AI audit to cover governance structure, model risk, data governance, and incident history. Issue findings with risk ratings. Track remediation through to closure.' },
  { id: 17, code: 'CTRL-AA-002', title: 'AI Third-Party Audit & Attestation', riskTier: 'High-Risk', priority: 'Medium', ccmDomain: 'A&A', status: 'Planned', automation: 'manual',
    description: 'Independent external assessment or attestation of AI system controls, particularly for high-risk systems subject to regulatory scrutiny.',
    mappings: { 'NIST AI RMF': ['MEASURE 1.3'], 'ISO/IEC 42001': ['9.2'], 'EU AI Act': ['Art 43', 'Art 44'] },
    indicator: { name: 'External Attestation Currency', method: 'High-risk AI systems with current (≤12 month) external attestation / total', slo: '100% for unacceptable/high-risk systems' },
    implementation: 'Engage accredited conformity assessment body for EU AI Act high-risk system certifications. Schedule external penetration tests and model audit annually.' },
  { id: 18, code: 'CTRL-HRS-001', title: 'Human Override & Escalation Protocols', riskTier: 'High-Risk', priority: 'Critical', ccmDomain: 'HRS', status: 'Planned', automation: 'semi-automated',
    description: 'Defined and tested mechanisms for humans to monitor, intervene in, override, or shut down AI system operations without undue delay.',
    mappings: { 'NIST AI RMF': ['MANAGE 2.4', 'MAP 3.5', 'GOVERN 3.2'], 'ISO/IEC 42001': ['8.9'], 'EU AI Act': ['Art 9', 'Art 14'], 'Colorado AI Act': ['Appeal Rights'] },
    indicator: { name: 'Override Protocol Test Completion Rate', method: 'Scheduled override drills completed / planned drills', slo: '100% semi-annually' },
    implementation: 'Document override procedures per AI system. Implement kill-switch or circuit-breaker pattern for high-risk systems. Test override controls in staging semi-annually.' },
  { id: 19, code: 'CTRL-HRS-002', title: 'AI Workforce Competency & Ethics Training', riskTier: 'All Systems', priority: 'High', ccmDomain: 'HRS', status: 'In Progress', automation: 'manual',
    description: 'Role-based AI literacy, ethics, and governance training for all employees involved in AI development, deployment, or oversight.',
    mappings: { 'NIST AI RMF': ['GOVERN 2.2', 'MAP 3.4'], 'ISO/IEC 42001': ['7.2', '7.3'], 'EU AI Act': ['Art 4'] },
    indicator: { name: 'AI Training Completion Rate', method: 'Staff in AI roles with current training certification / total staff in AI roles', slo: '≥95% annually' },
    implementation: 'Develop role-tiered curriculum: AI Literacy (all staff), AI Ethics & Governance (practitioners), Model Risk (validators). Require annual recertification. Track in LMS.' },
  { id: 20, code: 'CTRL-AIS-001', title: 'AI API Security & Input Validation', riskTier: 'All Systems', priority: 'High', ccmDomain: 'AIS', status: 'In Progress', automation: 'automated',
    description: 'Input sanitization, rate limiting, and output filtering controls on AI model APIs to prevent abuse, prompt injection, and data exfiltration.',
    mappings: { 'NIST AI RMF': ['MEASURE 2.7', 'MANAGE 2.2'], 'ISO/IEC 42001': ['8.5'], 'CCM': ['AIS-01', 'AIS-04'] },
    indicator: { name: 'API Abuse Incident Rate', method: 'AI API security incidents per month per deployed endpoint', slo: '<1 per endpoint per quarter' },
    implementation: 'Implement input validation, max token limits, PII output scanning, and rate limiting on all AI API endpoints. Log all requests. Alert on anomalous patterns.' },
  { id: 21, code: 'CTRL-BCR-001', title: 'AI System Continuity & Recovery Planning', riskTier: 'All Systems', priority: 'Medium', ccmDomain: 'BCR', status: 'Planned', automation: 'manual',
    description: 'Business continuity and disaster recovery plans covering AI system outages, model rollback procedures, and fallback to non-AI processes.',
    mappings: { 'NIST AI RMF': ['MANAGE 2.4', 'MANAGE 2.1'], 'ISO/IEC 42001': ['8.8'], 'CCM': ['BCR-01', 'BCR-02'], 'HIPAA': ['§164.312(a)(2)(ii)'] },
    indicator: { name: 'AI System RTO Achievement Rate', method: 'AI system recoveries within defined RTO / total recovery events', slo: '≥99% within RTO' },
    implementation: 'Define RTO/RPO for each AI system by criticality. Implement model versioning enabling rapid rollback. Test failover to rule-based fallback for high-risk systems annually.' },
  { id: 22, code: 'CTRL-CCC-001', title: 'AI Model Change Management', riskTier: 'All Systems', priority: 'High', ccmDomain: 'CCC', status: 'In Progress', automation: 'semi-automated',
    description: 'Structured change management process governing model updates, retraining, version promotion, and configuration changes in AI production environments.',
    mappings: { 'NIST AI RMF': ['MANAGE 4.1', 'MANAGE 4.3'], 'ISO/IEC 42001': ['8.4'], 'CCM': ['CCC-01', 'CCC-04'] },
    indicator: { name: 'Unauthorized Production Change Rate', method: 'AI production changes without approved change record / total changes', slo: '0%' },
    implementation: 'Gate all model promotions through change advisory board (or automated policy check). Require impact assessment, rollback plan, and post-deployment monitoring for 72 hours.' },
  { id: 23, code: 'CTRL-CEK-001', title: 'AI Data Encryption & Key Management', riskTier: 'All Systems', priority: 'High', ccmDomain: 'CEK', status: 'Implemented', automation: 'automated',
    description: 'Encryption-at-rest and in-transit standards for AI training data, model weights, and inference payloads, with formal key management lifecycle.',
    mappings: { 'NIST AI RMF': ['MEASURE 2.7'], 'ISO/IEC 42001': ['8.5'], 'CCM': ['CEK-01', 'CEK-02', 'CEK-03'], 'HIPAA': ['§164.312(a)(2)(iv)', '§164.312(e)(1)', '§164.312(e)(2)(ii)'], 'NHID-Clinical': ['Layer 3 — NHID-Auth v2'] },
    indicator: { name: 'Encryption Standards Compliance Rate', method: 'AI data stores meeting encryption standard / total AI data stores', slo: '100%' },
    implementation: 'Enforce AES-256 at rest, TLS 1.3 in transit for all AI data. Store model weights in encrypted model registry. Rotate encryption keys annually. Audit key access quarterly.' },
  { id: 24, code: 'CTRL-DCS-001', title: 'AI Compute Environment Isolation', riskTier: 'All Systems', priority: 'Medium', ccmDomain: 'DCS', status: 'Implemented', automation: 'automated',
    description: 'Network segmentation and compute isolation controls separating AI training environments, inference infrastructure, and production data from development and internet exposure.',
    mappings: { 'NIST AI RMF': ['MEASURE 2.7'], 'ISO/IEC 42001': ['8.5'], 'CCM': ['DCS-01', 'DCS-06'] },
    indicator: { name: 'Environment Segregation Compliance Rate', method: 'AI environments with documented and validated isolation / total environments', slo: '100%' },
    implementation: 'Deploy AI training workloads in isolated VPCs without internet egress. Enforce GPU node isolation. Apply network micro-segmentation between inference and data tiers.' },
  { id: 25, code: 'CTRL-IPY-001', title: 'AI Model Portability & Interoperability', riskTier: 'All Systems', priority: 'Medium', ccmDomain: 'IPY', status: 'Planned', automation: 'manual',
    description: 'Open standards and export capabilities ensuring AI models and their associated data can be migrated across platforms without proprietary lock-in.',
    // No NIST AI RMF subcategory and no EU AI Act article addresses portability or
    // lock-in, so neither is cited.
    mappings: { 'ISO/IEC 42001': ['8.3'] },
    indicator: { name: 'Standard Format Adoption Rate', method: 'Models exportable in open format (ONNX/PMML) / total production models', slo: '≥80% of new models' },
    implementation: 'Require ONNX or equivalent open format export for all new model deployments. Document API contracts using OpenAPI. Avoid proprietary inference formats for high-risk systems.' },
  { id: 26, code: 'CTRL-SEF-001', title: 'AI Security Incident Response & Remediation', riskTier: 'High-Risk', priority: 'Critical', ccmDomain: 'SEF', status: 'Planned', automation: 'semi-automated',
    description: 'AI-specific incident response playbooks covering model manipulation, harmful output events, data poisoning, and regulatory breach notifications.',
    mappings: { 'NIST AI RMF': ['MANAGE 4.3', 'GOVERN 4.3'], 'ISO/IEC 42001': ['10.1'], 'EU AI Act': ['Art 73', 'Art 74'] },
    indicator: { name: 'AI Incident Response Time-to-Contain', method: 'Median time from detection to containment action for AI security incidents', slo: '<2 hours for critical AI incidents' },
    implementation: 'Develop AI-specific IR playbooks: prompt injection, model extraction, bias incident, regulatory breach. Tabletop exercise annually. EU AI Act serious incident notifications within 15 days.' },
  { id: 27, code: 'CTRL-UEM-001', title: 'AI Agent Endpoint Registration & Control', riskTier: 'All Systems', priority: 'High', ccmDomain: 'UEM', status: 'Planned', automation: 'automated',
    description: 'Registration and behavioral controls for AI agents, bots, and autonomous systems accessing organizational resources or external APIs.',
    mappings: { 'NIST AI RMF': ['GOVERN 1.6', 'MEASURE 2.4'], 'ISO/IEC 42001': ['8.5'], 'CCM': ['UEM-01', 'UEM-06'] },
    indicator: { name: 'Registered AI Agent Coverage Rate', method: 'AI agents registered in endpoint inventory / total discovered agents', slo: '100%' },
    implementation: 'Maintain registry of all AI agents with owner, purpose, data access scope, and external API permissions. Enforce allow-list for external API calls. Audit agent activity monthly.' },
];

export interface TimelineEvent {
  date: string;
  label: string;
  status: 'past' | 'current' | 'upcoming';
  detail: string;
  source?: SourceRef;
}

export const TIMELINE_EVENTS: TimelineEvent[] = [
  { date: '2024-08-01', label: 'EU AI Act entered into force', status: 'past', detail: 'Regulation (EU) 2024/1689 published and in force.', source: { tier: 'primary', citation: 'Regulation (EU) 2024/1689 (AI Act)', provision: 'Art. 113', url: OJ_AI_ACT, checked: '2026-10-01' } },
  { date: '2025-01-20', label: 'US: EO 14110 revoked', status: 'past', detail: 'Federal policy (non-binding on private deployers): the 2023 Safe, Secure & Trustworthy AI executive order was rescinded, ending its model safety-reporting and agency Chief AI Officer directives.', source: { tier: 'primary', citation: 'Executive Order 14148, Initial Rescissions of Harmful Executive Orders and Actions (signed 20 January 2025), 90 FR 8237 (28 January 2025)', provision: 'Sec. 2(ggg)', url: 'https://www.federalregister.gov/documents/2025/01/28/2025-01901/initial-rescissions-of-harmful-executive-orders-and-actions', checked: '2026-11-14', note: 'Revocation line read in the Federal Register. The description of what the revoked order had directed is this register\'s summary, not text from EO 14148.' } },
  { date: '2025-01-23', label: 'US: EO 14179 — Removing Barriers to American Leadership in AI', status: 'past', detail: 'Federal policy: directs an AI Action Plan and rollback of EO 14110-era actions. Aimed at federal agencies — not enforceable law on private deployers.', source: { tier: 'primary', citation: 'Executive Order 14179, 90 FR 8741 (31 Jan 2025)', url: 'https://www.federalregister.gov/documents/2025/01/31/2025-02172/removing-barriers-to-american-leadership-in-artificial-intelligence', checked: '2026-10-01' } },
  { date: '2025-02-02', label: 'Prohibited practices & AI literacy', status: 'past', detail: '8 banned practices enforced; AI literacy obligations for providers begin.', source: { tier: 'primary', citation: 'Regulation (EU) 2024/1689 (AI Act)', provision: 'Art. 5 & Art. 113(a)', url: OJ_AI_ACT, checked: '2026-10-01' } },
  { date: '2025-08-02', label: 'GPAI governance rules applicable', status: 'past', detail: 'General-purpose AI model obligations, Code of Practice, training-data summary template.', source: { tier: 'primary', citation: 'Regulation (EU) 2024/1689 (AI Act)', provision: 'Ch. V & Art. 113(b)', url: OJ_AI_ACT, checked: '2026-10-01' } },
  { date: '2026-01-01', label: 'California: frontier-model transparency law operative', status: 'past', detail: 'The Transparency in Frontier Artificial Intelligence Act (SB 53) becomes operative. It binds large developers of frontier models to publish a safety framework, report critical incidents, and protect whistleblowers. Chaptered 29 Sep 2025 with no urgency clause, so California\u2019s default 1 January operative date applies.', source: { tier: 'primary', citation: 'California SB 53 (2025\u20132026) \u2014 Chapter 138, Statutes of 2025; Bus. & Prof. Code ch. 25.1 (\u00a722757.10 et seq.)', url: 'https://leginfo.legislature.ca.gov/faces/billStatusClient.xhtml?bill_id=202520260SB53', checked: '2026-10-17', note: 'Chaptering date and codified sections read from the California Legislature\u2019s own bill record. The 1 January 2026 operative date follows from the default rule for a non-urgency statute rather than from an express date in the bill.' } },
  { date: '2026-03-20', label: 'US: National Policy Framework for AI (preemption proposal)', status: 'past', detail: 'Federal policy proposal: White House legislative recommendations to Congress calling for preemption of state AI laws that impose undue burdens. A proposal — creates no legal obligations and is pending Congress.', source: { tier: 'official-guidance', citation: 'The White House, A National Policy Framework for Artificial Intelligence: Legislative Recommendations (20 March 2026)', provision: 'Legislative recommendations on preempting state AI laws', url: 'https://www.whitehouse.gov/wp-content/uploads/2026/03/03.20.26-National-Policy-Framework-for-Artificial-Intelligence-Legislative-Recommendations.pdf', checked: '2026-11-14', note: 'A policy proposal, not law. Reconciled against excerpts of the White House PDF and the accompanying release of 20 March 2026; the document was not read in full, and it was not checked whether it names particular states.' } },
  { date: '2026-06-02', label: 'US: EO 14409 — voluntary frontier-model early access', status: 'past', detail: 'Federal policy: directs agencies to design a voluntary framework under which developers could give the government access to "covered frontier models" for up to 30 days before wider release, and states that nothing in it authorizes mandatory licensing, preclearance or permitting. Non-binding on private deployers.', source: { tier: 'primary', citation: 'Executive Order 14409, Promoting Advanced Artificial Intelligence Innovation and Security (signed 2 June 2026), 91 FR 34565 (5 June 2026)', provision: 'Sec. 3(b)(ii), 3(c); Sec. 5(c)', url: 'https://www.federalregister.gov/documents/2026/06/05/2026-11415/promoting-advanced-artificial-intelligence-innovation-and-security', checked: '2026-11-14', note: 'Read in the Federal Register. The order directs agencies to design the voluntary framework within 60 days; it does not itself put the framework into operation.' } },
  { date: '2026-07-27', label: 'AI Omnibus in force', status: 'past', detail: 'Regulation (EU) 2026/1744 deferred Annex III high-risk application to 2 Dec 2027 and product-integrated high-risk to 2 Aug 2028. It did not defer Article 50.', source: { tier: 'secondary', citation: 'Regulation (EU) 2026/1744 (Digital Omnibus on AI)', url: 'https://eur-lex.europa.eu/eli/reg/2026/1744/oj', checked: '2026-10-01', note: OMNIBUS_RECONCILED } },
  { date: '2026-08-02', label: 'Article 50 transparency in force', status: 'past', detail: 'Disclosure duties for interactive AI, including voice agents, apply. Machine-readable marking applies immediately to systems placed on the market from this date. Pre-existing generative systems have until 2 Dec 2026 for the Article 50(2) marking duty.', source: { tier: 'official-guidance', citation: 'European Commission — Transparency obligations under Article 50 of the AI Act (FAQ)', provision: 'Art. 50', url: EC_ART50_FAQ, checked: '2026-10-01' } },
  { date: '2026-09-30', label: 'California: AI Transparency Act amended (SB 1000)', status: 'past', detail: 'SB 1000 amends the California AI Transparency Act \u2014 Business and Professions Code sections 22757.1 to 22757.5, adding section 22757.4.1. It carried an urgency clause, so it took effect on chaptering rather than the following January. The substance of the amendments has not been reconciled against the chaptered text.', source: { tier: 'primary', citation: 'California SB 1000 (2025\u20132026) \u2014 Chapter 861, Statutes of 2026', url: 'https://leginfo.legislature.ca.gov/faces/billStatusClient.xhtml?bill_id=202520260SB1000', checked: '2026-10-17', note: 'Chaptered date, chapter number, urgency status and the list of amended sections are from the California Legislature\u2019s own bill record. What the amendments change in substance was not read.' } },
  { date: '2026-10-16', label: 'US: joint key practices for SI control incidents', status: 'current', detail: 'NIST CAISSI, NSA SISC and CISA published ten voluntary practices for incident readiness and response during super intelligence training and evaluation, spanning prepare, detect, respond, recover and report, with NIST CSF 2.0 subcategory references throughout. Voluntary guidance — it imposes no legal obligation on developers or deployers.', source: { tier: 'official-guidance', citation: 'NIST CAISSI, NSA SISC & CISA — Key Practices for Incident Readiness and Response in Super Intelligence Training and Evaluation (PP-26-4396, Ver 1.0)', url: 'https://www.nist.gov/news-events/news/2026/10/key-practices-incident-readiness-and-response-super-intelligence-training', checked: '2026-10-16', note: 'Publication date taken from the NIST and CISA landing pages, both of which read 16 October 2026. Title quoted as published.' } },
  { date: '2026-12-02', label: 'Marking grace ends; new Article 5 prohibitions', status: 'upcoming', detail: 'Grace period ends for Article 50(2) marking on generative systems already on the market before 2 Aug 2026. The AI Omnibus prohibition on systems that generate non-consensual intimate imagery or child sexual abuse material also applies from this date.', source: { tier: 'official-guidance', citation: 'European Commission — Transparency obligations under Article 50 of the AI Act (FAQ)', provision: 'Art. 50(2)', url: EC_ART50_FAQ, checked: '2026-10-01', note: 'The new Art. 5 prohibition on systems generating non-consensual intimate imagery or CSAM is attributed to Regulation (EU) 2026/1744 and was reconciled against commentary, not the Official Journal text.' } },
  { date: '2027-01-01', label: 'Colorado ADMT obligations applicable', status: 'upcoming', detail: 'SB 26-189 (signed 14 May 2026) repealed and re-enacted the SB 24-205 provisions before they became operative; its ADMT documentation, notice and adverse-outcome disclosure duties apply to consequential decisions made on or after this date.', source: { tier: 'primary', citation: 'Colorado Senate Bill 26-189, Automated Decision-Making Technology (signed 14 May 2026; Session Laws 2026, ch. 131)', provision: 'C.R.S. § 6-1-1702(1); applicability clause', url: 'https://leg.colorado.gov/bills/sb26-189', checked: '2026-11-14', note: 'Read in the signed act: it applies to consequential decisions made on or after 1 January 2027.' } },
  { date: '2027-12-02', label: 'Annex III high-risk systems applicable', status: 'upcoming', detail: 'Standalone high-risk systems listed in Annex III, including employment, education, and critical infrastructure, apply from this date under Regulation (EU) 2026/1744.', source: { tier: 'secondary', citation: 'Regulation (EU) 2026/1744 (Digital Omnibus on AI)', url: 'https://eur-lex.europa.eu/eli/reg/2026/1744/oj', checked: '2026-10-01', note: OMNIBUS_RECONCILED } },
  { date: '2028-08-02', label: 'Product-integrated high-risk systems applicable', status: 'upcoming', detail: 'High-risk AI systems integrated into products already covered by EU product safety law apply from this date under Regulation (EU) 2026/1744.', source: { tier: 'secondary', citation: 'Regulation (EU) 2026/1744 (Digital Omnibus on AI)', url: 'https://eur-lex.europa.eu/eli/reg/2026/1744/oj', checked: '2026-10-01', note: OMNIBUS_RECONCILED } },
];

/** Ordered low -> high. Index + 1 is the band rank used by the residual formula. */
export const RISK_BANDS = ['cool', 'mild', 'warm', 'hot'] as const;
export type RiskBand = (typeof RISK_BANDS)[number];

export const RISK_BAND_LABEL: Record<RiskBand, string> = {
  cool: 'Low',
  mild: 'Moderate',
  warm: 'Elevated',
  hot: 'Critical',
};

/**
 * AI use cases and risk domains are not a new taxonomy imposed on the register —
 * they are read out of the 25 scenarios that already exist, so the Risk matrix
 * re-plots real records rather than inventing rows. Combinations with no scenario
 * stay genuinely empty and render as "No data", never as low risk.
 */
export const RISK_USE_CASES = [
  'Voice agent',
  'Call handling',
  'Speech recognition',
  'Clinical triage',
  'Governance & assurance',
] as const;
export type RiskUseCase = (typeof RISK_USE_CASES)[number];

export const RISK_DOMAINS = [
  'Transparency',
  'Human oversight',
  'Data governance',
  'Audit & traceability',
  'Monitoring & drift',
  'Documentation',
  'Lawfulness & conformance',
] as const;
export type RiskDomain = (typeof RISK_DOMAINS)[number];

export interface HeatmapCell {
  likelihoodIndex: number;
  impactIndex: number;
  /** Inherent band, before any control credit. Hand-authored; never computed. */
  level: RiskBand;
  label: string;
  obligationId: string;
  useCase: RiskUseCase;
  riskDomain: RiskDomain;
}

export const HEATMAP_LIKELIHOODS = ['Rare', 'Unlikely', 'Possible', 'Likely', 'Almost Certain'];
export const HEATMAP_IMPACTS = ['Negligible', 'Minor', 'Moderate', 'Significant', 'Severe'];

export const HEATMAP_CELLS: HeatmapCell[] = [
  // "transparency" not "disclosure" — in this app disclosure means IDG-01 caller
  // disclosure; this cell is about model/provider transparency (EU GPAI duty).
  { likelihoodIndex: 0, impactIndex: 0, level: 'cool', label: 'ASR model transparency gap', obligationId: 'obl7', useCase: 'Speech recognition', riskDomain: 'Transparency' },
  // Anchored to the binding HIPAA audit-controls duty rather than the generic
  // ISO Clause 7.5 documentation duty it previously pointed at.
  { likelihoodIndex: 0, impactIndex: 1, level: 'cool', label: 'Call log retention lapse', obligationId: 'obl29', useCase: 'Call handling', riskDomain: 'Audit & traceability' },
  { likelihoodIndex: 0, impactIndex: 2, level: 'mild', label: 'Undetected triage drift', obligationId: 'obl14', useCase: 'Clinical triage', riskDomain: 'Monitoring & drift' },
  // Vendor technical documentation is the EU high-risk documentation duty, not
  // prohibited-practices screening (obl8), which this previously pointed at.
  { likelihoodIndex: 0, impactIndex: 3, level: 'mild', label: 'ASR vendor documentation gap', obligationId: 'obl6', useCase: 'Speech recognition', riskDomain: 'Documentation' },
  { likelihoodIndex: 0, impactIndex: 4, level: 'warm', label: 'Undisclosed AI voice agent', obligationId: 'obl1', useCase: 'Voice agent', riskDomain: 'Transparency' },
  { likelihoodIndex: 1, impactIndex: 0, level: 'cool', label: 'Stale voice-agent inventory', obligationId: 'obl13', useCase: 'Voice agent', riskDomain: 'Documentation' },
  { likelihoodIndex: 1, impactIndex: 1, level: 'mild', label: 'Incomplete call audit trail', obligationId: 'obl3', useCase: 'Call handling', riskDomain: 'Audit & traceability' },
  { likelihoodIndex: 1, impactIndex: 2, level: 'mild', label: 'Weak call monitoring config', obligationId: 'obl12', useCase: 'Call handling', riskDomain: 'Monitoring & drift' },
  { likelihoodIndex: 1, impactIndex: 3, level: 'warm', label: 'Unvetted third-party ASR model', obligationId: 'obl5', useCase: 'Speech recognition', riskDomain: 'Data governance' },
  { likelihoodIndex: 1, impactIndex: 4, level: 'hot', label: "Patient not told it's AI", obligationId: 'obl1', useCase: 'Voice agent', riskDomain: 'Transparency' },
  { likelihoodIndex: 2, impactIndex: 0, level: 'mild', label: 'Triage policy not updated', obligationId: 'obl11', useCase: 'Clinical triage', riskDomain: 'Documentation' },
  { likelihoodIndex: 2, impactIndex: 1, level: 'mild', label: 'Call logs not retained', obligationId: 'obl3', useCase: 'Call handling', riskDomain: 'Audit & traceability' },
  { likelihoodIndex: 2, impactIndex: 2, level: 'warm', label: 'Drift in triage model', obligationId: 'obl4', useCase: 'Clinical triage', riskDomain: 'Monitoring & drift' },
  { likelihoodIndex: 2, impactIndex: 3, level: 'warm', label: 'Clinician oversight bypassed', obligationId: 'obl2', useCase: 'Clinical triage', riskDomain: 'Human oversight' },
  { likelihoodIndex: 2, impactIndex: 4, level: 'hot', label: 'Triage system non-compliant', obligationId: 'obl4', useCase: 'Clinical triage', riskDomain: 'Lawfulness & conformance' },
  { likelihoodIndex: 3, impactIndex: 0, level: 'mild', label: 'Compliance review missed', obligationId: 'obl12', useCase: 'Governance & assurance', riskDomain: 'Lawfulness & conformance' },
  { likelihoodIndex: 3, impactIndex: 1, level: 'warm', label: 'Adverse event unreported', obligationId: 'obl8', useCase: 'Governance & assurance', riskDomain: 'Audit & traceability' },
  { likelihoodIndex: 3, impactIndex: 2, level: 'warm', label: 'Clinical data quality gap', obligationId: 'obl5', useCase: 'Clinical triage', riskDomain: 'Data governance' },
  { likelihoodIndex: 3, impactIndex: 3, level: 'hot', label: 'Clinician override ignored', obligationId: 'obl2', useCase: 'Clinical triage', riskDomain: 'Human oversight' },
  { likelihoodIndex: 3, impactIndex: 4, level: 'hot', label: 'Diagnostic bias detected', obligationId: 'obl16', useCase: 'Clinical triage', riskDomain: 'Data governance' },
  { likelihoodIndex: 4, impactIndex: 0, level: 'warm', label: 'Conformance audit overdue', obligationId: 'obl12', useCase: 'Governance & assurance', riskDomain: 'Lawfulness & conformance' },
  { likelihoodIndex: 4, impactIndex: 1, level: 'warm', label: 'Call recording breach', obligationId: 'obl16', useCase: 'Call handling', riskDomain: 'Data governance' },
  { likelihoodIndex: 4, impactIndex: 2, level: 'hot', label: 'Banned AI triage practice', obligationId: 'obl8', useCase: 'Clinical triage', riskDomain: 'Lawfulness & conformance' },
  { likelihoodIndex: 4, impactIndex: 3, level: 'hot', label: 'No clinician escalation', obligationId: 'obl2', useCase: 'Voice agent', riskDomain: 'Human oversight' },
  { likelihoodIndex: 4, impactIndex: 4, level: 'hot', label: 'Catastrophic triage failure', obligationId: 'obl4', useCase: 'Clinical triage', riskDomain: 'Lawfulness & conformance' },
];

export const CROSSWALK_TOPICS = {
  title: 'Obligation Topic × Framework Matrix',
  // NIST cells cite subcategories (verified against the Playbook); '—' where none fits.
  headers: ['Topic', 'EU AI Act', 'ISO 42001', 'NIST RMF', 'OECD', 'Singapore MGF', 'OWASP/ATLAS', 'Colorado AI Act'],
  rows: [
    ['Transparency', 'Mandatory (Art 50)', '—', 'MEASURE 2.8', 'Principle 3', 'Provenance & Reporting', '—', 'Consumer Notice'],
    ['Human Oversight', 'Mandatory (Art 14)', '—', 'GOVERN 3.2, MAP 3.5', 'Principle 5', '—', '—', 'Appeal Rights'],
    ['Risk Management', 'Mandatory (Art 9)', 'Clause 6', 'GOVERN 1.4, MANAGE 1.3', 'Principle 5', '—', '—', 'Risk Mgmt Program'],
    ['Documentation', 'Mandatory (Art 11)', 'Clause 7.5', 'MAP 2.2', '—', '—', '—', '—'],
    ['Data Governance', 'Mandatory (Art 10)', 'Clause 8', 'MAP 2.3', '—', '—', '—', '—'],
    ['Cybersecurity', 'Mandatory (Art 15)', 'Clause 8', 'MEASURE 2.7', 'Principle 4', 'Security', 'LLM Top 10', '—'],
    ['Monitoring', 'Mandatory (Art 72)', 'Clause 9', 'MEASURE 2.4, MANAGE 4.1', 'Principle 5', '—', '—', '—'],
    ['Incident Response', 'Mandatory (Art 73)', 'Clause 10', 'MANAGE 4.3', '—', 'Incident Reporting', '—', '—'],
    ['Testing & Evaluation', '—', '—', 'MEASURE 2.1, MEASURE 2.3', '—', 'Testing & Assurance', 'ATLAS TTPs', '—'],
    ['GPAI / Model', 'Mandatory (Chapter V)', '—', 'MANAGE 3.2', '—', '—', '—', '—'],
    ['Prohibited Practices', 'Mandatory (Art 5)', '—', '—', 'Principle 2', '—', '—', '—'],
  ] as const,
};

export const CROSSWALK_ACTORS = {
  title: 'Actor Obligations Under EU AI Act',
  headers: ['Obligation Area', 'Provider', 'Deployer', 'Importer', 'Distributor'],
  rows: [
    ['Risk Management', 'Full', 'Oversight', 'Verify', 'Check'],
    ['Technical Documentation', 'Maintain', 'Provide', 'Ensure', '—'],
    ['Transparency Disclosure', 'Implement', 'Display', 'Verify', 'Pass-through'],
    ['Human Oversight', 'Design', 'Assign', 'Confirm', '—'],
    ['Logging & Traceability', 'Build', 'Monitor', 'Review', '—'],
    ['Post-Market Monitoring', 'Conduct', 'Report', 'Relay', 'Notify'],
    ['Incident Reporting', 'Notify', 'Escalate', 'Forward', 'Inform'],
  ] as const,
};

export interface NhidLayer {
  layer: number;
  title: string;
  scope: string;
  isCore?: boolean;
}

export const NHID_LAYERS: NhidLayer[] = [
  { layer: 0, title: 'NPI Registry', scope: 'No delegation proof, no call-time authorization.' },
  { layer: 1, title: 'STIR/SHAKEN', scope: 'Carrier attestation (A/B/C levels) — verifies phone number origin only.' },
  { layer: 2, title: 'NHID-Clinical v1.3 — Behavioral Baseline', scope: 'Identity disclosure before protected data, no claim of human status, human handoff, audit trace.', isCore: true },
  { layer: 3, title: 'NHID-Auth v2', scope: 'Cryptographic authorization layer: Ed25519 delegation chain + DPoP call-nonce binding (reference implementation, CC BY 4.0).' },
  { layer: 4, title: 'FHIR AuditEvent R4', scope: 'Healthcare-native structured logging (HL7 base spec v4.0.1); no named Implementation Guide (e.g. IHE BALP) conformance claimed.' },
  { layer: 5, title: 'OpenTelemetry → SIEM', scope: 'Spans forwarded to enterprise observability / security pipeline.' },
];

// Evidence / maturity level for a control. NHID-Clinical is an open reference
// implementation with a simulator, so its controls are honestly 'Prototype / Simulation
// only' — the higher levels exist so the scale can extend to controls with real deployment
// evidence later, without ever overstating NHID's current maturity.
export type EvidenceLevel =
  | 'Prototype / Simulation only'
  | 'Framework-level'
  | 'Some production usage'
  | 'Strong evidence';

export interface NhidConformanceControl {
  code: string;
  /**
   * Four controls gate what the agent may do on a call; ATR-01 records what
   * happened. Collapsing the two would imply the audit trail can stop a call.
   */
  kind: 'behavioral gate' | 'evidence';
  requirement: string;
  status: 'Conformant';
  evidence: EvidenceLevel;
  indicator: ControlIndicator;
  implementation: string;
}

export const NHID_CONFORMANCE_CONTROLS: NhidConformanceControl[] = [
  {
    code: 'IDG-01',
    kind: 'behavioral gate',
    requirement: 'Identity Disclosure Gate — disclose non-human identity before any PHI exchange',
    status: 'Conformant',
    evidence: 'Prototype / Simulation only',
    indicator: { name: 'Pre-Exchange Disclosure Rate', method: 'Calls with disclosure timestamp before first data exchange / total calls', slo: '100% of calls' },
    implementation: 'The agent states that it is automated before requesting or sharing any PHI. A disclosure counts only if it was heard; an interrupted one does not. The control shows the agent said it is automated, not that its claims are true.',
  },
  {
    code: 'PDX-01',
    kind: 'behavioral gate',
    requirement: 'Pre-Data Exchange Gate — no protected data until identity is disclosed',
    status: 'Conformant',
    evidence: 'Prototype / Simulation only',
    indicator: { name: 'Pre-Disclosure Data Request Rate', method: 'Calls where protected data is requested or shared before identity disclosure / total calls', slo: '0 calls; impersonation latency of zero turns' },
    implementation: 'The gate holds protected data (PHI, eligibility, claim status) until the agent has disclosed its identity, closing the impersonation-latency window. Disclosure in the same turn as the request still fails. Disclosure is not authorization: authority to receive the data is checked separately.',
  },
  {
    code: 'DBC-01',
    kind: 'behavioral gate',
    requirement: 'Deceptive Behavior Check — no claim of human status or licensed-professional standing',
    status: 'Conformant',
    evidence: 'Prototype / Simulation only',
    indicator: { name: 'Human-Status Claim Rate', method: 'Calls whose transcript contains an explicit or implied claim to be human or a licensed professional / total calls', slo: '0 flagged per 1,000 calls' },
    implementation: 'Judged on the agent\'s own words in the transcript: no explicit or implied claim to be human or to hold a professional licence. Non-blocking: a finding is logged and routed to human review. Acoustic detection is not claimed.',
  },
  {
    code: 'EIT-01',
    kind: 'behavioral gate',
    requirement: 'Escalation Implementation Test — a clear human-handoff path, honored on request',
    status: 'Conformant',
    evidence: 'Prototype / Simulation only',
    indicator: { name: 'Handoff Honor Rate', method: 'Handoff requests routed to a human / total handoff requests', slo: '100%, median handoff time < 60s' },
    implementation: 'A request for a human (e.g. "speak to a person") is honored through a clear handoff path. A handoff counts only when it is recorded with a timestamp and an outcome.',
  },
  {
    code: 'ATR-01',
    kind: 'evidence',
    requirement: 'Audit Trail Requirements — every interaction produces a machine-readable trace',
    status: 'Conformant',
    evidence: 'Prototype / Simulation only',
    indicator: { name: 'Audit Trace Completeness Rate', method: 'Calls with a complete machine-readable trace (disclosure, handoff, decisions) / total calls', slo: '100% of calls traced' },
    implementation: 'Every interaction produces a machine-readable trace recording what the other four controls decided. The trace changes no behavior, and logging an event does not authorize disclosure.',
  },
];

export const NHID_EVENT_TRACE = {
  call_id: 'nhid-call-2026-06-04-001',
  agent_id: 'brianna-voice-agent-v3',
  start_time: '2026-06-04T09:12:00Z',
  disclosure_time: '2026-06-04T09:12:02Z',
  disclosure_text: "I'm an automated assistant from Dr. Smith's office.",
  phi_requested_before_disclosure: false,
  operational_data_exchanged: '09:12:08Z',
  human_handoff_requested: true,
  handoff_time: '2026-06-04T09:12:22Z',
  audit_log_complete: true,
  human_status_claim_detected: false,
  decision: 'CONTINUE_AI',
};

export const NHID_EVENT_TRACE_FAIL = {
  call_id: 'nhid-call-2026-06-11-047',
  agent_id: 'brianna-voice-agent-v3',
  start_time: '2026-06-11T14:03:00Z',
  disclosure_time: null,
  disclosure_text: '',
  phi_requested_before_disclosure: true,
  operational_data_exchanged: '14:03:05Z',
  human_handoff_requested: true,
  handoff_time: null,
  audit_log_complete: false,
  human_status_claim_detected: true,
  decision: 'DENY_DATA',
};

export const NHID_SIMULATOR_URL = 'https://nhid-clinical.org/gov-sim.html?scenario=spoofed-identity';

export function daysUntil(dateStr: string): number {
  const [y, m, d] = dateStr.split('-').map(Number);
  const target = new Date(y, m - 1, d);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / 86400000);
}

export interface SourceCoverage {
  total: number;
  sourced: number;
  unsourced: number;
  byTier: Record<EvidenceTier, number>;
}

/**
 * Audits the register against itself. Used to publish the tool's own evidence
 * gap on the dashboard instead of leaving the reader to assume every row is
 * equally well attested.
 */
export function sourceCoverage(rows: { source?: SourceRef }[]): SourceCoverage {
  const byTier: Record<EvidenceTier, number> = { primary: 0, 'official-guidance': 0, secondary: 0 };
  let sourced = 0;
  for (const row of rows) {
    if (!row.source) continue;
    sourced += 1;
    byTier[row.source.tier] += 1;
  }
  return { total: rows.length, sourced, unsourced: rows.length - sourced, byTier };
}

// ---------------------------------------------------------------------------
// Freshness.
//
// Every sourced row records the date it was last reconciled against its
// document. Sourcing says "this came from somewhere"; freshness says "and
// someone checked it recently". The second is the one a reader actually needs
// before trusting a date, and it decays on its own.
//
// A stale flag only builds trust if stale rows actually get re-checked. If
// they do not, it turns into a wall of warnings that trains readers to ignore
// the one signal it exists to protect. So the threshold is generous, stale is
// shown in amber rather than red, and the register publishes its oldest rows
// first — which doubles as the maintainer's work queue.
// ---------------------------------------------------------------------------

/** Rows not reconciled in roughly six months are flagged stale. */
export const STALE_AFTER_DAYS = 183;

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export const todayISO = () => new Date().toISOString().slice(0, 10);

/** Whole days since a row was reconciled. NaN when the date is not ISO. */
export function reconciledAgeDays(checked: string, today: string = todayISO()): number {
  if (!ISO_DATE.test(checked) || !ISO_DATE.test(today)) return NaN;
  const ms = Date.parse(`${today}T00:00:00Z`) - Date.parse(`${checked}T00:00:00Z`);
  return Math.max(0, Math.round(ms / 86_400_000));
}

export const isStale = (days: number) => Number.isFinite(days) && days > STALE_AFTER_DAYS;

/** "today", "16d ago", "7mo ago", "2y ago". */
export function formatAge(days: number): string {
  if (!Number.isFinite(days)) return 'date unknown';
  if (days < 1) return 'today';
  if (days < 60) return `${days}d ago`;
  if (days < 730) return `${Math.round(days / 30.44)}mo ago`;
  return `${Math.round(days / 365.25)}y ago`;
}

export interface FreshnessRow {
  label: string;
  checked: string;
  days: number;
  stale: boolean;
}

export interface Freshness {
  /** Rows with a source, and so with a reconciliation date to age. */
  sourced: number;
  fresh: number;
  stale: number;
  /** Every sourced row, oldest reconciliation first. */
  oldestFirst: FreshnessRow[];
}

/**
 * Ages a set of rows by their last reconciliation. Unsourced rows are left out
 * on purpose: they are not stale, they were never checked at all, and the
 * evidence-coverage count already publishes them as their own gap.
 */
export function freshness<T extends { source?: SourceRef }>(
  rows: T[],
  labelOf: (row: T) => string,
  today: string = todayISO(),
): Freshness {
  const aged: FreshnessRow[] = [];
  for (const row of rows) {
    if (!row.source) continue;
    const days = reconciledAgeDays(row.source.checked, today);
    aged.push({ label: labelOf(row), checked: row.source.checked, days, stale: isStale(days) });
  }
  aged.sort((a, b) => (b.days || 0) - (a.days || 0) || a.label.localeCompare(b.label));
  const stale = aged.filter((r) => r.stale).length;
  return { sourced: aged.length, fresh: aged.length - stale, stale, oldestFirst: aged };
}
