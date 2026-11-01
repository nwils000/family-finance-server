import { Cloud, Coin, HillsBand, PiggyBank, Rocket, Sparkle, Sun } from '@art';
import { APP_LINKS } from '@/lib/site';
import { Enter, Floating } from './Reveal';
import { KidPhone, ParentPhone } from './PhoneMock';
import { ButtonLink, SignupButton, Tick } from './ui';

/** One promise, one picture, one button (the Mentis hero rule). */
const PROOF = ['Free for every family', 'No ads for kids, ever', 'Grown-ups control every setting'];

export function Hero() {
  const proof = PROOF;

  return (
    <section className="relative overflow-hidden pb-40 pt-24 sm:pb-48 sm:pt-32 lg:pt-36">
      {/* Sky: a soft brand wash, a sun and drifting clouds. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-light/70 via-bg to-bg" />
      <Floating className="absolute right-[6%] top-20 hidden sm:block" distance={6} rotate={0}>
        <Sun size={96} />
      </Floating>
      <Floating className="absolute left-[44%] top-24 hidden opacity-90 lg:block" distance={5} rotate={0} delay={1}>
        <Cloud size={84} />
      </Floating>
      <Floating className="absolute right-[38%] top-16 hidden opacity-80 lg:block" distance={4} rotate={0} delay={2}>
        <Cloud size={64} />
      </Floating>

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-6">
        <div className="text-center lg:text-left">
          <Enter delay={0}>
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-coin-light px-3 py-1.5 font-display text-sm font-semibold text-ink shadow-chunky-sm">
              <Coin size={20} />
              The money app kids actually want to open
            </span>
          </Enter>

          <Enter delay={0.05}>
          <h1
            className="text-balance font-display text-[2.75rem] font-bold leading-[1.02] tracking-tight text-ink sm:text-6xl lg:text-7xl"
          >
            Chores become quests. Coins become <span className="text-brand">know-how.</span>
          </h1>
          </Enter>

          <Enter delay={0.1}>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-lg leading-relaxed text-ink-soft sm:text-xl lg:mx-0">
            Kid Kapital turns family jobs into quests. Kids earn coins, spend them in your family shop, and watch savings grow in a
            piggy bank or a rocket fund, while short lessons teach how money really works.
          </p>
          </Enter>

          <Enter delay={0.15} className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <SignupButton size="lg" className="w-full sm:w-auto">
              Start your family free
            </SignupButton>
            <ButtonLink href={APP_LINKS.kidLogin} variant="coin" size="lg" className="w-full sm:w-auto" icon={<Coin size={26} />}>
              I&apos;m a kid!
            </ButtonLink>
          </Enter>

          <Enter delay={0.2}>
          <ul className="mx-auto mt-7 flex w-fit flex-col gap-2 text-left font-bold text-ink-soft sm:flex-row sm:flex-wrap sm:gap-x-6 lg:mx-0">
            {proof.map((p) => (
              <Tick key={p}>{p}</Tick>
            ))}
          </ul>
          </Enter>
        </div>

        {/* The picture: the kid's home screen in front, the grown-up inbox beside it. Both at
            full size, fanned so they overlap by a sliver of frame only: an inbox tucked behind
            the kid phone hid every avatar and name and read as cut off. Between lg and xl the
            text column is narrower than the stage, so the stage scales down (on an inner box:
            Enter animates its own transform, which would override a scale class). */}
        <Enter delay={0.1} from={{ opacity: 0, scale: 0.94, rotate: -2 }} className="flex justify-center">
          <div className="relative flex h-[640px] w-full max-w-[580px] flex-none justify-center sm:h-[700px] sm:w-[580px] lg:scale-[0.8] xl:scale-100">
            <ParentPhone className="absolute right-1 top-12 hidden rotate-[6deg] sm:block" />
            <KidPhone className="relative z-10 -rotate-2 sm:absolute sm:left-1 sm:top-0" />
            <Floating className="absolute -left-3 bottom-0 z-20 sm:left-2" delay={0.3}>
              <PiggyBank size={92} />
            </Floating>
            <Floating className="absolute -right-1 bottom-24 z-20 sm:-bottom-2 sm:right-0" delay={1.1} rotate={-8}>
              <Rocket size={96} />
            </Floating>
            <Floating className="absolute -top-4 left-1 z-20 sm:left-8" delay={0.7} distance={10}>
              <Coin size={52} />
            </Floating>
            <Floating className="absolute right-10 top-0 z-20" delay={1.6} distance={8}>
              <Sparkle size={40} />
            </Floating>
          </div>
        </Enter>
      </div>

      <HillsBand height={150} className="absolute bottom-0 left-0" />
    </section>
  );
}
