// Shop manager: the family's rewards with one form for creating and editing,
// a starter pack for an empty shop, and the latest purchases.
import { useState } from 'react';
import { motion } from 'framer-motion';
import { type RewardIconId } from '@kk/shared';
import { IconPlus, IconSparkle, IconTrash, RewardIcon, REWARD_LABELS, SceneEmptyShop } from '@/art';
import {
  AmountPicker,
  Button,
  Card,
  EmptyState,
  Field,
  Input,
  KidAvatar,
  Money,
  Pill,
  SectionTitle,
  Sheet,
  Text,
  useConfirm,
} from '@/components/ui';
import { Sticker, StickerPicker, useStickerChoice } from '@/features/stickers';
import { RewardCard } from '@/features/cards';
import { endpoints } from '@/lib/api';
import { celebrate } from '@/lib/celebrate';
import { popIn, spring, stagger } from '@/lib/motion';
import { qk, useAction, useHome, usePurchases, useRewards } from '@/lib/queries';
import type { Purchase, Reward } from '@/lib/types';
import { PageIntro, useSheet } from './parts';
import { TeamworkAdmin } from './TeamworkAdmin';

type RewardDraft = Omit<Reward, 'id'>;

const BLANK: RewardDraft = { icon: null, title: '', priceCents: 300 };

/** A sensible first shop. Titles come from the art labels. */
const STARTER_PACK: { icon: RewardIconId; priceCents: number }[] = [
  { icon: 'candy', priceCents: 100 },
  { icon: 'gamepad', priceCents: 200 },
  { icon: 'icecream', priceCents: 300 },
  { icon: 'moon', priceCents: 400 },
  { icon: 'movie', priceCents: 500 },
  { icon: 'toycar', priceCents: 1000 },
];

const STATUS: Record<Purchase['status'], { label: string; tone: 'brand' | 'good' | 'bad' }> = {
  pending: { label: 'Waiting', tone: 'brand' },
  fulfilled: { label: 'Handed over', tone: 'good' },
  declined: { label: 'Refunded', tone: 'bad' },
};

/* ---------- One form for both create and edit ---------- */

function RewardForm({
  initial,
  busy,
  onSubmit,
  onDelete,
}: {
  initial: RewardDraft;
  busy: boolean;
  onSubmit: (d: RewardDraft) => void;
  onDelete?: () => void;
}) {
  const { icon, title, setTitle, pick: pickIcon } = useStickerChoice('reward', initial.icon, initial.title);
  const [price, setPrice] = useState(initial.priceCents);

  const ready = title.trim().length > 0 && price >= 1;

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        if (ready) onSubmit({ icon, title: title.trim(), priceCents: price });
      }}
    >
      <div className="flex items-center gap-3">
        <motion.span key={icon} initial={{ scale: 0.6, rotate: 12 }} animate={{ scale: 1, rotate: 0 }} transition={spring}>
          <Sticker kind="reward" id={icon} title={title} size={72} />
        </motion.span>
        <div className="flex-1">
          <Field label="Reward name">
            {(id) => <Input id={id} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Pizza night" maxLength={60} autoComplete="off" />}
          </Field>
        </div>
      </div>
      <StickerPicker kind="reward" value={icon} onChange={pickIcon} />
      <Card tone="coin" sticker={false} pad="sm" className="flex flex-col gap-2">
        <Text tone="ink" size="sm" bold className="text-center font-display tracking-wide">
          Price
        </Text>
        <AmountPicker value={price} onChange={setPrice} min={5} max={1_000_000} steps={[25, 100, 500]} />
      </Card>
      <div className="flex flex-col gap-2">
        <Button type="submit" size="lg" block busy={busy} disabled={!ready}>
          {onDelete ? 'Save reward' : 'Add to the shop'}
        </Button>
        {onDelete && (
          <Button variant="ghost" icon={<IconTrash size={18} />} className="text-bad-deep" onClick={onDelete}>
            Remove from the shop
          </Button>
        )}
      </div>
    </form>
  );
}

/* ---------- Page ---------- */

const SHOP_KEYS = [qk.rewards] as const;

export default function ParentShop() {
  const rewards = useRewards();
  const purchases = usePurchases();
  const home = useHome();
  const confirm = useConfirm();
  const sheet = useSheet<'create' | 'edit', Reward>();
  const [stocking, setStocking] = useState(false);

  const create = useAction(endpoints.createReward, { invalidate: SHOP_KEYS });
  const update = useAction(endpoints.updateReward, { invalidate: SHOP_KEYS, success: 'Reward saved!' });
  const archive = useAction(endpoints.archiveReward, { invalidate: SHOP_KEYS });

  const list = rewards.data?.rewards ?? [];
  const kidById = new Map((home.data?.kids ?? []).map((k) => [k.id, k]));
  const recent = (purchases.data?.purchases ?? []).slice(0, 12);
  // The target stays set after closing, so the edit sheet keeps its content while it animates away.
  const editing = sheet.target;
  const swallow = (p: Promise<unknown>) => void p.catch(() => undefined);

  const onSubmit = async (d: RewardDraft) => {
    if (sheet.target && sheet.open === 'edit') await update.run(sheet.target.id, d);
    else {
      await create.run(d);
      celebrate('buy');
    }
    sheet.close();
  };

  const onDelete = async () => {
    const r = sheet.target;
    if (!r) return;
    const ok = await confirm({
      title: `Remove ${r.title}?`,
      message: 'Kids will not see it in the shop anymore. Past purchases stay in the list.',
      confirmText: 'Remove',
      danger: true,
    });
    if (!ok) return;
    await archive.run(r.id);
    sheet.close();
  };

  const stockStarterPack = async (el: Element) => {
    setStocking(true);
    try {
      for (const s of STARTER_PACK) await create.run({ icon: s.icon, title: REWARD_LABELS[s.icon], priceCents: s.priceCents });
      celebrate('chest', el);
    } finally {
      setStocking(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <PageIntro
        title="Prizes"
        art={<RewardIcon id="gift" size={64} />}
        action={
          <Button icon={<IconPlus size={20} />} onClick={() => sheet.show('create')}>
            New
          </Button>
        }
      >
        Shop rewards, team goals and helper prizes.
      </PageIntro>

      {rewards.data && list.length === 0 ? (
        <EmptyState
          art={<SceneEmptyShop size={160} />}
          title="The shelves are empty"
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <Button variant="coin" icon={<IconSparkle size={20} />} busy={stocking} onClick={(e) => swallow(stockStarterPack(e.currentTarget))}>
                Add a starter pack
              </Button>
              <Button variant="secondary" icon={<IconPlus size={20} />} onClick={() => sheet.show('create')}>
                Make my own
              </Button>
            </div>
          }
        >
          Start with {STARTER_PACK.length} favorites like treats, screen time and movie night. You can change any of them.
        </EmptyState>
      ) : (
        <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {list.map((r) => (
            <RewardCard key={r.id} reward={r} onClick={() => sheet.show('edit', r)} />
          ))}
        </motion.div>
      )}

      {recent.length > 0 && (
        <section>
          <SectionTitle>Recent purchases</SectionTitle>
          <motion.div variants={stagger} initial="hidden" animate="show">
            <Card pad="none" className="divide-y-2 divide-line overflow-hidden">
              {recent.map((p) => {
                const kid = kidById.get(p.kidId);
                return (
                  <motion.div key={p.id} variants={popIn} className="flex items-center gap-3 px-3 py-2.5">
                    <span className="relative shrink-0">
                      <RewardIcon id={p.icon} title={p.title} size={44} />
                      {kid && <KidAvatar avatar={kid.avatar} size={22} className="absolute -bottom-1 -right-1" />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <Text tone="ink" bold size="sm" className="truncate">
                        {p.title}
                      </Text>
                      <Text size="xs" tone="faint">
                        {kid?.name ?? 'A kid'}, {new Date(p.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </Text>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Money cents={p.priceCents} size="sm" coin={false} />
                      <Pill tone={STATUS[p.status].tone}>{STATUS[p.status].label}</Pill>
                    </div>
                  </motion.div>
                );
              })}
            </Card>
          </motion.div>
        </section>
      )}

      {home.data && <TeamworkAdmin teamGoals={home.data.family.features.teamGoals} assists={home.data.family.features.assists} />}

      <Sheet open={sheet.open === 'create'} onClose={sheet.close} title="New reward">
        <RewardForm initial={BLANK} busy={create.busy} onSubmit={(d) => swallow(onSubmit(d))} />
      </Sheet>
      <Sheet open={sheet.open === 'edit'} onClose={sheet.close} title="Edit reward">
        {editing && (
          <RewardForm
            key={editing.id}
            initial={editing}
            busy={update.busy || archive.busy}
            onSubmit={(d) => swallow(onSubmit(d))}
            onDelete={() => swallow(onDelete())}
          />
        )}
      </Sheet>
    </div>
  );
}
