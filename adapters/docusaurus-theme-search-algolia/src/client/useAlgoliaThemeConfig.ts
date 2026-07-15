/**
 * Copyright (c) Facebook, Inc. And its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import { getDocSearchConfig } from '../getDocSearchConfig';

import type { ThemeConfig, ThemeConfigDocSearch } from '@docsearch/docusaurus-adapter';

export function useAlgoliaThemeConfig(): ThemeConfigDocSearch {
  const {
    siteConfig: { themeConfig },
  } = useDocusaurusContext();
  return getDocSearchConfig(themeConfig as ThemeConfig);
}
