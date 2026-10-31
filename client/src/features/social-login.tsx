// "Continue with Google / Apple" for grown-ups. Renders nothing unless the server
// reports the provider as configured (GET /auth/providers). The browser gets an
// ID token from the provider and the server verifies it (services/social.ts);
// the client never decides who someone is.
//
// Web only for now: the native apps need the Google and Apple Capacitor plugins
// before these can show there (see CLAUDE.md, Accounts).
import { useEffect, useRef, useState } from 'react';
import { Button, Text } from '@/components/ui';
import { endpoints, errorMessage } from '@/lib/api';
import { cn } from '@/lib/cn';
import { celebrate } from '@/lib/celebrate';
import { useSocialProviders } from '@/lib/queries';
import { isNative } from '@/lib/secure-storage';
import type { SocialExtras } from '@/lib/types';
import { useAuth } from '@/stores/auth';

interface GoogleId {
  accounts: {
    id: {
      initialize: (o: { client_id: string; callback: (r: { credential: string }) => void; ux_mode?: 'popup' }) => void;
      renderButton: (el: HTMLElement, o: Record<string, unknown>) => void;
    };
  };
}
interface AppleIdAuth {
  auth: {
    init: (o: { clientId: string; scope: string; redirectURI: string; usePopup: boolean; nonce: string }) => void;
    signIn: () => Promise<{ authorization: { id_token: string }; user?: { name?: { firstName?: string } } }>;
  };
}
declare global {
  interface Window {
    google?: GoogleId;
    AppleID?: AppleIdAuth;
  }
}

const GOOGLE_SDK = 'https://accounts.google.com/gsi/client';
const APPLE_SDK = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';

const scripts = new Map<string, Promise<void>>();
const loadScript = (src: string) => {
  if (!scripts.has(src)) {
    scripts.set(
      src,
      new Promise<void>((resolve, reject) => {
        const el = document.createElement('script');
        el.src = src;
        el.async = true;
        el.onload = () => resolve();
        el.onerror = () => {
          scripts.delete(src);
          reject(new Error('Could not load sign-in'));
        };
        document.head.appendChild(el);
      }),
    );
  }
  return scripts.get(src)!;
};

const sha256Hex = async (s: string) =>
  [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)))].map((b) => b.toString(16).padStart(2, '0')).join('');

/** Google requires its own branded button, so it is drawn by Google's script into this box. */
function GoogleButton({ clientId, extras, onError }: { clientId: string; extras: SocialExtras; onError: (m: string) => void }) {
  const box = useRef<HTMLDivElement>(null);
  const signIn = useAuth((s) => s.signIn);
  const extrasRef = useRef(extras);
  extrasRef.current = extras;

  useEffect(() => {
    let live = true;
    loadScript(GOOGLE_SDK)
      .then(() => {
        if (!live || !box.current || !window.google) return;
        window.google.accounts.id.initialize({
          client_id: clientId,
          ux_mode: 'popup',
          callback: ({ credential }) =>
            void signIn(endpoints.googleSignIn({ idToken: credential, ...extrasRef.current }))
              .then(() => celebrate('done'))
              .catch((err) => onError(errorMessage(err))),
        });
        window.google.accounts.id.renderButton(box.current, { theme: 'outline', size: 'large', shape: 'pill', text: 'continue_with', width: 320 });
      })
      .catch((err: Error) => onError(err.message));
    return () => {
      live = false;
    };
  }, [clientId, signIn, onError]);

  return <div ref={box} className="flex min-h-[44px] justify-center" />;
}

function AppleButton({ clientId, redirectUri, extras, onError }: { clientId: string; redirectUri: string; extras: SocialExtras; onError: (m: string) => void }) {
  const signIn = useAuth((s) => s.signIn);
  const [busy, setBusy] = useState(false);
  const go = async () => {
    setBusy(true);
    try {
      await loadScript(APPLE_SDK);
      const { nonce } = await endpoints.appleNonce();
      // Apple puts what we pass into the token; the server checks it is SHA-256 of a nonce it issued.
      window.AppleID!.auth.init({ clientId, scope: 'name email', redirectURI: redirectUri, usePopup: true, nonce: await sha256Hex(nonce) });
      const res = await window.AppleID!.auth.signIn();
      await signIn(endpoints.appleSignIn({ identityToken: res.authorization.id_token, nonce, name: res.user?.name?.firstName, ...extras }));
      celebrate('done');
    } catch (err) {
      // Closing Apple's popup is not an error worth showing.
      if ((err as { error?: string })?.error !== 'popup_closed_by_user') onError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };
  return (
    <Button variant="secondary" block busy={busy} onClick={() => void go()}>
      Continue with Apple
    </Button>
  );
}

/** Both buttons plus an "or" divider. Nothing at all when no provider is set up. */
export function SocialLogin({ extras = {}, className }: { extras?: SocialExtras; className?: string }) {
  const { data } = useSocialProviders();
  const [error, setError] = useState('');
  if (isNative() || !data || (!data.google && !data.apple)) return null;
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div className="flex items-center gap-3">
        <span className="h-0.5 flex-1 rounded bg-line" />
        <Text size="sm" tone="faint">
          or
        </Text>
        <span className="h-0.5 flex-1 rounded bg-line" />
      </div>
      {data.google && <GoogleButton clientId={data.google.clientId} extras={extras} onError={setError} />}
      {data.apple && <AppleButton clientId={data.apple.clientId} redirectUri={data.apple.redirectUri} extras={extras} onError={setError} />}
      {error && (
        <Text tone="bad" size="sm" className="kk-shake text-center">
          {error}
        </Text>
      )}
    </div>
  );
}
