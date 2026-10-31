// The Privacy Policy and Terms of Use. Public pages (no sign-in), linked from sign-up,
// Settings and the marketing site. The version a parent agrees to lives in @kk/shared
// LEGAL_VERSIONS; bump it there when a change here needs fresh agreement.
//
// DRAFT FOR LEGAL REVIEW: this describes what the app actually stores and does today,
// but it has not been reviewed by a lawyer. Kid Kapital is used by children under 13,
// so COPPA (and GDPR-K / the UK Children's Code for EU/UK families) apply.
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { LEGAL_PATHS, LEGAL_VERSIONS, PRIVACY_CONTACT, type LegalDoc } from '@kk/shared';
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
      'Kid Kapital helps families run chores, allowance and money lessons. A grown-up sets up the family and stays in charge of it. We collect only what the app needs to work, we never sell it, we never show ads, and we never use third-party analytics or tracking in the app.',
      'A grown-up can see, download or delete the family\'s data at any time from Settings.',
    ],
  },
  {
    heading: 'What we collect from grown-ups',
    body: [
      'Your name, your email address, and a password (stored only as a one-way hash). If you sign in with Google or Apple, we receive your name, email and an account id from them, and nothing else.',
      'The family name and the settings you choose (quests, rewards, coin values, lesson picks and so on).',
    ],
  },
  {
    heading: 'What we collect about kids',
    body: [
      'A grown-up creates each kid\'s profile. A kid never signs up on their own and never gives us an email address, phone number, photo or location.',
      'For each kid we store: a first name or nickname, a picture they pick from our drawn avatars, an optional birth year (only to choose lessons for their age), and a 4-digit PIN (stored only as a one-way hash).',
      'As a kid uses the app we store their activity in the family: quests finished, coins earned, saved and spent, rewards picked, lessons and quiz results, XP, badges and hats.',
    ],
  },
  {
    heading: 'How we use it',
    body: [
      'Only to run Kid Kapital for your family: to sign you in, show each person their quests, coins and lessons, and send grown-ups the emails the app needs (like a sign-in link or password reset).',
      'We do not use anyone\'s data for advertising, do not build profiles for marketing, and do not sell or rent data to anyone.',
    ],
  },
  {
    heading: 'Who else handles data',
    body: [
      'Companies that run parts of the service for us, under contract and only for that purpose: our hosting and database providers, and our email provider for grown-up emails. If a grown-up buys Kapital Plus, the payment is handled by Stripe (on the web) and we keep only the subscription status, never card details.',
      'We share data with authorities only when the law requires it.',
    ],
  },
  {
    heading: 'Grown-ups are in control',
    body: [
      'From Settings, a grown-up can review everything stored about the family, download it, remove a kid (which deletes that kid\'s profile and history), or delete their own account. When the last grown-up deletes their account, the whole family and all its data are deleted.',
      'A grown-up can also stop any further collection about a kid at any time by removing that kid. To ask us anything about a kid\'s data, write to the address below.',
    ],
  },
  {
    heading: 'How long we keep it',
    body: [
      'As long as the family uses Kid Kapital. Deleted data is removed from the live service right away and from backups when they roll over, within 30 days.',
    ],
  },
  {
    heading: 'Keeping it safe',
    body: [
      'Passwords and PINs are hashed, connections are encrypted, sign-in sessions are short-lived and can be ended from Settings, repeated wrong PINs lock the profile for a while, and every request is checked so one family can never see another family\'s data.',
    ],
  },
  {
    heading: 'Contact',
    body: [`Questions or requests about privacy, including anything about a child's data: ${PRIVACY_CONTACT}.`],
  },
];

const TERMS: Section[] = [
  {
    heading: 'Who can use Kid Kapital',
    body: [
      'An adult creates the family account and is responsible for it and for how the kids in it use the app. Kids use Kid Kapital only inside a family a grown-up set up.',
    ],
  },
  {
    heading: 'Coins are pretend money',
    body: [
      'Coins, prices, interest, the piggy bank and the rocket fund are a teaching game. They are not a bank account, they are not real money, and they cannot be cashed out by us. What a coin is worth in real life, and what rewards a kid gets, is up to the family.',
      'Money lessons are for learning and are not financial advice.',
    ],
  },
  {
    heading: 'Your account',
    body: [
      'Keep your password and the kids\' PINs private. Tell us if you think someone else got into your family. Do not try to get into another family, break the service, or use it for anything unlawful.',
    ],
  },
  {
    heading: 'Kapital Plus',
    body: [
      'Kapital Plus is an optional paid plan for the family. The price and billing period are shown before you buy. It renews until you cancel; you can cancel any time and keep Plus until the end of the period you paid for.',
    ],
  },
  {
    heading: 'Changes and ending',
    body: [
      'We may update the app and these terms; if a change matters, we will ask you to agree again. You can delete your account at any time from Settings. We may suspend an account that breaks these terms.',
    ],
  },
  {
    heading: 'The fine print',
    body: [
      'Kid Kapital is provided as is. To the extent the law allows, we are not liable for indirect losses. Nothing here limits rights you have under consumer law where you live.',
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
