import { Coin, HillsBand, SceneAllDone, Sparkle } from '@art';
import { APP_LINKS } from '@/lib/site';
import { Floating, Reveal } from './Reveal';
import { ButtonLink, SignupButton } from './ui';

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden border-t-[2.5px] border-ink bg-gradient-to-b from-coin-light to-bg px-4 pb-44 pt-20 text-center sm:px-6 sm:pt-28">
      <Floating className="absolute left-[8%] top-16 hidden sm:block" delay={0.4}>
        <Coin size={56} />
      </Floating>
      <Floating className="absolute right-[10%] top-24 hidden sm:block" delay={1.2}>
        <Sparkle size={44} />
      </Floating>
      <Reveal className="mx-auto max-w-2xl">
        <div className="flex justify-center">
          <SceneAllDone size={240} />
        </div>
        <h2 className="mt-4 text-balance font-display text-[2.25rem] font-bold leading-[1.08] text-ink sm:text-6xl">Ready for the first quest?</h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-ink-soft sm:text-xl">
          Set up your family in a few minutes. Your kids can be earning their first coins tonight.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <SignupButton size="lg" className="w-full sm:w-auto">
            Start your family free
          </SignupButton>
          <ButtonLink href={APP_LINKS.login} variant="secondary" size="lg" className="w-full sm:w-auto">
            Grown-up sign in
          </ButtonLink>
        </div>
        <p className="mt-5 text-sm font-bold text-ink-soft">
          Works in any web browser today. iPhone and Android apps are coming soon.
        </p>
      </Reveal>
      <HillsBand height={144} className="absolute bottom-0 left-0" />
    </section>
  );
}
