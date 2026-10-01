export default function Build() {
  return (
    <section class="page-enter">
      <p class="eyebrow">agent reference</p>
      <h1>How Finch is built.</h1>
      <div class="build-notes">
        <article>
          <h2>Signals</h2>
          <p><code>src/state/progress.js</code> keeps source state in one <code>progress</code> signal, plus an active lesson signal.</p>
          <pre>{`export const progress = signal({
  completed: [],
  answers: {},
  cardIndex: 0
});`}</pre>
        </article>
        <article>
          <h2>Computed values</h2>
          <p><code>completionPercent</code>, <code>activeLesson</code>, and <code>dueCards</code> derive UI state from the source signal.</p>
          <pre>{`export const completionPercent = computed(() =>
  Math.round((completedCount() / lessons.length) * 100)
);`}</pre>
        </article>
        <article>
          <h2>Effect issue fixed</h2>
          <p>A browser flow found that debounce-only persistence could lose a correct answer when the user navigated immediately. The fix persists synchronously inside <code>answerQuiz</code>; the effect still backs up other changes.</p>
          <pre>{`progress(nextState);
persistProgress(window.localStorage);`}</pre>
        </article>
        <article>
          <h2>Mobile review fix</h2>
          <p>The home route now shows a real lesson question in the first viewport and scales down the decorative sun on mobile so the demo reads as a learning app before scrolling.</p>
          <pre>{`<article class="lesson-object-card">
  <h2>{firstLesson.quiz.question}</h2>
</article>`}</pre>
        </article>
        <article>
          <h2>Vura static upload fix</h2>
          <p>Finch is a pure static starter, so it does not write <code>dist/manifest.json</code>. The build validates that the old partial manifest fails for the expected <code>timestamp</code> and <code>pages[].filePath</code> fields, then validates the canonical static manifest shape Vura can synthesize from the HTML files.</p>
          <pre>{`// dist/manifest.json is intentionally absent.
parseManifest({
  pages: [{ filePath: 'index.html', urlPattern: '/', mode: 'static' }],
  api: [],
  layouts: [],
  timestamp: '2026-01-01T00:00:00.000Z'
}, { allowLegacy: true });`}</pre>
        </article>
      </div>
    </section>
  );
}
