// Small building blocks shared by the grown-up pages. Each is a candidate for
// promotion into components/ui once a second role needs it.
import { useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { IconCheck, IconCopy, IconPlus } from '@/art';
import { Button, Card, Heading, Input, Text, useConfirm } from '@/components/ui';
import { endpoints } from '@/lib/api';
import { celebrate } from '@/lib/celebrate';
import { qk, useAction } from '@/lib/queries';
import { gentle } from '@/lib/motion';

/** The top of every grown-up page: a title, a friendly line, art and an optional action. */
export function PageIntro({ title, children, art, action }: { title: string; children?: ReactNode; art?: ReactNode; action?: ReactNode }) {
  return (
    // On phones the action drops to its own full-width row so the title and blurb keep the room.
    <div className="mb-5 flex flex-wrap items-center gap-3">
      {art && (
        <motion.span className="shrink-0" initial={{ scale: 0.6, rotate: -10, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} transition={gentle}>
          {art}
        </motion.span>
      )}
      <div className="min-w-0 flex-1">
        <Heading level={1} size="lg">
          {title}
        </Heading>
        {children && <Text size="sm">{children}</Text>}
      </div>
      {action && <div className="w-full shrink-0 sm:w-auto [&>button]:w-full sm:[&>button]:w-auto">{action}</div>}
    </div>
  );
}

/** Copy text to the clipboard with a little celebration; `copied` flips back after a moment. */
function useCopy() {
  const [copied, setCopied] = useState(false);
  const copy = async (text: string, el: HTMLElement) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      celebrate('save', el);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      celebrate('oops');
    }
  };
  return { copied, copy };
}

function CopyButton({ text }: { text: string }) {
  const { copied, copy } = useCopy();
  return (
    <Button variant={copied ? 'good' : 'secondary'} icon={copied ? <IconCheck size={20} /> : <IconCopy size={20} />} onClick={(e) => void copy(text, e.currentTarget)}>
      {copied ? 'Copied!' : 'Copy'}
    </Button>
  );
}

/** The kid sign-in code, a copy button, what it is for, and (in Settings) a way to change it. */
export function FamilyCodeCard({ code, canChange = false }: { code: string; canChange?: boolean }) {
  const confirm = useConfirm();
  const rotate = useAction(endpoints.rotateFamilyCode, { invalidate: [qk.home], success: 'New family code made' });
  const change = async () => {
    const ok = await confirm({
      title: 'Change the family code?',
      message: 'Kids who are signed in stay signed in. Next time they sign in, they will need the new code.',
      confirmText: 'Change it',
      mood: 'think',
    });
    if (ok) await rotate.run().catch(() => undefined);
  };
  return (
    <Card tone="coin" className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Text size="xs" tone="ink" bold className="font-display uppercase tracking-widest">
            Family code
          </Text>
          <Text as="span" tone="ink" bold className="font-display text-4xl tracking-[0.25em] tabular">
            {code}
          </Text>
        </div>
        <CopyButton text={code} />
      </div>
      <Text size="sm" tone="ink">
        Kids sign in with this code, then tap their face and type their 4-number PIN. The code is only for kids: a grown-up
        joins with an invite link from Settings.
      </Text>
      {canChange && (
        <Button variant="ghost" size="sm" busy={rotate.busy} className="self-start" onClick={() => void change()}>
          Change the code
        </Button>
      )}
    </Card>
  );
}

/** A single-use link for one more grown-up (7 days). The link is shown once; making another is always fine. */
export function InviteGrownUpCard() {
  const invite = useAction(endpoints.createInvite, { invalidate: [] });
  const [link, setLink] = useState<string | null>(null);
  const make = async () => {
    const res = await invite.run().catch(() => null);
    if (res) setLink(res.url);
  };
  return (
    <Card className="flex flex-col gap-3">
      <Text size="sm">
        Send another grown-up (a partner, a grandparent) a link to join the family. Each link works for one person, once,
        for 7 days.
      </Text>
      {link ? (
        <div className="flex items-center gap-2">
          <div className="min-w-0 flex-1">
            <Input readOnly value={link} aria-label="Invite link" onFocus={(e) => e.currentTarget.select()} />
          </div>
          <CopyButton text={link} />
        </div>
      ) : null}
      <Button variant={link ? 'ghost' : 'primary'} block busy={invite.busy} icon={<IconPlus size={20} />} onClick={() => void make()}>
        {link ? 'Make another link' : 'Make an invite link'}
      </Button>
    </Card>
  );
}

/**
 * Which sheet is open, plus the thing it is about. Closing keeps the target so
 * the sheet still has content while it animates away.
 */
export function useSheet<K extends string, T>() {
  const [open, setOpen] = useState<K | null>(null);
  const [target, setTarget] = useState<T | null>(null);
  return {
    open,
    target,
    show: (kind: K, t: T | null = null) => {
      setTarget(t);
      setOpen(kind);
    },
    close: () => setOpen(null),
  };
}
