// The Privacy Policy and Terms of Use. Public pages (no sign-in), linked from sign-up,
// Settings and the marketing site. The version a parent agrees to lives in @kk/shared
// LEGAL_VERSIONS; bump it there when a change here needs fresh agreement. The operator
// and contact come from @kk/shared OPERATOR_NAME / PRIVACY_CONTACT, never typed here.
//
// Every sentence must describe what the app does TODAY. Before changing a fact here
// (backups, email, payments, a new provider), change the code first, or the policy lies.
// Facts this relies on: PAID_PLANS is off (shared/src/plans.ts); the preview sends no
// email (config.ts PREVIEW_WITHOUT_EMAIL); the free database tier keeps no backups
// (docs/DEPLOY.md); IP bans expire within 24 hours and offenses after 7 days
// (services/abuse.ts); the contact form uses EmailJS and tips use a Stripe page (features/creator.tsx); idle families are erased after INACTIVE_FAMILY_MONTHS (personal-data.ts); Google and Apple sign-in are not configured, so they are not mentioned.
//
// NOT REVIEWED BY A LAWYER. Kid Kapital is used by children under 13, so COPPA applies.
// Have these reviewed before the app is promoted to real families.
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { INACTIVE_FAMILY_MONTHS, LEGAL_PATHS, LEGAL_VERSIONS, OPERATOR_NAME, PRIVACY_CONTACT, type LegalDoc } from '@kk/shared';
import { IconBack, Penny } from '@/art';
import { Button, Card, Heading, Text } from '@/components/ui';

interface Section {
  heading: string;
  body: ReactNode[];
}

const PRIVACY: Section[] = [
  {
    heading: 'The short version',
    body: [
      'Kid Kapital helps families run chores, allowance and money lessons. A grown-up sets up the family and stays in charge of it. We collect only what the app needs to work. We never sell data, never show ads, and never use third-party analytics, advertising or tracking in the app or on our website.',
      "A grown-up can see, download or delete the family's data at any time from Settings.",
    ],
  },
  {
    heading: 'Who we are',
    body: [
      `Kid Kapital is run by ${OPERATOR_NAME}, an individual, who is responsible for the information described here. You can reach us at ${PRIVACY_CONTACT} about anything in this policy, including a child's information.`,
      'Kid Kapital is an early, free preview made for families in the United States.',
    ],
  },
  {
    heading: 'What we collect from grown-ups',
    body: [
      'Your name, your email address, and a password (stored only as a one-way hash, never readable, even by us).',
      'The family name and the settings you choose: quests, rewards, coin values, lesson picks and so on.',
      'The date you agreed to these terms and which version you agreed to.',
    ],
  },
  {
    heading: 'What we collect about kids',
    body: [
      "A grown-up creates each kid's profile; a kid can never sign up on their own. We ask the grown-up for a first name or nickname only. Please do not enter a kid's full name.",
      'For each kid we store: that first name or nickname, a picture they pick from our own drawings (never a photo), an optional birth year (only to choose lessons for their age), and a 4-digit PIN (stored only as a one-way hash).',
      "As a kid uses the app, we store their activity inside the family: quests finished, coins earned, saved and spent, rewards picked, lessons and quiz answers, XP, badges and hats. Grown-ups in the family can see all of it.",
      'We never ask a kid for, and the app has no place to enter, an email address, phone number, home address, photo, voice, location or any way to contact them. Kids cannot message anyone, and nothing a kid does is visible outside their own family.',
    ],
  },
  {
    heading: "Parents' consent and rights",
    body: [
      "When a grown-up creates a family, they confirm they are 18 or older and the kids' parent or legal guardian, and they agree to this policy for those kids. Each grown-up account records which version they agreed to.",
      "A parent can, at any time: review everything stored about their kid (Settings, Your data), download it, change it, remove the kid (which deletes that kid's profile and history right away), or stop all further collection by removing the kid. A parent can also write to us to do any of this; we will answer within 30 days.",
      "A parent can let their kid use the app without agreeing that we share the kid's information with anyone, because we do not share it (see Who else handles data).",
    ],
  },
  {
    heading: 'How we use information',
    body: [
      'Only to run Kid Kapital for your family: to sign people in, show each person their quests, coins and lessons, keep the service secure, and fix problems.',
      "We do not use anyone's information for advertising, do not build profiles for marketing, do not use it to train AI models, and do not sell, rent or trade it.",
    ],
  },
  {
    heading: 'Who else handles data',
    body: [
      'Two companies run the computers Kid Kapital lives on, and process data only to provide that service to us, under their written data protection and security terms: Vercel (hosting) and MongoDB Atlas (database, run on Amazon Web Services). Data is stored in the United States.',
      'If a grown-up writes to us with the contact form in Settings, their name, email address and message are passed by EmailJS (emailjs.com/legal/privacy-policy) to our Gmail inbox, run by Google (policies.google.com/privacy). Kids never see the form. Please do not include a child\'s details in a message. Apart from that, we do not send email yet.',
      'If a grown-up chooses to leave a tip, it is paid on Stripe\'s own page (stripe.com/privacy). Stripe receives what the grown-up enters there (such as name, email and card details); we never see or store card details. There are no other payments.',
      'EmailJS, Google and Stripe only ever receive what a grown-up chooses to type into the contact form or Stripe\'s page. Both are in grown-up Settings only, and we ask grown-ups not to include a child\'s details, so no child\'s information is sent to them by the app.',
      'We disclose information only if the law requires it, or to protect the safety of a person or the service.',
    ],
  },
  {
    heading: 'Cookies',
    body: [
      'The app keeps you signed in with one cookie, kk_refresh (up to 30 days). It also stores a few things on your device: kk_sound (sound on or off), kk_family_code (the last family code used), kk_contact_sent (contact-form send times from the last day) and, for a moment after an update, kk:reloaded-for-update. In the phone apps (not released yet), the sign-in token is kept in the device\'s secure storage, or in the app\'s private storage as kk_refresh_fallback if secure storage is unavailable.',
      'Our website sets no cookies of its own. When our host checks that a visitor is a person and not a bot, it may set a short-lived security cookie for that check. There are no tracking, advertising or analytics cookies or storage anywhere.',
    ],
  },
  {
    heading: 'How long we keep it',
    body: [
      "We keep a family's information only while the family uses Kid Kapital, because the app needs it to show each person their quests, coins and lessons. We never keep it indefinitely:",
      `When you delete a kid, your account or the family, that data is deleted right away. If nobody in a family signs in for ${INACTIVE_FAMILY_MONTHS} months, we delete the whole family and everything in it automatically. We do not keep backup copies right now, so deleted data cannot be recovered, by you or by us.`,
      'To stop spam and password guessing, we briefly process the internet (IP) address of each request. We count tries per address, and per email or family code, over short windows of 15 minutes to 24 hours; those counters are stored only as one-way hashes and delete themselves when the window ends. An address that sends attack traffic is stored as-is: it may be blocked for up to 24 hours, and a record of its past blocks is kept for 7 days, then deleted automatically. Our host also processes addresses to filter bots, and keeps short-lived technical logs of requests, which contain no names, emails or family content.',
    ],
  },
  {
    heading: 'Keeping it safe',
    body: [
      "Passwords and PINs are hashed, connections are encrypted, sign-in tokens are renewed every 15 minutes and you stay signed in for up to 30 days unless you sign out (you can end every session from Settings), repeated wrong guesses lock sign-in for a while, and every request is checked, which is designed to keep each family's data private to that family.",
      'No system is perfectly secure. If we learn of a breach that affects your information, we will tell affected grown-ups as the law requires.',
    ],
  },
  {
    heading: 'Children and grown-up accounts',
    body: [
      'Grown-up accounts are only for adults 18 or older. If we learn that someone under 18 created a grown-up account, we will delete it and its family.',
    ],
  },
  {
    heading: 'Changes to this policy',
    body: [
      'If we change this policy, we will update the date at the top. If a change affects how we handle kids\' information in a meaningful way, we will ask grown-ups to agree again before it applies to their family.',
    ],
  },
  {
    heading: 'Contact',
    body: [`${OPERATOR_NAME}, ${PRIVACY_CONTACT}. Questions, requests or concerns about privacy, including anything about a child's information, are welcome.`],
  },
];

const TERMS: Section[] = [
  {
    heading: 'Who we are and what this is',
    body: [
      `Kid Kapital is run by ${OPERATOR_NAME}, an individual ("we", "us"). These terms are an agreement between us and the grown-up who creates or joins a family ("you"). By creating an account you agree to them.`,
      'Kid Kapital is an early, free preview. Features may change, break or disappear, and the service may be paused or shut down at any time, with or without notice. Please do not rely on it as the only record of anything that matters to you.',
    ],
  },
  {
    heading: 'Who can use Kid Kapital',
    body: [
      "You must be 18 or older, and the parent or legal guardian of every kid you add. Kid Kapital is made for families in the United States.",
      'Kids use Kid Kapital only inside a family a grown-up set up. You are responsible for your family account, for the kid profiles you create, and for supervising how the kids in your family use the app.',
    ],
  },
  {
    heading: 'It is free',
    body: [
      'Kid Kapital is free. There are no paid plans, no purchases and no ads.',
    ],
  },
  {
    heading: 'Tips',
    body: [
      `On the web, a grown-up may choose to leave a tip to support Kid Kapital. A tip is a voluntary gift to ${OPERATOR_NAME} personally, for an app that is already free.`,
      'A tip unlocks nothing, buys nothing, and creates no account, subscription or obligation on either side. It is not a charitable donation and is not tax-deductible.',
      `Tips are processed by Stripe on Stripe's own page, so Kid Kapital never sees card details. Tips are not refundable, except that if you tipped by mistake you can email ${PRIVACY_CONTACT} within 30 days for a refund, and except where consumer law requires otherwise.`,
      'Kids never see the tip link.',
    ],
  },
  {
    heading: 'Coins are pretend money',
    body: [
      'Coins, prices, interest, the piggy bank, the rocket fund and everything else in the app are a teaching game. They are not real money, not a bank account, not a payment service and not an investment. We never hold, move or pay out real money, and coins cannot be cashed out.',
      "Any real-world reward or allowance is a private arrangement inside your family. We are not part of it and are not responsible for it, even if the app helps you keep track.",
    ],
  },
  {
    heading: 'Lessons are not advice',
    body: [
      'Money school lessons and quizzes are general education for kids. They are not financial, investment, legal or tax advice, and they may be simplified or contain mistakes. Talk to a qualified professional before making real financial decisions.',
    ],
  },
  {
    heading: 'Using it fairly',
    body: [
      "Keep your password and the kids' PINs private, and tell us if you think someone else got into your family.",
      'Do not try to get into another family, break, overload or probe the service, copy it, use bots or scrapers on it, or use it for anything unlawful or harmful. Do not enter anything into the app that you do not have the right to share.',
    ],
  },
  {
    heading: 'Your information and ours',
    body: [
      "Your family's information belongs to you. You let us store and process it only to run Kid Kapital for you, as the Privacy Policy describes.",
      'The app, its art, lessons and code belong to us. You may use them only to run your family in Kid Kapital.',
    ],
  },
  {
    heading: 'Ending',
    body: [
      'You can delete your account or your family at any time from Settings. We may suspend or delete an account that breaks these terms or puts other people or the service at risk, and we may end the service for everyone.',
    ],
  },
  {
    heading: 'No warranties',
    body: [
      'Kid Kapital is provided "as is" and "as available", without any warranty of any kind, express or implied, including any warranty of merchantability, fitness for a particular purpose, accuracy, availability or non-infringement. We do not promise that it will be error-free, secure, uninterrupted or that data will never be lost.',
    ],
  },
  {
    heading: 'Limits on liability',
    body: [
      'To the fullest extent the law allows, we will not be liable for any indirect, incidental, special, consequential or punitive damages, or for any lost data, lost profits or loss of goodwill, arising from or related to Kid Kapital, even if we were told they were possible.',
      'To the fullest extent the law allows, our total liability for any claim arising from or related to Kid Kapital is limited to fifty US dollars (USD 50).',
      'Some places do not allow some of these limits. Nothing in these terms limits rights you have under consumer law that cannot be waived.',
    ],
  },
  {
    heading: 'Your responsibility',
    body: [
      "To the extent the law allows, you agree to cover any claims, losses and costs (including reasonable legal fees) that come from your breaking these terms, your misuse of Kid Kapital, or the information you or the kids in your family put into it.",
    ],
  },
  {
    heading: 'Changes to these terms',
    body: [
      'We may update these terms. We will change the date at the top, and if a change matters, we will ask you to agree again. If you do not agree, you can stop using Kid Kapital and delete your account.',
    ],
  },
  {
    heading: 'The rest',
    body: [
      'If you have a problem with Kid Kapital, please write to us first and we will try to sort it out within 30 days.',
      'If any part of these terms cannot be enforced, the rest still applies. Our not enforcing a part is not a waiver of it. These terms and the Privacy Policy are the whole agreement between you and us about Kid Kapital. You may not transfer your account; we may transfer these terms to someone who takes over Kid Kapital.',
      `Questions: ${OPERATOR_NAME}, ${PRIVACY_CONTACT}.`,
    ],
  },
];

const DOCS: Record<LegalDoc, { title: string; sections: Section[] }> = {
  privacy: { title: 'Privacy Policy', sections: PRIVACY },
  terms: { title: 'Terms of Use', sections: TERMS },
};

/** One legal document, readable signed in or out. */
export default function LegalPage({ doc }: { doc: LegalDoc }) {
  const navigate = useNavigate();
  const { title, sections } = DOCS[doc];
  const other: LegalDoc = doc === 'privacy' ? 'terms' : 'privacy';
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-5 px-4 py-6 pt-safe">
      <Button variant="ghost" size="sm" icon={<IconBack size={20} />} className="self-start" onClick={() => navigate(-1)}>
        Back
      </Button>
      <div className="flex items-center gap-3">
        <Penny size={64} />
        <div>
          <Heading level={1} size="lg">
            {title}
          </Heading>
          <Text size="sm">Last updated {LEGAL_VERSIONS[doc]}</Text>
        </div>
      </div>
      {sections.map((s) => (
        <Card key={s.heading} className="flex flex-col gap-2">
          <Heading level={2} size="sm">
            {s.heading}
          </Heading>
          {s.body.map((para, i) => (
            <Text key={i} tone="ink" className="leading-relaxed">
              {para}
            </Text>
          ))}
        </Card>
      ))}
      <Button variant="ghost" onClick={() => navigate(LEGAL_PATHS[other])}>
        Read the {DOCS[other].title}
      </Button>
    </div>
  );
}
