import Link from 'next/link';
import { APP_LINKS, CONTACT_EMAIL, SECTIONS, SITE_NAME } from '@/lib/site';
import { Logo } from './Logo';

/** After the Mentis footer: brand, product links, sign-in, legal, contact. */
export function Footer() {
  const groups = [
    { title: 'Product', links: SECTIONS.map((s) => ({ href: `/#${s.id}`, label: s.label })) },
    {
      title: 'Get started',
      links: [
        { href: APP_LINKS.signup, label: 'Start a family' },
        { href: APP_LINKS.login, label: 'Grown-up sign in' },
        { href: APP_LINKS.kidLogin, label: 'Kid sign in' },
        { href: APP_LINKS.join, label: 'Join a family' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { href: '/privacy', label: 'Privacy policy' },
        { href: '/terms', label: 'Terms of service' },
        { href: `mailto:${CONTACT_EMAIL}`, label: CONTACT_EMAIL },
      ],
    },
  ];

  return (
    <footer className="bg-ink px-4 pb-10 pt-14 text-bg sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <span className="inline-block rounded-2xl bg-bg px-3 py-2">
            <Logo size={30} />
          </span>
          <p className="mt-4 max-w-xs leading-relaxed text-bg/75">
            A playful family money app. Quests, coins, a family shop, a piggy bank, a rocket fund and Money school.
          </p>
          <p className="mt-3 text-sm text-bg/60">Web app today. iPhone and Android coming soon.</p>
        </div>
        {groups.map((g) => (
          <nav key={g.title} aria-label={g.title}>
            <h2 className="font-display text-lg font-semibold">{g.title}</h2>
            <ul className="mt-3 flex flex-col gap-2">
              {g.links.map((l) => (
                <li key={l.href}>
                  {l.href.startsWith('/') ? (
                    <Link href={l.href} className="break-all text-bg/75 transition-colors hover:text-bg">
                      {l.label}
                    </Link>
                  ) : (
                    <a href={l.href} className="break-all text-bg/75 transition-colors hover:text-bg">
                      {l.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="mx-auto mt-12 flex max-w-6xl flex-col items-center justify-between gap-3 border-t border-bg/15 pt-6 text-sm text-bg/60 sm:flex-row">
        <p>
          &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </p>
        <p>No ads for kids. No trackers on this site.</p>
      </div>
    </footer>
  );
}
