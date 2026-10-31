import type { Metadata, Viewport } from 'next';
import { DESCRIPTION, SITE_NAME, SITE_URL, TAGLINE } from './site';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  // --bg in client/src/index.css (255 248 236).
  themeColor: '#FFF8EC',
};

interface PageMeta {
  title?: string;
  description?: string;
  path?: string;
  /** Pointer and error pages stay out of search results. */
  noIndex?: boolean;
}

/** Metadata for one page. Modeled on Mentis `pageMetadata`, without the locales. */
export function pageMetadata({ title, description = DESCRIPTION, path = '/', noIndex = false }: PageMeta = {}): Metadata {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME}: ${TAGLINE}`;
  const url = `${SITE_URL}${path === '/' ? '' : path}` || SITE_URL;
  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      type: 'website',
      locale: 'en_US',
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: `${SITE_NAME}: ${TAGLINE}` }],
    },
    twitter: { card: 'summary_large_image', title: fullTitle, description, images: ['/og-image.png'] },
    robots: noIndex
      ? { index: false, follow: true }
      : { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  };
}

/** Site-wide metadata, applied once in the root layout. */
export const rootMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  keywords: [
    'kids money app', 'chore app', 'allowance app', 'chores for kids', 'financial literacy for kids',
    'money lessons for kids', 'piggy bank app', 'family chore chart', 'teach kids to save', 'kids investing basics',
  ],
  category: 'education',
  formatDetection: { email: false, address: false, telephone: false },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/manifest.webmanifest',
};
