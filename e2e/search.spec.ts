import { test, expect } from './fixtures';

test.describe('Start', () => {
  test.beforeEach(async ({ docSearch }) => {
    await docSearch.goto();
    await docSearch.waitForLoad();
  });

  test('Open modal on search button click', async ({ docSearch, page }) => {
    await docSearch.openModal();

    // check that the scrollbar offset is compensated
    await expect(page.locator('body')).toHaveCSS('overflow', 'hidden');
    await expect(docSearch.modal).toBeVisible();
  });

  test('Open modal with key shortcut on Windows/Linux', async ({ docSearch, page }) => {
    await page.keyboard.press('Control+k');
    await docSearch.expectModalVisibleAndFocused();
  });

  test('Open modal with key shortcut on Windows/Linux when caps lock is on', async ({ docSearch, page }) => {
    await page.keyboard.press('Control+K');
    await docSearch.expectModalVisibleAndFocused();
  });

  test('Open modal with key shortcut on macOS', async ({ docSearch, page }) => {
    await page.keyboard.press('Meta+k');
    await docSearch.expectModalVisibleAndFocused();
  });

  test('Open modal with key shortcut on macOS when caps lock is on', async ({ docSearch, page }) => {
    await page.keyboard.press('Meta+K');
    await docSearch.expectModalVisibleAndFocused();
  });

  test('Open modal with forward slash key shortcut', async ({ docSearch, page }) => {
    await page.waitForTimeout(1000);
    await page.keyboard.press('/');
    await docSearch.expectModalVisibleAndFocused();
  });
});

test.describe('End', () => {
  test.beforeEach(async ({ docSearch }) => {
    await docSearch.goto();
    await docSearch.openModal();
  });

  test('Close modal with Esc key', async ({ docSearch }) => {
    await docSearch.closeModal();
  });

  test('Close modal by clicking outside its container', async ({ docSearch, page }) => {
    await page.mouse.click(0, 0);
    await docSearch.expectModalNotVisible();
  });

  test('Close modal with key shortcut on Windows/Linux', async ({ docSearch, page }) => {
    await page.keyboard.press('Control+k');
    await docSearch.expectModalNotVisible();
  });

  test('Close modal with key shortcut on macOS', async ({ docSearch, page }) => {
    await page.keyboard.press('Meta+k');
    await docSearch.expectModalNotVisible();
  });
});

test.describe('Search', () => {
  test.beforeEach(async ({ docSearch }) => {
    await docSearch.goto();
    await docSearch.openModal();
  });

  test('Results are displayed after a query', async ({ docSearch }) => {
    await docSearch.typeQueryMatching();
    await expect(docSearch.hits).toBeVisible();
  });

  test('Query can be cleared', async ({ docSearch }) => {
    await docSearch.typeQueryMatching();
    await docSearch.clearButton.click();
    await expect(docSearch.hits).not.toBeVisible();
  });

  test('Keyboard navigation leads to result', async ({ docSearch, page }) => {
    const initialURL = page.url();

    await docSearch.typeQueryMatching();
    await expect(docSearch.hits).toBeVisible();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('Enter');

    await expect(page).not.toHaveURL(initialURL, { timeout: 10000 });
  });

  test('Pointer navigation leads to result', async ({ docSearch, page }) => {
    const initialURL = page.url();

    await docSearch.typeQueryMatching();
    await page.locator('#docsearch-hits_docsearch_0-item-1 > a').click({ force: true });

    await expect(page).not.toHaveURL(initialURL);
  });

  test("No results are displayed if query doesn't match", async ({ docSearch, page }) => {
    await docSearch.typeQueryNotMatching();
    await expect(page.getByText('No results found for')).toBeVisible();
  });

  test('Should not refer to Recent/Favorite in aria-controls', async ({ docSearch }) => {
    await expect(docSearch.input).not.toHaveAttribute('aria-controls');
  });
});

test.describe('Recent and Favorites', () => {
  test.beforeEach(async ({ docSearch, page }) => {
    await docSearch.goto();
    await docSearch.openModal();
    await docSearch.typeQueryMatching();
    await page.locator('#docsearch-hits_docsearch_0-item-1 > a').click({ force: true });
    await page.waitForTimeout(1000);
    await docSearch.openModal();
    await expect(page.getByText('Recent')).toBeVisible();
  });

  test('Recent search is displayed after visiting a result', async ({ docSearch, page }) => {
    await docSearch.clearSearch();
    await expect(page.locator('#docsearch-recentSearches-item-0')).toBeVisible();
  });

  test('Recent search can be deleted', async ({ docSearch, page }) => {
    await page.locator('#docsearch-recentSearches-item-0').locator('[title="Remove this search from history"]').click();
    await expect(docSearch.hits).not.toBeVisible();
  });

  test('Recent search can be favorited', async ({ page }) => {
    await page.locator('#docsearch-recentSearches-item-0').locator('[title="Save this search"]').click();
    await expect(page.getByText('Favorite')).toBeVisible();
    await expect(page.locator('#docsearch-favoriteSearches-item-0')).toBeVisible();
  });

  test('Favorite can be deleted', async ({ docSearch, page }) => {
    await page.locator('#docsearch-recentSearches-item-0').locator('[title="Save this search"]').click();
    await expect(page.getByText('Favorite')).toBeVisible();
    await page
      .locator('#docsearch-favoriteSearches-item-0')
      .locator('[title="Remove this search from favorites"]')
      .click();
    await expect(docSearch.hits).not.toBeVisible();
  });
});
