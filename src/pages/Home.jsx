import { Link } from 'what-framework/router';
import { lessons } from '../data/lessons.js';
import { completedCount, completionPercent, resetProgress } from '../state/progress.js';

export default function Home() {
  const firstLesson = lessons[0];
  return (
    <section class="hero page-enter">
      <div>
        <p class="eyebrow">yellow sky learning lab</p>
        <h1>Small lessons that come back when you do.</h1>
        <p>
          Finch is a standalone What Framework starter for lessons, quizzes, flashcards, persisted progress,
          routeable detail pages, and smooth client transitions.
        </p>
        <article class="lesson-object-card">
          <p class="eyebrow">first lesson object</p>
          <h2>{firstLesson.quiz.question}</h2>
          <div class="answer-chips" aria-label="Sample quiz answers">
            {firstLesson.quiz.answers.map((answer) => <span>{answer}</span>)}
          </div>
          <Link href={`/lessons/${firstLesson.slug}`}>Open the signal lesson →</Link>
        </article>
        <div class="actions">
          <Link class="button" href="/lessons">Start lessons</Link>
          <Link class="button secondary" href="/practice">Practice cards</Link>
        </div>
      </div>
      <aside class="hero-card">
        <span class="big-percent">{completionPercent()}%</span>
        <p>{completedCount()} of {lessons.length} lessons completed.</p>
        <button class="link-button" onClick={resetProgress}>Reset progress</button>
      </aside>
    </section>
  );
}
