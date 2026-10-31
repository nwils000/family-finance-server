// Weekly growth for the piggy (steady interest) and the rocket (random swing).
// Safe to run any number of times: each account claims its period with a
// conditional update on lastGrowthAt before any coins move.
import { GROWTH_PERIOD_DAYS } from '@kk/shared';
import { Account, Family } from '../models.js';
import { move } from './money.js';

const PERIOD_MS = GROWTH_PERIOD_DAYS * 86_400_000;

const pctFor = (kind: string, f: InstanceType<typeof Family>, random: () => number) =>
  kind === 'piggy' ? f.piggyRatePct : f.rocketMinPct + random() * (f.rocketMaxPct - f.rocketMinPct);

export const runGrowth = async (now = new Date(), random = Math.random) => {
  const due = await Account.find({ lastGrowthAt: { $lte: new Date(now.getTime() - PERIOD_MS) } });
  const families = new Map<string, InstanceType<typeof Family>>();
  for (const account of due) {
    const key = String(account.familyId);
    if (!families.has(key)) {
      const f = await Family.findById(account.familyId);
      if (!f) continue;
      families.set(key, f);
    }
    const family = families.get(key)!;
    let periodStart = account.lastGrowthAt!;
    while (periodStart.getTime() + PERIOD_MS <= now.getTime()) {
      const next = new Date(periodStart.getTime() + PERIOD_MS);
      const pct = Math.round(pctFor(account.kind, family, random) * 10) / 10;
      const claimed = await Account.findOneAndUpdate(
        { _id: account._id, lastGrowthAt: periodStart },
        { lastGrowthAt: next, lastGrowthPct: pct },
        { new: true },
      );
      if (!claimed) break; // another worker took this period
      // Losses are capped at the balance by move()'s guard via Math.max below.
      const amount = Math.max(Math.round((claimed.balanceCents * pct) / 100), -claimed.balanceCents);
      if (amount !== 0) {
        const label = account.kind === 'piggy' ? `Piggy interest +${pct}%` : `Rocket ${pct >= 0 ? 'zoomed' : 'dipped'} ${pct}%`;
        await move({ familyId: account.familyId, kidId: account.kidId, amountCents: amount, kind: 'growth', label, pot: account.kind as 'piggy' | 'rocket' });
      }
      periodStart = next;
    }
  }
};

export const startGrowthJob = () => {
  const tick = () => runGrowth().catch((err) => console.error('growth job failed', err));
  tick();
  return setInterval(tick, 60 * 60_000);
};
