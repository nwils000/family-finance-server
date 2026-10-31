// Grown-up account pages and the account card in Settings: forgot password,
// reset password and email confirmation (from emailed links), change password,
// sign out everywhere, and the "confirm your email" banner.
import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { LEGAL_PATHS, PASSWORD_HINT, passwordProblem } from '@kk/shared';
import { IconCheck, IconDownload, IconKey, IconLogout, IconMail, IconTrash } from '@/art';
import { Button, Card, Field, Heading, Honeypot, Input, PennySays, Pill, Sheet, Spinner, Text, useConfirm } from '@/components/ui';
import { endpoints, errorMessage } from '@/lib/api';
import { celebrate } from '@/lib/celebrate';
import { saveJsonFile } from '@/lib/download';
import { useFormGuard } from '@/lib/form-guard';
import { useHome } from '@/lib/queries';
import { clearFragment, readFragment } from '@/lib/link';
import { useAuth } from '@/stores/auth';
import { AuthFrame } from './auth';

/** A new-password box that shows the shared rule it breaks (the server checks the same list). */
function NewPasswordField({ value, onChange, label = 'New password' }: { value: string; onChange: (v: string) => void; label?: string }) {
  const problem = value ? passwordProblem(value) : null;
  return (
    <Field label={label} hint={problem ?? PASSWORD_HINT}>
      {(id) => (
        <Input
          id={id}
          type="password"
          leading={<IconKey size={20} className="text-ink-faint" />}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete="new-password"
          required
        />
      )}
    </Field>
  );
}

/* ---------- Forgot password ---------- */

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const guard = useFormGuard('passwordReset');

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await endpoints.forgotPassword(email, guard.body());
      setSent(true);
      celebrate('done');
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthFrame back>
      {sent ? (
        <PennySays mood="cheer">
          If {email} has a Kid Kapital account, a reset link is on its way. It works once, for one hour. Check your spam folder too!
        </PennySays>
      ) : (
        <>
          <PennySays mood="think">Forgot your password? It happens! Pop in your email and we will send a reset link.</PennySays>
          <Card pad="lg">
            <form onSubmit={submit} className="flex flex-col gap-4">
              <Heading size="md">Reset password</Heading>
              <Honeypot {...guard.honeypot} />
              <Field label="Email">
                {(id) => (
                  <Input id={id} type="email" leading={<IconMail size={20} className="text-ink-faint" />} value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
                )}
              </Field>
              {error && <Text tone="bad" size="sm">{error}</Text>}
              <Button type="submit" size="lg" block busy={busy}>
                Send reset link
              </Button>
            </form>
          </Card>
        </>
      )}
      <Link to="/login" className="self-center">
        <Text tone="brand" bold size="sm">Back to sign in</Text>
      </Link>
    </AuthFrame>
  );
}

/* ---------- Reset password (from the email link) ---------- */

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [token] = useState(() => readFragment('token'));
  const [valid, setValid] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Drop the secret from the address bar and history right away.
    clearFragment();
    if (!token) return setValid(false);
    endpoints.checkResetToken(token).then((r) => setValid(r.valid), () => setValid(false));
  }, [token]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const problem = passwordProblem(password);
    if (problem) return setError(problem);
    setBusy(true);
    setError('');
    try {
      await endpoints.resetPassword(token, password);
      celebrate('done');
      toast.success('Password changed. Sign in with your new one!');
      navigate('/login', { replace: true });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthFrame>
      {valid === null && <Spinner className="mx-auto" />}
      {valid === false && (
        <>
          <PennySays mood="sad">That reset link has expired or was already used. Ask for a fresh one!</PennySays>
          <Button size="lg" block onClick={() => navigate('/forgot-password', { replace: true })}>
            Send a new link
          </Button>
        </>
      )}
      {valid && (
        <Card pad="lg">
          <form onSubmit={submit} className="flex flex-col gap-4">
            <Heading size="md">Pick a new password</Heading>
            <NewPasswordField value={password} onChange={setPassword} />
            {error && <Text tone="bad" size="sm" className="kk-shake">{error}</Text>}
            <Button type="submit" size="lg" block busy={busy}>
              Save password
            </Button>
            <Text size="xs" tone="faint" className="text-center">
              Every device signed in to this account will be signed out.
            </Text>
          </form>
        </Card>
      )}
    </AuthFrame>
  );
}

/* ---------- Confirm email (from the emailed link) ---------- */

/** Works signed out too: the link may open on a different device than the one that signed up. */
export function VerifyEmailPage() {
  const navigate = useNavigate();
  const user = useAuth((s) => s.user);
  const reloadUser = useAuth((s) => s.reloadUser);
  const [token] = useState(() => readFragment('token'));
  const [state, setState] = useState<'checking' | 'done' | 'failed'>('checking');

  useEffect(() => {
    clearFragment();
    if (!token) return setState('failed');
    endpoints.verifyEmail(token).then(
      () => {
        setState('done');
        celebrate('done');
        void reloadUser().catch(() => undefined);
      },
      () => setState('failed'),
    );
  }, [token, reloadUser]);

  const next = () => navigate(user ? (user.role === 'kid' ? '/kid' : '/parent') : '/login', { replace: true });
  return (
    <AuthFrame>
      {state === 'checking' && <Spinner className="mx-auto" />}
      {state === 'done' && (
        <>
          <PennySays mood="cheer">Your email is confirmed. You can add your kids now!</PennySays>
          <Button size="lg" block onClick={next}>
            {user ? 'Back to the app' : 'Sign in'}
          </Button>
        </>
      )}
      {state === 'failed' && (
        <>
          <PennySays mood="sad">That link has expired or was already used. Sign in and send a fresh one from Settings.</PennySays>
          <Button size="lg" block onClick={next}>
            {user ? 'Back to the app' : 'Sign in'}
          </Button>
        </>
      )}
    </AuthFrame>
  );
}

/** One resend button, shared by the banner and the account card. */
function useResendVerification() {
  const [busy, setBusy] = useState(false);
  const reloadUser = useAuth((s) => s.reloadUser);
  const resend = async () => {
    setBusy(true);
    try {
      const res = await endpoints.resendVerification();
      if (res.alreadyVerified) await reloadUser();
      else toast.success('Sent! Check your inbox (and spam folder).');
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };
  return { resend, busy };
}

/** Shown to a grown-up until their email is confirmed: adding kids waits for it. */
export function VerifyEmailBanner() {
  const user = useAuth((s) => s.user);
  const { resend, busy } = useResendVerification();
  if (!user || user.role !== 'parent' || user.emailVerified) return null;
  return (
    <Card tone="coin" pad="sm" className="mb-4 flex flex-wrap items-center gap-3">
      <IconMail size={28} className="shrink-0 text-ink" />
      <Text size="sm" tone="ink" className="min-w-0 flex-1">
        Confirm your email to add kids and invite grown-ups. We sent a link to <Text as="span" size="sm" tone="ink" bold>{user.email}</Text>.
      </Text>
      <Button size="sm" variant="secondary" busy={busy} onClick={() => void resend()} className="w-full sm:w-auto">
        Send it again
      </Button>
    </Card>
  );
}

/* ---------- Settings: account card ---------- */

function ChangePasswordSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const signIn = useAuth((s) => s.signIn);
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const problem = passwordProblem(next);
    if (problem) return setError(problem);
    setBusy(true);
    setError('');
    try {
      // The server signs out every other device and hands this one a fresh session.
      await signIn(endpoints.changePassword({ currentPassword: current, newPassword: next }));
      celebrate('save');
      toast.success('Password changed');
      setCurrent('');
      setNext('');
      onClose();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Sheet open={open} onClose={onClose} title="Change password">
      <form onSubmit={submit} className="flex flex-col gap-4">
        <Field label="Current password">
          {(id) => <Input id={id} type="password" value={current} onChange={(e) => setCurrent(e.target.value)} autoComplete="current-password" required />}
        </Field>
        <NewPasswordField value={next} onChange={setNext} />
        {error && <Text tone="bad" size="sm">{error}</Text>}
        <Button type="submit" block busy={busy}>
          Change password
        </Button>
      </form>
    </Sheet>
  );
}

export function AccountSecurityCard() {
  const user = useAuth((s) => s.user);
  const signIn = useAuth((s) => s.signIn);
  const confirm = useConfirm();
  const [changing, setChanging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [linkBusy, setLinkBusy] = useState(false);
  const verification = useResendVerification();

  /** A Google or Apple account sets its first password through the emailed reset link, which proves the mailbox. */
  const sendPasswordLink = async () => {
    if (!user?.email) return;
    setLinkBusy(true);
    try {
      await endpoints.forgotPassword(user.email);
      toast.success(`We emailed ${user.email} a link to set a password.`);
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setLinkBusy(false);
    }
  };

  const signOutEverywhere = async () => {
    const ok = await confirm({
      title: 'Sign out everywhere else?',
      message: 'Every other phone, tablet and computer signed in to your account will need to sign in again. This one stays signed in.',
      confirmText: 'Sign them out',
      mood: 'think',
    });
    if (!ok) return;
    setBusy(true);
    try {
      await signIn(endpoints.logoutAll());
      toast.success('Signed out of your other devices');
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card className="flex flex-col gap-3">
      {user?.email && (
        <div className="flex flex-wrap items-center gap-2">
          <IconMail size={20} className="text-ink-faint" />
          <Text tone="ink" bold className="min-w-0 flex-1 truncate">
            {user.email}
          </Text>
          {user.emailVerified ? (
            <Pill tone="good" icon={<IconCheck size={14} />}>Confirmed</Pill>
          ) : (
            <Button size="sm" variant="ghost" busy={verification.busy} onClick={() => void verification.resend()}>
              Confirm email
            </Button>
          )}
        </div>
      )}
      {user?.hasPassword ? (
        <Button variant="secondary" block icon={<IconKey size={20} />} onClick={() => setChanging(true)}>
          Change password
        </Button>
      ) : (
        <Button variant="secondary" block busy={linkBusy} icon={<IconKey size={20} />} onClick={() => void sendPasswordLink()}>
          Email me a link to set a password
        </Button>
      )}
      <Button variant="ghost" block busy={busy} icon={<IconLogout size={20} />} onClick={() => void signOutEverywhere()}>
        Sign out of other devices
      </Button>
      <ChangePasswordSheet open={changing} onClose={() => setChanging(false)} />
    </Card>
  );
}

/**
 * A grown-up's rights over the family's data: download all of it, read the policies,
 * or delete their account. The last grown-up deletes the whole family, which the
 * warning says plainly. Deleting asks for the password again.
 */
export function YourDataCard() {
  const navigate = useNavigate();
  const user = useAuth((s) => s.user);
  const signOut = useAuth((s) => s.signOut);
  const { data: home } = useHome();
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const lastGrownUp = (home?.parents.length ?? 1) <= 1;
  const familyName = home?.family.name ?? 'your family';

  const download = async () => {
    setExporting(true);
    try {
      saveJsonFile(`kid-kapital-${new Date().toISOString().slice(0, 10)}.json`, await endpoints.exportData());
      celebrate('save');
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setExporting(false);
    }
  };

  const remove = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await endpoints.deleteAccount(password);
      // The delete call already ended the session and cleared the cookie on the server;
      // this only tidies up here, so a hiccup now must not read as a failed deletion.
      await signOut().catch(() => undefined);
      toast.success(lastGrownUp ? 'Your family has been deleted.' : 'Your account has been deleted.');
      navigate('/', { replace: true });
    } catch (err) {
      setError(errorMessage(err));
      celebrate('oops');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card className="flex flex-col gap-3">
      <Text size="sm">Download everything Kid Kapital stores about your family, any time. Nothing about your family is ever sold or used for ads.</Text>
      <Button variant="secondary" block icon={<IconDownload size={20} />} busy={exporting} onClick={() => void download()}>
        Download our data
      </Button>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
        <Link to={LEGAL_PATHS.privacy}>
          <Text as="span" tone="brand" bold size="sm">
            Privacy Policy
          </Text>
        </Link>
        <Link to={LEGAL_PATHS.terms}>
          <Text as="span" tone="brand" bold size="sm">
            Terms of Use
          </Text>
        </Link>
      </div>
      <Button variant="ghost" block icon={<IconTrash size={20} />} onClick={() => setDeleting(true)}>
        {lastGrownUp ? 'Delete our family' : 'Delete my account'}
      </Button>
      <Sheet open={deleting} onClose={() => setDeleting(false)} title={lastGrownUp ? 'Delete the whole family?' : 'Delete your account?'}>
        <form onSubmit={remove} className="flex flex-col gap-4">
          <PennySays mood="sleepy" size={56}>
            {lastGrownUp
              ? `You are the only grown-up in ${familyName}, so this deletes the whole family: every kid, their coins, quests, lessons and history. It cannot be undone.`
              : `This deletes your grown-up account. ${familyName} and the kids stay, with the other grown-ups in charge.`}
          </PennySays>
          {lastGrownUp && <Text size="sm">Want a copy first? Download your data before you go.</Text>}
          {user?.hasPassword === false ? (
            <Text size="sm">
              This account signs in with Google or Apple. To confirm it is really you, set a password with the "Forgot password" link first, then come back.
            </Text>
          ) : (
            <Field label="Type your password to confirm">
              {(id) => <Input id={id} type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />}
            </Field>
          )}
          {error && (
            <Text tone="bad" size="sm" className="kk-shake">
              {error}
            </Text>
          )}
          <Button type="submit" variant="danger" size="lg" block busy={busy} disabled={user?.hasPassword === false || !password}>
            {lastGrownUp ? 'Delete the family forever' : 'Delete my account'}
          </Button>
        </form>
      </Sheet>
    </Card>
  );
}
