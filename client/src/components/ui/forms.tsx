import { forwardRef, useId, useState, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { formatCents, PIN_LENGTH, type Cents } from '@kk/shared';
import { IconBack, IconCheck, IconMinus, IconPlus } from '@/art';
import { cn } from '@/lib/cn';
import { play } from '@/lib/sound';
import { spring } from '@/lib/motion';
import { Button, Text } from './primitives';

/* ---------- Field + Input ---------- */

export function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: (id: string) => ReactNode }) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <Text as="label" htmlFor={id} tone="ink" size="sm" bold className="font-display tracking-wide">
        {label}
      </Text>
      {children(id)}
      {error ? <Text size="sm" tone="bad">{error}</Text> : hint && <Text size="xs" tone="faint">{hint}</Text>}
    </div>
  );
}

export const Input = forwardRef<HTMLInputElement, ComponentPropsWithoutRef<'input'> & { leading?: ReactNode }>(function Input(
  { className, leading, ...rest },
  ref,
) {
  return (
    <div className="flex h-12 items-center gap-2 rounded-2xl border-[2.5px] border-ink bg-surface px-3.5 shadow-chunky-sm focus-within:ring-4 focus-within:ring-brand/30">
      {leading}
      <input
        ref={ref}
        className={cn('h-full w-full min-w-0 bg-transparent font-body text-base font-bold text-ink outline-none placeholder:text-ink-faint', className)}
        {...rest}
      />
    </div>
  );
});

/** A multi-line Input, same look. */
export const TextArea = forwardRef<HTMLTextAreaElement, ComponentPropsWithoutRef<'textarea'>>(function TextArea({ className, rows = 5, ...rest }, ref) {
  return (
    <div className="rounded-2xl border-[2.5px] border-ink bg-surface px-3.5 py-2.5 shadow-chunky-sm focus-within:ring-4 focus-within:ring-brand/30">
      <textarea
        ref={ref}
        rows={rows}
        className={cn('block w-full min-w-0 resize-y bg-transparent font-body text-base font-bold text-ink outline-none placeholder:text-ink-faint', className)}
        {...rest}
      />
    </div>
  );
});

/* ---------- Toggle ---------- */

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => {
        play('pop');
        onChange(!checked);
      }}
      className={cn('relative h-8 w-14 shrink-0 rounded-full border-[2.5px] border-ink transition-colors', checked ? 'bg-good' : 'bg-surface-sunk')}
    >
      <motion.span
        className="absolute top-0.5 h-5 w-5 rounded-full border-2 border-ink bg-white"
        animate={{ left: checked ? 26 : 3 }}
        transition={spring}
      />
    </button>
  );
}

/** A tickable agreement or option, with its label as the tap target. */
export function Checkbox({ checked, onChange, children }: { checked: boolean; onChange: (v: boolean) => void; children: ReactNode }) {
  return (
    <span className="flex items-start gap-3">
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={() => {
          play('pop');
          onChange(!checked);
        }}
        className={cn(
          'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-[2.5px] border-ink transition-colors',
          checked ? 'bg-good' : 'bg-surface',
        )}
      >
        {checked && <IconCheck size={16} />}
      </button>
      <Text as="span" size="sm" tone="ink" className="leading-snug">
        {children}
      </Text>
    </span>
  );
}

/* ---------- Segmented ---------- */

export function Segmented<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: ReactNode }[];
}) {
  // The pill slides with a plain x transform over equal-width options. Never layoutId:
  // a moved layoutId element stops AnimatePresence from ever removing its container,
  // which left closed sheets (and whole pages) on screen, invisibly eating taps.
  const index = Math.max(0, options.findIndex((o) => o.value === value));
  return (
    <div className="relative flex rounded-2xl border-[2.5px] border-ink bg-surface-sunk p-1">
      <motion.span
        aria-hidden
        className="absolute bottom-1 left-1 top-1 rounded-xl border-2 border-ink bg-surface shadow-chunky-sm"
        style={{ width: `calc((100% - 0.5rem) / ${options.length})` }}
        initial={false}
        animate={{ x: `${index * 100}%` }}
        transition={spring}
      />
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => {
            play('tap');
            onChange(o.value);
          }}
          className="relative flex-1 basis-0 rounded-xl px-3 py-2 font-display text-sm font-semibold"
          aria-pressed={value === o.value}
        >
          <span className={cn('relative', value === o.value ? 'text-ink' : 'text-ink-soft')}>{o.label}</span>
        </button>
      ))}
    </div>
  );
}

/* ---------- ChoiceGrid (avatars, icons, hats, themes) ---------- */

export function ChoiceGrid<T extends string>({
  value,
  onChange,
  options,
  columns = 4,
}: {
  value: T | T[];
  onChange: (v: T) => void;
  options: { value: T; label: string; art: ReactNode; locked?: ReactNode }[];
  columns?: number;
}) {
  const selected = (v: T) => (Array.isArray(value) ? value.includes(v) : value === v);
  return (
    <div className="grid gap-2.5" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
      {options.map((o) => (
        <motion.button
          key={o.value}
          type="button"
          whileTap={{ scale: 0.92 }}
          transition={spring}
          disabled={!!o.locked}
          aria-pressed={selected(o.value)}
          aria-label={o.label}
          title={o.label}
          onClick={() => {
            play('pop');
            onChange(o.value);
          }}
          className={cn(
            'relative flex aspect-square items-center justify-center rounded-2xl border-[2.5px] p-1 transition-colors',
            selected(o.value) ? 'border-ink bg-brand-light shadow-chunky-sm' : 'border-line bg-surface hover:border-ink-faint',
            !!o.locked && 'cursor-not-allowed',
          )}
        >
          <span className={cn('flex h-full w-full items-center justify-center', !!o.locked && 'opacity-30 grayscale')}>{o.art}</span>
          {o.locked && <span className="absolute inset-0 flex items-center justify-center">{o.locked}</span>}
        </motion.button>
      ))}
    </div>
  );
}

/* ---------- PinPad ---------- */

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'] as const;

/** A big chunky number pad. Calls onComplete when all digits are in. */
export function PinPad({ onComplete, shake, busy }: { onComplete: (pin: string) => void; shake?: number; busy?: boolean }) {
  const [pin, setPin] = useState('');
  const [lastShake, setLastShake] = useState(shake);
  if (shake !== lastShake) {
    setLastShake(shake);
    setPin('');
  }
  const press = (k: (typeof KEYS)[number]) => {
    if (busy) return;
    play('tap');
    if (k === 'del') return setPin((p) => p.slice(0, -1));
    const next = (pin + k).slice(0, PIN_LENGTH);
    setPin(next);
    if (next.length === PIN_LENGTH) onComplete(next);
  };
  return (
    <div className="flex flex-col items-center gap-6">
      <div key={shake} className={cn('flex gap-3', shake ? 'kk-shake' : '')}>
        {Array.from({ length: PIN_LENGTH }, (_, i) => (
          <motion.span
            key={i}
            animate={{ scale: i < pin.length ? 1.15 : 1 }}
            transition={spring}
            className={cn('h-5 w-5 rounded-full border-[2.5px] border-ink', i < pin.length ? 'bg-brand' : 'bg-surface')}
          />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3">
        {KEYS.map((k, i) =>
          k === '' ? (
            <span key={i} />
          ) : (
            <button
              key={i}
              type="button"
              onClick={() => press(k)}
              aria-label={k === 'del' ? 'Delete' : k}
              className="press h-16 w-16 rounded-2xl border-[2.5px] border-ink bg-surface font-display text-2xl font-bold text-ink shadow-chunky"
            >
              {k === 'del' ? <IconBack className="mx-auto" /> : k}
            </button>
          ),
        )}
      </div>
    </div>
  );
}

/* ---------- AmountPicker ---------- */

/** Pick an amount of money with chunky +/- steps and quick chips. Never a raw number field. */
export function AmountPicker({
  value,
  onChange,
  max,
  min = 0,
  steps = [5, 25, 100],
  allowNegative,
  allChip,
}: {
  value: Cents;
  onChange: (v: Cents) => void;
  max?: Cents;
  min?: Cents;
  steps?: Cents[];
  allowNegative?: boolean;
  /** Offer an "All of it" chip that jumps to max (moving coins). Off when max is only a cap. */
  allChip?: boolean;
}) {
  const lo = allowNegative ? -(max ?? 100_000) : min;
  const clamp = (v: number) => Math.max(lo, max === undefined ? v : Math.min(max, v));
  const bump = (d: number) => {
    play('coin');
    onChange(clamp(value + d));
  };
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-3">
        <button type="button" aria-label="Less" onClick={() => bump(-steps[0])} className="press flex h-12 w-12 items-center justify-center rounded-2xl border-[2.5px] border-ink bg-surface shadow-chunky">
          <IconMinus />
        </button>
        <motion.span key={value} initial={{ scale: 1.15 }} animate={{ scale: 1 }} transition={spring} className="min-w-[7ch] text-center font-display text-4xl font-bold tabular">
          {formatCents(value)}
        </motion.span>
        <button type="button" aria-label="More" onClick={() => bump(steps[0])} className="press flex h-12 w-12 items-center justify-center rounded-2xl border-[2.5px] border-ink bg-surface shadow-chunky">
          <IconPlus />
        </button>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {steps.slice(1).map((s) => (
          <button key={s} type="button" onClick={() => bump(s)} className="press rounded-full border-2 border-ink bg-coin-light px-3 py-1 font-display text-sm font-semibold shadow-chunky-sm">
            +{formatCents(s)}
          </button>
        ))}
        {allChip && max !== undefined && max > 0 && (
          <button type="button" onClick={() => onChange(max)} className="press rounded-full border-2 border-ink bg-brand-light px-3 py-1 font-display text-sm font-semibold shadow-chunky-sm">
            All of it
          </button>
        )}
        {allowNegative && (
          <button type="button" onClick={() => onChange(-value)} className="press rounded-full border-2 border-ink bg-surface px-3 py-1 font-display text-sm font-semibold shadow-chunky-sm">
            {value < 0 ? 'Make it a bonus' : 'Make it a deduction'}
          </button>
        )}
      </div>
    </div>
  );
}

/* ---------- Chip (selectable pill, for tabs and filters) ---------- */

export function Chip({
  selected,
  onClick,
  children,
  icon,
  role,
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
  icon?: ReactNode;
  role?: 'tab';
}) {
  return (
    <button
      type="button"
      role={role}
      aria-selected={role === 'tab' ? selected : undefined}
      aria-pressed={role === 'tab' ? undefined : selected}
      onClick={() => {
        play('tap');
        onClick();
      }}
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 rounded-full border-2 px-3 py-1 font-display text-sm font-semibold capitalize transition-colors',
        selected ? 'border-ink bg-brand text-white shadow-chunky-sm' : 'border-line bg-surface text-ink-soft',
      )}
    >
      {icon}
      {children}
    </button>
  );
}

/* ---------- Stepper (a number with chunky -/+ buttons) ---------- */

export function Stepper({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  format = String,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  /** How the number is shown, e.g. (v) => `${v}%` or (v) => `${v}x`. */
  format?: (v: number) => string;
}) {
  // Round to the step so repeated taps never drift (0.1 + 0.2 style float error).
  const set = (v: number) => onChange(Math.max(min, Math.min(max, Math.round(v / step) * step)));
  return (
    <div className="flex items-center justify-between gap-3">
      <Text tone="ink" size="sm" bold>
        {label}
      </Text>
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="icon" aria-label={`Lower ${label}`} disabled={value <= min} onClick={() => set(value - step)}>
          <IconMinus />
        </Button>
        <motion.span key={value} initial={{ scale: 1.2 }} animate={{ scale: 1 }} transition={spring} className="min-w-[4.5ch] text-center font-display text-2xl font-bold tabular">
          {format(value)}
        </motion.span>
        <Button variant="secondary" size="icon" aria-label={`Raise ${label}`} disabled={value >= max} onClick={() => set(value + step)}>
          <IconPlus />
        </Button>
      </div>
    </div>
  );
}

/* ---------- Honeypot (anti-bot, see lib/form-guard.ts) ---------- */

/**
 * Hidden inputs only a bot fills. Hidden by the WRAPPER (moved off-screen and clipped),
 * never display:none on the input, which a headless bot checks for. aria-hidden and
 * tabIndex -1 keep them away from screen readers and the keyboard; autofill and
 * password managers are told to skip them. Absolutely positioned, so it takes no
 * room in the form's layout. Render it inside a guarded form with the props from
 * useFormGuard().honeypot.
 */
export function Honeypot({ fields, values, onChange }: { fields: readonly string[]; values: Record<string, string>; onChange: (field: string, value: string) => void }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute -left-[9999px] top-0 h-px w-px overflow-hidden opacity-0 [clip-path:inset(50%)]">
      {fields.map((field) => (
        <label key={field}>
          {field}
          <input
            type="text"
            name={field}
            value={values[field] ?? ''}
            onChange={(e) => onChange(field, e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            data-1p-ignore=""
            data-lpignore="true"
            data-bwignore=""
            data-form-type="other"
          />
        </label>
      ))}
    </div>
  );
}
