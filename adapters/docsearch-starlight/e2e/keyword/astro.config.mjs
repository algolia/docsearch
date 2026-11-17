import { fileURLToPath } from 'node:url';

import starlight from '@astrojs/starlight';
import docsearch from '@docsearch/starlight-adapter';
import { defineConfig } from 'astro/config';

// E2E-only build of the demo without Ask AI, to cover keyword-only sites
export default defineConfig({
  root: fileURLToPath(
    new URL('../../../../examples/demo-starlight/', import.meta.url)
  ),
  outDir: fileURLToPath(new URL('./dist/', import.meta.url)),
  cacheDir: fileURLToPath(new URL('./.astro/', import.meta.url)),
  integrations: [
    starlight({
      title: 'My Docs',
      plugins: [
        docsearch({
          appId: 'PMZUYBQDAK',
          apiKey: '24b09689d5b4223813d9b8e48563c8f6',
          indices: ['docsearch'],
          placeholder: 'Search documentation',
        }),
      ],
    }),
  ],
});
