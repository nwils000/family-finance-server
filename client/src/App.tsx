import { LegalUpdateHost } from '@/features/legal-update';
import { appPageMeta, LEGAL_PATHS } from '@kk/shared';
import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Spinner } from '@/components/ui';
import { ConfirmProvider } from '@/components/ui';
import { MomentOverlay } from '@/features/moments';
import { AppShell } from '@/features/shell';
import { ConsentLinkPage, ForgotPasswordPage, ResetPasswordPage, VerifyEmailPage } from '@/pages/account';
import { GrownUpPage, KidLoginPage, WelcomePage } from '@/pages/auth';
import { useAuth } from '@/stores/auth';

const KidHome = lazy(() => import('@/pages/kid/KidHome'));
const KidShop = lazy(() => import('@/pages/kid/KidShop'));
const KidGrow = lazy(() => import('@/pages/kid/KidGrow'));
const KidMe = lazy(() => import('@/pages/kid/KidMe'));
const KidLearn = lazy(() => import('@/pages/kid/KidLearn'));
const KidLesson = lazy(() => import('@/pages/kid/KidLesson'));
const ParentInbox = lazy(() => import('@/pages/parent/ParentInbox'));
const ParentFamily = lazy(() => import('@/pages/parent/ParentFamily'));
const ParentQuests = lazy(() => import('@/pages/parent/ParentQuests'));
const ParentShop = lazy(() => import('@/pages/parent/ParentShop'));
const ParentSettings = lazy(() => import('@/pages/parent/ParentSettings'));
const LegalPage = lazy(() => import('@/pages/legal'));
const ParentLearn = lazy(() => import('@/pages/parent/ParentLearn'));
const ArtGallery = lazy(() => import('@/pages/ArtGallery'));
// Dev build only; the false branch (and the module) is dropped from production bundles.
const DevSwitcher = import.meta.env.DEV ? lazy(() => import('@/features/dev-switcher')) : null;

const Loading = () => (
  <div className="flex min-h-full items-center justify-center">
    <Spinner size={56} />
  </div>
);

/** The browser tab says which page this is (the same names the server writes for crawlers). */
function PageTitle() {
  const { pathname } = useLocation();
  useEffect(() => {
    document.title = appPageMeta(pathname).title;
  }, [pathname]);
  return null;
}

export default function App() {
  const { status, init } = useAuth();
  useEffect(() => {
    void init();
  }, [init]);

  if (status === 'loading') return <Loading />;

  return (
    <BrowserRouter>
      <ConfirmProvider>
        <PageTitle />
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/login" element={<GrownUpPage mode="login" />} />
            <Route path="/signup" element={<GrownUpPage mode="signup" />} />
            <Route path="/join" element={<GrownUpPage mode="join" />} />
            <Route path="/kid-login" element={<KidLoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/consent" element={<ConsentLinkPage mode="confirm" />} />
            <Route path="/consent/withdraw" element={<ConsentLinkPage mode="withdraw" />} />
            <Route path={LEGAL_PATHS.privacy} element={<LegalPage doc="privacy" />} />
            <Route path={LEGAL_PATHS.terms} element={<LegalPage doc="terms" />} />
            <Route path="/kid" element={<AppShell role="kid" />}>
              <Route index element={<KidHome />} />
              <Route path="shop" element={<KidShop />} />
              <Route path="grow" element={<KidGrow />} />
              <Route path="me" element={<KidMe />} />
              <Route path="learn" element={<KidLearn />} />
              <Route path="learn/:lessonId" element={<KidLesson />} />
            </Route>
            <Route path="/parent" element={<AppShell role="parent" />}>
              <Route index element={<ParentInbox />} />
              <Route path="family" element={<ParentFamily />} />
              <Route path="quests" element={<ParentQuests />} />
              <Route path="shop" element={<ParentShop />} />
              <Route path="learn" element={<ParentLearn />} />
              <Route path="settings" element={<ParentSettings />} />
            </Route>
            {import.meta.env.DEV && <Route path="/art" element={<ArtGallery />} />}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
        {DevSwitcher && (
          <Suspense fallback={null}>
            <DevSwitcher />
          </Suspense>
        )}
        <MomentOverlay />
        <LegalUpdateHost />
        <Toaster
          position="top-center"
          toastOptions={{
            className: '!rounded-2xl !border-[2.5px] !border-ink !font-display !font-semibold !text-ink !shadow-chunky-sm',
          }}
        />
      </ConfirmProvider>
    </BrowserRouter>
  );
}
