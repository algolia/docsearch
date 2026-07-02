/**
 * Copyright (c) Facebook, Inc. And its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { ThemeConfigValidationContext } from '@docusaurus/types';
import Joi from 'joi';

import { escapeRegexp } from './utils';

import type { ThemeConfig, ThemeConfigDocSearch } from '@docsearch/docusaurus-adapter';

export const DEFAULT_CONFIG = {
  // Enabled by default, as it makes sense in most cases
  // see also https://github.com/facebook/docusaurus/issues/5880
  contextualSearch: true,
  searchPage: {
    path: 'search',
  },
} satisfies Partial<ThemeConfigDocSearch>;

const FacetFiltersSchema = Joi.array().items(Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string())));

const SearchParametersSchema = Joi.object({
  facetFilters: FacetFiltersSchema.optional(),
  filters: Joi.string().optional(),
  attributesToRetrieve: Joi.array().items(Joi.string()).optional(),
  restrictSearchableAttributes: Joi.array().items(Joi.string()).optional(),
  distinct: Joi.alternatives().try(Joi.boolean(), Joi.number(), Joi.string()).optional(),
}).unknown();

const SidePanelKeyboardShortcutsSchema = Joi.object({
  'Ctrl/Cmd+I': Joi.boolean().optional(),
}).unknown(false);

const SidePanelSchema = Joi.object({
  keyboardShortcuts: SidePanelKeyboardShortcutsSchema.optional(),
  variant: Joi.string().valid('floating', 'inline').optional(),
  side: Joi.string().valid('left', 'right').optional(),
  width: Joi.alternatives().try(Joi.number(), Joi.string()).optional(),
  expandedWidth: Joi.alternatives().try(Joi.number(), Joi.string()).optional(),
  pushSelector: Joi.string().optional(),
  suggestedQuestions: Joi.boolean().optional(),
  translations: Joi.object().optional().unknown(),
  hideButton: Joi.boolean().optional(),
  portalContainer: Joi.object().optional().unknown(),
}).unknown(false);

const KeyboardShortcutsSchema = Joi.object({
  'Ctrl/Cmd+K': Joi.boolean().optional(),
  '/': Joi.boolean().optional(),
  'Ctrl/Cmd+I': Joi.boolean().optional(),
}).unknown(false);

const IndexSchema = Joi.alternatives().try(
  Joi.string(),
  Joi.object({
    name: Joi.string().required(),
    searchParameters: SearchParametersSchema.optional(),
  }).unknown(false),
);

const SearchControlTextParamSchema = Joi.object({
  exposed: Joi.boolean().required(),
  default: Joi.string().optional(),
}).unknown(false);

const SearchControlNumberParamSchema = Joi.object({
  exposed: Joi.boolean().required(),
  default: Joi.number().optional(),
  constraint: Joi.object({
    min: Joi.number().optional(),
    max: Joi.number().optional(),
  })
    .unknown(false)
    .optional(),
}).unknown(false);

const SearchControlStringArrayParamSchema = Joi.object({
  exposed: Joi.boolean().required(),
  default: Joi.array().items(Joi.string()).optional(),
  constraint: Joi.object({
    values: Joi.array().items(Joi.string()).optional(),
  })
    .unknown(false)
    .optional(),
  merge: Joi.boolean().optional(),
}).unknown(false);

const SearchControlFacetParamSchema = Joi.object({
  exposed: Joi.boolean().valid(false).required(),
  default: Joi.array().items(Joi.string()).optional(),
}).unknown(false);

const AgentStudioSearchControlsSchema = Joi.object({
  query: SearchControlTextParamSchema.optional(),
  hits_per_page: SearchControlNumberParamSchema.optional(),
  page: SearchControlNumberParamSchema.optional(),
  attributesToRetrieve: SearchControlStringArrayParamSchema.optional(),
  responseFields: SearchControlStringArrayParamSchema.optional(),
  facets: SearchControlFacetParamSchema.optional(),
  custom: Joi.object().unknown().optional(),
}).unknown(false);

const AskAiIndexSchema = Joi.object({
  index: Joi.string().required(),
  description: Joi.string().required(),
  enhancedDescription: Joi.string().optional(),
  searchParameters: SearchParametersSchema.optional(),
  searchControls: AgentStudioSearchControlsSchema.optional(),
}).unknown(false);

const AskAiSchema = Joi.object({
  assistantId: Joi.string().required(),
  suggestedQuestions: Joi.boolean().optional(),
  searchParameters: Joi.object().pattern(Joi.string(), SearchParametersSchema).optional(),
  indices: Joi.array().items(AskAiIndexSchema).min(1).required(),
}).unknown(false);

const SearchPageFacetSchema = Joi.object({
  attribute: Joi.string().required(),
  label: Joi.string().optional(),
}).unknown(false);

const SearchPageSchema = Joi.alternatives()
  .try(
    Joi.boolean().valid(false),
    Joi.object({
      path: Joi.string().default(DEFAULT_CONFIG.searchPage.path),
      facets: Joi.array().items(SearchPageFacetSchema).optional(),
    }).unknown(false),
  )
  .default(DEFAULT_CONFIG.searchPage);

const DocSearchSchema = Joi.object<ThemeConfigDocSearch>({
  contextualSearch: Joi.boolean().default(DEFAULT_CONFIG.contextualSearch),
  externalUrlRegex: Joi.string().optional(),
  appId: Joi.string().required().messages({
    'any.required':
      '"docsearch.appId" is required. If you haven\'t migrated to the new DocSearch infra, please refer to the blog post for instructions: https://docusaurus.io/blog/2021/11/21/algolia-docsearch-migration',
  }),
  apiKey: Joi.string().required(),
  indices: Joi.array().items(IndexSchema).min(1).required(),
  facets: Joi.array()
    .items(
      Joi.object({
        key: Joi.string().required(),
        label: Joi.string().optional(),
      }).unknown(false),
    )
    .optional(),
  initialQuery: Joi.string().optional(),
  insights: Joi.alternatives().try(Joi.boolean(), Joi.object().unknown()).optional(),
  placeholder: Joi.string().optional(),
  translations: Joi.object().optional().unknown(),
  maxResultsPerGroup: Joi.number().optional(),
  disableUserPersonalization: Joi.boolean().optional(),
  getMissingResultsUrl: Joi.function().optional(),
  keyboardShortcuts: KeyboardShortcutsSchema.optional(),
  recentSearchesLimit: Joi.number().optional(),
  recentSearchesWithFavoritesLimit: Joi.number().optional(),
  resultBadgeKey: Joi.string().optional(),
  replaceSearchResultPathname: Joi.object({
    from: Joi.custom((from) => {
      if (typeof from === 'string') {
        return escapeRegexp(from);
      }
      if (from instanceof RegExp) {
        return from.source;
      }
      throw new Error(`it should be a RegExp or a string, but received ${from}`);
    }).required(),
    to: Joi.string().required(),
  })
    .unknown(false)
    .optional(),
  searchPage: SearchPageSchema,
  askAi: AskAiSchema.optional(),
  sidePanel: Joi.alternatives().try(Joi.boolean(), SidePanelSchema).optional(),
})
  .label('themeConfig.docsearch')
  .unknown(false);

const Schema = Joi.object<ThemeConfig>({
  docsearch: DocSearchSchema.required(),
}).unknown(false);

function assertNoRemovedKeys(themeConfig: ThemeConfig): void {
  const themeConfigRecord = themeConfig as Record<string, unknown>;

  if (themeConfigRecord.algolia !== undefined) {
    throw new Error(
      '`themeConfig.algolia` is no longer supported by @docsearch/docusaurus-adapter v5. Move the configuration to `themeConfig.docsearch`.',
    );
  }

  const docsearch = themeConfigRecord.docsearch;
  if (!docsearch || typeof docsearch !== 'object') {
    return;
  }

  const docsearchRecord = docsearch as Record<string, unknown>;

  if (docsearchRecord.indexName !== undefined) {
    throw new Error('`themeConfig.docsearch.indexName` was removed. Use `themeConfig.docsearch.indices` instead.');
  }

  if (docsearchRecord.searchParameters !== undefined) {
    throw new Error(
      '`themeConfig.docsearch.searchParameters` was removed. Configure `searchParameters` on each `themeConfig.docsearch.indices` entry instead.',
    );
  }

  if (docsearchRecord.searchPagePath !== undefined) {
    throw new Error(
      '`themeConfig.docsearch.searchPagePath` was removed. Use `themeConfig.docsearch.searchPage` instead.',
    );
  }

  const askAi = docsearchRecord.askAi;
  if (typeof askAi === 'string') {
    throw new Error('`themeConfig.docsearch.askAi` must be an object with `assistantId` and `indices`.');
  }

  if (!askAi || typeof askAi !== 'object') {
    return;
  }

  const askAiRecord = askAi as Record<string, unknown>;

  if (askAiRecord.agentStudio !== undefined) {
    throw new Error(
      '`themeConfig.docsearch.askAi.agentStudio` was removed. The adapter now only supports Agent Studio.',
    );
  }

  if (askAiRecord.indexName !== undefined || askAiRecord.apiKey !== undefined || askAiRecord.appId !== undefined) {
    throw new Error(
      '`themeConfig.docsearch.askAi.indexName`, `apiKey`, and `appId` were removed. Use `themeConfig.docsearch.askAi.indices` and the top-level DocSearch credentials instead.',
    );
  }

  if (askAiRecord.sidePanel !== undefined) {
    throw new Error(
      '`themeConfig.docsearch.askAi.sidePanel` was removed. Use `themeConfig.docsearch.sidePanel` instead.',
    );
  }
}

function ensureSidePanelHasAskAi(themeConfig: ThemeConfig): void {
  const { docsearch } = themeConfig;

  if (docsearch?.sidePanel && !docsearch.askAi) {
    throw new Error('`themeConfig.docsearch.sidePanel` requires `themeConfig.docsearch.askAi`.');
  }
}

export function validateThemeConfig({
  validate,
  themeConfig: themeConfigInput,
}: ThemeConfigValidationContext<ThemeConfig>): ThemeConfig {
  assertNoRemovedKeys(themeConfigInput);

  const themeConfig = validate(Schema, {
    docsearch: themeConfigInput.docsearch,
  }) as ThemeConfig;

  ensureSidePanelHasAskAi(themeConfig);
  return themeConfig;
}
