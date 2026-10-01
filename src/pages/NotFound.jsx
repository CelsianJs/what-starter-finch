import { Link } from 'what-framework/router';

export default function NotFound() {
  return (
    <section class="page-enter not-found">
      <p class="eyebrow">404</p>
      <h1>That perch is empty.</h1>
      <p>Finch could not find this route.</p>
      <Link class="button" href="/">Return home</Link>
    </section>
  );
}
