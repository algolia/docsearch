/**
 * Copyright (c) Facebook, Inc. And its affiliates.
 *
 * This source code is licensed under the MIT license found in the LICENSE file
 * in the root directory of this source tree.
 */

export type SearchPageFacetConfig = {
  attribute: string;
  label?: string;
};

export type SearchResultItem = {
  objectID: string;
  title: string;
  url: string;
  summary: string;
  breadcrumbs: string[];
  type: string;
};

export type FacetValueItem = {
  name: string;
  count: number;
  isRefined: boolean;
};

export type FacetGroup = {
  attribute: string;
  label: string;
  items: FacetValueItem[];
};

// attribute -> selected facet values
export type Refinements = Record<string, string[]>;
