/**
 * Renders public/og-image.png (1200x630, every link preview) from the /og-card
 * page, and public/apple-touch-icon.png (180x180) from the app's favicon, with
 * a headless Chromium (playwright-core; uses an installed Playwright browser,
 * run `npx playwright install chromium` once if none is present).
 *
 * Needs the site running: `npm run dev -w site` (port 3100), then
 *   npm run og -w site            or   SITE=http://localhost:3100 node scripts/generate-og-image.mjs
 *
 * The PNGs are committed; nothing at build time depends on this script.
 * Keep the size in sync with openGraph.images in src/lib/seo.ts.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const SITE = process.env.SITE ?? 'http://localhost:3100';
const pub = (p) => fileURLToPath(new URL(`../public/${p}`, import.meta.url));
/** Icons live with the app (client/public), the one source; scripts/sync-assets.mjs copies them here. */
const appPub = (p) => fileURLToPath(new URL(`../../client/public/${p}`, import.meta.url));

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, reducedMotion: 'reduce' });
  await page.goto(`${SITE}/og-card`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({ content: 'body::before{display:none} .skip-link{display:none}' });
  await page.locator('#og').screenshot({ path: appPub('og-image.png') });

  // The app icon at every size a phone, a browser or a search engine asks for: the coin on cream,
  // with a margin so a rounded or circular mask never clips it.
  const svg = readFileSync(appPub('favicon.svg'), 'utf8');
  for (const [file, size] of [['apple-touch-icon.png', 180], ['icon-192.png', 192], ['icon-512.png', 512]]) {
    const inner = Math.round(size * 0.72);
    const icon = await browser.newPage({ viewport: { width: size, height: size } });
    await icon.setContent(
      `<body style="margin:0;background:#FFF8EC;display:flex;align-items:center;justify-content:center;width:${size}px;height:${size}px">
         <div style="width:${inner}px;height:${inner}px">${svg.replace('<svg ', `<svg width="${inner}" height="${inner}" `)}</div></body>`,
    );
    await icon.screenshot({ path: appPub(file) });
    await icon.close();
  }
  console.log('wrote client/public og-image.png and icons (apple-touch-icon, icon-192, icon-512)');
} finally {
  await browser.close();
}
