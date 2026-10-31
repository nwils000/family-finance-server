import type { Metadata } from 'next';
// The app's stylesheet first: tokens, fonts, paper texture, art animations.
import '../../../client/src/index.css';
import './globals.css';
import { rootMetadata, viewport as siteViewport } from '@/lib/seo';
import { jsonLd } from '@/lib/jsonld';
import { MotionProvider } from '@/components/Reveal';

export const metadata: Metadata = rootMetadata;
export const viewport = siteViewport;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* No preconnects, no analytics, no third-party anything: the site loads
            only its own files. Structured data is a PLAIN script tag so it is in
            the served HTML, not injected later by client JavaScript (Mentis
            learned this the hard way). */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()) }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
