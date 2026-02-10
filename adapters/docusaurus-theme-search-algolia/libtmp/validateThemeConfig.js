"use strict";
/**
 * Copyright (c) Facebook, Inc. And its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Schema = exports.DEFAULT_CONFIG = void 0;
exports.validateThemeConfig = validateThemeConfig;
const joi_1 = __importDefault(require("joi"));
const docSearchVersion_1 = require("./docSearchVersion");
const utils_1 = require("./utils");
exports.DEFAULT_CONFIG = {
    // Enabled by default, as it makes sense in most cases
    // see also https://github.com/facebook/docusaurus/issues/5880
    contextualSearch: true,
    searchParameters: {},
    searchPagePath: 'search',
};
const FacetFiltersSchema = joi_1.default.array().items(joi_1.default.alternatives().try(joi_1.default.string(), joi_1.default.array().items(joi_1.default.string())));
const AskAiSearchParametersSchema = joi_1.default.object({
    facetFilters: FacetFiltersSchema.optional(),
    filters: joi_1.default.string().optional(),
    attributesToRetrieve: joi_1.default.array().items(joi_1.default.string()).optional(),
    restrictSearchableAttributes: joi_1.default.array().items(joi_1.default.string()).optional(),
    distinct: joi_1.default.alternatives().try(joi_1.default.boolean(), joi_1.default.number(), joi_1.default.string()).optional(),
}).unknown();
const SidePanelKeyboardShortcutsSchema = joi_1.default.object({
    'Ctrl/Cmd+I': joi_1.default.boolean().optional(),
});
const SidePanelSchema = joi_1.default.object({
    keyboardShortcuts: SidePanelKeyboardShortcutsSchema.optional(),
    variant: joi_1.default.string().valid('floating', 'inline').optional(),
    side: joi_1.default.string().valid('left', 'right').optional(),
    width: joi_1.default.alternatives().try(joi_1.default.number(), joi_1.default.string()).optional(),
    expandedWidth: joi_1.default.alternatives().try(joi_1.default.number(), joi_1.default.string()).optional(),
    pushSelector: joi_1.default.string().optional(),
    suggestedQuestions: joi_1.default.boolean().optional(),
    translations: joi_1.default.object().optional().unknown(),
    hideButton: joi_1.default.boolean().optional(),
});
exports.Schema = joi_1.default.object({
    algolia: joi_1.default.object({
        // Docusaurus attributes
        contextualSearch: joi_1.default.boolean().default(exports.DEFAULT_CONFIG.contextualSearch),
        externalUrlRegex: joi_1.default.string().optional(),
        // Algolia attributes
        appId: joi_1.default.string().required().messages({
            'any.required': '"algolia.appId" is required. If you haven\'t migrated to the new DocSearch infra, please refer to the blog post for instructions: https://docusaurus.io/blog/2021/11/21/algolia-docsearch-migration',
        }),
        apiKey: joi_1.default.string().required(),
        indexName: joi_1.default.string().required(),
        searchParameters: joi_1.default.object({
            facetFilters: FacetFiltersSchema.optional(),
        })
            .default(exports.DEFAULT_CONFIG.searchParameters)
            .unknown(),
        searchPagePath: joi_1.default.alternatives()
            .try(joi_1.default.boolean().invalid(true), joi_1.default.string())
            .allow(null)
            .default(exports.DEFAULT_CONFIG.searchPagePath),
        replaceSearchResultPathname: joi_1.default.object({
            from: joi_1.default.custom((from) => {
                if (typeof from === 'string') {
                    return (0, utils_1.escapeRegexp)(from);
                }
                if (from instanceof RegExp) {
                    return from.source;
                }
                throw new Error(`it should be a RegExp or a string, but received ${from}`);
            }).required(),
            to: joi_1.default.string().required(),
        }).optional(),
        // Ask AI configuration (DocSearch v4 only)
        askAi: joi_1.default.alternatives()
            .try(
        // Simple string format (assistantId only)
        joi_1.default.string(), 
        // Full configuration object
        joi_1.default.object({
            assistantId: joi_1.default.string().required(),
            // Optional Ask AI configuration
            indexName: joi_1.default.string().optional(),
            apiKey: joi_1.default.string().optional(),
            appId: joi_1.default.string().optional(),
            agentStudio: joi_1.default.boolean().optional(),
            searchParameters: AskAiSearchParametersSchema,
            suggestedQuestions: joi_1.default.boolean().optional(),
            sidePanel: joi_1.default.alternatives().try(joi_1.default.boolean(), SidePanelSchema).optional(),
        }))
            .custom((askAiInput, helpers) => {
            if (!askAiInput) {
                return askAiInput;
            }
            const algolia = helpers.state.ancestors[0];
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
                };
            }
            // Fill in missing fields with the top-level Algolia config
            const normalizedAskAi = { ...askAiInput };
            normalizedAskAi.indexName = normalizedAskAi.indexName ?? algolia.indexName;
            normalizedAskAi.apiKey = normalizedAskAi.apiKey ?? algolia.apiKey;
            normalizedAskAi.appId = normalizedAskAi.appId ?? algolia.appId;
            if (normalizedAskAi.agentStudio !== true &&
                normalizedAskAi.searchParameters?.facetFilters === undefined &&
                algoliaFacetFilters) {
                normalizedAskAi.searchParameters = {
                    ...(normalizedAskAi.searchParameters ?? {}),
                    facetFilters: algoliaFacetFilters,
                };
            }
            return normalizedAskAi;
        })
            .optional()
            .messages({
            'alternatives.types': 'askAi must be either a string (assistantId) or an object with indexName, apiKey, appId, and assistantId',
        }),
    })
        .label('themeConfig.algolia')
        .required()
        .unknown(),
});
function ensureSidepanelSupported(themeConfig) {
    const sidePanelEnabled = themeConfig.algolia.askAi &&
        typeof themeConfig.algolia.askAi === 'object' &&
        Boolean(themeConfig.algolia.askAi.sidePanel);
    if (!sidePanelEnabled) {
        return;
    }
    const isSidepanelSupported = (() => {
        const match = docSearchVersion_1.docSearchVersionString.match(/^(?<major>\d+)\.(?<minor>\d+)/);
        if (!match?.groups) {
            return false;
        }
        const major = Number(match.groups.major);
        const minor = Number(match.groups.minor);
        return major > 4 || (major === 4 && minor >= 5);
    })();
    if (!isSidepanelSupported) {
        throw new Error('The askAi.sidePanel feature is only supported in DocSearch v4.5+. ' +
            'Please upgrade to DocSearch v4.5+ or remove the askAi.sidePanel configuration.');
    }
}
function validateThemeConfig({ validate, themeConfig: themeConfigInput, }) {
    const themeConfig = validate(exports.Schema, themeConfigInput);
    ensureSidepanelSupported(themeConfig);
    return themeConfig;
}
