// Small pieces shared by more than one kid screen. Candidates for the UI kit.
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import type { Cents } from '@kk/shared';
import { CoinJar } from '@/art';
import { Card, Heading, Money, Spinner, Text } from '@/components/ui';
import { bouncy } from '@/lib/motion';

/** How full the jar art looks: 5,000 coins reads as a full jar. Purely visual. */
const JAR_FULL_CENTS = 5000;
/** Any coins at all show a visible layer; the jar then fills on a square-root curve toward full. */
const jarFill = (cents: number) => (cents <= 0 ? 0 : Math.min(1, 0.2 + 0.8 * Math.sqrt(cents / JAR_FULL_CENTS)));

/** "My wallet" banner with a filling coin jar and the big balance. */
export function WalletHeader({ cents, children }: { cents: Cents; children?: ReactNode }) {
  return (
    <Card tone="coin" className="flex items-center gap-4">
      <motion.span className="shrink-0" initial={{ rotate: -12, scale: 0.7 }} animate={{ rotate: 0, scale: 1 }} transition={bouncy}>
        <CoinJar size={88} fill={jarFill(cents)} />
      </motion.span>
      <div className="min-w-0">
        <Heading level={1} size="xs" className="text-ink-soft">
          My wallet
        </Heading>
        <Money cents={cents} size="xl" coin={false} />
        {children && <Text size="sm">{children}</Text>}
      </div>
    </Card>
  );
}

/** Centered loading coin for a section that is still fetching. */
export const Loading = ({ size = 48 }: { size?: number }) => (
  <div className="flex justify-center py-12">
    <Spinner size={size} />
  </div>
);
