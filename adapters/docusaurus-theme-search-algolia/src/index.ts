/**
 * Copyright (c) Facebook, Inc. And its affiliates.
 *
 * This source code is licensed under the MIT license found in the LICENSE file
 * in the root directory of this source tree.
 */

import type { ThemeConfig } from '@docsearch/docusaurus-adapter';
import { readDefaultCodeTranslationMessages } from '@docusaurus/theme-translations';
import type { LoadContext, Plugin } from '@docusaurus/types';

import { getDocSearchConfig } from './getDocSearchConfig';
import {
  createOpenSearchFile,
  createOpenSearchHeadTags,
  shouldCreateOpenSearchFile,
} from './opensearch';
import { normalizeUrl } from './utils';

export default function themeSearchAlgolia(context: LoadContext): Plugin<void> {
  const {
    baseUrl,
    siteConfig: { themeConfig },
    i18n: { currentLocale },
  } = context;
  const { searchPage } = getDocSearchConfig(themeConfig as ThemeConfig);
  const searchPagePath = searchPage === false ? false : searchPage.path;

  return {
    name: 'docsearch-docusaurus-algolia-search',

    getThemePath() {
      return '../lib/theme';
    },
    getTypeScriptThemePath() {
      return '../src/theme';
    },

    getDefaultCodeTranslationMessages() {
      return readDefaultCodeTranslationMessages({
        locale: currentLocale,
        name: 'theme-search-algolia',
      });
    },

    contentLoaded({ actions: { addRoute } }) {
      if (searchPagePath) {
        addRoute({
          path: normalizeUrl([baseUrl, searchPagePath]),
          component: '@theme/SearchPage',
          exact: true,
        });
      }
    },

    async postBuild() {
      if (shouldCreateOpenSearchFile({ context })) {
        await createOpenSearchFile({ context });
      }
    },

    injectHtmlTags() {
      if (shouldCreateOpenSearchFile({ context })) {
        return { headTags: createOpenSearchHeadTags({ context }) };
      }
      return {};
    },
  };
}

export { validateThemeConfig } from './validateThemeConfig';
