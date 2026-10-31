/**
 * Layout guard for the built site (`npm run check:layout -w site`, after `build`; CI runs it).
 * Loads every page at phone, tablet and desktop widths in headless Chromium and fails on:
 *
 * - a page wider than the screen (sideways scroll). It came back twice: a nowrap button
 *   label in a 320px card, then an inline button in the legal pointer card.
 * - a section still invisible on a phone before any scrolling. The server HTML starts every
 *   Reveal at opacity 0; a phone must show it after mount without waiting on a scroll event.
 *
 * Uses an installed Playwright browser, like generate-og-image.mjs
 * (`npx playwright-core install chromium` once if none is present).
 */
import { spawn } from 'node:child_process';
import { readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const DIST = fileURLToPath(new URL('../dist/site', import.meta.url));
const PORT = 3199;
const WIDTHS = [300, 320, 360, 390, 768, 1024, 1440];
const PHONE = 640; // Reveal's breakpoint (src/components/Reveal.tsx)

const pages = ['/', ...(await readdir(DIST, { recursive: true }))
  .filter((f) => f.endsWith('.html') && f !== 'index.html' && !f.startsWith('og-card') && !f.startsWith('_'))
  .map((f) => `/${f.replace(/\.html$/, '').replace(/\/index$/, '')}`)];

const server = spawn(process.execPath, [fileURLToPath(new URL('./serve.mjs', import.meta.url))], { env: { ...process.env, PORT: String(PORT) }, stdio: ['ignore', 'pipe', 'inherit'] });
await new Promise((resolve) => server.stdout.once('data', resolve));

const browser = await chromium.launch();
const problems = [];
try {
  for (const width of WIDTHS) {
    const context = await browser.newContext({ viewport: { width, height: 800 }, isMobile: width < 1024, hasTouch: width < 1024 });
    const page = await context.newPage();
    for (const path of pages) {
      await page.goto(`http://localhost:${PORT}${path}`, { waitUntil: 'load' });
      await page.waitForTimeout(300);
      const found = await page.evaluate((phone) => {
        const vw = document.documentElement.clientWidth;
        const out = [];
        if (document.documentElement.scrollWidth > vw) {
          // Name the widest culprits that are not inside a scroller of their own (carousels are fine).
          const free = (el) => { for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) if (getComputedStyle(p).overflowX !== 'visible') return false; return true; };
          const wide = [...document.querySelectorAll('body *')].filter((el) => { const b = el.getBoundingClientRect(); return b.width && (b.right > vw + 1 || b.left < -1) && getComputedStyle(el).position !== 'fixed' && free(el); });
          out.push(`scrolls sideways (${document.documentElement.scrollWidth}px wide): ${wide.slice(-3).map((el) => `<${el.tagName.toLowerCase()}> "${el.textContent.trim().slice(0, 40)}"`).join(', ')}`);
        }
        if (vw < phone) {
          const hidden = [...document.querySelectorAll('main *')].filter((el) => el.getBoundingClientRect().height > 40 && getComputedStyle(el).opacity === '0');
          if (hidden.length) out.push(`${hidden.length} section(s) invisible before scrolling: "${hidden[0].textContent.trim().slice(0, 40)}"`);
        }
        return out;
      }, PHONE);
      for (const f of found) problems.push(`${width}px ${path}: ${f}`);
    }
    await context.close();
  }
} finally {
  await browser.close();
  server.kill();
}

if (problems.length) {
  console.error(`Layout check failed:\n  ${problems.join('\n  ')}`);
  process.exit(1);
}
console.log(`Layout OK: ${pages.length} pages at ${WIDTHS.join(', ')}px.`);
