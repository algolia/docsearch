/**
 * Copyright (c) Facebook, Inc. And its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type Joi from 'joi';
import { describe, expect, it } from 'vitest';

import { DEFAULT_CONFIG, validateThemeConfig } from '../validateThemeConfig';

import type { ThemeConfig, UserThemeConfig } from '@docsearch/docusaurus-adapter';

type DocSearchInput = UserThemeConfig['docsearch'];

const minimalDocSearchConfig = {
  appId: 'BH4D9OD16A',
  apiKey: 'apiKey',
  indices: [{ name: 'index' }],
} satisfies DocSearchInput;

const minimalAskAiConfig = {
  assistantId: 'my-assistant-id',
} satisfies NonNullable<DocSearchInput>['askAi'];

const askAiConfigWithIndices = {
  ...minimalAskAiConfig,
  indices: [
    {
      index: 'markdown-index',
      description: 'Documentation content.',
    },
  ],
} satisfies NonNullable<DocSearchInput>['askAi'];

function testValidateThemeConfigWithUserThemeConfig(themeConfig: UserThemeConfig): ThemeConfig {
  function validate(schema: Joi.ObjectSchema<{ [key: string]: unknown }>, cfg: { [key: string]: unknown }) {
    const { value, error } = schema.validate(cfg, {
      convert: false,
    });
    if (error) {
      throw error;
    }
    return value as ThemeConfig;
  }

  return validateThemeConfig({
    themeConfig: themeConfig as ThemeConfig,
    validate,
  });
}

function testValidateThemeConfig(docsearch: DocSearchInput): ThemeConfig {
  return testValidateThemeConfigWithUserThemeConfig(docsearch ? { docsearch } : {});
}

function expectThrowMessage(fn: () => unknown, message: string): void {
  let thrownError: unknown;
  try {
    fn();
  } catch (error) {
    thrownError = error;
  }

  expect(thrownError).toBeDefined();
  expect(thrownError).toBeInstanceOf(Error);
  expect((thrownError as Error).message).toContain(message);
}

describe('validateThemeConfig', () => {
  it('accepts minimal v5 docsearch config', () => {
    expect(testValidateThemeConfig(minimalDocSearchConfig)).toEqual({
      docsearch: {
        ...DEFAULT_CONFIG,
        ...minimalDocSearchConfig,
      },
    });
  });

  it('rejects missing docsearch config', () => {
    expectThrowMessage(() => testValidateThemeConfig(undefined), '"themeConfig.docsearch" is required');
  });

  it('rejects unknown docsearch attributes', () => {
    const docsearch = {
      ...minimalDocSearchConfig,
      unknownKey: 'unknownKey',
    } as unknown as DocSearchInput;

    expectThrowMessage(() => testValidateThemeConfig(docsearch), '"docsearch.unknownKey" is not allowed');
  });

  it('rejects missing indices config', () => {
    const docsearch = {
      appId: 'BH4D9OD16A',
      apiKey: 'apiKey',
    } as unknown as DocSearchInput;

    expectThrowMessage(() => testValidateThemeConfig(docsearch), '"docsearch.indices" is required');
  });

  it('accepts per-index searchParameters', () => {
    const docsearch: DocSearchInput = {
      ...minimalDocSearchConfig,
      indices: [
        {
          name: 'index',
          searchParameters: {
            facetFilters: ['version:1.0'],
          },
        },
      ],
    };

    expect(testValidateThemeConfig(docsearch)).toEqual({
      docsearch: {
        ...DEFAULT_CONFIG,
        ...docsearch,
      },
    });
  });

  it('accepts string index entries', () => {
    const docsearch: DocSearchInput = {
      ...minimalDocSearchConfig,
      indices: ['index'],
    };

    expect(testValidateThemeConfig(docsearch)).toEqual({
      docsearch: {
        ...DEFAULT_CONFIG,
        ...docsearch,
      },
    });
  });

  it('accepts searchPage false', () => {
    const docsearch: DocSearchInput = {
      ...minimalDocSearchConfig,
      searchPage: false,
    };

    expect(testValidateThemeConfig(docsearch)).toEqual({
      docsearch: {
        ...DEFAULT_CONFIG,
        ...docsearch,
      },
    });
  });

  it('defaults searchPage.path when searchPage is an empty object', () => {
    const docsearch = {
      ...minimalDocSearchConfig,
      searchPage: {},
    } as unknown as DocSearchInput;

    expect(testValidateThemeConfig(docsearch)).toEqual({
      docsearch: {
        ...DEFAULT_CONFIG,
        ...minimalDocSearchConfig,
      },
    });
  });

  describe('replaceSearchResultPathname', () => {
    it('escapes from string', () => {
      const docsearch: DocSearchInput = {
        ...minimalDocSearchConfig,
        replaceSearchResultPathname: {
          from: '/docs/some-\\special-.[regexp]{chars*}',
          to: '/abc',
        },
      };

      expect(testValidateThemeConfig(docsearch)).toEqual({
        docsearch: {
          ...DEFAULT_CONFIG,
          ...docsearch,
          replaceSearchResultPathname: {
            from: '/docs/some\\x2d\\\\special\\x2d\\.\\[regexp\\]\\{chars\\*\\}',
            to: '/abc',
          },
        },
      });
    });

    it('converts from regexp to string', () => {
      const docsearch = {
        ...minimalDocSearchConfig,
        replaceSearchResultPathname: {
          from: /^\/docs\/(?:1\.0|next)/,
          to: '/abc',
        },
      } as unknown as DocSearchInput;

      expect(testValidateThemeConfig(docsearch)).toEqual({
        docsearch: {
          ...DEFAULT_CONFIG,
          ...minimalDocSearchConfig,
          replaceSearchResultPathname: {
            from: '^\\/docs\\/(?:1\\.0|next)',
            to: '/abc',
          },
        },
      });
    });
  });

  describe('askAi config validation', () => {
    it('accepts object-only Agent Studio config without dynamic indices', () => {
      const docsearch: DocSearchInput = {
        ...minimalDocSearchConfig,
        askAi: minimalAskAiConfig,
      };

      expect(testValidateThemeConfig(docsearch)).toEqual({
        docsearch: {
          ...DEFAULT_CONFIG,
          ...docsearch,
        },
      });
    });

    it('accepts Agent Studio index searchParameters', () => {
      const docsearch: DocSearchInput = {
        ...minimalDocSearchConfig,
        askAi: {
          ...askAiConfigWithIndices,
          indices: [
            {
              index: 'markdown-index',
              description: 'Documentation content.',
              searchParameters: {
                facetFilters: ['language:en', 'version:1.0'],
              },
            },
          ],
        },
      };

      expect(testValidateThemeConfig(docsearch)).toEqual({
        docsearch: {
          ...DEFAULT_CONFIG,
          ...docsearch,
        },
      });
    });

    it('accepts top-level sidePanel as true', () => {
      const docsearch: DocSearchInput = {
        ...minimalDocSearchConfig,
        askAi: minimalAskAiConfig,
        sidePanel: true,
      };

      expect(testValidateThemeConfig(docsearch)).toEqual({
        docsearch: {
          ...DEFAULT_CONFIG,
          ...docsearch,
        },
      });
    });

    it('accepts top-level sidePanel as an options object', () => {
      const docsearch: DocSearchInput = {
        ...minimalDocSearchConfig,
        askAi: minimalAskAiConfig,
        sidePanel: {
          variant: 'inline',
          side: 'left',
          width: 420,
          expandedWidth: '60vw',
          pushSelector: '#__docusaurus',
          hideButton: true,
          keyboardShortcuts: {
            'Ctrl/Cmd+I': false,
          },
        },
      };

      expect(testValidateThemeConfig(docsearch)).toEqual({
        docsearch: {
          ...DEFAULT_CONFIG,
          ...docsearch,
        },
      });
    });

    it('accepts sidePanel Agent Studio indices', () => {
      const docsearch: DocSearchInput = {
        ...minimalDocSearchConfig,
        askAi: minimalAskAiConfig,
        sidePanel: {
          indices: [
            {
              index: 'sidepanel-markdown-index',
              description: 'Documentation content for the side panel.',
            },
          ],
        },
      };

      expect(testValidateThemeConfig(docsearch)).toEqual({
        docsearch: {
          ...DEFAULT_CONFIG,
          ...docsearch,
        },
      });
    });

    it('rejects empty sidePanel Agent Studio indices', () => {
      const docsearch = {
        ...minimalDocSearchConfig,
        askAi: minimalAskAiConfig,
        sidePanel: {
          indices: [],
        },
      } as unknown as DocSearchInput;

      expectThrowMessage(
        () => testValidateThemeConfig(docsearch),
        '"docsearch.sidePanel.indices" must contain at least 1 items',
      );
    });

    it('rejects incomplete sidePanel Agent Studio indices', () => {
      const docsearch = {
        ...minimalDocSearchConfig,
        askAi: minimalAskAiConfig,
        sidePanel: {
          indices: [{ index: 'sidepanel-markdown-index' }],
        },
      } as unknown as DocSearchInput;

      expectThrowMessage(
        () => testValidateThemeConfig(docsearch),
        '"docsearch.sidePanel.indices[0].description" is required',
      );
    });

    it('rejects sidePanel without askAi', () => {
      const docsearch: DocSearchInput = {
        ...minimalDocSearchConfig,
        sidePanel: true,
      };

      expectThrowMessage(
        () => testValidateThemeConfig(docsearch),
        '`themeConfig.docsearch.sidePanel` requires `themeConfig.docsearch.askAi`.',
      );
    });

    it('accepts askAi memory object', () => {
      const docsearch: DocSearchInput = {
        ...minimalDocSearchConfig,
        askAi: {
          ...minimalAskAiConfig,
          memory: {
            enabled: true,
            userToken: 'b2916249-b172-4ca2-8d0f-663e0f37f85d',
          },
        },
        sidePanel: {
          variant: 'inline',
          side: 'left',
          width: 420,
          expandedWidth: '60vw',
          pushSelector: '#__docusaurus',
          hideButton: true,
          keyboardShortcuts: {
            'Ctrl/Cmd+I': false,
          },
        },
      };

      expect(testValidateThemeConfig(docsearch)).toEqual({
        docsearch: {
          ...DEFAULT_CONFIG,
          ...docsearch,
        },
      });
    });

    it('accepts askAi promptSuggestions object', () => {
      const docsearch: DocSearchInput = {
        ...minimalDocSearchConfig,
        askAi: {
          ...minimalAskAiConfig,
          promptSuggestions: {
            indexName: 'test-index',
            hitsPerPage: 7,
          },
        },
        sidePanel: {
          variant: 'inline',
          side: 'left',
          width: 420,
          expandedWidth: '60vw',
          pushSelector: '#__docusaurus',
          hideButton: true,
          keyboardShortcuts: {
            'Ctrl/Cmd+I': false,
          },
        },
      };

      expect(testValidateThemeConfig(docsearch)).toEqual({
        docsearch: {
          ...DEFAULT_CONFIG,
          ...docsearch,
        },
      });
    });

    it('rejects askAi custom tools definitions', () => {
      const docsearch = {
        ...minimalDocSearchConfig,
        askAi: {
          ...minimalAskAiConfig,
          tools: {},
        },
      } as unknown as DocSearchInput;

      expectThrowMessage(
        () => testValidateThemeConfig(docsearch),
        '`themeConfig.docsearch.askAi.tools` is not supported because Docusaurus removes function values',
      );
    });

    it('rejects sidePanel custom tools definitions', () => {
      const docsearch = {
        ...minimalDocSearchConfig,
        askAi: minimalAskAiConfig,
        sidePanel: {
          tools: {},
        },
      } as unknown as DocSearchInput;

      expectThrowMessage(
        () => testValidateThemeConfig(docsearch),
        '`themeConfig.docsearch.sidePanel.tools` is not supported because Docusaurus removes function values',
      );
    });
  });

  describe('removed config migration errors', () => {
    it('rejects themeConfig.algolia', () => {
      expectThrowMessage(
        () =>
          testValidateThemeConfigWithUserThemeConfig({
            algolia: minimalDocSearchConfig,
          } as unknown as UserThemeConfig),
        '`themeConfig.algolia` is no longer supported',
      );
    });

    it('rejects indexName', () => {
      const docsearch = {
        ...minimalDocSearchConfig,
        indexName: 'index',
      } as unknown as DocSearchInput;

      expectThrowMessage(() => testValidateThemeConfig(docsearch), '`themeConfig.docsearch.indexName` was removed');
    });

    it('rejects top-level searchParameters', () => {
      const docsearch = {
        ...minimalDocSearchConfig,
        searchParameters: {
          facetFilters: ['language:en'],
        },
      } as unknown as DocSearchInput;

      expectThrowMessage(
        () => testValidateThemeConfig(docsearch),
        '`themeConfig.docsearch.searchParameters` was removed',
      );
    });

    it('rejects searchPagePath', () => {
      const docsearch = {
        ...minimalDocSearchConfig,
        searchPagePath: 'search',
      } as unknown as DocSearchInput;

      expectThrowMessage(
        () => testValidateThemeConfig(docsearch),
        '`themeConfig.docsearch.searchPagePath` was removed',
      );
    });

    it('rejects askAi string shorthand', () => {
      const docsearch = {
        ...minimalDocSearchConfig,
        askAi: 'my-assistant-id',
      } as unknown as DocSearchInput;

      expectThrowMessage(() => testValidateThemeConfig(docsearch), '`themeConfig.docsearch.askAi` must be an object');
    });

    it('rejects askAi.agentStudio', () => {
      const docsearch = {
        ...minimalDocSearchConfig,
        askAi: {
          ...minimalAskAiConfig,
          agentStudio: true,
        },
      } as unknown as DocSearchInput;

      expectThrowMessage(
        () => testValidateThemeConfig(docsearch),
        '`themeConfig.docsearch.askAi.agentStudio` was removed',
      );
    });

    it('rejects Ask AI credential overrides', () => {
      const docsearch = {
        ...minimalDocSearchConfig,
        askAi: {
          ...minimalAskAiConfig,
          indexName: 'ai-index',
          apiKey: 'ai-api-key',
          appId: 'AIAPPID',
        },
      } as unknown as DocSearchInput;

      expectThrowMessage(
        () => testValidateThemeConfig(docsearch),
        '`themeConfig.docsearch.askAi.indexName`, `apiKey`, and `appId` were removed',
      );
    });

    it('rejects askAi.sidePanel', () => {
      const docsearch = {
        ...minimalDocSearchConfig,
        askAi: {
          ...minimalAskAiConfig,
          sidePanel: true,
        },
      } as unknown as DocSearchInput;

      expectThrowMessage(
        () => testValidateThemeConfig(docsearch),
        '`themeConfig.docsearch.askAi.sidePanel` was removed',
      );
    });
  });
});
