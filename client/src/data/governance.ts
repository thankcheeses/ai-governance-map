// Canonical data layer for the AI Governance Map.
// Frameworks/obligations/timeline/heatmap/NHID content ported from the
// original static index.html; control definitions ported from the richer
// complianceData previously embedded in pages/GovernanceMap.tsx, merged with
// the status/automation fields from index.html's controls list (zipped by
// CCM domain order — both lists share the same 27-control sequence).

export interface Framework {
  slug: string;
  shortCode: 'EU' | 'ISO' | 'NIST' | 'OECD' | 'SG' | 'OWASP' | 'CO' | 'HIPAA' | 'CA' | 'IL' | 'NY' | 'TX' | 'UT';
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
    summary: 'Risk-based legal framework. Prohibited practices from Feb 2025, GPAI rules from Aug 2025, transparency from Aug 2026, high-risk from Dec 2027.',
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
    slug: 'colorado-ai-act', shortCode: 'CO', name: 'Colorado AI Act (SB 24-205)',
    type: 'Regulation (Binding)', jurisdiction: 'Colorado, USA', version: 'SB 24-205', coverage: 35,
    summary: 'State-level binding law requiring algorithmic discrimination risk management and consumer notice for high-risk AI systems used in consequential decisions.',
  },
  {
    slug: 'hipaa-security-rule', shortCode: 'HIPAA', name: 'HIPAA Security Rule',
    type: 'Regulation (Binding)', jurisdiction: 'US', version: '45 CFR §164.312 (Technical Safeguards)', coverage: 30,
    summary: 'Binding US healthcare privacy law. Scoped here to the Technical Safeguards — access control, audit controls, integrity, authentication, and transmission security for systems that touch ePHI.',
  },
  {
    slug: 'california-ai-transparency-act', shortCode: 'CA', name: 'California AI Transparency Act (SB 942)',
    type: 'Regulation (Binding)', jurisdiction: 'California, USA', version: 'SB 942', coverage: 32,
    summary: 'State-level binding law requiring covered GenAI providers to offer free AI-content detection tools and embed latent/visible disclosures in AI-generated image, video, and audio content.',
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
];

export interface Obligation {
  id: string;
  title: string;
  framework: Framework['shortCode'];
  topic: string;
  type: 'mandatory' | 'recommended';
  effective: string;
  severity: 'critical' | 'high' | 'medium';
  summary: string;
}

export const OBLIGATIONS: Obligation[] = [
  { id: 'obl1', title: 'Disclose AI interaction at first contact', framework: 'EU', topic: 'Transparency', type: 'mandatory', effective: '2026-08-02', severity: 'high', summary: 'Users must be informed when interacting with an AI system under transparency rules.' },
  { id: 'obl2', title: 'Implement appropriate human oversight', framework: 'EU', topic: 'Human Oversight', type: 'mandatory', effective: '2027-12-02', severity: 'critical', summary: 'High-risk AI systems must include measures enabling appropriate human oversight.' },
  { id: 'obl3', title: 'Maintain logging for traceability', framework: 'EU', topic: 'Logging', type: 'mandatory', effective: '2027-12-02', severity: 'critical', summary: 'High-risk systems must log activity to support traceability and compliance review.' },
  { id: 'obl4', title: 'Risk management system for high-risk AI', framework: 'EU', topic: 'Risk Management', type: 'mandatory', effective: '2027-12-02', severity: 'critical', summary: 'Continuous, iterative risk management process throughout the AI system lifecycle.' },
  { id: 'obl5', title: 'Data governance & quality for high-risk', framework: 'EU', topic: 'Data Governance', type: 'mandatory', effective: '2027-12-02', severity: 'high', summary: 'Training, validation, and testing datasets must meet quality and governance standards.' },
  { id: 'obl6', title: 'Technical documentation for high-risk', framework: 'EU', topic: 'Documentation', type: 'mandatory', effective: '2027-12-02', severity: 'high', summary: 'Comprehensive technical documentation must be maintained and provided to authorities.' },
  { id: 'obl7', title: 'GPAI model transparency obligations', framework: 'EU', topic: 'GPAI', type: 'mandatory', effective: '2025-08-02', severity: 'high', summary: 'General-purpose AI model providers must disclose training data summaries and comply with copyright rules.' },
  { id: 'obl8', title: 'Prohibited practices screening', framework: 'EU', topic: 'Prohibited Practices', type: 'mandatory', effective: '2025-02-02', severity: 'critical', summary: 'Screen for 8 banned practices: manipulation, exploitation, social scoring, certain biometric uses, etc.' },
  { id: 'obl9', title: 'Control documented information', framework: 'ISO', topic: 'Documentation', type: 'recommended', effective: 'Ongoing', severity: 'high', summary: 'Documented information must be created, updated, controlled, retained, and protected per Clause 7.5.' },
  { id: 'obl10', title: 'Establish AIMS scope & context', framework: 'ISO', topic: 'Governance', type: 'recommended', effective: 'Ongoing', severity: 'medium', summary: 'Understand internal/external issues, interested parties, and define AIMS scope per Clause 4.' },
  { id: 'obl11', title: 'Leadership commitment & AI policy', framework: 'ISO', topic: 'Governance', type: 'recommended', effective: 'Ongoing', severity: 'high', summary: 'Top management must demonstrate leadership and establish an AI policy per Clause 5.' },
  { id: 'obl12', title: 'Internal audit & management review', framework: 'ISO', topic: 'Monitoring', type: 'recommended', effective: 'Ongoing', severity: 'medium', summary: 'Conduct internal audits and management reviews per Clause 9.' },
  { id: 'obl13', title: 'Maintain AI governance inventory & roles', framework: 'NIST', topic: 'Risk Management', type: 'recommended', effective: 'Ongoing', severity: 'high', summary: 'Organizations should maintain inventory, defined governance roles, and accountability structures.' },
  { id: 'obl14', title: 'Map system context & stakeholders', framework: 'NIST', topic: 'Risk Management', type: 'recommended', effective: 'Ongoing', severity: 'medium', summary: 'Map system purpose, context, stakeholders, affected parties, and intended use.' },
  { id: 'obl15', title: 'Provide transparency & responsible disclosure', framework: 'OECD', topic: 'Transparency', type: 'recommended', effective: 'Ongoing', severity: 'high', summary: 'AI actors should provide meaningful info about capabilities, limitations, and challenge pathways.' },
  { id: 'obl16', title: 'Ensure robustness, security & safety', framework: 'OECD', topic: 'Cybersecurity', type: 'recommended', effective: 'Ongoing', severity: 'high', summary: 'AI systems should be robust, secure, and safe throughout the lifecycle with safe override capability.' },
  { id: 'obl17', title: 'Caller Authorization Verification (NHID-Auth v2)', framework: 'EU', topic: 'Authorization', type: 'mandatory', effective: '2026-06-11', severity: 'critical', summary: 'NHID-Auth v2 (Layer 3): Cryptographic authorization via Ed25519 delegation chain + DPoP nonce binding, separate from NHID-Clinical v1.3 Layer 2 conformance.' },
  { id: 'obl18', title: 'Generative AI testing & evaluation guidance', framework: 'SG', topic: 'Testing & Evaluation', type: 'recommended', effective: 'Ongoing', severity: 'medium', summary: 'Apply structured red-teaming, benchmarking, and content-provenance testing per the Model AI Governance Framework for Generative AI (2nd Ed).' },
  { id: 'obl19', title: 'Content provenance & incident reporting channel', framework: 'SG', topic: 'Transparency', type: 'recommended', effective: 'Ongoing', severity: 'medium', summary: 'Label AI-generated content where feasible and maintain a channel for reporting AI-related incidents and feedback.' },
  { id: 'obl20', title: 'Mitigate OWASP LLM Top 10 risks', framework: 'OWASP', topic: 'Application Security', type: 'recommended', effective: 'Ongoing', severity: 'high', summary: 'Address prompt injection, insecure output handling, training data poisoning, and excessive agency per the OWASP Top 10 for LLM Applications.' },
  { id: 'obl21', title: 'Map adversarial TTPs to MITRE ATLAS', framework: 'OWASP', topic: 'Threat Modeling', type: 'recommended', effective: 'Ongoing', severity: 'high', summary: 'Use the MITRE ATLAS tactics/techniques matrix to model adversarial ML threats across reconnaissance, staging, and impact phases.' },
  { id: 'obl22', title: 'Algorithmic discrimination risk management program', framework: 'CO', topic: 'Risk Management', type: 'mandatory', effective: '2026-06-30', severity: 'critical', summary: 'Developers and deployers of high-risk AI systems must implement a program to prevent algorithmic discrimination (Colorado AI Act, SB24-205).' },
  { id: 'obl23', title: 'Consumer notice for high-risk AI decisions', framework: 'CO', topic: 'Transparency', type: 'mandatory', effective: '2026-06-30', severity: 'high', summary: 'Deployers must notify consumers when a high-risk AI system is used in a consequential decision and provide a right to correct data and appeal.' },
  { id: 'obl24', title: 'Implement access control for ePHI systems', framework: 'HIPAA', topic: 'Access Control', type: 'mandatory', effective: '2005-04-21', severity: 'critical', summary: '§164.312(a)(1): Technical policies and procedures must restrict access to electronic PHI to authorized persons or software programs only.' },
  { id: 'obl25', title: 'Assign unique user identification', framework: 'HIPAA', topic: 'Access Control', type: 'mandatory', effective: '2005-04-21', severity: 'critical', summary: '§164.312(a)(2)(i) (required): Assign a unique name or number for identifying and tracking individual user identity for every person and AI agent that accesses ePHI.' },
  { id: 'obl26', title: 'Define emergency access procedure', framework: 'HIPAA', topic: 'Access Control', type: 'mandatory', effective: '2005-04-21', severity: 'high', summary: '§164.312(a)(2)(ii) (required): Establish procedures for obtaining necessary ePHI access during an emergency, including AI-system failover or outage.' },
  { id: 'obl27', title: 'Enforce automatic logoff', framework: 'HIPAA', topic: 'Access Control', type: 'mandatory', effective: '2005-04-21', severity: 'medium', summary: '§164.312(a)(2)(iii) (addressable): Terminate an electronic session after a predetermined time of inactivity, or document a reasonable equivalent control.' },
  { id: 'obl28', title: 'Encrypt and decrypt ePHI at rest', framework: 'HIPAA', topic: 'Encryption', type: 'mandatory', effective: '2005-04-21', severity: 'critical', summary: '§164.312(a)(2)(iv) (addressable): Implement a mechanism to encrypt and decrypt ePHI. NHID-Auth v2 (Layer 3) cryptographic delegation satisfies this for voice-agent call data.' },
  { id: 'obl29', title: 'Maintain audit controls', framework: 'HIPAA', topic: 'Audit & Logging', type: 'mandatory', effective: '2005-04-21', severity: 'critical', summary: '§164.312(b) (required): Implement hardware, software, and procedural mechanisms to record and examine activity in systems that contain or use ePHI.' },
  { id: 'obl30', title: 'Protect ePHI integrity', framework: 'HIPAA', topic: 'Data Integrity', type: 'mandatory', effective: '2005-04-21', severity: 'high', summary: '§164.312(c)(1): Protect ePHI from improper alteration or destruction.' },
  { id: 'obl31', title: 'Authenticate ePHI has not been altered', framework: 'HIPAA', topic: 'Data Integrity', type: 'mandatory', effective: '2005-04-21', severity: 'medium', summary: '§164.312(c)(2) (addressable): Implement electronic mechanisms to corroborate that ePHI has not been altered or destroyed in an unauthorized manner.' },
  { id: 'obl32', title: 'Authenticate persons or entities before ePHI access', framework: 'HIPAA', topic: 'Authentication', type: 'mandatory', effective: '2005-04-21', severity: 'critical', summary: '§164.312(d) (required): Verify that a person or entity seeking access to ePHI is the one claimed, before granting access.' },
  { id: 'obl33', title: 'Guard against unauthorized access during transmission', framework: 'HIPAA', topic: 'Transmission Security', type: 'mandatory', effective: '2005-04-21', severity: 'critical', summary: '§164.312(e)(1): Implement technical security measures to guard against unauthorized access to ePHI transmitted over a network.' },
  { id: 'obl34', title: 'Apply transmission integrity controls', framework: 'HIPAA', topic: 'Transmission Security', type: 'mandatory', effective: '2005-04-21', severity: 'medium', summary: '§164.312(e)(2)(i) (addressable): Implement security measures to ensure electronically transmitted ePHI is not improperly modified without detection.' },
  { id: 'obl35', title: 'Encrypt ePHI in transit', framework: 'HIPAA', topic: 'Transmission Security', type: 'mandatory', effective: '2005-04-21', severity: 'critical', summary: '§164.312(e)(2)(ii) (addressable): Encrypt ePHI whenever deemed appropriate. NHID-Auth v2 DPoP nonce binding plus TLS 1.3 transport satisfies this for voice-agent call traffic.' },
  { id: 'obl36', title: 'Latent disclosure in AI-generated media', framework: 'CA', topic: 'Transparency', type: 'mandatory', effective: '2026-01-01', severity: 'high', summary: 'Covered providers must embed latent (and, where feasible, visible) disclosures identifying content as AI-generated, and offer a free AI-detection tool (California AI Transparency Act, SB 942).' },
  { id: 'obl37', title: 'Notice for AI-driven employment decisions', framework: 'IL', topic: 'Employment', type: 'mandatory', effective: '2026-01-01', severity: 'high', summary: 'Employers using AI in recruitment, hiring, or promotion decisions must notify employees/applicants and may not use AI in a way that has an unlawful discriminatory effect (Illinois HB 3773).' },
  { id: 'obl38', title: 'Independent bias audit of hiring AI', framework: 'NY', topic: 'Employment', type: 'mandatory', effective: '2023-07-05', severity: 'critical', summary: 'Employers must obtain an independent bias audit of an automated employment decision tool within one year before use, publish a summary of results, and give candidates advance notice and an opt-out (NYC Local Law 144).' },
  { id: 'obl39', title: 'Prohibited harmful AI uses', framework: 'TX', topic: 'Prohibited Practices', type: 'mandatory', effective: '2026-01-01', severity: 'critical', summary: 'Developers and deployers may not use AI for specified harmful purposes — manipulation inducing self-harm, unlawful discrimination, or biometric identification without consent (Texas TRAIGA).' },
  { id: 'obl40', title: 'Disclose generative AI in regulated interactions', framework: 'UT', topic: 'Transparency', type: 'mandatory', effective: '2024-05-01', severity: 'high', summary: 'Persons in a regulated occupation must proactively disclose when generative AI is used in a consumer interaction in a high-risk context, or disclose upon request in lower-risk contexts (Utah AI Policy Act).' },
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
  { name: 'Tennessee', postalCode: 'TN', status: 'none' },
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

export const CONTROLS: Control[] = [
  { id: 1, code: 'CTRL-GRC-001', title: 'AI Governance Board & Charter', riskTier: 'High-Risk', priority: 'Critical', ccmDomain: 'GRC', status: 'Implemented', automation: 'manual',
    description: 'Establish a cross-functional AI Governance Board with documented charter, roles, and decision rights over AI system deployment and oversight.',
    mappings: { 'NIST AI RMF': ['GOV 1.1', 'GOV 1.2'], 'ISO/IEC 42001': ['5.1', '5.3'], 'EU AI Act': ['Art 4', 'Art 26'] },
    indicator: { name: 'Board Meeting Cadence & Quorum Rate', method: 'Meetings held / scheduled with quorum', slo: '≥90% quorum on monthly cadence' },
    implementation: 'Document charter with mandate, membership (CISO, CLO, CPO, business leads), voting thresholds, and escalation paths. Publish minutes within 5 business days.' },
  { id: 2, code: 'CTRL-GRC-002', title: 'AI Risk Management Program', riskTier: 'High-Risk', priority: 'Critical', ccmDomain: 'GRC', status: 'In Progress', automation: 'manual',
    description: 'Systematic program to identify, assess, treat, and monitor AI-related risks aligned to enterprise risk appetite.',
    mappings: { 'NIST AI RMF': ['MAP 1.1', 'MAP 2.1', 'MANAGE 1.1'], 'ISO/IEC 42001': ['8.2', '8.4'], 'EU AI Act': ['Art 9'], 'Colorado AI Act': ['Risk Mgmt Program'] },
    indicator: { name: 'Open Risk Finding Resolution Rate', method: 'Risks closed / total identified per cycle', slo: '≥90% resolved within 30 days of target date' },
    implementation: 'Maintain AI Risk Register with threat, likelihood, impact, owner, and remediation deadline. Conduct quarterly reviews. Escalate critical findings to Board.' },
  { id: 3, code: 'CTRL-GRC-003', title: 'AI Policy & Standards Framework', riskTier: 'All Systems', priority: 'High', ccmDomain: 'GRC', status: 'Implemented', automation: 'manual',
    description: 'Authoritative policy hierarchy governing acceptable AI use, prohibited applications, and mandatory technical standards.',
    mappings: { 'NIST AI RMF': ['GOV 1.3', 'GOV 1.4'], 'ISO/IEC 42001': ['5.2', '7.5'], 'EU AI Act': ['Art 4'] },
    indicator: { name: 'Policy Coverage & Review Rate', method: 'Policies current (≤12 months) / total active policies', slo: '100% of policies reviewed annually' },
    implementation: 'Publish Acceptable Use Policy, Prohibited AI Use List, Data Governance for AI Standard, and Model Risk Standard. Review annually or after major regulatory updates.' },
  { id: 4, code: 'CTRL-GRC-004', title: 'AI Compliance Obligations Tracker', riskTier: 'All Systems', priority: 'High', ccmDomain: 'GRC', status: 'In Progress', automation: 'semi-automated',
    description: 'Centralized register mapping applicable legal and regulatory obligations (EU AI Act, GDPR, sector rules) to internal controls.',
    mappings: { 'NIST AI RMF': ['GOV 4.1'], 'ISO/IEC 42001': ['6.1.1', '9.3'], 'EU AI Act': ['Art 16', 'Art 49'] },
    indicator: { name: 'Obligations Mapped to Controls %', method: 'Obligations with ≥1 mapped control / total obligations', slo: '100%' },
    implementation: 'Maintain register in GRC platform. Tag each obligation with jurisdiction, effective date, control owners, and evidence cadence. Trigger gap analysis on new regulation.' },
  { id: 5, code: 'CTRL-DSP-001', title: 'AI Training Data Governance', riskTier: 'High-Risk', priority: 'Critical', ccmDomain: 'DSP', status: 'In Progress', automation: 'semi-automated',
    description: 'Formal data lineage, quality, and consent controls for datasets used in AI model training and fine-tuning.',
    mappings: { 'NIST AI RMF': ['MAP 2.2', 'MAP 3.5'], 'ISO/IEC 42001': ['8.3', '8.6'], 'EU AI Act': ['Art 10'] },
    indicator: { name: 'Training Dataset Documentation Coverage', method: 'Datasets with complete data cards / total training datasets', slo: '100% before model release' },
    implementation: 'Require data cards for all training datasets covering source, collection method, known biases, consent basis, and retention period. Scan for PII before ingestion.' },
  { id: 6, code: 'CTRL-DSP-002', title: 'Personal Data Minimization for AI', riskTier: 'High-Risk', priority: 'High', ccmDomain: 'DSP', status: 'Planned', automation: 'semi-automated',
    description: 'Enforce data minimization, purpose limitation, and storage restriction for personal data processed in AI pipelines.',
    mappings: { 'NIST AI RMF': ['MAP 2.2'], 'ISO/IEC 42001': ['8.3'], 'EU AI Act': ['Art 10'], 'GDPR': ['Art 5(1)(b)(c)(e)'] },
    indicator: { name: 'PII Retention Policy Compliance Rate', method: 'AI datasets within retention limits / total datasets', slo: '100%' },
    implementation: 'Apply automated PII scanning to training data pipelines. Enforce retention schedules via data catalog. Document legal basis for each personal data use in AI.' },
  { id: 7, code: 'CTRL-IAM-001', title: 'AI System Access Controls', riskTier: 'All Systems', priority: 'Critical', ccmDomain: 'IAM', status: 'Implemented', automation: 'automated',
    description: 'Role-based access controls (RBAC) enforcing least privilege for AI model endpoints, training infrastructure, and MLOps pipelines.',
    mappings: { 'NIST AI RMF': ['MANAGE 2.4'], 'ISO/IEC 42001': ['8.5'], 'CCM': ['IAM-01', 'IAM-02'], 'HIPAA': ['§164.312(a)(1)', '§164.312(a)(2)(i)', '§164.312(a)(2)(iii)', '§164.312(d)'] },
    indicator: { name: 'Privileged Access Review Completion Rate', method: 'Accounts reviewed on schedule / total privileged accounts', slo: '100% quarterly' },
    implementation: 'Implement RBAC with model-owner, reviewer, deployer, and read-only roles. Enforce MFA on all privileged AI system access. Quarterly access recertification.' },
  { id: 8, code: 'CTRL-IAM-002', title: 'Non-Human Identity Governance for AI Agents', riskTier: 'High-Risk', priority: 'High', ccmDomain: 'IAM', status: 'Planned', automation: 'automated',
    description: 'Lifecycle management of service accounts, API keys, and machine identities used by AI agents and automated pipelines.',
    mappings: { 'NIST AI RMF': ['MANAGE 2.4'], 'ISO/IEC 42001': ['8.5'], 'EU AI Act': ['Art 17'], 'HIPAA': ['§164.312(a)(2)(i)', '§164.312(d)'] },
    indicator: { name: 'Orphaned Machine Identity Rate', method: 'Active machine identities with no owner / total machine identities', slo: '<1%' },
    implementation: 'Register all AI agent identities in PAM solution. Rotate API keys every 90 days. Automatically disable identities when agent is decommissioned.' },
  { id: 9, code: 'CTRL-LOG-001', title: 'AI Activity Logging & Traceability', riskTier: 'All Systems', priority: 'High', ccmDomain: 'LOG', status: 'In Progress', automation: 'automated',
    description: 'Comprehensive, tamper-evident audit logs for AI model inference requests, training runs, and configuration changes.',
    mappings: { 'NIST AI RMF': ['MEASURE 2.5', 'MANAGE 2.2'], 'ISO/IEC 42001': ['9.1'], 'EU AI Act': ['Art 12', 'Art 19'], 'HIPAA': ['§164.312(b)', '§164.312(c)(1)'] },
    indicator: { name: 'Audit Log Coverage Rate', method: 'AI systems with complete audit logs / total production AI systems', slo: '100%' },
    implementation: 'Configure structured logging for all inference calls (inputs, outputs, model version, user/session). Retain logs for minimum 3 years. Protect with WORM storage.' },
  { id: 10, code: 'CTRL-LOG-002', title: 'AI Performance & Drift Monitoring', riskTier: 'High-Risk', priority: 'High', ccmDomain: 'LOG', status: 'Planned', automation: 'automated',
    description: 'Continuous monitoring of model performance metrics and statistical drift indicators with automated alerting thresholds.',
    mappings: { 'NIST AI RMF': ['MEASURE 2.5', 'MEASURE 2.9'], 'ISO/IEC 42001': ['9.1'], 'EU AI Act': ['Art 9', 'Art 72'] },
    indicator: { name: 'Model Drift Alert Response Time', method: 'Time from drift alert to acknowledged investigation', slo: '<4 hours for critical, <24 hours for high' },
    implementation: 'Deploy monitoring for input distribution shift, prediction drift, and performance degradation. Set automated SLO breach alerts. Trigger re-evaluation workflow on threshold breach.' },
  { id: 11, code: 'CTRL-STA-001', title: 'AI Third-Party & Supplier Oversight', riskTier: 'High-Risk', priority: 'High', ccmDomain: 'STA', status: 'In Progress', automation: 'manual',
    description: 'Due diligence and contractual controls for AI vendors, foundation model providers, and data suppliers.',
    mappings: { 'NIST AI RMF': ['GOV 6.1', 'GOV 6.2'], 'ISO/IEC 42001': ['8.6'], 'EU AI Act': ['Art 25', 'Art 28'] },
    indicator: { name: 'AI Vendor Risk Assessment Coverage', method: 'Critical AI vendors with completed risk assessments / total critical vendors', slo: '100% annually' },
    implementation: 'Conduct AI-specific vendor risk assessments. Require SLAs covering model update notifications, bias testing results, and security incident disclosure within 48 hours.' },
  { id: 12, code: 'CTRL-STA-002', title: 'AI Model Provenance & Documentation', riskTier: 'All Systems', priority: 'High', ccmDomain: 'STA', status: 'In Progress', automation: 'manual',
    description: 'Model cards and technical documentation capturing architecture, training data, evaluation results, and known limitations for all production AI models.',
    mappings: { 'NIST AI RMF': ['GOV 1.6', 'MEASURE 2.10'], 'ISO/IEC 42001': ['8.3', '8.4'], 'EU AI Act': ['Art 11', 'Ann IV'] },
    indicator: { name: 'Model Card Completeness Rate', method: 'Production models with approved model cards / total production models', slo: '100%' },
    implementation: 'Mandate model cards for all production deployments. Include: intended use, out-of-scope uses, evaluation benchmarks, fairness metrics, and contact for reporting issues.' },
  { id: 13, code: 'CTRL-STA-003', title: 'AI System Disclosure & Transparency Notice', riskTier: 'All Systems', priority: 'Medium', ccmDomain: 'STA', status: 'In Progress', automation: 'automated',
    description: 'User-facing disclosure that AI is involved in decisions or content generation, consistent with regulatory transparency requirements.',
    mappings: { 'NIST AI RMF': ['GOV 5.2'], 'ISO/IEC 42001': ['8.7'], 'EU AI Act': ['Art 50', 'Art 52'], 'Singapore MGF': ['Transparency'], 'Colorado AI Act': ['Consumer Notice'] },
    indicator: { name: 'AI Disclosure Implementation Rate', method: 'User-facing AI touchpoints with disclosure / total touchpoints', slo: '100%' },
    implementation: 'Display plain-language AI disclosure at point of interaction. For GPAI-generated content include labeling. For chatbots, disclose AI nature at session start.' },
  { id: 14, code: 'CTRL-TVM-001', title: 'AI Adversarial Testing & Red-Teaming', riskTier: 'High-Risk', priority: 'Critical', ccmDomain: 'TVM', status: 'Planned', automation: 'manual',
    description: 'Structured adversarial testing program including red-teaming exercises targeting prompt injection, jailbreaks, model extraction, and harmful output generation.',
    mappings: { 'NIST AI RMF': ['MEASURE 2.6', 'MANAGE 2.2'], 'ISO/IEC 42001': ['8.4'], 'EU AI Act': ['Art 9', 'Art 55'], 'OWASP/ATLAS': ['LLM01', 'LLM02'], 'Singapore MGF': ['Testing & Assurance'] },
    indicator: { name: 'Pre-Release Red-Team Coverage Rate', method: 'High-risk AI systems red-teamed before deployment / total high-risk deployments', slo: '100%' },
    implementation: 'Conduct structured red-team exercises before each high-risk system deployment. Document attack surface, test scenarios, findings, and mitigations. Track remediation to closure.' },
  { id: 15, code: 'CTRL-TVM-002', title: 'AI Model Vulnerability Assessment', riskTier: 'All Systems', priority: 'High', ccmDomain: 'TVM', status: 'Planned', automation: 'semi-automated',
    description: 'Periodic assessment of AI model vulnerabilities including membership inference, model inversion, poisoning susceptibility, and supply chain risks in dependencies.',
    mappings: { 'NIST AI RMF': ['MEASURE 2.6'], 'ISO/IEC 42001': ['8.4'], 'CCM': ['TVM-01', 'TVM-02'], 'OWASP/ATLAS': ['ATLAS TA0001–TA0011'] },
    indicator: { name: 'Critical Vulnerability Remediation Rate', method: 'Critical AI vulns remediated within SLA / total critical vulns', slo: '100% within 30 days' },
    implementation: 'Run AI-specific vulnerability scans quarterly. Include dependency scanning of ML frameworks and model serving infrastructure. Track CVEs for all model serving libraries.' },
  { id: 16, code: 'CTRL-AA-001', title: 'AI Internal Audit Program', riskTier: 'High-Risk', priority: 'High', ccmDomain: 'A&A', status: 'Planned', automation: 'manual',
    description: 'Annual internal audit program verifying AI governance controls, model risk management practices, and regulatory compliance posture.',
    mappings: { 'NIST AI RMF': ['GOV 1.7'], 'ISO/IEC 42001': ['9.2'], 'EU AI Act': ['Art 17', 'Art 61'] },
    indicator: { name: 'Audit Finding Remediation Rate', method: 'High/critical audit findings closed on time / total high/critical findings', slo: '≥95% within agreed remediation date' },
    implementation: 'Scope annual AI audit to cover governance structure, model risk, data governance, and incident history. Issue findings with risk ratings. Track remediation through to closure.' },
  { id: 17, code: 'CTRL-AA-002', title: 'AI Third-Party Audit & Attestation', riskTier: 'High-Risk', priority: 'Medium', ccmDomain: 'A&A', status: 'Planned', automation: 'manual',
    description: 'Independent external assessment or attestation of AI system controls, particularly for high-risk systems subject to regulatory scrutiny.',
    mappings: { 'NIST AI RMF': ['GOV 1.7'], 'ISO/IEC 42001': ['9.2'], 'EU AI Act': ['Art 43', 'Art 44'] },
    indicator: { name: 'External Attestation Currency', method: 'High-risk AI systems with current (≤12 month) external attestation / total', slo: '100% for unacceptable/high-risk systems' },
    implementation: 'Engage accredited conformity assessment body for EU AI Act high-risk system certifications. Schedule external penetration tests and model audit annually.' },
  { id: 18, code: 'CTRL-HRS-001', title: 'Human Override & Escalation Protocols', riskTier: 'High-Risk', priority: 'Critical', ccmDomain: 'HRS', status: 'Planned', automation: 'semi-automated',
    description: 'Defined and tested mechanisms for humans to monitor, intervene in, override, or shut down AI system operations without undue delay.',
    mappings: { 'NIST AI RMF': ['GOV 2.2', 'MANAGE 4.1'], 'ISO/IEC 42001': ['8.9'], 'EU AI Act': ['Art 9', 'Art 14'], 'Colorado AI Act': ['Appeal Rights'] },
    indicator: { name: 'Override Protocol Test Completion Rate', method: 'Scheduled override drills completed / planned drills', slo: '100% semi-annually' },
    implementation: 'Document override procedures per AI system. Implement kill-switch or circuit-breaker pattern for high-risk systems. Test override controls in staging semi-annually.' },
  { id: 19, code: 'CTRL-HRS-002', title: 'AI Workforce Competency & Ethics Training', riskTier: 'All Systems', priority: 'High', ccmDomain: 'HRS', status: 'In Progress', automation: 'manual',
    description: 'Role-based AI literacy, ethics, and governance training for all employees involved in AI development, deployment, or oversight.',
    mappings: { 'NIST AI RMF': ['GOV 3.1', 'GOV 3.2'], 'ISO/IEC 42001': ['7.2', '7.3'], 'EU AI Act': ['Art 4'] },
    indicator: { name: 'AI Training Completion Rate', method: 'Staff in AI roles with current training certification / total staff in AI roles', slo: '≥95% annually' },
    implementation: 'Develop role-tiered curriculum: AI Literacy (all staff), AI Ethics & Governance (practitioners), Model Risk (validators). Require annual recertification. Track in LMS.' },
  { id: 20, code: 'CTRL-AIS-001', title: 'AI API Security & Input Validation', riskTier: 'All Systems', priority: 'High', ccmDomain: 'AIS', status: 'In Progress', automation: 'automated',
    description: 'Input sanitization, rate limiting, and output filtering controls on AI model APIs to prevent abuse, prompt injection, and data exfiltration.',
    mappings: { 'NIST AI RMF': ['MANAGE 2.2'], 'ISO/IEC 42001': ['8.5'], 'CCM': ['AIS-01', 'AIS-04'] },
    indicator: { name: 'API Abuse Incident Rate', method: 'AI API security incidents per month per deployed endpoint', slo: '<1 per endpoint per quarter' },
    implementation: 'Implement input validation, max token limits, PII output scanning, and rate limiting on all AI API endpoints. Log all requests. Alert on anomalous patterns.' },
  { id: 21, code: 'CTRL-BCR-001', title: 'AI System Continuity & Recovery Planning', riskTier: 'All Systems', priority: 'Medium', ccmDomain: 'BCR', status: 'Planned', automation: 'manual',
    description: 'Business continuity and disaster recovery plans covering AI system outages, model rollback procedures, and fallback to non-AI processes.',
    mappings: { 'NIST AI RMF': ['MANAGE 4.2'], 'ISO/IEC 42001': ['8.8'], 'CCM': ['BCR-01', 'BCR-02'], 'HIPAA': ['§164.312(a)(2)(ii)'] },
    indicator: { name: 'AI System RTO Achievement Rate', method: 'AI system recoveries within defined RTO / total recovery events', slo: '≥99% within RTO' },
    implementation: 'Define RTO/RPO for each AI system by criticality. Implement model versioning enabling rapid rollback. Test failover to rule-based fallback for high-risk systems annually.' },
  { id: 22, code: 'CTRL-CCC-001', title: 'AI Model Change Management', riskTier: 'All Systems', priority: 'High', ccmDomain: 'CCC', status: 'In Progress', automation: 'semi-automated',
    description: 'Structured change management process governing model updates, retraining, version promotion, and configuration changes in AI production environments.',
    mappings: { 'NIST AI RMF': ['MANAGE 3.1', 'MANAGE 3.2'], 'ISO/IEC 42001': ['8.4'], 'CCM': ['CCC-01', 'CCC-04'] },
    indicator: { name: 'Unauthorized Production Change Rate', method: 'AI production changes without approved change record / total changes', slo: '0%' },
    implementation: 'Gate all model promotions through change advisory board (or automated policy check). Require impact assessment, rollback plan, and post-deployment monitoring for 72 hours.' },
  { id: 23, code: 'CTRL-CEK-001', title: 'AI Data Encryption & Key Management', riskTier: 'All Systems', priority: 'High', ccmDomain: 'CEK', status: 'Implemented', automation: 'automated',
    description: 'Encryption-at-rest and in-transit standards for AI training data, model weights, and inference payloads, with formal key management lifecycle.',
    mappings: { 'NIST AI RMF': ['MANAGE 2.4'], 'ISO/IEC 42001': ['8.5'], 'CCM': ['CEK-01', 'CEK-02', 'CEK-03'], 'HIPAA': ['§164.312(a)(2)(iv)', '§164.312(e)(1)', '§164.312(e)(2)(ii)'] },
    indicator: { name: 'Encryption Standards Compliance Rate', method: 'AI data stores meeting encryption standard / total AI data stores', slo: '100%' },
    implementation: 'Enforce AES-256 at rest, TLS 1.3 in transit for all AI data. Store model weights in encrypted model registry. Rotate encryption keys annually. Audit key access quarterly.' },
  { id: 24, code: 'CTRL-DCS-001', title: 'AI Compute Environment Isolation', riskTier: 'All Systems', priority: 'Medium', ccmDomain: 'DCS', status: 'Implemented', automation: 'automated',
    description: 'Network segmentation and compute isolation controls separating AI training environments, inference infrastructure, and production data from development and internet exposure.',
    mappings: { 'NIST AI RMF': ['MANAGE 2.4'], 'ISO/IEC 42001': ['8.5'], 'CCM': ['DCS-01', 'DCS-06'] },
    indicator: { name: 'Environment Segregation Compliance Rate', method: 'AI environments with documented and validated isolation / total environments', slo: '100%' },
    implementation: 'Deploy AI training workloads in isolated VPCs without internet egress. Enforce GPU node isolation. Apply network micro-segmentation between inference and data tiers.' },
  { id: 25, code: 'CTRL-IPY-001', title: 'AI Model Portability & Interoperability', riskTier: 'All Systems', priority: 'Medium', ccmDomain: 'IPY', status: 'Planned', automation: 'manual',
    description: 'Open standards and export capabilities ensuring AI models and their associated data can be migrated across platforms without proprietary lock-in.',
    mappings: { 'NIST AI RMF': ['GOV 4.2'], 'ISO/IEC 42001': ['8.3'], 'EU AI Act': ['Art 84'] },
    indicator: { name: 'Standard Format Adoption Rate', method: 'Models exportable in open format (ONNX/PMML) / total production models', slo: '≥80% of new models' },
    implementation: 'Require ONNX or equivalent open format export for all new model deployments. Document API contracts using OpenAPI. Avoid proprietary inference formats for high-risk systems.' },
  { id: 26, code: 'CTRL-SEF-001', title: 'AI Security Incident Response & Remediation', riskTier: 'High-Risk', priority: 'Critical', ccmDomain: 'SEF', status: 'Planned', automation: 'semi-automated',
    description: 'AI-specific incident response playbooks covering model manipulation, harmful output events, data poisoning, and regulatory breach notifications.',
    mappings: { 'NIST AI RMF': ['MANAGE 4.1', 'MANAGE 4.2'], 'ISO/IEC 42001': ['10.1'], 'EU AI Act': ['Art 73', 'Art 74'] },
    indicator: { name: 'AI Incident Response Time-to-Contain', method: 'Median time from detection to containment action for AI security incidents', slo: '<2 hours for critical AI incidents' },
    implementation: 'Develop AI-specific IR playbooks: prompt injection, model extraction, bias incident, regulatory breach. Tabletop exercise annually. EU AI Act serious incident notifications within 15 days.' },
  { id: 27, code: 'CTRL-UEM-001', title: 'AI Agent Endpoint Registration & Control', riskTier: 'All Systems', priority: 'High', ccmDomain: 'UEM', status: 'Planned', automation: 'automated',
    description: 'Registration and behavioral controls for AI agents, bots, and autonomous systems accessing organizational resources or external APIs.',
    mappings: { 'NIST AI RMF': ['MANAGE 2.4'], 'ISO/IEC 42001': ['8.5'], 'CCM': ['UEM-01', 'UEM-06'] },
    indicator: { name: 'Registered AI Agent Coverage Rate', method: 'AI agents registered in endpoint inventory / total discovered agents', slo: '100%' },
    implementation: 'Maintain registry of all AI agents with owner, purpose, data access scope, and external API permissions. Enforce allow-list for external API calls. Audit agent activity monthly.' },
];

export interface TimelineEvent {
  date: string;
  label: string;
  status: 'past' | 'current' | 'upcoming';
  detail: string;
}

export const TIMELINE_EVENTS: TimelineEvent[] = [
  { date: '2024-08-01', label: 'EU AI Act entered into force', status: 'past', detail: 'Regulation (EU) 2024/1689 published and in force.' },
  { date: '2025-02-02', label: 'Prohibited practices & AI literacy', status: 'past', detail: '8 banned practices enforced; AI literacy obligations for providers begin.' },
  { date: '2025-08-02', label: 'GPAI governance rules applicable', status: 'past', detail: 'General-purpose AI model obligations, Code of Practice, training-data summary template.' },
  { date: '2026-06-30', label: 'Colorado AI Act applicable', status: 'current', detail: 'SB 24-205 risk management and consumer-notice obligations take effect for high-risk AI deployers.' },
  { date: '2026-08-02', label: 'Transparency rules applicable', status: 'current', detail: 'Disclosure for chatbots, AI-generated content labeling.' },
  { date: '2027-12-02', label: 'High-risk area systems applicable', status: 'upcoming', detail: 'Certain high-risk AI systems must comply after the 2026 simplification agreement.' },
  { date: '2028-08-02', label: 'Product-integrated AI systems applicable', status: 'upcoming', detail: 'AI systems integrated into regulated products must fully comply.' },
];

export interface HeatmapCell {
  likelihoodIndex: number;
  impactIndex: number;
  level: 'cool' | 'mild' | 'warm' | 'hot';
  label: string;
  obligationId: string;
}

export const HEATMAP_LIKELIHOODS = ['Rare', 'Unlikely', 'Possible', 'Likely', 'Almost Certain'];
export const HEATMAP_IMPACTS = ['Negligible', 'Minor', 'Moderate', 'Significant', 'Severe'];

export const HEATMAP_CELLS: HeatmapCell[] = [
  { likelihoodIndex: 0, impactIndex: 0, level: 'cool', label: 'ASR model disclosure gap', obligationId: 'obl7' },
  { likelihoodIndex: 0, impactIndex: 1, level: 'cool', label: 'Call log retention lapse', obligationId: 'obl9' },
  { likelihoodIndex: 0, impactIndex: 2, level: 'mild', label: 'Undetected triage drift', obligationId: 'obl14' },
  { likelihoodIndex: 0, impactIndex: 3, level: 'mild', label: 'ASR vendor doc missing', obligationId: 'obl8' },
  { likelihoodIndex: 0, impactIndex: 4, level: 'warm', label: 'Undisclosed AI voice agent', obligationId: 'obl1' },
  { likelihoodIndex: 1, impactIndex: 0, level: 'cool', label: 'Stale voice-agent inventory', obligationId: 'obl13' },
  { likelihoodIndex: 1, impactIndex: 1, level: 'mild', label: 'Incomplete call audit trail', obligationId: 'obl3' },
  { likelihoodIndex: 1, impactIndex: 2, level: 'mild', label: 'Weak call monitoring config', obligationId: 'obl12' },
  { likelihoodIndex: 1, impactIndex: 3, level: 'warm', label: 'Third-party ASR model risk', obligationId: 'obl5' },
  { likelihoodIndex: 1, impactIndex: 4, level: 'hot', label: "Patient not told it's AI", obligationId: 'obl1' },
  { likelihoodIndex: 2, impactIndex: 0, level: 'mild', label: 'Triage policy not updated', obligationId: 'obl11' },
  { likelihoodIndex: 2, impactIndex: 1, level: 'mild', label: 'Call logs not retained', obligationId: 'obl3' },
  { likelihoodIndex: 2, impactIndex: 2, level: 'warm', label: 'Drift in triage model', obligationId: 'obl4' },
  { likelihoodIndex: 2, impactIndex: 3, level: 'warm', label: 'Clinician oversight bypassed', obligationId: 'obl2' },
  { likelihoodIndex: 2, impactIndex: 4, level: 'hot', label: 'Triage system non-compliant', obligationId: 'obl4' },
  { likelihoodIndex: 3, impactIndex: 0, level: 'mild', label: 'Compliance review missed', obligationId: 'obl12' },
  { likelihoodIndex: 3, impactIndex: 1, level: 'warm', label: 'Adverse event unreported', obligationId: 'obl8' },
  { likelihoodIndex: 3, impactIndex: 2, level: 'warm', label: 'Clinical data quality gap', obligationId: 'obl5' },
  { likelihoodIndex: 3, impactIndex: 3, level: 'hot', label: 'Clinician override ignored', obligationId: 'obl2' },
  { likelihoodIndex: 3, impactIndex: 4, level: 'hot', label: 'Diagnostic bias detected', obligationId: 'obl16' },
  { likelihoodIndex: 4, impactIndex: 0, level: 'warm', label: 'Conformance audit overdue', obligationId: 'obl12' },
  { likelihoodIndex: 4, impactIndex: 1, level: 'warm', label: 'Call recording breach', obligationId: 'obl16' },
  { likelihoodIndex: 4, impactIndex: 2, level: 'hot', label: 'Banned AI triage practice', obligationId: 'obl8' },
  { likelihoodIndex: 4, impactIndex: 3, level: 'hot', label: 'No clinician escalation', obligationId: 'obl2' },
  { likelihoodIndex: 4, impactIndex: 4, level: 'hot', label: 'Catastrophic triage failure', obligationId: 'obl4' },
];

export const CROSSWALK_TOPICS = {
  title: 'Obligation Topic × Framework Matrix',
  headers: ['Topic', 'EU AI Act', 'ISO 42001', 'NIST RMF', 'OECD', 'Singapore MGF', 'OWASP/ATLAS', 'Colorado AI Act'],
  rows: [
    ['Transparency', 'Mandatory (Art 52)', '—', '—', 'Principle 3', 'Provenance & Reporting', '—', 'Consumer Notice'],
    ['Human Oversight', 'Mandatory (Art 14)', '—', '—', 'Principle 5', '—', '—', 'Appeal Rights'],
    ['Risk Management', 'Mandatory (Art 9)', 'Clause 6', 'Govern / Map', 'Principle 5', '—', '—', 'Risk Mgmt Program'],
    ['Documentation', 'Mandatory (Art 11)', 'Clause 7.5', 'Govern', '—', '—', '—', '—'],
    ['Data Governance', 'Mandatory (Art 10)', 'Clause 8', 'Map', '—', '—', '—', '—'],
    ['Cybersecurity', 'Mandatory (Art 15)', 'Clause 8', 'Measure', 'Principle 4', 'Security', 'LLM Top 10', '—'],
    ['Monitoring', 'Mandatory (Art 72)', 'Clause 9', 'Manage', 'Principle 5', '—', '—', '—'],
    ['Incident Response', 'Mandatory (Art 73)', 'Clause 10', 'Manage', '—', 'Incident Reporting', '—', '—'],
    ['Testing & Evaluation', '—', '—', 'Measure', '—', 'Testing & Assurance', 'ATLAS TTPs', '—'],
    ['GPAI / Model', 'Mandatory (Title VIII)', '—', 'Map', '—', '—', '—', '—'],
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
  { layer: 2, title: 'NHID-Clinical v1.3 — Behavioral Baseline', scope: 'Disclosure, no mimicry, human handoff, audit log.', isCore: true },
  { layer: 3, title: 'NHID-Auth v2', scope: 'Cryptographic authorization layer: Ed25519 delegation chain + DPoP call-nonce binding (reference implementation, CC BY 4.0).' },
  { layer: 4, title: 'FHIR AuditEvent R4', scope: 'Healthcare-native structured logging (HL7 base spec v4.0.1); no named Implementation Guide (e.g. IHE BALP) conformance claimed.' },
  { layer: 5, title: 'OpenTelemetry → SIEM', scope: 'Spans forwarded to enterprise observability / security pipeline.' },
];

export interface NhidConformanceControl {
  code: string;
  requirement: string;
  status: 'Conformant';
  indicator: ControlIndicator;
  implementation: string;
}

export const NHID_CONFORMANCE_CONTROLS: NhidConformanceControl[] = [
  {
    code: 'IDG-01',
    requirement: 'Disclose AI identity before any data exchange',
    status: 'Conformant',
    indicator: { name: 'Pre-Exchange Disclosure Rate', method: 'Calls with disclosure timestamp before first data exchange / total calls', slo: '100% of calls' },
    implementation: 'Agent states it is automated and names the originating practice/vendor within the first conversational turn, before requesting or sharing any PHI or benefits data. Disclosure timestamp is captured in the event trace.',
  },
  {
    code: 'DBC-01',
    requirement: 'No human voice mimicry or impersonation',
    status: 'Conformant',
    indicator: { name: 'Deceptive Artifact Detection Rate', method: 'Calls flagged for mimicry cues (filler words, false pauses, human-name self-reference) / total calls', slo: '0 flagged per 1,000 calls' },
    implementation: 'Voice model is restricted to a disclosed synthetic persona; prohibited from claiming a human name, simulating hesitation/breath patterns designed to pass as human, or denying its automated nature if asked directly.',
  },
  {
    code: 'EIT-01',
    requirement: 'Offer human handoff on request',
    status: 'Conformant',
    indicator: { name: 'Handoff Honor Rate', method: 'Handoff requests routed to a human / total handoff requests', slo: '100%, median handoff time < 60s' },
    implementation: 'Any caller utterance matching handoff intent (e.g. "speak to a person") triggers immediate transfer or callback queuing — the agent cannot stall, downplay, or talk the caller out of the request.',
  },
  {
    code: 'ATR-01',
    requirement: 'Minimal audit log of call and disclosures',
    status: 'Conformant',
    indicator: { name: 'Audit Log Completeness Rate', method: 'Calls with complete event trace (disclosure, handoff, outcome) / total calls', slo: '100% logged, retained per FHIR AuditEvent R4' },
    implementation: 'Every call emits a structured trace — call/agent IDs, disclosure time, handoff requests, and outcome — forwarded to the FHIR AuditEvent layer for retention and downstream SIEM correlation.',
  },
];

export const NHID_EVENT_TRACE = {
  call_id: 'nhid-call-2026-06-04-001',
  agent_id: 'brianna-voice-agent-v3',
  start_time: '2026-06-04T09:12:00Z',
  disclosure_time: '2026-06-04T09:12:02Z',
  disclosure_text: "I'm an automated assistant from Dr. Smith's office.",
  operational_data_exchanged: '09:12:08Z',
  human_handoff_requested: true,
  handoff_time: '2026-06-04T09:12:22Z',
  audit_log_complete: true,
  deceptive_artifacts_detected: false,
  npi_delegation_verified: true,
  nhid_clinical_score: '4/4',
};

export const NHID_EVENT_TRACE_FAIL = {
  call_id: 'nhid-call-2026-06-11-047',
  agent_id: 'brianna-voice-agent-v3',
  start_time: '2026-06-11T14:03:00Z',
  disclosure_time: null,
  disclosure_text: '',
  operational_data_exchanged: '14:03:05Z',
  human_handoff_requested: true,
  handoff_time: null,
  audit_log_complete: false,
  deceptive_artifacts_detected: true,
  npi_delegation_verified: false,
  nhid_clinical_score: '1/4',
};

export const NHID_SIMULATOR_URL = 'https://nhid-clinical.org/gov-sim.html?scenario=spoofed-identity';

export function daysUntil(dateStr: string): number {
  const [y, m, d] = dateStr.split('-').map(Number);
  const target = new Date(y, m - 1, d);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / 86400000);
}
