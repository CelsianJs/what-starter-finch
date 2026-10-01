import { Link } from 'what-framework/router';
import { lessons } from '../data/lessons.js';
import { progress, setActiveLesson } from '../state/progress.js';

export default function Lessons() {
  const done = new Set(progress().completed);
  return (
    <section class="page-enter">
      <p class="eyebrow">curriculum</p>
      <h1>Four compact What lessons.</h1>
      <div class="lesson-grid">
        {lessons.map((lesson, index) => (
          <article class={`lesson-card ${done.has(lesson.slug) ? 'is-complete' : ''}`}>
            <span class="lesson-index">{String(index + 1).padStart(2, '0')}</span>
            <p>{lesson.level} · {lesson.minutes} min</p>
            <h2>{lesson.title}</h2>
            <p>{lesson.summary}</p>
            <Link class="button small" href={`/lessons/${lesson.slug}`} onClick={() => setActiveLesson(lesson.slug)}>
              {done.has(lesson.slug) ? 'Review lesson' : 'Open lesson'}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
