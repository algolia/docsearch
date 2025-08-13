import { describe, it, expect, beforeEach } from 'vitest';

import { extractLinksFromText } from '../utils/ai';
import {
  createObjectStorage,
  createStorage,
  isLocalStorageSupported,
  getLocalStorageSize,
  manageLocalStorageQuota,
} from '../utils/storage';

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

  describe('localStorage quota handling', () => {
    const testKey = '__TEST_QUOTA_STORAGE__';

    beforeEach(() => {
      // Clean up any test data
      localStorage.removeItem(testKey);
      // Clean up any DocSearch keys that might exist
      Object.keys(localStorage).forEach((key) => {
        if (key.includes('__DOCSEARCH_')) {
          localStorage.removeItem(key);
        }
      });
    });

    it('getLocalStorageSize returns a number', () => {
      const size = getLocalStorageSize();
      expect(typeof size).toBe('number');
      expect(size).toBeGreaterThanOrEqual(0);
    });

    it('createStorage handles quota exceeded errors gracefully', () => {
      const storage = createStorage<{ data: string }>(testKey);

      // Create a large dataset that might cause quota issues
      const largeArray = Array.from({ length: 1000 }, (_, i) => ({ data: `test-data-${i}`.repeat(100) }));

      // This should not throw an error even if quota is exceeded
      expect(() => {
        storage.setItem(largeArray);
      }).not.toThrow();

      // Should be able to retrieve data (might be reduced if quota was exceeded)
      const retrieved = storage.getItem();
      expect(Array.isArray(retrieved)).toBe(true);
    });

    it('createObjectStorage handles quota exceeded errors gracefully', () => {
      const storage = createObjectStorage<{ data: string }>(testKey);

      // Create a large object that might cause quota issues
      const largeObject = { data: 'x'.repeat(1000000) }; // 1MB string

      // This should not throw an error even if quota is exceeded
      expect(() => {
        storage.setItem(largeObject);
      }).not.toThrow();
    });

    it('manageLocalStorageQuota runs without errors', () => {
      // Add some DocSearch data to localStorage
      localStorage.setItem('__DOCSEARCH_TEST_1__', JSON.stringify({ test: 'data1' }));
      localStorage.setItem('__DOCSEARCH_TEST_2__', JSON.stringify({ test: 'data2' }));

      // This should not throw an error
      expect(() => {
        manageLocalStorageQuota();
      }).not.toThrow();
    });

    it('storage functions work correctly with normal data', () => {
      const arrayStorage = createStorage<{ id: number; name: string }>(testKey + '_array');
      const objectStorage = createObjectStorage<{ count: number }>(testKey + '_object');

      // Test array storage
      const testArray = [
        { id: 1, name: 'test1' },
        { id: 2, name: 'test2' },
      ];
      arrayStorage.setItem(testArray);
      expect(arrayStorage.getItem()).toEqual(testArray);

      // Test object storage
      const testObject = { count: 42 };
      objectStorage.setItem(testObject);
      expect(objectStorage.getItem()).toEqual(testObject);

      // Test null handling
      objectStorage.setItem(null);
      expect(objectStorage.getItem()).toBeNull();
    });
  });
});
