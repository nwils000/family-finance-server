import { FAQ } from './faq';
import { DESCRIPTION, SITE_NAME, SITE_URL } from './site';

/**
 * Structured data. The FAQ answers are the SAME list the FAQ section renders.
 * No Offer price is published: there is no price constant yet, and a made-up
 * one in markup is worse than none.
 */
export function jsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Organization', '@id': `${SITE_URL}/#org`, name: SITE_NAME, url: SITE_URL, logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon-512.png`, width: 512, height: 512 } },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#site`,
        url: SITE_URL,
        name: SITE_NAME,
        description: DESCRIPTION,
        publisher: { '@id': `${SITE_URL}/#org` },
        inLanguage: 'en',
      },
      {
        '@type': 'SoftwareApplication',
        name: SITE_NAME,
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'Web',
        description: DESCRIPTION,
        offers: { '@type': 'Offer', name: 'Free', price: '0', priceCurrency: 'USD' },
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQ.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
      },
    ],
  };
}
