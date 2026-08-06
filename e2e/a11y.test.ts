import { test, expect, gatherA11yViolations } from './fixtures';

test.describe('a11y > Modal', () => {
  test.beforeEach(async ({ docSearch }) => {
    await docSearch.goto();
    await docSearch.waitForLoad();
  });

  test('Smoke test', async ({ docSearch, axe }, testInfo) => {
    await docSearch.openModal();

    const scanResults = await axe().include('.DocSearch-Container').analyze();

    await testInfo.attach('a11y-scan-results-modal', {
      body: JSON.stringify(scanResults.violations, null, 2),
      contentType: 'application/json',
    });

    // 6 is the current number of reported violations
    expect(
      gatherA11yViolations(scanResults.violations).length
    ).toBeLessThanOrEqual(6);
  });

  test('Search results', async ({ docSearch, axe }, testInfo) => {
    await docSearch.openModal();

    await docSearch.typeQueryMatching();

    await expect(docSearch.hits).toBeVisible();

    const scanResults = await axe()
      .include('#docsearch-hits_docsearch_0-list')
      .analyze();

    await testInfo.attach('a11y-scan-results-modal-search-results', {
      body: JSON.stringify(scanResults.violations, null, 2),
      contentType: 'application/json',
    });

    // 24 is the current number of reported violations
    expect(
      gatherA11yViolations(scanResults.violations).length
    ).toBeLessThanOrEqual(24);
  });
});

test.describe('a11y > Sidepanel', () => {
  test.beforeEach(async ({ docSearch, sidepanel }) => {
    await docSearch.goto();
    await sidepanel.waitForLoad();
  });

  test('Smoke test', async ({ sidepanel, axe }, testInfo) => {
    await sidepanel.openSidepanel();

    const scanResults = await axe()
      .include('.DocSearch-Sidepanel-Container')
      .analyze();

    await testInfo.attach('a11y-scan-results-sidepanel', {
      body: JSON.stringify(scanResults.violations, null, 2),
      contentType: 'application/json',
    });

    // 4 is the current number of reported violations
    expect(
      gatherA11yViolations(scanResults.violations).length
    ).toBeLessThanOrEqual(4);
  });
});
