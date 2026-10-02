export const lessons = [
  {
    slug: 'signals',
    title: 'Signals hold tiny truths',
    level: 'Core',
    minutes: 7,
    summary: 'Learn how a signal stores state and notifies exactly the places that read it.',
    body: [
      'A signal is a small function. Call it with no arguments to read the value.',
      'Call it with a new value, or an updater function, to change the value.',
      'What tracks the reads that happen during render, computed values, and effects.',
    ],
    code: `const count = signal(0);

count(); // read
count((value) => value + 1); // update`,
    quiz: {
      question: 'What does a signal read look like?',
      answers: ['count()', 'count.value', 'read(count)'],
      correct: 'count()',
      explanation: 'Signals are callable accessors. Reading with count() makes dependencies explicit.',
    },
    card: {
      front: 'signal(0)',
      back: 'Creates a tiny reactive value. Read with count(), update with count(next).',
    },
  },
  {
    slug: 'computed',
    title: 'Computed values derive meaning',
    level: 'Core',
    minutes: 6,
    summary: 'Turn raw state into totals, labels, filters, and progress without duplicating data.',
    body: [
      'Computed values remember which signals they read.',
      'They run again only when those dependencies change.',
      'Keep source state small and derive everything else from it.',
    ],
    code: `const percent = computed(() =>
  Math.round((completedCount() / lessons.length) * 100)
);`,
    quiz: {
      question: 'What should you store when a value can be derived?',
      answers: ['The smallest source state', 'Every display label', 'A copy in localStorage only'],
      correct: 'The smallest source state',
      explanation: 'Derived state is cheaper to keep correct when it is computed from one source.',
    },
    card: {
      front: 'computed(() => done() / total)',
      back: 'Derives a value and reruns when done() or total changes.',
    },
  },
  {
    slug: 'effects',
    title: 'Effects bridge the outside world',
    level: 'Practice',
    minutes: 8,
    summary: 'Persist progress, update document metadata, and clean up asynchronous work safely.',
    body: [
      'Effects are for side effects: storage, timers, subscriptions, and analytics.',
      'Read the signals that should trigger the effect inside the effect body.',
      'Return cleanup for timers, subscriptions, and async cancellation flags.',
    ],
    code: `effect(() => {
  const snapshot = progress();
  localStorage.setItem(key, JSON.stringify(snapshot));
});`,
    quiz: {
      question: 'Where should localStorage persistence live?',
      answers: ['In an effect', 'In every button handler', 'In route definitions'],
      correct: 'In an effect',
      explanation: 'The effect can read the source signals once and persist every consistent snapshot.',
    },
    card: {
      front: 'effect(() => save(progress()))',
      back: 'Runs when progress changes; return a cleanup when the effect owns a resource.',
    },
  },
  {
    slug: 'routing',
    title: 'Routes make learning resumable',
    level: 'Practice',
    minutes: 5,
    summary: 'Give every lesson and practice mode a URL so people and agents can revisit exact state.',
    body: [
      'The router maps concrete URLs to components.',
      'Dynamic parameters let one lesson template render many lessons.',
      'A real 404 route makes static hosting honest.',
    ],
    code: `<Route path="/lessons/:slug" component={LessonDetail} />`,
    quiz: {
      question: 'Why route lesson details?',
      answers: ['Deep links and resume points', 'To avoid data files', 'To hide state from tests'],
      correct: 'Deep links and resume points',
      explanation: 'A routeable lesson is shareable, testable, and easy for an agent to inspect.',
    },
    card: {
      front: '/lessons/:slug',
      back: 'One route pattern can render every lesson detail page.',
    },
  },
];

export function findLesson(slug) {
  return lessons.find((lesson) => lesson.slug === slug);
}
