import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { screen } from '@/test/utils';
import { LessonPage } from './LessonPage';

function renderLesson(id: string) {
  return render(
    <MemoryRouter
      initialEntries={[`/lesson/${id}`]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Routes>
        <Route path="/lesson/:lessonId" element={<LessonPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('LessonPage', () => {
  it('renders an authored lesson with objectives and its quiz', () => {
    renderLesson('fpv-nedir');
    expect(screen.getByRole('heading', { level: 1, name: 'FPV nedir?' })).toBeInTheDocument();
    expect(screen.getByText('Bu derste öğrenecekleriniz')).toBeInTheDocument();
    expect(screen.getByText('FPV kısaltması ne anlama gelir?')).toBeInTheDocument();
  });

  it('shows a not-found message for an unknown lesson', () => {
    renderLesson('does-not-exist');
    expect(screen.getByText('Ders bulunamadı.')).toBeInTheDocument();
  });
});
