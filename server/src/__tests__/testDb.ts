import { afterAll, beforeAll, beforeEach } from 'vitest';
import mongoose from 'mongoose';

/**
 * Every test run gets its own database (file name + process id), so two runs at
 * once (two terminals, an agent and a human, CI shards) never drop each other's data.
 */
export const testDbUrl = (name: string) => `mongodb://127.0.0.1:27017/kk-test-${name}-${process.pid}`;

/**
 * Mark a grown-up's email as verified, for tests whose subject is not verification
 * itself (adding kids needs it). account.test.ts covers the real emailed-link flow.
 */
export const markVerified = async (email: string) => {
  const { User } = await import('../models.js');
  await User.updateOne({ email }, { $set: { emailVerifiedAt: new Date() } });
};

/**
 * The one test-database setup every API test file uses. Indexes are built ONCE per file
 * (rebuilding ~25 models' indexes before every test timed hooks out on a busy machine);
 * between tests only the documents are cleared, so unique and TTL indexes stay in force.
 */
export const useTestDb = (name: string) => {
  beforeAll(async () => {
    await mongoose.connect(testDbUrl(name));
    await mongoose.connection.dropDatabase();
    await Promise.all(Object.values(mongoose.models).map((m) => m.syncIndexes()));
    // Once per file, and every file builds its indexes at the same moment in a full run,
    // so this one hook gets room; per-test hooks keep the normal 30s limit.
  }, 120_000);
  beforeEach(async () => {
    const collections = await mongoose.connection.db!.collections();
    await Promise.all(collections.map((c) => c.deleteMany({})));
  });
  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });
};
