import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { lessons } from '../src/data/lessons.js';

const routes = [
  ['/', 'Finch — Learning app starter', 'Accessible What Framework learning app with persisted progress.'],
  ['/lessons', 'Lessons — Finch', 'Routeable lessons backed by a local dataset.'],
  ...lessons.map((lesson) => [`/lessons/${lesson.slug}`, `${lesson.title} — Finch`, lesson.summary]),
  ['/practice', 'Practice — Finch', 'Flashcards with global progress state.'],
  ['/build', 'How Finch is built', 'Agent-readable implementation notes for Finch.'],
];

const shellPath = join('dist', 'index.html');
if (!existsSync(shellPath)) throw new Error('dist/index.html missing; run vite build first');
const shell = readFileSync(shellPath, 'utf8');

function writeRoute(path, title, description) {
  const out = path === '/' ? shellPath : join('dist', path.slice(1), 'index.html');
  mkdirSync(dirname(out), { recursive: true });
  const html = shell
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${description}" />`)
    .replace('<div id="app"></div>', `<div id="app"><noscript><main><h1>${title}</h1><p>${description}</p></main></noscript></div>`);
  writeFileSync(out, html);
}

for (const route of routes) writeRoute(...route);
writeRoute('/404', 'Page not found — Finch', 'Finch includes a genuine 404 artifact for Vura static hosting.');
copyFileSync(join('dist', '404', 'index.html'), join('dist', '404.html'));

writeFileSync(join('dist', 'manifest.json'), `${JSON.stringify({
  pages: routes.map(([path]) => ({
    urlPattern: path,
    mode: 'static',
    config: path === '/practice' ? { cache: 'private' } : { tags: ['finch-content'] },
  })),
  api: [],
}, null, 2)}\n`);
console.log(`static aliases OK: ${routes.length} routes plus 404`);
