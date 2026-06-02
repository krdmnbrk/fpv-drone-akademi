import type { Translation } from './tr';

/**
 * English locale — scaffolded for i18n readiness. Mirrors the Turkish key
 * structure exactly (enforced by the `Translation` type). Turkish is the
 * shipping language; these strings are an initial translation.
 */
export const en: Translation = {
  common: {
    appName: 'FPV Drone Academy',
    skipToContent: 'Skip to content',
    loading: 'Loading…',
    backToHome: 'Back to home',
    minutesShort: 'min',
  },
  nav: {
    home: 'Home',
    hardware: 'Hardware',
    flight: 'Flight School',
    progress: 'Progress',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
  },
  home: {
    heroKicker: 'Cleared for takeoff',
    heroTitle: 'FPV Drone Academy',
    heroSubtitle:
      'Explore the hardware in interactive 3D and learn to fly step by step, from beginner to advanced.',
    ctaHardware: 'Explore the Hardware',
    ctaFlight: 'Learn to Fly',
    startHere: 'Start here',
    continue: 'Continue where you left off',
    allDone: 'You finished every lesson 🎉',
    exploreOwn: 'or explore on your own',
    tracksTitle: 'Two paths, one goal',
    hardwareCardTitle: 'Learn the Hardware',
    hardwareCardDesc:
      'Discover every part from frame to flight controller in a 3D model; see what it does and how it connects.',
    flightCardTitle: 'Learn to Fly',
    flightCardDesc:
      'A staged beginner-to-advanced curriculum: theory, visual simulation, practice, and self-testing.',
  },
  hardware: {
    title: 'Hardware Explorer',
    intro:
      'Get to know the parts that make up an FPV drone. Click a part to learn what it does, how to choose it, and how it connects.',
    partsHeading: 'Parts',
    selectPartHint: 'Select a part to inspect it.',
    whatItDoes: 'What it does',
    howToChoose: 'How to choose',
    howItConnects: 'How it connects',
    commonMistakes: 'Common mistakes',
    relatedLessons: 'Related lessons',
    relatedHardware: 'Related hardware',
    rotateHint: 'Drag to rotate, scroll to zoom.',
    onCraftNote: 'Parts on the drone are highlighted in the 3D model.',
    threeDUnavailable: '3D view is unavailable on this device. Explore the parts from the list.',
  },
  flight: {
    title: 'Flight School',
    intro:
      'Pick your level and progress. Each lesson has short theory, a visual explanation, an interactive demo, and a mini quiz.',
    levels: {
      beginner: 'Beginner',
      intermediate: 'Intermediate',
      advanced: 'Advanced',
    },
    comingSoon: 'Coming soon',
    inProgress: 'In progress',
    prereqHint: 'Complete first',
    openAnyway: 'Open anyway',
  },
  lesson: {
    objectives: 'What you will learn',
    prerequisites: 'Prerequisites',
    markComplete: 'Mark as complete',
    completed: 'Completed',
    next: 'Next lesson',
    previous: 'Previous lesson',
    notFound: 'Lesson not found.',
    demoComingSoon: 'Interactive demo • coming soon',
    video: 'Video',
    playVideo: 'Play video',
    videoEnglish: 'in English',
  },
  quiz: {
    title: 'Mini Quiz',
    question: 'Question {{current}} / {{total}}',
    submit: 'Answer',
    nextQuestion: 'Next question',
    finish: 'Finish',
    correct: 'Correct!',
    incorrect: 'Incorrect.',
    resultTitle: 'Result',
    scoreLine: '{{correct}} of {{total}} correct',
    retry: 'Try again',
  },
  progress: {
    title: 'Your Progress',
    overall: 'Overall progress',
    badges: 'Badges',
    noBadges: 'No badges yet. Start by completing your first lesson!',
    reset: 'Reset progress',
    resetConfirm: 'All progress and badges will be deleted. Are you sure?',
  },
  badges: {
    locked: 'Locked',
    firstFlight: { name: 'First Flight', desc: 'You completed your first lesson.' },
    beginnerGraduate: { name: 'Beginner Graduate', desc: 'You completed all beginner lessons.' },
    intermediateGraduate: {
      name: 'Intermediate Graduate',
      desc: 'You completed all intermediate lessons.',
    },
    advancedGraduate: { name: 'Advanced Graduate', desc: 'You completed all advanced lessons.' },
    fullCurriculum: { name: 'Full Pilot', desc: 'You completed the entire curriculum!' },
  },
  settings: {
    language: 'Language',
    turkish: 'Türkçe',
    english: 'English',
    motion: 'Motion',
    motionSystem: 'System setting',
    motionOn: 'On',
    motionOff: 'Reduced',
    quality: '3D Quality',
    qualityAuto: 'Auto',
    qualityHigh: 'High',
    qualityLow: 'Low',
  },
  notFound: {
    title: 'Page not found',
    desc: 'The page you are looking for may have left the runway.',
  },
  footer: {
    tagline: 'An interactive learning platform for FPV beginners.',
    disclaimer:
      'For educational purposes. Verify current SHGM/İHA regulations from official sources before flying.',
    regulations: 'SHGM / İHA rules',
  },
};
