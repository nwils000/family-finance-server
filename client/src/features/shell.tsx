// The app frame: top bar with the kid's counters (or the grown-up's family),
// and the tab bar. Tabs come from one list per role, filtered by family features.
import { useEffect, type ComponentType } from 'react';
import { NavLink, Navigate, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Features } from '@kk/shared';
import {
  Coin,
  IconFamily,
  IconGrow,
  IconHome,
  IconInbox,
  IconLearn,
  IconQuests,
  IconSettings,
  IconShop,
  Penny,
  type UiIconProps,
} from '@/art';
import { KidAvatar, Money, Spinner, StatChip, StreakFlame, Text, XpChip } from '@/components/ui';
import { cn } from '@/lib/cn';
import { pageIn, spring } from '@/lib/motion';
import { useApprovals, useHome } from '@/lib/queries';
import { VerifyEmailBanner } from '@/pages/account';
import { useAuth } from '@/stores/auth';
import type { Role } from '@/lib/types';

interface Tab {
  to: string;
  label: string;
  Icon: ComponentType<UiIconProps>;
  /** Hidden when this returns false for the family's switches. */
  when?: (f: Features) => boolean;
}

export const TABS: Record<Role, Tab[]> = {
  kid: [
    { to: '/kid', label: 'Quests', Icon: IconHome },
    { to: '/kid/shop', label: 'Shop', Icon: IconShop, when: (f) => f.shop },
    { to: '/kid/grow', label: 'Grow', Icon: IconGrow, when: (f) => f.piggy || f.rocket || f.goals },
    { to: '/kid/learn', label: 'Learn', Icon: IconLearn, when: (f) => f.learn },
    { to: '/kid/me', label: 'Me', Icon: IconFamily },
  ],
  parent: [
    { to: '/parent', label: 'Inbox', Icon: IconInbox },
    { to: '/parent/family', label: 'Family', Icon: IconFamily },
    { to: '/parent/quests', label: 'Quests', Icon: IconQuests },
    // Always on: level prizes live here even when the shop is switched off.
    { to: '/parent/shop', label: 'Prizes', Icon: IconShop },
    { to: '/parent/learn', label: 'Lessons', Icon: IconLearn, when: (f) => f.learn },
    { to: '/parent/settings', label: 'Settings', Icon: IconSettings },
  ],
};

/** Applies the family's color theme to the whole app. */
const useFamilyTheme = (theme?: string) => {
  useEffect(() => {
    if (theme) document.documentElement.dataset.theme = theme;
  }, [theme]);
};

function KidBar() {
  const { data } = useHome();
  const kid = data?.kids[0];
  if (!kid) return null;
  return (
    <div className="flex items-center gap-2">
      <NavLink to="/kid/me" aria-label="My profile" className="press rounded-full">
        <KidAvatar avatar={kid.avatar} hat={kid.hat} size={44} ring />
      </NavLink>
      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        <span className="hidden h-10 items-center rounded-full border-[2.5px] border-ink bg-surface px-2 shadow-chunky-sm sm:inline-flex">
          <StreakFlame streak={kid.streak} size={26} />
        </span>
        <XpChip xp={kid.xp} />
        <StatChip icon={<Coin size={30} />} label="My coins">
          <Money cents={kid.balanceCents} coin={false} size="sm" />
        </StatChip>
      </div>
    </div>
  );
}

function ParentBar() {
  const { data } = useHome();
  const user = useAuth((s) => s.user);
  return (
    <div className="flex items-center gap-3">
      <Penny size={44} mood="happy" />
      <div className="min-w-0">
        <Text tone="ink" bold className="truncate font-display text-lg leading-tight">
          {data?.family.name ?? 'Kid Kapital'}
        </Text>
        <Text size="xs" tone="faint">
          Hi {user?.name}!
        </Text>
      </div>
    </div>
  );
}

function TabLink({ tab, badge }: { tab: Tab; badge?: number }) {
  return (
    <NavLink
      to={tab.to}
      end
      className={({ isActive }) =>
        cn('relative flex flex-1 flex-col items-center gap-0.5 rounded-2xl px-2 py-1.5 font-display text-xs font-semibold sm:flex-row sm:gap-1.5 sm:px-2.5 sm:py-2 sm:text-sm lg:gap-2 lg:px-4 lg:py-2.5 lg:text-base', isActive ? 'text-brand-deep' : 'text-ink-soft')
      }
    >
      {({ isActive }) => (
        <>
          {isActive && <motion.span layoutId="tab-pill" className="absolute inset-0 rounded-2xl bg-brand-light" transition={spring} />}
          <motion.span className="relative" animate={{ y: isActive ? -2 : 0, scale: isActive ? 1.12 : 1 }} transition={spring}>
            <tab.Icon active={isActive} size={26} />
            {!!badge && (
              <span className="absolute -right-2 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-ink bg-bad px-1 text-[11px] font-bold text-white">{badge}</span>
            )}
          </motion.span>
          <span className="relative">{tab.label}</span>
        </>
      )}
    </NavLink>
  );
}

export function AppShell({ role }: { role: Role }) {
  const { status, user } = useAuth();
  const home = useHome();
  const approvals = useApprovals(role === 'parent' && status === 'in');
  const location = useLocation();
  useFamilyTheme(home.data?.family.theme);
  // Every screen starts at the top; otherwise a new tab opens wherever the last one was scrolled.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if (status === 'out') return <Navigate to="/" replace />;
  if (user && user.role !== role) return <Navigate to={user.role === 'kid' ? '/kid' : '/parent'} replace />;

  const features = home.data?.family.features;
  const tabs = TABS[role].filter((t) => !t.when || !features || t.when(features));
  const inboxCount = (approvals.data?.quests.length ?? 0) + (approvals.data?.purchases.length ?? 0);

  return (
    <div className="mx-auto flex min-h-full max-w-5xl flex-col">
      <header className="sticky top-0 z-30 bg-bg/85 px-4 pb-2 pt-safe backdrop-blur-md">
        <div className="flex items-center gap-4 pt-3">
          <div className="min-w-0 flex-1">{role === 'kid' ? <KidBar /> : <ParentBar />}</div>
          <nav className="hidden gap-1 rounded-3xl border-[2.5px] border-ink bg-surface p-1 shadow-chunky-sm md:flex" aria-label="Main">
            {tabs.map((t) => (
              <TabLink key={t.to} tab={t} badge={t.to === '/parent' ? inboxCount : undefined} />
            ))}
          </nav>
        </div>
      </header>
      <main className="flex-1 px-4 pb-32 pt-2 md:pb-12">
        {home.isLoading ? (
          <div className="flex justify-center py-24">
            <Spinner size={48} />
          </div>
        ) : (
          <motion.div key={location.pathname} {...pageIn}>
            {role === 'parent' && <VerifyEmailBanner />}
            <Outlet />
          </motion.div>
        )}
      </main>
      <nav className="fixed inset-x-3 bottom-3 z-30 flex rounded-[28px] border-[2.5px] border-ink bg-surface p-1.5 shadow-chunky md:hidden pb-safe" aria-label="Main">
        {tabs.map((t) => (
          <TabLink key={t.to} tab={t} badge={t.to === '/parent' ? inboxCount : undefined} />
        ))}
      </nav>
    </div>
  );
}
