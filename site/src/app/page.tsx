import type { Metadata } from 'next';
import { PLAN_LIMITS } from '@kk/shared';
import { pageMetadata } from '@/lib/seo';
import { SiteNav } from '@/components/SiteNav';
import { Hero } from '@/components/Hero';
import { HowItWorks } from '@/components/HowItWorks';
import { Features } from '@/components/Features';
import { TwoWaysToGrow } from '@/components/TwoWaysToGrow';
import { MoneySchool } from '@/components/MoneySchool';
import { ParentsInControl } from '@/components/ParentsInControl';
import { KidSafety } from '@/components/KidSafety';
import { Plans } from '@/components/Plans';
import { FAQSection } from '@/components/FAQSection';
import { FinalCTA } from '@/components/FinalCTA';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = pageMetadata();

/**
 * One argument per section, in the order a grown-up asks the questions:
 * what is it, how does it work, what is in it, will it teach anything, am I in
 * control, is it safe, what does it cost, and the leftovers. A CTA in the hero,
 * in the plans and at the end (the Mentis rhythm).
 */
export default function Home() {
  return (
    <>
      <SiteNav />
      <main id="main">
        <Hero freeKids={PLAN_LIMITS.free.limits.kids ?? 0} />
        <HowItWorks />
        <Features />
        <TwoWaysToGrow />
        <MoneySchool />
        <ParentsInControl />
        <KidSafety />
        <Plans />
        <FAQSection />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
