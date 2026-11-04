import { fileURLToPath } from 'node:url';

import starlight from '@astrojs/starlight';
import docsearch from '@docsearch/starlight-adapter';
import { defineConfig } from 'astro/config';

// E2E-only build of the demo with Astro's ClientRouter enabled (via Head.astro)
export default defineConfig({
  root: fileURLToPath(
    new URL('../../../../examples/demo-starlight/', import.meta.url)
  ),
  outDir: fileURLToPath(new URL('./dist/', import.meta.url)),
  cacheDir: fileURLToPath(new URL('./.astro/', import.meta.url)),
  integrations: [
    starlight({
      title: 'My Docs',
      components: {
        Head: fileURLToPath(new URL('./Head.astro', import.meta.url)),
      },
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
