import { FRAMEWORKS, OBLIGATIONS, type Obligation } from './governance';

// ---------------------------------------------------------------------------
// Start here.
//
// This register is general on purpose — 31 instruments, every US state, no
// vertical baked into the structure. The cost of being general is that the
// first ten seconds are blank: a reader arrives, sees everything about
// everything, and leaves. An atlas tells you about the world; nobody opens an
// atlas on a Tuesday.
//
// So this narrows the general register to a personal starting point: what are
// you building, and where. Nothing is hidden, nothing is removed — the whole
// register stays one click away — but the reader lands on ten rows instead of
// seventy-five.
//
// WHAT THIS DOES NOT DO, AND WHY THE WORDING MATTERS
//
// It does not tell you which law applies to you. Applicability turns on facts
// this tool has no access to — where you are established, who your users are,
// what role you play in the supply chain, revenue and headcount thresholds,
// whether a deployment is in scope at all. Saying "these apply to you" would
// be a legal determination dressed up as a filter.
//
// What it does is surface the rows most likely to be RELEVANT, and then show
// its own working: every profile declares the topics it selected and why, and
// the reader can change them. A filter you can see the reasoning behind is a
// research tool. One you cannot is a liability.
// ---------------------------------------------------------------------------

export interface SystemProfile {
  id: string;
  label: string;
  /** One line a reader recognises themselves in. */
  blurb: string;
  /** Obligation topics this kind of system usually has to answer for. */
  topics: string[];
  /** Why those topics — shown to the reader, not hidden in the code. */
  rationale: string;
}

/** What you are building. Topics are selected from the register's own vocabulary. */
export const SYSTEM_PROFILES: SystemProfile[] = [
  {
    id: 'assistant',
    label: 'Chatbot or assistant',
    blurb: 'Generates text or speech for people to read or hear.',
    topics: ['Transparency', 'Disclosure', 'Content Moderation', 'Data Governance', 'Documentation'],
    rationale:
      'Interactive generative systems are regulated first on whether people know they are talking to a machine and what the output is made of.',
  },
  {
    id: 'agent',
    label: 'Agent that takes actions',
    blurb: 'Calls tools, changes state, or acts without a human in the loop each time.',
    topics: ['Human Oversight', 'Logging', 'Audit & Logging', 'Monitoring', 'Risk Management', 'Testing & Evaluation', 'Cybersecurity'],
    rationale:
      'Once a system acts rather than answers, the questions become oversight, traceability and what happens when it does something it was not told to.',
  },
  {
    id: 'adm',
    label: 'Automated decisions about people',
    blurb: 'Hiring, credit, housing, benefits, insurance, education.',
    topics: ['Automated Decision-Making', 'Employment', 'Algorithm Transparency', 'Impact Assessment', 'Fundamental Rights', 'Accountability', 'Human Oversight'],
    rationale:
      'Decisions about people carry the densest obligations in the register — assessment, explanation, contestability and non-discrimination duties.',
  },
  {
    id: 'genmedia',
    label: 'Generated images, audio or video',
    blurb: 'Synthetic media, voice cloning, avatars, deepfake-capable output.',
    topics: ['Transparency', 'Disclosure', 'Right of Publicity', 'Content Moderation', 'Consent'],
    rationale:
      'Synthetic media law concentrates on marking, provenance, and consent to a person’s voice or likeness.',
  },
  {
    id: 'voice',
    label: 'Voice agent on live calls',
    blurb: 'An automated caller or receptionist speaking to people in real time.',
    topics: ['Voice Agent & Non-Human Identity', 'Disclosure', 'Transparency', 'Consent', 'Authentication', 'Audit & Logging'],
    rationale:
      'Live voice adds caller-consent and identity-verification duties on top of ordinary disclosure rules.',
  },
  {
    id: 'frontier',
    label: 'Frontier or general-purpose model',
    blurb: 'You train or fine-tune large models others build on.',
    topics: ['GPAI', 'Risk Management', 'Testing & Evaluation', 'Documentation', 'Cybersecurity', 'Prohibited Practices'],
    rationale:
      'Upstream model providers carry their own regime: systemic-risk assessment, evaluation, documentation and model-level security.',
  },
];

export interface JurisdictionProfile {
  id: string;
  label: string;
  /** Matched against `Framework.jurisdiction`, case-insensitively, as substrings. */
  match: string[];
}

/**
 * Where you operate. Each entry resolves through the register's own
 * `jurisdiction` strings rather than a hand-maintained list of instruments, so
 * adding a framework puts it in front of the right readers automatically.
 */
export const JURISDICTIONS: JurisdictionProfile[] = [
  { id: 'eu', label: 'European Union', match: ['EU', 'Council of Europe'] },
  { id: 'us-fed', label: 'United States (federal)', match: ['US'] },
  { id: 'us-state', label: 'US states', match: ['California', 'Colorado', 'Illinois', 'New York', 'Texas', 'Utah', 'Tennessee'] },
  { id: 'kr', label: 'South Korea', match: ['South Korea'] },
  { id: 'cn', label: 'China', match: ['China'] },
  { id: 'in', label: 'India', match: ['India'] },
  { id: 'vn', label: 'Vietnam', match: ['Vietnam'] },
  { id: 'sg', label: 'Singapore', match: ['Singapore'] },
  { id: 'global', label: 'Global / voluntary standards', match: ['Global'] },
];

const normalise = (v: string) => v.toLowerCase();

/** Framework short codes whose jurisdiction matches any chosen region. */
export function frameworkCodesFor(jurisdictionIds: string[]): Set<string> {
  const chosen = JURISDICTIONS.filter((j) => jurisdictionIds.includes(j.id));
  const codes = new Set<string>();
  for (const fw of FRAMEWORKS) {
    const j = normalise(fw.jurisdiction);
    for (const c of chosen) {
      if (c.match.some((m) => j.includes(normalise(m)))) {
        codes.add(fw.shortCode);
        break;
      }
    }
  }
  return codes;
}

export interface StartHereResult {
  rows: Obligation[];
  /** Topics the chosen profiles selected, for display. */
  topics: string[];
  /** How many rows the register holds in total, for honest framing. */
  total: number;
}

/**
 * Rows most likely to be relevant. Sorted so dated duties that have already
 * bitten come first, then what is coming, then the undated/ongoing ones —
 * which is the order a reader actually needs them in.
 */
export function startHereRows(
  systemIds: string[],
  jurisdictionIds: string[],
  today = new Date().toISOString().slice(0, 10),
): StartHereResult {
  const profiles = SYSTEM_PROFILES.filter((p) => systemIds.includes(p.id));
  const seen = new Set<string>();
  const topics: string[] = [];
  for (const p of profiles) {
    for (const t of p.topics) {
      if (seen.has(t)) continue;
      seen.add(t);
      topics.push(t);
    }
  }
  const codes = frameworkCodesFor(jurisdictionIds);

  const rows = OBLIGATIONS.filter((o) => {
    const jurisdictionOk = codes.size === 0 || codes.has(o.framework);
    const topicOk = topics.length === 0 || topics.includes(o.topic);
    return jurisdictionOk && topicOk;
  });

  const rank = (o: Obligation) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(o.effective)) return 2; // ongoing / undated
    return o.effective <= today ? 0 : 1; // in force, then upcoming
  };
  rows.sort((a, b) => rank(a) - rank(b) || a.effective.localeCompare(b.effective));

  return { rows, topics, total: OBLIGATIONS.length };
}
