// Growing money: a dream goal to save toward, a steady piggy bank and a risky
// rocket fund. The point is to feel the difference between safe and risky.
import { useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { lessonIdForArt, POT_NAMES, type AccountKind, type Cents } from '@kk/shared';
import { Cloud, GoalJar, IconClock, IconEdit, IconLearn, PiggyBank, RewardIcon, Rocket, Sparkle, Star } from '@/art';
import { AmountPicker, Button, Card, EmptyState, Field, Heading, Input, Money, PennySays, Pill, ProgressBar, SectionTitle, Sheet, Text } from '@/components/ui';
import { Sticker, StickerPicker, stickerLabel, useStickerChoice } from '@/features/stickers';
import { endpoints } from '@/lib/api';
import { celebrate } from '@/lib/celebrate';
import { bouncy, popIn, stagger } from '@/lib/motion';
import { useAction, useGrow, useSelfKid, useTeamGoals } from '@/lib/queries';
import { TeamGoalCard } from '@/features/teamwork';
import type { Goal, GrowAccount } from '@/lib/types';
import { Loading, WalletHeader } from './kid-parts';

type Direction = 'deposit' | 'withdraw';

/** "in 3 days", "in 5 hours", "any minute now". */
const countdown = (iso: string) => {
  const ms = new Date(iso).getTime() - Date.now();
  const hours = Math.floor(ms / 3_600_000);
  if (hours >= 48) return `in ${Math.floor(hours / 24)} days`;
  if (hours >= 24) return 'tomorrow';
  if (hours >= 1) return `in ${hours} hour${hours === 1 ? '' : 's'}`;
  return 'any minute now';
};


const pct = (n: number) => `${n > 0 ? '+' : ''}${n}%`;

export default function KidGrow() {
  const navigate = useNavigate();
  const { kid, family } = useSelfKid();
  const grow = useGrow();
  const [move, setMove] = useState<{ kind: AccountKind; direction: Direction } | null>(null);

  if (grow.isLoading || !kid || !family) return <Loading />;
  if (!grow.data) {
    return (
      <PennySays mood="sad" className="pt-6">
        Hmm, I could not find your coins just now. Pull down or try again in a moment.
      </PennySays>
    );
  }

  const g = grow.data;
  const account = (kind: AccountKind) => g.accounts.find((a) => a.kind === kind);
  const piggy = account('piggy');
  const rocket = account('rocket');
  const { features } = family;
  // A switched-off pot still shows while it holds coins, so they can be taken out.
  const showPiggy = !!piggy && (features.piggy || piggy.balanceCents > 0);
  // The rocket needs the family switch; coins already inside can always come out.
  const rocketOpen = features.rocket;
  const showRocket = !!rocket && (rocketOpen || rocket.balanceCents > 0);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <WalletHeader cents={g.walletCents}>Coins you can spend or grow.</WalletHeader>

      {features.goals && <DreamGoal goal={kid.goal} savedCents={kid.balanceCents + kid.piggyCents} />}
      {features.teamGoals && <TeamGoals kidId={kid.id} />}

      {(showPiggy || showRocket) && (
        <PennySays mood="think">
          The piggy grows a little every week, always. The rocket might zoom way up, or dip down. Safe and steady, or big and bumpy?
        </PennySays>
      )}
      {features.learn && (showPiggy || showRocket) && (
        <div className="-mt-2 flex flex-wrap gap-2">
          {(
            [
              ['interest', 'How interest works'],
              ['risk', 'Why the rocket wobbles'],
            ] as const
          ).map(([art, label]) => {
            const id = lessonIdForArt(art);
            return (
              id && (
                <Button key={art} size="sm" variant="secondary" icon={<IconLearn size={18} />} onClick={() => navigate(`/kid/learn/${id}`)}>
                  {label}
                </Button>
              )
            );
          })}
        </div>
      )}

      <motion.div variants={stagger} initial="hidden" animate="show" className="grid gap-5 md:grid-cols-2">
        {showPiggy && piggy && (
          <PotCard
            account={piggy}
            open={features.piggy}
            art={<PiggyBank size={104} />}
            title={POT_NAMES.piggy}
            blurb={`Grows +${g.piggyRatePct}% every week. Safe and steady.`}
            last={piggy.lastGrowthPct > 0 && <Pill tone="good">Last week {pct(piggy.lastGrowthPct)}</Pill>}
            onMove={(direction) => setMove({ kind: 'piggy', direction })}
          />
        )}
        {showRocket && rocket && (
          <PotCard
            account={rocket}
            open={rocketOpen}
            art={<RocketArt />}
            title={POT_NAMES.rocket}
            blurb={`Could zoom up to ${pct(g.rocketMaxPct)} or dip down to ${pct(g.rocketMinPct)} each week. Risky!`}
            last={
              rocket.lastGrowthPct !== 0 && (
                <Pill tone={rocket.lastGrowthPct > 0 ? 'good' : 'bad'}>
                  Last week {rocket.lastGrowthPct > 0 ? 'zoomed' : 'dipped'} {pct(rocket.lastGrowthPct)}
                </Pill>
              )
            }
            onMove={(direction) => setMove({ kind: 'rocket', direction })}
          />
        )}
      </motion.div>

      <MoveSheet move={move} walletCents={g.walletCents} potCents={move ? (account(move.kind)?.balanceCents ?? 0) : 0} onClose={() => setMove(null)} />
    </div>
  );
}

/* ---------- Dream goal ---------- */

function DreamGoal({ goal, savedCents }: { goal: Goal | null; savedCents: Cents }) {
  const [editing, setEditing] = useState(false);
  const clear = useAction(endpoints.setGoal, { success: 'Goal cleared' });
  const progress = goal ? Math.min(1, savedCents / goal.targetCents) : 0;
  const reached = !!goal && savedCents >= goal.targetCents;

  return (
    <section>
      <SectionTitle icon={<Star size={24} />}>My dream goal</SectionTitle>
      {!goal ? (
        <EmptyState art={<GoalJar fill={0.15} size={130} />} title="What are you saving for?" action={<Button onClick={() => setEditing(true)}>Set my goal</Button>}>
          Pick something big. Watch the jar fill up as you save!
        </EmptyState>
      ) : (
        <Card tone={reached ? 'good' : 'brand'} className="relative overflow-hidden">
          {reached && (
            <motion.span className="absolute right-3 top-3" animate={{ rotate: [0, 20, 0], scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.4 }}>
              <Sparkle size={32} />
            </motion.span>
          )}
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <GoalJar fill={progress} size={120} />
              <motion.span className="absolute -right-3 -top-2" initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={bouncy}>
                <RewardIcon id={goal.icon} title={goal.title} size={56} />
              </motion.span>
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <Heading level={3} size="sm" className="truncate">
                {goal.title}
              </Heading>
              <div className="flex flex-wrap items-baseline gap-1.5">
                <Money cents={Math.min(savedCents, goal.targetCents)} size="md" />
                <Text size="sm" as="span">
                  of
                </Text>
                <Money cents={goal.targetCents} size="sm" coin={false} />
              </div>
              <ProgressBar value={progress} tone={reached ? 'good' : 'coin'} />
              <Text size="xs" tone="faint">
                {reached ? 'You did it! Ask a grown-up about your dream.' : 'Counts your wallet and piggy bank together.'}
              </Text>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <Button variant="secondary" size="sm" icon={<IconEdit size={18} />} onClick={() => setEditing(true)}>
              Change goal
            </Button>
            <Button variant="ghost" size="sm" busy={clear.busy} onClick={() => void clear.run(null)}>
              Clear
            </Button>
          </div>
        </Card>
      )}
      <GoalSheet open={editing} goal={goal} onClose={() => setEditing(false)} />
    </section>
  );
}

function GoalSheet({ open, goal, onClose }: { open: boolean; goal: Goal | null; onClose: () => void }) {
  return (
    <Sheet open={open} onClose={onClose} title="My dream goal">
      {/* Remount on each open so the form starts from the current goal. */}
      {open && <GoalForm goal={goal} onDone={onClose} />}
    </Sheet>
  );
}

function GoalForm({ goal, onDone }: { goal: Goal | null; onDone: () => void }) {
  const { icon, title, setTitle, pick: pickIcon } = useStickerChoice('reward', goal ? goal.icon : 'bike', goal?.title ?? stickerLabel('reward', 'bike'));
  const [target, setTarget] = useState<Cents>(goal?.targetCents ?? 2000);
  const save = useAction(endpoints.setGoal, { success: 'Goal set! Go get it!' });


  const submit = async (el: HTMLElement) => {
    await save.run({ title: title.trim(), icon, targetCents: target });
    celebrate('save', el);
    onDone();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Sticker kind="reward" id={icon} title={title} size={64} />
        <div className="flex-1">
          <Field label="Call it">{(id) => <Input id={id} value={title} maxLength={40} onChange={(e) => setTitle(e.target.value)} />}</Field>
        </div>
      </div>
      <StickerPicker kind="reward" value={icon} onChange={pickIcon} />
      <div className="flex flex-col gap-2">
        <Text tone="ink" size="sm" bold className="text-center font-display">
          How much does it cost?
        </Text>
        <AmountPicker value={target} onChange={setTarget} min={100} steps={[100, 500, 2000]} max={1_000_000} />
      </div>
      <Button block size="lg" disabled={!title.trim() || target < 1} busy={save.busy} onClick={(e) => void submit(e.currentTarget)}>
        Save my goal
      </Button>
    </div>
  );
}

/* ---------- Pots ---------- */

function RocketArt() {
  return (
    <motion.span className="relative inline-block" animate={{ y: [0, -6, 0], rotate: [-2, 2, -2] }} transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}>
      <Cloud size={48} className="absolute -bottom-2 -left-4 opacity-80" />
      <Rocket size={104} className="relative" />
    </motion.span>
  );
}

function PotCard({
  account,
  open,
  art,
  title,
  blurb,
  last,
  onMove,
}: {
  account: GrowAccount;
  open: boolean;
  art: ReactNode;
  title: string;
  blurb: string;
  last: ReactNode;
  onMove: (d: Direction) => void;
}) {
  return (
    <motion.div variants={popIn}>
      <Card className="flex h-full flex-col gap-3">
        <div className="flex items-center gap-3">
          <span className="shrink-0">{art}</span>
          <div className="min-w-0">
            <Heading level={2} size="sm">
              {title}
            </Heading>
            <Money cents={account.balanceCents} size="lg" />
          </div>
        </div>
        <Text size="sm">{blurb}</Text>
        <div className="flex flex-wrap items-center gap-2">
          {last}
          <Pill icon={<IconClock size={14} />}>Next growth {countdown(account.nextGrowthAt)}</Pill>
        </div>
        {!open && <Text size="xs" tone="faint">This one is closed for new coins. You can still take yours out.</Text>}
        <div className="mt-auto grid grid-cols-2 gap-2 pt-1">
          <Button variant="coin" size="sm" disabled={!open} onClick={() => onMove('deposit')}>
            Put in
          </Button>
          <Button variant="secondary" size="sm" disabled={account.balanceCents <= 0} onClick={() => onMove('withdraw')}>
            Take out
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}

function MoveSheet({ move, walletCents, potCents, onClose }: { move: { kind: AccountKind; direction: Direction } | null; walletCents: Cents; potCents: Cents; onClose: () => void }) {
  const title = move ? (move.direction === 'deposit' ? `Into the ${POT_NAMES[move.kind].toLowerCase()}` : `Out of the ${POT_NAMES[move.kind].toLowerCase()}`) : '';
  return (
    <Sheet open={!!move} onClose={onClose} title={title}>
      {move && <MoveForm key={`${move.kind}-${move.direction}`} kind={move.kind} direction={move.direction} max={move.direction === 'deposit' ? walletCents : potCents} onDone={onClose} />}
    </Sheet>
  );
}

function MoveForm({ kind, direction, max, onDone }: { kind: AccountKind; direction: Direction; max: Cents; onDone: () => void }) {
  const [amount, setAmount] = useState<Cents>(Math.min(100, max));
  const action = useAction(endpoints.moveGrowth);
  const submit = async (el: HTMLElement) => {
    await action.run(kind, direction, amount);
    celebrate('save', el);
    onDone();
  };
  return (
    <div className="flex flex-col items-center gap-4">
      <motion.span initial={{ scale: 0.6, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} transition={bouncy}>
        {kind === 'piggy' ? <PiggyBank size={96} /> : <Rocket size={96} />}
      </motion.span>
      <Text size="sm">
        {direction === 'deposit' ? 'From your wallet. You have ' : 'Back to your wallet. There is '}
        <Money cents={max} size="sm" coin={false} />
        {direction === 'deposit' ? ' to use.' : ' inside.'}
      </Text>
      <AmountPicker value={amount} onChange={setAmount} max={max} min={0} steps={[25, 100, 500]} allChip />
      <Button block size="lg" variant={direction === 'deposit' ? 'coin' : 'primary'} disabled={amount < 1 || amount > max} busy={action.busy} onClick={(e) => void submit(e.currentTarget)}>
        {direction === 'deposit' ? 'Put it in!' : 'Take it out'}
      </Button>
    </div>
  );
}

/** Prizes the whole family earns together, with this kid's share highlighted. */
function TeamGoals({ kidId }: { kidId: string }) {
  const { data } = useTeamGoals();
  const { data: home } = useSelfKid();
  const goals = (data?.goals ?? []).filter((g) => g.status !== 'handed');
  if (!goals.length) return null;
  return (
    <section>
      <SectionTitle icon={<Sparkle size={24} />}>Team goals</SectionTitle>
      <Text size="sm" className="-mt-2 mb-3">
        Every quest you finish adds team points. Work together to win the prize!
      </Text>
      <motion.div variants={stagger} initial="hidden" animate="show" className="grid gap-3 sm:grid-cols-2">
        {goals.map((g) => (
          <TeamGoalCard key={g.id} goal={g} kids={home?.siblings ?? []} highlightKidId={kidId} />
        ))}
      </motion.div>
    </section>
  );
}
