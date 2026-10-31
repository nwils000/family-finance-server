/**
 * Copies the few static files the site shares with the app, so there is one
 * source for each (client/public). Runs before every dev and build.
 * The copies are gitignored; edit the originals.
 */
import { copyFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const from = (p) => fileURLToPath(new URL(`../../client/public/${p}`, import.meta.url));
const to = (p) => fileURLToPath(new URL(`../public/${p}`, import.meta.url));

mkdirSync(to(''), { recursive: true });
for (const file of ['favicon.svg']) copyFileSync(from(file), to(file));
