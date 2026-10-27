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
      'config:setup'({ addIntegration, logger }) {
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
        logger.info('DocSearch adapter loaded');
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