// The family shop: spend coins on rewards a grown-up set up, then track orders.
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { coinsText } from '@kk/shared';
import { IconClock, IconShop, RewardIcon, SceneEmptyShop } from '@/art';
import { Button, Card, EmptyState, Money, PennySays, Pill, ProgressBar, SectionTitle, Text, useConfirm } from '@/components/ui';
import { RewardCard } from '@/features/cards';
import { endpoints } from '@/lib/api';
import { celebrate } from '@/lib/celebrate';
import { popIn, stagger } from '@/lib/motion';
import { useAction, usePurchases, useRewards, useSelfKid } from '@/lib/queries';
import type { Purchase, Reward } from '@/lib/types';
import { Loading, WalletHeader } from './kid-parts';

const ORDER_STATUS: Record<Purchase['status'], { label: string; tone: 'brand' | 'good' | 'bad' }> = {
  pending: { label: 'Waiting for a grown-up', tone: 'brand' },
  fulfilled: { label: 'Got it!', tone: 'good' },
  declined: { label: 'Declined, refunded', tone: 'bad' },
};

export default function KidShop() {
  const { kid, family } = useSelfKid();
  const rewards = useRewards();
  const purchases = usePurchases();
  const confirm = useConfirm();
  const buy = useAction(endpoints.buy);

  if (!family?.features.shop) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col gap-5 pt-6">
        <PennySays mood="sleepy" size={96}>
          The shop is closed right now. Ask a grown-up to open it, and keep saving those coins!
        </PennySays>
      </div>
    );
  }

  const wallet = kid?.balanceCents ?? 0;
  const list = rewards.data?.rewards ?? [];
  const orders = purchases.data?.purchases ?? [];

  const onBuy = async (r: Reward, el: HTMLElement) => {
    const ok = await confirm({
      title: `Buy ${r.title}?`,
      message: `It costs ${coinsText(r.priceCents)}. A grown-up will hand it over soon.`,
      confirmText: 'Buy it!',
      mood: 'wow',
    });
    if (!ok) return;
    await buy.run(r.id);
    celebrate('buy', el);
    toast.success(`${r.title} is on its way!`);
  };

  return (
    <div className="flex flex-col gap-6">
      <WalletHeader cents={wallet}>What will you treat yourself to?</WalletHeader>

      <section>
        <SectionTitle icon={<IconShop size={24} />}>Family shop</SectionTitle>
        {rewards.isLoading ? (
          <Loading />
        ) : !list.length ? (
          <EmptyState art={<SceneEmptyShop size={180} />} title="The shelves are empty">
            Ask a grown-up to add some rewards you can save up for.
          </EmptyState>
        ) : (
          <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {list.map((r) => {
              const short = r.priceCents - wallet;
              return (
                <RewardCard
                  key={r.id}
                  reward={r}
                  dim={short > 0}
                  footer={
                    short > 0 && (
                      <div className="flex w-full flex-col gap-1">
                        <ProgressBar value={wallet / r.priceCents} tone="coin" height="h-3" />
                        <Text size="xs" tone="faint">
                          {coinsText(short)} more to go
                        </Text>
                      </div>
                    )
                  }
                  action={
                    <Button variant="coin" size="sm" block disabled={short > 0} busy={buy.busy} onClick={(e) => void onBuy(r, e.currentTarget)}>
                      {short > 0 ? 'Keep saving' : 'Buy'}
                    </Button>
                  }
                />
              );
            })}
          </motion.div>
        )}
      </section>

      <section>
        <SectionTitle icon={<IconClock size={22} />}>My orders</SectionTitle>
        {purchases.isLoading ? (
          <Loading />
        ) : !orders.length ? (
          <Card tone="soft" sticker={false}>
            <Text size="sm">Nothing bought yet. Your orders will show up here.</Text>
          </Card>
        ) : (
          <motion.div variants={stagger} initial="hidden" animate="show" className="grid gap-2.5 md:grid-cols-2">
            {orders.map((o) => (
              <motion.div key={o.id} variants={popIn}>
                <Card pad="sm" tone={o.status === 'fulfilled' ? 'good' : 'plain'} className="flex items-center gap-3">
                  <RewardIcon id={o.icon} title={o.title} size={52} className={o.status === 'declined' ? 'opacity-50 grayscale' : ''} />
                  <div className="min-w-0 flex-1">
                    <Text tone="ink" bold className="truncate font-display">
                      {o.title}
                    </Text>
                    <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                      <Pill tone={ORDER_STATUS[o.status].tone}>{ORDER_STATUS[o.status].label}</Pill>
                      <Text size="xs" tone="faint" as="span">
                        {new Date(o.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </Text>
                    </div>
                  </div>
                  <Money cents={o.priceCents} size="sm" />
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </div>
  );
}
