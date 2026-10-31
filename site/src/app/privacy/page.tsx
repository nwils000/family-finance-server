import type { Metadata } from 'next';
import { LegalPointer } from '@/components/LegalPointer';
import { pageMetadata } from '@/lib/seo';
import { APP_LINKS } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  title: 'Privacy policy',
  description: 'Where to read the Kid Kapital privacy policy.',
  path: '/privacy',
  noIndex: true,
});

export default function PrivacyPage() {
  return (
    <LegalPointer
      title="Privacy policy"
      body="Our privacy policy lives inside the Kid Kapital app, so there is only ever one version of it: the same one every grown-up agrees to when they start a family."
      href={APP_LINKS.privacy}
    />
  );
}
