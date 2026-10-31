// The creator's corner in grown-up Settings: a tip link and a contact form. Grown-ups only
// (imported by ParentSettings alone; guards.test.ts keeps it off kid screens) and web only:
// app stores forbid outside payment links, so a native build renders nothing.
// The link, the EmailJS settings and the spam rules live in @kk/shared creator.ts.
import { useRef, useState, type FormEvent } from 'react';
import { CONTACT_RULES, CREATOR_SITE, OPERATOR_NAME, PRIVACY_CONTACT, SUPPORT_URL, checkContactSubmission, type ContactFields } from '@kk/shared';
import { Heart, IconMail, Penny } from '@/art';
import { Button, Card, Field, Honeypot, Input, PennySays, Sheet, Text, TextArea } from '@/components/ui';
import { sendContactMessage } from '@/lib/api';
import { prefs } from '@/lib/prefs';
import { isNative } from '@/lib/secure-storage';
import { useAuth } from '@/stores/auth';

function SupportCard() {
  if (!SUPPORT_URL) return null;
  return (
    <Card tone="coin" className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <Heart size={44} />
        <Text tone="ink" bold className="font-display">
          Support {OPERATOR_NAME}, the creator
        </Text>
      </div>
      <Text size="sm">Kid Kapital is free. If it helps your family, you can leave a tip to support its development.</Text>
      <Button block onClick={() => window.open(SUPPORT_URL, '_blank', 'noopener')}>
        Leave a tip
      </Button>
      <a href={CREATOR_SITE} target="_blank" rel="noopener" className="text-center text-sm font-bold text-brand underline">
        More about {OPERATOR_NAME}
      </a>
    </Card>
  );
}

const EMPTY: ContactFields = { user_name: '', user_email: '', message: '' };
type Status = { state: 'idle' | 'sending' | 'sent' | 'error'; text: string };

function ContactSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const user = useAuth((s) => s.user);
  const openedAt = useRef(Date.now());
  const [fields, setFields] = useState<ContactFields>(() => ({ ...EMPTY, user_name: user?.name ?? '', user_email: user?.email ?? '' }));
  const [trap, setTrap] = useState('');
  const [status, setStatus] = useState<Status>({ state: 'idle', text: '' });
  const set = (k: keyof ContactFields) => (v: string) => setFields((f) => ({ ...f, [k]: v }));
  const showSent = () => setStatus({ state: 'sent', text: `Thanks! Your message is on its way to ${OPERATOR_NAME}.` });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status.state === 'sending') return;
    const verdict = checkContactSubmission({ fields, trap, openedAt: openedAt.current, now: Date.now(), sent: prefs.contactSent() });
    if (!verdict.ok) {
      if (verdict.silent) showSent();
      else setStatus({ state: 'error', text: verdict.text });
      return;
    }
    setStatus({ state: 'sending', text: '' });
    try {
      await sendContactMessage({ user_name: fields.user_name.trim(), user_email: fields.user_email.trim(), message: fields.message.trim() });
      prefs.recordContactSent(Date.now());
      showSent();
    } catch {
      setStatus({ state: 'error', text: `That did not send. You can email ${PRIVACY_CONTACT} directly.` });
    }
  };

  return (
    <Sheet open={open} onClose={onClose} title={`Message ${OPERATOR_NAME}`}>
      {status.state === 'sent' ? (
        <div className="flex flex-col gap-4">
          <PennySays mood="cheer">{status.text}</PennySays>
          <Button block onClick={onClose}>
            Done
          </Button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="relative flex flex-col gap-4" noValidate>
          <Honeypot fields={[CONTACT_RULES.trapField]} values={{ [CONTACT_RULES.trapField]: trap }} onChange={(_, v) => setTrap(v)} />
          <Field label="Your name">
            {(id) => <Input id={id} value={fields.user_name} maxLength={CONTACT_RULES.limits.user_name} required onChange={(e) => set('user_name')(e.target.value)} />}
          </Field>
          <Field label="Your email">
            {(id) => <Input id={id} type="email" value={fields.user_email} maxLength={CONTACT_RULES.limits.user_email} required onChange={(e) => set('user_email')(e.target.value)} />}
          </Field>
          <Field label="Message" hint="Questions, ideas, or something that is not working.">
            {(id) => <TextArea id={id} value={fields.message} maxLength={CONTACT_RULES.limits.message} required onChange={(e) => set('message')(e.target.value)} />}
          </Field>
          {status.state === 'error' && (
            <Text size="sm" tone="ink" role="alert">
              {status.text}
            </Text>
          )}
          <Button type="submit" block disabled={status.state === 'sending'}>
            {status.state === 'sending' ? 'Sending...' : 'Send message'}
          </Button>
        </form>
      )}
    </Sheet>
  );
}

function ContactCard() {
  const [open, setOpen] = useState(false);
  // A fresh sheet each time, so the 3-second fill floor counts from when it opened.
  const [key, setKey] = useState(0);
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <Penny size={44} />
        <Text tone="ink" bold className="font-display">
          Questions or ideas?
        </Text>
      </div>
      <Text size="sm">Write to {OPERATOR_NAME}, who makes Kid Kapital. Your message goes straight to a real inbox.</Text>
      <Button
        variant="secondary"
        block
        icon={<IconMail size={20} />}
        onClick={() => {
          setKey((k) => k + 1);
          setOpen(true);
        }}
      >
        Send a message
      </Button>
      <ContactSheet key={key} open={open} onClose={() => setOpen(false)} />
    </Card>
  );
}

/** The whole corner. Nothing in native builds. */
export function CreatorCorner() {
  if (isNative()) return null;
  return (
    <div className="flex flex-col gap-4">
      <SupportCard />
      <ContactCard />
    </div>
  );
}
