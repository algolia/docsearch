import type { StarlightPlugin } from '@astrojs/starlight/types';
import type { DocSearchProps } from '@docsearch/js/docsearch';
import type { ViteUserConfig } from 'astro';

const CONFIG_MODULE_ID = 'virtual:docsearch-starlight-config';
const RESOLVED_CONFIG_MODULE_ID = `\0${CONFIG_MODULE_ID}`;

export type StarlightDocSearchOptions = Pick<
  DocSearchProps,
  'appId' | 'apiKey' | 'placeholder' | 'translations'
> & {
  indices: NonNullable<DocSearchProps['indices']>;
};


export default function docsearch(options: StarlightDocSearchOptions): StarlightPlugin {
  return {
    name: '@docsearch/starlight-adapter',
    hooks: {
      'config:setup'({ addIntegration, config, logger, updateConfig }) {
        logger.info('DocSearch adapter loaded');

        /* Check if the user has already defined a custom Search component. If so, warn them.
          Otherwise, update the config to use the DocSearch Search component. */
        if (config.components?.Search) {
          logger.warn(
            'An existing Search override was preserved. Remove components.Search to render DocSearch.'
          );
        } else {
          logger.warn(
            'No custom Search component found. Using DocSearch Search component.'
          );

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
            'astro:config:setup'({ updateConfig }) {
              updateConfig({
                vite: {
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
      if (id === CONFIG_MODULE_ID) return RESOLVED_CONFIG_MODULE_ID;
    },
    load(id) {
      if (id === RESOLVED_CONFIG_MODULE_ID) return moduleSource;
    },
  };
}