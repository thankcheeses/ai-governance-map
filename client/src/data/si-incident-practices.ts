import type { SourceRef } from './governance';

// ---------------------------------------------------------------------------
// Key Practices for Incident Readiness and Response in Super Intelligence
// Training and Evaluation — NIST CAISSI / NSA SISC / CISA, 16 October 2026.
//
// Ten voluntary practices across five lifecycle stages, transcribed from the
// publication itself (PP-26-4396, Ver 1.0, TLP:CLEAR). US Government work.
//
// Three transcription rules, so a reader can tell exactly what was done to the
// text and reconstruct the original from this file:
//
//   1. Practice titles and sub-practice text are VERBATIM. Nothing is
//      paraphrased, shortened or modernised.
//   2. The document annotates sub-practices with NIST Cybersecurity Framework
//      2.0 subcategory ids in square brackets, e.g. "[PR.AA-05]". Those are
//      lifted out of the sentence into `csf` so they can render as a crosswalk
//      instead of as punctuation. Nothing else is removed from the sentence.
//   3. The document also carries numeric bibliography markers, e.g. "[2]".
//      Those move into `sources`, which indexes BEST_PRACTICE_SOURCES below.
//
// On the terminology: the publication, the NIST landing page and CISA's own
// topic page all read "Super Intelligence (SI)" throughout, and name the
// authoring bodies "NIST CAISSI" and "NSA SISC". Older URLs, image filenames
// and the titles of previously published documents it cites still read "AI".
// The register quotes what the publishers published and does not normalise it
// in either direction — see SI_PRACTICES_SOURCE.note.
//
// This document creates no legal obligation. It is explicitly voluntary, and
// it carries its own disclaimer of endorsement, so nothing here may be
// presented as a requirement, a certification or a government approval.
// ---------------------------------------------------------------------------

export const SI_PRACTICES_STAGES = ['Prepare', 'Detect', 'Respond', 'Recover', 'Report'] as const;
export type PracticeStage = (typeof SI_PRACTICES_STAGES)[number];

/** What each stage is for, in the document's own framing. */
export const STAGE_INTENT: Record<PracticeStage, string> = {
  Prepare:
    'Govern the programme, inventory assets and risks, and harden systems before an incident. SI control incidents add considerations beyond established cybersecurity practice because agents are nondeterministic and act autonomously.',
  Detect:
    'Define intended activity and continuously monitor for departures from it — across the model, harness, host and network. SI-enabled monitors watching SI agents introduce vulnerabilities of their own.',
  Respond:
    'Contain and remove the activity, and preserve evidence for analysis. An SI control incident may leave a compromised environment and persistent agent access.',
  Recover:
    'Restore from known-good baselines and verify integrity before returning to service. Recovery during training can itself shape future agents, including by reinforcing the behaviour that caused the incident.',
  Report:
    'Notify authorities, coordinate with affected parties and disclose publicly. Reporting runs throughout the incident lifecycle, not only after recovery.',
};

export interface PracticeItem {
  /** Numbering as printed, e.g. "1.1". */
  ref: string;
  /** Verbatim sentence, with bracketed references lifted into csf / sources. */
  text: string;
  /** NIST CSF 2.0 subcategory ids the document attaches to this item. */
  csf: string[];
  /** Indices into BEST_PRACTICE_SOURCES. */
  sources?: number[];
  /** Named open problem in the document's "Areas for Future Work". */
  futureWork?: string;
}

export interface KeyPractice {
  id: number;
  stage: PracticeStage;
  title: string;
  items: PracticeItem[];
}

export const SI_KEY_PRACTICES: KeyPractice[] = [
  {
    id: 1,
    stage: 'Prepare',
    title: 'Design and Implement Technical Controls',
    items: [
      {
        ref: '1.1',
        text: 'Consistent with least privilege, limit SI agent access (e.g., access to sensitive information, systems, and tools) to what is necessary to perform intended tasks.',
        csf: ['PR.AA-05'],
      },
      {
        ref: '1.2',
        text: 'Where possible, use single-use infrastructure and limit communication between SI agents to intended channels to prevent unauthorized coordination.',
        csf: ['PR.IR-01'],
      },
      {
        ref: '1.3',
        text: 'Provide agents with instructions that clearly identify the task scope as well as any bounds, restrictions, or rules of engagement.',
        csf: [],
      },
      {
        ref: '1.4',
        text: 'Identify, map, and restrict potential persistence mechanisms and unauthorized communication across internal and external systems. Pay particular attention to channels for creating copies of SI model weights or performing unmonitored model inference.',
        csf: ['ID.RA-05', 'PR.IR-01'],
      },
      {
        ref: '1.5',
        text: 'Limit SI agent network access, via a strict allowlist where possible. Route any required network access through a monitored gateway.',
        csf: ['PR.IR-01'],
      },
      {
        ref: '1.6',
        text: 'Implement an SI control policy laying out intended responses to defined scenarios and infrastructure for automated enforcement.',
        csf: [],
        sources: [2],
      },
      {
        ref: '1.7',
        text: 'Build mechanisms to rapidly block, contain, or terminate agent activity if an incident or near-miss is detected.',
        csf: ['RS.MI-01'],
      },
      {
        ref: '1.8',
        text: 'Implement security controls with the expectation that SI agents will frequently locate and exploit misconfigurations and vulnerabilities.',
        csf: ['ID.RA-05', 'ID.RA-06'],
      },
      {
        ref: '1.9',
        text: 'Test and red-team SI control measures with humans and SI systems before deploying them. Only use SI systems to red-team in cases where out-of-scope actions could not result in harm to critical systems.',
        csf: ['ID.IM-02'],
        futureWork: 'SI Red-Teaming for Critical Systems',
      },
      {
        ref: '1.10',
        text: 'Abide by good engineering practices to prevent undesired or unauthorized agent activity that exploits poor security.',
        csf: ['PR.DS-01', 'PR.PS-06'],
        sources: [3, 14, 15],
      },
    ],
  },
  {
    id: 2,
    stage: 'Prepare',
    title: 'Build Organizational and Personnel Response Readiness',
    items: [
      {
        ref: '2.1',
        text: 'Establish clear indicators, criteria, and severity scoring for SI control incidents and near-misses.',
        csf: ['ID.RA-06', 'RS.MA-03'],
        sources: [2],
      },
      {
        ref: '2.2',
        text: 'Run drills and simulations to prepare for SI control incidents and related detection, response, recovery, and reporting measures.',
        csf: ['ID.IM-02'],
        sources: [10],
      },
      {
        ref: '2.3',
        text: 'Create inbound reporting channels to receive reports of SI control incidents and information from affected third parties.',
        csf: [],
        sources: [2],
      },
      {
        ref: '2.4',
        text: 'Partner with independent external auditors and evaluators to carry out assessments of control, monitoring, and incident detection protocols and verify that these systems are operating as intended.',
        csf: [],
      },
      {
        ref: '2.5',
        text: 'Consider publishing identifiers associated with SI evaluation, including those particular to an agent, to assist defenders with understanding unexpected traffic.',
        csf: [],
        futureWork: 'Agent Identifiers',
      },
      {
        ref: '2.6',
        text: 'Draft structured risk assessments before starting training runs, evaluations, or deployments. Only start or resume if senior leadership, informed by assessments from external evaluators where appropriate, are satisfied with the risk levels. Risk assessments can cover multiple training runs or evaluations.',
        csf: ['GV.RR-02', 'GV.RM-06'],
        futureWork: 'Structured Risk Assessments',
      },
    ],
  },
  {
    id: 3,
    stage: 'Detect',
    title: 'Monitor for Unexpected Activity',
    items: [
      {
        ref: '3.1',
        text: "Define the intended security boundaries and scope of actions for each SI agent, including the SI agent's system and network access, to facilitate detection of discrepancies and anomalies.",
        csf: ['PR.IR-01'],
        futureWork: 'Defining Intended Activity Baselines',
      },
      {
        ref: '3.2',
        text: 'Comprehensively monitor all system layers for agents that pose SI control incident risks, including the model, harness, host, and network levels, using both programmatic and SI real-time monitors to scan multi-agent workflows, agent trajectories, reasoning, and outputs.',
        csf: ['PR.PS-04', 'DE.CM-01', 'DE.CM-06', 'DE.CM-09'],
        futureWork: 'Synchronous Monitoring',
      },
      {
        ref: '3.3',
        text: 'Ensure that SI agents cannot access or interfere with monitoring processes and logs. Incorporate additional signals in monitoring, including hardware telemetry and performing consistency checks between monitoring layers, to detect tampering attempts.',
        csf: ['DE.AE-03'],
      },
      {
        ref: '3.4',
        text: 'Where possible, use multiple models for monitoring or cross-validation, ideally from different model families.',
        csf: [],
      },
      {
        ref: '3.5',
        text: 'Establish mechanisms to detect unexpected activity and escalate for human review or automated responses, such as methods for real-time visibility across SI agents or placing canaries in environments to detect agent instances that have obtained access outside intended bounds.',
        csf: ['DE.AE-02', 'DE.AE-06'],
        futureWork: 'Additional Mechanisms for Escalation',
      },
    ],
  },
  {
    id: 4,
    stage: 'Detect',
    title: 'Validate and Secure Monitors to Improve Operational Integrity',
    items: [
      {
        ref: '4.1',
        text: 'Red-team monitors with humans and SI systems to improve their reliability.',
        csf: ['ID.IM-02'],
      },
      {
        ref: '4.2',
        text: 'Treat monitored SI model outputs as potentially containing exploits aimed at the monitors.',
        csf: ['DE.CM-09'],
        futureWork: 'SI-Enabled Investigations',
      },
    ],
  },
  {
    id: 5,
    stage: 'Respond',
    title: 'Collect, Retain, and Analyze Evidence',
    items: [
      {
        ref: '5.1',
        text: 'Preserve model weights as well as training, evaluation, and deployment environments to the extent necessary to investigate SI control incidents, including intermediate checkpoints, timestamps, sandbox and network logs, and rejected actions and tool calls.',
        csf: ['RS.AN-07'],
      },
      {
        ref: '5.2',
        text: 'Preserve detailed information about the configuration of SI agent(s), safeguards, related software components, and environments necessary to reproduce the incident.',
        csf: ['RS.AN-07'],
      },
      {
        ref: '5.3',
        text: 'Retain tamper-resistant logs with reliable timestamps sufficient to reconstruct agent trajectories, tool calls, reasoning traces, user interactions, environmental states, and security-control decisions. Support Continuous Event Monitoring and Threat Hunting, Investigation, Response, and Forensics of both testing environments and agents.',
        csf: ['PR.PS-04', 'RS.AN-07'],
      },
      {
        ref: '5.4',
        text: 'Analyze log and telemetry data to establish the actions taken by SI agents during the incident, identifying any internal or external systems that were impacted and root causes such as vulnerabilities.',
        csf: ['RS.AN-03', 'ID.IM-03'],
      },
      {
        ref: '5.5',
        text: 'Consider leveraging SI models to assist in incident investigation; however, where feasible, verify key facts through human review and use multiple models to cross-check analysis, including models from outside the model family from which the incident originated.',
        csf: ['RS.MA-01', 'DE.AE-06'],
        futureWork: 'SI-Enabled Investigations',
      },
      {
        ref: '5.6',
        text: 'Investigate training and evaluation runs for other similar SI agents to assess whether any other agents were involved in the control incident or experienced similar control failures.',
        csf: [],
      },
    ],
  },
  {
    id: 6,
    stage: 'Respond',
    title: 'Mitigate and Shut Down Undesired Activity',
    items: [
      {
        ref: '6.1',
        text: 'Define and implement shutdown policies in the event of unintended activity, control failures, and monitor outages or tampering. Calibrate policies and response options to the capability of the model and severity or scope of the incident.',
        csf: ['RS.MI-01', 'RS.AN-08'],
      },
      {
        ref: '6.2',
        text: 'Automatically shut down impacted SI agent trajectories on detection of a control failure or in-progress SI control incident.',
        csf: ['RS.MI-02'],
      },
      {
        ref: '6.3',
        text: 'Depending on the severity or scope of the incident, shut down or pause training, evaluation, or deployment for other similar SI agents until control measures can be strengthened and verified.',
        csf: [],
        futureWork: 'Incident Severity Scores',
      },
      {
        ref: '6.4',
        text: "Revoke credentials under the organization's control that were accessed during the incident and rebuild any environments that may have been compromised.",
        csf: ['RS.MI-02', 'RC.RP-05'],
      },
      {
        ref: '6.5',
        text: 'Seek out and remediate any possible routes for agent persistence, such as code backdoors and hidden communication channels.',
        csf: ['RS.MI-02'],
      },
    ],
  },
  {
    id: 7,
    stage: 'Recover',
    title: 'Verify and Strengthen Containment Before Resuming SI Agent Activity',
    items: [
      {
        ref: '7.1',
        text: 'Rebuild any environments that may have been compromised from verified baselines (e.g., model weights, harness code, container images, tool configurations).',
        csf: ['RC.RP-03'],
      },
      {
        ref: '7.2',
        text: 'Patch or report any vulnerabilities exploited by agents during the control incident.',
        csf: ['RS.MI-02'],
      },
      {
        ref: '7.3',
        text: 'Validate that monitors, logging, egress allowlists, shutdown mechanisms, permission restrictions, and other containment layers are functional before SI agents are restarted.',
        csf: ['RC.RP-05'],
      },
      {
        ref: '7.4',
        text: 'Update and strengthen controls and monitors to prevent future incidents. This includes, at a minimum, verifying that new controls and monitors would prevent and/or detect similar control incidents, such as by replaying trajectories or actions from the incident.',
        csf: ['ID.IM-03', 'ID.IM-04'],
      },
      {
        ref: '7.5',
        text: 'Before resuming SI agent activity, document the recovery decision and the remaining risks.',
        csf: ['RC.RP-06'],
      },
      {
        ref: '7.6',
        text: 'Prepare an after-action report, as appropriate, documenting the incident, the response, and lessons learned. Lessons learned may warrant follow-up investigations or experiments to understand any failures related to agent activity and alignment during the incident.',
        csf: ['RC.RP-06'],
      },
      {
        ref: '7.7',
        text: 'For SI control incidents that occur during model training, design recovery procedures that neither reinforce patterns of activity that led to the control incident nor make future adverse activity more difficult to detect, such as by training against explicit adverse chain-of-thought reasoning in a way that reduces monitorability.',
        csf: [],
        futureWork: 'Training-Safe Recovery',
      },
    ],
  },
  {
    id: 8,
    stage: 'Report',
    title: 'Coordinate with Affected Parties',
    items: [
      {
        ref: '8.1',
        text: 'Notify parties whose systems have been compromised or exploited by an SI control incident, including third parties who are not the final target of the incident.',
        csf: ['RS.CO-02'],
      },
      {
        ref: '8.2',
        text: "Share relevant details for affected parties' incident response, including detailed timelines and transcripts that provide context on exploited vulnerabilities or impacted systems, where feasible.",
        csf: ['RS.CO-03'],
      },
      {
        ref: '8.3',
        text: 'Share information, such as lessons learned, with other parties across the value chain that were impacted by the incident or may benefit from investigation findings, such as the developer of the SI model, or evaluation and infrastructure providers.',
        csf: [],
      },
    ],
  },
  {
    id: 9,
    stage: 'Report',
    title: 'Notify Government',
    items: [
      {
        ref: '9.1',
        text: 'Adhere to any applicable legal reporting requirements, including cybersecurity incident reporting obligations to CISA, law enforcement, and/or cyber-defense organizations. Voluntarily report cybersecurity incidents or near-misses arising from SI control incidents to CISA as appropriate.',
        csf: ['GV.OC-03', 'RS.CO-02'],
        sources: [10, 14],
      },
      {
        ref: '9.2',
        text: 'Report software vulnerabilities arising from SI control incidents using established mechanisms.',
        csf: [],
        sources: [16, 17],
      },
      {
        ref: '9.3',
        text: 'Voluntarily share SI-specific information concerning control incidents and near-misses with SI experts in government, such as NIST CAISSI and NSA SISC, to facilitate research and preparedness, after carrying out any legally mandated reporting. Provide context for understanding the circumstances which led to the incident, the actions taken by SI agents, and root causes related to control gaps or agent alignment, as well as the severity of the incident and any areas of uncertainty.',
        csf: ['RS.CO-03', 'RS.MA-03'],
      },
    ],
  },
  {
    id: 10,
    stage: 'Report',
    title: 'Share Information Publicly',
    items: [
      {
        ref: '10.1',
        text: 'Share details with the public, where appropriate, as early as feasible.',
        csf: [],
        sources: [2],
      },
      {
        ref: '10.2',
        text: 'Facilitate third-party review, providing sufficient access and documentation for independent analysis.',
        csf: ['ID.IM-01'],
      },
      {
        ref: '10.3',
        text: 'Identify and publicly report key practices, takeaways, or improvements adopted in response to the incident or that could benefit other actors in the ecosystem.',
        csf: ['ID.IM-03', 'RS.CO-03'],
      },
    ],
  },
];

/** The two terms the practices turn on, verbatim from the Definitions section. */
export const SI_PRACTICES_DEFINITIONS = [
  {
    term: 'SI control incident',
    text: 'An occurrence in which one or more SI agents takes significant uninstructed actions that compromise explicit or implicit policies, controls, or security measures imposed by the operator to define the intended task scope or to ensure human oversight. "Uninstructed" means that the agent was not directed to take the action by its operator or any adversarial source.',
    note: 'The document is explicit that actions resulting from an adversarial prompt injection or an intentionally backdoored model are instructed actions, and so are not the primary cause of an SI control incident. An SI system is the source of a control incident, whereas a system or information is the target of a cybersecurity incident — the two are not coextensive.',
  },
  {
    term: 'SI control near-miss',
    text: 'An occurrence which did not result in an SI control incident but presented a reasonably foreseeable or imminent risk of doing so. Near-misses may reveal potential gaps or weaknesses in controls, security measures, or processes designed to prevent, detect, or respond to SI control incidents.',
  },
  {
    term: 'SI agents',
    text: 'SI systems that can interact with an environment, receive information, and autonomously execute actions in service of a specified goal. SI agent systems typically consist of at least one generative SI model and scaffolding software that equips it with tools to take a range of discretionary actions. These systems may be more expansive, containing multiple sub-agents with software that orchestrates their interactions.',
  },
] as const;

export const SI_PRACTICES_AUDIENCE =
  'Primarily organizations training or evaluating highly capable SI agents on long-horizon tasks with limited human supervision. The practices may also apply to deployers of such SI agents.';

/** The nine open problems the document names, with the practices that defer to them. */
export const SI_PRACTICES_FUTURE_WORK: { title: string; text: string }[] = [
  {
    title: 'Training-Safe Recovery',
    text: 'Identifying best practices and tradeoffs for responding to incidents of both SI control failures and near-misses during training to reduce the likelihood of future occurrences of the activity that led to the incident and avoid making future adverse activity more difficult to detect.',
  },
  {
    title: 'Defining Intended Activity Baselines',
    text: 'Better methods and practices for defining baselines and scopes for intended SI agent activity to support monitoring and detection of anomalous activity.',
  },
  {
    title: 'Synchronous Monitoring',
    text: 'Techniques for synchronous monitoring of agent trajectories, reasoning, and outputs that strike better balances between latency, performance, and security, or that reduce tradeoffs entirely.',
  },
  {
    title: 'Incident Severity Scores',
    text: 'Standardized severity scores for SI control incidents to inform response timelines and procedures (e.g., interventions ranging from blocking single actions to ending trajectories or halting full evaluation or training runs).',
  },
  {
    title: 'SI-Enabled Investigations',
    text: 'Practices for mitigating risks of correlated failures, addressing potential adversarial attacks and prompt injections against monitors, and maintaining monitor validity when processing voluminous logs.',
  },
  {
    title: 'Structured Risk Assessments',
    text: 'Research and methods concerning properly decomposing, substantiating, and quantifying risks and mitigations concerning SI agent training, evaluation, and deployment, including the risk of agents taking steps to obscure adverse activity.',
  },
  {
    title: 'SI Red-Teaming for Critical Systems',
    text: 'Research and methods for using SI agents to safely red-team SI control measures used in critical systems, such that actions taken by agents do not endanger safety or affect the availability of critical services.',
  },
  {
    title: 'Additional Mechanisms for Escalation',
    text: 'Methods for additional mechanisms by which SI agents can trigger human review of actions, for example in multi-agent settings.',
  },
  {
    title: 'Agent Identifiers',
    text: 'Methods for identifying SI agents and their associated network traffic, including for example publishing identifiers such as IP address ranges – which can help attribute agent traffic but might also expose SI agent deployers to attack.',
  },
];

/**
 * The document's "Follow Existing Best Practice" list — the instruments it
 * builds on. Indexed from 1 to match the printed bracketed markers, so index 0
 * is deliberately unused.
 */
export const BEST_PRACTICE_SOURCES: { n: number; title: string; url: string }[] = [
  { n: 1, title: 'NIST CSWP 29: Cybersecurity Framework 2.0', url: 'https://nvlpubs.nist.gov/nistpubs/CSWP/NIST.CSWP.29.pdf' },
  { n: 2, title: 'NIST SP 800-61r3: Incident Response Recommendations and Considerations for Cybersecurity Risk Management', url: 'https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r3.pdf' },
  { n: 3, title: 'NIST SP 800-53r5: Security and Privacy Controls for Information Systems and Organizations', url: 'https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-53r5.pdf' },
  { n: 4, title: 'NIST SP 800-207: Zero Trust Architecture', url: 'https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-207.pdf' },
  { n: 5, title: 'NIST IR 8587: Protecting Tokens and Assertions from Forgery, Theft, and Misuse', url: 'https://nvlpubs.nist.gov/nistpubs/ir/2026/NIST.IR.8587.pdf' },
  { n: 6, title: 'NCSC-UK, CISA, et al.: Guidelines for secure AI system development', url: 'https://www.ncsc.gov.uk/sites/default/files/documents/Guidelines-for-secure-AI-system-development.pdf' },
  { n: 7, title: 'NIST SP 800-218A: Secure Software Development Practices for Generative AI and Dual-Use Foundation Models', url: 'https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-218A.pdf' },
  { n: 8, title: 'NSA, CISA, FBI, et al.: Joint Guidance on Deploying AI Systems Securely', url: 'https://media.defense.gov/2024/Apr/15/2003439257/-1/-1/0/CSI-DEPLOYING-AI-SYSTEMS-SECURELY.PDF' },
  { n: 9, title: "ASD's ACSC, CISA, NSA, et al.: Careful Adoption of Agentic AI Services", url: 'https://www.cyber.gov.au/sites/default/files/2026-05/careful_adoption_of_agentic_ai_services.pdf' },
  { n: 10, title: 'CISA: SI Cybersecurity Collaboration Playbook', url: 'https://www.cisa.gov/resources-tools/resources/si-cybersecurity-collaboration-playbook' },
  { n: 11, title: 'CISA: Logging Reference Architecture (LRA)', url: 'https://www.cisa.gov/sites/default/files/2026-09/logging-reference-architecture-508.pdf' },
  { n: 12, title: 'CISA: Using Cyber Decoys to Strengthen Detection and Response', url: 'https://www.cisa.gov/resources-tools/resources/using-cyber-decoys-strengthen-detection-and-response' },
  { n: 13, title: 'CISA: Binding Operational Directive 26-04 and its Implementation Guidance', url: 'https://www.cisa.gov/news-events/directives/bod-26-04-implementation-guidance-prioritizing-security-updates-based-risk' },
  { n: 14, title: 'CISA: Incident Reporting System', url: 'https://myservices.cisa.gov/irf' },
  { n: 15, title: 'NIST SP 800-218: Secure Software Development Framework', url: 'https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-218.pdf' },
  { n: 16, title: 'CISA: Coordinated Vulnerability Disclosure (CVD) Program', url: 'https://www.cisa.gov/resources-tools/programs/coordinated-vulnerability-disclosure-cvd-program' },
  { n: 17, title: 'CISA: Known Exploited Vulnerabilities Catalog', url: 'https://www.cisa.gov/known-exploited-vulnerabilities-catalog' },
];

export const SI_PRACTICES_URL =
  'https://www.nist.gov/news-events/news/2026/10/key-practices-incident-readiness-and-response-super-intelligence-training';

export const SI_PRACTICES_CISA_URL =
  'https://www.cisa.gov/resources-tools/resources/key-practices-incident-readiness-and-response-super-intelligence-training-and-evaluation';

export const SI_PRACTICES_SOURCE: SourceRef = {
  tier: 'official-guidance',
  citation:
    'NIST CAISSI, NSA SISC & CISA — Key Practices for Incident Readiness and Response in Super Intelligence Training and Evaluation (PP-26-4396, October 2026, Ver 1.0, TLP:CLEAR)',
  url: SI_PRACTICES_URL,
  checked: '2026-10-16',
  note: 'Practice titles and sub-practices transcribed verbatim from the publication PDF; bracketed NIST CSF 2.0 subcategory ids and bibliography markers were lifted into structured fields and nothing else was changed. Voluntary guidance — it creates no legal obligation, and the document carries its own disclaimer of endorsement. The publication and both publishers’ landing pages read "Super Intelligence (SI)" and name the authors "NIST CAISSI" and "NSA SISC"; older URLs and the titles of documents it cites still read "AI". Quoted as published, not normalised. Co-published at cisa.gov; second landing page checked the same day.',
};

export const SI_PRACTICES_COUNT = SI_KEY_PRACTICES.length;

export const practicesByStage = (stage: PracticeStage) =>
  SI_KEY_PRACTICES.filter((p) => p.stage === stage);

/** Every distinct CSF 2.0 subcategory the document cites, in document order. */
export const citedCsfSubcategories = (): string[] => {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const p of SI_KEY_PRACTICES) {
    for (const i of p.items) {
      for (const c of i.csf) {
        if (seen.has(c)) continue;
        seen.add(c);
        out.push(c);
      }
    }
  }
  return out;
};

export const sourceByNumber = (n: number) => BEST_PRACTICE_SOURCES.find((s) => s.n === n);
