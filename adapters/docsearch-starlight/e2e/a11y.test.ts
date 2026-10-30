import { expect, test } from '../../../e2e/fixtures';

import { mockInstallationSearch } from './fixtures';

test('search header has no accessibility violations', async ({
  page,
  axe,
}, testInfo) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: /^Search\b/ })).toBeVisible();

  const { violations } = await axe().include('#docsearch').analyze();
  await testInfo.attach('header-accessibility-violations', {
    body: JSON.stringify(violations, null, 2),
    contentType: 'application/json',
  });
  expect(violations).toEqual([]);
});

test('search results retain the current accessibility baseline', async ({
  page,
  axe,
}, testInfo) => {
  await mockInstallationSearch(page);
  await page.goto('/');
  await page.getByRole('button', { name: /^Search\b/ }).click();
  const input = page.locator('.DocSearch-Input');
  await expect(input).toBeFocused();
  await input.fill('installation');
  await expect(
    page.locator('.DocSearch-Hit').getByRole('link', {
      name: /Installation/,
    })
  ).toBeVisible();

  const { violations } = await axe().include('.DocSearch-Modal').analyze();
  await testInfo.attach('modal-accessibility-violations', {
    body: JSON.stringify(violations, null, 2),
    contentType: 'application/json',
  });
  expect(
    violations.flatMap(({ id, nodes }) =>
      nodes.map(({ target }) => `${id}: ${target.join(', ')}`)
    )
  ).toEqual([
    'nested-interactive: #docsearch-hits_docsearch_0-item-0',
    'target-size: #docsearch-input',
  ]);
});
