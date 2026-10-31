import express from 'express';
import mongoose from 'mongoose';
import { config } from './config.js';
import { webApp } from './web-app.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { errorHandler, handle, notFound } from './http.js';
import { runScheduledJobs } from './services/jobs.js';
import { routes } from './routes.js';
import { accountRoutes, rawBodyRoutes } from './routes-account.js';
import { botProtection, watchFailedSignIns } from './bot-protection.js';
import { apiLimiter, corsOptions, csrfGuard, noStore, requireCron, requestId, requestLog, requestShapeGuard, securityHeaders, writeLimiter } from './security.js';

export const createApp = () => {
  const app = express();
  // One proxy hop (the load balancer), so req.ip and the rate limiters see the real client.
  app.set('trust proxy', 1);
  app.disable('x-powered-by');
  // Every response is no-store; an ETag would only let a 304 hint at unchanged private data.
  app.disable('etag');
  app.use(requestId, requestLog);
  // Before the pages and the API alike: a banned address is refused everywhere.
  app.use(botProtection);
  // Production serves the web app from this origin, with headers made for pages.
  if (config.serveClientDir) app.use(webApp(config.serveClientDir));
  app.use(securityHeaders, noStore);
  app.use(cors(corsOptions));
  // Before any route, raw-body webhooks included (they are exempt by path).
  app.use(csrfGuard);
  app.use('/api', apiLimiter, writeLimiter);
  // Before express.json(): the Stripe webhook needs the raw bytes for its signature.
  app.use('/api', rawBodyRoutes);
  app.use(express.json({ limit: '50kb' }));
  app.use(cookieParser());
  app.use(requestShapeGuard);

  // Liveness: the process is up. Readiness: it can also reach the database (deploy healthcheck).
  app.get('/api/health', (_req, res) => res.json({ ok: true }));
  app.get('/api/health/ready', async (_req, res) => {
    const ready = mongoose.connection.readyState === 1 && (await mongoose.connection.db?.admin().ping().then(() => true, () => false));
    res.status(ready ? 200 : 503).json({ ok: !!ready });
  });
  // On Vercel there is no long-lived process for startScheduledJobs, so Vercel Cron calls this
  // instead (the path keeps its old name: vercel-build.mjs and the firewall's cron bypass
  // point at it). Cron can only send GET; every scheduled job is idempotent (each growth
  // week is claimed once), so a repeat or a stray call does nothing twice. Only the cron
  // secret opens it.
  if (config.cronSecret) app.get('/api/cron/growth', requireCron, handle(async () => (await runScheduledJobs(), { ok: true })));
  app.use('/api', accountRoutes);
  app.use('/api', routes);

  app.use((_req, _res, next) => next(notFound()));
  app.use(watchFailedSignIns, errorHandler);
  return app;
};
