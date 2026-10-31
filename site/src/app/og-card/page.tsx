import type { Metadata } from 'next';
import { Coin, HillsBand, PiggyBank, Rocket, Sparkle, Sun } from '@art';
import { Logo } from '@/components/Logo';
import { KidPhone } from '@/components/PhoneMock';
import { TAGLINE } from '@/lib/site';

export const metadata: Metadata = { title: { absolute: 'Kid Kapital share card' }, robots: { index: false, follow: false } };

/**
 * The 1200x630 link-preview card, drawn with the real art. Not linked from
 * anywhere: `npm run og -w site` screenshots this page into public/og-image.png
 * (and the icon into public/apple-touch-icon.png). Re-run it after changing the
 * tagline or the art. Like Mentis, artwork stays inside a centered safe zone
 * so square crops (compact previews) still show the logo and the line.
 */
export default function OgCard() {
  const [first, second] = TAGLINE.split('. ');
  return (
    <div id="og" className="relative mx-auto h-[630px] w-[1200px] overflow-hidden bg-gradient-to-b from-brand-light to-bg">
      <div className="absolute right-[150px] top-[40px]">
        <Sun size={110} />
      </div>
      <div className="absolute left-[300px] top-[90px] flex h-[400px] w-[600px] flex-col items-center justify-center text-center">
        <Logo size={64} />
        <div className="mt-6 font-display text-[52px] font-bold leading-[1.05] text-ink">
          {first}.
          <br />
          <span className="text-brand">{second}</span>
        </div>
      </div>
      <div className="absolute left-[20px] top-[165px] -rotate-6 scale-[0.74]">
        <KidPhone />
      </div>
      <div className="absolute left-[300px] top-[430px]">
        <PiggyBank size={110} />
      </div>
      <div className="absolute right-[330px] top-[425px]">
        <Coin size={70} />
      </div>
      <div className="absolute right-[90px] top-[230px] rotate-12">
        <Rocket size={170} />
      </div>
      <div className="absolute right-[300px] top-[90px]">
        <Sparkle size={40} />
      </div>
      <HillsBand height={120} className="absolute bottom-0 left-0" />
    </div>
  );
}
