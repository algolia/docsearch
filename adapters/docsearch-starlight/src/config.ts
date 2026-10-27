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