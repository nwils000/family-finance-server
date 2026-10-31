// Builds the app for Vercel with the Build Output API (.vercel/output), so one origin
// serves both: hashed files under /assets come from Vercel's CDN, and every other
// request (the API, and each page, which needs webAppHeaders' CSP) goes to one function
// running the Express app (server/src/vercel.ts). The marketing site is its own
// Vercel project (site/).
import { execSync } from 'node:child_process';
import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { build } from 'esbuild';

const out = '.vercel/output';
const fn = `${out}/functions/api.func`;
rmSync(out, { recursive: true, force: true });

// The project's NODE_ENV (staging) is for the server at runtime; the client is always a production build.
execSync('npm run build -w client', { stdio: 'inherit', env: { ...process.env, NODE_ENV: 'production' } });

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
  // The MongoDB driver's optional add-ons, loaded in try/catch only when configured.
  external: ['kerberos', '@mongodb-js/zstd', 'snappy', '@aws-sdk/credential-providers', 'gcp-metadata', 'socks', 'aws4', 'mongodb-client-encryption'],
  logLevel: 'warning',
});
cpSync('client/dist/index.html', `${fn}/web/index.html`);
writeFileSync(`${fn}/package.json`, JSON.stringify({ type: 'module' }));
writeFileSync(
  `${fn}/.vc-config.json`,
  JSON.stringify({ runtime: 'nodejs22.x', handler: 'index.mjs', launcherType: 'Nodejs', shouldAddHelpers: false, maxDuration: 60, environment: { SERVE_CLIENT_DIR: 'web' } }),
);

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
