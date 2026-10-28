import { z } from 'astro/zod';

const nonBlankString = z.string().refine((value) => value.trim().length > 0, {
  message: 'Must not be empty or whitespace-only',
});

const indexSchema = z.union([
  nonBlankString,
  z.strictObject({
    name: nonBlankString,
    searchParameters: z.record(z.string(), z.json()).optional(),
  }),
]);

export const configSchema = z.strictObject({
  appId: nonBlankString,
  apiKey: nonBlankString,
  indices: z.array(indexSchema).min(1),
  placeholder: z.string().optional(),
  translations: z.record(z.string(), z.json()).optional(),
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