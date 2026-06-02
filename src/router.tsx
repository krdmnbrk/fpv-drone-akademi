import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from '@/components/layout/RootLayout';
import { HomePage } from '@/pages/HomePage';
import { HardwarePage } from '@/pages/HardwarePage';
import { FlightPage } from '@/pages/FlightPage';
import { LessonPage } from '@/pages/LessonPage';
import { ProgressPage } from '@/pages/ProgressPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

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
