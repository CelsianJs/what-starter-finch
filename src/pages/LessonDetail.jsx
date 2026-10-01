import { Link, route } from 'what-framework/router';
import { createSignal } from '../util/createSignal.js';
import { findLesson } from '../data/lessons.js';
import { answerQuiz, progress, setActiveLesson } from '../state/progress.js';

const selected = createSignal('');
const feedback = createSignal('');

export default function LessonDetail() {
  const lesson = findLesson(route.params.slug);
  if (!lesson) return <section class="page-enter"><h1>Lesson not found.</h1><Link href="/lessons">Back to lessons</Link></section>;
  setActiveLesson(lesson.slug);
  const storedAnswer = progress().answers[lesson.slug] || selected();
  const answered = storedAnswer === lesson.quiz.correct;
  return (
    <article class="lesson-detail page-enter">
      <Link href="/lessons" class="backlink">← Lessons</Link>
      <p class="eyebrow">{lesson.level} lesson</p>
      <h1>{lesson.title}</h1>
      <p>{lesson.summary}</p>
      <div class="copy-card">
        {lesson.body.map((line) => <p>{line}</p>)}
      </div>
      <form class="quiz-card" onSubmit={(event) => {
        event.preventDefault();
        const ok = answerQuiz(lesson.slug, selected() || storedAnswer);
        feedback(ok ? lesson.quiz.explanation : 'Not yet. Read the lesson again and choose the answer that names the source idea.');
      }}>
        <h2>{lesson.quiz.question}</h2>
        {lesson.quiz.answers.map((answer) => (
          <label class="answer-row">
            <input name="answer" type="radio" value={answer} checked={storedAnswer === answer} onChange={() => selected(answer)} />
            <span>{answer}</span>
          </label>
        ))}
        <button class="button small" type="submit">Check answer</button>
        {answered || feedback() ? <p class={answered ? 'feedback good' : 'feedback'}>{feedback() || lesson.quiz.explanation}</p> : null}
      </form>
    </article>
  );
}
