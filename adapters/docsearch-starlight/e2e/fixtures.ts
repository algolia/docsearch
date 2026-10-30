import type { Page } from '@playwright/test';

export const installationHit = {
  objectID: 'getting-started',
  url: '/guides/getting-started/?from=search#installation',
  anchor: 'installation',
  type: 'lvl1',
  content: null,
  hierarchy: {
    lvl0: 'Guides',
    lvl1: 'Installation',
    lvl2: null,
    lvl3: null,
    lvl4: null,
    lvl5: null,
    lvl6: null,
  },
  _highlightResult: {
    hierarchy: {
      lvl0: { value: 'Guides', matchLevel: 'none', matchedWords: [] },
      lvl1: {
        value: '<mark>Installation</mark>',
        matchLevel: 'full',
        matchedWords: ['installation'],
      },
    },
  },
};

export async function mockInstallationSearch(
  page: Page,
  hit = installationHit
): Promise<void> {
  await page.route('**/1/indexes/*/queries*', async (route) => {
    const {
      requests,
    }: {
      requests: Array<{ indexName: string; query?: string }>;
    } = route.request().postDataJSON();

    await route.fulfill({
      json: {
        results: requests.map(({ indexName, query }) => ({
          index: indexName,
          query: query ?? '',
          hits: query === 'installation' ? [hit] : [],
          nbHits: query === 'installation' ? 1 : 0,
          page: 0,
          nbPages: 1,
          hitsPerPage: 20,
          processingTimeMS: 1,
        })),
      },
    });
  });
}
