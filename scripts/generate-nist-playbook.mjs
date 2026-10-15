#!/usr/bin/env node
// Regenerates client/src/data/nist-playbook.json from a structured parse of the
// official NIST AI RMF Playbook PDF.
//
//   node scripts/generate-nist-playbook.mjs <path/to/playbook.json> [out.json]
//
// Input: an array of 72 subcategory objects with id, function, statement, about,
// actions_intro, actions [{text, sub}], documentation_intro, documentation [{text, sub}],
// resources, references. Text is NIST's (US Government work, public domain) and is
// copied verbatim — including NIST's own typos. Nothing is reworded here; the script
// only selects fields, orders subcategories, and validates the shape.
//
// Resources and references are dropped to keep the bundle small; `about` is kept
// because the lazy-loaded chunk has room for it and it frames the actions.

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const [inputPath, outArg] = process.argv.slice(2);
if (!inputPath) {
  console.error('usage: node scripts/generate-nist-playbook.mjs <playbook.json> [out.json]');
  process.exit(1);
}
const outPath = outArg ? resolve(outArg) : resolve(here, '../client/src/data/nist-playbook.json');

const FUNCTION_ORDER = ['GOVERN', 'MAP', 'MEASURE', 'MANAGE'];
const ID_RE = /^(GOVERN|MAP|MEASURE|MANAGE) (\d+)\.(\d+)$/;

const raw = JSON.parse(readFileSync(resolve(inputPath), 'utf8'));
if (!Array.isArray(raw)) throw new Error('input must be a JSON array of subcategories');

const fail = (msg) => {
  throw new Error(`playbook input invalid: ${msg}`);
};

const items = (list, where) => {
  if (!Array.isArray(list)) fail(`${where} is not an array`);
  return list.map((entry, i) => {
    if (typeof entry?.text !== 'string' || !entry.text.trim()) fail(`${where}[${i}] has no text`);
    const sub = entry.sub ?? [];
    if (!Array.isArray(sub) || sub.some((s) => typeof s !== 'string')) fail(`${where}[${i}].sub is not a string array`);
    return { text: entry.text, sub };
  });
};

const seen = new Set();
const subcategories = raw.map((row) => {
  const m = ID_RE.exec(row.id ?? '');
  if (!m) fail(`unexpected id ${JSON.stringify(row.id)}`);
  if (seen.has(row.id)) fail(`duplicate id ${row.id}`);
  seen.add(row.id);
  if (row.function !== m[1]) fail(`${row.id} has function ${row.function}`);
  if (typeof row.statement !== 'string' || !row.statement.trim()) fail(`${row.id} has no statement`);
  const out = {
    id: row.id,
    function: row.function,
    category: `${m[1]} ${m[2]}`,
    statement: row.statement,
    about: Array.isArray(row.about) ? row.about : [],
    actions: items(row.actions, `${row.id}.actions`),
    documentation: items(row.documentation, `${row.id}.documentation`),
  };
  // Two subcategories open their action list with a lead-in sentence; keep it so
  // the bullets that follow still read as NIST wrote them.
  if (row.actions_intro) out.actionsIntro = row.actions_intro;
  if (row.documentation_intro) out.documentationIntro = row.documentation_intro;
  return out;
});

const sortKey = (s) => {
  const [, fn, cat, sub] = ID_RE.exec(s.id);
  return [FUNCTION_ORDER.indexOf(fn), Number(cat), Number(sub)];
};
subcategories.sort((a, b) => {
  const ka = sortKey(a);
  const kb = sortKey(b);
  return ka[0] - kb[0] || ka[1] - kb[1] || ka[2] - kb[2];
});

const counts = Object.fromEntries(FUNCTION_ORDER.map((f) => [f, subcategories.filter((s) => s.function === f).length]));

const doc = {
  source: {
    title: 'NIST AI RMF Playbook',
    publisher: 'National Institute of Standards and Technology',
    url: 'https://airc.nist.gov/airmf-resources/playbook/',
    license: 'US Government work — not subject to copyright in the United States (public domain).',
    note: 'Text is verbatim from the Playbook, including NIST’s own typos. The Playbook is neither a checklist nor set of steps to be followed in its entirety; its suggestions are voluntary.',
  },
  counts,
  subcategories,
};

writeFileSync(outPath, `${JSON.stringify(doc, null, 1)}\n`);
console.log(`wrote ${subcategories.length} subcategories (${FUNCTION_ORDER.map((f) => `${f} ${counts[f]}`).join(', ')}) to ${outPath}`);
