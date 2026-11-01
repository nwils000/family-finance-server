// Sign-in screens. Grown-ups use email + password; kids use the family code,
// tap their avatar, then type their PIN. A second grown-up joins only through an
// invite link another grown-up made in Settings (/join#invite=...), never the code.
import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LEGAL_PATHS, PASSWORD_HINT, PIN_LENGTH } from '@kk/shared';
import { PrivacyLink } from '@/features/privacy-link';
import { Avatar, Cloud, Coin, HillsBand, IconBack, IconKey, IconMail, Penny, SceneFamily, SceneWelcome, Sparkle, Sun } from '@/art';
import { Button, Card, Checkbox, Field, Heading, Honeypot, Input, PennySays, PinPad, Spinner, Text } from '@/components/ui';
import { SocialLogin } from '@/features/social-login';
import { endpoints, errorMessage, errorStatus } from '@/lib/api';
import { celebrate } from '@/lib/celebrate';
import { useFormGuard } from '@/lib/form-guard';
import { clearFragment, readFragment } from '@/lib/link';
import { popIn, stagger } from '@/lib/motion';
import { prefs } from '@/lib/prefs';
import type { KidRef } from '@/lib/types';
import { useAuth } from '@/stores/auth';

/** Shared frame: sky, sun, a drifting cloud kept clear of the headings, hills along the bottom. */
export function AuthFrame({ children, back }: { children: ReactNode; back?: boolean }) {
  const navigate = useNavigate();
  return (
    <div className="relative flex min-h-full flex-col items-center overflow-hidden px-4 pb-40 pt-safe">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-brand-light via-bg to-bg" />
      <Sun size={110} className="pointer-events-none absolute -right-6 top-6 opacity-90" />
      <motion.span className="pointer-events-none absolute -left-6 top-20" animate={{ x: [0, 20, 0] }} transition={{ repeat: Infinity, duration: 18, ease: 'easeInOut' }}>
        <Cloud size={90} />
      </motion.span>
      <HillsBand height={144} className="pointer-events-none absolute inset-x-0 bottom-0 -z-0" />
      <div className="relative z-10 flex w-full max-w-sm flex-col gap-5 pt-6">
        {back && (
          <Button variant="ghost" size="sm" icon={<IconBack size={20} />} className="self-start" onClick={() => navigate(-1)}>
            Back
          </Button>
        )}
        {children}
        <PrivacyLink />
      </div>
    </div>
  );
}

const useSignedInRedirect = () => {
  const user = useAuth((s) => s.user);
  return user ? <Navigate to={user.role === 'kid' ? '/kid' : '/parent'} replace /> : null;
};

/* ---------- Welcome ---------- */

export function WelcomePage() {
  const navigate = useNavigate();
  const redirect = useSignedInRedirect();
  if (redirect) return redirect;
  return (
    <AuthFrame>
      <motion.div variants={stagger} initial="hidden" animate="show" className="flex flex-col items-center gap-5 text-center">
        <motion.div variants={popIn} className="relative">
          <SceneWelcome size={260} />
          {[0, 1, 2].map((i) => (
            <motion.span key={i} className="absolute" style={{ left: `${[8, 82, 70][i]}%`, top: `${[10, 18, 70][i]}%` }} animate={{ y: [0, -10, 0], rotate: [0, 12, 0] }} transition={{ repeat: Infinity, duration: 2.4, delay: i * 0.5 }}>
              {i === 1 ? <Sparkle size={26} /> : <Coin size={30} />}
            </motion.span>
          ))}
        </motion.div>
        <motion.div variants={popIn}>
          <Heading level={1} size="xl" className="tracking-tight">
            Kid <span className="text-brand">Kapital</span>
          </Heading>
          <Text size="lg" className="mt-1">
            Do quests. Earn coins. Grow your treasure!
          </Text>
        </motion.div>
        <motion.div variants={popIn} className="flex w-full flex-col gap-3">
          <Button variant="coin" size="lg" block icon={<Coin size={28} />} onClick={() => navigate('/kid-login')}>
            I'm a kid!
          </Button>
          <Button variant="primary" size="lg" block onClick={() => navigate('/login')}>
            I'm a grown-up
          </Button>
          <Button variant="ghost" block onClick={() => navigate('/signup')}>
            New here? Start a family
          </Button>
        </motion.div>
      </motion.div>
    </AuthFrame>
  );
}

/* ---------- Grown-up forms (one component for login, signup and join) ---------- */

type Mode = 'login' | 'signup' | 'join';

const COPY: Record<Mode, { title: string; cta: string; penny: string }> = {
  login: { title: 'Welcome back!', cta: 'Sign in', penny: 'Grown-ups sign in here to set quests and approve rewards.' },
  signup: { title: 'Start your family', cta: 'Create family', penny: "Let's set up your family hub. You'll add kids next!" },
  join: { title: 'Join your family', cta: 'Join family', penny: 'Another grown-up invited you. Make your account below.' },
};

/** The invite from the link: checked once, then wiped from the address bar. null while checking. */
const useInvite = (enabled: boolean) => {
  const [invite] = useState(() => (enabled ? readFragment('invite') : ''));
  const [familyName, setFamilyName] = useState<string | null | false>(enabled ? null : false);
  useEffect(() => {
    if (!enabled) return;
    clearFragment();
    if (!invite) return setFamilyName(false);
    endpoints.checkInvite(invite).then((r) => setFamilyName(r.valid ? r.familyName : false), () => setFamilyName(false));
  }, [enabled, invite]);
  return { invite, familyName };
};

export function GrownUpPage({ mode }: { mode: Mode }) {
  const signIn = useAuth((s) => s.signIn);
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', familyName: '' });
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const { invite, familyName: invitedTo } = useInvite(mode === 'join');
  const guard = useFormGuard(mode);
  const redirect = useSignedInRedirect();
  if (redirect) return redirect;

  if (mode === 'join' && !invitedTo) {
    return (
      <AuthFrame back>
        {invitedTo === null ? (
          <Spinner className="mx-auto" />
        ) : (
          <>
            {/* No invite at all (a footer link, a typed URL) is not a broken one: say how joining works. */}
            <PennySays mood={invite ? 'sad' : 'happy'}>
              {invite
                ? 'That invite link has expired or was already used. Ask the grown-up who sent it to make a fresh one in Settings.'
                : 'To join a family, open the invite link another grown-up made for you in Settings. Kids sign in with the family code instead.'}
            </PennySays>
            <Button size="lg" block onClick={() => navigate('/login', { replace: true })}>
              I already have an account
            </Button>
            <Button variant="ghost" block onClick={() => navigate('/signup', { replace: true })}>
              Start a new family instead
            </Button>
          </>
        )}
      </AuthFrame>
    );
  }

  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (mode !== 'login' && !agreed) {
      setError('Please tick the box to agree first.');
      celebrate('oops');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const request =
        mode === 'login'
          ? endpoints.login({ email: form.email, password: form.password }, guard.body())
          : mode === 'signup'
            ? endpoints.signup({ name: form.name, email: form.email, password: form.password, familyName: form.familyName, acceptLegal: agreed }, guard.body())
            : endpoints.join({ name: form.name, email: form.email, password: form.password, invite, acceptLegal: agreed }, guard.body());
      await signIn(request);
      celebrate('done');
    } catch (err) {
      setError(errorMessage(err));
      celebrate('oops');
    } finally {
      setBusy(false);
    }
  };
  const copy = COPY[mode];

  return (
    <AuthFrame back>
      <PennySays mood={mode === 'login' ? 'happy' : 'cheer'}>{mode === 'join' && invitedTo ? `You are invited to join ${invitedTo}! Make your grown-up account below.` : copy.penny}</PennySays>
      <Card pad="lg" className="kk-pop">
        <form onSubmit={submit} className="flex flex-col gap-4">
          <Heading size="md">{copy.title}</Heading>
          <Honeypot {...guard.honeypot} />
          {mode !== 'login' && (
            <Field label="Your name">{(id) => <Input id={id} value={form.name} onChange={set('name')} placeholder="Sam" autoComplete="given-name" required />}</Field>
          )}
          {mode === 'signup' && (
            <Field label="Family name">{(id) => <Input id={id} value={form.familyName} onChange={set('familyName')} placeholder="Team Awesome" required />}</Field>
          )}
          <Field label="Email">{(id) => <Input id={id} type="email" leading={<IconMail size={20} className="text-ink-faint" />} value={form.email} onChange={set('email')} autoComplete="email" required />}</Field>
          <Field label="Password" hint={mode === 'login' ? undefined : PASSWORD_HINT}>
            {(id) => (
              <Input id={id} type="password" leading={<IconKey size={20} className="text-ink-faint" />} value={form.password} onChange={set('password')} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} required />
            )}
          </Field>
          {mode !== 'login' && (
            // Direct notice to the parent before any account (and later, any kid data) exists.
            <Checkbox checked={agreed} onChange={setAgreed}>
              I am 18 or older and a parent or legal guardian, and I agree to the{' '}
              <Link to={LEGAL_PATHS.terms} className="font-bold text-brand underline">
                Terms
              </Link>{' '}
              and{' '}
              <Link to={LEGAL_PATHS.privacy} className="font-bold text-brand underline">
                Privacy Policy
              </Link>
              , including how Kid Kapital handles my kids' information.
            </Checkbox>
          )}
          {error && (
            <Text tone="bad" size="sm" className="kk-shake">
              {error}
            </Text>
          )}
          <Button type="submit" size="lg" block busy={busy}>
            {copy.cta}
          </Button>
        </form>
        <SocialLogin
          className="mt-4"
          extras={mode === 'signup' ? { familyName: form.familyName.trim() || undefined, acceptLegal: agreed } : mode === 'join' ? { invite, acceptLegal: agreed } : {}}
        />
      </Card>
      <div className="flex flex-col items-center gap-1">
        {mode === 'login' && <Link to="/forgot-password"><Text tone="brand" bold size="sm">Forgot your password?</Text></Link>}
        {mode !== 'login' && <Link to="/login"><Text tone="brand" bold size="sm">Already have an account? Sign in</Text></Link>}
        {mode !== 'signup' && <Link to="/signup"><Text tone="brand" bold size="sm">Start a new family</Text></Link>}
      </div>
    </AuthFrame>
  );
}

/* ---------- Kid login: code -> who are you -> PIN ---------- */

export function KidLoginPage() {
  const signIn = useAuth((s) => s.signIn);
  const [code, setCode] = useState(prefs.familyCode());
  const [family, setFamily] = useState<{ kids: KidRef[] } | null>(null);
  const [kid, setKid] = useState<KidRef | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [shake, setShake] = useState(0);
  const guard = useFormGuard('kidLogin');
  const redirect = useSignedInRedirect();
  if (redirect) return redirect;

  const findFamily = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const found = await endpoints.familyPreview(code.trim().toUpperCase());
      prefs.setFamilyCode(code.trim().toUpperCase());
      setFamily(found);
      celebrate('tap');
    } catch (err) {
      // A remembered code whose family is gone should not greet the next kid.
      if (errorStatus(err) === 404) prefs.setFamilyCode(null);
      setError(errorMessage(err));
      celebrate('oops');
    } finally {
      setBusy(false);
    }
  };

  const tryPin = async (pin: string) => {
    if (!kid) return;
    setBusy(true);
    setError('');
    try {
      await signIn(endpoints.kidLogin({ code: code.trim().toUpperCase(), kidId: kid.id, pin }, guard.body()));
      celebrate('coins');
    } catch (err) {
      setError(errorMessage(err));
      setShake((s) => s + 1);
      celebrate('oops');
    } finally {
      setBusy(false);
    }
  };

  if (kid) {
    return (
      <AuthFrame>
        <Button variant="ghost" size="sm" icon={<IconBack size={20} />} className="self-start" onClick={() => setKid(null)}>
          Not me
        </Button>
        <div className="flex flex-col items-center gap-2 text-center">
          <motion.span initial={{ scale: 0.5, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} className="kk-bob">
            <Avatar id={kid.avatar} size={110} ring />
          </motion.span>
          <Heading size="md">Hi {kid.name}!</Heading>
          <Text>Type your secret {PIN_LENGTH}-number PIN</Text>
        </div>
        <PinPad onComplete={tryPin} shake={shake} busy={busy} />
        {busy && <Spinner className="mx-auto" />}
        {error && <Text tone="bad" bold className="text-center">{error}</Text>}
      </AuthFrame>
    );
  }

  if (family) {
    return (
      <AuthFrame>
        <Button variant="ghost" size="sm" icon={<IconBack size={20} />} className="self-start" onClick={() => setFamily(null)}>
          Different family
        </Button>
        <div className="text-center">
          <Heading size="lg">Who are you?</Heading>
        </div>
        {family.kids.length === 0 ? (
          <PennySays mood="think">No kids here yet! Ask a grown-up to add you in the Family tab.</PennySays>
        ) : (
          <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-2 gap-4">
            {family.kids.map((k) => (
              <motion.div key={k.id} variants={popIn}>
                <Card pad="sm" className="press cursor-pointer" onClick={() => { celebrate('tap'); setKid(k); }} role="button" tabIndex={0} aria-label={k.name}>
                  <div className="flex flex-col items-center gap-2 py-2">
                    <Avatar id={k.avatar} size={84} />
                    <Text tone="ink" bold className="font-display text-lg">
                      {k.name}
                    </Text>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AuthFrame>
    );
  }

  return (
    <AuthFrame back>
      <div className="flex justify-center">
        <SceneFamily size={200} />
      </div>
      <PennySays mood="cheer">What's your family code? A grown-up can find it in Settings.</PennySays>
      <Card pad="lg">
        <form onSubmit={findFamily} className="flex flex-col gap-4">
          <Honeypot {...guard.honeypot} />
          <Field label="Family code">
            {(id) => (
              <Input
                id={id}
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="ABC123"
                maxLength={6}
                autoCapitalize="characters"
                autoComplete="off"
                className="text-center font-display text-2xl tracking-[0.35em]"
                required
              />
            )}
          </Field>
          {error && <Text tone="bad" size="sm" className="kk-shake">{error}</Text>}
          <Button type="submit" variant="coin" size="lg" block busy={busy} icon={<Penny size={30} mood="wow" />}>
            Let's go!
          </Button>
        </form>
      </Card>
    </AuthFrame>
  );
}
