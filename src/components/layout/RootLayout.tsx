import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { SkipLink, MAIN_CONTENT_ID } from './SkipLink';
import { Header } from './Header';
import { Footer } from './Footer';
import { RouteFocusManager } from './RouteFocusManager';
import { PageLoading } from './PageLoading';
import { SafetyBanner } from './SafetyBanner';

export function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-transparent text-brand-50">
      <SkipLink />
      <RouteFocusManager />
      <Header />
      <SafetyBanner />
      <main id={MAIN_CONTENT_ID} tabIndex={-1} className="flex-1 outline-none">
        <Suspense fallback={<PageLoading />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
