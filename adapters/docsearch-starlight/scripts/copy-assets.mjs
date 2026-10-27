// Copy Astro components and ambient types that tsc does not emit into lib/.

import { copyFile, mkdir } from 'node:fs/promises';

const outputDirectory = new URL('../lib/', import.meta.url);
await mkdir(outputDirectory, { recursive: true });

for (const filename of ['Search.astro', 'virtual.d.ts']) {
  await copyFile(
    new URL(`../src/${filename}`, import.meta.url),
    new URL(filename, outputDirectory)
  );
}