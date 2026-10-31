import Link from 'next/link';
import { Penny } from '@art';
import { CONTACT_EMAIL } from '@/lib/site';
import { SiteNav } from './SiteNav';
import { Footer } from './Footer';
import { ButtonLink, Card } from './ui';

/**
 * A pointer page, as on the Mentis site: the legal text is NOT forked onto the
 * marketing site. The app hosts the one versioned document (LEGAL_VERSIONS in
 * @kk/shared, the version each grown-up agrees to at signup); this page sends
 * readers there, so the two can never disagree.
 */
export function LegalPointer({ title, body, href }: { title: string; body: string; href: string }) {
  return (
    <>
      <SiteNav />
      <main id="main" className="flex min-h-[80vh] items-center justify-center px-4 pb-20 pt-28">
        <Card pad="lg" className="w-full max-w-xl text-center">
          <div className="flex justify-center">
            <Penny size={110} mood="think" />
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold text-ink">{title}</h1>
          <p className="mt-3 text-lg leading-relaxed text-ink-soft">{body}</p>
          <div className="mt-7 flex flex-col items-center gap-4">
            <ButtonLink href={href} size="lg">
              Read the current {title.toLowerCase()}
            </ButtonLink>
            <p className="text-sm text-ink-soft">
              Questions? Write to{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="font-bold text-brand underline underline-offset-4">
                {CONTACT_EMAIL}
              </a>
            </p>
            <Link href="/" className="font-display font-semibold text-ink-soft hover:text-ink">
              Back to home
            </Link>
          </div>
        </Card>
      </main>
      <Footer />
    </>
  );
}
