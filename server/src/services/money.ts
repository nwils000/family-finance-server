// The only module that changes a balance. Every movement writes a Txn row, and
// every debit is a conditional update, so a balance can never go negative even
// when two requests race.
import type { Types } from 'mongoose';
import { TRANSFER_KINDS, type AccountKind, type TxnKind } from '@kk/shared';
import { HttpError } from '../http.js';
import { Account, Txn, User } from '../models.js';


type Pot = 'wallet' | AccountKind;

interface Move {
  familyId: Types.ObjectId;
  kidId: Types.ObjectId;
  amountCents: number; // positive = in, negative = out
  kind: TxnKind;
  label: string;
  pot?: Pot;
}

const potFilter = (m: Move) =>
  m.pot && m.pot !== 'wallet'
    ? { model: Account, filter: { kidId: m.kidId, familyId: m.familyId, kind: m.pot } }
    : { model: User, filter: { _id: m.kidId, familyId: m.familyId, role: 'kid' } };

export const move = async (m: Move) => {
  const amount = Math.round(m.amountCents);
  if (amount === 0) return;
  const { model, filter } = potFilter(m);
  const guard = amount < 0 ? { balanceCents: { $gte: -amount } } : {};
  const updated = await (model as typeof User).findOneAndUpdate(
    { ...filter, ...guard },
    { $inc: { balanceCents: amount } },
    { new: true },
  );
  if (!updated) throw new HttpError(400, amount < 0 ? 'Not enough coins' : 'Account not found', 'INSUFFICIENT');
  await Txn.create({ ...m, amountCents: amount, pot: m.pot ?? 'wallet' });
};

/** Move coins between the wallet and a growth account, undoing the first leg if the second fails. */
/**
 * A transfer writes two rows: one leaving a pot (negative) and one arriving. The ledger
 * needs both; a feed shows a move once, so it skips the leaving leg with this filter.
 * Only transfer() writes TRANSFER_KINDS rows, which is what makes this exact.
 */
export const NOT_TRANSFER_OUT = { $nor: [{ kind: { $in: [...TRANSFER_KINDS] }, amountCents: { $lt: 0 } }] };

export const transfer = async (
  base: { familyId: Types.ObjectId; kidId: Types.ObjectId },
  from: Pot,
  to: Pot,
  amountCents: number,
  label: string,
) => {
  if (amountCents <= 0) throw new HttpError(400, 'Pick an amount');
  const kind: TxnKind = to === 'wallet' ? 'withdraw' : 'deposit';
  await move({ ...base, amountCents: -amountCents, kind, label, pot: from });
  try {
    await move({ ...base, amountCents, kind, label, pot: to });
  } catch (err) {
    await move({ ...base, amountCents, kind: 'refund', label: `${label} (undone)`, pot: from });
    throw err;
  }
};

export const ensureAccounts = (familyId: Types.ObjectId, kidId: Types.ObjectId) =>
  Promise.all(
    (['piggy', 'rocket'] as const).map((kind) =>
      Account.updateOne({ kidId, kind }, { $setOnInsert: { familyId, kidId, kind } }, { upsert: true }),
    ),
  );
