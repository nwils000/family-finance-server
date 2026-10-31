/**
 * Fails the build if lesson content reaches the browser.
 *
 * The lesson library in @kk/shared is large, and importing ANYTHING from the
 * @kk/shared index in a client component (or in a file a client component
 * imports, like src/lib/site.ts) evaluates it, which once shipped ~180 kB of
 * lesson text in every page's JavaScript. Lessons render on the server only.
 * If this fails, find the 'use client' file that imports '@kk/shared' or '@art'
 * and pass plain values or rendered art in as props instead.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../dist/site/_next/static', import.meta.url));
// The minified shape of a lesson entry: `versions:{little:{title:` (or middle / teen).
const LESSON_SHAPE = /versions:\{(little|middle|teen):\{title:/;

const walk = (dir) => readdirSync(dir).flatMap((f) => (statSync(join(dir, f)).isDirectory() ? walk(join(dir, f)) : [join(dir, f)]));
const offenders = walk(ROOT).filter((f) => f.endsWith('.js') && LESSON_SHAPE.test(readFileSync(f, 'utf8')));

if (offenders.length) {
  console.error(`\n[site] Lesson content is in the browser bundle:\n  ${offenders.join('\n  ')}\nSee scripts/check-bundle.mjs for the fix.\n`);
  process.exit(1);
}
console.log('[site] bundle check: no lesson content in client JavaScript');
