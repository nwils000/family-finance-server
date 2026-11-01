import { create } from 'zustand';
import toast from 'react-hot-toast';
import { acceptSession, endpoints, errorStatus, refreshSession, setAccessToken, setOnSessionLost } from '@/lib/api';
import { secureStorage } from '@/lib/secure-storage';
import type { Session, User } from '@/lib/types';

interface AuthState {
  status: 'loading' | 'in' | 'out';
  user: User | null;
  /** Restore a session from the refresh cookie (web) or the Keychain (native). */
  init: () => Promise<void>;
  /** Finish any login: pass the promise from an auth endpoint. */
  signIn: (session: Promise<Session>) => Promise<User>;
  /**
   * End the session on the server, then here. Throws if the server could not be told:
   * the refresh cookie is httpOnly, so only the server can end it, and clearing the
   * screen anyway would leave a shared computer quietly signed in. Use useSignOut().
   */
  signOut: () => Promise<void>;
  /** Re-read the signed-in user (after confirming an email, say). A no-op when signed out. */
  reloadUser: () => Promise<void>;
}

export const useAuth = create<AuthState>((set, get) => {
  const clear = () => {
    setAccessToken(null);
    set({ status: 'out', user: null });
  };
  setOnSessionLost(clear);

  return {
    status: 'loading',
    user: null,
    init: async () => {
      try {
        const session = await refreshSession();
        set({ status: 'in', user: session.user });
      } catch {
        clear();
      }
    },
    signIn: async (pending) => {
      const session = await acceptSession(await pending);
      set({ status: 'in', user: session.user });
      return session.user;
    },
    reloadUser: async () => {
      if (get().status !== 'in') return;
      const { user } = await endpoints.me();
      set({ user });
    },
    signOut: async () => {
      // A 401 means the session was already over, which is what we wanted.
      await endpoints.logout().catch((err) => {
        if (errorStatus(err) !== 401) throw err;
      });
      await secureStorage.clear();
      clear();
    },
  };
});

/** Sign out from a button: says so plainly when the server could not be reached, and stays signed in. */
export const useSignOut = () => {
  const signOut = useAuth((s) => s.signOut);
  return () =>
    signOut().then(
      () => true,
      () => {
        toast.error('Could not sign out. Check your connection and try again.');
        return false;
      },
    );
};
