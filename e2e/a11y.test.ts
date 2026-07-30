import { test, expect } from './fixtures';

test.describe('a11y', () => {
  test.beforeEach(async ({ docSearch }) => {
    await docSearch.goto();
    await docSearch.waitForLoad();
  });

  test.fail('Smoke test > Modal', async ({ docSearch, axe }, testInfo) => {
    await docSearch.openModal();

    const scanResults = await axe().include('.DocSearch-Container').analyze();

    await testInfo.attach('a11y-scan-results-modal', {
      body: JSON.stringify(scanResults.violations, null, 2),
      contentType: 'application/json',
    });

    expect(scanResults.violations).toEqual([]);
  });

  test.fail('Smoke test > Sidepanel', async ({ sidepanel, axe }, testInfo) => {
    await sidepanel.openSidepanel();

    const scanResults = await axe()
      .include('.DocSearch-Sidepanel-Container')
      .analyze();

    await testInfo.attach('a11y-scan-results-sidepanel', {
      body: JSON.stringify(scanResults.violations, null, 2),
      contentType: 'application/json',
    });

    expect(scanResults.violations).toEqual([]);
  });
});
