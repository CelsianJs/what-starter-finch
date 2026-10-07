import { signal } from 'what-framework';
import { dueCards, nextCard, progress } from '../state/progress.js';

export default function Practice() {
  const revealed = signal(false, 'finch.cardRevealed');
  const index = () => progress().cardIndex % dueCards().length;
  const lesson = () => dueCards()[index()];
  return (
    <section class="practice page-enter">
      <p class="eyebrow">flashcards</p>
      <h1>Recall, reveal, repeat.</h1>
      <p class="card-position" role="status">{() => `Card ${index() + 1} of ${dueCards().length}`}</p>
      <article class={`flashcard ${revealed() ? 'is-revealed' : ''}`}>
        <p>{revealed() ? 'Back' : 'Front'}</p>
        <h2>{() => revealed() ? lesson().card.back : lesson().card.front}</h2>
      </article>
      <div class="actions">
        <button class="button" onClick={() => revealed((value) => !value)}>{revealed() ? 'Hide answer' : 'Reveal answer'}</button>
        <button class="button secondary" onClick={() => { revealed(false); nextCard(); }}>Next card</button>
      </div>
      <p>Unfinished lessons come first. Card position saves in this browser; this is a simple review deck, not a spaced-repetition scheduler.</p>
    </section>
  );
}
