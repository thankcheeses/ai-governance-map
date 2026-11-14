// Builds the site's icons and its link-preview image.
//
//   node scripts/build-web-assets.mjs [http://127.0.0.1:5179/ai-governance-map/]
//
// Icons are rendered from the brand mark already in client/public, so they can
// never drift from it. The preview image is a photograph of the product: the
// script opens the running site, switches to the flat map, and composes the
// real map under the title — no mock-up, and the legend on the card is read
// from the same palette module the map paints with.
//
// Needs Playwright with a Chromium (set CHROMIUM_PATH if it is not the default)
// and, for the preview image, a dev or preview server at the URL above.
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUB = path.join(ROOT, 'client/public');
const SITE = process.argv[2] || 'http://127.0.0.1:5179/ai-governance-map/';
const NIGHT = '#0B1220';

const markDark = (await readFile(path.join(PUB, 'logo-mark-dark.svg'), 'utf8')).replace(/<!--[\s\S]*?-->/g, '').trim();
const markInner = markDark.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');

// The mark on a night tile. `pad` is the mark's size as a share of the tile;
// maskable icons keep it inside the 80% safe zone launchers may crop to.
const tile = (radius, pad) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
  <rect width="120" height="120" rx="${radius}" fill="${NIGHT}"/>
  <g transform="translate(${(120 - 120 * pad) / 2} ${(120 - 120 * pad) / 2}) scale(${pad})">${markInner}</g>
</svg>`;

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});

async function png(svg, size, transparent) {
  const page = await browser.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 1 });
  await page.setContent(
    `<style>html,body{margin:0;background:transparent}svg{display:block;width:${size}px;height:${size}px}</style>${svg}`,
  );
  const buf = await page.screenshot({ omitBackground: transparent });
  await page.close();
  return buf;
}

// A .ico is a 22-byte directory in front of a PNG; every current browser reads it.
function ico(pngBuf, size) {
  const head = Buffer.alloc(22);
  head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(1, 4);
  head.writeUInt8(size, 6); head.writeUInt8(size, 7);
  head.writeUInt16LE(1, 10); head.writeUInt16LE(32, 12);
  head.writeUInt32LE(pngBuf.length, 14); head.writeUInt32LE(22, 18);
  return Buffer.concat([head, pngBuf]);
}

const rounded = tile(26, 0.68);
const square = tile(0, 0.64);
const maskable = tile(0, 0.52);

await writeFile(path.join(PUB, 'favicon.svg'), rounded + '\n');
await writeFile(path.join(PUB, 'favicon.ico'), ico(await png(rounded, 32, true), 32));
await writeFile(path.join(PUB, 'apple-touch-icon.png'), await png(square, 180, false));
await writeFile(path.join(PUB, 'icon-192.png'), await png(rounded, 192, true));
await writeFile(path.join(PUB, 'icon-512.png'), await png(rounded, 512, true));
await writeFile(path.join(PUB, 'icon-maskable-512.png'), await png(maskable, 512, false));

await writeFile(
  path.join(PUB, 'manifest.webmanifest'),
  JSON.stringify(
    {
      name: 'AI Governance Map',
      short_name: 'Governance Map',
      description: 'Which AI law binds which country, with sources shown and gaps marked.',
      start_url: '.',
      scope: '.',
      display: 'standalone',
      background_color: '#04070E',
      theme_color: '#04070E',
      icons: [
        { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
        { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    },
    null,
    2,
  ) + '\n',
);

// --- Link preview -----------------------------------------------------------
const shot = await browser.newPage({ viewport: { width: 1500, height: 900 }, deviceScaleFactor: 1 });
await shot.goto(SITE);
await shot.waitForTimeout(9000);
await shot.getByRole('button', { name: 'Flat map' }).click();
await shot.waitForTimeout(3000);
// Photograph the map alone: fold the panel and lift the controls out of frame.
await shot.addStyleTag({
  content: '[role="radiogroup"],[aria-expanded],.maplibregl-control-container{visibility:hidden!important}',
});
const box = await shot.locator('.maplibregl-canvas').first().boundingBox();
const map = await shot.screenshot({
  // Framed so Europe clears the text column and East Asia stays in shot.
  clip: { x: box.x + 130, y: box.y + 40, width: 1200, height: 630 },
});
await shot.close();

// The legend on the card is the map's own.
const { INK } = await import(pathToFileURL(path.join(ROOT, 'client/src/lib/mapInk.ts')).href).catch(() => ({ INK: null }));
const inks = INK ?? {
  eu: { color: '#1C3A73' }, vietnam: { color: '#793456' }, china: { color: '#954B34' },
  korea: { color: '#796BB0' }, india: { color: '#869546' },
};
const legend = [
  ['EU AI Act', inks.eu.color], ['China', inks.china.color], ['India', inks.india.color],
  ['Korea', inks.korea.color], ['Vietnam', inks.vietnam.color],
];

const card = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
// Written to disk and opened by file URL: a page set from a string has no
// origin and may not load the font files.
const tmp = await mkdtemp(path.join(os.tmpdir(), 'agm-og-'));
const cardFile = path.join(tmp, 'card.html');
await writeFile(cardFile, `<!doctype html><meta charset="utf-8">
<link rel="stylesheet" href="${pathToFileURL(path.join(PUB, 'fonts/fonts.css')).href}">
<style>
  html,body{margin:0}
  body{width:1200px;height:630px;position:relative;overflow:hidden;background:${NIGHT};font-family:'Sora',sans-serif;color:#F1F5F9}
  .map{position:absolute;inset:0;background:url(data:image/png;base64,${map.toString('base64')}) center/cover}
  /* A scrim, for legibility only: the text column sits on night, the map shows through to the right. */
  .scrim{position:absolute;inset:0;background:linear-gradient(90deg,${NIGHT} 0%,${NIGHT} 34%,rgba(11,18,32,.8) 44%,rgba(11,18,32,0) 60%)}
  .col{position:absolute;left:64px;top:60px;bottom:56px;width:560px;display:flex;flex-direction:column}
  .brand{display:flex;align-items:center;gap:14px;font-size:19px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:#CBD5E1}
  .brand svg{width:40px;height:40px}
  h1{font-family:'Raleway',sans-serif;font-weight:800;font-size:66px;line-height:1.04;letter-spacing:-.02em;margin:54px 0 0;text-wrap:balance}
  p{font-size:25px;line-height:1.4;color:#CBD5E1;margin:26px 0 0;max-width:540px;white-space:nowrap}
  ul{list-style:none;margin:auto 0 0;padding:0;display:flex;flex-wrap:wrap;gap:12px 20px;font-size:18px;color:#E2E8F0}
  li{display:flex;align-items:center;gap:9px}
  i{width:17px;height:17px;border-radius:4px;box-sizing:border-box;background-clip:padding-box}
</style>
<div class="map"></div><div class="scrim"></div>
<div class="col">
  <div class="brand">${markDark}<span>AI Governance Map</span></div>
  <h1>Which AI law binds which country</h1>
  <p>Sources shown, gaps marked.</p>
  <ul>${legend.map(([l, c]) => `<li><i style="background-color:${c}"></i>${l}</li>`).join('')}</ul>
</div>`);
await card.goto(pathToFileURL(cardFile).href);
await card.evaluate(() => document.fonts.ready);
await card.waitForTimeout(400);
// fonts.check() is true for a family that does not exist, so ask which faces actually loaded.
const fontsOk = await card.evaluate(() => {
  const loaded = [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family.replace(/['"]/g, ''));
  return loaded.includes('Raleway') && loaded.includes('Sora');
});
if (!fontsOk) throw new Error('Site fonts did not load; refusing to write a card set in fallback faces.');
await writeFile(path.join(PUB, 'og-image.png'), await card.screenshot());
await rm(tmp, { recursive: true, force: true });
await browser.close();
console.log('icons, manifest and og-image.png written to client/public');
