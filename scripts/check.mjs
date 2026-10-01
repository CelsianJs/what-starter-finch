import { existsSync } from 'node:fs';
import { lessons } from '../src/data/lessons.js';
import { validateVuraStaticSynthesis } from './vura-static-check.mjs';

const expectedRoutes = [
  '/',
  '/lessons',
  ...lessons.map((lesson) => `/lessons/${lesson.slug}`),
  '/practice',
  '/build',
  '/404',
];

if (!existsSync('dist/index.html')) throw new Error('missing root index');
if (!existsSync('dist/404.html')) throw new Error('missing root 404');
for (const lesson of lessons) {
  if (!existsSync(`dist/lessons/${lesson.slug}/index.html`)) {
    throw new Error(`missing lesson route ${lesson.slug}`);
  }
}

const pages = validateVuraStaticSynthesis({ distRoot: 'dist', expectedPages: expectedRoutes });
console.log(`check OK: ${expectedRoutes.length} routes, no handcrafted manifest, partial-manifest regression covered, ${pages} canonical Vura pages validated.`);
