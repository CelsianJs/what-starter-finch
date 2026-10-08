import { expect, test } from '@playwright/test';
import { mkdirSync } from 'node:fs';

test.afterEach(async ({ page }) => {
  const viewportWidth = page.viewportSize().width;
  const widths = await page.evaluate(() => [document.documentElement.scrollWidth, document.body.scrollWidth]);
  for (const width of widths) expect(width).toBeLessThanOrEqual(viewportWidth);
});

test('lesson quiz persists progress and can reset', async ({ page }, testInfo) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /small lessons/i })).toBeVisible();
  await expect(page.getByText('FIRST SIGNAL LESSON')).toBeVisible();
  await expect(page.getByRole('heading', { name: /what does a signal read look like/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /signals hold tiny truths/i })).toBeVisible();
  await expect(page.getByText(/standalone What Framework starter/i)).toHaveCount(0);
  await expect(page.getByText('count()')).toHaveCSS('font-family', /mono|Menlo|Consolas|SFMono/i);
  await expect.poll(() => page.evaluate(() => getComputedStyle(document.body).backgroundRepeat)).toContain('no-repeat');
  await page.getByRole('link', { name: 'Start lessons' }).click();
  await page.getByRole('link', { name: 'Open lesson' }).first().click();
  await expect(page.locator('pre code').first()).toContainText('const count = signal(0)');
  await page.getByLabel('count()').check();
  await page.getByRole('button', { name: 'Check answer' }).click();
  await expect(page.getByText(/signals are callable/i)).toBeVisible();
  await page.goto('/');
  await expect(page.getByText('25% complete')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Continue lesson' })).toHaveAttribute('href', '/lessons/computed');
  await page.reload();
  await expect(page.getByText('25% complete')).toBeVisible();
  await page.getByRole('button', { name: 'Reset progress' }).click();
  await expect(page.getByText('0% complete')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Continue lesson' })).toHaveAttribute('href', '/lessons/signals');
  mkdirSync('test-results/screenshots', { recursive: true });
  await page.screenshot({ path: `test-results/screenshots/finch-${testInfo.project.name}.png`, fullPage: true });
});

test('flashcards and 404 route work', async ({ page }) => {
  await page.goto('/practice');
  await expect(page.getByRole('heading', { name: /recall, reveal, repeat/i })).toBeVisible();
  await page.getByRole('button', { name: 'Reveal answer' }).click();
  await expect(page.getByText(/creates a tiny reactive value/i)).toBeVisible();
  await page.getByRole('button', { name: 'Next card' }).click();
  await expect(page.getByRole('heading', { name: 'computed(() => done() / total)', exact: true })).toBeVisible();
  await expect(page.getByText('Card 2 of 4', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Reveal answer' })).toBeVisible();
  for (const front of ['effect(() => save(progress()))', '/lessons/:slug', 'signal(0)']) {
    await page.getByRole('button', { name: 'Next card' }).click();
    await expect(page.getByRole('heading', { name: front, exact: true })).toBeVisible();
  }
  await page.goto('/not-a-route');
  await expect(page.getByRole('heading', { name: /perch is empty/i })).toBeVisible();
});

test('build guide preserves accessor source as text', async ({ page }) => {
  await page.goto('/build');
  await expect(page.locator('pre').first()).toContainText('const lesson = () => dueCards()[index()]');
});


test('modern typography and touch geometry remain consistent across routes', async ({ page }) => {
  for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    for (const route of ["/","/lessons/signals","/practice","/build"]) {
      await page.goto(route);
      await expect(page.locator('h1')).toBeVisible();
      const metrics = await page.evaluate(() => {
        const heading = getComputedStyle(document.querySelector('h1'));
        const body = getComputedStyle(document.body);
        const targets = [...document.querySelectorAll('nav a, button, .button, a.brand')].filter(node => node.getClientRects().length);
        return { heading: parseFloat(heading.fontSize), family: body.fontFamily, body: body.fontSize, overflow: document.documentElement.scrollWidth > innerWidth, smallTargets: targets.filter(node => node.getBoundingClientRect().height < 43.9).map(node => node.textContent) };
      });
      expect(metrics.family).toContain('Avenir Next');
      expect(metrics.body).toBe('16px');
      expect(metrics.heading).toBeGreaterThanOrEqual(28);
      expect(metrics.heading).toBeLessThanOrEqual(36);
      expect(metrics.overflow).toBe(false);
      expect(metrics.smallTargets).toEqual([]);
      const firstNav = page.locator('nav a').first();
      await firstNav.focus();
      await expect(firstNav).toHaveCSS('outline-style', 'solid');
    }
  }
});
