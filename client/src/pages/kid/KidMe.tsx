// The kid's profile: avatar and hat, level, stats, the hat closet, the badge
// wall, recent coins in and out, and settings.
import { useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { HATS, hatUnlocked, levelFor, type HatId } from '@kk/shared';
import { BADGES, Coin, HatPreview, IconHistory, IconLock, IconLogout, IconSettings, IconSparkle, LevelShield, SceneEmptyJar, Sparkle, Star, Trophy } from '@/art';
import { Button, Card, ChoiceGrid, EmptyState, Heading, KidAvatar, LevelProgress, Money, SectionTitle, StreakFlame, Text, Toggle, useConfirm } from '@/components/ui';
import { ActivityList } from '@/features/cards';
import { endpoints } from '@/lib/api';
import { bouncy, popIn, stagger } from '@/lib/motion';
import { prefs } from '@/lib/prefs';
import { qk, useAction, useActivity, useMilestones, useSelfKid } from '@/lib/queries';
import { MilestoneLadder } from '@/features/teamwork';
import { useSignOut } from '@/stores/auth';
import { Loading } from './kid-parts';

export default function KidMe() {
  const { kid, family } = useSelfKid();
  const activity = useActivity();
  const confirm = useConfirm();
  const signOut = useSignOut();
  const [soundOn, setSoundOn] = useState(prefs.soundOn);
  const setHat = useAction(endpoints.setHat, { invalidate: [qk.home], success: 'Looking good!' });

  if (!kid) return <Loading />;
  const { level } = levelFor(kid.xp);
  const items = activity.data?.activity ?? [];

  const onSignOut = async () => {
    if (await confirm({ title: 'Sign out?', message: 'You can hop back in with your family code and PIN.', confirmText: 'Sign out', danger: true })) {
      await signOut();
    }
  };

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <Card tone="brand" className="relative flex flex-col items-center gap-3 overflow-hidden pt-6 text-center">
        <Sparkle size={28} className="kk-twinkle absolute left-6 top-5" />
        <Sparkle size={20} className="kk-twinkle kk-delay-2 absolute right-8 top-10" />
        <motion.span key={kid.hat} initial={{ scale: 0.7, rotate: -8 }} animate={{ scale: 1, rotate: 0 }} transition={bouncy} className="kk-bob">
          <KidAvatar avatar={kid.avatar} hat={kid.hat} size={128} ring />
        </motion.span>
        <Heading level={1} size="lg">
          {kid.name}
        </Heading>
        <div className="w-full max-w-sm text-left">
          <LevelProgress xp={kid.xp} />
        </div>
      </Card>

      <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile art={<Trophy size={44} />} label="Quests done">
          <Text tone="ink" bold as="span" className="font-display text-3xl tabular">
            {kid.questsDone}
          </Text>
        </StatTile>
        <StatTile art={<StreakFlame streak={kid.streak} size={44} count={false} />} label="Day streak">
          <Text tone="ink" bold as="span" className="font-display text-3xl tabular">
            {kid.streak}
          </Text>
        </StatTile>
        <StatTile art={<Coin size={44} />} label="Coins">
          <Money cents={kid.balanceCents} size="md" coin={false} />
        </StatTile>
        {/* The shield already shows the number, so it is not repeated beside it. */}
        <StatTile art={<LevelShield level={level} size={52} />} label="Level">
          {null}
        </StatTile>
      </motion.div>

      <section>
        <SectionTitle icon={<IconSparkle size={24} />}>Hat closet</SectionTitle>
        <Card>
          <ChoiceGrid<HatId>
            value={kid.hat}
            columns={5}
            onChange={(hat) => hat !== kid.hat && void setHat.run(hat)}
            options={HATS.map((h) => ({
              value: h.id,
              label: hatUnlocked(h.id, level) ? h.name : `${h.name}, unlocks at level ${h.level}`,
              art: <HatPreview id={h.id} />,
              locked: hatUnlocked(h.id, level) ? undefined : (
                <span className="flex flex-col items-center rounded-xl bg-surface/80 px-1.5 py-0.5">
                  <IconLock size={20} />
                  <Text size="xs" tone="ink" bold as="span">
                    Lv {h.level}
                  </Text>
                </span>
              ),
            }))}
          />
          <Text size="xs" tone="faint" className="mt-3 text-center">
            Level up to unlock more hats!
          </Text>
        </Card>
      </section>

      <Milestones assists={!!family?.features.assists} />

      <section>
        <SectionTitle icon={<Trophy size={26} />}>Badge wall</SectionTitle>
        <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {BADGES.map((b) => {
            const earned = kid.badges.includes(b.id);
            return (
              <motion.div key={b.id} variants={popIn}>
                <Card pad="sm" tone={earned ? 'coin' : 'soft'} sticker={earned} className="flex h-full flex-col items-center gap-1.5 text-center">
                  <motion.span whileHover={earned ? { rotate: [0, -10, 10, 0], scale: 1.08 } : undefined} className={earned ? '' : 'opacity-35 grayscale'}>
                    <b.Art size={72} />
                  </motion.span>
                  <Text tone={earned ? 'ink' : 'soft'} bold className="font-display">
                    {b.name}
                  </Text>
                  <Text size="xs" tone="faint">
                    {earned ? b.blurb : `Locked: ${b.blurb.charAt(0).toLowerCase()}${b.blurb.slice(1)}`}
                  </Text>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      <section>
        <SectionTitle icon={<IconHistory size={24} />}>Recent coins</SectionTitle>
        {activity.isLoading ? (
          <Loading />
        ) : items.length ? (
          <ActivityList items={items.slice(0, 12)} />
        ) : (
          <EmptyState art={<SceneEmptyJar size={160} />} title="No coins yet">
            Finish a quest and your coins will show up here.
          </EmptyState>
        )}
      </section>

      <section>
        <SectionTitle icon={<IconSettings size={24} />}>Settings</SectionTitle>
        <Card className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <Text tone="ink" bold className="font-display">
                Sounds
              </Text>
              <Text size="xs" tone="faint">
                Dings, pops and coin clinks
              </Text>
            </div>
            <Toggle
              label="Sounds"
              checked={soundOn}
              onChange={(on) => {
                prefs.setSoundOn(on);
                setSoundOn(on);
              }}
            />
          </div>
          <Button variant="secondary" block icon={<IconLogout size={20} />} onClick={() => void onSignOut()}>
            Sign out
          </Button>
        </Card>
      </section>
    </div>
  );
}

function StatTile({ art, label, children }: { art: ReactNode; label: string; children: ReactNode }) {
  return (
    <motion.div variants={popIn}>
      <Card pad="sm" className="flex h-full flex-col items-center justify-center gap-1 text-center">
        <span className="flex items-center gap-1.5">
          {art}
          {children}
        </span>
        <Text size="xs" bold>
          {label}
        </Text>
      </Card>
    </motion.div>
  );
}

/** Prizes a grown-up set for reaching a level, and for helping siblings. Each shelf shows only when it has prizes. */
function Milestones({ assists }: { assists: boolean }) {
  const { data } = useMilestones();
  if (!data) return null;
  const shelves = [
    { kind: 'level' as const, title: 'Level prizes', value: data.level ?? 1 },
    { kind: 'helper' as const, title: 'Helper points', value: data.assistPoints ?? 0 },
  ].filter((s) => s.kind === 'level' || assists);
  return (
    <>
      {shelves.map((s) => {
        const milestones = data.milestones.filter((m) => m.kind === s.kind);
        if (!milestones.length) return null;
        return (
          <section key={s.kind}>
            <SectionTitle icon={<Star size={24} />}>{s.title}</SectionTitle>
            <Card>
              <MilestoneLadder kind={s.kind} value={s.value} milestones={milestones} />
            </Card>
          </section>
        );
      })}
    </>
  );
}
