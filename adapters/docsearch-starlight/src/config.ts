import type { DocSearchProps } from '@docsearch/js/docsearch';
import { z } from 'astro/zod';

import { searchParametersSchema } from './searchParameters.js';

const nonBlankString = z.string().refine((value) => value.trim().length > 0, {
  message: 'Must not be empty or whitespace-only',
});

const indexSchema = z.union([
  nonBlankString,
  z.strictObject({
    name: nonBlankString,
    searchParameters: searchParametersSchema.optional(),
  }),
]) satisfies z.ZodType<DocSearchProps['indices'][number]>;

export const configSchema = z.strictObject({
  appId: nonBlankString,
  apiKey: nonBlankString,
  indices: z.array(indexSchema).min(1),
  facets: z
    .array(
      z.strictObject({ key: nonBlankString, label: z.string().optional() })
    )
    .optional(),
  placeholder: z.string().optional(),
  maxResultsPerGroup: z.number().int().positive().optional(),
  disableUserPersonalization: z.boolean().optional(),
  initialQuery: z.string().optional(),
  translations: z.record(z.string(), z.json()).optional(),
  insights: z
    .union([
      z.boolean(),
      z.strictObject({
        insightsInitParams: z.record(z.string(), z.json()).optional(),
      }),
    ])
    .optional(),
  recentSearchesLimit: z.number().int().nonnegative().optional(),
  recentSearchesWithFavoritesLimit: z.number().int().nonnegative().optional(),
  keyboardShortcuts: z
    .strictObject({
      'Ctrl/Cmd+K': z.boolean().optional(),
      '/': z.boolean().optional(),
    })
    .optional(),
  resultBadgeKey: z.string().optional(),
});

// Validates the provided DocSearch options against the schema and ensures they are JSON-safe.
export function validateOptions(options: unknown): void {
  try {
    JSON.stringify(options);
  } catch {
    throw new Error(
      '[@docsearch/starlight-adapter] Configuration must be JSON-safe and contain no circular references.'
    );
  }

  const result = configSchema.safeParse(options);

  if (!result.success) {
    throw new Error(
      `[@docsearch/starlight-adapter] Invalid configuration:\n${z.prettifyError(result.error)}`
    );
  }
}
