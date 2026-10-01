# Finch

Finch is an accessible learning app starter for What Framework. It demonstrates:

- global signals for progress;
- computed completion percent, active lesson, and flashcard queue;
- effects for local persistence and document title updates;
- routeable lessons with quizzes;
- flashcards, reset, and storage-denied fallback;
- static Vura output with route aliases and a real 404.

## Prerequisites

- Node.js 22.x
- npm 10+
- Vura credentials only when deploying

## Run locally

```bash
npm ci
npm run dev
```

Open the printed Vite URL and try:

- Start a lesson from `/lessons`.
- Answer the Signals quiz with `count()`.
- Reload the home page and confirm progress persists.
- Open `/practice`, reveal a card, and advance.
- Reset progress from the home page.
- Visit `/build` for agent-readable implementation notes.

## Build and test

```bash
npm run test
npm run build
npm run test:browser
```

`npm run verify` runs all three. Browser tests save screenshots under `test-results/screenshots`.

## Reset local state

Finch stores progress in this browser key:

```js
localStorage.removeItem('what-starter-finch-v1')
```

The home page also includes a reset button.

## Deploy on Vura

Deployment requires Vura credentials configured in your environment.

```bash
npm ci
npx vura-platform login
npx vura-platform projects
npm run deploy:vura
```

Use `npm run deploy:vura:prod` after review. The deploy scripts call the pinned local `vura-platform` package installed by `npm ci`.

Planned public repo: `CelsianJs/what-starter-finch`.

## Source map for agents

- `src/state/progress.js` — signals, computed values, effects, persistence and reset.
- `src/data/lessons.js` — original static lessons, quizzes and flashcards.
- `src/routes.js` — route table and dynamic lesson detail route.
- `src/pages/LessonDetail.jsx` — quiz interaction.
- `src/pages/Practice.jsx` — flashcards and global state.
- `scripts/static-aliases.mjs` — static route aliases, route-specific titles, 404, and Vura manifest proof.

See [BUILD.md](./BUILD.md) and `/build` for the longer implementation guide.
