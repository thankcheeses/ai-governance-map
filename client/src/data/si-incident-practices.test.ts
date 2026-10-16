import { describe, expect, it } from 'vitest';
import { FRAMEWORKS, TIMELINE_EVENTS } from './governance';
import {
  BEST_PRACTICE_SOURCES,
  SI_KEY_PRACTICES,
  SI_PRACTICES_DEFINITIONS,
  SI_PRACTICES_FUTURE_WORK,
  SI_PRACTICES_SOURCE,
  SI_PRACTICES_STAGES,
  citedCsfSubcategories,
  practicesByStage,
  sourceByNumber,
} from './si-incident-practices';

// NIST CSF 2.0 subcategory ids: two-letter function, two-letter category, number.
const CSF_ID = /^[A-Z]{2}\.[A-Z]{2}-\d{2}$/;

describe('SI incident key practices', () => {
  it('carries exactly the ten practices the publication numbers', () => {
    expect(SI_KEY_PRACTICES).toHaveLength(10);
    expect(SI_KEY_PRACTICES.map((p) => p.id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('assigns every practice to one of the five printed lifecycle stages', () => {
    for (const p of SI_KEY_PRACTICES) {
      expect(SI_PRACTICES_STAGES).toContain(p.stage);
    }
    // The document's own distribution: 2 / 2 / 2 / 1 / 3.
    expect(SI_PRACTICES_STAGES.map((s) => practicesByStage(s).length)).toEqual([2, 2, 2, 1, 3]);
  });

  it('numbers every sub-practice under its own practice, in order', () => {
    for (const p of SI_KEY_PRACTICES) {
      expect(p.items.length).toBeGreaterThan(0);
      p.items.forEach((item, i) => {
        expect(item.ref).toBe(`${p.id}.${i + 1}`);
      });
    }
  });

  it('keeps bracketed references out of the transcribed sentences', () => {
    // Rule 2 and 3 of the transcription: CSF ids and bibliography markers live
    // in their own fields. A stray bracket means text and structure disagree,
    // and the reader can no longer trust either.
    for (const p of SI_KEY_PRACTICES) {
      for (const item of p.items) {
        expect(item.text, `${item.ref} still carries a bracketed reference`).not.toMatch(/\[|\]/);
        expect(item.text.trim()).toBe(item.text);
        expect(item.text).toMatch(/[.?]$/);
      }
    }
  });

  it('uses well-formed CSF 2.0 subcategory ids and cites a real spread of them', () => {
    for (const p of SI_KEY_PRACTICES) {
      for (const item of p.items) {
        for (const c of item.csf) expect(c, `${item.ref} -> ${c}`).toMatch(CSF_ID);
        // No duplicates inside one item.
        expect(new Set(item.csf).size).toBe(item.csf.length);
      }
    }
    const cited = citedCsfSubcategories();
    expect(cited.length).toBeGreaterThan(20);
    // All six CSF 2.0 functions should appear — the document claims to span them.
    const functions = new Set(cited.map((c) => c.slice(0, 2)));
    for (const f of ['GV', 'ID', 'PR', 'DE', 'RS', 'RC']) expect(functions).toContain(f);
  });

  it('resolves every bibliography marker to a listed instrument', () => {
    for (const p of SI_KEY_PRACTICES) {
      for (const item of p.items) {
        for (const n of item.sources ?? []) {
          expect(sourceByNumber(n), `${item.ref} cites [${n}], which is not listed`).toBeDefined();
        }
      }
    }
  });

  it('lists the seventeen instruments the publication builds on, each with an https url', () => {
    expect(BEST_PRACTICE_SOURCES).toHaveLength(17);
    expect(BEST_PRACTICE_SOURCES.map((s) => s.n)).toEqual(
      Array.from({ length: 17 }, (_, i) => i + 1),
    );
    for (const s of BEST_PRACTICE_SOURCES) {
      expect(s.url).toMatch(/^https:\/\//);
      expect(s.title.length).toBeGreaterThan(10);
    }
  });

  it('points every "open problem" marker at a named area for future work', () => {
    const named = new Set(SI_PRACTICES_FUTURE_WORK.map((f) => f.title));
    expect(named.size).toBe(9);
    for (const p of SI_KEY_PRACTICES) {
      for (const item of p.items) {
        if (item.futureWork) expect(named, `${item.ref}`).toContain(item.futureWork);
      }
    }
  });

  it('defines the terms the practices turn on', () => {
    const terms = SI_PRACTICES_DEFINITIONS.map((d) => d.term);
    expect(terms).toContain('SI control incident');
    expect(terms).toContain('SI control near-miss');
    for (const d of SI_PRACTICES_DEFINITIONS) expect(d.text.length).toBeGreaterThan(80);
  });
});

describe('how the register presents it', () => {
  // The project rule that outranks everything else here: a voluntary document
  // must never read as a requirement, and a government publication must never
  // read as a government approval.
  it('says plainly that the guidance is voluntary and binds nobody', () => {
    const fw = FRAMEWORKS.find((f) => f.slug === 'si-incident-key-practices');
    expect(fw).toBeDefined();
    expect(fw!.type).toMatch(/Voluntary/);
    expect(fw!.summary).toMatch(/voluntary/i);
    expect(fw!.summary).toMatch(/no legal obligation/i);
    expect(fw!.summary).not.toMatch(/\bmust comply\b|\brequired by\b|\bcertifi/i);
  });

  it('claims no control coverage it has not earned', () => {
    const fw = FRAMEWORKS.find((f) => f.slug === 'si-incident-key-practices')!;
    // Nothing in CONTROLS maps to this document yet, so any figure above zero
    // would be an invented number on a chart.
    expect(fw.coverage).toBe(0);
  });

  it('cites the publication itself, dated the day it was checked', () => {
    expect(SI_PRACTICES_SOURCE.tier).toBe('official-guidance');
    expect(SI_PRACTICES_SOURCE.url).toMatch(/^https:\/\/www\.nist\.gov\//);
    expect(SI_PRACTICES_SOURCE.checked).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(SI_PRACTICES_SOURCE.citation).toMatch(/PP-26-4396/);
    // The note must disclose what was done to the text and the terminology call.
    expect(SI_PRACTICES_SOURCE.note).toMatch(/verbatim/i);
    expect(SI_PRACTICES_SOURCE.note).toMatch(/not normalised/i);
  });

  it('places the publication on the timeline on its publication date', () => {
    const ev = TIMELINE_EVENTS.find((e) => e.date === '2026-10-16');
    expect(ev).toBeDefined();
    expect(ev!.detail).toMatch(/voluntary/i);
    expect(ev!.source?.url).toMatch(/^https:\/\/www\.nist\.gov\//);
  });

  it('keeps the timeline in ascending date order', () => {
    const dates = TIMELINE_EVENTS.map((e) => e.date);
    expect([...dates].sort()).toEqual(dates);
  });
});
