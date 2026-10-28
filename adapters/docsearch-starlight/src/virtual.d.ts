/// <reference types="@astrojs/starlight" />

declare module 'virtual:docsearch-starlight-config' {
  import type { StarlightDocSearchOptions } from '@docsearch/starlight-adapter';

  const config: StarlightDocSearchOptions;
  export default config;
}
