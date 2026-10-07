import { computed, effect, signal } from 'what-framework';
import { lessons } from '../data/lessons.js';

export const STORAGE_KEY = 'what-starter-finch-v1';

export function seedProgress() {
  return {
    completed: [],
    answers: {},
    cardIndex: 0,
    streak: 0,
  };
}

export function loadProgress(storage = globalThis.localStorage) {
  if (!storage) return seedProgress();
  try {
    const parsed = JSON.parse(storage.getItem(STORAGE_KEY) || 'null');
    if (!parsed || typeof parsed !== 'object') return seedProgress();
    return {
      completed: Array.isArray(parsed.completed) ? parsed.completed.filter((slug) => lessons.some((lesson) => lesson.slug === slug)) : [],
      answers: parsed.answers && typeof parsed.answers === 'object' ? parsed.answers : {},
      cardIndex: Number.isInteger(parsed.cardIndex) ? Math.max(0, Math.min(lessons.length - 1, parsed.cardIndex)) : 0,
      streak: Number.isInteger(parsed.streak) ? Math.max(0, parsed.streak) : 0,
    };
  } catch {
    return seedProgress();
  }
}

const initial = loadProgress();

export const progress = signal(initial, 'finch.progress');
export const storageMessage = signal('Progress saves on this device.', 'finch.storageMessage');
export const activeLessonSlug = signal(lessons[0].slug, 'finch.activeLesson');

export const completedCount = computed(() => progress().completed.length);
export const completionPercent = computed(() => Math.round((completedCount() / lessons.length) * 100));
export const activeLesson = computed(() => lessons.find((lesson) => lesson.slug === activeLessonSlug()) || lessons[0]);
export const dueCards = computed(() => {
  const done = new Set(progress().completed);
  return lessons.filter((lesson) => !done.has(lesson.slug)).concat(lessons.filter((lesson) => done.has(lesson.slug)));
});

export function setActiveLesson(slug) {
  if (lessons.some((lesson) => lesson.slug === slug)) activeLessonSlug(slug);
}

export function answerQuiz(slug, answer) {
  const lesson = lessons.find((item) => item.slug === slug);
  if (!lesson) return false;
  const correct = lesson.quiz.correct === answer;
  progress((state) => ({
    ...state,
    answers: { ...state.answers, [slug]: answer },
    completed: correct && !state.completed.includes(slug) ? [...state.completed, slug] : state.completed,
    streak: correct ? state.streak + 1 : 0,
  }));
  if (typeof window !== 'undefined') {
    persistProgress(window.localStorage);
  }
  return correct;
}

export function nextCard() {
  progress((state) => ({ ...state, cardIndex: (state.cardIndex + 1) % lessons.length }));
}

export function resetProgress() {
  progress(seedProgress());
  storageMessage('Progress reset. A fresh path is ready.');
}

export function persistProgress(storage = globalThis.localStorage) {
  if (!storage) return false;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(progress()));
    storageMessage(`Saved ${completedCount()} completed lesson${completedCount() === 1 ? '' : 's'}.`);
    return true;
  } catch {
    storageMessage('Storage is unavailable. Progress will last for this tab only.');
    return false;
  }
}

let saveTimer;
effect(() => {
  progress();
  if (typeof window === 'undefined') return;
  clearTimeout(saveTimer);
  saveTimer = window.setTimeout(() => persistProgress(window.localStorage), 60);
  return () => clearTimeout(saveTimer);
});

effect(() => {
  const lesson = activeLesson();
  if (typeof document !== 'undefined') {
    document.title = `${lesson.title} — Finch`;
  }
});
