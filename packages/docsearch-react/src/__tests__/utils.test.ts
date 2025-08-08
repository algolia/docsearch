import { describe, it, expect, beforeEach } from 'vitest';

import { extractLinksFromText } from '../utils/ai';
import { createObjectStorage, isLocalStorageSupported } from '../utils/storage';

describe('utils', () => {
  describe('extractLinksFromText', () => {
    it('returns an empty array when no links are present', () => {
      expect(extractLinksFromText('hello world')).toEqual([]);
    });

    it('extracts markdown and bare URLs', () => {
      const text = 'See [DocSearch](https://docsearch.algolia.com) and https://example.com/docs.';
      expect(extractLinksFromText(text)).toEqual([
        { url: 'https://docsearch.algolia.com', title: 'DocSearch' },
        { url: 'https://example.com/docs' },
      ]);
    });

    it('deduplicates repeated links and trims punctuation', () => {
      const text = 'Check https://algolia.com, https://algolia.com!';
      expect(extractLinksFromText(text)).toEqual([{ url: 'https://algolia.com' }]);
    });

    it('does not return links from within code snippets', () => {
      const text = `
See [Example Docs](https://example.com/docs)

This is also ignored \`https://ignored.com\`

\`\`\`js
  const DOCS_LINK = 'https://algolia.com/doc'
\`\`\`

https://docsearch.algolia.com

https://docsearch.algolia.com/configuration?version=beta
`;

      const output = extractLinksFromText(text);

      expect(output).toEqual([
        { url: 'https://example.com/docs', title: 'Example Docs' },
        { url: 'https://docsearch.algolia.com' },
        { url: 'https://docsearch.algolia.com/configuration?version=beta' },
      ]);
    });
  });

  describe('createObjectStorage', () => {
    const key = '__TEST_STORAGE__';
    const storage = createObjectStorage<{ foo: string }>(key);

    beforeEach(() => {
      storage.removeItem();
    });

    it('stores and retrieves an object using localStorage', () => {
      const value = { foo: 'bar' };
      storage.setItem(value);
      expect(storage.getItem()).toEqual(value);
    });

    it('removes an item', () => {
      const value = { foo: 'bar' };
      storage.setItem(value);
      storage.removeItem();
      expect(storage.getItem()).toBeNull();
    });

    it('isLocalStorageSupported reflects availability', () => {
      expect(isLocalStorageSupported()).toBe(true);
    });
  });
});
