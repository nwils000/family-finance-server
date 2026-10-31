import type { Metadata } from 'next';
import Link from 'next/link';
import { Penny } from '@art';
import { SiteNav } from '@/components/SiteNav';
import { Footer } from '@/components/Footer';
import { ButtonLink } from '@/components/ui';

export const metadata: Metadata = { title: { absolute: 'Page not found | Kid Kapital' }, robots: { index: false, follow: true } };

export default function NotFound() {
  return (
    <>
      <SiteNav />
      <main id="main" className="flex min-h-[80vh] flex-col items-center justify-center px-4 pb-20 pt-28 text-center">
        <Penny size={160} mood="sad" />
        <h1 className="mt-4 font-display text-5xl font-bold text-ink">Oops, no coins here</h1>
        <p className="mt-3 max-w-md text-lg text-ink-soft">Penny looked everywhere, but this page has rolled away. Let&apos;s head back home.</p>
        <div className="mt-8 flex flex-col items-center gap-4">
          <ButtonLink href="/" size="lg">
            Back to home
          </ButtonLink>
          <Link href="/#faq" className="font-display font-semibold text-ink-soft hover:text-ink">
            Read the FAQ
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
