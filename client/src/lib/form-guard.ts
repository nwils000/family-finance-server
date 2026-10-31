// Form guard, client half (Mentis client/src/lib/formGuard.ts). Every public form
// (grown-up sign in, signup, join, forgot password, kid sign in) calls
// useFormGuard(surface), renders <Honeypot {...guard.honeypot} /> inside its form, and
// passes guard.body() to its endpoint function in lib/api.ts. The server half is
// server/src/bot-protection.ts formGuard; the names and floors are in @kk/shared.
//
// What is sent: how long the form was open, whether a real pointer, key or touch
// happened on the page, and the honeypot values (empty for a person). Nothing that
// identifies a person or a device.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FORM_SIGNALS_KEY, HONEYPOT_FIELDS, type FormGuardBody, type FormGuardSurface } from '@kk/shared';

const INTERACTIONS = ['pointerdown', 'keydown', 'touchstart'] as const;

export function useFormGuard(surface: FormGuardSurface) {
  const openedAt = useRef(Date.now());
  const interacted = useRef(false);
  const [values, setValues] = useState<Record<string, string>>({});

  // Listen on the whole page, not one form: kid sign-in moves through three screens
  // (code, avatar, PIN pad) before it submits, and any real input counts.
  useEffect(() => {
    const mark = (e: Event) => {
      if (e.isTrusted) interacted.current = true;
    };
    for (const type of INTERACTIONS) document.addEventListener(type, mark, { capture: true, passive: true });
    return () => {
      for (const type of INTERACTIONS) document.removeEventListener(type, mark, { capture: true });
    };
  }, []);

  /** The extra body for this form's request. Read at submit time. */
  const body = useCallback(
    (): FormGuardBody => ({
      ...values,
      [FORM_SIGNALS_KEY]: { surface, elapsedMs: Date.now() - openedAt.current, interacted: interacted.current },
    }),
    [surface, values],
  );

  const honeypot = useMemo(
    () => ({ fields: HONEYPOT_FIELDS, values, onChange: (field: string, value: string) => setValues((v) => ({ ...v, [field]: value })) }),
    [values],
  );

  return { honeypot, body };
}
