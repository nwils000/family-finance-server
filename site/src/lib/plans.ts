import { PAID_PLANS, PLAN_LIMITS } from '@kk/shared';

/**
 * What the site says about price, from the one switch the app and server obey
 * (@kk/shared PAID_PLANS). Server components only: importing @kk/shared into the
 * client nav would pull the lesson library into the browser bundle.
 */
export { PAID_PLANS };

const freeKids = PLAN_LIMITS.free.limits.kids;

/** The hero's price promise. */
export const FREE_LINE = PAID_PLANS && freeKids !== null ? `Free for up to ${freeKids} kids` : 'Free for every family';
