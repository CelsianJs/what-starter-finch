import { expect, test } from '@playwright/test';
import { mkdirSync } from 'node:fs';

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
  await page.reload();
  await expect(page.getByText('25% complete')).toBeVisible();
  await page.getByRole('button', { name: 'Reset progress' }).click();
  await expect(page.getByText('0% complete')).toBeVisible();
  mkdirSync('test-results/screenshots', { recursive: true });
  await page.screenshot({ path: `test-results/screenshots/finch-${testInfo.project.name}.png`, fullPage: true });
});

test('flashcards and 404 route work', async ({ page }) => {
  await page.goto('/practice');
  await expect(page.getByRole('heading', { name: /recall, reveal, repeat/i })).toBeVisible();
  await page.getByRole('button', { name: 'Reveal answer' }).click();
  await expect(page.getByText(/creates a tiny reactive value/i)).toBeVisible();
  await page.goto('/not-a-route');
  await expect(page.getByRole('heading', { name: /perch is empty/i })).toBeVisible();
});
