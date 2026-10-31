// The grown-up's inbox: finished quests waiting for a thumbs up and shop
// purchases waiting to be handed over, with a quick look at every kid on top.
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { levelFor } from '@kk/shared';
import { IconCheck, LevelShield, Penny, RewardIcon, SceneFamily } from '@/art';
import { Button, Card, EmptyState, KidAvatar, Money, Pill, SectionTitle, StreakFlame, Text, useConfirm } from '@/components/ui';
import { QuestCard } from '@/features/cards';
import { TeamGoalCard } from '@/features/teamwork';
import { endpoints } from '@/lib/api';
import { celebrate } from '@/lib/celebrate';
import { popIn, stagger } from '@/lib/motion';
import { useAction, useApprovals, useHome } from '@/lib/queries';
import type { Approvals, Kid } from '@/lib/types';
import { PageIntro } from './parts';

const leave = { opacity: 0, x: 60, scale: 0.92, transition: { duration: 0.2 } };

function KidSummary({ kid }: { kid: Kid }) {
  return (
    <motion.div variants={popIn} className="min-w-[160px] flex-1">
      <Card pad="sm" className="flex items-center gap-3">
        <KidAvatar avatar={kid.avatar} hat={kid.hat} size={52} ring />
        <div className="min-w-0 flex-1">
          <Text tone="ink" bold className="truncate font-display">
            {kid.name}
          </Text>
          <Money cents={kid.balanceCents} size="sm" />
          <div className="mt-0.5 flex items-center gap-2">
            <LevelShield level={levelFor(kid.xp).level} size={26} />
            <StreakFlame streak={kid.streak} size={22} />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

type QuestItem = Approvals['quests'][number];
type PurchaseItem = Approvals['purchases'][number];

export default function ParentInbox() {
  const home = useHome();
  const approvals = useApprovals();
  const confirm = useConfirm();
  // Hide handled items right away so the card can animate out before the refetch lands.
  const [handled, setHandled] = useState<Set<string>>(new Set());
  const hide = (id: string) => setHandled((s) => new Set(s).add(id));

  const approve = useAction(endpoints.approveRun);
  const reject = useAction(endpoints.rejectRun);
  const fulfill = useAction(endpoints.fulfill);
  const decline = useAction(endpoints.decline);
  const handOverTeam = useAction(endpoints.handOverTeamGoal, { success: 'Enjoy the prize together!' });
  const onHandOverTeam = async (id: string, el: Element) => {
    await handOverTeam.run(id);
    celebrate('buy', el);
  };
  const [approvingAll, setApprovingAll] = useState(false);

  const quests = (approvals.data?.quests ?? []).filter((q) => !handled.has(q.runId));
  const purchases = (approvals.data?.purchases ?? []).filter((p) => !handled.has(p.id));
  const kids = home.data?.kids ?? [];

  const payOne = async (q: QuestItem, el?: Element | null) => {
    const res = await approve.run(q.runId);
    celebrate(res.levelUp ? 'levelUp' : 'coins', el);
    hide(q.runId);
  };

  const onApprove = (q: QuestItem, el: Element) => void payOne(q, el).catch(() => undefined);

  const onReject = async (q: QuestItem) => {
    await reject.run(q.runId);
    hide(q.runId);
  };

  const approveAll = async (el: Element) => {
    setApprovingAll(true);
    try {
      // One at a time: each approval is its own exactly-once transition on the server.
      for (const q of quests) await approve.run(q.runId).then(() => hide(q.runId));
      celebrate('chest', el);
    } catch {
      // useAction already showed the error; the rest stay in the inbox.
    } finally {
      setApprovingAll(false);
    }
  };

  const onFulfill = async (p: PurchaseItem, el: Element) => {
    await fulfill.run(p.id);
    celebrate('buy', el);
    hide(p.id);
  };

  const onDecline = async (p: PurchaseItem) => {
    const ok = await confirm({
      title: `Decline ${p.title}?`,
      message: `${p.kid?.name ?? 'Your kid'} gets every coin back in their wallet.`,
      confirmText: 'Decline + refund',
      danger: true,
    });
    if (!ok) return;
    await decline.run(p.id);
    hide(p.id);
  };

  const teamPrizes = approvals.data?.teamPrizes ?? [];
  const empty = !approvals.isLoading && quests.length === 0 && purchases.length === 0 && teamPrizes.length === 0;
  const waiting = quests.length + purchases.length + teamPrizes.length;

  return (
    <div className="flex flex-col gap-6">
      <PageIntro title="Inbox" art={<Penny size={64} mood={empty ? 'sleepy' : 'wow'} />}>
        {empty ? 'Nothing waiting on you right now.' : `${waiting} ${waiting === 1 ? 'thing needs' : 'things need'} a grown-up.`}
      </PageIntro>

      {kids.length > 0 ? (
        <motion.div variants={stagger} initial="hidden" animate="show" className="scroll-quiet -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
          {kids.map((k) => (
            <KidSummary key={k.id} kid={k} />
          ))}
        </motion.div>
      ) : (
        <EmptyState art={<SceneFamily size={140} />} title="No kids yet">
          Add your kids on the Family tab and their quests will show up here.
        </EmptyState>
      )}

      {empty && kids.length > 0 && (
        <EmptyState art={<Penny size={110} mood="sleepy" />} title="All caught up!">
          When a kid finishes a quest or buys something from the shop, it lands here for your thumbs up.
        </EmptyState>
      )}

      {quests.length > 0 && (
        <section>
          <SectionTitle
            icon={<Pill tone="brand">{quests.length}</Pill>}
            action={
              quests.length > 1 && (
                <Button size="sm" variant="good" busy={approvingAll} icon={<IconCheck size={18} />} onClick={(e) => void approveAll(e.currentTarget)}>
                  Approve all
                </Button>
              )
            }
          >
            Quests to check
          </SectionTitle>
          <motion.div variants={stagger} initial="hidden" animate="show" className="grid gap-3 lg:grid-cols-2">
            <AnimatePresence mode="popLayout">
              {quests.map((q) => (
                <motion.div key={q.runId} layout exit={leave}>
                  <QuestCard
                    quest={q}
                    kid={q.kid}
                    footer={
                      q.helpers.length > 0 && (
                        <Text size="xs" bold>
                          Helped by {q.helpers.map((h) => h.name).join(' and ')}. They get helper points; {q.kid?.name ?? 'the doer'} keeps the coins.
                        </Text>
                      )
                    }
                    action={
                      <div className="flex flex-col items-stretch gap-1.5">
                        <Button size="sm" variant="good" disabled={approvingAll || approve.busy} onClick={(e) => onApprove(q, e.currentTarget)}>
                          Pay <Money cents={q.rewardCents} size="sm" coin={false} />
                        </Button>
                        <Button size="sm" variant="ghost" disabled={approvingAll} onClick={() => void onReject(q).catch(() => undefined)}>
                          Not yet
                        </Button>
                      </div>
                    }
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </section>
      )}

      {teamPrizes.length > 0 && (
        <section>
          <SectionTitle icon={<Pill tone="good">{teamPrizes.length}</Pill>}>Team prizes won</SectionTitle>
          <motion.div variants={stagger} initial="hidden" animate="show" className="grid gap-3 lg:grid-cols-2">
            {teamPrizes.map((g) => (
              <TeamGoalCard
                key={g.id}
                goal={g}
                kids={kids}
                action={
                  <Button variant="good" block onClick={(e) => void onHandOverTeam(g.id, e.currentTarget)}>
                    Handed over
                  </Button>
                }
              />
            ))}
          </motion.div>
        </section>
      )}

      {purchases.length > 0 && (
        <section>
          <SectionTitle icon={<Pill tone="coin">{purchases.length}</Pill>}>Rewards to hand over</SectionTitle>
          <motion.div variants={stagger} initial="hidden" animate="show" className="grid gap-3 lg:grid-cols-2">
            <AnimatePresence mode="popLayout">
              {purchases.map((p) => (
                <motion.div key={p.id} variants={popIn} layout exit={leave}>
                  <Card pad="sm" className="flex flex-wrap items-center gap-3">
                    <span className="relative shrink-0">
                      <RewardIcon id={p.icon} title={p.title} size={60} />
                      {p.kid && <KidAvatar avatar={p.kid.avatar} size={26} className="absolute -bottom-1 -right-1" />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <Text tone="ink" bold className="truncate font-display text-lg leading-tight">
                        {p.title}
                      </Text>
                      <div className="mt-1 flex items-center gap-2">
                        {p.source === 'milestone' ? <Pill tone="brand">Helper prize</Pill> : <Money cents={p.priceCents} size="sm" />}
                        {p.kid && <Text size="xs" bold>for {p.kid.name}</Text>}
                      </div>
                    </div>
                    <div className="flex w-full gap-2 sm:w-auto sm:flex-col">
                      <Button size="sm" variant="good" className="flex-1" onClick={(e) => void onFulfill(p, e.currentTarget).catch(() => undefined)}>
                        Handed over
                      </Button>
                      {p.source === 'shop' && (
                        <Button size="sm" variant="ghost" className="flex-1" onClick={() => void onDecline(p).catch(() => undefined)}>
                          Decline + refund
                        </Button>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </section>
      )}
    </div>
  );
}
