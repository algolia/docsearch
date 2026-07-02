/**
 * Copyright (c) Facebook, Inc. And its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { ThemeConfig, ThemeConfigDocSearch } from '@docsearch/docusaurus-adapter';

export function getDocSearchConfig(themeConfig: ThemeConfig): ThemeConfigDocSearch {
  if (themeConfig.docsearch) {
    return themeConfig.docsearch;
  }

  throw new Error('No DocSearch config found. Please provide "themeConfig.docsearch".');
}
