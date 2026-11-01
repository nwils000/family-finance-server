// Family settings: the name, the color theme, which features kids see, the
// money rules, sound on this device, and signing out.
import { useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { FEATURES, THEMES, type Feature, type Features, type Theme } from '@kk/shared';
import { Coin, GoalJar, IconCheck, IconLearn, IconLogout, PiggyBank, QuestIcon, RewardIcon, Rocket, Star, TreasureChest, XpStar } from '@/art';
import {
  AmountPicker,
  Button,
  Card,
  ChoiceGrid,
  Field,
  Input,
  PennySays,
  SectionTitle,
  Stepper,
  Text,
  Toggle,
  useConfirm,
} from '@/components/ui';
import { endpoints } from '@/lib/api';
import { celebrate } from '@/lib/celebrate';
import { popIn, stagger } from '@/lib/motion';
import { prefs } from '@/lib/prefs';
import { qk, useAction, useHome } from '@/lib/queries';
import type { FamilySettings } from '@/lib/types';
import { CreatorCorner } from '@/features/creator';
import { AccountSecurityCard, YourDataCard } from '@/pages/account';
import { useSignOut } from '@/stores/auth';
import { FamilyCodeCard, InviteGrownUpCard, PageIntro } from './parts';

const THEME_NAMES: Record<Theme, string> = { grape: 'Grape', sky: 'Sky', mint: 'Mint', coral: 'Coral', sunny: 'Sunny' };

const FEATURE_INFO: Record<Feature, { title: string; blurb: string; art: ReactNode }> = {
  shop: { title: 'Family shop', blurb: 'Kids spend coins on rewards you set up, and you hand them over.', art: <RewardIcon id="gift" size={52} /> },
  piggy: { title: 'Piggy bank', blurb: 'Saved coins earn steady interest every week. Patience pays!', art: <PiggyBank size={52} /> },
  rocket: { title: 'Rocket fund', blurb: 'A bumpy ride: saved coins go up or down a bit each week, like investing.', art: <Rocket size={52} /> },
  chest: { title: 'Daily chest', blurb: 'Once you approve every quest for the day, a treasure chest opens with bonus XP.', art: <TreasureChest size={52} open /> },
  goals: { title: 'Savings goals', blurb: 'Kids pick something to save up for and watch the jar fill.', art: <GoalJar size={52} fill={0.6} /> },
  teamGoals: { title: 'Team goals', blurb: 'Big prizes the kids earn together. Effort counts, with a boost you set per kid.', art: <RewardIcon id="themepark" size={52} /> },
  learn: { title: 'Money school', blurb: 'Short lessons and quizzes about money, written for each kid\'s age. Each one earns XP, and coins if you like.', art: <IconLearn size={44} /> },
  assists: { title: 'Helper points', blurb: 'Kids who help a sibling earn helper points toward prizes. The doer keeps the coins.', art: <QuestIcon id="sibling" size={52} /> },
};

/** Settings saves refresh the home, which carries the family. */
const SETTINGS_KEYS = [qk.home] as const;

/* ---------- A chunky +/- stepper for whole percentages ---------- */

/** Percent settings use the kit Stepper; a + sign marks gains when the range can go negative. */
function PercentStepper({ label, value, onChange, min, max }: { label: string; value: number; onChange: (v: number) => void; min: number; max: number }) {
  return <Stepper label={label} value={value} onChange={onChange} min={min} max={max} format={(v) => `${v > 0 && min < 0 ? '+' : ''}${v}%`} />;
}

/* ---------- Sections ---------- */

type SaveSettings = (b: Parameters<typeof endpoints.updateSettings>[0]) => Promise<unknown>;

function FamilyName({ name, save, busy }: { name: string; save: SaveSettings; busy: boolean }) {
  const [draft, setDraft] = useState(name);
  const dirty = draft.trim() !== name && draft.trim().length > 0;
  return (
    <form
      className="flex items-end gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (dirty) void save({ name: draft.trim() }).catch(() => undefined);
      }}
    >
      <div className="flex-1">
        <Field label="Family name">{(id) => <Input id={id} value={draft} maxLength={60} onChange={(e) => setDraft(e.target.value)} />}</Field>
      </div>
      <Button type="submit" disabled={!dirty} busy={busy && dirty}>
        Save
      </Button>
    </form>
  );
}

function MoneyRules({ family, save, busy }: { family: FamilySettings; save: SaveSettings; busy: boolean }) {
  const [star, setStar] = useState(family.starValueCents);
  const [piggy, setPiggy] = useState(family.piggyRatePct);
  const [rocketMin, setRocketMin] = useState(family.rocketMinPct);
  const [rocketMax, setRocketMax] = useState(family.rocketMaxPct);
  const [levelBonus, setLevelBonus] = useState(family.levelUpBonusCents);
  const dirty =
    levelBonus !== family.levelUpBonusCents ||
    star !== family.starValueCents || piggy !== family.piggyRatePct || rocketMin !== family.rocketMinPct || rocketMax !== family.rocketMaxPct;

  return (
    <Card className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Star size={30} />
          <Text tone="ink" bold className="font-display">
            One star is worth
          </Text>
        </div>
        <AmountPicker value={star} onChange={setStar} min={1} max={10_000} steps={[5, 25, 100]} />
        <Text size="xs" tone="faint" className="text-center">
          New quests pay this much per star unless you set a custom reward. Existing quests keep their amount.
        </Text>
      </div>

      <div className="flex flex-col gap-2 border-t-2 border-line pt-4">
        <div className="flex items-center gap-2">
          <XpStar size={32} />
          <Text tone="ink" bold className="font-display">
            Leveling up pays
          </Text>
        </div>
        <AmountPicker value={levelBonus} onChange={setLevelBonus} min={0} max={10_000} steps={[5, 25, 100]} />
        <Text size="xs" tone="faint" className="text-center">
          {levelBonus === 0 ? 'No coin bonus for leveling up.' : 'Paid once for every level a kid reaches.'} For a bigger prize at a certain level, add a level prize on the Prizes page.
        </Text>
      </div>

      {family.features.piggy && (
        <div className="flex flex-col gap-2 border-t-2 border-line pt-4">
          <div className="flex items-center gap-2">
            <PiggyBank size={36} />
            <Text tone="ink" bold className="font-display">
              Piggy bank
            </Text>
          </div>
          <PercentStepper label="Weekly interest" value={piggy} onChange={setPiggy} min={0} max={50} />
          <Text size="xs" tone="faint">
            Coins in the piggy grow by {piggy}% every week, like a savings account.
          </Text>
        </div>
      )}

      {family.features.rocket && (
        <div className="flex flex-col gap-2 border-t-2 border-line pt-4">
          <div className="flex items-center gap-2">
            <Rocket size={36} />
            <Text tone="ink" bold className="font-display">
              Rocket fund
            </Text>
          </div>
          <PercentStepper label="Worst week" value={rocketMin} onChange={setRocketMin} min={-50} max={0} />
          <PercentStepper label="Best week" value={rocketMax} onChange={setRocketMax} min={0} max={100} />
          <Text size="xs" tone="faint">
            Each week the rocket lands somewhere between {rocketMin}% and +{rocketMax}%. A wider range is a wilder ride.
          </Text>
        </div>
      )}

      <Button
        block
        size="lg"
        disabled={!dirty}
        busy={busy && dirty}
        icon={<Coin size={24} />}
        onClick={(e) => {
          const el = e.currentTarget;
          void save({ starValueCents: star, piggyRatePct: piggy, rocketMinPct: rocketMin, rocketMaxPct: rocketMax, levelUpBonusCents: levelBonus })
            .then(() => celebrate('save', el))
            .catch(() => undefined);
        }}
      >
        {dirty ? 'Save money rules' : 'All saved'}
      </Button>
    </Card>
  );
}

/* ---------- Page ---------- */

export default function ParentSettings() {
  const { data } = useHome();
  const confirm = useConfirm();
  const signOut = useSignOut();
  const settings = useAction(endpoints.updateSettings, { invalidate: SETTINGS_KEYS, success: 'Saved!' });
  const quiet = useAction(endpoints.updateSettings, { invalidate: SETTINGS_KEYS });
  // Switches flip instantly; the override drops away once the refreshed family agrees.
  const [flipped, setFlipped] = useState<Partial<Features>>({});
  const [themeOver, setThemeOver] = useState<Theme | null>(null);
  const [sound, setSound] = useState(prefs.soundOn());

  if (!data) return null;
  const family = data.family;
  const features: Features = { ...family.features, ...flipped };
  const theme = themeOver ?? family.theme;

  const pickTheme = (theme: Theme) => {
    // Preview right away; the shell keeps it in sync with the saved family after that.
    document.documentElement.dataset.theme = theme;
    setThemeOver(theme);
    void quiet
      .run({ theme })
      .catch(() => {
        document.documentElement.dataset.theme = family.theme;
      })
      .finally(() => setThemeOver(null));
  };

  const flip = (f: Feature, on: boolean) => {
    setFlipped((x) => ({ ...x, [f]: on }));
    void quiet
      .run({ features: { [f]: on } })
      .catch(() => undefined)
      .finally(() => setFlipped(({ [f]: _, ...rest }) => rest));
  };

  const onSignOut = async () => {
    const ok = await confirm({ title: 'Sign out?', message: 'You can sign back in with your email and password.', confirmText: 'Sign out', mood: 'sleepy' });
    if (ok) await signOut();
  };

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="flex flex-col gap-6">
      <PageIntro title="Settings" art={<RewardIcon id="art" size={64} />}>
        Make Kid Kapital fit your family.
      </PageIntro>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <motion.section variants={popIn}>
            <SectionTitle>Your family</SectionTitle>
            <Card className="flex flex-col gap-4">
              <FamilyName key={family.name} name={family.name} save={settings.run} busy={settings.busy} />
            </Card>
          </motion.section>

          <motion.section variants={popIn}>
            <SectionTitle>Color theme</SectionTitle>
            <Card className="flex flex-col gap-3">
              <ChoiceGrid<Theme>
                columns={5}
                value={theme}
                onChange={pickTheme}
                options={THEMES.map((t) => ({
                  value: t,
                  label: THEME_NAMES[t],
                  art: (
                    <span data-theme={t} className="flex h-full w-full items-center justify-center rounded-xl border-2 border-ink bg-brand">
                      {theme === t && <IconCheck size={22} className="text-white" />}
                    </span>
                  ),
                }))}
              />
              <Text size="sm" className="text-center">
                {THEME_NAMES[theme]} it is! Everyone in the family sees this color.
              </Text>
            </Card>
          </motion.section>

          <motion.section variants={popIn}>
            <SectionTitle>Features</SectionTitle>
            <Card pad="none" className="divide-y-2 divide-line overflow-hidden">
              {FEATURES.map((f) => (
                <div key={f} className="flex items-center gap-3 px-4 py-3">
                  <span className={features[f] ? '' : 'opacity-40 grayscale'}>{FEATURE_INFO[f].art}</span>
                  <div className="min-w-0 flex-1">
                    <Text tone="ink" bold className="font-display">
                      {FEATURE_INFO[f].title}
                    </Text>
                    <Text size="xs">{FEATURE_INFO[f].blurb}</Text>
                  </div>
                  <Toggle label={FEATURE_INFO[f].title} checked={features[f]} onChange={(v) => flip(f, v)} />
                </div>
              ))}
            </Card>
          </motion.section>
        </div>

        <div className="flex flex-col gap-6">
          <motion.section variants={popIn}>
            <SectionTitle>Money rules</SectionTitle>
            <MoneyRules
              key={`${family.starValueCents}:${family.piggyRatePct}:${family.rocketMinPct}:${family.rocketMaxPct}:${family.levelUpBonusCents}`}
              family={{ ...family, features }}
              save={quiet.run}
              busy={quiet.busy}
            />
          </motion.section>

          <motion.section variants={popIn}>
            <SectionTitle>Family code</SectionTitle>
            <FamilyCodeCard code={family.code} canChange />
          </motion.section>

          <motion.section variants={popIn}>
            <SectionTitle>Invite a grown-up</SectionTitle>
            <InviteGrownUpCard />
          </motion.section>

          <motion.section variants={popIn}>
            <SectionTitle>Your account</SectionTitle>
            <AccountSecurityCard />
          </motion.section>

          <motion.section variants={popIn}>
            <SectionTitle>Your data</SectionTitle>
            <YourDataCard />
          </motion.section>

          <motion.section variants={popIn}>
            <SectionTitle>From the creator</SectionTitle>
            <CreatorCorner />
          </motion.section>

          <motion.section variants={popIn}>
            <SectionTitle>This device</SectionTitle>
            <Card className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <Text tone="ink" bold className="font-display">
                    Sounds
                  </Text>
                  <Text size="xs">Boops, coin jingles and cheers on this phone or computer.</Text>
                </div>
                <Toggle
                  label="Sounds"
                  checked={sound}
                  onChange={(v) => {
                    prefs.setSoundOn(v);
                    setSound(v);
                  }}
                />
              </div>
              <Button variant="secondary" block icon={<IconLogout size={20} />} onClick={() => void onSignOut()}>
                Sign out
              </Button>
            </Card>
          </motion.section>

          <PennySays mood="happy" size={56}>
            Changes save for the whole family right away. Kids see them the next time their screen refreshes.
          </PennySays>
        </div>
      </div>
    </motion.div>
  );
}
