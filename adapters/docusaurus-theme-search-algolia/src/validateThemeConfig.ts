/**
 * Copyright (c) Facebook, Inc. And its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { ThemeConfig, ThemeConfigAlgolia } from '@docsearch/docusaurus-adapter';
import type { ThemeConfigValidationContext } from '@docusaurus/types';
import Joi from 'joi';

import { docSearchVersionString } from './docSearchVersion';
import { getDocSearchConfig } from './getDocSearchConfig';
import { escapeRegexp } from './utils';

export const DEFAULT_CONFIG = {
  // Enabled by default, as it makes sense in most cases
  // see also https://github.com/facebook/docusaurus/issues/5880
  contextualSearch: true,
  searchParameters: {},
  searchPagePath: 'search',
} satisfies Partial<ThemeConfigAlgolia>;

const FacetFiltersSchema = Joi.array().items(Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string())));

const AskAiSearchParametersSchema = Joi.object({
  facetFilters: FacetFiltersSchema.optional(),
  filters: Joi.string().optional(),
  attributesToRetrieve: Joi.array().items(Joi.string()).optional(),
  restrictSearchableAttributes: Joi.array().items(Joi.string()).optional(),
  distinct: Joi.alternatives().try(Joi.boolean(), Joi.number(), Joi.string()).optional(),
}).unknown();

const SidePanelKeyboardShortcutsSchema = Joi.object({
  'Ctrl/Cmd+I': Joi.boolean().optional(),
});

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
});

export const Schema = Joi.object<ThemeConfig>({
  algolia: Joi.object<ThemeConfigAlgolia>({
    // Docusaurus attributes
    contextualSearch: Joi.boolean().default(DEFAULT_CONFIG.contextualSearch),
    externalUrlRegex: Joi.string().optional(),
    // Algolia attributes
    appId: Joi.string().required().messages({
      'any.required':
        '"algolia.appId" is required. If you haven\'t migrated to the new DocSearch infra, please refer to the blog post for instructions: https://docusaurus.io/blog/2021/11/21/algolia-docsearch-migration',
    }),
    apiKey: Joi.string().required(),
    indexName: Joi.string().required(),
    searchParameters: Joi.object({
      facetFilters: FacetFiltersSchema.optional(),
    })
      .default(DEFAULT_CONFIG.searchParameters)
      .unknown(),
    searchPagePath: Joi.alternatives()
      .try(Joi.boolean().invalid(true), Joi.string())
      .allow(null)
      .default(DEFAULT_CONFIG.searchPagePath),
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
    }).optional(),
    // Ask AI configuration (DocSearch v4 only)
    askAi: Joi.alternatives()
      .try(
        // Simple string format (assistantId only)
        Joi.string(),
        // Full configuration object
        Joi.object({
          assistantId: Joi.string().required(),
          // Optional Ask AI configuration
          indexName: Joi.string().optional(),
          apiKey: Joi.string().optional(),
          appId: Joi.string().optional(),
          agentStudio: Joi.boolean().optional(),
          searchParameters: AskAiSearchParametersSchema,
          suggestedQuestions: Joi.boolean().optional(),
          sidePanel: Joi.alternatives().try(Joi.boolean(), SidePanelSchema).optional(),
        }),
      )
      .custom((askAiInput: ThemeConfigAlgolia['askAi'] | string | undefined, helpers) => {
        if (!askAiInput) {
          return askAiInput;
        }
        const algolia: ThemeConfigAlgolia = helpers.state.ancestors[0];
        const algoliaFacetFilters = algolia.searchParameters?.facetFilters;
        if (typeof askAiInput === 'string') {
          return {
            assistantId: askAiInput,
            indexName: algolia.indexName,
            apiKey: algolia.apiKey,
            appId: algolia.appId,
            ...(algoliaFacetFilters
              ? {
                  searchParameters: {
                    facetFilters: algoliaFacetFilters,
                  },
                }
              : {}),
          } satisfies ThemeConfigAlgolia['askAi'];
        }

        // Fill in missing fields with the top-level Algolia config
        const normalizedAskAi = { ...askAiInput };
        normalizedAskAi.indexName = normalizedAskAi.indexName ?? algolia.indexName;
        normalizedAskAi.apiKey = normalizedAskAi.apiKey ?? algolia.apiKey;
        normalizedAskAi.appId = normalizedAskAi.appId ?? algolia.appId;
        if (
          normalizedAskAi.agentStudio !== true &&
          normalizedAskAi.searchParameters?.facetFilters === undefined &&
          algoliaFacetFilters
        ) {
          normalizedAskAi.searchParameters = {
            ...(normalizedAskAi.searchParameters ?? {}),
            facetFilters: algoliaFacetFilters,
          };
        }

        return normalizedAskAi;
      })
      .optional()
      .messages({
        'alternatives.types':
          'askAi must be either a string (assistantId) or an object with indexName, apiKey, appId, and assistantId',
      }),
  })
    .label('themeConfig.algolia')
    .required()
    .unknown(),
});

function ensureSidepanelSupported(themeConfig: ThemeConfig) {
  const docsearch = getDocSearchConfig(themeConfig);
  const sidePanelEnabled = docsearch.askAi && typeof docsearch.askAi === 'object' && Boolean(docsearch.askAi.sidePanel);

  if (!sidePanelEnabled) {
    return;
  }

  const isSidepanelSupported = (() => {
    const match = docSearchVersionString.match(/^(?<major>\d+)\.(?<minor>\d+)/);
    if (!match?.groups) {
      return false;
    }
    const major = Number(match.groups.major);
    const minor = Number(match.groups.minor);
    return major > 4 || (major === 4 && minor >= 5);
  })();

  if (!isSidepanelSupported) {
    throw new Error(
      'The askAi.sidePanel feature is only supported in DocSearch v4.5+. ' +
        'Please upgrade to DocSearch v4.5+ or remove the askAi.sidePanel configuration.',
    );
  }
}

function hasConfigValue<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== undefined && value !== null;
}

function getThemeConfigSource(themeConfig: ThemeConfig): 'algolia' | 'docsearch' | null {
  const hasDocsearch = hasConfigValue(themeConfig.docsearch);
  const hasAlgolia = hasConfigValue(themeConfig.algolia);

  if (hasDocsearch && hasAlgolia) {
    throw new Error(
      'Please provide either "themeConfig.docsearch" (preferred) or "themeConfig.algolia" (legacy), but not both.',
    );
  }

  if (hasDocsearch) {
    return 'docsearch';
  }

  if (hasAlgolia) {
    return 'algolia';
  }

  return null;
}

export function validateThemeConfig({
  validate,
  themeConfig: themeConfigInput,
}: ThemeConfigValidationContext<ThemeConfig>): ThemeConfig {
  const source = getThemeConfigSource(themeConfigInput);

  if (!source) {
    return validate(Schema, {});
  }

  const validated = validate(Schema, {
    algolia: source === 'docsearch' ? themeConfigInput.docsearch : themeConfigInput.algolia,
  }) as ThemeConfig;

  const themeConfig: ThemeConfig = {
    [source]: validated.algolia,
  };

  ensureSidepanelSupported(themeConfig);
  return themeConfig;
}
