'use client';

import { useId, useState } from 'react';

/** One question. Plain strings in, so no art or shared rules ride into the client bundle. */
export function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div className="border-b-2 border-line last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={id}
        className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition-colors hover:bg-ink/[0.03] sm:px-7"
      >
        <span className="font-display text-lg font-semibold text-ink sm:text-xl">{q}</span>
        <span
          aria-hidden="true"
          className={`flex h-9 w-9 flex-none items-center justify-center rounded-full border-2 border-ink bg-coin-light transition-transform duration-200 ${open ? 'rotate-45' : ''}`}
        >
          <svg width="16" height="16" viewBox="0 0 16 16">
            <path d="M8 2v12M2 8h12" stroke="rgb(var(--ink))" strokeWidth="2.6" strokeLinecap="round" />
          </svg>
        </span>
      </button>
      <div id={id} role="region" hidden={!open} className="px-5 pb-6 text-[17px] leading-relaxed text-ink-soft sm:px-7">
        {a}
      </div>
    </div>
  );
}
