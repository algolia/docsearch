import { test as base, expect, type Page, type Locator } from '@playwright/test';

export class DocSearchPage {
  readonly page: Page;
  readonly searchButton: Locator;
  readonly modal: Locator;
  readonly input: Locator;
  readonly hits: Locator;
  readonly clearButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchButton = page.locator('.DocSearch-Button');
    this.modal = page.locator('.DocSearch-Modal');
    this.input = page.locator('.DocSearch-Input');
    this.hits = page.locator('.DocSearch-Hits').first();
    this.clearButton = page.locator('.DocSearch-Clear');
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
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
    await expect(this.page.locator('body')).not.toHaveClass(/DocSearch--active/);
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

export const test = base.extend<{ docSearch: DocSearchPage }>({
  docSearch: async ({ page }, use) => {
    const docSearch = new DocSearchPage(page);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(docSearch);
  },
});

export { expect };
