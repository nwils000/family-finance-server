import {
  AGE_BAND_NAMES,
  AGE_BANDS,
  LESSON_CATEGORIES,
  LESSON_CATEGORY_NAMES,
  LESSONS,
  findLesson,
  type AgeBand,
  type Lesson,
} from '@kk/shared';
import { LessonArt, Penny } from '@art';
import { Reveal } from './Reveal';
import { Card, Chip, SectionHeading, Tick, cx, type CardTone } from './ui';

/**
 * Money school, straight from the lesson library in @kk/shared: the count, the
 * age bands, the shelves and every title shown here are the app's own, so the
 * page can never advertise a lesson that does not exist.
 *
 * Server component on purpose: the library is large and none of it needs to
 * reach the browser as JavaScript.
 */

/** The lesson shown three ways. */
const SHOWCASE_ID = 'interest';

/** A spread across the shelves for the gallery. */
const GALLERY_IDS = ['earn', 'needs-wants', 'save', 'budget', 'stocks', 'supply-demand', 'scam', 'debit-vs-credit'];

const BAND_TONES: Record<AgeBand, CardTone> = { little: 'coin', middle: 'brand', teen: 'good' };

/** The version a visitor sees on a gallery card: the middle band when it exists. */
const card = (l: Lesson) => l.versions.middle ?? l.versions.teen ?? l.versions.little!;

export function MoneySchool() {
  const showcase = findLesson(SHOWCASE_ID);
  const gallery = GALLERY_IDS.map((id) => findLesson(id)).filter((l): l is Lesson => !!l);
  const shelves = LESSON_CATEGORIES.filter((c) => LESSONS.some((l) => l.category === c));

  return (
    <section id="school" className="relative overflow-hidden border-y-[2.5px] border-ink bg-brand-light px-4 py-20 sm:px-6 sm:py-28">
      <SectionHeading
        eyebrow={
          <>
            <Penny size={22} mood="think" /> Money school
          </>
        }
        title={`${LESSONS.length} little lessons on how money really works`}
        subtitle="Short, illustrated lessons with a quick quiz at the end. Every lesson is written for the age reading it, so a 6-year-old and a 13-year-old each get one that fits."
      />

      <div className="mx-auto mt-6 flex max-w-3xl flex-wrap justify-center gap-2">
        {AGE_BANDS.map((b) => (
          <Chip key={b} tone={BAND_TONES[b]}>
            {AGE_BAND_NAMES[b]}
          </Chip>
        ))}
      </div>

      {showcase && (
        <Reveal className="mx-auto mt-12 max-w-6xl">
          <Card pad="lg" className="grid items-center gap-8 lg:grid-cols-[280px_1fr]">
            <div className="mx-auto">
              <LessonArt id={showcase.art} size={260} />
            </div>
            <div>
              <h3 className="font-display text-2xl font-bold text-ink sm:text-3xl">One idea, written three ways</h3>
              <p className="mt-2 text-ink-soft">The same lesson grows up with your kid. Here is how the interest lesson reads at each age:</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {AGE_BANDS.filter((b) => showcase.versions[b]).map((b) => (
                  <Card key={b} tone={BAND_TONES[b]} pad="sm" sticker={false}>
                    <div className="text-xs font-extrabold uppercase tracking-wide text-ink-soft">{AGE_BAND_NAMES[b]}</div>
                    <div className="mt-1 font-display text-lg font-bold leading-tight text-ink">{showcase.versions[b]!.title}</div>
                    <div className="mt-1 text-sm text-ink-soft">{showcase.versions[b]!.blurb}</div>
                  </Card>
                ))}
              </div>
            </div>
          </Card>
        </Reveal>
      )}

      {/* The gallery scrolls sideways on a phone and wraps into a grid on a wide screen. */}
      <ul className="scroll-quiet -mx-4 mt-8 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-3 sm:mx-auto sm:grid sm:max-w-6xl sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
        {gallery.map((l, i) => (
          <li key={l.id} className="w-[220px] flex-none snap-start sm:w-auto">
            <Reveal delay={(i % 4) * 0.05} className="h-full">
              <Card pad="sm" className="flex h-full flex-col">
                <div className="flex items-center justify-center rounded-[20px] bg-surface-soft py-2">
                  <LessonArt id={l.art} size={150} />
                </div>
                <div className="mt-3 px-1 text-xs font-extrabold uppercase tracking-wide text-brand">{LESSON_CATEGORY_NAMES[l.category]}</div>
                <div className="px-1 font-display text-lg font-bold leading-tight text-ink">{card(l).title}</div>
                <div className="px-1 pb-1 text-sm text-ink-soft">{card(l).blurb}</div>
              </Card>
            </Reveal>
          </li>
        ))}
      </ul>

      <div className="mx-auto mt-10 grid max-w-6xl gap-6 lg:grid-cols-2">
        <Reveal>
          <Card pad="lg" className="h-full">
            <h3 className="font-display text-xl font-bold text-ink">Grown-ups pick, kids learn, coins follow</h3>
            <ul className="mt-4 flex flex-col gap-3 text-ink-soft">
              <Tick>Assign a lesson to a kid and set a coin reward for passing its quiz.</Tick>
              <Tick>Kids can retry a quiz until every answer is right, and earn XP the first time they pass.</Tick>
              <Tick>Lessons link back to the real thing: the interest lesson points to their own piggy bank.</Tick>
            </ul>
          </Card>
        </Reveal>
        <Reveal delay={0.08}>
          <Card pad="lg" className="h-full">
            <h3 className="font-display text-xl font-bold text-ink">{shelves.length} shelves, from first coins to first paycheck</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {shelves.map((c, i) => (
                <li key={c}>
                  <span className={cx('inline-block rounded-full border-2 border-ink px-3 py-1 text-sm font-bold text-ink', ['bg-coin-light', 'bg-brand-light', 'bg-good-light', 'bg-bad-light'][i % 4])}>
                    {LESSON_CATEGORY_NAMES[c]}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}
