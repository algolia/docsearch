/**
 * Copyright (c) Facebook, Inc. And its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { ThemeConfig } from '@docsearch/docusaurus-adapter';
import { readDefaultCodeTranslationMessages } from '@docusaurus/theme-translations';
import type { LoadContext, Plugin } from '@docusaurus/types';

import { getDocSearchConfig, hasLegacyAlgoliaConfig } from './getDocSearchConfig';
import { createOpenSearchFile, createOpenSearchHeadTags, shouldCreateOpenSearchFile } from './opensearch';
import { normalizeUrl } from './utils';

function hasClassicPreset(context: LoadContext): boolean {
  return (context.siteConfig.presets ?? []).some((preset) => {
    if (typeof preset === 'string') {
      return preset === 'classic' || preset === '@docusaurus/preset-classic';
    }

    if (Array.isArray(preset)) {
      return preset[0] === 'classic' || preset[0] === '@docusaurus/preset-classic';
    }

    return false;
  });
}

export default function themeSearchAlgolia(context: LoadContext): Plugin<void> {
  const {
    baseUrl,
    siteConfig: { themeConfig },
    i18n: { currentLocale },
  } = context;
  const { searchPagePath } = getDocSearchConfig(themeConfig as ThemeConfig);
  const classicPresetWithLegacyAlgoliaConfig =
    hasClassicPreset(context) && hasLegacyAlgoliaConfig(themeConfig as ThemeConfig);

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
      // The classic preset adds /search through @docusaurus/theme-search-algolia,
      // but only when the legacy "themeConfig.algolia" key is used.
      if (searchPagePath && !classicPresetWithLegacyAlgoliaConfig) {
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
