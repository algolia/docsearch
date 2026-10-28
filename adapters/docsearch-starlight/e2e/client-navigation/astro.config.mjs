import starlight from '@astrojs/starlight';
import docsearch from '@docsearch/starlight-adapter';
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
	root: fileURLToPath(new URL('../../../../examples/demo-starlight/', import.meta.url)),
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
					appId: 'test-app',
					apiKey: 'test-search-key',
					indices: ['docsearch'],
				}),
			],
		}),
	],
});