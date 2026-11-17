import type { DocSearchProps } from '@docsearch/js/docsearch';
import { z } from 'astro/zod';

// Mirrors the `searchParameters` type of DocSearch indices; checked at the end of this file and in config.ts.

type NestedFilter = string | NestedFilter[];

export const nestedFilter: z.ZodType<NestedFilter> = z.lazy(() =>
  z.union([z.string(), z.array(nestedFilter)])
);

const stringArray = z.array(z.string());

const supportedLanguage = z.enum([
  'af',
  'ar',
  'az',
  'bg',
  'bn',
  'ca',
  'cs',
  'cy',
  'da',
  'de',
  'el',
  'en',
  'eo',
  'es',
  'et',
  'eu',
  'fa',
  'fi',
  'fo',
  'fr',
  'ga',
  'gl',
  'he',
  'hi',
  'hu',
  'hy',
  'id',
  'is',
  'it',
  'ja',
  'ka',
  'kk',
  'ko',
  'ku',
  'ky',
  'lt',
  'lv',
  'mi',
  'mn',
  'mr',
  'ms',
  'mt',
  'nb',
  'nl',
  'no',
  'ns',
  'pl',
  'ps',
  'pt',
  'pt-br',
  'qu',
  'ro',
  'ru',
  'sk',
  'sq',
  'sv',
  'sw',
  'ta',
  'te',
  'th',
  'tl',
  'tn',
  'tr',
  'tt',
  'uk',
  'ur',
  'uz',
  'zh',
]);

const facetValue = z.strictObject({
  order: stringArray.optional(),
  sortRemainingBy: z.enum(['count', 'alpha', 'hidden']).optional(),
  hide: stringArray.optional(),
});

const renderingContent = z.strictObject({
  facetOrdering: z
    .strictObject({
      facets: z.strictObject({ order: stringArray.optional() }).optional(),
      values: z.record(z.string(), facetValue).optional(),
    })
    .optional(),
  redirect: z.strictObject({ url: z.string().optional() }).optional(),
  widgets: z
    .strictObject({
      banners: z
        .array(
          z.strictObject({
            image: z
              .strictObject({
                urls: z
                  .array(z.strictObject({ url: z.string().optional() }))
                  .optional(),
                title: z.string().optional(),
              })
              .optional(),
            link: z.strictObject({ url: z.string().optional() }).optional(),
          })
        )
        .optional(),
    })
    .optional(),
});

export const searchParametersSchema = z.strictObject({
  query: z.string().optional(),
  similarQuery: z.string().optional(),
  filters: z.string().optional(),
  facetFilters: nestedFilter.optional(),
  optionalFilters: nestedFilter.optional(),
  numericFilters: nestedFilter.optional(),
  tagFilters: nestedFilter.optional(),
  sumOrFiltersScores: z.boolean().optional(),
  restrictSearchableAttributes: stringArray.optional(),
  facets: stringArray.optional(),
  facetingAfterDistinct: z.boolean().optional(),
  page: z.number().optional(),
  offset: z.number().optional(),
  length: z.number().optional(),
  aroundLatLng: z.string().optional(),
  aroundLatLngViaIP: z.boolean().optional(),
  aroundRadius: z.union([z.number(), z.literal('all')]).optional(),
  aroundPrecision: z
    .union([
      z.number(),
      z.array(
        z.strictObject({
          from: z.number().optional(),
          value: z.number().optional(),
        })
      ),
    ])
    .optional(),
  minimumAroundRadius: z.number().optional(),
  insideBoundingBox: z
    .union([z.string(), z.array(z.array(z.number())), z.null()])
    .optional(),
  insidePolygon: z.array(z.array(z.number())).optional(),
  naturalLanguages: z.array(supportedLanguage).optional(),
  ruleContexts: stringArray.optional(),
  personalizationImpact: z.number().optional(),
  userToken: z.string().optional(),
  getRankingInfo: z.boolean().optional(),
  synonyms: z.boolean().optional(),
  clickAnalytics: z.boolean().optional(),
  analytics: z.boolean().optional(),
  analyticsTags: stringArray.optional(),
  percentileComputation: z.boolean().optional(),
  enableABTest: z.boolean().optional(),
  attributesToRetrieve: stringArray.optional(),
  ranking: stringArray.optional(),
  relevancyStrictness: z.number().optional(),
  attributesToHighlight: stringArray.optional(),
  attributesToSnippet: stringArray.optional(),
  highlightPreTag: z.string().optional(),
  highlightPostTag: z.string().optional(),
  snippetEllipsisText: z.string().optional(),
  restrictHighlightAndSnippetArrays: z.boolean().optional(),
  hitsPerPage: z.number().optional(),
  minWordSizefor1Typo: z.number().optional(),
  minWordSizefor2Typos: z.number().optional(),
  typoTolerance: z
    .union([z.boolean(), z.enum(['min', 'strict', 'true', 'false'])])
    .optional(),
  allowTyposOnNumericTokens: z.boolean().optional(),
  disableTypoToleranceOnAttributes: stringArray.optional(),
  ignorePlurals: z
    .union([z.array(supportedLanguage), z.enum(['true', 'false']), z.boolean()])
    .optional(),
  removeStopWords: z
    .union([z.array(supportedLanguage), z.boolean()])
    .optional(),
  queryLanguages: z.array(supportedLanguage).optional(),
  decompoundQuery: z.boolean().optional(),
  enableRules: z.boolean().optional(),
  enablePersonalization: z.boolean().optional(),
  queryType: z.enum(['prefixLast', 'prefixAll', 'prefixNone']).optional(),
  removeWordsIfNoResults: z
    .enum(['none', 'lastWords', 'firstWords', 'allOptional'])
    .optional(),
  mode: z.enum(['neuralSearch', 'keywordSearch']).optional(),
  semanticSearch: z
    .strictObject({ eventSources: stringArray.nullable().optional() })
    .optional(),
  advancedSyntax: z.boolean().optional(),
  optionalWords: z.union([z.string(), stringArray, z.null()]).optional(),
  disableExactOnAttributes: stringArray.optional(),
  exactOnSingleWordQuery: z.enum(['attribute', 'none', 'word']).optional(),
  alternativesAsExact: z
    .array(
      z.enum([
        'ignorePlurals',
        'singleWordSynonym',
        'multiWordsSynonym',
        'ignoreConjugations',
      ])
    )
    .optional(),
  advancedSyntaxFeatures: z
    .array(z.enum(['exactPhrase', 'excludeWords']))
    .optional(),
  distinct: z.union([z.boolean(), z.number()]).optional(),
  replaceSynonymsInHighlight: z.boolean().optional(),
  minProximity: z.number().optional(),
  responseFields: stringArray.optional(),
  maxValuesPerFacet: z.number().optional(),
  sortFacetValuesBy: z.string().optional(),
  attributeCriteriaComputedByMinProximity: z.boolean().optional(),
  renderingContent: renderingContent.optional(),
  enableReRanking: z.boolean().optional(),
  reRankingApplyFilter: z.union([nestedFilter, z.null()]).optional(),
});

type RealKeys = keyof NonNullable<
  Extract<
    DocSearchProps['indices'][number],
    { name: string }
  >['searchParameters']
>;
type SchemaKeys = keyof z.infer<typeof searchParametersSchema>;

// `satisfies` in config.ts misses parameters added by an algoliasearch upgrade; this fails the build and names them.
export const _searchParametersKeysMatch: [
  Exclude<RealKeys, SchemaKeys>,
  Exclude<SchemaKeys, RealKeys>,
] extends [never, never]
  ? true
  : {
      missing: Exclude<RealKeys, SchemaKeys>;
      extra: Exclude<SchemaKeys, RealKeys>;
    } = true;
