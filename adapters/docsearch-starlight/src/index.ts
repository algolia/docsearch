import type { StarlightPlugin } from '@astrojs/starlight/types';
import type { DocSearchProps } from '@docsearch/js/docsearch';
import type { ViteUserConfig } from 'astro';

import { validateOptions } from './config.js';

const CONFIG_MODULE_ID = 'virtual:docsearch-starlight-config';
const RESOLVED_CONFIG_MODULE_ID = `\0${CONFIG_MODULE_ID}`;

export type StarlightDocSearchOptions = Pick<
  DocSearchProps,
  'appId' | 'apiKey' | 'placeholder' | 'translations'
> & {
  indices: NonNullable<DocSearchProps['indices']>;
};

export default function docsearch(
  options: StarlightDocSearchOptions
): StarlightPlugin {
  validateOptions(options);

  return {
    name: '@docsearch/starlight-adapter',
    hooks: {
      'config:setup'({ addIntegration, config, logger, updateConfig }) {
        if (config.components?.Search) {
          logger.warn(
            'An existing Search override was preserved. Remove components.Search to render DocSearch.'
          );
        } else {
          updateConfig({
            pagefind: false,
            components: {
              ...config.components,
              Search: '@docsearch/starlight-adapter/Search.astro',
            },
          });
        }

        addIntegration({
          name: '@docsearch/starlight-adapter',
          hooks: {
            'astro:config:setup'({ updateConfig: updateAstroConfig }) {
              updateAstroConfig({
                vite: {
                  ssr: {
                    noExternal: ['@docsearch/css'],
                  },
                  plugins: [vitePluginDocSearch(options)],
                },
              });
            },
          },
        });
      },
    },
  };
}

/** Vite plugin that exposes the DocSearch config via virtual modules. */
function vitePluginDocSearch(
  options: StarlightDocSearchOptions
): NonNullable<ViteUserConfig['plugins']>[number] {
  const { appId, apiKey, indices, placeholder, translations } = options;
  const moduleSource = `export default ${JSON.stringify({
    appId,
    apiKey,
    indices,
    placeholder,
    translations,
  })};`;

  return {
    name: 'vite-plugin-docsearch-starlight-config',
    resolveId(id) {
      return id === CONFIG_MODULE_ID ? RESOLVED_CONFIG_MODULE_ID : undefined;
    },
    load(id) {
      return id === RESOLVED_CONFIG_MODULE_ID ? moduleSource : undefined;
    },
  };
}
