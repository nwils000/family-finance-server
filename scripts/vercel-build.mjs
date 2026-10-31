// Builds the app for Vercel with the Build Output API (.vercel/output), so one origin
// serves both: hashed files under /assets come from Vercel's CDN, and every other
// request (the API, and each page, which needs webAppHeaders' CSP) goes to one function
// running the Express app (server/src/vercel.ts). The marketing site is its own
// Vercel project (site/).
import { execFileSync, execSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { build } from 'esbuild';

const out = '.vercel/output';
const fn = `${out}/functions/api.func`;
rmSync(out, { recursive: true, force: true });

// The project's NODE_ENV (staging) is for the server at runtime; the client is always a production build.
execSync('npm run build -w client', { stdio: 'inherit', env: { ...process.env, NODE_ENV: 'production' } });

// The page CSP allows fonts only from 'self' (security.ts webAppHeaders), so an inlined
// data: font would be blocked in the browser. client/vite.config.ts keeps fonts as files.
for (const f of readdirSync('client/dist/assets').filter((n) => n.endsWith('.css'))) {
  if (readFileSync(`client/dist/assets/${f}`, 'utf8').includes('data:font')) throw new Error(`${f} inlines a font as data:, which the page CSP blocks`);
}

// Static: everything the client built except index.html, which the function serves with its headers.
cpSync('client/dist', `${out}/static`, { recursive: true, filter: (src) => !src.endsWith('index.html') });

mkdirSync(fn, { recursive: true });
await build({
  entryPoints: ['server/src/vercel.ts'],
  outfile: `${fn}/index.mjs`,
  bundle: true,
  platform: 'node',
  target: 'node22',
  format: 'esm',
  // Some dependencies are CommonJS and call require().
  banner: { js: "import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);" },
  // ONLY the MongoDB driver's optional add-ons, which it loads in try/catch when configured.
  // Anything else listed here is missing at runtime (gcp-metadata was, and every request
  // crashed); the isolation check below catches that at build time.
  external: ['kerberos', '@mongodb-js/zstd', 'snappy', '@aws-sdk/credential-providers', 'socks', 'aws4', 'mongodb-client-encryption'],
  logLevel: 'warning',
});
cpSync('client/dist/index.html', `${fn}/web/index.html`);
writeFileSync(`${fn}/package.json`, JSON.stringify({ type: 'module' }));
writeFileSync(
  `${fn}/.vc-config.json`,
  JSON.stringify({ runtime: 'nodejs22.x', handler: 'index.mjs', launcherType: 'Nodejs', shouldAddHelpers: false, maxDuration: 60, environment: { SERVE_CLIENT_DIR: 'web' } }),
);

// Load the function from a folder with no node_modules anywhere above it, as Vercel will.
// Inside the repo a missing package would still resolve from the workspace and pass.
const probe = mkdtempSync(join(tmpdir(), 'kk-fn-'));
cpSync(fn, probe, { recursive: true });
execFileSync(process.execPath, ['--input-type=module', '-e', `await import(${JSON.stringify(join(probe, 'index.mjs'))})`], {
  cwd: probe,
  stdio: 'inherit',
  env: { PATH: process.env.PATH, NODE_ENV: 'test', JWT_SECRET: 'build-probe', SERVE_CLIENT_DIR: join(probe, 'web') },
});
rmSync(probe, { recursive: true, force: true });

writeFileSync(
  `${out}/config.json`,
  JSON.stringify(
    {
      version: 3,
      routes: [
        // Content-hashed, so cached for good. Pages and the API stay no-store (set by the function).
        { src: '^/assets/(.*)$', headers: { 'Cache-Control': 'public, max-age=31536000, immutable' }, continue: true },
        { handle: 'filesystem' },
        { src: '^/(.*)$', dest: '/api' },
      ],
      // Daily is the Hobby plan's limit; runGrowth catches up every week that is due.
      crons: [{ path: '/api/cron/growth', schedule: '0 7 * * *' }],
    },
    null,
    2,
  ),
);
console.log('[vercel] build output ready');
