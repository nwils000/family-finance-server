import { defineConfig } from 'vitest/config';

// API tests hash passwords and PINs with real bcrypt costs, which is slow on a busy
// machine; a generous timeout keeps them from failing on speed rather than behavior.
export default defineConfig({
  test: { testTimeout: 30_000, hookTimeout: 30_000 },
});
