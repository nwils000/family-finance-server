// Server state. Every read is a hook here; every write goes through useAction,
// which owns error toasts and cache invalidation.
import { useMutation, useQuery, useQueryClient, QueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { endpoints, errorMessage } from './api';

export const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 15_000, retry: 1, refetchOnWindowFocus: true } },
});

/** The one list of cache keys. */
export const qk = {
  home: ['home'] as const,
  day: (date: string) => ['day', date] as const,
  allQuests: ['quests'] as const,
  rewards: ['rewards'] as const,
  purchases: ['purchases'] as const,
  grow: (kidId?: string) => ['grow', kidId ?? 'me'] as const,
  activity: (kidId?: string) => ['activity', kidId ?? 'all'] as const,
  approvals: ['approvals'] as const,
  providers: ['providers'] as const,
  teamGoals: ['teamGoals'] as const,
  lessons: (kidId?: string) => ['lessons', kidId ?? 'me'] as const,
  milestones: (kidId?: string) => ['milestones', kidId ?? 'me'] as const,
};

/** Anything that moves coins or XP can change all of these. */
export const MONEY_KEYS = [qk.home, ['grow'], ['activity'], qk.approvals, qk.purchases, ['day'], qk.teamGoals, ['milestones']] as const;

export const useHome = () => useQuery({ queryKey: qk.home, queryFn: endpoints.home });
export const useDay = (date: string) => useQuery({ queryKey: qk.day(date), queryFn: () => endpoints.day(date) });
export const useAllQuests = () => useQuery({ queryKey: qk.allQuests, queryFn: endpoints.allQuests });
export const useRewards = () => useQuery({ queryKey: qk.rewards, queryFn: endpoints.rewards });
export const usePurchases = () => useQuery({ queryKey: qk.purchases, queryFn: endpoints.purchases });
export const useGrow = (kidId?: string) => useQuery({ queryKey: qk.grow(kidId), queryFn: () => endpoints.grow(kidId) });
export const useActivity = (kidId?: string) => useQuery({ queryKey: qk.activity(kidId), queryFn: () => endpoints.activity(kidId) });
export const useLessons = (kidId?: string) => useQuery({ queryKey: qk.lessons(kidId), queryFn: () => endpoints.lessons(kidId) });
export const useTeamGoals = () => useQuery({ queryKey: qk.teamGoals, queryFn: endpoints.teamGoals });
export const useMilestones = (kidId?: string) => useQuery({ queryKey: qk.milestones(kidId), queryFn: () => endpoints.milestones(kidId) });
/** Which social sign-in buttons this server supports. Rarely changes, so it is cached for the session. */
export const useSocialProviders = () => useQuery({ queryKey: qk.providers, queryFn: endpoints.providers, staleTime: Infinity, retry: 0 });
export const useApprovals = (enabled = true) =>
  useQuery({ queryKey: qk.approvals, queryFn: endpoints.approvals, enabled, refetchInterval: 20_000 });

interface ActionOptions<R> {
  /** Cache keys to refresh afterwards. Defaults to everything money touches. */
  invalidate?: readonly (readonly unknown[])[];
  onSuccess?: (result: R) => void;
  /** Toast shown on success, if any. */
  success?: string;
}

/** Wrap any endpoint call as a mutation with toasts and invalidation built in. */
export const useAction = <A extends unknown[], R>(fn: (...args: A) => Promise<R>, opts: ActionOptions<R> = {}) => {
  const client = useQueryClient();
  const m = useMutation({
    mutationFn: (args: A) => fn(...args),
    onSuccess: (result) => {
      if (opts.success) toast.success(opts.success);
      opts.onSuccess?.(result);
    },
    onError: (err) => toast.error(errorMessage(err)),
    onSettled: () =>
      Promise.all((opts.invalidate ?? MONEY_KEYS).map((queryKey) => client.invalidateQueries({ queryKey: [...queryKey] }))),
  });
  return { run: (...args: A) => m.mutateAsync(args), busy: m.isPending };
};

/** The signed-in kid's own summary (a kid's home only ever contains themself). */
export const useSelfKid = () => {
  const home = useHome();
  return { ...home, kid: home.data?.kids[0] ?? null, family: home.data?.family ?? null };
};
