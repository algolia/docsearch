import type { FacetFilters } from 'algoliasearch/lite';

import { getFacetFilterKey } from './facets';

type MergeableEntry = {
  key: string;
  values: string[];
};

type OutputEntry =
  | { type: 'entry'; facetFilter: FacetFilters }
  | { type: 'group'; key: string };

function isEmptyFacetFilters(
  facetFilters: FacetFilters | undefined
): facetFilters is undefined {
  return facetFilters === undefined || facetFilters.length === 0;
}

function getPositiveFacetFilterKey(facetFilter: FacetFilters): string | null {
  if (typeof facetFilter !== 'string') {
    return null;
  }

  const key = getFacetFilterKey(facetFilter);

  // `key:-value` is a negation, `key:\-value` is an escaped positive value
  if (key === null || facetFilter.charAt(key.length + 1) === '-') {
    return null;
  }

  return key;
}

/**
 * Returns the facet key and values of an entry that can be OR-merged with
 * entries from other inputs: a positive `key:value` string, or an OR group of
 * positive values that all share the same key.
 */
function getMergeableEntry(facetFilter: FacetFilters): MergeableEntry | null {
  if (typeof facetFilter === 'string') {
    const key = getPositiveFacetFilterKey(facetFilter);

    return key === null ? null : { key, values: [facetFilter] };
  }

  if (facetFilter.length === 0) {
    return null;
  }

  const key = getPositiveFacetFilterKey(facetFilter[0]);

  if (
    key === null ||
    !facetFilter.every((value) => getPositiveFacetFilterKey(value) === key)
  ) {
    return null;
  }

  return { key, values: facetFilter as string[] };
}

/**
 * Returns the mergeable entries of a single input, by position. A facet that
 * appears in more than one entry of the same input is an explicit AND, so it is
 * left out and kept as-is.
 */
function getMergeableEntries(
  entries: FacetFilters[]
): Map<number, MergeableEntry> {
  const mergeableEntries = new Map<number, MergeableEntry>();
  const keyCounts = new Map<string, number>();

  entries.forEach((entry, index) => {
    const mergeableEntry = getMergeableEntry(entry);

    if (mergeableEntry) {
      mergeableEntries.set(index, mergeableEntry);
      keyCounts.set(
        mergeableEntry.key,
        (keyCounts.get(mergeableEntry.key) ?? 0) + 1
      );
    }
  });

  for (const [index, { key }] of mergeableEntries) {
    if ((keyCounts.get(key) ?? 0) > 1) {
      mergeableEntries.delete(index);
    }
  }

  return mergeableEntries;
}

/**
 * Merges `facetFilters` like faceted search: values for the same facet across
 * inputs are combined with OR, and different facets are combined with AND.
 *
 * @example
 *   ```ts
 *   mergeFacetFilters(
 *     ['language:en', ['docusaurus_tag:TAG1', 'docusaurus_tag:TAG2']],
 *     ['language:es']
 *   );
 *   // => [['language:en', 'language:es'], ['docusaurus_tag:TAG1', 'docusaurus_tag:TAG2']]
 *   // (language:en OR language:es) AND (docusaurus_tag:TAG1 OR docusaurus_tag:TAG2)
 *   ```
 *
 * - The structure of each input is preserved: entries for the same facet within a
 *   single input stay combined with AND.
 * - Negated values (`facet:-value`) are always combined with AND.
 * - OR groups that mix several facets are kept as-is.
 * - Duplicate values are removed from merged groups.
 *
 * Returns `undefined` when there is nothing to filter on.
 *
 * @see https://www.algolia.com/doc/api-reference/api-parameters/facetFilters
 */
export function mergeFacetFilters(
  ...facetFilters: Array<FacetFilters | undefined>
): FacetFilters | undefined {
  const definedFacetFilters = facetFilters.filter(
    (facetFilter): facetFilter is FacetFilters =>
      !isEmptyFacetFilters(facetFilter)
  );

  if (definedFacetFilters.length <= 1) {
    return definedFacetFilters[0];
  }

  const inputs = definedFacetFilters.map((facetFilter) =>
    typeof facetFilter === 'string' ? [facetFilter] : facetFilter
  );
  const mergeableEntriesByInput = inputs.map(getMergeableEntries);
  const inputCountsByKey = new Map<string, number>();

  for (const mergeableEntries of mergeableEntriesByInput) {
    const keys = new Set(
      Array.from(mergeableEntries.values(), ({ key }) => key)
    );

    for (const key of keys) {
      inputCountsByKey.set(key, (inputCountsByKey.get(key) ?? 0) + 1);
    }
  }

  const output: OutputEntry[] = [];
  const groups = new Map<string, Set<string>>();

  inputs.forEach((entries, inputIndex) => {
    entries.forEach((entry, entryIndex) => {
      const mergeableEntry =
        mergeableEntriesByInput[inputIndex].get(entryIndex);

      // Only merge a facet that is present in at least two inputs
      if (
        !mergeableEntry ||
        (inputCountsByKey.get(mergeableEntry.key) ?? 0) < 2
      ) {
        output.push({ type: 'entry', facetFilter: entry });

        return;
      }

      const group = groups.get(mergeableEntry.key);

      if (group) {
        mergeableEntry.values.forEach((value) => group.add(value));
      } else {
        groups.set(mergeableEntry.key, new Set(mergeableEntry.values));
        output.push({ type: 'group', key: mergeableEntry.key });
      }
    });
  });

  return output.map((outputEntry) => {
    if (outputEntry.type === 'entry') {
      return outputEntry.facetFilter;
    }

    const values = [...(groups.get(outputEntry.key) ?? [])];

    return values.length === 1 ? values[0] : values;
  });
}
