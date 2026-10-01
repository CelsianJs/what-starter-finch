import { Link } from 'what-framework/router';
import { completionPercent, storageMessage } from '../state/progress.js';

export default function Shell({ children }) {
  return (
    <main class="app-shell">
      <header class="topbar">
        <a class="brand" href="/">
          <span class="bird" aria-hidden="true">◖</span>
          <span>Finch</span>
        </a>
        <nav aria-label="Primary">
          <Link href="/">Home</Link>
          <Link href="/lessons">Lessons</Link>
          <Link href="/practice">Practice</Link>
          <Link href="/build">Build</Link>
        </nav>
      </header>
      <section class="progress-ribbon" aria-label="Learning progress">
        <span>{completionPercent()}% complete</span>
        <div class="meter"><span style={{ width: `${completionPercent()}%` }} /></div>
        <span>{storageMessage()}</span>
      </section>
      {children}
    </main>
  );
}
