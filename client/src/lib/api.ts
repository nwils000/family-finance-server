// The only module that talks to the server. Components call the typed
// functions in `endpoints`, never axios directly.
import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { PLAN_LIMIT_CODE, type AccountKind, type HatId } from '@kk/shared';
import { isNative, secureStorage } from './secure-storage';
import type * as T from './types';

const BASE_URL = import.meta.env.VITE_API_URL ?? '/api';

/**
 * Sent on every call, the refresh included. X-Requested-With proves the request came
 * from this app, not a cross-site form: the server's csrfGuard (security.ts) refuses
 * state changes without it.
 */
const BASE_HEADERS = { 'X-Requested-With': 'XMLHttpRequest', ...(isNative() ? { 'X-Client-Platform': 'native' } : {}) };

export const http = axios.create({ baseURL: BASE_URL, withCredentials: true, headers: BASE_HEADERS });

// The access token lives in memory only (see secure-storage.ts).
let accessToken: string | null = null;
let onSessionLost: () => void = () => undefined;
let onPlanLimit: (message: string) => void = () => undefined;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};
export const setOnSessionLost = (fn: () => void) => {
  onSessionLost = fn;
};
/** Any call the server refuses with 402 PLAN_LIMIT opens the Kapital Plus upsell (features/billing.tsx). */
export const setOnPlanLimit = (fn: (message: string) => void) => {
  onPlanLimit = fn;
};

http.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

/** Store what a login or refresh hands back. */
export const acceptSession = async (session: T.Session) => {
  setAccessToken(session.accessToken);
  if (session.refreshToken) await secureStorage.setRefreshToken(session.refreshToken);
  return session;
};

// One refresh at a time: parallel 401s all wait on the same promise.
let refreshing: Promise<T.Session> | null = null;
export const refreshSession = () => {
  refreshing ??= (async () => {
    const refreshToken = await secureStorage.getRefreshToken();
    const { data } = await axios.post<T.Session>(`${BASE_URL}/auth/refresh`, refreshToken ? { refreshToken } : {}, {
      withCredentials: true,
      headers: BASE_HEADERS,
    });
    return acceptSession(data);
  })().finally(() => {
    refreshing = null;
  });
  return refreshing;
};

http.interceptors.response.use(undefined, async (error: AxiosError) => {
  const original = error.config as (InternalAxiosRequestConfig & { _retried?: boolean }) | undefined;
  const isAuthCall = original?.url?.startsWith('/auth/');
  const body = error.response?.data as { code?: string; error?: string } | undefined;
  if (error.response?.status === 402 && body?.code === PLAN_LIMIT_CODE) onPlanLimit(body.error ?? '');
  if (error.response?.status === 401 && original && !original._retried && !isAuthCall) {
    original._retried = true;
    try {
      await refreshSession();
      return http(original);
    } catch {
      onSessionLost();
    }
  }
  throw error;
});

/** The friendly message the server sent, for toasts. */
export const errorMessage = (err: unknown) =>
  (err as AxiosError<{ error?: string }>)?.response?.data?.error ?? 'Something went wrong. Try again!';
export const errorStatus = (err: unknown) => (err as AxiosError)?.response?.status;
export const errorCode = (err: unknown) => (err as AxiosError<{ code?: string }>)?.response?.data?.code;

const get = <R>(url: string, params?: object) => http.get<R>(url, { params }).then((r) => r.data);
const post = <R>(url: string, body?: object) => http.post<R>(url, body).then((r) => r.data);
const patch = <R>(url: string, body?: object) => http.patch<R>(url, body).then((r) => r.data);
const del = <R>(url: string) => http.delete<R>(url).then((r) => r.data);

type Ok = { ok: true };

export const endpoints = {
  signup: (b: { name: string; email: string; password: string; familyName: string; acceptLegal: boolean }) => post<T.Session>('/auth/signup', b),
  join: (b: { name: string; email: string; password: string; invite: string; acceptLegal: boolean }) => post<T.Session>('/auth/join', b),
  checkInvite: (invite: string) => post<{ valid: true; familyName: string } | { valid: false }>('/auth/invite/check', { invite }),
  login: (b: { email: string; password: string }) => post<T.Session>('/auth/login', b),
  kidLogin: (b: { code: string; kidId: string; pin: string }) => post<T.Session>('/auth/kid-login', b),
  familyPreview: (code: string) => get<{ name: string; kids: T.KidRef[] }>(`/auth/family/${encodeURIComponent(code)}`),
  logout: async () => {
    const refreshToken = await secureStorage.getRefreshToken();
    await post<Ok>('/auth/logout', refreshToken ? { refreshToken } : {});
  },
  me: () => get<{ user: T.User }>('/auth/me'),
  forgotPassword: (email: string) => post<Ok>('/auth/password/forgot', { email }),
  // POST, token in the body: a token in a path would end up in request logs.
  checkResetToken: (token: string) => post<{ valid: boolean }>('/auth/password/reset/check', { token }),
  verifyEmail: (token: string) => post<Ok>('/auth/email/verify', { token }),
  resendVerification: () => post<Ok & { alreadyVerified: boolean }>('/auth/email/resend'),
  resetPassword: (token: string, password: string) => post<Ok>('/auth/password/reset', { token, password }),
  changePassword: (b: { currentPassword?: string; newPassword: string }) => post<T.Session>('/auth/password/change', b),
  logoutAll: () => post<T.Session>('/auth/logout-all'),
  providers: () => get<T.SocialProviders>('/auth/providers'),
  /** Everything the family stored, as JSON (grown-ups only). */
  exportData: () => get<Record<string, unknown>>('/account/export'),
  /** Delete your grown-up account; the last grown-up deletes the whole family. */
  deleteAccount: (password: string) => post<{ familyDeleted: boolean }>('/account/delete', { password }),
  googleSignIn: (b: T.SocialExtras & { idToken: string }) => post<T.Session>('/auth/google', b),
  appleNonce: () => get<{ nonce: string }>('/auth/apple/nonce'),
  appleSignIn: (b: T.SocialExtras & { identityToken: string; nonce: string; name?: string }) => post<T.Session>('/auth/apple', b),

  billingStatus: () => get<T.BillingStatus>('/billing/status'),
  checkout: () => post<{ url: string }>('/billing/checkout'),
  billingPortal: () => post<{ url: string }>('/billing/portal'),
  syncPurchases: () => post<T.BillingStatus>('/billing/sync'),

  home: () => get<T.Home>('/family'),
  updateSettings: (b: Partial<Omit<T.FamilySettings, 'id' | 'code' | 'features'>> & { features?: Partial<T.FamilySettings['features']> }) =>
    patch<{ family: T.FamilySettings }>('/family/settings', b),
  addKid: (b: { name: string; avatar: string; pin: string; age?: number | null }) => post<{ kid: T.Kid }>('/family/kids', b),
  updateKid: (
    id: string,
    b: { name?: string; avatar?: string; pin?: string; starValueCents?: number | null; effortBoost?: number; trusted?: boolean; age?: number | null },
  ) => patch<{ kid: T.Kid }>(`/family/kids/${id}`, b),
  removeKid: (id: string) => del<Ok>(`/family/kids/${id}`),
  createInvite: () => post<{ url: string; expiresAt: string }>('/family/invites'),
  rotateFamilyCode: () => post<{ code: string }>('/family/code/rotate'),
  gift: (id: string, b: { amountCents: number; label: string }) => post<Ok>(`/family/kids/${id}/gift`, b),

  day: (date: string) => get<T.Day>('/quests', { date }),
  allQuests: () => get<{ quests: T.Quest[] }>('/quests/all'),
  createQuest: (b: Omit<T.Quest, 'id' | 'kidId' | 'rewardCents'> & { rewardCents?: number; kidIds: string[] }) =>
    post<{ quests: T.Quest[] }>('/quests', b),
  updateQuest: (id: string, b: Partial<Omit<T.Quest, 'id' | 'kidId'>>) => patch<{ quest: T.Quest }>(`/quests/${id}`, b),
  archiveQuest: (id: string) => del<Ok>(`/quests/${id}`),
  markDone: (id: string, date: string) =>
    // A trusted quest comes back approved and paid; anything else waits for a grown-up.
    post<({ run: { id: string; status: 'approved' }; paidCents: number } & T.XpResult) | { run: { id: string; status: Exclude<T.RunStatus, 'approved'> } }>(`/quests/${id}/done`, { date }),
  setHelpers: (id: string, date: string, helperIds: string[]) => http.put<{ helperIds: string[] }>(`/quests/${id}/helpers`, { date, helperIds }).then((r) => r.data),
  undoDone: (id: string, date: string) => post<Ok>(`/quests/${id}/undo`, { date }),
  approveRun: (id: string) => post<T.XpResult & { paidCents: number }>(`/runs/${id}/approve`),
  rejectRun: (id: string) => post<Ok>(`/runs/${id}/reject`),

  rewards: () => get<{ rewards: T.Reward[] }>('/shop/rewards'),
  createReward: (b: Omit<T.Reward, 'id'>) => post<{ reward: T.Reward }>('/shop/rewards', b),
  updateReward: (id: string, b: Partial<Omit<T.Reward, 'id'>>) => patch<{ reward: T.Reward }>(`/shop/rewards/${id}`, b),
  archiveReward: (id: string) => del<Ok>(`/shop/rewards/${id}`),
  buy: (id: string) => post<{ purchase: T.Purchase }>(`/shop/rewards/${id}/buy`, {}),
  purchases: () => get<{ purchases: T.Purchase[] }>('/shop/purchases'),
  fulfill: (id: string) => post<Ok>(`/shop/purchases/${id}/fulfill`),
  decline: (id: string) => post<Ok>(`/shop/purchases/${id}/decline`),

  grow: (kidId?: string) => get<T.Grow>('/grow', { kidId }),
  moveGrowth: (kind: AccountKind, direction: 'deposit' | 'withdraw', amountCents: number) =>
    post<Ok>(`/grow/${kind}/${direction}`, { amountCents }),
  activity: (kidId?: string) => get<{ activity: T.ActivityItem[] }>('/activity', { kidId }),
  approvals: () => get<T.Approvals>('/approvals'),

  teamGoals: () => get<{ goals: T.TeamGoal[] }>('/team-goals'),
  createTeamGoal: (b: { title: string; icon: string | null; targetPoints: number; kidIds: string[] }) => post<{ goal: T.TeamGoal }>('/team-goals', b),
  updateTeamGoal: (id: string, b: Partial<{ title: string; icon: string | null; targetPoints: number; kidIds: string[] }>) =>
    patch<{ goal: T.TeamGoal }>(`/team-goals/${id}`, b),
  archiveTeamGoal: (id: string) => del<Ok>(`/team-goals/${id}`),
  handOverTeamGoal: (id: string) => post<Ok>(`/team-goals/${id}/hand-over`),
  milestones: (kidId?: string) => get<{ assistPoints: number | null; level: number | null; milestones: T.Milestone[] }>('/milestones', { kidId }),
  createMilestone: (b: { kind: T.Milestone['kind']; title: string; icon: string | null; points: number }) => post<{ milestone: T.Milestone }>('/milestones', b),
  updateMilestone: (id: string, b: Partial<{ title: string; icon: string | null; points: number }>) => patch<{ milestone: T.Milestone }>(`/milestones/${id}`, b),
  archiveMilestone: (id: string) => del<Ok>(`/milestones/${id}`),

  lessons: (kidId?: string) => get<T.LessonList>('/learn', { kidId }),
  assignLesson: (id: string, kidIds: string[], rewardCents: number | null) => post<Ok>(`/learn/${id}/assign`, { kidIds, rewardCents }),
  unassignLesson: (id: string, kidId: string) => post<Ok>(`/learn/${id}/unassign`, { kidId }),
  completeLesson: (id: string, answers: number[]) => post<T.LessonResult>(`/learn/${id}/complete`, { answers }),
  openChest: (date: string) => post<T.XpResult>('/game/chest', { date }),
  setHat: (hat: HatId) => patch<Ok>('/game/hat', { hat }),
  setGoal: (goal: T.Goal | null) => patch<Ok>('/game/goal', { goal }),
};

/** Dev build only (null in production, so the paths never ship): demo-family quick login. */
export const devEndpoints = import.meta.env.DEV
  ? {
      accounts: () => get<{ accounts: (T.KidRef & { role: T.Role; hat: HatId })[] }>('/auth/dev/accounts'),
      login: (id: string) => post<T.Session>('/auth/dev/login', { id }),
    }
  : null;
