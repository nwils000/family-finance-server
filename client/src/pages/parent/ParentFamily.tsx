// Family: every kid with their progress and pots, plus adding, editing,
// gifting and removing kids, the grown-ups list, and the family code.
import { useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { AGE_BAND_NAMES, ageBand, AVATARS, EFFORT_BOOST, KID_AGE, PIN_LENGTH, type AvatarId } from '@kk/shared';
import {
  IconMail,
  Avatar,
  BADGES,
  IconCheck,
  IconLearn,
  IconEdit,
  IconHistory,
  IconPlus,
  IconTrash,
  PiggyBank,
  Rocket,
  SceneFamily,
  Trophy,
  Wallet,
} from '@/art';
import {
  Button,
  Card,
  ChoiceGrid,
  EmptyState,
  Field,
  Input,
  KidAvatar,
  LevelProgress,
  Money,
  AmountPicker,
  PennySays,
  Pill,
  PinPad,
  SectionTitle,
  Sheet,
  Spinner,
  Stepper,
  StreakFlame,
  Text,
  Toggle,
  useConfirm,
} from '@/components/ui';
import { ActivityList } from '@/features/cards';
import { endpoints } from '@/lib/api';
import { celebrate } from '@/lib/celebrate';
import { popIn, stagger } from '@/lib/motion';
import { useAction, useActivity, useHome } from '@/lib/queries';
import type { Kid } from '@/lib/types';
import { FamilyCodeCard, PageIntro, useSheet } from './parts';

/* ---------- PIN: typed twice on the big pad ---------- */

/** Asks for a PIN, then asks again to be sure. Calls onDone with a matching PIN. */
function PinSetter({ onDone }: { onDone: (pin: string) => void }) {
  const [first, setFirst] = useState<string | null>(null);
  const [shake, setShake] = useState(0);
  return (
    <div className="flex flex-col items-center gap-3">
      <Text tone="ink" bold>
        {first ? 'One more time to be sure' : `Pick a ${PIN_LENGTH}-number PIN`}
      </Text>
      <PinPad
        key={first ? 'again' : 'first'}
        shake={shake}
        onComplete={(pin) => {
          if (!first) return setFirst(pin);
          if (pin === first) return onDone(pin);
          celebrate('oops');
          setFirst(null);
          setShake((n) => n + 1);
        }}
      />
      {shake > 0 && !first && (
        <Text size="sm" tone="bad">
          Those did not match. Let us start over.
        </Text>
      )}
    </div>
  );
}

/* ---------- One form for adding and editing a kid ---------- */

interface KidDraft {
  name: string;
  avatar: AvatarId;
  pin: string;
  /** Picks which version of each money lesson the kid sees. Null means not set. */
  age: number | null;
  /** Edit only: the kid's own coins per star (null = family default) and team effort boost. */
  starValueCents?: number | null;
  effortBoost?: number;
  trusted?: boolean;
}

function KidForm({ kid, busy, onSubmit }: { kid?: Kid; busy: boolean; onSubmit: (d: KidDraft) => void }) {
  const familyStar = useHome().data?.family.starValueCents ?? 25;
  const [ownStar, setOwnStar] = useState(kid?.starValueCents != null);
  const [star, setStar] = useState(kid?.starValueCents ?? familyStar);
  const [boost, setBoost] = useState(kid?.effortBoost ?? EFFORT_BOOST.default);
  const [trusted, setTrusted] = useState(kid?.trusted ?? false);
  const [age, setAge] = useState<number | null>(kid?.age ?? null);
  const [name, setName] = useState(kid?.name ?? '');
  const [avatar, setAvatar] = useState<AvatarId>(kid?.avatar ?? 'fox');
  const [pin, setPin] = useState('');
  // A new kid needs a PIN; an existing kid keeps theirs unless the grown-up changes it.
  const [pinOpen, setPinOpen] = useState(!kid);
  const ready = name.trim().length > 0 && (kid ? true : pin.length === PIN_LENGTH);

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        if (ready) onSubmit({ name: name.trim(), avatar, pin, age, ...(kid ? { starValueCents: ownStar ? star : null, effortBoost: boost, trusted } : {}) });
      }}
    >
      <div className="flex justify-center">
        <motion.span key={avatar} initial={{ scale: 0.7, rotate: -10 }} animate={{ scale: 1, rotate: 0 }}>
          <KidAvatar avatar={avatar} hat={kid?.hat} size={96} ring />
        </motion.span>
      </div>
      <Field label="Name">
        {(id) => <Input id={id} value={name} onChange={(e) => setName(e.target.value)} placeholder="Maya" maxLength={40} autoComplete="off" />}
      </Field>
      <Card tone="brand" sticker={false} pad="sm" className="flex flex-col gap-2">
        {age === null ? (
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <Text tone="ink" size="sm" bold>
                Age
              </Text>
              <Text size="xs">Money lessons are written for each age. Set it so they get the right ones.</Text>
            </div>
            <Button size="sm" variant="secondary" onClick={() => setAge(8)}>
              Set age
            </Button>
          </div>
        ) : (
          <>
            <Stepper label="Age" value={age} onChange={setAge} min={KID_AGE.min} max={KID_AGE.max} format={(v) => `${v}`} />
            <Text size="xs">
              {AGE_BAND_NAMES[ageBand(age)]} lessons. If you also give a real allowance, a common rule of thumb is about one dollar a week per year of age, paid by you outside the app; pick what fits your family.
            </Text>
          </>
        )}
      </Card>
      <div className="flex flex-col gap-2">
        <Text tone="ink" size="sm" bold className="font-display tracking-wide">
          Pick a buddy
        </Text>
        <ChoiceGrid
          columns={5}
          value={avatar}
          onChange={setAvatar}
          options={AVATARS.map((a) => ({ value: a, label: a, art: <Avatar id={a} size={52} /> }))}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Text tone="ink" size="sm" bold className="font-display tracking-wide">
          Secret PIN
        </Text>
        {pin ? (
          <div className="flex items-center justify-between gap-3">
            <Pill tone="good" icon={<IconCheck size={14} />}>
              New PIN is set
            </Pill>
            <Button size="sm" variant="ghost" onClick={() => setPin('')}>
              Change it
            </Button>
          </div>
        ) : pinOpen ? (
          <PinSetter onDone={setPin} />
        ) : (
          <div className="flex items-center justify-between gap-3">
            <Text size="sm">Keeps the same PIN.</Text>
            <Button size="sm" variant="secondary" onClick={() => setPinOpen(true)}>
              Set a new PIN
            </Button>
          </div>
        )}
      </div>
      {kid && (
        <Card tone="soft" sticker={false} className="flex flex-col gap-3">
          <Text tone="ink" size="sm" bold className="font-display tracking-wide">
            Money, trust and teamwork
          </Text>
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <Text tone="ink" size="sm" bold>
                Trust {name.trim() || 'this kid'} with every quest
              </Text>
              <Text size="xs">Their quests pay out on "I did it!" with no check from you. To trust just some chores, switch on "Trust this quest" for those quests instead.</Text>
            </div>
            <Toggle checked={trusted} onChange={setTrusted} label="Trust with every quest" />
          </div>
          <div className="flex items-center justify-between gap-3">
            <Text size="sm">Own coins per star (family default is <Money cents={familyStar} size="sm" coin={false} />)</Text>
            <Toggle checked={ownStar} onChange={setOwnStar} label="Own coins per star" />
          </div>
          {ownStar && <AmountPicker value={star} onChange={setStar} min={0} max={10_000} steps={[5, 25, 100]} />}
          <Stepper label="Team effort boost" value={boost} onChange={setBoost} min={EFFORT_BOOST.min} max={EFFORT_BOOST.max} step={EFFORT_BOOST.step} format={(v) => `${v}x`} />
          <Text size="xs">
            Boost makes {name.trim() || 'this kid'}'s quests count more toward team goals, so a younger kid on a lower star value still pulls their weight. It never changes coins. A new star value applies to quests you create from now on.
          </Text>
        </Card>
      )}
      <Button type="submit" size="lg" block busy={busy} disabled={!ready}>
        {kid ? 'Save changes' : `Add ${name.trim() || 'kid'}`}
      </Button>
    </form>
  );
}

/* ---------- Bonus or deduction ---------- */

const GIFT_REASONS: { label: string; sign: 1 | -1 }[] = [
  { label: 'Great attitude', sign: 1 },
  { label: 'Birthday', sign: 1 },
  { label: 'Helped without asking', sign: 1 },
  { label: 'Good report card', sign: 1 },
  { label: 'Broke a rule', sign: -1 },
  { label: 'Lost or broke something', sign: -1 },
];

function GiftForm({ kid, busy, onSubmit }: { kid: Kid; busy: boolean; onSubmit: (amountCents: number, label: string, el: Element) => void }) {
  const [amount, setAmount] = useState(100);
  const [label, setLabel] = useState('');
  const ready = amount !== 0 && label.trim().length > 0;
  const deduction = amount < 0;
  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        if (ready) onSubmit(amount, label.trim(), e.currentTarget);
      }}
    >
      <PennySays mood={deduction ? 'think' : 'cheer'} size={60}>
        {deduction
          ? `This comes out of ${kid.name}'s wallet, which has `
          : `A little something extra for ${kid.name}! It lands in their wallet, which has `}
        <Money cents={kid.balanceCents} size="sm" coin={false} />.
      </PennySays>
      <AmountPicker value={amount} onChange={setAmount} allowNegative steps={[25, 100, 500]} />
      <Field label="What for?">
        {(id) => <Input id={id} value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Great attitude" maxLength={60} autoComplete="off" />}
      </Field>
      <div className="flex flex-wrap gap-2">
        {GIFT_REASONS.map((r) => (
          <Button
            key={r.label}
            size="sm"
            variant={label === r.label ? 'primary' : 'secondary'}
            onClick={() => {
              setLabel(r.label);
              setAmount((a) => r.sign * Math.abs(a || 100));
            }}
          >
            {r.label}
          </Button>
        ))}
      </div>
      <Button type="submit" size="lg" block busy={busy} disabled={!ready} variant={deduction ? 'danger' : 'coin'}>
        {deduction ? 'Take away' : 'Give'} <Money cents={Math.abs(amount)} size="sm" coin={!deduction} />
      </Button>
    </form>
  );
}

/* ---------- History ---------- */

function KidHistory({ kid }: { kid: Kid }) {
  const { data, isLoading } = useActivity(kid.id);
  if (isLoading)
    return (
      <div className="flex justify-center py-10">
        <Spinner />
      </div>
    );
  const items = data?.activity ?? [];
  return items.length ? (
    <ActivityList items={items} />
  ) : (
    <EmptyState art={<Wallet size={80} />} title="Nothing yet">
      Coins {kid.name} earns, spends and saves will show up here.
    </EmptyState>
  );
}

/* ---------- Kid card ---------- */

function Pot({ art, label, cents }: { art: ReactNode; label: string; cents: number }) {
  return (
    <div className="flex flex-col items-center gap-0.5 rounded-2xl bg-surface-soft px-2 py-2 text-center">
      {art}
      <Money cents={cents} size="sm" coin={false} />
      <Text size="xs" tone="faint">
        {label}
      </Text>
    </div>
  );
}

/** COPPA consent: the kid stays locked until the grown-up confirms the email (server services/consent.ts). */
function ConsentPending({ kid }: { kid: Kid }) {
  const resend = useAction(() => endpoints.resendConsent(kid.id), { success: 'Sent! Check your email.', invalidate: [] });
  return (
    <Card tone="coin" className="flex flex-col gap-3">
      <Text tone="ink" size="sm">
        We emailed you to confirm that {kid.name} may use Kid Kapital. {kid.name} can sign in once you tap the link. Without it, we delete this profile after 7 days.
      </Text>
      <Button variant="secondary" size="sm" icon={<IconMail size={18} />} disabled={resend.busy} onClick={() => void resend.run().catch(() => undefined)}>
        Send the email again
      </Button>
    </Card>
  );
}

function KidCard({
  kid,
  showPiggy,
  showRocket,
  onGift,
  onEdit,
  onHistory,
  onRemove,
}: {
  kid: Kid;
  showPiggy: boolean;
  showRocket: boolean;
  onGift: () => void;
  onEdit: () => void;
  onHistory: () => void;
  onRemove: () => void;
}) {
  const badges = BADGES.filter((b) => kid.badges.includes(b.id));
  return (
    <motion.div variants={popIn} layout>
      <Card className="flex h-full flex-col gap-4">
        <div className="flex items-center gap-3">
          <KidAvatar avatar={kid.avatar} hat={kid.hat} size={68} ring />
          <div className="min-w-0 flex-1">
            <Text tone="ink" bold className="truncate font-display text-2xl leading-tight">
              {kid.name}
            </Text>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <StreakFlame streak={kid.streak} size={24} />
              <Pill tone="brand" icon={<Trophy size={16} />}>
                {kid.questsDone} {kid.questsDone === 1 ? 'quest' : 'quests'}
              </Pill>
              {kid.trusted && (
                <Pill tone="good" icon={<IconCheck size={12} />}>
                  Trusted
                </Pill>
              )}
              {kid.age !== null && <Pill tone="plain">Age {kid.age}</Pill>}
              {kid.lessonsDone > 0 && (
                <Pill tone="coin" icon={<IconLearn size={14} />}>
                  {kid.lessonsDone} {kid.lessonsDone === 1 ? 'lesson' : 'lessons'}
                </Pill>
              )}
            </div>
          </div>
          <Button variant="ghost" size="icon" aria-label={`Edit ${kid.name}`} onClick={onEdit}>
            <IconEdit />
          </Button>
        </div>

        {kid.consentPending && <ConsentPending kid={kid} />}

        <LevelProgress xp={kid.xp} compact />

        <div className="grid grid-cols-3 gap-2">
          <Pot art={<Wallet size={36} />} label="Wallet" cents={kid.balanceCents} />
          {showPiggy && <Pot art={<PiggyBank size={36} />} label="Piggy" cents={kid.piggyCents} />}
          {showRocket && <Pot art={<Rocket size={36} />} label="Rocket" cents={kid.rocketCents} />}
        </div>

        <div className="flex items-center gap-2">
          <Text size="sm" bold className="shrink-0">
            {badges.length} {badges.length === 1 ? 'badge' : 'badges'}
          </Text>
          <div className="flex flex-wrap gap-1">
            {badges.map((b) => (
              <span key={b.id} title={b.name}>
                <b.Art size={30} />
              </span>
            ))}
          </div>
        </div>

        <div className="mt-auto grid grid-cols-2 gap-2">
          <Button variant="coin" size="sm" onClick={onGift}>
            Adjust coins
          </Button>
          <Button variant="secondary" size="sm" icon={<IconHistory size={18} />} onClick={onHistory}>
            History
          </Button>
          <Button variant="ghost" size="sm" icon={<IconTrash size={18} />} onClick={onRemove} className="col-span-2 text-bad-deep">
            Remove {kid.name}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}

/* ---------- Page ---------- */

type SheetKind = 'add' | 'edit' | 'gift' | 'history';

export default function ParentFamily() {
  const { data } = useHome();
  const confirm = useConfirm();
  const sheet = useSheet<SheetKind, Kid>();

  const addKid = useAction(endpoints.addKid);
  const updateKid = useAction(endpoints.updateKid, { success: 'Saved!' });
  const removeKid = useAction(endpoints.removeKid);
  const gift = useAction(endpoints.gift);

  if (!data) return null;
  const { family, kids, parents } = data;
  const kid = sheet.target;

  const onAdd = async (d: KidDraft) => {
    const { consentEmail } = await addKid.run(d);
    sheet.close();
    celebrate('levelUp');
    if (consentEmail?.sent) toast.success(`Check your email to confirm before ${d.name} can sign in.`);
    else if (consentEmail) toast.error(consentEmail.error);
  };

  const onEdit = async (d: KidDraft) => {
    if (!kid) return;
    await updateKid.run(kid.id, {
      name: d.name,
      avatar: d.avatar,
      age: d.age,
      starValueCents: d.starValueCents,
      effortBoost: d.effortBoost,
      trusted: d.trusted,
      ...(d.pin ? { pin: d.pin } : {}),
    });
    sheet.close();
  };

  const onGift = async (amountCents: number, label: string, el: Element) => {
    if (!kid) return;
    await gift.run(kid.id, { amountCents, label });
    celebrate(amountCents > 0 ? 'coins' : 'tap', el);
    sheet.close();
  };

  const onRemove = async (k: Kid) => {
    const ok = await confirm({
      title: `Remove ${k.name}?`,
      message: `${k.name}'s quests stop and they can no longer sign in. Their coins go away too. This cannot be undone.`,
      confirmText: 'Remove',
      danger: true,
    });
    if (ok) await removeKid.run(k.id);
  };

  const swallow = (p: Promise<unknown>) => void p.catch(() => undefined);

  return (
    <div className="flex flex-col gap-6">
      <PageIntro
        title="Family"
        art={<SceneFamily size={72} />}
        action={
          <Button icon={<IconPlus size={20} />} onClick={() => sheet.show('add')}>
            <span className="hidden sm:inline">Add a kid</span>
            <span className="sm:hidden">Add</span>
          </Button>
        }
      >
        Everyone's progress, pots and PINs.
      </PageIntro>

      {kids.length === 0 ? (
        <EmptyState
          art={<SceneFamily size={150} />}
          title="Add your first kid"
          action={
            <Button size="lg" icon={<IconPlus size={22} />} onClick={() => sheet.show('add')}>
              Add a kid
            </Button>
          }
        >
          Give them a name, a buddy and a secret PIN. Then they can sign in with the family code below.
        </EmptyState>
      ) : (
        <motion.div variants={stagger} initial="hidden" animate="show" className="grid gap-4 md:grid-cols-2">
          {kids.map((k) => (
            <KidCard
              key={k.id}
              kid={k}
              showPiggy={family.features.piggy}
              showRocket={family.features.rocket}
              onGift={() => sheet.show('gift', k)}
              onEdit={() => sheet.show('edit', k)}
              onHistory={() => sheet.show('history', k)}
              onRemove={() => swallow(onRemove(k))}
            />
          ))}
        </motion.div>
      )}

      <section>
        <SectionTitle>Grown-ups</SectionTitle>
        <Card pad="none" className="divide-y-2 divide-line overflow-hidden">
          {parents.map((p) => (
            <div key={p.id} className="flex items-center gap-3 px-4 py-3">
              <Avatar id={p.avatar} size={40} />
              <Text tone="ink" bold className="font-display">
                {p.name}
              </Text>
            </div>
          ))}
        </Card>
      </section>

      <FamilyCodeCard code={family.code} />

      <Sheet open={sheet.open === 'add'} onClose={sheet.close} title="Add a kid">
        <KidForm busy={addKid.busy} onSubmit={(d) => swallow(onAdd(d))} />
      </Sheet>
      <Sheet open={sheet.open === 'edit'} onClose={sheet.close} title={`Edit ${kid?.name ?? ''}`}>
        {kid && <KidForm key={kid.id} kid={kid} busy={updateKid.busy} onSubmit={(d) => swallow(onEdit(d))} />}
      </Sheet>
      <Sheet open={sheet.open === 'gift'} onClose={sheet.close} title="Bonus or deduction">
        {kid && <GiftForm key={kid.id} kid={kid} busy={gift.busy} onSubmit={(a, l, el) => swallow(onGift(a, l, el))} />}
      </Sheet>
      <Sheet open={sheet.open === 'history'} onClose={sheet.close} title={`${kid?.name ?? ''}'s history`}>
        {kid && <KidHistory kid={kid} />}
      </Sheet>
    </div>
  );
}
