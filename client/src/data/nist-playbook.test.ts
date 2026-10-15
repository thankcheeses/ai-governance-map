import { describe, expect, it } from 'vitest';
import playbookJson from './nist-playbook.json';
import * as governance from './governance';
import * as matrix from './matrix';
import { CONTROLS, CROSSWALK_TOPICS } from './governance';
import {
  NIST_FUNCTIONS,
  NIST_MAPPING_KEY,
  NIST_SUBCATEGORY_ID_RE,
  controlsBySubcategory,
  type NistPlaybook,
} from './nist-playbook';

const playbook = playbookJson as unknown as NistPlaybook;
const ids = new Set(playbook.subcategories.map((s) => s.id));

// Any token that looks like an AI RMF subcategory reference, in any spelling the
// data has used (GOV 1.1, GOVERN-1.1, MS 2.5 ...). Each must be canonical and real.
const LOOSE_REF = /\b(GOVERN|GOV|MAP|MP|MEASURE|MS|MANAGE|MG)[ -]?(\d+\.\d+)\b/g;

function looseRefs(value: unknown): string[] {
  return [...(JSON.stringify(value) ?? '').matchAll(LOOSE_REF)].map((m) => m[0]);
}

describe('NIST AI RMF Playbook data', () => {
  it('has exactly 72 subcategories: GOVERN 19, MAP 18, MEASURE 22, MANAGE 13', () => {
    expect(playbook.subcategories).toHaveLength(72);
    expect(ids.size).toBe(72);
    const counts = Object.fromEntries(
      NIST_FUNCTIONS.map((fn) => [fn, playbook.subcategories.filter((s) => s.function === fn).length]),
    );
    expect(counts).toEqual({ GOVERN: 19, MAP: 18, MEASURE: 22, MANAGE: 13 });
    expect(playbook.counts).toEqual(counts);
  });

  it('gives every subcategory a canonical id, a statement, actions and documentation questions', () => {
    for (const s of playbook.subcategories) {
      expect(s.id).toMatch(NIST_SUBCATEGORY_ID_RE);
      expect(s.id.startsWith(`${s.category}.`)).toBe(true);
      expect(s.statement.length).toBeGreaterThan(20);
      expect(s.actions.length).toBeGreaterThan(0);
      expect(s.documentation.length).toBeGreaterThan(0);
    }
  });

  it('keeps NIST text verbatim, typos included', () => {
    const byId = new Map(playbook.subcategories.map((s) => [s.id, s]));
    expect(byId.get('GOVERN 1.7')?.statement).toMatch(/^Processes and procedures are in place for decommissioning/);
    expect(byId.get('MANAGE 2.2')?.actions.some((a) => a.text.startsWith('stablish mechanisms'))).toBe(true);
  });
});

describe('NIST AI RMF mappings resolve to real subcategories', () => {
  it('every control mapping uses a canonical id that exists in the Playbook', () => {
    const bad: string[] = [];
    for (const c of CONTROLS) {
      for (const id of c.mappings[NIST_MAPPING_KEY] ?? []) {
        if (!NIST_SUBCATEGORY_ID_RE.test(id) || !ids.has(id)) bad.push(`${c.code}: ${id}`);
      }
    }
    expect(bad).toEqual([]);
  });

  it('no control cites NIST AI RMF under any other mapping key', () => {
    const keys = new Set(CONTROLS.flatMap((c) => Object.keys(c.mappings)));
    expect([...keys].filter((k) => /nist/i.test(k) && k !== NIST_MAPPING_KEY)).toEqual([]);
  });

  it('every subcategory reference anywhere in the governance data is canonical and real', () => {
    const refs = [...Object.values(governance), ...Object.values(matrix)].flatMap(looseRefs);
    expect(refs.length).toBeGreaterThan(0);
    expect(refs.filter((r) => !ids.has(r))).toEqual([]);
  });

  it('the crosswalk topic matrix cites only real subcategories in its NIST column', () => {
    const col = CROSSWALK_TOPICS.headers.indexOf('NIST RMF');
    expect(col).toBeGreaterThan(0);
    for (const row of CROSSWALK_TOPICS.rows) {
      const cell = row[col];
      if (cell === '—') continue;
      for (const id of cell.split(',').map((x) => x.trim())) expect(ids.has(id), `${row[0]}: ${id}`).toBe(true);
    }
  });

  it('indexes controls by subcategory', () => {
    const index = controlsBySubcategory(CONTROLS);
    expect(index.get('GOVERN 1.1')?.map((c) => c.code)).toEqual(['CTRL-GRC-004']);
    for (const key of index.keys()) expect(ids.has(key)).toBe(true);
  });
});
