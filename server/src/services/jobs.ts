// The one owner of scheduled work (weekly growth, idle-family and old-history retention). A long-running server ticks it hourly (index.ts); on
// Vercel, Vercel Cron calls it daily through the cron door (app.ts). Every job here must be
// idempotent and catch up on its own, because either runner may call it late or twice.
import { runGrowth } from './growth.js';
import { eraseInactiveFamilies, eraseOldActivity } from './personal-data.js';

export const runScheduledJobs = async (now = new Date()) => {
  // Each job runs even if the other fails; a failure is logged and the next tick retries.
  const results = await Promise.allSettled([runGrowth(now), eraseInactiveFamilies(now), eraseOldActivity(now)]);
  for (const r of results) if (r.status === 'rejected') console.error(JSON.stringify({ level: 'error', msg: 'scheduled job failed', err: String(r.reason) }));
};

export const startScheduledJobs = () => {
  const tick = () => void runScheduledJobs();
  tick();
  return setInterval(tick, 60 * 60_000);
};
