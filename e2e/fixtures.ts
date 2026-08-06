// oxlint-disable max-classes-per-file react-hooks/rules-of-hooks
import AxeBuilder from '@axe-core/playwright';
import {
  test as base,
  expect,
  type Page,
  type Locator,
} from '@playwright/test';

export class DocSearchPage {
  readonly page: Page;
  readonly searchButton: Locator;
  readonly modal: Locator;
  readonly input: Locator;
  readonly hits: Locator;
  readonly clearButton: Locator;
  readonly firstHit: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchButton = page.locator('.DocSearch-Button');
    this.modal = page.locator('.DocSearch-Modal');
    this.input = page.locator('.DocSearch-Input');
    this.hits = page.locator('.DocSearch-Hits').first();
    this.clearButton = page.locator('.DocSearch-Clear');
    this.firstHit = page
      .locator('#docsearch-hits_docsearch_0-list .DocSearch-Hit a')
      .first();
  }

  async goto(): Promise<void> {
    await this.page.goto('/docs/what-is-docsearch');
  }

  async waitForLoad(): Promise<void> {
    await expect(this.searchButton).toBeVisible({ timeout: 10000 });
  }

  async openModal(): Promise<void> {
    await this.searchButton.click();
    await this.expectModalVisibleAndFocused();
  }

  async closeModal(): Promise<void> {
    await this.page.keyboard.press('Escape');
    await this.expectModalNotVisible();
  }

  async expectModalVisibleAndFocused(): Promise<void> {
    await expect(this.modal).toBeVisible({ timeout: 10000 });
    await expect(this.input).toBeFocused();
  }

  async expectModalNotVisible(): Promise<void> {
    await expect(this.page.locator('body')).not.toHaveClass(
      /DocSearch--active/
    );
    await expect(this.modal).not.toBeVisible();
  }

  async search(query: string): Promise<void> {
    await this.input.fill(query);
  }

  async typeQueryMatching(): Promise<void> {
    await this.search('g');
  }

  async typeQueryNotMatching(): Promise<void> {
    await this.search('zzz');
  }

  async clearSearch(): Promise<void> {
    await this.input.clear();
  }

  async clickFirstHit(): Promise<void> {
    await expect(this.hits).toBeVisible();
    await this.firstHit.click({ force: true });
  }

  async enableDarkMode(): Promise<void> {
    await this.page.locator('.react-toggle').click({ force: true });
    await this.page.locator('.react-toggle-screenreader-only').blur();
    await expect(this.page.locator('html.dark')).toBeVisible();
  }

  async goToAskAi(): Promise<void> {
    await this.typeQueryMatching();
    await this.page.locator('#docsearch-AskAi-Section').click();
  }
}

export class SidepanelPage {
  readonly page: Page;
  readonly sidepanelButton: Locator;
  readonly sidepanel: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sidepanelButton = page.locator('.DocSearch-SidepanelButton');
    this.sidepanel = page.locator('.DocSearch-Sidepanel-Container');
  }

  async waitForLoad(): Promise<void> {
    await expect(this.sidepanelButton).toBeVisible({ timeout: 10000 });
  }

  async openSidepanel(): Promise<void> {
    await this.sidepanelButton.click();
    await expect(this.sidepanel).toHaveClass(/is-open/, {
      timeout: 10000,
    });
  }
}

export const test = base.extend<{
  docSearch: DocSearchPage;
  sidepanel: SidepanelPage;
  axe: () => AxeBuilder;
}>({
  docSearch: async ({ page }, use) => {
    const docSearch = new DocSearchPage(page);
    await use(docSearch);
  },
  sidepanel: async ({ page }, use) => {
    const sidepanel = new SidepanelPage(page);
    await use(sidepanel);
  },
  axe: async ({ page }, use) => {
    const makeBuilder = () =>
      new AxeBuilder({ page }).withTags([
        'wcag2a',
        'wcag2aa',
        'wcag21a',
        'wcag21aa',
        'wcag22a',
        'wcag22aa',
      ]);
    await use(makeBuilder);
  },
});

type AxeScanResults = Awaited<ReturnType<AxeBuilder['analyze']>>;

function gatherA11yViolations(violations: AxeScanResults['violations']) {
  return violations.flatMap((v) => v.nodes);
}

export { expect, gatherA11yViolations };
