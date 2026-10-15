// NIST AI RMF Playbook — typed access to the 72 subcategories.
//
// Source: NIST AI RMF Playbook, https://airc.nist.gov/airmf-resources/playbook/
// (US Government work, public domain). Statements, suggested actions and
// "Transparency & Documentation" questions are verbatim from NIST, including
// NIST's own typos — do not edit nist-playbook.json by hand. Regenerate it with:
//
//   node scripts/generate-nist-playbook.mjs <path/to/playbook.json>
//
// The JSON (~240 KB raw) is loaded with a dynamic import so it ships as its own
// chunk and never weighs on first paint. Only the small, hand-written metadata
// below is part of the main bundle.

import { useEffect, useState } from 'react';
import type { Control } from './governance';

export const NIST_PLAYBOOK_URL = 'https://airc.nist.gov/airmf-resources/playbook/';

/** The framework key controls use in `mappings` for NIST AI RMF subcategories. */
export const NIST_MAPPING_KEY = 'NIST AI RMF';

export const NIST_FUNCTIONS = ['GOVERN', 'MAP', 'MEASURE', 'MANAGE'] as const;
export type NistFunction = (typeof NIST_FUNCTIONS)[number];

/** Canonical subcategory id, e.g. "GOVERN 1.7", "MEASURE 2.11". */
export const NIST_SUBCATEGORY_ID_RE = /^(GOVERN|MAP|MEASURE|MANAGE) \d+\.\d+$/;
/** Finds subcategory ids inside free text (crosswalk cells, notes). */
export const NIST_SUBCATEGORY_ID_SCAN = /\b(GOVERN|MAP|MEASURE|MANAGE) \d+\.\d+\b/g;

export interface PlaybookItem {
  text: string;
  sub: string[];
}

export interface NistSubcategory {
  id: string;
  function: NistFunction;
  /** e.g. "GOVERN 1" */
  category: string;
  /** Official subcategory outcome statement. */
  statement: string;
  about: string[];
  actionsIntro?: string;
  /** Suggested actions. */
  actions: PlaybookItem[];
  documentationIntro?: string;
  /** Transparency & Documentation questions. */
  documentation: PlaybookItem[];
}

export interface NistPlaybook {
  source: { title: string; publisher: string; url: string; license: string; note: string };
  counts: Record<NistFunction, number>;
  subcategories: NistSubcategory[];
}

let cache: Promise<NistPlaybook> | null = null;

export function loadNistPlaybook(): Promise<NistPlaybook> {
  cache ??= import('./nist-playbook.json').then((m) => (m.default ?? m) as unknown as NistPlaybook);
  return cache;
}

/** Loads the playbook on mount; `null` until the chunk arrives. */
export function useNistPlaybook(enabled = true): NistPlaybook | null {
  const [data, setData] = useState<NistPlaybook | null>(null);
  useEffect(() => {
    if (!enabled || data) return;
    let live = true;
    loadNistPlaybook().then((pb) => {
      if (live) setData(pb);
    });
    return () => {
      live = false;
    };
  }, [enabled, data]);
  return data;
}

/** subcategory id -> codes of the controls that cite it. */
export function controlsBySubcategory(controls: Control[]): Map<string, Control[]> {
  const out = new Map<string, Control[]>();
  for (const c of controls) {
    for (const id of c.mappings[NIST_MAPPING_KEY] ?? []) {
      const list = out.get(id) ?? [];
      list.push(c);
      out.set(id, list);
    }
  }
  return out;
}
