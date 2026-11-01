# Kid Kapital written information security program

The amended COPPA Rule (16 CFR 312.8, compliance date April 22, 2026) requires an operator that
collects children's personal information to keep a written information security program. This
is that program. It describes what is actually in place; when the code changes, update it.

Last reviewed: 2026-10-31. Next review due: 2027-10-31 (at least once a year, and after any
security incident or a big change such as payments, email or a new provider).

## 1. Who is responsible

- **Program coordinator:** Nathan Wilson (operator), nwils000@gmail.com. Owns this document,
  the yearly risk assessment, vendor checks and incident response.

## 2. What it protects

Children's and families' information as listed in the Privacy Policy
(`client/src/pages/legal.tsx`): kid nickname, drawn avatar, optional birth year, PIN hash and
in-app activity; grown-up name, email and password hash; family settings. No child contact
details, photos, voice or location are collected, and the app has no field for them.

## 3. Risk assessment (2026-10-31)

| Risk | Likelihood | Safeguard in place | Remaining gap |
|------|-----------|--------------------|---------------|
| One family reading another family's data | Low | Every query is scoped by `familyOf(req)`; `resolveKid()` decides which kid a request may touch; covered by tests | None known |
| Guessing a kid's PIN or a grown-up password | Medium | Atomic lockouts (`verifySecret`), escalating kid lockouts, per-IP, per-email, per-kid and per-family-code rate limits shared across instances, failed sign-ins feed an IP ban ladder | None known |
| Stolen session | Low | 15-minute access tokens with revocable `jti`; refresh tokens hashed, single-use, rotated, reuse detection revokes all sessions; httpOnly cookie on web | None known |
| Bots, scanners, credential stuffing | Medium | Vercel Bot Protection and AI bot blocking (both projects), 300 req/min per IP on `/api/`, app limiter, honeypot paths, scanner agent bans, form guard on public forms | No CAPTCHA (by choice: no third-party scripts in a kids' app) |
| Parent consent not verified (COPPA) | Medium | Email-plus consent (`services/consent.ts`): every new kid is locked until the grown-up confirms the notice sent to their own account email; follow-up with a withdraw link; unconfirmed kids deleted after 7 days. New families stay closed (`NEW_FAMILIES_OPEN`) | Email plus relies on the grown-up's inbox; a lawyer should confirm it fits before opening to the public. Operator postal address and phone not yet set |
| Data loss | Medium | Deletion is deliberate and immediate; disclosed in the Privacy Policy | Free database tier has **no backups**; disclosed |
| Keeping data longer than needed | Low | Published retention limit: idle families erased after 12 months (`eraseInactiveFamilies`) | None known |
| Secrets leaking | Low | Secrets only in Vercel environment variables, never in git (repo is public; history checked 2026-10-31, no live secrets) | None known |
| Third-party scripts or trackers in kids' screens | Low | None used; strict Content Security Policy on app and site | None known |

## 4. Safeguards (where they live)

- Request hardening, headers, CORS, CSRF guard, rate limits: `server/src/security.ts`.
- Bot protection and bans: `server/src/bot-protection.ts`, `server/src/services/abuse.ts`.
  Every public form sends an off-screen honeypot and fill signals (3 seconds on grown-up forms);
  a caught submit gets the normal answer and nothing is stored. Route limits (signup 5 an hour
  per IP; login 10 wrong tries per IP and email, 20 per email; password reset 3 an hour per IP and
  email; kid PIN 10 per kid, 30 per family, 30 per IP per 15 minutes, on top of the account
  lockout ladder) count in MongoDB, shared by every instance, and answer 429.
- IP addresses: route-limit counters are stored as one-way hashes and expire with their window
  (15 minutes to 24 hours); bot-score and repeat-offense records hold the address itself for at
  most 7 days; a ban lasts at most 24 hours. All expire through MongoDB TTL indexes.
- Request bodies are capped at 50 KB and parsed with zod, which drops any field it does not
  expect. Emails only ever go to an account's own address; nothing lets a caller pick a recipient.
- Authentication and sessions: `server/src/auth.ts`; passwords and PINs hashed with bcrypt in
  `services/accounts.ts`.
- Deletion, export and retention: `server/src/services/personal-data.ts` (a guard test fails
  the build if a new model with kid or family data is not covered).
- Encryption in transit everywhere (HTTPS with HSTS); the database provider encrypts at rest.
- Repo guards and tests run in CI on every push (`.github/workflows/ci.yml`).

## 5. Service providers and their assurances

These providers process data as service providers. Vercel and MongoDB store children's information only to host it, under their data processing terms; Resend sees only a kid's nickname, inside the consent emails it delivers to that kid's grown-up:

- **Vercel** (hosting, firewall): Vercel's Data Processing Addendum and security commitments.
- **MongoDB Atlas** (database, on AWS us-east-1): MongoDB's Data Processing Agreement and
  security commitments.
- **Resend** (resend.com, server-side only, send-only key, from the verified domain
  nathanwilson.dev): delivers the parental-consent notice and its confirmation, and password reset
  links, to the grown-up's own account email (the consent emails name the kid by nickname; every
  user-entered string is HTML-escaped), and the grown-up contact form (Settings only) to the
  operator's Gmail inbox with replies to the grown-up. The browser never calls it. The quota is
  shared by every one of the operator's apps, so this app caps itself at 30 account emails and 10
  contact messages a day (mailer.ts DAILY_MAIL_CAPS), plus 3 consent emails per family per day and
  3 contact messages per 10 minutes per address.
- No payment provider: Kid Kapital takes no payments (Vercel Hobby fair use). Support for the
  creator lives only on his own site.

Before adding any provider that would touch children's information (email, payments,
analytics), get its written security assurances, add it here and to the Privacy Policy, and
bump `LEGAL_VERSIONS`.

## 6. Incident response

1. Contain: rotate `JWT_SECRET` (ends every session), `CRON_SECRET` and the database password
   in Vercel; use `revokeAllSessions` for affected users; block addresses in the Vercel firewall.
2. Assess what information and which families were affected.
3. Notify affected grown-ups as the law requires (state breach laws), and the FTC if required.
4. Fix the root cause, add a guard so it cannot recur, and record it in this document.

## 7. Review log

| Date | What changed |
|------|--------------|
| 2026-10-31 | First program. Free for everyone, no payments, no email; retention limit added. |
| 2026-10-31 | Grown-up contact form (EmailJS), web only, never on kid screens. A planned tip link was dropped: no payments on Vercel. |
| 2026-10-31 | Email moved from EmailJS to Resend (verified domain, server-only key, app-wide daily caps). |
| 2026-10-31 | Verifiable parental consent (email plus): kids locked until a grown-up confirms the emailed notice, follow-up with a withdraw link, unconfirmed kids deleted after 7 days, 3 consent emails per family per day. |
| 2026-10-31 | Contact form moved behind our server (relay with server-only keys), activity history older than 24 months deleted with badges rolled up, private preview for new families. |
| 2026-10-31 | Bot pass: 3-second fill floor on grown-up forms, 429 tests for every limited public route, honeypot guard per form, IP retention written down. |
