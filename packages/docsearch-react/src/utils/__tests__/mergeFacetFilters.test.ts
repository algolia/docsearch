import { describe, expect, it } from 'vitest';

import { mergeFacetFilters } from '../mergeFacetFilters';

describe('mergeFacetFilters', () => {
  describe('same facet across inputs is ORed', () => {
    it('ORs a single-valued facet from two inputs', () => {
      expect(
        mergeFacetFilters(
          ['language:en', ['docusaurus_tag:TAG1', 'docusaurus_tag:TAG2']],
          ['language:es']
        )
      ).toEqual([
        ['language:en', 'language:es'],
        ['docusaurus_tag:TAG1', 'docusaurus_tag:TAG2'],
      ]);
    });

    it('adds values to an existing OR group of the same facet', () => {
      expect(
        mergeFacetFilters(
          ['language:en', ['docusaurus_tag:TAG1', 'docusaurus_tag:TAG2']],
          ['docusaurus_tag:TAG3']
        )
      ).toEqual([
        'language:en',
        ['docusaurus_tag:TAG1', 'docusaurus_tag:TAG2', 'docusaurus_tag:TAG3'],
      ]);
    });

    it('ORs two strings', () => {
      expect(mergeFacetFilters('category:book', 'category:movie')).toEqual([
        ['category:book', 'category:movie'],
      ]);
    });

    it('merges more than two inputs', () => {
      expect(mergeFacetFilters('a:1', 'b:1', 'a:2')).toEqual([
        ['a:1', 'a:2'],
        'b:1',
      ]);
    });

    it('places the merged group where the facet first appears', () => {
      expect(mergeFacetFilters(['b:1', 'a:1'], ['a:2', 'c:1'])).toEqual([
        'b:1',
        ['a:1', 'a:2'],
        'c:1',
      ]);
    });

    it('treats escaped leading minus signs as positive values', () => {
      expect(mergeFacetFilters('category:\\-Movie', 'category:Book')).toEqual([
        ['category:\\-Movie', 'category:Book'],
      ]);
    });
  });

  describe('duplicates', () => {
    it('removes duplicate values and unwraps single-value groups', () => {
      expect(mergeFacetFilters(['language:en'], ['language:en'])).toEqual([
        'language:en',
      ]);
    });

    it('removes duplicates from a merged group', () => {
      expect(
        mergeFacetFilters(
          ['language:en', ['docusaurus_tag:TAG1', 'docusaurus_tag:TAG2']],
          ['language:en', 'docusaurus_tag:TAG2']
        )
      ).toEqual([
        'language:en',
        ['docusaurus_tag:TAG1', 'docusaurus_tag:TAG2'],
      ]);
    });
  });

  describe('different facets are ANDed', () => {
    it('matches the Algolia "AND and OR" example (string first)', () => {
      expect(
        mergeFacetFilters('author:John Doe', [
          ['category:Book', 'category:Movie'],
        ])
      ).toEqual(['author:John Doe', ['category:Book', 'category:Movie']]);
    });

    it('matches the Algolia "AND and OR" example (group first)', () => {
      expect(
        mergeFacetFilters(
          [['category:Book', 'category:Movie']],
          ['author:John Doe']
        )
      ).toEqual([['category:Book', 'category:Movie'], 'author:John Doe']);
    });

    it('joins unrelated facets in order', () => {
      expect(mergeFacetFilters(['a:1', 'b:1'], 'c:1', ['d:1'])).toEqual([
        'a:1',
        'b:1',
        'c:1',
        'd:1',
      ]);
    });
  });

  describe('negations', () => {
    it('keeps negations of the same facet ANDed', () => {
      expect(mergeFacetFilters('status:-draft', 'status:-archived')).toEqual([
        'status:-draft',
        'status:-archived',
      ]);
    });

    it('does not merge a negation with a positive value of the same facet', () => {
      expect(mergeFacetFilters('status:-draft', 'status:published')).toEqual([
        'status:-draft',
        'status:published',
      ]);
    });
  });

  describe('OR groups mixing facets', () => {
    it('keeps them as-is and ANDed', () => {
      expect(
        mergeFacetFilters([['language:en', 'version:1']], ['language:es'])
      ).toEqual([['language:en', 'version:1'], 'language:es']);
    });
  });

  describe('structure within a single input', () => {
    it('keeps an explicit AND on the same facet', () => {
      expect(
        mergeFacetFilters(['_tags:docs', '_tags:v2'], ['_tags:v3'])
      ).toEqual(['_tags:docs', '_tags:v2', '_tags:v3']);
    });

    it('keeps a repeated entry in the same input as-is', () => {
      expect(mergeFacetFilters(['a:1', 'a:1'], ['a:2'])).toEqual([
        'a:1',
        'a:1',
        'a:2',
      ]);
    });

    it('does not merge entries without a facet key', () => {
      expect(mergeFacetFilters(['', 'a:1'], ['a:2'])).toEqual([
        '',
        ['a:1', 'a:2'],
      ]);
    });
  });

  describe('empty and single inputs', () => {
    it('returns a single string input unchanged', () => {
      expect(mergeFacetFilters('f1', undefined)).toBe('f1');
      expect(mergeFacetFilters(undefined, 'f1')).toBe('f1');
    });

    it('returns a single array input unchanged', () => {
      const input = [['a:1']];

      expect(mergeFacetFilters(input)).toBe(input);
      expect(mergeFacetFilters([], input)).toBe(input);
    });

    it('returns undefined when there is nothing to filter on', () => {
      expect(mergeFacetFilters()).toBeUndefined();
      expect(mergeFacetFilters(undefined, [], '')).toBeUndefined();
    });
  });

  it('does not modify its inputs', () => {
    const first = ['language:en', ['docusaurus_tag:TAG1']];
    const second = ['language:es', ['docusaurus_tag:TAG2']];
    const firstCopy = structuredClone(first);
    const secondCopy = structuredClone(second);

    mergeFacetFilters(first, second);

    expect(first).toEqual(firstCopy);
    expect(second).toEqual(secondCopy);
  });
});
