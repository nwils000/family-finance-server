// Boot rules for hosted environments, and the scheduled-job door used on Vercel.
// Boot rules run config.ts in a child process, since it decides at import time.
import { spawnSync } from 'child_process';
import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';

const boot = (env: Record<string, string>) =>
  spawnSync(process.execPath, ['--import', 'tsx', '-e', "await import('./src/config.ts')"], {
    cwd: new URL('../..', import.meta.url).pathname,
    env: { PATH: process.env.PATH!, JWT_SECRET: 'x'.repeat(40), CLIENT_ORIGINS: 'https://app.example.com', ...env },
    encoding: 'utf8',
  });

describe('hosting', () => {
  it('a hosted server without email refuses to boot, unless it is a staging preview that says so', () => {
    expect(boot({ NODE_ENV: 'production' }).stderr).toMatch(/SMTP_URL is required/);
    expect(boot({ NODE_ENV: 'staging' }).stderr).toMatch(/SMTP_URL is required/);
    expect(boot({ NODE_ENV: 'staging', PREVIEW_WITHOUT_EMAIL: 'true' }).status).toBe(0);
  });

  it('production can never skip email verification', () => {
    expect(boot({ NODE_ENV: 'production', PREVIEW_WITHOUT_EMAIL: 'true', SMTP_URL: 'smtp://x' }).stderr).toMatch(/only allowed in staging/);
    expect(boot({ PREVIEW_WITHOUT_EMAIL: 'true', SMTP_URL: 'smtp://x' }).stderr).toMatch(/only allowed in staging/);
  });

  it('the growth cron door is closed without CRON_SECRET', async () => {
    // Not mounted, so it falls through to the signed-in API and is refused like any unknown caller.
    expect((await request(createApp()).get('/api/cron/growth').set('Authorization', 'Bearer guess')).status).toBe(401);
  });
}, 60_000);

describe('serving the web app shell', () => {
  it('never lets a browser revalidate an old shell (no Last-Modified or ETag, no-store)', async () => {
    const { mkdtempSync, mkdirSync, writeFileSync } = await import('fs');
    const { join } = await import('path');
    const { tmpdir } = await import('os');
    const express = (await import('express')).default;
    const { webApp } = await import('../web-app.js');
    const dir = mkdtempSync(join(tmpdir(), 'kk-shell-'));
    mkdirSync(join(dir, 'assets'));
    writeFileSync(join(dir, 'index.html'), '<!doctype html><link href="/assets/a.css">');
    const app = express().use(webApp(dir));
    for (const path of ['/', '/parent/learn', '/index.html']) {
      const res = await request(app).get(path);
      expect(res.status).toBe(200);
      expect(res.headers['last-modified']).toBeUndefined();
      expect(res.headers.etag).toBeUndefined();
      expect(res.headers['cache-control']).toBe('no-store');
    }
    // An old build's file is a 404, never the shell (the client reloads into the new build).
    expect((await request(app).get('/assets/old-chunk-abc123.js')).status).toBe(404);
  });
});
