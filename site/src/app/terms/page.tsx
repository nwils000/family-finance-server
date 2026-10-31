import type { Metadata } from 'next';
import { LegalPointer } from '@/components/LegalPointer';
import { pageMetadata } from '@/lib/seo';
import { APP_LINKS } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  title: 'Terms of service',
  description: 'Where to read the Kid Kapital terms of service.',
  path: '/terms',
  noIndex: true,
});

export default function TermsPage() {
  return (
    <LegalPointer
      title="Terms of service"
      body="Our terms live inside the Kid Kapital app, so there is only ever one version of them: the same one every grown-up agrees to when they start a family."
      href={APP_LINKS.terms}
    />
  );
}
