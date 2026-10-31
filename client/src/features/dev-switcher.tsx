// Dev build only: a floating button to jump straight into any account of the seeded
// demo family (npm run seed), like Mentis's debug quick login. App.tsx loads this
// lazily behind import.meta.env.DEV, so production bundles never contain it, and the
// server only mounts the endpoints outside production.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { IconSwap } from '@/art';
import { Button, KidAvatar, Pill, Sheet, Spinner, Text } from '@/components/ui';
import { devEndpoints, errorMessage } from '@/lib/api';
import { queryClient } from '@/lib/queries';
import { useAuth, useSignOut } from '@/stores/auth';

export default function DevSwitcher() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user, signIn } = useAuth();
  const signOut = useSignOut();
  const accounts = useQuery({ queryKey: ['dev-accounts'], queryFn: () => devEndpoints!.accounts(), enabled: open, retry: false });

  const go = async (id: string) => {
    setBusy(id);
    try {
      // Drop the previous account's cached data before switching.
      queryClient.clear();
      const signedIn = await signIn(devEndpoints!.login(id));
      setOpen(false);
      navigate(signedIn.role === 'kid' ? '/kid' : '/parent');
    } finally {
      setBusy(null);
    }
  };

  return (
    <>
      <div className="fixed bottom-28 left-3 z-40 md:bottom-4">
        <Button size="sm" variant="secondary" icon={<IconSwap size={16} />} onClick={() => setOpen(true)} aria-label="Dev account switcher">
          Dev
        </Button>
      </div>
      <Sheet open={open} onClose={() => setOpen(false)} title="Jump into a test account">
        <div className="flex flex-col gap-3">
          <Text size="sm">The seeded demo family. No password or PIN needed. Dev only.</Text>
          {accounts.isLoading && <Spinner className="mx-auto" />}
          {accounts.isError && (
            <Text tone="bad" size="sm">
              {errorMessage(accounts.error)}
            </Text>
          )}
          {accounts.data?.accounts.map((a) => (
            <Button
              key={a.id}
              block
              variant={user?.id === a.id ? 'primary' : 'secondary'}
              busy={busy === a.id}
              icon={<KidAvatar avatar={a.avatar} hat={a.hat} size={30} />}
              className="justify-start"
              onClick={() => void go(a.id)}
            >
              <span className="flex-1 text-left">{a.name}</span>
              <Pill tone={a.role === 'parent' ? 'brand' : 'coin'}>{a.role === 'parent' ? 'Grown-up' : 'Kid'}</Pill>
            </Button>
          ))}
          {user && (
            <Button
              variant="ghost"
              onClick={() => {
                setOpen(false);
                queryClient.clear();
                void signOut().then((done) => done && navigate('/'));
              }}
            >
              Sign out
            </Button>
          )}
        </div>
      </Sheet>
    </>
  );
}
