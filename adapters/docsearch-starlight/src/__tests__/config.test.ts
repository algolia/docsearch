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
    const options = { ...createOptions(), hitComponent: 'x' };

    expect(() => validateOptions(options)).toThrow('hitComponent');
  });

  it('accepts a side panel alongside Ask AI', () => {
    const withSidePanel = (sidePanel: unknown) => ({
      ...createOptions(),
      askAi: 'agent-id',
      sidePanel,
    });

    expect(() => validateOptions(withSidePanel(true))).not.toThrow();
    expect(() =>
      validateOptions(
        withSidePanel({
          variant: 'floating',
          side: 'left',
          width: 400,
          expandedWidth: '60vw',
          suggestedQuestions: true,
          indices: ['docs'],
          keyboardShortcuts: { 'Ctrl/Cmd+I': false },
        })
      )
    ).not.toThrow();
  });

  it('rejects a side panel without Ask AI', () => {
    expect(() =>
      validateOptions({ ...createOptions(), sidePanel: true })
    ).toThrow('`sidePanel` requires `askAi`');
  });

  it('rejects invalid side panel options', () => {
    const withSidePanel = (sidePanel: unknown) => ({
      ...createOptions(),
      askAi: 'agent-id',
      sidePanel,
    });

    expect(() => validateOptions(withSidePanel({ variant: 'docked' }))).toThrow(
      'sidePanel'
    );
    expect(() => validateOptions(withSidePanel({ tools: {} }))).toThrow(
      'sidePanel'
    );
    expect(() =>
      validateOptions(withSidePanel({ memory: { userToken: 'jwt' } }))
    ).toThrow('sidePanel');
  });

  it('accepts an Ask AI agent id or configuration', () => {
    expect(() =>
      validateOptions({ ...createOptions(), askAi: 'agent-id' })
    ).not.toThrow();
    expect(() =>
      validateOptions({
        ...createOptions(),
        askAi: {
          agentId: 'agent-id',
          suggestedQuestions: true,
          indices: ['docs'],
          searchParameters: {
            docs: { facetFilters: ['lang:en'], distinct: false },
          },
          promptSuggestions: { indexName: 'prompts', hitsPerPage: 3 },
        },
      })
    ).not.toThrow();
  });

  it('rejects invalid Ask AI options', () => {
    const withAskAi = (askAi: unknown) => ({ ...createOptions(), askAi });

    expect(() => validateOptions(withAskAi('  '))).toThrow('askAi');
    expect(() => validateOptions(withAskAi({}))).toThrow('askAi');
    expect(() =>
      validateOptions(withAskAi({ agentId: 'a', tools: {} }))
    ).toThrow('askAi');
    expect(() =>
      validateOptions(withAskAi({ agentId: 'a', memory: { userToken: 'jwt' } }))
    ).toThrow('askAi');
  });

  it('accepts JSON-safe DocSearch props', () => {
    const options = {
      ...createOptions(),
      facets: [{ key: 'lang', label: 'Language' }],
      maxResultsPerGroup: 5,
      disableUserPersonalization: true,
      initialQuery: 'hello',
      insights: true,
      recentSearchesLimit: 3,
      recentSearchesWithFavoritesLimit: 2,
      keyboardShortcuts: { 'Ctrl/Cmd+K': false, '/': true },
      resultBadgeKey: 'version',
    };

    expect(() => validateOptions(options)).not.toThrow();
  });

  it('rejects invalid values for DocSearch props', () => {
    expect(() =>
      validateOptions({ ...createOptions(), theme: 'dark' })
    ).toThrow('theme');
    expect(() =>
      validateOptions({ ...createOptions(), insights: { insightsClient: 'x' } })
    ).toThrow('insights');
    expect(() =>
      validateOptions({ ...createOptions(), maxResultsPerGroup: 0 })
    ).toThrow('maxResultsPerGroup');
    expect(() =>
      validateOptions({
        ...createOptions(),
        keyboardShortcuts: { 'Ctrl/Cmd+I': true },
      })
    ).toThrow('keyboardShortcuts');
  });

  it('rejects unknown or mistyped search parameters', () => {
    const withParams = (searchParameters: unknown) => ({
      ...createOptions(),
      indices: [{ name: 'docs', searchParameters }],
    });

    expect(() => validateOptions(withParams({ hitsPerPag: 8 }))).toThrow(
      'indices'
    );
    expect(() => validateOptions(withParams({ hitsPerPage: 'eight' }))).toThrow(
      'indices'
    );
    expect(() =>
      validateOptions(withParams({ queryType: 'prefixSome' }))
    ).toThrow('indices');
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
