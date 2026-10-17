import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

// Every deploy replaces the whole site, so the previous build's hashed bundles
// stop existing. A browser holding a cached index.html then requests filenames
// that are gone and renders a blank page — indistinguishable from a broken
// deploy, and it has cost this project real time twice.
//
// The recovery lives inline in index.html because it has to run when every
// other file 404s. That makes it easy to delete by accident during an
// unrelated edit, and nothing else would notice. This notices.

const html = () => readFileSync(resolve(import.meta.dirname, '..', 'index.html'), 'utf8');
const main = () => readFileSync(resolve(import.meta.dirname, 'main.tsx'), 'utf8');

describe('stale-index recovery', () => {
  it('ships inline in the document head, not as a fetched file', () => {
    const doc = html();
    const head = doc.slice(0, doc.indexOf('</head>'));
    expect(head).toContain('__AGM_STALE_KEY');
    // A recovery script that itself has to be downloaded cannot run when
    // downloads are the thing that is broken.
    expect(head).toMatch(/<script>\s*\(function/);
  });

  it('listens in the capture phase, because resource errors do not bubble', () => {
    expect(html()).toMatch(/addEventListener\(\s*'error'[\s\S]*?true\s*\)/);
  });

  it('only reacts to the bundles whose names change per deploy', () => {
    const doc = html();
    expect(doc).toContain("'/assets/'");
    expect(doc).toContain("'/fonts/'");
  });

  it('guards against a reload loop and reloads to an uncached URL', () => {
    const doc = html();
    // Without the guard, an asset that is genuinely missing reloads forever.
    expect(doc).toContain('sessionStorage.getItem(window.__AGM_STALE_KEY)');
    expect(doc).toContain('sessionStorage.setItem(window.__AGM_STALE_KEY');
    // A plain reload can be served from cache; a URL never seen cannot be.
    expect(doc).toContain('agm-refresh=');
    expect(doc).toContain('location.replace');
  });

  it('releases the guard on mount, not on load', () => {
    // Clearing it on `load` would re-arm the reload even when the assets are
    // permanently gone, which is the loop this is meant to avoid. Only a
    // successful mount proves the index.html was good.
    const src = main();
    expect(src).toContain('__AGM_STALE_KEY');
    expect(src).toContain('sessionStorage.removeItem');
    expect(src).toContain('agm-refresh');
    expect(src).not.toMatch(/addEventListener\(\s*["']load["']/);
  });
});
