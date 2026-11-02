// Serving the built web app from the API's own origin (production container). The
// refresh cookie then stays first-party and no cross-site CORS is needed. Everything
// under /api is left to the API; every other GET gets a file or index.html.
import { existsSync, readFileSync } from 'fs';
import { join, resolve } from 'path';
import express, { Router } from 'express';
import { APP_OG_IMAGE_ALT, APP_PAGES, appPageMeta } from '@kk/shared';
import { config } from './config.js';
import { webAppHeaders } from './security.js';

const attr = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const PAGE_META = /<!-- page-meta:start[\s\S]*?<!-- page-meta:end -->/;

/**
 * Each page's head, written on the server (titles and descriptions from @kk/shared APP_PAGES):
 * link previews and crawlers never run the app's script, so this is what they see.
 */
export const pageHead = (path: string) => {
  const meta = appPageMeta(path);
  const url = `${config.appUrl}${path === '/' ? '' : path}`;
  const image = `${config.appUrl}/og-image.png`;
  return [
    `<title>${attr(meta.title)}</title>`,
    `<meta name="description" content="${attr(meta.description)}" />`,
    `<meta name="robots" content="${meta.index ? 'index, follow, max-image-preview:large' : 'noindex, follow'}" />`,
    ...(meta.index ? [`<link rel="canonical" href="${attr(url)}" />`] : []),
    '<meta property="og:type" content="website" />',
    '<meta property="og:site_name" content="Kid Kapital" />',
    '<meta property="og:locale" content="en_US" />',
    `<meta property="og:title" content="${attr(meta.title)}" />`,
    `<meta property="og:description" content="${attr(meta.description)}" />`,
    `<meta property="og:url" content="${attr(url)}" />`,
    `<meta property="og:image" content="${attr(image)}" />`,
    '<meta property="og:image:type" content="image/png" />',
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:height" content="630" />',
    `<meta property="og:image:alt" content="${attr(APP_OG_IMAGE_ALT)}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${attr(meta.title)}" />`,
    `<meta name="twitter:description" content="${attr(meta.description)}" />`,
    `<meta name="twitter:image" content="${attr(image)}" />`,
    `<meta name="twitter:image:alt" content="${attr(APP_OG_IMAGE_ALT)}" />`,
  ].join('\n    ');
};

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
  const html = readFileSync(join(dir, 'index.html'), 'utf8');
  if (!PAGE_META.test(html)) throw new Error('index.html has no page-meta block for the server to fill');
  const shell = (req: express.Request, res: express.Response) => {
    res.setHeader('Cache-Control', 'no-store');
    // res.end, not res.send: send would add an ETag wherever etags are on, and this must never revalidate.
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(html.replace(PAGE_META, pageHead(req.path === '/index.html' ? '/' : req.path)));
  };
  // Search engines: crawl everything (pages say noindex themselves), and here are the indexable ones.
  router.get('/robots.txt', (_req, res) => {
    res.type('text/plain').send(`User-agent: *\nAllow: /\n\nSitemap: ${config.appUrl}/sitemap.xml\n`);
  });
  router.get('/sitemap.xml', (_req, res) => {
    const urls = Object.entries(APP_PAGES)
      .filter(([, m]) => m.index)
      .map(([path]) => `  <url><loc>${attr(config.appUrl + path)}</loc></url>`)
      .join('\n');
    res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
  });
  router.get('/index.html', shell);
  router.use(express.static(dir, { index: false, maxAge: 0 }));
  // Client-side routes (/kid, /parent/learn, /privacy, ...) all load the app shell.
  router.get('*', shell);
  return router;
};
