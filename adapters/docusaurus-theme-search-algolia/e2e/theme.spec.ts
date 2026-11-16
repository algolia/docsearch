import type { Page } from '@playwright/test';

import { expect, gatherA11yViolations, test } from '../../../e2e/fixtures';

type Rgba = [number, number, number, number];

const MIN_TEXT_CONTRAST = 4.5;
const AXE_VIOLATION_BUDGET = 20;

async function mockAskAiAnswer(page: Page): Promise<void> {
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
}

function computedColor(
  page: Page,
  selector: string,
  property: 'color' | 'backgroundColor'
): Promise<Rgba> {
  return page
    .locator(selector)
    .first()
    .evaluate((element, prop) => {
      const context = document.createElement('canvas').getContext('2d')!;
      context.clearRect(0, 0, 1, 1);
      context.fillStyle = getComputedStyle(element)[prop];
      context.fillRect(0, 0, 1, 1);
      const [r, g, b, a] = context.getImageData(0, 0, 1, 1).data;
      return [r, g, b, a / 255] as Rgba;
    }, property);
}

function luminance([r, g, b]: Rgba): number {
  const [lr, lg, lb] = [r, g, b].map((channel) => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
}

function contrastRatio(foreground: Rgba, background: Rgba): number {
  const [lighter, darker] = [luminance(foreground), luminance(background)].sort(
    (a, b) => b - a
  );
  return (lighter + 0.05) / (darker + 0.05);
}

async function expectOpaqueBackground(
  page: Page,
  selector: string
): Promise<void> {
  const [, , , alpha] = await computedColor(page, selector, 'backgroundColor');
  expect(alpha, `${selector} background alpha`).toBe(1);
}

function infimaSurfaceColor(page: Page): Promise<Rgba> {
  return page.evaluate(() => {
    const probe = document.createElement('div');
    probe.style.backgroundColor = 'var(--ifm-background-surface-color)';
    document.body.append(probe);
    const context = document.createElement('canvas').getContext('2d')!;
    context.fillStyle = getComputedStyle(probe).backgroundColor;
    context.fillRect(0, 0, 1, 1);
    probe.remove();
    const [r, g, b, a] = context.getImageData(0, 0, 1, 1).data;
    return [r, g, b, a / 255] as Rgba;
  });
}

async function expectReadableText(
  page: Page,
  textSelector: string,
  backgroundSelector: string
): Promise<void> {
  const text = await computedColor(page, textSelector, 'color');
  const background = await computedColor(
    page,
    backgroundSelector,
    'backgroundColor'
  );
  expect(
    contrastRatio(text, background),
    `${textSelector} on ${backgroundSelector}`
  ).toBeGreaterThanOrEqual(MIN_TEXT_CONTRAST);
}

async function openSearchWithResult(page: Page): Promise<void> {
  await page.goto('/');
  await page.locator('.DocSearch-Button').click();
  await page.locator('.DocSearch-Input').fill('installation');
  await expect(page.locator('.DocSearch-Hit').first()).toBeVisible();
}

async function openAskAiMenu(page: Page): Promise<void> {
  await mockAskAiAnswer(page);
  await openSearchWithResult(page);
  await page.locator('#docsearch-askAI-item-0').click();
  await expect(page.getByText('Saved answer')).toBeVisible();
  await page.locator('.DocSearch-Menu-trigger').click();
  await expect(page.locator('.DocSearch-Menu-content.open')).toBeVisible();
}

for (const colorScheme of ['light', 'dark'] as const) {
  test.describe(`Docusaurus adapter on a stock theme (${colorScheme})`, () => {
    test.use({ colorScheme });

    test.beforeEach(async ({ page }) => {
      await page.addInitScript((theme) => {
        window.localStorage.setItem('theme', theme);
      }, colorScheme);
    });

    test('modal, search box and footer backgrounds are opaque', async ({
      page,
    }) => {
      await openSearchWithResult(page);

      await expectOpaqueBackground(page, '.DocSearch-Modal');
      await expectOpaqueBackground(page, '.DocSearch-Form');
      await expectOpaqueBackground(page, '.DocSearch-Footer');
      await expectOpaqueBackground(page, '.DocSearch-Hit a');
    });

    test('modal, footer and hit surfaces follow the Docusaurus surface color', async ({
      page,
    }) => {
      await openSearchWithResult(page);
      const surface = await infimaSurfaceColor(page);

      for (const selector of [
        '.DocSearch-Modal',
        '.DocSearch-Footer',
        '.DocSearch-Hit a',
      ]) {
        expect(
          await computedColor(page, selector, 'backgroundColor'),
          selector
        ).toEqual(surface);
      }
    });

    test('selected result row is readable', async ({ page }) => {
      await openSearchWithResult(page);
      await page.keyboard.press('ArrowDown');
      await expect(
        page.locator('.DocSearch-Hit[aria-selected="true"]')
      ).toBeVisible();

      await expectReadableText(
        page,
        '.DocSearch-Hit[aria-selected="true"] .DocSearch-Hit-Container',
        '.DocSearch-Hit[aria-selected="true"] a'
      );
    });

    test('modal stays within the axe violation budget', async ({
      page,
      axe,
    }, testInfo) => {
      await openSearchWithResult(page);

      const scanResults = await axe().include('.DocSearch-Modal').analyze();

      await testInfo.attach('a11y-scan-results-docusaurus-modal', {
        body: JSON.stringify(scanResults.violations, null, 2),
        contentType: 'application/json',
      });

      expect(
        gatherA11yViolations(scanResults.violations).length
      ).toBeLessThanOrEqual(AXE_VIOLATION_BUDGET);
    });

    test('highlighted match text is readable on selected and unselected rows', async ({
      page,
    }) => {
      await openSearchWithResult(page);

      await expectReadableText(
        page,
        '.DocSearch-Hit:not([aria-selected="true"]) mark',
        '.DocSearch-Hit:not([aria-selected="true"]) a'
      );

      await page.keyboard.press('ArrowDown');
      await expectReadableText(
        page,
        '.DocSearch-Hit[aria-selected="true"] mark',
        '.DocSearch-Hit[aria-selected="true"] a'
      );
    });

    test('footer keys and labels are readable', async ({ page }) => {
      await openSearchWithResult(page);

      await expectReadableText(
        page,
        '.DocSearch-Commands-Key',
        '.DocSearch-Commands-Key'
      );
      await expectReadableText(
        page,
        '.DocSearch-Commands',
        '.DocSearch-Footer'
      );
    });

    test('secondary text and icons are readable', async ({ page }) => {
      await openSearchWithResult(page);

      await expectReadableText(page, '.DocSearch-Hit-icon', '.DocSearch-Hit a');
      await expectReadableText(page, '.DocSearch-Close', '.DocSearch-Form');
    });

    test('Ask AI menu is opaque and readable', async ({ page }) => {
      await openAskAiMenu(page);

      await expectOpaqueBackground(page, '.DocSearch-Menu-content');
      await expectReadableText(
        page,
        '.DocSearch-Menu-item',
        '.DocSearch-Menu-content'
      );
    });

    test('site overrides on the root element take precedence', async ({
      page,
    }) => {
      await page.addInitScript(() => {
        document.addEventListener('DOMContentLoaded', () => {
          const style = document.createElement('style');
          style.textContent =
            "html:root, html:root[data-theme='dark'] { --docsearch-hit-focus-background: rgb(1, 2, 3); }";
          document.head.append(style);
        });
      });
      await openSearchWithResult(page);
      await page.keyboard.press('ArrowDown');

      await expect(
        page.locator('.DocSearch-Hit[aria-selected="true"] a')
      ).toHaveCSS('background-color', 'rgb(1, 2, 3)');
    });

    test('Ask AI menu background can be overridden on .DocSearch', async ({
      page,
    }) => {
      await openAskAiMenu(page);

      await page.locator('.DocSearch-Container').evaluate((element) => {
        element.style.setProperty(
          '--docsearch-dropdown-menu-background',
          'rgb(1, 2, 3)'
        );
      });

      await expect(page.locator('.DocSearch-Menu-content')).toHaveCSS(
        'background-color',
        'rgb(1, 2, 3)'
      );
    });
  });
}
