// Serving the built web app from the API's own origin (production container). The
// refresh cookie then stays first-party and no cross-site CORS is needed. Everything
// under /api is left to the API; every other GET gets a file or index.html.
import { existsSync } from 'fs';
import { join, resolve } from 'path';
import express, { Router } from 'express';
import { webAppHeaders } from './security.js';

export const webApp = (clientDir: string) => {
  // Absolute, because sendFile needs it and the Vercel function is given a relative dir.
  const dir = resolve(clientDir);
  if (!existsSync(join(dir, 'index.html'))) throw new Error(`SERVE_CLIENT_DIR has no index.html: ${dir}`);
  const router = Router();
  router.use((req, res, next) => (req.path.startsWith('/api') ? next('router') : webAppHeaders(req, res, next)));
  // Built assets have content hashes in their names, so they can be cached for good.
  router.use('/assets', express.static(join(dir, 'assets'), { immutable: true, maxAge: '1y', index: false }));
  // A missing asset (an old build's file) is a 404, never the app shell: a script answered
  // with HTML fails confusingly, while a 404 lets the client reload into the new build.
  router.use('/assets', (_req, res) => res.status(404).end());
  // The app shell names the current build's hashed files, so it must never be revalidated
  // as "unchanged": no Last-Modified or ETag (a serverless bundle has the same file date on
  // every deploy, so browsers got a 304 and kept an old shell pointing at old files).
  const shell = (_req: express.Request, res: express.Response) => {
    res.setHeader('Cache-Control', 'no-store');
    res.sendFile(join(dir, 'index.html'), { lastModified: false, etag: false });
  };
  router.get('/index.html', shell);
  router.use(express.static(dir, { index: false, maxAge: 0 }));
  // Client-side routes (/kid, /parent/learn, /privacy, ...) all load the app shell.
  router.get('*', shell);
  return router;
};
