// Repo guards: each test pins one rule from CLAUDE.md so breaking it fails the build.
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';
import { describe, expect, it } from 'vitest';
import { LESSON_ART, LESSON_CATEGORIES, LESSONS, NEW_FAMILIES_OPEN, OPERATOR_ADDRESS, OPERATOR_PHONE } from '@kk/shared';

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
  it('there is no billing code to switch on: no payment SDK, no plan gate, and the Terms say free', () => {
    // Kid Kapital is free and takes no payments (Vercel Hobby fair use). Billing was removed
    // outright on 2026-10-31 so no env var can quietly turn charging on; bringing it back is
    // a product decision that also rewrites the Terms and the Privacy Policy.
    const pkgs = ['package.json', 'server/package.json', 'client/package.json', 'site/package.json', 'shared/package.json'].map((p) => readFileSync(join(ROOT, p), 'utf8'));
    expect(pkgs.filter((p) => /"(stripe|@stripe\/[^"]+|@revenuecat\/[^"]+|react-native-purchases)"/.test(p))).toEqual([]);
    expect(offenders(/from 'stripe'|@revenuecat\/|HttpError\(\s*402|\/billing\//, 'server/src').filter((p) => !/(guards|no-billing)\.test\.ts$/.test(p))).toEqual([]);
    expect(offenders(/@revenuecat\/|\/billing\/|PlanUpsell|usePlan\b/, 'client/src')).toEqual([]);
    const legal = readFileSync(join(ROOT, 'client/src/pages/legal.tsx'), 'utf8');
    expect(legal).toContain("heading: 'It is free'");
    expect(legal).toContain("It doesn't ask for or accept payments.");
  });

  it('the creator corner appears only in grown-up Settings, and the browser never calls the mail relay', () => {
    expect(offenders(/features\/creator'/, 'client/src', ['client/src/pages/parent/ParentSettings.tsx'])).toEqual([]);
    // The browser never talks to the mail relay and holds no mail keys: the server relays the form.
    // (The Privacy Policy names it as a processor; that is text, not a call.)
    expect([...offenders(/emailjs/i, 'client/src', ['client/src/pages/legal.tsx']), ...offenders(/emailjs/i, 'shared/src')]).toEqual([]);
    expect(offenders(/service_3t589y2|template_u5t6zq1|aEYQQP-65mEPEsaXX/, '')).toEqual([]);
    expect(offenders(/CREATOR_SUPPORT_PAGE/, 'client/src', ['client/src/features/creator.tsx'])).toEqual([]);
  });

  it('no payment link or wording on the Vercel projects (Hobby forbids commercial use); the support page link is the one exception', () => {
    // Lesson packs may teach kids about giving, so they are not app UI and are left out.
    const ui = code.filter((f) => /^(client\/src|site\/src|shared\/src)\//.test(f.path) && !f.path.startsWith('shared/src/lessons'));
    const paymentWords = /stripe\.com|buy\.stripe|payment link|leave a tip|tip jar|tipping|donat(?:e|ion)/i;
    expect(ui.filter((f) => paymentWords.test(f.text)).map((f) => f.path)).toEqual([]);
    // The exact support link lives once, in shared/src/creator.ts.
    expect(ui.filter((f) => f.text.includes('nathanwilson.dev/support')).map((f) => f.path)).toEqual(['shared/src/creator.ts']);
  });

  it('every form that sends from the browser renders a honeypot, and the contact form checks before it sends', () => {
    const guarded = code.filter((f) => f.path.startsWith('client/src/pages') && /useFormGuard\(/.test(f.text));
    expect(guarded.length).toBeGreaterThanOrEqual(2);
    expect(guarded.filter((f) => !/<Honeypot\b/.test(f.text)).map((f) => f.path)).toEqual([]);
    const contact = code.find((f) => f.path === 'client/src/features/creator.tsx')!.text;
    expect(contact).toMatch(/<Honeypot\b/);
    // The contact form uses the shared form guard; the server drops a filled trap before any send.
    expect(contact).toMatch(/useFormGuard\('contact'\)/);
  });

  it('every cookie and device storage key the app uses is named in the Privacy Policy', () => {
    const text = (path: string) => code.find((f) => f.path === path)!.text;
    const keys = new Set<string>();
    // prefs.ts stores every per-device convenience under kk_<name>.
    for (const m of text('client/src/lib/prefs.ts').matchAll(/(?:read|write)\('([a-z_]+)'/g)) keys.add(`kk_${m[1]}`);
    // Any other literal key in the client, and the session cookie.
    for (const f of code.filter((c) => c.path.startsWith('client/src'))) for (const m of f.text.matchAll(/'(kk[_:][a-z_-]+)'/g)) keys.add(m[1]);
    keys.add(/REFRESH_COOKIE = '([^']+)'/.exec(text('server/src/auth.ts'))![1]);
    expect(keys.size).toBeGreaterThanOrEqual(6);
    const policy = text('client/src/pages/legal.tsx');
    expect([...keys].filter((k) => !policy.includes(k))).toEqual([]);
  });

  it('private preview: no signup or join link on the site outside the gated button and footer, and it stays closed until consent exists', () => {
    expect(offenders(/APP_LINKS\.(signup|join)\b/, 'site/src', ['site/src/components/button.tsx', 'site/src/components/Footer.tsx'])).toEqual([]);
    // The footer's links sit behind the same switch.
    const footer = code.find((f) => f.path === 'site/src/components/Footer.tsx')!.text;
    for (const line of footer.split('\n').filter((l) => /APP_LINKS\.(signup|join)\b/.test(l))) expect(line).toMatch(/NEW_FAMILIES_OPEN \?/);
    // Opening to new families needs verifiable parental consent (COPPA) built first.
    const consentBuilt = code.some((f) => f.path === 'server/src/services/consent.ts');
    expect(!NEW_FAMILIES_OPEN || consentBuilt).toBe(true);
    // COPPA 312.4(d)(1): the policy must give a postal address and phone before families are invited in.
    expect(!NEW_FAMILIES_OPEN || (!!OPERATOR_ADDRESS && !!OPERATOR_PHONE)).toBe(true);
  });

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
    expect(offenders(/createHash\(\s*'sha256'/, 'server/src', ['server/src/tokens.ts', 'server/src/services/social.ts'])).toEqual([]);
  });

  it('the app connects to MongoDB only through db.ts connectDb (the server and the Vercel function share it)', () => {
    // Tests and the seed script open their own throwaway connections.
    expect(offenders(/mongoose\.connect\(/, 'server/src', ['server/src/db.ts', 'server/src/__tests__/testDb.ts', 'server/src/scripts/seed.ts'])).toEqual([]);
  });

  it('every rate limiter and request guard lives in security.ts', () => {
    expect(offenders(/\brateLimit\(|\bhelmet\(/, 'server/src', ['server/src/security.ts'])).toEqual([]);
  });

  it('every rate limiter counts in MongoDB through limiter(), each under its own name', () => {
    // A memory store gives each Vercel instance its own private count.
    expect(offenders(/\bMemoryStore\b/, 'server/src')).toEqual([]);
    const security = code.find((f) => f.path === 'server/src/security.ts')!.text;
    expect(security.match(/\brateLimit\(/g)).toHaveLength(1);
    expect(security).toMatch(/store: new MongoRateLimitStore\(name\),\n\s*\}\);/);
    // Two limiters with one name would share a count (both are keyed by the IP).
    const names = [...security.matchAll(/\blimiter\(\s*'([^']+)'/g)].map((m) => m[1]);
    expect(names.length).toBeGreaterThan(10);
    expect(names.filter((n, i) => names.indexOf(n) !== i)).toEqual([]);
  });

  it('bans and abuse counters are written only in services/abuse.ts', () => {
    expect(offenders(/\b(IpBan|AbuseCounter)\./, 'server/src', ['server/src/services/abuse.ts']).filter((p) => !p.includes('__tests__'))).toEqual([]);
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

  it('client: amounts are shown as coins through <Money> / formatCoins, never by hand or in dollars', () => {
    // The art library uses toFixed for SVG coordinates, which is not money.
    expect(offenders(/\/\s*100\)?\.toFixed|toFixed\(2\)/, 'client/src').filter((p) => !p.startsWith('client/src/art/'))).toEqual([]);
    // No dollar amounts typed into the app or the site: coins are pretend (Terms).
    expect([...offenders(/\$\d/, 'client/src'), ...offenders(/\$\d/, 'site/src')].filter((p) => !p.startsWith('client/src/art/'))).toEqual([]);
  });

  it('client: no raw hex colors in pages or features (use tokens)', () => {
    expect(offenders(/#[0-9a-fA-F]{6}\b/, 'client/src/pages')).toEqual([]);
    expect(offenders(/#[0-9a-fA-F]{6}\b/, 'client/src/features')).toEqual([]);
  });
});
