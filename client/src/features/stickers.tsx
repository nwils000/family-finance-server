// The one picker for quest, reward and goal pictures, shared by every form that
// chooses one. Stickers are grouped into tabs, and "No picture" is always an option
// (the item then shows a letter tile made from its title).
import { useState } from 'react';
import { QUEST_ICON_GROUPS, REWARD_ICON_GROUPS, type QuestIconId, type RewardIconId } from '@kk/shared';
import { IconClose, QUEST_LABELS, QuestIcon, REWARD_LABELS, RewardIcon } from '@/art';
import { Chip, ChoiceGrid } from '@/components/ui';

export type StickerKind = 'quest' | 'reward';
type IdOf<K extends StickerKind> = K extends 'quest' ? QuestIconId : RewardIconId;

const GROUPS = { quest: QUEST_ICON_GROUPS, reward: REWARD_ICON_GROUPS } as const;
const LABELS: Record<StickerKind, Record<string, string>> = { quest: QUEST_LABELS, reward: REWARD_LABELS };

/** The default title for a sticker, or '' for "No picture". */
export const stickerLabel = (kind: StickerKind, id: string | null) => (id ? (LABELS[kind][id] ?? '') : '');

const NONE = '__none__';

/** A quest or reward picture (or its letter tile) at any size. */
export function Sticker({ kind, id, title, size = 52 }: { kind: StickerKind; id: string | null; title: string; size?: number }) {
  return kind === 'quest' ? (
    <QuestIcon id={id as QuestIconId | null} title={title} size={size} />
  ) : (
    <RewardIcon id={id as RewardIconId | null} title={title} size={size} />
  );
}

/**
 * Picture + title state for a form. Picking a sticker fills in its default title,
 * unless the grown-up or kid already typed a name of their own.
 */
export function useStickerChoice<K extends StickerKind>(kind: K, initialIcon: IdOf<K> | null, initialTitle: string) {
  const [icon, setIcon] = useState<IdOf<K> | null>(initialIcon);
  const [title, setTitle] = useState(initialTitle);
  const pick = (next: IdOf<K> | null) => {
    const typedOwn = title.trim() && title !== stickerLabel(kind, icon);
    if (!typedOwn && next) setTitle(stickerLabel(kind, next));
    setIcon(next);
  };
  return { icon, title, setTitle, pick };
}

export function StickerPicker<K extends StickerKind>({ kind, value, onChange }: { kind: K; value: IdOf<K> | null; onChange: (id: IdOf<K> | null) => void }) {
  const groups = GROUPS[kind] as Record<string, readonly string[]>;
  const names = Object.keys(groups);
  const [tab, setTab] = useState(() => names.find((g) => value && groups[g].includes(value)) ?? names[0]);

  const options = [...groups[tab].map((id) => ({ value: id, label: stickerLabel(kind, id), art: <Sticker kind={kind} id={id} title="" /> }))];

  return (
    <div className="flex flex-col gap-3">
      <div className="scroll-quiet -mx-1 flex gap-2 overflow-x-auto px-1 pb-1" role="tablist" aria-label="Picture groups">
        {names.map((g) => (
          <Chip key={g} role="tab" selected={tab === g} onClick={() => setTab(g)}>
            {g}
          </Chip>
        ))}
      </div>
      {/* A short scroll box keeps the rest of the form on the first screen of a phone. */}
      <div className="scroll-quiet -mx-1 max-h-56 overflow-y-auto overscroll-contain px-1 py-1">
        <ChoiceGrid
          columns={5}
          value={value ?? NONE}
          onChange={(v) => onChange(v === NONE ? null : (v as IdOf<K>))}
          options={[
            ...options,
            {
              value: NONE,
              label: 'No picture',
              art: (
                <span className="flex flex-col items-center gap-0.5 text-ink-soft">
                  <IconClose size={20} />
                  <span className="font-display text-xs font-bold">None</span>
                </span>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
