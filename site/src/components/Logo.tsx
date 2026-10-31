import { Coin } from '@art';

/** The wordmark, as the app draws it on its welcome screen: Kid in ink, Kapital in brand. */
export function Logo({ size = 36, className }: { size?: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 font-display font-bold tracking-tight text-ink ${className ?? ''}`}>
      <Coin size={size} />
      <span style={{ fontSize: size * 0.68 }}>
        Kid <span className="text-brand">Kapital</span>
      </span>
    </span>
  );
}
