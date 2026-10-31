import { fileURLToPath } from 'node:url';
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js';

/**
 * The Kid Kapital marketing site. Modeled on the Mentis company site
 * (mentis-company.com), but a STATIC export: there is no server here at all,
 * so every page is plain HTML that any static host (Vercel, Netlify, S3) serves.
 *
 * The art is NOT copied. `@art` points at the app's own art library in
 * client/src/art, so a sticker redrawn in the app is redrawn here on the next
 * build. `@kk/shared` (plans, lesson library, age bands, legal paths) is
 * transpiled from source the same way the client and server read it.
 *
 * Output lives under `dist/` because the repo guard test (server/src/__tests__/
 * guards.test.ts) scans every .ts/.css/.html file in the repo and skips `dist`:
 *   dist/site  the static export (`npm run build`), what a host serves
 *   dist/dev   `next dev` output, separate so a build never wipes a running dev server
 * In export mode Next still builds through `.next/`; the postbuild step deletes it.
 */
const art = fileURLToPath(new URL('../client/src/art', import.meta.url));

if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_SITE_URL) {
  console.warn('\n[site] NEXT_PUBLIC_SITE_URL is not set: canonical URLs, the sitemap and OG tags will point at localhost.\n');
}

/** @type {(phase: string) => import('next').NextConfig} */
const nextConfig = (phase) => ({
  output: 'export',
  distDir: phase === PHASE_DEVELOPMENT_SERVER ? 'dist/dev' : 'dist/site',
  trailingSlash: false,
  reactStrictMode: true,
  poweredByHeader: false,
  // Every image is a local file or an inline SVG; nothing goes through an optimizer.
  images: { unoptimized: true },
  // No ESLint config in this workspace; `npm run typecheck` is the gate.
  eslint: { ignoreDuringBuilds: true },
  transpilePackages: ['@kk/shared'],
  experimental: { externalDir: true },
  webpack: (config) => {
    config.resolve.alias['@art'] = art;
    return config;
  },
});

export default nextConfig;
