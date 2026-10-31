import { AGE_BAND_NAMES, AGE_BANDS, LESSONS, PAID_PLANS, PLAN_LIMITS, PLAN_NAMES } from '@kk/shared';

/**
 * The FAQ, once. The visible FAQ section and the FAQPage structured data in the
 * layout both read this list, so the page and what search engines see can never
 * say different things (the Mentis rule, see its lib/faq.ts).
 *
 * Numbers come from @kk/shared, never typed into the copy.
 */
const freeKids = PLAN_LIMITS.free.limits.kids;
const bands = AGE_BANDS.map((b) => AGE_BAND_NAMES[b].replace('Ages ', '')).join(', ');

export const FAQ: { q: string; a: string }[] = [
  {
    q: 'Is Kid Kapital real money?',
    a: 'Coins in Kid Kapital stand for the money your family agrees on. The app keeps the family ledger: what each kid earned, spent and saved. It never connects to a bank or card for your kids. When a kid buys a reward, a grown-up hands it over in real life.',
  },
  {
    q: 'What age is it for?',
    a: `Kids from preschool to the teen years. Money school writes every lesson for three age bands (${bands}), and grown-ups set each kid's age so they see the version that fits.`,
  },
  {
    q: 'How do kids sign in without an email?',
    a: 'Kids never need an email address. They enter your family code, tap their own avatar and type a 4-digit PIN. A few wrong guesses lock sign-in for a while, a little longer each time, until a grown-up changes the PIN.',
  },
  {
    q: 'Will my kids see ads or be asked to buy anything?',
    a: 'No. Kids never see ads, and they never see an upgrade screen or a paywall. Plans and billing live only on the grown-up side.',
  },
  {
    q: 'What is the rocket fund?',
    a: 'A safe taste of investing. Coins in the rocket go up or down a little each week, inside a range a grown-up sets. Next to the steady piggy bank, kids feel the difference between saving and risk without anything real on the line.',
  },
  {
    q: 'What is Money school?',
    a: `A library of ${LESSONS.length} short, illustrated lessons with a quick quiz, covering earning, spending, saving, banks, credit, investing and staying safe. Grown-ups can pick lessons for each kid and reward them with coins.`,
  },
  PAID_PLANS ? {
    q: 'What does the free plan include?',
    a: `${PLAN_NAMES.free} covers the whole core loop for up to ${freeKids} kids: quests, the family shop, the piggy bank, the daily chest, savings goals, a team goal and co-parent invites. ${PLAN_NAMES.plus} adds room for more kids and team goals, the rocket fund and helper points. One plan covers the whole family.`,
  } : {
    q: 'Is it really free?',
    a: 'Yes. Right now Kid Kapital is free for every family: every feature, as many kids as you like, no card and no ads. If that ever changes, grown-ups will hear about it before anything changes, and kids will never see a price.',
  },
  {
    q: 'Can two grown-ups share a family?',
    a: 'Yes. Make an invite link in Settings and send it to the other grown-up. Each link works once, and then you both see the same quests, shop and approvals. The family code is only for kids.',
  },
  {
    q: 'Is there an iPhone or Android app?',
    a: 'Kid Kapital works today in any web browser on a phone, tablet or computer. Apps for iPhone and Android are coming soon.',
  },
];
