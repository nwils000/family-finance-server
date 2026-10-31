// Token storage, ported from Mentis. The one place credentials are kept.
//
// Web: the access token lives only in memory (the auth store) and the refresh
// token is an httpOnly cookie the server sets, so script can never read it.
// Native: the refresh token goes in the iOS Keychain / Android Keystore, with a
// Preferences fallback when the secure store is unavailable.
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { NativeBiometric } from 'capacitor-native-biometric';

const SERVER = 'app.kidkapital.refresh';
const FALLBACK_KEY = 'kk_refresh_fallback';

export const isNative = () => Capacitor.isNativePlatform();

export const secureStorage = {
  async setRefreshToken(token: string) {
    if (!isNative()) return;
    try {
      await NativeBiometric.setCredentials({ username: 'refresh', password: token, server: SERVER });
      await Preferences.remove({ key: FALLBACK_KEY });
    } catch {
      await Preferences.set({ key: FALLBACK_KEY, value: token });
    }
  },

  async getRefreshToken(): Promise<string | null> {
    if (!isNative()) return null;
    try {
      const creds = await NativeBiometric.getCredentials({ server: SERVER });
      if (creds?.password) return creds.password;
    } catch {
      // Nothing in the secure store; try the fallback below.
    }
    return (await Preferences.get({ key: FALLBACK_KEY })).value;
  },

  async clear() {
    if (!isNative()) return;
    await NativeBiometric.deleteCredentials({ server: SERVER }).catch(() => undefined);
    await Preferences.remove({ key: FALLBACK_KEY });
  },
};
