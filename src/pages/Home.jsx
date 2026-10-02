import { Link } from 'what-framework/router';
import { lessons } from '../data/lessons.js';
import { completedCount, completionPercent, progress, resetProgress } from '../state/progress.js';

export default function Home() {
  const firstLesson = lessons[0];
  const nextLesson = lessons.find((lesson) => !progress().completed.includes(lesson.slug)) || firstLesson;
  return (
    <section class="hero page-enter">
      <div>
        <p class="eyebrow">yellow sky learning lab</p>
        <h1>Small lessons that come back when you do.</h1>
        <p>
          Finch is a tiny course shelf for learning reactive UI patterns, answering quizzes,
          and resuming exactly where the last browser session stopped.
        </p>
        <article class="lesson-object-card">
          <p class="eyebrow">first lesson object</p>
          <h2>{firstLesson.quiz.question}</h2>
          <div class="answer-chips" aria-label="Sample quiz answers">
            {firstLesson.quiz.answers.map((answer) => <span class={answer.includes('(') || answer.includes('.') ? 'is-code' : ''}>{answer}</span>)}
          </div>
          <Link href={`/lessons/${firstLesson.slug}`}>Open the signal lesson →</Link>
        </article>
        <div class="actions">
          <Link class="button" href="/lessons">Start lessons</Link>
          <Link class="button secondary" href="/practice">Practice cards</Link>
        </div>
      </div>
      <aside class="hero-card">
        <p class="eyebrow">Next lesson</p>
        <h2>{nextLesson.title}</h2>
        <p>{nextLesson.summary}</p>
        <p class="progress-note">{completedCount()} of {lessons.length} complete · {completionPercent()}% progress</p>
        <Link class="button small" href={`/lessons/${nextLesson.slug}`}>Continue lesson</Link>
        <button class="link-button" onClick={resetProgress}>Reset progress</button>
      </aside>
    </section>
  );
}
