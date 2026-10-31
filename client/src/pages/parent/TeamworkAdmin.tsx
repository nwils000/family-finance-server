// Grown-up controls for teamwork prizes: team goals the kids earn together, and
// helper milestones kids unlock with assist points. Lives on the Prizes page.
import { useState } from 'react';
import { motion } from 'framer-motion';
import { levelFor } from '@kk/shared';
import { IconPlus, IconSparkle, IconTrash, Star } from '@/art';
import { Button, Card, EmptyState, Field, Input, PennySays, SectionTitle, Sheet, Stepper, Text, useConfirm, KidChips } from '@/components/ui';
import { Sticker, StickerPicker, useStickerChoice } from '@/features/stickers';
import { milestoneGoal, TeamGoalCard } from '@/features/teamwork';
import { endpoints } from '@/lib/api';
import { celebrate } from '@/lib/celebrate';
import { popIn, stagger } from '@/lib/motion';
import { qk, useAction, useHome, useMilestones, useTeamGoals } from '@/lib/queries';
import type { Kid, Milestone, TeamGoal } from '@/lib/types';
import { useSheet } from './parts';

const TEAM_KEYS = [qk.teamGoals, qk.approvals] as const;
const MILESTONE_KEYS = [['milestones']] as const;

/** A shared form shell: picture + name, then whatever the item needs. */
function PrizeHeader({ choice }: { choice: ReturnType<typeof useStickerChoice<'reward'>> }) {
  return (
    <>
      <div className="flex items-center gap-3">
        <Sticker kind="reward" id={choice.icon} title={choice.title} size={64} />
        <div className="flex-1">
          <Field label="Prize">{(id) => <Input id={id} value={choice.title} maxLength={60} placeholder="Trip to the zoo" onChange={(e) => choice.setTitle(e.target.value)} />}</Field>
        </div>
      </div>
      <StickerPicker kind="reward" value={choice.icon} onChange={choice.pick} />
    </>
  );
}

function TeamGoalForm({ goal, kids, busy, onSubmit, onDelete }: { goal: TeamGoal | null; kids: Kid[]; busy: boolean; onSubmit: (b: { title: string; icon: TeamGoal['icon']; targetPoints: number; kidIds: string[] }) => void; onDelete?: () => void }) {
  const choice = useStickerChoice('reward', goal ? goal.icon : 'zoo', goal?.title ?? 'Trip to the zoo');
  const [target, setTarget] = useState(goal?.targetPoints ?? 40);
  const [kidIds, setKidIds] = useState<string[]>(goal?.kidIds ?? kids.map((k) => k.id));
  const toggle = (id: string | null) => id && setKidIds((ks) => (ks.includes(id) ? ks.filter((k) => k !== id) : [...ks, id]));
  const ready = choice.title.trim() && kidIds.length > 0;
  return (
    <div className="flex flex-col gap-4">
      <PrizeHeader choice={choice} />
      <Card tone="coin" sticker={false} pad="sm" className="flex flex-col gap-2">
        <Stepper label="Team points needed" value={target} onChange={setTarget} min={5} max={1000} step={5} />
        <Text size="xs">
          A 2-star quest earns 2 points for a kid with a 1x boost. Set each kid's boost on the Family tab so younger kids count fairly.
        </Text>
      </Card>
      <Field label="Who is on the team?">{() => <KidChips kids={kids} selected={kidIds} onToggle={toggle} />}</Field>
      <Button size="lg" block disabled={!ready} busy={busy} onClick={() => onSubmit({ title: choice.title.trim(), icon: choice.icon, targetPoints: target, kidIds })}>
        {goal ? 'Save team goal' : 'Start team goal'}
      </Button>
      {onDelete && (
        <Button variant="ghost" icon={<IconTrash size={18} />} onClick={onDelete}>
          Remove this goal
        </Button>
      )}
    </div>
  );
}

type MilestoneKind = Milestone['kind'];

/** Everything that differs between helper prizes and level prizes. One table, one form, one section. */
const MILESTONE_KINDS: Record<MilestoneKind, {
  heading: string; sheetTitle: string; stepLabel: string; help: string; penny: string; unit: (n: number) => string;
  defaultTitle: string; defaultIcon: Milestone['icon']; defaultPoints: number; max: number;
}> = {
  level: {
    heading: 'Level prizes',
    sheetTitle: 'Level prize',
    stepLabel: 'Level needed',
    help: 'Each kid unlocks this once, the moment they reach this level. XP comes from quests, the daily chest and lessons.',
    penny: 'Reward leveling up! When a kid reaches the level, the prize lands in your inbox.',
    unit: (n) => milestoneGoal('level', n),
    defaultTitle: 'Movie night',
    defaultIcon: 'movie',
    defaultPoints: 5,
    max: 50,
  },
  helper: {
    heading: 'Helper milestones',
    sheetTitle: 'Helper milestone',
    stepLabel: 'Helper points needed',
    help: 'Helping on a quest earns points equal to its stars. Each kid unlocks this once.',
    penny: 'When a kid tags a sibling who helped, the helper earns points. Hit a milestone and the prize lands in your inbox.',
    unit: (n) => milestoneGoal('helper', n),
    defaultTitle: 'You pick dinner',
    defaultIcon: 'pickdinner',
    defaultPoints: 10,
    max: 500,
  },
};

function MilestoneForm({ kind, milestone, busy, onSubmit, onDelete }: { kind: MilestoneKind; milestone: Milestone | null; busy: boolean; onSubmit: (b: { title: string; icon: Milestone['icon']; points: number }) => void; onDelete?: () => void }) {
  const k = MILESTONE_KINDS[kind];
  const choice = useStickerChoice('reward', milestone ? milestone.icon : k.defaultIcon, milestone?.title ?? k.defaultTitle);
  const [points, setPoints] = useState(milestone?.points ?? k.defaultPoints);
  return (
    <div className="flex flex-col gap-4">
      <PrizeHeader choice={choice} />
      <Card tone="brand" sticker={false} pad="sm" className="flex flex-col gap-2">
        <Stepper label={k.stepLabel} value={points} onChange={setPoints} min={kind === 'level' ? 2 : 1} max={k.max} />
        <Text size="xs">{k.help}</Text>
      </Card>
      <Button size="lg" block disabled={!choice.title.trim()} busy={busy} onClick={() => onSubmit({ title: choice.title.trim(), icon: choice.icon, points })}>
        {milestone ? 'Save prize' : 'Add prize'}
      </Button>
      {onDelete && (
        <Button variant="ghost" icon={<IconTrash size={18} />} onClick={onDelete}>
          Remove this prize
        </Button>
      )}
    </div>
  );
}

/** One prize shelf (helper or level), with the kids' progress toward it. */
function MilestoneSection({ kind, milestones, kids, onNew, onEdit }: { kind: MilestoneKind; milestones: Milestone[]; kids: Kid[]; onNew: () => void; onEdit: (m: Milestone) => void }) {
  const k = MILESTONE_KINDS[kind];
  return (
    <section>
      <SectionTitle
        icon={<Star size={24} />}
        action={
          <Button size="sm" icon={<IconPlus size={18} />} onClick={onNew}>
            New
          </Button>
        }
      >
        {k.heading}
      </SectionTitle>
      <PennySays mood="cheer" size={56} className="mb-3">
        {k.penny}
      </PennySays>
      <motion.div variants={stagger} initial="hidden" animate="show" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {milestones.map((m) => (
          <motion.div key={m.id} variants={popIn}>
            <Card pad="sm" onClick={() => onEdit(m)} className="press flex cursor-pointer items-center gap-3">
              <Sticker kind="reward" id={m.icon} title={m.title} size={52} />
              <div className="min-w-0">
                <Text tone="ink" bold className="break-words">
                  {m.title}
                </Text>
                <Text size="sm">{k.unit(m.points)}</Text>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      <Card sticker={false} tone="soft" className="mt-3 flex flex-wrap gap-3">
        {kids.map((kid) => (
          <Text key={kid.id} as="span" size="sm" tone="ink" bold>
            {kid.name}: {kind === 'level' ? `level ${levelFor(kid.xp).level}` : `${kid.assistPoints} pts`}
          </Text>
        ))}
      </Card>
    </section>
  );
}

type SheetKind = 'goal' | MilestoneKind;

export function TeamworkAdmin({ teamGoals, assists }: { teamGoals: boolean; assists: boolean }) {
  const home = useHome();
  const goals = useTeamGoals();
  const milestones = useMilestones();
  const confirm = useConfirm();
  const sheet = useSheet<SheetKind, TeamGoal | Milestone>();
  const kids = home.data?.kids ?? [];

  const createGoal = useAction(endpoints.createTeamGoal, { invalidate: TEAM_KEYS, success: 'Team goal started!' });
  const updateGoal = useAction(endpoints.updateTeamGoal, { invalidate: TEAM_KEYS, success: 'Saved' });
  const archiveGoal = useAction(endpoints.archiveTeamGoal, { invalidate: TEAM_KEYS });
  const createMs = useAction(endpoints.createMilestone, { invalidate: MILESTONE_KEYS, success: 'Prize added!' });
  const updateMs = useAction(endpoints.updateMilestone, { invalidate: MILESTONE_KEYS, success: 'Saved' });
  const archiveMs = useAction(endpoints.archiveMilestone, { invalidate: MILESTONE_KEYS });

  const editingGoal = sheet.open === 'goal' ? (sheet.target as TeamGoal | null) : null;
  const msKind: MilestoneKind | null = sheet.open === 'helper' || sheet.open === 'level' ? sheet.open : null;
  const editingMs = msKind ? (sheet.target as Milestone | null) : null;
  const remove = async (what: string, run: () => Promise<unknown>) => {
    if (await confirm({ title: `Remove this ${what}?`, message: 'Kids will no longer see it.', confirmText: 'Remove', danger: true })) {
      await run();
      sheet.close();
    }
  };

  if (!kids.length) return null;
  const allMilestones = milestones.data?.milestones ?? [];

  return (
    <>
      {teamGoals && (
        <section>
          <SectionTitle
            icon={<IconSparkle size={22} />}
            action={
              <Button size="sm" icon={<IconPlus size={18} />} onClick={() => sheet.show('goal', null)}>
                New
              </Button>
            }
          >
            Team goals
          </SectionTitle>
          {(goals.data?.goals ?? []).length === 0 ? (
            <EmptyState art={<Sticker kind="reward" id="themepark" title="" size={90} />} title="Win a prize together">
              Pick a big prize. Every approved quest adds team points, weighted by each kid's boost.
            </EmptyState>
          ) : (
            <motion.div variants={stagger} initial="hidden" animate="show" className="grid gap-3 lg:grid-cols-2">
              {goals.data!.goals.map((g) => (
                <TeamGoalCard
                  key={g.id}
                  goal={g}
                  kids={kids}
                  action={
                    g.status === 'active' && (
                      <Button size="sm" variant="secondary" onClick={() => sheet.show('goal', g)}>
                        Edit
                      </Button>
                    )
                  }
                />
              ))}
            </motion.div>
          )}
        </section>
      )}

      {(assists ? (['level', 'helper'] as const) : (['level'] as const)).map((kind) => (
        <MilestoneSection
          key={kind}
          kind={kind}
          kids={kids}
          milestones={allMilestones.filter((m) => m.kind === kind)}
          onNew={() => sheet.show(kind, null)}
          onEdit={(m) => sheet.show(kind, m)}
        />
      ))}

      <Sheet open={sheet.open === 'goal'} onClose={sheet.close} title={editingGoal ? 'Edit team goal' : 'New team goal'}>
        {sheet.open === 'goal' && (
          <TeamGoalForm
            key={editingGoal?.id ?? 'new'}
            goal={editingGoal}
            kids={kids}
            busy={createGoal.busy || updateGoal.busy}
            onSubmit={async (b) => {
              await (editingGoal ? updateGoal.run(editingGoal.id, b) : createGoal.run(b));
              celebrate('done');
              sheet.close();
            }}
            onDelete={editingGoal ? () => void remove('team goal', () => archiveGoal.run(editingGoal.id)) : undefined}
          />
        )}
      </Sheet>
      <Sheet open={!!msKind} onClose={sheet.close} title={msKind ? `${editingMs ? 'Edit' : 'New'} ${MILESTONE_KINDS[msKind].sheetTitle.toLowerCase()}` : ''}>
        {msKind && (
          <MilestoneForm
            kind={msKind}
            key={editingMs?.id ?? 'new'}
            milestone={editingMs}
            busy={createMs.busy || updateMs.busy}
            onSubmit={async (b) => {
              await (editingMs ? updateMs.run(editingMs.id, b) : createMs.run({ ...b, kind: msKind! }));
              celebrate('done');
              sheet.close();
            }}
            onDelete={editingMs ? () => void remove('milestone', () => archiveMs.run(editingMs.id)) : undefined}
          />
        )}
      </Sheet>
    </>
  );
}
