import starlight from '@astrojs/starlight';
import docsearch from '@docsearch/starlight-adapter';
// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'DocSearch + Starlight',
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/algolia/docsearch',
        },
      ],
      sidebar: [
        { label: 'Overview', slug: '' },
        {
          label: 'Guides',
          items: [{ autogenerate: { directory: 'guides' } }],
        },
        {
          label: 'Reference',
          items: [{ autogenerate: { directory: 'reference' } }],
        },
      ],
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
