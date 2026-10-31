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
| Parent identity not verified (COPPA consent) | Medium | Grown-up confirms 18+ and parent or guardian; email verification is built (`assertEmailVerified`) | **Off in the preview**: no mail provider yet (`PREVIEW_WITHOUT_EMAIL`). Turn on before promoting to the public |
| Data loss | Medium | Deletion is deliberate and immediate; disclosed in the Privacy Policy | Free database tier has **no backups**; disclosed |
| Keeping data longer than needed | Low | Published retention limit: idle families erased after 12 months (`eraseInactiveFamilies`) | None known |
| Secrets leaking | Low | Secrets only in Vercel environment variables, never in git (repo is public; history checked 2026-10-31, no live secrets) | None known |
| Third-party scripts or trackers in kids' screens | Low | None used; strict Content Security Policy on app and site | None known |

## 4. Safeguards (where they live)

- Request hardening, headers, CORS, CSRF guard, rate limits: `server/src/security.ts`.
- Bot protection and bans: `server/src/bot-protection.ts`, `server/src/services/abuse.ts`.
- Authentication and sessions: `server/src/auth.ts`; passwords and PINs hashed with bcrypt in
  `services/accounts.ts`.
- Deletion, export and retention: `server/src/services/personal-data.ts` (a guard test fails
  the build if a new model with kid or family data is not covered).
- Encryption in transit everywhere (HTTPS with HSTS); the database provider encrypts at rest.
- Repo guards and tests run in CI on every push (`.github/workflows/ci.yml`).

## 5. Service providers and their assurances

These providers process data as service providers. None receives children's information:

- **Vercel** (hosting, firewall): Vercel's Data Processing Addendum and security commitments.
- **MongoDB Atlas** (database, on AWS us-east-1): MongoDB's Data Processing Agreement and
  security commitments.
- **EmailJS** (grown-up contact form in Settings only): receives the grown-up's name, email and
  message to deliver them to the operator's inbox.
- **Stripe** (optional tips, on Stripe's own hosted page, web only): the app sends nothing to
  Stripe and never sees card details.

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
| 2026-10-31 | Grown-up contact form (EmailJS) and optional tip link (Stripe), web only, never on kid screens. |
