import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from '@/components/layout/RootLayout';

// Route components are code-split so the entry bundle stays lean; content and the
// 3D feature load only when their route is visited.
const HomePage = lazy(() => import('@/pages/HomePage').then((m) => ({ default: m.HomePage })));
const HardwarePage = lazy(() =>
  import('@/pages/HardwarePage').then((m) => ({ default: m.HardwarePage })),
);
const FlightPage = lazy(() =>
  import('@/pages/FlightPage').then((m) => ({ default: m.FlightPage })),
);
const LessonPage = lazy(() =>
  import('@/pages/LessonPage').then((m) => ({ default: m.LessonPage })),
);
const ProgressPage = lazy(() =>
  import('@/pages/ProgressPage').then((m) => ({ default: m.ProgressPage })),
);
const RegulationsPage = lazy(() =>
  import('@/pages/RegulationsPage').then((m) => ({ default: m.RegulationsPage })),
);
const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
);

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <RootLayout />,
      children: [
        { index: true, element: <HomePage /> },
        { path: 'hardware', element: <HardwarePage /> },
        { path: 'flight', element: <FlightPage /> },
        { path: 'lesson/:lessonId', element: <LessonPage /> },
        { path: 'progress', element: <ProgressPage /> },
        { path: 'regulations', element: <RegulationsPage /> },
        { path: '*', element: <NotFoundPage /> },
      ],
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
    },
  },
);
