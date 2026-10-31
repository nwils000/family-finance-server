# Deploying Kid Kapital (web)

Kid Kapital ships as two pieces:

| Piece | What | Where it builds |
|-------|------|-----------------|
| **App** | API + the built web app, one container, one origin | `Dockerfile` at the repo root |
| **Marketing site** | Static Next.js site | `site/` (Vercel, like mentis-company.com) |

The app container serves the API under `/api` and the web app for every other path,
so the refresh cookie is first-party and no cross-site CORS is needed. Native apps
(Capacitor) come later and will call the same API.

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
