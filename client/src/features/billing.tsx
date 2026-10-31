// Kapital Plus on the client: the plan hook, the Settings card, and the one
// upsell sheet that opens whenever the server refuses something with PLAN_LIMIT.
// What each plan allows comes from @kk/shared PLAN_LIMITS, never a local copy.
import { useEffect, useState, type ReactNode } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { PAID_PLANS, PLAN_LIMITS, PLAN_NAMES, canAddMore, planAllows, type PlanFeature, type PlanLimitKey } from '@kk/shared';
import { Avatar, BadgeHelper, Rocket, Sparkle, Trophy } from '@/art';
import { Button, Card, Heading, PennySays, Pill, ProgressBar, Sheet, Text } from '@/components/ui';
import { endpoints, errorMessage, setOnPlanLimit } from '@/lib/api';
import { celebrate } from '@/lib/celebrate';
import { purchases } from '@/lib/purchases';
import { qk, useBillingStatus } from '@/lib/queries';
import { useAuth } from '@/stores/auth';

/** The family's plan and what it allows. Free until the server says otherwise. */
export const usePlan = () => {
  const user = useAuth((s) => s.user);
  const status = useBillingStatus(!!user);
  const plan = status.data?.plan ?? 'free';
  return {
    ...status,
    plan,
    allows: (feature: PlanFeature) => planAllows(plan, feature),
    canAdd: (key: PlanLimitKey, currentCount: number) => canAddMore(plan, key, currentCount),
  };
};

/** What Plus adds over Free, read straight from PLAN_LIMITS so the list can never drift. */
const PERK_COPY: Record<PlanLimitKey | PlanFeature, { title: string; art: ReactNode }> = {
  kids: { title: 'Room for every kid', art: <Avatar id="panda" size={44} /> },
  teamGoals: { title: 'As many team goals as you like', art: <Trophy size={44} /> },
  rocket: { title: 'The rocket fund, for a taste of investing', art: <Rocket size={44} /> },
  assists: { title: 'Helper points when siblings pitch in', art: <BadgeHelper size={44} /> },
};
const plusPerks = () => {
  const { free, plus } = PLAN_LIMITS;
  const limits = (Object.keys(plus.limits) as PlanLimitKey[]).filter((k) => plus.limits[k] !== free.limits[k]);
  const features = (Object.keys(plus.features) as PlanFeature[]).filter((f) => plus.features[f] && !free.features[f]);
  // A key that is both a limit and a feature (team goals) shows once.
  return [...new Set<PlanLimitKey | PlanFeature>([...limits, ...features])];
};

function PerkList() {
  return (
    <div className="flex flex-col gap-3">
      {plusPerks().map((k) => (
        <div key={k} className="flex items-center gap-3">
          <span className="shrink-0">{PERK_COPY[k].art}</span>
          <Text tone="ink" bold>
            {PERK_COPY[k].title}
          </Text>
        </div>
      ))}
    </div>
  );
}

/** Upgrade: Stripe Checkout on the web, the App Store / Google Play in the app. */
function UpgradeButton({ block = true }: { block?: boolean }) {
  const user = useAuth((s) => s.user);
  const { data } = useBillingStatus(!!user);
  const client = useQueryClient();
  const [busy, setBusy] = useState(false);
  const native = purchases.available();
  const ready = native || !!data?.web.checkout;

  const upgrade = async () => {
    if (!user) return;
    setBusy(true);
    try {
      if (native) {
        if (await purchases.buyPlus(user.familyId)) {
          celebrate('coins');
          toast.success('Welcome to Kapital Plus!');
        }
        await client.invalidateQueries({ queryKey: [...qk.billing] });
      } else {
        const { url } = await endpoints.checkout();
        window.location.assign(url);
      }
    } catch (err) {
      toast.error(err instanceof Error && !('response' in err) ? err.message : errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  if (!ready) {
    return (
      <Text size="sm" tone="faint" className="text-center">
        Upgrades open soon. Everything on Free keeps working.
      </Text>
    );
  }
  return (
    <Button variant="coin" size="lg" block={block} busy={busy} icon={<Sparkle size={24} />} onClick={() => void upgrade()}>
      Get {PLAN_NAMES.plus}
    </Button>
  );
}

/** Manage an existing plan where it was bought: the Stripe portal, or the store. */
function ManageButton() {
  const { data } = useBillingStatus();
  const [busy, setBusy] = useState(false);
  if (!data || data.source === 'manual') return null;
  const manage = async () => {
    if (data.source === 'revenuecat') return void window.open(purchases.manageUrl(), '_blank', 'noopener');
    setBusy(true);
    try {
      window.location.assign((await endpoints.billingPortal()).url);
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };
  if (data.source === 'stripe' && !data.web.portal) return null;
  return (
    <Button variant="secondary" block busy={busy} onClick={() => void manage()}>
      Manage plan
    </Button>
  );
}

function RestoreButton() {
  const user = useAuth((s) => s.user);
  const client = useQueryClient();
  const [busy, setBusy] = useState(false);
  if (!purchases.available() || !user) return null;
  return (
    <Button
      variant="ghost"
      size="sm"
      busy={busy}
      onClick={() => {
        setBusy(true);
        purchases
          .restore(user.familyId)
          .then(() => client.invalidateQueries({ queryKey: [...qk.billing] }))
          .catch((err) => toast.error(errorMessage(err)))
          .finally(() => setBusy(false));
      }}
    >
      Restore purchases
    </Button>
  );
}

const formatDay = (iso: string) => new Date(iso).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });

/** The plan section in grown-up Settings. Absent while Kid Kapital is free for everyone (PAID_PLANS). */
export const PlanCard = () => (PAID_PLANS ? <PlanCardBody /> : null);

function PlanCardBody() {
  const { data, plan, refetch } = usePlan();
  const [params, setParams] = useSearchParams();

  // Back from Stripe Checkout: the webhook may land a moment later, so look again shortly.
  useEffect(() => {
    if (params.get('plus') !== 'welcome') return;
    setParams({}, { replace: true });
    celebrate('coins');
    toast.success('Thanks! Kapital Plus is on its way.');
    const t = setTimeout(() => void refetch(), 2500);
    return () => clearTimeout(t);
  }, [params, setParams, refetch]);

  if (!data) return null;
  const kidLimit = PLAN_LIMITS[plan].limits.kids;

  if (plan === 'plus') {
    return (
      <Card tone="coin" className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Trophy size={56} />
          <div className="min-w-0 flex-1">
            <Heading size="xs">{PLAN_NAMES.plus}</Heading>
            <Text size="sm">
              {data.renewsAt
                ? data.cancelAtPeriodEnd || data.status === 'cancelled'
                  ? `Ends on ${formatDay(data.renewsAt)}`
                  : `Renews on ${formatDay(data.renewsAt)}`
                : 'Your family has every feature.'}
            </Text>
          </div>
          <Pill tone="good">Active</Pill>
        </div>
        {data.status === 'past_due' && (
          <Text tone="bad" size="sm" bold>
            The last payment did not go through. Update your payment details to keep Plus.
          </Text>
        )}
        <ManageButton />
      </Card>
    );
  }

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <Heading size="xs">You are on {PLAN_NAMES.free}</Heading>
        <Pill tone="plain">{PLAN_NAMES.free}</Pill>
      </div>
      {kidLimit !== null && (
        <div className="flex flex-col gap-1.5">
          <Text size="sm" bold>
            {data.usage.kids} of {kidLimit} kids
          </Text>
          <ProgressBar value={Math.min(1, data.usage.kids / kidLimit)} tone="brand" />
        </div>
      )}
      <div className="flex flex-col gap-3 rounded-2xl bg-coin-light p-4">
        <Text tone="ink" bold className="font-display">
          {PLAN_NAMES.plus} adds
        </Text>
        <PerkList />
      </div>
      <UpgradeButton />
      <RestoreButton />
    </Card>
  );
}

/**
 * Mounted once in App. Any API call refused with PLAN_LIMIT opens this sheet with
 * the server's own explanation. Kids are sent to a grown-up instead of a store.
 */
export const PlanUpsellHost = () => (PAID_PLANS ? <PlanUpsellSheet /> : null);

function PlanUpsellSheet() {
  const [message, setMessage] = useState<string | null>(null);
  const role = useAuth((s) => s.user?.role);
  const navigate = useNavigate();
  useEffect(() => {
    setOnPlanLimit((m) => setMessage(m || `That is part of ${PLAN_NAMES.plus}.`));
    return () => setOnPlanLimit(() => undefined);
  }, []);

  return (
    <Sheet open={message !== null} onClose={() => setMessage(null)} title={PLAN_NAMES.plus}>
      <div className="flex flex-col gap-4">
        <PennySays mood="wow">{role === 'kid' ? `${message} Ask a grown-up about it!` : message}</PennySays>
        {role === 'parent' && (
          <>
            <PerkList />
            <UpgradeButton />
            <Button
              variant="ghost"
              block
              onClick={() => {
                setMessage(null);
                navigate('/parent/settings');
              }}
            >
              See plans in Settings
            </Button>
          </>
        )}
      </div>
    </Sheet>
  );
}
