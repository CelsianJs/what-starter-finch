import { Link, route } from 'what-framework/router';
import { createSignal } from '../util/createSignal.js';
import { findLesson, lessons } from '../data/lessons.js';
import { answerQuiz, progress, setActiveLesson } from '../state/progress.js';

export default function LessonDetail() {
  const lesson = findLesson(route.params.slug);
  if (!lesson) return <section class="page-enter"><h1>Lesson not found.</h1><Link href="/lessons">Back to lessons</Link></section>;
  setActiveLesson(lesson.slug);
  const selected = createSignal(progress().answers[lesson.slug] || '');
  const feedback = createSignal('');
  const answered = () => progress().answers[lesson.slug] === lesson.quiz.correct;
  const nextLesson = lessons[lessons.findIndex((item) => item.slug === lesson.slug) + 1];
  return (
    <article class="lesson-detail page-enter">
      <Link href="/lessons" class="backlink">← Lessons</Link>
      <p class="eyebrow">{lesson.level} lesson</p>
      <h1>{lesson.title}</h1>
      <p>{lesson.summary}</p>
      <div class="copy-card">
        {lesson.body.map((line) => <p>{line}</p>)}
        {lesson.code ? <pre><code>{lesson.code}</code></pre> : null}
      </div>
      <form class="quiz-card" onSubmit={(event) => {
        event.preventDefault();
        const ok = answerQuiz(lesson.slug, selected());
        feedback(ok ? lesson.quiz.explanation : 'Not yet. Read the lesson again and choose the answer that names the source idea.');
      }}>
        <h2>{lesson.quiz.question}</h2>
        {lesson.quiz.answers.map((answer) => (
          <label class="answer-row">
            <input name="answer" type="radio" value={answer} checked={() => selected() === answer} onChange={() => selected(answer)} required />
            <span class={answer.includes('(') || answer.includes('.') ? 'is-code' : ''}>{answer}</span>
          </label>
        ))}
        <button class="button small" type="submit">Check answer</button>
        {() => answered() || feedback() ? <p class={answered() ? 'feedback good' : 'feedback'} role="status">{feedback() || lesson.quiz.explanation}</p> : null}
        {() => answered() ? <Link class="button secondary" href={nextLesson ? `/lessons/${nextLesson.slug}` : '/practice'}>{nextLesson ? `Next: ${nextLesson.title}` : 'Course complete · practice cards'}</Link> : null}
      </form>
    </article>
  );
}
