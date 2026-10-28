/// <reference types="@astrojs/starlight" />

declare module 'virtual:docsearch-starlight-config' {
  const config: import('./index.js').StarlightDocSearchOptions;
  export default config;
}
