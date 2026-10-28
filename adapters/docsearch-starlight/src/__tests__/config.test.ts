import { describe, expect, it } from 'vitest';

import { validateOptions } from '../config.js';

const createOptions = () => ({
	appId: 'test-app',
	apiKey: 'test-search-key',
	indices: ['docs'],
});

describe('validateOptions', () => {
	it('accepts a minimal configuration', () => {
		expect(() => validateOptions(createOptions())).not.toThrow();
	});

	it('rejects a whitespace-only appId', () => {
		const options = { ...createOptions(), appId: '   ' };

		expect(() => validateOptions(options)).toThrow('appId');
	});

	it('rejects a missing apiKey', () => {
		const options = { appId: 'test-app', indices: ['docs'] };

		expect(() => validateOptions(options)).toThrow('apiKey');
	});

	it('rejects empty indices', () => {
		const options = { ...createOptions(), indices: [] };

		expect(() => validateOptions(options)).toThrow('indices');
	});

	it('rejects a whitespace-only object index name', () => {
		const options = { ...createOptions(), indices: [{ name: '   ' }] };

		expect(() => validateOptions(options)).toThrow('indices');
	});

	it('rejects unsupported root options', () => {
		const options = { ...createOptions(), askAi: 'agent-id' };

		expect(() => validateOptions(options)).toThrow('askAi');
	});

	it('rejects unsupported index options', () => {
		const options = {
			...createOptions(),
			indices: [{ name: 'docs', unsupported: true }],
		};

		expect(() => validateOptions(options)).toThrow('indices');
	});

	it('accepts per-index search parameters without changing them', () => {
		const options = {
			...createOptions(),
			indices: [
				{
					name: 'docs',
					searchParameters: {
						hitsPerPage: 8,
						facetFilters: [['lang:en', 'lang:fr']],
					},
				},
			],
		};
		const original = structuredClone(options);

		expect(() => validateOptions(options)).not.toThrow();
		expect(options).toEqual(original);
	});

	it('accepts nested translations without changing them', () => {
		const options = {
			...createOptions(),
			translations: {
				button: { buttonText: 'Search', buttonAriaLabel: 'Search docs' },
				custom: { count: 2, enabled: true, extra: null },
			},
		};
		const original = structuredClone(options);

		expect(() => validateOptions(options)).not.toThrow();
		expect(options).toEqual(original);
	});

	it('rejects functions in translations', () => {
		const options = {
			...createOptions(),
			translations: { button: { buttonText: () => 'Search' } },
		};

		expect(() => validateOptions(options)).toThrow('translations');
	});

	it('rejects BigInt with a JSON-safety error', () => {
		const options = {
			...createOptions(),
			translations: { count: BigInt(1) },
		};

		expect(() => validateOptions(options)).toThrow('JSON-safe');
	});

	it('rejects circular values with a JSON-safety error', () => {
		const translations: Record<string, unknown> = {};
		translations.self = translations;
		const options = { ...createOptions(), translations };

		expect(() => validateOptions(options)).toThrow('JSON-safe');
	});
});