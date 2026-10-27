import type { StarlightPlugin } from '@astrojs/starlight/types';

export default function docsearch(): StarlightPlugin {
  return {
    name: '@docsearch/starlight-adapter',
    hooks: {
      'config:setup'({ logger }) {
        logger.info('DocSearch adapter loaded');
      },
    },
  };
}