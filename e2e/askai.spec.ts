import { test, expect } from './fixtures';

test.describe.skip('Ask AI', () => {
  test.beforeEach(async ({ docSearch }) => {
    await docSearch.goto();
    await docSearch.openModal();
  });

  test('Results are displayed after a query', async ({ docSearch }) => {
    await docSearch.typeQueryMatching();
    await expect(docSearch.hits).toBeVisible();
  });

  test('Shows Ask AI as a hit on search', async ({ docSearch, page }) => {
    await docSearch.typeQueryMatching();
    await expect(page.locator('.DocSearch-AskAi-Section')).toBeVisible();
  });

  test('Opens Ask AI on enter key', async ({ docSearch, page }) => {
    await docSearch.typeQueryMatching();
    await page.keyboard.press('Enter');
    await expect(page.locator('.DocSearch-AskAiScreen')).toBeVisible();
  });

  test('Opens Ask AI on click', async ({ docSearch, page }) => {
    await docSearch.typeQueryMatching();
    await page.locator('#docsearch-askAI-item-0').click();
    await expect(page.locator('.DocSearch-AskAiScreen')).toBeVisible();
  });

  test('Streams response after query', async ({ docSearch, page }) => {
    await docSearch.goToAskAi();
    await expect(page.locator('.DocSearch-AskAiScreen-Query')).toBeVisible();
    await expect(page.locator('.DocSearch-AskAiScreen-Message')).toBeVisible();
  });

  test('Copy button copies the response to the clipboard', async ({ docSearch, page, context }) => {
    // Grant clipboard permissions
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    
    await docSearch.goToAskAi();
    await expect(page.locator('.DocSearch-AskAiScreen-Response')).toBeVisible();
    
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText.length).toBeGreaterThan(0);
  });
});
