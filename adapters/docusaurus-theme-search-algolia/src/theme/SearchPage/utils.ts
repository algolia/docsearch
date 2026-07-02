/**
 * Copyright (c) Facebook, Inc. And its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { ThemeConfigDocSearch } from '@docsearch/docusaurus-adapter';
import type algoliaSearchHelper from 'algoliasearch-helper';

type SearchIndex = ThemeConfigDocSearch['indices'][number];
type PlainSearchParameters = NonNullable<Parameters<typeof algoliaSearchHelper>[2]>;

export function getIndexName(index: SearchIndex): string {
  return typeof index === 'string' ? index : index.name;
}

export function getIndexSearchParameters(index: SearchIndex): PlainSearchParameters {
  return (typeof index === 'string' ? {} : (index.searchParameters ?? {})) as PlainSearchParameters;
}
