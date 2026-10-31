// DEV ONLY (/art): every art export and every UI kit piece on one page, for
// design review. New art exports show up here automatically.
import { Component, useState, type ComponentType, type ReactNode } from 'react';
import { AVATARS, HATS, QUEST_ICONS, REWARD_ICONS, type AvatarId, type HatId } from '@kk/shared';
import * as Art from '@/art';
import type { ArtProps, PennyMood } from '@/art';
import {
  AmountPicker,
  Button,
  Card,
  ChoiceGrid,
  EmptyState,
  Field,
  Heading,
  Input,
  KidAvatar,
  LevelProgress,
  Money,
  PennySays,
  PinPad,
  Pill,
  ProgressBar,
  SectionTitle,
  Segmented,
  Sheet,
  Spinner,
  Stars,
  StatChip,
  StreakFlame,
  Text,
  Toggle,
  XpChip,
  useConfirm,
} from '@/components/ui';
import { ActivityList, QuestCard, RewardCard } from '@/features/cards';

// Typed as a full record so a new mood fails the build until it is listed here.
const MOODS = Object.keys({ happy: 1, cheer: 1, wow: 1, sleepy: 1, think: 1, sad: 1 } satisfies Record<PennyMood, 1>) as PennyMood[];

/** Exports that need props; each gets a hand-written showcase below instead of the generic tile. */
const CUSTOM = new Set(['Avatar', 'Hat', 'HatPreview', 'QuestIcon', 'RewardIcon', 'Penny', 'LevelShield', 'GoalJar', 'CoinJar', 'FlameBig', 'Gem', 'TreasureChest', 'Star', 'Hills', 'CoinFace']);

type AnyArt = ComponentType<ArtProps & { active?: boolean }>;
const components = (Object.entries(Art) as [string, unknown][])
  .filter(([name, v]) => typeof v === 'function' && /^[A-Z]/.test(name) && !CUSTOM.has(name))
  .map(([name, v]) => ({ name, C: v as AnyArt }));

const GROUPS: { title: string; match: (n: string) => boolean }[] = [
  { title: 'UI icons', match: (n) => n.startsWith('Icon') },
  { title: 'Quest stickers', match: (n) => n.startsWith('Quest') },
  { title: 'Reward stickers', match: (n) => n.startsWith('Reward') },
  { title: 'Badges', match: (n) => n.startsWith('Badge') },
  { title: 'Scenes', match: (n) => n.startsWith('Scene') },
];
const groupOf = (n: string) => GROUPS.find((g) => g.match(n))?.title ?? 'Money, game and decor';

class Safe extends Component<{ name: string; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <Text size="xs" tone="bad">
        {this.props.name} needs props
      </Text>
    ) : (
      this.props.children
    );
  }
}

function Tile({ name, children, wide }: { name: string; children: ReactNode; wide?: boolean }) {
  return (
    <Card pad="sm" sticker={false} className={wide ? 'col-span-2 flex flex-col items-center gap-2' : 'flex flex-col items-center gap-2'}>
      <div className="flex min-h-[96px] flex-wrap items-center justify-center gap-2">
        <Safe name={name}>{children}</Safe>
      </div>
      <Text size="xs" tone="ink" bold className="break-all text-center font-mono">
        {name}
      </Text>
    </Card>
  );
}

const Grid = ({ children }: { children: ReactNode }) => <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-3">{children}</div>;

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <Heading level={2} size="md" className="border-b-2 border-line pb-1">
        {title}
      </Heading>
      {children}
    </section>
  );
}

export default function ArtGallery() {
  const grouped = new Map<string, typeof components>();
  for (const c of components) grouped.set(groupOf(c.name), [...(grouped.get(groupOf(c.name)) ?? []), c]);

  return (
    <div className="min-h-full bg-bg px-4 py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <div className="flex items-center gap-4">
          <Art.Penny size={88} mood="cheer" />
          <div>
            <Heading level={1} size="xl">
              Kid Kapital art library
            </Heading>
            <Text>Every export from @/art plus the UI kit. Dev only.</Text>
          </div>
        </div>

        <Section title="Penny moods">
          <Grid>
            {MOODS.map((m) => (
              <Tile key={m} name={`Penny mood="${m}"`}>
                <Art.Penny size={96} mood={m} />
              </Tile>
            ))}
          </Grid>
        </Section>

        <Section title="Avatars and hats">
          <Grid>
            {AVATARS.map((id) => (
              <Tile key={id} name={`Avatar id="${id}"`}>
                <Art.Avatar id={id} size={80} />
                <Art.Avatar id={id} size={48} ring />
              </Tile>
            ))}
          </Grid>
          <Grid>
            {HATS.map((h) => (
              <Tile key={h.id} name={`HatPreview id="${h.id}" (Lv ${h.level})`}>
                <Art.HatPreview id={h.id} size={72} />
              </Tile>
            ))}
          </Grid>
          <Grid>
            {HATS.map((h, i) => (
              <Tile key={h.id} name={`Hat id="${h.id}" on ${AVATARS[i % AVATARS.length]}`}>
                <KidAvatar avatar={AVATARS[i % AVATARS.length] as AvatarId} hat={h.id as HatId} size={80} />
              </Tile>
            ))}
          </Grid>
        </Section>

        <Section title="Quest icons (QuestIcon id)">
          <Grid>
            {QUEST_ICONS.map((id) => (
              <Tile key={id} name={`${id}: ${Art.QUEST_LABELS[id]}`}>
                <Art.QuestIcon id={id} size={72} />
              </Tile>
            ))}
          </Grid>
        </Section>

        <Section title="Reward icons (RewardIcon id)">
          <Grid>
            {REWARD_ICONS.map((id) => (
              <Tile key={id} name={`${id}: ${Art.REWARD_LABELS[id]}`}>
                <Art.RewardIcon id={id} size={72} />
              </Tile>
            ))}
          </Grid>
        </Section>

        <Section title="Art with variants">
          <Grid>
            <Tile name="LevelShield level 1, 5, 10, 15, 20" wide>
              {[1, 5, 10, 15, 20].map((l) => (
                <Art.LevelShield key={l} level={l} size={56} />
              ))}
            </Tile>
            <Tile name="GoalJar fill 0, 0.5, 1" wide>
              {[0, 0.5, 1].map((f) => (
                <Art.GoalJar key={f} fill={f} size={72} />
              ))}
            </Tile>
            <Tile name="CoinJar fill 0, 0.5, 1" wide>
              {[0, 0.5, 1].map((f) => (
                <Art.CoinJar key={f} fill={f} size={72} />
              ))}
            </Tile>
            <Tile name="FlameBig intensity 0 to 3" wide>
              {[0, 1, 2, 3].map((n) => (
                <Art.FlameBig key={n} intensity={n} size={56} />
              ))}
            </Tile>
            <Tile name="Gem tone grape, sky">
              <Art.Gem tone="grape" size={56} />
              <Art.Gem tone="sky" size={56} />
            </Tile>
            <Tile name="TreasureChest open false, true">
              <Art.TreasureChest size={56} />
              <Art.TreasureChest size={56} open />
            </Tile>
            <Tile name="Star filled true, false">
              <Art.Star size={48} />
              <Art.Star size={48} filled={false} />
            </Tile>
          </Grid>
          <Tile name="Hills" wide>
            <Art.Hills className="h-28 w-full" preserveAspectRatio="none" />
          </Tile>
        </Section>

        {[...GROUPS.map((g) => g.title), 'Money, game and decor'].map((title) =>
          grouped.get(title)?.length ? (
            <Section key={title} title={title}>
              <Grid>
                {grouped.get(title)!.map(({ name, C }) => (
                  <Tile key={name} name={name}>
                    {title === 'UI icons' ? (
                      <>
                        <C size={36} />
                        <C size={36} active />
                      </>
                    ) : (
                      <C size={title === 'Scenes' ? 160 : 80} />
                    )}
                  </Tile>
                ))}
              </Grid>
            </Section>
          ) : null,
        )}

        <Section title="Badges (BADGES list)">
          <Grid>
            {Art.BADGES.map((b) => (
              <Tile key={b.id} name={`${b.id}: ${b.name}`}>
                <b.Art size={72} />
              </Tile>
            ))}
          </Grid>
        </Section>

        <UiKit />
      </div>
    </div>
  );
}

function UiKit() {
  const [seg, setSeg] = useState<'a' | 'b' | 'c'>('a');
  const [on, setOn] = useState(true);
  const [pick, setPick] = useState<string>('fox');
  const [amount, setAmount] = useState(250);
  const [sheet, setSheet] = useState(false);
  const confirm = useConfirm();
  const now = new Date().toISOString();

  return (
    <Section title="UI kit">
      <div className="grid gap-4 md:grid-cols-2">
        <Tile name="Button variants">
          {(['primary', 'coin', 'good', 'danger', 'secondary', 'ghost'] as const).map((v) => (
            <Button key={v} variant={v} size="sm">
              {v}
            </Button>
          ))}
          <Button size="sm" busy>
            busy
          </Button>
          <Button size="icon" variant="secondary" aria-label="Add">
            <Art.IconPlus />
          </Button>
        </Tile>
        <Tile name="Card tones">
          {(['plain', 'soft', 'brand', 'coin', 'good', 'bad'] as const).map((t) => (
            <Card key={t} tone={t} pad="sm">
              <Text size="xs" tone="ink" bold>
                {t}
              </Text>
            </Card>
          ))}
        </Tile>
        <Tile name="Heading sizes / Text tones">
          <div className="flex w-full flex-col gap-1">
            {(['xl', 'lg', 'md', 'sm', 'xs'] as const).map((s) => (
              <Heading key={s} size={s}>
                Heading {s}
              </Heading>
            ))}
            {(['ink', 'soft', 'faint', 'brand', 'good', 'bad'] as const).map((t) => (
              <Text key={t} tone={t} size="sm">
                Text tone {t}
              </Text>
            ))}
          </div>
        </Tile>
        <Tile name="Pill tones / Stars / Money">
          <div className="flex flex-col items-center gap-2">
            <div className="flex flex-wrap justify-center gap-1.5">
              {(['brand', 'coin', 'good', 'bad', 'plain', 'ink'] as const).map((t) => (
                <Pill key={t} tone={t}>
                  {t}
                </Pill>
              ))}
            </div>
            <Stars value={3} />
            <div className="flex flex-wrap items-center gap-3">
              <Money cents={1234} size="sm" />
              <Money cents={1234} size="md" />
              <Money cents={-250} signed size="md" />
              <Money cents={98765} size="lg" />
            </div>
          </div>
        </Tile>
        <Tile name="ProgressBar tones / Spinner">
          <div className="flex w-full flex-col gap-2">
            {(['brand', 'coin', 'good', 'sky'] as const).map((t, i) => (
              <ProgressBar key={t} tone={t} value={(i + 1) / 5} />
            ))}
            <Spinner className="self-center" />
          </div>
        </Tile>
        <Tile name="Field + Input / Toggle / Segmented">
          <div className="flex w-full flex-col gap-3">
            <Field label="Name" hint="A hint goes here">
              {(id) => <Input id={id} placeholder="Type here" />}
            </Field>
            <Toggle checked={on} onChange={setOn} label="Toggle" />
            <Segmented value={seg} onChange={setSeg} options={[{ value: 'a', label: 'One' }, { value: 'b', label: 'Two' }, { value: 'c', label: 'Three' }]} />
          </div>
        </Tile>
        <Tile name="ChoiceGrid (one locked)">
          <div className="w-full">
            <ChoiceGrid
              value={pick}
              onChange={setPick}
              columns={5}
              options={AVATARS.map((id, i) => ({ value: id, label: id, art: <Art.Avatar id={id} size={48} />, locked: i === 9 ? <Art.IconLock /> : undefined }))}
            />
          </div>
        </Tile>
        <Tile name="AmountPicker">
          <AmountPicker value={amount} onChange={setAmount} max={5000} />
        </Tile>
        <Tile name="PinPad">
          <PinPad onComplete={() => undefined} />
        </Tile>
        <Tile name="Sheet / useConfirm">
          <Button size="sm" onClick={() => setSheet(true)}>
            Open sheet
          </Button>
          <Button size="sm" variant="secondary" onClick={() => void confirm({ title: 'Are you sure?', message: 'This is useConfirm.', mood: 'wow' })}>
            Confirm
          </Button>
          <Sheet open={sheet} onClose={() => setSheet(false)} title="A sheet">
            <Text>Bottom sheet on phones, dialog on desktop.</Text>
          </Sheet>
        </Tile>
        <Tile name="KidAvatar / StreakFlame / StatChip / XpChip">
          <KidAvatar avatar="unicorn" hat="crown" size={64} ring />
          <StreakFlame streak={8} />
          <StatChip icon={<Art.Coin size={30} />} label="Coins">
            <Money cents={1250} coin={false} size="sm" />
          </StatChip>
          <XpChip xp={260} />
        </Tile>
        <Tile name="LevelProgress">
          <div className="w-full">
            <LevelProgress xp={150} />
          </div>
        </Tile>
        <Tile name="PennySays / SectionTitle">
          <div className="w-full">
            <SectionTitle icon={<Art.IconSparkle />} action={<Pill>action</Pill>}>
              Section title
            </SectionTitle>
            <PennySays mood="cheer">Penny explains things the playful way.</PennySays>
          </div>
        </Tile>
        <Tile name="EmptyState">
          <div className="w-full">
            <EmptyState art={<Art.SceneEmptyJar size={120} />} title="Nothing here yet" action={<Button size="sm">Do a thing</Button>}>
              A friendly explanation.
            </EmptyState>
          </div>
        </Tile>
        <Tile name="QuestCard (todo, done, approved)">
          <div className="flex w-full flex-col gap-2">
            <QuestCard quest={{ title: 'Make your bed', icon: 'bed', stars: 2, rewardCents: 50, repeat: { kind: 'daily' } }} action={<Button size="sm" variant="good">I did it!</Button>} />
            <QuestCard quest={{ title: 'Feed the dog', icon: 'dog', stars: 1, rewardCents: 25 }} status="done" />
            <QuestCard quest={{ title: 'Wash the car', icon: 'carwash', stars: 4, rewardCents: 200 }} status="approved" />
          </div>
        </Tile>
        <Tile name="RewardCard / ActivityList">
          <div className="grid w-full grid-cols-2 gap-2">
            <RewardCard reward={{ title: 'Pizza night', icon: 'pizza', priceCents: 500 }} action={<Button size="sm" variant="coin" block>Buy</Button>} />
            <RewardCard reward={{ title: 'New bike', icon: 'bike', priceCents: 9000 }} dim footer={<ProgressBar value={0.3} tone="coin" height="h-3" />} />
            <div className="col-span-2">
              <ActivityList
                items={[
                  { id: '1', kidId: 'k', amountCents: 50, kind: 'quest', label: 'Make your bed', pot: 'wallet', createdAt: now },
                  { id: '2', kidId: 'k', amountCents: 300, kind: 'deposit', label: 'Into Piggy bank', pot: 'piggy', createdAt: now },
                  { id: '3', kidId: 'k', amountCents: -40, kind: 'growth', label: 'Rocket dipped -4%', pot: 'rocket', createdAt: now },
                ]}
              />
            </div>
          </div>
        </Tile>
      </div>
    </Section>
  );
}
