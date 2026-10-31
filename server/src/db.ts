// Connecting to MongoDB, shared by the long-running server (index.ts) and the Vercel
// function (vercel.ts), so both build the same indexes before taking traffic.
import mongoose from 'mongoose';
import { config } from './config.js';
import './models.js';
import './models-account.js';

let connecting: Promise<void> | undefined;

/** Connects once per process; later calls wait on the same promise. A failed attempt is retried by the next call. */
export const connectDb = () =>
  (connecting ??= (async () => {
    await mongoose.connect(config.mongoUrl, {
      // Fail fast at boot and per query instead of hanging when the database is unreachable.
      serverSelectionTimeoutMS: 10_000,
      socketTimeoutMS: 45_000,
      maxPoolSize: config.serverless ? 5 : 20,
    });
    // Money and once-only rules lean on unique indexes (quest runs, chests, lesson progress,
    // webhook ids). Build them before taking traffic, so a missing index fails loudly.
    await Promise.all(Object.values(mongoose.models).map((m) => m.init()));
  })().catch((err) => {
    connecting = undefined;
    throw err;
  }));
