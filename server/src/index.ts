import mongoose from 'mongoose';
import { config } from './config.js';
import { createApp } from './app.js';
import { startGrowthJob } from './services/growth.js';

// A crash we did not see coming is logged as one line and the process exits, so the host
// restarts a clean process instead of one in an unknown state.
const fatal = (kind: string) => (err: unknown) => {
  console.error(JSON.stringify({ level: 'fatal', msg: kind, error: (err as Error)?.message, stack: (err as Error)?.stack }));
  process.exit(1);
};
process.on('uncaughtException', fatal('uncaughtException'));
process.on('unhandledRejection', fatal('unhandledRejection'));

await mongoose.connect(config.mongoUrl, {
  // Fail fast at boot and per query instead of hanging when the database is unreachable.
  serverSelectionTimeoutMS: 10_000,
  socketTimeoutMS: 45_000,
  maxPoolSize: 20,
});
// Money and once-only rules lean on unique indexes (quest runs, chests, lesson progress,
// webhook ids). Build them before taking traffic, so a missing index fails the boot loudly.
await Promise.all(Object.values(mongoose.models).map((m) => m.init()));

const growth = startGrowthJob();
const server = createApp().listen(config.port, () => console.log(`Kid Kapital API on http://localhost:${config.port}`));

// Deploys send SIGTERM: stop taking requests, let in-flight ones finish, then close the database.
let stopping = false;
const shutdown = (signal: string) => {
  if (stopping) return;
  stopping = true;
  console.log(JSON.stringify({ level: 'info', msg: 'shutting down', signal }));
  clearInterval(growth);
  const force = setTimeout(() => process.exit(1), 15_000);
  force.unref();
  server.close(async () => {
    await mongoose.disconnect();
    process.exit(0);
  });
};
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
