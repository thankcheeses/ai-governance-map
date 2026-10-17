import { describe, expect, it } from 'vitest';
import { FRAMEWORKS, COUNTRY_AI_LAWS } from '@/data/governance';
import {
  BINDING_FAMILIES,
  LAW_FAMILIES,
  familyMatch,
  lawFamilyById,
  resolveLawFamily,
} from './lawPalette';

// Relative luminance, for checking swatches are actually distinguishable.
const lum = (hex: string) => {
  const n = parseInt(hex.replace('#', ''), 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
};
const contrast = (a: string, b: string) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

describe('law family palette', () => {
  it('invents no category: every coloured instrument exists in the register', () => {
    const slugs = new Set(FRAMEWORKS.map((f) => f.slug));
    for (const f of BINDING_FAMILIES) {
      expect(slugs.has(f.frameworkSlug as string), `${f.id} -> ${f.frameworkSlug}`).toBe(true);
    }
  });

  it('covers every instrument the country register actually cites', () => {
    // If a country is bound by an instrument with no family, it silently falls
    // back to EU teal and the map quietly lies about which law binds it.
    const cited = new Set(
      COUNTRY_AI_LAWS.filter((c) => c.status === 'binding' && c.frameworkSlug).map(
        (c) => c.frameworkSlug as string,
      ),
    );
    const coloured = new Set(BINDING_FAMILIES.map((f) => f.frameworkSlug as string));
    for (const slug of cited) expect(coloured.has(slug), `no colour for ${slug}`).toBe(true);
  });

  it('resolves each country to the family of the law that binds it', () => {
    expect(resolveLawFamily('binding', 'eu-ai-act')).toBe('eu');
    expect(resolveLawFamily('binding', 'vietnam-ai-law')).toBe('vietnam');
    expect(resolveLawFamily('binding', 'china-genai-interim-measures')).toBe('china');
    expect(resolveLawFamily('none')).toBe('no-national-law');
    expect(resolveLawFamily('unknown')).toBe('unresearched');
  });

  it('separates "checked, no law" from "nobody checked"', () => {
    // Collapsing these two is the single most damaging thing this map could do.
    const none = lawFamilyById('no-national-law');
    const unknown = lawFamilyById('unresearched');
    expect(none.id).not.toBe(unknown.id);
    expect(none.color).not.toBe(unknown.color);
    expect(none.fillOpacity).toBeGreaterThan(unknown.fillOpacity);
    expect(unknown.note).toMatch(/not evidence that no law exists/i);
  });

  it('warns that grey is national-only, so the US does not read as lawless', () => {
    expect(lawFamilyById('no-national-law').note).toMatch(/sub-national/i);
    expect(lawFamilyById('no-national-law').label).toMatch(/national/i);
  });

  it('separates the instrument colours by lightness, not only by hue', () => {
    // Hue alone fails for a colour-blind reader, and teal-vs-green is exactly
    // the pair that disappears. The five instrument colours were chosen by
    // search to sit on a luminance ramp; this holds that floor so a later
    // "nicer" colour cannot quietly collapse two instruments into one tone.
    const colors = BINDING_FAMILIES.map((f) => f.color);
    expect(new Set(colors).size).toBe(colors.length);
    for (let i = 0; i < colors.length; i++) {
      for (let j = i + 1; j < colors.length; j++) {
        expect(contrast(colors[i], colors[j]), `${colors[i]} vs ${colors[j]}`).toBeGreaterThan(1.2);
      }
    }
  });

  it('keeps the two "no instrument" swatches visibly neutral', () => {
    // These two are told apart from the coloured families by being grey, which
    // survives any colour vision, so they are held to desaturation rather than
    // to the luminance ramp.
    for (const id of ['no-national-law', 'unresearched'] as const) {
      const hex = lawFamilyById(id).color.replace('#', '');
      const ch = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
      expect(Math.max(...ch) - Math.min(...ch), id).toBeLessThan(45);
    }
  });

  it('keeps every swatch legible against the dark legend panel', () => {
    for (const f of LAW_FAMILIES) {
      expect(contrast(f.color, '#0b1220'), f.id).toBeGreaterThan(3);
    }
  });

  it('builds a MapLibre match expression covering every family', () => {
    const expr = familyMatch((f) => f.color, '#000000');
    expect(expr[0]).toBe('match');
    expect(expr[1]).toEqual(['get', 'lawFamily']);
    for (const f of LAW_FAMILIES) expect(expr).toContain(f.id);
    expect(expr[expr.length - 1]).toBe('#000000');
    // match pairs + head + fallback
    expect(expr.length).toBe(2 + LAW_FAMILIES.length * 2 + 1);
  });
});
