// Repo guards: each test pins one rule from CLAUDE.md so breaking it fails the build.
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';
import { describe, expect, it } from 'vitest';
import { LESSON_ART, LESSON_CATEGORIES, LESSONS } from '@kk/shared';

const ROOT = join(import.meta.dirname, '../../..');
const SKIP = new Set(['node_modules', 'dist', 'legacy-django', '.git', 'ios', 'android', 'coverage']);

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    if (SKIP.has(name)) return [];
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });

const files = walk(ROOT)
  .filter((f) => /\.(ts|tsx|css|md|html)$/.test(f) && !f.includes('__tests__/guards.test.ts'))
  .map((f) => ({ path: relative(ROOT, f), text: readFileSync(f, 'utf8') }));
const code = files.filter((f) => /\.(ts|tsx)$/.test(f.path));

/** Files under `scope` containing `pattern`, except the allowed owners. */
const offenders = (pattern: RegExp, scope: string, allowed: string[] = []) =>
  code.filter((f) => f.path.startsWith(scope) && !allowed.includes(f.path) && pattern.test(f.text)).map((f) => f.path);

describe('repo guards', () => {
  it('has no em or en dashes anywhere', () => {
    expect(files.filter((f) => /[–—]/.test(f.text)).map((f) => f.path)).toEqual([]);
  });

  it('has no emoji anywhere (use the art library)', () => {
    expect(files.filter((f) => /\p{Extended_Pictographic}/u.test(f.text.replace(/[©®™]/g, ''))).map((f) => f.path)).toEqual([]);
  });

  it('changes balances only in services/money.ts', () => {
    expect(offenders(/balanceCents\s*:\s*[-\w]/, 'server/src/services', ['server/src/services/money.ts']).filter((p) =>
      /\$inc[^}]*balanceCents/.test(code.find((f) => f.path === p)!.text),
    )).toEqual([]);
    expect(offenders(/\$inc[^}]*balanceCents/, 'server/src', ['server/src/services/money.ts'])).toEqual([]);
  });

  it('changes xp and assist points only in services/game.ts', () => {
    expect(offenders(/\$inc[^}]*xp/, 'server/src', ['server/src/services/game.ts'])).toEqual([]);
    expect(offenders(/\$inc[^}]*assistPoints/, 'server/src', ['server/src/services/game.ts'])).toEqual([]);
  });

  it('unlocks milestone prizes only in services/game.ts', () => {
    expect(offenders(/MilestoneClaim\.create/, 'server/src', ['server/src/services/game.ts'])).toEqual([]);
  });

  it('every lesson is well formed: unique ids, valid art and topic, sized for its band, answers in range', () => {
    const ids = LESSONS.map((l) => l.id);
    expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([]);
    const sizes = { little: { pages: [2, 3], quiz: [2, 2] }, middle: { pages: [2, 5], quiz: [2, 4] }, teen: { pages: [2, 5], quiz: [2, 4] } } as const;
    const problems: string[] = [];
    for (const l of LESSONS) {
      if (!(LESSON_ART as readonly string[]).includes(l.art)) problems.push(`${l.id}: art ${l.art}`);
      if (!(LESSON_CATEGORIES as readonly string[]).includes(l.category)) problems.push(`${l.id}: category ${l.category}`);
      for (const [band, v] of Object.entries(l.versions)) {
        const size = sizes[band as keyof typeof sizes];
        if (v.pages.length < size.pages[0] || v.pages.length > size.pages[1]) problems.push(`${l.id}/${band}: ${v.pages.length} pages`);
        if (v.quiz.length < size.quiz[0] || v.quiz.length > size.quiz[1]) problems.push(`${l.id}/${band}: ${v.quiz.length} questions`);
        if (v.title.length > 28) problems.push(`${l.id}/${band}: long title`);
        v.pages.forEach((pg) => pg.art && !(LESSON_ART as readonly string[]).includes(pg.art) && problems.push(`${l.id}/${band}: page art ${pg.art}`));
        v.quiz.forEach((q, i) => {
          if (q.answer < 0 || q.answer >= q.choices.length) problems.push(`${l.id}/${band} q${i}: answer out of range`);
          if (new Set(q.choices).size !== q.choices.length) problems.push(`${l.id}/${band} q${i}: duplicate choice`);
        });
      }
    }
    expect(problems).toEqual([]);
  });

  it('changes team goal progress only in services/teamGoals.ts', () => {
    expect(offenders(/\$inc[^}]*(progress|contributions)/, 'server/src', ['server/src/services/teamGoals.ts'])).toEqual([]);
  });

  it('computes the default quest reward only in @kk/shared', () => {
    expect(offenders(/stars\s*\*\s*[\w.]*starValueCents/, '', ['shared/src/index.ts'])).toEqual([]);
  });

  it('art draws text only through InkText, which centers the visible glyphs', () => {
    // dominantBaseline="central" centers the font box, not the digits, so numbers sat low.
    expect(offenders(/<text[\s>]/, 'client/src/art', ['client/src/art/sticker-kit.tsx'])).toEqual([]);
  });

  it('art defines the heart shape once, in the sticker kit', () => {
    expect(offenders(/(function|const) heartPath\b/, 'client/src/art', ['client/src/art/sticker-kit.tsx'])).toEqual([]);
  });

  it('client: no AnimatePresence mode="wait" (a tap mid-exit left pages blank)', () => {
    expect(offenders(/mode="wait"/, 'client/src')).toEqual([]);
  });

  it('kids see no trackers: no analytics, ads or tracking SDKs in the app or the marketing site', () => {
    const trackers = /googletagmanager|google-analytics|gtag\(|posthog|mixpanel|amplitude|segment\.(io|com)|@sentry\/(browser|react)|hotjar|fbq\(|facebook\.net|doubleclick|adsbygoogle|@vercel\/analytics|plausible/i;
    // The scanner above skips .json, and a tracker usually arrives as a dependency, so read both manifests.
    const manifests = ['client/package.json', 'site/package.json'].map((path) => ({ path, text: readFileSync(join(ROOT, path), 'utf8') }));
    expect([
      ...offenders(trackers, 'client/'),
      ...offenders(trackers, 'site/'),
      ...manifests.filter((f) => trackers.test(f.text)).map((f) => f.path),
    ]).toEqual([]);
  });

  it('tests set up their database only through testDb.ts useTestDb (per-test index rebuilds timed out)', () => {
    expect(offenders(/dropDatabase\(|syncIndexes\(/, 'server/src/__tests__/', ['server/src/__tests__/testDb.ts'])).toEqual([]);
  });

  it('client: layoutId only in the always-mounted shell', () => {
    // A moved layoutId element blocks AnimatePresence exits forever, leaving closed
    // sheets and old pages on screen eating taps. The shell never exits, so it is safe.
    expect(offenders(/layoutId=/, 'client/src', ['client/src/features/shell.tsx'])).toEqual([]);
  });

  it('billing has one owner per side: plans in @kk/shared, providers in billing.ts and purchases.ts', () => {
    // A plan refusal (402) is decided only by services/billing.ts against PLAN_LIMITS.
    expect(offenders(/HttpError\(\s*402/, 'server/src', ['server/src/services/billing.ts'])).toEqual([]);
    expect(offenders(/from 'stripe'/, 'server/src', ['server/src/services/billing.ts']).filter((p) => !p.includes('__tests__'))).toEqual([]);
    expect(offenders(/@revenuecat\/purchases-capacitor/, 'client/src', ['client/src/lib/purchases.ts'])).toEqual([]);
  });

  it('ends sessions only through auth.ts revokeAllSessions', () => {
    expect(offenders(/RefreshToken\.deleteMany\(\s*\{\s*userId[^}]*\}\s*\)/, 'server/src/services')).toEqual([]);
  });

  it('environment gates read config.isHosted / devEndpoints, never NODE_ENV or a production-only flag', () => {
    // `!isProd` let staging (or a typo'd NODE_ENV) run with dev doors and weak cookies.
    expect(offenders(/\bisProd\b/, 'server/src')).toEqual([]);
    expect(offenders(/process\.env\.NODE_ENV/, 'server/src', ['server/src/config.ts'])).toEqual([]);
  });

  it('hashes and compares secrets only in services/accounts.ts, and hashes stored tokens only in tokens.ts', () => {
    // social.ts digests the Apple nonce as Apple specifies; billing.ts digests for a constant-time compare.
    expect(offenders(/from 'bcryptjs'/, 'server/src', ['server/src/services/accounts.ts']).filter((p) => !p.includes('__tests__'))).toEqual([]);
    expect(offenders(/createHash\(\s*'sha256'/, 'server/src', ['server/src/tokens.ts', 'server/src/services/social.ts', 'server/src/services/billing.ts'])).toEqual([]);
  });

  it('the app connects to MongoDB only through db.ts connectDb (the server and the Vercel function share it)', () => {
    // Tests and the seed script open their own throwaway connections.
    expect(offenders(/mongoose\.connect\(/, 'server/src', ['server/src/db.ts', 'server/src/__tests__/testDb.ts', 'server/src/scripts/seed.ts'])).toEqual([]);
  });

  it('every rate limiter and request guard lives in security.ts', () => {
    expect(offenders(/\brateLimit\(|\bhelmet\(/, 'server/src', ['server/src/security.ts'])).toEqual([]);
  });

  it('a grown-up account can never be created from the kid family code', () => {
    // Joining takes a single-use invite (services/accounts.ts joinWithInvite).
    expect(offenders(/joinWithCode|code:\s*familyCode\.optional\(\)/, 'server/src')).toEqual([]);
    expect(offenders(/join[A-Za-z]*\s*[:=][^\n]*code:\s*familyCode/, 'server/src')).toEqual([]);
  });

  it('mints tokens only in auth.ts', () => {
    expect(offenders(/jwt\.sign\(/, 'server/src', ['server/src/auth.ts'])).toEqual([]);
  });

  it('keeps routes thin: no model calls outside services and scripts', () => {
    expect(offenders(/from '\.\.?\/models(-account)?\.js'/, 'server/src', [])
      .filter((p) => !/^server\/src\/(services|scripts|__tests__)\//.test(p) && !['server/src/models.ts', 'server/src/auth.ts'].includes(p)))
      .toEqual([]);
  });

  it('client: no raw form or text elements outside the UI kit and art', () => {
    const raw = /<(button|input|select|textarea|h[1-6]|p)[\s>]/;
    const allowed = (p: string) => p.startsWith('client/src/components/ui/') || p.startsWith('client/src/art/');
    expect(offenders(raw, 'client/src').filter((p) => !allowed(p))).toEqual([]);
  });

  it('client: network, storage, confetti and dialogs each have one owner', () => {
    expect(offenders(/from 'axios'/, 'client/src', ['client/src/lib/api.ts'])).toEqual([]);
    expect(offenders(/localStorage/, 'client/src', ['client/src/lib/secure-storage.ts', 'client/src/lib/prefs.ts'])).toEqual([]);
    expect(offenders(/canvas-confetti/, 'client/src', ['client/src/lib/celebrate.ts'])).toEqual([]);
    expect(offenders(/window\.(confirm|alert|prompt)\(/, 'client/src')).toEqual([]);
  });

  it('client: money is shown through <Money> / formatCents, never by hand', () => {
    // The art library uses toFixed for SVG coordinates, which is not money.
    expect(offenders(/\/\s*100\)?\.toFixed|toFixed\(2\)/, 'client/src').filter((p) => !p.startsWith('client/src/art/'))).toEqual([]);
  });

  it('client: no raw hex colors in pages or features (use tokens)', () => {
    expect(offenders(/#[0-9a-fA-F]{6}\b/, 'client/src/pages')).toEqual([]);
    expect(offenders(/#[0-9a-fA-F]{6}\b/, 'client/src/features')).toEqual([]);
  });
});
