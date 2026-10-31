import { GROWTH_PERIOD_DAYS } from '@kk/shared';
import { PiggyBank, Rocket } from '@art';
import { Reveal } from './Reveal';
import { Card, Chip, SectionHeading } from './ui';

/**
 * Piggy vs rocket, drawn as two little paths. Decorative, not data: the shapes
 * show steady vs bumpy, the words carry the meaning.
 */
const WEEKS = 10;
const piggy = Array.from({ length: WEEKS }, (_, i) => 100 * Math.pow(1.02, i));
// A fixed, hand-picked swing so the picture is the same on every render.
const SWINGS = [0, 6, -4, 9, -7, 5, 8, -3, 7, 4];
const rocket = SWINGS.reduce<number[]>((acc, pct, i) => [...acc, i === 0 ? 100 : acc[i - 1] * (1 + pct / 100)], []);

function Path({ values, stroke }: { values: number[]; stroke: string }) {
  const min = 85;
  const max = 130;
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * 280 + 10},${110 - ((v - min) / (max - min)) * 100}`);
  return (
    <svg viewBox="0 0 300 120" className="h-auto w-full" aria-hidden="true">
      {[30, 60, 90].map((y) => (
        <path key={y} d={`M10 ${y} H290`} stroke="rgb(var(--line))" strokeWidth="2" strokeDasharray="4 6" />
      ))}
      <polyline points={pts.join(' ')} fill="none" stroke="rgb(var(--ink))" strokeWidth="9" strokeLinejoin="round" strokeLinecap="round" />
      <polyline points={pts.join(' ')} fill="none" stroke={stroke} strokeWidth="5" strokeLinejoin="round" strokeLinecap="round" />
      {pts.map((p, i) => {
        const [x, y] = p.split(',');
        return <circle key={i} cx={x} cy={y} r="4.5" fill="rgb(var(--surface))" stroke="rgb(var(--ink))" strokeWidth="2.5" />;
      })}
    </svg>
  );
}

export function TwoWaysToGrow() {
  return (
    <section className="px-4 py-20 sm:px-6 sm:py-28">
      <SectionHeading
        eyebrow="Two ways to grow"
        title="Steady piggy, or a ride on the rocket?"
        subtitle={`Every ${GROWTH_PERIOD_DAYS} days, saved coins grow. The piggy bank always goes up a little. The rocket fund might zoom or dip. Kids get to feel the difference between saving and risk, with coins, not real stakes.`}
      />
      <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2">
        <Reveal>
          <Card tone="brand" pad="lg" className="h-full">
            <div className="flex items-center justify-between">
              <PiggyBank size={88} />
              <Chip>Steady</Chip>
            </div>
            <h3 className="mt-3 font-display text-2xl font-bold text-ink">Piggy bank</h3>
            <p className="mt-1 text-ink-soft">A small, sure bonus every week at the interest rate you pick.</p>
            <div className="mt-5 rounded-2xl border-2 border-ink bg-surface p-3">
              <Path values={piggy} stroke="rgb(var(--brand))" />
            </div>
          </Card>
        </Reveal>
        <Reveal delay={0.08}>
          <Card tone="good" pad="lg" className="h-full">
            <div className="flex items-center justify-between">
              <Rocket size={88} />
              <Chip>Bumpy</Chip>
            </div>
            <h3 className="mt-3 font-display text-2xl font-bold text-ink">Rocket fund</h3>
            <p className="mt-1 text-ink-soft">A random swing each week, inside the lowest and highest you allow.</p>
            <div className="mt-5 rounded-2xl border-2 border-ink bg-surface p-3">
              <Path values={rocket} stroke="rgb(var(--good-deep))" />
            </div>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}
