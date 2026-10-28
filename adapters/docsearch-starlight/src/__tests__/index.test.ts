import type { HookParameters } from '@astrojs/starlight/types';
import type { HookParameters as AstroHookParameters } from 'astro';
import { describe, expect, it, vi } from 'vitest';

import docsearch, { type StarlightDocSearchOptions } from '../index.js';

type StarlightSetupContext = HookParameters<'config:setup'>;
type AstroSetupContext = AstroHookParameters<'astro:config:setup'>;

const createOptions = () => ({
	appId: 'test-app',
	apiKey: 'test-search-key',
	indices: ['docs'],
});

function createContext(config: StarlightSetupContext['config'] = { title: 'Docs' }) {
	const addIntegration = vi.fn<StarlightSetupContext['addIntegration']>();
	const updateConfig = vi.fn<StarlightSetupContext['updateConfig']>();
	const logger = { warn: vi.fn() };
	const context = { config, addIntegration, updateConfig, logger } as unknown as StarlightSetupContext;

	return { context, addIntegration, updateConfig, logger };
}

async function setupIntegration(options: StarlightDocSearchOptions = createOptions()) {
	const plugin = docsearch(options);
	const { context, addIntegration } = createContext();
	await plugin.hooks['config:setup']!(context);

	const integration = addIntegration.mock.calls[0][0];
	const updateAstroConfig = vi.fn<AstroSetupContext['updateConfig']>();
	const astroContext = { updateConfig: updateAstroConfig } as unknown as AstroSetupContext;
	await integration.hooks['astro:config:setup']!(astroContext);

	const astroConfig = updateAstroConfig.mock.calls[0][0];
	const vitePlugin = astroConfig.vite!.plugins![0] as unknown as {
		resolveId(id: string): string | undefined;
		load(id: string): string | undefined;
	};

	return { astroConfig, vitePlugin };
}

describe('docsearch', () => {
	it('rejects invalid configuration before returning a plugin', () => {
		const options = { ...createOptions(), indices: [] };

		expect(() => docsearch(options)).toThrow('indices');
	});

	it('replaces Pagefind while preserving unrelated component overrides', async () => {
		const plugin = docsearch(createOptions());
		const { context, updateConfig } = createContext({
			title: 'Docs',
			components: { Header: './src/Header.astro' },
		});

		await plugin.hooks['config:setup']!(context);

		expect(updateConfig).toHaveBeenCalledWith({
			pagefind: false,
			components: {
				Header: './src/Header.astro',
				Search: '@docsearch/starlight-adapter/Search.astro',
			},
		});
	});

	it('preserves an existing Search override with Pagefind enabled', async () => {
		const plugin = docsearch(createOptions());
		const config = {
			title: 'Docs',
			pagefind: true,
			components: { Search: './src/Search.astro' },
		};
		const { context, updateConfig, addIntegration, logger } = createContext(config);

		await plugin.hooks['config:setup']!(context);

		expect(updateConfig).not.toHaveBeenCalled();
		expect(config.pagefind).toBe(true);
		expect(config.components.Search).toBe('./src/Search.astro');
		expect(logger.warn).toHaveBeenCalledWith(
			expect.stringContaining('existing Search override')
		);
		expect(addIntegration).toHaveBeenCalledOnce();
	});
});

describe('Astro integration', () => {
	it('keeps DocSearch CSS bundled during development SSR', async () => {
		const { astroConfig } = await setupIntegration();

		expect(astroConfig.vite?.ssr?.noExternal).toContain('@docsearch/css');
	});

	it('exposes the configured search options through the virtual module', async () => {
		const options = {
			...createOptions(),
			indices: [
				'docs',
				{ name: 'guides', searchParameters: { hitsPerPage: 5 } },
			],
			placeholder: 'Search documentation',
			translations: { button: { buttonText: 'Find docs' } },
		};
		const { vitePlugin } = await setupIntegration(options);

		const resolvedId = vitePlugin.resolveId('virtual:docsearch-starlight-config');
		expect(resolvedId).toBe('\0virtual:docsearch-starlight-config');

		const source = vitePlugin.load(resolvedId!);

		expect(source).toMatch(/^export default [\s\S]+;$/);
		const payload = source!.slice('export default '.length, -1);
		expect(JSON.parse(payload)).toEqual(options);
	});
});
