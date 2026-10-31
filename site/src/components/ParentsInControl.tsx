import { DEFAULT_FEATURES, FEATURES, type Feature } from '@kk/shared';
import { IconSettings, SceneFamily } from '@art';
import { Reveal } from './Reveal';
import { Card, SectionHeading, Tick } from './ui';

/**
 * Typed against FEATURES, so a new family switch fails the site's typecheck
 * until it has a label here. (The app's own labels live in
 * client/src/pages/parent/ParentSettings.tsx; they belong in @kk/shared.)
 */
const FEATURE_LABELS: Record<Feature, string> = {
  shop: 'Family shop',
  piggy: 'Piggy bank',
  rocket: 'Rocket fund',
  chest: 'Daily chest',
  goals: 'Savings goals',
  teamGoals: 'Team goals',
  assists: 'Helper points',
  learn: 'Money school',
};

const CONTROLS = [
  'Turn any part of the app on or off for your family.',
  'Set what a star is worth, the piggy interest rate, and how far the rocket can swing.',
  'Approve every finished quest, or trust a kid with a quest so it pays straight away.',
  'Every shop purchase waits for you. Decline it and the coins go back.',
  'Open the whole lesson library, or show only the lessons you assign.',
  'Send a gift any time, and see every coin that moves in the activity feed.',
];

/** A toggle drawn like the app's, decorative only. */
function Toggle({ on }: { on: boolean }) {
  return (
    <span aria-hidden="true" className={`relative inline-flex h-7 w-12 flex-none items-center rounded-full border-2 border-ink ${on ? 'bg-good' : 'bg-surface-sunk'}`}>
      <span className={`absolute h-5 w-5 rounded-full border-2 border-ink bg-surface transition-transform ${on ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
    </span>
  );
}

export function ParentsInControl() {
  return (
    <section id="parents" className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading
            align="left"
            eyebrow="For grown-ups"
            title="Your family, your rules"
            subtitle="Kid Kapital is a game for kids and a control panel for you. Nothing pays out, grows or changes without a setting you chose."
          />
          <ul className="mt-8 flex flex-col gap-3 text-lg text-ink-soft">
            {CONTROLS.map((c) => (
              <Tick key={c}>{c}</Tick>
            ))}
          </ul>
        </div>

        <Reveal className="relative sm:mt-16 lg:mt-0">
          <div className="absolute -top-[104px] right-4 z-10 hidden sm:block" aria-hidden="true">
            <SceneFamily size={170} />
          </div>
          <Card pad="lg" className="relative" role="img" aria-label="Family settings: a switch for each part of the app">
            <div className="flex items-center gap-2">
              <IconSettings size={28} />
              <span className="font-display text-xl font-bold text-ink">Family settings</span>
            </div>
            <ul className="mt-4 divide-y-2 divide-line">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-center justify-between gap-4 py-2.5">
                  <span className="font-bold text-ink">{FEATURE_LABELS[f]}</span>
                  {/* One switch shown off, to show that it is a choice. */}
                  <Toggle on={f === 'assists' ? false : DEFAULT_FEATURES[f]} />
                </li>
              ))}
            </ul>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}
