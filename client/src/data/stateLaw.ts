import { FRAMEWORKS, OBLIGATIONS, STATE_AI_LAWS, type Framework, type Obligation } from './governance';

// ---------------------------------------------------------------------------
// What the register knows about one US state.
//
// Clicking the United States used to answer for every state at once: no
// national AI law. True, and useless to someone in Colorado. The answer a
// reader needs is per state — the state's own instruments, plus the federal
// ones that apply there anyway.
//
// Everything here is derived from the framework register by jurisdiction, not
// kept as a second hand-written list. A state is only ever shown an instrument
// the register already carries; nothing is added for the map's sake.
// ---------------------------------------------------------------------------

export interface StateProfile {
  name: string;
  postalCode: string;
  /** Instruments whose jurisdiction is this state or a city in it. */
  instruments: Framework[];
  /** Obligations from those instruments, earliest effective date first. */
  obligations: Obligation[];
  /** Binding US-wide instruments in the register; they apply in every state. */
  federal: Framework[];
}

const isBinding = (f: Framework) => /\(Binding\)/.test(f.type);

/** True when a framework's jurisdiction string names this state (or a city in it). */
export function jurisdictionNamesState(jurisdiction: string, state: string): boolean {
  const j = jurisdiction.toLowerCase();
  const s = state.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Whole words only: "Kansas" is inside "Arkansas", "Virginia" inside "West Virginia".
  const text = s === 'virginia' ? j.replace(/west virginia/g, '') : j;
  return new RegExp(`(^|[^a-z])${s}([^a-z]|$)`).test(text);
}

export function stateInstruments(state: string): Framework[] {
  return FRAMEWORKS.filter((f) => jurisdictionNamesState(f.jurisdiction, state));
}

/** US-wide binding instruments, i.e. jurisdiction exactly "US". */
export const FEDERAL_BINDING = FRAMEWORKS.filter((f) => f.jurisdiction.trim() === 'US' && isBinding(f));

export function stateProfile(state: string): StateProfile | undefined {
  const row = STATE_AI_LAWS.find((s) => s.name === state);
  if (!row) return undefined;
  const instruments = stateInstruments(state);
  const codes = new Set(instruments.map((f) => f.shortCode));
  const obligations = OBLIGATIONS.filter((o) => codes.has(o.framework)).sort((a, b) =>
    a.effective.localeCompare(b.effective),
  );
  return { name: row.name, postalCode: row.postalCode, instruments, obligations, federal: FEDERAL_BINDING };
}

/** Whether the register holds a binding instrument for this state. */
export const stateHasBindingLaw = (state: string) => stateInstruments(state).some(isBinding);
