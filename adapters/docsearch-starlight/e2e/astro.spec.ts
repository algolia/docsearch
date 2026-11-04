import { expect, test } from '@playwright/test';

import { mockInstallationSearch } from './fixtures';

test('renders DocSearch instead of the default Pagefind search', async ({
  page,
}) => {
  await page.goto('/');

  await expect(page.getByRole('button', { name: /^Search\b/ })).toHaveCount(1);
  await expect(page.locator('.DocSearch-Button')).toHaveCount(1);
  await expect(page.locator('site-search')).toHaveCount(0);

  const pagefind = await page.request.get('/pagefind/pagefind.js');
  expect(pagefind.status()).toBe(404);
});

test('passes the configured options to DocSearch', async ({ page }) => {
  await mockInstallationSearch(page);
  await page.goto('/');
  await page.getByRole('button', { name: /^Search\b/ }).click();

  const input = page.locator('.DocSearch-Input');
  await expect(input).toBeFocused();
  await expect(input).toHaveAttribute('placeholder', 'Search documentation');

  const searchRequest = page.waitForRequest(
    (request) =>
      request.url().includes('/queries') &&
      request.postDataJSON().requests[0]?.query === 'installation'
  );
  await input.fill('installation');
  const request = await searchRequest;

  expect(request.postDataJSON().requests).toEqual([
    expect.objectContaining({ indexName: 'docsearch', query: 'installation' }),
  ]);
  const applicationId =
    request.headers()['x-algolia-application-id'] ??
    new URL(request.url()).searchParams.get('x-algolia-application-id');
  expect(applicationId).toBe('PMZUYBQDAK');
});
