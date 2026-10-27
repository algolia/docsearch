// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import docsearch from '@docsearch/starlight-adapter';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'My Docs',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' }],
			sidebar: [
				{
					label: 'Guides',
					items: [{ autogenerate: { directory: 'guides' } }],
				},
			],
			plugins: [docsearch()]
		}),
	],
});
