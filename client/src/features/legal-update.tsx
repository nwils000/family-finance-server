// The re-accept sheet. When the Terms or Privacy Policy change (@kk/shared LEGAL_VERSIONS), the
// server answers a grown-up's calls with 428 LEGAL_UPDATE until they agree (server auth.ts
// requireAuth); lib/api.ts opens this, and agreeing hands back a fresh session. Mounted once in App.
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { LEGAL_PATHS } from '@kk/shared';
import { Button, Checkbox, PennySays, Sheet } from '@/components/ui';
import { endpoints, errorMessage, setOnLegalUpdate } from '@/lib/api';
import { useAuth } from '@/stores/auth';

export function LegalUpdateHost() {
  const [open, setOpen] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const signIn = useAuth((s) => s.signIn);
  const client = useQueryClient();

  useEffect(() => {
    setOnLegalUpdate(() => setOpen(true));
    return () => setOnLegalUpdate(() => undefined);
  }, []);

  const accept = async () => {
    setBusy(true);
    setError('');
    try {
      await signIn(endpoints.acceptLegal());
      setOpen(false);
      await client.invalidateQueries();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  // Not dismissible: nothing else works until the grown-up agrees (or signs out from the page behind).
  return (
    <Sheet open={open} onClose={() => undefined} title="We updated our Terms and Privacy Policy">
      <div className="flex flex-col gap-4">
        <PennySays mood="think">Please read what changed, then agree to keep using Kid Kapital. Your kids can sign in again once you do.</PennySays>
        <Checkbox checked={agreed} onChange={setAgreed}>
          I am 18 or older and a parent or legal guardian, and I agree to the updated{' '}
          <Link to={LEGAL_PATHS.terms} className="font-bold text-brand underline" onClick={() => setOpen(false)}>
            Terms
          </Link>{' '}
          and{' '}
          <Link to={LEGAL_PATHS.privacy} className="font-bold text-brand underline" onClick={() => setOpen(false)}>
            Privacy Policy
          </Link>
          .
        </Checkbox>
        {error && <PennySays mood="sad">{error}</PennySays>}
        <Button size="lg" block disabled={!agreed || busy} onClick={() => void accept()}>
          {busy ? 'Saving...' : 'Agree and continue'}
        </Button>
      </div>
    </Sheet>
  );
}
