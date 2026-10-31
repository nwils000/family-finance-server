// The Vercel function: the same Express app as index.ts, without the long-lived parts.
// No listen (Vercel calls the handler), no interval job (Vercel Cron calls
// /api/cron/growth), no signal handlers. Built by scripts/vercel-build.mjs.
import type { IncomingMessage, ServerResponse } from 'http';
import { createApp } from './app.js';
import { connectDb } from './db.js';

const app = createApp();

export default async (req: IncomingMessage, res: ServerResponse) => {
  try {
    await connectDb();
  } catch (err) {
    console.error(JSON.stringify({ level: 'error', msg: 'database unreachable', error: (err as Error)?.message }));
    res.writeHead(503, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }).end(JSON.stringify({ error: 'Kid Kapital is waking up. Try again in a moment.' }));
    return;
  }
  app(req, res);
};
