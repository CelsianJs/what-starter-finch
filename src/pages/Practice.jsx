import { signal } from 'what-framework';
import { dueCards, nextCard, progress } from '../state/progress.js';

const revealed = signal(false, 'finch.cardRevealed');

export default function Practice() {
  const cards = dueCards();
  const index = progress().cardIndex % cards.length;
  const lesson = cards[index];
  return (
    <section class="practice page-enter">
      <p class="eyebrow">flashcards</p>
      <h1>Recall, reveal, repeat.</h1>
      <article class={`flashcard ${revealed() ? 'is-revealed' : ''}`}>
        <p>{revealed() ? 'Back' : 'Front'}</p>
        <h2>{revealed() ? lesson.card.back : lesson.card.front}</h2>
      </article>
      <div class="actions">
        <button class="button" onClick={() => revealed((value) => !value)}>{revealed() ? 'Hide answer' : 'Reveal answer'}</button>
        <button class="button secondary" onClick={() => { revealed(false); nextCard(); }}>Next card</button>
      </div>
    </section>
  );
}
