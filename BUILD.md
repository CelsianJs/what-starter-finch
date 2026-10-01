# Finch build journal

## Status

- 2026-10-01 12:58 America/New_York — Created starter scope after the initially referenced tracker entry was not present.
- 2026-10-01 13:08 America/New_York — Implemented app shell, dataset-driven lessons, progress state, browser/unit tests, docs, and Vura static alias script.

## What it demonstrates

- `progress` is the single global source signal for completed lessons, quiz answers, flashcard index, and streak.
- `completionPercent`, `activeLesson`, and `dueCards` are computed from source state.
- Effects persist progress, report storage-denied fallback, and update the document title.
- `/lessons/:slug` is a dynamic client route backed by a local dataset.
- `scripts/static-aliases.mjs` writes route-specific static HTML aliases and a `404.html` for Vura static hosting.

## Actual state/effect issue and fix

- The lesson content is original and intentionally short, so the starter is useful as a code reference instead of a generic course.
- A tiny `createSignal` wrapper was added only to keep one source import boundary for component-local state in the lesson page.
- Persistence is tested with a throwing storage object to prove restricted browser storage does not crash the app.
- Browser smoke found that a debounced persistence effect alone could lose a quiz answer if the user navigated immediately after submit. `answerQuiz` now persists synchronously after the source signal updates; the effect remains as a backup for other progress changes.
- Mobile visual review found the first screen looked too much like a generic hero/progress card and the yellow sun crowded the nav. The home route now shows a real lesson quiz question above the fold and reduces the mobile sun so the artifact reads as a learning app immediately.

Before:

```js
effect(() => {
  progress();
  saveTimer = window.setTimeout(() => persistProgress(window.localStorage), 60);
});
```

Actual result: a user could submit a correct quiz answer and navigate before the timeout wrote storage.

After:

```js
progress((state) => nextState);
if (typeof window !== 'undefined') {
  persistProgress(window.localStorage);
}
```

The effect remains for other state changes, but the quiz completion path is immediate.

## Mobile visual fix

Before: the mobile home viewport showed brand/nav/progress/hero copy and a large decorative sun; the actual lesson artifact came after the fold.

After: the home route shows the first lesson quiz question directly below the hero copy, and the mobile background uses a smaller corner sun.

```jsx
<article class="lesson-object-card">
  <p class="eyebrow">first lesson object</p>
  <h2>{firstLesson.quiz.question}</h2>
  <div class="answer-chips">...</div>
</article>
```

## Smooth path for agents

1. Keep source state tiny and derive display state with `computed`.
2. Effects are good for persistence, but critical navigation-adjacent actions should persist synchronously.
3. Put one concrete dataset object on the first screen so a starter does not look like a generic marketing hero.
4. Browser-test reload, reset, storage fallback, and the first mobile viewport.

## Verification checklist

- `npm ci` — clean install with 0 vulnerabilities in the local verification run.
- `npm run verify` — unit tests, Vite build/static aliases, and browser smoke.
- Real flow: answer the Signals quiz, reload, observe `25% complete`, reset to `0%`, reveal a flashcard, hit a missing route.
- Visual proof: desktop and mobile screenshots are written to `test-results/screenshots`.

## Known limitations

- Progress is local-only by design; there is no account sync.
- Flashcard repetition is a simple due-card ordering, not a full spaced-repetition algorithm.
- The app is static and does not use Vura server APIs; Signal covers the server-rendered/runtime route features in this starter batch.
