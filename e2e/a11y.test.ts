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

  for (const closeMethod of ['Escape', 'close button'] as const) {
    test(`Closed panel is inaccessible and preserves conversation after ${closeMethod}`, async ({
      sidepanel,
      page,
    }) => {
      await page.route('**/agents/*/completions?*', (route) =>
        route.fulfill({
          contentType: 'text/event-stream',
          body: [
            { type: 'text-start', id: 'answer' },
            { type: 'text-delta', id: 'answer', delta: 'Saved answer' },
            { type: 'text-end', id: 'answer' },
            { type: 'finish' },
          ]
            .map((event) => `data: ${JSON.stringify(event)}\n\n`)
            .join(''),
        })
      );

      // Place focus sentinels next to the mounted panel to test both Tab directions.
      await sidepanel.sidepanel.evaluate((panel) => {
        for (const position of ['beforebegin', 'afterend'] as const) {
          const button = document.createElement('button');
          button.id = `panel-${position}`;
          button.textContent = position;
          panel.insertAdjacentElement(position, button);
        }
      });
      const before = page.locator('#panel-beforebegin');
      const after = page.locator('#panel-afterend');
      const prompt = sidepanel.sidepanel.locator('textarea');
      const panelHandle = await sidepanel.sidepanel.elementHandle();

      const expectClosed = async (): Promise<void> => {
        await expect(sidepanel.sidepanel).toBeAttached();
        await expect(sidepanel.sidepanel).not.toHaveClass(/is-open/);
        await expect(sidepanel.sidepanel).toHaveAttribute('inert', '');
        // Read Chromium's accessibility tree; Playwright 1.49's DOM-based
        // ariaSnapshot doesn't account for inert.
        expect(
          await page.accessibility.snapshot({
            root: panelHandle!,
            interestingOnly: false,
          })
        ).toBeNull();
        await before.focus();
        await page.keyboard.press('Tab');
        await expect(after).toBeFocused();
        await page.keyboard.press('Shift+Tab');
        await expect(before).toBeFocused();
        await prompt.evaluate((element) => element.focus());
        await expect(before).toBeFocused();
      };

      await expectClosed();
      await sidepanel.openSidepanel();
      await expect(prompt).toBeFocused();
      await prompt.fill('My question');
      await prompt.press('Enter');
      await expect(sidepanel.sidepanel.getByText('Saved answer')).toBeVisible();
      await prompt.fill('A follow-up question');

      if (closeMethod === 'Escape') {
        await page.keyboard.press('Escape');
      } else {
        await sidepanel.sidepanel.getByTitle('Close Sidepanel').click();
      }

      await expectClosed();
      await sidepanel.openSidepanel();
      await expect(prompt).toBeFocused();
      await expect(prompt).toHaveValue('A follow-up question');
      await expect(sidepanel.sidepanel.getByText('My question')).toBeVisible();
      await expect(sidepanel.sidepanel.getByText('Saved answer')).toBeVisible();
      expect(
        JSON.stringify(
          await page.accessibility.snapshot({
            root: panelHandle!,
            interestingOnly: false,
          })
        )
      ).toContain('Saved answer');
    });
  }
});
