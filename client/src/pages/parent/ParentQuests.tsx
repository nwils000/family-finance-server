// Quest manager: every active quest, filtered by kid, with one form for
// creating and editing, plus quick-start templates for popular chores.
import { useState } from 'react';
import { motion } from 'framer-motion';
import { autoApproves, defaultRewardCents, MAX_STARS, WEEKDAYS, toDateKey, type QuestIconId, type Repeat } from '@kk/shared';
import { IconPlus, IconSparkle, IconTrash, QuestIcon, QUEST_LABELS, SceneWelcome, Star } from '@/art';
import {
  AmountPicker,
  Button,
  Card,
  EmptyState,
  Field,
  Input,
  Money,
  SectionTitle,
  Segmented,
  Sheet,
  Text,
  Toggle,
  useConfirm,
  KidChips,
} from '@/components/ui';
import { Sticker, StickerPicker, useStickerChoice } from '@/features/stickers';
import { QuestCard } from '@/features/cards';
import { endpoints } from '@/lib/api';
import { celebrate } from '@/lib/celebrate';
import { spring, stagger } from '@/lib/motion';
import { qk, useAction, useAllQuests, useHome } from '@/lib/queries';
import type { KidRef, Quest } from '@/lib/types';
import { PageIntro, useSheet } from './parts';

/* ---------- The draft both create and edit work on ---------- */

interface QuestDraft {
  /** Null means no picture: the quest shows a letter tile. */
  icon: QuestIconId | null;
  title: string;
  stars: number;
  /** Null means "use the family's star value". */
  rewardCents: number | null;
  repeat: Repeat;
  /** Trusted quest: pays on "I did it!" without a grown-up check. */
  autoApprove: boolean;
}

const dayOffset = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return toDateKey(d);
};

const WEEKDAYS_MON_TO_FRI = [1, 2, 3, 4, 5];

/** Popular chores, one tap to prefill the form. Titles come from the art labels. */
const QUICK_START: (Omit<QuestDraft, 'title' | 'rewardCents' | 'icon' | 'autoApprove'> & { icon: QuestIconId })[] = [
  { icon: 'bed', stars: 1, repeat: { kind: 'daily' } },
  { icon: 'toothbrush', stars: 1, repeat: { kind: 'daily' } },
  { icon: 'dishes', stars: 2, repeat: { kind: 'daily' } },
  { icon: 'homework', stars: 2, repeat: { kind: 'weekly', days: WEEKDAYS_MON_TO_FRI } },
  { icon: 'toys', stars: 1, repeat: { kind: 'daily' } },
  { icon: 'trash', stars: 2, repeat: { kind: 'weekly', days: [1, 4] } },
  { icon: 'dog', stars: 2, repeat: { kind: 'daily' } },
  { icon: 'carwash', stars: 4, repeat: { kind: 'weekly', days: [6] } },
];

const fromTemplate = (t: (typeof QUICK_START)[number]): QuestDraft => ({ ...t, title: QUEST_LABELS[t.icon], rewardCents: null, autoApprove: false });

const BLANK: QuestDraft = { icon: null, title: '', stars: 2, rewardCents: null, repeat: { kind: 'daily' }, autoApprove: false };

const DIFFICULTY = ['Super easy', 'Easy', 'Medium', 'Hard', 'Epic'] as const;

/* ---------- Tap-to-rate stars ---------- */

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: MAX_STARS }, (_, i) => (
        <Button key={i} variant="ghost" size="icon" aria-label={`${i + 1} stars`} aria-pressed={i < value} onClick={() => onChange(i + 1)}>
          <motion.span animate={{ scale: i < value ? 1.1 : 0.9, rotate: i < value ? 0 : -8 }} transition={spring}>
            <Star size={34} filled={i < value} />
          </motion.span>
        </Button>
      ))}
    </div>
  );
}

/* ---------- One form for both create and edit ---------- */

type RepeatKind = Repeat['kind'];

function QuestForm({
  initial,
  kids,
  initialKids,
  starValueCents,
  busy,
  onSubmit,
  onDelete,
}: {
  initial: QuestDraft;
  /** Only when creating: who gets the quest. Editing changes one kid's quest. */
  kids?: KidRef[];
  initialKids?: string[];
  starValueCents: number;
  busy: boolean;
  onSubmit: (d: QuestDraft, kidIds: string[]) => void;
  onDelete?: () => void;
}) {
  const { icon, title, setTitle, pick: pickIcon } = useStickerChoice('quest', initial.icon, initial.title);
  const [stars, setStars] = useState(initial.stars);
  const [custom, setCustom] = useState(initial.rewardCents !== null);
  const [trusted, setTrusted] = useState(initial.autoApprove);
  const [reward, setReward] = useState(initial.rewardCents ?? defaultRewardCents(initial.stars, starValueCents));
  const [kind, setKind] = useState<RepeatKind>(initial.repeat.kind);
  const [days, setDays] = useState<number[]>(initial.repeat.kind === 'weekly' ? initial.repeat.days : [new Date().getDay()]);
  const [date, setDate] = useState(initial.repeat.kind === 'once' ? initial.repeat.date : dayOffset(0));
  const [kidIds, setKidIds] = useState<string[]>(initialKids ?? []);

  const toggleDay = (d: number) => setDays((ds) => (ds.includes(d) ? ds.filter((x) => x !== d) : [...ds, d].sort()));
  const toggleKid = (id: string | null) => id && setKidIds((ks) => (ks.includes(id) ? ks.filter((x) => x !== id) : [...ks, id]));

  const repeat: Repeat = kind === 'daily' ? { kind } : kind === 'weekly' ? { kind, days } : { kind, date };
  const defaultReward = defaultRewardCents(stars, starValueCents);
  const problem = !title.trim()
    ? 'Give the quest a name'
    : kind === 'weekly' && days.length === 0
      ? 'Pick at least one day'
      : kids && kidIds.length === 0
        ? 'Pick at least one kid'
        : null;

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        if (!problem) onSubmit({ icon, title: title.trim(), stars, rewardCents: custom ? reward : null, repeat, autoApprove: trusted }, kidIds);
      }}
    >
      <div className="flex items-center gap-3">
        <motion.span key={icon} initial={{ scale: 0.6, rotate: -12 }} animate={{ scale: 1, rotate: 0 }} transition={spring}>
          <Sticker kind="quest" id={icon} title={title} size={72} />
        </motion.span>
        <div className="flex-1">
          <Field label="Quest name">
            {(id) => <Input id={id} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Make your bed" maxLength={60} autoComplete="off" />}
          </Field>
        </div>
      </div>

      <StickerPicker kind="quest" value={icon} onChange={pickIcon} />

      <div className="flex flex-col gap-1">
        <Text tone="ink" size="sm" bold className="font-display tracking-wide">
          How hard is it? <Text as="span" size="sm" tone="brand">{DIFFICULTY[stars - 1]}</Text>
        </Text>
        <StarPicker value={stars} onChange={setStars} />
      </div>

      <Card tone="coin" sticker={false} pad="sm" className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <Text tone="ink" size="sm" bold>
              Reward
            </Text>
            {!custom && (
              <Text size="xs" tone="soft" className="inline-flex flex-wrap items-center gap-1">
                {stars} {stars === 1 ? 'star' : 'stars'} x <Money cents={starValueCents} size="sm" coin={false} /> =
                <Money cents={defaultReward} size="sm" />
              </Text>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Text size="xs" as="span">
              Custom
            </Text>
            <Toggle
              label="Custom reward"
              checked={custom}
              onChange={(v) => {
                if (v) setReward(defaultReward);
                setCustom(v);
              }}
            />
          </div>
        </div>
        {custom && <AmountPicker value={reward} onChange={setReward} max={1_000_000} steps={[5, 25, 100]} />}
      </Card>

      <div className="flex flex-col gap-2">
        <Text tone="ink" size="sm" bold className="font-display tracking-wide">
          When?
        </Text>
        <Segmented<RepeatKind>
          value={kind}
          onChange={setKind}
          options={[
            { value: 'once', label: 'Once' },
            { value: 'daily', label: 'Every day' },
            { value: 'weekly', label: 'Some days' },
          ]}
        />
        {kind === 'weekly' && (
          <div className="grid grid-cols-7 gap-1">
            {WEEKDAYS.map((d, i) => (
              <Button key={d} size="sm" className="px-0" variant={days.includes(i) ? 'primary' : 'secondary'} aria-pressed={days.includes(i)} onClick={() => toggleDay(i)}>
                {d.slice(0, 2)}
              </Button>
            ))}
          </div>
        )}
        {kind === 'once' && (
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" variant={date === dayOffset(0) ? 'primary' : 'secondary'} onClick={() => setDate(dayOffset(0))}>
              Today
            </Button>
            <Button size="sm" variant={date === dayOffset(1) ? 'primary' : 'secondary'} onClick={() => setDate(dayOffset(1))}>
              Tomorrow
            </Button>
            <div className="min-w-[160px] flex-1">
              <Input type="date" aria-label="Pick a day" value={date} min={dayOffset(0)} onChange={(e) => e.target.value && setDate(e.target.value)} />
            </div>
          </div>
        )}
      </div>

      <Card tone="good" sticker={false} pad="sm" className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <Text tone="ink" size="sm" bold>
            Trust this quest
          </Text>
          <Text size="xs">Pays out the moment they tap "I did it!", no check from you. Great for chores you never need to inspect.</Text>
        </div>
        <Toggle checked={trusted} onChange={setTrusted} label="Trust this quest" />
      </Card>

      {kids && (
        <div className="flex flex-col gap-2">
          <Text tone="ink" size="sm" bold className="font-display tracking-wide">
            Who is it for?
          </Text>
          <KidChips kids={kids} selected={kidIds} onToggle={toggleKid} />
          {kidIds.length > 1 && <Text size="xs" tone="faint">Each kid gets their own copy to finish.</Text>}
        </div>
      )}

      <div className="flex flex-col gap-2">
        {problem && (
          <Text size="sm" tone="faint" className="text-center">
            {problem}
          </Text>
        )}
        <Button type="submit" size="lg" block busy={busy} disabled={!!problem}>
          {onDelete ? 'Save quest' : 'Create quest'}
        </Button>
        {onDelete && (
          <Button variant="ghost" icon={<IconTrash size={18} />} className="text-bad-deep" onClick={onDelete}>
            Delete quest
          </Button>
        )}
      </div>
    </form>
  );
}

/* ---------- Page ---------- */

type SheetKind = 'create' | 'edit';

/** Changing a quest changes the list, every kid's day, and what can be approved. */
const QUEST_KEYS = [qk.allQuests, ['day'], qk.approvals] as const;

export default function ParentQuests() {
  const home = useHome();
  const all = useAllQuests();
  const confirm = useConfirm();
  const sheet = useSheet<SheetKind, { quest?: Quest; draft: QuestDraft }>();
  const [filter, setFilter] = useState<string | null>(null);

  const create = useAction(endpoints.createQuest, { invalidate: QUEST_KEYS });
  const update = useAction(endpoints.updateQuest, { invalidate: QUEST_KEYS, success: 'Quest saved!' });
  const archive = useAction(endpoints.archiveQuest, { invalidate: QUEST_KEYS });

  const family = home.data?.family;
  const kids = home.data?.kids ?? [];
  if (!family) return null;
  const kidById = new Map(kids.map((k) => [k.id, k]));
  const quests = (all.data?.quests ?? []).filter((q) => !filter || q.kidId === filter);

  const openCreate = (draft: QuestDraft = BLANK) => sheet.show('create', { draft });
  const openEdit = (quest: Quest) => {
    // A reward that differs from stars x star value was set by hand.
    const custom = quest.rewardCents !== defaultRewardCents(quest.stars, family.starValueCents);
    sheet.show('edit', { quest, draft: { ...quest, rewardCents: custom ? quest.rewardCents : null } });
  };

  const onSubmit = async (d: QuestDraft, kidIds: string[]) => {
    const editing = sheet.target?.quest;
    const base = { title: d.title, icon: d.icon, stars: d.stars, repeat: d.repeat, autoApprove: d.autoApprove };
    if (editing) {
      // The server only fills in the default reward on create, so an edit always sends the amount.
      await update.run(editing.id, { ...base, rewardCents: d.rewardCents ?? defaultRewardCents(d.stars, family.starValueCents) });
    } else {
      await create.run({ ...base, ...(d.rewardCents !== null ? { rewardCents: d.rewardCents } : {}), kidIds });
      celebrate('done');
    }
    sheet.close();
  };

  const onDelete = async () => {
    const q = sheet.target?.quest;
    if (!q) return;
    const ok = await confirm({
      title: `Delete "${q.title}"?`,
      message: 'It disappears from the quest list. Coins already earned stay put.',
      confirmText: 'Delete',
      danger: true,
    });
    if (!ok) return;
    await archive.run(q.id);
    sheet.close();
  };

  const swallow = (p: Promise<unknown>) => void p.catch(() => undefined);
  const editing = sheet.target?.quest;
  const editingKid = editing ? kidById.get(editing.kidId) : undefined;

  return (
    <div className="flex flex-col gap-6">
      <PageIntro
        title="Quests"
        art={<QuestIcon id="broom" size={64} />}
        action={
          kids.length > 0 && (
            <Button icon={<IconPlus size={20} />} onClick={() => openCreate({ ...BLANK })}>
              New
            </Button>
          )
        }
      >
        Chores and challenges that earn coins.
      </PageIntro>

      {kids.length === 0 ? (
        <EmptyState art={<SceneWelcome size={150} />} title="Add a kid first">
          Quests belong to kids. Head to the Family tab to add one, then come back here.
        </EmptyState>
      ) : (
        <>
          <section>
            <SectionTitle icon={<IconSparkle size={22} />}>Quick start</SectionTitle>
            <div className="scroll-quiet -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
              {QUICK_START.map((t) => (
                <Button
                  key={t.icon}
                  size="sm"
                  variant="secondary"
                  className="shrink-0"
                  icon={<QuestIcon id={t.icon} size={24} />}
                  onClick={() => openCreate(fromTemplate(t))}
                >
                  {QUEST_LABELS[t.icon]}
                </Button>
              ))}
            </div>
          </section>

          {kids.length > 1 && <KidChips kids={kids} all="Everyone" selected={filter ? [filter] : []} onToggle={setFilter} />}

          {all.data && quests.length === 0 ? (
            <EmptyState
              art={<SceneWelcome size={150} />}
              title="No quests yet"
              action={
                <Button icon={<IconPlus size={20} />} onClick={() => openCreate({ ...BLANK })}>
                  Make a quest
                </Button>
              }
            >
              Tap a quick start above or make your own.
            </EmptyState>
          ) : (
            <motion.div key={filter ?? 'all'} variants={stagger} initial="hidden" animate="show" className="grid gap-3 lg:grid-cols-2">
              {quests.map((q) => (
                <QuestCard key={q.id} quest={q} kid={kidById.get(q.kidId)} trusted={autoApproves(q, kidById.get(q.kidId) ?? {})} onClick={() => openEdit(q)} />
              ))}
            </motion.div>
          )}
        </>
      )}

      <Sheet open={sheet.open === 'create'} onClose={sheet.close} title="New quest">
        {sheet.target && (
          <QuestForm
            initial={sheet.target.draft}
            kids={kids}
            initialKids={filter ? [filter] : kids.map((k) => k.id)}
            starValueCents={family.starValueCents}
            busy={create.busy}
            onSubmit={(d, ids) => swallow(onSubmit(d, ids))}
          />
        )}
      </Sheet>
      <Sheet open={sheet.open === 'edit'} onClose={sheet.close} title={editingKid ? `${editingKid.name}'s quest` : 'Edit quest'}>
        {editing && sheet.target && (
          <QuestForm
            key={editing.id}
            initial={sheet.target.draft}
            starValueCents={family.starValueCents}
            busy={update.busy || archive.busy}
            onSubmit={(d) => swallow(onSubmit(d, []))}
            onDelete={() => swallow(onDelete())}
          />
        )}
      </Sheet>
    </div>
  );
}
