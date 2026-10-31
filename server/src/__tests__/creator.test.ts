// The contact form's spam rules (@kk/shared creator.ts), shared by every one of Nathan's apps
// through one EmailJS account with 200 sends a month.
import { describe, expect, it } from 'vitest';
import { CONTACT_RULES, checkContactSubmission, type ContactFields } from '@kk/shared';

const fields: ContactFields = { user_name: 'Pat', user_email: 'pat@x.com', message: 'Hello, I love the piggy bank.' };
const T0 = 1_700_000_000_000;
const check = (over: Partial<Parameters<typeof checkContactSubmission>[0]> = {}) =>
  checkContactSubmission({ fields, trap: '', openedAt: T0, now: T0 + 10_000, sent: [], ...over });

describe('contact form rules', () => {
  it('lets a normal message through', () => {
    expect(check()).toEqual({ ok: true });
  });

  it('a filled trap or a form sent too fast is dropped silently (the bot sees success)', () => {
    expect(check({ trap: 'http://spam' })).toEqual({ ok: false, silent: true });
    expect(check({ now: T0 + CONTACT_RULES.minFillMs - 1 })).toEqual({ ok: false, silent: true });
  });

  it('one message a minute and five a day per browser', () => {
    const now = T0 + 10_000;
    const cooling = check({ sent: [now - 30_000] });
    expect(cooling.ok).toBe(false);
    expect('text' in cooling && cooling.text).toMatch(/minute/);
    expect(check({ sent: [now - 61_000] })).toEqual({ ok: true });
    const five = [1, 2, 3, 4, 5].map((h) => now - h * 3_600_000);
    expect(check({ sent: five }).ok).toBe(false);
    // Yesterday's sends no longer count.
    expect(check({ sent: five.map((t) => t - 86_400_000) })).toEqual({ ok: true });
  });

  it('refuses a near-empty message and one with more than three links', () => {
    expect(check({ fields: { ...fields, message: 'hi' } }).ok).toBe(false);
    const links = 'see http://a.com http://b.com www.c.com https://d.com';
    expect(check({ fields: { ...fields, message: links } }).ok).toBe(false);
    expect(check({ fields: { ...fields, message: 'see http://a.com http://b.com www.c.com' } })).toEqual({ ok: true });
  });
});
