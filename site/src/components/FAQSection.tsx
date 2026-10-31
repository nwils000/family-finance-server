import { Penny } from '@art';
import { FAQ } from '@/lib/faq';
import { CONTACT_EMAIL } from '@/lib/site';
import { FaqItem } from './FaqItem';
import { Card, SectionHeading } from './ui';

/** Renders the same FAQ list the layout publishes as FAQPage structured data. */
export function FAQSection() {
  return (
    <section id="faq" className="border-t-[2.5px] border-ink bg-surface-soft px-4 py-20 sm:px-6 sm:py-28">
      <SectionHeading eyebrow="FAQ" title="Questions grown-ups ask" />
      <Card pad="none" className="mx-auto mt-10 max-w-3xl overflow-hidden">
        {FAQ.map((item) => (
          <FaqItem key={item.q} q={item.q} a={item.a} />
        ))}
      </Card>
      <div className="mx-auto mt-10 flex max-w-3xl items-center justify-center gap-3 text-center text-ink-soft">
        <Penny size={48} mood="happy" />
        <p>
          Something else? Write to{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-bold text-brand underline decoration-2 underline-offset-4">
            {CONTACT_EMAIL}
          </a>
        </p>
      </div>
    </section>
  );
}
