# CLAUDE.md - Kid Kapital

A playful family money app: grown-ups set **quests** (chores), kids finish them and
earn coins, spend coins in the family **shop**, and grow them in a **piggy bank**
(steady interest) or a **rocket fund** (random weekly swing). Web + iOS + Android
from one React codebase via Capacitor. Adapted from the Mentis rulebook.

---

## THE FOUR PRINCIPLES (THE #1 RULE)

Every change, frontend and backend, follows all four. They outrank every other rule
in this file. When in doubt about anything else, apply them.

**Together they prevent one failure: a fix that makes the reported case look right
while the defect survives somewhere else, or quietly comes back later, and everyone
believes it is fixed.** The app this one replaced shipped exactly that: money stored
in an integer field so cents vanished, allowance paid from inside a GET request so it
only happened if someone opened the app, and ownership checks living in some views
but not others so any kid could approve their own chores.

### 1. Root cause, never the symptom.

Never just patch the place where a problem shows up. Find what makes the failure
possible, fix it there, and say what the root cause was. The screen showing the wrong
number is the messenger; the defect is upstream, in a predicate, a missing guard, a
wrong field, a stale cache, a race, or a second copy of a rule.

- Reproduce it, read the whole code path, read the real data (print the actual
  document, inspect the actual request and response). If you cannot state the cause
  in one sentence ("X happens because Y"), you have not found it yet.
- None of these is ever the whole fix: clamping the shown value, a `?? 0` / `|| []`
  default for a value that should never be missing, a try/catch that swallows, a
  special case for the reported id, a retry over a race, a client-side filter over a
  wrong server response, recomputing a number at the display, or changing a test's
  expectation to match wrong output. Any of them may sit ON TOP of the real fix,
  never instead of it.
- Then ask "where else?": grep for the same pattern across `client/`, `server/` and
  `shared/`. Fix every instance in the same change, or name the ones left and why.
- If the real fix is out of reach (needs a migration or an owner decision), stop and
  tell Nathan the root cause and the options. Never ship a symptom patch silently.
- Report it as "X happened because Y; fixed in `Z`, which serves A, B and C; a repeat
  now fails `T`."

### 2. DRY: one owner per rule.

Every rule, check, mapping, list of allowed values, query, or piece of logic lives in
exactly ONE place, and every caller reads it from there.

- Before writing anything (a file, component, hook, service, constant, endpoint,
  query, or a function that computes, formats, validates or authorizes), find the
  existing owner. Search by the outcome you need, not by name.
- Then reuse it, else extend it (add the variant or parameter THERE), else create a
  new owner in its shared home so the next person finds it. Never a local copy, a
  parallel system, or a "New" version of something that exists.
- When you find a rule written twice, collapse it into one owner in the same change
  and pin it with a guard test (see `server/src/__tests__/guards.test.ts`).
- Client and server share rules through `shared/` (`@kk/shared`), so a second copy is
  never needed.

### 3. One shared path for similar features.

Features that do similar things (depositing into the piggy vs the rocket, buying vs
refunding, a kid finishing a quest vs a parent marking it) run through the same
component, service or endpoint, with an option for what truly differs. Split only for
a real product reason, and write that reason in a comment.

### 4. Ask "How do we prevent this from happening again?", and do it.

Every fix ends with that question, about the CLASS of mistake, and the answer ships
in the same change. Pick the strongest guard that fits and name it:

1. **Make it impossible:** a type that cannot hold the bad state, one owner every
   caller has to go through, a schema `enum` / `required` / `unique`, a conditional
   update, deleting the wrong door.
2. **Make it fail the build:** a guard test that scans for the pattern, a typecheck, a
   parity test.
3. **Make it loud at runtime:** a typed error at the boundary.
4. **Write it down where the next person will be:** a comment at the exact spot or a
   rule in this file. Weakest rung; use it alone only when nothing above fits.

A fix that cannot name its guard is not done.

### What they mean here

- **Frontend:** every button is `<Button>`, every heading `<Heading>`, every card
  `<Card>`, every modal `<Sheet>`, every amount `<Money>`. Compose from
  `client/src/components/ui/`. Never hand-roll.
- **Backend:** thin routes, logic in `server/src/services/`, `handle()` + `HttpError`,
  zod for every input, ONE primitive per rule (see the table below).
- **Enforced:** `server/src/__tests__/guards.test.ts` scans the whole repo and fails
  the build on the banned patterns listed in this file.

---

## THE OWNERS (one primitive per rule)

| Rule | The one owner | Never |
|------|---------------|-------|
| Changing any balance (wallet, piggy, rocket) | `server/src/services/money.ts` `move()` / `transfer()` | `$inc: { balanceCents }` anywhere else |
| Minting an access token | `server/src/auth.ts` `signAccessToken` | `jwt.sign` anywhere else |
| Which kid a request may touch | `server/src/auth.ts` `resolveKid()` | `User.findById(req.params.id)` in a route |
| Family scoping | `familyOf(req)` in every query | a query without `familyId` |
| Parent-only actions | `requireParent` middleware | a role check inside a handler |
| Is a quest due on a day | `@kk/shared` `isDueOn()` | date math in a component |
| Showing an amount (as COINS, never dollars) | `@kk/shared` `formatCoins()` / `coinsText()` via `<Money>` | a `$`, `toFixed(2)` or `/ 100` in UI |
| Allowed avatars, quest icons, reward icons | `@kk/shared` lists | inline string arrays |
| Weekly growth | `server/src/services/growth.ts` `runGrowth()` | growth math anywhere else |
| Scheduled work (what runs, and when) | `server/src/services/jobs.ts` `runScheduledJobs()` | a `setInterval` or a cron route for one job |
| Streaks and badges | `server/src/services/stats.ts` | recomputing on the client |
| Earning XP (and the level-up bonus and level prizes it triggers) | `server/src/services/game.ts` `awardXp()` | `$inc: { xp }` anywhere else |
| Unlocking milestone prizes (helper points or level) | `game.ts` `unlockMilestones()` | creating a `MilestoneClaim` elsewhere |
| Lesson content, age bands, categories, grading | `@kk/shared` `learn.ts` (packs in `lessons-*.ts`) | lesson text or quiz answers in the client or server |
| Lesson rewards and assignments | `server/src/services/learn.ts` | paying for a lesson anywhere else |
| Kinds of money movement | `@kk/shared` `TXN_KINDS` | a txn kind list in a model, service or component |
| API calls | `client/src/lib/api.ts` (`api` + typed endpoint fns) | raw `axios`/`fetch` in components |
| Token storage | `client/src/lib/secure-storage.ts` | `localStorage` for credentials |
| Server state | react-query hooks in `client/src/lib/queries.ts` | `useEffect` + `useState` fetching |
| Celebrations (confetti, coin burst, haptics) | `client/src/lib/celebrate.ts` | calling `canvas-confetti` directly |
| Ending sessions (password change/reset, sign out everywhere, token reuse) | `server/src/auth.ts` `revokeAllSessions()` | `RefreshToken.deleteMany` in a service |
| Password rules | `@kk/shared` `passwordProblem()` (zod `newPassword` in `schemas.ts`) | a regex or length check anywhere else |
| Hashing / checking passwords and PINs | `server/src/services/accounts.ts` `hashPassword` / `checkSecret` | `bcrypt` anywhere else |
| Sending email (account emails, and the contact relay to the operator) | `server/src/services/mailer.ts` `sendMail()` / `sendToOperator()` | nodemailer or a mail API anywhere else |
| Request hardening (headers, CORS, CSRF guard, shape guard, rate limits and their IP keys, request ids, logs, the dev-door loopback check) | `server/src/security.ts` | a new `rateLimit(...)` or `helmet(...)` in a route file |
| Rate-limit counts, shared by every serverless instance | `security.ts` `limiter(name, ...)`, which always uses `services/abuse.ts` `MongoRateLimitStore` | `MemoryStore`, a `store:` option, two limiters with one name |
| Bot protection (IP bans and their ladder, honeypot paths, scanner and empty user agents, failed sign-ins per IP, the form guard and its decoy replies) | `server/src/bot-protection.ts`; counters and bans in `services/abuse.ts` (`countHit`, `recordBotSignal`, `recordFailedSignIn`) | a ban, a user-agent list or a honeypot check anywhere else; `IpBan` / `AbuseCounter` writes outside `abuse.ts` |
| Form-guard fields, floors and signals | `@kk/shared` `form-guard.ts`; client `lib/form-guard.ts` `useFormGuard()` + `<Honeypot>` | a hand-rolled hidden input or fill timer in a page |
| Making and hashing secret tokens; links that carry them | `server/src/tokens.ts` `newToken` / `sha256` / `appLink` / `linkToken` | `crypto.randomBytes` + `createHash` for a token anywhere else, a token in a URL path |
| Login lockouts (claim an attempt, then lock atomically) | `server/src/services/accounts.ts` `verifySecret` | reading `failedLogins` into memory and writing it back |
| Grown-up invites, the kid family code | `services/accounts.ts` `createInvite` / `joinWithInvite` / `rotateFamilyCode` | creating a grown-up from a family code |
| Email verification and what needs it | `services/email-verification.ts` `assertEmailVerified` | checking `emailVerifiedAt` in another service |
| Which environment this is | `server/src/config.ts` `appEnv` / `isHosted` / `devEndpoints` | `process.env.NODE_ENV` or a production-only flag anywhere else |
| Deleting and exporting a family's data (remove kid, grown-up leaves, delete family, download) | `server/src/services/personal-data.ts` `eraseKid` / `eraseParent` / `eraseFamily` / `exportFamily` | `deleteMany` of kid or family data in another service; a new model with `kidId`/`userId`/`familyId` not listed there (guard in `personal-data.test.ts`) |
| Re-checking a grown-up's password before a big step | `services/account-security.ts` `confirmPassword` | comparing a password in a route or another service |
| Agreeing to the Terms and Privacy Policy | `@kk/shared` `LEGAL_VERSIONS`; recorded in `accounts.ts` `createParent` and `acceptCurrentLegal`; enforced by `auth.ts` (`requireAuth` answers 428 `LEGAL_UPDATE` to a grown-up on old versions; `issueSession` refuses a kid until a grown-up in the family agreed to the current Privacy Policy); the app's one re-accept sheet is `features/legal-update.tsx` | a grown-up account created anywhere else; a version bump without the sheet |
| The legal documents' text | `client/src/pages/legal.tsx` | a second copy (the marketing site links to the app's pages) |
| Who runs Kid Kapital and how to reach them | `@kk/shared` `OPERATOR_NAME` / `PRIVACY_CONTACT` | a name or email typed into a page |
| The creator credit, support-page link, contact form and its rules | `@kk/shared` `creator.ts`; UI `client/src/features/creator.tsx` (grown-up Settings only); `POST /api/contact` (`services/contact.ts`, form guard surface `contact`, `contactLimiter`) relayed by `mailer.ts` `sendToOperator` through Resend (server-only `RESEND_API_KEY`) | any payment, tip or donation link or wording (Vercel Hobby forbids commercial use); creator links on a kid screen; any mail call or key in the browser |
| Connecting to MongoDB and building indexes (server and Vercel function) | `server/src/db.ts` `connectDb()` | `mongoose.connect` anywhere else |
| Hosting on Vercel (build output, routes, cron) | `scripts/vercel-build.mjs` + `server/src/vercel.ts`; the cron door is `security.ts` `requireCron` | a second build config or an unguarded job route |
| Serving the built web app (production) and its page headers | `server/src/web-app.ts` + `security.ts` `webAppHeaders` | static serving or a page CSP anywhere else |

---

## #0 RULE: NO EM DASHES OR EN DASHES, EVER

Never use an em dash or an en dash anywhere: UI text, strings, comments or docs. Use
a comma or a plain hyphen `-`. Pinned by `guards.test.ts`.

## NO EMOJIS, USE THE ART

Never use an emoji in the app. Kid Kapital has its own hand-drawn art library in
`client/src/art/` (mascot, avatars, money objects, quest and reward stickers, badges,
scenes, UI icons). If a picture is missing, draw it there in the same sticker style
(ink `#1F2547` outline, flat fills, soft highlight) and export it from
`client/src/art/index.ts`. Pinned by `guards.test.ts`.

---

## MONEY IS INTEGER CENTS

Every amount is an integer number of cents (`Cents` in `@kk/shared`). Never a float,
never dollars. A debit is a conditional update (`balanceCents >= amount`), so a
balance can never go negative even when requests race. Every movement writes a `Txn`
row; the activity feed reads those rows.

## STATE CHANGES HAPPEN EXACTLY ONCE

Approving a quest, fulfilling or declining a purchase, and claiming a growth period
are all conditional updates on the current status (`done -> approved`,
`pending -> declined`, `lastGrowthAt = periodStart`). Two taps, two tabs or two
workers can never pay twice. Copy this shape for any new state transition.

## TIME-BASED WORK RUNS IN A JOB, NEVER IN A READ

Nothing that moves money runs inside a GET handler. Scheduled work has one owner,
`services/jobs.ts` `runScheduledJobs()` (weekly growth and the retention limit), ticked hourly by
a long-running server and daily by Vercel Cron; every job in it is idempotent.

## RETENTION (COPPA: published and never indefinite)

A family nobody has signed in to for `INACTIVE_FAMILY_MONTHS` (`@kk/shared` legal.ts, 12) is
erased whole by `personal-data.ts` `eraseInactiveFamilies`. Activity is noted in `auth.ts`
`issueSession` (every sign-in and renewal), at most daily. The Privacy Policy reads the number,
so changing it changes the policy; bump `LEGAL_VERSIONS` when you do.

---

## AUTH (ported from Mentis)

- Short-lived JWT access token (15 min) + opaque refresh token stored **hashed** and
  **rotated on every use** (single-use via `findOneAndDelete`).
- Web: access token in memory (zustand), refresh token in an httpOnly cookie.
- Native (Capacitor): client sends `X-Client-Platform: native`; the refresh token comes
  back in the body and is stored in the Keychain/Keystore via `secure-storage.ts`.
- Grown-ups sign in with email + password. Kids sign in with the 6-character family
  code, tap their avatar, and enter a 4-digit PIN.
- **The family code is for KIDS only.** A second grown-up joins only with a single-use
  invite link a grown-up makes in Settings (`POST /family/invites`, `CoParentInvite`,
  hashed, 7 days, `/join#invite=...`), claimed with one conditional update
  (`usedAt: null -> now`). Email join and Google/Apple join both take `invite`, never
  `code`. A grown-up can change the code (`POST /family/code/rotate`); signed-in kids
  stay signed in.
- **Lockouts** (`accounts.ts` `verifySecret`, Mentis `incLoginAttempts`): each try
  first CLAIMS an attempt with a conditional `$inc` (`failedLogins < 5`, not locked),
  then compares, so parallel guesses cannot all be checked; the fifth failure locks
  with one atomic pipeline update. Grown-ups: 5 minutes, cleared by a reset link. Kids
  escalate 5 min, 1 h, 24 h (`lockouts`), and only a grown-up changing the PIN clears
  the ladder; that also ends the kid's sessions. Rate limits sit on top, keyed per IP
  (/64 for IPv6), per email, per kid and per family code.
- **Login timing** never says whether an account exists: no user, or no password,
  still compares against a real cost-matched `DUMMY_PASSWORD_HASH`.
- **Email verification** (`services/email-verification.ts`): signup and invite join
  email a hashed, single-use, 24 h link (`/verify-email#token=...`). An unverified
  grown-up can sign in and set things up, but adding a kid or inviting a grown-up
  waits for it (`assertEmailVerified`, 403 `EMAIL_UNVERIFIED`): COPPA wants the
  parent's verified contact before any kid data. A provider-verified Google/Apple
  email counts, and so does using a reset link. If Google/Apple arrives at an
  existing UNVERIFIED password account, that password is a squatter's: it is removed
  and every session revoked before linking. A Google/Apple-only account sets its
  first password through the reset link (`changePassword` answers `USE_RESET`).
- **Refresh token reuse detection.** A rotated token is remembered (`SpentRefreshToken`,
  written BEFORE the live token is consumed). Seen again within 10s it is a benign race
  (two tabs, a reload, StrictMode) and gets ONE grace session (`graceUsed`, claimed
  once); seen later it was copied, so `revokeAllSessions()` ends every session of that
  user (`SESSION_REVOKED`).
- **Sign out ends the access token too**: every access token has a `jti`; `endSession`
  stores it in `RevokedJti` (TTL at its expiry) and `requireAuth` refuses it.
- **Revocation cutoff.** `revokeAllSessions()` also stores a `SessionCutoff`;
  `requireAuth` refuses access tokens minted at or before it (millisecond `t` claim,
  30s per-process cache). Password reset, password change and "sign out of other
  devices" all go through it; the last two hand the current device a fresh session.
- **Passwords** follow the Mentis rules in `@kk/shared` `PASSWORD_RULES` (8+, upper,
  lower, number, symbol). Login only checks the hash, so older passwords keep working.
- **Forgot password** never says whether an email exists: one lookup, same answer,
  email sent after the response. The link is single-use, hashed, 1 hour, carried in
  the URL fragment (`/reset-password#token=...`) so it never reaches a log. A second
  request within 60s keeps the first link. Without `SMTP_URL`, dev prints the link to
  the API console. Checking a link is a POST with the token in the body: a token never
  goes in a URL path (request logs mask anything token-shaped as a backstop).
- **Google / Apple sign-in** (grown-ups only) verify the ID token on the server
  (`services/social.ts`, ported from Mentis). The provider `sub` is the key
  (`SocialIdentity`); an existing email account is linked, or a new family started
  (or joined with an `invite`), only when the provider verified the email. Apple needs a server nonce
  (`GET /auth/apple/nonce`). Each provider answers 501 `NOT_CONFIGURED` until its ids
  are set, and the client hides its button. Web only for now; native needs the
  Google/Apple Capacitor plugins.
- **Security middleware** (`server/src/security.ts`, mounted in `app.ts`): API-tuned
  helmet, exact-match CORS from `CLIENT_ORIGINS`, `Cache-Control: no-store`, request
  ids (`X-Request-Id`) and one JSON log line per request (path without query, status,
  ms, user id; never bodies, emails or tokens), body depth limit, object query params
  refused, `$`/dotted keys stripped, rate limits (all keyed by `ipKey`, which folds
  IPv6 to its /64), a CSRF guard (`csrfGuard`: a state-changing request needs
  `Authorization` or `X-Requested-With`, which `client/src/lib/api.ts` always sends;
  only pre-session auth calls are exempt; sign out is not), no
  ETags, and an error handler that answers body-parser 4xx generically and logs a 500
  as one structured line, never the raw error (it carries the request body).
- **Bot protection** (`bot-protection.ts`, ported from Mentis botProtection/formGuard; no
  Redis, everything is in Mongo with TTLs through `services/abuse.ts`, and every step
  FAILS OPEN with one log line). Every limiter counts in Mongo (`limiter(name, ...)`), so
  limits hold across Vercel instances; `apiLimiter` caps all API calls per IP. Mounted
  first: a banned address gets a bare 403 everywhere. Honeypot paths (`/wp-admin`,
  `/.env`, ...) answer 404 and score; attack-tool agents get 403 and score; empty or
  generic-client agents (curl, python-requests) get 403 on `/api` without scoring
  (cron exempt). Scores reaching 15 in 6 h, or 40 wrong sign-ins in 15 min
  from one address, ban it on the ladder 15 min, 1 h, 6 h, 24 h (offenses remembered 7
  days). Bans and agent checks run only on hosted servers (`protection.bans`). The
  public forms (signup, join, login, kid login, forgot password) send a honeypot and
  fill signals (`useFormGuard`); a filled honeypot, or too fast AND no interaction,
  gets the endpoint's NORMAL reply (a decoy session, the usual wrong-password 401 at
  full bcrypt cost, the usual reset answer) and nothing is stored. No signals is never
  punished. `FORM_GUARD_MODE=monitor` logs without dropping. No CAPTCHA (no third-party
  scripts in a kids' app); one would slot into `formGuard`.
- **Environments** (`config.ts`): `NODE_ENV` must be production, staging, development
  or test; anything else, or unset, is HOSTED (secure cookies, HSTS, strong
  `JWT_SECRET` and no `CLIENT_ORIGINS=*` or it refuses to boot). The demo quick login
  mounts only with `NODE_ENV=development` AND `ENABLE_DEV_ENDPOINTS=true` (both set by
  `npm run dev`) AND a loopback socket address (`requireLocalDev`).

---

## FREE, NO PAYMENTS

Kid Kapital is free for every family and takes no payments of any kind. It runs on Vercel's
Hobby plan, whose fair-use rules count asking for money as commercial use. There is no billing
code at all: no plans, no plan limits, no Stripe or RevenueCat SDK, no `/billing` routes (all
removed 2026-10-31, so no env var can turn charging on). Every family gets every feature.
`guards.test.ts` fails on a payment SDK, a 402, a `/billing/` path, a plan hook, payment or
donation wording, or Terms that stop saying "It is free"; `no-billing.test.ts` boots with every
provider env var set and proves no payment route exists. Support for the creator lives only on
his own site (`@kk/shared` `CREATOR_SUPPORT_PAGE`), linked from grown-up Settings. Bringing
payments back is a product and legal decision (Terms, Privacy Policy, hosting plan), not a code
switch.

---

## ATOMIC FRONTEND

Compose from `client/src/components/ui/` (exported from its `index.ts`). Never raw:

| FORBIDDEN | USE |
|-----------|-----|
| `<button>` | `<Button>` (variants: primary, secondary, ghost, danger, coin) |
| `<input>` | `<Input>`, `<PinPad>`, `<AmountPicker>` |
| `<h1>`-`<h6>` | `<Heading>` |
| `<p>` | `<Text>` |
| div-as-card | `<Card>` |
| inline modal / `window.confirm` | `<Sheet>` / `useConfirm()` |
| amount text | `<Money>` |
| star rating | `<Stars>` |

Colors are **semantic tokens** defined once in `client/src/index.css` and wired into
`tailwind.config.js` (`bg-surface`, `text-ink`, `text-ink-soft`, `bg-brand`,
`bg-coin`, ...). Never a raw hex in a component. Motion presets live in
`client/src/lib/motion.ts`; reuse them instead of inventing new springs.

If a pattern does not exist, add it to `components/ui/` first, then use it. The
`/art` dev route shows the full art library and the UI kit.

## ATOMIC BACKEND

- Routes are THIN: parse input with zod, call a service, return its result. No
  Mongoose calls in `routes/`.
- Every handler is wrapped in `handle()`; throw `HttpError` and let `errorHandler` map
  it. No bespoke try/catch.
- Never spread `req.body` or `req.query` into a query; parse it with zod first.

## NEVER CREATE PARALLEL SYSTEMS

Update existing code; never add a `...New` file, a second endpoint for the same
thing, or a second model for the same resource.

---

## KEY PATHS

| What | Where |
|------|-------|
| Shared rules and constants | `shared/src/index.ts` |
| API app / entry | `server/src/app.ts`, `server/src/index.ts` |
| Models | `server/src/models.ts` |
| Services (all logic) | `server/src/services/` |
| Routes (thin) | `server/src/routes.ts`, `server/src/routes-account.ts` (auth extras) |
| Account models | `server/src/models-account.ts` |
| Security middleware | `server/src/security.ts` |
| Tests + guards | `server/src/__tests__/` |
| UI kit | `client/src/components/ui/` |
| Art library | `client/src/art/` |
| Pages | `client/src/pages/` |
| Legacy Django app (reference only) | `legacy-django/` |

## RUNNING IT

```
brew services start mongodb-community   # local Mongo
cp server/.env.example server/.env      # set JWT_SECRET
npm install
npm run seed                            # demo family, see below
npm run dev                             # API :8787, app :5173
npm test                                # API tests + repo guards
```

Demo logins after `npm run seed`: grown-up `demo@kidkapital.app` / `password123`;
kids use family code `DEMO42`, Maya PIN `1234`, Leo PIN `5678`.

Native: `npm run cap:ios -w client` / `npm run cap:android -w client`.

## PARENTAL CONSENT (COPPA "email plus")

`server/src/services/consent.ts` owns it. Adding a kid (`family.ts addKid`) emails the grown-up's
own account address the direct notice with a single-use consent link (`ConsentToken`, hashed);
until it is used the kid is locked (`auth.ts issueSession`, 403 `CONSENT_PENDING`) and the parent
sees "Send the email again" on the kid's card. Consent is stored on the kid (`kidConsent`). The
daily job sends a follow-up with a withdraw link (deletes the kid) and deletes kids unconfirmed
after 7 days. At most 3 consent emails per family per day. Mail goes through `mailer.ts`
`sendMail` (Resend server-side when there is no SMTP, capped per day: `DAILY_MAIL_CAPS`), never to an
address a caller sends; every user-entered string in an HTML email goes through `escapeHtml`.
`config.consentRequired` is on for every hosted deploy and off in local development.

## PRIVATE PREVIEW (COPPA stopgap)

There is no verifiable parental consent step yet, so new families are not open:
`@kk/shared` `NEW_FAMILIES_OPEN = false` turns every site signup button into "Coming soon"
(`site/src/components/button.tsx` `SignupButton`, the only signup link), and while grown-ups are
auto-verified `email-verification.ts` `assertKidCreationOpen` refuses to add a kid for anyone not
on `PREVIEW_ALLOWED_EMAILS` (403 `PRIVATE_PREVIEW`). `guards.test.ts` keeps it closed until
`server/src/services/consent.ts` exists. Opening needs consent built and a lawyer's sign-off.

## PREVIEW WITHOUT EMAIL

A hosted server needs `SMTP_URL`, except a `NODE_ENV=staging` deploy with
`PREVIEW_WITHOUT_EMAIL=true` (Mentis `AUTO_VERIFY_EMAIL`): new grown-ups start verified
(`email-verification.ts` `startsVerified`) and no mail is sent, so password reset and
invite emails do not arrive. Production refuses to boot with it (`hosting.test.ts`).

## PRIVACY AND KIDS' DATA

Kid Kapital is used by children under 13. Collect only what the app needs, never add
third-party analytics, ads or tracking SDKs to the client, and never ask a kid for an
email, photo or location. Every grown-up account records the Terms/Privacy versions it
agreed to (`legalAccepted`), adding a kid needs a verified grown-up email, and a parent
can download or delete everything from Settings > Your data. A new model that stores
kid, user or family data must be added to `personal-data.ts` or the build fails.

## FRONTEND TESTING

Use the ego-browser skill for click-throughs and screenshots against the dev server.
Check a phone width (390px) and a desktop width for every screen you touch.

The marketing site has a layout guard: `npm run check:layout -w site` (after `build:site`; CI
runs it) loads every page at 300 to 1440px and fails on sideways scroll, or on a section left
invisible on a phone before scrolling. Site buttons (`site/src/components/button.tsx`) wrap a
long label instead of growing past their container; never add `whitespace-nowrap` to one.
