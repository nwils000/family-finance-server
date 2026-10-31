/**
 * Serves the static export in dist/site/ for a local production preview
 * (`npm start -w site`). Production hosting serves dist/site directly.
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../dist/site', import.meta.url));
const PORT = Number(process.env.PORT ?? 3100);
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.woff2': 'font/woff2', '.woff': 'font/woff', '.txt': 'text/plain', '.xml': 'application/xml',
  '.json': 'application/json', '.ico': 'image/x-icon', '.webmanifest': 'application/manifest+json',
};

const tryFile = async (p) => ((await stat(p).catch(() => null))?.isFile() ? p : null);

createServer(async (req, res) => {
  const path = normalize(decodeURIComponent(new URL(req.url ?? '/', 'http://x').pathname)).replace(/^(\.\.[/\\])+/, '');
  const base = join(ROOT, path);
  const file = (await tryFile(base)) ?? (await tryFile(`${base}.html`)) ?? (await tryFile(join(base, 'index.html')));
  const found = file ?? join(ROOT, '404.html');
  res.writeHead(file ? 200 : 404, { 'Content-Type': TYPES[extname(found)] ?? 'application/octet-stream' });
  res.end(await readFile(found));
}).listen(PORT, () => console.log(`site preview on http://localhost:${PORT}`));
