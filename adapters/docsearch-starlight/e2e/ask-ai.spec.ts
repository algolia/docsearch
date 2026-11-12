import { expect, test } from '@playwright/test';

import { mockInstallationSearch } from './fixtures';

test.beforeEach(async ({ page }) => {
  await mockInstallationSearch(page);
  // Keep Agent Studio out of the tests; only the panel wiring is under test.
  await page.route('**/agents/**', (route) => route.abort());
});

test('opens the side panel from the floating button', async ({ page }) => {
  await page.goto('/');

  const panelButton = page.locator('.DocSearch-SidepanelButton.floating');
  await expect(panelButton).toBeVisible();
  await expect(page.locator('link[href*="sidepanel" i]')).toHaveCount(1);

  await panelButton.click();
  await expect(page.locator('.DocSearch-Sidepanel-Container')).toHaveClass(
    /is-open/
  );
});

test('closes the side panel when the search modal opens', async ({ page }) => {
  await page.goto('/');
  await page.locator('.DocSearch-SidepanelButton').click();
  const panel = page.locator('.DocSearch-Sidepanel-Container');
  await expect(panel).toHaveClass(/is-open/);

  await page.getByRole('button', { name: /^Search\b/ }).click();

  await expect(page.locator('.DocSearch-Modal')).toBeVisible();
  await expect(panel).not.toHaveClass(/is-open/);
});

test('routes Ask AI from the modal to the side panel', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /^Search\b/ }).click();
  await page.locator('.DocSearch-Input').fill('installation');

  await page.locator('.DocSearch-Hit-AskAIButton').click();

  await expect(page.locator('.DocSearch-Modal')).toHaveCount(0);
  await expect(page.locator('.DocSearch-Sidepanel-Container')).toHaveClass(
    /is-open/
  );
});
