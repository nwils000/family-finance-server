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

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, reducedMotion: 'reduce' });
  await page.goto(`${SITE}/og-card`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({ content: 'body::before{display:none} .skip-link{display:none}' });
  await page.locator('#og').screenshot({ path: pub('og-image.png') });

  const svg = readFileSync(pub('favicon.svg'), 'utf8');
  const icon = await browser.newPage({ viewport: { width: 180, height: 180 } });
  await icon.setContent(
    `<body style="margin:0;background:#FFF8EC;display:flex;align-items:center;justify-content:center;width:180px;height:180px">
       <div style="width:140px;height:140px">${svg.replace('<svg ', '<svg width="140" height="140" ')}</div></body>`,
  );
  await icon.screenshot({ path: pub('apple-touch-icon.png') });
  console.log('wrote public/og-image.png and public/apple-touch-icon.png');
} finally {
  await browser.close();
}
