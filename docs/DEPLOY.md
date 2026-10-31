# Deploying Kid Kapital (web)

Kid Kapital ships as two pieces:

| Piece | What | Where it builds |
|-------|------|-----------------|
| **App** | API + the built web app, one container, one origin | `Dockerfile` at the repo root |
| **Marketing site** | Static Next.js site | `site/` (Vercel, like mentis-company.com) |

The app container serves the API under `/api` and the web app for every other path,
so the refresh cookie is first-party and no cross-site CORS is needed. Native apps
(Capacitor) come later and will call the same API.

## Live preview (free tiers, set up 2026-10-31)

| What | Where |
|------|-------|
| App + API | https://kid-kapital-blush.vercel.app (Vercel project `kid-kapital`, Hobby) |
| Marketing site | https://kid-kapital-site.vercel.app (Vercel project `kid-kapital-site`, root `site/`) |
| Database | MongoDB Atlas project "Kid Kapital", free M0 cluster `kid-kapital` (AWS us-east-1), user `kk-app` with readWrite on `kid-kapital` only |

- **How it is built:** `vercel.json` runs `scripts/vercel-build.mjs`, which writes `.vercel/output`
  (Build Output API): hashed `/assets` on Vercel's CDN, every other path to ONE function
  running the Express app (`server/src/vercel.ts`), so pages keep `webAppHeaders` and the
  refresh cookie stays first-party. The build loads the bundled function from an empty
  folder, so a package left out of the bundle fails the build, not the live site.
- **Deploy:** `vercel deploy --prod` from the repo root (app); for the site, the same with
  `VERCEL_PROJECT_ID` set to the site project. Neither auto-deploys from git yet.
- **Environment (app, production):** `NODE_ENV=staging`, `PREVIEW_WITHOUT_EMAIL=true` (no mail
  domain yet: grown-ups start verified, no email is sent, so password reset and invite emails
  do not arrive), `JWT_SECRET`, `CRON_SECRET`, `MONGO_URL`, `CLIENT_ORIGINS` and `APP_URL`
  (both the app URL). Site: `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_SITE_URL`.
- **Growth job:** Vercel Cron calls `GET /api/cron/growth` daily at 07:00 UTC (Hobby allows
  daily); `runGrowth` catches up every week that is due.
- **Firewall (both projects):** Vercel Bot Protection (challenge) and AI bot blocking; app only:
  a 300 req/min per IP limit on `/api/`, and a bypass for `/api/cron/growth` so the cron is not
  challenged (the route still requires `CRON_SECRET`). Behind that, the app's own limits
  (Mongo-backed, shared by every instance), scanner bans and form guard.
- **Staying free:** Hobby has no card, so going over a limit pauses instead of billing. Atlas
  M0 is free but has NO backups: before real families, move to a paid tier with 30-day
  point-in-time restore (the Privacy Policy promises that window).
- **Going to production:** buy a domain, set `SMTP_URL`/`MAIL_FROM`, switch `NODE_ENV` to
  `production` and remove `PREVIEW_WITHOUT_EMAIL` (production refuses to boot with it).

## App service (Railway or any Docker host)

- **Build:** the root `Dockerfile` (build context = repo root, because `shared/` is
  imported by both server and client). It typechecks, builds the client, then runs
  the server with `tsx`, as Mentis does.
- **Healthcheck:** `/api/health/ready` (pings MongoDB). `/api/health` is liveness only.
- **Restart policy:** on failure. The server exits on an unexpected error and drains
  on SIGTERM (15s), so restarts and deploys never cut a request in half.
- **Replicas: 1** for now. Rate limits are kept in process memory, so more replicas
  would each allow the full budget. Move limits to a shared store before scaling out.
  The weekly growth job is idempotent, so a second replica would not pay twice.

### Environment

| Variable | Required | Notes |
|----------|----------|-------|
| `NODE_ENV` | yes | `production` (the Dockerfile sets it) or `staging`. Anything not `development`/`test`, including unset, is treated as hosted: secure cookies, HSTS, strong secrets required, dev routes off. |
| `MONGO_URL` | yes | MongoDB Atlas connection string. |
| `JWT_SECRET` | yes | 32+ random characters. Boot fails if weak. |
| `CLIENT_ORIGINS` | yes | The app's own origin, e.g. `https://app.kidkapital.app`. Never `*` (boot fails). |
| `APP_URL` | yes | Same origin; used in email links. |
| `PORT` | no | Defaults to 8787. |
| `SMTP_URL`, `MAIL_FROM` | yes | Grown-up emails (verify email, reset password, co-parent invites). A hosted server refuses to boot without `SMTP_URL`, since parents must confirm their email before adding kids. |
| `GOOGLE_CLIENT_ID`, `APPLE_SERVICES_ID`, `APPLE_WEB_REDIRECT_URI` | optional | Each sign-in button appears only once its ids are set. |
| `STRIPE_*`, `REVENUECAT_*` | optional | Kapital Plus. Without them every family is Free and billing answers 501. |
| `ENABLE_DEV_ENDPOINTS` | never in hosted envs | Dev quick-login; only mounts in `development`. |

## Database

- **MongoDB Atlas**, a dedicated cluster with **continuous backup / point-in-time
  restore kept 30 days**. The Privacy Policy promises deleted data leaves backups
  within 30 days, so keep the retention at 30 days or update the policy.
- Indexes build at boot (`server/src/index.ts`); the once-only money rules depend on
  the unique ones, so a failed index build stops the boot on purpose.
- Restrict network access to the app service. Use a database user with access to the
  one database only.

## Marketing site

- Vercel project with root directory `site/`. It is a static export with no secrets and no
  Next server at runtime, which is why its Next 14 advisories (server-side) do not apply;
  upgrade it to Next 15+ together with the client's move to React 19.
- Set the app URL env var it reads (see `site/README` or its `.env.example`) so the
  sign-up and sign-in buttons point at the app.

## Before the first real family

- [ ] Privacy Policy and Terms (`client/src/pages/legal.tsx`) reviewed by a lawyer.
      Kid Kapital is used by children under 13: COPPA applies (verifiable parental
      consent, direct notice to parents, data retention and security program), plus
      GDPR-K / the UK Children's Code if EU/UK families can sign up. Consider US-only
      at launch until that review is done.
- [ ] A real privacy inbox for `PRIVACY_CONTACT` in `shared/src/legal.ts`.
- [ ] SMTP configured and a test email received (verify, reset, invite).
- [ ] Atlas backups on with 30-day retention; one restore rehearsed.
- [ ] `npm run typecheck`, `npm test`, `npm run build`, `npm audit --omit=dev` all green (CI runs them).
- [ ] Error reporting: hook a server-only reporter into `errorHandler` with PII scrubbing.
      Keep third-party SDKs out of the client so kids' screens stay tracker-free.
