// Who may touch what. Every service scopes its queries through these helpers, so
// no code path can reach another family's data or let a kid act for a sibling.
import { Types, type Model } from 'mongoose';
import type { AuthedUser } from '../auth.js';
import { HttpError, notFound } from '../http.js';
import type { Feature } from '@kk/shared';
import { Family, User } from '../models.js';

export type Actor = AuthedUser;

export const familyOf = (actor: Actor) => new Types.ObjectId(actor.familyId);

/** A kid always acts on themself; a parent names a kid, who must be in their family. */
export const resolveKid = async (actor: Actor, kidId?: string) => {
  const id = actor.role === 'kid' ? actor.userId : kidId;
  if (!id || !Types.ObjectId.isValid(id)) throw new HttpError(400, 'Pick a kid');
  const kid = await User.findOne({ _id: id, familyId: familyOf(actor), role: 'kid' });
  if (!kid) throw notFound('Kid not found');
  return kid;
};

/** Grown-ups can switch whole features off; the server refuses them, not just the UI. */
export const assertFeature = async (actor: Actor, feature: Feature) => {
  const family = await Family.findById(familyOf(actor)).select('features');
  if (!family?.features?.[feature]) throw new HttpError(403, 'That is switched off in your family', 'FEATURE_OFF');
};

/** Filter for "this family's rows, and only this kid's rows when a kid is asking". */
export const visibleTo = (actor: Actor, extra: Record<string, unknown> = {}) => ({
  familyId: familyOf(actor),
  ...(actor.role === 'kid' ? { kidId: new Types.ObjectId(actor.userId) } : {}),
  ...extra,
});

/* eslint-disable @typescript-eslint/no-explicit-any */
/** Update one of this family's documents, or 404. */
export const updateScoped = async <T>(model: Model<T>, actor: Actor, id: string, update: object, what: string) => {
  const doc = await (model as Model<any>).findOneAndUpdate({ _id: id, familyId: familyOf(actor) }, update, {
    new: true,
    runValidators: true,
  });
  if (!doc) throw notFound(`${what} not found`);
  return doc as InstanceType<Model<T>>;
};

/**
 * Move a document from one status to the next exactly once. The status is part
 * of the filter, so a second tap, a second tab or a race finds nothing and 404s
 * instead of acting twice. Every approve/reject/fulfill/decline goes through here.
 */
export const transition = async <T>(model: Model<T>, actor: Actor, id: string, from: string, to: string, what: string) => {
  const doc = await (model as Model<any>).findOneAndUpdate(
    { _id: id, familyId: familyOf(actor), status: from },
    { status: to },
    { new: true },
  );
  if (!doc) throw notFound(what);
  return doc as InstanceType<Model<T>>;
};
