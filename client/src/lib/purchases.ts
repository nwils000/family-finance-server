// Native in-app purchases through RevenueCat, the one owner of the native store.
// Ported from Mentis client/src/services/revenueCatService.ts. Web never touches
// this: it buys through Stripe Checkout (features/billing.tsx).
//
// The RevenueCat app user id is the FAMILY id, because one Kapital Plus
// subscription covers the whole family. The server learns about a purchase from
// the RevenueCat webhook, and /billing/sync re-reads RevenueCat right after a
// purchase so the app does not wait for it. The client never tells the server what
// it bought.
import { Capacitor } from '@capacitor/core';
import { PLUS_ENTITLEMENT } from '@kk/shared';
import { endpoints } from './api';

const KEYS = {
  ios: import.meta.env.VITE_REVENUECAT_IOS_KEY as string | undefined,
  android: import.meta.env.VITE_REVENUECAT_ANDROID_KEY as string | undefined,
};

const platform = () => Capacitor.getPlatform() as 'ios' | 'android' | 'web';
const loadSdk = () => import('@revenuecat/purchases-capacitor').then((m) => m.Purchases);

/** A platform key with the wrong prefix makes every purchase fail in confusing ways (Mentis SC-7). */
const keyFor = () => {
  const p = platform();
  if (p === 'ios' && KEYS.ios?.startsWith('appl_')) return KEYS.ios;
  if (p === 'android' && KEYS.android?.startsWith('goog_')) return KEYS.android;
  return null;
};

let configuredFor: string | null = null;

export const purchases = {
  /** True on a phone build that has a RevenueCat key. */
  available: () => Capacitor.isNativePlatform() && !!keyFor(),

  async init(familyId: string) {
    const apiKey = keyFor();
    if (!apiKey || configuredFor === familyId) return;
    const sdk = await loadSdk();
    if (configuredFor) await sdk.logIn({ appUserID: familyId });
    else await sdk.configure({ apiKey, appUserID: familyId });
    configuredFor = familyId;
  },

  /** Buy the current offering's first package (Kapital Plus), then have the server re-read RevenueCat. */
  async buyPlus(familyId: string) {
    await this.init(familyId);
    const sdk = await loadSdk();
    const offerings = await sdk.getOfferings();
    const pkg = offerings.current?.availablePackages[0];
    if (!pkg) throw new Error('Kapital Plus is not available in the store right now.');
    try {
      const result = await sdk.purchasePackage({ aPackage: pkg });
      if (!result.customerInfo.entitlements.active[PLUS_ENTITLEMENT]) return false;
    } catch (err) {
      if ((err as { userCancelled?: boolean }).userCancelled) return false;
      throw err;
    }
    await endpoints.syncPurchases().catch(() => undefined);
    return true;
  },

  async restore(familyId: string) {
    await this.init(familyId);
    await (await loadSdk()).restorePurchases();
    return endpoints.syncPurchases();
  },

  /** Where a store subscription is managed (Mentis getManagementURL). */
  manageUrl: () =>
    platform() === 'ios' ? 'https://apps.apple.com/account/subscriptions' : 'https://play.google.com/store/account/subscriptions',

  /** Always forget the family on sign-out, even if the SDK call fails, so the next family never inherits it. */
  async logOut() {
    try {
      if (configuredFor) await (await loadSdk()).logOut();
    } catch {
      // Nothing to undo; local state resets below.
    } finally {
      configuredFor = null;
    }
  },
};
