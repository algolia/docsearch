/**
 * Copyright (c) Facebook, Inc. And its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { ThemeConfig, ThemeConfigAlgolia } from '@docsearch/docusaurus-adapter';

export function hasLegacyAlgoliaConfig(themeConfig: ThemeConfig): boolean {
  return Boolean(themeConfig.algolia);
}

export function getDocSearchConfig(themeConfig: ThemeConfig): ThemeConfigAlgolia {
  if (themeConfig.docsearch) {
    return themeConfig.docsearch;
  }

  if (themeConfig.algolia) {
    return themeConfig.algolia;
  }

  throw new Error(
    'No DocSearch config found. Please provide "themeConfig.docsearch" (preferred) or "themeConfig.algolia" (legacy).',
  );
}
