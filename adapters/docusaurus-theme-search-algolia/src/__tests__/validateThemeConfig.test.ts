/**
 * Copyright (c) Facebook, Inc. And its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { ThemeConfig, UserThemeConfig } from '@docsearch/docusaurus-adapter';
import type Joi from 'joi';

import { DEFAULT_CONFIG, validateThemeConfig } from '../validateThemeConfig';

// mock DocSearch to a v4.5 version to allow AskAI sidepanel tests to pass
jest.mock('@docsearch/react', () => ({ version: '4.5.3' }));

type AlgoliaInput = UserThemeConfig['algolia'];
type DocSearchInput = UserThemeConfig['docsearch'];

function testValidateThemeConfigWithUserThemeConfig(themeConfig: UserThemeConfig) {
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

function testValidateThemeConfig(algolia: AlgoliaInput) {
  return testValidateThemeConfigWithUserThemeConfig(algolia ? { algolia } : {});
}

function testValidateThemeConfigDocSearch(docsearch: DocSearchInput) {
  return testValidateThemeConfigWithUserThemeConfig(docsearch ? { docsearch } : {});
}

describe('validateThemeConfig', () => {
  it('minimal config', () => {
    const algolia: AlgoliaInput = {
      indexName: 'index',
      apiKey: 'apiKey',
      appId: 'BH4D9OD16A',
    };
    expect(testValidateThemeConfig(algolia)).toEqual({
      algolia: {
        ...DEFAULT_CONFIG,
        ...algolia,
      },
    });
  });

  it('unknown attributes', () => {
    const algolia: AlgoliaInput = {
      indexName: 'index',
      apiKey: 'apiKey',
      // @ts-expect-error: expected type error!
      unknownKey: 'unknownKey',
      appId: 'BH4D9OD16A',
    };
    expect(testValidateThemeConfig(algolia)).toEqual({
      algolia: {
        ...DEFAULT_CONFIG,
        ...algolia,
      },
    });
  });

  it('undefined config', () => {
    const algolia = undefined;
    expect(() => testValidateThemeConfig(algolia)).toThrowErrorMatchingInlineSnapshot(
      `""themeConfig.algolia" is required"`,
    );
  });

  it('empty config', () => {
    expect(() =>
      testValidateThemeConfig(
        // @ts-expect-error: expected type error!
        {},
      ),
    ).toThrowErrorMatchingInlineSnapshot(
      `""algolia.appId" is required. If you haven't migrated to the new DocSearch infra, please refer to the blog post for instructions: https://docusaurus.io/blog/2021/11/21/algolia-docsearch-migration"`,
    );
  });

  it('missing indexName config', () => {
    // @ts-expect-error: expected type error!
    const algolia: AlgoliaInput = {
      apiKey: 'apiKey',
      appId: 'BH4D9OD16A',
    };
    expect(() => testValidateThemeConfig(algolia)).toThrowErrorMatchingInlineSnapshot(
      `""algolia.indexName" is required"`,
    );
  });

  it('missing apiKey config', () => {
    // @ts-expect-error: expected type error!
    const algolia: AlgoliaInput = {
      indexName: 'indexName',
      appId: 'BH4D9OD16A',
    };
    expect(() => testValidateThemeConfig(algolia)).toThrowErrorMatchingInlineSnapshot(`""algolia.apiKey" is required"`);
  });

  it('missing appId config', () => {
    // @ts-expect-error: expected type error!
    const algolia: AlgoliaInput = {
      indexName: 'indexName',
      apiKey: 'apiKey',
    };
    expect(() => testValidateThemeConfig(algolia)).toThrowErrorMatchingInlineSnapshot(
      `""algolia.appId" is required. If you haven't migrated to the new DocSearch infra, please refer to the blog post for instructions: https://docusaurus.io/blog/2021/11/21/algolia-docsearch-migration"`,
    );
  });

  it('contextualSearch config', () => {
    const algolia: AlgoliaInput = {
      appId: 'BH4D9OD16A',
      indexName: 'index',
      apiKey: 'apiKey',
      contextualSearch: true,
    };
    expect(testValidateThemeConfig(algolia)).toEqual({
      algolia: {
        ...DEFAULT_CONFIG,
        ...algolia,
      },
    });
  });

  it('externalUrlRegex config', () => {
    const algolia: AlgoliaInput = {
      appId: 'BH4D9OD16A',
      indexName: 'index',
      apiKey: 'apiKey',
      externalUrlRegex: 'http://external-domain.com',
    };
    expect(testValidateThemeConfig(algolia)).toEqual({
      algolia: {
        ...DEFAULT_CONFIG,
        ...algolia,
      },
    });
  });

  describe('replaceSearchResultPathname', () => {
    it('escapes from string', () => {
      const algolia: AlgoliaInput = {
        appId: 'BH4D9OD16A',
        indexName: 'index',
        apiKey: 'apiKey',
        replaceSearchResultPathname: {
          from: '/docs/some-\\special-.[regexp]{chars*}',
          to: '/abc',
        },
      };
      expect(testValidateThemeConfig(algolia)).toEqual({
        algolia: {
          ...DEFAULT_CONFIG,
          ...algolia,
          replaceSearchResultPathname: {
            from: '/docs/some\\x2d\\\\special\\x2d\\.\\[regexp\\]\\{chars\\*\\}',
            to: '/abc',
          },
        },
      });
    });

    it('converts from regexp to string', () => {
      const algolia: AlgoliaInput = {
        appId: 'BH4D9OD16A',
        indexName: 'index',
        apiKey: 'apiKey',
        replaceSearchResultPathname: {
          // @ts-expect-error: test regexp input
          from: /^\/docs\/(?:1\.0|next)/,
          to: '/abc',
        },
      };

      expect(testValidateThemeConfig(algolia)).toEqual({
        algolia: {
          ...DEFAULT_CONFIG,
          ...algolia,
          replaceSearchResultPathname: {
            from: '^\\/docs\\/(?:1\\.0|next)',
            to: '/abc',
          },
        },
      });
    });
  });

  it('searchParameters.facetFilters search config', () => {
    const algolia: AlgoliaInput = {
      appId: 'BH4D9OD16A',
      indexName: 'index',
      apiKey: 'apiKey',
      searchParameters: {
        facetFilters: ['version:1.0'],
      },
    };
    expect(testValidateThemeConfig(algolia)).toEqual({
      algolia: {
        ...DEFAULT_CONFIG,
        ...algolia,
      },
    });
  });

  describe('askAi config validation', () => {
    it('accepts string format (assistantId)', () => {
      const algolia: AlgoliaInput = {
        appId: 'BH4D9OD16A',
        indexName: 'index',
        apiKey: 'apiKey',
        askAi: 'my-assistant-id',
      };
      expect(testValidateThemeConfig(algolia)).toEqual({
        algolia: {
          ...DEFAULT_CONFIG,
          ...algolia,
          askAi: {
            assistantId: 'my-assistant-id',
            indexName: algolia.indexName,
            apiKey: algolia.apiKey,
            appId: algolia.appId,
          },
        },
      });
    });

    it('accepts minimal object format', () => {
      const algolia: AlgoliaInput = {
        appId: 'BH4D9OD16A',
        indexName: 'index',
        apiKey: 'apiKey',
        askAi: {
          assistantId: 'my-assistant-id',
        },
      };
      expect(testValidateThemeConfig(algolia)).toEqual({
        algolia: {
          ...DEFAULT_CONFIG,
          ...algolia,
          askAi: {
            assistantId: 'my-assistant-id',
            indexName: algolia.indexName,
            apiKey: algolia.apiKey,
            appId: algolia.appId,
          },
        },
      });
    });

    it('accepts sidePanel as true', () => {
      const algolia: AlgoliaInput = {
        appId: 'BH4D9OD16A',
        indexName: 'index',
        apiKey: 'apiKey',
        askAi: {
          assistantId: 'my-assistant-id',
          sidePanel: true,
        },
      };
      expect(testValidateThemeConfig(algolia)).toEqual({
        algolia: {
          ...DEFAULT_CONFIG,
          ...algolia,
          askAi: {
            assistantId: 'my-assistant-id',
            indexName: algolia.indexName,
            apiKey: algolia.apiKey,
            appId: algolia.appId,
            sidePanel: true,
          },
        },
      });
    });

    it('accepts sidePanel as object', () => {
      const algolia: AlgoliaInput = {
        appId: 'BH4D9OD16A',
        indexName: 'index',
        apiKey: 'apiKey',
        askAi: {
          assistantId: 'my-assistant-id',
          sidePanel: {
            keyboardShortcuts: {
              'Ctrl/Cmd+I': false,
            },
            variant: 'inline',
            side: 'left',
            width: '420px',
            expandedWidth: 640,
            pushSelector: '#__docusaurus',
          },
        },
      };
      const sidePanelValue = (
        (algolia as NonNullable<AlgoliaInput>).askAi as Exclude<NonNullable<AlgoliaInput>['askAi'], string>
      )?.sidePanel;
      expect(testValidateThemeConfig(algolia)).toEqual({
        algolia: {
          ...DEFAULT_CONFIG,
          ...algolia,
          askAi: {
            assistantId: 'my-assistant-id',
            indexName: algolia.indexName,
            apiKey: algolia.apiKey,
            appId: algolia.appId,
            sidePanel: sidePanelValue,
          },
        },
      });
    });

    it('accepts sidePanel.hideButton as true', () => {
      const algolia: AlgoliaInput = {
        appId: 'BH4D9OD16A',
        indexName: 'index',
        apiKey: 'apiKey',
        askAi: {
          assistantId: 'my-assistant-id',
          sidePanel: {
            hideButton: true,
          },
        },
      };
      expect(testValidateThemeConfig(algolia)).toEqual({
        algolia: {
          ...DEFAULT_CONFIG,
          ...algolia,
          askAi: {
            assistantId: 'my-assistant-id',
            indexName: algolia.indexName,
            apiKey: algolia.apiKey,
            appId: algolia.appId,
            sidePanel: {
              hideButton: true,
            },
          },
        },
      });
    });

    it('accepts full object format', () => {
      const algolia: AlgoliaInput = {
        appId: 'BH4D9OD16A',
        indexName: 'index',
        apiKey: 'apiKey',
        askAi: {
          indexName: 'ai-index',
          apiKey: 'ai-apiKey',
          appId: 'ai-appId',
          assistantId: 'my-assistant-id',
        },
      };
      expect(testValidateThemeConfig(algolia)).toEqual({
        algolia: {
          ...DEFAULT_CONFIG,
          ...algolia,
        },
      });
    });

    it('accepts agentStudio=true with per-index searchParameters', () => {
      const algolia: AlgoliaInput = {
        appId: 'BH4D9OD16A',
        indexName: 'index',
        apiKey: 'apiKey',
        askAi: {
          assistantId: 'my-assistant-id',
          agentStudio: true,
          searchParameters: {
            index: {
              distinct: false,
            },
          },
        },
      };
      expect(testValidateThemeConfig(algolia)).toEqual({
        algolia: {
          ...DEFAULT_CONFIG,
          ...algolia,
          askAi: {
            assistantId: 'my-assistant-id',
            indexName: algolia.indexName,
            apiKey: algolia.apiKey,
            appId: algolia.appId,
            agentStudio: true,
            searchParameters: {
              index: {
                distinct: false,
              },
            },
          },
        },
      });
    });

    it('rejects invalid type', () => {
      const algolia: AlgoliaInput = {
        appId: 'BH4D9OD16A',
        indexName: 'index',
        apiKey: 'apiKey',
        // @ts-expect-error: expected type error
        askAi: 123, // Invalid: should be string or object
      };
      expect(() => testValidateThemeConfig(algolia)).toThrowErrorMatchingInlineSnapshot(
        `"askAi must be either a string (assistantId) or an object with indexName, apiKey, appId, and assistantId"`,
      );
    });

    it('rejects empty askAi', () => {
      const algolia: AlgoliaInput = {
        appId: 'BH4D9OD16A',
        indexName: 'index',
        apiKey: 'apiKey',
        // @ts-expect-error: expected type error: missing mandatory fields
        askAi: {},
      };
      expect(() => testValidateThemeConfig(algolia)).toThrowErrorMatchingInlineSnapshot(
        `""algolia.askAi.assistantId" is required"`,
      );
    });

    it('accepts undefined askAi', () => {
      const algolia: AlgoliaInput = {
        appId: 'BH4D9OD16A',
        indexName: 'index',
        apiKey: 'apiKey',
      };
      expect(testValidateThemeConfig(algolia)).toEqual({
        algolia: {
          ...DEFAULT_CONFIG,
          ...algolia,
        },
      });
    });

    describe('Ask AI search parameters', () => {
      it('accepts Ask AI facet filters', () => {
        const algolia = {
          appId: 'BH4D9OD16A',
          indexName: 'index',
          apiKey: 'apiKey',
          askAi: {
            indexName: 'ai-index',
            apiKey: 'ai-apiKey',
            appId: 'ai-appId',
            assistantId: 'my-assistant-id',
            searchParameters: {
              facetFilters: ['version:1.0'],
            },
          },
        } satisfies AlgoliaInput;

        expect(testValidateThemeConfig(algolia)).toEqual({
          algolia: {
            ...DEFAULT_CONFIG,
            ...algolia,
          },
        });
      });

      it('accepts distinct Ask AI / algolia facet filters', () => {
        const algolia = {
          appId: 'BH4D9OD16A',
          indexName: 'index',
          apiKey: 'apiKey',
          searchParameters: {
            facetFilters: ['version:algolia'],
          },
          askAi: {
            indexName: 'ai-index',
            apiKey: 'ai-apiKey',
            appId: 'ai-appId',
            assistantId: 'my-assistant-id',
            searchParameters: {
              facetFilters: ['version:askAi'],
            },
          },
        } satisfies AlgoliaInput;

        expect(testValidateThemeConfig(algolia)).toEqual({
          algolia: {
            ...DEFAULT_CONFIG,
            ...algolia,
          },
        });
      });

      it('falls back to algolia facet filters', () => {
        const algolia = {
          appId: 'BH4D9OD16A',
          indexName: 'index',
          apiKey: 'apiKey',
          searchParameters: {
            facetFilters: ['version:1.0'],
          },
          askAi: {
            indexName: 'ai-index',
            apiKey: 'ai-apiKey',
            appId: 'ai-appId',
            assistantId: 'my-assistant-id',
            searchParameters: {},
          },
        } satisfies AlgoliaInput;

        expect(testValidateThemeConfig(algolia)).toEqual({
          algolia: {
            ...DEFAULT_CONFIG,
            ...algolia,
            askAi: {
              ...algolia.askAi,
              searchParameters: {
                facetFilters: ['version:1.0'],
              },
            },
          },
        });
      });

      it('falls back to algolia facet filters with AskAI string format (assistantId)', () => {
        const algolia = {
          appId: 'BH4D9OD16A',
          indexName: 'index',
          apiKey: 'apiKey',
          searchParameters: {
            facetFilters: ['version:1.0'],
          },
          askAi: 'my-assistant-id',
        } satisfies AlgoliaInput;

        expect(testValidateThemeConfig(algolia)).toEqual({
          algolia: {
            ...DEFAULT_CONFIG,
            ...algolia,
            askAi: {
              indexName: algolia.indexName,
              apiKey: algolia.apiKey,
              appId: algolia.appId,
              assistantId: 'my-assistant-id',
              searchParameters: {
                facetFilters: ['version:1.0'],
              },
            },
          },
        });
      });
    });

    describe('Ask AI suggestedQuestions', () => {
      it('accepts suggestedQuestions as true', () => {
        const algolia = {
          appId: 'BH4D9OD16A',
          indexName: 'index',
          apiKey: 'apiKey',
          askAi: {
            assistantId: 'my-assistant-id',
            suggestedQuestions: true,
          },
        } satisfies AlgoliaInput;

        expect(testValidateThemeConfig(algolia)).toEqual({
          algolia: {
            ...DEFAULT_CONFIG,
            ...algolia,
            askAi: {
              indexName: algolia.indexName,
              apiKey: algolia.apiKey,
              appId: algolia.appId,
              assistantId: 'my-assistant-id',
              suggestedQuestions: true,
            },
          },
        });
      });

      it('accepts suggestedQuestions as false', () => {
        const algolia = {
          appId: 'BH4D9OD16A',
          indexName: 'index',
          apiKey: 'apiKey',
          askAi: {
            assistantId: 'my-assistant-id',
            suggestedQuestions: false,
          },
        } satisfies AlgoliaInput;

        expect(testValidateThemeConfig(algolia)).toEqual({
          algolia: {
            ...DEFAULT_CONFIG,
            ...algolia,
            askAi: {
              indexName: algolia.indexName,
              apiKey: algolia.apiKey,
              appId: algolia.appId,
              assistantId: 'my-assistant-id',
              suggestedQuestions: false,
            },
          },
        });
      });

      it('rejects invalid suggestedQuestions type', () => {
        const algolia: AlgoliaInput = {
          appId: 'BH4D9OD16A',
          indexName: 'index',
          apiKey: 'apiKey',
          askAi: {
            assistantId: 'my-assistant-id',
            // @ts-expect-error: expected type error
            suggestedQuestions: 'invalid-string',
          },
        };
        expect(() => testValidateThemeConfig(algolia)).toThrowErrorMatchingInlineSnapshot(
          `""algolia.askAi.suggestedQuestions" must be a boolean"`,
        );
      });

      it('rejects suggestedQuestions as number', () => {
        const algolia: AlgoliaInput = {
          appId: 'BH4D9OD16A',
          indexName: 'index',
          apiKey: 'apiKey',
          askAi: {
            assistantId: 'my-assistant-id',
            // @ts-expect-error: expected type error
            suggestedQuestions: 123,
          },
        };
        expect(() => testValidateThemeConfig(algolia)).toThrowErrorMatchingInlineSnapshot(
          `""algolia.askAi.suggestedQuestions" must be a boolean"`,
        );
      });
    });
  });

  describe('theme config keys', () => {
    it('accepts themeConfig.docsearch (preferred)', () => {
      const docsearch: DocSearchInput = {
        appId: 'BH4D9OD16A',
        indexName: 'index',
        apiKey: 'apiKey',
      };

      expect(testValidateThemeConfigDocSearch(docsearch)).toEqual({
        docsearch: {
          ...DEFAULT_CONFIG,
          ...docsearch,
        },
      });
    });

    it('rejects defining both themeConfig.docsearch and themeConfig.algolia', () => {
      const docsearch: DocSearchInput = {
        appId: 'BH4D9OD16A',
        indexName: 'index',
        apiKey: 'apiKey',
      };
      const algolia: AlgoliaInput = {
        appId: 'BH4D9OD16A',
        indexName: 'index',
        apiKey: 'apiKey',
      };

      expect(() =>
        testValidateThemeConfigWithUserThemeConfig({
          docsearch,
          algolia,
        }),
      ).toThrowErrorMatchingInlineSnapshot(
        `"Please provide either \\"themeConfig.docsearch\\" (preferred) or \\"themeConfig.algolia\\" (legacy), but not both."`,
      );
    });
  });
});
